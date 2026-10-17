    var ptn = pp.partner || {};
    v.splitDisp = pp.layout === 'split' ? 'flex' : 'none';
    v.ptName = ptn.name || ''; v.ptBorn = ptn.born || ''; v.ptPassed = ptn.passed || '';
    var setPt = function (k) { return function (e) { var n = Object.assign({}, self.cur().params.partner || {}); n[k] = e.target.value; self.setParam({ partner: n }); }; };
    v.onPtName = setPt('name'); v.onPtBorn = setPt('born'); v.onPtPassed = setPt('passed');
    var fromIntake = !!C.partner;
    v.manualPtDisp = fromIntake ? 'none' : 'flex'; v.intakePtDisp = fromIntake ? 'flex' : 'none';
    v.intakePtText = fromIntake ? 'One side for ' + (C.np.first || C.np.full) + ', one for ' + (C.partner.np.first || C.partner.np.full) + ', from your answers.' : '';
    v.storyModeChips = [['own', 'Their own sides', 'A symbol from each of their stories'], ['blended', 'Blended together', 'One shared symbol on both sides']].map(function (x) {
      var on = (pp.storyMode || 'own') === x[0], p = self.pill(on, accent, soft);
      return { label: x[1], desc: x[2], bg: p.bg, bd: p.bd, pressed: p.pressed, pick: function () { self.setParam({ storyMode: x[0] }); } };
    });
    v.splitNote = ptn.name ? 'Each side holds one of them. Your chosen quote is shared beneath.' : 'For one person, their name and dates sit on one side and their words and portrait or symbol on the other. Add a partner to make it a companion stone.';
    v.roomNote = 'To keep everything clear and easy to carve, we gently left off ' + (left.length > 1 ? left.slice(0, -1).join(', ') + ' and ' + left[left.length - 1] : left[0] || '') + ' at this size. A larger size, a different layout, or fewer lines will make room.';
    v.photoChoices = [null].concat(st.photos).map(function (ph) {
      var id = ph ? ph.id : '', on = (pp.photo || '') === id;
      return { label: ph ? 'Use photo ' + ph.name : 'No photo', url: ph ? ph.url : '', imgDisp: ph ? 'block' : 'none', noneDisp: ph ? 'none' : 'block', pressed: on ? 'true' : 'false', bd: on ? accent : '#d3cdc1', pick: function () { self.setParam({ photo: id }); } };
    });
    v.gPhotoOn = !!pp.photo && !!C.photoById[pp.photo];
    var dSh = dp.shape, dHrt = dSh === 'heart' || dSh === 'dheart', effPlace = !dHrt && pp.layout === 'below' && pp.photoPlace !== 'top' ? 'bottom' : dHrt || dSh === 'teardrop' ? 'top' : (pp.photoPlace || 'left');
    v.placeChips = [['left', 'Left'], ['right', 'Right'], ['top', 'Above'], ['bottom', 'Below']].map(function (x) {
      var on = effPlace === x[0], p = self.pill(on, accent, soft);
      return { label: x[1], bg: p.bg, bd: p.bd, pressed: p.pressed, pick: function () { self.setParam({ photoPlace: x[0] }); } };
    });
    v.photoFinishChips = [['laser', 'Laser etch'], ['porcelain', 'Porcelain']].map(function (x) {
      var on = (pp.photoFinish || 'laser') === x[0], p = self.pill(on, accent, soft);
      return { label: x[1], bg: p.bg, bd: p.bd, pressed: p.pressed, pick: function () { self.setParam({ photoFinish: x[0] }); } };
    });
    v.laserWarnDisp = v.gPhotoOn && (pp.photoLook || 'photo') === 'photo' && (pp.photoFinish || 'laser') === 'laser' && !m.laserOk ? 'block' : 'none';
    var lkShape = function (id) { return id === 'circle' ? { w: 16, h: 16, rx: 8, ry: 8 } : id === 'square' ? { w: 16, h: 16, rx: 2, ry: 2 } : id === 'rect' ? { w: 13, h: 18, rx: 2, ry: 2 } : { w: 13, h: 18, rx: 6.5, ry: 9 }; };
    var lkFor = function (lk, laser, bw) {
      var x = hsFind(HS_PHOTO_LOOKS, lk);
      if (x.f) return { f: 'url(#lkp-' + x.f + ')', blend: 'normal' };
      return { f: laser || bw ? 'url(#lkp-bw)' : 'none', blend: laser ? 'screen' : 'normal' };
    };
    v.lkBg = m.face; v.lkLc = hsMix(m.frost, '#ffffff', 0.12); v.lkCol = hsMix(m.frost, '#ffffff', hsHexLum(m.face) < 0.32 ? 0.3 : 0.55);

    var gPh = v.gPhotoOn ? C.photoById[pp.photo] : null, gLook = pp.photoLook || 'photo', gLaser = (pp.photoFinish || 'laser') === 'laser';
    v.lookChips = HS_PHOTO_LOOKS.map(function (x) {
      var on = gLook === x.id, p = self.pill(on, accent, soft), fx = lkFor(x.id, gLaser, pp.photoTone === 'bw');
      return { label: x.label, sub: x.sub, url: gPh ? gPh.url : '', f: fx.f, blend: fx.blend, bg: p.bg, bd: p.bd, pressed: p.pressed,
        pick: function () { self.setParam({ photoLook: x.id }, 'Photo look: ' + x.label); } };
    });
    v.photoShapeChips = HS_PHOTO_SHAPES.map(function (x) {
      var on = (pp.photoShape || 'oval') === x.id, p = self.pill(on, accent, soft), sh = lkShape(x.id);
      return { label: x.label, sw: sh.w, sh: sh.h, srx: sh.rx, sry: sh.ry, sx: 12 - sh.w / 2, sy: 12 - sh.h / 2, bg: p.bg, bd: p.bd, pressed: p.pressed,
        pick: function () { self.setParam({ photoShape: x.id }, 'Photo shape: ' + x.label); } };
    });
    v.photoToneChips = [['color', 'Color'], ['bw', 'Black & white']].map(function (x) {
      var on = (gLaser ? 'bw' : (pp.photoTone || 'color')) === x[0], p = self.pill(on, accent, soft);
      return { label: x[1], bg: p.bg, bd: p.bd, pressed: p.pressed,
        pick: function () { self.setParam(x[0] === 'color' && gLaser ? { photoTone: 'color', photoFinish: 'porcelain' } : { photoTone: x[0] }, 'Photo in ' + x[1].toLowerCase()); } };
    });
    v.photoPlainDisp = gLook === 'photo' ? 'flex' : 'none';
    v.photoCarvedDisp = gLook === 'photo' ? 'none' : 'block';
    v.photoLaserToneDisp = gLook === 'photo' && gLaser ? 'block' : 'none';
