/*
  # Add extended categories for scraped tools

  1. New Categories
    - `writing` - AI writing and copywriting tools
    - `productivity` - Productivity and efficiency tools
    - `social-media` - Social media management tools
    - `design` - Design and creative tools
    - `research` - Research and knowledge tools
    - `education` - Education and learning tools
    - `customer-support` - Customer support and chat tools
    - `sales` - Sales and CRM tools
    - `hr-recruiting` - HR and recruiting tools
    - `finance` - Finance and accounting tools
    - `translation` - Translation and localization tools
    - `music-audio` - Music and audio tools
    - `healthcare` - Healthcare and medical tools
    - `legal` - Legal tools
    - `real-estate` - Real estate tools
    - `ecommerce` - E-commerce tools
    - `gaming` - Gaming tools
    - `other` - Uncategorized tools

  2. Important Notes
    - Uses IF NOT EXISTS via ON CONFLICT to prevent duplicates
    - Extends the existing category system for broader tool coverage
*/

INSERT INTO categories (name, slug, description, icon, sort_order) VALUES
  ('Writing & Copy', 'writing', 'AI writing, copywriting and content generation', 'penline', 13),
  ('Productivity', 'productivity', 'AI productivity and efficiency tools', 'zap', 14),
  ('Social Media', 'social-media', 'Social media management and content tools', 'share2', 15),
  ('Design & Creative', 'design', 'Design, graphics and creative tools', 'palette', 16),
  ('Research', 'research', 'Research, knowledge and information tools', 'microscope', 17),
  ('Education', 'education', 'Education and learning platforms', 'graduationcap', 18),
  ('Customer Support', 'customer-support', 'Customer support and chatbot tools', 'headphones', 19),
  ('Sales & CRM', 'sales', 'Sales, CRM and lead generation tools', 'target', 20),
  ('HR & Recruiting', 'hr-recruiting', 'HR, recruiting and talent tools', 'users', 21),
  ('Finance', 'finance', 'Finance, accounting and fintech tools', 'dollarSign', 22),
  ('Translation', 'translation', 'Translation and localization tools', 'languages', 23),
  ('Music & Audio', 'music-audio', 'Music generation and audio tools', 'music', 24),
  ('Healthcare', 'healthcare', 'Healthcare and medical AI tools', 'heart', 25),
  ('Legal', 'legal', 'Legal AI and compliance tools', 'scale', 26),
  ('Real Estate', 'real-estate', 'Real estate AI tools', 'home', 27),
  ('E-commerce', 'ecommerce', 'E-commerce and retail tools', 'shoppingcart', 28),
  ('Gaming', 'gaming', 'Gaming and entertainment tools', 'gamepad2', 29),
  ('Other AI', 'other', 'Other AI and no-code tools', 'sparkles', 30)
ON CONFLICT (slug) DO NOTHING;
