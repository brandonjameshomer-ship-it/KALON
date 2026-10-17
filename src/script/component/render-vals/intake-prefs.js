    /* "Details in mind": optional picks the generator will honor, spread across the three designs. */
    var prefs = f.prefs || {};
    var togglePref = function (g, id) { var pr = Object.assign({}, self.state.form.prefs || {}), a = (pr[g] || []).slice(), k = a.indexOf(id); if (k >= 0) a.splice(k, 1); else a.push(id); pr[g] = a; self.setForm({ prefs: pr }); };
    var prefOn = function (g, id) { return (prefs[g] || []).indexOf(id) >= 0; };
    var prefChip = function (g, id, label, extra) { var on = prefOn(g, id), p = self.pill(on, accent, soft); return Object.assign({ label: label, bg: p.bg, bd: p.bd, pressed: p.pressed, check: on ? 'inline' : 'none', pick: function () { togglePref(g, id); } }, extra || {}); };
    v.prefTypes = HS_TYPES.map(function (t) { return prefChip('types', t.id, t.label, { icon: t.icon, fill: prefOn('types', t.id) ? accent : '#6f6a60' }); });
    v.prefShapes = HS_SHAPES.filter(function (x) { return x.id !== 'dheart' || f.who === 'two'; }).map(function (x) { return prefChip('shapes', x.id, x.label, { d: hsStonePath(x.id, 36, 24, false), fill: prefOn('shapes', x.id) ? accent : '#6f6a60' }); });
    v.prefMats = HS_MATERIALS.map(function (x) { return prefChip('mats', x.id, x.label, { swatch: hsGraniteBg(x), ring: prefOn('mats', x.id) ? accent : 'transparent' }); });
    v.prefCarves = hsPrefFinishes().map(function (c) { return prefChip('carves', c.id, c.label, { dot: c.paint || hsCarveLook(c.id, hsFind(HS_MATERIALS, 'black')).color }); });
    v.prefFonts = HS_FONTSETS.map(function (fs) { var f1 = hsFind(HS_FONTS, fs.name); return prefChip('fonts', fs.id, fs.label, { family: f1.family, fstyle: f1.style }); });
    v.prefBorders = [{ id: 'none', label: 'No border' }].concat(HS_BORDERS).map(function (bd) { return prefChip('borders', bd.id, bd.label); });
    var nPrefs = HS_PREF_GROUPS.reduce(function (n, g) { return n + (prefs[g.id] || []).length; }, 0);
    v.prefCount = nPrefs ? nPrefs + (nPrefs === 1 ? ' pick' : ' picks') + ' · the designs will use only what you picked, in any mix, and choose freely for everything else' : 'Nothing picked yet, so we’ll choose what suits them best';
    v.prefClearDisp = nPrefs ? 'inline-flex' : 'none';
    v.prefClear = function () { self.setForm({ prefs: {} }); };
    /* Each group is a dropdown: one open at a time, so the choices come a few at a time. Closed groups show what's picked. */
    var srcOf = { types: HS_TYPES, shapes: HS_SHAPES, mats: HS_MATERIALS, carves: hsPrefFinishes(), fonts: HS_FONTSETS, borders: [{ id: 'none', label: 'No border' }].concat(HS_BORDERS) };
    var openG = st.prefOpen || '';
    v.pg = {};
    HS_PREF_GROUPS.forEach(function (g) {
      var a = prefs[g.id] || [], on = openG === g.id;
      v.pg[g.id] = { disp: on ? 'flex' : 'none', exp: on ? 'true' : 'false', rot: on ? 180 : 0, bg: on ? '#fbf8f2' : '#ffffff',
        sum: a.length ? a.map(function (id) { return hsFind(srcOf[g.id], id).label; }).join(', ') : 'Any, we’ll choose', sumFg: a.length ? accent : '#5d584f',
        count: a.length, countDisp: a.length ? 'inline-flex' : 'none',
        toggle: function () { self.setState({ prefOpen: on ? '' : g.id }); } };
    });
