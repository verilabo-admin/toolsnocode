/*
  # Re-apply security advisor fix (after revert at 20260414183522)

  Same content as 20260414122202. Re-hardens `enforce_tool_video_url_boost`
  with `SET search_path = public, pg_temp` and removes the broad SELECT policy
  on the `uploads` bucket (CDN serves it publicly without that policy).
*/

CREATE OR REPLACE FUNCTION public.enforce_tool_video_url_boost()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
  IF COALESCE(NEW.is_boosted, false) = false THEN
    NEW.video_url := '';
  END IF;
  RETURN NEW;
END;
$$;

DROP POLICY IF EXISTS "Public read access on uploads" ON storage.objects;
