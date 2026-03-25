import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('🌱 Seeding LMS data...');

  // 1. Create FLL Course
  const { data: course, error: courseError } = await supabase
    .from('courses')
    .upsert({
      title: 'FLL Challenge: Submerged',
      description: 'Master the 2025-26 FIRST LEGO League season.',
      slug: 'fll-challenge',
      image_url: '/images/fll-submerged.png'
    }, { onConflict: 'slug' })
    .select()
    .single();

  if (courseError) {
    console.error('Error creating course:', courseError);
    return;
  }
  console.log('✅ Course created:', course.title);

  const modules = [
    { title: 'Robodesign', order: 1 },
    { title: 'Innovation Project', order: 2 },
    { title: 'Core Values', order: 3 }
  ];

  for (const m of modules) {
    const { data: moduleData, error: moduleError } = await supabase
      .from('modules')
      .upsert({
        course_id: course.id,
        title: m.title,
        order_index: m.order
      }, { onConflict: 'course_id, title' }) // Note: we should have a unique constraint or just use upsert carefully
      .select()
      .single();

    if (moduleError) {
      console.error(`Error creating module ${m.title}:`, moduleError);
      continue;
    }
    console.log(`✅ Module created: ${moduleData.title}`);

    // Add sample lessons for each module
    const lessons = [
      { 
        title: `${m.title} - Intro`, 
        type: 'video', 
        url: 'https://youtube.com/embed/sample_video_id',
        order: 1 
      },
      { 
        title: `${m.title} - Deep Dive`, 
        type: 'presentation', 
        url: 'https://docs.google.com/presentation/d/sample_id/embed',
        order: 2 
      }
    ];

    for (const l of lessons) {
      const { error: lessonError } = await supabase
        .from('lessons')
        .upsert({
          module_id: moduleData.id,
          title: l.title,
          presentation_url: l.type === 'presentation' ? l.url : null,
          video_url: l.type === 'video' ? l.url : null,
          order_index: l.order
        });

      if (lessonError) {
        console.error(`Error creating lesson ${l.title}:`, lessonError);
      } else {
        console.log(`   🔸 Lesson created: ${l.title}`);
      }
    }
  }

  console.log('✨ Seeding complete!');
}

seed();
