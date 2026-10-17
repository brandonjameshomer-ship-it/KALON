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
