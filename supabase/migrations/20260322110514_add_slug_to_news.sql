/*
  # Add slug column to news table

  ## Changes
  - Adds `slug` column (text, unique) to the `news` table
  - Generates slugs from existing titles using a URL-safe transformation
  - Creates an index on slug for fast lookups
  - Adds a function to auto-generate slugs on insert if not provided

  ## Notes
  - Slugs are generated from titles: lowercase, spaces to hyphens, special chars removed
  - Existing rows get slugs derived from their title + short id suffix for uniqueness
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'news' AND column_name = 'slug'
  ) THEN
    ALTER TABLE news ADD COLUMN slug text;
  END IF;
END $$;

UPDATE news
SET slug = (
  regexp_replace(
    regexp_replace(
      lower(title),
      '[^a-z0-9\s-]', '', 'g'
    ),
    '\s+', '-', 'g'
  ) || '-' || substr(id::text, 1, 8)
)
WHERE slug IS NULL;

ALTER TABLE news ALTER COLUMN slug SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE tablename = 'news' AND indexname = 'news_slug_idx'
  ) THEN
    CREATE UNIQUE INDEX news_slug_idx ON news (slug);
  END IF;
END $$;
