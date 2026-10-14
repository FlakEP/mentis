// Erzeugt die Vorschaubilder für geteilte Links (public/og-image.png und public/og-image-en.png, je 1200 × 630):
// Sand-Hintergrund, Logo mittig, Leitsatz darunter. Aufruf: „npm run og-bild“ (nur nötig, wenn sich Logo oder Leitsatz ändern).
// Braucht einen installierten Chrome/Chromium-Browser. Pfad bei Bedarf über die Umgebungsvariable CHROMIUM_PFAD angeben.

import { readFileSync } from 'node:fs';
import { chromium } from 'playwright-core';
import { parse } from 'yaml';

const ui = parse(readFileSync('inhalte/ui.yaml', 'utf8'));
// Schrift direkt einbetten (eine leere Browserseite darf keine lokalen Dateien nachladen)
const schrift = `data:font/woff2;base64,${readFileSync(
  'node_modules/@fontsource-variable/fraunces/files/fraunces-latin-opsz-italic.woff2',
).toString('base64')}`;

// Farben wie in src/styles/tokens.css
const FARBEN = { sand50: '#fbf8f3', sand100: '#f5efe5', inkSoft: '#5e554c', sage: '#6f8a73', terra: '#b8644a' };

/** Bogenpaar wie in src/lib/bogen.ts (Bildmarke: Start 131°, 158° lang, 22° Lücke). */
function bogen(cx, cy, r, start, spanne) {
  const punkt = (grad) => [cx + r * Math.cos((grad * Math.PI) / 180), cy + r * Math.sin((grad * Math.PI) / 180)];
  const [x1, y1] = punkt(start);
  const [x2, y2] = punkt(start + spanne);
  return `M${x1.toFixed(1)} ${y1.toFixed(1)}A${r} ${r} 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`;
}
const ring = (r, drehung, breite, deckkraft) =>
  [0, 180].map((versatz, i) => {
    const farbe = i === 0 ? FARBEN.sage : FARBEN.terra;
    return `<path d="${bogen(600, 315, r, 131 + drehung + versatz, 158)}" fill="none" stroke="${farbe}" stroke-width="${breite}" stroke-linecap="round" opacity="${deckkraft}"/>`;
  }).join('');

function seite(sprache) {
  const logo = readFileSync(`logo/logo-mentis-uno-${sprache}.svg`, 'utf8');
  const leitsatz = ui.marke.leitsatz[sprache];
  return `<!doctype html><html><head><meta charset="utf-8"><style>
    @font-face { font-family: 'Fraunces'; font-style: italic; src: url('${schrift}') format('woff2'); }
    html, body { margin: 0; width: 1200px; height: 630px; overflow: hidden; background: ${FARBEN.sand50}; }
    .deko { position: absolute; inset: 0; }
    .mitte { position: absolute; inset: 0; display: grid; place-content: center; justify-items: center; gap: 44px; }
    .mitte svg { width: 640px; height: auto; }
    p { margin: 0; font-family: 'Fraunces', Georgia, serif; font-style: italic; font-size: 34px; color: ${FARBEN.inkSoft}; }
  </style></head><body>
    <svg class="deko" viewBox="0 0 1200 630">${ring(420, -10, 1.6, 0.35)}${ring(520, 14, 1.3, 0.22)}${ring(620, -24, 1.1, 0.14)}</svg>
    <div class="mitte">${logo}<p>${leitsatz}</p></div>
  </body></html>`;
}

const browser = await chromium.launch(
  process.env.CHROMIUM_PFAD ? { executablePath: process.env.CHROMIUM_PFAD } : { channel: 'chrome' },
);
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
for (const [sprache, datei] of [
  ['de', 'public/og-image.png'],
  ['en', 'public/og-image-en.png'],
]) {
  await page.setContent(seite(sprache), { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: datei });
  console.log(`✔ ${datei}`);
}
await browser.close();
