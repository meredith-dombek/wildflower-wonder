import { Sheet, svg, P, A, C, stemPath } from './paper.mjs';

// A smooth hill: ys = heights at evenly spaced points across w.
function hill(w, h, ys) {
  const n = ys.length - 1, p = ys.map((y, i) => [i / n * w, y]);
  let d = `M${-40} ${h + 60}L${-40} ${p[0][1]}L${p[0]}`;
  for (let i = 0; i < n; i++) { const a = p[Math.max(0, i-1)], b = p[i], c = p[i+1], e = p[Math.min(n, i+2)];
    d += `C${b[0]+(c[0]-a[0])/6} ${b[1]+(c[1]-a[1])/6} ${c[0]-(e[0]-b[0])/6} ${c[1]-(e[1]-b[1])/6} ${c[0]} ${c[1]}`; }
  return d + `L${w + 40} ${p[n][1]}L${w + 40} ${h + 60}Z`;
}
const yAt = (w, ys, x) => { const n = ys.length - 1, t = Math.max(0, Math.min(n - .001, x / w * n)), i = Math.floor(t), f = t - i; return ys[i] * (1 - f) + ys[i + 1] * f; };

const FL = {
  daisy: (s, r) => P.daisy(s, r), poppy: (s, r) => P.poppy(s, r), balsam: (s, r) => P.balsam(s, r), cone: (s, r) => P.coneflower(s, r * .92),
  rose: (s, r) => P.daisy(s, r, { n: 9, col: C.rose, col2: C.roseMid, eye: C.honey }), lace: (s, r) => P.lace(s, r),
  bud: (s, r) => P.bud(s, r * .5), tan: (s, r) => P.daisy(s, r, { n: 11, col: C.tanPale, col2: C.tan, eye: C.brown }),
};
function flower(s, x, y, h, r, kind, lean = 0, leaves = true) {
  const col = [C.sageDeep, C.moss, C.sageMid][Math.floor(s.r() * 3)];
  s.cut2 = null;
  s.at(x, y, 0, 1, () => {
    s.cut(stemPath(h, lean, (s.r() - .5) * 26, 5 + r * .06), col);
    if (leaves) { const L = h * .24 + 14; s.at(lean * .14, -h * .26, 50 + s.r() * 12, 1, () => P.leaf(s, L, L * .24, col === C.moss ? C.sageDeep : C.sageMid)); s.at(lean * .22, -h * .42, -54 - s.r() * 10, 1, () => P.leaf(s, L * .86, L * .22, C.sage)); }
    s.at(lean, -h, lean * .18, 1, () => FL[kind](s, r));
  });
}

