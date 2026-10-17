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


