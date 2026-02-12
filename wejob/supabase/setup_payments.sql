
-- Setup Milestone-based Payments and Wallet
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS wallet_balance NUMERIC DEFAULT 0;

-- Milestones Table
CREATE TABLE IF NOT EXISTS public.milestones (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
    freelancer_id UUID REFERENCES auth.users(id),
    employer_id UUID REFERENCES auth.users(id),
    title TEXT NOT NULL,
    description TEXT,
    amount NUMERIC NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'funded', 'submitted', 'released', 'cancelled')),
    due_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Payments Table
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    milestone_id UUID REFERENCES public.milestones(id) ON DELETE CASCADE,
    stripe_payment_intent_id TEXT,
    amount NUMERIC NOT NULL,
    status TEXT DEFAULT 'created',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view milestones related to them" ON public.milestones
    FOR SELECT USING (auth.uid() = freelancer_id OR auth.uid() = employer_id);

CREATE POLICY "Employers can manage milestones" ON public.milestones
    FOR ALL USING (auth.uid() = employer_id);

CREATE POLICY "Freelancers can update status to submitted" ON public.milestones
    FOR UPDATE USING (auth.uid() = freelancer_id);

CREATE POLICY "Users can view their own payments" ON public.payments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.milestones 
            WHERE milestones.id = payments.milestone_id 
            AND (milestones.employer_id = auth.uid() OR milestones.freelancer_id = auth.uid())
        )
    );
