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
  const { count: courseCount } = await supabase.from('courses').select('*', { count: 'exact', head: true });
  const { count: lessonCount } = await supabase.from('lessons').select('*', { count: 'exact', head: true });
  console.log(`📊 Courses: ${courseCount}, Lessons: ${lessonCount}`);
  
  if (courseCount > 0) {
    const { data } = await supabase.from('courses').select('id, title, slug').limit(5);
    console.log('📝 Sample Courses:', data);
  }
}
check();
