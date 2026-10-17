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

var HS_SHAPES = [
  { id: 'flat', label: 'Flat top', short: 'Flat' },
  { id: 'serp', label: 'Serpentine', short: 'Serp' },
  { id: 'arch', label: 'Oval top', short: 'Oval' },
  { id: 'roof', label: 'Roof top', short: 'Roof' },
  { id: 'gothic', label: 'Gothic peak', short: 'Gothic' },
  { id: 'teardrop', label: 'Teardrop', short: 'Teardrop' },
  { id: 'heart', label: 'Heart', short: 'Heart', special: true },
  { id: 'dheart', label: 'Double heart', short: '2 Hearts', special: true },
  { id: 'book', label: 'Open book', short: 'Book', special: true },
  { id: 'wave', label: 'Rolling wave', short: 'Wave', special: true },
  { id: 'mountain', label: 'Mountain ridge', short: 'Ridge', special: true },
  { id: 'hill', label: 'Sunrise hill', short: 'Hill', special: true }
];

var HS_TYPES = [
  { id: 'upright', label: 'Upright', W: 40, H: 24, baseH: 6, baseX: 3, desc: 'A standing headstone on a granite base. The most room for names, symbols and a portrait.', size: 'Usually 24–48″ wide and 20–30″ high', icon: 'M24 36 V12 Q24 8 28 8 H52 Q56 8 56 12 V36 Z M18 36 H62 V44 H18 Z' },
  { id: 'slant', label: 'Slant', W: 30, H: 16, baseH: 4, baseX: 2, desc: 'An angled face on a sturdy block. Easy to read and lower than an upright.', size: 'Usually 24–36″ wide and about 16″ high', icon: 'M26 38 L32 16 H54 V38 Z M20 38 H60 V44 H20 Z' },
  { id: 'bevel', label: 'Bevel', W: 24, H: 12, baseH: 4, baseX: 2, desc: 'A low marker whose face slopes gently toward the front, just above the grass.', size: 'Usually 24″ × 12″, about 6″ high at the back', icon: 'M16 44 V37 L64 32 V44 Z' },
  { id: 'pillow', label: 'Pillow', W: 24, H: 14, baseH: 4, baseX: 2, desc: 'A low marker with softly rounded, raised edges like a pillow.', size: 'Usually 24″ × 14″, about 8″ high', icon: 'M16 44 V38 Q16 32 24 32 H56 Q64 32 64 38 V44 Z' },
  { id: 'grass', label: 'Flat', W: 24, H: 12, baseH: 4, baseX: 2, desc: 'Set level with the lawn on a granite base. Some memorial-park cemeteries require these.', size: 'Usually 24″ × 12″ × 4″', icon: 'M14 44 V40 H66 V44 Z' }
];

var HS_LAYOUTS = [
  { id: 'family', label: 'Family name headline', desc: 'Surname across the top, flanked by symbols.' },
  { id: 'classic', label: 'Centered classic', desc: 'Symbol, opening line, name, dates and quote.' },
  { id: 'side', label: 'Modern side panel', desc: 'A large symbol or portrait beside the lettering.' },
  { id: 'marker', label: 'Simple & compact', desc: 'Name, dates and a short line. Suits small markers.' },
  { id: 'below', label: 'Image below', desc: 'Name, dates and words first, with the symbol or portrait beneath.' },
  { id: 'split', label: 'Two sides', desc: 'Each half has its own story. Made for open books, double hearts and couples.' }
];

var HS_BORDERS = [
  { id: 'single', label: 'Single line', w: 0.16, dash: 'none' },
  { id: 'double', label: 'Double line', w: 0.12, dash: 'none' },
  { id: 'beaded', label: 'Beaded', w: 0.34, dash: '0 0.72' },
  { id: 'rope', label: 'Rope', w: 0.26, dash: '0.45 0.18' }
];

var HS_FAITHS = [
  { id: 'none', label: 'No symbol, thank you', sym: '' },
  { id: 'christian', label: 'Christian', sym: 'cross' },
  { id: 'celtic', label: 'Celtic Christian', sym: 'celtic' },
  { id: 'jewish', label: 'Jewish', sym: 'david' },
  { id: 'muslim', label: 'Muslim', sym: 'crescent' },
  { id: 'buddhist', label: 'Buddhist', sym: 'wheel' },
  { id: 'hindu', label: 'Hindu', sym: 'lotus' },
  { id: 'spiritual', label: 'Spiritual', sym: 'dove' },
  { id: 'other', label: 'Something else', sym: '' }
];

var HS_WSTEPS = [
  { id: 'name', label: 'Their name', req: true, title: 'Let’s begin with their name', sub: 'Write it just as you’d like it carved, along with the dates you’d like remembered.' },
  { id: 'faith', label: 'Faith', title: 'Would you like a symbol of faith?', sub: 'Choose one that holds meaning, or skip this if it doesn’t feel right.' },
  { id: 'quotes', label: 'Words to remember', title: 'Are there words that feel like them?', sub: 'A saying they loved, a favorite verse, or something the family always said. Share as many as four, and each design will carry one.' },
  { id: 'photos', label: 'A photo', title: 'Would you like to share a photo?', sub: 'A smiling, front-facing picture works beautifully. It can be etched into dark granite or set in a porcelain frame.' },
  { id: 'story', label: 'Their story', title: 'Tell us about the person you love', sub: 'What made them laugh, where they felt at home, who they cherished. The little things matter here, and they’ll gently guide the symbols, the words and the final setting.' },
  { id: 'style', label: 'The feeling', title: 'What feels right to you?', sub: '' },
  { id: 'details', label: 'Details in mind', title: 'Any details already in mind?', sub: 'Pick anything you already know you’d like to see, as many as you like. Leave it all open and we’ll choose what suits them best, with three different takes.' },
];
/* The choices offered on the "Details in mind" step: common options the design system already knows how to build. */
var HS_PREF_GROUPS = [
  { id: 'types', label: 'Type of headstone' },
  { id: 'shapes', label: 'Shape' },
  { id: 'mats', label: 'Granite color' },
  { id: 'carves', label: 'Lettering finish' },
  { id: 'fonts', label: 'Lettering style' },
  { id: 'borders', label: 'Border' }
];
/* Lettering finishes offered as picks: every carving method plus the paint colors. */
function hsPrefFinishes() {
  return HS_CARVES.filter(function (c) { return c.id !== 'paint'; }).map(function (c) { return { id: c.id, label: c.label, carve: c.id }; })
    .concat(HS_PAINTS.map(function (pc) { return { id: 'paint:' + pc.id, label: pc.label + ' paint', carve: 'paint', paint: pc.id }; }));
}
function hsPrefList(form, g) { return ((form.prefs || {})[g] || []).slice(); }
/* Apply the person's own picks across the three designs, spreading several picks so each design explores one. */
function hsApplyPrefs(designs, form, C) {
  var pr = form.prefs || {}, any = HS_PREF_GROUPS.some(function (g) { return (pr[g.id] || []).length; });
  if (!any) return;
  /* The picks are the set to draw from. Each design keeps its own choice when it's one of the picks, otherwise it
     takes one; and when several were picked, the three designs between them show as many as they can. */
  var curOf = { types: function (d) { return d.type; }, shapes: function (d) { return d.shape; }, mats: function (d) { return d.material; },
    carves: function (d) { return d.params && (d.params.carve === 'paint' ? 'paint:' + d.params.paint : d.params.carve); }, fonts: function (d) { return d.params && d.params.fonts; }, borders: function (d) { return (d.params && d.params.border) || 'none'; } };
  var plan = {};
  HS_PREF_GROUPS.forEach(function (g) {
    var a = pr[g.id] || [];
    /* Two hearts belong to a stone shared by two people. */
    if (g.id === 'shapes' && form.who !== 'two') a = a.filter(function (x) { return x !== 'dheart'; });
    if (!a.length) return;
    var vals = designs.map(function (d, i) { var c = curOf[g.id](d); return a.indexOf(c) >= 0 ? c : a[i % a.length]; });
    var want = Math.min(a.length, designs.length);
    for (var guard = 0; guard < 6; guard++) {
      var distinct = vals.filter(function (x, k) { return vals.indexOf(x) === k; });
      if (distinct.length >= want) break;
      var unused = a.filter(function (x) { return vals.indexOf(x) < 0; })[0];
      for (var k = vals.length - 1; k > 0; k--) { if (vals.indexOf(vals[k]) !== k) { vals[k] = unused; break; } }
    }
    plan[g.id] = vals;
  });
  designs.forEach(function (d, i) {
    var picked = [];
    var take = function (g) { return plan[g] ? plan[g][i] : null; };
    var ty = take('types'), sh = take('shapes'), mt = take('mats'), cv = take('carves'), fo = take('fonts'), bd = take('borders');
    d.params = Object.assign({}, d.params);
    if (sh) { d.shape = sh; picked.push(hsFind(HS_SHAPES, sh).label); if ((sh === 'book' || sh === 'dheart') && d.params.layout !== 'split') d.params.layout = 'split'; else if (sh !== 'book' && sh !== 'dheart' && d.params.layout === 'split' && !C.partner) d.params.layout = 'classic'; }
    if (ty && ty !== d.type) { d.genType = ''; hsApplyType(d, ty); d.genType = d.type; d.genW = d.W; d.genH = d.H; picked.push(hsFind(HS_TYPES, ty).label); }
    else if (ty) picked.push(hsFind(HS_TYPES, ty).label);
    if (!(ty && ty !== d.type) && (sh === 'heart' || sh === 'dheart')) d.H = Math.max(d.H, Math.round(d.W * (sh === 'heart' ? 0.8 : 0.7)));
    if (mt) { d.material = mt; picked.push(hsFind(HS_MATERIALS, mt).label + ' granite'); }
    if (cv) {
      var fin = hsFind(hsPrefFinishes(), cv), cvc = fin.carve;
      d.params.carve = cvc; d.params.finishBy = {}; d.params.paintBy = {};
      d.params.symCarve = cvc === 'gold' || cvc === 'laser' || cvc === 'relief' || cvc === 'polish' || cvc === 'paint' ? cvc : 'frost';
      if (cvc === 'paint') d.params.paint = fin.paint;
      picked.push(fin.label.toLowerCase() + (cvc === 'paint' ? 'ed lettering' : ' lettering'));
    }
    if (fo) { d.params.fonts = fo; picked.push(hsFind(HS_FONTSETS, fo).label.toLowerCase() + ' lettering style'); }
    if (bd) { d.params.border = bd; picked.push(bd === 'none' ? 'no border' : hsFind(HS_BORDERS, bd).label.toLowerCase() + ' border'); }
    d.layers = hsLayoutBest(d, C, true);
    /* Drop any earlier note that the picks now contradict (a different granite, finish or shape). */
    var stale = [];
    if (mt) HS_MATERIALS.forEach(function (x) { stale.push(x.label.toLowerCase()); });
    if (cv) HS_CARVES.forEach(function (x) { stale.push(x.label.toLowerCase()); stale.push(x.id === 'vcut' ? 'v-cut' : x.label.toLowerCase()); stale.push('paint'); });
    if (sh || ty) HS_SHAPES.forEach(function (x) { stale.push(x.label.toLowerCase()); });
    var keep = d.why.filter(function (w) { var lw = String(w).toLowerCase(); return !stale.some(function (k) { return lw.indexOf(k) >= 0; }); });
    if (picked.length) d.why = ['Your picks: ' + picked.join(', ')].concat(keep.slice(0, 3));
  });
}


var HS_GSTEPS = [
  { id: 'type', label: 'Stone type', title: 'Choose a stone type', sub: 'The overall form of the memorial. Some cemeteries only allow certain types, so it’s worth a quick check with them.' },
  { id: 'shape', label: 'Shape', title: 'Choose a shape', sub: 'The outline of the stone. Every stone type can use any of these shapes.' },
  { id: 'granite', label: 'Granite', title: 'Choose the granite', sub: 'The color of the stone. Darker granite shows lettering and portraits most clearly.' },
  { id: 'fonts', label: 'Typeface', title: 'Pick a typeface and the words', sub: 'The lettering style, how the dates read, and the words carved with them.' },
  { id: 'symbols', label: 'Symbols & photo', title: 'Symbols and photo', sub: 'Pick the carved symbols, and whether to place a portrait.' },
  { id: 'layout', label: 'Layout', title: 'Arrange the layout', sub: 'Where the name, dates and words sit on the stone, and how large they are.' },
  { id: 'finish', label: 'Finish', title: 'Surface and finish', sub: 'How the face of the stone feels, and how each part is carved, polished, gilded or painted.' }
];

var HS_SCENES = {
  meadow: { label: 'Meadow & oak', phrase: 'in an open meadow beneath an old oak', sky1: '#d4e1e5', sky2: '#f3eadb', sky3: '#f7f0e4', h1: '#c9d1b0', h2: '#b2c197', g1: '#a8b98b', g2: '#8a9e6d', leaf1: '#809b69', leaf2: '#a6bb8c', leaf3: '#627c51', petal: '#c4d2a6', trunk: '#7b6553', grass: '#6c8254', w1: '#b9d0da', w2: '#9fbccb', mt1: '#c3ccd3', mt2: '#aebab8' },
  garden: { label: 'Flower garden', phrase: 'in a flowering garden', sky1: '#dde6e9', sky2: '#f6ece1', sky3: '#f8f2e9', h1: '#cdd4ae', h2: '#b6c496', g1: '#adbe8c', g2: '#8fa46f', leaf1: '#e2b6c0', leaf2: '#f1d4da', leaf3: '#c797a4', petal: '#f0cbd3', trunk: '#7b6553', grass: '#6c8254', w1: '#b9d0da', w2: '#9fbccb', mt1: '#c3ccd3', mt2: '#aebab8' },
  mountains: { label: 'Mountain meadow', phrase: 'in a quiet mountain meadow', sky1: '#cadae4', sky2: '#eceeea', sky3: '#f4f0e7', h1: '#c1cdaa', h2: '#aabb91', g1: '#a1b585', g2: '#82986a', leaf1: '#728d5f', leaf2: '#95ae7e', leaf3: '#5b7349', petal: '#b3c69a', trunk: '#6f5b4b', grass: '#62794d', w1: '#b3cdd8', w2: '#96b6c6', mt1: '#b9c4ce', mt2: '#a3b2b2' },
  lake: { label: 'Lakeside', phrase: 'beside a still lake', sky1: '#cedde6', sky2: '#eeefea', sky3: '#f5f1e8', h1: '#c1cda8', h2: '#aab98f', g1: '#a0b385', g2: '#809769', leaf1: '#6f8b5d', leaf2: '#92ab7c', leaf3: '#58714a', petal: '#b2c49a', trunk: '#6f5b4b', grass: '#62794d', w1: '#b6d0db', w2: '#94b5c5', mt1: '#c7d0d9', mt2: '#b2bebf' },
  sea: { label: 'By the sea', phrase: 'on a grassy rise above the sea', sky1: '#cfdee6', sky2: '#f1f0ea', sky3: '#f6f1e8', h1: '#d3caa9', h2: '#cfc8a5', g1: '#bcbd96', g2: '#9d9f76', leaf1: '#809b69', leaf2: '#a6bb8c', leaf3: '#627c51', petal: '#ece5d2', trunk: '#7b6553', grass: '#7c7f55', w1: '#b3cdd8', w2: '#90b3c4', mt1: '#c3ccd3', mt2: '#aebab8' },
  church: { label: 'Churchyard', phrase: 'in a peaceful churchyard', sky1: '#dcdde6', sky2: '#f3e4d2', sky3: '#f7eee3', h1: '#c8cfab', h2: '#b0bf93', g1: '#a6b888', g2: '#879c6a', leaf1: '#809b69', leaf2: '#a6bb8c', leaf3: '#627c51', petal: '#c4d2a6', trunk: '#7b6553', grass: '#6c8254', w1: '#b9d0da', w2: '#9fbccb', mt1: '#c3ccd3', mt2: '#aebab8' }
};
var HS_SCENE_ORDER = ['meadow', 'garden', 'mountains', 'lake', 'sea', 'church'];

