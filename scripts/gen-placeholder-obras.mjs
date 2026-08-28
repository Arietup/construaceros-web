// Script de un solo uso: genera imágenes de ejemplo para las obras del portafolio
// mientras el cliente entrega fotografías reales. Ver task-8-brief.md (desviación autorizada).
// Uso: node scripts/gen-placeholder-obras.mjs
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const WIDTH = 1600;
const HEIGHT = 1200;
const BG = '#16181B';

const escapeXml = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function svgFor(nombreObra) {
  const titulo = 'IMAGEN DE EJEMPLO';
  return `
<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="${BG}" />
  <text x="50%" y="46%" text-anchor="middle" font-family="Arial, sans-serif"
        font-size="88" font-weight="bold" fill="#F2F2F0">${escapeXml(titulo)}</text>
  <text x="50%" y="56%" text-anchor="middle" font-family="Arial, sans-serif"
        font-size="40" fill="#B8B8B4">${escapeXml(nombreObra)}</text>
</svg>`;
}

const obras = [
  { slug: 'pasamanos-acero-quito', nombre: 'Pasamanos en acero inoxidable para escalera principal' },
  { slug: 'galpon-industrial-guayaquil', nombre: 'Galpón industrial en estructura metálica' },
  { slug: 'mausoleo-familiar-ambato', nombre: 'Mausoleo familiar en acero y granito' },
];

for (const { slug, nombre } of obras) {
  const dir = path.join(ROOT, 'src', 'assets', 'obras', slug);
  await mkdir(dir, { recursive: true });
  const svg = Buffer.from(svgFor(nombre));
  for (const file of ['portada.jpg', '01.jpg', '02.jpg']) {
    await sharp(svg).jpeg({ quality: 85 }).toFile(path.join(dir, file));
    console.log('creado', path.join('src/assets/obras', slug, file));
  }
}
