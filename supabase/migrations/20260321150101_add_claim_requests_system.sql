/*
  # Add Claim Requests System with Validation

  ## Summary
  Replaces the instant claim mechanism with a request-based approval flow to prevent
  unauthorized profile hijacking.

  ## Changes

  ### New Table: `claim_requests`
  Stores pending/reviewed claim requests before ownership is granted.
  - `id` - unique identifier
  - `item_type` - 'tools' or 'experts'
  - `item_id` - the item being claimed
  - `user_id` - the requesting user
  - `status` - 'pending' | 'approved' | 'rejected'
  - `justification` - required text explaining why the user owns this listing
  - `contact_proof` - optional URL or contact info as proof (website, social profile, etc.)
  - `admin_note` - optional note from reviewer
  - `reviewed_at` - when the request was reviewed
  - `created_at` - when the request was submitted

  ### Modified Table: `claims`
  The existing `claims` table now acts as the audit log of approved claims only.
  No structural change needed.

  ### Security
  - RLS enabled on `claim_requests`
  - Users can only view and create their own requests
  - Users cannot approve/reject their own requests (admin-only via service role)
  - Prevents duplicate pending requests for same item by same user
*/

CREATE TABLE IF NOT EXISTS public.claim_requests (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_type     text NOT NULL CHECK (item_type IN ('tools', 'experts')),
  item_id       uuid NOT NULL,
  user_id       uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status        text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  justification text NOT NULL,
  contact_proof text NOT NULL DEFAULT '',
  admin_note    text NOT NULL DEFAULT '',
  reviewed_at   timestamptz,
  created_at    timestamptz DEFAULT now(),
  UNIQUE (item_id, user_id, item_type)
);

CREATE INDEX IF NOT EXISTS idx_claim_requests_user_id ON public.claim_requests (user_id);
CREATE INDEX IF NOT EXISTS idx_claim_requests_item ON public.claim_requests (item_type, item_id);
CREATE INDEX IF NOT EXISTS idx_claim_requests_status ON public.claim_requests (status);

ALTER TABLE public.claim_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own claim requests"
  ON public.claim_requests
  FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can insert own claim requests"
  ON public.claim_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));
