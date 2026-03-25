-- TAGYLYM — Fix Localization & Navigation Schema
-- Run this in the Supabase SQL Editor (https://supabase.com/dashboard/project/pozrdjsncabthtlawhvn/sql/new)

-- 1. categories
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS name_kk TEXT;
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS name_en TEXT;
UPDATE public.categories SET name_kk = name WHERE name_kk IS NULL;
UPDATE public.categories SET name_en = name WHERE name_en IS NULL;

-- 2. levels
ALTER TABLE public.levels ADD COLUMN IF NOT EXISTS name_kk TEXT;
ALTER TABLE public.levels ADD COLUMN IF NOT EXISTS name_en TEXT;
ALTER TABLE public.levels ADD COLUMN IF NOT EXISTS slug TEXT;
UPDATE public.levels SET name_kk = name WHERE name_kk IS NULL;
UPDATE public.levels SET name_en = name WHERE name_en IS NULL;
UPDATE public.levels SET slug = LOWER(REPLACE(name, ' ', '-')) WHERE slug IS NULL;

-- 3. courses
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS title_kk TEXT;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS title_en TEXT;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS description_kk TEXT;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS description_en TEXT;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS slug TEXT;
UPDATE public.courses SET title_kk = title WHERE title_kk IS NULL;
UPDATE public.courses SET title_en = title WHERE title_en IS NULL;
UPDATE public.courses SET description_kk = description WHERE description_kk IS NULL;
UPDATE public.courses SET description_en = description WHERE description_en IS NULL;
UPDATE public.courses SET slug = id::text WHERE slug IS NULL;

-- 4. lessons
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS title_kk TEXT;
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS title_en TEXT;
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS content_kk TEXT;
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS content_en TEXT;
UPDATE public.lessons SET title_kk = title WHERE title_kk IS NULL;
UPDATE public.lessons SET title_en = title WHERE title_en IS NULL;
