  -- ═══════════════════════════════════════════════════════
  -- TAGYLYM — Database Schema
  -- Run in Supabase SQL Editor or via apply-schema.mjs
  -- ═══════════════════════════════════════════════════════

  -- 1. users (extends auth.users)
  CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'student',
    subscription_tier TEXT NOT NULL DEFAULT 'free',
    team_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );

  -- 2. teams
  CREATE TABLE IF NOT EXISTS public.teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    coach_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    competition_type TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );

  ALTER TABLE public.users
    ADD CONSTRAINT fk_users_team
    FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE SET NULL;

  -- 3. competitions
  CREATE TABLE IF NOT EXISTS public.competitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL
  );

  -- 4. seasons
  CREATE TABLE IF NOT EXISTS public.seasons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    competition_id UUID NOT NULL REFERENCES public.competitions(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    year INT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );

  -- 5. categories
  CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    season_id UUID NOT NULL REFERENCES public.seasons(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    icon TEXT NOT NULL,
    "order" INT NOT NULL DEFAULT 0
  );

  -- 6. levels
  CREATE TABLE IF NOT EXISTS public.levels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    color TEXT NOT NULL,
    "order" INT NOT NULL DEFAULT 0
  );

  -- 7. courses
  CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    level_id UUID NOT NULL REFERENCES public.levels(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    "order" INT NOT NULL DEFAULT 0
  );

  -- 8. lessons
  CREATE TABLE IF NOT EXISTS public.lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    video_url TEXT,
    content_md TEXT,
    "order" INT NOT NULL DEFAULT 0,
    is_free BOOLEAN NOT NULL DEFAULT false
  );

  -- 9. quizzes
  CREATE TABLE IF NOT EXISTS public.quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE SET NULL,
    category TEXT NOT NULL,
    level TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('mcq', 'open')),
    question TEXT NOT NULL,
    options JSONB,
    correct_answer TEXT NOT NULL,
    tip TEXT
  );

  -- 10. artifacts
  CREATE TABLE IF NOT EXISTS public.artifacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    level_id UUID NOT NULL REFERENCES public.levels(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    description TEXT
  );

  -- 11. checklist_items
  CREATE TABLE IF NOT EXISTS public.checklist_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    level_id UUID NOT NULL REFERENCES public.levels(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    "order" INT NOT NULL DEFAULT 0
  );

  -- 12. progress
  CREATE TABLE IF NOT EXISTS public.progress (
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
    completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, lesson_id)
  );

  -- 13. checklist_progress
  CREATE TABLE IF NOT EXISTS public.checklist_progress (
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    item_id UUID NOT NULL REFERENCES public.checklist_items(id) ON DELETE CASCADE,
    checked BOOLEAN NOT NULL DEFAULT false,
    PRIMARY KEY (user_id, item_id)
  );

  -- ═══════════════════════════════════════════════════════
  -- ROW-LEVEL SECURITY
  -- ═══════════════════════════════════════════════════════

  ALTER TABLE public.users               ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.teams               ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.competitions        ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.seasons             ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.categories          ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.levels              ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.courses             ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.lessons             ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.quizzes             ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.artifacts           ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.checklist_items     ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.progress            ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.checklist_progress  ENABLE ROW LEVEL SECURITY;

  -- Content tables: any authenticated (or anon) user can read
  CREATE POLICY "anyone can read competitions"    ON public.competitions    FOR SELECT USING (true);
  CREATE POLICY "anyone can read seasons"         ON public.seasons         FOR SELECT USING (true);
  CREATE POLICY "anyone can read categories"      ON public.categories      FOR SELECT USING (true);
  CREATE POLICY "anyone can read levels"          ON public.levels          FOR SELECT USING (true);
  CREATE POLICY "anyone can read courses"         ON public.courses         FOR SELECT USING (true);
  CREATE POLICY "anyone can read lessons"         ON public.lessons         FOR SELECT USING (true);
  CREATE POLICY "anyone can read quizzes"         ON public.quizzes         FOR SELECT USING (true);
  CREATE POLICY "anyone can read artifacts"       ON public.artifacts       FOR SELECT USING (true);
  CREATE POLICY "anyone can read checklist_items" ON public.checklist_items FOR SELECT USING (true);
  CREATE POLICY "anyone can read teams"           ON public.teams           FOR SELECT USING (true);

  -- users: read / update own row only
  CREATE POLICY "users read own"   ON public.users FOR SELECT USING (auth.uid() = id);
  CREATE POLICY "users update own" ON public.users FOR UPDATE USING (auth.uid() = id);

  -- progress: own rows only
  CREATE POLICY "progress select own" ON public.progress FOR SELECT USING (auth.uid() = user_id);
  CREATE POLICY "progress insert own" ON public.progress FOR INSERT WITH CHECK (auth.uid() = user_id);
  CREATE POLICY "progress update own" ON public.progress FOR UPDATE USING (auth.uid() = user_id);

  -- checklist_progress: own rows only
  CREATE POLICY "checklist_progress select own" ON public.checklist_progress FOR SELECT USING (auth.uid() = user_id);
  CREATE POLICY "checklist_progress insert own" ON public.checklist_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
  CREATE POLICY "checklist_progress update own" ON public.checklist_progress FOR UPDATE USING (auth.uid() = user_id);

  -- ═══════════════════════════════════════════════════════
  -- TRIGGER: auto-insert public.users row on signup
  -- ═══════════════════════════════════════════════════════

  CREATE OR REPLACE FUNCTION public.handle_new_user()
  RETURNS TRIGGER AS $$
  BEGIN
    INSERT INTO public.users (id, role, subscription_tier)
    VALUES (NEW.id, 'student', 'free');
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;

  DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
  CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();
