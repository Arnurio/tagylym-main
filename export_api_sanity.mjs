import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET;
const TOKEN = process.env.SANITY_API_TOKEN;

async function exportData() {
    const query = encodeURIComponent('*[]')
    const url = `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=${query}`;
    
    console.log(`Fetching from ${url}...`);
    
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${TOKEN}`
        }
    });

    if (!response.ok) {
        console.error('Error fetching data:', await response.text());
        return;
    }

    const data = await response.json();
    fs.writeFileSync('sanity_backup.json', JSON.stringify(data.result, null, 2));
    console.log(`✅ Exported ${data.result.length} documents to sanity_backup.json`);
}

exportData().catch(console.error);
