    var isText = !!sel && sel.type === 'text', isSymbol = !!sel && sel.type === 'symbol', isBorder = !!sel && sel.type === 'border', isPhoto = !!sel && sel.type === 'photo';
    v.hasSel = !!sel; v.noSel = !sel;
    v.selName = sel ? sel.name : '';
    v.selIsText = isText; v.selIsSymbol = isSymbol; v.selIsBorder = isBorder; v.selIsPhoto = isPhoto;
    v.selShowCarve = !!sel && !isPhoto;
    v.selMovable = !!sel && !isBorder;
    v.selText = isText ? hsResvShow(sel.text) : '';
    v.onText = function (e) {
      if (!sel) return;
      var nt = String(e.target.value).split('\n').slice(0, 4).join('\n'), keep = (String(sel.text || '').match(HS_RESV_RE) || [])[0];
      if (keep) nt = nt.replace('(date added later)', keep);
      self.updLayer(sel.id, { text: nt });
    };
    v.fontPills = HS_FONTS.map(function (ft) {
      var on = isText && sel.font === ft.id, p = self.pill(on, accent, soft);
      return { label: ft.label, family: ft.family, fstyle: ft.style, bg: p.bg, bd: p.bd, pressed: p.pressed, pick: function () { if (sel) self.updLayer(sel.id, { font: ft.id }); } };
    });
    v.selHt = isText ? sel.ht : 1; v.selHtLabel = isText ? hsIn(sel.ht) : '';
    v.onHt = function (e) { if (sel) self.updLayer(sel.id, { ht: parseFloat(e.target.value) }); };
    v.selTrack = isText ? sel.track : 0; v.selTrackLabel = isText ? hsR(sel.track).toFixed(2) + ' em' : '';
    v.onTrack = function (e) { if (sel) self.updLayer(sel.id, { track: parseFloat(e.target.value) }); };
    v.symbolSwap = HS_SYMBOLS.map(function (sy) {
      var on = isSymbol && sel.sym === sy.id, p = self.pill(on, accent, soft);
      return Object.assign(symPaint(sy, on ? accent : '#2b2925'), { label: sy.label, bg: p.bg, bd: p.bd, pressed: p.pressed, pick: function () {
        if (!sel) return;
        var patch = { sym: sy.id }, old = hsSymLabel(sel.sym);
        if (sel.name.indexOf(old) === 0) patch.name = sy.label + sel.name.slice(old.length);
        self.updLayer(sel.id, patch);
      } });
    });
    v.selSize = isSymbol ? sel.size : 4; v.selSizeLabel = isSymbol ? hsIn(sel.size) : '';
    v.onSize = function (e) { if (sel) self.updLayer(sel.id, { size: parseFloat(e.target.value) }); };
    v.photoSwap = st.photos.map(function (p) {
      var on = isPhoto && sel.photo === p.id;
      return { url: p.url, label: 'Use photo ' + p.name, pressed: on ? 'true' : 'false', bd: on ? accent : '#dcd7cc', pick: function () { if (sel) self.updLayer(sel.id, { photo: p.id }); } };
    });
    v.finishPills = [{ id: 'laser', label: 'Laser etch' }, { id: 'porcelain', label: 'Porcelain' }].map(function (x) {
      var on = isPhoto && sel.carve === x.id, p = self.pill(on, accent, soft);
      return { label: x.label, bg: p.bg, bd: p.bd, pressed: p.pressed, pick: function () { if (sel) self.updLayer(sel.id, { carve: x.id }); } };
    });
    var eLaser = isPhoto && sel.carve === 'laser', eLook = isPhoto ? (sel.look || 'photo') : 'photo', ePh = isPhoto ? C.photoById[sel.photo] : null;
    v.framePills = HS_PHOTO_SHAPES.map(function (x) {
      var on = isPhoto && (sel.frame || 'oval') === x.id, p = self.pill(on, accent, soft), sh = lkShape(x.id);
      return { label: x.label, sw: sh.w, sh: sh.h, srx: sh.rx, sry: sh.ry, sx: 12 - sh.w / 2, sy: 12 - sh.h / 2, bg: p.bg, bd: p.bd, pressed: p.pressed,
        pick: function () { if (!sel) return; var ev = hsPhotoEven(x.id); self.updLayer(sel.id, { frame: x.id, h: ev ? sel.w : hsR(sel.w * 1.28, 2), ar: ev ? 1 : 1.28 }); } };
    });
    v.edLookPills = HS_PHOTO_LOOKS.map(function (x) {
      var on = eLook === x.id, p = self.pill(on, accent, soft), fx = lkFor(x.id, eLaser, isPhoto && sel.tone === 'bw');
      return { label: x.label, url: ePh ? ePh.url : '', f: fx.f, blend: fx.blend, bg: p.bg, bd: p.bd, pressed: p.pressed, pick: function () { if (sel) self.updLayer(sel.id, { look: x.id }); } };
    });
    v.edTonePills = [['color', 'Color'], ['bw', 'Black & white']].map(function (x) {
      var on = isPhoto && (eLaser ? 'bw' : (sel.tone || 'color')) === x[0], p = self.pill(on, accent, soft);
      return { label: x[1], bg: p.bg, bd: p.bd, pressed: p.pressed, pick: function () { if (sel) self.updLayer(sel.id, x[0] === 'color' && eLaser ? { tone: 'color', carve: 'porcelain' } : { tone: x[0] }); } };
    });
    v.edPhotoPlainDisp = eLook === 'photo' ? 'flex' : 'none';
    v.edPhotoCarvedDisp = eLook === 'photo' ? 'none' : 'block';
    v.edLaserToneDisp = eLook === 'photo' && eLaser ? 'block' : 'none';
    v.selPw = isPhoto ? sel.w : 7; v.selPwLabel = isPhoto ? hsIn1(sel.w) + ' × ' + hsIn1(sel.h) : '';
    v.onPw = function (e) { if (sel) { var w = parseFloat(e.target.value); self.updLayer(sel.id, { w: w, h: hsR(w * (sel.ar || 1.3), 2) }); } };
    v.borderPills = HS_BORDERS.map(function (bd) {
      var on = isBorder && sel.bstyle === bd.id, p = self.pill(on, accent, soft);
      return { label: bd.label, bg: p.bg, bd: p.bd, pressed: p.pressed, pick: function () { if (sel) self.updLayer(sel.id, { bstyle: bd.id }); } };
    });
    v.selInset = isBorder ? sel.inset : 1; v.selInsetLabel = isBorder ? hsIn(sel.inset) : '';
    v.onInset = function (e) { if (sel) self.updLayer(sel.id, { inset: parseFloat(e.target.value) }); };
    v.carvePills = HS_CARVES.filter(function (c) { return c.id !== 'paint'; }).map(function (c) {
      var on = !!sel && sel.carve === c.id, p = self.pill(on, accent, soft);
      return { label: c.label, spec: c.spec, dot: hsCarveLook(c.id, m).color, bg: p.bg, bd: p.bd, pressed: p.pressed, pick: function () { if (sel) self.updLayer(sel.id, { carve: c.id }); } };
    });
    v.edPaintDisp = sel && sel.type !== 'photo' ? 'flex' : 'none';
    v.edPaintNow = sel && sel.carve === 'paint' ? (sel.paint || hsDefaultPaint(m)) : '#f4f1ea';
    v.edPaintCustom = function (e) { if (sel) self.updLayer(sel.id, { carve: 'paint', paint: e.target.value }); };
    v.edPaints = HS_PAINTS.map(function (pc) {
      var on = !!sel && sel.carve === 'paint' && (sel.paint || hsDefaultPaint(m)) === pc.id;
      return { label: pc.label, col: pc.id, pressed: on ? 'true' : 'false', ring: on ? accent : '#d3cdc1', pick: function () { if (sel) self.updLayer(sel.id, { carve: 'paint', paint: pc.id }); } };
    });
    v.selPosLabel = !sel || isBorder ? '' : sel.extra ? hsIn(sel.x) + ' L · ' + hsIn(sel.y) + ' T' : hsOffWords(hsR(sel.x - sel.bx, 2), hsR(sel.y - sel.by, 2)) || 'Not moved';
    v.nudgeL = function () { self.nudge(-0.25, 0); }; v.nudgeR = function () { self.nudge(0.25, 0); };
    v.nudgeU = function () { self.nudge(0, -0.25); }; v.nudgeD = function () { self.nudge(0, 0.25); };
    v.centerH = function () { if (sel && !isBorder) self.updLayer(sel.id, { x: W / 2 }, true, 'Centered ' + sel.name); };
    var selIssues = sel ? checks.filter(function (c) { return c.id === sel.id; }) : [];
    v.selIssues = selIssues.map(function (c) { return { text: c.text }; });
    v.selHasIssue = selIssues.length > 0 && !isBorder;
    v.fitSel = function () { if (sel) self.fitLayer(sel.id); };
    v.forward = function () { self.move(1); }; v.backward = function () { self.move(-1); };
    v.duplicate = function () { self.duplicate(); }; v.remove = function () { self.remove(); };
