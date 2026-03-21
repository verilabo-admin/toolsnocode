/*
  # Create news table

  ## Summary
  Creates a `news` table to store AI and no-code tool news articles.

  ## New Tables
  - `news`
    - `id` (uuid, primary key)
    - `title` (text) — headline of the article
    - `summary` (text) — short description / excerpt
    - `content` (text, nullable) — optional full body
    - `url` (text) — link to original source
    - `source` (text) — publisher name (e.g. "The Verge", "TechCrunch")
    - `image_url` (text, nullable) — cover image
    - `category` (text) — e.g. "AI Models", "No-Code Tools", "Industry", "Research"
    - `tags` (text[]) — array of keyword tags
    - `published_at` (timestamptz) — original publication date
    - `is_featured` (boolean) — highlight on homepage
    - `created_at` (timestamptz)

  ## Security
  - RLS enabled
  - Public SELECT allowed (news is public content)
  - Only authenticated users with service role can INSERT/UPDATE/DELETE (managed via migration seeding)
*/

CREATE TABLE IF NOT EXISTS news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  summary text NOT NULL DEFAULT '',
  content text,
  url text NOT NULL DEFAULT '',
  source text NOT NULL DEFAULT '',
  image_url text,
  category text NOT NULL DEFAULT 'AI',
  tags text[] NOT NULL DEFAULT '{}',
  published_at timestamptz NOT NULL DEFAULT now(),
  is_featured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE news ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read news"
  ON news FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS news_published_at_idx ON news (published_at DESC);
CREATE INDEX IF NOT EXISTS news_category_idx ON news (category);
CREATE INDEX IF NOT EXISTS news_is_featured_idx ON news (is_featured) WHERE is_featured = true;
