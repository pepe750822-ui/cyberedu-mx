import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const svgContent = fs.readFileSync(path.join(__dirname, '..', 'public', 'icons', 'icon.svg'), 'utf-8');
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

async function generateIcons() {
    try {
        const sharp = (await import('sharp')).default;

        for (const size of sizes) {
            await sharp(Buffer.from(svgContent))
                .resize(size, size)
                .png()
                .toFile(path.join(__dirname, '..', 'public', 'icons', `icon-${size}x${size}.png`));

            console.log(`✅ Generated icon-${size}x${size}.png`);
        }

        // Maskable icons (same image, no rounded corners)
        const maskableSvg = svgContent.replaceAll('rx="92"', 'rx="0"');
        for (const size of [192, 512]) {
            await sharp(Buffer.from(maskableSvg))
                .resize(size, size)
                .png()
                .toFile(path.join(__dirname, '..', 'public', 'icons', `icon-maskable-${size}x${size}.png`));

            console.log(`✅ Generated icon-maskable-${size}x${size}.png`);
        }

        console.log('\n🎉 All icons generated successfully!');
    } catch (e) {
        if (e.code === 'ERR_MODULE_NOT_FOUND' || e.message?.includes('Cannot find')) {
            console.log('⚠️  sharp not installed. Installing...');
            const { execSync } = await import('child_process');
            execSync('npm install sharp --save-dev', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
            console.log('✅ sharp installed. Please re-run this script.');
        } else {
            throw e;
        }
    }
}

generateIcons();
