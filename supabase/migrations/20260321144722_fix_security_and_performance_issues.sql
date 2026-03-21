/*
  # Fix Security and Performance Issues

  ## Summary
  This migration addresses several security and performance issues:

  1. **Missing Index**: Adds a covering index on `projects.user_id` to fix the unindexed foreign key
     performance issue.

  2. **Unused Indexes Removed**: Drops the following unused indexes to reduce storage and write overhead:
     - `idx_project_tools_tool_id` on `project_tools`
     - `idx_claims_item` on `claims`
     - `idx_claims_user` on `claims`
     - `idx_votes_user` on `votes`

  3. **Multiple Permissive UPDATE Policies Fixed**: Merges the two UPDATE policies on `tools` and
     `experts` into a single RESTRICTIVE policy each, to avoid unintended permission combinations:
     - Old: "Authenticated users can claim unclaimed tools" + "Owners can update their tools"
     - New: Single policy allowing update if user owns the row OR the row is unclaimed

  4. **Mutable search_path Fixed**: Recreates `update_upvote_count` with a fixed `search_path`
     to prevent search path injection attacks.
*/

-- 1. Add index on projects.user_id (unindexed foreign key)
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects (user_id);

-- 2. Drop unused indexes
DROP INDEX IF EXISTS public.idx_project_tools_tool_id;
DROP INDEX IF EXISTS public.idx_claims_item;
DROP INDEX IF EXISTS public.idx_claims_user;
DROP INDEX IF EXISTS public.idx_votes_user;

-- 3. Fix multiple permissive UPDATE policies on tools
DROP POLICY IF EXISTS "Authenticated users can claim unclaimed tools" ON public.tools;
DROP POLICY IF EXISTS "Owners can update their tools" ON public.tools;

CREATE POLICY "Owners and claimants can update tools"
  ON public.tools
  FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.uid()) OR user_id IS NULL)
  WITH CHECK (user_id = (SELECT auth.uid()));

-- 4. Fix multiple permissive UPDATE policies on experts
DROP POLICY IF EXISTS "Authenticated users can claim unclaimed experts" ON public.experts;
DROP POLICY IF EXISTS "Owners can update their experts" ON public.experts;

CREATE POLICY "Owners and claimants can update experts"
  ON public.experts
  FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.uid()) OR user_id IS NULL)
  WITH CHECK (user_id = (SELECT auth.uid()));

-- 5. Fix mutable search_path on update_upvote_count function
CREATE OR REPLACE FUNCTION public.update_upvote_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.item_type = 'tools' THEN
      UPDATE tools SET upvotes = (SELECT COUNT(*) FROM votes WHERE item_type = 'tools' AND item_id = NEW.item_id) WHERE id = NEW.item_id;
    ELSIF NEW.item_type = 'projects' THEN
      UPDATE projects SET upvotes = (SELECT COUNT(*) FROM votes WHERE item_type = 'projects' AND item_id = NEW.item_id) WHERE id = NEW.item_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.item_type = 'tools' THEN
      UPDATE tools SET upvotes = (SELECT COUNT(*) FROM votes WHERE item_type = 'tools' AND item_id = OLD.item_id) WHERE id = OLD.item_id;
    ELSIF OLD.item_type = 'projects' THEN
      UPDATE projects SET upvotes = (SELECT COUNT(*) FROM votes WHERE item_type = 'projects' AND item_id = OLD.item_id) WHERE id = OLD.item_id;
    END IF;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;
