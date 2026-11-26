// Turns the drawings into images in public/art. Only needed if you change a drawing.
//   npm install --no-save puppeteer-core sharp   then   node art/render.mjs [name ...]
import fs from 'node:fs'; import path from 'node:path'; import { createRequire } from 'node:module';
import { SPRITES, build } from './sprites.mjs'; import { SCENES, buildScene, EDGES, edgeSvg } from './scenes.mjs';
const require = createRequire(process.env.ART_TOOLS ? path.join(process.env.ART_TOOLS, 'x.js') : import.meta.url);
const puppeteer = require('puppeteer-core'), sharp = require('sharp');
const OUT = path.join(import.meta.dirname, '..', 'public', 'art'); fs.mkdirSync(OUT, { recursive: true });
const only = process.argv.slice(2);
const browser = await (puppeteer.default ?? puppeteer).launch({ executablePath: process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
async function shoot(file, { w, h, svg }, dpr, quality = 82) {
  if (only.length && !only.some(o => file.startsWith(o))) return;
  const p = await browser.newPage(); await p.setViewport({ width: Math.ceil(w), height: Math.ceil(h), deviceScaleFactor: dpr });
  await p.setContent(`<body style="margin:0;background:transparent">${svg}</body>`); 
  const png = await p.screenshot({ omitBackground: true, clip: { x: 0, y: 0, width: w, height: h } }); await p.close();
  await sharp(png).webp({ quality, alphaQuality: 90, effort: 6 }).toFile(path.join(OUT, file + '.webp')); console.log(file, (fs.statSync(path.join(OUT, file + '.webp')).size / 1024 | 0) + 'KB');
}
for (const k of Object.keys(EDGES)) fs.writeFileSync(path.join(OUT, `edge-${k}.svg`), edgeSvg(k));
for (const n of Object.keys(SPRITES)) await shoot(n, build(n), n.startsWith('plant') ? 2 : 2.2);
for (const n of ['bee','butterfly','mushroom','acorn','rabbit','leaf','oak','plant-daisy','plant-poppy','plant-balsam','plant-lupine','plant-cone','squirrel','bird','fox']) await shoot('pencil-' + n, build(n, 'pencil'), 2, 80);
for (const n of Object.keys(SCENES)) await shoot(n, buildScene(n), n.endsWith('-m') ? 2 : 1.5, 78);
// seamless painted-paper grain, laid over every colored band
if (!only.length || only.includes('grain')) {
  const p = await browser.newPage(); await p.setViewport({ width: 640, height: 640, deviceScaleFactor: 1 });
  await p.setContent(`<body style="margin:0;background:transparent"><svg width="640" height="640" style="display:block"><filter id="f" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".0125 .075" numOctaves="3" seed="8" stitchTiles="stitch" result="s"/><feColorMatrix in="s" values="0 0 0 0 1 0 0 0 0 .98 0 0 0 0 .92 0 .5 0 0 -.19" result="l"/><feColorMatrix in="s" values="0 0 0 0 .3 0 0 0 0 .2 0 0 0 0 .12 .34 0 0 0 -.15" result="d"/><feMerge><feMergeNode in="l"/><feMergeNode in="d"/></feMerge></filter><rect width="640" height="640" filter="url(#f)"/></svg></body>`);
  await sharp(await p.screenshot({ omitBackground: true })).webp({ quality: 60, alphaQuality: 60 }).toFile(path.join(OUT, 'grain.webp')); console.log('grain', (fs.statSync(path.join(OUT, 'grain.webp')).size / 1024 | 0) + 'KB');
}
await browser.close();
