/*
  # Client-side error log table

  Cheap self-hosted alternative to Sentry: the React `ErrorBoundary` inserts
  a row here when it catches an unhandled render error. No SELECT policy —
  reads are service_role-only (via dashboard or admin-side scripts) so one
  user cannot scrape another user's stack traces.
*/

CREATE TABLE IF NOT EXISTS public.client_errors (
  id bigint primary key generated always as identity,
  message text NOT NULL,
  stack text,
  component_stack text,
  url text,
  user_agent text,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_client_errors_created_at
  ON public.client_errors (created_at DESC);

ALTER TABLE public.client_errors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can report client errors"
  ON public.client_errors FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
