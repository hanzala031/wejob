-- Create proposals table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.proposals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    bid_amount NUMERIC NOT NULL,
    estimated_time TEXT NOT NULL,
    cover_letter TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can create their own proposals"
ON public.proposals FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own proposals"
ON public.proposals FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Note: You might need policies for employers to view proposals for their projects
-- But since we don't have the full projects table definition here, we'll skip that for now
-- or assume a simple check if the project belongs to the viewer.
