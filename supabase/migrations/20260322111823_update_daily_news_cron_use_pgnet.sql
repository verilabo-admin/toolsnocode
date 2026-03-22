/*
  # Update daily news cron job to use pg_net

  Replaces the previous cron job with one using the correct pg_net syntax
  for making async HTTP calls from within PostgreSQL.
*/

SELECT cron.unschedule('daily-news-fetch');

SELECT cron.schedule(
  'daily-news-fetch',
  '0 7 * * *',
  $$
  SELECT extensions.net.http_post(
    url := 'https://exlupbihqexeeyxwmveh.supabase.co/functions/v1/fetch-and-rewrite-news',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4bHVwYmlocWV4ZWV5eHdtdmVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5ODcwOTYsImV4cCI6MjA4ODU2MzA5Nn0.QkVH7ldnbPR_wl5C5v4AjP_3BsM-6N9cbhZAn22QpA4"}'::jsonb,
    body := '{}'::jsonb
  );
  $$
);
