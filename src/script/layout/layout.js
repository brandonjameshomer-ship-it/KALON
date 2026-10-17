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
