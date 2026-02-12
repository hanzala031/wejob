-- ==========================================
-- FINAL DATABASE SCHEMA FIX (v2)
-- Run this to resolve all 400/404 Errors
-- ==========================================

-- 1. NOTIFICATIONS TABLE
-- Ensure all columns used in frontend exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'notifications') THEN
        CREATE TABLE public.notifications (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
            title TEXT,
            message TEXT NOT NULL,
            type TEXT DEFAULT 'info',
            link TEXT,
            is_read BOOLEAN DEFAULT false,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );
    ELSE
        -- Add missing columns to existing table
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='notifications' AND column_name='title') THEN
            ALTER TABLE public.notifications ADD COLUMN title TEXT;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='notifications' AND column_name='type') THEN
            ALTER TABLE public.notifications ADD COLUMN type TEXT DEFAULT 'info';
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='notifications' AND column_name='link') THEN
            ALTER TABLE public.notifications ADD COLUMN link TEXT;
        END IF;
        -- Fix read vs is_read
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='notifications' AND column_name='read') THEN
            ALTER TABLE public.notifications RENAME COLUMN "read" TO is_read;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='notifications' AND column_name='is_read') THEN
            ALTER TABLE public.notifications ADD COLUMN is_read BOOLEAN DEFAULT false;
        END IF;
    END IF;
END $$;

-- 2. MESSAGES TABLE
-- Ensure sender_id and receiver_id exist (400 Error Fix)
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'messages') THEN
        CREATE TABLE public.messages (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            sender_id UUID REFERENCES auth.users(id) NOT NULL,
            receiver_id UUID REFERENCES auth.users(id) NOT NULL,
            content TEXT NOT NULL,
            is_read BOOLEAN DEFAULT false,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );
    ELSE
        -- Add job_id if missing (optional but good for tracking)
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='messages' AND column_name='job_id') THEN
            ALTER TABLE public.messages ADD COLUMN job_id UUID REFERENCES public.jobs(id);
        END IF;
    END IF;
END $$;

-- 3. PROPOSALS TABLE
-- Fix 'amount' vs 'bid_amount' column mismatch
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='proposals' AND column_name='amount') THEN
        ALTER TABLE public.proposals RENAME COLUMN amount TO bid_amount;
    END IF;
END $$;

-- 4. ENABLE REALTIME
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.proposals;
