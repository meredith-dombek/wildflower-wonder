// Draws the placeholder product images. Replace the files in public/products with real photos any time.
//   node art/mockups.mjs
import fs from 'node:fs'; import path from 'node:path'; import { createRequire } from 'node:module';
import { Sheet, svg, P, A, C, stemPath, ell } from './paper.mjs';
const require = createRequire(process.env.ART_TOOLS ? path.join(process.env.ART_TOOLS, 'x.js') : import.meta.url);
const puppeteer = require('puppeteer-core'), sharp = require('sharp');
const browser = await (puppeteer.default ?? puppeteer).launch({ executablePath: process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
const FONTS = '<link href="https://fonts.googleapis.com/css2?family=Caprasimo&family=Andika:wght@400;700&display=block" rel="stylesheet">';
async function save(out, w, h, html, dpr = 1.2) {
  const p = await browser.newPage(); await p.setViewport({ width: w, height: h, deviceScaleFactor: dpr });
  await p.setContent(FONTS + `<style>*{box-sizing:border-box}body{margin:0}</style>` + html, { waitUntil: 'networkidle0' }); await p.evaluate(() => document.fonts.ready);
  fs.mkdirSync(path.dirname(out), { recursive: true }); const img = sharp(await p.screenshot()); await (out.endsWith(".png") ? img.png({ palette: true, quality: 85 }) : img.webp({ quality: 84 })).toFile(out); await p.close(); console.log(out);
}
const root = path.join(import.meta.dirname, '..', 'public');
const flower = (s, x, y, h, fn, lean = 0) => s.at(x, y, 0, 1, () => { s.cut(stemPath(h, lean, 8, 9), C.sageDeep); s.at(0, -h*.3, 54, 1, () => P.leaf(s, 90, 21)); s.at(lean*.3, -h*.46, -54, 1, () => P.leaf(s, 76, 18, C.sage)); s.at(lean, -h, lean*.2, 1, fn); });

// Cover
{ const s = new Sheet({ seed: 8, shadow: 1.3 });
  s.at(450, 330, 0, 1, () => s.cut(ell(0, 0, 285), C.tanPale, 2));
  s.cut('M-40 690C160 560 360 620 520 690C700 600 860 610 940 660L940 1200L-40 1200Z', C.sagePale, 2);
  s.cut('M-40 800C200 730 420 840 600 790C740 750 860 790 940 780L940 1200L-40 1200Z', C.sage, 2);
  flower(s, 90, 1010, 420, () => P.balsam(s, 84), -14); flower(s, 780, 1020, 470, () => P.poppy(s, 92), 10); flower(s, 208, 1030, 270, () => P.daisy(s, 70), 10); flower(s, 672, 1030, 250, () => P.coneflower(s, 66), -8);
  s.at(440, 1000, 0, 1.2, () => A.rabbit(s)); s.at(600, 1010, 0, 1, () => P.mushroom(s, 52)); s.at(300, 1010, -4, 1, () => P.lupine(s, 170));
  s.at(612, 640, 10, 1, () => A.butterfly(s, 56)); s.at(300, 610, -8, 1.1, () => A.bee(s, 40)); s.at(60, 1090, 0, 1, () => P.fern(s, 180, 20)); s.at(850, 1090, 0, 1, () => P.fern(s, 190, -20));
  s.cut('M-40 1000C180 960 420 1020 600 985C760 960 860 1000 940 985L940 1200L-40 1200Z', C.moss, 2);
  s.at(160, 1070, 30, 1, () => P.acorn(s, 34)); s.at(742, 1084, 66, 1, () => P.oak(s, 110)); 
  await save(path.join(root, 'products/my-little-nature-explorer-pack/cover.webp'), 900, 1160, `<div style="position:relative;width:900px;height:1160px;background:${C.cream};overflow:hidden;font-family:Caprasimo">${svg(900, 1160, s)}<div style="position:absolute;inset:78px 0 auto;text-align:center;color:${C.moss};line-height:.98"><div style="font-size:56px;color:${C.roseDeep}">My Little</div><div style="font-size:122px">Nature<br>Explorer</div><div style="font-size:74px;margin-top:8px;color:${C.brown}">Pack</div></div><div style="position:absolute;bottom:34px;width:100%;text-align:center;color:${C.cream};font:700 30px Andika">Nine printable pages for ages 3–6</div></div>`); }
// Link-preview image
{ const s = new Sheet({ seed: 5, shadow: 1.2 });
  s.cut('M-40 420C160 330 360 380 600 430C800 350 1040 350 1240 420L1240 700L-40 700Z', C.sagePale, 2); s.cut('M-40 500C240 450 500 520 760 490C960 460 1100 500 1240 480L1240 700L-40 700Z', C.sage, 2);
  flower(s, 80, 640, 400, () => P.balsam(s, 70), -8); flower(s, 180, 640, 290, () => P.poppy(s, 70), 8); flower(s, 1130, 640, 420, () => P.poppy(s, 78), 8); flower(s, 1030, 640, 270, () => P.daisy(s, 66), -8); s.at(300, 640, 0, 1, () => P.lupine(s, 180)); s.at(600, 606, 0, .8, () => A.rabbit(s)); s.at(880, 440, 8, 1, () => A.butterfly(s, 42));
  s.cut('M-40 600C240 570 500 610 760 590C960 575 1100 600 1240 590L1240 700L-40 700Z', C.moss, 2);
  await save(path.join(root, 'art/share.png'), 1200, 630, `<div style="position:relative;width:1200px;height:630px;background:${C.cream};overflow:hidden">${svg(1200, 630, s)}<div style="position:absolute;top:66px;width:100%;text-align:center;font:400 112px/.95 Caprasimo;color:${C.moss}">Wildflower<br>&amp; Wonder</div><div style="position:absolute;top:302px;width:100%;text-align:center;font:700 29px Andika;color:${C.brownDeep}">Growing curious minds, one adventure at a time!</div></div>`, 1); }
await browser.close();
