    v.shapes = HS_SHAPES.filter(function (x) { return x.id !== 'dheart' || f.who === 'two' || dp.shape === 'dheart'; }).map(function (x) {
      var on = dp.shape === x.id, p = self.pill(on, accent, soft);
      return { label: x.label, short: x.short, d: hsStonePath(x.id, 36, 24, hsIsLying(dp)), fill: on ? accent : '#6f6a60', bg: p.bg, bd: p.bd, pressed: p.pressed, pick: function () { self.editDesign(function (d) { d.shape = x.id; }); } };
    });
    v.materials = HS_MATERIALS.map(function (x) {
      var on = dp.material === x.id;
      return { label: x.label, pressed: on ? 'true' : 'false', ring: on ? accent : 'transparent',
        swatch: hsGraniteBg(x),
        pick: function () { self.editDesign(function (d) { d.material = x.id; }); } };
    });
    v.materialLabel = m.label;
    v.wLabel = W + '″'; v.hLabel = H + '″'; v.baseLabel = (W + 2 * hsBaseX(dp)) + '″ wide';
    v.wMinus = function () { self.resize(-2, 0); }; v.wPlus = function () { self.resize(2, 0); };
    v.hMinus = function () { self.resize(0, -1); }; v.hPlus = function () { self.resize(0, 1); };
    v.base = !!dp.base;
    v.toggleBase = function () { self.editDesign(function (d) { d.base = !d.base; }); };
    var canBase = tyP.baseH > 0, bx = hsBaseX(dp);
    v.baseOnDisp = canBase && dp.base ? 'flex' : 'none';
    /* One control for the base: stepping down to nothing means no base at all. */
    var bx0 = hsBaseX0(dp), bRoom = dp.base ? hsVaseRoom(dp) : 0;
    v.baseOverLabel = dp.base ? bx0 + '″ each side' + (bRoom ? ' (+' + hsR(bRoom, 1) + '″ vase)' : '') + ' · ' + (W + 2 * bx) + '″ wide' : 'No base';
    v.baseOverMinus = function () { self.editDesign(function (d) { if (!d.base) return; if (hsBaseX0(d) <= 1) d.base = false; else d.baseOver = hsBaseX0(d) - 1; }, true, true, 'Base size'); };
    var bhNow = hsBaseH(dp) || tyP.baseH, bdNow = hsBaseD0(dp), lyingB = hsIsLying(dp);
    v.baseSizeDisp = dp.base ? 'flex' : 'none'; v.baseDepthDisp = dp.base && !lyingB ? 'flex' : 'none';
    v.baseHtLabel = bhNow + '″ high';
    v.baseDepthLabel = hsBaseD0(dp) + '″ deep' + (hsVaseFrontDepth(dp) ? ' (+' + hsR(hsVaseFrontDepth(dp), 1) + '″ vase)' : '');
    v.baseHtMinus = function () { self.editDesign(function (d) { d.baseHt = Math.max(2, hsBaseH(d) - 1); }, true, true, 'Base height'); };
    v.baseHtPlus = function () { self.editDesign(function (d) { d.baseHt = Math.min(12, hsBaseH(d) + 1); }, true, true, 'Base height'); };
    v.baseDepthMinus = function () { self.editDesign(function (d) { d.baseDepth = Math.max(8, hsBaseD0(d) - 1); }, true, true, 'Base depth'); };
    v.baseDepthPlus = function () { self.editDesign(function (d) { d.baseDepth = Math.min(24, hsBaseD0(d) + 1); }, true, true, 'Base depth'); };
    v.baseOverPlus = function () { self.editDesign(function (d) { if (!d.base) { d.base = true; d.baseOver = 1; } else d.baseOver = Math.min(8, hsBaseX0(d) + 1); }, true, true, 'Base size'); };
    var bSurfNow = dp.baseSurface || 'polished', bmNow = hsBaseMat(dp);
    v.baseSurfCards = HS_SURFACES.map(function (sf) {
      var on = bSurfNow === sf.id, p = self.pill(on, accent, soft), fc = hsSurfaceFace(bmNow, sf.id);
      var gl = sf.id === 'polished' ? 'linear-gradient(135deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0) 45%), ' : sf.id === 'honed' ? 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 60%), ' : '';
      return { label: sf.label, swatch: hsGraniteBg(bmNow, sf.id), bg: p.bg, bd: p.bd, pressed: p.pressed, pick: function () { self.editDesign(function (d) { d.baseSurface = sf.id; }, true, true); } };
    });
    v.baseEdgeChips = HS_EDGES.filter(function (e) { return !hsIsLying(dp) || e.id === 'smooth'; }).map(function (e) {
      var on = (dp.baseEdges || 'smooth') === e.id, p = self.pill(on, accent, soft);
      return { label: e.label, bg: p.bg, bd: p.bd, pressed: p.pressed, pick: function () { self.editDesign(function (d) { d.baseEdges = e.id; }, true, true); } };
    });
    v.baseShowDisp = canBase ? 'flex' : 'none';
    v.baseMatDisp = canBase && dp.base ? 'flex' : 'none';
    v.baseChoice = [['none', 'No base'], ['base', 'On a granite base']].map(function (x) {
      var on = (x[0] === 'base') === !!dp.base, p = self.pill(on, accent, soft);
      return { label: x[1] + (x[0] === 'base' ? ' (' + (W + 2 * hsBaseX(dp)) + '″ wide)' : ''), bg: p.bg, bd: p.bd, pressed: p.pressed, pick: function () { self.editDesign(function (d) { d.base = x[0] === 'base'; }, true, true); } };
    });
    v.baseMats = [null].concat(HS_MATERIALS).map(function (x) {
      var on = x ? dp.baseMat === x.id : !dp.baseMat, mm = x || m;
      return { label: x ? x.label : 'Match the stone', short: x ? x.label : 'Match', swatch: hsGraniteBg(mm),
        ring: on ? accent : '#d3cdc1', pressed: on ? 'true' : 'false', pick: function () { self.editDesign(function (d) { d.baseMat = x ? x.id : ''; }, true, true); } };
    });
    v.baseNote = dp.base ? 'The base is ' + hsBaseMat(dp).label + (dp.baseMat && dp.baseMat !== dp.material ? ', a contrast to the ' + m.label + ' stone.' : ', matching the stone.') : tyP.id === 'upright' ? 'Upright stones almost always stand on a base. Check with the cemetery before going without.' : 'A base lifts the marker a little and frames it.';
