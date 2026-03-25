import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// We will map files to [CompetitionSlug, CategorySlug(or expected name)]
const fileMapping = [
  // FGC
  { match: (f) => f.startsWith('FGC-'), comp: 'fgc', compName: 'FIRST Global Challenge', cat: 'general', catName: 'Базовый курс', title: (f) => f.replace('_RU.pptx', '') },
  // FTC
  { match: (f) => f.startsWith('FTC-'), comp: 'ftc', compName: 'FIRST Tech Challenge', cat: 'general', catName: 'Базовый курс', title: (f) => f.replace('.pptx', '') },
  // FLL Innovation Project
  { match: (f) => f.startsWith('IP') && f.endsWith('.pptx'), comp: 'fll', compName: 'FLL', cat: 'innovation', catName: 'Инновационный проект', title: (f) => f.replace('.pptx', '') },
  // FLL Robodesign
  { match: (f) => f.startsWith('RD') && f.endsWith('.pptx'), comp: 'fll', compName: 'FLL', cat: 'robot-design', catName: 'Конструирование', title: (f) => f.replace('_RU.pptx', '').replace('.pptx', '') },
  // FLL Spike (Robodesign)
  { match: (f) => f.toLowerCase().includes('spike') && f.endsWith('.pptx'), comp: 'fll', compName: 'FIRST LEGO League', cat: 'coding', catName: 'Программирование', title: (f) => f.includes('Compressed') ? "Введение в SPIKE Prime" : f.replace('.pptx', '') }
];

async function getOrCreate(table, matchObj, insertObj) {
  let { data, error } = await supabase.from(table).select('*').match(matchObj).maybeSingle();
  if (data) return data;
  
  const { data: newData, error: insErr } = await supabase.from(table).insert(insertObj).select().single();
  if (insErr) throw insErr;
  return newData;
}

// Ensure hierarchy exists
async function getHierarchy(compSlug, compName, catSlug, catName) {
  // 1. Competition
  const comp = await getOrCreate('competitions', { slug: compSlug }, { name: compName, slug: compSlug });
  
  // 2. Season
  const seasonName = compSlug === 'fll' ? 'SUBMERGED 2025-26' : 'Season 2025-26';
  const season = await getOrCreate('seasons', { competition_id: comp.id, name: seasonName }, { competition_id: comp.id, name: seasonName, year: 2026, is_active: true });
  
  // 3. Category
  const cat = await getOrCreate('categories', { season_id: season.id, slug: catSlug }, { season_id: season.id, slug: catSlug, name: catName, icon: '📚', order: 1 });
  
  // 4. Level (Beginner)
  const level = await getOrCreate('levels', { category_id: cat.id, name: 'Начинающий' }, { category_id: cat.id, name: 'Начинающий', color: '#3B82F6', order: 1 });
  
  // 5. Course
  const course = await getOrCreate('courses', { level_id: level.id, title: 'Уроки' }, { level_id: level.id, title: 'Уроки', description: 'Основные уроки', order: 1 });
  
  return course.id;
}

async function processFile(filePath, fileName) {
  let mapped = null;
  for (const mapping of fileMapping) {
    if (mapping.match(fileName)) { mapped = mapping; break; }
  }
  if (!mapped) return;

  const stat = fs.statSync(filePath);
  if (stat.size > 10 * 1024 * 1024 && !fileName.includes('Compressed')) {
    console.log(`Skipping large file: ${fileName} (${(stat.size / 1024 / 1024).toFixed(2)} MB)`);
    return;
  }

  console.log(`Processing: ${fileName} -> ${mapped.comp} / ${mapped.cat}`);
  
  // Upload
  const fileBuffer = fs.readFileSync(filePath);
  const storagePath = `${mapped.comp}/${fileName}`;
  
  const { error: uploadError } = await supabase.storage.from('materials').upload(storagePath, fileBuffer, {
    upsert: true,
    contentType: fileName.endsWith('.pdf') ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  });
  if (uploadError) {
    console.error(`Failed to upload ${fileName}:`, uploadError);
    return;
  }
  const { data: { publicUrl } } = supabase.storage.from('materials').getPublicUrl(storagePath);
  
  // DB Insert
  const courseId = await getHierarchy(mapped.comp, mapped.compName, mapped.cat, mapped.catName);
  const title = mapped.title(fileName);
  
  const contentMd = `[Смотреть презентацию/материал](${publicUrl})`;
  
  // Check if lesson exists
  let { data: existingLesson } = await supabase.from('lessons').select('id').eq('course_id', courseId).eq('title', title).maybeSingle();
  
  if (existingLesson) {
    // Update
    await supabase.from('lessons').update({ content_md: contentMd }).eq('id', existingLesson.id);
    console.log(`✅ Lesson updated: ${title}`);
  } else {
    // Insert
    const { error: lessonError } = await supabase.from('lessons').insert({
      course_id: courseId, title, content_md: contentMd, order: 0
    });
    if (lessonError) console.error(`Failed to create lesson ${title}:`, lessonError);
    else console.log(`✅ Lesson created: ${title}`);
  }
}

async function run() {
  const materialsDir = "C:\\Users\\kemer\\.gemini\\antigravity\\scratch\\tagylym_materials\\demo\\демо уроков";
  const downloadsDir = "C:\\Users\\kemer\\Downloads";
  
  const dirsToScan = [materialsDir, downloadsDir];
  
  for (const dir of dirsToScan) {
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir);
    for (const file of files) {
      if (file.endsWith('.pptx') || file.endsWith('.pdf')) {
        await processFile(path.join(dir, file), file);
      }
    }
  }
  console.log('🎉 Processing complete!');
}

run().catch(console.error);
