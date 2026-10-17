function hsParseDate(s) {
  var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || '');
  if (!m) return null;
  return { y: +m[1], m: +m[2], d: +m[3] };
}
function hsIsoToday() { var n = new Date(), p = function (k) { return (k < 10 ? '0' : '') + k; }; return n.getFullYear() + '-' + p(n.getMonth() + 1) + '-' + p(n.getDate()); }
/* Accepts 4/12/1941, 04-12-1941, 1941-04-12, "April 12, 1941" or "12 April 1941". */
function hsParseLooseDate(t) {
  t = String(t || '').trim(); if (!t) return '';
  var p = function (k) { return (k < 10 ? '0' : '') + k; }, y, m, d, mm;
  if ((mm = /^(\d{4})[-\/.](\d{1,2})[-\/.](\d{1,2})$/.exec(t))) { y = +mm[1]; m = +mm[2]; d = +mm[3]; }
  else if ((mm = /^(\d{1,2})[-\/.\s](\d{1,2})[-\/.\s](\d{4})$/.exec(t))) { m = +mm[1]; d = +mm[2]; y = +mm[3]; }
  else {
    var lower = t.toLowerCase(), mi = -1;
    HS_MONTHS.forEach(function (n, i) { if (mi < 0 && lower.indexOf(n.slice(0, 3).toLowerCase()) >= 0) mi = i; });
    var nums = t.match(/\d+/g) || [];
    if (mi < 0 || nums.length < 2) return '';
    m = mi + 1; y = +nums.filter(function (n) { return n.length === 4; })[0]; d = +nums.filter(function (n) { return n.length <= 2; })[0];
    if (!y || !d) return '';
  }
  var dt = new Date(y, m - 1, d);
  if (dt.getFullYear() !== y || dt.getMonth() !== m - 1 || dt.getDate() !== d || y < 1800) return '';
  return y + '-' + p(m) + '-' + p(d);
}
/* Space held for something added later. A date still to come is laid out like a real (long) date so the lettering
   leaves room for it, but it is marked so it is never carved; a photo still to come is a blank, reserved frame. */
var HS_RESV_DATE = { y: 2088, m: 9, d: 28, resv: true };
var HS_RESV_A = '\uE000', HS_RESV_B = '\uE001', HS_RESV_RE = /\uE000([^\uE001]*)\uE001/g;
function hsResvShow(t) { return String(t || '').replace(HS_RESV_RE, '(date added later)'); }
function hsResvStrip(t) { return String(t || '').replace(HS_RESV_RE, '').replace(/\s*[–—·]\s*$/, '').replace(/[ \t]+$/gm, ''); }
function hsHasResv(t) { return /\uE000/.test(String(t || '')); }
function hsResvSegs(t) {
  var out = [], s = String(t || ''), last = 0, m;
  HS_RESV_RE.lastIndex = 0;
  while ((m = HS_RESV_RE.exec(s))) { if (m.index > last) out.push({ t: s.slice(last, m.index), resv: false }); out.push({ t: m[1], resv: true }); last = m.index + m[0].length; }
  if (last < s.length) out.push({ t: s.slice(last), resv: false });
  return out;
}
function hsIsResvPhoto(id) { return /^resv-/.test(String(id || '')); }
function hsPassedLater(form, who) {
  if (who === 2) return !form.passed2 && !!form.born2 && form.passedLater2 !== false;
  return !form.passed && !!form.born && form.passedLater !== false;
}
/* Every photo they add is used. A spot can also be saved for a photo that comes later, and on a stone for two,
   whenever one person has a portrait (or a saved spot) the other gets a matching spot so the stone stays balanced. */
function hsPhotoSet(form, photos) {
  var list = (photos || []).filter(function (p) { return !p.resv; }), two = form.who === 'two' && String(form.name2 || '').trim();
  var has = function (o) { return list.some(function (p) { return (p.owner || 1) === o; }); };
  var w1 = has(1) || !!form.photoLater, w2 = !!two && (has(2) || !!form.photoLater2);
  if (two && (w1 || w2)) { w1 = true; w2 = true; }
  if (w1 && !has(1)) list.push({ id: 'resv-1', owner: 1, resv: true, name: 'a photo to add later', url: '', ratio: 1.28 });
  if (w2 && !has(2)) list.push({ id: 'resv-2', owner: 2, resv: true, name: 'a photo to add later', url: '', ratio: 1.28 });
  return list;
}
