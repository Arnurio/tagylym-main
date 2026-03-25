import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "eb50c3xu";
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "datasetnumber1";
const TOKEN = process.env.SANITY_API_TOKEN;
const API = `https://${PROJECT_ID}.api.sanity.io/v2024-01-01/data/mutate/${DATASET}?returnIds=true`;

function toSlug(text) {
  return text.toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function run() {
  console.log('Fetching lessons from Supabase...');
  const { data: lessons, error } = await supabase.from('lessons').select('*');
  
  if (error) {
    console.error('Supabase error:', error);
    return;
  }
  
  console.log(`Found ${lessons.length} lessons in Supabase.`);
  
  const sanityMutations = lessons.map((lesson) => {
    // We create a Sanity doc ID prefixed with 'lesson-'
    const sanityId = `lesson-${lesson.id}`;
    const slugStr = toSlug(lesson.title.substring(0, 90));
    
    const doc = {
      _type: "lesson",
      _id: sanityId,
      title_kk: lesson.title, // Use title as fallback for KK
      title_ru: lesson.title,
      title_en: lesson.title,
      slug: { _type: "slug", current: slugStr },
      courseSlug: lesson.course_id,
      order: lesson.order || 0,
      isFree: true,
      videoUrl_ru: lesson.video_url || null,
      presentationUrl_ru: null,
      content_ru: [
        {
          _type: "block",
          _key: "b1",
          style: "normal",
          children: [
            {
              _type: "span",
              _key: "s1",
              text: `Изучите материалы урока ниже:`
            }
          ]
        }
      ]
    };

    // If there is content_md containing the URL, we extract it for presentationUrl
    if (lesson.content_md) {
        // Extract URL from markdown link [text](URL)
        const match = lesson.content_md.match(/\((https?:\/\/[^\)]+)\)/);
        const urlMatch = match ? match[1] : lesson.content_md;
        
        // Add to presentationUrl
        doc.presentationUrl_ru = urlMatch;
    }

    return { createOrReplace: doc };
  });

  console.log(`Sending ${sanityMutations.length} mutations to Sanity...`);

  // Max 100 mutations per request usually, so batch them
  const batchSize = 50;
  for (let i = 0; i < sanityMutations.length; i += batchSize) {
    const batch = sanityMutations.slice(i, i + batchSize);
    
    const res = await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify({ mutations: batch }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error(`❌ Sanity API error (${res.status}):`, text);
      continue;
    }
    
    const result = await res.json();
    console.log(`✅ Batch ${i/batchSize + 1} inserted!`);
  }

  console.log("🎉 Sanity Sync complete!");
}

run().catch(console.error);
