/* ---------- brush primitives ---------- */
function hsRidge(rng, base, waves, jit, step, bottom) {
  var yAt = function (x) { var y = base; waves.forEach(function (w) { y += w[0] * Math.sin(x / w[1] * 6.2832 + w[2]); }); return y; };
  var pts = [];
  for (var x = -30; x <= 1470; x += step) pts.push([x, yAt(x) + (rng() - 0.5) * jit]);
  var d = 'M-30 ' + bottom + ' L' + pts[0][0] + ' ' + hsP(pts[0][1]);
  for (var i = 1; i < pts.length - 1; i++) {
    var mx = (pts[i][0] + pts[i + 1][0]) / 2, my = (pts[i][1] + pts[i + 1][1]) / 2;
    d += ' Q' + pts[i][0] + ' ' + hsP(pts[i][1]) + ' ' + hsP(mx) + ' ' + hsP(my);
  }
  var lp = pts[pts.length - 1];
  return { d: d + ' L' + lp[0] + ' ' + hsP(lp[1]) + ' L1470 ' + bottom + ' Z', yAt: yAt };
}
function hsBrushD(rng, x, y, len, wid, ang) {
  var n = 7, top = [], bot = [], ca = Math.cos(ang), sa = Math.sin(ang), wob = rng() * 6;
  for (var i = 0; i <= n; i++) {
    var t = i / n, px = x + (t - 0.5) * len * ca, py = y + (t - 0.5) * len * sa + Math.sin(t * 3.1 + wob) * wid * 0.25;
    var w = wid * Math.pow(Math.sin(Math.PI * (0.04 + t * 0.92)), 0.8) * (0.75 + rng() * 0.5) / 2;
    top.push([px - sa * w, py + ca * w]); bot.push([px + sa * w, py - ca * w]);
  }
  var pts = top.concat(bot.reverse()), d = 'M' + hsP(pts[0][0]) + ' ' + hsP(pts[0][1]);
  for (var k = 1; k < pts.length; k++) d += ' L' + hsP(pts[k][0]) + ' ' + hsP(pts[k][1]);
  return d + ' Z ';
}
function hsRim(rng, yAt, x0, x1, n, wid, off) {
  var d = '';
  for (var i = 0; i < n; i++) {
    var x = x0 + rng() * (x1 - x0), a = Math.atan2(yAt(x + 12) - yAt(x - 12), 24);
    d += hsBrushD(rng, x, yAt(x) + off + rng() * 4, 50 + rng() * 90, wid * (0.6 + rng() * 0.6), a);
  }
  return d;
}
function hsDab(cx, cy, rx, ry, rot) {
  var c = Math.cos(rot), s = Math.sin(rot), deg = hsP(rot * 57.2958);
  var x1 = hsP(cx - rx * c), y1 = hsP(cy - rx * s), x2 = hsP(cx + rx * c), y2 = hsP(cy + rx * s);
  return 'M' + x1 + ' ' + y1 + ' A' + hsP(rx) + ' ' + hsP(ry) + ' ' + deg + ' 1 0 ' + x2 + ' ' + y2 + ' A' + hsP(rx) + ' ' + hsP(ry) + ' ' + deg + ' 1 0 ' + x1 + ' ' + y1 + ' Z ';
}
function hsFlowerD(rng, x, y, r) {
  var d = '', a0 = rng() * 6.28;
  for (var i = 0; i < 5; i++) { var a = a0 + i * 1.2566; d += hsDab(x + Math.cos(a) * r * 0.7, y + Math.sin(a) * r * 0.56, r * 0.62, r * 0.38, a); }
  return d;
}
function hsBlobD(rng, cx, cy, r, n, sy) {
  var pts = []; sy = sy || 1;
  for (var i = 0; i < n; i++) { var a = i / n * 6.2832, rr = r * (0.86 + rng() * 0.24); pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * sy]); }
  var d = 'M' + hsP((pts[0][0] + pts[1][0]) / 2) + ' ' + hsP((pts[0][1] + pts[1][1]) / 2);
  for (var k = 1; k <= n; k++) { var p = pts[k % n], q = pts[(k + 1) % n]; d += ' Q' + hsP(p[0]) + ' ' + hsP(p[1]) + ' ' + hsP((p[0] + q[0]) / 2) + ' ' + hsP((p[1] + q[1]) / 2); }
  return d + ' Z ';
}
function hsJag(rng, peaks, jit, bottom, keep) {
  var pts = [];
  for (var i = 0; i < peaks.length - 1; i++) {
    var a = peaks[i], b = peaks[i + 1];
    for (var k = 0; k < 4; k++) { var t = k / 4; pts.push([a[0] + (b[0] - a[0]) * t + (k ? (rng() - 0.5) * jit : 0), a[1] + (b[1] - a[1]) * t + (k ? (rng() - 0.5) * jit : 0)]); }
  }
  pts.push(peaks[peaks.length - 1]);
  var d = 'M' + pts[0][0] + ' ' + bottom;
  pts.forEach(function (p) { d += ' L' + hsP(p[0]) + ' ' + hsP(p[1]); });
  if (keep) keep.pts = pts;
  return d + ' L' + pts[pts.length - 1][0] + ' ' + bottom + ' Z';
}
function hsLimb(x0, y0, x1, y1, w0, w1, bend) {
  var dx = x1 - x0, dy = y1 - y0, L = Math.sqrt(dx * dx + dy * dy) || 1, nx = -dy / L, ny = dx / L;
  var mx = (x0 + x1) / 2 + nx * bend, my = (y0 + y1) / 2 + ny * bend, wm = (w0 + w1) / 4;
  return 'M' + hsP(x0 + nx * w0 / 2) + ' ' + hsP(y0 + ny * w0 / 2) + ' Q' + hsP(mx + nx * wm) + ' ' + hsP(my + ny * wm) + ' ' + hsP(x1 + nx * w1 / 2) + ' ' + hsP(y1 + ny * w1 / 2) +
    ' L' + hsP(x1 - nx * w1 / 2) + ' ' + hsP(y1 - ny * w1 / 2) + ' Q' + hsP(mx - nx * wm) + ' ' + hsP(my - ny * wm) + ' ' + hsP(x0 - nx * w0 / 2) + ' ' + hsP(y0 - ny * w0 / 2) + ' Z ';
}
/* A bare winter tree: branching limbs with snow resting on the upper sides. */
function hsBareTree(rng) {
  var wood = '', snow = '';
  var grow = function (x, y, ang, len, wid, depth) {
    var ex = x + Math.cos(ang) * len, ey = y + Math.sin(ang) * len, w1 = Math.max(1, wid * 0.66), bend = (rng() - 0.5) * len * 0.18;
    wood += hsLimb(x, y, ex, ey, wid, w1, bend);
    if (depth <= 3 && Math.abs(Math.cos(ang)) > 0.25) snow += hsDab((x + ex) / 2, (y + ey) / 2 - wid * 0.55, len * 0.32, Math.max(1.4, wid * 0.42), ang);
    if (depth > 0) {
      var n = depth > 2 ? 2 : 2 + (rng() < 0.4 ? 1 : 0);
      for (var i = 0; i < n; i++) {
        var spread = (i - (n - 1) / 2) * (0.5 + rng() * 0.25) + (rng() - 0.5) * 0.2;
        grow(ex, ey, ang + spread, len * (0.68 + rng() * 0.12), w1, depth - 1);
      }
    }
  };
  grow(176, 244, -1.6 + (rng() - 0.5) * 0.1, 64, 12, 4);
  grow(170, 286, -2.35 + (rng() - 0.5) * 0.15, 74, 9, 3);
  grow(184, 270, -0.78 + (rng() - 0.5) * 0.15, 76, 9, 3);
  grow(174, 330, -2.7, 46, 6, 2);
  return { wood: wood, snow: snow };
}
function hsRectD(x0, y0, x1, y1) { return 'M' + hsP(x0) + ' ' + hsP(y0) + ' H' + hsP(x1) + ' V' + hsP(y1) + ' H' + hsP(x0) + ' Z '; }

