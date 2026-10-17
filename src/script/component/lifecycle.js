  constructor(...args) {
    super(...args);
    this.timers = [];
    this.past = []; this.future = [];
    this.nextId = 500;
    /* Ctrl+Z undoes and Ctrl+Shift+Z (or Ctrl+Y) redoes while refining; one window listener always talks to the live component. */
    if (typeof window !== 'undefined') {
      window.__hsKeyOwner = this;
      if (!window.__hsKeyBound) { window.__hsKeyBound = true; window.addEventListener('keydown', function (e) { if (window.__hsKeyOwner) window.__hsKeyOwner.onKey(e); }); }
      /* The whole lab follows the window: every screen lays itself out for the space it is given. */
      if (!window.__hsSizeBound) {
        window.__hsSizeBound = true;
        var hsSizeQueued = false;
        window.addEventListener('resize', function () {
          if (hsSizeQueued) return; hsSizeQueued = true;
          requestAnimationFrame(function () { hsSizeQueued = false; var o = window.__hsKeyOwner; if (o) o.onResize(); });
        });
      }
    }
    this.state = Object.assign({}, this.state || {}, {
      screen: 'intake', wstep: 0, wSeen: {},
      form: { name: '', born: '', passed: '', quotes: [''], theme: '', story: '', faith: '', faithOther: '', who: 'one', pair: 'shared', name2: '', born2: '', passed2: '', story2: '' }, dp: null,
      photos: [], errors: {}, dragOver: false,
      buildStep: 0, analysis: null,
      designs: [], sel: -1, variant: 0, revealed: false, revealing: false,
      refineMode: 'guided', gstep: 0,
      selLayer: null, rtab: 'layers', drag: null, guideX: false, status: '',
      vw: typeof window !== 'undefined' ? window.innerWidth : 1440, vh: typeof window !== 'undefined' ? window.innerHeight : 900,
      scene: '', sceneManual: false, sceneTod: '', sceneSeason: '', finShown: false, finCard: false, finChars: null, finPanel: false, finTold: false, finHidden: false
    });
  }
  componentWillUnmount() { this.timers.forEach(function (t) { clearTimeout(t); }); }
  componentDidMount() { this.onResize(); }
  onResize() {
    if (typeof window === 'undefined') return;
    var w = window.innerWidth, h = window.innerHeight;
    if (w !== this.state.vw || h !== this.state.vh) this.setState({ vw: w, vh: h });
  }
  later(fn, ms) { this.timers.push(setTimeout(fn, ms)); }

  setForm(patch) {
    var errors = Object.assign({}, this.state.errors);
    if (patch.name != null && patch.name.trim()) delete errors.name;
    if (patch.born || patch.passed) delete errors.date;
    if (patch.name2 != null && patch.name2.trim()) delete errors.name2;
    if (patch.born2 || patch.passed2) delete errors.date2;
    if (patch.who === 'one') { delete errors.name2; delete errors.date2; }
    this.setState({ form: Object.assign({}, this.state.form, patch), errors: errors });
  }
