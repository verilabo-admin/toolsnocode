/*
  # Add user ownership and favorites system

  1. Modified Tables
    - `tools` - Add `user_id` column (uuid, references auth.users)
    - `experts` - Add `user_id` column (uuid, references auth.users)
    - `tutorials` - Add `user_id` column (uuid, references auth.users)
    - `projects` - Add `user_id` column (uuid, references auth.users)

  2. New Tables
    - `favorites`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users, not null)
      - `item_type` (text, check: tools/experts/tutorials/projects)
      - `item_id` (uuid, not null)
      - `created_at` (timestamptz)
      - Unique constraint on (user_id, item_type, item_id)

  3. Security
    - Enable RLS on `favorites` table
    - Users can only read/write their own favorites
    - Authenticated users can create content they own
    - Owners can update/delete their own content
*/

-- Add user_id to tools
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tools' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE tools ADD COLUMN user_id uuid REFERENCES auth.users(id);
  END IF;
END $$;

-- Add user_id to experts
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'experts' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE experts ADD COLUMN user_id uuid REFERENCES auth.users(id);
  END IF;
END $$;

-- Add user_id to tutorials
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tutorials' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE tutorials ADD COLUMN user_id uuid REFERENCES auth.users(id);
  END IF;
END $$;

-- Add user_id to projects
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE projects ADD COLUMN user_id uuid REFERENCES auth.users(id);
  END IF;
END $$;

-- Create indexes on user_id columns
CREATE INDEX IF NOT EXISTS idx_tools_user_id ON tools(user_id);
CREATE INDEX IF NOT EXISTS idx_experts_user_id ON experts(user_id);
CREATE INDEX IF NOT EXISTS idx_tutorials_user_id ON tutorials(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);

-- Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_type text NOT NULL CHECK (item_type IN ('tools', 'experts', 'tutorials', 'projects')),
  item_id uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, item_type, item_id)
);

CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_item ON favorites(item_type, item_id);

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Favorites: users can read their own
CREATE POLICY "Users can view own favorites"
  ON favorites FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Favorites: users can insert their own
CREATE POLICY "Users can add favorites"
  ON favorites FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Favorites: users can delete their own
CREATE POLICY "Users can remove own favorites"
  ON favorites FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Tools: allow authenticated users to insert (as owner)
CREATE POLICY "Authenticated users can create tools"
  ON tools FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Tools: owners can update their tools
CREATE POLICY "Owners can update their tools"
  ON tools FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Tools: owners can delete their tools
CREATE POLICY "Owners can delete their tools"
  ON tools FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Experts: allow authenticated users to insert (as owner)
CREATE POLICY "Authenticated users can create experts"
  ON experts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Experts: owners can update
CREATE POLICY "Owners can update their experts"
  ON experts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Experts: owners can delete
CREATE POLICY "Owners can delete their experts"
  ON experts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Tutorials: allow authenticated users to insert (as owner)
CREATE POLICY "Authenticated users can create tutorials"
  ON tutorials FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Tutorials: owners can update
CREATE POLICY "Owners can update their tutorials"
  ON tutorials FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Tutorials: owners can delete
CREATE POLICY "Owners can delete their tutorials"
  ON tutorials FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Projects: allow authenticated users to insert (as owner)
CREATE POLICY "Authenticated users can create projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Projects: owners can update
CREATE POLICY "Owners can update their projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Projects: owners can delete
CREATE POLICY "Owners can delete their projects"
  ON projects FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Expert_tools: allow authenticated users to manage for their experts
CREATE POLICY "Authenticated users can insert expert_tools"
  ON expert_tools FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM experts WHERE experts.id = expert_tools.expert_id AND experts.user_id = auth.uid()
    )
  );

CREATE POLICY "Owners can delete expert_tools"
  ON expert_tools FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM experts WHERE experts.id = expert_tools.expert_id AND experts.user_id = auth.uid()
    )
  );

-- Project_tools: allow authenticated users to manage for their projects
CREATE POLICY "Authenticated users can insert project_tools"
  ON project_tools FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects WHERE projects.id = project_tools.project_id AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Owners can delete project_tools"
  ON project_tools FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects WHERE projects.id = project_tools.project_id AND projects.user_id = auth.uid()
    )
  );