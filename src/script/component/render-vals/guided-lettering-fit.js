    v.fontCards = HS_FONTSETS.map(function (fs) {
      var on = pp.fonts === fs.id, p = self.pill(on, accent, soft);
      var f1 = hsFind(HS_FONTS, fs.name), f2 = hsFind(HS_FONTS, fs.top);
      var nm = C.np.full || 'Full Name';
      return { label: fs.label, desc: fs.desc, sample1: fs.name === 'gothic' ? nm : nm.toUpperCase(), f1: f1.family, s1: f1.style, t1: fs.nameTrack,
        sample2: 'In Loving Memory', f2: f2.family, s2: f2.style, bg: p.bg, bd: p.bd, pressed: p.pressed, pick: function () { self.setParam({ fonts: fs.id }); } };
    });
    var symTiles = function (key) {
      return [null].concat(HS_SYMBOLS).map(function (sy) {
        var id = sy ? sy.id : '', on = (pp[key] || '') === id, p = self.pill(on, accent, soft);
        var patch = {}; patch[key] = id;
        return { label: sy ? sy.label : 'No symbol', svgDisp: sy ? 'block' : 'none', noneDisp: sy ? 'none' : 'block', d: sy ? sy.d : 'M0 0',
          fill: sy && sy.mode === 'fill' ? (on ? accent : '#2b2925') : 'none', stroke: sy && sy.mode === 'stroke' ? (on ? accent : '#2b2925') : 'none', sw: sy ? (sy.sw || 0) : 0,
          bg: p.bg, bd: p.bd, pressed: p.pressed, pick: function () { self.setParam(patch); } };
      });
    };
    v.sym1Tiles = symTiles('sym1');
    v.sym2Tiles = symTiles('sym2');
    v.sym2NoteDisp = 'none';
    var left = [];
    var gstt = guided || edit ? self.statusOf(dp) : { red: 0, yellow: 0, list: [] };
    var fitSug = guided && HS_GSTEPS[st.gstep] && HS_GSTEPS[st.gstep].id === 'layout' && gstt.red ? self.fitSuggestOf(dp, C) : null;
    var lvlCol = { red: '#c2372e', yellow: '#c98a12', ok: '#2f7a55' };
    v.fitRows = gstt.list.map(function (r) {
      return { name: r.name, text: r.text, dot: lvlCol[r.level], fg: r.level === 'red' ? '#8e2a22' : r.level === 'yellow' ? '#6b4a0d' : '#3d3a34', w: r.level === 'ok' ? 400 : 600 };
    });
    v.fitHead = gstt.red ? (gstt.red === 1 ? 'One part is cramped' : gstt.red + ' parts are cramped') : gstt.yellow ? 'Everything fits, a few parts are snug' : 'Everything fits beautifully';
    v.fitHeadCol = gstt.red ? '#8e2a22' : gstt.yellow ? '#6b4a0d' : '#23553f';
    v.fitHeadBg = gstt.red ? '#fbe9e6' : gstt.yellow ? '#fbf3e0' : '#e8f2ec';
    v.fitHeadBd = gstt.red ? '#ecb9b2' : gstt.yellow ? '#ead29c' : '#b9d6c5';
    v.fitHeadDot = gstt.red ? '#c2372e' : gstt.yellow ? '#e0a526' : '#2f7a55';
    v.fitTip = gstt.red ? 'Outlined parts in red are too tight to carve well. Ease the lettering size or spacing, choose fewer quotes, or try a larger stone.' : gstt.yellow ? 'Parts outlined in gold are a touch close. They will carve fine, and a little more room would let them breathe.' : '';
    v.fitTipDisp = v.fitTip ? 'block' : 'none';
    var tsz = pp.textSize || dp.fitScale || 1;
    v.textSizeLabel = Math.round(tsz * 100) + '%' + (pp.textSize ? '' : ' · auto');
    v.textMinus = function () { self.nudgeText(-1); }; v.textPlus = function () { self.nudgeText(1); };
    v.textAutoDisp = pp.textSize ? 'inline-flex' : 'none';
    v.textAuto = function () { self.setParam({ textSize: 0 }); };
    var spc = pp.spacing || 1;
    v.spacingLabel = spc < 0.8 ? 'Close' : spc < 0.95 ? 'Snug' : spc <= 1.05 ? 'Balanced' : spc <= 1.25 ? 'Open' : 'Airy';
    v.spaceMinus = function () { self.nudgeSpacing(-1); }; v.spacePlus = function () { self.nudgeSpacing(1); };
    var va = hsVAlign(dp), vaDef = hsDefaultVAlign(dp);
    v.vposLabel = va <= 0 ? 'At the top' : va >= 100 ? 'At the bottom' : va === 50 ? 'Centered' : va < 50 ? 'Upper ' + (va) + '%' : 'Lower ' + (va) + '%';
    v.vposUp = function () { self.setParam({ vAlign: Math.max(0, hsVAlign(self.cur()) - 10) }); };
    v.vposDown = function () { self.setParam({ vAlign: Math.min(100, hsVAlign(self.cur()) + 10) }); };
    v.vposResetDisp = va !== vaDef ? 'inline-flex' : 'none';
    v.vposReset = function () { var pp2 = Object.assign({}, self.cur().params); delete pp2.vAlign; self.relayout(function (d) { d.params = pp2; }); };
    v.vposHint = vaDef === 50 ? 'Markers look best centered.' : 'Standing stones usually read best near the top.';
    v.gSize = dp.W + '″ wide × ' + dp.H + '″ high';
    v.gWMinus = function () { self.setSize(dp.W - 2, dp.H); }; v.gWPlus = function () { self.setSize(dp.W + 2, dp.H); };
    v.gHMinus = function () { self.setSize(dp.W, dp.H - (dp.type === 'upright' ? 2 : 1)); }; v.gHPlus = function () { self.setSize(dp.W, dp.H + (dp.type === 'upright' ? 2 : 1)); };
    v.fitOkDisp = 'none';
    v.fitSugDisp = fitSug ? 'flex' : 'none';
    v.fitSugText = fitSug ? 'Everything you chose fits with room to breathe on a ' + fitSug.W + '″ × ' + fitSug.H + '″ stone.' : '';
    v.fitSugBtn = fitSug ? 'Make it ' + fitSug.W + '″ × ' + fitSug.H + '″' : '';
    v.useFitSug = function () { if (fitSug) self.setSize(fitSug.W, fitSug.H); };
    v.bestSize = function () { self.bestSize(); };
    v.sizeMsg = st.sizeMsg || ''; v.sizeMsgDisp = st.sizeMsg ? 'block' : 'none';
    v.roomNoteDisp = left.length ? 'block' : 'none';
