import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const CATEGORIES: Record<string, string[]> = {
  "AI Models": [
    "GPT OpenAI model release",
    "Claude Anthropic AI model",
    "Gemini Google AI release",
    "LLM large language model launch",
    "AI model benchmark 2025",
  ],
  "No-Code Tools": [
    "no-code tool launch 2025",
    "nocode platform update",
    "bubble webflow framer update",
    "low code platform release",
    "make zapier automation update",
  ],
  "Industry": [
    "AI startup funding 2025",
    "artificial intelligence acquisition",
    "AI company investment round",
  ],
  "Research": [
    "AI research paper breakthrough",
    "machine learning research 2025",
    "AI safety alignment research",
  ],
  "Policy": [
    "AI regulation policy 2025",
    "artificial intelligence law government",
    "AI ethics policy regulation",
  ],
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80)
    .replace(/-$/, "");
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

async function fetchArticleData(url: string): Promise<{ image: string | null; rawContent: string }> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; ToolsNoCode/1.0)",
        "Accept": "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return { image: null, rawContent: "" };
    const html = await res.text();
    return {
      image: extractImage(html),
      rawContent: extractMainContent(html),
    };
  } catch {
    return { image: null, rawContent: "" };
  }
}

async function rewriteWithOpenAI(
  title: string,
  summary: string,
  rawContent: string,
  category: string,
  apiKey: string
): Promise<{ rewrittenContent: string; tags: string[] }> {
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
- At the end, after a blank line, write exactly: TAGS: tag1, tag2, tag3, tag4, tag5
  (5 relevant short tags like: OpenAI, GPT-4o, multimodal, AI models, context window)

Write only the article text and the TAGS line, nothing else.`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 900,
      temperature: 0.6,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI error: ${err}`);
  }

  const data = await res.json();
  const text: string = data.choices[0].message.content.trim();

  const tagsMatch = text.match(/TAGS:\s*(.+)$/im);
  const tags = tagsMatch
    ? tagsMatch[1].split(",").map((t: string) => t.trim()).filter(Boolean).slice(0, 6)
    : [category];

  const content = text.replace(/TAGS:.*$/im, "").trim();

  return { rewrittenContent: content, tags };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  const NEWSAPI_KEY = Deno.env.get("NEWSAPI_KEY");
  const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

  if (!NEWSAPI_KEY || !OPENAI_API_KEY) {
    return new Response(JSON.stringify({ error: "Missing API keys" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const results: { saved: number; skipped: number; errors: string[] } = {
    saved: 0,
    skipped: 0,
    errors: [],
  };

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const fromDate = yesterday.toISOString().split("T")[0];

  const allArticles: Array<{ article: Record<string, string>; category: string }> = [];

  for (const [category, queries] of Object.entries(CATEGORIES)) {
    const query = queries[Math.floor(Math.random() * queries.length)];
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&from=${fromDate}&sortBy=publishedAt&language=en&pageSize=3&apiKey=${NEWSAPI_KEY}`;

    try {
      const res = await fetch(url);
      if (!res.ok) {
        results.errors.push(`NewsAPI error for ${category}: ${res.status}`);
        continue;
      }
      const data = await res.json();
      if (data.articles) {
        for (const a of data.articles) {
          if (a.url && !a.url.includes("[Removed]") && a.title && a.title !== "[Removed]") {
            allArticles.push({ article: a, category });
          }
        }
      }
    } catch (e) {
      results.errors.push(`Fetch error for ${category}: ${String(e)}`);
    }
  }

  for (const { article, category } of allArticles) {
    try {
      const { data: existing } = await supabase
        .from("news")
        .select("id")
        .eq("url", article.url)
        .maybeSingle();

      if (existing) {
        results.skipped++;
        continue;
      }

      const { image: scrapedImage, rawContent } = await fetchArticleData(article.url);

      const imageUrl = scrapedImage ?? article.urlToImage ?? null;

      const summary = article.description ?? article.content?.slice(0, 300) ?? "";

      const { rewrittenContent, tags } = await rewriteWithOpenAI(
        article.title,
        summary,
        rawContent || article.content || summary,
        category,
        OPENAI_API_KEY
      );

      const baseSlug = slugify(article.title);
      const uniqueSuffix = Date.now().toString(36).slice(-5);
      const slug = `${baseSlug}-${uniqueSuffix}`;

      const source =
        article.source?.name ??
        new URL(article.url).hostname.replace("www.", "");

      const publishedAt = article.publishedAt
        ? new Date(article.publishedAt).toISOString()
        : new Date().toISOString();

      const { error: insertError } = await supabase.from("news").insert({
        title: article.title,
        slug,
        summary,
        content: rewrittenContent,
        url: article.url,
        image_url: imageUrl,
        source,
        category,
        tags,
        published_at: publishedAt,
        is_featured: false,
      });

      if (insertError) {
        results.errors.push(`Insert error: ${insertError.message}`);
      } else {
        results.saved++;
      }

      await new Promise((r) => setTimeout(r, 500));
    } catch (e) {
      results.errors.push(`Processing error: ${String(e)}`);
    }
  }

  return new Response(JSON.stringify(results), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
