/**
 * rebuild-favicons.mjs
 * Finds the tight bounding box of non-white pixels in the source PNG,
 * crops to it, then scales the logo to fill 90 % of each target canvas.
 *
 * Usage:  node scripts/rebuild-favicons.mjs
 * Requires: sharp  (already in node_modules)
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

// ── 1. Read the base-64 PNG embedded in favicon.svg ──────────────────────────
const svgPath = path.join(root, 'public', 'favicon.svg');
const svgText = fs.readFileSync(svgPath, 'utf8');

const b64Match = svgText.match(/href="data:image\/png;base64,([^"]+)"/);
if (!b64Match) throw new Error('Could not find embedded PNG in favicon.svg');

const srcBuffer = Buffer.from(b64Match[1], 'base64');

// ── 2. Get raw RGBA pixels so we can find the true bounding box ───────────────
const { data: raw, info } = await sharp(srcBuffer)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width: W, height: H, channels } = info; // channels = 4

// Walk every pixel; anything with alpha>30 or not-close-to-white counts as logo
let minX = W, maxX = 0, minY = H, maxY = 0;

for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const i = (y * W + x) * channels;
    const r = raw[i], g = raw[i+1], b = raw[i+2], a = raw[i+3];

    // Consider pixel "logo" if it has real alpha, or if RGB is non-white
    const isWhite = r > 245 && g > 245 && b > 245;
    const isTransparent = a < 30;
    if (!isWhite && !isTransparent) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
}

// Add a 1-px margin so nothing gets clipped
minX = Math.max(0, minX - 1);
minY = Math.max(0, minY - 1);
maxX = Math.min(W - 1, maxX + 1);
maxY = Math.min(H - 1, maxY + 1);

const cropW = maxX - minX + 1;
const cropH = maxY - minY + 1;
console.log(`Bounding box: x=${minX} y=${minY}  ${cropW}×${cropH}  (source ${W}×${H})`);

// Crop to the tight bounding box → PNG buffer
const croppedBuf = await sharp(srcBuffer)
  .extract({ left: minX, top: minY, width: cropW, height: cropH })
  .png()
  .toBuffer();

// ── 3. Helper: place logo on a transparent square canvas at FILL_PCT coverage
const FILL_PCT = 0.90;

async function makeSquare(size) {
  const logoSize = Math.round(size * FILL_PCT);

  // Scale logo (keeping aspect ratio) so the longest dimension = logoSize
  const aspect = cropW / cropH;
  let lw, lh;
  if (aspect >= 1) {
    lw = logoSize;
    lh = Math.round(logoSize / aspect);
  } else {
    lh = logoSize;
    lw = Math.round(logoSize * aspect);
  }

  const left   = Math.round((size - lw) / 2);
  const top    = Math.round((size - lh) / 2);
  const right  = size - lw - left;
  const bottom = size - lh - top;

  return sharp(croppedBuf)
    .resize(lw, lh, { fit: 'fill', kernel: 'lanczos3' })
    .extend({
      top, bottom, left, right,
      background: { r: 255, g: 255, b: 255, alpha: 0 },
    })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toBuffer();
}

// ── 4. Export every standard favicon / PWA size ───────────────────────────────
const assetsDir = path.join(root, 'public', 'assets', 'gileara');

const sizes = [
  { file: 'favicon-32x32.png',    size: 32  },
  { file: 'apple-touch-icon.png', size: 180 },
  { file: 'icon-192.png',         size: 192 },
  { file: 'icon-512.png',         size: 512 },
];

for (const { file, size } of sizes) {
  const buf  = await makeSquare(size);
  const dest = path.join(assetsDir, file);
  fs.writeFileSync(dest, buf);
  const kb = (buf.length / 1024).toFixed(1);
  console.log(`Wrote ${file}  ${size}×${size}  (${kb} kB)`);
}

// ── 5. Rebuild favicon.svg with the 512-px PNG embedded ──────────────────────
const icon512 = fs.readFileSync(path.join(assetsDir, 'icon-512.png'));
const newB64  = icon512.toString('base64');

const newSvg =
  `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">` +
  `<image href="data:image/png;base64,${newB64}" width="512" height="512" ` +
  `preserveAspectRatio="xMidYMid meet"/>` +
  `</svg>`;

fs.writeFileSync(svgPath, newSvg, 'utf8');
console.log(`\nRebuilt favicon.svg`);
console.log('All done! ✓');
