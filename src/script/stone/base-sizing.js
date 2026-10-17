var HS_ROCK_BAND = 1.2;
function hsClear(d) {
  var c = d.params && d.params.edges === 'rock' ? 1 + HS_ROCK_BAND : 1;
  /* A bevel's sloped rim and a pillow's rounded edge leave less flat face for lettering. */
  if (d.type === 'bevel') c = Math.max(c, 1.5); else if (d.type === 'pillow') c = Math.max(c, 1.3);
  d.layers.forEach(function (l) {
    if (l.visible && l.type === 'border') c = Math.max(c, l.inset + (l.bstyle === 'double' ? 0.55 : 0) + 0.5);
  });
  return c;
}
function hsTypeOf(d) { return hsFind(HS_TYPES, d.type || 'upright'); }
function hsBaseH(d) { return d.base ? (typeof d.baseHt === 'number' ? d.baseHt : hsTypeOf(d).baseH) : 0; }
/* Front-to-back depth of a standing stone's base; a front vase needs extra room on top of it. */
function hsBaseD0(d) { return typeof d.baseDepth === 'number' ? d.baseDepth : (d.type === 'slant' ? 14 : 12); }
function hsBaseD(d) { return hsIsLying(d) ? d.H + 2 * hsBaseX0(d) + hsVaseTopRoom(d) : hsBaseD0(d) + hsVaseFrontDepth(d); }
function hsBaseX0(d) { return typeof d.baseOver === 'number' ? d.baseOver : hsTypeOf(d).baseX; }
/* A base that carries flower vases is lengthened on both ends so each vase has its own ledge. */
function hsBaseX(d) { return hsBaseX0(d) + (d.base && hsBaseH(d) ? hsVaseRoom(d) : 0); }

