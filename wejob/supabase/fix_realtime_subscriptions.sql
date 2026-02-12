-- ==========================================
-- FIX REALTIME SUBSCRIPTION FAILURES
-- Run this script in the Supabase SQL Editor.
-- ==========================================

BEGIN;

-- 1. Ensure REPLICA IDENTITY is set to FULL for tables that need realtime updates.
-- This is crucial for receiving UPDATE and DELETE events correctly.
ALTER TABLE public.notifications REPLICA IDENTITY FULL;
ALTER TABLE public.messages REPLICA IDENTITY FULL;
ALTER TABLE public.jobs REPLICA IDENTITY FULL;
ALTER TABLE public.proposals REPLICA IDENTITY FULL;
ALTER TABLE public.earnings REPLICA IDENTITY FULL; 
ALTER TABLE public.profiles REPLICA IDENTITY FULL;

-- 2. Ensure the 'supabase_realtime' publication exists.
-- If it doesn't exist, create it. If it does, we'll just add tables to it.
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
        CREATE PUBLICATION supabase_realtime;
    END IF;
END
$$;

-- 3. Add tables to the publication.
-- We use "ALTER PUBLICATION ... ADD TABLE" which is idempotent (safe to run multiple times).
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.jobs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.proposals;
ALTER PUBLICATION supabase_realtime ADD TABLE public.earnings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;

COMMIT;
