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
