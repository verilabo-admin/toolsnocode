/*
  # Seed Relations Data

  Links experts to their tools and projects to the tools they used.
  Uses subqueries to resolve IDs by slug.
*/

-- Expert Tools Relations
INSERT INTO expert_tools (expert_id, tool_id, proficiency_level) VALUES

-- Maria Santos: Bubble, Webflow, Make
((SELECT id FROM experts WHERE slug = 'maria-santos'), (SELECT id FROM tools WHERE slug = 'bubble'), 'expert'),
((SELECT id FROM experts WHERE slug = 'maria-santos'), (SELECT id FROM tools WHERE slug = 'webflow'), 'advanced'),
((SELECT id FROM experts WHERE slug = 'maria-santos'), (SELECT id FROM tools WHERE slug = 'make'), 'intermediate'),

-- James Okafor: Make, n8n, ChatGPT
((SELECT id FROM experts WHERE slug = 'james-okafor'), (SELECT id FROM tools WHERE slug = 'make'), 'expert'),
((SELECT id FROM experts WHERE slug = 'james-okafor'), (SELECT id FROM tools WHERE slug = 'n8n'), 'advanced'),
((SELECT id FROM experts WHERE slug = 'james-okafor'), (SELECT id FROM tools WHERE slug = 'chatgpt'), 'advanced'),

-- Sophie Müller: Bubble, Cursor, GitHub Copilot
((SELECT id FROM experts WHERE slug = 'sophie-muller'), (SELECT id FROM tools WHERE slug = 'bubble'), 'expert'),
((SELECT id FROM experts WHERE slug = 'sophie-muller'), (SELECT id FROM tools WHERE slug = 'cursor'), 'advanced'),
((SELECT id FROM experts WHERE slug = 'sophie-muller'), (SELECT id FROM tools WHERE slug = 'github-copilot'), 'advanced'),

-- Carlos Rivera: ChatGPT, Claude, Jasper
((SELECT id FROM experts WHERE slug = 'carlos-rivera'), (SELECT id FROM tools WHERE slug = 'chatgpt'), 'expert'),
((SELECT id FROM experts WHERE slug = 'carlos-rivera'), (SELECT id FROM tools WHERE slug = 'claude'), 'advanced'),
((SELECT id FROM experts WHERE slug = 'carlos-rivera'), (SELECT id FROM tools WHERE slug = 'jasper'), 'advanced'),

-- Aisha Patel: Webflow, Figma, Canva
((SELECT id FROM experts WHERE slug = 'aisha-patel'), (SELECT id FROM tools WHERE slug = 'webflow'), 'expert'),
((SELECT id FROM experts WHERE slug = 'aisha-patel'), (SELECT id FROM tools WHERE slug = 'figma'), 'expert'),
((SELECT id FROM experts WHERE slug = 'aisha-patel'), (SELECT id FROM tools WHERE slug = 'canva'), 'advanced'),

-- Tom Bergmann: n8n, Make, ElevenLabs
((SELECT id FROM experts WHERE slug = 'tom-bergmann'), (SELECT id FROM tools WHERE slug = 'n8n'), 'expert'),
((SELECT id FROM experts WHERE slug = 'tom-bergmann'), (SELECT id FROM tools WHERE slug = 'make'), 'advanced'),
((SELECT id FROM experts WHERE slug = 'tom-bergmann'), (SELECT id FROM tools WHERE slug = 'elevenlabs'), 'intermediate'),

-- Yuki Tanaka: ChatGPT, Claude, GitHub Copilot
((SELECT id FROM experts WHERE slug = 'yuki-tanaka'), (SELECT id FROM tools WHERE slug = 'chatgpt'), 'expert'),
((SELECT id FROM experts WHERE slug = 'yuki-tanaka'), (SELECT id FROM tools WHERE slug = 'claude'), 'expert'),
((SELECT id FROM experts WHERE slug = 'yuki-tanaka'), (SELECT id FROM tools WHERE slug = 'github-copilot'), 'advanced'),

-- Fatima Al-Rashid: Bubble, Canva
((SELECT id FROM experts WHERE slug = 'fatima-al-rashid'), (SELECT id FROM tools WHERE slug = 'bubble'), 'advanced'),
((SELECT id FROM experts WHERE slug = 'fatima-al-rashid'), (SELECT id FROM tools WHERE slug = 'canva'), 'expert'),

-- Lucas Dubois: Notion AI, Perplexity AI
((SELECT id FROM experts WHERE slug = 'lucas-dubois'), (SELECT id FROM tools WHERE slug = 'notion-ai'), 'expert'),
((SELECT id FROM experts WHERE slug = 'lucas-dubois'), (SELECT id FROM tools WHERE slug = 'perplexity-ai'), 'advanced'),

-- Priya Sharma: Jasper, Copy.ai, Grammarly
((SELECT id FROM experts WHERE slug = 'priya-sharma'), (SELECT id FROM tools WHERE slug = 'jasper'), 'expert'),
((SELECT id FROM experts WHERE slug = 'priya-sharma'), (SELECT id FROM tools WHERE slug = 'copy-ai'), 'expert'),
((SELECT id FROM experts WHERE slug = 'priya-sharma'), (SELECT id FROM tools WHERE slug = 'grammarly'), 'advanced'),

