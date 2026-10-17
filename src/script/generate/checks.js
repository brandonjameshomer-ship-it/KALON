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
