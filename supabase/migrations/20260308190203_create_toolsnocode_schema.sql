/*
  # ToolsNoCode - Core Database Schema

  1. New Tables
    - `categories` - Main tool categories
    - `tools` - The core tools directory
    - `experts` - Professional profiles
    - `expert_tools` - Many-to-many: experts <-> tools
    - `tutorials` - Learning content
    - `projects` - Showcase projects
    - `project_tools` - Many-to-many: projects <-> tools

  2. Security
    - RLS enabled on ALL tables
    - Public read access for anonymous users
    - Write access restricted to authenticated users

  3. Indexes
    - Tools: slug, category_id, pricing, is_featured, is_trending
    - Experts: slug, country, is_featured
    - Tutorials: slug, tool_id
    - Projects: slug
    - Categories: slug, parent_id
*/

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  icon text DEFAULT '',
  parent_id uuid REFERENCES categories(id),
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  TO anon, authenticated
  USING (true);

-- Tools
CREATE TABLE IF NOT EXISTS tools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  tagline text DEFAULT '',
  description text DEFAULT '',
  website text DEFAULT '',
  logo_url text DEFAULT '',
  screenshot_urls text[] DEFAULT '{}',
  category_id uuid REFERENCES categories(id),
  pricing text DEFAULT 'free' CHECK (pricing IN ('free', 'freemium', 'paid', 'enterprise')),
  pricing_details text DEFAULT '',
  tags text[] DEFAULT '{}',
  rating numeric DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  review_count int DEFAULT 0,
  upvotes int DEFAULT 0,
  is_featured boolean DEFAULT false,
  is_trending boolean DEFAULT false,
  difficulty_level text DEFAULT 'beginner' CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE tools ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view tools"
  ON tools FOR SELECT
  TO anon, authenticated
  USING (true);

-- Experts
CREATE TABLE IF NOT EXISTS experts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  bio text DEFAULT '',
  avatar_url text DEFAULT '',
  country text DEFAULT '',
  languages text[] DEFAULT '{}',
  hourly_rate numeric DEFAULT 0,
  rating numeric DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  review_count int DEFAULT 0,
  portfolio_url text DEFAULT '',
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE experts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view experts"
  ON experts FOR SELECT
  TO anon, authenticated
  USING (true);

-- Expert Tools (many-to-many)
CREATE TABLE IF NOT EXISTS expert_tools (
  expert_id uuid REFERENCES experts(id) ON DELETE CASCADE,
  tool_id uuid REFERENCES tools(id) ON DELETE CASCADE,
  proficiency_level text DEFAULT 'intermediate' CHECK (proficiency_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  PRIMARY KEY (expert_id, tool_id)
);

ALTER TABLE expert_tools ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view expert tools"
  ON expert_tools FOR SELECT
  TO anon, authenticated
  USING (true);

-- Tutorials
CREATE TABLE IF NOT EXISTS tutorials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  tool_id uuid REFERENCES tools(id) ON DELETE SET NULL,
  video_url text DEFAULT '',
  content_type text DEFAULT 'article' CHECK (content_type IN ('video', 'guide', 'course', 'article')),
  duration_minutes int DEFAULT 0,
  difficulty_level text DEFAULT 'beginner' CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  author_name text DEFAULT '',
  thumbnail_url text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE tutorials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view tutorials"
  ON tutorials FOR SELECT
  TO anon, authenticated
  USING (true);

-- Projects
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  screenshot_url text DEFAULT '',
  live_url text DEFAULT '',
  author_name text DEFAULT '',
  upvotes int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view projects"
  ON projects FOR SELECT
  TO anon, authenticated
  USING (true);

-- Project Tools (many-to-many)
CREATE TABLE IF NOT EXISTS project_tools (
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  tool_id uuid REFERENCES tools(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, tool_id)
);

ALTER TABLE project_tools ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view project tools"
  ON project_tools FOR SELECT
  TO anon, authenticated
  USING (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_tools_category ON tools(category_id);
CREATE INDEX IF NOT EXISTS idx_tools_pricing ON tools(pricing);
CREATE INDEX IF NOT EXISTS idx_tools_featured ON tools(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_tools_trending ON tools(is_trending) WHERE is_trending = true;
CREATE INDEX IF NOT EXISTS idx_tools_slug ON tools(slug);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_parent ON categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_experts_slug ON experts(slug);
CREATE INDEX IF NOT EXISTS idx_experts_country ON experts(country);
CREATE INDEX IF NOT EXISTS idx_experts_featured ON experts(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_tutorials_slug ON tutorials(slug);
CREATE INDEX IF NOT EXISTS idx_tutorials_tool ON tutorials(tool_id);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);