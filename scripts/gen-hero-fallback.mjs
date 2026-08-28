// Script de un solo uso: genera la imagen de respaldo del hero 3D
// mientras el cliente entrega una fotografía real. Ver task-13-brief.md (desviación autorizada).
// Uso: node scripts/gen-hero-fallback.mjs
import sharp from 'sharp';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const WIDTH = 1600;
const HEIGHT = 900;
const BG = '#0B0B0C';

const svg = `
<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="${BG}" />
  <text x="50%" y="48%" text-anchor="middle" font-family="Arial, sans-serif"
        font-size="90" font-weight="bold" fill="#F2F2F0">IMAGEN DE EJEMPLO</text>
  <text x="50%" y="58%" text-anchor="middle" font-family="Arial, sans-serif"
        font-size="38" fill="#B8B8B4">Hero 3D — respaldo</text>
</svg>`;

const dest = path.join(ROOT, 'src', 'assets', 'hero-fallback.jpg');
await sharp(Buffer.from(svg)).jpeg({ quality: 85 }).toFile(dest);
console.log('creado', path.join('src/assets/hero-fallback.jpg'));
