    /* Flower vases — shared by the guided steps and the full editor. Tap a style to add vases (tap it again to
       take them off), then choose any of left, middle and right. */
    var vz = dp.vase || {}, vzOn = hsVaseOn(dp), vzRise = vzOn ? hsVaseRise(dp) : 0, vzLy = hsIsLying(dp), vzSpots = hsVaseSpots(vz), vzSide = hsVaseHasSide(vz);
    var vzKind = vz.kind && vz.kind !== 'none' ? vz.kind : '';
    v.vaseOnDisp = vzKind ? 'flex' : 'none';
    v.vaseKindChips = HS_VASE_KINDS.map(function (x) {
      var on = vzKind === x.id, p = self.pill(on, accent, soft);
      return { label: x.label, bg: p.bg, bd: p.bd, pressed: p.pressed, icon: hsVasePath(x.id, 12, x.id === 'granite' ? 18 : 17), iconDisp: 'inline',
        fill: on ? accent : '#6f6a60', pick: function () { self.setVase({ kind: on ? 'none' : x.id }, on ? 'No flower vases' : 'Vases: ' + x.label); } };
    });
    var spotChip = function (id, label) {
      var on = vzSpots.indexOf(id) >= 0, p = self.pill(on, accent, soft);
      return { label: label, bg: p.bg, bd: p.bd, pressed: p.pressed, pick: function () {
        var cur = vzSpots.slice(), at = cur.indexOf(id);
        if (at >= 0) cur.splice(at, 1); else cur.push(id);
        self.setVase({ spots: cur, sides: null }, cur.length ? 'Vases: ' + cur.join(', ') : 'No vase positions');
      } };
    };
    v.vaseSideChips = [spotChip('left', 'Left'), spotChip('right', 'Right')];
    v.vaseFrontChips = [spotChip('fl', 'Left'), spotChip('front', 'Middle'), spotChip('fr', 'Right')];
    v.vaseSideTitle = vzLy ? 'Beside the marker' : 'Beside the stone';
    v.vaseFrontTitle = vzLy ? 'At the head' : 'In front';
    v.vaseLyDisp = vzOn && vzLy && vzSide ? 'flex' : 'none';
    v.vaseLyChips = HS_VASE_POS_LY.map(function (x) {
      var on = hsVaseLyPos(vz) === x.id, p = self.pill(on, accent, soft);
      return { label: x.label, bg: p.bg, bd: p.bd, pressed: p.pressed, pick: function () { self.setVase({ pos: x.id }, 'Side vases at the ' + x.label.toLowerCase()); } };
    });
    var vzW = hsVaseW(vz);
    v.vaseSizeLabel = vzW + '″ across × ' + hsVaseHt(vz) + '″ high';
    v.vaseSizeVal = vzW;
    v.vaseSmaller = function () { self.setVase({ size: Math.max(4, vzW - 0.5) }, 'Vase size'); };
    v.vaseLarger = function () { self.setVase({ size: Math.min(8, vzW + 0.5) }, 'Vase size'); };
    v.onVaseSize = function (e) { self.setVase({ size: parseFloat(e.target.value) }, 'Vase size'); };
    var vzTop = Math.max(0, hsR(dp.H - hsVaseHt(vz), 2));
    v.vaseRiseDisp = vzOn && vzSide && !vzLy ? 'flex' : 'none';
    v.vaseRiseLabel = vzRise ? hsIn(vzRise) + ' above the base' : 'Sitting on the base';
    v.vaseUp = function () { self.setVase({ vy: Math.min(vzTop, hsR(vzRise + 0.5, 2)), vfrac: null, pos: null }, 'Moved side vases up'); };
    v.vaseDown = function () { self.setVase({ vy: Math.max(0, hsR(vzRise - 0.5, 2)), vfrac: null, pos: null }, 'Moved side vases down'); };
    /* Quick heights for the walkthrough: on the base, or centered a quarter, half or three quarters up the stone. */
    var fracNow = typeof vz.vfrac === 'number' ? vz.vfrac : (vzRise === 0 ? 0 : -1);
    v.vaseHtChips = [[0, 'Base'], [0.25, 'Low'], [0.5, 'Middle'], [0.75, 'Top']].map(function (x) {
      var on = fracNow === x[0], p = self.pill(on, accent, soft);
      return { label: x[1], bg: p.bg, bd: p.bd, pressed: p.pressed, pick: function () { self.setVase({ vfrac: x[0], vy: null, pos: null }, 'Side vases: ' + x[1].toLowerCase()); } };
    });
    v.vaseRiseMax = vzTop; v.vaseRiseVal = vzRise;
    v.onVaseRise = function (e) { self.setVase({ vy: parseFloat(e.target.value), vfrac: null, pos: null }, 'Moved side vases'); };
    var notes = [];
    if (vzOn && vzSide) notes.push(vzLy ? 'Side vases sit on the base toward the ' + (hsVaseLyPos(vz) === 'top' ? 'top, so flowers never cover the lettering' : 'bottom') + '.' : vzRise ? 'Side vases hang from a clamp bolted to the side of the stone.' : 'Side vases sit on the base, which is lengthened ' + hsIn(hsVaseRoom(dp)) + ' at each end.');
    if (vzOn && vzSpots.indexOf('front') >= 0) notes.push(vzLy ? 'The middle vase sits on the base at the head of the marker.' : 'The middle vase stands in front; the base is deepened ' + hsIn(hsVaseFrontDepth(dp)) + ' and the lettering stays above it.');
    v.vaseNote = notes.join(' ');
