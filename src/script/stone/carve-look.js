function hsIsLying(d) { return d.type === 'grass' || d.type === 'bevel' || d.type === 'pillow'; }
function hsBaseMat(d) { return hsFind(HS_MATERIALS, d.baseMat || d.material); }
function hsCarveLook(carve, m, paint, surface) {
  if (carve === 'polish') {
    /* Polished lettering is simply the granite's own deep, polished color showing through the softer face. */
    return { color: surface === 'polished' || !surface ? hsMix(m.face, '#ffffff', 0.07) : m.face, fkey: 'flat', op: 1, shadow: 'none' };
  }
  if (carve === 'paint') {
    var pc = paint || hsDefaultPaint(m);
    return { color: pc, fkey: 'vcut', op: 1, shadow: '0 -0.9px 0.9px rgba(0, 0, 0, 0.7), 0 0.7px 0 rgba(255, 255, 255, 0.14)' };
  }
  if (carve === 'frost' && surface === 'frosted') return { color: hsMix(m.frost, '#ffffff', 0.35), fkey: 'flat', op: 0.94, shadow: 'none' };
  if (carve === 'frost') return { color: m.frost, fkey: 'flat', op: 0.94, shadow: 'none' };
  if (carve === 'relief') return { color: m.relief, fkey: 'relief', op: 1, shadow: '1.3px 2px 2px rgba(0, 0, 0, 0.6), -0.6px -0.6px 0.6px rgba(255, 255, 255, 0.14)' };
  if (carve === 'laser') return { color: '#e6e6e3', fkey: 'flat', op: 0.82, shadow: 'none' };
  if (carve === 'gold') return { color: '#c9a24b', fkey: 'gold', op: 1, shadow: '0 -0.8px 0.8px rgba(0, 0, 0, 0.7), 0 0.6px 0 rgba(255, 232, 160, 0.35)' };
  return { color: m.cut, fkey: 'vcut', op: 1, shadow: '0 -0.9px 0.9px rgba(0, 0, 0, 0.8), 0 0.8px 0 rgba(255, 255, 255, 0.16)' };
}

