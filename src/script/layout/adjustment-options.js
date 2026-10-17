/* Try the family's chosen sizes first, then ease the lettering down a few steps until everything sits comfortably. */
var HS_FIT_STEPS = [1, 0.94, 0.88, 0.82, 0.76];
/* ---- Layout-relative adjustments ----
   The layout places everything; the full editor records changes as adjustments to that placement
   (an offset, a size, new wording, a finish) keyed to each part's role. They survive every re-layout,
   so changing the stone, the size or even the layout keeps the person's touches, relative to where
   the layout puts each part. Parts the person adds themselves ride along as extra layers. */
var HS_ADJ_FIELDS = ['text', 'font', 'ht', 'track', 'size', 'sym', 'carve', 'paint', 'visible', 'w', 'h', 'ar', 'frame', 'photo', 'bstyle', 'inset', 'name', 'tone', 'look'];
/* Photo shapes, and the looks that turn a photo into something the carver can cut. */
var HS_PHOTO_SHAPES = [{ id: 'oval', label: 'Oval' }, { id: 'circle', label: 'Circle' }, { id: 'rect', label: 'Rectangle' }, { id: 'square', label: 'Square' }];
var HS_PHOTO_LOOKS = [
  { id: 'photo', label: 'Photo', sub: 'Just as it is', f: '' },
  { id: 'etched', label: 'Etched', sub: 'Fine stippled dots', f: 'et' },
  { id: 'sketch', label: 'Sketched', sub: 'Soft carved lines', f: 'sk' },
  { id: 'relief', label: 'Sculpted', sub: 'Raised in the stone', f: 'rl' }
];
function hsPhotoShapeLabel(f) { return (hsFind(HS_PHOTO_SHAPES, f || 'oval') || HS_PHOTO_SHAPES[0]).label; }
function hsPhotoRound(f) { return !f || f === 'oval' || f === 'circle'; }
function hsPhotoEven(f) { return f === 'circle' || f === 'square'; }
function hsPhotoMethod(l) {
  if (hsIsResvPhoto(l.photo)) return 'Reserved space for a portrait to be added later (leave uncut)';
  var lk = l.look || 'photo';
  if (lk === 'etched') return 'Stipple-etched portrait, processed from the photo';
  if (lk === 'sketch') return 'Line-etched sketch portrait, processed from the photo';
  if (lk === 'relief') return 'Sculpted relief portrait, hand-carved from the photo';
  if (l.carve === 'laser') return 'Laser-etched photo';
  return 'Porcelain photo medallion, ' + (l.tone === 'bw' ? 'black & white' : 'in color');
}
function hsPhotoShort(l) {
  var lk = l.look || 'photo';
  if (lk !== 'photo') return hsFind(HS_PHOTO_LOOKS, lk).label;
  return l.carve === 'laser' ? 'Laser-etched' : 'Porcelain' + (l.tone === 'bw' ? ' (B&W)' : '');
}
function hsHexLum(h) {
  var m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(h || ''); if (!m) return 0.5;
  return (0.2126 * parseInt(m[1], 16) + 0.7152 * parseInt(m[2], 16) + 0.0722 * parseInt(m[3], 16)) / 255;
}
/* Circles and squares are as tall as they are wide. */
function hsPhotoNorm(o, a) {
  if (o.type !== 'photo') return o;
  if (hsPhotoEven(o.frame) && !(a && a.h !== undefined)) { var s0 = Math.min(o.w, o.h); o.w = s0; o.h = s0; o.ar = 1; }
  return o;
}
