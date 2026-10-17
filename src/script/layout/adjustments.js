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
