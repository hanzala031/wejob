-- ==========================================
-- ENABLE SUPABASE REALTIME REPLICATION
-- Run this to fix "WebSocket connection failed" errors.
-- ==========================================

-- 1. Create the realtime publication if it doesn't exist
-- Note: Supabase usually has a 'supabase_realtime' publication by default.
-- We ensure the tables are added to it.

BEGIN;
  -- Enable replication for specific tables
  ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.jobs;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.proposals;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.saved_jobs;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
COMMIT;

-- If 'supabase_realtime' publication does not exist, use this instead:
-- CREATE PUBLICATION supabase_realtime FOR TABLE notifications, messages, jobs, proposals, saved_jobs, profiles;
