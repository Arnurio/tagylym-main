-- SQL Migration: Tagylym LMS Core Schema

-- 1. Courses Table
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    slug TEXT UNIQUE NOT NULL, -- e.g. 'fll-challenge'
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Modules Table
CREATE TABLE IF NOT EXISTS public.modules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Lessons Table
CREATE TABLE IF NOT EXISTS public.lessons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    module_id UUID REFERENCES public.modules(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    presentation_url TEXT, -- Link to Google Drive embed or PDF
    video_url TEXT,        -- Link to video player
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Course Enrollments (Stepik-style enrollment)
CREATE TABLE IF NOT EXISTS public.enrollments (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (user_id, course_id)
);

-- 5. User Progress Table
CREATE TABLE IF NOT EXISTS public.user_progress (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE NOT NULL,
    is_completed BOOLEAN DEFAULT false NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (user_id, lesson_id)
);

-- ENABLE RLS
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- POLICIES

-- Everyone (anon and auth) can read courses, modules, and lessons
CREATE POLICY "Allow public read-only access to courses" ON public.courses FOR SELECT TO public USING (true);
CREATE POLICY "Allow public read-only access to modules" ON public.modules FOR SELECT TO public USING (true);
CREATE POLICY "Allow public read-only access to lessons" ON public.lessons FOR SELECT TO public USING (true);

-- Enrollments: User can see their own, can join a course
CREATE POLICY "Users can view their own enrollments" ON public.enrollments 
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can enroll themselves" ON public.enrollments 
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Users can only see and modify their own progress
CREATE POLICY "Users can view their own progress" ON public.user_progress 
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" ON public.user_progress 
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can modify their own progress" ON public.user_progress 
    FOR UPDATE TO authenticated USING (auth.uid() = user_id);
