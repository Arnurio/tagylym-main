/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-unused-vars */
const { spawnSync, execSync } = require('child_process');

const envs = {
    NEXT_PUBLIC_SUPABASE_URL: "https://nvfvrbudxltzgqmazeos.supabase.co",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52ZnZyYnVkeGx0emdxbWF6ZW9zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5ODI2NTYsImV4cCI6MjA4ODU1ODY1Nn0.WhqaROfhZMtGl0uyB1lEcnR1xLLqqNCu2_hbvWfn-mA",
    SUPABASE_SERVICE_ROLE_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Mjk4MjY1NiwiZXhwIjoyMDg4NTU4NjU2fQ.e-BiFXmXi_Sj41rv3xPGek4yOMq-AAoa1TeJ4GHR5ro",
    NEXT_PUBLIC_SANITY_PROJECT_ID: "eb50c3xu",
    NEXT_PUBLIC_SANITY_DATASET: "datasetnumber1",
    SANITY_API_TOKEN: "skbUpDgnvagV0Lqlx20s3QhtOXM06h7jTcFCvho9C4ABhmuAB4H1zyW3xedVbYSBPP6a1nC325bTdEpjrvhGgJ9yPDygOnuaEsdlyKn2wnxo9KloEOnpBa9in3FHXEZ38iDyU2mT49Cof6GC8eYPUAO5jIyb9q4f1OTaNVGYKAD1wUYl6n4C",
    NEXT_PUBLIC_SITE_URL: "https://tagylym.vercel.app"
};

console.log("Adding environment variables to Vercel...");
const environments = ["production", "preview", "development"];

for (const [key, value] of Object.entries(envs)) {
    console.log(`\n--- Working on ${key} ---`);

    // Try to remove it first covering all environments
    try {
        execSync(`vercel env rm ${key} production preview development -y`, { stdio: 'ignore' });
    } catch (e) { }

    for (const env of environments) {
        try {
            execSync(`vercel env add ${key} ${env}`, {
                input: value,
                stdio: ['pipe', 'inherit', 'inherit']
            });
            console.log(`✅ Added ${key} to ${env}`);
        } catch (err) {
            console.log(`❌ Failed ${key} in ${env}: ${err.message}`);
        }
    }
}