var HS_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function hsR(n, p) { var k = Math.pow(10, p == null ? 2 : p); return Math.round(n * k) / k; }
function hsFind(list, id) { for (var i = 0; i < list.length; i++) { if (list[i].id === id) return list[i]; } return list[0]; }
function hsHas(list, x) { return (list || []).indexOf(x) >= 0; }
function hsFirstIn(list, cands) { for (var i = 0; i < cands.length; i++) { if (hsHas(list, cands[i])) return cands[i]; } return ''; }
function hsIn(n) { return hsR(n).toFixed(2) + '″'; }
function hsIn1(n) { return hsR(n, 1).toFixed(1) + '″'; }
function hsCirc(cx, cy, r) { return 'M' + hsR(cx - r) + ' ' + hsR(cy) + ' a' + hsR(r) + ' ' + hsR(r) + ' 0 1 1 ' + hsR(2 * r) + ' 0 a' + hsR(r) + ' ' + hsR(r) + ' 0 1 1 ' + hsR(-2 * r) + ' 0 Z'; }
function hsEll(cx, cy, rx, ry) { return 'M' + hsR(cx - rx) + ' ' + hsR(cy) + ' a' + hsR(rx) + ' ' + hsR(ry) + ' 0 1 1 ' + hsR(2 * rx) + ' 0 a' + hsR(rx) + ' ' + hsR(ry) + ' 0 1 1 ' + hsR(-2 * rx) + ' 0 Z'; }
function hsStar(cx, cy, R, r, n) {
  var d = '';
  for (var i = 0; i < 2 * n; i++) {
    var a = -Math.PI / 2 + i * Math.PI / n, rr = i % 2 ? r : R;
    d += (i ? 'L' : 'M') + hsR(cx + rr * Math.cos(a)) + ' ' + hsR(cy + rr * Math.sin(a)) + ' ';
  }
  return d + 'Z';
}
function hsRgba(hex, a) {
  var h = String(hex || '#2f5b4f').replace('#', '');
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  var n = parseInt(h, 16);
  if (isNaN(n)) return 'rgba(47, 91, 79, ' + a + ')';
  return 'rgba(' + ((n >> 16) & 255) + ', ' + ((n >> 8) & 255) + ', ' + (n & 255) + ', ' + a + ')';
}
function hsSlug(t) { return String(t).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'layer'; }
function hsEsc(t) { return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
function hsTrunc(t, n) { t = String(t || ''); return t.length > n ? t.slice(0, n - 1) + '…' : t; }

var HS_SYMBOLS = (function () {
  var petals = '';
  for (var i = 0; i < 5; i++) {
    var a = -Math.PI / 2 + i * 2 * Math.PI / 5;
    petals += hsCirc(50 + 24 * Math.cos(a), 50 + 24 * Math.sin(a), 15) + ' ';
  }
  var rays = '';
  for (var j = 1; j <= 5; j++) {
    var b = Math.PI + j * Math.PI / 6;
    rays += 'M' + hsR(50 + 30 * Math.cos(b)) + ' ' + hsR(72 + 30 * Math.sin(b)) + ' L' + hsR(50 + 42 * Math.cos(b)) + ' ' + hsR(72 + 42 * Math.sin(b)) + ' ';
  }
  var spokes = '';
  for (var k = 0; k < 8; k++) {
    var c = k * Math.PI / 4;
    spokes += 'M' + hsR(50 + 11 * Math.cos(c)) + ' ' + hsR(50 + 11 * Math.sin(c)) + ' L' + hsR(50 + 38 * Math.cos(c)) + ' ' + hsR(50 + 38 * Math.sin(c)) + ' ';
    spokes += 'M' + hsR(50 + 38 * Math.cos(c)) + ' ' + hsR(50 + 38 * Math.sin(c)) + ' L' + hsR(50 + 45 * Math.cos(c)) + ' ' + hsR(50 + 45 * Math.sin(c)) + ' ';
  }
  return [
    { id: 'cross', label: 'Cross', short: 'Cross', mode: 'fill', d: 'M44 6 H56 V30 H78 V42 H56 V94 H44 V42 H22 V30 H44 Z' },
    { id: 'celtic', label: 'Celtic cross', short: 'Celtic', mode: 'stroke', sw: 6, d: 'M50 6 V94 M24 36 H76 ' + hsCirc(50, 36, 15) },
    { id: 'david', label: 'Star of David', short: 'David', mode: 'stroke', sw: 5, d: 'M50 10 L86 72 H14 Z M50 90 L14 28 H86 Z' },
    { id: 'crescent', label: 'Crescent and star', short: 'Crescent', mode: 'fill', d: 'M60 14 A40 40 0 1 0 60 90 A46 46 0 0 1 60 14 Z ' + hsStar(80, 40, 12, 5, 5) },
    { id: 'wheel', label: 'Dharma wheel', short: 'Wheel', mode: 'stroke', sw: 5, d: hsCirc(50, 50, 38) + ' ' + hsCirc(50, 50, 11) + ' ' + spokes },
    { id: 'lotus', label: 'Lotus', short: 'Lotus', mode: 'fill', d: 'M50 18 C61 36 61 60 50 76 C39 60 39 36 50 18 Z M48 78 C33 74 21 60 18 40 C32 46 44 58 48 78 Z M52 78 C67 74 79 60 82 40 C68 46 56 58 52 78 Z M46 82 C30 84 15 78 6 64 C22 62 38 68 46 82 Z M54 82 C70 84 85 78 94 64 C78 62 62 68 54 82 Z' },
    { id: 'dove', label: 'Dove', short: 'Dove', mode: 'fill', d: 'M10 56 L26 58 C34 54 44 52 52 52 C48 40 42 26 36 14 C52 20 64 34 70 46 C74 42 80 40 86 42 L92 46 L86 48 C84 58 76 66 62 70 C50 74 38 72 28 66 L12 68 L20 62 Z' },
    { id: 'heart', label: 'Heart', short: 'Heart', mode: 'fill', d: 'M50 88 C22 68 8 52 8 34 C8 20 19 10 32 10 C40 10 46 15 50 22 C54 15 60 10 68 10 C81 10 92 20 92 34 C92 52 78 68 50 88 Z' },
    { id: 'hearts', label: 'Two hearts', short: 'Hearts', mode: 'fill', d: 'M34 80 C16 66 6 55 6 42 C6 32 13 25 22 25 C28 25 32 28 34 33 C36 28 40 25 46 25 C55 25 62 32 62 42 C62 55 52 66 34 80 Z M66 78 C48 64 38 53 38 40 C38 30 45 23 54 23 C60 23 64 26 66 31 C68 26 72 23 78 23 C87 23 94 30 94 40 C94 53 84 64 66 78 Z' },
    { id: 'blossom', label: 'Blossom', short: 'Blossom', mode: 'fill', d: petals + hsCirc(50, 50, 9) },
    { id: 'tree', label: 'Tree of life', short: 'Tree', mode: 'stroke', sw: 4, d: hsCirc(50, 50, 44) + ' M50 80 V52 M50 66 L32 48 M50 66 L68 48 M50 56 L36 34 M50 56 L64 34 M50 54 V20 M32 48 L20 46 M68 48 L80 46 M36 34 L30 22 M64 34 L70 22 M50 80 L38 90 M50 80 L62 90 M50 80 V92' },
    { id: 'anchor', label: 'Anchor', short: 'Anchor', mode: 'stroke', sw: 5, d: 'M56 16 A6 6 0 1 1 44 16 A6 6 0 1 1 56 16 M50 22 V88 M34 34 H66 M18 60 Q22 86 50 88 Q78 86 82 60 M12 66 L18 58 L26 64 M88 66 L82 58 L74 64' },
    { id: 'sunrise', label: 'Sunrise', short: 'Sunrise', mode: 'stroke', sw: 4.5, d: 'M8 72 H92 M28 72 A22 22 0 0 1 72 72 ' + rays + 'M22 84 H78 M36 94 H64' },
    { id: 'mountains', label: 'Mountains', short: 'Mountains', mode: 'stroke', sw: 4.5, d: 'M6 84 L36 38 L50 58 L64 32 L94 84 Z M28.5 50 L34 55 L38 50 L44 54 ' + hsCirc(78, 20, 7) },
    { id: 'star', label: 'Star', short: 'Star', mode: 'fill', d: hsStar(50, 54, 44, 18, 5) },
    { id: 'temple', label: 'Temple spire', short: 'Temple', mode: 'fill', d: 'M14 94 H86 V76 H76 V60 L70 49 L64 60 V76 H56 V40 L50 17 L44 40 V76 H36 V60 L30 49 L24 60 V76 H14 Z ' + hsCirc(50, 10, 3.6) },
    { id: 'orthodox', label: 'Orthodox cross', short: 'Orthodox', mode: 'stroke', sw: 7, d: 'M50 6 V94 M38 20 H62 M22 38 H78 M34 74 L66 62' },
    { id: 'khanda', label: 'Khanda', short: 'Khanda', mode: 'stroke', sw: 4.5, d: 'M50 6 L50 80 M44 16 L50 6 L56 16 M43 74 H57 ' + hsCirc(50, 50, 17) + ' M31 20 Q10 50 31 80 M69 20 Q90 50 69 80 M26 76 L38 86 M74 76 L62 86' },
    { id: 'ninestar', label: 'Nine-pointed star', short: 'Nine-star', mode: 'fill', d: hsStar(50, 50, 45, 27, 9) },
    { id: 'yinyang', label: 'Yin and yang', short: 'Yin yang', mode: 'stroke', sw: 4.5, d: hsCirc(50, 50, 40) + ' M50 10 A20 20 0 0 1 50 50 A20 20 0 0 0 50 90 ' + hsCirc(50, 30, 5) + ' ' + hsCirc(50, 70, 5) }
  ];
})();
function hsSymLabel(id) { return hsFind(HS_SYMBOLS, id).label; }

var HS_MOTIF_RULES = [
  { sym: 'cross', faith: true, words: ['church', 'faith', 'faithful', 'god', 'jesus', 'christ', 'lord', 'heaven', 'pray', 'prayer', 'prayed', 'bible', 'catholic', 'christian', 'choir', 'pastor', 'deacon', 'blessed', 'savior', 'amen', 'sunday'] },
  { sym: 'celtic', faith: true, words: ['irish', 'ireland', 'celtic', 'scotland', 'scottish', 'gaelic'] },
  { sym: 'david', faith: true, words: ['jewish', 'judaism', 'synagogue', 'shalom', 'hebrew', 'torah', 'rabbi', 'mitzvah'] },
  { sym: 'crescent', faith: true, words: ['muslim', 'islam', 'islamic', 'mosque', 'allah', 'quran', 'ramadan'] },
  { sym: 'temple', faith: true, weight: 4, words: ['mormon', 'mormons', 'lds', 'latter-day', 'latter day', 'latter-day saint', 'latter-day saints', 'latter day saints', 'moroni', 'book of mormon', 'sealed in the temple'] },
  { sym: 'orthodox', faith: true, weight: 4, words: ['orthodox christian', 'greek orthodox', 'russian orthodox', 'eastern orthodox', 'serbian orthodox', 'ukrainian orthodox', 'coptic', 'orthodox church', 'orthodox'] },
  { sym: 'khanda', faith: true, weight: 4, words: ['sikh', 'sikhs', 'sikhism', 'gurdwara', 'waheguru', 'khalsa', 'guru nanak'] },
  { sym: 'ninestar', faith: true, weight: 4, words: ['bahai', "baha'i", 'bahá’í', 'bahá’u’lláh', 'bahaullah'] },
  { sym: 'yinyang', faith: true, weight: 4, words: ['taoist', 'taoism', 'daoist', 'daoism', 'tao', 'dao', 'yin yang', 'yin and yang'] },
  { sym: 'wheel', faith: true, words: ['buddhist', 'buddhism', 'buddha', 'dharma', 'meditation', 'zen', 'sangha'] },
  { sym: 'lotus', faith: true, words: ['hindu', 'hinduism', 'lotus', 'yoga', 'diwali'] },
  { sym: 'blossom', words: ['garden', 'gardens', 'gardening', 'gardener', 'flower', 'flowers', 'rose', 'roses', 'bloom', 'blooms', 'blossom', 'tulip', 'tulips', 'lily', 'lilies', 'daisy', 'daisies', 'orchid', 'orchids', 'peony', 'peonies'] },
  { sym: 'tree', words: ['tree', 'trees', 'forest', 'woods', 'roots', 'family', 'grandchildren', 'grandkids', 'generations', 'oak', 'orchard', 'legacy'] },
  { sym: 'anchor', words: ['sea', 'ocean', 'navy', 'sailor', 'sailing', 'sailed', 'boat', 'boats', 'fishing', 'fisherman', 'harbor', 'coast', 'coastal', 'beach', 'marine', 'marines', 'captain'] },
  { sym: 'mountains', words: ['mountain', 'mountains', 'hike', 'hiking', 'hiker', 'camping', 'outdoors', 'trail', 'trails', 'ski', 'skiing', 'climb', 'climbing', 'cabin', 'lake', 'lakeside', 'wilderness', 'rockies', 'cascades'] },
  { sym: 'sunrise', words: ['sunrise', 'sunset', 'sunsets', 'sunshine', 'morning', 'mornings', 'dawn', 'farm', 'farmer', 'farming', 'ranch', 'rancher', 'fields', 'prairie'] },
  { sym: 'hearts', words: ['husband', 'wife', 'married', 'marriage', 'sweetheart', 'soulmate', 'devoted', 'anniversary'] },
  { sym: 'dove', words: ['peace', 'peaceful', 'gentle', 'dove', 'spirit', 'kindness', 'grace', 'calm'] },
  { sym: 'star', words: ['star', 'stars', 'sky', 'night', 'astronomy', 'shine', 'shining', 'bright', 'telescope'] },
  { sym: 'heart', weight: 0.5, words: ['heart', 'caring', 'compassion', 'love', 'loved', 'loving'] }
];

/* A faith typed in "Something else" is matched to its symbol, even when it isn't one of the listed choices. */
var HS_FAITH_NAMES = { temple: 'Latter-day Saint', orthodox: 'Orthodox Christian', khanda: 'Sikh', ninestar: 'Bahá’í', yinyang: 'Taoist', cross: 'Christian', celtic: 'Celtic Christian', david: 'Jewish', crescent: 'Muslim', wheel: 'Buddhist', lotus: 'Hindu' };
function hsFaithGuess(text) {
  var t = String(text || '').toLowerCase(); if (!t.trim()) return null;
  var best = null;
  HS_MOTIF_RULES.forEach(function (r) {
    if (!r.faith) return;
    var n = 0; r.words.forEach(function (w) { n += hsCount(t, w); });
    if (n && (!best || n * (r.weight || 1) > best.n)) best = { sym: r.sym, n: n * (r.weight || 1) };
  });
  return best ? { sym: best.sym, label: hsSymLabel(best.sym), faith: HS_FAITH_NAMES[best.sym] || '' } : null;
}

var HS_PREF_SHAPES = [
  ['heart', ['heart-shaped', 'heart shape', 'heart shaped']],
  ['flat', ['modern', 'simple', 'minimal', 'minimalist', 'clean', 'contemporary']],
  ['gothic', ['gothic', 'cathedral', 'old world', 'peaked']],
  ['arch', ['elegant', 'soft', 'romantic', 'rounded', 'oval', 'gentle', 'peaceful', 'loving', 'warm']],
  ['roof', ['strong', 'steady', 'sturdy']],
  ['serp', ['classic', 'traditional', 'timeless', 'serpentine']]
];
var HS_PREF_TYPES = [['grass', ['flat marker', 'grass marker', 'flush', 'flat grass marker', 'ground marker', 'lawn marker']], ['bevel', ['bevel', 'beveled']], ['pillow', ['pillow']], ['slant', ['slant', 'slanted']], ['upright', ['upright', 'standing']]];
var HS_PREF_MATS = [['black', ['black', 'jet']], ['gray', ['gray', 'grey', 'silver']], ['red', ['red', 'rose granite', 'pink']], ['pearl', ['blue', 'pearl']], ['mahogany', ['brown', 'mahogany']]];
var HS_PREF_FONTS = [['script', ['script', 'cursive', 'handwritten', 'calligraphy', 'elegant', 'loving', 'joyful', 'playful']], ['block', ['block', 'bold', 'sans', 'modern', 'strong']], ['gothic', ['old english', 'blackletter', 'gothic', 'celtic', 'old world']], ['garamond', ['warm', 'homey', 'gentle', 'peaceful']], ['roman', ['roman', 'classic', 'traditional', 'timeless', 'steady']]];
var HS_PREF_CARVES = [['gold', ['gold', 'gilded']], ['laser', ['laser', 'etched', 'etching']], ['frost', ['frosted', 'frost']], ['relief', ['raised', 'sculpted']]];

/* "The feeling" is about mood and meaningful places; concrete stone choices live on the "Details in mind" step. */
var HS_FEEL_CHIPS = ['Peaceful', 'Timeless', 'Gentle & loving', 'Joyful & bright', 'Strong & steady', 'Elegant', 'Warm & homey', 'Modern & simple', 'Faith-filled', 'Playful'];
var HS_PLACE_CHIPS = ['Garden & flowers', 'Mountains & trails', 'By the sea', 'Lakeside & cabin', 'Countryside & farm', 'Forest & trees', 'Under the stars', 'Church & chapel', 'Irish & Celtic roots'];
var HS_THEME_CHIPS = HS_FEEL_CHIPS.concat(HS_PLACE_CHIPS);

function hsCount(text, word) {
  var re = new RegExp('\\b' + word.replace(/-/g, '\\-').replace(/ /g, '\\s+') + '\\b', 'g');
  return (text.match(re) || []).length;
}

function hsCharEm(f, ch) {
  if (ch === ' ') return f.sp;
  if (/[0-9]/.test(ch)) return f.dg;
  if (/[A-Z]/.test(ch)) return (ch === 'M' || ch === 'W') ? f.uc * 1.25 : (ch === 'I' || ch === 'J') ? f.uc * 0.5 : f.uc;
  if (/[a-z]/.test(ch)) return (ch === 'm' || ch === 'w') ? f.lc * 1.5 : ('iljtf'.indexOf(ch) >= 0) ? f.lc * 0.6 : f.lc;
  if (ch === '—') return 0.95;
  if (ch === '–') return 0.55;
  if (ch === '&') return 0.75;
  if (/[À-ÿ]/.test(ch)) return f.lc * 1.1;
  return 0.3;
}
function hsTextW(s, fontId, ht, track) {
  s = String(s || '').replace(/[\uE000\uE001]/g, '');
  var f = hsFind(HS_FONTS, fontId), w = 0, n = s.length;
  for (var i = 0; i < n; i++) w += hsCharEm(f, s[i]);
  return (w + track * Math.max(0, n - 1)) * ht / f.cap;
}
function hsWrap(text, fontId, ht, track, maxW) {
  var words = String(text).trim().split(/\s+/).filter(Boolean), lines = [], cur = '';
  words.forEach(function (w) {
    var t = cur ? cur + ' ' + w : w;
    if (!cur || hsTextW(t, fontId, ht, track) <= maxW) cur = t; else { lines.push(cur); cur = w; }
  });
  if (cur) lines.push(cur);
  return lines.length ? lines : [''];
}
function hsWrapBal(text, fontId, ht, track, maxW) {
  var base = hsWrap(text, fontId, ht, track, maxW);
  if (base.length < 2) return base;
  var lo = maxW * 0.35, hi = maxW;
  for (var i = 0; i < 14; i++) {
    var mid = (lo + hi) / 2;
    if (hsWrap(text, fontId, ht, track, mid).length > base.length) lo = mid; else hi = mid;
  }
  return hsWrap(text, fontId, ht, track, hi);
}
function hsFitInto(l, maxW, pref, min, maxLines) {
  if (l.keepLines) {
    /* Wording the person typed keeps its own line breaks; only the size eases down if a line is too wide. */
    var kl = String(l.text).split('\n').slice(0, 4), hk = l.fixHt || pref;
    var wide = function (h) { return kl.some(function (s) { return hsTextW(s, l.font, h, l.track) > maxW + 0.001; }); };
    if (!l.fixHt) while (hk > min + 0.001 && wide(hk)) hk = hsR(hk - 0.05, 2);
    l.ht = hsR(hk, 2); l.text = kl.join('\n');
    return !wide(l.ht);
  }
  if (l.fixHt) { pref = l.fixHt; min = l.fixHt; }
  var raw = String(l.text).replace(/\s*\n\s*/g, ' ').trim(), ml = maxLines || 1;
  /* Dates never break inside a date: they stay on one line, or go one date per line with no dash,
     each line centered under the other. */
  var dm = /dates|years/i.test(l.name || '') && raw.match(/^(.+?)\s+[–—·]\s+(.+)$/);
  if (dm) {
    var fitsD = function (lines, ht) { return lines.every(function (s) { return hsTextW(s, l.font, ht, l.track) <= maxW + 0.001; }); };
    var opts = l.stack ? [[dm[1], dm[2]]] : ml > 1 ? [[raw], [dm[1], dm[2]]] : [[raw]];
    /* A little smaller on one line reads better than two lines. */
    if (!l.stack) for (var h1 = pref; h1 >= Math.max(min, pref * 0.85) - 0.001; h1 = hsR(h1 - 0.05, 2))
      if (fitsD([raw], h1)) { l.ht = hsR(h1, 2); l.text = raw; return true; }
    for (var hd = pref; hd >= min - 0.001; hd = hsR(hd - 0.05, 2)) {
      for (var oi = 0; oi < opts.length; oi++) if (fitsD(opts[oi], hd)) { l.ht = hsR(hd, 2); l.text = opts[oi].join('\n'); return true; }
    }
    l.ht = min; l.text = opts[opts.length - 1].join('\n');
    return false;
  }
  for (var ht = pref; ht >= min - 0.001; ht = hsR(ht - 0.05, 2)) {
    var lines = ml > 1 ? hsWrapBal(raw, l.font, ht, l.track, maxW) : [raw];
    var ok = lines.length <= ml && lines.every(function (s) { return hsTextW(s, l.font, ht, l.track) <= maxW + 0.001; });
    if (ok) { l.ht = hsR(ht, 2); l.text = lines.join('\n'); return true; }
  }
  l.ht = min;
  l.text = hsWrapBal(raw, l.font, min, l.track, maxW).slice(0, 4).join('\n');
  return false;
}
function hsFitName(l, maxW, pref, min) {
  if (!hsFitInto(l, maxW, pref, Math.max(min, hsR(pref * 0.72, 2)), 1)) hsFitInto(l, maxW, pref, min, 2);
}
function hsLines(l) { return String(l.text || '').split('\n').slice(0, 4); }
function hsBox(l) {
  var w, h;
  if (l.type === 'text') {
    var lines = hsLines(l);
    w = 0;
    lines.forEach(function (s) { w = Math.max(w, hsTextW(s, l.font, l.ht, l.track)); });
    h = l.ht + (lines.length - 1) * l.ht * HS_LH;
  } else if (l.type === 'symbol') { w = l.size; h = l.size; }
  else if (l.type === 'photo') { w = l.w; h = l.h; }
  else return null;
  return { x0: l.x - w / 2, x1: l.x + w / 2, y0: l.y - h / 2, y1: l.y + h / 2, w: w, h: h };
}

function hsStonePath(shape, W, H, pointed) {
  var f = function (n) { return hsR(n, 3); };
  if (hsIsFree(shape)) {
    var n = 48, pts = [], r0 = Math.min(W, H) * 0.03;
    for (var i = 0; i <= n; i++) { var u = i / n; pts.push([u * W, hsFreeTop(shape, u, H)]); }
    var dstr = 'M0 ' + f(H) + ' V' + f(pts[0][1] + r0);
    dstr += ' Q0 ' + f(pts[0][1]) + ' ' + f(r0) + ' ' + f(hsFreeTop(shape, r0 / W, H));
    for (var j = 1; j < n; j++) { var mx = (pts[j][0] + pts[j + 1][0]) / 2, my = (pts[j][1] + pts[j + 1][1]) / 2; dstr += ' Q' + f(pts[j][0]) + ' ' + f(pts[j][1]) + ' ' + f(mx) + ' ' + f(my); }
    dstr += ' Q' + f(W) + ' ' + f(pts[n][1]) + ' ' + f(W) + ' ' + f(pts[n][1] + r0) + ' V' + f(H) + ' Z';
    return dstr;
  }
  if (shape === 'flat') {
    var r = f(Math.min(W, H) * 0.03);
    return 'M0 ' + H + ' V' + r + ' Q0 0 ' + r + ' 0 H' + f(W - r) + ' Q' + W + ' 0 ' + W + ' ' + r + ' V' + H + ' Z';
  }
  if (shape === 'arch') {
    var a = f(H * 0.28);
    return 'M0 ' + H + ' V' + a + ' A' + f(W / 2) + ' ' + a + ' 0 0 1 ' + W + ' ' + a + ' V' + H + ' Z';
  }
  if (shape === 'roof') return 'M0 ' + H + ' V' + f(H * 0.18) + ' L' + f(W / 2) + ' 0 L' + W + ' ' + f(H * 0.18) + ' V' + H + ' Z';
  if (shape === 'gothic') {
    return 'M0 ' + H + ' V' + f(H * 0.34) + ' Q' + f(W * 0.22) + ' ' + f(H * 0.1) + ' ' + f(W / 2) + ' 0 Q' + f(W * 0.78) + ' ' + f(H * 0.1) + ' ' + W + ' ' + f(H * 0.34) + ' V' + H + ' Z';
  }
  if (shape === 'teardrop') {
    return 'M0 ' + H + ' V' + f(H * 0.55) + ' C0 ' + f(H * 0.25) + ' ' + f(W * 0.3) + ' ' + f(H * 0.12) + ' ' + f(W / 2) + ' 0 C' + f(W * 0.7) + ' ' + f(H * 0.12) + ' ' + W + ' ' + f(H * 0.25) + ' ' + W + ' ' + f(H * 0.55) + ' V' + H + ' Z';
  }
  if (shape === 'book') {
    return 'M0 ' + H + ' V' + f(H * 0.1) + ' C' + f(W * 0.08) + ' ' + f(H * 0.02) + ' ' + f(W * 0.18) + ' 0 ' + f(W * 0.25) + ' ' + f(H * 0.02) +
      ' C' + f(W * 0.34) + ' ' + f(H * 0.04) + ' ' + f(W * 0.44) + ' ' + f(H * 0.06) + ' ' + f(W / 2) + ' ' + f(H * 0.12) +
      ' C' + f(W * 0.56) + ' ' + f(H * 0.06) + ' ' + f(W * 0.66) + ' ' + f(H * 0.04) + ' ' + f(W * 0.75) + ' ' + f(H * 0.02) +
      ' C' + f(W * 0.82) + ' 0 ' + f(W * 0.92) + ' ' + f(H * 0.02) + ' ' + W + ' ' + f(H * 0.1) + ' V' + H + ' Z';
  }
  if (shape === 'heart') {
    /* Standing hearts need a flat foot to rest on their base; hearts lying flat keep a true point. */
    var hb = pointed ? 0.5 : 0.34, hb2 = pointed ? 0.5 : 0.66, hc = pointed ? 0.3 : 0.16, hc2 = pointed ? 0.7 : 0.84, hy = pointed ? 0.86 : 0.84;
    return 'M' + f(W * hb) + ' ' + H +
      ' C' + f(W * hc) + ' ' + f(H * hy) + ' 0 ' + f(H * 0.6) + ' 0 ' + f(H * 0.32) +
      ' C0 ' + f(H * 0.13) + ' ' + f(W * 0.13) + ' 0 ' + f(W * 0.28) + ' 0' +
      ' C' + f(W * 0.38) + ' 0 ' + f(W * 0.46) + ' ' + f(H * 0.05) + ' ' + f(W * 0.5) + ' ' + f(H * 0.15) +
      ' C' + f(W * 0.54) + ' ' + f(H * 0.05) + ' ' + f(W * 0.62) + ' 0 ' + f(W * 0.72) + ' 0' +
      ' C' + f(W * 0.87) + ' 0 ' + W + ' ' + f(H * 0.13) + ' ' + W + ' ' + f(H * 0.32) +
      ' C' + W + ' ' + f(H * 0.6) + ' ' + f(W * hc2) + ' ' + f(H * hy) + ' ' + f(W * hb2) + ' ' + H + ' Z';
  }
  if (shape === 'dheart') {
    var X = function (t) { return f(W * t); }, Y = function (t) { return f(H * t); };
    if (!pointed) {
      return 'M' + X(0.24) + ' ' + H +
        ' C' + X(0.1) + ' ' + Y(0.84) + ' 0 ' + Y(0.62) + ' 0 ' + Y(0.34) +
        ' C0 ' + Y(0.12) + ' ' + X(0.09) + ' 0 ' + X(0.2) + ' 0' +
        ' C' + X(0.28) + ' 0 ' + X(0.33) + ' ' + Y(0.06) + ' ' + X(0.35) + ' ' + Y(0.15) +
        ' C' + X(0.38) + ' ' + Y(0.05) + ' ' + X(0.44) + ' 0 ' + X(0.5) + ' 0' +
        ' C' + X(0.56) + ' 0 ' + X(0.62) + ' ' + Y(0.05) + ' ' + X(0.65) + ' ' + Y(0.15) +
        ' C' + X(0.67) + ' ' + Y(0.06) + ' ' + X(0.72) + ' 0 ' + X(0.8) + ' 0' +
        ' C' + X(0.91) + ' 0 ' + W + ' ' + Y(0.12) + ' ' + W + ' ' + Y(0.34) +
        ' C' + W + ' ' + Y(0.62) + ' ' + X(0.9) + ' ' + Y(0.84) + ' ' + X(0.76) + ' ' + H +
        /* two flat feet with the hearts' notch still rising between them */
        ' L' + X(0.61) + ' ' + H + ' C' + X(0.58) + ' ' + Y(0.93) + ' ' + X(0.53) + ' ' + Y(0.86) + ' ' + X(0.5) + ' ' + Y(0.8) +
        ' C' + X(0.47) + ' ' + Y(0.86) + ' ' + X(0.42) + ' ' + Y(0.93) + ' ' + X(0.39) + ' ' + H + ' Z';
    }
    return 'M' + X(0.32) + ' ' + H +
      ' C' + X(0.14) + ' ' + Y(0.82) + ' 0 ' + Y(0.6) + ' 0 ' + Y(0.34) +
      ' C0 ' + Y(0.12) + ' ' + X(0.09) + ' 0 ' + X(0.2) + ' 0' +
      ' C' + X(0.28) + ' 0 ' + X(0.33) + ' ' + Y(0.06) + ' ' + X(0.35) + ' ' + Y(0.15) +
      ' C' + X(0.38) + ' ' + Y(0.05) + ' ' + X(0.44) + ' 0 ' + X(0.5) + ' 0' +
      ' C' + X(0.56) + ' 0 ' + X(0.62) + ' ' + Y(0.05) + ' ' + X(0.65) + ' ' + Y(0.15) +
      ' C' + X(0.67) + ' ' + Y(0.06) + ' ' + X(0.72) + ' 0 ' + X(0.8) + ' 0' +
      ' C' + X(0.91) + ' 0 ' + W + ' ' + Y(0.12) + ' ' + W + ' ' + Y(0.34) +
      ' C' + W + ' ' + Y(0.6) + ' ' + X(0.86) + ' ' + Y(0.82) + ' ' + X(0.68) + ' ' + H +
      ' C' + X(0.6) + ' ' + Y(0.9) + ' ' + X(0.54) + ' ' + Y(0.84) + ' ' + X(0.5) + ' ' + Y(0.78) +
      ' C' + X(0.46) + ' ' + Y(0.84) + ' ' + X(0.4) + ' ' + Y(0.9) + ' ' + X(0.32) + ' ' + H + ' Z';
  }
  var sh = f(H * 0.08), sq = f(H * 0.17);
  return 'M0 ' + H + ' V' + sq + ' Q0 ' + sh + ' ' + f(W * 0.05) + ' ' + sh +
    ' C' + f(W * 0.22) + ' ' + sh + ' ' + f(W * 0.3) + ' 0 ' + f(W * 0.5) + ' 0' +
    ' C' + f(W * 0.7) + ' 0 ' + f(W * 0.78) + ' ' + sh + ' ' + f(W * 0.95) + ' ' + sh +
    ' Q' + W + ' ' + sh + ' ' + W + ' ' + sq + ' V' + H + ' Z';
}
/* Flat markers: the bottom edge can mirror the top profile. */
var HS_MIRRORABLE = ['flat', 'serp', 'arch', 'roof', 'gothic', 'teardrop'];
/* Where the lettering sits in its free room: markers read best centered, standing stones read best near the top. */
function hsDefaultVAlign(d) { return d.type === 'grass' || d.type === 'bevel' || d.type === 'pillow' ? 50 : 0; }
function hsVAlign(d) { var v = d.params && d.params.vAlign; return typeof v === 'number' ? v : hsDefaultVAlign(d); }
function hsMirrorOn(d) {
  var lying = d.type === 'grass' || d.type === 'bevel' || d.type === 'pillow';
  return lying && HS_MIRRORABLE.indexOf(d.shape) >= 0 && !(d.params && d.params.mirror === false);
}
function hsStoneFor(d, W, H) { return hsMirrorOn(d) ? hsStonePathMirror(d.shape, W, H) : hsStonePath(d.shape, W, H, hsIsLying(d)); }
function hsStonePathMirror(shape, W, H) {
  var f = function (n) { return hsR(n, 3); }, m = 0.62, T = function (t) { return f(H * m * t); }, B = function (t) { return f(H - H * m * t); }, X = function (t) { return f(W * t); };
  if (shape === 'flat') {
    var r = f(Math.min(W, H) * 0.03);
    return 'M0 ' + r + ' Q0 0 ' + r + ' 0 H' + f(W - r) + ' Q' + W + ' 0 ' + W + ' ' + r + ' V' + f(H - r) + ' Q' + W + ' ' + H + ' ' + f(W - r) + ' ' + H + ' H' + r + ' Q0 ' + H + ' 0 ' + f(H - r) + ' Z';
  }
  if (shape === 'arch') return 'M0 ' + T(0.28) + ' A' + X(0.5) + ' ' + T(0.28) + ' 0 0 1 ' + W + ' ' + T(0.28) + ' V' + B(0.28) + ' A' + X(0.5) + ' ' + T(0.28) + ' 0 0 1 0 ' + B(0.28) + ' Z';
  if (shape === 'roof') return 'M0 ' + T(0.18) + ' L' + X(0.5) + ' 0 L' + W + ' ' + T(0.18) + ' V' + B(0.18) + ' L' + X(0.5) + ' ' + H + ' L0 ' + B(0.18) + ' Z';
  if (shape === 'gothic') return 'M0 ' + T(0.34) + ' Q' + X(0.22) + ' ' + T(0.1) + ' ' + X(0.5) + ' 0 Q' + X(0.78) + ' ' + T(0.1) + ' ' + W + ' ' + T(0.34) + ' V' + B(0.34) + ' Q' + X(0.78) + ' ' + B(0.1) + ' ' + X(0.5) + ' ' + H + ' Q' + X(0.22) + ' ' + B(0.1) + ' 0 ' + B(0.34) + ' Z';
  if (shape === 'teardrop') return 'M0 ' + T(0.55) + ' C0 ' + T(0.25) + ' ' + X(0.3) + ' ' + T(0.12) + ' ' + X(0.5) + ' 0 C' + X(0.7) + ' ' + T(0.12) + ' ' + W + ' ' + T(0.25) + ' ' + W + ' ' + T(0.55) + ' V' + B(0.55) + ' C' + W + ' ' + B(0.25) + ' ' + X(0.7) + ' ' + B(0.12) + ' ' + X(0.5) + ' ' + H + ' C' + X(0.3) + ' ' + B(0.12) + ' 0 ' + B(0.25) + ' 0 ' + B(0.55) + ' Z';
  var sh = T(0.08), sq = T(0.17), bh = B(0.08), bq = B(0.17);
  return 'M0 ' + sq + ' Q0 ' + sh + ' ' + X(0.05) + ' ' + sh + ' C' + X(0.22) + ' ' + sh + ' ' + X(0.3) + ' 0 ' + X(0.5) + ' 0 C' + X(0.7) + ' 0 ' + X(0.78) + ' ' + sh + ' ' + X(0.95) + ' ' + sh + ' Q' + W + ' ' + sh + ' ' + W + ' ' + sq +
    ' V' + bq + ' Q' + W + ' ' + bh + ' ' + X(0.95) + ' ' + bh + ' C' + X(0.78) + ' ' + bh + ' ' + X(0.7) + ' ' + H + ' ' + X(0.5) + ' ' + H + ' C' + X(0.3) + ' ' + H + ' ' + X(0.22) + ' ' + bh + ' ' + X(0.05) + ' ' + bh + ' Q0 ' + bh + ' 0 ' + bq + ' Z';
}
/* Free-form tops, shared by the drawing and the lettering layout so they always agree. u runs 0 to 1 across the stone. */
function hsFreeTop(shape, u, H) {
  var ss = function (a) { a = Math.max(0, Math.min(1, a)); return a * a * (3 - 2 * a); };
  if (shape === 'wave') return u < 0.68 ? H * 0.36 * (1 - ss(u / 0.68)) + H * 0.02 * Math.sin(u * 9) * (1 - u) : H * 0.14 * ss((u - 0.68) / 0.32);
  if (shape === 'mountain') {
    var pk = function (p, a, k) { var dd = Math.abs(u - p); return a + k * Math.pow(dd, 1.15); };
    return Math.min(H * 0.4, pk(0.36, 0, H * 1.05), pk(0.72, H * 0.1, H * 1.2), pk(0.12, H * 0.2, H * 1.3));
  }
  if (shape === 'hill') { var c = 0.42, w2 = u < c ? c : 1 - c; return H * 0.3 * Math.pow(Math.min(1, Math.abs(u - c) / w2), 1.8) + (u > c ? H * 0.04 * ss((u - c) / (1 - c)) : 0); }
  return 0;
}
function hsIsFree(shape) { return shape === 'wave' || shape === 'mountain' || shape === 'hill'; }
function hsTopAt(shape, W, H, x) {
  if (hsIsFree(shape)) return hsFreeTop(shape, Math.max(0, Math.min(1, x / W)), H);
  var t = Math.min(1, Math.abs(x - W / 2) / (W / 2));
  if (shape === 'flat') return 0.05;
  if (shape === 'arch') { var a = H * 0.28; return a * (1 - Math.sqrt(Math.max(0, 1 - t * t))); }
  if (shape === 'roof') return H * 0.18 * t;
  if (shape === 'gothic') return H * 0.34 * Math.pow(t, 1.4);
  if (shape === 'teardrop') return H * 0.55 * Math.pow(t, 1.25);
  if (shape === 'book') return t < 0.5 ? H * (0.02 + 0.1 * Math.pow(1 - t / 0.5, 2)) : H * (0.02 + 0.08 * Math.pow((t - 0.5) / 0.5, 2));
  if (shape === 'heart') return t < 0.44 ? H * 0.15 * Math.pow(1 - t / 0.44, 2) : H * 0.32 * Math.pow((t - 0.44) / 0.56, 2);
  if (shape === 'dheart') {
    var tt = Math.max(0, Math.min(1, x / W));
    if (tt < 0.2) return H * 0.34 * Math.pow((0.2 - tt) / 0.2, 2);
    if (tt > 0.8) return H * 0.34 * Math.pow((tt - 0.8) / 0.2, 2);
    var dd = Math.min(Math.abs(tt - 0.2), Math.abs(tt - 0.5), Math.abs(tt - 0.8));
    return H * 0.15 * Math.min(1, Math.pow(dd / 0.15, 2));
  }
  if (t < 0.9) { var u = t / 0.9; return H * 0.08 * (u * u * (3 - 2 * u)); }
  return H * 0.08 + (t - 0.9) / 0.1 * H * 0.09;
}
function hsSideAt(shape, W, H, y) {
  if (shape === 'heart' && y > H * 0.32) return Math.min(W * 0.42, (y - H * 0.32) / (H * 0.68) * W * 0.42);
  if (shape === 'dheart' && y > H * 0.34) return Math.min(W * 0.32, (y - H * 0.34) / (H * 0.66) * W * 0.32);
  return 0;
}
function hsMaxTop(shape, W, H, x0, x1) {
  var m = 0;
  for (var i = 0; i <= 8; i++) m = Math.max(m, hsTopAt(shape, W, H, x0 + (x1 - x0) * i / 8));
  return m;
}
function hsInsetTf(i, W, H) {
  return 'translate(' + hsR(i * K) + ' ' + hsR(i * K) + ') scale(' + hsR((W - 2 * i) / W, 4) + ' ' + hsR((H - 2 * i) / H, 4) + ')';
}
var HS_ROCK_BAND = 1.2;
function hsClear(d) {
  var c = d.params && d.params.edges === 'rock' ? 1 + HS_ROCK_BAND : 1;
  /* A bevel's sloped rim and a pillow's rounded edge leave less flat face for lettering. */
  if (d.type === 'bevel') c = Math.max(c, 1.5); else if (d.type === 'pillow') c = Math.max(c, 1.3);
  d.layers.forEach(function (l) {
    if (l.visible && l.type === 'border') c = Math.max(c, l.inset + (l.bstyle === 'double' ? 0.55 : 0) + 0.5);
  });
  return c;
}
function hsTypeOf(d) { return hsFind(HS_TYPES, d.type || 'upright'); }
function hsBaseH(d) { return d.base ? (typeof d.baseHt === 'number' ? d.baseHt : hsTypeOf(d).baseH) : 0; }
/* Front-to-back depth of a standing stone's base; a front vase needs extra room on top of it. */
function hsBaseD0(d) { return typeof d.baseDepth === 'number' ? d.baseDepth : (d.type === 'slant' ? 14 : 12); }
function hsBaseD(d) { return hsIsLying(d) ? d.H + 2 * hsBaseX0(d) + hsVaseTopRoom(d) : hsBaseD0(d) + hsVaseFrontDepth(d); }
function hsBaseX0(d) { return typeof d.baseOver === 'number' ? d.baseOver : hsTypeOf(d).baseX; }
/* A base that carries flower vases is lengthened on both ends so each vase has its own ledge. */
function hsBaseX(d) { return hsBaseX0(d) + (d.base && hsBaseH(d) ? hsVaseRoom(d) : 0); }

/* Flower vases: spun aluminum or turned granite, 4–8″ across, at the left, the middle (front center) and/or the
   right. Side vases sit on the base or are mounted partway up the side of the stone; a middle vase stands on the
   base in front. Beside a marker on the ground, side vases sit toward its top or bottom and a middle vase at its head. */
var HS_VASE_KINDS = [
  { id: 'aluminum', label: 'Spun aluminum', spec: 'Spun aluminum vase, brushed finish, removable liner' },
  { id: 'granite', label: 'Spun granite', spec: 'Turned (spun) granite vase with drain hole and liner' }
];
/* Beside the stone (left, right) and in a row in front of it (front left, front center, front right). */
var HS_VASE_SPOTS = [{ id: 'left', label: 'Left side' }, { id: 'fl', label: 'Front left' }, { id: 'front', label: 'Front center' }, { id: 'fr', label: 'Front right' }, { id: 'right', label: 'Right side' }];
var HS_VASE_SIDE_IDS = ['left', 'right'], HS_VASE_FRONT_IDS = ['fl', 'front', 'fr'];
/* Beside a marker on the ground, side vases sit toward its back (the head), its middle or its front (the foot). */
var HS_VASE_POS_LY = [{ id: 'back', label: 'Back' }, { id: 'middle', label: 'Middle' }, { id: 'front', label: 'Front' }];
function hsVaseLyPos(v) { var p = v && v.pos; return p === 'bottom' || p === 'front' ? 'front' : p === 'middle' ? 'middle' : 'back'; }
function hsVaseOk(d) { return true; }
function hsVaseOn(d) { var v = d.vase; return !!(v && v.kind && v.kind !== 'none' && hsVaseOk(d) && hsVaseSpots(v).length); }
function hsVaseW(v) { return Math.max(4, Math.min(8, Math.round(((v && v.size) || 5) * 2) / 2)); }
function hsVaseHt(v) { var w = hsVaseW(v); return hsR(v && v.kind === 'granite' ? w + 5 : w * 1.25 + 4, 2); }
function hsVaseSpots(v) {
  var s = v && v.spots;
  if (!s) s = v && v.pos === 'front' ? ['front'] : (v && v.sides) === 'left' ? ['left'] : (v && v.sides) === 'right' ? ['right'] : ['left', 'right'];
  return HS_VASE_SPOTS.map(function (x) { return x.id; }).filter(function (id) { return s.indexOf(id) >= 0; });
}
function hsVaseSides(v, d) { return hsVaseSpots(v); }
function hsVaseHasFront(v) { var s = hsVaseSpots(v); return HS_VASE_FRONT_IDS.some(function (x) { return s.indexOf(x) >= 0; }); }
function hsVaseFront(v, d) { return hsVaseHasFront(v) && !(d && hsIsLying(d)); }
function hsVaseHasSide(v) { var s = hsVaseSpots(v); return s.indexOf('left') >= 0 || s.indexOf('right') >= 0; }
/* How far the bottom of the side vases sits above the top of the base, in inches. */
function hsVaseRise(d) {
  var v = d.vase || {}, h = hsVaseHt(v), top = Math.max(0, d.H - h);
  if (hsIsLying(d) || !hsVaseHasSide(v)) return 0;
  if (typeof v.vfrac === 'number') return v.vfrac <= 0 ? 0 : hsR(Math.max(0, Math.min(top, v.vfrac * d.H - h / 2)), 2);
  if (typeof v.vy === 'number') return Math.max(0, Math.min(top, v.vy));
  return v.pos === 'middle' ? hsR(Math.max(1, (d.H - h) / 2), 2) : 0;
}
/* The base always reaches past the vases: side vases lengthen it at each end, a middle vase deepens it at the
   front (or, on a marker, lengthens it at the head). */
/* The same ledge whether the side vases sit on the base or are raised, so the base never changes size with them. */
function hsVaseRoom(d) { if (!hsVaseOn(d) || !hsVaseHasSide(d.vase)) return 0; return hsR(0.4 + hsVaseW(d.vase) + 0.6, 2); }
function hsVaseFrontDepth(d) { return hsVaseOn(d) && hsVaseFront(d.vase, d) ? hsR(hsVaseW(d.vase) + 2, 2) : 0; }
function hsVaseTopRoom(d) { return hsVaseOn(d) && hsIsLying(d) && hsVaseHasFront(d.vase) ? hsR(0.9 + hsVaseW(d.vase) + 0.6, 2) : 0; }
function hsVaseSpec(d) {
  if (!hsVaseOn(d)) return '';
  var v = d.vase, sp = hsVaseSpots(v), n = sp.length, rise = hsVaseRise(d), kind = hsFind(HS_VASE_KINDS, v.kind).label.toLowerCase();
  var names = sp.map(function (x) { return hsFind(HS_VASE_SPOTS, x).label.toLowerCase(); });
  var where = names.length > 1 ? names.slice(0, -1).join(', ') + ' and ' + names[names.length - 1] : names[0];
  var head = (['', 'One ', 'Two ', 'Three ', 'Four ', 'Five '][n] || n + ' ') + kind + ' vase' + (n > 1 ? 's' : '') + ' (' + where + '), ' + hsVaseW(v) + '″ across × ' + hsVaseHt(v) + '″ high';
  var parts = [];
  if (hsIsLying(d)) {
    if (hsVaseHasSide(v)) parts.push('side vases set on the base beside the marker toward its ' + hsVaseLyPos(v) + ' (base widened ' + hsIn(hsVaseRoom(d)) + ' at each side)');
    if (hsVaseHasFront(v)) parts.push('front-row vases set on the base at the head of the marker (base lengthened ' + hsIn(hsVaseTopRoom(d)) + ')');
  } else {
    if (hsVaseHasSide(v)) parts.push(rise ? 'side vases mounted to the stone ' + hsIn(rise) + ' above the base' : 'side vases set on the base (base lengthened ' + hsIn(hsVaseRoom(d)) + ' at each end)');
    if (hsVaseHasFront(v)) parts.push('front-row vases on the base in front of the stone (base deepened ' + hsIn(hsVaseFrontDepth(d)) + ')');
  }
  return head + '; ' + parts.join('; ');
}
/* The vase outline, drawn from its foot (0, 0) upward, as a smooth closed path. */
function hsVasePath(kind, w, h) {
  var P = kind === 'granite'
    ? [[0, 0.8], [0.06, 0.8], [0.5, 0.77], [0.82, 0.8], [0.86, 0.94], [0.9, 1], [1, 1]]
    : [[0, 0.52], [0.06, 0.56], [0.36, 0.68], [0.62, 0.56], [0.78, 0.44], [0.9, 0.7], [0.97, 1], [1, 1]];
  var pts = P.map(function (q) { return [q[1] * w / 2, -q[0] * h]; });
  var seg = function (arr) {
    var out = '';
    for (var i = 1; i < arr.length; i++) {
      var p0 = arr[Math.max(0, i - 2)], p1 = arr[i - 1], p2 = arr[i], p3 = arr[Math.min(arr.length - 1, i + 1)];
      var c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      out += ' C' + hsR(c1[0], 2) + ' ' + hsR(c1[1], 2) + ' ' + hsR(c2[0], 2) + ' ' + hsR(c2[1], 2) + ' ' + hsR(p2[0], 2) + ' ' + hsR(p2[1], 2);
    }
    return out;
  };
  var right = pts, left = pts.slice().reverse().map(function (p) { return [-p[0], p[1]]; });
  return 'M0 0 L' + hsR(right[0][0], 2) + ' 0' + seg(right) + ' L' + hsR(left[0][0], 2) + ' ' + hsR(left[0][1], 2) + seg(left) + ' Z';
}
function hsIsLying(d) { return d.type === 'grass' || d.type === 'bevel' || d.type === 'pillow'; }
function hsBaseMat(d) { return hsFind(HS_MATERIALS, d.baseMat || d.material); }
function hsCarveLook(carve, m, paint, surface) {
  if (carve === 'polish') {
    /* Polished lettering is simply the granite's own deep, polished color showing through the softer face. */
    return { color: surface === 'polished' || !surface ? hsMix(m.face, '#ffffff', 0.07) : m.face, fkey: 'flat', op: 1, shadow: 'none' };
  }
  if (carve === 'paint') {
    var pc = paint || hsDefaultPaint(m);
    return { color: pc, fkey: 'vcut', op: 1, shadow: '0 -0.9px 0.9px rgba(0, 0, 0, 0.7), 0 0.7px 0 rgba(255, 255, 255, 0.14)' };
  }
  if (carve === 'frost' && surface === 'frosted') return { color: hsMix(m.frost, '#ffffff', 0.35), fkey: 'flat', op: 0.94, shadow: 'none' };
  if (carve === 'frost') return { color: m.frost, fkey: 'flat', op: 0.94, shadow: 'none' };
  if (carve === 'relief') return { color: m.relief, fkey: 'relief', op: 1, shadow: '1.3px 2px 2px rgba(0, 0, 0, 0.6), -0.6px -0.6px 0.6px rgba(255, 255, 255, 0.14)' };
  if (carve === 'laser') return { color: '#e6e6e3', fkey: 'flat', op: 0.82, shadow: 'none' };
  if (carve === 'gold') return { color: '#c9a24b', fkey: 'gold', op: 1, shadow: '0 -0.8px 0.8px rgba(0, 0, 0, 0.7), 0 0.6px 0 rgba(255, 232, 160, 0.35)' };
  return { color: m.cut, fkey: 'vcut', op: 1, shadow: '0 -0.9px 0.9px rgba(0, 0, 0, 0.8), 0 0.8px 0 rgba(255, 255, 255, 0.16)' };
}

function hsParseDate(s) {
  var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || '');
  if (!m) return null;
  return { y: +m[1], m: +m[2], d: +m[3] };
}
function hsIsoToday() { var n = new Date(), p = function (k) { return (k < 10 ? '0' : '') + k; }; return n.getFullYear() + '-' + p(n.getMonth() + 1) + '-' + p(n.getDate()); }
/* Accepts 4/12/1941, 04-12-1941, 1941-04-12, "April 12, 1941" or "12 April 1941". */
function hsParseLooseDate(t) {
  t = String(t || '').trim(); if (!t) return '';
  var p = function (k) { return (k < 10 ? '0' : '') + k; }, y, m, d, mm;
  if ((mm = /^(\d{4})[-\/.](\d{1,2})[-\/.](\d{1,2})$/.exec(t))) { y = +mm[1]; m = +mm[2]; d = +mm[3]; }
  else if ((mm = /^(\d{1,2})[-\/.\s](\d{1,2})[-\/.\s](\d{4})$/.exec(t))) { m = +mm[1]; d = +mm[2]; y = +mm[3]; }
  else {
    var lower = t.toLowerCase(), mi = -1;
    HS_MONTHS.forEach(function (n, i) { if (mi < 0 && lower.indexOf(n.slice(0, 3).toLowerCase()) >= 0) mi = i; });
    var nums = t.match(/\d+/g) || [];
    if (mi < 0 || nums.length < 2) return '';
    m = mi + 1; y = +nums.filter(function (n) { return n.length === 4; })[0]; d = +nums.filter(function (n) { return n.length <= 2; })[0];
    if (!y || !d) return '';
  }
  var dt = new Date(y, m - 1, d);
  if (dt.getFullYear() !== y || dt.getMonth() !== m - 1 || dt.getDate() !== d || y < 1800) return '';
  return y + '-' + p(m) + '-' + p(d);
}
/* Space held for something added later. A date still to come is laid out like a real (long) date so the lettering
   leaves room for it, but it is marked so it is never carved; a photo still to come is a blank, reserved frame. */
