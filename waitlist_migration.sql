CREATE TABLE IF NOT EXISTS public.waitlist (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL,
    competition TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Turn on row level security
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts
CREATE POLICY "Allow anonymous inserts" ON public.waitlist
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Allow authenticated inserts
CREATE POLICY "Allow authenticated inserts" ON public.waitlist
    FOR INSERT
    TO authenticated
    WITH CHECK (true);
