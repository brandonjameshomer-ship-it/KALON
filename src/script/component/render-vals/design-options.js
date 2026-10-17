    v.opts = st.designs.map(function (d, i) {
      var W = d.W, H = d.H, m = hsFind(HS_MATERIALS, d.material), shp = hsFind(HS_SHAPES, d.shape), ty = hsTypeOf(d);
      var isSel = i === st.sel;
      var baseH = hsBaseH(d), baseX = hsBaseX(d);
      /* Markers are seen from above, so their base is a slab showing all the way around, not a plinth underneath. */
      var lyingBase = baseH > 0 && (d.type === 'bevel' || d.type === 'pillow' || d.type === 'grass'), baseXv = hsBaseX0(d), below = lyingBase ? baseXv : baseH;
      var mL = 4.6 + (lyingBase ? baseX : 0), mR = 5.8 + (lyingBase ? baseX : 0), mT = 1.6 + (lyingBase ? baseXv + hsVaseTopRoom(d) : 0), mB = below + 3.4;
      /* Room beside the stone for flower vases (and the lengthened base that carries them). */
      var vOn = hsVaseOn(d), vExtL = 0, vExtR = 0, dimX = 4.2;
      if (vOn) {
        var vExt0 = 0.4 + hsVaseW(d.vase) + 0.8, bExt0 = baseH > 0 ? baseX + 0.4 : 0;
        hsVaseSides(d.vase, d).forEach(function (sd) { if (sd === 'left') vExtL = vExt0; else if (sd === 'right') vExtR = vExt0; });
        vExtL = Math.max(vExtL, bExt0); vExtR = Math.max(vExtR, bExt0);
        dimX = vExtR ? Math.max(4.2, vExtR + 3.6) : 4.2;
        mL = Math.max(mL, vExtL + (vExtL ? 4.6 : 1)); mR = Math.max(mR, dimX + 1.6);
      }
      var vbW = hsR((W + mL + mR) * K, 1), vbH = hsR((H + mT + mB) * K, 1), offX = mL * K, offY = mT * K;
      var vb = [-mL * K, -mT * K, vbW, vbH].map(function (n) { return hsR(n, 1); }).join(' ');
      var stoneD = hsStoneFor(d, W * K, H * K);
      var cardW = (LW - 128) / 3, cardH = Math.max(250, Math.min(326 * Math.max(1, cardW / 437), LH - 172 - 378 - 12));
      var baseLeft = hsR(40 + i * (cardW + 24)), delay = st.revealing ? (i * 0.12) + 's' : '0s';
      var o = { num: i + 1, title: d.title, vb: vb, stoneD: stoneD, face: m.face, edge: m.edge, z: isSel ? 3 : 1, porigin: '50% 50%' };
      var dpar = d.params || {}, surf = dpar.surface || 'polished';
      o.faceS = hsSurfaceFace(m, surf);
      o.grainOp = surf === 'frosted' ? 0.55 : surf === 'honed' ? 0.3 : 0.35;
      o.sheenOp = surf === 'polished' ? 1 : surf === 'honed' ? 0.25 : 0;
      o.clipStone = 'stoneclip-' + i;
      var rock = dpar.edges === 'rock', RB = HS_ROCK_BAND;
      o.rockDisp = rock ? 'inline' : 'none';
      o.rockCol = hsMix(hsMix(m.face, m.frost, 0.38), '#8a8578', 0.12); o.rockCol2 = hsMix(m.frost, '#ffffff', 0.3);
      var rr = hsRng(hsHash(String(W) + 'x' + H + d.shape)), dots = function (n, lo, hi) { var a = []; for (var q = 0; q < n; q++) a.push(0, hsR((lo + rr() * (hi - lo)) * K, 1)); return a.join(' '); };
      o.rockW = hsR(2 * RB * 0.62 * K); o.rockW2 = hsR(2 * RB * 0.95 * K); o.rockW4 = hsR(2 * RB * 0.82 * K);
      o.rockDash = dots(14, 0.7, 2.2); o.rockDash3 = dots(14, 0.5, 1.6); o.rockOff = hsR(0.7 * K);
      o.rockW3 = hsR(2 * RB * 0.55 * K); o.rockDash2 = dots(18, 0.25, 0.9); o.rockW5 = hsR(0.5 * K);
      var showWarn = isSel && ((guided && st.gstep >= 3 && st.gstep <= 5) || edit), stt = showWarn ? self.statusOf(d) : null;
      o.spec = ty.label + ' · ' + W + '″ × ' + H + '″ ' + shp.label.toLowerCase() + ' · ' + m.label;
      o.groupLabel = 'Design ' + (i + 1) + ': ' + d.title;
      o.aria = d.title + ': ' + ty.label + ' headstone, ' + shp.label + ', in ' + m.label + ' granite, ' + W + ' by ' + H + ' inches';
      o.chooseLabel = 'Choose design ' + (i + 1) + ', ' + d.title;
      o.choose = function () { self.choose(i); };
      var dir = i < st.sel ? -1 : 1, slow = false;
      o.padB = 10;
      if (!chosen) {
        o.px = baseLeft; o.py = 172; o.pw = hsR(cardW); o.ph = hsR(cardH);
        o.ptf = 'translateY(' + (st.revealed ? 0 : 40) + 'px)'; o.pop = st.revealed ? 1 : 0; o.pvis = 'visible';
        o.pbg = '#e7e2d7'; o.prad = '14px 14px 0 0'; o.pad = 10; o.padT = 10;
        o.itf = o.ptf; o.iop = o.pop; o.ivis = 'visible';
      } else if (isSel) {
        o.pbg = 'rgba(231, 226, 215, 0)'; o.prad = '0px'; o.pop = 1; o.pvis = 'visible'; o.ptf = 'translateY(0px)';
        o.itf = 'translateY(30px)'; o.iop = 0; o.ivis = 'hidden';
        if (edit) { o.px = 300; o.py = 64; o.pw = LW - 660; o.ph = LH - 64; o.pad = 18; o.padT = 22; o.padB = 18; }
        else if (guided) { o.px = 0; o.py = 64; o.pw = LW - 420; o.ph = LH - 64; o.pad = 30; o.padT = 40; o.padB = 40; }
        else if (fin) {
          slow = true;
          /* Close to the camera: the stone is larger and nearer the bottom of the view; flat markers come
             closest and tilt less, so their lettering can actually be read. */
          var fp = hsFinPlace(d), fsc = fp.sc * scS;
          o.pw = hsR(vbW * fsc); o.ph = hsR(vbH * fsc); o.pad = 0; o.padT = 0; o.padB = 0;
          var bottomY = (offY + (H + below) * K) * fsc, fCx = scX0 + fp.cx * scS, fFoot = 64 + scY0 + (fp.foot - 64) * scS;
          o.px = hsR(fCx - (offX + W * K / 2) * fsc); o.py = hsR(fFoot - bottomY);
          o.porigin = '50% ' + hsR(bottomY) + 'px';
          o.ptf = fp.tf;
        } else { o.px = 0; o.py = 64; o.pw = LW; o.ph = LH - 64; o.pad = 40; o.padT = 96; o.padB = 110; }
      } else {
        o.px = baseLeft; o.py = 172; o.pw = hsR(cardW); o.ph = hsR(cardH);
        o.ptf = 'translateX(' + (dir * (LW + 60)) + 'px)'; o.pop = 0; o.pvis = 'hidden';
        o.pbg = '#e7e2d7'; o.prad = '14px 14px 0 0'; o.pad = 10; o.padT = 10;
        o.itf = o.ptf; o.iop = 0; o.ivis = 'hidden';
      }
      o.ix = baseLeft; o.iy = hsR(172 + cardH); o.iw = hsR(cardW); o.ih = hsR(Math.min(378, LH - 172 - cardH - 8));
      o.pfilter = fin && isSel ? { morning: 'sepia(0.08) saturate(0.84) contrast(0.92) brightness(1.06) blur(0.3px)', afternoon: 'sepia(0.14) saturate(0.86) contrast(0.93) brightness(1.04) blur(0.3px)', evening: 'sepia(0.3) saturate(0.82) contrast(0.9) brightness(0.9) blur(0.3px)', night: 'sepia(0.06) saturate(0.6) contrast(0.9) brightness(0.62) blur(0.3px)' }[finMo ? finMo.tod : 'afternoon'] : 'none';
      o.lightDisp = fin && isSel && !(finMo && finMo.tod === 'night') ? 'inline' : 'none';
      o.gWarm = 'warm-' + i;
      var cw = o.pw - 2 * o.pad, ch = o.ph - o.padT - o.padB;
      o.vbW = vbW; o.vbH = vbH;
      o.sc = hsR(Math.min(cw / vbW, ch / vbH), 4);
      o.scx = hsR(o.pw / 2); o.scy = hsR(o.padT + ch / 2);
      o.ptrans = mkTrans(delay, o.pvis === 'hidden', slow);
      /* The stone inside moves on the same clock as its panel, so together they travel in one straight line. */
      var sDur = slow ? '1.1s' : '.65s';
      o.strans = ['left', 'top', 'transform'].map(function (q) { return q + ' ' + sDur + ' ' + ease + ' ' + delay; }).join(', ');
      o.itrans = mkTrans(delay, o.ivis === 'hidden', false);
      o.pickDisp = chosen ? 'none' : 'block';

      o.fGrain = 'grain-' + i; o.gSheen = 'sheen-' + i; o.gBase = 'base-' + i; o.gShadow = 'shadow-' + i; o.gPillow = 'pillow-' + i;
      o.fVcut = 'vcut-' + i; o.fRelief = 'relief-' + i; o.fGold = 'gold-' + i; o.fFlat = 'flat-' + i; o.fLaser = 'laser-' + i;
      o.shCx = hsR(W / 2 * K); o.shCy = hsR((H + below) * K); o.shRx = hsR((W / 2 + (baseH ? 6 : 3)) * K); o.shRy = hsR(1.2 * K);
      o.baseDisp = baseH ? 'inline' : 'none';
      var bm = hsBaseMat(d), bSurf = d.baseSurface || 'polished';
      o.bFace = hsSurfaceFace(bm, bSurf); o.bEdge = bm.edge;
      o.bGrainOp = bSurf === 'frosted' ? 0.55 : bSurf === 'honed' ? 0.3 : 0.35; o.bSheenOp = bSurf === 'polished' ? 1 : bSurf === 'honed' ? 0.25 : 0;
      o.clipBase = 'baseclip-' + i;
      var bRock = d.baseEdges === 'rock' && baseH > 0, bRB = lyingBase ? Math.min(1.1, baseX * 0.5) : Math.min(1.1, baseH * 0.28);
      o.bRockDisp = bRock ? 'inline' : 'none';
      o.bRockCol = hsMix(hsMix(bm.face, bm.frost, 0.38), '#8a8578', 0.12); o.bRockCol2 = hsMix(bm.frost, '#ffffff', 0.3);
      var rb = hsRng(hsHash('base' + W + 'x' + baseH)), bdots = function (n, lo, hi) { var a = []; for (var q = 0; q < n; q++) a.push(0, hsR((lo + rb() * (hi - lo)) * K, 1)); return a.join(' '); };
      o.bRockW = hsR(2 * bRB * 0.62 * K); o.bRockW2 = hsR(2 * bRB * 0.95 * K); o.bRockW3 = hsR(2 * bRB * 0.55 * K);
      o.bRockDash = bdots(22, 0.6, 1.8); o.bRockDash2 = bdots(26, 0.25, 0.8);
      o.baseX = hsR(-baseX * K); o.baseW = hsR((W + 2 * baseX) * K);
      if (lyingBase) { var vTop = hsVaseTopRoom(d); o.baseY = hsR(-(baseXv + vTop) * K); o.baseH = hsR((H + 2 * baseXv + vTop) * K); } else { o.baseY = H * K; o.baseH = hsR(Math.max(baseH, 0.01) * K); }
      /* Seen from above, a marker's shadow falls around its whole footprint; standing stones keep the ground shadow at their foot. */
      var lyingT2 = d.type === 'bevel' || d.type === 'pillow' || d.type === 'grass';
      o.shDisp = lyingT2 ? 'none' : 'inline'; o.fpDisp = lyingT2 ? 'inline' : 'none';
      o.fpD = lyingBase ? 'M' + o.baseX + ' ' + o.baseY + ' h' + o.baseW + ' v' + o.baseH + ' h' + (-o.baseW) + ' Z' : stoneD;
      o.fShBlur = 'shblur-' + i; o.fShBlur2 = 'shblur2-' + i; o.fShStd = hsR(0.7 * K, 1); o.fShStd2 = hsR(0.28 * K, 1);
      o.fpT1 = 'translate(' + hsR(0.2 * K) + ' ' + hsR(0.35 * K) + ')'; o.fpT2 = 'translate(0 ' + hsR(0.2 * K) + ')'; o.fpT3 = 'translate(' + hsR(0.8 * K) + ' ' + hsR(1.25 * K) + ')';
      o.lyShadowDisp = lyingBase ? 'inline' : 'none'; o.lyShadowTf = 'translate(0 ' + hsR(0.08 * K) + ')';
      o.pillowDisp = d.type === 'pillow' ? 'inline' : 'none';
      o.bevelDisp = d.type === 'bevel' ? 'inline' : 'none';
      o.bevelTf = hsInsetTf(0.7, W, H); o.bevelSw = hsR(1.4 * K);
      o.spineDisp = d.shape === 'book' ? 'inline' : 'none';
      o.gVaseA = 'vasea-' + i; o.gVaseG = 'vaseg-' + i;
      o.vgE = bm.edge; o.vgF = bm.face; o.vgL = hsMix(bm.face, '#ffffff', 0.22);
      o.vases = []; o.vasesFront = [];
      if (vOn) {
        var vv = d.vase, vw = hsVaseW(vv), vh = hsVaseHt(vv), vRise = hsVaseRise(d), vGran = vv.kind === 'granite', vD = hsVasePath(vv.kind, vw * K, vh * K);
        var vLy = hsIsLying(d), vLp = hsVaseLyPos(vv), vLyY = vLp === 'front' ? H - vw / 2 - 0.5 : vLp === 'middle' ? H / 2 : vw / 2 + 0.5;
        hsVaseSides(vv, d).forEach(function (sd) {
          var fRow = HS_VASE_FRONT_IDS.indexOf(sd) >= 0, sRise = fRow ? 0 : vRise, gap = 0.4, reach = (gap + vw / 2) * K;
          var cx = sd === 'front' ? W / 2 : sd === 'fl' ? vw / 2 + 1.2 : sd === 'fr' ? W - vw / 2 - 1.2 : sd === 'left' ? -(gap + vw / 2) : W + gap + vw / 2;
          var cy = vLy ? (fRow ? -(0.9 + vw / 2) : vLyY) : H - sRise;
          var ring = function (f, q) { var y = hsR(-f * vh * K, 2), hw = hsR(q * vw * K / 2, 2); return 'M' + (-hw) + ' ' + y + ' H' + hw; };
          /* In the painted scene a marker is seen at an angle, so its vases stand up (drawn taller to undo the tilt). */
          var vStand = vLy && fin && isSel, vTilt = 1 / Math.cos((d.type === 'grass' ? 50 : 45) * Math.PI / 180);
          (fRow && !vLy ? o.vasesFront : o.vases).push({
            tf: vStand ? 'translate(' + hsR(cx * K, 2) + ' ' + hsR((cy + vw * 0.3) * K, 2) + ') scale(1 ' + hsR(vTilt, 3) + ')' : 'translate(' + hsR(cx * K, 2) + ' ' + hsR(cy * K, 2) + ')', d: vD,
            sideDisp: vLy && !vStand ? 'none' : 'inline', lyDisp: vLy && !vStand ? 'inline' : 'none',
            lyR: hsR(vw / 2 * K, 2), lyR2: hsR(vw / 2 * 0.72 * K, 2), lyR3: hsR(vw / 2 * 0.86 * K, 2), lySh: hsR(0.25 * K, 2),
            fill: 'url(#' + (vGran ? o.gVaseG : o.gVaseA) + ')', stroke: vGran ? bm.edge : '#5d6168', grainDisp: vGran ? 'inline' : 'none',
            rimCy: hsR(-vh * K, 2), rimRx: hsR(vw * K / 2 * 0.86, 2), rimRy: hsR(Math.max(1, vw * K * 0.075), 2), rimFill: vGran ? hsMix(bm.edge, '#000000', 0.35) : '#2e3136',
            ringD: vGran ? ring(0.06, 0.8) + ' ' + ring(0.875, 0.92) : ring(0.9, 0.7) + ' ' + ring(0.06, 0.56), ringCol: vGran ? hsMix(bm.face, '#ffffff', 0.35) : '#ffffff',
            shDisp: sRise || (vLy && !vStand) ? 'none' : 'inline', shRx: hsR(vw * K * 0.6, 2), shRy: hsR(0.32 * K, 2), shCy: hsR(-0.05 * K, 2),
            /* A raised vase hangs from a ring clamp on an arm, bolted to a plate on the side of the stone. */
            brDisp: sRise ? 'inline' : 'none', brX: hsR(sd === 'left' ? 0 : -reach, 2), brW: hsR(reach, 2), brY: hsR(-vh * 0.4 * K, 2), brH: hsR(0.55 * K, 2), brFill: vGran ? bm.edge : '#6b6f76',
            clX: hsR(-vw * 0.6 * K / 2, 2), clW: hsR(vw * 0.6 * K, 2), clY: hsR(-vh * 0.44 * K, 2), clH: hsR(0.9 * K, 2),
            plX: hsR((sd === 'left' ? reach : -reach) - 0.2 * K, 2), plW: hsR(0.4 * K, 2), plY: hsR(-vh * 0.62 * K, 2), plH: hsR(vh * 0.42 * K, 2)
          });
        });
      }
      o.spineD = 'M' + hsR(W / 2 * K) + ' ' + hsR(H * 0.12 * K) + ' V' + hsR(H * K);
      o.dimDisp = edit && isSel ? 'inline' : 'none';
      o.dimDivDisp = edit && isSel ? 'block' : 'none';
      o.dimFs = hsR(0.95 * K);
      var wy = (H + below + 1.3) * K, tk = 0.4 * K;
      o.wDimD = 'M0 ' + hsR(wy - tk) + ' V' + hsR(wy + tk) + ' M0 ' + hsR(wy) + ' H' + hsR(W * K) + ' M' + hsR(W * K) + ' ' + hsR(wy - tk) + ' V' + hsR(wy + tk);
      o.wDimLx = hsR(W / 2 * K + offX); o.wDimLy = hsR(wy + 1.2 * K + offY);
      o.wDimLabel = W + '″ wide' + (baseH ? ' · base ' + (W + 2 * baseX) + '″ wide × ' + (lyingBase ? hsBaseD(d) + '″ deep' : baseH + '″ high') : '');
      var hx = (W + dimX) * K;
      o.hDimD = 'M' + hsR(hx - tk) + ' 0 H' + hsR(hx + tk) + ' M' + hsR(hx) + ' 0 V' + hsR(H * K) + ' M' + hsR(hx - tk) + ' ' + hsR(H * K) + ' H' + hsR(hx + tk);
      o.hDimLx = hsR(hx + 1.1 * K + offX); o.hDimLy = hsR(H / 2 * K + offY);
      o.hDimLabel = H + '″ high';
      o.guideD = 'M' + hsR(W / 2 * K) + ' ' + hsR(-0.6 * K) + ' V' + hsR((H + 0.6) * K);
      o.guideDisp = edit && isSel && st.guideX ? 'inline' : 'none';

      var checks = hsChecks(d);
      o.chkLabel = checks.length ? checks.length + (checks.length === 1 ? ' small thing to tidy' : ' small things to tidy') : 'Ready to carve';
      o.chkBg = checks.length ? '#fbf1df' : '#e4efe8';
      o.chkDisp = checks.length ? 'flex' : 'none';
      o.chkFg = checks.length ? '#5e4012' : '#23553f';
      o.why = d.why.slice(0, 4).map(function (t) { return { text: t }; });

      var num = self.numbering(d), sec = self.sections(d), inEdit = edit && isSel;
      o.layers = d.layers.map(function (l) {
        var b = hsBox(l), look = hsCarveLook(l.carve, m, l.paint, surf);
        var lv = { vb: vb, stoneD: stoneD, isBorder: false, isSymbol: false, isText: false, isPhoto: false, gloss: 'none', clip: 'border-box', fill: '',
          fid: look.fkey + '-' + i, op: look.op, color: look.color, mFs: hsR(0.85 * K), labSw: hsR(0.28 * K) };
        if (l.visible) {
          if (l.type === 'border') {
            var bd = hsFind(HS_BORDERS, l.bstyle);
            lv.isBorder = true;
            lv.btf1 = hsInsetTf(l.inset, W, H); lv.btf2 = hsInsetTf(l.inset + 0.55, W, H);
            lv.d2 = l.bstyle === 'double' ? 'inline' : 'none';
            /* A raised border is a sculpted band standing off the face, so it reads wider than a cut line. */
            lv.bw = hsR(bd.w * K * (l.carve === 'relief' ? 2.2 : 1), 2);
            lv.dash = bd.dash === 'none' ? 'none' : bd.dash.split(' ').map(function (n) { return hsR(parseFloat(n) * K, 2); }).join(' ');
            lv.bSelDisp = inEdit && editSel === l.id ? 'inline' : 'none';
            /* The selection outline wraps the band from outside and inside, never on top of it. */
            var bHalf = bd.w * (l.carve === 'relief' ? 2.2 : 1) / 2, bGap = 0.3;
            lv.btfS1 = hsInsetTf(Math.max(0.08, l.inset - bHalf - bGap), W, H);
            lv.btfS2 = hsInsetTf(l.inset + (l.bstyle === 'double' ? 0.55 : 0) + bHalf + bGap, W, H);
          } else if (l.type === 'symbol') {
            var sy = hsFind(HS_SYMBOLS, l.sym);
            lv.isSymbol = true; lv.symD = sy.d;
            lv.symTf = 'translate(' + hsR((l.x - l.size / 2) * K) + ' ' + hsR((l.y - l.size / 2) * K) + ') scale(' + hsR(l.size * K / 100, 4) + ')';
            lv.symFill = sy.mode === 'fill' ? look.color : 'none';
            lv.symStroke = sy.mode === 'stroke' ? look.color : 'none';
            lv.symSw = sy.sw || 0;
          } else if (l.type === 'text') {
            var ft = hsFind(HS_FONTS, l.font), fsz = l.ht / ft.cap * K, ls = l.track * fsz, lines = hsLines(l);
            lv.isText = true; lv.family = ft.family; lv.fstyle = ft.style; lv.fs = hsR(fsz); lv.ls = hsR(ls, 3);
            lv.tx = hsR(l.x * K + offX); lv.ty = hsR(l.y * K + offY);
            lv.lhpx = hsR(l.ht * HS_LH * K); lv.text = lines.join('\n'); lv.shadow = look.shadow;
            /* A date to be added later keeps its space: blank on the stone, outlined while designing. */
            var resvTool = (edit || guided) && isSel;
            lv.segs = hsResvSegs(lv.text).map(function (g) { return { t: g.t, vis: g.resv ? 'hidden' : 'visible', ol: g.resv && resvTool ? hsR(Math.max(1, 0.08 * K), 2) + 'px dashed rgba(210, 214, 218, 0.75)' : 'none' }; });
            lv.gloss = look.gloss || 'none'; lv.clip = look.gloss ? 'text' : 'border-box'; lv.fill = look.gloss ? 'transparent' : look.color;
          } else if (l.type === 'photo' && C.photoById[l.photo]) {
            lv.isPhoto = true; lv.img = C.photoById[l.photo].url;
            var pResv = hsIsResvPhoto(l.photo), pTool = (edit || guided) && isSel;
            lv.imgDisp = pResv ? 'none' : 'inline'; lv.resvDisp = pResv && pTool ? 'inline' : 'none';
            /* A saved photo spot shows as a soft matte portrait everywhere except the finished scene, where it is plain stone. */
            lv.resvMatteDisp = pResv && !fin ? 'inline' : 'none';
            lv.resvFx = 'rfx-' + i + '-' + String(l.id).replace(/[^A-Za-z0-9_-]/g, '_');
            lv.resvBlur = hsR(Math.max(0.6, 0.3 * K), 2);
            var pDarkM = hsHexLum(m.face) < 0.32;
            lv.resvMatte = hsMix(m.face, pDarkM ? '#ffffff' : '#000000', pDarkM ? 0.16 : 0.1);
            lv.resvSil = hsMix(m.face, pDarkM ? '#ffffff' : '#000000', pDarkM ? 0.3 : 0.2);
            var sx0 = b.x0 * K, sy0 = b.y0 * K, sw = b.w * K, sh = b.h * K, hr = sw * 0.19, hcx = sx0 + sw / 2, hcy = sy0 + sh * 0.4;
            lv.resvSilD = hsCirc(hcx, hcy, hr) + ' M' + hsR(sx0 + sw * 0.14) + ' ' + hsR(sy0 + sh) + ' Q' + hsR(sx0 + sw * 0.16) + ' ' + hsR(hcy + hr * 1.35) + ' ' + hsR(hcx) + ' ' + hsR(hcy + hr * 1.25) + ' Q' + hsR(sx0 + sw * 0.84) + ' ' + hsR(hcy + hr * 1.35) + ' ' + hsR(sx0 + sw * 0.86) + ' ' + hsR(sy0 + sh) + ' Z';
            lv.resvLabel = 'Photo added later'; lv.resvFs = hsR(Math.max(0.7, Math.min(1.1, b.w * 0.14)) * K, 2);
            lv.resvLx = hsR((b.x0 + b.w / 2) * K); lv.resvLy = hsR((b.y0 + b.h / 2) * K);
            lv.px0 = hsR(b.x0 * K); lv.py0 = hsR(b.y0 * K); lv.pw = hsR(b.w * K); lv.ph = hsR(b.h * K);
            var pRound = hsPhotoRound(l.frame), pCorner = (l.frame === 'square' ? 0.35 : 0.6) * K, pLook = l.look || 'photo';
            lv.rx = pRound ? hsR(b.w * K / 2) : hsR(pCorner); lv.ry = pRound ? hsR(b.h * K / 2) : hsR(pCorner);
            var pSafe = String(l.id).replace(/[^A-Za-z0-9_-]/g, '_');
            lv.clipId = 'clip-' + i + '-' + pSafe; lv.fxId = 'pfx-' + i + '-' + pSafe;
            var pDark = hsHexLum(m.face) < 0.32;
            lv.fxCol = hsMix(m.frost, '#ffffff', pDark ? 0.3 : 0.55); lv.fxTv = '0 1';
            lv.fxFq = hsR(Math.min(1.6, 220 / Math.max(30, lv.pw)), 3); lv.fxSb = hsR(Math.max(0.6, lv.pw / 45), 2);
            lv.fxRb = hsR(Math.max(0.4, lv.pw / 150), 2); lv.fxSs = hsR(Math.max(1, lv.pw / 30), 2); lv.fxLc = hsMix(m.frost, '#ffffff', 0.12);
            if (pLook === 'etched' || pLook === 'sketch') { lv.imgF = lv.fxId + (pLook === 'etched' ? '-et' : '-sk'); lv.blend = 'normal'; lv.pop = 0.95; }
            else if (pLook === 'relief') { lv.imgF = lv.fxId + '-rl'; lv.blend = 'normal'; lv.pop = 0.9; }
            else if (l.carve === 'laser') { lv.imgF = 'laser-' + i; lv.blend = 'screen'; lv.pop = 0.9; }
            else { lv.imgF = l.tone === 'bw' ? lv.fxId + '-bw' : 'flat-' + i; lv.blend = 'normal'; lv.pop = 1; }
            lv.frameDisp = !pResv && pLook === 'photo' && l.carve === 'porcelain' ? 'inline' : 'none'; lv.frameW = hsR(0.4 * K);
          }
        }
        var bb = b || { x0: 0, y0: 0, w: 0, h: 0, x1: 0, y1: 0 };
        var editable = inEdit && l.visible && !!b;
        var layStep = guided && (HS_GSTEPS[st.gstep || 0] || {}).id === 'layout';
        var swapOn = guided && isSel && l.visible && !!b && (!!l.inStack || !!l.side), dragS = st.drag && st.drag.mode === 'swap' ? st.drag : null;
        lv.hx = hsR((bb.x0 - 0.25) * K); lv.hy = hsR((bb.y0 - 0.25) * K); lv.hw = hsR((bb.w + 0.5) * K); lv.hh = hsR((bb.h + 0.5) * K);
        lv.hitDisp = editable || swapOn ? 'inline' : 'none';
        var ws = stt && l.visible && b ? stt.by[l.id] : null;
        lv.warnDisp = ws ? 'inline' : 'none';
        lv.warnCol = ws ? (ws.level === 'red' ? '#d2433a' : '#e0a526') : 'none';
        lv.warnFill = ws ? (ws.level === 'red' ? 'rgba(210, 67, 58, 0.16)' : 'rgba(224, 165, 38, 0.08)') : 'none';
        lv.warnDash = ws && ws.level === 'red' ? 'none' : '4 3'; lv.wRx = hsR(0.2 * K);
        lv.wx = hsR((bb.x0 - 0.12) * K); lv.wy = hsR((bb.y0 - 0.1) * K); lv.ww = hsR((bb.w + 0.24) * K); lv.wh = hsR((bb.h + 0.2) * K);
        lv.cursor = st.drag && st.drag.id === l.id ? 'grabbing' : 'grab';
        lv.onDown = function (e) { self.beginDrag(l.id, e); };
        lv.onMove = function (e) { self.moveDrag(e); };
        lv.onUp = function () { self.endDrag(); };
        var isSelL = editable && editSel === l.id;
        lv.selDisp = isSelL || (dragS && dragS.id === l.id) ? 'inline' : 'none';
        /* Rearranging: in the Layout step every movable part shows a faint outline; while one is dragged,
           each other part becomes a drop zone, the one under the pointer lights up, and a ghost marks
           where the swapped part will land. */
        var zone = null, zb = bb, zLab = '', z2 = null, z2b = null;
        if (swapOn) {
          if (dragS && dragS.id === l.id) {
            var bDes = dragS.before && dragS.before[st.sel], bL = bDes ? bDes.layers.filter(function (x) { return x.id === l.id; })[0] : null, ob = bL ? hsBox(bL) : null;
            if (ob) {
              zb = ob; var tL = dragS.target && dragS.target !== 'slot' ? self.findLayer(dragS.target) : null;
              zone = tL ? 'ghost' : 'home'; zLab = tL ? tL.name + ' moves here' : '';
              /* a lone side symbol gets an empty slot on the other side to land in */
              if (dragS.side && !dragS.otherId) { z2 = dragS.target === 'slot' ? 'target' : 'drop'; z2b = { x0: W - ob.x1, x1: W - ob.x0, y0: ob.y0, y1: ob.y1, w: ob.w, h: ob.h }; }
            }
          } else if (dragS) {
            if (!!dragS.side === !!l.side && (!dragS.side || l.id === dragS.otherId)) { zone = dragS.target === l.id ? 'target' : 'drop'; zLab = zone === 'target' ? 'Drop to swap' : ''; }
          }
          else if (layStep) zone = 'rest';
        }
        var zSt0 = { rest: ['none', 'rgba(34, 211, 238, 0.55)', '3 4', 1.2], drop: ['rgba(34, 211, 238, 0.08)', 'rgba(34, 211, 238, 0.85)', '6 4', 1.5],
          target: ['rgba(34, 211, 238, 0.26)', '#22d3ee', 'none', 2.5], ghost: ['rgba(34, 211, 238, 0.14)', '#67e8f9', '6 4', 2], home: ['rgba(255, 255, 255, 0.06)', 'rgba(103, 232, 249, 0.6)', '2 4', 1.2] };
        var zSt = zSt0[zone] || ['none', 'none', 'none', 1];
        lv.zDisp = zone ? 'inline' : 'none'; lv.zFill = zSt[0]; lv.zStroke = zSt[1]; lv.zDash = zSt[2]; lv.zSw = zSt[3]; lv.zRx = hsR(0.25 * K);
        lv.zx = hsR((zb.x0 - 0.3) * K); lv.zy = hsR((zb.y0 - 0.3) * K); lv.zw = hsR((zb.w + 0.6) * K); lv.zh = hsR((zb.h + 0.6) * K);
        lv.zLabDisp = zLab ? 'block' : 'none'; lv.zLabel = zLab;
        /* the ghost's label sits inside its empty slot; the target's label hangs off its right edge, clear of the lettering */
        lv.zLx = hsR((zone === 'target' ? zb.x1 + 0.55 : (zb.x0 + zb.x1) / 2) * K + offX); lv.zLy = hsR(((zb.y0 + zb.y1) / 2) * K + offY);
        lv.zLabTf = zone === 'target' ? 'translate(0, -50%)' : 'translate(-50%, -50%)';
        var z2St = z2 === 'target' ? zSt0.target : zSt0.drop, z2bb = z2b || bb;
        lv.z2Disp = z2 ? 'inline' : 'none'; lv.z2Fill = z2St[0]; lv.z2Stroke = z2St[1]; lv.z2Dash = z2St[2]; lv.z2Sw = z2St[3];
        lv.z2x = hsR((z2bb.x0 - 0.3) * K); lv.z2y = hsR((z2bb.y0 - 0.3) * K); lv.z2w = hsR((z2bb.w + 0.6) * K); lv.z2h = hsR((z2bb.h + 0.6) * K);
        lv.z2LabDisp = z2 === 'target' ? 'block' : 'none'; lv.z2Label = 'Drop to move here';
        lv.z2Lx = hsR(((z2bb.x0 + z2bb.x1) / 2) * K + offX); lv.z2Ly = hsR((z2bb.y1 + 0.5) * K + offY);
        if (dragS) lv.warnDisp = 'none';
        lv.selDivDisp = isSelL ? 'block' : 'none';
        lv.labLx = hsR((bb.x0 - 0.25) * K + offX); lv.labLy = hsR((bb.y0 - 0.35) * K + offY);
        lv.selLabel = l.type === 'text' ? '≈' + hsIn1(bb.w) + ' wide · ' + hsIn(l.ht) + ' letters' : b ? hsIn(bb.w) + ' × ' + hsIn(bb.h) : '';
        var showR = inEdit && l.visible && b && sec.ruler[l.id];
        lv.rulerDisp = showR ? 'inline' : 'none';
        lv.rulerDivDisp = showR ? 'block' : 'none';
        var rX = vExtL || 0;
        lv.rulerD = 'M' + hsR(-(0.8 + rX) * K) + ' ' + hsR(bb.y0 * K) + ' H' + hsR(-(1.4 + rX) * K) + ' V' + hsR(bb.y1 * K) + ' H' + hsR(-(0.8 + rX) * K);
        lv.rulerLx = hsR(-(1.8 + rX) * K + offX); lv.rulerLy = hsR((bb.y0 + bb.y1) / 2 * K + offY);
        lv.rulerLabel = b ? hsIn(bb.h) : '';
        var gp = sec.gaps[l.id];
        var showG = showR && gp && gp.gap > 0.15;
        lv.gapDisp = showG ? 'inline' : 'none';
        lv.gapDivDisp = showG ? 'block' : 'none';
        var gx = (W + 0.7 + (vExtR || 0)) * K;
        lv.gapD = gp ? 'M' + hsR(gx) + ' ' + hsR(gp.from * K) + ' V' + hsR(bb.y0 * K) + ' M' + hsR(gx - 0.3 * K) + ' ' + hsR(gp.from * K) + ' H' + hsR(gx + 0.3 * K) + ' M' + hsR(gx - 0.3 * K) + ' ' + hsR(bb.y0 * K) + ' H' + hsR(gx + 0.3 * K) : 'M0 0';
        lv.gapLx = hsR(gx + 0.6 * K + offX); lv.gapLy = gp ? hsR((gp.from + bb.y0) / 2 * K + offY) : 0;
        lv.gapLabel = gp ? hsIn(gp.gap) : '';
        var showB = inEdit && (st.ltab || 'design') === 'handoff' && l.visible && num.map[l.id];
        lv.badgeDisp = showB ? 'flex' : 'none';
        lv.num = num.map[l.id] || '';
        var bgx, bgy;
        if (l.type === 'border') { bgx = (l.inset + 1.1) * K; bgy = (H - l.inset - 1.1) * K; }
        else { bgx = (bb.x0 - 1.0) * K; bgy = (bb.y0 + 0.4) * K; }
        lv.bgLx = hsR(bgx + offX); lv.bgLy = hsR(bgy + offY); lv.bgD = hsR(1.5 * K);
        return lv;
      });
      return o;
    });

