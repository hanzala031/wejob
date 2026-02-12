-- Add unique constraint to prevent duplicate applications
ALTER TABLE public.proposals ADD CONSTRAINT unique_freelancer_job UNIQUE (freelancer_id, job_id);

-- Update RLS policies to allow deletion
CREATE POLICY "Freelancers can delete their own proposals"
ON public.proposals FOR DELETE
TO authenticated
USING (auth.uid() = freelancer_id);
