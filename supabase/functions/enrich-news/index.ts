import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const ALLOWED_ORIGINS = ["https://toolsnocode.com", "http://localhost:5173", "http://localhost:4173"];

function getCorsHeaders(req: Request) {
  const origin = req.headers.get("Origin") ?? "";
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
  };
}

function extractMetaTag(html: string, ...attrs: string[]): string | null {
  for (const attr of attrs) {
    const match =
      html.match(new RegExp(`<meta[^>]+${attr}[^>]+content=["']([^"']+)["']`, "i")) ??
      html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+${attr}`, "i"));
    if (match) return match[1];
  }
  return null;
}

function extractImage(html: string): string | null {
  const og = extractMetaTag(html, 'property="og:image"', "property='og:image'");
  if (og && og.startsWith("http")) return og;
  const tw = extractMetaTag(html, 'name="twitter:image"', "name='twitter:image'");
  if (tw && tw.startsWith("http")) return tw;
  return null;
}

function stripTags(html: string): string {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, "")
    .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, "")
    .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, "")
    .replace(/<aside[^>]*>[\s\S]*?<\/aside>/gi, "")
    .replace(/<figure[^>]*>[\s\S]*?<\/figure>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s{3,}/g, "\n\n")
    .trim();
}

function extractMainContent(html: string): string {
  const articleMatch = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
  if (articleMatch) return stripTags(articleMatch[1]);
  const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  if (mainMatch) return stripTags(mainMatch[1]);
  return stripTags(html).slice(0, 5000);
}

async function rewriteWithOpenAI(
  title: string,
  summary: string,
  rawContent: string,
  category: string,
  apiKey: string
): Promise<string> {
  const prompt = `You are an editor for ToolsNoCode, a website about AI and no-code tools.
Rewrite the following news article in a clear, engaging, informative style for a tech-savvy but non-developer audience.

Title: ${title}
Category: ${category}
Summary: ${summary}
Raw content: ${rawContent.slice(0, 3000)}

Instructions:
- Write 3-5 solid paragraphs covering the key facts, context, and why it matters
- Do NOT use markdown headers, bullet points, or formatting — plain paragraphs only
- Be factual, concise, and professional
- Do not mention "ToolsNoCode" in the article body

Write only the article paragraphs, nothing else.`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 800,
      temperature: 0.6,
    }),
  });

  if (!res.ok) throw new Error(`OpenAI error: ${res.status}`);
  const data = await res.json();
  return data.choices[0].message.content.trim();
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: getCorsHeaders(req) });
  }

  try {
    const { newsId } = await req.json();

    if (!newsId || typeof newsId !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(newsId)) {
      return new Response(JSON.stringify({ error: "Valid newsId (UUID) is required" }), {
        status: 400,
        headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: article, error: fetchError } = await supabase
      .from("news")
      .select("id, url, title, summary, image_url, content, source, category")
      .eq("id", newsId)
      .maybeSingle();

    if (fetchError || !article) {
      return new Response(JSON.stringify({ error: "Article not found" }), {
        status: 404,
        headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
      });
    }

    if (article.content && article.image_url) {
      return new Response(JSON.stringify({ already_enriched: true }), {
        status: 200,
        headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
      });
    }

    let html = "";
    try {
      const urlObj = new URL(article.url);
      if (!["http:", "https:"].includes(urlObj.protocol)) throw new Error("Invalid protocol");
      const hostname = urlObj.hostname;
      if (/^(127\.|10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.|169\.254\.|0\.|localhost|::1|\[::1\])/.test(hostname)) {
        throw new Error("Private IP");
      }
      const response = await fetch(article.url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; ToolsNoCode/1.0)",
          "Accept": "text/html,application/xhtml+xml",
          "Accept-Language": "en-US,en;q=0.9",
        },
        signal: AbortSignal.timeout(10000),
      });
      if (response.ok) html = await response.text();
    } catch {
      // silently continue
    }

    const updates: Record<string, string> = {};

    if (!article.image_url && html) {
      const image = extractImage(html);
      if (image) updates.image_url = image;
    }

    if (!article.content) {
      const rawContent = html ? extractMainContent(html) : "";
      const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

      if (OPENAI_API_KEY && (rawContent.length > 100 || article.summary)) {
        try {
          const rewritten = await rewriteWithOpenAI(
            article.title,
            article.summary ?? "",
            rawContent,
            article.category ?? "AI Models",
            OPENAI_API_KEY
          );
          if (rewritten) updates.content = rewritten;
        } catch {
          if (rawContent.length > 50) updates.content = rawContent.slice(0, 4000);
          else if (article.summary) updates.content = article.summary;
        }
      } else if (rawContent.length > 50) {
        updates.content = rawContent.slice(0, 4000);
      } else if (article.summary) {
        updates.content = article.summary;
      }
    }

    if (Object.keys(updates).length > 0) {
      await supabase.from("news").update(updates).eq("id", newsId);
    }

    return new Response(
      JSON.stringify({ success: true, updates: Object.keys(updates) }),
      {
        status: 200,
        headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("enrich-news error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
      }
    );
  }
});
