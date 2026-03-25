import { execSync } from 'child_process';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

const token = process.env.SANITY_API_TOKEN;
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

console.log(`Exporting dataset ${dataset} from project ${projectId}...`);

try {
  // Using cmd to bypass PowerShell execution policies
  execSync(`cmd /c "npx -y sanity@latest dataset export ${dataset} old_sanity_backup.tar.gz"`, { 
    stdio: 'inherit',
    env: {
        ...process.env,
        SANITY_PROJECT_ID: projectId,
        SANITY_AUTH_TOKEN: token
    }
  });
  console.log("✅ Export successful! Saved to old_sanity_backup.tar.gz");
} catch (error) {
  console.error("❌ Export failed:", error.message);
}
