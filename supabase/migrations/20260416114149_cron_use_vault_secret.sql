/*
  # Daily news cron — use Vault secrets for auth

  Replaces hardcoded anon JWT with values pulled from Vault at execution time.
  Requires two Vault secrets to be created manually in the Supabase dashboard
  (Database → Vault):
    - supabase_anon_key        (the project's anon JWT)
    - cron_shared_secret       (random string matching CRON_SECRET env var
                                set on fetch-and-rewrite-news function)

  If either secret is missing the cron will no-op rather than error loudly.
*/

SELECT cron.unschedule('daily-news-fetch');

SELECT cron.schedule(
  'daily-news-fetch',
  '0 7 * * *',
  $$
  SELECT extensions.net.http_post(
    url := 'https://exlupbihqexeeyxwmveh.supabase.co/functions/v1/fetch-and-rewrite-news',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || (
        SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'supabase_anon_key' LIMIT 1
      ),
      'X-Cron-Secret', (
        SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'cron_shared_secret' LIMIT 1
      )
    ),
    body := '{}'::jsonb
  )
  WHERE EXISTS (SELECT 1 FROM vault.decrypted_secrets WHERE name = 'cron_shared_secret');
  $$
);
