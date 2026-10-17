    v.typeCards = HS_TYPES.map(function (t) {
      var on = tyP.id === t.id, p = self.pill(on, accent, soft);
      return { label: t.label, desc: t.desc, size: t.size, icon: t.icon, fill: on ? accent : '#6f6a60', bg: p.bg, bd: p.bd, pressed: p.pressed, pick: function () { self.setType(t.id); } };
    });
    var shapeTile = function (x) {
      var on = dp.shape === x.id, p = self.pill(on, accent, soft);
      var tw = x.id === 'dheart' ? 36 : 36, th = x.id === 'heart' ? 24 : 24;
      return { label: x.label, short: x.short, d: hsStonePath(x.id, tw, th, hsIsLying(dp)), fill: on ? accent : '#6f6a60', bg: p.bg, bd: p.bd, pressed: p.pressed, pick: function () { self.setShape(x.id); } };
    };
    var lyingNow = hsIsLying(dp);
    v.shapeStd = HS_SHAPES.filter(function (x) { return lyingNow ? x.id === 'flat' : !x.special; }).map(shapeTile);
    v.shapeLockDisp = lyingNow ? 'block' : 'none'; v.shapeFreeDisp = lyingNow ? 'none' : 'flex';
    var lyingT = dp.type === 'grass' || dp.type === 'bevel' || dp.type === 'pillow';
    v.mirrorShow = lyingT && dp.shape !== 'flat' && HS_MIRRORABLE.indexOf(dp.shape) >= 0;
    v.mirrorPressed = hsMirrorOn(dp) ? 'true' : 'false';
    v.mirrorBg = hsMirrorOn(dp) ? soft : '#ffffff'; v.mirrorBd = hsMirrorOn(dp) ? accent : '#cfc9bd'; v.mirrorFill = hsMirrorOn(dp) ? accent : '#6f6a60';
    v.mirrorD = hsStonePathMirror(HS_MIRRORABLE.indexOf(dp.shape) >= 0 ? dp.shape : 'serp', 36, 24);
    v.toggleMirror = function () { self.toggleMirror(); };
    var more = [], anA = st.analysis || hsAnalyze(f);
    var loveHint = anA.roles.indexOf('Wife') >= 0 || anA.roles.indexOf('Husband') >= 0 || anA.motifs.some(function (x) { return x.sym === 'hearts' || x.sym === 'heart'; }) || hsHas(anA.prefs.shapes, 'heart');
    var twoOk = f.who === 'two';
    if (loveHint) more.push('heart'); if (loveHint && twoOk) more.push('dheart');
    if (anA.reading) more.push('book');
    if (anA.motifs.some(function (x) { return x.sym === 'mountains'; }) || /mountain|hik|climb|peak/i.test(f.story || '')) more.push('mountain');
    if (/lake|sea|ocean|beach|sail|fish|boat|surf|river/i.test(f.story || '')) more.push('wave');
    if (/sunrise|morning|farm|field|garden|meadow/i.test(f.story || '')) more.push('hill');
    var suggested = more.length > 0;
    ['heart', 'dheart', 'book', 'wave', 'mountain', 'hill'].forEach(function (s) { if (s === 'dheart' && !twoOk) return; if (more.indexOf(s) < 0) more.push(s); });
    if (hsFind(HS_SHAPES, dp.shape).special && more.indexOf(dp.shape) < 0) more.push(dp.shape);
    v.shapeMore = lyingNow ? [] : more.map(function (id) { return shapeTile(hsFind(HS_SHAPES, id)); });
    v.hasMoreShapes = !lyingNow;
    v.moreShapesNote = suggested ? 'The first few are suggested from their story and style notes. Special shapes are cut to order and usually take longer.' : 'Special shapes are cut to order and usually take longer.';
    v.graniteCards = HS_MATERIALS.map(function (x) {
      var on = dp.material === x.id, p = self.pill(on, accent, soft);
      return { label: x.label, note: x.note, swatch: hsGraniteBg(x), bg: p.bg, bd: p.bd, pressed: p.pressed, pick: function () { self.setMaterial(x.id); } };
    });
    var layoutAll = HS_LAYOUTS.map(function (lay) {
      var on = pp.layout === lay.id, p = self.pill(on, accent, soft);
      var tmp = Object.assign({}, dp, { params: Object.assign({}, pp, { layout: lay.id }) });
      var tk = JSON.stringify([dp.W, dp.H, dp.shape, dp.type, tmp.params]);
      self._thumbs = self._thumbs || {};
      if (!self._thumbs[tk]) { self._thumbs[tk] = hsLayoutBest(tmp, C); var ks = Object.keys(self._thumbs); if (ks.length > 40) delete self._thumbs[ks[0]]; }
      var ls = self._thumbs[tk], textD = '', symD = '', photoD = '';
      ls.forEach(function (l) {
        var b = hsBox(l);
        if (!b) return;
        if (l.type === 'text') {
          hsLines(l).forEach(function (s, j) {
            var w = hsTextW(s, l.font, l.ht, l.track), cy = b.y0 + l.ht / 2 + j * l.ht * HS_LH, hh = l.ht * 0.8;
            textD += 'M' + hsR(l.x - w / 2) + ' ' + hsR(cy - hh / 2) + ' h' + hsR(w) + ' v' + hsR(hh) + ' h' + hsR(-w) + ' Z ';
          });
        } else if (l.type === 'symbol') symD += hsCirc(l.x, l.y, l.size * 0.42) + ' ';
        else if (l.type === 'photo') photoD += hsEll(l.x, l.y, l.w / 2, l.h / 2) + ' ';
      });
      return { id: lay.id, label: lay.label, desc: lay.desc, bg: p.bg, bd: p.bd, pressed: p.pressed, vb: '-1 -1 ' + (W + 2) + ' ' + (H + 2),
        stoneD: hsStoneFor(dp, W, H), face: m.face, ink: m.id === 'gray' ? '#3b3d42' : '#d5d7d9', textD: textD || 'M0 0', symD: symD || 'M0 0', photoD: photoD || 'M0 0',
        pick: function () { self.setParam({ layout: lay.id }); } };
    });
    var ASYM = { side: true, split: true };
    v.layoutSym = layoutAll.filter(function (c) { return !ASYM[c.id]; });
    v.layoutAsym = layoutAll.filter(function (c) { return ASYM[c.id]; });
    v.flipPressed = pp.flipX ? 'true' : 'false';
    v.flipBg = pp.flipX ? soft : '#ffffff'; v.flipBd = pp.flipX ? accent : '#d3cdc1';
    v.flipLabel = pp.flipX ? 'Mirrored' : 'Mirror';
    v.toggleFlip = function () { self.setParam({ flipX: !self.cur().params.flipX }); };
    v.flipNote = ASYM[pp.layout] || (pp.photo && (pp.photoPlace || 'left') !== 'top' && pp.photoPlace !== 'bottom') ? '' : 'Mirroring swaps the sides of the asymmetrical layouts.';
    v.dateChips = [['upper', 'Capitals'], ['long', 'Upper and lower case'], ['numeric', 'All numbers'], ['years', 'Years only']].map(function (x) {
      var on = (pp.dateStyle || 'upper') === x[0], p = self.pill(on, accent, soft);
      return { label: hsResvShow(hsDateLineW(C.born, C.passed, x[0], x[0] === 'years' ? ' — ' : ' – ', pp.dateWords)) || x[1], bg: p.bg, bd: p.bd, pressed: p.pressed, pick: function () { self.setParam({ dateStyle: x[0] }); } };
    });
