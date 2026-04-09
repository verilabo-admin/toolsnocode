/*
  # Enforce that video_url is only set on boosted tools

  1. Trigger
    - `enforce_tool_video_url_boost` on `tools` BEFORE INSERT OR UPDATE
    - If `is_boosted = false`, force `video_url = ''`
    - Prevents non-boosted owners from bypassing the client UI gate

  2. Data hygiene
    - Clear any existing `video_url` values on tools that are not currently boosted
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

DROP TRIGGER IF EXISTS enforce_tool_video_url_boost ON public.tools;
CREATE TRIGGER enforce_tool_video_url_boost
  BEFORE INSERT OR UPDATE ON public.tools
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_tool_video_url_boost();

UPDATE public.tools
SET video_url = ''
WHERE COALESCE(is_boosted, false) = false
  AND COALESCE(video_url, '') <> '';