// Torn-paper ground lines. The page cuts each colored band along one of these, and the scenes
// plant their stems on the same line, so art and page always meet.
export const EDGES = { a: [30,20,34,46,40,36,42,26,14], b: [24,12,28,38,26,16,34,18,28], c: [14,30,40,28,16,22,36,44,30] };
export const EDGE_H = 64;
export const edgeSvg = k => { const d = hill(1600, EDGE_H, EDGES[k]).replaceAll(/(\d+\.\d{2})\d+/g, '$1'); return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 ${EDGE_H}" preserveAspectRatio="none"><path d="${d}"/></svg>`; };
const ground = (w, h, k) => x => h - EDGE_H * (w / 1600) + yAt(w, EDGES[k], x) * (w / 1600);

export const SCENES = {
  // Far hills behind the title
  'meadow-back': [1600, 520, 21, (s, w, h) => {
    s.cut(hill(w, h, [300, 220, 190, 250, 300, 260, 180, 170, 250]), C.sagePale, 2);
    const far = [330, 300, 320, 290, 250, 300, 340, 300, 280];
    s.cut(hill(w, h, far), '#B9C7A3', 2);
    const mid = [380, 400, 360, 390, 420, 400, 350, 380, 400];
    for (let i = 0; i < 18; i++) { const x = 30 + i * 90 + s.r() * 50, y = yAt(w, mid, x) + 30; if (x > 520 && x < 1120) continue; flower(s, x, y, 70 + s.r() * 70, 13 + s.r() * 9, ['daisy','rose','tan','poppy','lace'][Math.floor(s.r() * 5)], (s.r() - .5) * 20, false); }
    s.cut(hill(w, h, mid), C.sage, 2);
  }],
  // Near flowers: tall on both sides like a child looking through them, low in the middle
  'meadow-front': [1600, 640, 5, (s, w, h) => {
    const gl = ground(w, h, 'a'), gy = x => gl(x) + 46;
    for (const [x, hh, b] of [[30,330,30],[120,260,-20],[230,200,26],[330,150,-18],[1270,150,16],[1380,210,-22],[1480,280,24],[1570,340,-26]]) s.at(x, gy(x), 0, 1, () => P.fern(s, hh, b, C.sageDeep));
    for (let i = 0; i < 60; i++) { const x = i * 27 + s.r() * 18, edge = Math.abs(x - w/2) / (w/2); s.at(x, gy(x), 0, 1, () => P.blade(s, 50 + edge * edge * 210 * (.6 + s.r() * .6), (s.r() - .5) * 60, 9 + edge * 5, [C.sageMid, C.sage, C.sageDeep, C.moss][Math.floor(s.r() * 4)])); }
    for (const x of [300, 410, 1180, 1300]) s.at(x, gy(x), 0, 1, () => P.grassHead(s, 170 + s.r() * 90, (s.r() - .5) * 50));
    const tall = [[46,500,60,'balsam',14],[150,410,56,'poppy',-12],[-6,330,44,'rose',10],[262,322,58,'daisy',16],[96,250,40,'tan',-14],[206,196,36,'poppy',12],[352,214,36,'cone',-10],[330,120,28,'daisy',10],
      [1554,510,62,'poppy',-16],[1450,424,58,'daisy',12],[1600,360,44,'balsam',-14],[1342,330,54,'cone',-14],[1500,262,40,'rose',12],[1396,206,36,'balsam',-10],[1256,218,36,'daisy',10],[1276,116,28,'tan',-8]];
    s.at(400, gy(400), -4, 1, () => P.lupine(s, 190)); s.at(1196, gy(1196), 5, 1, () => P.lupine(s, 200, { a: C.rosePale, b: C.rose, c: C.cream }));
    tall.sort((a, b) => b[1] - a[1]).forEach(a => flower(s, a[0], gy(a[0]), a[1], a[2], a[3], a[4]));
    for (const [x, hh, r, k] of [[470,110,24,'rose'],[540,70,20,'daisy'],[600,96,22,'tan'],[690,64,20,'poppy'],[780,84,22,'daisy'],[860,60,18,'rose'],[940,92,24,'poppy'],[1010,66,20,'daisy'],[1080,100,24,'tan'],[1140,74,20,'rose']]) flower(s, x, gy(x), hh, r, k, (s.r() - .5) * 18);
    for (let i = 0; i < 12; i++) { const x = 440 + i * 64 + s.r() * 20; s.at(x, gy(x), 0, 1, () => P.arrowleaf(s, 40 + s.r() * 26, [C.sage, C.sageMid][i % 2])); }
  }],
  'meadow-back-m': [520, 360, 33, (s, w, h) => {
    s.cut(hill(w, h, [150, 100, 130, 170, 110, 90]), C.sagePale, 2);
    const mid = [220, 200, 230, 240, 200, 190];
    for (let i = 0; i < 8; i++) { const x = 20 + i * 66 + s.r() * 30; flower(s, x, yAt(w, mid, x) + 26, 50 + s.r() * 50, 12 + s.r() * 7, ['daisy','rose','tan','poppy'][i % 4], (s.r() - .5) * 16, false); }
    s.cut(hill(w, h, mid), C.sage, 2);
  }],
  'meadow-front-m': [520, 420, 9, (s, w, h) => {
    const gl = ground(w, h, 'a'), gy = x => gl(x) + 40;
    for (const [x, hh, b] of [[16,230,20],[78,150,-14],[446,150,14],[506,230,-20]]) s.at(x, gy(x), 0, 1, () => P.fern(s, hh, b, C.sageDeep));
    for (let i = 0; i < 26; i++) { const x = i * 20 + s.r() * 12, e = Math.abs(x - w/2) / (w/2); s.at(x, gy(x), 0, 1, () => P.blade(s, 36 + e * e * 130 * (.6 + s.r() * .6), (s.r() - .5) * 40, 8, [C.sageMid, C.sage, C.sageDeep, C.moss][i % 4])); }
    [[30,320,44,'balsam',6],[96,232,40,'daisy',8],[4,200,34,'rose',6],[132,140,30,'poppy',8],[56,118,28,'tan',-6],[492,326,46,'poppy',-8],[424,236,40,'cone',-8],[518,206,34,'daisy',-6],[388,140,30,'balsam',-6],[470,124,28,'rose',6]].sort((a,b)=>b[1]-a[1]).forEach(a => flower(s, a[0], gy(a[0]), a[1], a[2], a[3], a[4]));
    for (const [x, hh, r, k] of [[182,84,20,'rose'],[232,56,17,'daisy'],[282,72,18,'poppy'],[334,60,18,'tan']]) flower(s, x, gy(x), hh, r, k, (s.r() - .5) * 12);
  }],
  // Forest floor for the foot of every page: fox asleep, mushrooms, acorns, leaves
  'forest-floor': [1600, 330, 14, (s, w, h) => {
    const gl = ground(w, h, 'b'), gy = x => gl(x) + 16;
    for (const [x, hh, b] of [[60,170,24],[150,120,-18],[470,104,16],[640,120,-14],[1010,110,16],[1460,180,-26],[1550,140,18],[1380,110,-12]]) s.at(x, gy(x), 0, 1, () => P.fern(s, hh, b, C.sageDeep));
    for (let i = 0; i < 46; i++) { const x = i * 35 + s.r() * 20; s.at(x, gy(x), 0, 1, () => P.blade(s, 20 + s.r() * 44, (s.r() - .5) * 34, 7, [C.sageDeep, C.sageMid, C.moss][i % 3])); }
    s.at(300, gy(300) - 48, 0, 1, () => A.fox(s));
    s.at(520, gy(520), -5, 1, () => P.mushroom(s, 56)); s.at(586, gy(586), 7, 1, () => P.mushroom(s, 34, { cap: C.tanDeep, dots: C.tanPale }));
    s.at(1250, gy(1250) - 16, 0, .8, () => A.squirrel(s));
    s.at(1110, gy(1110), 4, 1, () => P.mushroom(s, 44, { cap: C.rose })); s.at(1060, gy(1060), -8, 1, () => P.mushroom(s, 26));
    s.at(860, gy(860) - 22, 78, 1, () => P.oak(s, 84)); s.at(760, gy(760) - 34, 24, 1, () => P.acorn(s, 20)); s.at(806, gy(806) - 30, -60, 1, () => P.acorn(s, 18)); s.at(940, gy(940) - 26, -70, 1, () => P.aspen(s, 54, C.honey));
    s.at(1420, gy(1420) - 24, 60, 1, () => P.oak(s, 70, C.roseMid, C.roseDeep)); s.at(690, gy(690) - 24, -64, 1, () => P.aspen(s, 46, C.rose, C.roseDeep));
  }],
  'forest-floor-m': [520, 240, 18, (s, w, h) => {
    const gl = ground(w, h, 'b'), gy = x => gl(x) + 14;
    for (const [x, hh, b] of [[24,120,16],[300,86,-12],[496,130,-18]]) s.at(x, gy(x), 0, 1, () => P.fern(s, hh, b, C.sageDeep));
    for (let i = 0; i < 20; i++) { const x = i * 27 + s.r() * 12; s.at(x, gy(x), 0, 1, () => P.blade(s, 16 + s.r() * 32, (s.r() - .5) * 26, 6, [C.sageDeep, C.sageMid, C.moss][i % 3])); }
    s.at(160, gy(160) - 38, 0, .74, () => A.fox(s)); s.at(346, gy(346), -5, 1, () => P.mushroom(s, 40)); s.at(394, gy(394), 7, 1, () => P.mushroom(s, 24, { cap: C.tanDeep, dots: C.tanPale }));
    s.at(446, gy(446) - 26, 30, 1, () => P.acorn(s, 18));
  }],
};
export const buildScene = (name) => { const [w, h, seed, fn] = SCENES[name]; const s = new Sheet({ seed, shadow: 1.1 }); fn(s, w, h); return { w, h, svg: svg(w, h, s) }; };
