// Draws the brand name in cut-paper letters: public/art/title.webp (also usable as a logo).
//   node art/title.mjs
import path from 'node:path';
import { createRequire } from 'node:module';
import { Sheet, svg, C } from './paper.mjs';

const require = createRequire(process.env.ART_TOOLS ? path.join(process.env.ART_TOOLS, 'x.js') : import.meta.url);
const puppeteer = require('puppeteer-core');
const sharp = require('sharp');

const tilt = [-2.4, 1.6, -1, 2, -1.6, 1.2, -0.6, 1.8, -1.4, 0.8];
const word = (w, color) => [...w].map((ch, i) =>
  `<span style="filter:url(#p${i % 4}b)"><b style="color:${color};transform:rotate(${tilt[i % 10]}deg) translateY(${(i % 3) - 1}px)">${ch}</b></span>`).join('');

const html = `<link href="https://fonts.googleapis.com/css2?family=Caprasimo&display=block" rel="stylesheet">
<style>body{margin:0;background:transparent}div{font:400 150px/1 Caprasimo;white-space:nowrap}span{display:inline-block;margin-right:-1px}b{display:inline-block;font-weight:400;padding:6px 1px 14px}</style>
${svg(1, 1, new Sheet({ shadow: .8 })).replace('display:block', 'position:absolute')}
<div style="padding:8px 0 0 14px">${word('Wildflower', C.moss)}</div>
<div style="padding:0 0 0 196px;margin-top:-18px">${word('&', C.roseDeep)}<i style="display:inline-block;width:34px"></i>${word('Wonder', C.brown)}</div>`;

const browser = await (puppeteer.default ?? puppeteer).launch({ executablePath: process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
const p = await browser.newPage();
await p.setViewport({ width: 1100, height: 380, deviceScaleFactor: 2 });
await p.setContent(html, { waitUntil: 'networkidle0' });
await p.evaluate(() => document.fonts.ready);
const png = await p.screenshot({ omitBackground: true });
await browser.close();
const out = path.join(import.meta.dirname, '..', 'public', 'art', 'title.webp');
const trimmed = await sharp(png).trim().toBuffer();
console.log(await sharp(trimmed).webp({ quality: 88, alphaQuality: 95, effort: 6 }).toFile(out));
