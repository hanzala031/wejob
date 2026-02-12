-- Add more detailed columns to jobs table to match UI requirements
DO $$ 
BEGIN
    -- Add freelancer_type column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='freelancer_type') THEN
        ALTER TABLE public.jobs ADD COLUMN freelancer_type TEXT DEFAULT 'Individual';
    END IF;

    -- Add project_duration column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='project_duration') THEN
        ALTER TABLE public.jobs ADD COLUMN project_duration TEXT;
    END IF;

    -- Add project_level column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='project_level') THEN
        ALTER TABLE public.jobs ADD COLUMN project_level TEXT;
    END IF;

    -- Add languages column if missing (as an array)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='languages') THEN
        ALTER TABLE public.jobs ADD COLUMN languages TEXT[];
    END IF;

    -- Add english_level column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='english_level') THEN
        ALTER TABLE public.jobs ADD COLUMN english_level TEXT;
    END IF;

    -- Add views count if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='views') THEN
        ALTER TABLE public.jobs ADD COLUMN views INTEGER DEFAULT 0;
    END IF;
END $$;
