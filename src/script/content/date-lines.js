function hsFmtDate(dt, style) {
  if (!dt) return '';
  if (dt.resv) { var r = hsFmtDate({ y: dt.y, m: dt.m, d: dt.d }, style); return HS_RESV_A + r + HS_RESV_B; }
  if (style === 'years') return String(dt.y);
  if (style === 'numeric') return dt.m + '.' + dt.d + '.' + dt.y;
  var s = HS_MONTHS[dt.m - 1] + ' ' + dt.d + ', ' + dt.y;
  return style === 'upper' ? s.toUpperCase() : s;
}
/* Words carved with the dates, like "Born … · Died …". Presets, or anything the family types. */
var HS_DATE_WORDS = [
  { id: 'none', label: 'No words', a: '', b: '' },
  { id: 'born-died', label: 'Born · Died', a: 'Born', b: 'Died' },
  { id: 'born-passed', label: 'Born · Passed', a: 'Born', b: 'Passed' },
  { id: 'birth-death', label: 'Birth · Death', a: 'Birth', b: 'Death' },
  { id: 'rest', label: 'Born · Entered into rest', a: 'Born', b: 'Entered into rest' },
  { id: 'custom', label: 'My own words', a: '', b: '' }
];
function hsDateLineW(b, e, style, sep, w) {
  /* "My own words" left blank reads as the hint: Born and Passed. */
  if (w && w.id === 'custom') w = { a: String(w.a || '').trim() || 'Born', b: String(w.b || '').trim() || 'Passed' };
  if (!w || (!String(w.a || '').trim() && !String(w.b || '').trim())) return hsDateLine(b, e, style, sep);
  var cap = function (x) { x = String(x || '').trim(); return !x ? '' : style === 'upper' ? x.toUpperCase() + ' ' : x + ' '; };
  var da = hsFmtDate(b, style), de = hsFmtDate(e, style);
  var A = da ? cap(w.a) + da : '', B = de ? cap(w.b) + de : '';
  return A && B ? A + ' · ' + B : A || B;
}
function hsDateLine(b, p, style, sep) {
  var a = hsFmtDate(b, style), c = hsFmtDate(p, style);
  if (a && c) return a + sep + c;
  if (a) return style === 'years' ? a + sep.replace(/\s+$/, '') : (style === 'upper' ? 'BORN ' : 'Born ') + a;
  if (c) return style === 'years' ? sep.replace(/^\s+/, '') + c : (style === 'upper' ? 'DIED ' : 'Died ') + c;
  return '';
}
