import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import sharp from 'sharp';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function compressFile(pptxPath, compressedPptxPath) {
    console.log(`\n📦 Compressing: ${path.basename(pptxPath)}`);
    const tempDir = path.join(process.cwd(), "pptx_temp_" + Date.now());
    
    console.log("1. Unzipping PPTX...");
    if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });
    fs.mkdirSync(tempDir, { recursive: true });
    
    const tempZip = path.join(process.cwd(), `temp_${Date.now()}.zip`);
    fs.copyFileSync(pptxPath, tempZip);
    
    execSync(`powershell -Command "Expand-Archive -Path '${tempZip}' -DestinationPath '${tempDir}' -Force"`);
    fs.unlinkSync(tempZip);

    console.log("2. Compressing images...");
    const mediaDir = path.join(tempDir, "ppt", "media");
    if (fs.existsSync(mediaDir)) {
        const files = fs.readdirSync(mediaDir);
        for (const file of files) {
            const filePath = path.join(mediaDir, file);
            const stat = fs.statSync(filePath);
            
            if (stat.size > 500 * 1024 && (file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg'))) {
                console.log(`   Compressing ${file} (${(stat.size / 1024 / 1024).toFixed(2)} MB)`);
                const tempFilePath = filePath + ".tmp";
                try {
                    await sharp(filePath)
                        .resize({ width: 1600, withoutEnlargement: true })
                        .jpeg({ quality: 60 }) 
                        .toFile(tempFilePath);
                    fs.copyFileSync(tempFilePath, filePath);
                    fs.unlinkSync(tempFilePath);
                } catch (e) {
                    console.error(`   Failed to compress ${file}:`, e.message);
                }
            }
        }
    }

    console.log("3. Re-zipping PPTX...");
    const destZip = path.join(process.cwd(), `dest_${Date.now()}.zip`);
    execSync(`powershell -Command "Compress-Archive -Path '${tempDir}\\*' -DestinationPath '${destZip}' -Force"`);
    
    if (fs.existsSync(compressedPptxPath)) fs.unlinkSync(compressedPptxPath);
    fs.renameSync(destZip, compressedPptxPath);
    fs.rmSync(tempDir, { recursive: true, force: true });
    
    const newStat = fs.statSync(compressedPptxPath);
    console.log(`✅ Done! New size: ${(newStat.size / 1024 / 1024).toFixed(2)} MB`);
    return compressedPptxPath;
}

async function run() {
    const files = [
        { 
            src: "C:\\Users\\kemer\\Downloads\\Robototehnika-LEGO-Education-SPIKE-Prime (1).pptx",
            dest: "C:\\Users\\kemer\\Downloads\\Robototehnika_SPIKE_Compressed.pptx"
        },
        {
            src: "C:\\Users\\kemer\\Downloads\\SPIKE_Prime_KZ_draft.pptx",
            dest: "C:\\Users\\kemer\\Downloads\\SPIKE_KZ_Compressed.pptx"
        }
    ];

    for (const file of files) {
        if (fs.existsSync(file.src)) {
            await compressFile(file.src, file.dest);
        }
    }
    console.log("\n🚀 All files compressed. Now run upload_presentations_v2.mjs again.");
}

run().catch(console.error);
