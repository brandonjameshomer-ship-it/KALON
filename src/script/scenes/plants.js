/* A plant that bends in the breeze from its roots: its own tiny layer, skewed from the base. */
function hsPlant(x, y, w, h, parts, dur, anim) {
  var phase = (x / 1440) * 2.6;
  return { left: hsP(x - w / 2), top: hsP(y - h), w: hsP(w), h: hsP(h + 2), dur: dur, delay: hsP(-(dur * 2 - phase)), anim: anim || 'hsBreeze',
    d0: parts.d0 || 'M0 0', d1: parts.d1 || 'M0 0', d2: parts.d2 || 'M0 0', fl: parts.fl || 'M0 0', fc: parts.fc || 'M0 0',
    c0: parts.c0, c1: parts.c1, c2: parts.c2, flC: parts.flC || '#ffffff', fcC: parts.fcC || '#e9c46a' };
}
function hsClump(rng, x, y, hMax, nBl, flowerChance, flowerCols, cols) {
  var w = Math.max(30, hMax * 1.5), h = hMax * 1.35 + 10, bx0 = w / 2, by = h;
  var d = ['', '', ''], fl = '', fc = '';
  for (var i = 0; i < nBl; i++) {
    var bx = bx0 + (rng() - 0.5) * w * 0.55, bh = hMax * (0.5 + rng() * 0.5), lean = (rng() - 0.35) * bh * 0.55, bw = 1.3 + rng() * 1.5 + hMax * 0.03;
    d[i % 3] += 'M' + hsP(bx - bw) + ' ' + by + ' Q' + hsP(bx - bw * 0.3 + lean * 0.35) + ' ' + hsP(by - bh * 0.55) + ' ' + hsP(bx + lean) + ' ' + hsP(by - bh) +
      ' Q' + hsP(bx + bw * 0.4 + lean * 0.45) + ' ' + hsP(by - bh * 0.5) + ' ' + hsP(bx + bw) + ' ' + by + ' Z ';
  }
  var col = flowerCols[Math.floor(rng() * flowerCols.length)];
  if (rng() < flowerChance) {
    var fx = bx0 + (rng() - 0.5) * w * 0.3, fh = hMax * (0.95 + rng() * 0.3), fr = 2.2 + hMax * 0.09, lean2 = (rng() - 0.4) * 5;
    d[0] += 'M' + hsP(fx - 0.8) + ' ' + by + ' Q' + hsP(fx + lean2 * 0.4) + ' ' + hsP(by - fh * 0.5) + ' ' + hsP(fx + lean2) + ' ' + hsP(by - fh) + ' L' + hsP(fx + lean2 + 1) + ' ' + hsP(by - fh) + ' Q' + hsP(fx + lean2 * 0.4 + 1) + ' ' + hsP(by - fh * 0.5) + ' ' + hsP(fx + 0.8) + ' ' + by + ' Z ';
    fl = hsFlowerD(rng, fx + lean2 + 0.5, by - fh, fr); fc = hsCirc(fx + lean2 + 0.5, by - fh, fr * 0.3);
  }
  return hsPlant(x, y, w, h, { d0: d[0], d1: d[1], d2: d[2], fl: fl, fc: fc, c0: cols[0], c1: cols[1], c2: cols[2], flC: col, fcC: '#e9c46a' }, 7);
}
function hsRoseBush(rng, x, y, s, cols) {
  var w = 70 * s, h = 52 * s, cx = w / 2, d0 = '', d1 = '', d2 = '', fl = '', fc = '';
  for (var i = 0; i < 30; i++) {
    var a = Math.PI + rng() * Math.PI, rr = Math.sqrt(rng()), px = cx + Math.cos(a) * w * 0.42 * rr, py = h - 3 * s + Math.sin(a) * h * 0.8 * rr;
    var dab = hsDab(px, py, (6 + rng() * 5) * s, (3.5 + rng() * 3) * s, rng() * 3.14);
    var tone = (px - cx) / w + (py - h * 0.5) / h + (rng() - 0.5) * 0.4;
    if (tone > 0.2) d0 += dab; else if (tone < -0.25) d2 += dab; else d1 += dab;
  }
  for (var j = 0; j < 7; j++) {
    var a2 = Math.PI * 1.08 + rng() * Math.PI * 0.84, r2 = 0.35 + rng() * 0.6, rx = cx + Math.cos(a2) * w * 0.38 * r2, ry = h - 6 * s + Math.sin(a2) * h * 0.74 * r2, rs = (3.4 + rng() * 1.6) * s;
    fl += hsDab(rx, ry, rs, rs * 0.86, rng() * 3) + hsDab(rx - rs * 0.3, ry + rs * 0.3, rs * 0.7, rs * 0.5, 0.5);
    fc += hsDab(rx + rs * 0.15, ry - rs * 0.15, rs * 0.42, rs * 0.3, 2.2);
  }
  return hsPlant(x, y, w, h, { d0: d0, d1: d1, d2: d2, fl: fl, fc: fc, c0: cols[0], c1: cols[1], c2: cols[2], flC: cols[3], fcC: cols[4] }, 7, 'hsBreezeS');
}
function hsSunflower(rng, x, y, s, cols) {
  var w = 44 * s, h = 96 * s, cx = w / 2, d0 = '', d1 = '', fl = '';
  var tx = cx + (rng() - 0.3) * 6 * s, ty = 14 * s;
  d0 += 'M' + hsP(cx - 1.6 * s) + ' ' + hsP(h) + ' Q' + hsP(cx) + ' ' + hsP(h * 0.5) + ' ' + hsP(tx - 1.2 * s) + ' ' + hsP(ty) + ' L' + hsP(tx + 1.2 * s) + ' ' + hsP(ty) + ' Q' + hsP(cx + 2 * s) + ' ' + hsP(h * 0.5) + ' ' + hsP(cx + 1.6 * s) + ' ' + hsP(h) + ' Z ';
  d1 += hsDab(cx - 8 * s, h * 0.62, 9 * s, 3.6 * s, -0.5) + hsDab(cx + 8 * s, h * 0.45, 9 * s, 3.6 * s, 0.5);
  for (var i = 0; i < 12; i++) { var a = i / 12 * 6.2832; fl += hsDab(tx + Math.cos(a) * 8 * s, ty + Math.sin(a) * 8 * s, 5 * s, 2.2 * s, a); }
  return hsPlant(x, y, w, h, { d0: d0, d1: d1, d2: '', fl: fl, fc: hsCirc(tx, ty, 5.4 * s), c0: cols[0], c1: cols[1], c2: cols[1], flC: '#f0c24b', fcC: '#6b4a2e' }, 7, 'hsBreezeS');
}

