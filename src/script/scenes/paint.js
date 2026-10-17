var HS_FLOWER_COLS = { pink: '#efc3cd', white: '#fbf6ea', yellow: '#f3d98a', lav: '#cdbfe0', gold: '#e8b85c', rust: '#d08a5a' };
var HS_PAINT_CACHE = {};
function green2(c) { return HS_SCENES.meadow.leaf3; }
function hsPaint(id, halfW, mo, footY, stoneX) {
  var keepIds = mo.keeps.map(function (k) { return k.id; }), has = function (k) { return keepIds.indexOf(k) >= 0; };
  var SG = footY || 660, SX = stoneX || 720;
  var key = [id, Math.round(halfW), Math.round(SG), SX, mo.tod, mo.season, mo.seed, mo.worship, mo.aurora ? 1 : 0, keepIds.join(',')].join(':');
  if (HS_PAINT_CACHE[key]) return HS_PAINT_CACHE[key];
  var sc = HS_SCENES[id] || HS_SCENES.meadow, c = hsPalette(sc, mo.tod, mo.season), rng = hsRng(mo.seed), G = 660, out = {}, i, x, y;
  var winter = mo.season === 'winter', mt = id === 'mountains' || id === 'lake', sea = id === 'sea', lake = id === 'lake', garden = id === 'garden', church = id === 'church', eve = mo.tod === 'evening', morn = mo.tod === 'morning', night = mo.tod === 'night';
  var nd = function (col, t) { return night ? hsMix(col, '#27324f', t == null ? 0.45 : t) : col; };
  var nearStone = function (xx, yy, pad) { return Math.abs(xx - SX) < halfW + pad && yy < SG + 40; };
  out.c = c;
  /* sky */
  out.sunX = hsP(night ? 1070 + rng() * 80 : eve ? 980 + rng() * 140 : morn ? 300 + rng() * 160 : 940 + rng() * 180);
  out.sunY = hsP(night ? 118 + rng() * 44 : eve ? 470 + rng() * 14 : morn ? 220 + rng() * 60 : 250 + rng() * 60);
  out.sunOp = night ? 0 : 1; out.nightDisp = night ? 'block' : 'none'; out.skyOp = night ? 0 : 0.12; out.skyWarmOp = night ? 0 : 0.22;
  var sk = '', skw = '';
  for (i = 0; i < 6; i++) sk += hsBrushD(rng, rng() * 1440, 60 + rng() * 260, 340 + rng() * 300, 22 + rng() * 22, (rng() - 0.5) * 0.04);
  for (i = 0; i < 5; i++) skw += hsBrushD(rng, out.sunX + (rng() - 0.5) * 600, out.sunY + (rng() - 0.3) * 110, 320 + rng() * 260, 18 + rng() * 18, (rng() - 0.5) * 0.04);
  out.skyD = sk; out.skyWarmD = skw;
  var st = '';
  if (eve) for (i = 0; i < (has('stars') ? 46 : 16); i++) { x = rng() * 1440; y = 20 + rng() * 250; st += hsCirc(x, y, 0.7 + rng() * (has('stars') ? 1.3 : 0.8)) + ' '; }
  out.starsD = st || 'M0 0';
  /* night sky: moon, twinkling stars, a faint milky way, northern lights */
  var sA = '', sB = '', sC = '', mw1 = '', mw2 = '', mw3 = '', mwDots = '', mwDust = '', crat = '', aur1 = '', aur2 = '';
  if (night) {
    for (i = 0; i < 150; i++) { x = rng() * 1440; y = rng() * 470; var sr = 0.5 + rng() * rng() * 1.6, sd = hsCirc(x, y, sr) + ' '; if (i % 3 === 0) sA += sd; else if (i % 3 === 1) sB += sd; else sC += sd; }
    /* milky way: a gently curving river of stars, thicker in a few places */
    var tn35 = Math.tan(35 * Math.PI / 180), ay = 600, by2 = -40, ax = 720 - (ay - 280) * tn35, bx2 = 720 + (280 - by2) * tn35, len = Math.sqrt((bx2 - ax) * (bx2 - ax) + (by2 - ay) * (by2 - ay)), ux = (bx2 - ax) / len, uy = (by2 - ay) / len, nx = -uy, ny = ux;
    var gauss = function () { return (rng() + rng() + rng() + rng() - 2) / 2; };
    var bow = 0, wph = 0;
    var spine = function (t) { return [ax + ux * len * t, ay + uy * len * t]; };
    var clumps = [];
    for (i = 0; i < 4; i++) clumps.push([0.12 + i * 0.24 + (rng() - 0.5) * 0.12, 0.05 + rng() * 0.05, 0.6 + rng() * 0.8]);
    var wAt = function (t) { var w = 0.3 + 0.75 * Math.exp(-Math.pow((t - 0.5) / 0.26, 2)); clumps.forEach(function (cl) { w += cl[2] * Math.exp(-Math.pow((t - cl[0]) / cl[1], 2)); }); return w; };
    var placed = 0, guard = 0;
    while (placed < 3200 && guard++ < 26000) {
      var t3 = rng(), w3 = wAt(t3); if (rng() * 1.6 > w3) continue;
      var sp = spine(t3), o3 = gauss() * (120 + 110 * Math.min(1.3, w3));
      mwDots += hsCirc(sp[0] + nx * o3, sp[1] + ny * o3, 0.3 + rng() * 0.45) + ' '; placed++;
      if (rng() < 0.08) mwDust += hsCirc(sp[0] + nx * o3 * 0.7, sp[1] + ny * o3 * 0.7, 0.7 + rng() * 0.5) + ' ';
    }
    var tang = Math.atan2(uy, ux) * 57.2958;
    out.mwG = clumps.concat([[0.5, 0.45, 0.9]]).map(function (cl) { var sp2 = spine(cl[0]), sp3 = spine(Math.min(1, cl[0] + 0.02)); return { cx: hsP(sp2[0]), cy: hsP(sp2[1]), rx: hsP(len * cl[1] * 1.6 + 60), ry: hsP(156 + 120 * Math.min(1, cl[2])), rot: hsP(Math.atan2(sp3[1] - sp2[1], sp3[0] - sp2[0]) * 57.2958) }; });
    var mx0 = out.sunX, my0 = out.sunY;
    [[-9, -6, 6], [8, 5, 7.5], [-4, 11, 4.5], [12, -9, 3.6], [-14, 6, 3]].forEach(function (c3) { crat += hsDab(mx0 + c3[0], my0 + c3[1], c3[2], c3[2] * 0.85, rng() * 3); });
    /* northern lights: soft painted ribbons, layered like the clouds, that breathe in and out */
    var aurR = [], starts = [462], depthOp = [1];
    for (var rv = 0; rv < starts.length; rv++) {
      var rbX0 = starts[rv] + rng() * 10, rbW = 560 + rng() * 60, hsc = 1 + rng() * 0.15;
      var bottomY = (mt ? 352 : 432) + (rng() - 0.5) * 36, rise = (rng() - 0.5) * 30;
      var fph = rng() * 6, fph2 = rng() * 6, bph = rng() * 6, kph = rng() * 6, pts = [];
      for (x = 0; x <= rbW; x += 6) {
        var tt5 = x / rbW, env5 = Math.pow(Math.sin(Math.PI * Math.min(1, tt5)), 0.4);
        var y05 = 170 - rise * tt5 + 10 * Math.sin(tt5 * 4.2 + bph) + 9 * Math.sin(tt5 * 13 + kph) + 4 * Math.sin(tt5 * 31 + fph);
        var h5 = (30 + 26 * (0.5 + 0.5 * Math.sin(tt5 * 23 + fph)) + 18 * (0.5 + 0.5 * Math.sin(tt5 * 57 + fph2))) * env5 * hsc;
        pts.push([x, y05, h5, tt5]);
      }
      var band = function (f0, f1, dy, jit, jph) {
        var bot = function (q) { return q[1] + dy + jit * Math.sin(q[3] * 19 + jph) + jit * 0.6 * Math.sin(q[3] * 47 + jph * 2) - q[2] * f1; };
        var d = 'M' + pts[0][0] + ' ' + hsP(pts[0][1] - pts[0][2] * f0 + dy);
        pts.forEach(function (q) { d += ' L' + q[0] + ' ' + hsP(q[1] - q[2] * f0 + dy); });
        pts.slice().reverse().forEach(function (q) { d += ' L' + q[0] + ' ' + hsP(Math.min(bot(q), q[1] - q[2] * f0 + dy + 40)); });
        return d + ' Z';
      };
      var strokes5 = '';
      for (i = 0; i < 10; i++) { var sx = rng() * rbW, si = Math.min(pts.length - 1, Math.round(sx / 6)), sq = pts[si]; if (sq[2] < 18) continue; strokes5 += hsBrushD(rng, sx, sq[1] - sq[2] * 0.45, sq[2] * 0.8, 4 + rng() * 4, -Math.PI / 2 + (rng() - 0.5) * 0.15); }
      var adur5 = 13 + rng() * 9;
      aurR.push({ left: hsP(rbX0), top: hsP(bottomY - 190), w: hsP(rbW), h: 230, o: depthOp[rv],
        outer: band(1, -0.12, 10, 7, rng() * 6), mid: band(0.74, -0.04, 5, 6, rng() * 6), inner: band(0.34, 0.02, 1, 4, rng() * 6), tip: band(1, 0.62, 10, 3, rng() * 6), strokes: strokes5 || 'M0 0',
        dur: hsP(adur5), delay: hsP(-rng() * adur5), anim: 'hsAurC' });
    }
    out.aurLayers = mo.aurora ? aurR : [];
    out.mwOp = mo.aurora ? 0.32 : 0.55;
  }
  out.starsAD = (sA + sB + sC) || 'M0 0';
  var tw = [];
  if (night) for (i = 0; i < 34; i++) { var tdur = 2.8 + rng() * 3.6, tsz = 3 + rng() * 4; tw.push({ x: hsP(rng() * 1440 - tsz / 2), y: hsP(rng() * 440 - tsz / 2), s: hsP(tsz), dur: hsP(tdur), delay: hsP(-rng() * tdur) }); }
  out.twinkles = tw;
  out.mwDotsD = mwDots || 'M0 0'; out.mwBrightD = mwDust || 'M0 0'; out.craterD = crat || 'M0 0'; if (!night) { out.mwOp = 1; out.aurLayers = []; out.mwG = [0, 1, 2, 3, 4].map(function () { return { cx: 0, cy: 0, rx: 0, ry: 0, rot: 0 }; }); }
  var clouds = [], nc = night ? 0 : 3 + Math.floor(rng() * 3);
  for (i = 0; i < nc; i++) {
    var cw = 180 + rng() * 170, chh = 44 + rng() * 26, d1 = '', d2 = '', d3 = '';
    for (var b = 0; b < 6; b++) {
      var bx = cw * (0.2 + rng() * 0.6), by = chh * (0.62 + rng() * 0.2), br = chh * (0.28 + rng() * 0.3);
      d1 += hsBlobD(rng, bx, by, br * 1.35, 10, 0.55); d2 += hsBlobD(rng, bx, by - 2, br * 1.05, 10, 0.6); d3 += hsBlobD(rng, bx - br * 0.2, by - br * 0.25, br * 0.6, 9, 0.6);
    }
    var dur = 150 + rng() * 90;
    clouds.push({ y: hsP(50 + i * (190 / nc) + rng() * 30), w: hsP(cw), h: hsP(chh * 1.4), d1: d1, d2: d2, d3: d3, dur: hsP(dur), delay: hsP(-rng() * dur) });
  }
  out.clouds = clouds;
  /* land */
  out.mtD = 'M0 0'; out.mt2D = 'M0 0'; out.snowD = 'M0 0'; out.mtRimD = 'M0 0';
  if (mt) {
    var pk = [[-30, 440], [120, 330], [210, 380], [330, 250], [450, 360], [560, 300], [700, 400], [820, 280], [960, 370], [1080, 300], [1220, 390], [1330, 320], [1470, 380]].map(function (p, k2) { return [p[0], k2 % 2 ? p[1] + (rng() - 0.5) * 60 : p[1] + (rng() - 0.5) * 20]; });
    var mtK = {};
    out.mtD = hsJag(rng, pk, 10, 620, mtK);
    out.mt2D = hsJag(rng, [[-30, 480], [160, 392], [300, 455], [420, 378], [560, 465], [700, 396], [860, 475], [1000, 406], [1160, 475], [1300, 416], [1470, 455]].map(function (p) { return [p[0], p[1] + (rng() - 0.5) * 30]; }), 8, 620);
    var sn = '', rimM = '';
    var jp = mtK.pts;
    pk.forEach(function (p, k2) {
      if (!(k2 % 2) || k2 === 0 || k2 === pk.length - 1 || p[1] > (winter ? 380 : 345)) return;
      var pi = k2 * 4, depth = winter ? 58 : 36, lim = p[1] + depth;
      var walk = function (dir) {
        var out2 = [], j = pi;
        while (j + dir >= 0 && j + dir < jp.length) {
          var a2 = jp[j], b2 = jp[j + dir];
          if (b2[1] >= lim) { var f = (lim - a2[1]) / ((b2[1] - a2[1]) || 1); out2.push([a2[0] + (b2[0] - a2[0]) * f, lim]); break; }
          out2.push(b2); j += dir;
        }
        return out2;
      };
      var L2 = walk(-1), R2 = walk(1);
      if (!L2.length || !R2.length) return;
      var d2 = 'M' + hsP(L2[L2.length - 1][0]) + ' ' + hsP(L2[L2.length - 1][1]);
      L2.slice(0, -1).reverse().forEach(function (q) { d2 += ' L' + hsP(q[0]) + ' ' + hsP(q[1]); });
      d2 += ' L' + hsP(jp[pi][0]) + ' ' + hsP(jp[pi][1]);
      R2.forEach(function (q) { d2 += ' L' + hsP(q[0]) + ' ' + hsP(q[1]); });
      var rE = R2[R2.length - 1], lE = L2[L2.length - 1];
      for (var z = 1; z < 6; z++) { var zt = z / 6, zx = rE[0] + (lE[0] - rE[0]) * zt, zy = lim - (z % 2 ? 9 + rng() * 7 : 1); d2 += ' L' + hsP(zx) + ' ' + hsP(zy); }
      sn += d2 + ' Z ';
    });
    out.snowD = sn || 'M0 0'; out.mtRimD = rimM;
  }
  out.seaD = sea ? hsRidge(rng, 446, [[2.5, 320, rng() * 6]], 2, 30, 680).d : 'M0 0';
  var seaL = '';
  if (sea) for (i = 0; i < 18; i++) seaL += hsBrushD(rng, rng() * 1440, 460 + rng() * 90, 80 + rng() * 160, 2 + rng() * 2.5, 0);
  out.seaLinesD = seaL || 'M0 0';
  var far = hsRidge(rng, 480, [[14 + rng() * 10, 460 + rng() * 160, rng() * 6], [6 + rng() * 5, 200 + rng() * 60, rng() * 6]], 7, 24, 700);
  out.farD = sea ? 'M0 0' : far.d;
  var mid = hsRidge(rng, sea ? 566 : 552, [[10 + rng() * 10, 560 + rng() * 200, rng() * 6], [5 + rng() * 4, 240 + rng() * 60, rng() * 6]], 6, 22, 780);
  out.midD = mid.d;
  var gr = hsRidge(rng, 630, [[8 + rng() * 5, 640 + rng() * 160, rng() * 6], [4 + rng() * 3, 280 + rng() * 60, rng() * 6]], 5, 20, 880);
  out.groundD = gr.d;
  var farL = '', midL = '', midDk = '', grL = '', grDk = '';
  if (!sea) for (i = 0; i < 7; i++) { x = rng() * 1440; y = far.yAt(x) + 20 + rng() * 40; farL += hsBrushD(rng, x, y, 180 + rng() * 200, 10 + rng() * 8, (rng() - 0.5) * 0.06); }
  for (i = 0; i < 12; i++) { x = rng() * 1440; y = mid.yAt(x) + 18 + rng() * 56; var sd = hsBrushD(rng, x, y, 200 + rng() * 220, 12 + rng() * 12, (rng() - 0.5) * 0.06); if (i % 2) midL += sd; else midDk += sd; }
  for (i = 0; i < 20; i++) { x = rng() * 1440; y = gr.yAt(x) + 26 + rng() * 190; if (nearStone(x, y, 40)) continue; var gd = hsBrushD(rng, x, y, 260 + rng() * 280, 16 + rng() * 18, (rng() - 0.5) * 0.05); if (i % 3 === 0) grL += gd; else grDk += gd; }
  out.farLightD = farL || 'M0 0';
  out.midLightD = midL || 'M0 0'; out.midDarkD = midDk || 'M0 0';
  out.groundLightD = grL || 'M0 0'; out.groundDarkD = grDk || 'M0 0';
  out.farLight = hsMix(c.h1, '#ffffff', 0.35); out.midDark = hsMix(c.h2, '#3e4a2c', 0.22); out.midLight = hsMix(c.h2, '#fffbea', 0.35);
  out.groundDark = winter ? hsMix(c.g2, '#9fb0c2', 0.5) : hsMix(c.g2, '#2f3a22', 0.25); out.groundLight = winter ? '#ffffff' : hsMix(c.g1, '#fffbea', 0.35);
  if (winter) { out.midDark = hsMix(c.h2, '#aab6c6', 0.5); out.midLight = '#ffffff'; out.farLight = '#ffffff'; }
  if (night) { out.farLight = hsMix(c.h1, '#a8b8e6', 0.3); out.midLight = hsMix(c.h2, '#a8b8e6', 0.28); out.groundLight = hsMix(c.g1, '#a8b8e6', winter ? 0.35 : 0.22); out.midDark = hsMix(c.h2, '#101830', 0.3); out.groundDark = hsMix(c.g2, '#101830', 0.3); }
  var mist = '';
  if (morn) {
    for (i = 0; i < 12; i++) { x = rng() * 1440; mist += hsBrushD(rng, x, (sea ? mid.yAt(x) - 8 : far.yAt(x) + 22) + rng() * 20, 240 + rng() * 260, 12 + rng() * 14, (rng() - 0.5) * 0.04); }
    for (i = 0; i < 8; i++) { x = rng() * 1440; mist += hsBrushD(rng, x, mid.yAt(x) + 30 + rng() * 20, 200 + rng() * 220, 10 + rng() * 10, 0); }
  }
  out.mistD = mist || 'M0 0';
  out.lakeD = 'M0 0';
  var shim = '', shim2 = '', lcx = 640;
  if (lake) {
    var lp = [], lrx = 360 + rng() * 60; lcx = 600 + rng() * 120;
    for (i = 0; i < 22; i++) { var la = i / 22 * 6.2832; lp.push([lcx + Math.cos(la) * lrx * (0.96 + rng() * 0.06), 582 + Math.sin(la) * 26 * (0.9 + rng() * 0.2)]); }
    var ld = 'M' + hsP(lp[0][0]) + ' ' + hsP(lp[0][1]); lp.slice(1).forEach(function (p) { ld += ' L' + hsP(p[0]) + ' ' + hsP(p[1]); });
    out.lakeD = ld + ' Z';
    for (i = 0; i < 10; i++) { x = lcx + (rng() - 0.5) * lrx * 1.4; y = 570 + rng() * 22; if (i % 2) shim2 += hsBrushD(rng, x, y, 40 + rng() * 70, 2.4, 0); else shim += hsBrushD(rng, x, y, 40 + rng() * 70, 2.4, 0); }
  }
  if (sea) for (i = 0; i < 16; i++) { x = rng() * 1440; y = 458 + rng() * 100; if (i % 2) shim2 += hsBrushD(rng, x, y, 50 + rng() * 110, 2.6, 0); else shim += hsBrushD(rng, x, y, 50 + rng() * 110, 2.6, 0); }
  out.shimD = shim || 'M0 0'; out.shimD2 = shim2 || 'M0 0'; out.shimDisp = lake || sea ? 'block' : 'none';
  /* Cabin and barn spots are decided before the pines, so no tree ever grows through a house. */
  var lakeL = lake ? lcx - lrx * 1.04 : 9999;
  var midSlots = [Math.max(90, Math.min(300, lakeL - 42)), church || has('steeple') ? 1040 : 985];
  var busyX = [];
  if (has('cabin')) busyX.push(midSlots[0]);
  if (has('barn')) busyX.push(midSlots[has('cabin') ? 1 : 0]);
  var pn = '';
  if (mt) [[110, 562, 50], [178, 556, 70], [228, 560, 56], [1300, 552, 74], [1352, 556, 58], [1404, 560, 48]].forEach(function (p) {
    if (busyX.some(function (bx) { return Math.abs(bx - p[0]) < 70; })) return;
    for (var t = 0; t < 3; t++) { var ty = p[1] - t * p[2] * 0.28, tw = p[2] * (0.34 - t * 0.08); pn += 'M' + hsP(p[0] - tw + (rng() - 0.5) * 3) + ' ' + hsP(ty) + ' L' + hsP(p[0] + (rng() - 0.5) * 3) + ' ' + hsP(ty - p[2] * 0.42) + ' L' + hsP(p[0] + tw + (rng() - 0.5) * 3) + ' ' + hsP(ty) + ' Z '; }
  });
  var pnSnow = '';
  if (winter && !mt && !sea) [[1330, 600, 60], [1384, 606, 76], [1430, 604, 52], [470, 578, 34]].forEach(function (p) {
    for (var t = 0; t < 3; t++) { var ty = p[1] - t * p[2] * 0.28, tw = p[2] * (0.34 - t * 0.08); pn += 'M' + hsP(p[0] - tw) + ' ' + hsP(ty) + ' L' + hsP(p[0]) + ' ' + hsP(ty - p[2] * 0.42) + ' L' + hsP(p[0] + tw) + ' ' + hsP(ty) + ' Z '; }
  });
  if (winter) pn.split('Z').forEach(function (tri) { var m = tri.match(/L([\d.]+) ([\d.]+)/); if (m) { var px = +m[1], py = +m[2]; pnSnow += 'M' + hsP(px) + ' ' + hsP(py) + ' L' + hsP(px + 7) + ' ' + hsP(py + 8) + ' Q' + hsP(px) + ' ' + hsP(py + 5) + ' ' + hsP(px - 7) + ' ' + hsP(py + 8) + ' Z '; } });
  out.pinesD = pn || 'M0 0'; out.pineSnowD = pnSnow || 'M0 0'; out.pine = hsMix(HS_SCENES.meadow.leaf3, '#3f5a3a', 0.45);
  var hd = '', hdk = '';
  if (garden) {
    for (x = -20; x < 420; x += 34) { hd += hsBlobD(rng, x, gr.yAt(x) - 16 + (rng() - 0.5) * 8, 30 + rng() * 10, 9); hdk += hsDab(x + 6, gr.yAt(x) - 6, 18, 8, rng() * 0.6); }
    for (x = 1300; x < 1470; x += 34) { hd += hsBlobD(rng, x, gr.yAt(x) - 18 + (rng() - 0.5) * 8, 30 + rng() * 10, 9); hdk += hsDab(x + 6, gr.yAt(x) - 8, 18, 8, rng() * 0.6); }
  }
  out.hedgeD = hd || 'M0 0'; out.hedgeDarkD = hdk || 'M0 0';
  out.hedge = winter ? '#5d7662' : hsMix(c.grass, '#8fa678', 0.5); out.hedgeDark = hsMix(c.grass, '#3f4f2c', 0.3);
  /* tree placement first so keepsakes can sit around it */
  var treeOn = !sea;
  var tx = 1150 + rng() * 110, ts = 0.92 + rng() * 0.18, tyG = gr.yAt(tx) + 18;
  /* keepsakes & landmarks, painted in place */
  var things = [], glow = eve || night, smoke = [];
  var wk = mo.worship || 'chapel';
  if (church) things = things.concat(hsWorship(wk, 975, mid.yAt(975) + 16, 1.25, glow));
  else if (has('steeple')) things = things.concat(sea ? hsWorship(wk, 1000, mid.yAt(1000) + 12, 0.9, glow) : hsWorship(wk, 975, far.yAt(975) + 12, 0.75, glow));
  if (has('cabin') && !church) {
    var cx0 = midSlots.shift(), cy0 = mid.yAt(cx0) + 14, cs = 0.95;
    things = things.concat(hsCabin(cx0, cy0, cs, glow));
    for (i = 0; i < 4; i++) smoke.push({ x: hsP(cx0 + 15 * cs - 11), y: hsP(cy0 - 52 * cs - 40), delay: hsP(-i * 2.8) });
  }
  if (has('barn') && !church) { var bx0 = midSlots.shift(); things = things.concat(hsBarn(bx0, mid.yAt(bx0) + 14, 0.9)); }
  out.smoke = smoke;
  /* A churchyard of its own: a low fieldstone wall, dark yews flanking the chapel and a few old weathered stones. */
  if (church) {
    var wallD = '', wallDk = '', wx;
    for (wx = -10; wx < 1450; wx += 4) { var wy = mid.yAt(wx) + 26; wallD += (wx === -10 ? 'M' : 'L') + hsP(wx) + ' ' + hsP(wy - 13); }
    for (wx = 1450; wx >= -10; wx -= 4) { wallD += ' L' + hsP(wx) + ' ' + hsP(mid.yAt(wx) + 26); }
    wallD += ' Z';
    for (wx = 0; wx < 1440; wx += 15 + rng() * 8) { var wyy = mid.yAt(wx) + 19 + (rng() - 0.5) * 5; wallDk += hsDab(wx, wyy, 6 + rng() * 3, 3 + rng() * 1.5, (rng() - 0.5) * 0.4); }
    things.push({ d: wallD, c: '#b8b0a2' }, { d: wallDk, c: '#9a9284' });
    var yew = '';
    [[892, 0.95], [1062, 0.85], [150, 0.8]].forEach(function (yv) {
      var yx = yv[0], yb = mid.yAt(yx) + 18, s2 = yv[1];
      for (var yk = 0; yk < 5; yk++) yew += hsBlobD(rng, yx + (rng() - 0.5) * 8 * s2, yb - (12 + yk * 16) * s2, (22 - yk * 3.2) * s2, 9, 1.05);
    });
    things.push({ d: yew, c: '#3e5a3f' });
    var olds = '', oldsDk = '';
    [260, 330, 390, 1030, 1105, 1330, 1395].forEach(function (ox, k) {
      var oy = gr.yAt(ox) + 8 + (k % 3) * 9, ow = 13 + rng() * 7, oh = ow * (1.2 + rng() * 0.4), tilt = (rng() - 0.5) * 0.16;
      var c0 = Math.cos(tilt), s0 = Math.sin(tilt), P = function (px, py) { return hsP(ox + px * c0 - py * s0) + ' ' + hsP(oy + px * s0 + py * c0); };
      olds += 'M' + P(-ow / 2, 0) + ' L' + P(-ow / 2, -oh + ow / 2) + ' Q' + P(-ow / 2, -oh) + ' ' + P(0, -oh) + ' Q' + P(ow / 2, -oh) + ' ' + P(ow / 2, -oh + ow / 2) + ' L' + P(ow / 2, 0) + ' Z ';
      oldsDk += 'M' + P(ow / 2 - 3, 0) + ' L' + P(ow / 2 - 3, -oh + ow / 2) + ' L' + P(ow / 2, -oh + ow / 2) + ' L' + P(ow / 2, 0) + ' Z ';
    });
    things.push({ d: olds, c: '#aaa497' }, { d: oldsDk, c: '#8b857a' });
  }
  /* A garden of its own: a gravel path winding back to a white rose arbor set against the hedge. */
  if (garden) {
    var ax = busyX.some(function (bx) { return Math.abs(bx - 332) < 130; }) ? 150 : 332, ay = gr.yAt(ax) + 8, aH = 150, aR = 46, ar = 38, acy = ay - aH + aR, band = '';
    things.push({ d: 'M' + hsP(ax - 96) + ' 836 Q' + hsP(ax - 36) + ' 744 ' + hsP(ax - 20) + ' ' + hsP(ay + 2) + ' L' + hsP(ax + 20) + ' ' + hsP(ay + 2) + ' Q' + hsP(ax + 60) + ' 744 ' + hsP(ax + 138) + ' 836 Z', c: '#d9cfba' });
    var stepD = '';
    for (i = 0; i < 7; i++) { var tt = i / 7, sy = 830 - tt * (830 - ay - 10), sx = ax + 20 - tt * 20 + (rng() - 0.5) * 12, sw = 34 - tt * 20; stepD += hsBlobD(rng, sx, sy, sw * 0.5, 8, 0.45); }
    things.push({ d: stepD, c: '#c3b79e' });
    for (var ak = 0; ak <= 12; ak++) { var aa = Math.PI + ak / 12 * Math.PI; band += (ak ? 'L' : 'M') + hsP(ax + Math.cos(aa) * aR) + ' ' + hsP(acy + Math.sin(aa) * aR) + ' '; }
    for (ak = 12; ak >= 0; ak--) { var ab = Math.PI + ak / 12 * Math.PI; band += 'L' + hsP(ax + Math.cos(ab) * ar) + ' ' + hsP(acy + Math.sin(ab) * ar) + ' '; }
    band += 'Z M' + hsP(ax - aR) + ' ' + hsP(acy) + ' h8 V' + hsP(ay) + ' h-8 Z M' + hsP(ax + ar) + ' ' + hsP(acy) + ' h8 V' + hsP(ay) + ' h-8 Z';
    things.push({ d: band, c: '#f1ede4' });
    var leafA = '', roseA = '', roseB = '';
    for (i = 0; i < 34; i++) {
      var tq = rng(), px2, py2;
      if (tq < 0.55) { var ang = Math.PI + rng() * Math.PI; px2 = ax + Math.cos(ang) * (ar + 4); py2 = acy + Math.sin(ang) * (ar + 4); }
      else { px2 = ax + (rng() < 0.5 ? -aR + 4 : ar + 4) + (rng() - 0.5) * 8; py2 = acy + rng() * (ay - acy); }
      leafA += hsCirc(px2 + (rng() - 0.5) * 6, py2 + (rng() - 0.5) * 6, 4 + rng() * 3) + ' ';
      if (i % 2 === 0) { var rc = hsCirc(px2, py2, 3 + rng() * 2.2) + ' '; if (i % 4) roseA += rc; else roseB += rc; }
    }
    things.push({ d: leafA, c: '#6d8a58' }, { d: roseA, c: '#d98fa0' }, { d: roseB, c: '#f4e9e4' });
  }
  if (sea) things.push({ d: 'M1236 458 L1244 392 H1258 L1266 458 Z', c: '#f3efe6' }, { d: 'M1239 434 H1263 L1261 420 H1241 Z M1242 392 H1260 V384 H1242 Z', c: '#c47a6c' });
  out.blinkDisp = sea ? 'block' : 'none';
  if (has('bench')) { var bnx = treeOn ? tx - 125 * ts : 1080; things = things.concat(hsBench(bnx, gr.yAt(bnx) + 30, 0.95)); }
  if (has('birdhouse')) { var bhx = treeOn ? tx + 150 * ts : 1180; things = things.concat(hsBirdhouse(bhx, gr.yAt(bhx) + 36, 0.95)); }
  var byC = {}, order = [];
  things.forEach(function (t) { if (!byC[t.c]) { byC[t.c] = ''; order.push(t.c); } byC[t.c] += t.d + ' '; });
  out.things = order.map(function (cc) { return { d: byC[cc], c: /^#(ffd98a|f7cf86)$/.test(cc) ? cc : nd(cc, 0.5) }; });
  /* tree */
  out.treeDisp = treeOn ? 'block' : 'none';
  out.treeL = hsP(tx - 182 * ts); out.treeT = hsP(tyG - 438 * ts); out.treeW = hsP(360 * ts); out.treeH = hsP(450 * ts);
  out.treeShX = hsP(tx); out.treeShY = hsP(tyG - 2); out.treeShRx = hsP(150 * ts);
  out.treeDelay = hsP(-(14 - (tx / 1440) * 2.6));
  var tb = '', tsh = '', tm = '', tl = '', tf = '', tf2 = '';
  var blobs = [[96, 196, 74], [178, 138, 96], [262, 188, 74], [132, 246, 62], [228, 252, 60], [178, 76, 62], [180, 205, 72], [181, 262, 48]].map(function (bb) { return [bb[0] + (rng() - 0.5) * 16, bb[1] + (rng() - 0.5) * 16, bb[2] * (0.9 + rng() * 0.2)]; });
  var springBloom = mo.season === 'spring' && !has('apples');
  blobs.forEach(function (bb) {
    tb += hsBlobD(rng, bb[0], bb[1], bb[2] * 0.92, 12);
    var n = Math.round(bb[2] / 2.6);
    for (var k = 0; k < n; k++) {
      var a = rng() * 6.2832, dist = Math.sqrt(rng()) * bb[2] * 0.95, px = bb[0] + Math.cos(a) * dist, py = bb[1] + Math.sin(a) * dist;
      var dab = hsDab(px, py, 9 + rng() * 11, 5 + rng() * 6, rng() * 3.14);
      var tone = (px - 180) / 220 + (py - 170) / 180 + (rng() - 0.5) * 0.35;
      if (tone > 0.28) tsh += dab; else if (tone < -0.22) tl += dab; else tm += dab;
    }
    var nf = springBloom ? Math.round(bb[2] / 6) : has('apples') ? Math.round(bb[2] / 9) : 0;
    for (var f = 0; f < nf; f++) {
      var fa = rng() * 6.2832, fdist = Math.sqrt(rng()) * bb[2] * 0.85, fx = bb[0] + Math.cos(fa) * fdist, fy = bb[1] + Math.sin(fa) * fdist;
      if (has('apples')) { tf += hsCirc(fx, fy, 4.6) + ' '; tf2 += hsDab(fx - 1.2, fy - 1.6, 1.8, 1.1, 0.6); }
      else { tf += hsDab(fx, fy, 4 + rng() * 3, 2.6 + rng() * 2, rng() * 3); if (rng() < 0.5) tf2 += hsDab(fx + 3, fy - 2, 3, 2, rng() * 3); }
    }
  });
  out.treeBodyD = tb; out.treeShadeD = tsh || 'M0 0'; out.treeMidD = tm || 'M0 0'; out.treeLightD = tl || 'M0 0';
  out.treeFruitD = tf || 'M0 0'; out.treeFruit2D = tf2 || 'M0 0';
  out.fruitC = nd(has('apples') ? '#c24a3d' : '#fbeef1', 0.4); out.fruit2C = nd(has('apples') ? '#f2b3a4' : '#ffffff', 0.4);
  out.treeTrunkD = 'M200 438 Q190 380 188 320 Q188 272 182 232 L170 232 Q165 270 167 320 Q170 380 164 438 Z ' +
    hsBrushD(rng, 150, 272, 70, 11, -0.75) + hsBrushD(rng, 208, 256, 66, 10, 0.6) + hsBrushD(rng, 168, 214, 48, 8, -1.2);
  out.treeBarkD = hsBrushD(rng, 176, 360, 70, 3, 1.52) + hsBrushD(rng, 183, 300, 50, 2.5, 1.6);
  if (winter) {
    var bare = hsBareTree(rng);
    out.treeTrunkD = 'M200 438 Q190 380 188 320 Q188 272 182 232 L170 232 Q165 270 167 320 Q170 380 164 438 Z ' + bare.wood; out.treeBodyD = 'M0 0'; out.treeShadeD = 'M0 0'; out.treeMidD = 'M0 0'; out.treeLightD = 'M0 0';
    out.treeFruitD = bare.snow + 'M156 436 Q182 426 206 436 Q182 442 156 436 Z'; out.treeFruit2D = 'M0 0'; out.fruitC = nd('#fbfcfd', 0.3);
  }
  out.leafBody = c.leaf1; out.leafShade = c.leaf3; out.leafMid = hsMix(c.leaf1, c.leaf2, 0.35); out.leafLight = c.leaf2;
  out.trunk = c.trunk; out.trunkDark = hsMix(c.trunk, '#2a2018', 0.3);
  /* boat */
  out.boatDisp = has('boat') ? 'block' : 'none';
  var bxp = lake ? lcx - 170 + rng() * 60 : 880 + rng() * 120, byp = lake ? 590 : 520;
  out.boatL = hsP(bxp - 30); out.boatT = hsP(byp - 50);
  out.boatHullD = 'M4 44 Q30 58 56 44 L52 50 Q30 60 8 50 Z';
  out.boatRimD = 'M6 44 H54 L52 47 H8 Z';
  out.boatSailD = sea ? 'M31 42 V6 L52 40 Z M29 42 V10 L14 40 Z' : 'M18 44 L44 30 L45 31.5 L19 45.5 Z';
  out.boatSailC = sea ? '#f6f0e4' : '#6c5040';
  /* flowers in the fields */
  var cols = { garden: ['pink', 'white', 'yellow', 'pink', 'lav'], meadow: ['white', 'yellow', 'white', 'lav'], mountains: ['lav', 'yellow', 'white'], lake: ['white', 'lav', 'yellow'], sea: ['white', 'pink', 'yellow'], church: ['white', 'yellow', 'lav'] }[id] || ['white', 'yellow'];
  if (mo.season === 'autumn') cols = ['gold', 'lav', 'white', 'rust'];
  else if (winter) cols = ['white'];
  else if (mo.season === 'spring' && cols.indexOf('pink') < 0) cols = cols.concat(['pink']);
  var fb = { pink: '', white: '', yellow: '', lav: '', gold: '', rust: '' }, fcD = '', nF = winter ? 10 : garden ? 90 : mo.season === 'autumn' ? 28 : 46;
  if (!winter && (has('butterflies') || has('roses'))) nF += 16;
  for (i = 0; i < nF; i++) {
    x = rng() * 1440; y = gr.yAt(x) + 24 + rng() * 190;
    if (nearStone(x, y, 30)) continue;
    var r = 2.4 + (y - 640) / 200 * 4.2, col = cols[i % cols.length];
    fb[col] += hsFlowerD(rng, x, y, r); fcD += hsCirc(x, y, r * 0.28) + ' ';
  }
  if (!winter && (garden || id === 'meadow' || mo.season === 'spring')) for (i = 0; i < 26; i++) { x = rng() * 1440; y = mid.yAt(x) + 10 + rng() * 40; fb[cols[i % cols.length]] += hsFlowerD(rng, x, y, 1.8); }
  /* Flower beds along the garden hedges. */
  if (garden && !winter) {
    var bedCols = ['pink', 'yellow', 'white', 'lav', 'pink', 'rust'];
    [[0, 300], [380, 425], [1290, 1440]].forEach(function (rg) {
      for (x = rg[0]; x < rg[1]; x += 7) { y = gr.yAt(x) - 4 + rng() * 12; fb[bedCols[Math.floor(rng() * bedCols.length)]] += hsFlowerD(rng, x + (rng() - 0.5) * 5, y, 2.4 + rng() * 1.2); }
    });
  }
  out.fPinkD = fb.pink || 'M0 0'; out.fWhiteD = fb.white || 'M0 0'; out.fYellowD = fb.yellow || 'M0 0'; out.fLavD = fb.lav || 'M0 0';
  out.fGoldD = fb.gold || 'M0 0'; out.fRustD = fb.rust || 'M0 0'; out.fCenterD = fcD || 'M0 0';
  /* plants that move: grass fringe at the stone, foreground clumps, keepsake plants */
  var gcols = winter ? [hsMix(c.grass, '#5b523e', 0.3), c.grass, hsMix(c.grass, '#d9cfa8', 0.4)] : [hsMix(c.grass, '#26331b', 0.25), c.grass, hsMix(c.g1, '#f4f7df', 0.2)];
  var gScale = winter ? 0.62 : 1, fChance = winter ? 0 : 1;
  var gfar = gcols.map(function (cc) { return hsMix(cc, c.h2, 0.35); });
  var fcols = cols.map(function (k2) { return nd(HS_FLOWER_COLS[k2]); });
  out.fcol = { white: nd('#fbf6ea'), yellow: nd('#f3d98a'), pink: nd('#efc3cd'), lav: nd('#cdbfe0'), gold: nd('#e8b85c'), rust: nd('#d08a5a'), center: nd('#d9a843') };
  var front = [], back = [];
  for (i = 0; i < 20; i++) {
    var u = i / 19 * 2 - 1, edge = Math.abs(u) > 0.82;
    x = SX + u * (halfW + 24) + (rng() - 0.5) * 14; y = SG + 1 + rng() * 6;
    front.push(hsClump(rng, x, y, ((edge ? 16 : 9) + rng() * (edge ? 12 : 11)) * gScale, 4 + Math.floor(rng() * 4), 0.22 * fChance, fcols, gcols));
  }
  for (i = 0; i < 12; i++) { x = SX + (rng() * 2 - 1) * (halfW + 40); y = SG + 8 + rng() * 8; front.push(hsClump(rng, x, y, (7 + rng() * 8) * gScale, 4, 0.3 * fChance, fcols, [gcols[1], gcols[2], hsMix(gcols[2], '#ffffff', 0.2)])); }
  for (i = 0; i < 26; i++) { x = rng() * 1440; y = 700 + rng() * 132; if (Math.abs(x - SX) < halfW + 12 && y < SG + 44) continue; front.push(hsClump(rng, x, y, (24 + (y - 700) / 132 * 26 + rng() * 8) * gScale, (winter ? 4 : 6) + Math.floor(rng() * 3), (garden ? 0.55 : 0.35) * fChance, fcols, gcols)); }
  for (i = 0; i < 14; i++) { x = rng() * 1440; y = gr.yAt(x) + 10 + rng() * 20; if (Math.abs(x - SX) < halfW + 14) continue; back.push(hsClump(rng, x, y, (8 + rng() * 6) * gScale, 5, 0.2 * fChance, fcols, gfar)); }
  var bushCols = winter ? ['#344a3b', '#46614c', '#f4f7f9', '#b8404a', '#e7a3ab'] : [hsMix(green2(c), '#34432a', 0.35), hsMix(c.grass, '#4d6238', 0.3), hsMix(c.g1, '#9fb57f', 0.3), '#c9505f', '#f0b8c2'];
  if (night) bushCols = bushCols.map(function (cc) { return nd(cc, 0.45); });
  out.shimOp = night ? 0.5 : 0.85; out.vigC = night ? '#0a1024' : '#e6d3b3'; out.vigOp = night ? 0.75 : 0.7;
  if (has('roses') || garden) {
    front.push(hsRoseBush(rng, SX - halfW - 46, SG + 8, 1, bushCols));
    front.push(hsRoseBush(rng, SX + halfW + 50, SG + 10, 0.9, bushCols));
    if (garden) [470, 960, 1030, 540].forEach(function (bxx) { back.push(hsRoseBush(rng, bxx, gr.yAt(bxx) + 22 + rng() * 10, 0.55, bushCols)); });
  }
  if (has('sunflowers') && !winter) for (i = 0; i < 3; i++) { x = SX + halfW + (has('roses') || garden ? 110 : 60) + i * 22; front.push(hsSunflower(rng, x, SG + 12 + (i % 2) * 6, 0.9 + (i % 2) * 0.2, [hsMix(c.grass, '#3d4e28', 0.2), c.grass])); }
  front.sort(function (a, b) { return (a.top + a.h) - (b.top + b.h); });
  out.front = front; out.back = back;
  /* drifting things: petals / leaves, butterflies, fireflies, birds */
  var fall = [], nfall = winter ? 0 : mo.season === 'autumn' ? 14 : mo.season === 'spring' ? 12 : 6;
  var fallCols = mo.season === 'autumn' ? ['#c9843f', '#b85f35', '#e0ad5b', '#a4502d'] : mo.season === 'spring' ? ['#f3c9d2', '#fbeef0', '#eeb7c4'] : ['#fbf6ea', '#f3eed8'];
  for (i = 0; i < nfall; i++) {
    var fdur = 12 + rng() * 6;
    fall.push({ x: hsP(treeOn ? tx - 150 * ts + rng() * 300 * ts : rng() * 1100), y: hsP(treeOn ? tyG - 380 * ts + rng() * 200 * ts : 200 + rng() * 200),
      w: mo.season === 'summer' ? 5 : 9, h: mo.season === 'summer' ? 5 : 5.5, rad: mo.season === 'autumn' ? '0 80% 0 80%' : '60% 40% 60% 40%',
      c: fallCols[i % fallCols.length], dur: hsP(fdur), delay: hsP(-rng() * fdur), anim: 'hsFall2' });
  }
  if (winter) for (i = 0; i < 34; i++) { var sdur = 15 + rng() * 9, sz = hsP(2.6 + rng() * 3.4); fall.push({ x: hsP(rng() * 1440), y: hsP(-20 + rng() * 360), w: sz, h: sz, rad: '50%', c: '#ffffff', dur: hsP(sdur), delay: hsP(-rng() * sdur), anim: 'hsSnow' }); }
  out.fall = fall;
  var flies = [];
  if (has('butterflies') && !winter) for (i = 0; i < 3; i++) { var bd = 16 + rng() * 6; flies.push({ x: hsP(470 + rng() * 800), y: hsP(590 + rng() * 110), c: ['#e8963f', '#f5e7a8', '#fbf6ea'][i], dur: hsP(bd), delay: hsP(-rng() * bd), flap: hsP(0.26 + rng() * 0.1) }); }
  out.flies = flies;
  var glows = [];
  if ((eve || night) && !winter) for (i = 0; i < (night ? 22 : 16); i++) glows.push({ x: hsP(rng() * 1440), y: hsP(540 + rng() * 240), tw: hsP(3 + rng() * 2.4), twd: hsP(-rng() * 4), wd: hsP(9 + rng() * 6), wdd: hsP(-rng() * 10) });
  out.glows = glows;
  var birds = [], nb = night ? 0 : has('birdhouse') ? 3 : 1;
  var flockDur = 46 + rng() * 14, flockDelay = -rng() * flockDur;
  for (i = 0; i < nb; i++) {
    var fd = 4.6 + rng() * 1.6;
    birds.push({ dur: hsP(flockDur + i * 1.5), delay: hsP(flockDelay - i * 1.6), y: hsP(i * 22 - 20 + rng() * 8), s: hsP(0.85 + rng() * 0.35), fd: hsP(fd), fdl: hsP(-rng() * fd) });
  }
  out.birds = birds;
  /* paper grain tile */
  var pg = '', pl = '';
  for (i = 0; i < 70; i++) pg += hsDab(rng() * 140, rng() * 140, 0.6 + rng() * 1.4, 0.4 + rng() * 0.8, rng() * 3);
  for (i = 0; i < 26; i++) pl += hsDab(rng() * 140, rng() * 140, 2 + rng() * 5, 0.4 + rng() * 0.5, (rng() - 0.5) * 0.4);
  out.paperD = pg; out.paperLightD = pl;
  HS_PAINT_CACHE[key] = out;
  return out;
}

