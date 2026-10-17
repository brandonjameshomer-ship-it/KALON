    var dp = st.designs[Math.max(0, st.sel)];
    var m = hsFind(HS_MATERIALS, dp.material), shp = hsFind(HS_SHAPES, dp.shape), tyP = hsTypeOf(dp);
    var W = dp.W, H = dp.H, pp = dp.params || {};
    v.lpX = edit ? 0 : -310;
    v.rpX = edit ? 0 : 370;
    v.panelVis = edit ? 'visible' : 'hidden';
    v.panelTrans = edit ? 'transform .55s ' + ease + ' .12s, visibility 0s linear 0s' : 'transform .4s cubic-bezier(.4,0,.2,1) 0s, visibility 0s linear .4s';
    v.gpX = guided ? 0 : 430;
    v.gpVis = guided ? 'visible' : 'hidden';
    v.gpTrans = guided ? 'transform .55s ' + ease + ' .12s, visibility 0s linear 0s' : 'transform .4s cubic-bezier(.4,0,.2,1) 0s, visibility 0s linear .4s';

    var checks = hsChecks(dp);
    var gi = Math.max(0, Math.min(HS_GSTEPS.length - 1, st.gstep)), gmeta = HS_GSTEPS[gi];
    for (var gk = 0; gk < HS_GSTEPS.length; gk++) v['gIs' + gk] = gi === gk;
    v.gTitle = gmeta.title; v.gSub = gmeta.sub;
    v.gCountLabel = 'Step ' + (gi + 1) + ' of ' + HS_GSTEPS.length + ' · ' + gmeta.label;
    v.gsteps = HS_GSTEPS.map(function (s, i) {
      return { label: s.label, current: i === gi ? 'step' : 'false', aria: 'Step ' + (i + 1) + ': ' + s.label, bar: i === gi ? accent : i < gi ? hsRgba(accent, 0.45) : '#dcd7cc', pick: function () { self.setState({ gstep: i }); } };
    });
    v.gBack = function () { if (gi > 0) self.setState({ gstep: gi - 1 }); };
    v.gBackVis = gi > 0 ? 'visible' : 'hidden';
    v.gNext = function () { if (gi < HS_GSTEPS.length - 1) self.setState({ gstep: gi + 1 }); else self.goFinal(); };
    v.gNextLabel = gi < HS_GSTEPS.length - 1 ? 'Next: ' + HS_GSTEPS[gi + 1].label : 'See it in place';
    var gs0 = guided ? self.statusOf(dp) : { red: 0, yellow: 0 };
    v.gChk = gs0.red ? (gs0.red === 1 ? 'One part is cramped' : gs0.red + ' parts are cramped') + (HS_GSTEPS[st.gstep] && HS_GSTEPS[st.gstep].id === 'layout' ? ' · easy fixes above' : ' · see Layout for easy fixes') : gs0.yellow ? 'Everything fits · a few parts are snug' : checks.length ? checks.length + (checks.length === 1 ? ' small thing' : ' small things') + ' to tidy. The full editor can fix these.' : 'Everything will carve beautifully';
    var matchingOn = f.who === 'two' && f.pair === 'matching' && String(f.name2 || '').trim() && (scr === 'options' || scr === 'focus' || guided || edit || fin);
    v.pairToggleDisp = matchingOn ? 'flex' : 'none';
    v.pairChips2 = [1, 2].map(function (n) {
      var on = (st.viewP || 1) === n, nm = n === 1 ? (hsNameParts(f.name).first || f.name) : (hsNameParts(f.name2).first || f.name2);
      return { label: nm + '’s stone', pressed: on ? 'true' : 'false', bg: on ? accent : 'transparent', fg: on ? '#ffffff' : '#2f2c27', pick: function () { self.setViewP(n); } };
    });
    v.gChkFg = gs0.red ? '#8e2a22' : gs0.yellow || checks.length ? '#6b4a14' : '#23553f';
    v.gManual = !!dp.manual;

