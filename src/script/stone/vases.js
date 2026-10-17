/* Flower vases: spun aluminum or turned granite, 4–8″ across, at the left, the middle (front center) and/or the
   right. Side vases sit on the base or are mounted partway up the side of the stone; a middle vase stands on the
   base in front. Beside a marker on the ground, side vases sit toward its top or bottom and a middle vase at its head. */
var HS_VASE_KINDS = [
  { id: 'aluminum', label: 'Spun aluminum', spec: 'Spun aluminum vase, brushed finish, removable liner' },
  { id: 'granite', label: 'Spun granite', spec: 'Turned (spun) granite vase with drain hole and liner' }
];
/* Beside the stone (left, right) and in a row in front of it (front left, front center, front right). */
var HS_VASE_SPOTS = [{ id: 'left', label: 'Left side' }, { id: 'fl', label: 'Front left' }, { id: 'front', label: 'Front center' }, { id: 'fr', label: 'Front right' }, { id: 'right', label: 'Right side' }];
var HS_VASE_SIDE_IDS = ['left', 'right'], HS_VASE_FRONT_IDS = ['fl', 'front', 'fr'];
/* Beside a marker on the ground, side vases sit toward its back (the head), its middle or its front (the foot). */
var HS_VASE_POS_LY = [{ id: 'back', label: 'Back' }, { id: 'middle', label: 'Middle' }, { id: 'front', label: 'Front' }];
function hsVaseLyPos(v) { var p = v && v.pos; return p === 'bottom' || p === 'front' ? 'front' : p === 'middle' ? 'middle' : 'back'; }
function hsVaseOk(d) { return true; }
function hsVaseOn(d) { var v = d.vase; return !!(v && v.kind && v.kind !== 'none' && hsVaseOk(d) && hsVaseSpots(v).length); }
function hsVaseW(v) { return Math.max(4, Math.min(8, Math.round(((v && v.size) || 5) * 2) / 2)); }
function hsVaseHt(v) { var w = hsVaseW(v); return hsR(v && v.kind === 'granite' ? w + 5 : w * 1.25 + 4, 2); }
function hsVaseSpots(v) {
  var s = v && v.spots;
  if (!s) s = v && v.pos === 'front' ? ['front'] : (v && v.sides) === 'left' ? ['left'] : (v && v.sides) === 'right' ? ['right'] : ['left', 'right'];
  return HS_VASE_SPOTS.map(function (x) { return x.id; }).filter(function (id) { return s.indexOf(id) >= 0; });
}
function hsVaseSides(v, d) { return hsVaseSpots(v); }
function hsVaseHasFront(v) { var s = hsVaseSpots(v); return HS_VASE_FRONT_IDS.some(function (x) { return s.indexOf(x) >= 0; }); }
function hsVaseFront(v, d) { return hsVaseHasFront(v) && !(d && hsIsLying(d)); }
function hsVaseHasSide(v) { var s = hsVaseSpots(v); return s.indexOf('left') >= 0 || s.indexOf('right') >= 0; }
/* How far the bottom of the side vases sits above the top of the base, in inches. */
function hsVaseRise(d) {
  var v = d.vase || {}, h = hsVaseHt(v), top = Math.max(0, d.H - h);
  if (hsIsLying(d) || !hsVaseHasSide(v)) return 0;
  if (typeof v.vfrac === 'number') return v.vfrac <= 0 ? 0 : hsR(Math.max(0, Math.min(top, v.vfrac * d.H - h / 2)), 2);
  if (typeof v.vy === 'number') return Math.max(0, Math.min(top, v.vy));
  return v.pos === 'middle' ? hsR(Math.max(1, (d.H - h) / 2), 2) : 0;
}
/* The base always reaches past the vases: side vases lengthen it at each end, a middle vase deepens it at the
   front (or, on a marker, lengthens it at the head). */
