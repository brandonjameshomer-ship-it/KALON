/* The choices offered on the "Details in mind" step: common options the design system already knows how to build. */
var HS_PREF_GROUPS = [
  { id: 'types', label: 'Type of headstone' },
  { id: 'shapes', label: 'Shape' },
  { id: 'mats', label: 'Granite color' },
  { id: 'carves', label: 'Lettering finish' },
  { id: 'fonts', label: 'Lettering style' },
  { id: 'borders', label: 'Border' }
];
/* Lettering finishes offered as picks: every carving method plus the paint colors. */
function hsPrefFinishes() {
  return HS_CARVES.filter(function (c) { return c.id !== 'paint'; }).map(function (c) { return { id: c.id, label: c.label, carve: c.id }; })
    .concat(HS_PAINTS.map(function (pc) { return { id: 'paint:' + pc.id, label: pc.label + ' paint', carve: 'paint', paint: pc.id }; }));
}
function hsPrefList(form, g) { return ((form.prefs || {})[g] || []).slice(); }
/* Apply the person's own picks across the three designs, spreading several picks so each design explores one. */
function hsApplyPrefs(designs, form, C) {
  var pr = form.prefs || {}, any = HS_PREF_GROUPS.some(function (g) { return (pr[g.id] || []).length; });
  if (!any) return;
  /* The picks are the set to draw from. Each design keeps its own choice when it's one of the picks, otherwise it
     takes one; and when several were picked, the three designs between them show as many as they can. */
  var curOf = { types: function (d) { return d.type; }, shapes: function (d) { return d.shape; }, mats: function (d) { return d.material; },
    carves: function (d) { return d.params && (d.params.carve === 'paint' ? 'paint:' + d.params.paint : d.params.carve); }, fonts: function (d) { return d.params && d.params.fonts; }, borders: function (d) { return (d.params && d.params.border) || 'none'; } };
  var plan = {};
  HS_PREF_GROUPS.forEach(function (g) {
    var a = pr[g.id] || [];
    /* Two hearts belong to a stone shared by two people. */
    if (g.id === 'shapes' && form.who !== 'two') a = a.filter(function (x) { return x !== 'dheart'; });
    if (!a.length) return;
    var vals = designs.map(function (d, i) { var c = curOf[g.id](d); return a.indexOf(c) >= 0 ? c : a[i % a.length]; });
    var want = Math.min(a.length, designs.length);
    for (var guard = 0; guard < 6; guard++) {
      var distinct = vals.filter(function (x, k) { return vals.indexOf(x) === k; });
      if (distinct.length >= want) break;
      var unused = a.filter(function (x) { return vals.indexOf(x) < 0; })[0];
      for (var k = vals.length - 1; k > 0; k--) { if (vals.indexOf(vals[k]) !== k) { vals[k] = unused; break; } }
    }
    plan[g.id] = vals;
  });
  designs.forEach(function (d, i) {
    var picked = [];
    var take = function (g) { return plan[g] ? plan[g][i] : null; };
    var ty = take('types'), sh = take('shapes'), mt = take('mats'), cv = take('carves'), fo = take('fonts'), bd = take('borders');
    d.params = Object.assign({}, d.params);
    if (sh) { d.shape = sh; picked.push(hsFind(HS_SHAPES, sh).label); if ((sh === 'book' || sh === 'dheart') && d.params.layout !== 'split') d.params.layout = 'split'; else if (sh !== 'book' && sh !== 'dheart' && d.params.layout === 'split' && !C.partner) d.params.layout = 'classic'; }
    if (ty && ty !== d.type) { d.genType = ''; hsApplyType(d, ty); d.genType = d.type; d.genW = d.W; d.genH = d.H; picked.push(hsFind(HS_TYPES, ty).label); }
    else if (ty) picked.push(hsFind(HS_TYPES, ty).label);
    if (!(ty && ty !== d.type) && (sh === 'heart' || sh === 'dheart')) d.H = Math.max(d.H, Math.round(d.W * (sh === 'heart' ? 0.8 : 0.7)));
    if (mt) { d.material = mt; picked.push(hsFind(HS_MATERIALS, mt).label + ' granite'); }
    if (cv) {
      var fin = hsFind(hsPrefFinishes(), cv), cvc = fin.carve;
      d.params.carve = cvc; d.params.finishBy = {}; d.params.paintBy = {};
      d.params.symCarve = cvc === 'gold' || cvc === 'laser' || cvc === 'relief' || cvc === 'polish' || cvc === 'paint' ? cvc : 'frost';
      if (cvc === 'paint') d.params.paint = fin.paint;
      picked.push(fin.label.toLowerCase() + (cvc === 'paint' ? 'ed lettering' : ' lettering'));
    }
    if (fo) { d.params.fonts = fo; picked.push(hsFind(HS_FONTSETS, fo).label.toLowerCase() + ' lettering style'); }
    if (bd) { d.params.border = bd; picked.push(bd === 'none' ? 'no border' : hsFind(HS_BORDERS, bd).label.toLowerCase() + ' border'); }
    d.layers = hsLayoutBest(d, C, true);
    /* Drop any earlier note that the picks now contradict (a different granite, finish or shape). */
    var stale = [];
    if (mt) HS_MATERIALS.forEach(function (x) { stale.push(x.label.toLowerCase()); });
    if (cv) HS_CARVES.forEach(function (x) { stale.push(x.label.toLowerCase()); stale.push(x.id === 'vcut' ? 'v-cut' : x.label.toLowerCase()); stale.push('paint'); });
    if (sh || ty) HS_SHAPES.forEach(function (x) { stale.push(x.label.toLowerCase()); });
    var keep = d.why.filter(function (w) { var lw = String(w).toLowerCase(); return !stale.some(function (k) { return lw.indexOf(k) >= 0; }); });
    if (picked.length) d.why = ['Your picks: ' + picked.join(', ')].concat(keep.slice(0, 3));
  });
}


