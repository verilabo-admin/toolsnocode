/*
  # Add Claim Ownership System

  ## Overview
  Allows authenticated users to claim unclaimed tool and expert listings
  (those where user_id IS NULL). Claims are instant and automatic for
  unclaimed items. An audit trail is stored in the claims table.

  ## New Tables
  - `claims`
    - `id` (uuid, primary key)
    - `item_type` (text) - 'tools' or 'experts'
    - `item_id` (uuid) - references the claimed item
    - `claimed_by` (uuid) - the user who claimed it
    - `claimed_at` (timestamptz) - when the claim was made

  ## Security Changes
  - Enable RLS on claims table
  - Users can insert their own claim audit records
  - Users can view their own claims
  - New UPDATE policy on tools: allows claiming when user_id IS NULL
  - New UPDATE policy on experts: allows claiming when user_id IS NULL

  ## Important Notes
  1. The existing owner update policies are NOT changed
  2. The new claim policies are additive - Postgres allows the row update
     if ANY policy's USING clause passes
  3. The WITH CHECK on claim policies ensures users can only set user_id
     to their own auth.uid(), preventing ownership spoofing
  4. Once claimed, only the new owner (via the existing owner policy) can update
*/

CREATE TABLE IF NOT EXISTS public.claims (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_type  text NOT NULL CHECK (item_type IN ('tools', 'experts')),
  item_id    uuid NOT NULL,
  claimed_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  claimed_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_claims_item ON public.claims (item_type, item_id);
CREATE INDEX IF NOT EXISTS idx_claims_user ON public.claims (claimed_by);

ALTER TABLE public.claims ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own claims"
  ON public.claims FOR INSERT
  TO authenticated
  WITH CHECK (claimed_by = (SELECT auth.uid()));

CREATE POLICY "Users can view own claims"
  ON public.claims FOR SELECT
  TO authenticated
  USING (claimed_by = (SELECT auth.uid()));

CREATE POLICY "Authenticated users can claim unclaimed tools"
  ON public.tools FOR UPDATE
  TO authenticated
  USING (user_id IS NULL)
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Authenticated users can claim unclaimed experts"
  ON public.experts FOR UPDATE
  TO authenticated
  USING (user_id IS NULL)
  WITH CHECK (user_id = (SELECT auth.uid()));
