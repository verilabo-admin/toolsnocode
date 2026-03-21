/*
  # Add Voting System

  ## Overview
  Implements a proper upvote system that prevents duplicate voting.
  Each user can vote once per item. Votes are tracked in a dedicated
  table and the upvote count on tools/projects is updated via triggers.

  ## New Tables
  - `votes`
    - `id` (uuid, primary key)
    - `user_id` (uuid) - the voter, references auth.users
    - `item_type` (text) - 'tools' or 'projects'
    - `item_id` (uuid) - the voted item
    - `created_at` (timestamptz)
    - UNIQUE constraint on (user_id, item_type, item_id) to prevent duplicates

  ## Functions & Triggers
  - `update_upvote_count()` - trigger function that recalculates the upvotes
    column on tools/projects whenever a vote is inserted or deleted

  ## Security
  - RLS enabled on votes table
  - Authenticated users can insert their own votes
  - Authenticated users can delete their own votes (un-vote)
  - Anyone can read votes (needed to show vote counts and user's own vote state)
*/

CREATE TABLE IF NOT EXISTS public.votes (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_type  text NOT NULL CHECK (item_type IN ('tools', 'projects')),
  item_id    uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id, item_type, item_id)
);

CREATE INDEX IF NOT EXISTS idx_votes_item  ON public.votes (item_type, item_id);
CREATE INDEX IF NOT EXISTS idx_votes_user  ON public.votes (user_id);

ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view votes"
  ON public.votes FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Users can insert own votes"
  ON public.votes FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can delete own votes"
  ON public.votes FOR DELETE
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE OR REPLACE FUNCTION public.update_upvote_count()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_update_upvote_count ON public.votes;

CREATE TRIGGER trigger_update_upvote_count
  AFTER INSERT OR DELETE ON public.votes
  FOR EACH ROW EXECUTE FUNCTION public.update_upvote_count();
