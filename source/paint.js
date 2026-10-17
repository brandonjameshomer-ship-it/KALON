
/* ---------- Final scene: story-driven, painterly, filter-free ---------- */
function hsRng(seed) { var s = (seed >>> 0) || 1; return function () { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; }; }
function hsHash(str) { var h = 2166136261; str = String(str || ''); for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function hsHexRgb(h) { h = String(h).replace('#', ''); var n = parseInt(h, 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
function hsMix(a, b, t) {
  var x = hsHexRgb(a), y = hsHexRgb(b);
  return '#' + [0, 1, 2].map(function (i) { var v = Math.round(x[i] + (y[i] - x[i]) * t); return (v < 16 ? '0' : '') + v.toString(16); }).join('');
}
function hsP(n) { return Math.round(n * 10) / 10; }

var HS_TODS = [{ id: 'morning', label: 'Morning', icon: 'M3 18 H21 M7 18 A5 5 0 0 1 17 18 M12 7.5 V10 M5.2 11.2 L6.9 12.9 M18.8 11.2 L17.1 12.9 M2.5 15 H4.5 M19.5 15 H21.5' }, { id: 'afternoon', label: 'Afternoon', icon: 'M16.2 12 A4.2 4.2 0 1 1 7.8 12 A4.2 4.2 0 1 1 16.2 12 Z M12 2.5 V4.6 M12 19.4 V21.5 M2.5 12 H4.6 M19.4 12 H21.5 M5.3 5.3 L6.8 6.8 M17.2 17.2 L18.7 18.7 M5.3 18.7 L6.8 17.2 M17.2 6.8 L18.7 5.3' }, { id: 'evening', label: 'Evening', icon: 'M3 15 H21 M7 15 A5 5 0 0 1 17 15 M6 18.5 H18 M9 21.5 H15' }, { id: 'night', label: 'Night', icon: 'M16.5 16.8 A7 7 0 1 1 9.3 6 A5.6 5.6 0 0 0 16.5 16.8 Z M18 3 L18.6 4.6 L20.2 5.2 L18.6 5.8 L18 7.4 L17.4 5.8 L15.8 5.2 L17.4 4.6 Z M20.5 10 L20.8 10.8 L21.6 11.1 L20.8 11.4 L20.5 12.2 L20.2 11.4 L19.4 11.1 L20.2 10.8 Z' }];
var HS_SEASONS = [{ id: 'spring', label: 'Spring', icon: 'M15.1 7.6 A3.1 3.1 0 1 1 8.9 7.6 A3.1 3.1 0 1 1 15.1 7.6 Z M19.3 10.6 A3.1 3.1 0 1 1 13.1 10.6 A3.1 3.1 0 1 1 19.3 10.6 Z M17.7 15.6 A3.1 3.1 0 1 1 11.5 15.6 A3.1 3.1 0 1 1 17.7 15.6 Z M12.5 15.6 A3.1 3.1 0 1 1 6.3 15.6 A3.1 3.1 0 1 1 12.5 15.6 Z M10.9 10.6 A3.1 3.1 0 1 1 4.7 10.6 A3.1 3.1 0 1 1 10.9 10.6 Z M13.6 12 A1.6 1.6 0 1 1 10.4 12 A1.6 1.6 0 1 1 13.6 12 Z' }, { id: 'summer', label: 'Summer', icon: 'M5 19 C5 10.5 10.5 5 19 5 C19 13.5 13.5 19 5 19 Z M5 19 L13.5 10.5' }, { id: 'autumn', label: 'Autumn', icon: 'M12 21.5 V15.5 M12 15.5 L7 16.5 L8 13.2 L4 11 L7.2 10 L6.2 6 L9.6 8 L12 3 L14.4 8 L17.8 6 L16.8 10 L20 11 L16 13.2 L17 16.5 Z' }, { id: 'winter', label: 'Winter', icon: 'M12 3 V21 M4.2 7.5 L19.8 16.5 M4.2 16.5 L19.8 7.5 M9.6 4.6 L12 6.8 L14.4 4.6 M9.6 19.4 L12 17.2 L14.4 19.4 M3.9 10.5 L6.9 9.3 L6.4 6.2 M20.1 13.5 L17.1 14.7 L17.6 17.8 M3.9 13.5 L6.9 14.7 L6.4 17.8 M20.1 10.5 L17.1 9.3 L17.6 6.2' }];
var HS_TOD_WORDS = {
  morning: ['morning', 'mornings', 'sunrise', 'sunrises', 'dawn', 'coffee', 'breakfast', 'rooster'],
  evening: ['sunset', 'sunsets', 'evening', 'evenings', 'dusk', 'twilight', 'campfire', 'campfires', 'porch'],
  night: ['night', 'nights', 'stars', 'starry', 'stargazing', 'moon', 'moonlight', 'constellations', 'aurora', 'northern', 'fireflies']
};
var HS_SEASON_WORDS = {
  spring: ['spring', 'springtime', 'blossom', 'blossoms', 'april', 'tulips', 'daffodils', 'easter', 'lilacs', 'lilac'],
  summer: ['summer', 'summers', 'summertime', 'beach', 'july', 'august', 'swimming', 'picnic', 'picnics'],
  autumn: ['autumn', 'october', 'november', 'harvest', 'thanksgiving', 'pumpkin', 'pumpkins', 'football', 'hunting', 'foliage', 'leaves'],
  winter: ['winter', 'winters', 'snow', 'snowy', 'christmas', 'december', 'january', 'february', 'skiing', 'sledding', 'snowman', 'snowmen', 'hockey']
};
var HS_KEEPS = {
  roses: { words: ['rose', 'roses', 'rosebush', 'rosebushes'], phrase: 'roses close by' },
  cabin: { words: ['cabin', 'cottage', 'farmhouse', 'homestead', 'lodge'], phrase: 'a little cabin on the hill' },
  steeple: { words: ['church', 'choir', 'chapel', 'sunday', 'sundays', 'parish', 'hymn', 'hymns', 'congregation', 'pastor', 'deacon', 'synagogue', 'shul', 'mosque', 'temple', 'mandir', 'monastery'], phrase: 'a church steeple across the valley' },
  barn: { words: ['farm', 'farmer', 'farming', 'barn', 'ranch', 'rancher', 'tractor', 'tractors', 'cattle', 'cows', 'horses'], phrase: 'a red barn in the distance' },
  bench: { words: ['reading', 'books', 'bench', 'library', 'poetry', 'novels'], phrase: 'a bench for sitting a while' },
  birdhouse: { words: ['bird', 'birds', 'birdwatching', 'birdwatcher', 'feeder', 'feeders', 'cardinal', 'cardinals', 'robin', 'robins', 'bluebird', 'bluebirds', 'hummingbirds'], phrase: 'a birdhouse for visiting birds' },
  boat: { words: ['fishing', 'fisherman', 'boat', 'boating', 'sailing', 'sailor', 'canoe', 'canoeing', 'kayak', 'rowing'], phrase: 'a little boat on the water', water: true },
  sunflowers: { words: ['sunflower', 'sunflowers'], phrase: 'sunflowers nodding nearby' },
  butterflies: { words: ['butterfly', 'butterflies', 'monarch', 'monarchs'], phrase: 'butterflies drifting by' },
  apples: { words: ['apple', 'apples', 'orchard', 'orchards'], phrase: 'an apple tree heavy with fruit' },
  stars: { words: ['stars', 'stargazing', 'constellations', 'moon'], phrase: 'the first stars coming out' }
};
var HS_KEEP_ORDER = ['roses', 'cabin', 'steeple', 'barn', 'bench', 'birdhouse', 'boat', 'sunflowers', 'butterflies', 'apples', 'stars'];

/* Read the story for the things that should appear in their place. */
function hsStoryScene(form) {
  var parts = [form.story, form.theme].concat(form.quotes || []);
  var text = parts.filter(Boolean).join(' . ').toLowerCase();
  var words = text.match(/[a-z']+/g) || [];
  var firstAt = function (list) { var best = -1, w = ''; list.forEach(function (x) { var i = words.indexOf(x); if (i >= 0 && (best < 0 || i < best)) { best = i; w = x; } }); return { at: best, word: w }; };
  var keeps = [];
  HS_KEEP_ORDER.forEach(function (k) { var f = firstAt(HS_KEEPS[k].words); if (f.at >= 0) keeps.push({ id: k, word: f.word, at: f.at }); });
  keeps.sort(function (a, b) { return a.at - b.at; });
  var tod = '', todWord = '', season = '', seasonWord = '', bestT = -1, bestS = -1;
  Object.keys(HS_TOD_WORDS).forEach(function (k) { var f = firstAt(HS_TOD_WORDS[k]); if (f.at >= 0 && (bestT < 0 || f.at < bestT)) { bestT = f.at; tod = k; todWord = f.word; } });
  Object.keys(HS_SEASON_WORDS).forEach(function (k) { var f = firstAt(HS_SEASON_WORDS[k]); if (f.at >= 0 && (bestS < 0 || f.at < bestS)) { bestS = f.at; season = k; seasonWord = f.word; } });
  if (/\b(every|each|in the|the) fall\b/.test(text) && (bestS < 0 || words.indexOf('fall') < bestS)) { season = 'autumn'; seasonWord = 'fall'; }
  if (!tod && keeps.some(function (k) { return k.id === 'stars'; })) { tod = 'night'; todWord = 'stars'; }
  var aurora = /\b(northern lights|aurora|alaska|norway|iceland|finland|lapland|yukon|arctic)\b/.test(text);
  if (aurora && !tod) { tod = 'night'; todWord = (/northern lights|aurora/.exec(text) || [''])[0]; }
  return { keeps: keeps, tod: tod, todWord: todWord, season: season, seasonWord: seasonWord, aurora: aurora, seed: hsHash((form.name || '') + '|' + (form.story || '')) };
}

/* Fill the gaps the story leaves with gentle, seeded chance. Same person → same place. */
function hsSceneMoment(form, sceneId, manual) {
  var ss = hsStoryScene(form), rng = hsRng(ss.seed ^ hsHash(sceneId));
  var tod = manual.tod || ss.tod, season = manual.season || ss.season;
  var r1 = rng(), r2 = rng();
  if (!tod) tod = r1 < 0.26 ? 'morning' : r1 < 0.66 ? 'afternoon' : r1 < 0.88 ? 'evening' : 'night';
  if (!season) season = sceneId === 'garden' ? (r2 < 0.55 ? 'spring' : 'summer') : (r2 < 0.35 ? 'spring' : r2 < 0.75 ? 'summer' : 'autumn');
  var water = sceneId === 'lake' || sceneId === 'sea';
  var keeps = ss.keeps.filter(function (k) {
    if (HS_KEEPS[k.id].water && !water) return false;
    if (k.id === 'steeple' && sceneId === 'church') return false;
    if (k.id === 'stars' && tod !== 'evening' && tod !== 'night') return false;
    if (season === 'winter' && (k.id === 'sunflowers' || k.id === 'butterflies')) return false;
    return true;
  }).slice(0, 5);
  return { tod: tod, season: season, keeps: keeps, story: ss, worship: hsFaithKind(form), aurora: ss.aurora, seed: (ss.seed ^ hsHash(sceneId)) >>> 0 };
}

function hsMomentWhy(sceneId, an, mo, manual) {
  var sc = HS_SCENES[sceneId] || HS_SCENES.meadow;
  var bits = mo.keeps.map(function (k) { return HS_KEEPS[k.id].phrase; });
  if (sceneId === 'church') bits.unshift('the old church nearby');
  var list = bits.length > 1 ? bits.slice(0, -1).join(', ') + ' and ' + bits[bits.length - 1] : bits[0] || '';
  var todTxt = { morning: 'on a soft ' + mo.season + ' morning', afternoon: 'on a golden ' + mo.season + ' afternoon', evening: 'on a gentle ' + mo.season + ' evening' }[mo.tod];
  var words = [];
  if (!manual.scene) {
    var match = { garden: 'blossom', mountains: 'mountains', lake: 'mountains', sea: 'anchor', meadow: 'tree' }[sceneId];
    an.motifs.forEach(function (m) { if (m.sym === match) words = m.words.slice(0, 1); });
    if (sceneId === 'lake' && words.indexOf('lake') < 0) words = ['lake'];
    if (sceneId === 'church' && an.faith && an.faith.words.length) words = an.faith.words.slice(0, 1);
  }
  mo.keeps.forEach(function (k) { if (words.indexOf(k.word) < 0) words.push(k.word); });
  if (!manual.season && mo.story.seasonWord && words.indexOf(mo.story.seasonWord) < 0) words.push(mo.story.seasonWord);
  if (!manual.tod && mo.story.todWord && words.indexOf(mo.story.todWord) < 0) words.push(mo.story.todWord);
  words = words.slice(0, 4);
  var wl = words.map(function (w) { return '“' + w + '”'; });
  var wtxt = wl.length > 1 ? wl.slice(0, -1).join(', ') + ' and ' + wl[wl.length - 1] : wl[0];
  return 'We imagined it ' + sc.phrase + (list ? ', with ' + list : '') + ', ' + todTxt + '.' + (words.length ? ' You told us about ' + wtxt + ', so we kept them close.' : ' A gentle place to visit and remember.');
}

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

/* ---------- keepsakes: little painted things from their story ---------- */
function hsCabin(x, y, s, glow) {
  return [
    { d: 'M' + hsP(x - 26 * s) + ' ' + hsP(y) + ' L' + hsP(x - 25 * s) + ' ' + hsP(y - 23 * s) + ' L' + hsP(x) + ' ' + hsP(y - 43 * s) + ' L' + hsP(x + 26 * s) + ' ' + hsP(y - 24 * s) + ' L' + hsP(x + 26 * s) + ' ' + hsP(y) + ' Z', c: '#b48a67' },
    { d: hsRectD(x - 12 * s, y - 29 * s, x + 12 * s, y - 27 * s) + hsRectD(x - 6 * s, y - 36 * s, x + 6 * s, y - 34 * s), c: '#caa482' },
    { d: hsRectD(x - 25 * s, y - 20 * s, x - 2 * s, y - 17.5 * s) + hsRectD(x - 25 * s, y - 11 * s, x - 2 * s, y - 8.5 * s), c: '#caa482' },
    { d: 'M' + hsP(x + 11 * s) + ' ' + hsP(y - 36 * s) + ' V' + hsP(y - 52 * s) + ' H' + hsP(x + 19 * s) + ' V' + hsP(y - 30 * s) + ' Z', c: '#8a6a58' },
    { d: 'M' + hsP(x - 33 * s) + ' ' + hsP(y - 24 * s) + ' L' + hsP(x) + ' ' + hsP(y - 47 * s) + ' L' + hsP(x + 33 * s) + ' ' + hsP(y - 25 * s) + ' L' + hsP(x + 30 * s) + ' ' + hsP(y - 21 * s) + ' L' + hsP(x) + ' ' + hsP(y - 41 * s) + ' L' + hsP(x - 30 * s) + ' ' + hsP(y - 20 * s) + ' Z', c: '#6f5143' },
    { d: hsRectD(x - 14 * s, y - 15 * s, x - 5 * s, y), c: '#5c4436' },
    { d: hsRectD(x + 7 * s, y - 18 * s, x + 18 * s, y - 9 * s), c: glow ? '#ffd98a' : '#e6d8bd' }
  ];
}
function hsWorship(kind, x, y, s, glow) {
  var P = function (a, b) { return hsP(x + a * s) + ' ' + hsP(y + b * s); };
  var win = glow ? '#f7cf86' : '#8e8170';
  if (kind === 'synagogue') return [
    { d: 'M' + P(-30, 0) + ' L' + P(-30, -38) + ' L' + P(30, -38) + ' L' + P(30, 0) + ' Z', c: '#e2d7c4' },
    { d: 'M' + P(-34, -37) + ' L' + P(0, -52) + ' L' + P(34, -37) + ' Z', c: '#a8987f' },
    { d: 'M' + P(-18, 0) + ' L' + P(-18, -16) + ' Q' + P(-18, -24) + ' ' + P(-10, -24) + ' Q' + P(-2, -24) + ' ' + P(-2, -16) + ' L' + P(-2, 0) + ' Z M' + P(6, -10) + ' L' + P(6, -22) + ' Q' + P(12, -30) + ' ' + P(18, -22) + ' L' + P(18, -10) + ' Z', c: win },
    { d: 'M' + P(0, -66) + ' L' + P(-6, -55.5) + ' L' + P(6, -55.5) + ' Z M' + P(0, -52) + ' L' + P(-6, -62.5) + ' L' + P(6, -62.5) + ' Z', c: '#c9a24a' }
  ];
  if (kind === 'mosque') return [
    { d: 'M' + P(31, 0) + ' L' + P(31, -62) + ' L' + P(34, -70) + ' L' + P(37, -62) + ' L' + P(37, 0) + ' Z', c: '#ddd2bf' },
    { d: 'M' + P(29.5, -46) + ' H' + P(38.5, -46).split(' ')[0] + ' V' + hsP(y - 43 * s) + ' H' + hsP(x + 29.5 * s) + ' Z', c: '#a8987f' },
    { d: 'M' + P(-26, 0) + ' L' + P(-26, -24) + ' L' + P(26, -24) + ' L' + P(26, 0) + ' Z', c: '#e6dccb' },
    { d: 'M' + P(-17, -24) + ' Q' + P(-17, -44) + ' ' + P(0, -46) + ' Q' + P(17, -44) + ' ' + P(17, -24) + ' Z', c: '#9fb8ae' },
    { d: 'M' + P(-8, 0) + ' L' + P(-8, -10) + ' Q' + P(0, -18) + ' ' + P(8, -10) + ' L' + P(8, 0) + ' Z', c: win },
    { d: 'M' + P(2.5, -58) + ' A' + hsP(5 * s) + ' ' + hsP(5 * s) + ' 0 1 0 ' + P(2.5, -50) + ' A' + hsP(3.8 * s) + ' ' + hsP(3.8 * s) + ' 0 1 1 ' + P(2.5, -58) + ' Z M' + P(-0.6, -46) + ' L' + P(-0.6, -51) + ' L' + P(0.6, -51) + ' L' + P(0.6, -46) + ' Z', c: '#c9a24a' }
  ];
  if (kind === 'pagoda') return [
    { d: 'M' + P(-17, 0) + ' L' + P(-17, -16) + ' L' + P(17, -16) + ' L' + P(17, 0) + ' Z M' + P(-12, -26) + ' L' + P(-12, -36) + ' L' + P(12, -36) + ' L' + P(12, -26) + ' Z M' + P(-8, -44) + ' L' + P(-8, -52) + ' L' + P(8, -52) + ' L' + P(8, -44) + ' Z', c: '#dcc9a9' },
    { d: 'M' + P(-30, -15) + ' Q' + P(-20, -19) + ' ' + P(-15, -27) + ' L' + P(15, -27) + ' Q' + P(20, -19) + ' ' + P(30, -15) + ' Z M' + P(-23, -35) + ' Q' + P(-15, -38) + ' ' + P(-11, -45) + ' L' + P(11, -45) + ' Q' + P(15, -38) + ' ' + P(23, -35) + ' Z M' + P(-16, -51) + ' Q' + P(-10, -54) + ' ' + P(-6, -60) + ' L' + P(6, -60) + ' Q' + P(10, -54) + ' ' + P(16, -51) + ' Z M' + P(-0.8, -60) + ' L' + P(-0.8, -72) + ' L' + P(0.8, -72) + ' L' + P(0.8, -60) + ' Z', c: '#7a5446' },
    { d: 'M' + P(-5, 0) + ' L' + P(-5, -9) + ' L' + P(5, -9) + ' L' + P(5, 0) + ' Z', c: win }
  ];
  if (kind === 'mandir') return [
    { d: 'M' + P(-26, 0) + ' L' + P(-26, -18) + ' L' + P(26, -18) + ' L' + P(26, 0) + ' Z', c: '#e3cfae' },
    { d: 'M' + P(-13, -18) + ' Q' + P(-15, -50) + ' ' + P(0, -72) + ' Q' + P(15, -50) + ' ' + P(13, -18) + ' Z', c: '#d6b98e' },
    { d: 'M' + P(-24, -18) + ' Q' + P(-24, -28) + ' ' + P(-17, -30) + ' Q' + P(-10, -28) + ' ' + P(-10, -18) + ' Z M' + P(-5, -72) + ' Q' + P(0, -76) + ' ' + P(5, -72) + ' Q' + P(0, -69) + ' ' + P(-5, -72) + ' Z', c: '#c6a576' },
    { d: 'M' + P(-0.6, -74) + ' L' + P(-0.6, -86) + ' L' + P(9, -82) + ' L' + P(0.6, -79) + ' L' + P(0.6, -74) + ' Z', c: '#d9853b' },
    { d: 'M' + P(-5, 0) + ' L' + P(-5, -9) + ' Q' + P(0, -14) + ' ' + P(5, -9) + ' L' + P(5, 0) + ' Z', c: win }
  ];
  var ch = hsChurch(x, y, s, glow);
  if (kind === 'chapel-plain') ch.splice(3, 1);
  return ch;
}
function hsFaithKind(form) {
  var f = form.faith;
  if (f === 'christian' || f === 'celtic') return 'chapel';
  if (f === 'jewish') return 'synagogue';
  if (f === 'muslim') return 'mosque';
  if (f === 'buddhist') return 'pagoda';
  if (f === 'hindu') return 'mandir';
  if (f) return 'chapel-plain';
  var t = (String(form.story || '') + ' ' + String(form.theme || '')).toLowerCase();
  if (/\b(synagogue|shul|rabbi|torah|jewish)\b/.test(t)) return 'synagogue';
  if (/\b(mosque|imam|quran|qur'an|ramadan|muslim)\b/.test(t)) return 'mosque';
  if (/\b(buddha|buddhist|monastery|meditation)\b/.test(t)) return 'pagoda';
  if (/\b(hindu|mandir|diwali|puja)\b/.test(t)) return 'mandir';
  return 'chapel';
}
var HS_WORSHIP_LABEL = { chapel: 'Churchyard', 'chapel-plain': 'Chapel', synagogue: 'Synagogue', mosque: 'Mosque', pagoda: 'Temple', mandir: 'Temple' };
function hsChurch(x, y, s, glow) {
  return [
    { d: 'M' + hsP(x - 34 * s) + ' ' + hsP(y) + ' V' + hsP(y - 26 * s) + ' L' + hsP(x - 10 * s) + ' ' + hsP(y - 42 * s) + ' L' + hsP(x + 14 * s) + ' ' + hsP(y - 26 * s) + ' V' + hsP(y) + ' Z', c: '#e4dac8' },
    { d: 'M' + hsP(x + 12 * s) + ' ' + hsP(y) + ' V' + hsP(y - 58 * s) + ' L' + hsP(x + 20 * s) + ' ' + hsP(y - 80 * s) + ' L' + hsP(x + 28 * s) + ' ' + hsP(y - 58 * s) + ' V' + hsP(y) + ' Z', c: '#d5c9b4' },
    { d: 'M' + hsP(x - 34 * s) + ' ' + hsP(y - 25 * s) + ' L' + hsP(x - 10 * s) + ' ' + hsP(y - 41 * s) + ' L' + hsP(x + 12 * s) + ' ' + hsP(y - 27 * s) + ' L' + hsP(x - 10 * s) + ' ' + hsP(y - 37 * s) + ' Z ' + 'M' + hsP(x + 12 * s) + ' ' + hsP(y - 57 * s) + ' L' + hsP(x + 20 * s) + ' ' + hsP(y - 80 * s) + ' L' + hsP(x + 21 * s) + ' ' + hsP(y - 75 * s) + ' L' + hsP(x + 14 * s) + ' ' + hsP(y - 57 * s) + ' Z', c: '#a8987f' },
    { d: hsRectD(x + 19.2 * s, y - 92 * s, x + 20.8 * s, y - 80 * s) + hsRectD(x + 16.5 * s, y - 88.5 * s, x + 23.5 * s, y - 87 * s), c: '#9b8b74' },
    { d: 'M' + hsP(x - 16 * s) + ' ' + hsP(y) + ' V' + hsP(y - 9 * s) + ' Q' + hsP(x - 12 * s) + ' ' + hsP(y - 14 * s) + ' ' + hsP(x - 8 * s) + ' ' + hsP(y - 9 * s) + ' V' + hsP(y) + ' Z ' +
      'M' + hsP(x + 17 * s) + ' ' + hsP(y - 36 * s) + ' V' + hsP(y - 44 * s) + ' Q' + hsP(x + 20 * s) + ' ' + hsP(y - 48 * s) + ' ' + hsP(x + 23 * s) + ' ' + hsP(y - 44 * s) + ' V' + hsP(y - 36 * s) + ' Z', c: glow ? '#f7cf86' : '#8e8170' }
  ];
}
function hsBarn(x, y, s) {
  return [
    { d: 'M' + hsP(x + 30 * s) + ' ' + hsP(y) + ' V' + hsP(y - 46 * s) + ' Q' + hsP(x + 38 * s) + ' ' + hsP(y - 56 * s) + ' ' + hsP(x + 46 * s) + ' ' + hsP(y - 46 * s) + ' V' + hsP(y) + ' Z', c: '#cfc6b3' },
    { d: 'M' + hsP(x - 30 * s) + ' ' + hsP(y) + ' V' + hsP(y - 28 * s) + ' L' + hsP(x - 18 * s) + ' ' + hsP(y - 42 * s) + ' L' + hsP(x + 18 * s) + ' ' + hsP(y - 42 * s) + ' L' + hsP(x + 30 * s) + ' ' + hsP(y - 28 * s) + ' V' + hsP(y) + ' Z', c: '#a8594a' },
    { d: 'M' + hsP(x - 32 * s) + ' ' + hsP(y - 27 * s) + ' L' + hsP(x - 19 * s) + ' ' + hsP(y - 44 * s) + ' L' + hsP(x + 19 * s) + ' ' + hsP(y - 44 * s) + ' L' + hsP(x + 32 * s) + ' ' + hsP(y - 27 * s) + ' L' + hsP(x + 30 * s) + ' ' + hsP(y - 25 * s) + ' L' + hsP(x + 18 * s) + ' ' + hsP(y - 40 * s) + ' L' + hsP(x - 18 * s) + ' ' + hsP(y - 40 * s) + ' L' + hsP(x - 30 * s) + ' ' + hsP(y - 25 * s) + ' Z', c: '#6b4a40' },
    { d: hsRectD(x - 10 * s, y - 20 * s, x + 10 * s, y), c: '#7f3f33' },
    { d: 'M' + hsP(x - 10 * s) + ' ' + hsP(y - 20 * s) + ' L' + hsP(x + 10 * s) + ' ' + hsP(y) + ' L' + hsP(x + 8.5 * s) + ' ' + hsP(y) + ' L' + hsP(x - 10 * s) + ' ' + hsP(y - 18.5 * s) + ' Z M' + hsP(x + 10 * s) + ' ' + hsP(y - 20 * s) + ' L' + hsP(x - 10 * s) + ' ' + hsP(y) + ' L' + hsP(x - 8.5 * s) + ' ' + hsP(y) + ' L' + hsP(x + 10 * s) + ' ' + hsP(y - 18.5 * s) + ' Z', c: '#efe4d2' }
  ];
}
function hsBench(x, y, s) {
  return [
    { d: hsRectD(x - 28 * s, y - 13 * s, x - 25 * s, y) + hsRectD(x + 25 * s, y - 13 * s, x + 28 * s, y) + hsRectD(x - 27 * s, y - 30 * s, x - 24.5 * s, y - 13 * s) + hsRectD(x + 24.5 * s, y - 30 * s, x + 27 * s, y - 13 * s), c: '#5f4636' },
    { d: hsRectD(x - 31 * s, y - 16 * s, x + 31 * s, y - 12 * s) + hsRectD(x - 30 * s, y - 29 * s, x + 30 * s, y - 25.5 * s) + hsRectD(x - 30 * s, y - 23 * s, x + 30 * s, y - 19.5 * s), c: '#8b6a4f' },
    { d: hsRectD(x - 31 * s, y - 16 * s, x + 31 * s, y - 15 * s) + hsRectD(x - 30 * s, y - 29 * s, x + 30 * s, y - 28 * s), c: '#b08f6c' }
  ];
}
function hsBirdhouse(x, y, s) {
  return [
    { d: hsRectD(x - 2 * s, y - 56 * s, x + 2 * s, y), c: '#6a5244' },
    { d: 'M' + hsP(x - 10 * s) + ' ' + hsP(y - 54 * s) + ' V' + hsP(y - 72 * s) + ' L' + hsP(x) + ' ' + hsP(y - 81 * s) + ' L' + hsP(x + 10 * s) + ' ' + hsP(y - 72 * s) + ' V' + hsP(y - 54 * s) + ' Z', c: '#c9a37d' },
    { d: 'M' + hsP(x - 13 * s) + ' ' + hsP(y - 70 * s) + ' L' + hsP(x) + ' ' + hsP(y - 84 * s) + ' L' + hsP(x + 13 * s) + ' ' + hsP(y - 70 * s) + ' L' + hsP(x + 11 * s) + ' ' + hsP(y - 68 * s) + ' L' + hsP(x) + ' ' + hsP(y - 80 * s) + ' L' + hsP(x - 11 * s) + ' ' + hsP(y - 68 * s) + ' Z', c: '#7a5546' },
    { d: hsCirc(x, y - 64 * s, 2.8 * s) + ' ' + hsRectD(x - 0.6 * s, y - 60 * s, x + 0.6 * s, y - 57 * s), c: '#3f3129' }
  ];
}

/* ---------- mood palette: season + time of day over the chosen setting ---------- */
function hsPalette(sc, tod, season) {
  var p = Object.assign({}, sc);
  var green = HS_SCENES.meadow;
  if (season === 'spring') {
    p.leaf1 = '#e3b2bf'; p.leaf2 = '#f4d7de'; p.leaf3 = '#c08c9c';
    p.g1 = hsMix(sc.g1, '#b6cd90', 0.25); p.grass = hsMix(sc.grass, '#7d9c58', 0.2);
  } else if (season === 'summer') {
    p.leaf1 = green.leaf1; p.leaf2 = green.leaf2; p.leaf3 = green.leaf3;
  } else if (season === 'winter') {
    p.leaf1 = '#4f6a55'; p.leaf2 = '#6f8a72'; p.leaf3 = '#3f5646'; p.trunk = '#6b5b50';
    p.g1 = '#eef1f3'; p.g2 = '#d3dbe2'; p.grass = '#9a9272';
    p.h1 = hsMix(sc.h1, '#e3e7ed', 0.72); p.h2 = hsMix(sc.h2, '#eaedf0', 0.74);
    p.mt1 = hsMix(sc.mt1, '#dfe4ea', 0.35); p.mt2 = hsMix(sc.mt2, '#e6eaee', 0.45);
    p.w1 = hsMix(sc.w1, '#dde8ef', 0.35); p.w2 = hsMix(sc.w2, '#c9d9e3', 0.3);
    p.sky1 = hsMix(sc.sky1, '#d3deea', 0.45); p.sky2 = hsMix(sc.sky2, '#efebe8', 0.4); p.sky3 = hsMix(sc.sky3, '#f5f1ec', 0.3);
  } else if (season === 'autumn') {
    p.leaf1 = hsMix('#c98d4c', sc.leaf1, 0.12); p.leaf2 = hsMix('#e3b46a', sc.leaf2, 0.1); p.leaf3 = hsMix('#9a5d36', sc.leaf3, 0.12);
    p.g1 = hsMix(sc.g1, '#c7b57c', 0.38); p.g2 = hsMix(sc.g2, '#9e8e58', 0.38); p.grass = hsMix(sc.grass, '#8f8347', 0.42);
    p.h1 = hsMix(sc.h1, '#d4c090', 0.3); p.h2 = hsMix(sc.h2, '#c9ad76', 0.36);
  }
  if (tod === 'morning') {
    ['h1', 'h2', 'g1', 'g2', 'mt1', 'mt2', 'w1', 'w2', 'leaf1', 'leaf2', 'leaf3', 'grass', 'trunk'].forEach(function (k2) { p[k2] = hsMix(p[k2], '#e4ebe8', 0.12); });
    p.sky1 = hsMix(p.sky1, '#dce8ef', 0.45); p.sky2 = hsMix(p.sky2, '#f6e9df', 0.45); p.sky3 = hsMix(p.sky3, '#fbf1e4', 0.4);
    p.sun = '#fff4d8'; p.sunDisc = '#fffaf0'; p.cloud = '#ffffff'; p.tint = '#eaf1f2'; p.tintOp = 0.1;
  } else if (tod === 'evening') {
    ['h1', 'mt1', 'mt2', 'w1'].forEach(function (k2) { p[k2] = hsMix(p[k2], '#9c8ca6', 0.3); });
    ['h2', 'w2', 'leaf2'].forEach(function (k2) { p[k2] = hsMix(p[k2], '#a08a8e', 0.18); });
    ['g1', 'g2', 'leaf1', 'leaf3', 'grass', 'trunk'].forEach(function (k2) { p[k2] = hsMix(p[k2], season === 'winter' ? '#8a84a2' : '#6e6048', season === 'winter' ? 0.16 : 0.12); });
    p.sky1 = hsMix('#b7b3d0', sc.sky1, 0.2); p.sky2 = hsMix('#efc9ac', sc.sky2, 0.15); p.sky3 = hsMix('#f7d9b0', sc.sky3, 0.1);
    p.sun = '#ffc78a'; p.sunDisc = '#ffe3b4'; p.cloud = '#fbe0d0'; p.tint = '#f3a36a'; p.tintOp = 0.1;
  } else if (tod === 'night') {
    var nt = season === 'winter' ? '#7d8fb8' : '#27324f';
    ['h1', 'mt1', 'mt2'].forEach(function (k2) { p[k2] = hsMix(p[k2], '#2e3a5e', 0.58); });
    ['h2', 'w1', 'w2'].forEach(function (k2) { p[k2] = hsMix(p[k2], '#2a3558', 0.52); });
    ['g1', 'g2'].forEach(function (k2) { p[k2] = hsMix(p[k2], nt, season === 'winter' ? 0.42 : 0.5); });
    ['leaf1', 'leaf2', 'leaf3', 'grass', 'trunk'].forEach(function (k2) { p[k2] = hsMix(p[k2], '#26304c', 0.5); });
    p.sky1 = '#0c1530'; p.sky2 = '#1d2b54'; p.sky3 = '#3d4677';
    p.sun = '#b9c8f5'; p.sunDisc = '#f4f0e2'; p.cloud = '#56618c'; p.tint = '#18234a'; p.tintOp = 0.12;
  } else {
    p.sun = '#ffe9bf'; p.sunDisc = '#fff8e6'; p.cloud = '#ffffff'; p.tint = '#ffd9a0'; p.tintOp = 0.05;
  }
  return p;
}

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

/* Storybook telling: each letter gets its moment, with breaths at the punctuation. */
function hsTellSchedule(text) {
  var per = 0.058, t = 0, words = [], cur = null;
  var pause = { ',': 0.42, ';': 0.5, ':': 0.5, '.': 1.05, '!': 1.05, '?': 1.05, '—': 0.45 };
  var chars = Array.from(String(text));
  chars.forEach(function (ch, i) {
    if (ch === '\n') { if (cur) { cur.br = true; words.push(cur); cur = null; } else if (words.length) words[words.length - 1].br = true; t += 0.75; return; }
    if (ch === ' ') { if (cur) { cur.sp = ' '; words.push(cur); cur = null; } t += per * 0.6; return; }
    if (!cur) cur = { chars: [], sp: '', br: false };
    cur.chars.push({ c: ch, d: Math.round(t * 1000) / 1000 });
    t += per;
    var next = chars[i + 1] || ' ';
    if (pause[ch] && (next === ' ' || next === '\n' || next === '”' || next === '"')) t += pause[ch];
    if ((ch === '”' || ch === '"') && pause[chars[i - 1]]) t += 0.2;
  });
  if (cur) words.push(cur);
  return { words: words, total: t };
}

/* ---------- A few lines about their life, written like a small poem ---------- */
var HS_NUMWORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
var HS_TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
function hsNumWord(n) {
  if (n < 20) return HS_NUMWORDS[n];
  if (n < 100) return HS_TENS[Math.floor(n / 10)] + (n % 10 ? '-' + HS_NUMWORDS[n % 10] : '');
  if (n < 120) return 'one hundred' + (n % 100 ? ' and ' + hsNumWord(n % 100) : '');
  return String(n);
}
var HS_POEM_LOVES = [
  { w: ['roses', 'rose', 'garden', 'gardening', 'flowers', 'tulips', 'lilacs'], lines: ['{S} could coax a rose toward the light, and people too.', '{S} spent {p} springs with {p} hands in the soil, patient as the seasons.'] },
  { w: ['lake', 'cabin', 'cottage', 'dock'], lines: ['Summers belonged to the lake, to long gold evenings and doors left open.', 'There was always room at the cabin, and always one more chair.'] },
  { w: ['mountains', 'mountain', 'hiking', 'trail', 'trails'], lines: ['{S} loved the high country, where the air is thin and the view goes on forever.'] },
  { w: ['choir', 'sang', 'sing', 'singing', 'hymn', 'hymns'], lines: ['{S} sang, and {p} voice made Sunday feel like home.', 'Every hymn {s} sang is still somewhere in the rafters.'] },
  { w: ['piano', 'guitar', 'violin', 'music', 'band'], lines: ['There was always music wherever {s} {was}.'] },
  { w: ['fishing', 'fisherman', 'boat', 'boating', 'canoe'], lines: ['{S} was happiest on the water, line cast, nowhere else to be.'] },
  { w: ['sea', 'ocean', 'sailing', 'sailor', 'beach'], lines: ['The sea was never far from {p} heart.'] },
  { w: ['farm', 'farmer', 'farming', 'ranch', 'tractor', 'harvest'], lines: ['{S} worked the land with patient hands, and fed more people than {s} ever knew.'] },
  { w: ['birds', 'bird', 'birdwatching', 'cardinals', 'robins', 'feeder'], lines: ['{S} knew the birds by their songs, and they seemed to know {o} too.'] },
  { w: ['books', 'reading', 'library', 'poetry', 'novels'], lines: ['{S} always had a book half-read and a story ready to share.'] },
  { w: ['cooking', 'baking', 'kitchen', 'pie', 'pies', 'bread', 'recipes'], lines: ['{P} kitchen was the warmest room in any house.'] },
  { w: ['stars', 'stargazing', 'constellations', 'telescope'], lines: ['{S} never tired of the night sky, and taught others to look up.'] },
  { w: ['travel', 'traveled', 'travelled', 'traveling'], lines: ['{S} went out to meet the world, and brought it home in stories.'] },
  { w: ['teacher', 'taught', 'teaching'], lines: ['{S} taught, and {p} lessons are still being carried.'] },
  { w: ['nurse', 'nursing', 'doctor', 'caring'], lines: ['{S} spent a lifetime caring for others, gently and without fuss.'] },
  { w: ['laugh', 'laughter', 'jokes', 'joke', 'funny'], lines: ['{P} laugh could fill a room and stay there for days.'] },
  { w: ['dog', 'dogs', 'cat', 'cats', 'horses'], lines: ['Every animal {s} met seemed to trust {o} at once.'] }
];
function hsLifePoem(form, an, mo, sceneId) {
  var rng = hsRng(mo.seed ^ 0x5bd1e995);
  var pick = function (arr) { return arr[Math.floor(rng() * arr.length) % arr.length]; };
  var story = String(form.story || '').toLowerCase(), all = (story + ' ' + String(form.theme || '')).toLowerCase();
  var words = all.match(/[a-z']+/g) || [];
  var cnt = function (w) { return words.filter(function (x) { return x === w; }).length; };
  var fem = cnt('she') + cnt('her') + cnt('hers'), masc = cnt('he') + cnt('him') + cnt('his');
  if (an.roles.some(function (r) { return /Mother|Wife|Grandmother/.test(r); })) fem += 3;
  if (an.roles.some(function (r) { return /Father|Husband|Grandfather/.test(r); })) masc += 3;
  var g = fem > masc ? 'f' : masc > fem ? 'm' : 'n';
  var P = { f: { S: 'She', s: 'she', o: 'her', p: 'her', P: 'Her' }, m: { S: 'He', s: 'he', o: 'him', p: 'his', P: 'His' }, n: { S: 'They', s: 'they', o: 'them', p: 'their', P: 'Their' } }[g];
  var fill = function (t) { return t.replace(/\{S\}/g, P.S).replace(/\{s\}/g, P.s).replace(/\{o\}/g, P.o).replace(/\{p\}/g, P.p).replace(/\{P\}/g, P.P).replace(/\{was\}/g, g === 'n' ? 'were' : 'was'); };
  var name = hsNameParts(form.name).first || 'They';
  var b = hsParseDate(form.born), d = hsParseDate(form.passed), age = 0;
  if (b && d) { age = d.y - b.y - ((d.m < b.m || (d.m === b.m && d.d < b.d)) ? 1 : 0); }
  var lines = [];
  /* opening: about the life, not the loss */
  var seasonWord = { spring: 'springs', summer: 'summers', autumn: 'autumns', winter: 'winters' }[mo.season];
  var openers = [];
  if (age > 1) {
    var aw = hsNumWord(age); aw = aw.charAt(0).toUpperCase() + aw.slice(1);
    openers.push(aw + ' ' + seasonWord + ', and ' + name + ' made each one count.');
    openers.push(aw + ' years, lived with an open heart and a generous hand.');
  }
  openers.push(name + ' had a way of turning every day into something worth keeping.');
  openers.push(name + ' filled every room with warmth, and left it brighter than before.');
  lines.push(fill(pick(openers)));
  /* family */
  var fam = [], re = /(great-grandmother|great-grandfather|grandmother|grandfather|mother|father) of (\w+)/g, m;
  while ((m = re.exec(story))) fam.push({ role: m[1], n: m[2] });
  if (fam.length) {
    var famTxt = fam.slice(0, 2).map(function (f) { return 'a ' + f.role + ' of ' + f.n; }).join(' and ');
    lines.push(famTxt.charAt(0).toUpperCase() + famTxt.slice(1) + fill(', {s} {was} the heart of every table.'));
  } else if (an.roles.length) {
    var rl = an.roles.filter(function (r) { return !/Wife|Husband/.test(r); });
    if (rl.length) lines.push(fill('To the ones who called {o} ' + rl.join(' and ') + ', {s} {was} the heart of every table.'));
    else lines.push(fill('{S} loved one person for a lifetime, and it showed.'));
  }
  /* what they loved, in the order the family told it */
  var loves = HS_POEM_LOVES.map(function (L) {
    var at = -1; L.w.forEach(function (w) { var i = words.indexOf(w); if (i >= 0 && (at < 0 || i < at)) at = i; });
    return { L: L, at: at };
  }).filter(function (x) { return x.at >= 0; }).sort(function (a, c) { return a.at - c.at; });
  var used = 0;
  loves.forEach(function (x) { if (used < 2) { lines.push(fill(pick(x.L.lines))); used++; } });
  if (!used && an.veteran) { lines.push(fill('{S} served with quiet courage, and came home to serve everyone else.')); used++; }
  if (!used) lines.push(fill('{S} gave {p} time freely, and people never forgot it.'));
  /* closing: gentle, rooted in this place and moment */
  var when = { morning: mo.season + ' morning', afternoon: mo.season + ' afternoon', evening: mo.season + ' evening', night: mo.season + ' night' }[mo.tod];
  var closers = [
    'May every ' + mo.season + ' here carry something of ' + P.p + ' light.',
    fill('{P} light carries on in everyone {s} loved.'),
    'Let this ' + when + ' hold ' + P.o + ' gently.',
    fill('The light here is warm, the way {s} always {was}.')
  ];
  if (mo.tod === 'night') closers = ['Let the stars keep watch, the way ' + P.s + ' always did.', 'Let this ' + when + ' hold ' + P.o + ' gently.', fill('{P} light carries on, bright as any star.')];
  lines.push(fill(pick(closers)));
  return lines.join('\n');
}

/* Icon parts for the time-of-day and season chips. a is still; b sits inside a clip (for the rising and setting sun);
   c and d are the moving pieces. Each moving piece carries its own hover animation class. */
var HS_ICON_PARTS = {
  morning: { a: 'M2.5 18 H21.5', b: 'M16.4 18 A4.4 4.4 0 1 1 7.6 18 A4.4 4.4 0 1 1 16.4 18 Z', cb: 'hsIc-rise', b2: 'M18.40 18.00 L20.40 18.00 M16.53 22.53 L17.94 23.94 M12.00 24.40 L12.00 26.40 M7.47 22.53 L6.06 23.94 M5.60 18.00 L3.60 18.00 M7.47 13.47 L6.06 12.06 M12.00 11.60 L12.00 9.60 M16.53 13.47 L17.94 12.06', cb2: 'hsIc-riseSpin', clipH: 18 },
  afternoon: { b: 'M12 2.5 V4.6 M12 19.4 V21.5 M2.5 12 H4.6 M19.4 12 H21.5 M5.3 5.3 L6.8 6.8 M17.2 17.2 L18.7 18.7 M5.3 18.7 L6.8 17.2 M17.2 6.8 L18.7 5.3', cb: 'hsIc-rays', c: 'M16.2 12 A4.2 4.2 0 1 1 7.8 12 A4.2 4.2 0 1 1 16.2 12 Z', cc: 'hsIc-grow' },
  evening: { a: 'M3 15 H21', b: 'M7 15 A5 5 0 0 1 17 15 M12 5.5 V7.6 M5.6 8.6 L7.1 10.1 M18.4 8.6 L16.9 10.1', cb: 'hsIc-set', clipH: 15, c: 'M5 18.6 Q6.75 17.6 8.5 18.6 T12 18.6 T15.5 18.6 T19 18.6', cc: 'hsIc-rip1', d: 'M8 21.8 Q9 21 10 21.8 T12 21.8 T14 21.8 T16 21.8', cd: 'hsIc-rip2' },
  night: { a: 'M16.5 16.8 A7 7 0 1 1 9.3 6 A5.6 5.6 0 0 0 16.5 16.8 Z', c: 'M18 3 L18.6 4.6 L20.2 5.2 L18.6 5.8 L18 7.4 L17.4 5.8 L15.8 5.2 L17.4 4.6 Z', cc: 'hsIc-tw1', d: 'M20.5 10 L20.8 10.8 L21.6 11.1 L20.8 11.4 L20.5 12.2 L20.2 11.4 L19.4 11.1 L20.2 10.8 Z', cd: 'hsIc-tw2' },
  spring: { b: 'M15.1 7.6 A3.1 3.1 0 1 1 8.9 7.6 A3.1 3.1 0 1 1 15.1 7.6 Z M19.3 10.6 A3.1 3.1 0 1 1 13.1 10.6 A3.1 3.1 0 1 1 19.3 10.6 Z M17.7 15.6 A3.1 3.1 0 1 1 11.5 15.6 A3.1 3.1 0 1 1 17.7 15.6 Z M12.5 15.6 A3.1 3.1 0 1 1 6.3 15.6 A3.1 3.1 0 1 1 12.5 15.6 Z M10.9 10.6 A3.1 3.1 0 1 1 4.7 10.6 A3.1 3.1 0 1 1 10.9 10.6 Z', cb: 'hsIc-bloom', c: 'M13.6 12 A1.6 1.6 0 1 1 10.4 12 A1.6 1.6 0 1 1 13.6 12 Z', cc: 'hsIc-bud' },
  summer: { b: 'M11.6 8.2 A3.6 3.6 0 1 1 4.4 8.2 A3.6 3.6 0 1 1 11.6 8.2 Z M8 1.2 V2.6 M8 13.8 V15.2 M1 8.2 H2.4 M13.6 8.2 H15 M3 3.2 L4 4.2 M12 12.2 L13 13.2 M3 13.2 L4 12.2 M12 4.2 L13 3.2', cb: 'hsIc-sunspin', c: 'M10.2 22.2 C10.2 14.6 14.6 10 22.4 10 C22.4 17.8 18 22.2 10.2 22.2 Z M10.2 22.2 L18.2 14.2', cc: 'hsIc-leaf', fillC: true },
  autumn: { c: 'M12 21.5 V15.5 M12 15.5 L7 16.5 L8 13.2 L4 11 L7.2 10 L6.2 6 L9.6 8 L12 3 L14.4 8 L17.8 6 L16.8 10 L20 11 L16 13.2 L17 16.5 Z', cc: 'hsIc-blow', d: 'M1.5 7.5 H5 M1 11.5 H3.5 M2 15.5 H4.5', cd: 'hsIc-wind' },
  winter: { c: 'M12 3 V21 M4.2 7.5 L19.8 16.5 M4.2 16.5 L19.8 7.5 M9.6 4.6 L12 6.8 L14.4 4.6 M9.6 19.4 L12 17.2 L14.4 19.4 M3.9 10.5 L6.9 9.3 L6.4 6.2 M20.1 13.5 L17.1 14.7 L17.6 17.8 M3.9 13.5 L6.9 14.7 L6.4 17.8 M20.1 10.5 L17.1 9.3 L17.6 6.2', cc: 'hsIc-flake', d: 'M2.5 1.0 a0.55 0.55 0 1 0 0.01 0 M8.4 -3.0 a0.55 0.55 0 1 0 0.01 0 M14.9 0.0 a0.55 0.55 0 1 0 0.01 0 M20.4 -2.0 a0.55 0.55 0 1 0 0.01 0 M5.5 -6.0 a0.55 0.55 0 1 0 0.01 0 M17.9 -7.0 a0.55 0.55 0 1 0 0.01 0', cd: 'hsIc-snow', b: 'M0.9 -4.0 a0.55 0.55 0 1 0 0.01 0 M11.4 -1.0 a0.55 0.55 0 1 0 0.01 0 M19.4 3.0 a0.55 0.55 0 1 0 0.01 0 M5.0 4.0 a0.55 0.55 0 1 0 0.01 0 M16.4 -10.0 a0.55 0.55 0 1 0 0.01 0 M9.4 -9.0 a0.55 0.55 0 1 0 0.01 0', cb: 'hsIc-snow2' }
};
function hsIconParts(id) {
  var p = HS_ICON_PARTS[id] || {};
  return { ia: p.a || 'M0 0', ib: p.b || 'M0 0', ic: p.c || 'M0 0', id2: p.d || 'M0 0', cb: p.cb || '', cc: p.cc || '', cd: p.cd || '', ib2: p.b2 || 'M0 0', cb2: p.cb2 || '', fillC: !!p.fillC, clipH: p.clipH || 24, clipId: 'hsic-' + id };
}

/* Two people: a few lines for each life, then one closing line that holds them together. */
function hsPairPoem(form, mo, sceneId) {
  var f2 = hsPairForm(form), a1 = hsAnalyze(form), a2 = hsAnalyze(f2);
  var mo2 = Object.assign({}, mo, { seed: ((mo.seed || 1) ^ 0x2a2a2a) >>> 0 });
  var l1 = hsLifePoem(form, a1, mo, sceneId).split('\n'), l2 = hsLifePoem(f2, a2, mo2, sceneId).split('\n');
  var body1 = l1.slice(0, Math.max(1, Math.min(2, l1.length - 1))), body2 = l2.slice(0, Math.max(1, Math.min(2, l2.length - 1)));
  /* never say the same thing twice about the two of them */
  var alt = [', the steady hand everyone leaned on.', ', the one who kept everyone laughing.', ', the quiet strength of the family.'];
  body2 = body2.map(function (ln, k) {
    var dup = body1.some(function (b1) { return b1.slice(-24) === ln.slice(-24); });
    return dup ? ln.replace(/, (she|he|they) (was|were) the heart of every table\.$|, [^,]*\.$/, alt[k % alt.length]) : ln;
  });
  var when = mo.season + ' ' + mo.tod;
  var closers = ['Side by side now, the way they always were.', 'Together still, under this ' + when + '.', 'Two lives, one story, and a love that carries on.'];
  if (mo.tod === 'night') closers.push('Let the stars keep watch over them both.');
  var rng = hsRng((mo.seed || 7) ^ 0x1234567);
  return body1.concat(body2, [closers[Math.floor(rng() * closers.length) % closers.length]]).join('\n');
}
