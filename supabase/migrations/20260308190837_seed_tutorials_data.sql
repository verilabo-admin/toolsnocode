/*
  # Seed Tutorials Data

  Inserts 15 tutorials covering popular no-code and AI tools.
*/

INSERT INTO tutorials (title, slug, description, tool_id, video_url, content_type, duration_minutes, difficulty_level, author_name, thumbnail_url) VALUES

('Getting Started with ChatGPT: A Complete Beginner''s Guide',
 'getting-started-chatgpt',
 'Learn how to use ChatGPT effectively from scratch. This guide covers prompt writing, use cases for work and learning, and tips to get the best results from the AI chatbot.',
 (SELECT id FROM tools WHERE slug = 'chatgpt'),
 'https://www.youtube.com/watch?v=example1',
 'guide', 25, 'beginner', 'Carlos Rivera',
 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?w=600'),

('Build Your First App on Bubble.io: Step by Step',
 'first-app-bubble',
 'Build a complete task management application from scratch using Bubble.io. Covers database setup, user authentication, and deploying your app to production.',
 (SELECT id FROM tools WHERE slug = 'bubble'),
 'https://www.youtube.com/watch?v=example2',
 'video', 90, 'beginner', 'Maria Santos',
 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?w=600'),

('Midjourney Mastery: Creating Stunning AI Art',
 'midjourney-mastery',
 'Go from beginner to advanced Midjourney user. Learn prompt engineering techniques, style parameters, aspect ratios, and how to create consistent characters.',
 (SELECT id FROM tools WHERE slug = 'midjourney'),
 'https://www.youtube.com/watch?v=example3',
 'course', 180, 'intermediate', 'Ana Kowalski',
 'https://images.pexels.com/photos/1266808/pexels-photo-1266808.jpeg?w=600'),

('Automate Your Business with Make (Integromat): Beginner to Pro',
 'automate-business-make',
 'Learn how to build powerful automations with Make. Connect 1000+ apps, create multi-step workflows, handle errors, and automate repetitive tasks in your business.',
 (SELECT id FROM tools WHERE slug = 'make'),
 'https://www.youtube.com/watch?v=example4',
 'course', 240, 'intermediate', 'James Okafor',
 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?w=600'),

('Webflow for Designers: Build Professional Websites Without Code',
 'webflow-for-designers',
 'Master Webflow from a designer''s perspective. Learn the box model, flexbox, CMS collections, interactions, and how to publish a complete website.',
 (SELECT id FROM tools WHERE slug = 'webflow'),
 'https://www.youtube.com/watch?v=example5',
 'video', 120, 'intermediate', 'Aisha Patel',
 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?w=600'),

('GitHub Copilot Tips: Write Code 10x Faster',
 'github-copilot-tips',
 'Discover the most effective ways to use GitHub Copilot in your daily coding workflow. Includes keyboard shortcuts, prompt patterns, and how to review AI suggestions critically.',
 (SELECT id FROM tools WHERE slug = 'github-copilot'),
 'https://www.youtube.com/watch?v=example6',
 'guide', 35, 'intermediate', 'Marcus Johnson',
 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?w=600'),

('ElevenLabs Voice Cloning: Create Your AI Voice',
 'elevenlabs-voice-cloning',
 'Learn how to clone your voice with ElevenLabs, create custom voice personas, and use the API to add text-to-speech to your projects. Includes ethics discussion.',
 (SELECT id FROM tools WHERE slug = 'elevenlabs'),
 'https://www.youtube.com/watch?v=example7',
 'video', 45, 'beginner', 'Tom Bergmann',
 'https://images.pexels.com/photos/3756766/pexels-photo-3756766.jpeg?w=600'),

('Build a SaaS Product with Cursor AI: Full Walkthrough',
 'build-saas-cursor-ai',
 'Follow along as we build a complete SaaS application using Cursor AI editor. Learn to use AI for architecture decisions, writing features, debugging, and shipping.',
 (SELECT id FROM tools WHERE slug = 'cursor'),
 'https://www.youtube.com/watch?v=example8',
 'course', 300, 'advanced', 'Sophie Müller',
 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?w=600'),

('Canva AI Features: Design Faster with Artificial Intelligence',
 'canva-ai-features',
 'Explore all of Canva''s AI-powered design features: Magic Write, Text to Image, Background Remover, Magic Resize, and how to use them for professional marketing materials.',
 (SELECT id FROM tools WHERE slug = 'canva'),
 'https://www.youtube.com/watch?v=example9',
 'video', 60, 'beginner', 'Priya Sharma',
 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?w=600'),

('n8n Self-Hosted Setup and Your First Workflow',
 'n8n-self-hosted-setup',
 'Install n8n on your own server using Docker, secure it properly, and build your first automation workflow. Perfect for those who want full control over their automation platform.',
 (SELECT id FROM tools WHERE slug = 'n8n'),
 'https://www.youtube.com/watch?v=example10',
 'guide', 75, 'intermediate', 'Tom Bergmann',
 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?w=600'),

('v0 by Vercel: Generate React UI Components with AI',
 'v0-generate-react-ui',
 'Learn how to use v0 to generate production-ready React and Tailwind CSS components. Covers iterating on designs, exporting code, and integrating with your Next.js project.',
 (SELECT id FROM tools WHERE slug = 'v0-vercel'),
 'https://www.youtube.com/watch?v=example11',
 'video', 40, 'beginner', 'Marcus Johnson',
 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?w=600'),

('Claude AI for Research and Writing: Advanced Techniques',
 'claude-ai-research-writing',
 'Unlock Claude''s full potential for research and writing. Learn advanced prompting techniques, how to work with long documents, and use Claude as a thought partner.',
 (SELECT id FROM tools WHERE slug = 'claude'),
 'https://www.youtube.com/watch?v=example12',
 'guide', 50, 'intermediate', 'Yuki Tanaka',
 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?w=600'),

('Suno AI Music Generation: Create Songs from Text',
 'suno-ai-music-generation',
 'Discover how to create complete songs with Suno AI. Learn effective music prompts, genre combinations, how to iterate on lyrics, and tips for getting professional-sounding results.',
 (SELECT id FROM tools WHERE slug = 'suno'),
 'https://www.youtube.com/watch?v=example13',
 'video', 30, 'beginner', 'Carlos Rivera',
 'https://images.pexels.com/photos/3756766/pexels-photo-3756766.jpeg?w=600'),

('Figma AI Prototyping: Design to Code in Minutes',
 'figma-ai-prototyping',
 'Use Figma''s new AI features to accelerate your design workflow. Covers auto-layout, AI design suggestions, the Dev Mode for developers, and new AI-powered features.',
 (SELECT id FROM tools WHERE slug = 'figma'),
 'https://www.youtube.com/watch?v=example14',
 'video', 80, 'intermediate', 'Ana Kowalski',
 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?w=600'),

('Perplexity AI: The Research Tool That Replaces Google',
 'perplexity-ai-research-guide',
 'Learn how to use Perplexity AI as your primary research tool. Covers search operators, thread conversations, following topics, and using Spaces for organized research projects.',
 (SELECT id FROM tools WHERE slug = 'perplexity-ai'),
 'https://www.youtube.com/watch?v=example15',
 'guide', 20, 'beginner', 'Lucas Dubois',
 'https://images.pexels.com/photos/5473955/pexels-photo-5473955.jpeg?w=600')

ON CONFLICT (slug) DO NOTHING;