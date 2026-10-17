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

