var K = 10;
var HS_LH = 1.8;

var HS_FONTS = [
  { id: 'roman', label: 'Roman', family: "'Cinzel', Georgia, serif", svg: 'Cinzel', style: 'normal', cap: 0.7, uc: 0.78, lc: 0.64, dg: 0.62, sp: 0.26, spec: 'Cinzel (Roman capitals)' },
  { id: 'garamond', label: 'Garamond', family: "'EB Garamond', Georgia, serif", svg: 'EB Garamond', style: 'normal', cap: 0.65, uc: 0.7, lc: 0.46, dg: 0.5, sp: 0.24, spec: 'EB Garamond' },
  { id: 'italic', label: 'Italic', family: "'EB Garamond', Georgia, serif", svg: 'EB Garamond', style: 'italic', cap: 0.65, uc: 0.65, lc: 0.42, dg: 0.48, sp: 0.23, spec: 'EB Garamond Italic' },
  { id: 'script', label: 'Script', family: "'Pinyon Script', cursive", svg: 'Pinyon Script', style: 'normal', cap: 0.62, uc: 0.92, lc: 0.43, dg: 0.5, sp: 0.24, spec: 'Pinyon Script' },
  { id: 'block', label: 'Block', family: "'Oswald', sans-serif", svg: 'Oswald', style: 'normal', cap: 0.78, uc: 0.53, lc: 0.45, dg: 0.48, sp: 0.2, spec: 'Oswald (block)' },
  { id: 'gothic', label: 'Old English', family: "'UnifrakturMaguntia', serif", svg: 'UnifrakturMaguntia', style: 'normal', cap: 0.66, uc: 0.74, lc: 0.45, dg: 0.5, sp: 0.25, spec: 'UnifrakturMaguntia (Old English)' }
];

var HS_FONTSETS = [
  { id: 'roman', label: 'Classic Roman', desc: 'carved Roman capitals with Garamond details', head: 'roman', headTrack: 0.14, name: 'roman', nameTrack: 0.1, dates: 'garamond', datesTrack: 0.06, top: 'italic', quote: 'italic' },
  { id: 'script', label: 'Elegant script', desc: 'a flowing script opening line and refined serif name', head: 'garamond', headTrack: 0.12, name: 'garamond', nameTrack: 0.1, dates: 'garamond', datesTrack: 0.04, top: 'script', quote: 'script' },
  { id: 'garamond', label: 'Soft serif', desc: 'gentle Garamond capitals with italic details', head: 'garamond', headTrack: 0.1, name: 'garamond', nameTrack: 0.08, dates: 'italic', datesTrack: 0.02, top: 'italic', quote: 'italic' },
  { id: 'gothic', label: 'Old English', desc: 'traditional blackletter for the name', head: 'gothic', headTrack: 0.03, name: 'gothic', nameTrack: 0.02, dates: 'garamond', datesTrack: 0.05, top: 'gothic', quote: 'gothic' },
  { id: 'block', label: 'Modern block', desc: 'clean, upright block capitals', head: 'block', headTrack: 0.08, name: 'block', nameTrack: 0.08, dates: 'block', datesTrack: 0.2, top: 'block', quote: 'block' }
];

var HS_MATERIALS = [
  { id: 'black', label: 'Jet Black', face: '#1f2022', edge: '#101113', cut: '#9b9ea2', frost: '#c9ccce', relief: '#3a3c40', laserOk: true, note: 'Deepest contrast. Best for laser-etched portraits.' },
  { id: 'gray', label: 'Barre Gray', face: '#8f9298', edge: '#6a6d73', cut: '#44474d', frost: '#d3d5d8', relief: '#a7aaaf', laserOk: false, note: 'Traditional New England gray with dark lettering.' },
  { id: 'red', label: 'India Red', face: '#7a3b33', edge: '#562822', cut: '#c9a298', frost: '#e0c2b9', relief: '#904c42', laserOk: false, note: 'Warm reddish granite with a soft grain.' },
  { id: 'pearl', label: 'Blue Pearl', face: '#2a3141', edge: '#181c26', cut: '#8d98aa', frost: '#c6cdd9', relief: '#3d4658', laserOk: true, note: 'Deep blue with a subtle shimmer. Etches well.' },
  { id: 'mahogany', label: 'Mahogany', face: '#57382b', edge: '#3a241b', cut: '#b0937f', frost: '#d6c0b1', relief: '#6a4435', laserOk: false, note: 'Rich brown with warm flecks.' }
];

