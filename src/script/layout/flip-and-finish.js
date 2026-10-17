/* Mirror a layout left-to-right, so a panel, portrait or side can swap to whichever side fits the stone better. */
function hsFlipX(layers, d) {
  if (!d.params || !d.params.flipX) return layers;
  var nat = layers._natH;
  layers.forEach(function (l) { if (l.type !== 'border' && typeof l.x === 'number') l.x = hsR(d.W - l.x, 2); });
  layers._natH = nat;
  return layers;
}
function hsFinishLayers(layers, p) {
  var fb = p.finishBy || {}, pb = p.paintBy || {};
  /* Every other part follows the name's finish (symbols and border included) until it's set on its own,
     so changing the lettering never leaves the symbols a different color. */
  layers.forEach(function (l) {
    /* When the dates wrap onto two lines, the line break already reads as "to", so the dash is dropped. */
    if (l.type === 'text' && /dates|years/i.test(l.name || '') && String(l.text).indexOf('\n') >= 0)
      l.text = String(l.text).replace(/[ \t]*[–—·][ \t]*\n[ \t]*/g, '\n').replace(/\n[ \t]*[–—·][ \t]*/g, '\n');
    var g = hsLayerGroup(l);
    if (!g) return;
    var own = !!fb[g], src = own ? g : fb.name ? 'name' : '';
    if (src) l.carve = fb[src];
    if (l.carve === 'paint') l.paint = (src && pb[src]) || pb[g] || p.paint || '';
  });
  return layers;
}
