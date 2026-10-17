/* Flat markers: the bottom edge can mirror the top profile. */
var HS_MIRRORABLE = ['flat', 'serp', 'arch', 'roof', 'gothic', 'teardrop'];
/* Where the lettering sits in its free room: markers read best centered, standing stones read best near the top. */
function hsDefaultVAlign(d) { return d.type === 'grass' || d.type === 'bevel' || d.type === 'pillow' ? 50 : 0; }
function hsVAlign(d) { var v = d.params && d.params.vAlign; return typeof v === 'number' ? v : hsDefaultVAlign(d); }
function hsMirrorOn(d) {
  var lying = d.type === 'grass' || d.type === 'bevel' || d.type === 'pillow';
  return lying && HS_MIRRORABLE.indexOf(d.shape) >= 0 && !(d.params && d.params.mirror === false);
}
function hsStoneFor(d, W, H) { return hsMirrorOn(d) ? hsStonePathMirror(d.shape, W, H) : hsStonePath(d.shape, W, H, hsIsLying(d)); }
function hsStonePathMirror(shape, W, H) {
  var f = function (n) { return hsR(n, 3); }, m = 0.62, T = function (t) { return f(H * m * t); }, B = function (t) { return f(H - H * m * t); }, X = function (t) { return f(W * t); };
  if (shape === 'flat') {
    var r = f(Math.min(W, H) * 0.03);
    return 'M0 ' + r + ' Q0 0 ' + r + ' 0 H' + f(W - r) + ' Q' + W + ' 0 ' + W + ' ' + r + ' V' + f(H - r) + ' Q' + W + ' ' + H + ' ' + f(W - r) + ' ' + H + ' H' + r + ' Q0 ' + H + ' 0 ' + f(H - r) + ' Z';
  }
  if (shape === 'arch') return 'M0 ' + T(0.28) + ' A' + X(0.5) + ' ' + T(0.28) + ' 0 0 1 ' + W + ' ' + T(0.28) + ' V' + B(0.28) + ' A' + X(0.5) + ' ' + T(0.28) + ' 0 0 1 0 ' + B(0.28) + ' Z';
  if (shape === 'roof') return 'M0 ' + T(0.18) + ' L' + X(0.5) + ' 0 L' + W + ' ' + T(0.18) + ' V' + B(0.18) + ' L' + X(0.5) + ' ' + H + ' L0 ' + B(0.18) + ' Z';
  if (shape === 'gothic') return 'M0 ' + T(0.34) + ' Q' + X(0.22) + ' ' + T(0.1) + ' ' + X(0.5) + ' 0 Q' + X(0.78) + ' ' + T(0.1) + ' ' + W + ' ' + T(0.34) + ' V' + B(0.34) + ' Q' + X(0.78) + ' ' + B(0.1) + ' ' + X(0.5) + ' ' + H + ' Q' + X(0.22) + ' ' + B(0.1) + ' 0 ' + B(0.34) + ' Z';
  if (shape === 'teardrop') return 'M0 ' + T(0.55) + ' C0 ' + T(0.25) + ' ' + X(0.3) + ' ' + T(0.12) + ' ' + X(0.5) + ' 0 C' + X(0.7) + ' ' + T(0.12) + ' ' + W + ' ' + T(0.25) + ' ' + W + ' ' + T(0.55) + ' V' + B(0.55) + ' C' + W + ' ' + B(0.25) + ' ' + X(0.7) + ' ' + B(0.12) + ' ' + X(0.5) + ' ' + H + ' C' + X(0.3) + ' ' + B(0.12) + ' 0 ' + B(0.25) + ' 0 ' + B(0.55) + ' Z';
  var sh = T(0.08), sq = T(0.17), bh = B(0.08), bq = B(0.17);
  return 'M0 ' + sq + ' Q0 ' + sh + ' ' + X(0.05) + ' ' + sh + ' C' + X(0.22) + ' ' + sh + ' ' + X(0.3) + ' 0 ' + X(0.5) + ' 0 C' + X(0.7) + ' 0 ' + X(0.78) + ' ' + sh + ' ' + X(0.95) + ' ' + sh + ' Q' + W + ' ' + sh + ' ' + W + ' ' + sq +
    ' V' + bq + ' Q' + W + ' ' + bh + ' ' + X(0.95) + ' ' + bh + ' C' + X(0.78) + ' ' + bh + ' ' + X(0.7) + ' ' + H + ' ' + X(0.5) + ' ' + H + ' C' + X(0.3) + ' ' + H + ' ' + X(0.22) + ' ' + bh + ' ' + X(0.05) + ' ' + bh + ' Q0 ' + bh + ' 0 ' + bq + ' Z';
}
/* Free-form tops, shared by the drawing and the lettering layout so they always agree. u runs 0 to 1 across the stone. */
function hsFreeTop(shape, u, H) {
  var ss = function (a) { a = Math.max(0, Math.min(1, a)); return a * a * (3 - 2 * a); };
  if (shape === 'wave') return u < 0.68 ? H * 0.36 * (1 - ss(u / 0.68)) + H * 0.02 * Math.sin(u * 9) * (1 - u) : H * 0.14 * ss((u - 0.68) / 0.32);
  if (shape === 'mountain') {
    var pk = function (p, a, k) { var dd = Math.abs(u - p); return a + k * Math.pow(dd, 1.15); };
    return Math.min(H * 0.4, pk(0.36, 0, H * 1.05), pk(0.72, H * 0.1, H * 1.2), pk(0.12, H * 0.2, H * 1.3));
  }
  if (shape === 'hill') { var c = 0.42, w2 = u < c ? c : 1 - c; return H * 0.3 * Math.pow(Math.min(1, Math.abs(u - c) / w2), 1.8) + (u > c ? H * 0.04 * ss((u - c) / (1 - c)) : 0); }
  return 0;
}
function hsIsFree(shape) { return shape === 'wave' || shape === 'mountain' || shape === 'hill'; }
function hsTopAt(shape, W, H, x) {
  if (hsIsFree(shape)) return hsFreeTop(shape, Math.max(0, Math.min(1, x / W)), H);
  var t = Math.min(1, Math.abs(x - W / 2) / (W / 2));
  if (shape === 'flat') return 0.05;
  if (shape === 'arch') { var a = H * 0.28; return a * (1 - Math.sqrt(Math.max(0, 1 - t * t))); }
  if (shape === 'roof') return H * 0.18 * t;
  if (shape === 'gothic') return H * 0.34 * Math.pow(t, 1.4);
  if (shape === 'teardrop') return H * 0.55 * Math.pow(t, 1.25);
  if (shape === 'book') return t < 0.5 ? H * (0.02 + 0.1 * Math.pow(1 - t / 0.5, 2)) : H * (0.02 + 0.08 * Math.pow((t - 0.5) / 0.5, 2));
  if (shape === 'heart') return t < 0.44 ? H * 0.15 * Math.pow(1 - t / 0.44, 2) : H * 0.32 * Math.pow((t - 0.44) / 0.56, 2);
  if (shape === 'dheart') {
    var tt = Math.max(0, Math.min(1, x / W));
    if (tt < 0.2) return H * 0.34 * Math.pow((0.2 - tt) / 0.2, 2);
    if (tt > 0.8) return H * 0.34 * Math.pow((tt - 0.8) / 0.2, 2);
    var dd = Math.min(Math.abs(tt - 0.2), Math.abs(tt - 0.5), Math.abs(tt - 0.8));
    return H * 0.15 * Math.min(1, Math.pow(dd / 0.15, 2));
  }
  if (t < 0.9) { var u = t / 0.9; return H * 0.08 * (u * u * (3 - 2 * u)); }
  return H * 0.08 + (t - 0.9) / 0.1 * H * 0.09;
}
function hsSideAt(shape, W, H, y) {
  if (shape === 'heart' && y > H * 0.32) return Math.min(W * 0.42, (y - H * 0.32) / (H * 0.68) * W * 0.42);
  if (shape === 'dheart' && y > H * 0.34) return Math.min(W * 0.32, (y - H * 0.34) / (H * 0.66) * W * 0.32);
  return 0;
}
function hsMaxTop(shape, W, H, x0, x1) {
  var m = 0;
  for (var i = 0; i <= 8; i++) m = Math.max(m, hsTopAt(shape, W, H, x0 + (x1 - x0) * i / 8));
  return m;
}
function hsInsetTf(i, W, H) {
  return 'translate(' + hsR(i * K) + ' ' + hsR(i * K) + ') scale(' + hsR((W - 2 * i) / W, 4) + ' ' + hsR((H - 2 * i) / H, 4) + ')';
}
