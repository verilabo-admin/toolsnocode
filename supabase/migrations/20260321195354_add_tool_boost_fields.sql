/*
  # Add tool boost fields for paid promotion

  1. Modified Tables
    - `tools`
      - `is_boosted` (boolean) - Whether the tool has an active paid boost
      - `boost_expires_at` (timestamptz) - When the current boost period ends
      - `video_url` (text) - Demo video URL, available only for boosted tools
      - `boost_plan` (text) - The plan type (e.g., 'monthly')

  2. Indexes
    - Index on `is_boosted` for efficient filtering of boosted tools
    - Index on `boost_expires_at` for expiration checks

  3. Notes
    - Boosted tools get priority positioning in listings
    - Boosted tools appear in the featured section
    - Boosted tools can add a demo video
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tools' AND column_name = 'is_boosted'
  ) THEN
    ALTER TABLE tools ADD COLUMN is_boosted boolean NOT NULL DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tools' AND column_name = 'boost_expires_at'
  ) THEN
    ALTER TABLE tools ADD COLUMN boost_expires_at timestamptz DEFAULT NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tools' AND column_name = 'video_url'
  ) THEN
    ALTER TABLE tools ADD COLUMN video_url text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tools' AND column_name = 'boost_plan'
  ) THEN
    ALTER TABLE tools ADD COLUMN boost_plan text DEFAULT '';
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_tools_is_boosted ON tools (is_boosted) WHERE is_boosted = true;
CREATE INDEX IF NOT EXISTS idx_tools_boost_expires_at ON tools (boost_expires_at) WHERE boost_expires_at IS NOT NULL;
