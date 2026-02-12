-- Drop existing table to ensure clean state matching requirements
DROP TABLE IF EXISTS public.proposals;

-- Create proposals table
CREATE TABLE public.proposals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    job_id UUID NOT NULL, -- References the job/project
    freelancer_id UUID NOT NULL REFERENCES public.profiles(id), -- References the freelancer's profile
    employer_id UUID NOT NULL REFERENCES public.profiles(id), -- References the employer's profile
    cover_letter TEXT NOT NULL,
    bid_amount NUMERIC NOT NULL,
    estimated_time TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'shortlisted')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- 1. Freelancers can insert their own proposals
CREATE POLICY "Freelancers can create proposals"
ON public.proposals FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = freelancer_id);

-- 2. Freelancers can view their own proposals
CREATE POLICY "Freelancers can view own proposals"
ON public.proposals FOR SELECT
TO authenticated
USING (auth.uid() = freelancer_id);

-- 3. Employers can view proposals for their jobs
CREATE POLICY "Employers can view proposals for their jobs"
ON public.proposals FOR SELECT
TO authenticated
USING (auth.uid() = employer_id);

-- 4. Employers can update status of proposals for their jobs
CREATE POLICY "Employers can update proposal status"
ON public.proposals FOR UPDATE
TO authenticated
USING (auth.uid() = employer_id);
