/*
  # Stripe webhook idempotency table

  Tracks processed Stripe event IDs so duplicate webhook deliveries
  (Stripe retries on timeout/5xx) don't cause duplicate side effects
  like duplicated orders or double boost activations.
*/

CREATE TABLE IF NOT EXISTS public.stripe_webhook_events (
  event_id text PRIMARY KEY,
  event_type text NOT NULL,
  processed_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_stripe_webhook_events_processed_at
  ON public.stripe_webhook_events (processed_at);

ALTER TABLE public.stripe_webhook_events ENABLE ROW LEVEL SECURITY;
