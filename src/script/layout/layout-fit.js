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

