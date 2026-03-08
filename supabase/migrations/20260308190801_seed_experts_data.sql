/*
  # Seed Experts Data

  Inserts 12 no-code/AI experts with realistic profiles.
*/

INSERT INTO experts (name, slug, bio, avatar_url, country, languages, hourly_rate, rating, review_count, portfolio_url, is_featured) VALUES

('Maria Santos', 'maria-santos', 'No-code developer specializing in Bubble.io and Webflow. I''ve built over 80 production apps for startups and SMBs across Europe and Latin America. Former UX designer turned builder.', 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=200', 'Brazil', ARRAY['Portuguese', 'English', 'Spanish'], 95, 4.9, 142, 'https://portfolio.example.com/maria', true),

('James Okafor', 'james-okafor', 'Automation expert and Make.com certified partner. I help businesses eliminate repetitive tasks by connecting their tools and building smart workflows. 5+ years automating everything from e-commerce to healthcare.', 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?w=200', 'Nigeria', ARRAY['English', 'Yoruba'], 80, 4.8, 98, 'https://portfolio.example.com/james', true),

('Sophie Müller', 'sophie-muller', 'Full-stack no-code developer building complex SaaS products with Bubble, Xano, and WeWeb. Based in Berlin, working with European startups on MVP development and scaling.', 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?w=200', 'Germany', ARRAY['German', 'English', 'French'], 120, 4.8, 76, 'https://portfolio.example.com/sophie', true),

('Carlos Rivera', 'carlos-rivera', 'AI automation consultant helping businesses leverage ChatGPT, Claude, and custom GPTs for content creation, customer support, and internal operations. Speaker and educator.', 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?w=200', 'Mexico', ARRAY['Spanish', 'English'], 90, 4.7, 115, 'https://portfolio.example.com/carlos', true),

('Aisha Patel', 'aisha-patel', 'Webflow expert and design engineer. I build pixel-perfect, performant websites that rank and convert. Certified Webflow Expert with 60+ projects delivered for brands worldwide.', 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?w=200', 'India', ARRAY['English', 'Hindi', 'Gujarati'], 75, 4.7, 134, 'https://portfolio.example.com/aisha', true),

('Tom Bergmann', 'tom-bergmann', 'n8n and Zapier workflow automation specialist. I design and implement complex automation systems for marketing agencies, saving my clients an average of 20+ hours per week.', 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?w=200', 'Netherlands', ARRAY['Dutch', 'English', 'German'], 85, 4.6, 67, 'https://portfolio.example.com/tom', false),

('Yuki Tanaka', 'yuki-tanaka', 'AI prompt engineer and ChatGPT integration specialist. I help companies build custom GPT workflows, AI agents, and integrate LLMs into their existing products.', 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?w=200', 'Japan', ARRAY['Japanese', 'English'], 110, 4.7, 89, 'https://portfolio.example.com/yuki', true),

('Fatima Al-Rashid', 'fatima-al-rashid', 'No-code app developer specializing in e-commerce and marketplace apps using Glide, Adalo, and FlutterFlow. I deliver beautiful mobile-first experiences without code.', 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=200', 'UAE', ARRAY['Arabic', 'English'], 70, 4.6, 54, 'https://portfolio.example.com/fatima', false),

('Lucas Dubois', 'lucas-dubois', 'Airtable and Notion systems architect. I build company-wide operational systems, project management setups, and knowledge bases that teams actually love to use.', 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?w=200', 'France', ARRAY['French', 'English'], 95, 4.8, 103, 'https://portfolio.example.com/lucas', false),

('Priya Sharma', 'priya-sharma', 'AI content strategist and Jasper.ai power user. I help content teams scale their output 10x using AI workflows, from ideation to publishing, while maintaining brand voice.', 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?w=200', 'India', ARRAY['English', 'Hindi'], 65, 4.5, 78, 'https://portfolio.example.com/priya', false),

('Marcus Johnson', 'marcus-johnson', 'Low-code developer and Retool specialist. I build internal tools, dashboards, and admin panels for operations teams at fast-growing startups. Ex-software engineer turned no-coder.', 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?w=200', 'United States', ARRAY['English'], 130, 4.8, 88, 'https://portfolio.example.com/marcus', true),

('Ana Kowalski', 'ana-kowalski', 'Framer and Webflow motion designer creating award-winning websites with stunning animations. I blend design expertise with no-code tools to deliver sites that stand out.', 'https://images.pexels.com/photos/1181695/pexels-photo-1181695.jpeg?w=200', 'Poland', ARRAY['Polish', 'English'], 100, 4.7, 61, 'https://portfolio.example.com/ana', false)

ON CONFLICT (slug) DO NOTHING;