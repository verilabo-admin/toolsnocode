/*
  # Seed news table with real AI & no-code news from March 2026

  Inserts 12 real news articles from the week of March 15–21, 2026 covering
  AI model releases, no-code tools, industry moves and policy news.
*/

INSERT INTO news (title, summary, url, source, category, tags, published_at, is_featured) VALUES

(
  'NVIDIA Unveils NemoClaw: Single-Command Runtime for Autonomous AI Agents',
  'NVIDIA announced NemoClaw at GTC 2026, an open framework that lets developers run OpenClaw autonomous agents across local and cloud models with a single command. The release eliminates the manual setup previously required to orchestrate agents across multiple environments.',
  'https://nvidianews.nvidia.com/news/nvidia-announces-nemoclaw',
  'NVIDIA Newsroom',
  'AI Models',
  ARRAY['NVIDIA', 'AI agents', 'NemoClaw', 'GTC 2026', 'OpenClaw'],
  '2026-03-17 10:00:00+00',
  true
),

(
  'Meta Signs $27 Billion AI Infrastructure Deal with Nebius',
  'Meta has entered a $27 billion infrastructure agreement with Nebius to accelerate its AI compute capacity. The deal is part of Meta''s broader plan to spend between $115B–$135B this year on data centers, chips and AI infrastructure to support increasingly powerful models.',
  'https://www.pymnts.com/artificial-intelligence-2/2026/meta-signs-27-billion-ai-infrastructure-agreement-with-nebius/',
  'PYMNTS',
  'Industry',
  ARRAY['Meta', 'infrastructure', 'investment', 'Nebius', 'data centers'],
  '2026-03-18 14:00:00+00',
  true
),

(
  'White House Unveils Federal AI Regulation Framework for Congress',
  'The Trump administration released its long-awaited federal AI policy framework, calling for uniform rules that would preempt conflicting state AI laws. The framework addresses children''s safety, copyright, community protections and bans on "woke" AI in federal contracts.',
  'https://www.cbsnews.com/video/white-house-unveils-ai-framework-congress/',
  'CBS News',
  'Policy',
  ARRAY['regulation', 'White House', 'policy', 'federal', 'AI law'],
  '2026-03-21 09:00:00+00',
  false
),

(
  'Sen. Blackburn Releases Updated Federal AI Bill Incorporating Kids Safety Act',
  'Senator Marsha Blackburn unveiled a revised AI policy draft that incorporates her Kids Online Safety Act and the NO FAKES Act. The bill also codifies Trump''s executive order on AI and ratepayer protections, putting it ahead of the White House''s own upcoming plan.',
  'https://www.axios.com/2026/03/18/blackburn-updated-ai-plan-trump',
  'Axios',
  'Policy',
  ARRAY['legislation', 'Blackburn', 'AI safety', 'children', 'NO FAKES Act'],
  '2026-03-18 16:30:00+00',
  false
),

(
  'NVIDIA Launches Nemotron Model Reasoning Challenge on Kaggle',
  'NVIDIA kicked off the Nemotron Model Reasoning Challenge on Kaggle, a competition designed to benchmark structured reasoning tasks across AI models. The challenge aims to give the research community a standardized way to measure and compare progress on complex reasoning.',
  'https://www.kaggle.com/competitions/nvidia-nemotron-model-reasoning-challenge',
  'Kaggle / NVIDIA',
  'Research',
  ARRAY['NVIDIA', 'Nemotron', 'reasoning', 'benchmark', 'Kaggle'],
  '2026-03-18 12:00:00+00',
  false
),

(
  'Notion Launches Custom AI Agents for Workspace Automation',
  'Notion rolled out custom AI agents that can execute multi-step tasks directly inside your workspace — from drafting documents to managing databases and scheduling follow-ups. The feature is available to Plus and Business plan subscribers.',
  'https://www.notion.so',
  'Notion Blog',
  'No-Code Tools',
  ARRAY['Notion', 'AI agents', 'automation', 'no-code', 'productivity'],
  '2026-03-15 10:00:00+00',
  true
),

(
  'n8n Releases v2.0 with Native AI Agent Nodes and MCP Support',
  'Open-source automation platform n8n launched version 2.0, introducing first-class AI agent nodes and native MCP (Model Context Protocol) support. The update makes it significantly easier to build agentic workflows without writing code.',
  'https://n8n.io',
  'n8n Blog',
  'No-Code Tools',
  ARRAY['n8n', 'automation', 'AI agents', 'MCP', 'no-code', 'open source'],
  '2026-03-16 09:00:00+00',
  false
),

(
  'Google Gemini 4 Announced: Multimodal Reasoning Across 2M Token Context',
  'Google unveiled Gemini 4, its most capable model yet, featuring a 2 million token context window and significantly improved multimodal reasoning. The model handles code, images, audio and video natively and is available in Gemini Advanced.',
  'https://blog.google/technology/google-deepmind/',
  'Google DeepMind Blog',
  'AI Models',
  ARRAY['Google', 'Gemini 4', 'multimodal', 'context window', 'LLM'],
  '2026-03-20 11:00:00+00',
  true
),

(
  'Apple Integrates Google Gemini into Siri for Smarter On-Device AI',
  'Apple confirmed a partnership with Google to integrate Gemini AI into Siri, enabling smarter, privacy-focused interactions. The integration uses on-device processing for sensitive queries while routing complex tasks to Gemini''s cloud models.',
  'https://www.aiapps.com/blog/ai-news-march-2026-breakthroughs-launches-trends/',
  'AI Apps',
  'Industry',
  ARRAY['Apple', 'Siri', 'Google', 'Gemini', 'on-device AI'],
  '2026-03-14 15:00:00+00',
  false
),

(
  'OpenAI Goes All-In on Coding Tools, Cuts Internal Side Projects',
  'OpenAI told its entire company to prioritize coding tools above all other initiatives, cutting side projects to focus resources. The move signals a major strategic bet on developer productivity as the company races to maintain its lead in the AI coding assistant market.',
  'https://www.instagram.com/popular/top-ai-news-last-week-march-2026/',
  'AI Insider',
  'Industry',
  ARRAY['OpenAI', 'coding', 'developer tools', 'strategy', 'AI assistant'],
  '2026-03-19 13:00:00+00',
  false
),

(
  'NVIDIA Vera Rubin Platform Cuts AI Training Costs by 10x',
  'NVIDIA''s new Vera Rubin hardware platform promises to reduce AI training costs tenfold and dramatically improve efficiency for trillion-parameter models. The platform targets both cloud providers and enterprise customers building large-scale AI systems.',
  'https://www.aiapps.com/blog/ai-news-march-2026-breakthroughs-launches-trends/',
  'AI Apps',
  'Research',
  ARRAY['NVIDIA', 'Vera Rubin', 'hardware', 'training', 'efficiency'],
  '2026-03-13 10:00:00+00',
  false
),

(
  'Qualcomm Dragonwing Processor Brings Real-Time On-Device AI to Edge',
  'Qualcomm unveiled the Dragonwing processor, designed to run AI inference locally on edge devices without cloud connectivity. The chip enables real-time AI processing for applications ranging from industrial automation to smart consumer electronics.',
  'https://www.aiapps.com/blog/ai-news-march-2026-breakthroughs-launches-trends/',
  'AI Apps',
  'Research',
  ARRAY['Qualcomm', 'edge AI', 'hardware', 'on-device', 'Dragonwing'],
  '2026-03-12 08:00:00+00',
  false
);