var HS_CARVES = [
  { id: 'vcut', label: 'V-Cut', spec: 'V-cut sandblast' },
  { id: 'frost', label: 'Frosted', spec: 'Frosted shape carve' },
  { id: 'relief', label: 'Raised', spec: 'Raised relief (sculpted)' },
  { id: 'laser', label: 'Laser', spec: 'Laser etch' },
  { id: 'gold', label: 'Gold leaf', spec: 'V-cut with gold leaf' },
  { id: 'polish', label: 'Polished', spec: 'Polished lettering on a honed or frosted face (reverse finish)' },
  { id: 'paint', label: 'Paint', spec: 'V-cut with enamel paint fill' }
];
var HS_PAINTS = [
  { id: '#f4f1ea', label: 'White' }, { id: '#1f1f1f', label: 'Black' }, { id: '#c9a24a', label: 'Gold' }
];
var HS_SURFACES = [
  { id: 'polished', label: 'Polished', spec: 'Polished face', note: 'Mirror-bright with the deepest color. Carving reads as light against it.' },
  { id: 'honed', label: 'Honed', spec: 'Honed (satin matte) face', note: 'A soft satin glow with no glare. Polished lettering shines out of it.' },
  { id: 'frosted', label: 'Frosted', spec: 'Sandblasted (frosted) face', note: 'A pale, velvety face. Polished lettering and symbols gleam dark and glossy.' }
];
var HS_EDGES = [
  { id: 'smooth', label: 'Smooth edges', spec: 'sawn and polished sides' },
  { id: 'rock', label: 'Rock pitch', spec: 'hand-pitched rustic sides' }
];
var HS_FINISH_GROUPS = [
  { id: 'name', label: 'Name' }, { id: 'dates', label: 'Dates' }, { id: 'lines', label: 'Tribute line' },
  { id: 'quotes', label: 'Quotes' }, { id: 'symbols', label: 'Symbols' }, { id: 'border', label: 'Border' }
];
function hsLayerGroup(l) {
  if (l.type === 'border') return 'border';
  if (l.type === 'symbol') return 'symbols';
  if (l.type === 'photo') return '';
  if (/^(Name|Family name|Given name|Partner name)$/.test(l.name)) return 'name';
  if (/^(Dates|Years|Partner dates)$/.test(l.name)) return 'dates';
  if (/^Epitaph/.test(l.name)) return 'quotes';
  return 'lines';
}
function hsSurfaceFace(m, surface) {
  if (surface === 'honed') return hsMix(m.face, m.frost, 0.2);
  if (surface === 'frosted') return hsMix(m.face, m.frost, 0.52);
  return m.face;
}
/* Swatches drawn as the actual granite: its base color with its own speckle and mottling, not a shiny ball. */
var HS_GRAIN = {
  black: [['#3a3d42', 0.09, 1.3, -0.62, 3], ['#aeb3b9', 0.85, 1.9, -1.12, 7], ['#e6e8ea', 1.3, 2.2, -1.5, 11]],
  gray: [['#b9bcc1', 0.12, 1.1, -0.55, 4], ['#2c2e33', 0.8, 2.0, -1.0, 8], ['#e8e9eb', 0.95, 2.0, -1.15, 12]],
  red: [['#5b2a24', 0.1, 1.4, -0.6, 5], ['#241210', 0.62, 2.0, -1.05, 9], ['#d3a598', 0.9, 2.0, -1.2, 13]],
  pearl: [['#3f4a62', 0.08, 1.3, -0.55, 6], ['#9fb3d6', 0.42, 1.7, -1.0, 10], ['#0e1118', 0.8, 2.0, -1.05, 14]],
  mahogany: [['#3f271e', 0.11, 1.3, -0.6, 2], ['#140c09', 0.6, 2.0, -1.0, 6], ['#b8927a', 0.9, 2.0, -1.2, 15]]
};
var hsGrainCache = {};
function hsGraniteBg(m, surface) {
  var face = hsSurfaceFace(m, surface || 'polished'), key = m.id + '|' + face;
  if (hsGrainCache[key]) return hsGrainCache[key];
  var rgb = function (h) { return hsHexRgb(h).map(function (v) { return (v / 255).toFixed(3); }); };
  var layers = HS_GRAIN[m.id] || HS_GRAIN.black, defs = '', rects = '';
  layers.forEach(function (g, i) {
    var c = rgb(g[0]);
    defs += '<filter id="g' + i + '" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="' + g[1] + '" numOctaves="2" seed="' + g[4] + '"/><feColorMatrix values="0 0 0 0 ' + c[0] + ' 0 0 0 0 ' + c[1] + ' 0 0 0 0 ' + c[2] + ' ' + g[2] + ' 0 0 0 ' + g[3] + '"/></filter>';
    rects += '<rect width="160" height="100" filter="url(#g' + i + ')"/>';
  });
  var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="160" height="100" viewBox="0 0 160 100"><defs>' + defs + '</defs><rect width="160" height="100" fill="' + face + '"/>' + rects + '</svg>';
  return (hsGrainCache[key] = "url('data:image/svg+xml," + encodeURIComponent(svg) + "') center / cover no-repeat, " + face);
}
function hsDefaultPaint(m) { return m.id === 'gray' ? '#1f1f1f' : '#f4f1ea'; }
function hsCarveSpec(l, m) {
  var c = hsFind(HS_CARVES, l.carve);
  if (l.carve === 'paint') { var col = l.paint || hsDefaultPaint(m), pc = HS_PAINTS.filter(function (x) { return x.id === col; })[0]; return c.spec + ', ' + (pc ? pc.label.toLowerCase() : 'custom') + ' (' + col + ')'; }
  return c.spec;
}

