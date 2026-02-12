-- Add columns for Freelancer Profile
DO $$ 
BEGIN
    -- title
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='title') THEN
        ALTER TABLE public.profiles ADD COLUMN title TEXT;
    END IF;

    -- hourly_rate
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='hourly_rate') THEN
        ALTER TABLE public.profiles ADD COLUMN hourly_rate NUMERIC DEFAULT 0;
    END IF;

    -- experience_level
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='experience_level') THEN
        ALTER TABLE public.profiles ADD COLUMN experience_level TEXT DEFAULT 'Entry Level';
    END IF;

    -- bio
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='bio') THEN
        ALTER TABLE public.profiles ADD COLUMN bio TEXT;
    END IF;

    -- skills
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='skills') THEN
        ALTER TABLE public.profiles ADD COLUMN skills TEXT[];
    END IF;

    -- phone
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='phone') THEN
        ALTER TABLE public.profiles ADD COLUMN phone TEXT;
    END IF;

    -- location
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='location') THEN
        ALTER TABLE public.profiles ADD COLUMN location TEXT;
    END IF;

    -- cover_url
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='cover_url') THEN
        ALTER TABLE public.profiles ADD COLUMN cover_url TEXT;
    END IF;
END $$;