/* The same ledge whether the side vases sit on the base or are raised, so the base never changes size with them. */
function hsVaseRoom(d) { if (!hsVaseOn(d) || !hsVaseHasSide(d.vase)) return 0; return hsR(0.4 + hsVaseW(d.vase) + 0.6, 2); }
function hsVaseFrontDepth(d) { return hsVaseOn(d) && hsVaseFront(d.vase, d) ? hsR(hsVaseW(d.vase) + 2, 2) : 0; }
function hsVaseTopRoom(d) { return hsVaseOn(d) && hsIsLying(d) && hsVaseHasFront(d.vase) ? hsR(0.9 + hsVaseW(d.vase) + 0.6, 2) : 0; }
function hsVaseSpec(d) {
  if (!hsVaseOn(d)) return '';
  var v = d.vase, sp = hsVaseSpots(v), n = sp.length, rise = hsVaseRise(d), kind = hsFind(HS_VASE_KINDS, v.kind).label.toLowerCase();
  var names = sp.map(function (x) { return hsFind(HS_VASE_SPOTS, x).label.toLowerCase(); });
  var where = names.length > 1 ? names.slice(0, -1).join(', ') + ' and ' + names[names.length - 1] : names[0];
  var head = (['', 'One ', 'Two ', 'Three ', 'Four ', 'Five '][n] || n + ' ') + kind + ' vase' + (n > 1 ? 's' : '') + ' (' + where + '), ' + hsVaseW(v) + '″ across × ' + hsVaseHt(v) + '″ high';
  var parts = [];
  if (hsIsLying(d)) {
    if (hsVaseHasSide(v)) parts.push('side vases set on the base beside the marker toward its ' + hsVaseLyPos(v) + ' (base widened ' + hsIn(hsVaseRoom(d)) + ' at each side)');
    if (hsVaseHasFront(v)) parts.push('front-row vases set on the base at the head of the marker (base lengthened ' + hsIn(hsVaseTopRoom(d)) + ')');
  } else {
    if (hsVaseHasSide(v)) parts.push(rise ? 'side vases mounted to the stone ' + hsIn(rise) + ' above the base' : 'side vases set on the base (base lengthened ' + hsIn(hsVaseRoom(d)) + ' at each end)');
    if (hsVaseHasFront(v)) parts.push('front-row vases on the base in front of the stone (base deepened ' + hsIn(hsVaseFrontDepth(d)) + ')');
  }
  return head + '; ' + parts.join('; ');
}
/* The vase outline, drawn from its foot (0, 0) upward, as a smooth closed path. */
function hsVasePath(kind, w, h) {
  var P = kind === 'granite'
    ? [[0, 0.8], [0.06, 0.8], [0.5, 0.77], [0.82, 0.8], [0.86, 0.94], [0.9, 1], [1, 1]]
    : [[0, 0.52], [0.06, 0.56], [0.36, 0.68], [0.62, 0.56], [0.78, 0.44], [0.9, 0.7], [0.97, 1], [1, 1]];
  var pts = P.map(function (q) { return [q[1] * w / 2, -q[0] * h]; });
  var seg = function (arr) {
    var out = '';
    for (var i = 1; i < arr.length; i++) {
      var p0 = arr[Math.max(0, i - 2)], p1 = arr[i - 1], p2 = arr[i], p3 = arr[Math.min(arr.length - 1, i + 1)];
      var c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      out += ' C' + hsR(c1[0], 2) + ' ' + hsR(c1[1], 2) + ' ' + hsR(c2[0], 2) + ' ' + hsR(c2[1], 2) + ' ' + hsR(p2[0], 2) + ' ' + hsR(p2[1], 2);
    }
    return out;
  };
  var right = pts, left = pts.slice().reverse().map(function (p) { return [-p[0], p[1]]; });
  return 'M0 0 L' + hsR(right[0][0], 2) + ' 0' + seg(right) + ' L' + hsR(left[0][0], 2) + ' ' + hsR(left[0][1], 2) + seg(left) + ' Z';
}
