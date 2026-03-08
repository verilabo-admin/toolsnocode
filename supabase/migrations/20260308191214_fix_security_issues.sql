/*
  # Fix Security Issues

  1. Add missing indexes on foreign keys for expert_tools and project_tools
  2. Fix RLS policies to use (select auth.uid()) pattern for better performance
  3. Drop unused indexes to reduce overhead

  Note: Leaked password protection must be enabled via the Supabase dashboard Auth settings.
*/

-- ============================================================
-- 1. Add missing indexes on unindexed foreign keys
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_expert_tools_tool_id ON public.expert_tools (tool_id);
CREATE INDEX IF NOT EXISTS idx_project_tools_tool_id ON public.project_tools (tool_id);

-- ============================================================
-- 2. Drop unused indexes
-- ============================================================
DROP INDEX IF EXISTS public.idx_tools_pricing;
DROP INDEX IF EXISTS public.idx_tools_featured;
DROP INDEX IF EXISTS public.idx_tools_trending;
DROP INDEX IF EXISTS public.idx_experts_country;
DROP INDEX IF EXISTS public.idx_experts_featured;
DROP INDEX IF EXISTS public.idx_tutorials_slug;
DROP INDEX IF EXISTS public.idx_tools_user_id;
DROP INDEX IF EXISTS public.idx_experts_user_id;
DROP INDEX IF EXISTS public.idx_tutorials_user_id;
DROP INDEX IF EXISTS public.idx_projects_user_id;
DROP INDEX IF EXISTS public.idx_favorites_item;

-- ============================================================
-- 3. Fix RLS policies: replace auth.uid() with (select auth.uid())
-- ============================================================

-- favorites
DROP POLICY IF EXISTS "Users can view own favorites" ON public.favorites;
DROP POLICY IF EXISTS "Users can add favorites" ON public.favorites;
DROP POLICY IF EXISTS "Users can remove own favorites" ON public.favorites;

CREATE POLICY "Users can view own favorites"
  ON public.favorites FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can add favorites"
  ON public.favorites FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can remove own favorites"
  ON public.favorites FOR DELETE
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- tools
DROP POLICY IF EXISTS "Authenticated users can create tools" ON public.tools;
DROP POLICY IF EXISTS "Owners can update their tools" ON public.tools;
DROP POLICY IF EXISTS "Owners can delete their tools" ON public.tools;

CREATE POLICY "Authenticated users can create tools"
  ON public.tools FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Owners can update their tools"
  ON public.tools FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Owners can delete their tools"
  ON public.tools FOR DELETE
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- experts
DROP POLICY IF EXISTS "Authenticated users can create experts" ON public.experts;
DROP POLICY IF EXISTS "Owners can update their experts" ON public.experts;
DROP POLICY IF EXISTS "Owners can delete their experts" ON public.experts;

CREATE POLICY "Authenticated users can create experts"
  ON public.experts FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Owners can update their experts"
  ON public.experts FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Owners can delete their experts"
  ON public.experts FOR DELETE
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- tutorials
DROP POLICY IF EXISTS "Authenticated users can create tutorials" ON public.tutorials;
DROP POLICY IF EXISTS "Owners can update their tutorials" ON public.tutorials;
DROP POLICY IF EXISTS "Owners can delete their tutorials" ON public.tutorials;

CREATE POLICY "Authenticated users can create tutorials"
  ON public.tutorials FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Owners can update their tutorials"
  ON public.tutorials FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Owners can delete their tutorials"
  ON public.tutorials FOR DELETE
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- projects
DROP POLICY IF EXISTS "Authenticated users can create projects" ON public.projects;
DROP POLICY IF EXISTS "Owners can update their projects" ON public.projects;
DROP POLICY IF EXISTS "Owners can delete their projects" ON public.projects;

CREATE POLICY "Authenticated users can create projects"
  ON public.projects FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Owners can update their projects"
  ON public.projects FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Owners can delete their projects"
  ON public.projects FOR DELETE
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- expert_tools
DROP POLICY IF EXISTS "Authenticated users can insert expert_tools" ON public.expert_tools;
DROP POLICY IF EXISTS "Owners can delete expert_tools" ON public.expert_tools;

CREATE POLICY "Authenticated users can insert expert_tools"
  ON public.expert_tools FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.experts
      WHERE experts.id = expert_tools.expert_id
      AND experts.user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Owners can delete expert_tools"
  ON public.expert_tools FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.experts
      WHERE experts.id = expert_tools.expert_id
      AND experts.user_id = (SELECT auth.uid())
    )
  );

-- project_tools
DROP POLICY IF EXISTS "Authenticated users can insert project_tools" ON public.project_tools;
DROP POLICY IF EXISTS "Owners can delete project_tools" ON public.project_tools;

CREATE POLICY "Authenticated users can insert project_tools"
  ON public.project_tools FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = project_tools.project_id
      AND projects.user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Owners can delete project_tools"
  ON public.project_tools FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = project_tools.project_id
      AND projects.user_id = (SELECT auth.uid())
    )
  );