import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { parse } from 'csv-parse/sync';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "eb50c3xu";
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "datasetnumber1";
const TOKEN = process.env.SANITY_API_TOKEN;
const SANITY_API = `https://${PROJECT_ID}.api.sanity.io/v2024-01-01/data/mutate/${DATASET}?returnIds=true`;

// Read from local curriculum.csv (in project root)
const csvPath = "./curriculum.csv";

async function run() {
  if (!fs.existsSync(csvPath)) {
    console.error('❌ File not found at:', csvPath);
    console.error('   Make sure curriculum.csv is in the project root.');
    return;
  }

  let content = fs.readFileSync(csvPath, 'utf-8');
  // Remove BOM if present
  if (content.startsWith('\uFEFF')) content = content.substring(1);

  const records = parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    delimiter: ';'
  });

  // Filter out rows without Competition (empty rows)
  const validRecords = records.filter(r => r.Competition && r.Competition.trim() !== '');
  console.log(`✅ Found ${validRecords.length} lessons in curriculum.csv\n`);

  // Level name mapping: CSV value → DB name
  const levelNameMap = {
    'Beginner':     'Начинающий',
    'Intermediate': 'Средний',
    'Advanced':     'Продвинутый',
    'All Levels':   'Общий',
    'General':      'Общий',
  };

  // Level slug mapping for URL routes
  const levelSlugMap = {
    'Beginner':     'beginner',
    'Intermediate': 'intermediate',
    'Advanced':     'advanced',
    'All Levels':   'beginner', // map to beginner tab
    'General':      'beginner',
  };

  for (const row of validRecords) {
    const {
      "Competition":        compSlug,
      "Category":          catSlug,
      "Level":             levelRaw,
      "Course Title RU":   courseTitleRu,
      "Course Title KK":   courseTitleKk,
      "Course Title EN":   courseTitleEn,
      "Lesson Code":       lessonCode,
      "Lesson Title RU":   lessonTitleRu,
      "Lesson Title KK":   lessonTitleKk,
      "Lesson Title EN":   lessonTitleEn,
      "Presentation URL RU": presUrlRu,
      "Presentation URL KK": presUrlKk,
      "Video URL RU":      videoUrlRu,
      "Video URL KK":      videoUrlKk,
      "Order":             order,
    } = row;

    const dbLevelName = levelNameMap[levelRaw?.trim()] || levelNameMap['General'];
    console.log(`→ Processing: [${compSlug}] ${catSlug} / ${levelRaw} / ${lessonTitleRu}`);

    // 1. Find Competition
    const { data: comp, error: compErr } = await supabase
      .from('competitions')
      .select('id')
      .eq('slug', compSlug.toLowerCase())
      .single();

    if (compErr || !comp) {
      console.warn(`  ⚠️  Competition "${compSlug}" not found. Make sure to run FIX_SORT_ORDER.sql first.`);
      continue;
    }

    // 2. Find/Create active Season
    let { data: season } = await supabase
      .from('seasons')
      .select('id')
      .eq('competition_id', comp.id)
      .eq('is_active', true)
      .maybeSingle();

    if (!season) {
      const seasonName = compSlug === 'FLL' ? 'SUBMERGED 2025-26' : `${compSlug} Season 2025-26`;
      const seasonSlug = `${compSlug.toLowerCase()}-2025-26`;
      const { data: ns, error: nsErr } = await supabase
        .from('seasons')
        .insert({
          competition_id: comp.id,
          name: seasonName,
          slug: seasonSlug,
          year: 2026,
          is_active: true
        })
        .select()
        .single();
      if (nsErr) { console.error("  ❌ Season insert error:", nsErr.message); continue; }
      season = ns;
      console.log(`  ✅ Created season: ${seasonName}`);
    }

    // 3. Find/Create Category
    let { data: cat } = await supabase
      .from('categories')
      .select('id')
      .eq('season_id', season.id)
      .eq('slug', catSlug.toLowerCase())
      .maybeSingle();

    if (!cat) {
      const catNames = {
        'robot-design': { ru: 'Конструирование', icon: '🤖' },
        'innovation':   { ru: 'Инновационный проект', icon: '💡' },
        'coding':       { ru: 'Программирование', icon: '💻' },
        'robot-game':   { ru: 'Игра роботов', icon: '🏆' },
        'core-values':  { ru: 'Core Values', icon: '🤝' },
        'general':      { ru: 'Общий курс', icon: '📚' },
      };
      const catInfo = catNames[catSlug.toLowerCase()] || { ru: catSlug, icon: '📚' };
      const catOrder = { 'robot-design': 1, 'innovation': 2, 'coding': 3, 'robot-game': 4, 'core-values': 5, 'general': 1 };

      const { data: nc, error: ncErr } = await supabase
        .from('categories')
        .insert({
          season_id: season.id,
          slug: catSlug.toLowerCase(),
          name: catInfo.ru,
          icon: catInfo.icon,
          "order": catOrder[catSlug.toLowerCase()] || 99,
          sort_order: catOrder[catSlug.toLowerCase()] || 99,
        })
        .select()
        .single();
      if (ncErr) { console.error("  ❌ Category insert error:", ncErr.message); continue; }
      cat = nc;
      console.log(`  ✅ Created category: ${catInfo.ru}`);
    }

    // 4. Find/Create Level
    let { data: level } = await supabase
      .from('levels')
      .select('id')
      .eq('category_id', cat.id)
      .eq('name', dbLevelName)
      .maybeSingle();

    if (!level) {
      const levelColors = { 'Начинающий': '#3B82F6', 'Средний': '#F97316', 'Продвинутый': '#22C55E', 'Общий': '#8B5CF6' };
      const levelOrders = { 'Начинающий': 1, 'Средний': 2, 'Продвинутый': 3, 'Общий': 1 };

      const { data: nl, error: nlErr } = await supabase
        .from('levels')
        .insert({
          category_id: cat.id,
          name: dbLevelName,
          color: levelColors[dbLevelName] || '#6B7280',
          "order": levelOrders[dbLevelName] || 1,
          sort_order: levelOrders[dbLevelName] || 1,
        })
        .select()
        .single();
      if (nlErr) { console.error("  ❌ Level insert error:", nlErr.message); continue; }
      level = nl;
      console.log(`  ✅ Created level: ${dbLevelName}`);
    }

    // 5. Find/Create Course
    let { data: course } = await supabase
      .from('courses')
      .select('id')
      .eq('level_id', level.id)
      .eq('title', courseTitleRu)
      .maybeSingle();

    const courseSlug = `${compSlug.toLowerCase()}-${catSlug.toLowerCase()}-${levelSlugMap[levelRaw?.trim()] || 'beginner'}`;
    const courseData = {
      title: courseTitleRu,
      title_kk: courseTitleKk || courseTitleRu,
      title_en: courseTitleEn || courseTitleRu,
      level_id: level.id,
      slug: courseSlug,
      "order": 1,
      sort_order: 1,
    };

    if (course) {
      await supabase.from('courses').update(courseData).eq('id', course.id);
    } else {
      const { data: nc, error: ncErr } = await supabase
        .from('courses')
        .insert(courseData)
        .select()
        .single();
      if (ncErr || !nc) { console.error("  ❌ Course insert error:", ncErr?.message); continue; }
      course = nc;
      console.log(`  ✅ Created course: ${courseTitleRu}`);
    }

    // 6. Find/Create Lesson in Supabase
    let { data: sbLesson } = await supabase
      .from('lessons')
      .select('id')
      .eq('course_id', course.id)
      .eq('title', lessonTitleRu)
      .maybeSingle();

    // Clean video URLs (sometimes has two URLs separated by spaces)
    const cleanVideoRu = (videoUrlRu || '').split(/\s+/).filter(u => u.startsWith('http'))[0] || null;
    const cleanVideoKk = (videoUrlKk || '').split(/\s+/).filter(u => u.startsWith('http'))[0] || null;

    const sbLessonData = {
      course_id: course.id,
      title: lessonTitleRu,
      title_kk: lessonTitleKk || lessonTitleRu,
      title_en: lessonTitleEn || lessonTitleRu,
      video_url: cleanVideoRu,
      video_url_kk: cleanVideoKk,
      presentation_url: presUrlRu || null,
      presentation_url_kk: presUrlKk || null,
      content_md: presUrlRu ? `[📊 Презентация (RU)](${presUrlRu})${presUrlKk ? `\n[📊 Презентация (KK)](${presUrlKk})` : ''}` : null,
      sort_order: parseInt(order) || 0,
      "order": parseInt(order) || 0,
      lesson_code: lessonCode || null,
      is_free: true,
    };

    if (sbLesson) {
      const { error: upErr } = await supabase.from('lessons').update(sbLessonData).eq('id', sbLesson.id);
      if (upErr) console.error("  ❌ Lesson update error:", upErr.message);
    } else {
      const { data: nl, error: inErr } = await supabase.from('lessons').insert(sbLessonData).select().single();
      if (inErr || !nl) { console.error("  ❌ Lesson insert error:", inErr?.message); continue; }
      sbLesson = nl;
    }

    // 7. Sync to Sanity (only if TOKEN is set)
    if (!TOKEN) {
      console.log(`  ✅ Lesson saved to Supabase (Sanity skipped — no token)`);
      continue;
    }

    const sanityDoc = {
      _type: "lesson",
      _id: `lesson-${sbLesson.id}`,
      title_ru: lessonTitleRu,
      title_kk: lessonTitleKk || lessonTitleRu,
      title_en: lessonTitleEn || lessonTitleRu,
      slug: { _type: "slug", current: (lessonCode || lessonTitleRu).toLowerCase().replace(/[^\w-]+/g, '-') },
      courseId: course.id,
      order: parseInt(order) || 0,
      isFree: true,
      videoUrl_ru: cleanVideoRu || null,
      videoUrl_kk: cleanVideoKk || null,
      presentationUrl_ru: presUrlRu || null,
      presentationUrl_kk: presUrlKk || null,
    };

    const res = await fetch(SANITY_API, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${TOKEN}` },
      body: JSON.stringify({ mutations: [{ createOrReplace: sanityDoc }] })
    });

    if (!res.ok) {
      console.error(`  ❌ Sanity error for "${lessonTitleRu}":`, await res.text());
    } else {
      console.log(`  ✅ "${lessonTitleRu}" synced to Supabase + Sanity`);
    }
  }

  console.log('\n🎉 Curriculum sync complete!');
  console.log('Next: open your site and check the lessons appear.');
}

run().catch(console.error);
