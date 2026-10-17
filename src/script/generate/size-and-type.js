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

