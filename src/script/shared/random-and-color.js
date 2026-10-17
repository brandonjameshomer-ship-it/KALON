
/* ---------- Final scene: story-driven, painterly, filter-free ---------- */
function hsRng(seed) { var s = (seed >>> 0) || 1; return function () { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; }; }
function hsHash(str) { var h = 2166136261; str = String(str || ''); for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function hsHexRgb(h) { h = String(h).replace('#', ''); var n = parseInt(h, 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
function hsMix(a, b, t) {
  var x = hsHexRgb(a), y = hsHexRgb(b);
  return '#' + [0, 1, 2].map(function (i) { var v = Math.round(x[i] + (y[i] - x[i]) * t); return (v < 16 ? '0' : '') + v.toString(16); }).join('');
}
function hsP(n) { return Math.round(n * 10) / 10; }

