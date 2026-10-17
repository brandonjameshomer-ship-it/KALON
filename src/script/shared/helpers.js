function hsR(n, p) { var k = Math.pow(10, p == null ? 2 : p); return Math.round(n * k) / k; }
function hsFind(list, id) { for (var i = 0; i < list.length; i++) { if (list[i].id === id) return list[i]; } return list[0]; }
function hsHas(list, x) { return (list || []).indexOf(x) >= 0; }
function hsFirstIn(list, cands) { for (var i = 0; i < cands.length; i++) { if (hsHas(list, cands[i])) return cands[i]; } return ''; }
function hsIn(n) { return hsR(n).toFixed(2) + '″'; }
function hsIn1(n) { return hsR(n, 1).toFixed(1) + '″'; }
function hsCirc(cx, cy, r) { return 'M' + hsR(cx - r) + ' ' + hsR(cy) + ' a' + hsR(r) + ' ' + hsR(r) + ' 0 1 1 ' + hsR(2 * r) + ' 0 a' + hsR(r) + ' ' + hsR(r) + ' 0 1 1 ' + hsR(-2 * r) + ' 0 Z'; }
function hsEll(cx, cy, rx, ry) { return 'M' + hsR(cx - rx) + ' ' + hsR(cy) + ' a' + hsR(rx) + ' ' + hsR(ry) + ' 0 1 1 ' + hsR(2 * rx) + ' 0 a' + hsR(rx) + ' ' + hsR(ry) + ' 0 1 1 ' + hsR(-2 * rx) + ' 0 Z'; }
function hsStar(cx, cy, R, r, n) {
  var d = '';
  for (var i = 0; i < 2 * n; i++) {
    var a = -Math.PI / 2 + i * Math.PI / n, rr = i % 2 ? r : R;
    d += (i ? 'L' : 'M') + hsR(cx + rr * Math.cos(a)) + ' ' + hsR(cy + rr * Math.sin(a)) + ' ';
  }
  return d + 'Z';
}
function hsRgba(hex, a) {
  var h = String(hex || '#2f5b4f').replace('#', '');
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  var n = parseInt(h, 16);
  if (isNaN(n)) return 'rgba(47, 91, 79, ' + a + ')';
  return 'rgba(' + ((n >> 16) & 255) + ', ' + ((n >> 8) & 255) + ', ' + (n & 255) + ', ' + a + ')';
}
function hsSlug(t) { return String(t).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'layer'; }
function hsEsc(t) { return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
function hsTrunc(t, n) { t = String(t || ''); return t.length > n ? t.slice(0, n - 1) + '…' : t; }

