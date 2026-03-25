import { execSync } from 'child_process';

const projectId = "n0mbi7p9";
const dataset = "production";
const token = "skRjSYKCGPJptT2sZLwEYEMyfIAuaKCq4ys56Gp3UlQ6pPYSX1ghD2XgedMN7g8xPWpcFrrZTvlVDePaCFcNDSmbY04840P6C6inuyIsZseTE2n6mnSpsWKjHSM4VB3ELp0J3xNmlcBdDvbZzRutwguKu7oDb6RipAabp8SRX3aXx51N7YuS";

console.log(`Importing to project ${projectId}, dataset ${dataset}...`);

try {
  execSync(`cmd /c "npx -y sanity@latest dataset import old_sanity_backup.tar.gz ${dataset} --project ${projectId} --replace"`, { 
    stdio: 'inherit',
    env: {
        ...process.env,
        SANITY_PROJECT_ID: projectId,
        SANITY_AUTH_TOKEN: token
    }
  });
  console.log("✅ Import successful!");
} catch (error) {
  console.error("❌ Import failed:", error.message);
}
