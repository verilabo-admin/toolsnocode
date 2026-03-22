/*
  # Daily news fetch cron job

  Creates a pg_cron job that runs every day at 7:00 AM UTC.
  Calls the fetch-and-rewrite-news Edge Function via HTTP POST using pg_net.

  The job:
  - Fires at 07:00 UTC daily
  - Calls the Edge Function which fetches news from NewsAPI
  - Rewrites each article with OpenAI GPT-4o-mini
  - Saves new articles to the news table (skips duplicates)
*/

SELECT cron.schedule(
  'daily-news-fetch',
  '0 7 * * *',
  $$
  SELECT extensions.http_post(
    url := 'https://exlupbihqexeeyxwmveh.supabase.co/functions/v1/fetch-and-rewrite-news',
    headers := ARRAY[
      extensions.http_header('Content-Type', 'application/json'),
      extensions.http_header('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4bHVwYmlocWV4ZWV5eHdtdmVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5ODcwOTYsImV4cCI6MjA4ODU2MzA5Nn0.QkVH7ldnbPR_wl5C5v4AjP_3BsM-6N9cbhZAn22QpA4')
    ],
    content_type := 'application/json',
    content := '{}'
  );
  $$
);
