-- 1. Fix Profiles Table
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'profiles') THEN
        CREATE TABLE public.profiles (
            id UUID REFERENCES auth.users(id) PRIMARY KEY,
            full_name TEXT,
            company_name TEXT,
            avatar_url TEXT,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='full_name') THEN
            ALTER TABLE public.profiles ADD COLUMN full_name TEXT;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='company_name') THEN
            ALTER TABLE public.profiles ADD COLUMN company_name TEXT;
        END IF;
    END IF;
END $$;

-- 2. Fix Jobs Table
DO $$ 
BEGIN
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
            status TEXT DEFAULT 'open',
            type TEXT,
            location TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='status') THEN
            ALTER TABLE public.jobs ADD COLUMN status TEXT DEFAULT 'open';
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='salary_min') THEN
            ALTER TABLE public.jobs ADD COLUMN salary_min NUMERIC DEFAULT 0;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='salary_max') THEN
            ALTER TABLE public.jobs ADD COLUMN salary_max NUMERIC DEFAULT 0;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='employer_id') THEN
            ALTER TABLE public.jobs ADD COLUMN employer_id UUID REFERENCES auth.users(id);
        END IF;
    END IF;
END $$;

-- 3. Fix Proposals Table
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'proposals') THEN
        CREATE TABLE public.proposals (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
            freelancer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
            bid_amount NUMERIC NOT NULL,
            estimated_time TEXT,
            cover_letter TEXT,
            status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );
    ELSE
        -- Rename user_id to freelancer_id if it exists
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='proposals' AND column_name='user_id') THEN
            ALTER TABLE public.proposals RENAME COLUMN user_id TO freelancer_id;
        END IF;
        -- Rename project_id to job_id if it exists
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='proposals' AND column_name='project_id') THEN
            ALTER TABLE public.proposals RENAME COLUMN project_id TO job_id;
        END IF;
        -- Ensure freelancer_id exists
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='proposals' AND column_name='freelancer_id') THEN
            ALTER TABLE public.proposals ADD COLUMN freelancer_id UUID REFERENCES auth.users(id);
        END IF;
        -- Ensure job_id exists
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='proposals' AND column_name='job_id') THEN
            ALTER TABLE public.proposals ADD COLUMN job_id UUID REFERENCES public.jobs(id);
        END IF;
        -- Ensure status exists
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='proposals' AND column_name='status') THEN
            ALTER TABLE public.proposals ADD COLUMN status TEXT DEFAULT 'pending';
        END IF;
    END IF;
END $$;

-- 4. Create Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 5. Create Contracts Table
CREATE TABLE IF NOT EXISTS public.contracts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
    freelancer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    employer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paid', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;

-- Simple RLS Policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Jobs are viewable by everyone" ON public.jobs;
CREATE POLICY "Jobs are viewable by everyone" ON public.jobs FOR SELECT USING (true);
DROP POLICY IF EXISTS "Employers can insert jobs" ON public.jobs;
CREATE POLICY "Employers can insert jobs" ON public.jobs FOR INSERT WITH CHECK (auth.uid() = employer_id);

DROP POLICY IF EXISTS "Freelancers can view and insert their proposals" ON public.proposals;
CREATE POLICY "Freelancers can view and insert their proposals" ON public.proposals FOR ALL USING (auth.uid() = freelancer_id);
DROP POLICY IF EXISTS "Notifications are private" ON public.notifications;
CREATE POLICY "Notifications are private" ON public.notifications FOR ALL USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Contracts are viewable by parties" ON public.contracts;
CREATE POLICY "Contracts are viewable by parties" ON public.contracts FOR SELECT USING (auth.uid() = freelancer_id OR auth.uid() = employer_id);