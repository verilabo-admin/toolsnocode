/*
  # Seed Projects Data

  Inserts 10 showcase projects built with no-code and AI tools.
*/

INSERT INTO projects (title, slug, description, screenshot_url, live_url, author_name, upvotes) VALUES

('AI Job Board for Remote Tech Roles',
 'ai-job-board-remote-tech',
 'A fully automated job board that scrapes remote tech job listings, uses GPT-4 to categorize and summarize roles, and sends personalized email digests to subscribers. Built with Bubble, Make, and OpenAI API. Processes 500+ new jobs daily.',
 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?w=800',
 'https://example.com/ai-job-board', 'James Okafor', 342),

('No-Code SaaS Analytics Dashboard',
 'nocode-saas-analytics-dashboard',
 'A real-time analytics dashboard for SaaS businesses built entirely in Webflow with custom code integrations and Airtable as the backend. Tracks MRR, churn, user growth, and feature adoption with beautiful charts.',
 'https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg?w=800',
 'https://example.com/saas-dashboard', 'Sophie Müller', 287),

('AI-Powered Recipe Generator App',
 'ai-recipe-generator-app',
 'A mobile-first web app where users input available ingredients and the AI generates personalized recipes with nutritional info and shopping lists. Built with Bubble, OpenAI, and Spoonacular API. Has 8,000+ active monthly users.',
 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?w=800',
 'https://example.com/recipe-gen', 'Aisha Patel', 524),

('Automated Content Marketing Pipeline',
 'automated-content-marketing-pipeline',
 'An end-to-end content marketing automation system built with n8n. It researches trending topics, generates article outlines with Claude, produces full drafts, creates matching images with DALL-E, and publishes to WordPress — all automatically.',
 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?w=800',
 'https://example.com/content-pipeline', 'Priya Sharma', 418),

('Real Estate Listing Platform with AI Descriptions',
 'real-estate-ai-descriptions',
 'A property listing marketplace built with Bubble.io where agents upload photos and basic details, then AI automatically writes compelling property descriptions in seconds. Saves agents 2+ hours per listing.',
 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?w=800',
 'https://example.com/real-estate', 'Maria Santos', 193),

('Customer Support Chatbot for E-commerce',
 'ecommerce-support-chatbot',
 'A fully trained AI customer support bot for a fashion e-commerce brand, handling 70% of support tickets automatically. Built with custom GPT, Intercom, and n8n for order tracking integration.',
 'https://images.pexels.com/photos/7654586/pexels-photo-7654586.jpeg?w=800',
 'https://example.com/support-bot', 'Yuki Tanaka', 356),

('Personal Finance Tracker with AI Insights',
 'personal-finance-tracker-ai',
 'A personal finance app built in Glide that connects to bank accounts via Plaid, categorizes transactions automatically, and uses AI to provide weekly spending insights and saving recommendations.',
 'https://images.pexels.com/photos/4386476/pexels-photo-4386476.jpeg?w=800',
 'https://example.com/finance-tracker', 'Lucas Dubois', 271),

('AI Podcast Repurposing Tool',
 'ai-podcast-repurposing-tool',
 'Paste a podcast RSS feed and the system transcribes episodes with Whisper, generates show notes, creates Twitter threads, LinkedIn posts, and newsletter summaries automatically. Built with Make and ElevenLabs for audio clips.',
 'https://images.pexels.com/photos/3756766/pexels-photo-3756766.jpeg?w=800',
 'https://example.com/podcast-tool', 'Tom Bergmann', 489),

('Design Agency Portfolio with Webflow CMS',
 'design-agency-portfolio-webflow',
 'A stunning multi-page portfolio site for a boutique design agency, built entirely in Webflow with CMS-driven case studies, smooth page transitions, and a fully responsive design. Scores 98 on PageSpeed Insights.',
 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?w=800',
 'https://example.com/design-portfolio', 'Ana Kowalski', 312),

('AI-Powered Resume Builder',
 'ai-resume-builder',
 'A web app that uses AI to optimize resumes for specific job descriptions. Users paste their resume and a job posting, and the AI rewrites their experience bullets, suggests skills to add, and scores the ATS compatibility.',
 'https://images.pexels.com/photos/3184340/pexels-photo-3184340.jpeg?w=800',
 'https://example.com/resume-builder', 'Carlos Rivera', 631)

ON CONFLICT (slug) DO NOTHING;