-- Run these commands in your Supabase SQL Editor to fix EVERYTHING

-- 1. Create Waitlist Table
CREATE TABLE IF NOT EXISTS public.waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  track TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Enable RLS
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;

-- 3. Create Insertion Policies
DROP POLICY IF EXISTS "Allow anonymous waitlist join" ON public.waitlist;
CREATE POLICY "Allow anonymous waitlist join" ON public.waitlist
    FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anonymous feedback submission" ON public.feedback;
CREATE POLICY "Allow anonymous feedback submission" ON public.feedback
    FOR INSERT TO anon, authenticated WITH CHECK (true);

-- 4. Create Read Policies (for content)
DROP POLICY IF EXISTS "anyone can read quizzes" ON public.quizzes;
CREATE POLICY "anyone can read quizzes" ON public.quizzes FOR SELECT USING (true);

DROP POLICY IF EXISTS "anyone can read courses" ON public.courses;
CREATE POLICY "anyone can read courses" ON public.courses FOR SELECT USING (true);

DROP POLICY IF EXISTS "anyone can read lessons" ON public.lessons;
CREATE POLICY "anyone can read lessons" ON public.lessons FOR SELECT USING (true);

DROP POLICY IF EXISTS "anyone can read categories" ON public.categories;
CREATE POLICY "anyone can read categories" ON public.categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "anyone can read levels" ON public.levels;
CREATE POLICY "anyone can read levels" ON public.levels FOR SELECT USING (true);

-- 5. Seed Initial Tracks & Courses
-- Categories
INSERT INTO public.categories (id, name, name_kk, name_en) VALUES
  ('fll-cat', 'FIRST LEGO League', 'FIRST LEGO League', 'FIRST LEGO League'),
  ('ftc-cat', 'FIRST Tech Challenge', 'FIRST Tech Challenge', 'FIRST Tech Challenge'),
  ('fgc-cat', 'FIRST Global Challenge', 'FIRST Global Challenge', 'FIRST Global Challenge')
ON CONFLICT (id) DO NOTHING;

-- Levels
INSERT INTO public.levels (id, category_id, name, name_kk, name_en) VALUES
  ('fll-lvl-1', 'fll-cat', 'Masterclass', 'Masterclass', 'Masterclass'),
  ('ftc-lvl-1', 'ftc-cat', 'DECODE™', 'DECODE™', 'DECODE™'),
  ('fgc-lvl-1', 'fgc-cat', 'Incheon 2026', 'Incheon 2026', 'Incheon 2026')
ON CONFLICT (id) DO NOTHING;

-- Courses
INSERT INTO public.courses (id, level_id, title, slug, "order") VALUES
  ('fll-masterclass', 'fll-lvl-1', 'FLL Masterclass', 'fll', 10),
  ('ftc-decode', 'ftc-lvl-1', 'FTC DECODE™', 'ftc', 20),
  ('fgc-incheon', 'fgc-lvl-1', 'FGC Incheon 2026', 'fgc', 30)
ON CONFLICT (id) DO NOTHING;

-- Placeholder Lesson for FLL (to see count)
INSERT INTO public.lessons (id, course_id, title, slug, "order") VALUES
  ('fll-lesson-1', 'fll-masterclass', 'Введение в FLL', 'intro', 10),
  ('ftc-lesson-1', 'ftc-decode', 'Getting Started with FTC', 'intro', 10)
ON CONFLICT (id) DO NOTHING;
