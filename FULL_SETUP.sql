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

  -- 14. waitlist
  CREATE TABLE IF NOT EXISTS public.waitlist (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    track TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
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
  ALTER TABLE public.feedback            ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.waitlist            ENABLE ROW LEVEL SECURITY;

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
-- ═══════════════════════════════════════════════════════
-- TAGYLYM — Seed Data  (run AFTER schema.sql)
-- ═══════════════════════════════════════════════════════

-- Competition
INSERT INTO public.competitions (id, name, slug)
VALUES ('a1000000-0000-0000-0000-000000000001', 'FLL', 'fll')
ON CONFLICT (slug) DO NOTHING;

-- Season
INSERT INTO public.seasons (id, competition_id, name, year, is_active)
VALUES (
  'b1000000-0000-0000-0000-000000000001',
  'a1000000-0000-0000-0000-000000000001',
  'SUBMERGED 2025-26',
  2026,
  true
) ON CONFLICT (id) DO NOTHING;

-- ── Categories ─────────────────────────────────────────

INSERT INTO public.categories (id, season_id, name, slug, icon, "order") VALUES
  ('c1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 'Конструирование',       'robot-design', '🤖', 1),
  ('c1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000001', 'Инновационный проект',  'innovation',   '💡', 2),
  ('c1000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000001', 'Программирование',      'coding',       '💻', 3),
  ('c1000000-0000-0000-0000-000000000004', 'b1000000-0000-0000-0000-000000000001', 'Игра роботов',          'robot-game',   '🏆', 4)
ON CONFLICT (id) DO NOTHING;

-- ── Levels  (3 per category = 12) ──────────────────────

-- Конструирование
INSERT INTO public.levels (id, category_id, name, color, "order") VALUES
  ('d1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'Начинающий',   '#3B82F6', 1),
  ('d1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000001', 'Средний',      '#F97316', 2),
  ('d1000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000001', 'Продвинутый',  '#22C55E', 3)
ON CONFLICT (id) DO NOTHING;

-- Инновационный проект
INSERT INTO public.levels (id, category_id, name, color, "order") VALUES
  ('d1000000-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000002', 'Начинающий',   '#3B82F6', 1),
  ('d1000000-0000-0000-0000-000000000005', 'c1000000-0000-0000-0000-000000000002', 'Средний',      '#F97316', 2),
  ('d1000000-0000-0000-0000-000000000006', 'c1000000-0000-0000-0000-000000000002', 'Продвинутый',  '#22C55E', 3)
ON CONFLICT (id) DO NOTHING;

-- Программирование
INSERT INTO public.levels (id, category_id, name, color, "order") VALUES
  ('d1000000-0000-0000-0000-000000000007', 'c1000000-0000-0000-0000-000000000003', 'Начинающий',   '#3B82F6', 1),
  ('d1000000-0000-0000-0000-000000000008', 'c1000000-0000-0000-0000-000000000003', 'Средний',      '#F97316', 2),
  ('d1000000-0000-0000-0000-000000000009', 'c1000000-0000-0000-0000-000000000003', 'Продвинутый',  '#22C55E', 3)
ON CONFLICT (id) DO NOTHING;

-- Игра роботов
INSERT INTO public.levels (id, category_id, name, color, "order") VALUES
  ('d1000000-0000-0000-0000-000000000010', 'c1000000-0000-0000-0000-000000000004', 'Начинающий',   '#3B82F6', 1),
  ('d1000000-0000-0000-0000-000000000011', 'c1000000-0000-0000-0000-000000000004', 'Средний',      '#F97316', 2),
  ('d1000000-0000-0000-0000-000000000012', 'c1000000-0000-0000-0000-000000000004', 'Продвинутый',  '#22C55E', 3)
ON CONFLICT (id) DO NOTHING;

-- ── Checklist items — robot-design / Начинающий ────────

INSERT INTO public.checklist_items (id, level_id, text, "order") VALUES
  ('e1000000-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000001', 'Наш робот имеет симметричные колёса', 1),
  ('e1000000-0000-0000-0000-000000000002', 'd1000000-0000-0000-0000-000000000001', 'Используем жёсткое основание', 2),
  ('e1000000-0000-0000-0000-000000000003', 'd1000000-0000-0000-0000-000000000001', 'Все участники знают, как прикрепить базовое вложение', 3),
  ('e1000000-0000-0000-0000-000000000004', 'd1000000-0000-0000-0000-000000000001', 'Журнал ролей заполнен для каждой сессии', 4),
  ('e1000000-0000-0000-0000-000000000005', 'd1000000-0000-0000-0000-000000000001', 'Каждый член команды может собрать базового робота', 5)
ON CONFLICT (id) DO NOTHING;

-- ── Quizzes — 3 sample questions ───────────────────────

-- Q1  MCQ · robot-design · beginner
INSERT INTO public.quizzes (id, category, level, type, question, options, correct_answer, tip)
VALUES (
  'f1000000-0000-0000-0000-000000000001',
  'robot-design', 'beginner', 'mcq',
  'Что даёт симметричное расположение колёс?',
  '["Больше скорости","Предсказуемое движение","Меньше веса","Ничего"]',
  'Предсказуемое движение',
  'Симметрия = одинаковое расстояние от центра тяжести до каждого колеса. Это ключ к точным поворотам.'
) ON CONFLICT (id) DO NOTHING;

-- Q2  Open · coding · intermediate
INSERT INTO public.quizzes (id, category, level, type, question, correct_answer, tip)
VALUES (
  'f1000000-0000-0000-0000-000000000002',
  'coding', 'intermediate', 'open',
  'Объясни формулу P-контроллера. Что такое Kp и как его подобрать?',
  'Мощность мотора = Ошибка × Kp. Kp подбирается методом бисекции: начинаем с Kp=1, если робот колеблется — уменьшаем, если не реагирует — увеличиваем.',
  'Попроси ученика нарисовать график ошибки. Если он видит осцилляцию — сразу понимает, что Kp слишком высокий.'
) ON CONFLICT (id) DO NOTHING;

-- Q3  MCQ · innovation · advanced
INSERT INTO public.quizzes (id, category, level, type, question, options, correct_answer, tip)
VALUES (
  'f1000000-0000-0000-0000-000000000003',
  'innovation', 'advanced', 'mcq',
  'Что должна содержать структура питча «Impact First»?',
  '["Имена членов команды","Цифровой результат воздействия в первом предложении","Описание процесса исследования","Список используемых материалов"]',
  'Цифровой результат воздействия в первом предложении',
  'Судьи слушают десятки питчей. Если цифра не прозвучала в первых 10 секундах — вы уже потеряли их внимание.'
) ON CONFLICT (id) DO NOTHING;
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
