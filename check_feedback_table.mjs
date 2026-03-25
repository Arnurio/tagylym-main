import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Need service role for migrations usually, or just use anon if RLS allows (but creating table needs more)
);

async function apply() {
  const sql = fs.readFileSync('feedback_migration.sql', 'utf8');
  console.log('Applying migration...');
  
  // Supabase JS client doesn't have a direct 'run sql' method. 
  // Usually migrations are done via CLI or Dashboard.
  // However, I can try to check if the table exists first.
  
  const { error } = await supabase.from('feedback').select('id').limit(1);
  if (error && error.code === '42P01') {
    console.log('❌ Feedback table does not exist. Please apply feedback_migration.sql manually in Supabase SQL Editor.');
  } else if (error) {
    console.log('⚠️ Error checking table:', error.message);
  } else {
    console.log('✅ Feedback table already exists.');
  }
}
apply();
