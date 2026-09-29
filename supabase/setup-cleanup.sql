-- Run once in the Supabase SQL Editor after the migration.
-- Supabase Cron / pg_cron must be enabled. Jobs run as the SQL Editor database owner.
create extension if not exists pg_cron;
select cron.schedule('discussion-cleanup-hourly', '17 * * * *', 'select public.discussion_cleanup();');
-- Verify: select jobid, jobname, schedule, active from cron.job where jobname = 'discussion-cleanup-hourly';
-- Recent runs: select status, return_message, start_time from cron.job_run_details order by start_time desc limit 10;