-- Marcus Johnson: Cursor, GitHub Copilot, v0 Vercel
((SELECT id FROM experts WHERE slug = 'marcus-johnson'), (SELECT id FROM tools WHERE slug = 'cursor'), 'expert'),
((SELECT id FROM experts WHERE slug = 'marcus-johnson'), (SELECT id FROM tools WHERE slug = 'github-copilot'), 'expert'),
((SELECT id FROM experts WHERE slug = 'marcus-johnson'), (SELECT id FROM tools WHERE slug = 'v0-vercel'), 'advanced'),

-- Ana Kowalski: Figma, Webflow, Midjourney
((SELECT id FROM experts WHERE slug = 'ana-kowalski'), (SELECT id FROM tools WHERE slug = 'figma'), 'expert'),
((SELECT id FROM experts WHERE slug = 'ana-kowalski'), (SELECT id FROM tools WHERE slug = 'webflow'), 'advanced'),
((SELECT id FROM experts WHERE slug = 'ana-kowalski'), (SELECT id FROM tools WHERE slug = 'midjourney'), 'advanced')

ON CONFLICT DO NOTHING;

-- Project Tools Relations
INSERT INTO project_tools (project_id, tool_id) VALUES

-- AI Job Board: Bubble, Make, ChatGPT
((SELECT id FROM projects WHERE slug = 'ai-job-board-remote-tech'), (SELECT id FROM tools WHERE slug = 'bubble')),
((SELECT id FROM projects WHERE slug = 'ai-job-board-remote-tech'), (SELECT id FROM tools WHERE slug = 'make')),
((SELECT id FROM projects WHERE slug = 'ai-job-board-remote-tech'), (SELECT id FROM tools WHERE slug = 'chatgpt')),

-- Analytics Dashboard: Webflow
((SELECT id FROM projects WHERE slug = 'nocode-saas-analytics-dashboard'), (SELECT id FROM tools WHERE slug = 'webflow')),
((SELECT id FROM projects WHERE slug = 'nocode-saas-analytics-dashboard'), (SELECT id FROM tools WHERE slug = 'notion-ai')),

-- Recipe Generator: Bubble, ChatGPT
((SELECT id FROM projects WHERE slug = 'ai-recipe-generator-app'), (SELECT id FROM tools WHERE slug = 'bubble')),
((SELECT id FROM projects WHERE slug = 'ai-recipe-generator-app'), (SELECT id FROM tools WHERE slug = 'chatgpt')),

-- Content Marketing Pipeline: n8n, Claude, DALL-E
((SELECT id FROM projects WHERE slug = 'automated-content-marketing-pipeline'), (SELECT id FROM tools WHERE slug = 'n8n')),
((SELECT id FROM projects WHERE slug = 'automated-content-marketing-pipeline'), (SELECT id FROM tools WHERE slug = 'claude')),
((SELECT id FROM projects WHERE slug = 'automated-content-marketing-pipeline'), (SELECT id FROM tools WHERE slug = 'dalle-3')),

-- Real Estate Platform: Bubble, ChatGPT
((SELECT id FROM projects WHERE slug = 'real-estate-ai-descriptions'), (SELECT id FROM tools WHERE slug = 'bubble')),
((SELECT id FROM projects WHERE slug = 'real-estate-ai-descriptions'), (SELECT id FROM tools WHERE slug = 'chatgpt')),

-- Ecommerce Chatbot: ChatGPT, n8n
((SELECT id FROM projects WHERE slug = 'ecommerce-support-chatbot'), (SELECT id FROM tools WHERE slug = 'chatgpt')),
((SELECT id FROM projects WHERE slug = 'ecommerce-support-chatbot'), (SELECT id FROM tools WHERE slug = 'n8n')),

-- Finance Tracker: ChatGPT
((SELECT id FROM projects WHERE slug = 'personal-finance-tracker-ai'), (SELECT id FROM tools WHERE slug = 'chatgpt')),
((SELECT id FROM projects WHERE slug = 'personal-finance-tracker-ai'), (SELECT id FROM tools WHERE slug = 'notion-ai')),

-- Podcast Tool: Make, ElevenLabs
((SELECT id FROM projects WHERE slug = 'ai-podcast-repurposing-tool'), (SELECT id FROM tools WHERE slug = 'make')),
((SELECT id FROM projects WHERE slug = 'ai-podcast-repurposing-tool'), (SELECT id FROM tools WHERE slug = 'elevenlabs')),

-- Design Portfolio: Webflow, Figma
((SELECT id FROM projects WHERE slug = 'design-agency-portfolio-webflow'), (SELECT id FROM tools WHERE slug = 'webflow')),
((SELECT id FROM projects WHERE slug = 'design-agency-portfolio-webflow'), (SELECT id FROM tools WHERE slug = 'figma')),

-- Resume Builder: ChatGPT, Claude
((SELECT id FROM projects WHERE slug = 'ai-resume-builder'), (SELECT id FROM tools WHERE slug = 'chatgpt')),
((SELECT id FROM projects WHERE slug = 'ai-resume-builder'), (SELECT id FROM tools WHERE slug = 'claude'))

ON CONFLICT DO NOTHING;