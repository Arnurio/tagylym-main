-- Migration: Create feedback table for general inquiries
CREATE TABLE IF NOT EXISTS public.feedback (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (anonymous/authenticated)
CREATE POLICY "Allow anonymous feedback submission" ON public.feedback
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Restrict SELECT (only internal use if needed)
-- COMMENT ON TABLE public.feedback IS 'General feedback and inquiries from the Resources page';
