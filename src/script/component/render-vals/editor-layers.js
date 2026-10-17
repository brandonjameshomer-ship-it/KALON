    v.letterPresets = [{ label: 'Name', kind: 'name' }, { label: 'Dates', kind: 'dates' }, { label: 'Epitaph', kind: 'epitaph' }, { label: 'Free text', kind: 'text' }]
      .map(function (x) { return { label: x.label, add: function () { self.addText(x.kind); } }; });
    v.photoTiles = st.photos.map(function (p) { return { url: p.url, label: 'Place photo ' + p.name, add: function () { self.addPhoto(p.id); } }; });
    var symPaint = function (sy, color) { return { d: sy.d, fill: sy.mode === 'fill' ? color : 'none', stroke: sy.mode === 'stroke' ? color : 'none', sw: sy.sw || 0 }; };
    v.symbolTiles = HS_SYMBOLS.map(function (sy) {
      return Object.assign(symPaint(sy, '#2b2925'), { label: sy.label, short: sy.short, aria: 'Add symbol: ' + sy.label, add: function () { self.addSymbol(sy.id); } });
    });
    v.addBorder = function () { self.addBorder(); };

    v.rtabs = [{ id: 'layers', label: 'Layers' }, { id: 'measure', label: 'Measurements' }, { id: 'handoff', label: 'Handoff' }].map(function (t) {
      var on = st.rtab === t.id;
      return { label: t.label, pressed: on ? 'true' : 'false', bd: on ? accent : 'transparent', fg: on ? '#1e1c19' : '#5d584f', pick: function () { self.setState({ rtab: t.id, status: '' }); } };
    });
    var ltab = st.ltab || 'design';
    v.ltabs = [{ id: 'design', label: 'Design' }, { id: 'measure', label: 'Measurements' }, { id: 'handoff', label: 'Handoff' }].map(function (t) {
      var on = ltab === t.id;
      return { label: t.label, pressed: on ? 'true' : 'false', bd: on ? accent : 'transparent', fg: on ? '#1e1c19' : '#5d584f', pick: function () { self.setState({ ltab: t.id, status: '' }); } };
    });
    v.isLTabDesign = ltab === 'design'; v.lMeasDisp = ltab === 'design' ? 'none' : 'flex';
    v.isTabLayers = true; v.isTabMeasure = ltab === 'measure'; v.isTabHandoff = ltab === 'handoff';
    v.hasIssues = checks.length > 0; v.noIssues = checks.length === 0;
    v.issueTitle = checks.length + (checks.length === 1 ? ' small thing to tidy' : ' small things to tidy');
    v.issues = checks.map(function (c) { return { text: c.text, select: function () { self.setState({ selLayer: c.id, rtab: 'layers' }); } }; });
    v.reflow = function () { self.reflow(); };

    var sel = null;
    dp.layers.forEach(function (l) { if (l.id === st.selLayer) sel = l; });
    v.layerCount = dp.layers.length + (dp.layers.length === 1 ? ' layer' : ' layers');
    v.layerRows = dp.layers.slice().reverse().map(function (l) {
      var on = sel && l.id === sel.id, c = hsFind(HS_CARVES, l.carve);
      var r = { name: l.name, pressed: on ? 'true' : 'false', bg: on ? soft : '#ffffff', bd: on ? accent : '#e2ddd3',
        nameColor: l.visible ? '#1e1c19' : '#7d766b', eyeD: l.visible ? HS_EYE_OPEN : HS_EYE_SHUT, eyeColor: l.visible ? '#3d3a34' : '#7d766b',
        eyeLabel: (l.visible ? 'Hide ' : 'Show ') + l.name,
        select: function () { self.setState({ selLayer: l.id }); },
        toggle: function () { self.updLayer(l.id, { visible: !l.visible }); },
        del: function () { self.setState({ selLayer: l.id }); self.state.selLayer = l.id; self.remove(); },
        dragBd: st.layOver === l.id && st.layDrag && st.layDrag !== l.id ? accent : on ? accent : '#e2ddd3',
        onDragStart: function (e) { try { e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', l.id); } catch (err) {} self.setState({ layDrag: l.id }); },
        onDragOver: function (e) { if (!self.state.layDrag) return; e.preventDefault(); if (self.state.layOver !== l.id) self.setState({ layOver: l.id }); },
        onDrop: function (e) { e.preventDefault(); var from = self.state.layDrag; self.setState({ layDrag: null, layOver: null }); if (from && from !== l.id) self.restack(from, l.id); },
        onDragEnd: function () { self.setState({ layDrag: null, layOver: null }); } };
      var hid = l.visible ? '' : 'Hidden · ';
      var aj = l.extra ? null : (pp.adj || {})[l.key];
      r.tag = l.extra ? 'Added' : aj && HS_ADJ_SIZE.some(function (k) { return aj[k] !== undefined; }) ? 'Adjusted' : '';
      r.tagDisp = r.tag ? 'inline-block' : 'none';
      r.tagBg = l.extra ? '#e4efe8' : '#f4efe4'; r.tagFg = l.extra ? '#23553f' : '#6b5220';
      if (l.type === 'text') {
        r.sub = hid + hsFind(HS_FONTS, l.font).label + ' · ' + hsIn(l.ht) + ' · ' + c.label;
        r.iconVB = '0 0 24 24'; r.iconD = 'M5 6 H19 M12 6 V19'; r.iconFill = 'none'; r.iconStroke = '#3d3a34'; r.iconSW = 2.2;
      } else if (l.type === 'symbol') {
        var sy = hsFind(HS_SYMBOLS, l.sym);
        r.sub = hid + sy.label + ' · ' + hsIn(l.size) + ' · ' + c.label;
        r.iconVB = '0 0 100 100'; r.iconD = sy.d; r.iconFill = sy.mode === 'fill' ? '#3d3a34' : 'none'; r.iconStroke = sy.mode === 'stroke' ? '#3d3a34' : 'none'; r.iconSW = (sy.sw || 0) * 1.4;
      } else if (l.type === 'photo') {
        r.sub = hid + hsPhotoShort(l) + ' · ' + hsPhotoShapeLabel(l.frame) + ' · ' + hsIn1(l.w) + ' × ' + hsIn1(l.h);
        r.iconVB = '0 0 24 24'; r.iconD = 'M4 6 H20 V18 H4 Z M4 15 L9 11 L13 14 L16 12 L20 15'; r.iconFill = 'none'; r.iconStroke = '#3d3a34'; r.iconSW = 1.8;
      } else {
        r.sub = hid + hsFind(HS_BORDERS, l.bstyle).label + ' · ' + hsIn(l.inset) + ' inset · ' + c.label;
        r.iconVB = '0 0 24 24'; r.iconD = 'M4 20 V8 Q4 4 8 4 H16 Q20 4 20 8 V20 Z'; r.iconFill = 'none'; r.iconStroke = '#3d3a34'; r.iconSW = 2;
      }
      return r;
    });

