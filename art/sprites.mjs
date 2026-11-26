import { Sheet, svg, P, A, C, stemPath } from './paper.mjs';
// name: [width, height, draw(sheet)] — the origin is moved to the stated point.
const stemmed = (s, h, fn, leafy = true, bend = 8, col = C.sageDeep) => { s.cut(stemPath(h, 0, bend, 8), col); if (leafy) { s.at(2, -h*.28, 52, 1, () => P.leaf(s, 74, 17)); s.at(0, -h*.44, -56, 1, () => P.leaf(s, 62, 15, C.sage)); } s.at(0, -h, 0, 1, fn); };
export const SPRITES = {
  bee: [130, 116, s => s.at(66, 72, -8, 1, () => A.bee(s, 42))],
  butterfly: [180, 160, s => s.at(90, 78, 12, 1, () => A.butterfly(s, 60))],
  butterfly2: [180, 160, s => s.at(90, 78, -14, 1, () => A.butterfly(s, 58, { a: C.tan, b: C.tanPale, c: C.honeyDeep }))],
  ladybug: [90, 104, s => s.at(45, 60, 18, 1, () => A.ladybug(s, 34))],
  snail: [170, 110, s => s.at(88, 66, 0, 1, () => A.snail(s, 40))],
  mushroom: [160, 150, s => s.at(80, 134, 0, 1, () => P.mushroom(s, 66))],
  mushroom2: [190, 160, s => { s.at(76, 146, -4, 1, () => P.mushroom(s, 66, { cap: C.tanDeep, dots: C.tanPale })); s.at(140, 148, 8, .56, () => P.mushroom(s, 60, { cap: C.rose })); }],
  acorn: [110, 130, s => s.at(55, 64, 14, 1, () => P.acorn(s, 44))],
  oak: [120, 170, s => s.at(60, 148, 10, 1, () => P.oak(s, 136))],
  aspen: [130, 160, s => s.at(62, 116, -10, 1, () => P.aspen(s, 102))],
  leaf: [100, 160, s => s.at(50, 148, 8, 1, () => P.leaf(s, 136, 36))],
  fern: [170, 230, s => s.at(76, 222, 0, 1, () => P.fern(s, 204, 24))],
  daisy: [150, 150, s => s.at(75, 74, 0, 1, () => P.daisy(s, 64))],
  poppy: [160, 160, s => s.at(80, 80, 0, 1, () => P.poppy(s, 66))],
  balsam: [150, 150, s => s.at(75, 74, 0, 1, () => P.balsam(s, 66))],
  coneflower: [200, 190, s => s.at(100, 88, 0, 1, () => P.coneflower(s, 64))],
  rabbit: [230, 270, s => s.at(122, 258, 0, 1, () => A.rabbit(s))],
  fox: [290, 190, s => s.at(146, 148, 0, 1, () => A.fox(s))],
  squirrel: [220, 250, s => s.at(82, 234, 0, 1, () => A.squirrel(s))],
  bird: [230, 150, s => s.at(96, 112, 0, 1, () => A.bird(s))],
  // whole plants for the shop categories (they stand on a hill)
  'plant-daisy': [220, 340, s => { s.at(72, 330, -8, 1, () => stemmed(s, 168, () => P.daisy(s, 46), false, -8)); s.at(116, 332, 3, 1, () => stemmed(s, 244, () => P.daisy(s, 68))); }],
  'plant-poppy': [230, 340, s => { s.at(150, 332, 9, 1, () => stemmed(s, 150, () => P.bud(s, 26), false, 6)); s.at(112, 332, -3, 1, () => stemmed(s, 238, () => P.poppy(s, 72))); }],
  'plant-balsam': [300, 340, s => { s.at(114, 330, -30, 1, () => P.arrowleaf(s, 150)); s.at(190, 330, 30, 1, () => P.arrowleaf(s, 140, C.sageMid)); s.at(150, 334, 2, 1, () => stemmed(s, 236, () => P.balsam(s, 72), false)); s.at(142, 332, -6, 1, () => P.arrowleaf(s, 110, C.sage)); }],
  'plant-lupine': [250, 340, s => { s.at(170, 334, 10, 1, () => P.lupine(s, 190, { a: C.rosePale, b: C.rose, c: C.cream })); s.at(112, 334, -3, 1, () => P.lupine(s, 280)); s.at(84, 334, -38, 1, () => P.leaf(s, 110, 22)); s.at(138, 334, 34, 1, () => P.leaf(s, 100, 22, C.sage)); }],
  'plant-cone': [270, 340, s => { s.at(76, 332, -8, 1, () => stemmed(s, 150, () => s.at(0,0,0,.7,()=>P.coneflower(s, 54)), false, -4)); s.at(150, 332, 3, 1, () => stemmed(s, 232, () => P.coneflower(s, 66))); }],
};
export const build = (name, mode = 'paint', extra = {}) => { const [w, h, fn] = SPRITES[name]; const s = new Sheet({ mode, seed: name.length * 31 + name.charCodeAt(0), shadow: 1, ...extra }); fn(s); return { w, h, svg: svg(w, h, s) }; };
