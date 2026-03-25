import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const downloadsDir = "C:\\Users\\kemer\\Downloads";
const materialsDir = "C:\\Users\\kemer\\.gemini\\antigravity\\scratch\\tagylym_materials\\demo\\демо уроков";

// Mapping of file prefixes/names to courses, modules
const fileMapping = [
  // FGC
  { match: (f) => f.startsWith('FGC-'), courseSlug: 'fgc', courseTitle: 'FIRST Global Challenge', module: 'General', title: (f) => f.replace('_RU.pptx', '') },
  // FTC
  { match: (f) => f.startsWith('FTC-'), courseSlug: 'ftc', courseTitle: 'FIRST Tech Challenge', module: 'General', title: (f) => f.replace('.pptx', '') },
  // FLL Innovation Project
  { match: (f) => f.startsWith('IP') && f.endsWith('.pptx'), courseSlug: 'fll-challenge', courseTitle: 'FLL Challenge: Submerged', module: 'Innovation Project', title: (f) => f.replace('.pptx', '') },
  // FLL Robodesign
  { match: (f) => f.startsWith('RD') && f.endsWith('.pptx'), courseSlug: 'fll-challenge', courseTitle: 'FLL Challenge: Submerged', module: 'Robodesign', title: (f) => f.replace('_RU.pptx', '').replace('.pptx', '') },
  // FLL Spike (from materials dir)
  { match: (f) => f.toLowerCase().includes('spike') && f.endsWith('.pptx'), courseSlug: 'fll-challenge', courseTitle: 'FLL Challenge: Submerged', module: 'Robodesign', title: (f) => f.replace('.pptx', '') }
];

async function ensureBucket() {
  const { data, error } = await supabase.storage.getBucket('materials');
  if (error && error.message.includes('not found')) {
    console.log('Creating materials bucket...');
    await supabase.storage.createBucket('materials', { public: true });
  } else if (error) {
    console.error('Error with bucket:', error);
  } else {
    console.log('Materials bucket exists.');
  }
}

async function getCourse(title, slug) {
  let { data, error } = await supabase.from('courses').select('id').eq('slug', slug).maybeSingle();
  if (data) return data.id;
  
  const { data: newCourse, error: insErr } = await supabase.from('courses').upsert({
    title, slug
  }, { onConflict: 'slug' }).select().single();
  
  if (insErr) throw insErr;
  return newCourse.id;
}

async function getModule(courseId, title) {
  let { data, error } = await supabase.from('modules').select('*').eq('course_id', courseId).eq('title', title).maybeSingle();
  if (data) return data.id;
  
  const { data: newMod, error: insErr } = await supabase.from('modules').insert({
    course_id: courseId, title, order_index: 0
  }).select().single();
  
  if (insErr) throw insErr;
  return newMod.id;
}

async function processFile(filePath, fileName) {
  let mapped = null;
  for (const mapping of fileMapping) {
    if (mapping.match(fileName)) {
      mapped = mapping;
      break;
    }
  }
  
  if (!mapped) return; // Skip files that don't match
  
  console.log(`Processing: ${fileName} -> ${mapped.courseSlug} / ${mapped.module}`);
  
  // 1. Upload to Supabase Storage
  const fileBuffer = fs.readFileSync(filePath);
  const storagePath = `${mapped.courseSlug}/${fileName}`;
  
  const { error: uploadError } = await supabase.storage.from('materials').upload(storagePath, fileBuffer, {
    upsert: true,
    contentType: fileName.endsWith('.pdf') ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  });
  
  if (uploadError) {
    console.error(`Failed to upload ${fileName}:`, uploadError);
    return;
  }
  
  const { data: { publicUrl } } = supabase.storage.from('materials').getPublicUrl(storagePath);
  
  // 2. Add to DB
  const courseId = await getCourse(mapped.courseTitle, mapped.courseSlug);
  const moduleId = await getModule(courseId, mapped.module);
  
  const title = mapped.title(fileName);
  
  const { error: lessonError } = await supabase.from('lessons').insert({
    module_id: moduleId,
    title,
    presentation_url: publicUrl,
    order_index: 0
  });
  
  if (lessonError) {
    console.error(`Failed to create lesson ${title}:`, lessonError);
  } else {
    console.log(`✅ Lesson created: ${title}`);
  }
}

async function run() {
  await ensureBucket();
  
  // Process materialsDir
  if (fs.existsSync(materialsDir)) {
    const files = fs.readdirSync(materialsDir);
    for (const file of files) {
      if (file.endsWith('.pptx') || file.endsWith('.pdf')) {
        await processFile(path.join(materialsDir, file), file);
      }
    }
  }
  
  // Process downloadsDir
  if (fs.existsSync(downloadsDir)) {
    const files = fs.readdirSync(downloadsDir);
    for (const file of files) {
      if (file.endsWith('.pptx') || file.endsWith('.pdf')) {
        await processFile(path.join(downloadsDir, file), file);
      }
    }
  }
  
  console.log('🎉 Processing complete!');
}

run().catch(console.error);
