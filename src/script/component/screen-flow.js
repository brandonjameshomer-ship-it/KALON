  build() {
    if (!this.validateName()) return;
    var self = this, f = this.state.form;
    this.setState({ screen: 'building', buildStep: 0, analysis: this.analysisFor(f), viewP: 1, errors: {}, scene: '', sceneManual: false, sceneTod: '', sceneSeason: '' });
    [1, 2, 3, 4].forEach(function (n) { self.later(function () { self.setState({ buildStep: n }); }, n * 650); });
    this.later(function () { self.showDesigns(0); }, 4 * 650 + 450);
  }
  showDesigns(variant) {
    var an = this.state.analysis || this.analysisFor(this.state.form);
    this.state.viewP = 1;
    var designs = hsGenerate(this.state.form, this.state.photos, an, variant);
    this.past = []; this.future = [];
    this.setState({ screen: 'options', designs: designs, sel: -1, variant: variant, revealed: false, revealing: true, selLayer: null, drag: null, guideX: false, status: '', gstep: 0 });
    var self = this;
    this.later(function () { self.setState({ revealed: true }); }, 60);
    this.later(function () { self.setState({ revealing: false }); }, 1300);
  }
  choose(i) { this.setState({ screen: 'focus', sel: i, selLayer: null }); }
  startGuided() { this.setState({ screen: 'guided', refineMode: 'guided', selLayer: null, status: '', drag: null, guideX: false }); }
  startEdit() {
    var d = this.cur(), first = null;
    if (d) d.layers.forEach(function (l) { if (!first && l.type === 'text' && l.visible) first = l.id; });
    this.setState({ screen: 'edit', refineMode: 'edit', selLayer: first, rtab: 'layers', status: '' });
  }
  goFinal() {
    var an = this.state.analysis || hsAnalyze(this.state.form);
    var scene = this.state.sceneManual && this.state.scene ? this.state.scene : hsSceneFor(an);
    var self = this;
    var token = this.finToken = (this.finToken || 0) + 1;
    this.setState({ screen: 'final', scene: scene, finShown: false, finCard: false, finChars: null, finPanel: false, finTold: false, finHidden: false, drag: null, guideX: false, status: '' });
    var live = function () { return self.finToken === token && self.state.screen === 'final' && !self.state.finTold; };
    this.later(function () { self.setState({ finShown: true }); }, 80);
    /* 1. the title arrives, then a breath */
    this.later(function () { if (live()) self.setState({ finCard: true }); }, 10000);
    /* 2. the story is told, at a storyteller's pace */
    this.later(function () {
      if (!live()) return;
      var sch = hsTellSchedule(self.finWhyText || '');
      self.setState({ finChars: sch.words });
      /* 3. a quiet moment once the last word lands, then the rest of the panel */
      self.later(function () { if (live()) self.setState({ finPanel: true }); }, Math.round(sch.total * 1000) + 1900);
      self.later(function () { if (self.finToken === token && self.state.screen === 'final') self.setState({ finTold: true }); }, Math.round(sch.total * 1000) + 3400);
    }, 10000 + 3400);
  }

  finishTelling() {
    if (this.state.screen !== 'final' || this.state.finTold) return;
    this.setState({ finCard: true, finPanel: true, finTold: true, finChars: null });
  }

  content() {
    var f = this.state.form;
    if (f.who === 'two' && f.pair === 'matching' && this.state.viewP === 2) { var f2 = hsPairForm(f), C2 = hsContentFrom(f2, hsAnalyze(f2), this.state.photos); C2.viewP = 2; return C2; }
    var an = this.state.analysis || hsAnalyze(f);
    return hsContentFrom(f, an, this.state.photos);
  }
  analysisFor(f) { return f.who === 'two' ? hsAnalyze(Object.assign({}, f, { story: [f.story, f.story2].filter(Boolean).join(' ') })) : hsAnalyze(f); }
  setViewP(n) {
    if (this.state.viewP === n) return;
    this.state.viewP = n;
    var C = this.content();
    var designs = this.state.designs.map(function (d) { var d2 = Object.assign({}, d); d2.layers = hsLayoutBest(d2, C); return d2; });
    this.setState({ viewP: n, designs: designs });
  }
  cur() { return this.state.sel >= 0 ? this.state.designs[this.state.sel] : null; }
  findLayer(id) { var d = this.cur(); if (!d) return null; for (var i = 0; i < d.layers.length; i++) { if (d.layers[i].id === id) return d.layers[i]; } return null; }
