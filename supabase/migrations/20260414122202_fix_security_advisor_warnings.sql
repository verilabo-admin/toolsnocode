/*
  # Fix Supabase Security Advisor warnings

  1. `enforce_tool_video_url_boost` search_path is mutable
    - Recreate the function with `SET search_path = public, pg_temp` so it
      resolves identifiers deterministically and cannot be hijacked via a
      session-level search_path change.

  2. `uploads` bucket exposes a broad SELECT policy on storage.objects
    - The bucket is already `public = true`, so object URLs are served by the
      public CDN without a storage.objects SELECT policy.
    - The `Public read access on uploads` policy additionally allows anonymous
      clients to list bucket contents (enumerate filenames, user folders).
    - Drop it; direct URL access via the CDN is unaffected.
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
