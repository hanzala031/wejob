-- ========================================================
-- ULTIMATE SUPABASE SCHEMA FIX
-- Run this script in your Supabase SQL Editor to ensure
-- all tables and columns exist for the new features.
-- ========================================================

-- 1. JOBS TABLE UPDATES
DO $$ 
BEGIN
    -- Base columns (if not already there from previous scripts)
    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'jobs') THEN
        CREATE TABLE public.jobs (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            employer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
            title TEXT NOT NULL,
            description TEXT,
            category TEXT,
            budget NUMERIC,
            salary_min NUMERIC DEFAULT 0,
            salary_max NUMERIC DEFAULT 0,
            status TEXT DEFAULT 'pending',
            type TEXT,
            location TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );
    END IF;

    -- Add missing metadata columns
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='skills') THEN
        ALTER TABLE public.jobs ADD COLUMN skills TEXT[];
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='experience_level') THEN
        ALTER TABLE public.jobs ADD COLUMN experience_level TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='is_approved') THEN
        ALTER TABLE public.jobs ADD COLUMN is_approved BOOLEAN DEFAULT false;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='freelancer_type') THEN
        ALTER TABLE public.jobs ADD COLUMN freelancer_type TEXT DEFAULT 'Individual';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='project_duration') THEN
        ALTER TABLE public.jobs ADD COLUMN project_duration TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='project_level') THEN
        ALTER TABLE public.jobs ADD COLUMN project_level TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='languages') THEN
        ALTER TABLE public.jobs ADD COLUMN languages TEXT[];
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='english_level') THEN
        ALTER TABLE public.jobs ADD COLUMN english_level TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='views') THEN
        ALTER TABLE public.jobs ADD COLUMN views INTEGER DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='deadline') THEN
        ALTER TABLE public.jobs ADD COLUMN deadline DATE;
    END IF;
END $$;

-- 2. MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sender_id UUID REFERENCES auth.users(id) NOT NULL,
    receiver_id UUID REFERENCES auth.users(id) NOT NULL,
    job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info',
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. PROPOSALS TABLE
CREATE TABLE IF NOT EXISTS public.proposals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
    freelancer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    bid_amount NUMERIC NOT NULL,
    estimated_time TEXT,
    cover_letter TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 5. ENABLE RLS & POLICIES (BASIC)
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;

-- Job Policies
DROP POLICY IF EXISTS "Jobs are viewable by everyone" ON public.jobs;
CREATE POLICY "Jobs are viewable by everyone" ON public.jobs FOR SELECT USING (true);

DROP POLICY IF EXISTS "Employers can insert jobs" ON public.jobs;
CREATE POLICY "Employers can insert jobs" ON public.jobs FOR INSERT WITH CHECK (auth.uid() = employer_id);

DROP POLICY IF EXISTS "Employers can update their own jobs" ON public.jobs;
CREATE POLICY "Employers can update their own jobs" ON public.jobs FOR UPDATE USING (auth.uid() = employer_id);

-- Proposal Policies
DROP POLICY IF EXISTS "Proposals viewable by employer and freelancer" ON public.proposals;
CREATE POLICY "Proposals viewable by employer and freelancer" ON public.proposals 
FOR SELECT USING (
    auth.uid() = freelancer_id OR 
    EXISTS (SELECT 1 FROM public.jobs WHERE id = job_id AND employer_id = auth.uid())
);

DROP POLICY IF EXISTS "Freelancers can insert proposals" ON public.proposals;
CREATE POLICY "Freelancers can insert proposals" ON public.proposals FOR INSERT WITH CHECK (auth.uid() = freelancer_id);