var HS_RESV_DATE = { y: 2088, m: 9, d: 28, resv: true };
var HS_RESV_A = '\uE000', HS_RESV_B = '\uE001', HS_RESV_RE = /\uE000([^\uE001]*)\uE001/g;
function hsResvShow(t) { return String(t || '').replace(HS_RESV_RE, '(date added later)'); }
function hsResvStrip(t) { return String(t || '').replace(HS_RESV_RE, '').replace(/\s*[–—·]\s*$/, '').replace(/[ \t]+$/gm, ''); }
function hsHasResv(t) { return /\uE000/.test(String(t || '')); }
function hsResvSegs(t) {
  var out = [], s = String(t || ''), last = 0, m;
  HS_RESV_RE.lastIndex = 0;
  while ((m = HS_RESV_RE.exec(s))) { if (m.index > last) out.push({ t: s.slice(last, m.index), resv: false }); out.push({ t: m[1], resv: true }); last = m.index + m[0].length; }
  if (last < s.length) out.push({ t: s.slice(last), resv: false });
  return out;
}
function hsIsResvPhoto(id) { return /^resv-/.test(String(id || '')); }
function hsPassedLater(form, who) {
  if (who === 2) return !form.passed2 && !!form.born2 && form.passedLater2 !== false;
  return !form.passed && !!form.born && form.passedLater !== false;
}
/* Every photo they add is used. A spot can also be saved for a photo that comes later, and on a stone for two,
   whenever one person has a portrait (or a saved spot) the other gets a matching spot so the stone stays balanced. */
