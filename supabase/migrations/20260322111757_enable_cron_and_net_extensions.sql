/*
  # Enable pg_cron and pg_net extensions

  Required for scheduling daily jobs and making HTTP calls from the database.
*/

CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;
