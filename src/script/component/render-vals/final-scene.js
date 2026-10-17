    var sceneId = st.scene && HS_SCENES[st.scene] ? st.scene : hsSceneFor(anA);
    var sc = HS_SCENES[sceneId];
    v.showLand = fin;
    v.finOp = st.finShown ? 1 : 0;
    var cardOn = st.finCard && !st.finHidden;
    v.fcOp = cardOn ? 1 : 0;
    v.fcX = cardOn ? 0 : st.finHidden ? -24 : 0;
    v.fcVis = cardOn ? 'visible' : 'hidden';
    v.fcVisDelay = cardOn ? '0s' : '1s';
    v.titleOp = st.finCard ? 1 : 0; v.titleY = st.finCard ? 0 : 10;
    v.glowOp = st.finCard && !st.finPanel ? 1 : 0;
    v.panelOp = st.finPanel ? 1 : 0;
    v.restOp = st.finPanel ? 1 : 0; v.restVis = st.finPanel ? 'visible' : 'hidden'; v.restVisDelay = st.finPanel ? '0s' : '1.6s';
    var darkSky = !!finMo && finMo.tod === 'night' && !st.finPanel;
    v.inkTitle = darkSky ? '#f5f0e4' : '#1e1c19'; v.inkStory = darkSky ? '#e6e1d6' : '#2a2723';
    v.storyTyping = !!st.finChars && !st.finTold;
    v.storyPlain = !!st.finTold;
    v.storyHidden = !v.storyTyping && !v.storyPlain;
    v.storyWords = st.finChars || [];
    v.finishTelling = function () { self.finishTelling(); };
    /* Always there, softly: before the card finishes it skips ahead; afterwards it hides and shows the card. */
    var tgShowing = st.finPanel && !st.finHidden;
    v.tgOp = st.finShown ? 1 : 0; v.tgVis = 'visible';
    v.tgPressed = tgShowing ? 'true' : 'false';
    v.tgLabel = !st.finPanel ? 'Show everything now' : st.finHidden ? 'Show the card' : 'Hide the card';
    v.tgIcon = tgShowing ? 'M4 5.5 H20 V18.5 H4 Z M9 5.5 V18.5 M16 9.5 L13.5 12 L16 14.5' : 'M4 5.5 H20 V18.5 H4 Z M9 5.5 V18.5 M13.5 9.5 L16 12 L13.5 14.5';
    v.toggleCard = function () {
      if (!self.state.finPanel) { self.finishTelling(); self.setState({ finHidden: false }); }
      else self.setState({ finHidden: !self.state.finHidden });
    };
    var lying = dp.type === 'grass' || dp.type === 'bevel' || dp.type === 'pillow';
    var fpl = hsFinPlace(dp), halfW = (W + 2 * (bh ? hsBaseX(dp) : 0)) * K * fpl.sc / 2;
    /* The camera sits a little higher than the stone: the horizon, hills and water rise, so the stone stands out in the
       meadow with ground around it instead of pressed up against the scenery. */
    var lift = fpl.lift || 0, gA = (236 + lift) / 236;
    v.landLiftN = -lift;
    /* The near meadow stretches down to the bottom edge, so raising the horizon never leaves a seam. */
    v.groundTf = 'matrix(1 0 0 ' + hsR(gA, 4) + ' 0 ' + hsR(836 - gA * 836 + lift, 2) + ')';
    v.lsShadowX = fpl.cx; v.lsShadowRx = hsR(halfW + (lying ? 14 : 30)); v.lsShadowY = fpl.foot - 62; v.lsShadowRy = lying ? 18 : 16;
    var mo = finMo || hsSceneMoment(f, sceneId, { tod: st.sceneTod, season: st.sceneSeason });
    v.scn = fin ? hsPaint(sceneId, halfW, mo, fpl.foot - 64, fpl.cx) : { c: {}, clouds: [], things: [], smoke: [], front: [], back: [], fall: [], flies: [], glows: [], birds: [] };
    v.finName = f.who === 'two' && String(f.name2 || '').trim() ? (hsNameParts(f.name).first || f.name) + ' & ' + (hsNameParts(f.name2).first || f.name2) : (C.np.first || C.np.full || 'them');
    v.finWhy = this.finWhyText = f.who === 'two' && String(f.name2 || '').trim() ? hsPairPoem(f, mo, sceneId) : hsLifePoem(f, anA, mo, sceneId);
    v.finSpec = [
      { k: 'Type', v: tyP.label },
      { k: 'Shape', v: shp.label },
      { k: 'Granite', v: m.label },
      { k: 'Size', v: W + '″ × ' + H + '″' + (bh ? ' on a ' + (W + 2 * hsBaseX(dp)) + '″ base' : '') }
    ];
    v.sceneChips = HS_SCENE_ORDER.map(function (id) {
      var on = id === sceneId, p = self.pill(on, accent, soft);
      return { label: { meadow: 'Meadow', garden: 'Garden', mountains: 'Mountains', lake: 'Lakeside', sea: 'Seaside', church: HS_WORSHIP_LABEL[mo.worship] || 'Churchyard' }[id], bg: p.bg, bd: p.bd, pressed: p.pressed, pick: function () { self.setState({ scene: id, sceneManual: true }); } };
    });
    v.todChips = HS_TODS.map(function (t) {
      var p = self.pill(t.id === mo.tod, accent, soft);
      return Object.assign({ label: t.label, icon: t.icon, bg: p.bg, bd: p.bd, fg: t.id === mo.tod ? accent : '#4a463f', pressed: p.pressed, pick: function () { self.setState({ sceneTod: t.id }); } }, hsIconParts(t.id), { fc: hsIconParts(t.id).fillC ? p.bg : 'none' });
    });
    v.seasonChips = HS_SEASONS.map(function (t) {
      var p = self.pill(t.id === mo.season, accent, soft);
      return Object.assign({ label: t.label, icon: t.icon, bg: p.bg, bd: p.bd, fg: t.id === mo.season ? accent : '#4a463f', pressed: p.pressed, pick: function () { self.setState({ sceneSeason: t.id }); } }, hsIconParts(t.id), { fc: hsIconParts(t.id).fillC ? p.bg : 'none' });
    });
    v.momentLabel = (mo.season === 'autumn' ? 'An ' : 'A ') + mo.season + ' ' + mo.tod;
    v.finSpecLine = v.finSpec.map(function (x) { return x.v; }).join('  ·  ');
    return v;
