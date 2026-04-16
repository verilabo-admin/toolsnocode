/*
  # Revert security advisor warnings fix

  Applied in remote before the re-fix at 20260414185612. Keeps local migration
  history aligned with what was actually executed against the remote project:

  1. Drops the `search_path` hardening on `enforce_tool_video_url_boost` — the
     function is recreated without `SET search_path`.
  2. Re-creates the `Public read access on uploads` policy on `storage.objects`
     that was removed by the initial fix.

  The follow-up migration `20260414185612_fix_security_advisor_warnings.sql`
  re-applies the hardening.
*/

CREATE OR REPLACE FUNCTION public.enforce_tool_video_url_boost()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF COALESCE(NEW.is_boosted, false) = false THEN
    NEW.video_url := '';
  END IF;
  RETURN NEW;
END;
$$;

CREATE POLICY "Public read access on uploads"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'uploads');
