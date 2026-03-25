import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function check() {
  const { data: courses } = await supabase.from('courses').select('id, title, slug');
  for (const course of courses) {
    const { data: lessons } = await supabase.from('lessons').select('*').eq('course_id', course.id);
    console.log(`📘 Course: ${course.title} (${course.id})`);
    console.log(`   🔸 Lessons (${lessons.length}):`, lessons.map(l => l.title));
  }
}
check();
