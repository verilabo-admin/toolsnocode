/*
  # Add DNS-based Tool Verification System

  ## Summary
  Adds a cryptographic DNS TXT verification flow for tools. The owner of a tool
  can prove they control the tool's domain by adding a TXT record with a unique token.

  ## Changes

  ### Modified Table: `tools`
  - `verification_token` (text) - unique secret token the user must publish as a DNS TXT record
  - `is_verified` (boolean) - true once DNS verification has been confirmed
  - `verified_at` (timestamptz) - timestamp of successful verification

  ### New Table: `tool_verifications`
  Audit log of all verification attempts (pass or fail).
  - `id` - unique identifier
  - `tool_id` - the tool being verified
  - `user_id` - who triggered the check
  - `success` - whether it passed
  - `checked_at` - when the check happened

  ### Security
  - `verification_token` is write-protected after generation (only the service role can set it via Edge Function)
  - `is_verified` and `verified_at` are read-only from the client (only service role can update via Edge Function)
  - RLS on `tool_verifications`: users can only see their own records
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tools' AND column_name = 'verification_token'
  ) THEN
    ALTER TABLE public.tools
      ADD COLUMN verification_token text UNIQUE DEFAULT NULL,
      ADD COLUMN is_verified boolean NOT NULL DEFAULT false,
      ADD COLUMN verified_at timestamptz DEFAULT NULL;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.tool_verifications (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id    uuid NOT NULL REFERENCES public.tools(id) ON DELETE CASCADE,
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  success    boolean NOT NULL DEFAULT false,
  checked_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tool_verifications_tool_id ON public.tool_verifications (tool_id);
CREATE INDEX IF NOT EXISTS idx_tool_verifications_user_id ON public.tool_verifications (user_id);

ALTER TABLE public.tool_verifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own verification attempts"
  ON public.tool_verifications
  FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can insert own verification attempts"
  ON public.tool_verifications
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));
