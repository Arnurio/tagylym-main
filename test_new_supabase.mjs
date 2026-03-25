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

async function test() {
  console.log(`Connecting to: ${process.env.NEXT_PUBLIC_SUPABASE_URL}`);
  const { data, error } = await supabase.from('feedback').select('*').limit(1);
  if (error) {
    console.error('❌ Connection failed:', error.message, error.code);
  } else {
    console.log('✅ Connection successful!');
  }
}
test();
