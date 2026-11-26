// The cut-paper kit: every plant and animal on the site is drawn here from simple shapes.
// mode "paint" = painted paper with a soft contact shadow. mode "pencil" = outline only
// (used for anything that is not released yet, and for the coloring-page previews).

export const C = {
  cream: '#FBF3E2', creamDeep: '#F1E2C6', white: '#FFFBF1',
  sagePale: '#CBD6B6', sage: '#A2B38C', sageMid: '#869B70', sageDeep: '#647D56', moss: '#475F42', mossDeep: '#34482F',
  rosePale: '#EBC9BF', rose: '#D49C95', roseMid: '#C27E79', roseDeep: '#A4605F',
  tanPale: '#E8D3AE', tan: '#D5B585', tanDeep: '#B99260', honey: '#DBAA52', honeyDeep: '#BF8A38',
  brownPale: '#A88163', brown: '#7C5A43', brownDeep: '#553B2C', soil: '#3F2C21',
};

export function rng(seed) { let s = seed >>> 0; return () => { s |= 0; s = (s + 0x6d2b79f5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

const mul = (a, b) => [a[0]*b[0]+a[2]*b[1], a[1]*b[0]+a[3]*b[1], a[0]*b[2]+a[2]*b[3], a[1]*b[2]+a[3]*b[3], a[0]*b[4]+a[2]*b[5]+a[4], a[1]*b[4]+a[3]*b[5]+a[5]];

export class Sheet {
  constructor({ mode = 'paint', seed = 1, shadow = 1, pencilFill = '#FFFBF1', pencilWidth = 2.4 } = {}) {
    Object.assign(this, { mode, shadow, pencilFill, pencilWidth });
    this.r = rng(seed); this.m = [1,0,0,1,0,0]; this.stack = []; this.out = []; this.n = 0;
  }
  push(x = 0, y = 0, rot = 0, sx = 1, sy = sx) {
    this.stack.push(this.m); const a = rot * Math.PI / 180, c = Math.cos(a), s = Math.sin(a);
    this.m = mul(this.m, [c*sx, s*sx, -s*sy, c*sy, x, y]); return this;
  }
  pop() { this.m = this.stack.pop(); return this; }
  at(x, y, rot, s, fn) { if (Array.isArray(s)) this.push(x, y, rot, s[0], s[1]); else this.push(x, y, rot, s); fn(this); return this.pop(); }
  // One piece of paper. depth: 0 = flat ink detail, 1 = normal, 2 = big lifted piece.
  cut(d, fill, depth = 1) {
    const M = this.m.map(v => +v.toFixed(3)).join(' ');
    const k = this.n++ % 4;
    if (this.mode === 'pencil') {
      const sc = Math.hypot(this.m[0], this.m[1]) || 1;
      this.out.push(`<path d="${d}" transform="matrix(${M})" fill="${depth === 0 ? 'none' : this.pencilFill}" stroke="${C.brown}" stroke-width="${(this.pencilWidth / sc * (depth === 0 ? .75 : 1)).toFixed(2)}" stroke-linejoin="round" stroke-linecap="round" filter="url(#rough)"/>`);
    } else if (depth === 0) {
      this.out.push(`<path d="${d}" transform="matrix(${M})" fill="${fill}"/>`);
    } else {
      this.out.push(`<g filter="url(#p${k}${depth > 1 ? 'b' : ''})"><path d="${d}" transform="matrix(${M})" fill="${fill}"/></g>`);
    }
    return this;
  }
  ink(d, color = C.soil, w = 2) {
    const M = this.m.map(v => +v.toFixed(3)).join(' ');
    this.out.push(`<path d="${d}" transform="matrix(${M})" fill="none" stroke="${this.mode === 'pencil' ? C.brown : color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${this.mode === 'pencil' ? ' filter="url(#rough)"' : ''}/>`);
    return this;
  }
  body() { return this.out.join('\n'); }
}

const FILTERS = (shadow) => {
  const one = (id, seed, fx, fy, dx, dy, blur, a, wob, k = 1) => `
  <filter id="${id}" x="-25%" y="-25%" width="150%" height="150%" color-interpolation-filters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="${seed}" result="w"/>
    <feDisplacementMap in="SourceGraphic" in2="w" scale="${wob}" xChannelSelector="R" yChannelSelector="G" result="cut"/>
    <feTurbulence type="fractalNoise" baseFrequency="${fx} ${fy}" numOctaves="3" seed="${seed + 7}" result="s"/>
    <feColorMatrix in="s" type="matrix" values="0 0 0 0 1  0 0 0 0 .97  0 0 0 0 .88  0 ${1.15*k} 0 0 ${-.5*k}" result="lite"/>
    <feColorMatrix in="s" type="matrix" values="0 0 0 0 .36  0 0 0 0 .22  0 0 0 0 .12  ${1.1*k} 0 0 0 ${-.54*k}" result="dark"/>
    <feTurbulence type="fractalNoise" baseFrequency=".55" numOctaves="2" seed="${seed + 3}" result="g"/>
    <feColorMatrix in="g" type="matrix" values="0 0 0 0 .25  0 0 0 0 .18  0 0 0 0 .1  0 0 .34 0 -.14" result="grain"/>
    <feComposite in="lite" in2="cut" operator="in" result="l2"/>
    <feComposite in="dark" in2="cut" operator="in" result="d2"/>
    <feComposite in="grain" in2="cut" operator="in" result="g2"/>
    <feOffset in="cut" dx="1.1" dy="1.3" result="off"/>
    <feComposite in="cut" in2="off" operator="out" result="rim"/>
    <feColorMatrix in="rim" type="matrix" values="0 0 0 0 1 0 0 0 0 .98 0 0 0 0 .92 0 0 0 .5 0" result="rim2"/>
    <feGaussianBlur in="cut" stdDeviation="${blur}" result="b"/>
    <feOffset in="b" dx="${dx}" dy="${dy}" result="bo"/>
    <feColorMatrix in="bo" type="matrix" values="0 0 0 0 .19 0 0 0 0 .13 0 0 0 0 .08 0 0 0 ${a} 0" result="sh"/>
    <feMerge><feMergeNode in="sh"/><feMergeNode in="cut"/><feMergeNode in="l2"/><feMergeNode in="d2"/><feMergeNode in="g2"/><feMergeNode in="rim2"/></feMerge>
  </filter>`;
  let s = `<filter id="rough" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency=".06" numOctaves="2" seed="4"/><feDisplacementMap in="SourceGraphic" scale="2.6"/></filter>`;
  [[0,11,.012,.11],[1,23,.1,.014],[2,37,.02,.07],[3,51,.07,.022]].forEach(([k, seed, fx, fy]) => {
    s += one('p'+k, seed, fx, fy, 1.6*shadow, 2.6*shadow, 2.2*shadow, .34, 4);
    s += one('p'+k+'b', seed+90, fx*.45, fy*.45, 2*shadow, 5*shadow, 7*shadow, .3, 7, .5);
  });
  return s;
};

export function svg(w, h, sheet, { bg = '', x = 0, y = 0 } = {}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="${x} ${y} ${w} ${h}" style="display:block"><defs>${FILTERS(sheet.shadow)}</defs>${bg}${sheet.body()}</svg>`;
}

// ---------- shapes ----------
export const petal = (len, w, belly = .55) => `M0 0C${w*.7} ${-len*.12} ${w*1.15} ${-len*belly} ${w*.62} ${-len*.88}C${w*.3} ${-len*1.02} ${-w*.3} ${-len*1.02} ${-w*.62} ${-len*.88}C${-w*1.15} ${-len*belly} ${-w*.7} ${-len*.12} 0 0Z`;
export const point = (len, w) => `M0 0C${w} ${-len*.22} ${w*.85} ${-len*.66} 0 ${-len}C${-w*.85} ${-len*.66} ${-w} ${-len*.22} 0 0Z`;
export const ell = (cx, cy, rx, ry = rx) => `M${cx-rx} ${cy}A${rx} ${ry} 0 1 1 ${cx+rx} ${cy}A${rx} ${ry} 0 1 1 ${cx-rx} ${cy}Z`;
export function blob(r, rx, ry, n = 9, amp = .07, cx = 0, cy = 0) {
  const p = []; for (let i = 0; i < n; i++) { const a = i / n * 2 * Math.PI, k = 1 + (r() - .5) * 2 * amp; p.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]); }
  let d = `M${p[0].map(v => v.toFixed(1))}`;
  for (let i = 0; i < n; i++) { const a = p[(i-1+n)%n], b = p[i], c = p[(i+1)%n], e = p[(i+2)%n];
    d += `C${(b[0]+(c[0]-a[0])/6).toFixed(1)} ${(b[1]+(c[1]-a[1])/6).toFixed(1)} ${(c[0]-(e[0]-b[0])/6).toFixed(1)} ${(c[1]-(e[1]-b[1])/6).toFixed(1)} ${c[0].toFixed(1)} ${c[1].toFixed(1)}`; }
  return d + 'Z';
}
// A cut stem from (0,0) up to (dx,-h), bending by `bend`.
export function stemPath(h, dx = 0, bend = 0, w = 7) {
  const mx = dx / 2 + bend, my = -h / 2;
  return `M${-w/2} 0Q${mx-w/2} ${my} ${dx-w*.3} ${-h}L${dx+w*.3} ${-h}Q${mx+w/2} ${my} ${w/2} 0Z`;
}

// ---------- plants (origin = flower head centre, or ground for whole plants) ----------
export const P = {
  daisy(s, r = 60, { n = 13, col = C.white, col2 = C.creamDeep, eye = C.honey } = {}) {
    for (let i = 0; i < n; i++) s.at(0, 0, i*360/n + 360/n/2, 1, () => s.cut(petal(r*.97, r*.17), col2));
    for (let i = 0; i < n; i++) s.at(0, 0, i*360/n + (s.r()-.5)*7, 1, () => s.cut(petal(r, r*.17), col));
    s.cut(blob(s.r, r*.3, r*.29, 9, .05), eye); s.cut(blob(s.r, r*.15, r*.14, 8, .08, r*.02, r*.02), C.honeyDeep);
  },
  poppy(s, r = 60, { a = C.roseMid, b = C.rose, eye = C.brownDeep } = {}) {
    [[-38,a],[40,a],[150,a],[215,a]].forEach(([rot, c]) => s.at(0, 0, rot, 1, () => s.cut(`M0 0C${r*.55} ${-r*.1} ${r*.95} ${-r*.62} ${r*.5} ${-r*.98}C${r*.28} ${-r*1.12} ${r*.1} ${-r*.96} 0 ${-r*1.0}C${-r*.14} ${-r*1.1} ${-r*.36} ${-r*1.06} ${-r*.52} ${-r*.94}C${-r*.92} ${-r*.6} ${-r*.5} ${-r*.1} 0 0Z`, c)));
    [[0,b],[178,b]].forEach(([rot, c]) => s.at(0, 0, rot, .86, () => s.cut(`M0 0C${r*.6} ${-r*.1} ${r*.9} ${-r*.6} ${r*.46} ${-r*.96}C${r*.2} ${-r*1.08} ${r*.04} ${-r*.94} ${-r*.06} ${-r*.98}C${-r*.2} ${-r*1.06} ${-r*.4} ${-r*1.02} ${-r*.54} ${-r*.9}C${-r*.88} ${-r*.5} ${-r*.5} ${-r*.1} 0 0Z`, c)));
    s.cut(blob(s.r, r*.24, r*.23, 9, .08), eye);
    for (let i = 0; i < 12; i++) { const a2 = i/12*6.28; s.cut(ell(Math.cos(a2)*r*.34, Math.sin(a2)*r*.33, r*.035), C.brownDeep, 0); }
    s.cut(ell(-r*.02, -r*.02, r*.1), C.sage);
  },
  // Arrowleaf balsamroot: the sunny flower of the Boise foothills.
  balsam(s, r = 60) {
    const n = 15;
    for (let i = 0; i < n; i++) s.at(0, 0, i*360/n + 12, 1, () => s.cut(point(r*1.0, r*.17), C.honeyDeep));
    for (let i = 0; i < n; i++) s.at(0, 0, i*360/n + (s.r()-.5)*8, 1, () => s.cut(point(r*.96, r*.18), C.honey));
    s.cut(blob(s.r, r*.36, r*.35, 11, .05), C.brown); s.cut(blob(s.r, r*.23, r*.22, 9, .06), C.brownDeep);
    for (let i = 0; i < 9; i++) { const a = i/9*6.28; s.cut(ell(Math.cos(a)*r*.28, Math.sin(a)*r*.27, r*.03), C.tan, 0); }
  },
  coneflower(s, r = 60) {
    for (let i = 0; i < 9; i++) { s.at((i-4)*r*.12, 0, 180 + (i-4)*-17, 1, () => s.cut(petal(r*1.05, r*.15), i % 2 ? C.rose : C.roseMid)); }
    s.cut(`M${-r*.52} ${r*.1}C${-r*.5} ${-r*.5} ${-r*.2} ${-r*.66} 0 ${-r*.66}C${r*.2} ${-r*.66} ${r*.5} ${-r*.5} ${r*.52} ${r*.1}C${r*.2} ${r*.24} ${-r*.2} ${r*.24} ${-r*.52} ${r*.1}Z`, C.brown);
    for (let j = 0; j < 4; j++) for (let i = 0; i < 6-j; i++) s.cut(ell((i-(5-j)/2)*r*.16, -j*r*.15+r*.02, r*.042), C.honey, 0);
  },
  lupine(s, h = 200, { a = C.rose, b = C.roseMid, c = C.rosePale } = {}) {
    s.cut(stemPath(h, 0, 0, 6), C.sageDeep);
    const rows = 10;
    for (let j = 0; j < rows; j++) { const t = j/(rows-1), y = -h*.22 - t*h*.82, w = 30*(1-t*.82)*(h/200), k = [b,a,c][Math.min(2, Math.floor(t*3))];
      [-1, 1, 0].forEach((sd, q) => s.at(sd*w*.5, y + (q===2?3:0), sd*38, 1, () => s.cut(petal(w*1.15+5, w*.5+2.5), k))); }
  },
  harebell(s, r = 36, col = C.roseMid) {
    s.cut(`M${-r*.5} ${r*.1}C${-r*.6} ${-r*.6} ${-r*.2} ${-r*.8} 0 ${-r*.8}C${r*.2} ${-r*.8} ${r*.6} ${-r*.6} ${r*.5} ${r*.1}C${r*.56} ${r*.4} ${r*.74} ${r*.52} ${r*.78} ${r*.66}C${r*.5} ${r*.6} ${r*.4} ${r*.52} ${r*.3} ${r*.5}C${r*.16} ${r*.66} ${r*.06} ${r*.72} 0 ${r*.78}C${-r*.06} ${r*.72} ${-r*.16} ${r*.66} ${-r*.3} ${r*.5}C${-r*.4} ${r*.52} ${-r*.5} ${r*.6} ${-r*.78} ${r*.66}C${-r*.74} ${r*.52} ${-r*.56} ${r*.4} ${-r*.5} ${r*.1}Z`, col);
    s.cut(point(r*.42, r*.2).replace('M0 0', 'M0 0'), C.sageDeep, 0);
  },
  lace(s, r = 70) { // Queen Anne's lace style umbel
    for (let i = -4; i <= 4; i++) s.at(0, r*.55, i*15, 1, () => s.cut(stemPath(r*(.98-Math.abs(i)*.03), 0, 0, 3.4), C.sageMid));
    for (let i = -4; i <= 4; i++) { const a = i*15*Math.PI/180, x = Math.sin(a)*r*.98, y = r*.55 - Math.cos(a)*r*.96;
      for (let q = 0; q < 6; q++) s.cut(blob(s.r, r*.085, r*.08, 7, .12, x + (s.r()-.5)*r*.26, y + (s.r()-.5)*r*.17), q%3 ? C.white : C.creamDeep); }
  },
  bud(s, r = 26, col = C.rose) { s.cut(point(r*1.7, r*.62), col); s.at(0, 0, -24, 1, () => s.cut(point(r*1.25, r*.36), C.roseMid)); s.at(0,0,20,1,()=>s.cut(point(r*.9, r*.34), C.sageDeep)); s.at(0,0,-20,1,()=>s.cut(point(r*.9, r*.34), C.sageDeep)); },
  leaf(s, len = 90, w = 22, col = C.sageMid, vein = C.sageDeep) { s.cut(point(len, w), col); s.ink(`M0 ${-len*.06}L0 ${-len*.84}`, vein, 1.8); for (let i = 1; i < 5; i++) { const y = -len*(.14 + i*.14), k = w*.5*(1-i*.14); s.ink(`M0 ${y}L${k} ${y-k*.9}M0 ${y}L${-k} ${y-k*.9}`, vein, 1.3); } },
  arrowleaf(s, len = 120, col = C.sage, vein = C.sageDeep) { s.cut(`M0 0C6 -8 8 -14 8 -20C28 -8 ${len*.3} -6 ${len*.34} 6C${len*.36} ${-len*.36} ${len*.18} ${-len*.8} 0 ${-len}C${-len*.18} ${-len*.8} ${-len*.36} ${-len*.36} ${-len*.34} 6C${-len*.3} -6 -28 -8 -8 -20C-8 -14 -6 -8 0 0Z`, col); s.ink(`M0 -10L0 ${-len*.86}M0 ${-len*.3}L${len*.17} ${-len*.42}M0 ${-len*.3}L${-len*.17} ${-len*.42}M0 ${-len*.52}L${len*.13} ${-len*.64}M0 ${-len*.52}L${-len*.13} ${-len*.64}`, vein, 1.8); },
  oak(s, len = 120, col = C.tanDeep, vein = C.brown) {
    const L = len; s.cut(`M0 0C4 ${-L*.08} 6 ${-L*.1} 10 ${-L*.14}C${L*.2} ${-L*.1} ${L*.24} ${-L*.2} ${L*.16} ${-L*.28}C${L*.32} ${-L*.28} ${L*.36} ${-L*.42} ${L*.22} ${-L*.48}C${L*.36} ${-L*.5} ${L*.36} ${-L*.66} ${L*.2} ${-L*.68}C${L*.28} ${-L*.78} ${L*.18} ${-L*.88} ${L*.1} ${-L*.84}C${L*.1} ${-L*.96} ${L*.04} ${-L} 0 ${-L}C${-L*.04} ${-L} ${-L*.1} ${-L*.96} ${-L*.1} ${-L*.84}C${-L*.18} ${-L*.88} ${-L*.28} ${-L*.78} ${-L*.2} ${-L*.68}C${-L*.36} ${-L*.66} ${-L*.36} ${-L*.5} ${-L*.22} ${-L*.48}C${-L*.36} ${-L*.42} ${-L*.32} ${-L*.28} ${-L*.16} ${-L*.28}C${-L*.24} ${-L*.2} ${-L*.2} ${-L*.1} -10 ${-L*.14}C-6 ${-L*.1} -4 ${-L*.08} 0 0Z`, col);
    s.ink(`M0 ${L*.06}L0 ${-L*.9}M0 ${-L*.24}L${L*.13} ${-L*.34}M0 ${-L*.24}L${-L*.13} ${-L*.34}M0 ${-L*.46}L${L*.15} ${-L*.56}M0 ${-L*.46}L${-L*.15} ${-L*.56}M0 ${-L*.66}L${L*.09} ${-L*.76}M0 ${-L*.66}L${-L*.09} ${-L*.76}`, vein, 1.9);
  },
  aspen(s, len = 90, col = C.honey, vein = C.honeyDeep) { const L = len; s.ink(`M0 ${L*.34}Q4 ${L*.16} 0 0`, vein, 3); s.cut(`M0 0C${L*.16} ${L*.1} ${L*.56} ${-L*.02} ${L*.52} ${-L*.4}C${L*.48} ${-L*.7} ${L*.16} ${-L*.84} 0 ${-L}C${-L*.16} ${-L*.84} ${-L*.48} ${-L*.7} ${-L*.52} ${-L*.4}C${-L*.56} ${-L*.02} ${-L*.16} ${L*.1} 0 0Z`, col); s.ink(`M0 0L0 ${-L*.8}M0 ${-L*.14}L${L*.3} ${-L*.36}M0 ${-L*.14}L${-L*.3} ${-L*.36}M0 ${-L*.4}L${L*.22} ${-L*.58}M0 ${-L*.4}L${-L*.22} ${-L*.58}`, vein, 1.8); },
  fern(s, h = 180, bend = 20, col = C.sageDeep) {
    s.cut(stemPath(h, bend, 0, 5), C.moss);
    const n = 11; for (let i = 1; i <= n; i++) { const t = i/(n+.4), x = bend*t*t, y = -h*t, l = h*.27*(1-t*.78); s.at(x, y, 62, 1, () => s.cut(point(l, l*.2), col)); s.at(x, y, -62, 1, () => s.cut(point(l, l*.2), col)); }
    s.at(bend, -h, 8, 1, () => s.cut(point(h*.09, h*.02), col));
  },
  blade(s, h = 200, lean = 30, w = 14, col = C.sageMid) { s.cut(`M${-w/2} 0Q${lean*.1-w*.5} ${-h*.6} ${lean} ${-h}Q${lean*.1+w*.6} ${-h*.5} ${w/2} 0Z`, col); },
  grassHead(s, h = 220, lean = 24, col = C.tan) { s.cut(stemPath(h, lean, 0, 4), C.tanDeep); for (let i = 0; i < 7; i++) { const t = .66 + i*.052; s.at(lean*t*t, -h*t, 26, 1, () => s.cut(point(20-i, 4.6), col)); s.at(lean*t*t, -h*t, -22, 1, () => s.cut(point(20-i, 4.6), col)); } s.at(lean,-h,8,1,()=>s.cut(point(20,5),col)); },
  mushroom(s, r = 60, { cap = C.roseMid, dots = C.cream } = {}) {
    s.cut(`M${-r*.24} 0C${-r*.36} ${-r*.1} ${-r*.2} ${-r*.5} ${-r*.2} ${-r*.95}L${r*.2} ${-r*.95}C${r*.2} ${-r*.5} ${r*.38} ${-r*.1} ${r*.26} 0C${r*.1} ${r*.06} ${-r*.1} ${r*.06} ${-r*.24} 0Z`, C.creamDeep);
    s.cut(`M${-r*.82} ${-r*.8}C${-r*.4} ${-r*.58} ${r*.4} ${-r*.58} ${r*.82} ${-r*.8}C${r*.4} ${-r*1.0} ${-r*.4} ${-r*1.0} ${-r*.82} ${-r*.8}Z`, C.tan);
    for (let i = -4; i <= 4; i++) s.ink(`M${i*r*.07} ${-r*.9}L${i*r*.15} ${-r*.68}`, C.tanDeep, 1.5);
    s.cut(`M${-r*1.02} ${-r*.78}C${-r*1.0} ${-r*1.5} ${-r*.44} ${-r*1.82} 0 ${-r*1.82}C${r*.44} ${-r*1.82} ${r*1.0} ${-r*1.5} ${r*1.02} ${-r*.78}C${r*.5} ${-r*.98} ${-r*.5} ${-r*.98} ${-r*1.02} ${-r*.78}Z`, cap);
    [[-.5,-1.2,.14],[.05,-1.5,.17],[.5,-1.16,.12],[-.14,-1.12,.09],[.28,-1.0,.06],[-.74,-.96,.07]].forEach(([x,y,k]) => s.cut(blob(s.r, r*k, r*k*.86, 8, .1, x*r, y*r), dots));
  },
  acorn(s, r = 40) {
    s.cut(`M${-r*.78} ${-r*.15}C${-r*.78} ${r*.7} ${-r*.2} ${r*1.0} 0 ${r*1.24}C${r*.2} ${r*1.0} ${r*.78} ${r*.7} ${r*.78} ${-r*.15}Z`, C.tan);
    s.cut(`M${-r*.4} ${r*.05}C${-r*.44} ${r*.5} ${-r*.2} ${r*.76} ${-r*.1} ${r*.86}C${-r*.24} ${r*.5} ${-r*.2} ${r*.2} ${-r*.16} ${r*.05}Z`, C.tanPale, 0);
    s.cut(`M${-r*.08} ${-r*.8}C${-r*.14} ${-r*1.1} 0 ${-r*1.26} ${r*.14} ${-r*1.3}L${r*.22} ${-r*1.16}C${r*.1} ${-r*1.08} ${r*.1} ${-r*.95} ${r*.12} ${-r*.8}Z`, C.brownDeep);
    s.cut(`M${-r*.98} ${-r*.02}C${-r*1.04} ${-r*.66} ${-r*.5} ${-r*.92} 0 ${-r*.92}C${r*.5} ${-r*.92} ${r*1.04} ${-r*.66} ${r*.98} ${-r*.02}C${r*.5} ${r*.14} ${-r*.5} ${r*.14} ${-r*.98} ${-r*.02}Z`, C.brown);
    for (let i = -3; i <= 3; i++) s.ink(`M${i*r*.26} ${-r*.02+ (3-Math.abs(i))*r*.02}Q${i*r*.22} ${-r*.5} ${i*r*.06} ${-r*.84}`, C.brownDeep, 1.5);
    [-.28,-.54].forEach(y => s.ink(`M${-r*(.9+y*.2)} ${y*r}Q0 ${y*r+r*.16} ${r*(.9+y*.2)} ${y*r}`, C.brownDeep, 1.5));
  },
};

// ---------- animals ----------
export const A = {
  bee(s, r = 40) {
    s.at(-r*.1, -r*.5, -24, 1, () => s.cut(petal(r*1.15, r*.5), C.white));
    s.at(r*.2, -r*.52, 22, 1, () => s.cut(petal(r*1.2, r*.52), C.cream));
    s.cut(`M${r*.9} ${r*.08}L${r*1.22} ${r*.16}L${r*.92} ${r*.26}Z`, C.brownDeep, 0);
    s.cut(`M${-r*.9} ${r*.06}C${-r*.9} ${-r*.5} ${-r*.4} ${-r*.66} ${r*.06} ${-r*.64}C${r*.6} ${-r*.62} ${r*1.0} ${-r*.28} ${r*1.02} ${r*.14}C${r*1.0} ${r*.5} ${r*.5} ${r*.68} 0 ${r*.66}C${-r*.5} ${r*.64} ${-r*.9} ${r*.5} ${-r*.9} ${r*.06}Z`, C.honey);
    s.cut(`M${-r*.12} ${-r*.65}C${r*.06} ${-r*.3} ${r*.06} ${r*.3} ${-r*.1} ${r*.66}L${r*.18} ${r*.66}C${r*.34} ${r*.3} ${r*.34} ${-r*.3} ${r*.16} ${-r*.64}Z`, C.brownDeep);
    s.cut(`M${r*.46} ${-r*.55}C${r*.6} ${-r*.2} ${r*.6} ${r*.3} ${r*.46} ${r*.6}L${r*.7} ${r*.5}C${r*.84} ${r*.2} ${r*.84} ${-r*.16} ${r*.72} ${-r*.4}Z`, C.brownDeep);
    s.cut(blob(s.r, r*.42, r*.42, 9, .04, -r*.74, r*.04), C.brown);
    s.cut(ell(-r*.9, -r*.02, r*.08), C.cream, 0); s.cut(ell(-r*.7, r*.02, r*.08), C.cream, 0);
    s.ink(`M${-r*.94} ${r*.2}Q${-r*.84} ${r*.28} ${-r*.72} ${r*.22}`, C.cream, r*.05);
    s.ink(`M${-r*.86} ${-r*.34}Q${-r*1.0} ${-r*.66} ${-r*1.2} ${-r*.66}M${-r*.66} ${-r*.38}Q${-r*.7} ${-r*.74} ${-r*.86} ${-r*.84}`, C.brownDeep, r*.07);
  },
  butterfly(s, r = 60, { a = C.roseMid, b = C.rosePale, c = C.roseDeep } = {}) {
    [1, -1].forEach(k => s.at(0, 0, 0, [k, 1], () => {
      s.cut(`M4 6C${r*.3} ${r*.1} ${r*.8} ${r*.16} ${r*.82} ${r*.5}C${r*.82} ${r*.9} ${r*.42} ${r*1.0} ${r*.24} ${r*.72}C${r*.12} ${r*.5} 6 ${r*.3} 4 6Z`, c);
      s.cut(`M3 2C${r*.2} ${-r*.6} ${r*.7} ${-r*1.0} ${r*1.06} ${-r*.82}C${r*1.3} ${-r*.6} ${r*1.1} ${r*.04} ${r*.74} ${r*.16}C${r*.4} ${r*.26} ${r*.12} ${r*.12} 3 2Z`, a);
      s.cut(`M${r*.16} ${-r*.1}C${r*.34} ${-r*.5} ${r*.66} ${-r*.74} ${r*.88} ${-r*.64}C${r*1.0} ${-r*.5} ${r*.86} ${-r*.1} ${r*.62} ${-r*.02}C${r*.4} ${r*.06} ${r*.24} ${r*.02} ${r*.16} ${-r*.1}Z`, b);
      s.cut(ell(r*.74, -r*.42, r*.1), C.brownDeep, 0); s.cut(ell(r*.5, -r*.2, r*.07), C.brownDeep, 0);
      s.cut(ell(r*.5, r*.56, r*.14), C.honey); s.cut(ell(r*.97, -r*.7, r*.045), C.cream, 0); s.cut(ell(r*1.06, -r*.5, r*.04), C.cream, 0);
    }));
    s.ink(`M-2 ${-r*.3}Q${-r*.1} ${-r*.66} ${-r*.3} ${-r*.76}M2 ${-r*.3}Q${r*.1} ${-r*.66} ${r*.3} ${-r*.76}`, C.brownDeep, r*.05);
    s.cut(ell(-r*.3, -r*.77, r*.05), C.brownDeep, 0); s.cut(ell(r*.3, -r*.77, r*.05), C.brownDeep, 0);
    s.cut(`M0 ${-r*.36}C${r*.12} ${-r*.34} ${r*.1} ${-r*.1} ${r*.09} ${r*.1}C${r*.08} ${r*.4} ${r*.04} ${r*.6} 0 ${r*.66}C${-r*.04} ${r*.6} ${-r*.08} ${r*.4} ${-r*.09} ${r*.1}C${-r*.1} ${-r*.1} ${-r*.12} ${-r*.34} 0 ${-r*.36}Z`, C.brownDeep);
  },
  ladybug(s, r = 30) {
    s.cut(blob(s.r, r*.5, r*.42, 8, .04, 0, -r*.72), C.soil);
    s.ink(`M${-r*.2} ${-r*1.06}Q${-r*.3} ${-r*1.3} ${-r*.5} ${-r*1.3}M${r*.2} ${-r*1.06}Q${r*.3} ${-r*1.3} ${r*.5} ${-r*1.3}`, C.soil, r*.08);
    s.cut(ell(0, 0, r*.92, r*.86), C.roseDeep); s.ink(`M0 ${-r*.84}L0 ${r*.84}`, C.soil, r*.09);
    [[-.42,-.28],[.42,-.28],[-.5,.22],[.5,.22],[-.22,.56],[.22,.56]].forEach(([x,y]) => s.cut(ell(x*r, y*r, r*.14), C.soil, 0));
  },
  snail(s, r = 40) {
    s.cut(`M${-r*1.6} ${r*.1}C${-r*1.7} ${-r*.4} ${-r*1.3} ${-r*.5} ${-r*1.1} ${-r*.2}C${-r*.9} ${r*.2} ${r*.4} ${r*.2} ${r*1.4} ${r*.5}C${r*.6} ${r*.6} ${-r*1.2} ${r*.6} ${-r*1.6} ${r*.1}Z`, C.tanPale);
    s.ink(`M${-r*1.5} ${-r*.2}L${-r*1.72} ${-r*.72}M${-r*1.3} ${-r*.26}L${-r*1.3} ${-r*.78}`, C.tanDeep, r*.08); s.cut(ell(-r*1.72,-r*.76,r*.07),C.brownDeep,0); s.cut(ell(-r*1.3,-r*.82,r*.07),C.brownDeep,0);
    s.cut(blob(s.r, r*.9, r*.84, 10, .03, 0, -r*.34), C.brownPale);
    s.ink(`M${r*.7} ${-r*.2}C${r*.6} ${-r*1.0} ${-r*.66} ${-r*1.0} ${-r*.6} ${-r*.3}C${-r*.5} ${r*.2} ${r*.36} ${r*.2} ${r*.34} ${-r*.36}C${r*.3} ${-r*.7} ${-r*.24} ${-r*.66} ${-r*.22} ${-r*.32}`, C.brownDeep, r*.1);
  },
  rabbit(s, k = 1) { s.at(0, 0, 0, k, () => {
    s.cut(blob(s.r, 17, 16, 9, .1, 80, -32), C.white);
    s.at(-22, -150, 14, 1, () => { s.cut(petal(84, 21, .5), C.tanDeep); });
    s.cut('M-46 0C-80 -14 -74 -96 -18 -112C46 -122 92 -68 84 -22C80 2 62 2 40 2Z', C.tan);
    s.cut(ell(-34, -26, 15, 27), C.tanDeep);
    s.cut('M-4 -6C-16 -50 14 -86 50 -80C84 -72 92 -30 74 -6C50 6 14 6 -4 -6Z', C.tanDeep);
    s.cut('M-12 4C-20 -14 14 -18 46 -14C62 -10 60 4 48 4Z', C.tanPale);
    s.cut('M-52 4C-64 -10 -34 -14 -22 -10C-12 -6 -14 4 -22 4Z', C.tanPale);
    s.at(-44, -152, -10, 1, () => { s.cut(petal(90, 22, .5), C.tan); s.at(0, -8, 0, 1, () => s.cut(petal(70, 12, .5), C.rosePale)); });
    s.cut('M-92 -122C-92 -148 -66 -166 -38 -164C-8 -160 4 -138 -2 -118C-10 -98 -36 -92 -58 -94C-78 -96 -92 -104 -92 -122Z', C.tan);
    s.cut('M-92 -120C-92 -106 -80 -97 -62 -95C-52 -98 -54 -112 -64 -118C-74 -122 -86 -124 -92 -120Z', C.cream);
    s.cut(ell(-40, -112, 12, 9), C.rose); s.cut('M-95 -126C-92 -132 -82 -132 -80 -126C-83 -119 -91 -119 -95 -126Z', C.roseDeep, 0);
    s.cut(ell(-58, -134, 6.5, 7.5), C.soil, 0); s.cut(ell(-60, -137, 2.2), C.white, 0);
  }); },
  fox(s, k = 1) { s.at(0, 0, 0, k, () => { // asleep, curled
    s.cut('M-70 4C-116 -30 -70 -116 14 -118C96 -118 134 -60 118 -14C110 6 80 8 60 8Z', C.roseDeep);
    s.cut('M40 -8C20 -50 54 -86 92 -70C122 -54 124 -16 104 2C80 12 52 8 40 -8Z', '#92524F');
    s.at(-78, -66, -22, 1, () => { s.cut('M-18 6L-8 -42L20 0Z', C.brownDeep); });
    s.at(-28, -72, 16, 1, () => { s.cut('M-20 4L6 -44L20 8Z', C.roseDeep); s.cut('M-9 2L5 -28L11 4Z', C.rosePale, 0); });
    s.cut('M122 -20C134 14 70 36 -10 32C-56 28 -92 16 -100 2C-70 -16 -30 -10 10 -14C60 -20 96 -40 122 -20Z', C.roseMid);
    s.cut('M-100 2C-92 16 -66 26 -38 30C-42 16 -44 4 -38 -10C-66 -12 -86 -8 -100 2Z', C.cream);
    s.cut('M-128 -34C-120 -64 -88 -82 -58 -80C-26 -78 -6 -62 -4 -40C-16 -22 -46 -8 -74 -4C-100 -4 -124 -14 -128 -34Z', C.roseDeep);
    s.cut('M-128 -32C-124 -14 -100 -4 -76 -4C-50 -8 -30 -16 -18 -26C-46 -30 -60 -26 -72 -34C-90 -44 -112 -42 -128 -32Z', C.cream);
    s.ink('M-94 -46Q-86 -38 -76 -45M-46 -44Q-38 -36 -28 -44', C.soil, 4); s.cut(ell(-124, -30, 9, 7), C.soil, 0); s.cut(ell(-34, -30, 9, 6), C.rose, 0);
  }); },
  squirrel(s, k = 1) { s.at(0, 0, 0, k, () => {
    s.cut('M34 0C92 -8 122 -62 102 -118C92 -150 120 -158 124 -186C124 -214 78 -224 56 -192C34 -160 62 -126 40 -86C28 -62 20 -30 34 0Z', "#9A6A4B");
    s.cut('M48 -14C82 -28 98 -70 84 -114C76 -146 94 -164 98 -184C92 -196 72 -194 66 -176C56 -146 76 -116 60 -78C50 -54 44 -32 48 -14Z', C.tanDeep);
    s.cut('M-30 2C-52 -22 -44 -92 0 -106C44 -104 66 -58 56 -14C52 2 40 4 30 4Z', "#9A6A4B");
    s.cut('M-30 -8C-40 -32 -34 -74 -8 -86C4 -72 4 -30 -8 -2Z', C.tanPale);
    s.cut('M0 -2C-6 -38 24 -62 48 -46C64 -30 58 -4 42 4Z', '#87593D');
    s.cut('M-28 6C-34 -8 6 -10 26 -4C34 4 24 8 18 8Z', C.brownDeep);
    s.at(0, -138, 12, 1, () => s.cut(point(34, 11), C.brownDeep)); s.at(-20, -142, -8, 1, () => s.cut(point(34, 12), "#9A6A4B"));
    s.cut('M-64 -112C-62 -136 -38 -150 -14 -148C14 -144 24 -124 16 -106C6 -90 -18 -86 -38 -90C-54 -94 -64 -100 -64 -112Z', "#9A6A4B");
    s.cut('M-64 -110C-62 -98 -48 -91 -36 -91C-26 -96 -30 -106 -40 -108C-50 -112 -60 -114 -64 -110Z', C.tanPale);
    s.cut(ell(-34, -122, 6, 7), C.soil, 0); s.cut(ell(-36, -125, 2), C.white, 0); s.cut(ell(-64, -113, 5, 4), C.soil, 0);
    s.at(-46, -56, 10, .58, () => P.acorn(s, 36)); s.cut('M4 -78C-10 -82 -38 -74 -46 -62C-48 -52 -36 -50 -28 -56C-14 -60 6 -58 10 -66Z', C.brownDeep);
  }); },
  bird(s, k = 1, { a = C.sageDeep, b = C.sage, belly = C.rosePale } = {}) { s.at(0, 0, 0, k, () => {
    s.ink('M-4 0L-8 26M12 0L12 26M-8 26l-8 4M-8 26l6 5M12 26l-8 4M12 26l7 4', C.brownDeep, 4);
    s.cut('M54 -22L112 -2L104 14L46 4Z', a);
    s.cut('M-58 -56C-58 -86 -28 -96 -8 -84C22 -66 58 -40 66 -14C40 10 -20 14 -44 -10C-56 -24 -60 -40 -58 -56Z', b);
    s.cut('M-54 -38C-56 -14 -30 8 10 4C28 2 26 -8 10 -16C-10 -26 -30 -42 -54 -38Z', belly);
    s.cut('M-10 -52C20 -58 60 -34 78 -8C50 0 6 -8 -8 -30C-14 -40 -14 -46 -10 -52Z', a);
    s.cut('M-58 -66L-84 -58L-57 -54Z', C.honeyDeep); s.cut(ell(-38, -68, 5), C.soil, 0); s.cut(ell(-39.5, -69.5, 1.6), C.white, 0);
  }); },
};
