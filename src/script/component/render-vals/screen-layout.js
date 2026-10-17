    var self = this, st = this.state, f = st.form;
    var accent = this.props.accent ?? '#2f5b4f';
    var soft = hsRgba(accent, 0.1);
    var scr = st.screen, edit = scr === 'edit', focus = scr === 'focus', guided = scr === 'guided', fin = scr === 'final';
    var haveDesigns = st.designs.length === 3;
    var isStage = (scr === 'options' || focus || edit || guided || fin) && haveDesigns;
    var refine = edit || guided;
    var v = { accent: accent, soft: soft, yes: true, no: false, noop: function () {} };
    /* Lay out for the window. Below a comfortable minimum the whole lab scales down evenly instead of cramping. */
    var vw0 = st.vw > 300 ? st.vw : 1440, vh0 = st.vh > 300 ? st.vh : 900;
    var rs = Math.min(1, vw0 / HS_MIN_W, vh0 / HS_MIN_H), LW = Math.round(vw0 / rs), LH = Math.round(vh0 / rs);
    v.LW = LW; v.LH = LH; v.LH64 = LH - 64; v.rootScale = hsR(rs, 4);
    /* On narrower windows the focus actions sit at the right so they never cover the design's name. */
    var fbNarrow = LW < 1560; v.fbL = fbNarrow ? 'auto' : '50%'; v.fbR = fbNarrow ? '40px' : 'auto'; v.fbTx = fbNarrow ? '0px' : '-50%';
    v.hdrCols = LW < 1500 ? 'auto minmax(0, 1fr) auto' : 'minmax(0, 1fr) auto minmax(0, 1fr)';
    v.gpL = LW - 420; v.rpL = LW - 360; v.hdrW = LW - 80;
    /* The painted scene is drawn once at 1440 × 836 and scaled to cover the view, anchored to the ground. */
    var scS = Math.max(LW / 1440, (LH - 64) / 836), scX0 = (LW - 1440 * scS) / 2, scY0 = (LH - 64) - 836 * scS;
    v.scTf = 'translate(' + hsR(scX0) + 'px, ' + hsR(scY0) + 'px) scale(' + hsR(scS, 4) + ')';
    v.isIntake = scr === 'intake';
    v.passedLaterDisp = !f.passed && f.born ? 'flex' : 'none'; v.passedLater = f.passedLater !== false;
    v.togglePassedLater = function () { self.setForm({ passedLater: self.state.form.passedLater === false }); };
    v.passedLater2Disp = f.who === 'two' && !f.passed2 && f.born2 ? 'flex' : 'none'; v.passedLater2 = f.passedLater2 !== false;
    v.togglePassedLater2 = function () { self.setForm({ passedLater2: self.state.form.passedLater2 === false }); };
    v.noQuotes = !!f.noQuotes; v.quoteFieldsDisp = f.noQuotes ? 'none' : 'flex';
    v.toggleNoQuotes = function () { self.setForm({ noQuotes: !self.state.form.noQuotes }); };
    v.isBuilding = scr === 'building';
    v.isStage = isStage;
    v.isFinal = fin;
    var finSceneId = '', finMo = null;
    if (fin) {
      var anE = st.analysis || hsAnalyze(f);
      finSceneId = st.scene && HS_SCENES[st.scene] ? st.scene : hsSceneFor(anE);
      finMo = hsSceneMoment(f, finSceneId, { tod: st.sceneTod, season: st.sceneSeason });
    }

