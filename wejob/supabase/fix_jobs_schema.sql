-- Add missing columns to jobs table
DO $$ 
BEGIN
    -- Add skills column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='skills') THEN
        ALTER TABLE public.jobs ADD COLUMN skills TEXT[];
    END IF;

    -- Add experience_level column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='experience_level') THEN
        ALTER TABLE public.jobs ADD COLUMN experience_level TEXT;
    END IF;

    -- Add is_approved column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='is_approved') THEN
        ALTER TABLE public.jobs ADD COLUMN is_approved BOOLEAN DEFAULT false;
    END IF;
END $$;
