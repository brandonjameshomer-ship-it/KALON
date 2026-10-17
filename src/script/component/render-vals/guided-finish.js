    v.borderCards = [{ id: 'none', label: 'No border' }].concat(HS_BORDERS).map(function (bd) {
      var on = (pp.border || 'none') === bd.id, p = self.pill(on, accent, soft);
      var dash = bd.id === 'beaded' ? '0 5' : bd.id === 'rope' ? '3 1.5' : 'none';
      return { label: bd.label, face: m.face, ink: m.id === 'gray' ? '#3b3d42' : '#d5d7d9', d1: bd.id === 'none' ? 'none' : 'inline', d2: bd.id === 'double' ? 'inline' : 'none',
        sw: bd.id === 'beaded' ? 2.6 : bd.id === 'rope' ? 2 : 1.2, dash: dash, bg: p.bg, bd: p.bd, pressed: p.pressed, pick: function () { self.setParam({ border: bd.id }); } };
    });
    var carveChipList = function (key) {
      return HS_CARVES.map(function (c) {
        var on = (pp[key] || (key === 'carve' ? 'vcut' : 'frost')) === c.id, p = self.pill(on, accent, soft);
        var patch = {}; patch[key] = c.id;
        return { label: c.label, spec: c.spec, dot: hsCarveLook(c.id, m).color, bg: p.bg, bd: p.bd, pressed: p.pressed, pick: function () { self.setParam(patch); } };
      });
    };
    v.carveChips = carveChipList('carve');
    v.symCarveChips = carveChipList('symCarve');
    var surfNow = pp.surface || 'polished';
    v.surfaceCards = HS_SURFACES.map(function (sf) {
      var on = surfNow === sf.id, p = self.pill(on, accent, soft), fc = hsSurfaceFace(m, sf.id);
      var gl = sf.id === 'polished' ? 'linear-gradient(135deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0) 45%), ' : sf.id === 'honed' ? 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 60%), ' : '';
      return { label: sf.label, note: sf.note, swatch: hsGraniteBg(m, sf.id), bg: p.bg, bd: p.bd, pressed: p.pressed, pick: function () { self.setParam({ surface: sf.id }); } };
    });
    v.edgeChips = HS_EDGES.filter(function (e) { return !hsIsLying(dp) || e.id === 'smooth'; }).map(function (e) {
      var on = (pp.edges || 'smooth') === e.id, p = self.pill(on, accent, soft);
      return { label: e.label, bg: p.bg, bd: p.bd, pressed: p.pressed, pick: function () { self.setParam({ edges: e.id }); } };
    });
    var revOn = !!pp.reverseBefore;
    v.reverseDisp = revOn || surfNow === 'polished' ? 'flex' : 'none';
    v.reverseText = revOn ? 'Reverse look on: a soft ' + (surfNow === 'frosted' ? 'frosted' : 'honed') + ' face with polished, mirror-bright lettering. Undo puts back what you had.' : 'Love a glossy look? Try the reverse: a soft honed face with polished, mirror-bright lettering.';
    v.reverseBtn = revOn ? 'Undo' : 'Try it'; v.reversePressed = revOn ? 'true' : 'false';
    v.surfaceNote = hsFind(HS_SURFACES, surfNow).note;
    v.useReverse = function () { self.reverseLook(); };
    var present = {};
    dp.layers.forEach(function (l) { var g = hsLayerGroup(l); if (g && l.visible) { if (!present[g]) present[g] = l; } });
    v.finishRows = HS_FINISH_GROUPS.filter(function (g) { return !!present[g.id]; }).map(function (g) {
      var cur = present[g.id].carve || 'vcut', curPaint = present[g.id].paint || hsDefaultPaint(m);
      var fbNow = pp.finishBy || {}, follows = g.id !== 'name' && !fbNow[g.id];
      return {
        followText: follows ? 'Matches the name' : 'Set on its own', followDisp: g.id === 'name' ? 'none' : 'inline',
        matchDisp: g.id !== 'name' && !follows ? 'inline' : 'none', match: function () { self.matchName(g.id); },
        label: g.id === 'lines' ? present[g.id].name : g.label,
        chips: HS_CARVES.filter(function (c) { return c.id !== 'paint'; }).map(function (c) {
          var on = cur === c.id, p = self.pill(on, accent, soft), lk = hsCarveLook(c.id, m, curPaint, surfNow);
          return { label: c.label, spec: c.spec, dot: lk.gloss || lk.color, bg: p.bg, bd: p.bd, pressed: p.pressed, pick: function () { self.setFinish(g.id, c.id); } };
        }),
        isPaint: true,
        paints: HS_PAINTS.map(function (pc) {
          var on = cur === 'paint' && curPaint === pc.id;
          return { label: pc.label, col: pc.id, pressed: on ? 'true' : 'false', ring: on ? accent : '#d3cdc1', pick: function () { self.setPaint(g.id, pc.id); } };
        }),
        customNow: cur === 'paint' && curPaint ? curPaint : '#f4f1ea',
        customRing: cur === 'paint' && curPaint && !HS_PAINTS.some(function (pc) { return pc.id === curPaint; }) ? accent : '#d3cdc1',
        onCustom: function (e) { self.setPaint(g.id, e.target.value); }
      };
    });