function hsPhotoSet(form, photos) {
  var list = (photos || []).filter(function (p) { return !p.resv; }), two = form.who === 'two' && String(form.name2 || '').trim();
  var has = function (o) { return list.some(function (p) { return (p.owner || 1) === o; }); };
  var w1 = has(1) || !!form.photoLater, w2 = !!two && (has(2) || !!form.photoLater2);
  if (two && (w1 || w2)) { w1 = true; w2 = true; }
  if (w1 && !has(1)) list.push({ id: 'resv-1', owner: 1, resv: true, name: 'a photo to add later', url: '', ratio: 1.28 });
  if (w2 && !has(2)) list.push({ id: 'resv-2', owner: 2, resv: true, name: 'a photo to add later', url: '', ratio: 1.28 });
  return list;
}
function hsFmtDate(dt, style) {
  if (!dt) return '';
  if (dt.resv) { var r = hsFmtDate({ y: dt.y, m: dt.m, d: dt.d }, style); return HS_RESV_A + r + HS_RESV_B; }
  if (style === 'years') return String(dt.y);
  if (style === 'numeric') return dt.m + '.' + dt.d + '.' + dt.y;
  var s = HS_MONTHS[dt.m - 1] + ' ' + dt.d + ', ' + dt.y;
  return style === 'upper' ? s.toUpperCase() : s;
}
/* Words carved with the dates, like "Born … · Died …". Presets, or anything the family types. */
var HS_DATE_WORDS = [
  { id: 'none', label: 'No words', a: '', b: '' },
  { id: 'born-died', label: 'Born · Died', a: 'Born', b: 'Died' },
  { id: 'born-passed', label: 'Born · Passed', a: 'Born', b: 'Passed' },
  { id: 'birth-death', label: 'Birth · Death', a: 'Birth', b: 'Death' },
  { id: 'rest', label: 'Born · Entered into rest', a: 'Born', b: 'Entered into rest' },
  { id: 'custom', label: 'My own words', a: '', b: '' }
];
function hsDateLineW(b, e, style, sep, w) {
  /* "My own words" left blank reads as the hint: Born and Passed. */
  if (w && w.id === 'custom') w = { a: String(w.a || '').trim() || 'Born', b: String(w.b || '').trim() || 'Passed' };
  if (!w || (!String(w.a || '').trim() && !String(w.b || '').trim())) return hsDateLine(b, e, style, sep);
  var cap = function (x) { x = String(x || '').trim(); return !x ? '' : style === 'upper' ? x.toUpperCase() + ' ' : x + ' '; };
  var da = hsFmtDate(b, style), de = hsFmtDate(e, style);
  var A = da ? cap(w.a) + da : '', B = de ? cap(w.b) + de : '';
  return A && B ? A + ' · ' + B : A || B;
}
function hsDateLine(b, p, style, sep) {
  var a = hsFmtDate(b, style), c = hsFmtDate(p, style);
  if (a && c) return a + sep + c;
  if (a) return style === 'years' ? a + sep.replace(/\s+$/, '') : (style === 'upper' ? 'BORN ' : 'Born ') + a;
  if (c) return style === 'years' ? sep.replace(/^\s+/, '') + c : (style === 'upper' ? 'DIED ' : 'Died ') + c;
  return '';
}
function hsNameParts(full) {
  var clean = String(full || '').trim().replace(/\s+/g, ' ');
  var t = clean.split(' ').filter(Boolean), suffix = '';
  if (t.length > 2 && /^(jr\.?|sr\.?|ii|iii|iv)$/i.test(t[t.length - 1])) suffix = t.pop();
  var last = t.length > 1 ? t.pop() : '';
  return { given: t.join(' ') + (suffix ? ' ' + suffix : ''), surname: last, full: clean, first: clean.split(' ')[0] || '' };
}
function hsCleanQuote(q) {
  var s = String(q || '').replace(/\s+/g, ' ').trim();
  s = s.replace(/^["“”'‘’]+/, '').replace(/["“”'‘’]+$/, '').trim();
  return s.slice(0, 180);
}

function hsAnalyze(f) {
  var faithTyped = f.faith === 'other' ? String(f.faithOther || '').toLowerCase() : '';
  var story = (String(f.story || '') + ' ' + String(f.faithOther || '')).toLowerCase(), theme = String(f.theme || '').toLowerCase();
  var qs = (f.quotes || []).join(' ').toLowerCase();
  var scored = [], found = [];
  HS_MOTIF_RULES.forEach(function (r) {
    var score = 0, words = [];
    r.words.forEach(function (w) {
      var n = hsCount(story, w) + 2 * hsCount(theme, w) + hsCount(qs, w) + (r.faith ? 6 * hsCount(faithTyped, w) : 0);
      if (n) { score += n * (r.weight || 1); words.push(w); }
    });
    if (score) scored.push({ sym: r.sym, faith: !!r.faith, score: score, words: words });
  });
  scored.sort(function (a, b) { return b.score - a.score; });
  var faith = null;
  scored.forEach(function (s) { if (s.faith && !faith) faith = s; });
  var chosen = hsFind(HS_FAITHS, f.faith || 'other');
  if (f.faith === 'none') faith = null;
  else if (f.faith && chosen.sym) faith = { sym: chosen.sym, faith: true, words: [], chosen: true };
  var motifs = scored.filter(function (s) { return !s.faith; });
  scored.forEach(function (s) { s.words.forEach(function (w) { if (found.indexOf(w) < 0) found.push(w); }); });

  var she = hsCount(story, 'she') + hsCount(story, 'her') + hsCount(story, 'hers');
  var he = hsCount(story, 'he') + hsCount(story, 'him') + hsCount(story, 'his');
  var g = she > he ? 'f' : he > she ? 'm' : '';
  var any = function (ws) { return ws.some(function (w) { return hsCount(story, w) > 0; }); };
  var roles = [];
  if (any(['wife']) && g !== 'f') roles.push('Husband');
  else if (any(['husband']) && g !== 'm') roles.push('Wife');
  else if (g && any(['married', 'widow', 'widower'])) roles.push(g === 'f' ? 'Wife' : 'Husband');
  if (any(['mother', 'mom', 'mama', 'mum']) && g !== 'm') roles.push('Mother');
  else if (any(['father', 'dad', 'papa']) && g !== 'f') roles.push('Father');
  else if (g && any(['children', 'kids', 'son', 'sons', 'daughter', 'daughters'])) roles.push(g === 'f' ? 'Mother' : 'Father');
  if (any(['grandmother', 'grandma', 'nana', 'granny']) && g !== 'm') roles.push('Grandmother');
  else if (any(['grandfather', 'grandpa', 'granddad', 'grandad']) && g !== 'f') roles.push('Grandfather');
  else if (g && any(['grandchildren', 'grandkids', 'grandson', 'granddaughter'])) roles.push(g === 'f' ? 'Grandmother' : 'Grandfather');
  var roleLine = roles.length ? 'Beloved ' + (roles.length === 1 ? roles[0] : roles.slice(0, -1).join(', ') + ' & ' + roles[roles.length - 1]) : '';

  var vet = '';
  if (any(['served', 'veteran', 'enlisted', 'deployed', 'war'])) {
    var br = [['air force', 'U.S. Air Force'], ['coast guard', 'U.S. Coast Guard'], ['marine corps', 'U.S. Marine Corps'], ['marines', 'U.S. Marine Corps'], ['navy', 'U.S. Navy'], ['army', 'U.S. Army']];
    for (var i = 0; i < br.length; i++) { if (hsCount(story, br[i][0])) { vet = br[i][1] + ' Veteran'; break; } }
  }

  var prefs = { shapes: [], type: '', material: '', fonts: [], carve: '', words: [] };
  HS_PREF_SHAPES.forEach(function (p) { p[1].forEach(function (w) { if (hsCount(theme, w) && prefs.shapes.indexOf(p[0]) < 0) { prefs.shapes.push(p[0]); prefs.words.push(w); } }); });
  HS_PREF_TYPES.forEach(function (p) { p[1].forEach(function (w) { if (!prefs.type && hsCount(theme, w)) { prefs.type = p[0]; prefs.words.push(w); } }); });
  HS_PREF_MATS.forEach(function (p) { p[1].forEach(function (w) { if (!prefs.material && hsCount(theme, w)) { prefs.material = p[0]; prefs.words.push(w); } }); });
  HS_PREF_FONTS.forEach(function (p) { p[1].forEach(function (w) { if (hsCount(theme, w) && prefs.fonts.indexOf(p[0]) < 0) { prefs.fonts.push(p[0]); prefs.words.push(w); } }); });
  HS_PREF_CARVES.forEach(function (p) { p[1].forEach(function (w) { if (!prefs.carve && hsCount(theme, w)) { prefs.carve = p[0]; prefs.words.push(w); } }); });
  prefs.words = prefs.words.filter(function (w, i) { return prefs.words.indexOf(w) === i; });

  var reading = /\b(book|books|read|reading|reader|teacher|taught|library|librarian|writer|poet|poetry|author|scholar)\b/.test(story + ' ' + theme);
  return { motifs: motifs, faith: faith, roleLine: roleLine, roles: roles, veteran: vet, prefs: prefs, found: found, reading: reading };
}

var HS_QUOTE_SUGGEST = {
  general: ['Forever in our hearts', 'Always loved, never forgotten', 'Love lives on', 'Until we meet again', 'Loved beyond words, missed beyond measure'],
  christian: ['The Lord is my shepherd', 'Well done, good and faithful servant', 'Safe in the arms of Jesus'],
  catholic: ['Eternal rest grant unto them, O Lord', 'The Lord is my shepherd'],
  jewish: ['May their memory be a blessing'],
  garden: ['Loved and tended, like the garden', 'In every bloom, we see you'],
  sea: ['Fair winds and following seas'],
  mountains: ['The mountains are calling'],
  family: ['A life of love, a family forever grateful']
};
function hsSuggestQuotes(form, an) {
  var pool = [], add = function (k) { (HS_QUOTE_SUGGEST[k] || []).forEach(function (q) { if (pool.indexOf(q) < 0) pool.push(q); }); };
  var fs = String((an && an.faith && an.faith.sym) || ''), st = String(form.story || '') + ' ' + String(form.theme || '');
  if (/jew|star of david|menorah/i.test(form.faith || '') || fs === 'david') add('jewish');
  if (/catholic/i.test(form.faith || '')) add('catholic');
  if (/christ|baptist|methodist|luther|church|faith/i.test(form.faith || '') || fs === 'cross') add('christian');
  if (/garden|flower|rose|bloom/i.test(st)) add('garden');
  if (/sea|ocean|sail|navy|boat/i.test(st)) add('sea');
  if (/mountain|hik|trail|peak/i.test(st)) add('mountains');
  if (an && an.roles && an.roles.length > 1) add('family');
  add('general');
  return pool.slice(0, 3);
}
function hsContentFrom(form, an, photos) {
  var byId = {};
  photos = hsPhotoSet(form, photos);
  photos.forEach(function (p) { byId[p.id] = p; });
  var partner = form.who === 'two' && form.pair !== 'matching' && String(form.name2 || '').trim() ? { np: hsNameParts(form.name2), born: hsParseDate(form.born2), passed: hsParseDate(form.passed2) || (hsPassedLater(form, 2) ? HS_RESV_DATE : null) } : null;
  /* Their own words are used as they gave them, with nothing added. Left blank, the designs offer gentle
     suggestions; and when they'd rather have no words at all, the stone keeps to names and dates. */
  var own = (form.quotes || []).map(hsCleanQuote).filter(Boolean), none = !!form.noQuotes;
  return { np: hsNameParts(form.name), born: hsParseDate(form.born), passed: hsParseDate(form.passed) || (hsPassedLater(form, 1) ? HS_RESV_DATE : null), partner: partner,
    quotes: none ? [] : own.length ? own : hsSuggestQuotes(form, an), quotesOwn: !none && own.length > 0, quotesSuggested: !none && !own.length, noWords: none,
    extraOk: !none && !own.length, roleLine: an.roleLine, veteran: an.veteran, photoById: byId, photos: photos || [] };
}

/* How far lowercase tails (g, p, y) or script flourishes hang below the last line's capital baseline. */
function hsTail(l) {
  if (!l || l.type !== 'text') return 0;
  var ls = hsLines(l), last = ls[ls.length - 1] || '';
  if (l.font === 'script') return l.ht * 0.4;
  return /[gjpqy]/.test(last) ? l.ht * 0.28 : 0;
}
function hsFlow(blocks, yTop, yBot, sp) {
  blocks = blocks.filter(Boolean);
  if (!blocks.length) return;
  var total = 0, gaps = 0;
  blocks.forEach(function (b, i) { b.h = b.h || hsBox(b.layer).h; b.tl = hsTail(b.layer); total += b.h; if (i) { total += b.gap + blocks[i - 1].tl; gaps += b.gap; } });
  var avail = yBot - yTop, extra = avail - total, k = 1, add = 0, lead = 0, ng = blocks.length - 1;
  /* Too tall: tighten the gaps, and if it still overflows, keep the group centered so it spills evenly top and bottom. */
  if (extra < 0) { k = gaps > 0 ? Math.max(0.3, (gaps + extra) / gaps) : 1; lead = (avail - (total - gaps * (1 - k))) / 2; }
  else { add = ng > 0 ? Math.min(1.2 * (sp || 1), extra * 0.5 / ng) : 0; lead = (extra - add * ng) / 2; }
  var y = yTop + lead;
  blocks.forEach(function (b, i) {
    if (i) y += b.gap * k + add + blocks[i - 1].tl;
    b.layer.y = hsR(y + b.h / 2, 2);
    (b.attach || []).forEach(function (a) { a.y = b.layer.y; });
    y += b.h;
  });
}

/* A custom top-to-bottom order the family chose by dragging parts onto each other. Parts named in the order
   trade places among themselves; everything else keeps its slot, and each part keeps its own size. */
function hsReorderBlocks(blocks, order, sp) {
  blocks.forEach(function (b) { if (b.layer) b.layer.inStack = true; });
  if (!order || !order.length || blocks.length < 2) return blocks;
  var rank = {}; order.forEach(function (k, i) { rank[k] = i; });
  var slots = [], moving = [];
  blocks.forEach(function (b, i) { var k = b.layer && b.layer.key; if (k !== undefined && rank[k] !== undefined) { slots.push(i); moving.push(b); } });
  if (moving.length < 2) return blocks;
  moving.sort(function (a, b) { return rank[a.layer.key] - rank[b.layer.key]; });
  var out = blocks.slice(), gaps = slots.map(function (i) { return blocks[i].gap; });
  slots.forEach(function (i, n) { out[i] = moving[n]; });
  /* spacing belongs to the slot, so the stone keeps its rhythm after a swap */
  slots.forEach(function (i, n) { out[i].gap = gaps[n] || (i ? 0.9 * (sp || 1) : 0); });
  if (out.length) out[0].gap = 0;
  return out;
}
function hsLayout(d, C, o) {
  if (d.params && d.params.layout === 'split') return hsFinishLayers(hsFlipX(hsLayoutSplit(d, C, o), d), d.params);
  var p = d.params, W = d.W, H = d.H, small = H < 16, seq = 0;
  o = o || {};
  var sc = o.sc || p.textSize || 1, sp = p.spacing || 1, drop = !!o.drop, floor = o.floor !== false && !p.textSize;
  var scMin = function (pref, min) { return floor ? Math.min(pref * sc, min) : Math.min(min, pref * sc); };
  var fs = hsFind(HS_FONTSETS, p.fonts);
  var layers = [], blocks = [];
  var kc = {}, L = function (o) { o.id = 'g' + (++seq); o.visible = true; return hsPreAdj(o, d, C, kc); };
  var carve = p.carve || 'vcut', symCarve = p.symCarve || 'frost';
  var up = function (t, font) { return font === 'gothic' || font === 'script' ? t : String(t).toUpperCase(); };
  var rockB = p.edges === 'rock' ? HS_ROCK_BAND : 0;
  if (p.border && p.border !== 'none') layers.push(L({ type: 'border', name: 'Border', carve: carve, bstyle: p.border, inset: (small ? 0.6 : 1) + rockB }));
  var clear = hsClear({ layers: layers, params: p, type: d.type }) + (small ? 0.3 : 0.6);
  var heartish = d.shape === 'heart' || d.shape === 'dheart';
  var mir = hsMirrorOn(d), Hp = mir ? H * 0.62 : H;
  var x0 = clear, x1 = W - clear;
  if (heartish) { var hk = d.shape === 'heart' ? 0.3 : 0.27; x0 = Math.max(x0, W * hk); x1 = Math.min(x1, W * (1 - hk)); }
  var ph = (C.viewP === 2 && p.photo2 ? p.photo2 : p.photo) && C.photoById ? C.photoById[C.viewP === 2 && p.photo2 ? p.photo2 : p.photo] : null;
  var place = p.photoPlace || 'left';
  if (ph && (heartish || d.shape === 'teardrop')) place = 'top';
  if (p.layout === 'below' && !heartish && p.photoPlace !== 'top') place = 'bottom';
  var photo = null;
  if (ph) {
    if (place === 'top' || place === 'bottom') {
      var tw = hsR(Math.min(5.4, H * 0.26), 2);
      photo = L({ type: 'photo', name: 'Portrait', photo: ph.id, w: tw, h: hsR(tw * 1.28, 2), ar: 1.28, frame: 'oval', carve: p.photoFinish || 'laser', x: 0, y: 0 });
    } else {
      var guessW = Math.min(8, (H - 2 * clear) / 1.3) + 0.2;
      var edgeTop = place === 'right' ? hsMaxTop(d.shape, W, Hp, x1 - guessW, x1) : hsMaxTop(d.shape, W, Hp, x0, x0 + guessW);
      var hh = hsR(Math.max(3.6, Math.min(10.4, H - 2 * clear - edgeTop * (mir ? 2 : 1) - 0.3)), 2), ww = hsR(Math.max(3.2, hh / 1.3), 2);
      photo = L({ type: 'photo', name: 'Portrait', photo: ph.id, w: ww, h: hh, ar: hh / ww, frame: 'oval', carve: p.photoFinish || 'laser', x: 0, y: H / 2 });
      if (place === 'right') { photo.x = hsR(x1 - 0.2 - ww / 2, 2); x1 = photo.x - ww / 2 - (small ? 0.9 : 1.3); }
      else { photo.x = hsR(x0 + 0.2 + ww / 2, 2); x0 = photo.x + ww / 2 + (small ? 0.9 : 1.3); }
    }
    layers.push(photo);
  }
  var photoSide = !!photo && place !== 'top' && place !== 'bottom';
  var panel = null, pair = null;
  if (p.layout === 'side' && !photoSide && p.sym1 && !heartish) {
    var ps = hsR(Math.min(H - 2 * clear - 0.4, small ? 6 : 7.2), 2);
    panel = L({ type: 'symbol', name: hsSymLabel(p.sym1), carve: symCarve, sym: p.sym1, size: ps, x: hsR(x0 + 0.3 + ps / 2, 2), y: H / 2 });
    x0 = panel.x + ps / 2 + (small ? 1.4 : 2.2);
    layers.push(panel);
  }
  /* Side symbols can sit on both sides, or just one (flank), and trade sides (flankSwap). */
  var flank = p.flank === 'left' || p.flank === 'right' ? p.flank : 'both';
  if (p.layout === 'marker' && !photoSide && p.sym1 && !heartish) {
    var ms = small ? 2.2 : 2.8, mlx = hsR(x0 + 0.2 + ms / 2, 2), mrx = hsR(x1 - 0.2 - ms / 2, 2);
    var mSL = p.flankSwap ? p.sym2 || p.sym1 : p.sym1, mSR = p.flankSwap ? p.sym1 : p.sym2 || p.sym1;
    pair = [];
    if (flank !== 'right') pair.push(L({ type: 'symbol', name: hsSymLabel(mSL) + ' (left)', carve: symCarve, sym: mSL, size: ms, x: mlx, y: H / 2, side: 'L' }));
    if (flank !== 'left') pair.push(L({ type: 'symbol', name: hsSymLabel(mSR) + ' (right)', carve: symCarve, sym: mSR, size: ms, x: mrx, y: H / 2, side: 'R' }));
    x0 = mlx + ms / 2 + 1; x1 = mrx - ms / 2 - 1;
    pair.forEach(function (q) { layers.push(q); });
  }
  var cx = hsR((x0 + x1) / 2, 2), colW = Math.max(4, x1 - x0);
  var qW = Math.min(colW - 0.5, Math.max(12, colW * 0.74));
  var T = function (name, text, font, track, pref, min, lines, gap, isName, pr) {
    if (!text) return null;
    var pref0 = pref; pref = hsR(Math.max(pref * sc, floor ? Math.min(min, pref0) : 0.4), 2); min = floor ? Math.min(min, pref) : Math.min(min, pref);
    gap = gap * sp;
    var l = L({ type: 'text', name: name, carve: carve, font: font, track: track, text: text, ht: pref, x: cx, y: 0 });
    if (isName) hsFitName(l, colW, pref, min); else hsFitInto(l, lines > 1 ? qW : colW, pref, min, lines);
    layers.push(l); blocks.push({ layer: l, gap: blocks.length ? Math.max(gap, blocks[blocks.length - 1].layer.type === 'photo' ? 0.7 * sp : 0) : 0, pr: pr || 0, fit: { w: isName ? colW : lines > 1 ? qW : colW, pref: pref, min: min, lines: lines, isName: isName } }); return l;
  };
  var S = function (sym, size, gap, pr) {
    if (!sym) return null;
    size = hsR(size * (floor ? Math.max(0.82, sc) : sc), 2); gap = gap * sp;
    var l = L({ type: 'symbol', name: hsSymLabel(sym), carve: symCarve, sym: sym, size: size, x: cx, y: 0 });
    layers.push(l); blocks.push({ layer: l, gap: blocks.length ? Math.max(gap, blocks[blocks.length - 1].layer.type === 'photo' ? 0.7 * sp : 0) : 0, pr: pr || 0 }); return l;
  };
  var addPhotoTop = function () {
    if (photo && place === 'top') { photo.x = cx; blocks.push({ layer: photo, gap: 0 }); }
    else if (heartish && p.sym1 && (p.layout === 'side' || p.layout === 'marker')) S(p.sym1, small ? 1.8 : 2.6, 0, 2);
  };
  var TD = function (name, font, track, pref, gap) {
    var l = T(name, dates, font, track, pref, 0.75, 1, gap, false, 0);
    if (l && !l.userFmt && (hsBox(l).w > colW + 0.01 || l.text.indexOf('\n') >= 0)) { l.text = hsDateLineW(C.born, C.passed, 'years', ' — ', p.dateWords); l.track = Math.max(l.track, 0.12); hsFitInto(l, colW, pref, 0.75, 1); }
    return l;
  };
  var dates = hsDateLineW(C.born, C.passed, p.dateStyle || 'upper', p.dateStyle === 'years' ? ' — ' : ' – ', p.dateWords);
  var qSel = hsQuoteSel(p).filter(function (k) { return !!C.quotes[k]; });
  var quote = qSel.length ? C.quotes[qSel[0]] : '', moreQuotes = qSel.slice(1).map(function (k) { return C.quotes[k]; });
  var MQ = function (fn) { moreQuotes.forEach(fn); };
  var role = p.showRole ? C.roleLine : '';
  var bottomSym = null;
  if (p.layout === 'family') {
    addPhotoTop();
    var head = C.np.surname || C.np.full;
    var symS = p.sym1 && !heartish ? hsR((small ? 2.2 : 3.4) * (floor ? Math.max(0.82, sc) : sc), 2) : 0;
    var hdr = L({ type: 'text', name: C.np.surname ? 'Family name' : 'Name', carve: carve, font: fs.head, track: fs.headTrack, text: up(head, fs.head), ht: 2, x: cx, y: 0 });
    var hPref = hsR((small ? 1.6 : 2.4) * sc, 2);
    hsFitInto(hdr, colW - (symS ? 2 * (symS + 1.2) : 0), hPref, Math.min(1.0, hPref), 1);
    layers.push(hdr);
    var blk = { layer: hdr, h: Math.max(hdr.ht, symS), gap: blocks.length ? 0.9 * sp : 0, attach: [], fitH: { w: colW, pref: hPref, min: Math.min(hsR((small ? 1.1 : 1.4) * Math.min(1, sc), 2), hPref), symS: symS, sym0: symS } };
    if (symS) {
      var sx = hsR(hsBox(hdr).w / 2 + 1.2 + symS / 2, 2), nm = hsSymLabel(p.sym1);
      if (flank !== 'right') { var sa = L({ type: 'symbol', name: nm + ' (left)', carve: symCarve, sym: p.sym1, size: symS, x: hsR(cx - sx, 2), y: 0, side: 'L' }); layers.push(sa); blk.attach.push(sa); }
      if (flank !== 'left') { var sb = L({ type: 'symbol', name: nm + ' (right)', carve: symCarve, sym: p.sym1, size: symS, x: hsR(cx + sx, 2), y: 0, side: 'R' }); layers.push(sb); blk.attach.push(sb); }
    }
    blocks.push(blk);
    if (C.np.surname && C.np.given) T('Given name', up(C.np.given, fs.name), fs.name, fs.nameTrack, small ? 0.95 : 1.2, 0.8, 1, small ? 0.6 : 1.1, false, 1);
    TD('Dates', fs.dates, fs.datesTrack, small ? 0.75 : 0.85, small ? 0.5 : 0.75);
    T('Tribute line', role, fs.quote, 0.02, 0.85, 0.75, 1, small ? 0.6 : 1.0, false, 3);
    T('Epitaph', quote, fs.quote, 0.02, small ? 0.75 : 0.85, 0.75, small ? 1 : 3, small ? 0.6 : 1.1, false, 4);
    MQ(function (q, k) { T('Epitaph ' + (k + 2), q, fs.quote, 0.02, small ? 0.75 : 0.85, 0.75, small ? 1 : 3, small ? 0.6 : 1.1, false, 4); });
    S(p.sym2, small ? 1.6 : 2.2, small ? 0.5 : 0.9, 5);
  } else if (p.layout === 'classic') {
    if (photo && place === 'top') addPhotoTop(); else S(p.sym1, small ? 2.2 : 3.2, 0, 2);
    T(role ? 'Tribute line' : 'Opening line', role || (C.extraOk !== false ? 'In Loving Memory' : ''), fs.top, 0, small ? 0.8 : 1.05, 0.75, 1, small ? 0.6 : 0.9, false, 3);
    T('Name', up(C.np.full, fs.name), fs.name, fs.nameTrack, small ? 1.1 : 1.45, 0.85, 2, 0.9, true);
    TD('Dates', fs.dates, fs.datesTrack * 0.5, 0.8, 0.7);
    if (C.veteran) T('Service', fs.dates === 'gothic' || fs.dates === 'script' ? C.veteran : C.veteran.toUpperCase(), fs.dates === 'italic' ? 'garamond' : fs.dates, 0.12, 0.75, 0.75, 1, 0.6, false, 3);
    T('Epitaph', quote, fs.quote, 0.02, 0.8, 0.75, small ? 1 : 3, small ? 0.6 : 1.0, false, 4);
    MQ(function (q, k) { T('Epitaph ' + (k + 2), q, fs.quote, 0.02, 0.8, 0.75, small ? 1 : 3, small ? 0.6 : 1.0, false, 4); });
    bottomSym = S(p.sym2, small ? 1.6 : 2.2, small ? 0.5 : 0.9, 5);
  } else if (p.layout === 'below') {
    /* Symmetrical, with the picture last: lettering first, then the symbol or portrait centered beneath. */
    if (photo && place === 'top') addPhotoTop();
    T(role ? 'Tribute line' : 'Opening line', role || (C.extraOk !== false ? 'In Loving Memory' : ''), fs.top, 0, small ? 0.8 : 1.0, 0.75, 1, 0, false, 3);
    T('Name', up(C.np.full, fs.name), fs.name, fs.nameTrack, small ? 1.15 : 1.5, 0.85, 2, small ? 0.6 : 0.9, true);
    TD('Dates', fs.dates, fs.datesTrack * 0.5, 0.8, 0.7);
    if (C.veteran) T('Service', fs.dates === 'gothic' || fs.dates === 'script' ? C.veteran : C.veteran.toUpperCase(), fs.dates === 'italic' ? 'garamond' : fs.dates, 0.12, 0.75, 0.75, 1, 0.6, false, 3);
    T('Epitaph', quote, fs.quote, 0.02, 0.8, 0.75, small ? 1 : 3, small ? 0.6 : 1.0, false, 4);
    MQ(function (q, k) { T('Epitaph ' + (k + 2), q, fs.quote, 0.02, 0.8, 0.75, small ? 1 : 3, small ? 0.6 : 1.0, false, 4); });
    if (photo && place === 'bottom') { photo.x = cx; blocks.push({ layer: photo, gap: (small ? 0.6 : 1.0) * sp, pr: 2 }); }
    else S(p.sym1, small ? 2.6 : 3.8, small ? 0.6 : 1.0, 2);
  } else if (p.layout === 'side') {
    addPhotoTop();
    T('Name', up(C.np.full, fs.name), fs.name, fs.nameTrack, small ? 1.4 : 2.0, 0.9, 2, 0, true);
    T('Tribute line', role, fs.quote, 0.02, 0.8, 0.75, 1, small ? 0.5 : 0.7, false, 3);
    var yrs = p.dateStyle === 'years';
    TD(yrs ? 'Years' : 'Dates', fs.dates, yrs ? Math.max(0.2, fs.datesTrack) : fs.datesTrack, yrs ? 1.0 : 0.85, 0.9);
    T('Epitaph', quote, fs.quote, 0.02, 0.8, 0.75, 2, small ? 0.7 : 1.2, false, 4);
    MQ(function (q, k) { T('Epitaph ' + (k + 2), q, fs.quote, 0.02, 0.8, 0.75, 2, small ? 0.7 : 1.2, false, 4); });
    if (!panel || p.sym2 !== p.sym1) S(p.sym2, small ? 1.6 : 2.2, small ? 0.5 : 0.9, 5);
  } else {
    addPhotoTop();
    T('Name', up(C.np.full, fs.name), fs.name, fs.nameTrack, small ? 1.3 : 1.6, 0.85, 2, 0, true);
    T('Tribute line', role, fs.quote, 0.02, 0.75, 0.75, 1, 0.5, false, 3);
    TD('Dates', fs.dates, fs.datesTrack, 0.8, 0.6);
    T('Epitaph', quote, fs.quote, 0.02, 0.75, 0.75, small ? 1 : 2, 0.7, false, 4);
    MQ(function (q, k) { T('Epitaph ' + (k + 2), q, fs.quote, 0.02, 0.75, 0.75, small ? 1 : 2, 0.7, false, 4); });
  }
  /* A portrait set below the lettering closes the stack in any layout ('below' already placed it). */
  if (photo && place === 'bottom' && !blocks.some(function (b) { return b.layer === photo; })) {
    photo.x = cx;
    /* a small closing symbol stays last, just under the portrait */
    var lastB = blocks[blocks.length - 1], closeSym = lastB && lastB.layer.type === 'symbol' && p.sym2 && lastB.layer.sym === p.sym2 && blocks.length > 1;
    blocks.splice(closeSym ? blocks.length - 1 : blocks.length, 0, { layer: photo, gap: blocks.length ? (small ? 0.6 : 1.0) * sp : 0, pr: 2 });
  }
  blocks = hsReorderBlocks(blocks, p.order, sp);
  var capAt = function (a, b) { return hsMaxTop(d.shape, W, Hp, a, b); };
  /* A front vase stands before the lower middle of the face, so the lettering keeps above it. */
  var vKeep = hsVaseOn(d) && hsVaseFront(d.vase, d) ? hsVaseHt(d.vase) + 0.6 - clear : 0;
  var yTop = capAt(x0, x1) + clear, yBot = (heartish ? H * 0.7 : H - clear - (mir ? capAt(x0, x1) : 0)) - Math.max(0, vKeep);
  if (d.shape === 'book') yTop += 0.2;
  /* Center the whole group on the stone's true middle, then nudge it clear of the curved edges. */
  var cxMid = (x0 + x1) / 2, capMid = hsTopAt(d.shape, W, Hp, cxMid);
  var yTopL = Math.min(yTop, capMid + clear + (d.shape === 'book' ? 0.2 : 0)), yBotL = heartish ? yBot : H - clear - (mir ? capMid : 0) - Math.max(0, vKeep);
  var moveAll = function (dy) { blocks.forEach(function (b) { b.layer.y = hsR(b.layer.y + dy, 2); (b.attach || []).forEach(function (a) { a.y = b.layer.y; }); }); };
  var clash = function () {
    var dn = 0, upn = 0;
    blocks.forEach(function (b) {
      [b.layer].concat(b.attach || []).forEach(function (l) {
        var bx = hsBox(l), cap = capAt(bx.x0, bx.x1);
        dn = Math.max(dn, cap + clear - bx.y0);
        upn = Math.max(upn, bx.y1 - (mir ? H - clear - cap : yBot));
      });
    });
    return { dn: dn, up: upn };
  };
  /* Shape-aware placement: every line gets its own top and bottom limit from the stone's outline at that
     line's width, so short lines can rise into a peak or arch while wide lines settle where there's room. */
  var sideRoom = function (y) { return hsSideAt(d.shape, W, H, y) + clear; };
  var limits = function (b) {
    var lo = -Infinity, hi = Infinity;
    [b.layer].concat(b.attach || []).forEach(function (l, j) {
      var bx = hsBox(l), hh = bx.h, cap = capAt(bx.x0, bx.x1), tl = j === 0 ? hsTail(l) : 0;
      lo = Math.max(lo, cap + clear + hh / 2);
      var bot = heartish ? yBot : H - clear - (mir ? cap : 0) - Math.max(0, vKeep), mg = Math.min(bx.x0, W - bx.x1);
      for (var g = 0; g < 80 && sideRoom(bot) > mg + 0.01; g++) bot -= 0.1;
      hi = Math.min(hi, bot - hh / 2 - tl);
    });
    return [lo, hi];
  };
  var solved = true, natH = 0;
  var place = function () {
    blocks = blocks.filter(Boolean);
    if (!blocks.length) return true;
    blocks.forEach(function (b) { b.h = b.h || hsBox(b.layer).h; b.tl = hsTail(b.layer); b.lim = limits(b); });
    var ng = blocks.length - 1;
    var span = function (k, add) {
      var off = 0, lo = -Infinity, hi = Infinity, offs = [];
      blocks.forEach(function (b, i) {
        if (i) off += blocks[i - 1].h / 2 + blocks[i - 1].tl + b.gap * k + add + b.h / 2; else off = b.h / 2;
        offs.push(off); lo = Math.max(lo, b.lim[0] - off); hi = Math.min(hi, b.lim[1] - off);
      });
      return { lo: lo, hi: hi, offs: offs };
    };
    var k = 1, add = 0, r = span(1, 0);
    natH = r.offs[r.offs.length - 1] + blocks[blocks.length - 1].h / 2;
    if (r.hi >= r.lo) {
      add = ng > 0 ? Math.min(1.2 * sp, (r.hi - r.lo) * 0.5 / ng) : 0;
      r = span(1, add);
      for (var t = 0; t < 8 && r.hi < r.lo; t++) { add *= 0.5; r = span(1, add); }
    } else {
      var a0 = 0.3, a1 = 1, rr = span(0.3, 0);
      if (rr.hi >= rr.lo) {
        for (var it = 0; it < 12; it++) { var mid = (a0 + a1) / 2; if (span(mid, 0).hi >= span(mid, 0).lo) a0 = mid; else a1 = mid; }
        k = a0;
      } else k = 0.3;
      r = span(k, 0);
    }
    var y0 = r.hi >= r.lo ? r.lo + (r.hi - r.lo) * Math.max(0, Math.min(100, hsVAlign(d))) / 100 : (r.lo + r.hi) / 2;
    blocks.forEach(function (b, i) { b.layer.y = hsR(y0 + r.offs[i], 2); (b.attach || []).forEach(function (a) { a.y = b.layer.y; }); });
    solved = r.hi >= r.lo - 0.05;
    return solved;
  };
  /* When it doesn't fit, let each line take the width the stone actually has at its height (narrower up in a
     peak or arch, full width lower down), then place again. A few rounds settle it. */
  var availW = function (y0, y1) {
    var lo = 0.5, hi = colW / 2;
    var ok = function (hw) {
      var a = cx - hw, b = cx + hw, cap = capAt(a, b);
      if (cap + clear > y0) return false;
      if (mir && H - clear - cap < y1) return false;
      return sideRoom(y1) <= Math.min(a, W - b) + 0.01;
    };
    if (ok(hi)) return colW;
    if (!ok(lo)) return 1;
    for (var i = 0; i < 14; i++) { var m2 = (lo + hi) / 2; if (ok(m2)) lo = m2; else hi = m2; }
    return lo * 2;
  };
  var refit = function () {
    var changed = false;
    blocks.forEach(function (b) {
      var f = b.fit, fh = b.fitH, l = b.layer;
      if (!f && !fh) return;
      if (!b.lim || (l.y >= b.lim[0] - 0.02 && l.y <= b.lim[1] + 0.02)) return;
      var y0 = l.y - b.h / 2, y1 = l.y + b.h / 2, full = (f || fh).w, cur = b.curW || full;
      var aw = Math.max(full * 0.5, cur * 0.86, Math.min(full, availW(y0, y1)));
      if (aw > cur - 0.3) return;
      var keep = { text: l.text, ht: l.ht };
      b.raw = b.raw || String(l.text).replace(/\s*\n\s*/g, ' ');
      l.text = b.raw;
      var ok = true;
      if (fh && fh.sym0) fh.symS = hsR(Math.max(small ? 1.6 : 2.0, Math.min(fh.sym0, fh.sym0 * aw / full)), 2);
      if (fh) ok = hsFitInto(l, aw - (fh.symS ? 2 * (fh.symS + 1.2) : 0), fh.pref, fh.min, 1);
      else if (f.isName) { hsFitName(l, aw, f.pref, f.min); ok = hsBox(l).w <= aw + 0.05; }
      else ok = hsFitInto(l, f.lines > 1 ? Math.min(aw, qW) : aw, f.pref, f.min, f.lines);
      if (!ok && (fh || (f && f.lines === 1 && !f.isName))) { l.text = b.raw; l.ht = (fh || f).min; ok = hsBox(l).w < hsBox(Object.assign({}, l, keep)).w - 0.05; }
      if (!ok) { l.text = keep.text; l.ht = keep.ht; return; }
      b.curW = aw; changed = true;
      b.h = fh ? Math.max(l.ht, fh.symS) : hsBox(l).h;
      if (fh && b.attach.length) { var sx2 = hsR(hsBox(l).w / 2 + 1.2 + fh.symS / 2, 2); b.attach.forEach(function (a) { a.x = hsR(a.side === 'R' ? cx + sx2 : cx - sx2, 2); a.size = fh.symS; }); }
    });
    return changed;
  };
  var fits = function () {
    var ok = place();
    for (var it = 0; it < 8 && !ok; it++) { if (!refit()) break; ok = place(); }
    return ok;
  };
  if (!drop) fits();
  else while (!fits()) {
    var worst = -1, wp = 0;
    blocks.forEach(function (b, k) { if ((b.pr || 0) > wp) { wp = b.pr; worst = k; } });
    if (worst < 0) break;
    var gone = blocks[worst].layer;
    layers = layers.filter(function (x) { return x !== gone; });
    blocks.splice(worst, 1);
    if (blocks.length) blocks[0].gap = 0;
  }
  if (photoSide) {
    var minY = hsMaxTop(d.shape, W, H, photo.x - photo.w / 2, photo.x + photo.w / 2) + clear + photo.h / 2;
    photo.y = hsR(Math.min(H - clear - photo.h / 2, Math.max(minY, (yTop + yBot) / 2)), 2);
  }
  if (panel) {
    var pmin = hsMaxTop(d.shape, W, H, panel.x - panel.size / 2, panel.x + panel.size / 2) + clear + panel.size / 2;
    panel.y = hsR(Math.min(H - clear - panel.size / 2, Math.max(pmin, (yTop + yBot) / 2)), 2);
  }
  if (pair && blocks.length) {
    var t0 = hsBox(blocks[0].layer).y0, t1 = hsBox(blocks[blocks.length - 1].layer).y1;
    pair.forEach(function (s) {
      var cp = capAt(s.x - s.size / 2, s.x + s.size / 2), lo = cp + clear + s.size / 2, hi = H - clear - (mir ? cp : 0) - s.size / 2;
      s.y = hsR(Math.min(hi, Math.max(lo, (t0 + t1) / 2)), 2);
    });
  }
  /* With a portrait beside the words, center the portrait and words together as one group. */
  if ((photoSide || panel) && blocks.length) {
    var items = layers.filter(function (l) { return l.type !== 'border'; });
    var gx0 = Infinity, gx1 = -Infinity, ty0 = Infinity, ty1 = -Infinity;
    items.forEach(function (l) { var b = hsBox(l); gx0 = Math.min(gx0, b.x0); gx1 = Math.max(gx1, b.x1); });
    blocks.forEach(function (b) { var bx = hsBox(b.layer); ty0 = Math.min(ty0, bx.y0); ty1 = Math.max(ty1, bx.y1); });
    var off = W / 2 - (gx0 + gx1) / 2;
    off = Math.max(clear - gx0, Math.min(W - clear - gx1, off));
    if (Math.abs(off) > 0.15) items.forEach(function (l) { l.x = hsR(l.x + off, 2); });
    var sideEl = photoSide ? photo : panel, sw2 = photoSide ? photo.w : panel.size, sh2 = photoSide ? photo.h : panel.size;
    var pMin = capAt(sideEl.x - sw2 / 2, sideEl.x + sw2 / 2) + clear + sh2 / 2, pMax = H - clear - (mir ? capAt(sideEl.x - sw2 / 2, sideEl.x + sw2 / 2) : 0) - sh2 / 2;
    sideEl.y = hsR(Math.min(pMax, Math.max(pMin, (ty0 + ty1) / 2)), 2);
  }
  layers._natH = natH;
  return hsFinishLayers(hsFlipX(layers, d), p);
}
/* Mirror a layout left-to-right, so a panel, portrait or side can swap to whichever side fits the stone better. */
function hsFlipX(layers, d) {
  if (!d.params || !d.params.flipX) return layers;
  var nat = layers._natH;
  layers.forEach(function (l) { if (l.type !== 'border' && typeof l.x === 'number') l.x = hsR(d.W - l.x, 2); });
  layers._natH = nat;
  return layers;
}
function hsFinishLayers(layers, p) {
  var fb = p.finishBy || {}, pb = p.paintBy || {};
  /* Every other part follows the name's finish (symbols and border included) until it's set on its own,
     so changing the lettering never leaves the symbols a different color. */
  layers.forEach(function (l) {
    /* When the dates wrap onto two lines, the line break already reads as "to", so the dash is dropped. */
    if (l.type === 'text' && /dates|years/i.test(l.name || '') && String(l.text).indexOf('\n') >= 0)
      l.text = String(l.text).replace(/[ \t]*[–—·][ \t]*\n[ \t]*/g, '\n').replace(/\n[ \t]*[–—·][ \t]*/g, '\n');
    var g = hsLayerGroup(l);
    if (!g) return;
    var own = !!fb[g], src = own ? g : fb.name ? 'name' : '';
    if (src) l.carve = fb[src];
    if (l.carve === 'paint') l.paint = (src && pb[src]) || pb[g] || p.paint || '';
  });
  return layers;
}
/* Two-sided layouts for open books, double hearts or any stone told in two halves: each side is laid out
   and centered on its own half, so nothing sits dead-center on the whole stone. For a couple, each side holds
   one person; for one person, their name and dates sit on one side and their words and picture on the other. */
function hsPartnerDate(str) {
  str = String(str || '').trim(); if (!str) return null;
  if (/^\d{4}$/.test(str)) return { y: +str, m: 1, d: 1, yearOnly: true };
  var iso = hsParseLooseDate(str); return iso ? hsParseDate(iso) : null;
}
function hsLayoutSplit(d, C, o) {
  var p = d.params, W = d.W, H = d.H, small = H < 16, seq = 0;
  o = o || {};
  var sc = o.sc || p.textSize || 1, sp = p.spacing || 1, floor = o.floor !== false && !p.textSize;
  var fs = hsFind(HS_FONTSETS, p.fonts), layers = [];
  var kc = {}, L = function (x) { x.id = 'g' + (++seq); x.visible = true; return hsPreAdj(x, d, C, kc); };
  var carve = p.carve || 'vcut', symCarve = p.symCarve || 'frost';
  var up = function (t, font) { return font === 'gothic' || font === 'script' ? t : String(t).toUpperCase(); };
  var rockB = p.edges === 'rock' ? HS_ROCK_BAND : 0;
  if (p.border && p.border !== 'none') layers.push(L({ type: 'border', name: 'Border', carve: carve, bstyle: p.border, inset: (small ? 0.6 : 1) + rockB }));
  var clear = hsClear({ layers: layers, params: p, type: d.type }) + (small ? 0.3 : 0.6);
  var heartish = d.shape === 'heart' || d.shape === 'dheart', mir = hsMirrorOn(d), Hp = mir ? H * 0.62 : H;
  var capAt = function (a, b) { return hsMaxTop(d.shape, W, Hp, a, b); };
  var gut = small ? 0.9 : 1.3;
  var cols = d.shape === 'dheart' ? [[W * 0.15, W * 0.5 - gut / 2], [W * 0.5 + gut / 2, W * 0.85]] : [[clear, W / 2 - gut], [W / 2 + gut, W - clear]];
  var mk = function (c) { return { x0: c[0], x1: c[1], cx: hsR((c[0] + c[1]) / 2, 2), w: c[1] - c[0], blocks: [] }; };
  var A = mk(cols[0]), B = mk(cols[1]);
  var push = function (c, l, gap) { layers.push(l); c.blocks.push({ layer: l, gap: c.blocks.length ? gap * sp : 0 }); return l; };
  var T = function (c, name, text, font, track, pref, min, lines, gap, isName) {
    if (!text) return null;
    pref = hsR(Math.max(pref * sc, floor ? Math.min(min, pref) : 0.4), 2); min = Math.min(min, pref);
    var l = L({ type: 'text', name: name, carve: carve, font: font, track: track, text: text, ht: pref, x: c.cx, y: 0 });
    if (isName) { if (!hsFitInto(l, c.w, pref, Math.max(min, hsR(pref * 0.75, 2)), 1) && !hsFitInto(l, c.w, pref, min, 2)) hsFitInto(l, c.w, pref, min, 3); }
    else hsFitInto(l, c.w, pref, min, lines);
    l.text = String(l.text).replace(/\n([–—·]) /g, ' $1\n');
    return push(c, l, gap);
  };
  var S = function (c, sym, size, gap) {
    if (!sym) return null;
    size = hsR(Math.min(c.w * 0.5, size * (floor ? Math.max(0.82, sc) : sc)), 2);
    return push(c, L({ type: 'symbol', name: hsSymLabel(sym), carve: symCarve, sym: sym, size: size, x: c.cx, y: 0 }), gap);
  };
  var ds = p.dateStyle || 'upper', sepD = ds === 'years' ? ' — ' : ' – ';
  var qSel = hsQuoteSel(p).filter(function (k) { return !!C.quotes[k]; });
  var partner = C.partner ? { name: C.partner.np.full, fromIntake: true } : p.partner && String(p.partner.name || '').trim() ? p.partner : null;
  var ph = p.photo && C.photoById ? C.photoById[p.photo] : null;
  var nameF = fs.name, nPref = small ? 1.05 : 1.4, gapM = small ? 0.55 : 0.85;
  /* Height a side already uses, so extra lines can go wherever there is more room and the halves stay balanced. */
  var colH = function (c) { var h = 0; c.blocks.forEach(function (b, k) { h += hsBox(b.layer).h + hsTail(b.layer) + (k ? b.gap : 0); }); return h; };
  var shorter = function () { return colH(B) < colH(A) ? B : A; };
  var ph2 = p.photo2 && C.photoById ? C.photoById[p.photo2] : null;
  var portrait = function (c, pho, nm) { var pw = hsR(Math.min(c.w * 0.5, H * 0.26), 2); return push(c, L({ type: 'photo', name: nm, photo: pho.id, w: pw, h: hsR(pw * 1.28, 2), ar: 1.28, frame: 'oval', carve: p.photoFinish || 'laser', x: c.cx, y: 0 }), 0); };
  if (partner && ph) portrait(A, ph, 'Portrait');
  else S(A, partner && p.storyMode === 'blended' ? (p.symBlend || p.sym1) : p.sym1, small ? 1.7 : 2.3, 0);
  var nmA = T(A, 'Name', up(C.np.full, nameF), nameF, fs.nameTrack, nPref, 0.8, 3, gapM, true);
  T(A, 'Dates', hsDateLineW(C.born, C.passed, ds, sepD, p.dateWords), fs.dates, fs.datesTrack * 0.5, 0.8, 0.75, 2, gapM * 0.8);
  if (partner) {
    if (ph2) portrait(B, ph2, 'Partner portrait');
    else S(B, p.storyMode === 'blended' ? (p.symBlend || p.sym1) : (p.sym2 || p.sym1), small ? 1.7 : 2.3, 0);
    var nmB = T(B, 'Partner name', up(String(partner.name).trim(), nameF), nameF, fs.nameTrack, nPref, 0.8, 3, gapM, true);
    /* Both names carved at the same size, so neither partner reads as secondary. */
    if (nmA && nmB && Math.abs(nmA.ht - nmB.ht) > 0.01) {
      var hh = Math.min(nmA.ht, nmB.ht);
      [[nmA, A], [nmB, B]].forEach(function (q) { var l = q[0]; l.text = String(l.text).replace(/\s*\n\s*/g, ' '); if (!hsFitInto(l, q[1].w, hh, hh, 1) && !hsFitInto(l, q[1].w, hh, hh, 2)) hsFitInto(l, q[1].w, hh, hh, 3); });
    }
    var pb = partner.fromIntake ? C.partner.born : hsPartnerDate(partner.born), pp = partner.fromIntake ? C.partner.passed : hsPartnerDate(partner.passed), yo = (pb && pb.yearOnly) || (pp && pp.yearOnly), st = yo ? 'years' : ds;
    var pl = pb && pp ? hsFmtDate(pb, st) + (yo ? ' — ' : sepD) + hsFmtDate(pp, st) : pb ? hsFmtDate(pb, st) + (yo || st === 'years' ? ' —' : ' –') : pp ? hsFmtDate(pp, st) : '';
    if (p.dateWords && (String(p.dateWords.a || '').trim() || String(p.dateWords.b || '').trim())) pl = hsDateLineW(pb, pp, st, yo ? ' — ' : sepD, p.dateWords);
    T(B, 'Partner dates', pl, fs.dates, fs.datesTrack * 0.5, 0.8, 0.75, 2, gapM * 0.8);
    qSel.forEach(function (k, i) { T(shorter(), i ? 'Epitaph ' + (i + 1) : 'Epitaph', C.quotes[k], fs.quote, 0.02, 0.78, 0.72, 3, gapM); });
  } else {
    if (ph) {
      var pw = hsR(Math.min(B.w * 0.62, H * 0.3), 2);
      push(B, L({ type: 'photo', name: 'Portrait', photo: ph.id, w: pw, h: hsR(pw * 1.28, 2), ar: 1.28, frame: 'oval', carve: p.photoFinish || 'laser', x: B.cx, y: 0 }), 0);
    } else S(B, p.sym2, small ? 1.7 : 2.3, 0);
    /* The first quote opens the second side; the tribute stays with the name,
       and any further quotes go to whichever side is shorter. */
    if (qSel.length) T(B, 'Epitaph', C.quotes[qSel[0]], fs.quote, 0.02, 0.82, 0.72, 4, B.blocks.length ? gapM * 1.1 : 0);
    if (p.showRole && C.roleLine) T(A, 'Tribute line', C.roleLine, fs.quote, 0.02, 0.8, 0.75, 2, gapM);
    qSel.slice(1).forEach(function (k, i) { var c = shorter(); T(c, 'Epitaph ' + (i + 2), C.quotes[k], fs.quote, 0.02, 0.82, 0.72, 4, c.blocks.length ? gapM * 1.1 : 0); });
    if (!B.blocks.length && p.sym1) { S(B, p.sym1, small ? 2.4 : 3.2, 0); }
  }
  A.blocks = hsReorderBlocks(A.blocks, p.order, sp); B.blocks = hsReorderBlocks(B.blocks, p.order, sp);
  var sideRoom = function (y) { return hsSideAt(d.shape, W, H, y) + clear; };
  var yBotH = heartish ? H * 0.72 : H;
  var va = Math.max(0, Math.min(100, hsVAlign(d))) / 100;
  var mainMid = null, natMax = 0;
  [A, B].sort(function (a, b) { return b.blocks.length - a.blocks.length; }).forEach(function (c) {
    var bl = c.blocks; if (!bl.length) return;
    bl.forEach(function (b) {
      b.h = hsBox(b.layer).h; b.tl = hsTail(b.layer);
      var bx = hsBox(b.layer), cap = capAt(bx.x0, bx.x1), bot = heartish ? yBotH : H - clear - (mir ? cap : 0), mg = Math.min(bx.x0, W - bx.x1);
      for (var g = 0; g < 80 && sideRoom(bot) > mg + 0.01; g++) bot -= 0.1;
      b.lim = [cap + clear + b.h / 2, bot - b.h / 2 - b.tl];
    });
    var span = function (k, add) {
      var off = 0, lo = -Infinity, hi = Infinity, offs = [];
      bl.forEach(function (b, i) { if (i) off += bl[i - 1].h / 2 + bl[i - 1].tl + b.gap * k + add + b.h / 2; else off = b.h / 2; offs.push(off); lo = Math.max(lo, b.lim[0] - off); hi = Math.min(hi, b.lim[1] - off); });
      return { lo: lo, hi: hi, offs: offs };
    };
    var ng = bl.length - 1, k = 1, add = 0, r = span(1, 0);
    natMax = Math.max(natMax, r.offs[r.offs.length - 1] + bl[bl.length - 1].h / 2);
    if (r.hi >= r.lo) { add = ng > 0 ? Math.min(1.1 * sp, (r.hi - r.lo) * 0.45 / ng) : 0; r = span(1, add); }
    else { var a0 = 0.3, a1 = 1; if (span(0.3, 0).hi >= span(0.3, 0).lo) { for (var it = 0; it < 12; it++) { var m2 = (a0 + a1) / 2; var rr = span(m2, 0); if (rr.hi >= rr.lo) a0 = m2; else a1 = m2; } k = a0; } else k = 0.3; r = span(k, 0); }
    var y0 = r.hi >= r.lo ? r.lo + (r.hi - r.lo) * va : (r.lo + r.hi) / 2;
    /* The fuller side sets the height; the other side is balanced against its middle, never pinned to the top. */
    var total = r.offs[r.offs.length - 1] + bl[bl.length - 1].h / 2;
    if (mainMid !== null && r.hi >= r.lo) y0 = Math.max(r.lo, Math.min(r.hi, mainMid - total / 2));
    else if (mainMid === null) mainMid = y0 + total / 2;
    bl.forEach(function (b, i) { b.layer.y = hsR(y0 + r.offs[i], 2); });
  });
  layers._natH = natMax;
  return layers;
}


/* Try the family's chosen sizes first, then ease the lettering down a few steps until everything sits comfortably. */
var HS_FIT_STEPS = [1, 0.94, 0.88, 0.82, 0.76];
/* ---- Layout-relative adjustments ----
   The layout places everything; the full editor records changes as adjustments to that placement
   (an offset, a size, new wording, a finish) keyed to each part's role. They survive every re-layout,
   so changing the stone, the size or even the layout keeps the person's touches, relative to where
   the layout puts each part. Parts the person adds themselves ride along as extra layers. */
var HS_ADJ_FIELDS = ['text', 'font', 'ht', 'track', 'size', 'sym', 'carve', 'paint', 'visible', 'w', 'h', 'ar', 'frame', 'photo', 'bstyle', 'inset', 'name', 'tone', 'look'];
/* Photo shapes, and the looks that turn a photo into something the carver can cut. */
var HS_PHOTO_SHAPES = [{ id: 'oval', label: 'Oval' }, { id: 'circle', label: 'Circle' }, { id: 'rect', label: 'Rectangle' }, { id: 'square', label: 'Square' }];
var HS_PHOTO_LOOKS = [
  { id: 'photo', label: 'Photo', sub: 'Just as it is', f: '' },
  { id: 'etched', label: 'Etched', sub: 'Fine stippled dots', f: 'et' },
  { id: 'sketch', label: 'Sketched', sub: 'Soft carved lines', f: 'sk' },
  { id: 'relief', label: 'Sculpted', sub: 'Raised in the stone', f: 'rl' }
];
function hsPhotoShapeLabel(f) { return (hsFind(HS_PHOTO_SHAPES, f || 'oval') || HS_PHOTO_SHAPES[0]).label; }
function hsPhotoRound(f) { return !f || f === 'oval' || f === 'circle'; }
function hsPhotoEven(f) { return f === 'circle' || f === 'square'; }
function hsPhotoMethod(l) {
  if (hsIsResvPhoto(l.photo)) return 'Reserved space for a portrait to be added later (leave uncut)';
  var lk = l.look || 'photo';
  if (lk === 'etched') return 'Stipple-etched portrait, processed from the photo';
  if (lk === 'sketch') return 'Line-etched sketch portrait, processed from the photo';
  if (lk === 'relief') return 'Sculpted relief portrait, hand-carved from the photo';
  if (l.carve === 'laser') return 'Laser-etched photo';
  return 'Porcelain photo medallion, ' + (l.tone === 'bw' ? 'black & white' : 'in color');
}
function hsPhotoShort(l) {
  var lk = l.look || 'photo';
  if (lk !== 'photo') return hsFind(HS_PHOTO_LOOKS, lk).label;
  return l.carve === 'laser' ? 'Laser-etched' : 'Porcelain' + (l.tone === 'bw' ? ' (B&W)' : '');
}
function hsHexLum(h) {
  var m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(h || ''); if (!m) return 0.5;
  return (0.2126 * parseInt(m[1], 16) + 0.7152 * parseInt(m[2], 16) + 0.0722 * parseInt(m[3], 16)) / 255;
}
/* Circles and squares are as tall as they are wide. */
function hsPhotoNorm(o, a) {
  if (o.type !== 'photo') return o;
  if (hsPhotoEven(o.frame) && !(a && a.h !== undefined)) { var s0 = Math.min(o.w, o.h); o.w = s0; o.h = s0; o.ar = 1; }
  return o;
}
var HS_ADJ_SIZE = ['dx', 'dy', 'ht', 'track', 'size', 'w', 'h', 'inset'];
function hsLayerKeyBase(l) {
  if (l.type === 'border') return 'border';
  if (l.type === 'photo') return 'photo';
  if (l.type === 'symbol') { var lab = hsSymLabel(l.sym); return String(l.name || '').indexOf(lab) === 0 ? 'symbol' + String(l.name).slice(lab.length) : 'symbol'; }
  return String(l.name || 'text');
}
function hsIsDatesLayer(l) { return l.type === 'text' && (l.role === 'dates' || /^(Dates|Years|Partner dates)$/.test(l.name || '')); }
function hsDatesText(d, C, person, style, stack, words) {
  var p = d.params || {}, b = null, e = null;
  if (person === 2) {
    if (C.partner) { b = C.partner.born; e = C.partner.passed; }
    else if (p.partner) { b = hsPartnerDate(p.partner.born); e = hsPartnerDate(p.partner.passed); }
    if ((b && b.yearOnly) || (e && e.yearOnly)) style = 'years';
  } else { b = C.born; e = C.passed; }
  var t = hsDateLineW(b, e, style, style === 'years' ? ' — ' : ' – ', words === undefined ? p.dateWords : words);
  if (stack && b && e) t = t.replace(/\s+[–—·]\s+/, '\n');
  return t;
}
function hsAdjApply(l, a, d, C) {
  HS_ADJ_FIELDS.forEach(function (k) { if (a[k] !== undefined) l[k] = a[k]; });
  if (hsIsDatesLayer(l) && (a.dateStyle || a.dateStack !== undefined || a.dateWords) && a.text === undefined) {
    var person = l.person || (/Partner/.test(l.key || l.name || '') ? 2 : 1);
    var t = hsDatesText(d, C, person, a.dateStyle || (d.params && d.params.dateStyle) || 'upper', !!a.dateStack, a.dateWords);
    if (t) l.text = t;
  }
  if (l.type !== 'border') {
    if (a.dx) l.x = hsR(l.x + a.dx, 3);
    if (a.dy) l.y = hsR(l.y + a.dy, 3);
  }
  return l;
}
/* Content changes (wording, date format, typeface, sizes) go in before placement, so the layout flows around them. */
var HS_ADJ_POST = ['carve', 'paint', 'visible', 'name', 'tone', 'look'];
function hsPreAdj(o, d, C, kc) {
  var base = hsLayerKeyBase(o), n = (kc[base] = (kc[base] || 0) + 1), key = n > 1 ? base + ' #' + n : base;
  o.key = key; o._pre = true;
  if (o.type === 'photo') {
    var pp0 = d.params || {};
    if (pp0.photoShape) o.frame = pp0.photoShape;
    o.look = pp0.photoLook || o.look || 'photo'; o.tone = pp0.photoTone || o.tone || 'color';
  }
  var a = ((d.params || {}).adj || {})[key];
  if (!a) return hsPhotoNorm(o, null);
  ['font', 'track', 'sym', 'frame', 'photo', 'bstyle', 'inset', 'size', 'w', 'h', 'ar'].forEach(function (k) { if (a[k] !== undefined) o[k] = a[k]; });
  if (a.ht !== undefined) { o.ht = a.ht; o.fixHt = a.ht; }
  if (a.text !== undefined || a.dateStyle || a.dateStack || a.dateWords) o.userFmt = true;
  if (a.text !== undefined) { o.text = a.text; o.keepLines = true; }
  else if (hsIsDatesLayer(o) && (a.dateStyle || a.dateStack || a.dateWords)) {
    var t = hsDatesText(d, C, /Partner/.test(key) ? 2 : 1, a.dateStyle || (d.params && d.params.dateStyle) || 'upper', !!a.dateStack, a.dateWords);
    if (t) { o.text = t; o.stack = !!a.dateStack; if (o.stack && t.indexOf('\n') >= 0) o.keepLines = true; }
  }
  if (a.sym !== undefined && o.type === 'symbol') o.name = hsSymLabel(a.sym) + String(o.name || '').replace(/^[^(]*/, ' ').replace(/^ $/, '');
  return hsPhotoNorm(o, a);
}
function hsApplyAdj(layers, d, C) {
  var p = d.params || {}, adj = p.adj || {}, seen = {}, out = [];
  layers.forEach(function (l0) {
    var base = hsLayerKeyBase(l0), n = (seen[base] = (seen[base] || 0) + 1), key = n > 1 ? base + ' #' + n : base;
    if (l0.key) key = l0.key;
    var l = Object.assign({}, l0, { key: key, id: 'k:' + key, bx: l0.x, by: l0.y });
    var a = adj[key];
    if (a) {
      if (a.removed) return;
      if (l0._pre) {
        HS_ADJ_POST.forEach(function (k) { if (a[k] !== undefined) l[k] = a[k]; });
        if (l.type !== 'border') { if (a.dx) l.x = hsR(l.x + a.dx, 3); if (a.dy) l.y = hsR(l.y + a.dy, 3); }
      } else hsAdjApply(l, a, d, C);
      l.adjusted = true;
    }
    out.push(l);
  });
  (p.extra || []).forEach(function (x) {
    var l = Object.assign({}, x, { extra: true, key: x.id, bx: x.x, by: x.y });
    if (l.role === 'dates') { var t = hsDatesText(d, C, l.person || 1, l.dateStyle || p.dateStyle || 'upper', !!l.dateStack, l.dateWords); if (t) l.text = t; }
    if (l.type === 'border') out.unshift(l); else out.push(l);
  });
  /* Stacking order from the editor's layer list: later means on top. */
  if (p.z && p.z.length) {
    var zr = {}; p.z.forEach(function (k, i) { zr[k] = i; });
    var zs = [], zm = [];
    out.forEach(function (l, i) { if (zr[l.key] !== undefined) { zs.push(i); zm.push(l); } });
    zm.sort(function (a, b) { return zr[a.key] - zr[b.key]; });
    zs.forEach(function (i, n) { out[i] = zm[n]; });
  }
  out._natH = layers._natH;
  return out;
}
function hsStripAdj(adj) {
  var out = {};
  Object.keys(adj || {}).forEach(function (k) { var a = Object.assign({}, adj[k]); HS_ADJ_SIZE.forEach(function (f) { delete a[f]; }); if (Object.keys(a).length) out[k] = a; });
  return out;
}
/* Where the stone stands in the final scene: screen y of its foot, its scale, and the camera tilt. */
/* The best lettering for the stone as it is: tries sizes and line spacing together and keeps the one that fills the
   stone most comfortably, with nothing cramped and as little as possible snug, larger lettering winning ties. */
function hsBestLettering(d, C) {
  var p = d.params || {}, adj = {};
  Object.keys(p.adj || {}).forEach(function (k) { var a = Object.assign({}, p.adj[k]); ['ht', 'track', 'size', 'w', 'h'].forEach(function (f) { delete a[f]; }); if (Object.keys(a).length) adj[k] = a; });
  var best = null, W = d.W, H = d.H;
  [0.85, 1, 1.15, 1.3].forEach(function (sp) {
    for (var ts = 0.7; ts <= 1.6001; ts += 0.03) {
      var t = Object.assign({}, d, { params: Object.assign({}, p, { textSize: hsR(ts, 2), spacing: sp, adj: adj }) });
      t.layers = hsLayoutBest(t, C);
      var stt = hsLayerStatus(t);
      if (stt.red) continue;
      var clear = hsClear(t), x0 = W, x1 = 0, y0 = H, y1 = 0, n = 0;
      t.layers.forEach(function (l) { if (!l.visible || l.type === 'border') return; var b = hsBox(l); if (!b) return; n++; x0 = Math.min(x0, b.x0); x1 = Math.max(x1, b.x1); y0 = Math.min(y0, b.y0); y1 = Math.max(y1, b.y1); });
      if (!n) continue;
      var fillV = (y1 - y0) / Math.max(1, H - 2 * clear), fillH = (x1 - x0) / Math.max(1, W - 2 * clear);
      /* Aim for the stone about four-fifths full, never crowding its sides; size only breaks near-ties. */
      var score = -Math.abs(fillV - 0.8) * 6 - Math.max(0, fillH - 0.9) * 8 - Math.max(0, 0.55 - fillH) * 2 + ts * 0.25 - stt.yellow * 1.5 - Math.abs(sp - 1) * 0.6;
      if (!best || score > best.score) best = { score: score, textSize: hsR(ts, 2), spacing: sp, adj: adj, yellow: stt.yellow };
    }
  });
  return best;
}
function hsFinPlace(d) {
  var lying = d.type === 'grass' || d.type === 'bevel' || d.type === 'pillow';
  var wIn = d.W + 2 * (hsBaseH(d) ? hsBaseX(d) : 0);
  /* Always centered in the view; sized so even a wide stone clears the story card on the left. */
  if (lying) return { sc: Math.max(1.3, Math.min(2.4, 540 / (wIn * K))), foot: 856, cx: 720, lift: 96, tf: 'perspective(1200px) rotateX(' + (d.type === 'grass' ? 50 : 45) + 'deg)' };
  return { sc: Math.max(0.9, Math.min(1.2, 540 / (wIn * K))), foot: 832, cx: 720, lift: 64, tf: d.type === 'slant' ? 'perspective(1200px) rotateX(14deg)' : 'perspective(1200px) rotateX(0deg)' };
}
function hsOffWords(ox, oy) {
  var a = [];
  if (ox) a.push(hsIn(Math.abs(ox)) + (ox > 0 ? ' right' : ' left'));
  if (oy) a.push(hsIn(Math.abs(oy)) + (oy > 0 ? ' down' : ' up'));
  return a.join(', ');
}
function hsAdjCount(d) {
  var adj = (d.params && d.params.adj) || {}, n = 0;
  Object.keys(adj).forEach(function (k) { if (HS_ADJ_SIZE.some(function (f) { return adj[k][f] !== undefined; })) n++; });
  return n;
}
function hsLayoutBest(d, C, drop) { return hsApplyAdj(hsLayoutFit(d, C, drop), d, C); }
function hsLayoutFit(d, C, drop) {
  var p = d.params;
  if (p.textSize) { d.fitScale = p.textSize; return hsLayout(d, C, { sc: p.textSize, drop: drop }); }
  var best = null, bestK = Infinity, bestSc = 1, clean = null;
  for (var i = 0; i < HS_FIT_STEPS.length; i++) {
    var sc = HS_FIT_STEPS[i], ls = hsLayout(d, C, { sc: sc, drop: drop }), t = Object.assign({}, d, { layers: ls });
    var k = drop ? hsLeftOff(t, C).length * 100 : 0, stt = hsLayerStatus(t);
    k += stt.red * 10;
    /* Nothing cramped: take it, unless a gentle step smaller would also clear the snug spots. */
    if (k === 0 && !stt.yellow) { d.fitScale = sc; return ls; }
    if (k === 0 && !clean) clean = { ls: ls, sc: sc };
    if (clean && (sc < 0.87 || i === HS_FIT_STEPS.length - 1)) break;
    k += stt.yellow * 0.1;
    if (k < bestK - 0.01) { best = ls; bestK = k; bestSc = sc; }
  }
  if (clean) { d.fitScale = clean.sc; return clean.ls; }
  d.fitScale = bestSc;
  return best;
}

/* Every part of the design gets a traffic light: fine, a little snug (yellow) or cramped / cut off (red). */
function hsLayerStatus(d) {
  var W = d.W, H = d.H, m = hsFind(HS_MATERIALS, d.material), clear = hsClear(d), surf = (d.params && d.params.surface) || 'polished';
  var mirC = hsMirrorOn(d), Hq = mirC ? H * 0.62 : H, hasBorder = d.layers.some(function (l) { return l.visible && l.type === 'border'; });
  var items = d.layers.filter(function (l) { return l.visible && l.type !== 'border' && hsBox(l); });
  var by = {}, red = 0, yellow = 0;
  var mark = function (l, lvl, text) {
    var cur = by[l.id];
    if (!cur || (lvl === 'red' && cur.level !== 'red')) by[l.id] = { level: lvl, text: text };
  };
  items.forEach(function (l) {
    var b = hsBox(l);
    var top = Math.max(hsMaxTop(d.shape, W, Hq, b.x0, b.x1), hsTopAt(d.shape, W, Hq, Math.min(Math.max(W / 2, b.x0), b.x1)));
    var side = Math.max(hsSideAt(d.shape, W, H, b.y0), hsSideAt(d.shape, W, H, b.y1));
    var over = Math.max(top + clear - b.y0, b.y1 - (H - clear - (mirC ? top : 0)), side + clear - b.x0, b.x1 - (W - side - clear));
    var edgeWord = hasBorder ? 'border' : 'edge';
    if (over > 0.45) mark(l, 'red', 'Runs into the ' + edgeWord);
    else if (over > 0.06) mark(l, 'yellow', 'Close to the ' + edgeWord);
    if (l.type === 'text' && l.carve !== 'laser') {
      if (l.ht < 0.7) mark(l, 'red', 'Letters too small to carve');
      else if (l.ht < 0.749) mark(l, 'yellow', 'Letters on the small side');
    }
    if (l.type === 'symbol' && l.carve !== 'laser') {
      if (l.size < 1.2) mark(l, 'red', 'Too small to keep its detail');
      else if (l.size < 1.5) mark(l, 'yellow', 'On the small side');
    }
    if (l.carve === 'laser' && !m.laserOk) mark(l, 'yellow', 'Laser barely shows on ' + m.label);
    if (l.carve === 'polish' && surf === 'polished') mark(l, 'yellow', 'Polished on polished is subtle');
  });
  /* Lowercase tails (g, p, y) and script flourishes hang below the capital line, so they count against the gap. */
  var tail = hsTail;
  for (var i = 0; i < items.length; i++) {
    for (var j = i + 1; j < items.length; j++) {
      var a = hsBox(items[i]), c = hsBox(items[j]);
      var ox = Math.min(a.x1, c.x1) - Math.max(a.x0, c.x0), oy = Math.min(a.y1, c.y1) - Math.max(a.y0, c.y0);
      if (ox > 0.05) oy += a.y0 < c.y0 ? tail(items[i]) : tail(items[j]);
      if (ox > 0.05 && oy > -0.08) { mark(items[i], 'red', 'Touching ' + items[j].name); mark(items[j], 'red', 'Touching ' + items[i].name); }
      else if (ox > 0.05 && oy > -0.3) { mark(items[i], 'yellow', 'Snug against ' + items[j].name); mark(items[j], 'yellow', 'Snug against ' + items[i].name); }
      else if (oy > 0.05 && ox > -0.35) { mark(items[i], 'yellow', 'Snug beside ' + items[j].name); mark(items[j], 'yellow', 'Snug beside ' + items[i].name); }
    }
  }
  Object.keys(by).forEach(function (k) { if (by[k].level === 'red') red++; else yellow++; });
  var list = items.map(function (l) { var s = by[l.id]; return { id: l.id, name: l.name, level: s ? s.level : 'ok', text: s ? s.text : 'Fits well' }; });
  return { by: by, red: red, yellow: yellow, list: list };
}

function hsChecks(d) {
  var out = [], W = d.W, H = d.H, m = hsFind(HS_MATERIALS, d.material);
  var clear = hsClear(d);
  var hasBorder = d.layers.some(function (l) { return l.visible && l.type === 'border'; });
  var items = d.layers.filter(function (l) { return l.visible && l.type !== 'border'; });
  items.forEach(function (l) {
    var b = hsBox(l);
    var mirC = hsMirrorOn(d), Hq = mirC ? H * 0.62 : H;
    var top = Math.max(hsTopAt(d.shape, W, Hq, b.x0), hsTopAt(d.shape, W, Hq, b.x1), hsTopAt(d.shape, W, Hq, Math.min(Math.max(W / 2, b.x0), b.x1)));
    var side = Math.max(hsSideAt(d.shape, W, H, b.y0), hsSideAt(d.shape, W, H, b.y1));
    if (b.y0 < top + clear - 0.05 || b.y1 > H - clear - (mirC ? top : 0) + 0.05 || b.x0 < side + clear - 0.05 || b.x1 > W - side - clear + 0.05) {
      out.push({ id: l.id, kind: 'edge', text: l.name + ' sits a little close to the ' + (hasBorder ? 'border' : 'edge') + ' (carvers like at least ' + hsIn(clear) + ').' });
    }
    if (l.type === 'text' && l.ht < 0.749 && l.carve !== 'laser') out.push({ id: l.id, kind: 'size', text: l.name + ' letters are a little small to carve crisply (under ¾″).' });
    if (l.type === 'symbol' && l.size < 1.5 && l.carve !== 'laser') out.push({ id: l.id, kind: 'size', text: l.name + ' is a little small to keep its fine lines (under 1½″).' });
    if (l.carve === 'laser' && !m.laserOk) out.push({ id: l.id, kind: 'material', text: 'Laser etching on ' + m.label + ' barely shows. Use Jet Black or Blue Pearl, or change ' + l.name + '.' });
  });
  for (var i = 0; i < items.length; i++) {
    for (var j = i + 1; j < items.length; j++) {
      var a = hsBox(items[i]), c = hsBox(items[j]);
      if (Math.min(a.x1, c.x1) - Math.max(a.x0, c.x0) > 0.1 && Math.min(a.y1, c.y1) - Math.max(a.y0, c.y0) > 0.1) {
        out.push({ id: items[j].id, kind: 'overlap', text: items[i].name + ' and ' + items[j].name + ' are touching.' });
      }
    }
  }
  return out;
}

function hsQuoteSel(p) {
  if (Array.isArray(p.quoteIdxs)) return p.quoteIdxs.slice();
  return p.quoteIdx >= 0 ? [p.quoteIdx] : [];
}
/* What the family asked for that didn't make it onto the stone at this size. */
function hsLeftOff(d, C) {
  var p = d.params, left = [], has = function (fn) { return d.layers.some(fn); };
  if (p.showRole && C.roleLine && !has(function (l) { return l.name === 'Tribute line'; })) left.push('the tribute line');
  var qs = hsQuoteSel(p).filter(function (k) { return !!C.quotes[k]; }), missingQ = 0;
  qs.forEach(function (k, i) { var nm = i === 0 ? 'Epitaph' : 'Epitaph ' + (i + 1); if (!has(function (l) { return l.name === nm; })) missingQ++; });
  if (missingQ) left.push(missingQ === 1 ? (qs.length > 1 ? 'one of the quotes' : 'the quote') : missingQ + ' of the quotes');
  if (p.sym2 && !has(function (l) { return l.type === 'symbol' && l.sym === p.sym2; })) left.push('the second symbol');
  if (p.sym1 && !(p.photo && (p.photoPlace === 'top' || d.shape === 'heart' || d.shape === 'dheart' || d.shape === 'teardrop') && p.layout === 'classic') && !has(function (l) { return l.type === 'symbol' && l.sym === p.sym1; })) left.push('the main symbol');
  return left;
}
var HS_SIZE_LIMITS = { upright: [28, 60, 16, 36], slant: [20, 40, 10, 24], bevel: [16, 36, 8, 20], pillow: [16, 36, 8, 20], grass: [16, 36, 8, 20] };
function hsClampSize(d, W, H) {
  var lim = HS_SIZE_LIMITS[d.type] || [14, 72, 8, 48];
  return [Math.max(lim[0], Math.min(lim[1], W)), Math.max(lim[2], Math.min(lim[3], H))];
}
/* The smallest step up in size where everything they asked for fits. */
function hsFitSuggest(d, C) {
  if (!hsLayerStatus(d).red) return null;
  var lim = HS_SIZE_LIMITS[d.type] || [14, 72, 8, 48], hStep = d.type === 'upright' ? 2 : 1;
  for (var s = 1; s <= 14; s++) {
    var sz = hsClampSize(d, d.W + 2 * s, d.H + hStep * Math.ceil(s / 2));
    var d2 = Object.assign({}, d, { W: sz[0], H: sz[1] });
    if (d2.shape === 'heart' || d2.shape === 'dheart') d2.H = Math.max(d2.H, Math.round(d2.W * (d2.shape === 'heart' ? 0.8 : 0.7)));
    d2.layers = hsLayoutBest(d2, C);
    if (!hsLayerStatus(d2).red) return { W: d2.W, H: d2.H };
    if (sz[0] === lim[1] && sz[1] === lim[3]) break;
  }
  return null;
}
/* The smallest comfortable stone for everything they chose: lettering at full size, nothing cramped or snug,
   in proportions that suit the stone type. Tries candidates smallest-first and stops at the first perfect one. */
function hsBestSize(d, C) {
  var lim = HS_SIZE_LIMITS[d.type] || [14, 72, 8, 48], hStep = d.type === 'upright' ? 2 : 1, cands = [];
  var heartR = d.shape === 'heart' ? 0.8 : d.shape === 'dheart' ? 0.7 : 0;
  for (var W = lim[0]; W <= lim[1]; W += 2) for (var H = lim[2]; H <= lim[3]; H += hStep) {
    if (heartR && H < Math.round(W * heartR)) continue;
    var r = W / H;
    if (!heartR && (r < 1.15 || r > 2.6)) continue;
    cands.push([W, H]);
  }
  cands.sort(function (a, b) { return a[0] * a[1] - b[0] * b[1] || a[1] - b[1]; });
  var best = null, bestK = Infinity;
  for (var i = 0; i < cands.length; i++) {
    var d2 = Object.assign({}, d, { W: cands[i][0], H: cands[i][1] });
    d2.layers = hsLayoutBest(d2, C);
    var st = hsLayerStatus(d2), sc = d.params.textSize ? 1 : (d2.fitScale || 1);
    var k = st.red * 1000 + st.yellow * 40 + (1 - sc) * 400 + cands[i][0] * cands[i][1] * 0.004;
    /* Comfortable, not just legal: the lettering should fill no more than about three quarters of the open face. */
    var y0 = Infinity, y1 = -Infinity, x0 = Infinity, x1 = -Infinity, cl = hsClear(d2);
    d2.layers.forEach(function (l) { var bx = l.visible && l.type !== 'border' ? hsBox(l) : null; if (bx) { y0 = Math.min(y0, bx.y0); y1 = Math.max(y1, bx.y1); x0 = Math.min(x0, bx.x0); x1 = Math.max(x1, bx.x1); } });
    var fillH = (d2.layers._natH || (y1 - y0)) / Math.max(1, cands[i][1] - 2 * cl), fillW = (x1 - x0) / Math.max(1, cands[i][0] - 2 * cl);
    var roomy = fillH <= 0.76 && fillW <= 0.86;
    k += (roomy ? 0 : 150) + Math.max(0, fillH - 0.76) * 300;
    if (!st.red && !st.yellow && sc >= 0.999 && roomy) return { W: cands[i][0], H: cands[i][1], perfect: true };
    if (k < bestK) { bestK = k; best = { W: cands[i][0], H: cands[i][1], perfect: false }; }
  }
  return best;
}
function hsApplyType(d, type) {
  var info = hsFind(HS_TYPES, type);
  d.type = info.id;
  if (info.id === d.genType) { d.W = d.genW; d.H = d.genH; }
  else if (info.id === 'upright') { d.W = 40; d.H = 24; }
  else { d.W = info.W; d.H = info.H; }
  if (d.shape === 'heart' || d.shape === 'dheart') { d.H = Math.max(d.H, Math.round(d.W * (d.shape === 'heart' ? 0.8 : 0.7))); }
  d.base = info.baseH > 0 && !info.baseOff;
  hsLyingNorm(d);
}
/* Markers that lie on the ground are always a plain rectangle with straight, sawn edges, set on a base. */
function hsLyingNorm(d) {
  if (!hsIsLying(d)) return d;
  d.shape = 'flat';
  if (d.params) {
    var p = Object.assign({}, d.params);
    if (p.edges === 'rock') p.edges = 'smooth';
    if (p.layout === 'split' && p.layoutBefore) { p.layout = p.layoutBefore; delete p.layoutBefore; }
    d.params = p;
  }
  if (d.baseEdges === 'rock') d.baseEdges = 'smooth';
  return d;
}

function hsGenerate(form, photos, an, v) {
  var C = hsContentFrom(form, an, photos);
  photos = hsPhotoSet(form, photos);
  var phMain = photos.filter(function (x) { return (x.owner || 1) === 1; })[0] || photos[0] || null;
  /* A portrait they shared (or a spot saved for one) goes on every design. */
  var withPhoto = function (d) {
    if (!phMain || d.params.photo) return d;
    d.params = Object.assign({}, d.params, { photo: phMain.id, photoFinish: hsFind(HS_MATERIALS, d.material).laserOk ? 'laser' : 'porcelain' });
    d.layers = hsLayoutBest(d, C, true);
    return d;
  };
  var pf = an.prefs, carve = pf.carve;
  var letterCarve = carve === 'frost' ? 'vcut' : (carve || 'vcut');
  var symCarve = carve === 'gold' || carve === 'laser' || carve === 'relief' ? carve : 'frost';
  var pick = function (k) { return an.motifs.length ? an.motifs[(k + v) % an.motifs.length] : null; };
  var fromWords = function (m) { return !m ? '' : m.chosen ? ', as you chose' : m.words && m.words.length ? ', from “' + m.words.slice(0, 2).join('” and “') + '”' : ''; };
  var styleNote = pf.words.length ? ', following “' + pf.words.slice(0, 2).join('” and “') + '”' : '';
  var nq = C.quotes.length, used = [], designs = [];
  var mk = function (key, title, type, shape, material, W, H, params) {
    var info = hsFind(HS_TYPES, type);
    var d = { key: key, title: title, type: info.id, genType: info.id, shape: shape, material: material, W: W, H: H, base: info.baseH > 0 && !info.baseOff, params: params, why: [], manual: false };
    if (info.id !== 'upright') { d.W = info.W; d.H = info.H; }
    hsLyingNorm(d); shape = d.shape;
    if (shape === 'heart' || shape === 'dheart') d.H = Math.max(d.H, Math.round(d.W * (shape === 'heart' ? 0.8 : 0.7)));
    d.genW = d.W; d.genH = d.H;
    d.layers = hsLayoutBest(d, C, true);
    return d;
  };
  var typeNote = function (d) { return d.type === 'upright' ? '' : ' ' + hsFind(HS_TYPES, d.type).label.toLowerCase(); };

  var tributeOk = C.extraOk !== false, sugg = !!C.quotesSuggested;
  var s1 = an.faith || pick(0) || { sym: 'blossom', words: [] };
  used.push(s1.sym);
  /* Different kinds of stone across the three, unless they asked for one: a marker, a slant or upright, an upright. */
  var d1 = mk('traditional', 'Traditional family stone', pf.type || ['slant', 'upright', 'slant'][v % 3],
    hsFirstIn(pf.shapes, ['serp', 'gothic', 'flat', 'arch']) || ['serp', 'gothic', 'roof'][v % 3],
    pf.material || ['black', 'gray', 'mahogany'][v % 3], 42, 24,
    { layout: 'family', fonts: hsHas(pf.fonts, 'gothic') ? 'gothic' : 'roman', dateStyle: 'upper', quoteIdx: nq ? 0 : -1, showRole: tributeOk, sym1: s1.sym, sym2: '', border: ['single', 'double', 'single'][v % 3], carve: letterCarve, symCarve: symCarve, photo: '', photoPlace: 'left', photoFinish: 'laser' });
  var hdr = null;
  d1.layers.forEach(function (l) { if (!hdr && l.type === 'text') hdr = l; });
  d1.why = [
    hsSymLabel(s1.sym) + ' on both sides' + (fromWords(s1) || (an.faith || an.motifs.length ? '' : ', a quiet default with no theme given')),
    (C.np.surname ? 'Family name' : 'Name') + ' in ' + (hdr ? hsIn(hdr.ht) : '') + ' ' + hsFind(HS_FONTSETS, d1.params.fonts).label + ' letters across the top',
    nq ? (sugg ? 'A suggested epitaph, “' + C.quotes[0] + '”, since no words were shared' : 'Your first quote as the epitaph') : C.noWords ? 'Names and dates only, as you asked' : (an.roleLine ? '“' + an.roleLine + '” from the story' : 'No quote given, so the dates close the stone'),
    hsFind(HS_SHAPES, d1.shape).label + typeNote(d1) + ' in ' + hsFind(HS_MATERIALS, d1.material).label + styleNote
  ];
  designs.push(withPhoto(d1));

  var mA = pick(0) || an.faith || { sym: 'tree', words: [] };
  if (mA.sym === used[0] && an.motifs.length > 1) mA = pick(1);
  used.push(mA.sym);
  var mB = null;
  an.motifs.forEach(function (x) { if (!mB && x.sym !== mA.sym && x.sym !== used[0] && !(x.sym === 'heart' && mA.sym === 'hearts')) mB = x; });
  if (!mB && an.faith && an.faith.sym !== mA.sym) mB = an.faith;
  var hasPhoto = !!phMain;
  var shape2 = hsFirstIn(pf.shapes, ['heart', 'arch', 'gothic']) || ['arch', 'gothic', 'arch'][v % 3];
  /* The first grand design is carved in Blue Pearl, the most prized granite here; later rounds vary it. */
  var mat2 = pf.material || ['pearl', 'red', 'pearl', 'mahogany'][v % 4];
  var nature = an.motifs.some(function (x) { return ['blossom', 'tree', 'mountains', 'sunrise'].indexOf(x.sym) >= 0; });
  var d2 = mk('story', 'Their story', pf.type || 'upright', shape2, mat2, 38, 24,
    { layout: 'classic', fonts: hsHas(pf.fonts, 'gothic') ? 'gothic' : hsHas(pf.fonts, 'block') ? 'block' : 'script', dateStyle: 'long', quoteIdx: nq > 1 ? 1 : (nq ? 0 : -1), showRole: tributeOk, sym1: mA.sym, sym2: mB ? mB.sym : '', border: nature ? ['rope', 'beaded', 'rope'][v % 3] : ['beaded', 'single', 'beaded'][v % 3], carve: letterCarve, symCarve: symCarve, photo: hasPhoto ? phMain.id : '', photoPlace: shape2 === 'heart' ? 'top' : 'left', photoFinish: hsFind(HS_MATERIALS, mat2).laserOk ? 'laser' : 'porcelain' });
  var ph2 = null;
  d2.layers.forEach(function (l) { if (l.type === 'photo') ph2 = l; });
  var why2 = [
    tributeOk && an.roleLine ? '“' + an.roleLine + '”, written from the story' : tributeOk ? 'Opens with “In Loving Memory” in script' : C.noWords ? 'No quotes or extra words, as you asked' : 'Only your own words, with nothing added',
    hsSymLabel(mA.sym) + (fromWords(mA) || ' as a gentle default') + (mB ? ', with ' + hsSymLabel(mB.sym).toLowerCase() + ' below' : ''),
    ph2 ? (hsIsResvPhoto(ph2.photo) ? 'A space saved for the portrait you’ll add later' : 'Portrait ' + (ph2.carve === 'laser' ? 'laser-etched' : 'as a porcelain medallion') + ' from your photo') : 'Add a photo while refining to get a portrait version',
    nq ? (sugg ? 'A suggested line closes the stone' : (nq > 1 ? 'Your second quote' : 'Your quote') + ' closes the stone') : 'Dates in upper and lower case for a softer read'
  ];
  if (an.veteran) why2[3] = an.veteran + ' line from the story';
  d2.why = why2;
  designs.push(d2);

  var mC = null;
  for (var i = 0; i < an.motifs.length && !mC; i++) { var c = an.motifs[(i + v) % an.motifs.length]; if (used.indexOf(c.sym) < 0) mC = c; }
  if (!mC && an.faith && used.indexOf(an.faith.sym) < 0) mC = an.faith;
  if (!mC) { ['dove', 'star', 'sunrise', 'heart'].forEach(function (s) { if (!mC && used.indexOf(s) < 0) mC = { sym: s, words: [] }; }); }
  var mat3 = pf.material || ['gray', 'black', 'red'][v % 3];
  var dark3 = mat3 === 'black' || mat3 === 'pearl';
  var lc3 = carve && carve !== 'frost' ? carve : (dark3 ? 'gold' : 'vcut');
  var shortest = -1;
  C.quotes.forEach(function (q, k) { if (shortest < 0 || q.length < C.quotes[shortest].length) shortest = k; });
  var d3 = mk('modern', 'Clean & modern', pf.type || ['bevel', 'grass', 'pillow'][v % 3], 'flat', mat3, 44, 20,
    { layout: 'side', fonts: 'block', dateStyle: 'years', quoteIdx: nq > 2 ? 2 : shortest, showRole: false, sym1: mC.sym, sym2: '', border: 'none', carve: lc3, symCarve: carve === 'gold' ? 'gold' : 'frost', photo: '', photoPlace: 'left', photoFinish: 'laser' });
  d3.base = d3.type === 'upright' ? v % 2 === 0 : d3.base;
  d3.why = [
    'Years only, set wide in block capitals',
    hsSymLabel(mC.sym) + ' as a large panel mark' + fromWords(mC),
    (lc3 === 'gold' ? 'Gold-leaf lettering on ' : lc3 === 'laser' ? 'Laser-etched lettering on ' : 'V-cut lettering on ') + hsFind(HS_MATERIALS, mat3).label + typeNote(d3),
    nq ? (sugg ? 'A short suggested line' : (nq > 2 ? 'Your third quote' : 'Your shortest quote')) + ' in two lines at most' : 'Open stone with no border, for a quiet modern read'
  ];
  designs.push(withPhoto(d3));

  /* Three clearly different levels: a simple stone, a classic middle ground, and a grand version with a larger
     stone, a taller base and flower vases, so the choices never feel alike. */
  var vaseKind = function (d) { return hsFind(HS_MATERIALS, d.material).laserOk ? 'granite' : 'aluminum'; };
  var matLine = function (d) { return hsFind(HS_SHAPES, d.shape).label + typeNote(d) + ' in ' + hsFind(HS_MATERIALS, d.material).label; };
  var qShort = function (q) { return '“' + hsTrunc(q, 48) + '”'; };
  /* Simple: on the ground, with just one quote or one mark. */
  d3.tier = 'simple';
  var sQ = nq ? (shortest >= 0 ? shortest : 0) : -1;
  d3.params = Object.assign({}, d3.params, { sym1: nq ? '' : d3.params.sym1, quoteIdx: sQ, quoteIdxs: sQ >= 0 ? [sQ] : [], photo: '', showRole: false });
  d3.layers = hsLayoutBest(d3, C, true);
  d3.why = ['Simple and understated, set close to the ground',
    nq ? (sugg ? 'One suggested line, ' : 'One quote, ') + qShort(C.quotes[sQ]) : hsSymLabel(d3.params.sym1) + ' as its only mark',
    'Years only, set wide in block capitals', matLine(d3)];
  /* Classic: one quote, with a single mark or their portrait, and one vase. */
  d1.tier = 'classic';
  var cPh = !!d1.params.photo;
  d1.params = Object.assign({}, d1.params, { layout: 'classic', sym2: '', quoteIdx: nq ? 0 : -1, quoteIdxs: nq ? [0] : [], photoPlace: cPh ? 'top' : d1.params.photoPlace });
  d1.vase = { kind: v % 2 ? 'granite' : 'aluminum', spots: hsIsLying(d1) ? ['front'] : ['right'], pos: hsIsLying(d1) ? 'back' : null, size: 5 };
  d1.layers = hsLayoutBest(d1, C, true);
  d1.why = ['A classic middle ground, with a single flower vase ' + (hsIsLying(d1) ? 'at its head' : 'on the base beside it'),
    cPh ? (hsIsResvPhoto(d1.params.photo) ? 'A space for their portrait above the name' : 'Their portrait above the name') : hsSymLabel(d1.params.sym1) + ' above the name' + fromWords(s1),
    nq ? (sugg ? 'A suggested line, ' : 'Your quote, ') + qShort(C.quotes[0]) : 'No quote given, so the dates close the stone', matLine(d1)];
  /* Grand: a larger stone on a taller base, symmetrical marks, every quote, their portrait and two vases. */
  d2.tier = 'grand';
  if (!hsIsLying(d2)) {
    var gW = Math.max(d2.W + 6, 44), gH = Math.max(d2.H + 6, 30), gsz = hsClampSize(d2, gW, gH);
    d2.W = gsz[0]; d2.H = gsz[1]; d2.genW = d2.W; d2.genH = d2.H;
    if (d2.base) { d2.baseOver = 4; d2.baseHt = 8; }
  }
  var gQ = C.quotes.map(function (q, k) { return k; }).slice(0, 3), gPh = !!d2.params.photo;
  d2.params = Object.assign({}, d2.params, { layout: 'family', sym1: d2.params.sym1 || s1.sym, quoteIdx: gQ.length ? gQ[0] : -1, quoteIdxs: gQ, photoPlace: gPh ? 'top' : d2.params.photoPlace, textSize: hsIsLying(d2) ? d2.params.textSize : 1.1 });
  d2.vase = { kind: v % 2 ? 'aluminum' : 'granite', spots: ['left', 'right'], pos: hsIsLying(d2) ? 'back' : null, size: 6 };
  d2.layers = hsLayoutBest(d2, C, true);
  d2.why = ['The grand option: a larger stone on a taller base, with a flower vase at each side',
    hsSymLabel(d2.params.sym1) + ' on both sides of the family name' + (gPh ? ', with ' + (hsIsResvPhoto(d2.params.photo) ? 'a space for their portrait' : 'their portrait') + ' above' : ''),
    gQ.length > 1 ? 'All ' + gQ.length + ' of ' + (sugg ? 'the suggested lines' : 'your quotes') : gQ.length ? (sugg ? 'A suggested line' : 'Your quote') + ' as the epitaph' : 'Names and dates, set generously', matLine(d2)];
  designs.length = 0; designs.push(d3, d1, d2);

  if (form.who === 'two' && String(form.name2 || '').trim()) hsPairDesigns(designs, form, photos, an, v, C);
  hsApplyPrefs(designs, form, C);
  designs.forEach(function (d) {
    if (hsIsLying(d) && (d.shape !== 'flat' || (d.params && d.params.edges === 'rock'))) { hsLyingNorm(d); d.layers = hsLayoutBest(d, C, true); }
    d.id = d.key + '-' + v;
  });
  return designs;
}

/* Two people. A shared companion stone gives each person their own side, with a symbol drawn from their own
   story; matching stones keep one design and carve it twice, once for each of them. */
function hsPairForm(form) { return Object.assign({}, form, { name: form.name2, born: form.born2, passed: form.passed2, passedLater: form.passedLater2, story: form.story2 || '' }); }
function hsPairDesigns(designs, form, photos, an, v, C) {
  var f1 = hsNameParts(form.name).first || 'them', f2 = hsNameParts(form.name2).first || 'them';
  if (form.pair === 'matching') {
    var mp2 = (photos || []).filter(function (x) { return x.owner === 2; })[0];
    designs.forEach(function (d) { if (d.params.photo && mp2) d.params = Object.assign({}, d.params, { photo2: mp2.id }); d.why = [('A matching pair: the same design carved for ' + f1 + ' and for ' + f2 + '. Switch between them any time.')].concat(d.why.slice(0, 3)); });
    return;
  }
  /* Each side's symbol comes from that person's own story alone, not the shared quotes or style notes. */
  var only = function (f) { return hsAnalyze(Object.assign({}, f, { quotes: [], theme: '', faith: 'none' })); };
  var a1 = only(form), a2 = only(hsPairForm(form));
  var own1 = a1.motifs[0] || an.faith || an.motifs[0] || { sym: 'blossom', words: [] };
  var blend = an.faith || an.motifs[0] || own1;
  var own2 = a2.motifs.filter(function (m) { return m.sym !== own1.sym; })[0] || a2.motifs[0] || own1;
  var words = function (m) { return m && m.words && m.words.length ? ' (“' + m.words.slice(0, 2).join('”, “') + '”)' : ''; };
  var looks = [['Side by side', designs[0].shape === 'flat' ? 'serp' : designs[0].shape, 54, 24], ['Two hearts, one stone', 'dheart', 48, 34], ['An open book', 'book', 52, 24]];
  designs.forEach(function (d, i) {
    var lk = looks[i] || looks[0];
    d.title = lk[0]; d.shape = lk[1];
    d.type = 'upright'; d.genType = 'upright'; d.base = true;
    d.W = lk[2]; d.H = lk[3]; d.genW = d.W; d.genH = d.H;
    var ph1 = (photos || []).filter(function (x) { return (x.owner || 1) === 1; })[0], ph2 = (photos || []).filter(function (x) { return x.owner === 2; })[0];
    var withPh = !!(ph1 || ph2);
    d.params = Object.assign({}, d.params, { layout: 'split', storyMode: 'own', sym1: own1.sym, sym2: own2.sym, symBlend: blend.sym, photo: withPh && ph1 ? ph1.id : '', photo2: withPh && ph2 ? ph2.id : '', showRole: false });
    d.layers = hsLayoutBest(d, C, true);
    d.why = [
      'A companion stone for ' + f1 + ' and ' + f2 + ', each with a side of their own',
      hsSymLabel(own1.sym) + ' for ' + f1 + words(own1) + ', ' + hsSymLabel(own2.sym).toLowerCase() + ' for ' + f2 + words(own2),
      withPh ? (ph1 && ph2 ? 'Each of their portraits on their own side' : 'The portrait sits on ' + (ph1 ? f1 : f2) + '’s side') : C.quotes.length ? 'Your quote set beneath, shared by them both' : 'Both names carved at the same size, so neither reads as secondary',
      hsFind(HS_SHAPES, d.shape).label + ' in ' + hsFind(HS_MATERIALS, d.material).label
    ];
  });
}

function hsSceneFor(an) {
  var top = an.motifs.length ? an.motifs[0].sym : '';
  var has = function (w) { return an.found.indexOf(w) >= 0; };
  if (top === 'anchor') return 'sea';
  if (top === 'mountains') return has('lake') || has('lakeside') ? 'lake' : 'mountains';
  if (top === 'blossom') return 'garden';
  if (an.faith && !an.motifs.length) return 'church';
  if (has('lake') || has('lakeside')) return 'lake';
  return 'meadow';
}
function hsSceneWhy(id, an, manual) {
  var sc = HS_SCENES[id] || HS_SCENES.meadow;
  if (manual) return 'Shown ' + sc.phrase + '.';
  var words = [];
  var match = { garden: 'blossom', mountains: 'mountains', lake: 'mountains', sea: 'anchor', meadow: 'tree' }[id];
  an.motifs.forEach(function (m) { if (m.sym === match) words = m.words.slice(0, 2); });
  if (id === 'lake' && words.indexOf('lake') < 0) words = ['lake'].concat(words).slice(0, 2);
  if (id === 'church' && an.faith && an.faith.words.length) words = an.faith.words.slice(0, 2);
  return 'We imagined it ' + sc.phrase + (words.length ? ', because you told us about “' + words.join('” and “') + '”' : '') + '. A gentle place to visit and remember.';
}

var HS_EYE_OPEN = 'M2 12 C5 6.5 8.5 4.5 12 4.5 C15.5 4.5 19 6.5 22 12 C19 17.5 15.5 19.5 12 19.5 C8.5 19.5 5 17.5 2 12 Z M15 12 A3 3 0 1 1 9 12 A3 3 0 1 1 15 12 Z';
var HS_EYE_SHUT = 'M3 3 L21 21 M10.6 5.6 C11 5.5 11.5 4.5 12 4.5 C15.5 4.5 19 6.5 22 12 C21.2 13.5 20.3 14.7 19.3 15.7 M6.6 6.8 C4.8 8 3.3 9.8 2 12 C5 17.5 8.5 19.5 12 19.5 C13.8 19.5 15.6 19 17.3 17.8';

var HS_SAMPLE = {
  name: 'Margaret Anne Whitfield', born: '1941-04-12', passed: '2024-06-03',
  /* The demo has no real photo, so it saves a spot for one, to show how a portrait sits in the designs. */
  photoLater: true,
  quotes: ['She tended her garden and her family with the same patient love', 'Until we meet again'],
  theme: 'Classic and timeless, something with roses',
  story: 'Margaret was a mother of three and a grandmother of seven. She spent every spring in her rose garden and every summer at the family cabin by the lake in the mountains. She sang in the church choir for forty years and never missed a Sunday.',
  faith: 'christian', faithOther: ''
};
