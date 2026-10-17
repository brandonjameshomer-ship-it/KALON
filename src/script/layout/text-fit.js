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

