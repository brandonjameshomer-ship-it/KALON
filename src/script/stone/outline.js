function hsStonePath(shape, W, H, pointed) {
  var f = function (n) { return hsR(n, 3); };
  if (hsIsFree(shape)) {
    var n = 48, pts = [], r0 = Math.min(W, H) * 0.03;
    for (var i = 0; i <= n; i++) { var u = i / n; pts.push([u * W, hsFreeTop(shape, u, H)]); }
    var dstr = 'M0 ' + f(H) + ' V' + f(pts[0][1] + r0);
    dstr += ' Q0 ' + f(pts[0][1]) + ' ' + f(r0) + ' ' + f(hsFreeTop(shape, r0 / W, H));
    for (var j = 1; j < n; j++) { var mx = (pts[j][0] + pts[j + 1][0]) / 2, my = (pts[j][1] + pts[j + 1][1]) / 2; dstr += ' Q' + f(pts[j][0]) + ' ' + f(pts[j][1]) + ' ' + f(mx) + ' ' + f(my); }
    dstr += ' Q' + f(W) + ' ' + f(pts[n][1]) + ' ' + f(W) + ' ' + f(pts[n][1] + r0) + ' V' + f(H) + ' Z';
    return dstr;
  }
  if (shape === 'flat') {
    var r = f(Math.min(W, H) * 0.03);
    return 'M0 ' + H + ' V' + r + ' Q0 0 ' + r + ' 0 H' + f(W - r) + ' Q' + W + ' 0 ' + W + ' ' + r + ' V' + H + ' Z';
  }
  if (shape === 'arch') {
    var a = f(H * 0.28);
    return 'M0 ' + H + ' V' + a + ' A' + f(W / 2) + ' ' + a + ' 0 0 1 ' + W + ' ' + a + ' V' + H + ' Z';
  }
  if (shape === 'roof') return 'M0 ' + H + ' V' + f(H * 0.18) + ' L' + f(W / 2) + ' 0 L' + W + ' ' + f(H * 0.18) + ' V' + H + ' Z';
  if (shape === 'gothic') {
    return 'M0 ' + H + ' V' + f(H * 0.34) + ' Q' + f(W * 0.22) + ' ' + f(H * 0.1) + ' ' + f(W / 2) + ' 0 Q' + f(W * 0.78) + ' ' + f(H * 0.1) + ' ' + W + ' ' + f(H * 0.34) + ' V' + H + ' Z';
  }
  if (shape === 'teardrop') {
    return 'M0 ' + H + ' V' + f(H * 0.55) + ' C0 ' + f(H * 0.25) + ' ' + f(W * 0.3) + ' ' + f(H * 0.12) + ' ' + f(W / 2) + ' 0 C' + f(W * 0.7) + ' ' + f(H * 0.12) + ' ' + W + ' ' + f(H * 0.25) + ' ' + W + ' ' + f(H * 0.55) + ' V' + H + ' Z';
  }
  if (shape === 'book') {
    return 'M0 ' + H + ' V' + f(H * 0.1) + ' C' + f(W * 0.08) + ' ' + f(H * 0.02) + ' ' + f(W * 0.18) + ' 0 ' + f(W * 0.25) + ' ' + f(H * 0.02) +
      ' C' + f(W * 0.34) + ' ' + f(H * 0.04) + ' ' + f(W * 0.44) + ' ' + f(H * 0.06) + ' ' + f(W / 2) + ' ' + f(H * 0.12) +
      ' C' + f(W * 0.56) + ' ' + f(H * 0.06) + ' ' + f(W * 0.66) + ' ' + f(H * 0.04) + ' ' + f(W * 0.75) + ' ' + f(H * 0.02) +
      ' C' + f(W * 0.82) + ' 0 ' + f(W * 0.92) + ' ' + f(H * 0.02) + ' ' + W + ' ' + f(H * 0.1) + ' V' + H + ' Z';
  }
  if (shape === 'heart') {
    /* Standing hearts need a flat foot to rest on their base; hearts lying flat keep a true point. */
    var hb = pointed ? 0.5 : 0.34, hb2 = pointed ? 0.5 : 0.66, hc = pointed ? 0.3 : 0.16, hc2 = pointed ? 0.7 : 0.84, hy = pointed ? 0.86 : 0.84;
    return 'M' + f(W * hb) + ' ' + H +
      ' C' + f(W * hc) + ' ' + f(H * hy) + ' 0 ' + f(H * 0.6) + ' 0 ' + f(H * 0.32) +
      ' C0 ' + f(H * 0.13) + ' ' + f(W * 0.13) + ' 0 ' + f(W * 0.28) + ' 0' +
      ' C' + f(W * 0.38) + ' 0 ' + f(W * 0.46) + ' ' + f(H * 0.05) + ' ' + f(W * 0.5) + ' ' + f(H * 0.15) +
      ' C' + f(W * 0.54) + ' ' + f(H * 0.05) + ' ' + f(W * 0.62) + ' 0 ' + f(W * 0.72) + ' 0' +
      ' C' + f(W * 0.87) + ' 0 ' + W + ' ' + f(H * 0.13) + ' ' + W + ' ' + f(H * 0.32) +
      ' C' + W + ' ' + f(H * 0.6) + ' ' + f(W * hc2) + ' ' + f(H * hy) + ' ' + f(W * hb2) + ' ' + H + ' Z';
  }
  if (shape === 'dheart') {
    var X = function (t) { return f(W * t); }, Y = function (t) { return f(H * t); };
    if (!pointed) {
      return 'M' + X(0.24) + ' ' + H +
        ' C' + X(0.1) + ' ' + Y(0.84) + ' 0 ' + Y(0.62) + ' 0 ' + Y(0.34) +
        ' C0 ' + Y(0.12) + ' ' + X(0.09) + ' 0 ' + X(0.2) + ' 0' +
        ' C' + X(0.28) + ' 0 ' + X(0.33) + ' ' + Y(0.06) + ' ' + X(0.35) + ' ' + Y(0.15) +
        ' C' + X(0.38) + ' ' + Y(0.05) + ' ' + X(0.44) + ' 0 ' + X(0.5) + ' 0' +
        ' C' + X(0.56) + ' 0 ' + X(0.62) + ' ' + Y(0.05) + ' ' + X(0.65) + ' ' + Y(0.15) +
        ' C' + X(0.67) + ' ' + Y(0.06) + ' ' + X(0.72) + ' 0 ' + X(0.8) + ' 0' +
        ' C' + X(0.91) + ' 0 ' + W + ' ' + Y(0.12) + ' ' + W + ' ' + Y(0.34) +
        ' C' + W + ' ' + Y(0.62) + ' ' + X(0.9) + ' ' + Y(0.84) + ' ' + X(0.76) + ' ' + H +
        /* two flat feet with the hearts' notch still rising between them */
        ' L' + X(0.61) + ' ' + H + ' C' + X(0.58) + ' ' + Y(0.93) + ' ' + X(0.53) + ' ' + Y(0.86) + ' ' + X(0.5) + ' ' + Y(0.8) +
        ' C' + X(0.47) + ' ' + Y(0.86) + ' ' + X(0.42) + ' ' + Y(0.93) + ' ' + X(0.39) + ' ' + H + ' Z';
    }
    return 'M' + X(0.32) + ' ' + H +
      ' C' + X(0.14) + ' ' + Y(0.82) + ' 0 ' + Y(0.6) + ' 0 ' + Y(0.34) +
      ' C0 ' + Y(0.12) + ' ' + X(0.09) + ' 0 ' + X(0.2) + ' 0' +
      ' C' + X(0.28) + ' 0 ' + X(0.33) + ' ' + Y(0.06) + ' ' + X(0.35) + ' ' + Y(0.15) +
      ' C' + X(0.38) + ' ' + Y(0.05) + ' ' + X(0.44) + ' 0 ' + X(0.5) + ' 0' +
      ' C' + X(0.56) + ' 0 ' + X(0.62) + ' ' + Y(0.05) + ' ' + X(0.65) + ' ' + Y(0.15) +
      ' C' + X(0.67) + ' ' + Y(0.06) + ' ' + X(0.72) + ' 0 ' + X(0.8) + ' 0' +
      ' C' + X(0.91) + ' 0 ' + W + ' ' + Y(0.12) + ' ' + W + ' ' + Y(0.34) +
      ' C' + W + ' ' + Y(0.6) + ' ' + X(0.86) + ' ' + Y(0.82) + ' ' + X(0.68) + ' ' + H +
      ' C' + X(0.6) + ' ' + Y(0.9) + ' ' + X(0.54) + ' ' + Y(0.84) + ' ' + X(0.5) + ' ' + Y(0.78) +
      ' C' + X(0.46) + ' ' + Y(0.84) + ' ' + X(0.4) + ' ' + Y(0.9) + ' ' + X(0.32) + ' ' + H + ' Z';
  }
  var sh = f(H * 0.08), sq = f(H * 0.17);
  return 'M0 ' + H + ' V' + sq + ' Q0 ' + sh + ' ' + f(W * 0.05) + ' ' + sh +
    ' C' + f(W * 0.22) + ' ' + sh + ' ' + f(W * 0.3) + ' 0 ' + f(W * 0.5) + ' 0' +
    ' C' + f(W * 0.7) + ' 0 ' + f(W * 0.78) + ' ' + sh + ' ' + f(W * 0.95) + ' ' + sh +
    ' Q' + W + ' ' + sh + ' ' + W + ' ' + sq + ' V' + H + ' Z';
}
