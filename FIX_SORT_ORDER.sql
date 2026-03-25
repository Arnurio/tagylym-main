-- ═══════════════════════════════════════════════════════
-- TAGYLYM — Fix sort_order columns
-- Run in Supabase SQL Editor
-- ═══════════════════════════════════════════════════════

-- 1. Add sort_order to categories (alias for "order")
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS sort_order INT;
UPDATE public.categories SET sort_order = "order" WHERE sort_order IS NULL;
ALTER TABLE public.categories ALTER COLUMN sort_order SET DEFAULT 0;

-- 2. Add sort_order to levels
ALTER TABLE public.levels ADD COLUMN IF NOT EXISTS sort_order INT;
UPDATE public.levels SET sort_order = "order" WHERE sort_order IS NULL;
ALTER TABLE public.levels ALTER COLUMN sort_order SET DEFAULT 0;

-- 3. Add sort_order to courses
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS sort_order INT;
UPDATE public.courses SET sort_order = "order" WHERE sort_order IS NULL;
ALTER TABLE public.courses ALTER COLUMN sort_order SET DEFAULT 0;

-- 4. Add sort_order to lessons (if not exists)
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS sort_order INT;
UPDATE public.lessons SET sort_order = "order" WHERE sort_order IS NULL;
ALTER TABLE public.lessons ALTER COLUMN sort_order SET DEFAULT 0;

-- 5. Add slug column to seasons (needed by sync_csv.mjs)
ALTER TABLE public.seasons ADD COLUMN IF NOT EXISTS slug TEXT;
UPDATE public.seasons SET slug = LOWER(REPLACE(name, ' ', '-')) WHERE slug IS NULL;

-- 6. Add localized title columns to courses
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS title_kk TEXT;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS title_en TEXT;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS "order" INT;

-- 7. Add localized title columns to lessons
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS title_kk TEXT;
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS title_en TEXT;
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS video_url_kk TEXT;
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS presentation_url TEXT;
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS presentation_url_kk TEXT;
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS lesson_code TEXT;

-- 8. Ensure FTC and FGC competitions exist
INSERT INTO public.competitions (name, slug)
VALUES 
  ('FTC', 'ftc'),
  ('FGC', 'fgc')
ON CONFLICT (slug) DO NOTHING;

-- 9. Allow service role to insert into content tables (for sync script)
DROP POLICY IF EXISTS "service role can insert categories" ON public.categories;
CREATE POLICY "service role can insert categories" ON public.categories
  FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service role can insert levels" ON public.levels;
CREATE POLICY "service role can insert levels" ON public.levels
  FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service role can insert courses" ON public.courses;
CREATE POLICY "service role can insert courses" ON public.courses
  FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service role can insert lessons" ON public.lessons;
CREATE POLICY "service role can insert lessons" ON public.lessons
  FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service role can insert seasons" ON public.seasons;
CREATE POLICY "service role can insert seasons" ON public.seasons
  FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service role can insert competitions" ON public.competitions;
CREATE POLICY "service role can insert competitions" ON public.competitions
  FOR ALL TO service_role USING (true) WITH CHECK (true);

SELECT 'Migration complete! sort_order columns added to all tables.' as status;
