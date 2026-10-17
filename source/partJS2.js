
var HS_MIN_W = 1320, HS_MIN_H = 820;
class Component extends DCLogic {
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
  /* ---- Large, calm date picker (Material-style dialog) ---- */
  openDate(field) {
    var f = this.state.form, cur = hsParseDate(f[field]), now = new Date(), ty = now.getFullYear();
    var isBorn = /^born/.test(field), sfx = field.replace(/^(born|passed)/, ''), other = hsParseDate(f[(isBorn ? 'passed' : 'born') + sfx]);
    var y, m, view;
    if (cur) { y = cur.y; m = cur.m - 1; view = 'day'; }
    else if (isBorn) { y = other ? other.y - 75 : 1950; m = 0; view = 'year'; }
    else { y = other && other.y > ty - 1 ? other.y : ty; m = now.getMonth(); view = other ? 'year' : 'day'; if (!other) y = ty; }
    this.setState({ dp: { field: field, view: view, y: y, m: m, page: y - (((y % 12) + 12) % 12), sel: f[field] || '', typing: false, text: '', err: '' } });
  }
  dpSet(patch) { this.setState({ dp: Object.assign({}, this.state.dp, patch) }); }
  dpClose() { this.setState({ dp: null }); }
  dpOk() {
    var dp = this.state.dp; if (!dp) return;
    if (dp.editing && String(dp.text || '').trim()) {
      var iso = hsParseLooseDate(dp.text);
      if (!iso) { this.dpSet({ err: 'Try a date like 04/12/1941 or April 12, 1941.' }); return; }
      var why = this.dpBlocked(iso, dp.field);
      if (why) { this.dpSet({ err: why }); return; }
      dp = Object.assign({}, dp, { sel: iso });
    }
    var patch = {}; patch[dp.field] = dp.sel || '';
    this.setForm(patch); this.setState({ dp: null });
  }
  dpClear() { var dp = this.state.dp; if (!dp) return; var patch = {}; patch[dp.field] = ''; this.setForm(patch); this.setState({ dp: null }); }
  dpBlocked(iso, field) {
    var today = hsIsoToday(), f = this.state.form;
    if (iso > today) return 'That date is still to come.';
    var sfx = field.replace(/^(born|passed)/, ''), fb = f['born' + sfx], fp = f['passed' + sfx];
    if (/^born/.test(field) && fp && iso > fp) return 'Born needs to come before passed.';
    if (/^passed/.test(field) && fb && iso < fb) return 'Passed needs to come after born.';
    return '';
  }
  setQuote(i, v) { var q = this.state.form.quotes.slice(); q[i] = v; this.setForm({ quotes: q }); }
  addQuote() { if (this.state.form.quotes.length < 4) this.setForm({ quotes: this.state.form.quotes.concat(['']) }); }
  removeQuote(i) { var q = this.state.form.quotes.slice(); q.splice(i, 1); if (!q.length) q = ['']; this.setForm({ quotes: q }); }
  toggleThemeChip(label) {
    var t = this.state.form.theme, low = t.toLowerCase(), l = label.toLowerCase();
    var idx = low.indexOf(l);
    if (idx >= 0) {
      var nt = (t.slice(0, idx) + t.slice(idx + label.length)).replace(/\s*,\s*,\s*/g, ', ').replace(/^[\s,]+|[\s,]+$/g, '');
      this.setForm({ theme: nt });
    } else {
      var tt = t.trim();
      this.setForm({ theme: tt ? tt.replace(/[.,;\s]+$/, '') + ', ' + l : label });
    }
  }
  handleFiles(list, owner) {
    var self = this;
    owner = owner === 2 ? 2 : 1;
    var files = Array.prototype.slice.call(list || []).filter(function (f) { return /^image\//.test(f.type); });
    var mineN = this.state.photos.filter(function (p) { return (p.owner || 1) === owner; }).length;
    files.slice(0, Math.max(0, 6 - mineN)).forEach(function (file) {
      var reader = new FileReader();
      reader.onload = function () {
        var img = new Image();
        img.onload = function () {
          var w = img.naturalWidth || 1, h = img.naturalHeight || 1, k = Math.min(1, 900 / Math.max(w, h)), url = reader.result;
          try {
            var c = document.createElement('canvas');
            c.width = Math.round(w * k); c.height = Math.round(h * k);
            c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
            url = c.toDataURL('image/jpeg', 0.86);
          } catch (err) {}
          var p = { id: 'p' + (self.nextId++), name: file.name, url: url, ratio: h / w, owner: owner };
          if (self.state.photos.filter(function (q) { return (q.owner || 1) === owner; }).length < 6) {
            self.setState({ photos: self.state.photos.concat([p]) });
            self.fillResv(owner, p.id);
            /* An image layer asked for before any photo existed gets this photo as soon as it arrives. */
            if (self.state.pendingPhoto && self.state.screen === 'edit') { self.setState({ pendingPhoto: false, status: '' }); self.addPhoto(p.id); }
          }
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }
  /* A spot saved for a photo takes the first real photo of that person as soon as one arrives, only for them. */
  fillResv(owner, pid) {
    var rid = 'resv-' + owner, hit = false;
    var designs = this.state.designs.map(function (d) {
      var p = d.params || {}, uses = p.photo === rid || p.photo2 === rid || d.layers.some(function (l) { return l.photo === rid; });
      if (!uses) return d;
      hit = true;
      var np = Object.assign({}, p);
      if (np.photo === rid) np.photo = pid;
      if (np.photo2 === rid) np.photo2 = pid;
      if (np.adj) { var na = {}; Object.keys(np.adj).forEach(function (k) { na[k] = np.adj[k].photo === rid ? Object.assign({}, np.adj[k], { photo: pid }) : np.adj[k]; }); np.adj = na; }
      if (np.extra) np.extra = np.extra.map(function (x) { return x.photo === rid ? Object.assign({}, x, { photo: pid }) : x; });
      return Object.assign({}, d, { params: np, layers: d.layers.map(function (l) { return l.photo === rid ? Object.assign({}, l, { photo: pid }) : l; }) });
    });
    if (hit) this.setState({ designs: designs });
  }
  removePhoto(id) { this.setState({ photos: this.state.photos.filter(function (p) { return p.id !== id; }) }); }
  fillSample() { var seen = {}; for (var k = 0; k < HS_WSTEPS.length - 1; k++) seen[k] = true; this.setState({ form: JSON.parse(JSON.stringify(HS_SAMPLE)), errors: {}, wstep: HS_WSTEPS.length - 1, wSeen: seen }); }
  goStep(to) {
    var from = this.state.wstep, seen = Object.assign({}, this.state.wSeen);
    for (var k = from; k < to; k++) seen[k] = true;
    this.setState({ wstep: to, wSeen: seen });
  }

  validateName() {
    var f = this.state.form, errors = {};
    if (!f.name.trim()) errors.name = 'We’ll just need their name to begin.';
    if (!f.born && !f.passed) errors.date = 'Add at least one date, whichever you have.';
    if (f.who === 'two') {
      if (!String(f.name2 || '').trim()) errors.name2 = 'We’ll need their name too.';
      if (!f.born2 && !f.passed2) errors.date2 = 'Add at least one date for them, whichever you have.';
    }
    if (errors.name || errors.date || errors.name2 || errors.date2) { this.setState({ errors: errors, wstep: 0 }); return false; }
    return true;
  }
  wNext() {
    var s = this.state.wstep;
    if (s === 0 && !this.validateName()) return;
    if (s < HS_WSTEPS.length - 1) this.goStep(s + 1); else this.build();
  }
  wBack() { if (this.state.wstep > 0) this.setState({ wstep: this.state.wstep - 1 }); }

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
  /* ---- History: every change is a named step, so the person can undo, redo, or jump straight back to any point. ---- */
  pushHist(label, designs) {
    var last = this.past[this.past.length - 1], now = Date.now();
    if (label && /^Typed /.test(label) && last && last.label === label && now - (this._histT || 0) < 2500) { this._histT = now; this.future = []; return; }
    this._histT = now;
    this.past.push({ designs: designs || this.state.designs, label: label || 'Change' });
    if (this.past.length > 100) this.past.shift();
    this.future = [];
  }
  editDesign(fn, record, guided, label) {
    var i = this.state.sel;
    if (i < 0) return;
    var designs = this.state.designs.slice(), d = Object.assign({}, designs[i]);
    d.layers = d.layers.slice();
    d.params = Object.assign({}, d.params);
    if (!guided) d.manual = true;
    fn(d);
    designs[i] = d;
    if (record !== false) this.pushHist(label || this._label);
    this.setState({ designs: designs });
  }
  relayout(fn, label) {
    var C = this.content();
    this.editDesign(function (d) { fn(d); d.layers = hsLayoutBest(d, C); d.manual = false; }, true, true, label);
  }
  undo() {
    var prev = this.past.pop();
    if (!prev) return;
    this.future.push({ designs: this.state.designs, label: prev.label });
    this.setState({ designs: prev.designs, drag: null, guideX: false });
  }
  redo() {
    var nx = this.future.pop();
    if (!nx) return;
    this.past.push({ designs: this.state.designs, label: nx.label });
    this.setState({ designs: nx.designs, drag: null, guideX: false });
  }
  jumpHist(n) {
    /* n > 0 steps back, n < 0 steps forward, all in one render */
    var designs = this.state.designs;
    while (n > 0 && this.past.length) { var p = this.past.pop(); this.future.push({ designs: designs, label: p.label }); designs = p.designs; n--; }
    while (n < 0 && this.future.length) { var f = this.future.pop(); this.past.push({ designs: designs, label: f.label }); designs = f.designs; n++; }
    this.setState({ designs: designs, drag: null, guideX: false });
  }
  onKey(e) {
    var scr = this.state.screen;
    if (scr !== 'edit' && scr !== 'guided') return;
    var t = e.target, tag = t && t.tagName ? t.tagName.toLowerCase() : '';
    if (tag === 'textarea' || (tag === 'input' && !/^(checkbox|radio|range|button|color)$/.test(t.type || ''))) return;
    var mod = e.ctrlKey || e.metaKey, k = String(e.key || '').toLowerCase();
    if (mod && k === 'z' && !e.shiftKey) { e.preventDefault(); this.undo(); }
    else if (mod && ((k === 'z' && e.shiftKey) || k === 'y')) { e.preventDefault(); this.redo(); }
    else if (scr === 'edit' && this.state.selLayer && !mod && /^arrow/.test(k)) {
      e.preventDefault();
      var st = e.shiftKey ? 1 : 0.25;
      this.nudge(k === 'arrowleft' ? -st : k === 'arrowright' ? st : 0, k === 'arrowup' ? -st : k === 'arrowdown' ? st : 0);
    }
    else if (scr === 'edit' && this.state.selLayer && (k === 'delete' || k === 'backspace')) { e.preventDefault(); this.setState({ delConfirm: this.state.selLayer, addOpen: false }); }
    else if (k === 'escape' && (this.state.delConfirm || this.state.addOpen)) this.setState({ delConfirm: null, addOpen: false });
  }
  statusOf(d) {
    if (d._sttFor !== d.layers || d._sttMat !== d.material || d._sttSurf !== (d.params && d.params.surface)) { d._stt = hsLayerStatus(d); d._sttFor = d.layers; d._sttMat = d.material; d._sttSurf = d.params && d.params.surface; }
    return d._stt;
  }
  fitSuggestOf(d, C) {
    if (d._sugFor !== d.layers) { d._sug = hsFitSuggest(d, C); d._sugFor = d.layers; }
    return d._sug;
  }
  setFinish(group, carve) {
    this.relayout(function (d) { var fb = Object.assign({}, d.params.finishBy || {}); fb[group] = carve; d.params = Object.assign({}, d.params, { finishBy: fb }); });
  }
  matchName(group) {
    this.relayout(function (d) { var fb = Object.assign({}, d.params.finishBy || {}), pb = Object.assign({}, d.params.paintBy || {}); delete fb[group]; delete pb[group]; d.params = Object.assign({}, d.params, { finishBy: fb, paintBy: pb }); });
  }
  setPaint(group, col) {
    this.relayout(function (d) { var pb = Object.assign({}, d.params.paintBy || {}); pb[group] = col; var fb = Object.assign({}, d.params.finishBy || {}); fb[group] = 'paint'; d.params = Object.assign({}, d.params, { paintBy: pb, finishBy: fb }); });
  }
  reverseLook() {
    /* A switch: turning it off puts back exactly the surface and finishes that were there before. */
    this.relayout(function (d) {
      var p = d.params;
      if (p.reverseBefore) {
        d.params = Object.assign({}, p, { surface: p.reverseBefore.surface, finishBy: p.reverseBefore.finishBy, paintBy: p.reverseBefore.paintBy, reverseBefore: null });
        return;
      }
      var fb = Object.assign({}, p.finishBy || {});
      ['name', 'dates', 'lines', 'quotes', 'symbols', 'border'].forEach(function (g) { fb[g] = 'polish'; });
      d.params = Object.assign({}, p, { reverseBefore: { surface: p.surface || 'polished', finishBy: Object.assign({}, p.finishBy || {}), paintBy: Object.assign({}, p.paintBy || {}) },
        surface: p.surface === 'frosted' ? 'frosted' : 'honed', finishBy: fb });
    });
  }
  nudgeText(dir) {
    var d = this.cur(); if (!d) return;
    var cur = d.params.textSize || d.fitScale || 1, nx = Math.max(0.7, Math.min(1.6, Math.round((cur + dir * 0.05) * 100) / 100));
    this.setParam({ textSize: nx });
  }
  nudgeSpacing(dir) {
    var d = this.cur(); if (!d) return;
    var cur = d.params.spacing || 1, nx = Math.max(0.55, Math.min(1.6, Math.round((cur + dir * 0.15) * 100) / 100));
    this.setParam({ spacing: nx });
  }
  setParam(patch, label) {
    var cur = this.cur(), self = this;
    var lab = label || (patch.layout ? 'Layout: ' + hsFind(HS_LAYOUTS, patch.layout).label : patch.flipX !== undefined ? (patch.flipX ? 'Mirrored the layout' : 'Unmirrored the layout') : patch.fonts ? 'Typeface: ' + hsFind(HS_FONTSETS, patch.fonts).label
      : patch.textSize !== undefined ? 'Lettering size' : patch.spacing !== undefined ? 'Line spacing' : patch.vAlign !== undefined ? 'Lettering position' : patch.dateStyle ? 'Date format' : patch.border ? 'Border style'
      : patch.surface ? 'Stone surface' : patch.edges ? 'Stone edges' : patch.sym1 || patch.sym2 ? 'Symbols' : patch.photo !== undefined ? 'Photo' : patch.quoteSel ? 'Quotes' : 'Design change');
    this.relayout(function (d) {
      var adj = d.params.adj;
      /* Switching layouts can start fresh when the person prefers, dropping moves and resizes but keeping wording and finishes. */
      if (patch.layout && cur && patch.layout !== cur.params.layout && d.params.keepAdj === false && adj) adj = hsStripAdj(adj);
      d.params = Object.assign({}, d.params, patch, { adj: adj });
    }, lab);
  }
  setType(type) { this.relayout(function (d) { hsApplyType(d, type); }, 'Type: ' + hsFind(HS_TYPES, type).label); }
  setSize(W, H) {
    this.relayout(function (d) { var sz = hsClampSize(d, W, H); d.W = sz[0]; d.H = sz[1]; d.genW = d.W; d.genH = d.H; d.genType = d.type; }, 'Stone size ' + W + '″ × ' + H + '″');
  }
  setVase(patch, label) {
    /* A front vase changes where the lettering can go, so the layout flows again. */
    this.relayout(function (d) {
      d.vase = Object.assign({ kind: 'aluminum', spots: ['left', 'right'], pos: hsIsLying(d) ? 'back' : null, size: 5 }, d.vase || {}, patch);
    }, label || 'Flower vases');
  }
  toggleMirror() { this.relayout(function (d) { d.params = Object.assign({}, d.params, { mirror: d.params.mirror === false }); }, 'Mirror'); }
  setShape(shape) {
    if (this.state.sel >= 0 && hsIsLying(this.state.designs[this.state.sel]) && shape !== 'flat') return;
    this.relayout(function (d) {
      d.shape = shape;
      if ((shape === 'book' || shape === 'dheart') && d.params.layout !== 'split') d.params = Object.assign({}, d.params, { layout: 'split', layoutBefore: d.params.layout });
      else if (shape !== 'book' && shape !== 'dheart' && d.params.layout === 'split' && d.params.layoutBefore) d.params = Object.assign({}, d.params, { layout: d.params.layoutBefore, layoutBefore: '' });
      if (shape === 'heart' || shape === 'dheart') d.H = Math.max(d.H, Math.round(d.W * (shape === 'heart' ? 0.8 : 0.7)));
      else if (d.type === d.genType) d.H = d.genH;
      else d.H = hsFind(HS_TYPES, d.type).H;
    }, 'Shape: ' + hsFind(HS_SHAPES, shape).label);
  }
  setMaterial(id) { this.editDesign(function (d) { d.material = id; }, true, true, 'Granite: ' + hsFind(HS_MATERIALS, id).label); }
  /* One change to one part becomes an adjustment relative to where the layout puts it. */
  adjPatch(d, l, patch) {
    if (l.extra) {
      d.params.extra = (d.params.extra || []).map(function (x) { return x.id === l.id ? Object.assign({}, x, patch) : x; });
      return;
    }
    var adj = Object.assign({}, d.params.adj || {}), a = Object.assign({}, adj[l.key] || {});
    Object.keys(patch).forEach(function (k) {
      if (k === 'x') a.dx = hsR(patch.x - l.bx, 3);
      else if (k === 'y') a.dy = hsR(patch.y - l.by, 3);
      else a[k] = patch[k];
    });
    if (!a.dx) delete a.dx; if (!a.dy) delete a.dy;
    adj[l.key] = a;
    d.params.adj = adj;
  }
  updLayer(id, patch, record, label) {
    var l = this.findLayer(id), self = this;
    if (!l) return;
    this.relayout(function (d) { self.adjPatch(d, l, patch); }, label || self.layerLabel(l, patch));
  }
  updLayers(patches, label) {
    var self = this;
    this.relayout(function (d) { patches.forEach(function (pt) { var l = self.findLayer(pt.id); if (l) self.adjPatch(d, l, pt.patch); }); }, label);
  }
  layerLabel(l, patch) {
    var nm = l.name || 'part', k = Object.keys(patch)[0];
    var what = { x: 'Moved', y: 'Moved', text: 'Reworded', font: 'Typeface for', ht: 'Resized', track: 'Letter spacing for', size: 'Resized', sym: 'Changed symbol', carve: 'Finish for', paint: 'Paint for', visible: patch.visible === false ? 'Hid' : 'Showed', w: 'Resized', frame: 'Frame for', photo: 'Changed photo in', bstyle: 'Border style', inset: 'Border inset', dateStyle: 'Date format for', dateStack: 'Date lines for' }[k] || 'Edited';
    return what + ' ' + nm;
  }
  /* Layer list drag: put one part directly above or below another in the stack (top of the list is on top). */
  restack(fromId, toId) {
    var d = this.cur(); if (!d) return;
    var disp = d.layers.slice().reverse(), from = null, fi = -1, ti = -1;
    disp.forEach(function (l, i) { if (l.id === fromId) { from = l; fi = i; } if (l.id === toId) ti = i; });
    if (!from || ti < 0) return;
    disp.splice(fi, 1);
    var at = disp.map(function (l) { return l.id; }).indexOf(toId);
    disp.splice(fi < ti ? at + 1 : at, 0, from);
    var z = disp.slice().reverse().map(function (l) { return l.key; });
    var target = null; d.layers.forEach(function (l) { if (l.id === toId) target = l; });
    this.setParam({ z: z }, 'Moved ' + from.name + (fi < ti ? ' below ' : ' above ') + (target ? target.name : 'another layer'));
  }
  resetLayer(id) {
    var l = this.findLayer(id); if (!l) return;
    this.relayout(function (d) {
      if (l.extra) return;
      var adj = Object.assign({}, d.params.adj || {});
      if (adj[l.key]) { var a = Object.assign({}, adj[l.key]); HS_ADJ_SIZE.forEach(function (f) { delete a[f]; }); adj[l.key] = a; }
      d.params.adj = adj;
    }, 'Put ' + l.name + ' back in place');
  }
  resetLayout() {
    this.relayout(function (d) { d.params.adj = hsStripAdj(d.params.adj || {}); }, 'Reset to the layout');
  }
  setKeepAdj(on) { this.editDesign(function (d) { d.params.keepAdj = on; }, true, true, on ? 'Keep adjustments on layout change' : 'Start fresh on layout change'); }
  addLayer(layer, label) {
    layer.id = 'x' + (this.nextId++);
    layer.visible = true;
    this.relayout(function (d) { d.params.extra = (d.params.extra || []).concat([layer]); }, label || 'Added ' + layer.name);
    this.setState({ selLayer: layer.id, rtab: 'layers', addOpen: false });
  }
  nameCarve() {
    var d = this.cur(), c = 'vcut';
    if (d) d.layers.forEach(function (l) { if (l.type === 'text' && /Name/.test(l.name) && c === 'vcut') c = l.carve; });
    return c;
  }
  addText(kind, person) {
    var d = this.cur(); if (!d) return;
    var C = this.content(), f = this.state.form;
    var fsA = hsFind(HS_FONTSETS, d.params.fonts);
    var who = person === 2 ? hsNameParts(f.name2 || '') : C.np;
    var presets = {
      name: { name: person === 2 ? 'Name (' + (who.first || 'second person') + ')' : 'Name', text: fsA.name === 'gothic' || fsA.name === 'script' ? (who.full || 'Full Name') : (who.full || 'FULL NAME').toUpperCase(), font: fsA.name, ht: 1.3, track: fsA.nameTrack },
      dates: { name: person === 2 ? 'Dates (' + (who.first || 'second person') + ')' : 'Dates', role: 'dates', person: person || 1, dateStyle: d.params.dateStyle || 'upper', text: 'MONTH D, YYYY – MONTH D, YYYY', font: fsA.dates, ht: 0.85, track: fsA.datesTrack * 0.5 },
      epitaph: { name: 'Epitaph', text: C.quotes[0] || 'Epitaph line', font: fsA.quote, ht: 0.8, track: 0.02 },
      text: { name: 'Text', text: 'Your words here', font: fsA.quote, ht: 1, track: 0.02 }
    };
    var l = Object.assign({ type: 'text', carve: this.nameCarve(), x: d.W / 2, y: hsR(d.H * 0.8, 2) }, presets[kind]);
    if (kind !== 'dates') hsFitInto(l, d.W - 2 * (hsClear(d) + 0.5), l.ht, 0.75, 3);
    this.addLayer(l);
  }
  addSymbol(sym) {
    var d = this.cur(); if (!d) return;
    sym = sym || (d.params.sym1 || 'blossom');
    this.addLayer({ type: 'symbol', name: hsSymLabel(sym), carve: 'frost', sym: sym, size: hsR(Math.min(3.2, d.H * 0.16), 1), x: hsR(d.W * 0.82, 2), y: hsR(d.H * 0.72, 2) });
  }
  addPhoto(pid) {
    var d = this.cur(), p = null;
    this.state.photos.forEach(function (x) { if (x.id === pid) p = x; });
    if (!d) return;
    if (!p) p = this.state.photos[0];
    if (!p) { this.setState({ addOpen: false, status: 'Upload a photo first, then add it as an image.' }); return; }
    var m = hsFind(HS_MATERIALS, d.material), w = Math.min(6, d.H * 0.34), h = hsR(w * 1.28, 2);
    this.addLayer({ type: 'photo', name: 'Portrait' + (p.owner === 2 ? ' (' + (hsNameParts(this.state.form.name2).first || 'second person') + ')' : ''), photo: p.id, w: hsR(w, 2), h: h, ar: 1.28, frame: 'oval', carve: m.laserOk ? 'laser' : 'porcelain', x: hsR(d.W * 0.2, 2), y: hsR(d.H * 0.5, 2) });
  }
  addBorder() {
    var d = this.cur(), inset = 1;
    if (d) d.layers.forEach(function (l) { if (l.type === 'border' && l.visible) inset = Math.max(inset, hsR(l.inset + 0.6, 2)); });
    this.addLayer({ type: 'border', name: 'Border', carve: this.nameCarve(), bstyle: 'single', inset: Math.min(3, inset) });
  }
  bestSize() {
    var d = this.cur(); if (!d) return;
    var b = hsBestSize(d, this.content());
    if (!b) return;
    var same = b.W === d.W && b.H === d.H;
    this.setState({ sizeMsg: same ? 'This is already the best size for everything you chose.' : 'Resized to ' + b.W + '″ × ' + b.H + '″' + (b.perfect ? ' so everything fits at full size with room to breathe.' : ', the most comfortable fit available for this stone type.') });
    if (!same) this.setSize(b.W, b.H);
  }
  fitLettering() {
    var d = this.cur(); if (!d) return;
    var b = hsBestLettering(d, this.content());
    if (!b) { this.setState({ sizeMsg: 'Everything is already as large as this stone allows. A larger stone or fewer lines would give the lettering more room.' }); return; }
    var same = b.textSize === d.params.textSize && b.spacing === (d.params.spacing || 1) && JSON.stringify(b.adj) === JSON.stringify(d.params.adj || {});
    this.setState({ sizeMsg: same ? 'The lettering already fits this stone as well as it can.' : 'Lettering set to ' + Math.round(b.textSize * 100) + '% with ' + (b.spacing < 1 ? 'closer' : b.spacing > 1 ? 'roomier' : 'balanced') + ' line spacing, the fullest comfortable fit for this stone' + (b.yellow ? ', with ' + b.yellow + (b.yellow === 1 ? ' part' : ' parts') + ' a touch snug.' : '.') });
    if (!same) this.relayout(function (dd) { dd.params = Object.assign({}, dd.params, { textSize: b.textSize, spacing: b.spacing, adj: b.adj }); }, 'Best lettering for this stone');
  }
  resize(dW, dH) {
    var d = this.cur(); if (!d) return;
    this.setSize(Math.max(14, Math.min(72, d.W + dW)), Math.max(8, Math.min(48, d.H + dH)));
  }
  duplicate() {
    var l = this.findLayer(this.state.selLayer); if (!l) return;
    var c = {};
    Object.keys(l).forEach(function (k) { if (!/^(id|key|bx|by|extra|adjusted)$/.test(k)) c[k] = l[k]; });
    c.name = l.name + ' copy';
    if (c.type !== 'border') { c.x = hsR(l.x + 0.5, 2); c.y = hsR(l.y + 0.5, 2); } else { c.inset = hsR(Math.min(3, l.inset + 0.6), 2); }
    if (hsIsDatesLayer(l) && !c.role) { c.role = 'dates'; c.person = /Partner/.test(l.key || '') ? 2 : 1; }
    this.addLayer(c, 'Duplicated ' + l.name);
  }
  remove() {
    var l = this.findLayer(this.state.selLayer); if (!l) return;
    this.relayout(function (d) {
      if (l.extra) { d.params.extra = (d.params.extra || []).filter(function (x) { return x.id !== l.id; }); return; }
      var adj = Object.assign({}, d.params.adj || {});
      adj[l.key] = Object.assign({}, adj[l.key] || {}, { removed: true });
      d.params.adj = adj;
    }, 'Removed ' + l.name);
    this.setState({ selLayer: null });
  }
  restoreRemoved() {
    this.relayout(function (d) {
      var adj = Object.assign({}, d.params.adj || {});
      Object.keys(adj).forEach(function (k) { if (adj[k].removed) { adj[k] = Object.assign({}, adj[k]); delete adj[k].removed; } });
      d.params.adj = adj;
    }, 'Brought back removed parts');
  }
  nudge(dx, dy) {
    var d = this.cur(), l = this.findLayer(this.state.selLayer);
    if (!d || !l || l.type === 'border') return;
    this.updLayer(l.id, { x: hsR(Math.max(0, Math.min(d.W, l.x + dx)), 3), y: hsR(Math.max(0, Math.min(d.H, l.y + dy)), 3) }, true, 'Moved ' + l.name);
  }
  fitLayer(id) {
    var d = this.cur(), l0 = this.findLayer(id);
    if (!d || !l0 || l0.type === 'border') return;
    var W = d.W, H = d.H, clear = hsClear(d);
    var l = Object.assign({}, l0), b = hsBox(l);
    var side = Math.max(hsSideAt(d.shape, W, H, b.y0), hsSideAt(d.shape, W, H, b.y1));
    var maxW = W - 2 * (clear + side) - 0.1;
    if (l.type === 'text' && b.w > maxW) hsFitInto(l, maxW, l.ht, Math.min(l.ht, 0.75), 4);
    if (l.type === 'symbol' && l.size > maxW) l.size = hsR(maxW, 2);
    if (l.type === 'photo' && l.w > maxW) { l.w = hsR(maxW, 2); l.h = hsR(maxW * (l.ar || 1.3), 2); }
    b = hsBox(l);
    var lo = clear + side + b.w / 2, hi = W - clear - side - b.w / 2;
    l.x = hsR(Math.min(Math.max(l.x, lo), Math.max(lo, hi)), 2);
    b = hsBox(l);
    var top = hsMaxTop(d.shape, W, H, b.x0, b.x1) + clear + b.h / 2 + 0.05, bot = H - clear - b.h / 2 - 0.05;
    l.y = hsR(Math.min(Math.max(l.y, top), Math.max(top, bot)), 2);
    var patch = {};
    ['x', 'y', 'ht', 'size', 'w', 'h', 'text'].forEach(function (k) { if (l[k] !== undefined && l[k] !== l0[k]) patch[k] = l[k]; });
    if (Object.keys(patch).length) this.updLayer(id, patch, true, 'Fit ' + l0.name + ' inside the margins');
  }
  reflow() {
    var d = this.cur(); if (!d) return;
    var W = d.W, H = d.H, clear = hsClear(d);
    var items = d.layers.filter(function (l) { return l.visible && l.type !== 'border' && l.type !== 'photo'; })
      .map(function (l) { return Object.assign({}, l); })
      .sort(function (a, b) { return hsBox(a).y0 - hsBox(b).y0; });
    if (!items.length) return;
    var rows = [];
    items.forEach(function (it) {
      var bi = hsBox(it), row = null;
      rows.forEach(function (r) {
        if (row) return;
        var vOver = r.some(function (o) { var bo = hsBox(o); return Math.min(bo.y1, bi.y1) - Math.max(bo.y0, bi.y0) > 0.2; });
        var hOver = r.some(function (o) { var bo = hsBox(o); return Math.min(bo.x1, bi.x1) - Math.max(bo.x0, bi.x0) > 0; });
        if (vOver && !hOver) row = r;
      });
      if (row) row.push(it); else rows.push([it]);
    });
    var x0 = W, x1 = 0;
    items.forEach(function (it) { var b = hsBox(it); x0 = Math.min(x0, b.x0); x1 = Math.max(x1, b.x1); });
    var blocks = rows.map(function (r, i) {
      var lead = r[0], h = 0;
      r.forEach(function (o) { var b = hsBox(o); h = Math.max(h, b.h); if (b.w > hsBox(lead).w) lead = o; });
      return { layer: lead, h: h, gap: i ? 0.9 : 0, attach: r.filter(function (o) { return o !== lead; }) };
    });
    hsFlow(blocks, hsMaxTop(d.shape, W, H, x0, x1) + clear + 0.2, H - clear - 0.2);
    var byId = {};
    d.layers.forEach(function (l) { byId[l.id] = l; });
    this.updLayers(items.filter(function (it) { return byId[it.id] && Math.abs(byId[it.id].y - it.y) > 0.001; }).map(function (it) { return { id: it.id, patch: { y: it.y } }; }), 'Evened out the spacing');
  }

  beginDrag(id, e) {
    if (this.state.screen === 'guided') { this.beginSwap(id, e); return; }
    if (this.state.screen !== 'edit') return;
    var l = this.findLayer(id);
    if (!l || l.type === 'border') return;
    var el = e.currentTarget, svg = el.ownerSVGElement || el;
    var r = svg.getBoundingClientRect(), vb = svg.viewBox && svg.viewBox.baseVal;
    var ppu = vb && vb.width ? Math.min(r.width / vb.width, r.height / vb.height) : 1;
    if (e.preventDefault) e.preventDefault();
    try { el.setPointerCapture(e.pointerId); } catch (err) {}
    this.setState({ selLayer: id, rtab: this.state.rtab === 'handoff' ? 'layers' : this.state.rtab, drag: { id: id, sx: e.clientX, sy: e.clientY, ox: l.x, oy: l.y, ppi: (ppu * K) || 1, moved: false, before: this.state.designs, nx: l.x, ny: l.y } });
  }
  /* Walkthrough: drag a part onto another to swap their places in the top-to-bottom order. */
  beginSwap(id, e) {
    var l = this.findLayer(id);
    if (!l || !(l.inStack || l.side)) return;
    var el = e.currentTarget, svg = el.ownerSVGElement || el;
    var r = svg.getBoundingClientRect(), vb = svg.viewBox && svg.viewBox.baseVal;
    var ppu = vb && vb.width ? Math.min(r.width / vb.width, r.height / vb.height) : 1;
    if (e.preventDefault) e.preventDefault();
    try { el.setPointerCapture(e.pointerId); } catch (err) {}
    var d0 = this.cur(), other = l.side ? (d0.layers.filter(function (x) { return x.visible && x.side && x.side !== l.side; })[0] || null) : null;
    this.setState({ drag: { mode: 'swap', id: id, side: l.side || '', otherId: other ? other.id : '', sy: e.clientY, sx: e.clientX, ox: l.x, oy: l.y, ppi: (ppu * K) || 1, moved: false, before: this.state.designs, target: null } });
  }
  moveDrag(e) {
    var dr = this.state.drag, d = this.cur();
    if (!dr || !d) return;
    if (dr.mode === 'swap' && dr.side) {
      /* A side symbol slides across; past the middle it lands on the other side (swapping with the one there). */
      var sxn = dr.ox + (e.clientX - dr.sx) / dr.ppi, syn = dr.oy + (e.clientY - dr.sy) / dr.ppi * 0.25;
      var across = dr.side === 'L' ? sxn > d.W / 2 : sxn < d.W / 2;
      this.editDesign(function (dd) { dd.layers = dd.layers.map(function (l) { return l.id === dr.id ? Object.assign({}, l, { y: hsR(syn, 3), x: hsR(sxn, 3) }) : l; }); }, false, true);
      this.setState({ drag: Object.assign({}, dr, { moved: true, target: across ? (dr.otherId || 'slot') : null }) });
      return;
    }
    if (dr.mode === 'swap') {
      var ny = dr.oy + (e.clientY - dr.sy) / dr.ppi, nx = dr.ox + (e.clientX - dr.sx) / dr.ppi * 0.25, tgt = null, best = Infinity;
      d.layers.forEach(function (l) {
        if (!l.inStack || !l.visible || l.id === dr.id) return;
        var b = hsBox(l); if (!b) return;
        var dist = ny < b.y0 ? b.y0 - ny : ny > b.y1 ? ny - b.y1 : 0;
        if (dist < 0.6 && dist < best) { best = dist; tgt = l.id; }
      });
      this.editDesign(function (dd) { dd.layers = dd.layers.map(function (l) { return l.id === dr.id ? Object.assign({}, l, { y: hsR(ny, 3), x: hsR(nx, 3) }) : l; }); }, false, true);
      this.setState({ drag: Object.assign({}, dr, { moved: true, target: tgt }) });
      return;
    }
    var nx = Math.round((dr.ox + (e.clientX - dr.sx) / dr.ppi) * 8) / 8;
    var ny = Math.round((dr.oy + (e.clientY - dr.sy) / dr.ppi) * 8) / 8;
    var guide = false;
    if (Math.abs(nx - d.W / 2) < 0.35) { nx = d.W / 2; guide = true; }
    nx = Math.max(0, Math.min(d.W, nx)); ny = Math.max(0, Math.min(d.H, ny));
    /* While dragging, move the part directly; the move is recorded as an adjustment when it's let go. */
    this.editDesign(function (dd) { dd.layers = dd.layers.map(function (l) { return l.id === dr.id ? Object.assign({}, l, { x: nx, y: ny }) : l; }); }, false);
    this.setState({ guideX: guide, drag: Object.assign({}, dr, { moved: true, nx: nx, ny: ny }) });
  }
  endDrag() {
    var dr = this.state.drag;
    if (!dr) return;
    this.setState({ drag: null, guideX: false });
    if (dr.mode === 'swap') {
      var i = this.state.sel, designs = dr.before.slice(), before = designs[i];
      this.state.designs = designs;
      if (!dr.moved || !dr.target) { this.setState({ designs: designs }); return; }
      if (dr.side) {
        var pp0 = before.params || {}, sw0 = !!pp0.flankSwap;
        if (dr.target === 'slot') this.setParam({ flank: dr.side === 'L' ? 'right' : 'left', flankSwap: !sw0 }, 'Moved the side symbol to the ' + (dr.side === 'L' ? 'right' : 'left'));
        else this.setParam({ flankSwap: !sw0 }, 'Swapped the side symbols');
        return;
      }
      var stackL = before.layers.filter(function (l) { return l.inStack; }).sort(function (a, b) { return a.y - b.y; });
      var keys = stackL.map(function (l) { return l.key; });
      var a = null, b = null;
      before.layers.forEach(function (l) { if (l.id === dr.id) a = l; if (l.id === dr.target) b = l; });
      if (!a || !b) { this.setState({ designs: designs }); return; }
      var ia = keys.indexOf(a.key), ib = keys.indexOf(b.key);
      if (ia < 0 || ib < 0) { this.setState({ designs: designs }); return; }
      keys[ia] = b.key; keys[ib] = a.key;
      this.setParam({ order: keys }, 'Swapped ' + a.name + ' and ' + b.name);
      return;
    }
    if (!dr.moved) return;
    var l = this.findLayer(dr.id), self = this, C = this.content();
    if (!l) return;
    /* Record the move against the design as it was before the drag, as one step. */
    this.editDesign(function (d) { self.adjPatch(d, l, { x: dr.nx, y: dr.ny }); d.layers = hsLayoutBest(d, C); d.manual = false; }, false, true);
    this.pushHist('Moved ' + l.name, dr.before);
  }

  numbering(d) {
    var vis = d.layers.filter(function (l) { return l.visible; });
    vis.sort(function (a, b) {
      var ab = a.type === 'border' ? 0 : 1, bb = b.type === 'border' ? 0 : 1;
      if (ab !== bb) return ab - bb;
      if (ab === 0) return 0;
      return (hsBox(a).y0 - hsBox(b).y0) || (a.x - b.x);
    });
    var map = {};
    vis.forEach(function (l, i) { map[l.id] = i + 1; });
    return { map: map, ordered: vis };
  }
  sections(d) {
    var items = d.layers.filter(function (l) { return l.visible && l.type !== 'border'; });
    var boxes = items.map(function (l) { return { l: l, b: hsBox(l) }; });
    var ruler = {}, gaps = {};
    boxes.forEach(function (a) {
      var hidden = boxes.some(function (o) { return o !== a && Math.min(o.b.y1, a.b.y1) - Math.max(o.b.y0, a.b.y0) > 0.2 && o.b.w > a.b.w; });
      if (!hidden) ruler[a.l.id] = true;
      var prev = null;
      boxes.forEach(function (o) { if (o !== a && o.b.y1 <= a.b.y0 + 0.05 && (!prev || o.b.y1 > prev.b.y1)) prev = o; });
      if (prev) gaps[a.l.id] = { gap: a.b.y0 - prev.b.y1, from: prev.b.y1 };
    });
    var rows = boxes.slice().sort(function (a, b) { return a.b.y0 - b.b.y0; });
    return { ruler: ruler, gaps: gaps, rows: rows };
  }

  buildSvg(d, full) {
    var W = d.W, H = d.H, m = hsFind(HS_MATERIALS, d.material), shp = hsFind(HS_SHAPES, d.shape), ty = hsTypeOf(d);
    var path = hsStoneFor(d, W, H), num = this.numbering(d), photos = this.state.photos, bh = hsBaseH(d);
    var out = [];
    out.push('<?xml version="1.0" encoding="UTF-8"?>');
    out.push('<!-- Headstone design: ' + ty.label + ', ' + shp.label + ', ' + m.label + ' granite, ' + hsFind(HS_SURFACES, d.params.surface || 'polished').spec.toLowerCase() + ', ' + hsFind(HS_EDGES, d.params.edges || 'smooth').spec + ', face ' + W + 'in x ' + H + 'in' + (bh ? ', base ' + (W + 2 * hsBaseX(d)) + 'in x ' + bh + 'in' : '') + ' -->');
    out.push('<!-- Units are inches at 1:1. Text is live: convert to outlines before cutting the stencil. -->');
    out.push('<svg xmlns="http://www.w3.org/2000/svg" width="' + W + 'in" height="' + H + 'in" viewBox="0 0 ' + W + ' ' + H + '">');
    out.push('  <g id="stone-outline" data-role="cut-line" data-type="' + hsEsc(ty.label) + '">');
    out.push('    <path d="' + path + '" fill="none" stroke="#000000" stroke-width="0.04"/>');
    out.push('  </g>');
    num.ordered.forEach(function (l) {
      var c = hsFind(HS_CARVES, l.carve), n = num.map[l.id];
      var method = l.type === 'photo' ? hsPhotoMethod(l) : hsCarveSpec(l, m);
      var attrs = ' id="layer-' + n + '-' + hsSlug(l.name) + '" data-layer="' + n + '" data-type="' + l.type + '" data-carve="' + hsEsc(method) + '"';
      if (l.type === 'text') {
        var f = hsFind(HS_FONTS, l.font), fs = hsR(l.ht / f.cap, 3), b = hsBox(l);
        out.push('  <g' + attrs + ' data-font="' + hsEsc(f.spec) + '" data-letter-height="' + l.ht + 'in"' + (hsHasResv(l.text) ? ' data-reserved="space held for a date to be carved later"' : '') + '>');
        hsLines(l).map(hsResvStrip).forEach(function (s, i) {
          var by = hsR(b.y0 + l.ht + i * l.ht * HS_LH, 3);
          out.push('    <text x="' + hsR(l.x, 3) + '" y="' + by + '" text-anchor="middle" font-family="' + f.svg + '"' + (f.style === 'italic' ? ' font-style="italic"' : '') + ' font-size="' + fs + '" letter-spacing="' + hsR(l.track * fs, 3) + '" fill="#000000">' + hsEsc(s) + '</text>');
        });
        out.push('  </g>');
      } else if (l.type === 'symbol') {
        var sy = hsFind(HS_SYMBOLS, l.sym);
        var tf = 'translate(' + hsR(l.x - l.size / 2, 3) + ' ' + hsR(l.y - l.size / 2, 3) + ') scale(' + hsR(l.size / 100, 4) + ')';
        var paint = sy.mode === 'fill' ? 'fill="#000000" fill-rule="evenodd"' : 'fill="none" stroke="#000000" stroke-width="' + sy.sw + '" stroke-linecap="round" stroke-linejoin="round"';
        out.push('  <g' + attrs + ' data-symbol="' + hsEsc(sy.label) + '" data-size="' + l.size + 'in">');
        out.push('    <path transform="' + tf + '" ' + paint + ' d="' + sy.d.replace(/\s+/g, ' ').trim() + '"/>');
        out.push('  </g>');
      } else if (l.type === 'photo') {
        var p = null;
        photos.forEach(function (x) { if (x.id === l.photo) p = x; });
        var pb = hsBox(l), rx = hsPhotoRound(l.frame) ? hsR(l.w / 2, 3) : 0.06, ry = hsPhotoRound(l.frame) ? hsR(l.h / 2, 3) : 0.06;
        var cid = 'clip-' + n;
        out.push('  <g' + attrs + ' data-frame="' + (l.frame || 'oval') + '" data-look="' + (l.look || 'photo') + '" data-tone="' + (l.look && l.look !== 'photo' ? 'carved' : l.carve === 'laser' || l.tone === 'bw' ? 'black-and-white' : 'color') + '" data-size="' + hsR(l.w) + 'in x ' + hsR(l.h) + 'in">');
        out.push('    <clipPath id="' + cid + '"><rect x="' + hsR(pb.x0, 3) + '" y="' + hsR(pb.y0, 3) + '" width="' + hsR(l.w, 3) + '" height="' + hsR(l.h, 3) + '" rx="' + rx + '" ry="' + ry + '"/></clipPath>');
        out.push('    <image clip-path="url(#' + cid + ')" preserveAspectRatio="xMidYMid slice" x="' + hsR(pb.x0, 3) + '" y="' + hsR(pb.y0, 3) + '" width="' + hsR(l.w, 3) + '" height="' + hsR(l.h, 3) + '" href="' + (p ? (full ? p.url : 'data:image/jpeg;base64,…[embedded photo]') : '') + '"/>');
        out.push('    <rect x="' + hsR(pb.x0, 3) + '" y="' + hsR(pb.y0, 3) + '" width="' + hsR(l.w, 3) + '" height="' + hsR(l.h, 3) + '" rx="' + rx + '" ry="' + ry + '" fill="none" stroke="#000000" stroke-width="0.03"/>');
        out.push('  </g>');
      } else {
        var bd = hsFind(HS_BORDERS, l.bstyle);
        var line = 'fill="none" stroke="#000000" stroke-width="' + bd.w + '" stroke-linecap="round"' + (bd.dash !== 'none' ? ' stroke-dasharray="' + bd.dash + '"' : '');
        var tfi = function (i) { return 'translate(' + hsR(i, 3) + ' ' + hsR(i, 3) + ') scale(' + hsR((W - 2 * i) / W, 4) + ' ' + hsR((H - 2 * i) / H, 4) + ')'; };
        out.push('  <g' + attrs + ' data-border="' + hsEsc(bd.label) + '" data-inset="' + l.inset + 'in">');
        out.push('    <path transform="' + tfi(l.inset) + '" ' + line + ' d="' + path + '"/>');
        if (l.bstyle === 'double') out.push('    <path transform="' + tfi(l.inset + 0.55) + '" ' + line + ' d="' + path + '"/>');
        out.push('  </g>');
      }
    });
    out.push('</svg>');
    return out.join('\n');
  }
  copySvg() {
    var self = this, d = this.cur(); if (!d) return;
    var code = this.buildSvg(d, true);
    try {
      navigator.clipboard.writeText(code).then(function () {
        self.setState({ status: 'Copied. Paste it into an .svg file or send it to the carver.' });
      }, function () {
        self.setState({ status: 'Copying is blocked here. Use Download instead.' });
      });
    } catch (err) {
      this.setState({ status: 'Copying is blocked here. Use Download instead.' });
    }
  }
  downloadSvg() {
    var d = this.cur(); if (!d) return;
    try {
      var blob = new Blob([this.buildSvg(d, true)], { type: 'image/svg+xml' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url; a.download = 'headstone-' + hsSlug(this.state.form.name || 'design') + '.svg';
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 3000);
      this.setState({ status: 'Download started.' });
    } catch (err) {
      this.setState({ status: 'Downloads are blocked here. Use Copy SVG in the full editor instead.' });
    }
  }

  pill(on, accent, soft) { return { bg: on ? soft : '#ffffff', bd: on ? accent : '#d3cdc1', pressed: on ? 'true' : 'false' }; }

  renderVals() {
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

    var activeStep = fin ? 3 : refine ? 2 : isStage ? 1 : 0;
    var chosenOk = haveDesigns && st.sel >= 0;
    var stepGo = [
      { can: activeStep > 0 && scr !== 'building', go: function () { self.setState({ screen: 'intake', drag: null, guideX: false }); }, tip: 'Back to the questions' },
      { can: haveDesigns && scr !== 'building' && (activeStep !== 1 || focus), go: function () { self.setState({ screen: 'options', drag: null, guideX: false }); }, tip: 'Back to the three designs' },
      { can: chosenOk && !refine && scr !== 'building', go: function () { if (st.refineMode === 'edit') self.startEdit(); else self.startGuided(); }, tip: 'Refine the chosen design' },
      { can: chosenOk && !fin && scr !== 'building', go: function () { self.goFinal(); }, tip: 'See it in place' }
    ];
    v.steps = ['Details', 'Designs', 'Refine', 'Finish'].map(function (lab, i) {
      var done = i < activeStep, on = i === activeStep, can = stepGo[i].can;
      return { n: done ? '✓' : String(i + 1), label: lab, current: on ? 'step' : 'false',
        numBg: on ? accent : done ? soft : '#ffffff', numFg: on ? '#ffffff' : done ? accent : '#5d584f', numBd: on || done ? accent : '#bdb6a8',
        fg: on || can ? '#1e1c19' : '#5d584f', weight: on ? '600' : '500', lineDisp: i < 3 ? 'block' : 'none',
        deco: can ? 'underline' : 'none', cursor: can ? 'pointer' : 'default', disabled: !can,
        go: function () { if (stepGo[i].can) stepGo[i].go(); },
        tip: can ? stepGo[i].tip : '', aria: 'Step ' + (i + 1) + ': ' + lab + (on ? ', current step' : can ? ', go to this step' : '') };
    });
    v.showRegen = scr === 'options';
    v.showUndo = refine;
    v.showToEditor = guided;
    v.showToGuided = edit;
    v.showThisOne = refine;
    v.undoDisabled = this.past.length === 0;
    v.undoOpacity = this.past.length === 0 ? 0.5 : 1;
    v.redoDisabled = this.future.length === 0;
    v.redoOpacity = this.future.length === 0 ? 0.5 : 1;
    v.redo = function () { self.redo(); };
    v.undoTitle = this.past.length ? 'Undo: ' + this.past[this.past.length - 1].label + ' (Ctrl+Z)' : 'Nothing to undo yet';
    v.redoTitle = this.future.length ? 'Redo: ' + this.future[this.future.length - 1].label + ' (Ctrl+Shift+Z)' : 'Nothing to redo';
    v.toAll = function () { self.setState({ screen: 'options', drag: null, guideX: false }); };
    v.regen = function () { self.showDesigns(st.variant + 1); };
    v.toEdit = function () { self.startEdit(); };
    v.toGuided = function () { self.startGuided(); };
    v.toFinal = function () { self.goFinal(); };
    v.undo = function () { self.undo(); };
    v.keepRefining = function () { if (st.refineMode === 'edit') self.startEdit(); else self.startGuided(); };

    var born = hsParseDate(f.born), passed = hsParseDate(f.passed);
    v.fName = f.name; v.fBorn = f.born; v.fPassed = f.passed; v.fTheme = f.theme; v.fStory = f.story; v.fFaithOther = f.faithOther || '';
    v.onName = function (e) { self.setForm({ name: e.target.value }); };
    v.onBorn = function (e) { self.setForm({ born: e.target.value }); };
    v.onPassed = function (e) { self.setForm({ passed: e.target.value }); };
    /* one person or two */
    var two = f.who === 'two';
    v.twoDisp = two ? 'flex' : 'none';
    v.whoChips = [['one', 'One person', 'M19.4 8 A3.4 3.4 0 1 1 12.6 8 A3.4 3.4 0 1 1 19.4 8 Z M9.5 21 C9.5 16.5 12.5 14 16 14 C19.5 14 22.5 16.5 22.5 21'], ['two', 'Two people, together', 'M15.1 8.3 A3.1 3.1 0 1 1 8.9 8.3 A3.1 3.1 0 1 1 15.1 8.3 Z M23.1 8.3 A3.1 3.1 0 1 1 16.9 8.3 A3.1 3.1 0 1 1 23.1 8.3 Z M3.8 21 C3.8 16.4 7.4 13.8 11.2 13.8 C13.4 13.8 15.2 14.8 16 16.2 M28.2 21 C28.2 16.4 24.6 13.8 20.8 13.8 C18.6 13.8 16.8 14.8 16 16.2']].map(function (x) {
      var on = (f.who || 'one') === x[0], p = self.pill(on, accent, soft);
      return { label: x[1], icon: x[2], ic: on ? accent : '#5d584f', bg: p.bg, bd: p.bd, pressed: p.pressed, pick: function () { self.setForm({ who: x[0] }); } };
    });
    v.pairChips = [['shared', 'One shared companion stone', 'Both names on a single stone, each with their own side.'], ['matching', 'Matching stones, one each', 'Two stones designed as a pair, side by side.']].map(function (x) {
      var on = (f.pair || 'shared') === x[0], p = self.pill(on, accent, soft);
      return { label: x[1], desc: x[2], bg: p.bg, bd: p.bd, pressed: p.pressed, pick: function () { self.setForm({ pair: x[0] }); } };
    });
    v.p1Heading = 'The first person'; v.p2Heading = 'The second person';
    v.fName2 = f.name2 || ''; v.onName2 = function (e) { self.setForm({ name2: e.target.value }); };
    v.name2Err = st.errors.name2 || ''; v.name2ErrDisp = st.errors.name2 ? 'block' : 'none';
    v.name2Invalid = st.errors.name2 ? 'true' : 'false'; v.name2Bd = st.errors.name2 ? '#9a2f22' : '#b3ab9c';
    v.date2Err = st.errors.date2 || ''; v.date2ErrDisp = st.errors.date2 ? 'block' : 'none';
    v.date2Invalid = st.errors.date2 ? 'true' : 'false'; v.date2Bd = st.errors.date2 ? '#9a2f22' : '#b3ab9c';
    v.openBorn2 = function () { self.openDate('born2'); }; v.openPassed2 = function () { self.openDate('passed2'); };
    var first1 = hsNameParts(f.name).first || 'them', first2 = hsNameParts(f.name2).first || 'them';
    v.story1Label = two ? 'About ' + first1 : 'A few sentences about them';
    v.story2Label = 'About ' + first2; v.story2Ph = 'What did ' + (first2 === 'them' ? 'they' : first2) + ' love? Where were they happiest?';
    v.fStory2 = f.story2 || ''; v.onStory2 = function (e) { self.setForm({ story2: e.target.value }); };
    /* date fields + picker */
    var dpFieldDisp = function (iso) { var dt = hsParseDate(iso); return dt ? HS_MONTHS[dt.m - 1] + ' ' + dt.d + ', ' + dt.y : ''; };
    v.softAccent = hsRgba(accent, 0.1);
    v.bornDisp = dpFieldDisp(f.born) || 'Choose a date'; v.bornFg = f.born ? '#1e1c19' : '#7a7368';
    v.born2Disp = dpFieldDisp(f.born2) || 'Choose a date'; v.born2Fg = f.born2 ? '#1e1c19' : '#7a7368';
    v.passed2Disp = dpFieldDisp(f.passed2) || 'Choose a date'; v.passed2Fg = f.passed2 ? '#1e1c19' : '#7a7368';
    v.passedDisp = dpFieldDisp(f.passed) || 'Choose a date'; v.passedFg = f.passed ? '#1e1c19' : '#7a7368';
    v.openBorn = function () { self.openDate('born'); }; v.openPassed = function () { self.openDate('passed'); };
    var dp = st.dp;
    v.dpOpen = !!dp;
    v.dpBackdrop = function (e) { if (e && e.target === e.currentTarget) self.dpClose(); };
    v.dpKey = function (e) {
      if (!e) return;
      if (e.key === 'Escape') { e.preventDefault(); self.dpClose(); return; }
      var inp = self._dpInput;
      if (e.key === 'Enter' && e.target === inp && self.state.dp && self.state.dp.sel && !self.state.dp.err) { e.preventDefault(); self.dpOk(); return; }
      /* Typing a number anywhere in the picker goes straight into the date box. */
      if (/^[0-9]$/.test(e.key) && inp && e.target !== inp && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        var cur = self.state.dp && self.state.dp.editing ? String(inp.value || '').replace(/\D/g, '') : '';
        if (v.dpOnHead) v.dpOnHead({ target: { value: cur + e.key } });
        try { inp.focus(); setTimeout(function () { try { var n = inp.value.length; inp.setSelectionRange(n, n); } catch (er) {} }, 0); } catch (er) {}
      }
    };
    /* The date box is ready to type into the moment the picker opens. */
    if (!dp) self._dpFocused = null;
    v.dpHeadRef = function (el) {
      self._dpInput = el || self._dpInput;
      if (el && dp && self._dpFocused !== dp.field) {
        self._dpFocused = dp.field;
        setTimeout(function () { try { el.focus(); el.select(); } catch (er) {} }, 30);
      }
    };
    v.dpHeadFocus = function (e) { try { e.target.select(); } catch (er) {} };
    if (dp) {
      var WD = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], today = hsIsoToday(), ty = +today.slice(0, 4), tm = +today.slice(5, 7) - 1;
      var pad = function (n) { return (n < 10 ? '0' : '') + n; };
      var selD = hsParseDate(dp.sel);
      var dpWho = f.who === 'two' ? (hsNameParts(/2$/.test(dp.field) ? f.name2 : f.name).first || '') : '';
      v.dpTitle = /^born/.test(dp.field) ? 'The day ' + (dpWho || 'they') + (dpWho ? ' was' : ' were') + ' born' : 'The day ' + (dpWho || 'they') + ' passed';
      v.dpHeadline = selD ? ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date(selD.y, selD.m - 1, selD.d).getDay()] + ', ' + HS_MONTHS[selD.m - 1] + ' ' + selD.d + ', ' + selD.y : 'Type it, or choose it below';
      /* The header is the date itself, ready to type into as MM/DD/YYYY; choosing on the calendar fills it in. */
      v.dpHeadText = dp.editing ? (dp.text || '') : selD ? pad(selD.m) + '/' + pad(selD.d) + '/' + selD.y : '';
      v.dpOnHead = function (e) {
        var dg = String(e.target.value || '').replace(/\D/g, '').slice(0, 8);
        var t = dg.slice(0, 2) + (dg.length > 2 ? '/' + dg.slice(2, 4) : '') + (dg.length > 4 ? '/' + dg.slice(4) : '');
        var patch = { text: t, editing: true, err: '' };
        if (dg.length === 8) {
          var mm = +dg.slice(0, 2), dd = +dg.slice(2, 4), yy = +dg.slice(4), okD = mm >= 1 && mm <= 12 && dd >= 1 && dd <= new Date(yy, mm, 0).getDate() && yy >= 1800;
          if (!okD) patch.err = 'That doesn’t look like a real date. Try MM/DD/YYYY, like 04/12/1941.';
          else {
            var iso = yy + '-' + pad(mm) + '-' + pad(dd), why = self.dpBlocked(iso, self.state.dp.field);
            if (why) patch.err = why;
            else { patch.sel = iso; patch.y = yy; patch.m = mm - 1; patch.view = 'day'; patch.page = yy - (((yy % 12) + 12) % 12); }
          }
        }
        self.dpSet(patch);
      };
      v.dpHeadOp = selD ? 1 : 0.6;
      v.dpCal = true; v.dpTyping = false;
      v.dpModeLabel = dp.typing ? 'Use the calendar' : 'Type the date instead';
      v.dpModeIcon = dp.typing ? 'M4 7 H20 V20 H4 Z M4 11 H20 M8.5 4.5 V8.5 M15.5 4.5 V8.5' : 'M4 20 L4.6 16.4 L15.8 5.2 A1.9 1.9 0 0 1 18.8 8.2 L7.6 19.4 Z M13.8 7.2 L16.8 10.2';
      v.dpToggleMode = function () { var d0 = self.state.dp; self.dpSet({ typing: !d0.typing, err: '', text: d0.sel ? d0.sel.slice(5, 7) + '/' + d0.sel.slice(8, 10) + '/' + d0.sel.slice(0, 4) : '' }); };
      v.dpText = dp.text; v.dpOnText = function (e) { self.dpSet({ text: e.target.value, err: '' }); };
      v.dpErr = dp.err || ''; v.dpErrDisp = dp.err ? 'block' : 'none';
      v.dpIsDay = dp.view === 'day'; v.dpIsMonth = dp.view === 'month'; v.dpIsYear = dp.view === 'year';
      v.dpNavLabel = dp.view === 'day' ? HS_MONTHS[dp.m] + ' ' + dp.y : dp.view === 'month' ? String(dp.y) : dp.page + ' – ' + (dp.page + 11);
      v.dpNavHint = dp.view === 'year' ? 'Choose a year' : dp.view === 'month' ? 'Choose a month' : '';
      v.dpNavCaret = dp.view === 'year' ? 'none' : 'inline';
      v.dpNavTap = function () { var d0 = self.state.dp; self.dpSet(d0.view === 'day' ? { view: 'month' } : d0.view === 'month' ? { view: 'year', page: d0.y - (((d0.y % 12) + 12) % 12) } : {}); };
      var step = function (dir) {
        var d0 = self.state.dp;
        if (d0.view === 'day') { var mm = d0.m + dir, yy = d0.y; if (mm < 0) { mm = 11; yy--; } if (mm > 11) { mm = 0; yy++; } self.dpSet({ m: mm, y: yy }); }
        else if (d0.view === 'month') self.dpSet({ y: d0.y + dir });
        else self.dpSet({ page: d0.page + dir * 12 });
      };
      v.dpPrev = function () { step(-1); }; v.dpNext = function () { step(1); };
      var nextBlocked = dp.view === 'day' ? (dp.y > ty || (dp.y === ty && dp.m >= tm)) : dp.view === 'month' ? dp.y >= ty : dp.page + 11 >= ty;
      v.dpNextOp = nextBlocked ? 0.3 : 1; v.dpNextDis = nextBlocked ? 'true' : 'false';
      v.dpNextPe = nextBlocked ? 'none' : 'auto';
      v.dpWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(function (s, i) { return { s: s, key: 'w' + i }; });
      var cell = function (on, dis, isToday) {
        return { bg: on ? accent : 'transparent', fg: on ? '#ffffff' : dis ? '#bdb6aa' : '#1e1c19', bd: isToday && !on ? accent : 'transparent', pe: dis ? 'none' : 'auto', w: on || isToday ? 700 : 500 };
      };
      if (dp.view === 'day') {
        var first = new Date(dp.y, dp.m, 1).getDay(), nd = new Date(dp.y, dp.m + 1, 0).getDate(), days = [];
        for (var bi = 0; bi < first; bi++) days.push({ label: '', aria: '', vis: 'hidden', bg: 'transparent', fg: '#1e1c19', bd: 'transparent', pe: 'none', w: 500, pressed: 'false', pick: function () {} });
        for (var dd = 1; dd <= nd; dd++) (function (dd) {
          var iso = dp.y + '-' + pad(dp.m + 1) + '-' + pad(dd), on = dp.sel === iso, dis = !!self.dpBlocked(iso, dp.field);
          days.push(Object.assign({ label: String(dd), aria: HS_MONTHS[dp.m] + ' ' + dd + ', ' + dp.y, vis: 'visible', pressed: on ? 'true' : 'false', pick: function () { self.dpSet({ sel: iso, editing: false, err: '' }); } }, cell(on, dis, iso === today)));
        })(dd);
        while (days.length % 7) days.push({ label: '', aria: '', vis: 'hidden', bg: 'transparent', fg: '#1e1c19', bd: 'transparent', pe: 'none', w: 500, pressed: 'false', pick: function () {} });
        v.dpDays = days;
      } else v.dpDays = [];
      v.dpMonths = dp.view === 'month' ? HS_MONTHS.map(function (mn, mi) {
        var on = selD && selD.y === dp.y && selD.m - 1 === mi, dis = dp.y > ty || (dp.y === ty && mi > tm);
        return Object.assign({ label: mn.slice(0, 3), aria: mn + ' ' + dp.y, pressed: on ? 'true' : 'false', pick: function () { self.dpSet({ m: mi, view: 'day' }); } }, cell(on, dis, dp.y === ty && mi === tm));
      }) : [];
      v.dpYears = dp.view === 'year' ? Array.apply(null, Array(12)).map(function (_, k) {
        var yy = dp.page + k, on = selD && selD.y === yy, dis = yy > ty;
        return Object.assign({ label: String(yy), aria: String(yy), pressed: on ? 'true' : 'false', pick: function () { self.dpSet({ y: yy, view: 'month' }); } }, cell(on, dis, yy === ty));
      }) : [];
      v.dpCancel = function () { self.dpClose(); };
      v.dpOk = function () { self.dpOk(); };
      v.dpClear = function () { self.dpClear(); };
      v.dpOkOp = dp.typing || dp.sel ? 1 : 0.4;
    } else {
      v.dpTitle = ''; v.dpHeadline = ''; v.dpHeadText = ''; v.dpOnHead = function () {}; v.dpHeadOp = 1; v.dpCal = false; v.dpTyping = false; v.dpModeLabel = ''; v.dpModeIcon = 'M0 0'; v.dpToggleMode = function () {};
      v.dpText = ''; v.dpOnText = function () {}; v.dpErr = ''; v.dpErrDisp = 'none'; v.dpIsDay = false; v.dpIsMonth = false; v.dpIsYear = false;
      v.dpNavLabel = ''; v.dpNavHint = ''; v.dpNavCaret = 'none'; v.dpNavTap = function () {}; v.dpPrev = function () {}; v.dpNext = function () {};
      v.dpNextOp = 1; v.dpNextDis = 'false'; v.dpNextPe = 'auto'; v.dpWeek = []; v.dpDays = []; v.dpMonths = []; v.dpYears = [];
      v.dpCancel = function () {}; v.dpOk = function () {}; v.dpClear = function () {}; v.dpOkOp = 1;
    }

    v.onTheme = function (e) { self.setForm({ theme: e.target.value }); };
    v.onStory = function (e) { self.setForm({ story: e.target.value }); };
    v.onFaithOther = function (e) { self.setForm({ faithOther: e.target.value }); };
    v.nameErr = st.errors.name || ''; v.showNameErr = !!st.errors.name;
    v.nameInvalid = st.errors.name ? 'true' : 'false'; v.nameBd = st.errors.name ? '#9a2f22' : '#b3ab9c';
    v.dateErr = st.errors.date || ''; v.showDateErr = !!st.errors.date;
    v.dateInvalid = st.errors.date ? 'true' : 'false'; v.dateBd = st.errors.date ? '#9a2f22' : '#b3ab9c';
    v.quoteRows = f.quotes.map(function (q, i) {
      return { label: f.quotes.length > 1 ? 'Quote ' + (i + 1) : 'Quote or epitaph', value: q,
        ph: i === 0 ? 'e.g. Forever in our hearts' : 'Another line to consider',
        onChange: function (e) { self.setQuote(i, e.target.value); },
        remove: function () { self.removeQuote(i); }, removeLabel: 'Remove quote ' + (i + 1),
        rmDisp: f.quotes.length > 1 ? 'flex' : 'none' };
    });
    v.addQuote = function () { self.addQuote(); };
    v.addQuoteDisp = f.quotes.length < 4 ? 'inline-flex' : 'none';
    var twoP = f.who === 'two' && String(f.name2 || '').trim();
    var pn1 = hsNameParts(f.name).first || 'the first person', pn2 = hsNameParts(f.name2 || '').first || 'the second person';
    v.photoZones = (twoP ? [[1, pn1], [2, pn2]] : [[1, '']]).map(function (z) {
      var mine = st.photos.filter(function (p) { return (p.owner || 1) === z[0]; }), over = st.dragOver === z[0];
      var lk = z[0] === 2 ? 'photoLater2' : 'photoLater', otherHas = twoP && (st.photos.some(function (p) { return (p.owner || 1) !== z[0]; }) || f[z[0] === 2 ? 'photoLater' : 'photoLater2']);
      var laterOn = !!f[lk] || (!mine.length && !!otherHas);
      return { title: 'Photos of ' + z[1], titleDisp: twoP ? 'flex' : 'none', badge: z[0] === 1 ? '1' : '2',
        prompt: twoP ? 'Add a photo of ' + z[1] : 'Drop photos here, or click to choose', aria: twoP ? 'Choose photos of ' + z[1] : 'Choose photos to upload',
        minH: twoP ? 120 : 180, bd: over ? accent : '#a39b8c', bg: over ? soft : '#ffffff', count: mine.length + ' of 6',
        onFiles: function (e) { self.handleFiles(e.target.files, z[0]); try { e.target.value = ''; } catch (err) {} self.setState({ dragOver: false }); },
        onDragOver: function () { if (self.state.dragOver !== z[0]) self.setState({ dragOver: z[0] }); },
        onDragLeave: function () { if (self.state.dragOver) self.setState({ dragOver: false }); },
        hasRows: mine.length > 0,
        laterDisp: mine.length ? 'none' : 'flex', laterOn: laterOn, laterLocked: !f[lk] && !!otherHas,
        laterText: twoP ? 'Save a spot for a photo of ' + z[1] + ' to add later' : 'Save a spot for a photo to add later',
        laterSub: !f[lk] && otherHas ? 'Held automatically so both sides of the stone match.' : 'The design keeps room for it. Nothing is carved there until the photo arrives.',
        toggleLater: function () { var pt = {}; pt[lk] = !laterOn; self.setForm(pt); },
        rows: mine.map(function (p, i) {
          return { url: p.url, alt: (twoP ? 'Photo of ' + z[1] + ': ' : 'Uploaded photo ') + p.name, bd: i === 0 ? accent : '#dcd7cc', firstDisp: i === 0 ? 'block' : 'none', firstLabel: twoP ? z[1] + '’s portrait' : 'Portrait',
            remove: function () { self.removePhoto(p.id); }, removeLabel: 'Remove photo ' + p.name };
        }) };
    });
    v.hasPhotos = st.photos.length > 0;
    v.photoRows = st.photos.map(function (p, i) {
      return { url: p.url, alt: 'Uploaded photo ' + p.name, bd: i === 0 ? accent : '#dcd7cc', firstDisp: i === 0 ? 'block' : 'none',
        remove: function () { self.removePhoto(p.id); }, removeLabel: 'Remove photo ' + p.name };
    });
    v.onFiles = function (e) { self.handleFiles(e.target.files); try { e.target.value = ''; } catch (err) {} self.setState({ dragOver: false }); };
    v.onDragOver = function () { if (!self.state.dragOver) self.setState({ dragOver: true }); };
    v.onDragLeave = function () { if (self.state.dragOver) self.setState({ dragOver: false }); };
    v.dropBd = st.dragOver ? accent : '#a39b8c';
    v.dropBg = st.dragOver ? soft : '#ffffff';
    var themeLow = f.theme.toLowerCase();
    var themeChip = function (label) {
      var on = themeLow.indexOf(label.toLowerCase()) >= 0;
      return { label: label, pressed: on ? 'true' : 'false', bg: on ? soft : '#ffffff', bd: on ? accent : '#cfc9bd',
        icon: on ? 'M5 12.5 L10 17 L19 7' : 'M12 5 V19 M5 12 H19', iconColor: on ? accent : '#4a463f',
        add: function () { self.toggleThemeChip(label); } };
    };
    v.feelChips = HS_FEEL_CHIPS.map(themeChip);
    v.placeFeelChips = HS_PLACE_CHIPS.map(themeChip);
    v.themeChips = HS_THEME_CHIPS.map(function (label) {
      var on = themeLow.indexOf(label.toLowerCase()) >= 0;
      return { label: label, pressed: on ? 'true' : 'false', bg: on ? soft : '#ffffff', bd: on ? accent : '#cfc9bd',
        icon: on ? 'M5 12.5 L10 17 L19 7' : 'M12 5 V19 M5 12 H19', iconColor: on ? accent : '#4a463f',
        add: function () { self.toggleThemeChip(label); } };
    });
    v.faithCards = HS_FAITHS.map(function (fa) {
      var on = f.faith === fa.id, sy = fa.sym ? hsFind(HS_SYMBOLS, fa.sym) : null;
      return { label: fa.label, pressed: on ? 'true' : 'false', bg: on ? soft : '#ffffff', bd: on ? accent : '#cfc9bd',
        svgDisp: sy ? 'block' : 'none', d: sy ? sy.d : '', fill: sy && sy.mode === 'fill' ? '#2b2925' : 'none', stroke: sy && sy.mode === 'stroke' ? '#2b2925' : 'none', sw: sy ? (sy.sw || 0) : 0,
        pick: function () { self.setForm({ faith: on ? '' : fa.id }); } };
    });
    /* "Details in mind": optional picks the generator will honor, spread across the three designs. */
    var prefs = f.prefs || {};
    var togglePref = function (g, id) { var pr = Object.assign({}, self.state.form.prefs || {}), a = (pr[g] || []).slice(), k = a.indexOf(id); if (k >= 0) a.splice(k, 1); else a.push(id); pr[g] = a; self.setForm({ prefs: pr }); };
    var prefOn = function (g, id) { return (prefs[g] || []).indexOf(id) >= 0; };
    var prefChip = function (g, id, label, extra) { var on = prefOn(g, id), p = self.pill(on, accent, soft); return Object.assign({ label: label, bg: p.bg, bd: p.bd, pressed: p.pressed, check: on ? 'inline' : 'none', pick: function () { togglePref(g, id); } }, extra || {}); };
    v.prefTypes = HS_TYPES.map(function (t) { return prefChip('types', t.id, t.label, { icon: t.icon, fill: prefOn('types', t.id) ? accent : '#6f6a60' }); });
    v.prefShapes = HS_SHAPES.filter(function (x) { return x.id !== 'dheart' || f.who === 'two'; }).map(function (x) { return prefChip('shapes', x.id, x.label, { d: hsStonePath(x.id, 36, 24, false), fill: prefOn('shapes', x.id) ? accent : '#6f6a60' }); });
    v.prefMats = HS_MATERIALS.map(function (x) { return prefChip('mats', x.id, x.label, { swatch: hsGraniteBg(x), ring: prefOn('mats', x.id) ? accent : 'transparent' }); });
    v.prefCarves = hsPrefFinishes().map(function (c) { return prefChip('carves', c.id, c.label, { dot: c.paint || hsCarveLook(c.id, hsFind(HS_MATERIALS, 'black')).color }); });
    v.prefFonts = HS_FONTSETS.map(function (fs) { var f1 = hsFind(HS_FONTS, fs.name); return prefChip('fonts', fs.id, fs.label, { family: f1.family, fstyle: f1.style }); });
    v.prefBorders = [{ id: 'none', label: 'No border' }].concat(HS_BORDERS).map(function (bd) { return prefChip('borders', bd.id, bd.label); });
    var nPrefs = HS_PREF_GROUPS.reduce(function (n, g) { return n + (prefs[g.id] || []).length; }, 0);
    v.prefCount = nPrefs ? nPrefs + (nPrefs === 1 ? ' pick' : ' picks') + ' · the designs will use only what you picked, in any mix, and choose freely for everything else' : 'Nothing picked yet, so we’ll choose what suits them best';
    v.prefClearDisp = nPrefs ? 'inline-flex' : 'none';
    v.prefClear = function () { self.setForm({ prefs: {} }); };
    /* Each group is a dropdown: one open at a time, so the choices come a few at a time. Closed groups show what's picked. */
    var srcOf = { types: HS_TYPES, shapes: HS_SHAPES, mats: HS_MATERIALS, carves: hsPrefFinishes(), fonts: HS_FONTSETS, borders: [{ id: 'none', label: 'No border' }].concat(HS_BORDERS) };
    var openG = st.prefOpen || '';
    v.pg = {};
    HS_PREF_GROUPS.forEach(function (g) {
      var a = prefs[g.id] || [], on = openG === g.id;
      v.pg[g.id] = { disp: on ? 'flex' : 'none', exp: on ? 'true' : 'false', rot: on ? 180 : 0, bg: on ? '#fbf8f2' : '#ffffff',
        sum: a.length ? a.map(function (id) { return hsFind(srcOf[g.id], id).label; }).join(', ') : 'Any, we’ll choose', sumFg: a.length ? accent : '#5d584f',
        count: a.length, countDisp: a.length ? 'inline-flex' : 'none',
        toggle: function () { self.setState({ prefOpen: on ? '' : g.id }); } };
    });
    v.faithOtherOn = f.faith === 'other';
    var fg = f.faith === 'other' ? hsFaithGuess(f.faithOther) : null, fgSy = fg ? hsFind(HS_SYMBOLS, fg.sym) : null;
    v.faithGuessDisp = f.faith === 'other' && String(f.faithOther || '').trim() ? 'flex' : 'none';
    v.faithGuessText = fg ? 'We’ll carve the ' + fg.label.toLowerCase() + (fg.faith ? ', the ' + fg.faith + ' symbol' : '') + '.' : 'We’ll choose a symbol from their story, or you can pick one while refining.';
    v.faithGuessSymDisp = fgSy ? 'block' : 'none'; v.faithGuessD = fgSy ? fgSy.d : 'M0 0';
    v.faithGuessFill = fgSy && fgSy.mode === 'fill' ? accent : 'none'; v.faithGuessStroke = fgSy && fgSy.mode === 'stroke' ? accent : 'none'; v.faithGuessSw = fgSy ? (fgSy.sw || 0) : 0;
    v.storyCount = f.story.length ? f.story.length + ' characters' : '';

    var ws = Math.max(0, Math.min(HS_WSTEPS.length - 1, st.wstep)), wmeta = HS_WSTEPS[ws];
    HS_WSTEPS.forEach(function (s0, wi) { v['wIs_' + s0.id] = ws === wi; });
    v.wEyebrow = 'Question ' + (ws + 1) + ' of ' + HS_WSTEPS.length + (wmeta.req ? ' · Required' : ' · Optional');
    v.wTitle = wmeta.title; v.wSub = wmeta.sub;
    if (f.who === 'two') {
      if (wmeta.id === 'name') { v.wTitle = 'Let’s begin with their names'; v.wSub = 'Write each name just as you’d like it carved, along with the dates you’d like remembered.'; }
      if (wmeta.id === 'photos') { v.wTitle = 'Would you like to share photos of them?'; v.wSub = 'Add a picture of each of them. Every photo stays with the right person, so each portrait sits on their own side of the stone.'; }
      if (wmeta.id === 'story') { v.wTitle = 'Tell us about them both'; v.wSub = 'A few sentences for each. What they loved, where they felt at home, the life they built together.'; }
    }
    v.wSubDisp = v.wSub ? 'block' : 'none';
    v.wProg = Math.round((ws + 1) / HS_WSTEPS.length * 100);
    v.wBack = function () { self.wBack(); };
    v.wBackVis = ws > 0 ? 'visible' : 'hidden';
    v.wNext = function () { self.wNext(); };
    v.wSkip = function () { if (ws < HS_WSTEPS.length - 1) self.goStep(ws + 1); else self.build(); };
    v.wSkipDisp = wmeta.req || ws === HS_WSTEPS.length - 1 ? 'none' : 'block';
    var last = ws === HS_WSTEPS.length - 1;
    v.wNextLabel = last ? 'Create their designs' : 'Continue';
    v.wNextClass = last ? 'hs-create' : '';
    v.wNextRays = last ? 'M19.2 3.8 L21.2 1.8 M4.8 3.8 L2.8 1.8 M19.2 18.2 L21.2 20.2 M4.8 18.2 L2.8 20.2' : 'M0 0';
    v.wAnim = (ws % 2 ? 'hsRiseA' : 'hsRiseB') + ' .6s ease both';
    v.wNextIcon = last ? 'M12 3 L13.8 9.2 L20 11 L13.8 12.8 L12 19 L10.2 12.8 L4 11 L10.2 9.2 Z' : 'M9 5 L16 12 L9 19';
    var nq0 = f.quotes.map(hsCleanQuote).filter(Boolean).length;
    var seenId = function (id) { var k = -1; HS_WSTEPS.forEach(function (s0, i0) { if (s0.id === id) k = i0; }); return !!st.wSeen[k]; };
    var sumById = {
      name: f.who === 'two' && f.name.trim() ? (hsNameParts(f.name).first || f.name.trim()) + ' & ' + (hsNameParts(f.name2).first || '…') + (f.pair === 'matching' ? ' · matching stones' : ' · companion stone') : f.name.trim() ? f.name.trim() + (born || passed ? ' · ' + hsDateLine(born, passed, 'years', ' – ') : '') : 'Not yet',
      faith: f.faith === 'other' && hsFaithGuess(f.faithOther) ? (hsFaithGuess(f.faithOther).faith || hsFaithGuess(f.faithOther).label) : f.faith ? hsFind(HS_FAITHS, f.faith).label : seenId('faith') ? 'No symbol' : 'Not yet',
      quotes: f.noQuotes ? 'Leaving words off the stone' : nq0 ? nq0 + (nq0 === 1 ? ' quote' : ' quotes') : seenId('quotes') ? 'None, so we’ll suggest a few' : 'Not yet',
      photos: st.photos.length ? (f.who === 'two' && String(f.name2 || '').trim()
        ? [[1, hsNameParts(f.name).first || 'first'], [2, hsNameParts(f.name2).first || 'second']].map(function (z) { var n = st.photos.filter(function (q) { return (q.owner || 1) === z[0]; }).length; return n + ' of ' + z[1]; }).join(', ')
        : st.photos.length + (st.photos.length === 1 ? ' photo' : ' photos')) : (f.photoLater || f.photoLater2) ? 'A spot saved for later' : seenId('photos') ? 'None' : 'Not yet',
      story: f.story.trim() || String(f.story2 || '').trim() ? hsTrunc((f.story.trim() + ' ' + String(f.story2 || '').trim()).trim(), 38) : seenId('story') ? 'Skipped for now' : 'Not yet',
      style: f.theme.trim() ? hsTrunc(f.theme.trim(), 38) : seenId('style') ? 'We’ll choose for you' : 'Not yet',
      details: (function () { var pr = f.prefs || {}, names = []; HS_PREF_GROUPS.forEach(function (g) { (pr[g.id] || []).forEach(function (id) { var src = g.id === 'types' ? HS_TYPES : g.id === 'shapes' ? HS_SHAPES : g.id === 'mats' ? HS_MATERIALS : g.id === 'carves' ? hsPrefFinishes() : g.id === 'fonts' ? HS_FONTSETS : [{ id: 'none', label: 'No border' }].concat(HS_BORDERS); names.push(hsFind(src, id).label); }); }); return names.length ? hsTrunc(names.join(', '), 38) : seenId('details') ? 'Open to anything' : 'Not yet'; })()
    };
    var summaries = HS_WSTEPS.map(function (s0) { return sumById[s0.id]; });
    v.wList = HS_WSTEPS.map(function (s, i) {
      var on = i === ws, done = !!summaries[i] && summaries[i] !== 'Not yet';
      return { label: s.label, summary: summaries[i], current: on ? 'step' : 'false', bg: on ? '#fbfaf7' : 'transparent',
        n: done && !on ? '✓' : String(i + 1), numBg: on ? accent : done ? soft : '#ffffff', numFg: on ? '#ffffff' : done ? accent : '#4a463f', numBd: on || done ? accent : '#a39b8c',
        go: function () { if (i > ws) self.goStep(i); else self.setState({ wstep: i }); } };
    });
    var errs = st.errors.name || st.errors.date;
    v.footMsg = errs ? 'We’ll just need their name and at least one date.' : (last ? 'Whenever you’re ready.' : (wmeta.req ? 'Take your time.' : ''));
    v.footColor = errs ? '#9a2f22' : '#3d3a34';
    v.build = function () { self.build(); };
    v.fillSample = function () { self.fillSample(); };
    var pvn = f.name.trim() ? f.name.trim().toUpperCase() : 'FULL NAME';
    if (f.who === 'two') {
      var n1 = hsNameParts(f.name), n2 = hsNameParts(f.name2 || '');
      pvn = n1.surname && n2.surname && n1.surname === n2.surname ? ((n1.first || 'NAME') + ' & ' + (n2.first || 'NAME') + ' ' + n1.surname).toUpperCase() : ((n1.first || 'NAME') + ' & ' + (n2.first || 'NAME')).toUpperCase();
    }
    v.pvName = pvn;
    v.pvNameSize = hsR(Math.max(22, Math.min(36, 300 / Math.max(1, hsTextW(pvn, 'roman', 1, 0.06) / 0.7 * 1.05))), 1);
    /* Dates always sit on one line, sized as if both were set, so the preview never jumps or wraps. */
    var pvShort = function (dt) { return dt ? HS_MONTHS[dt.m - 1].slice(0, 3).toUpperCase() + ' ' + dt.d + ', ' + dt.y : 'MMM DD, YYYY'; };
    v.pvD1 = pvShort(born); v.pvD2 = pvShort(passed);
    v.pvD1Op = born ? 1 : 0.38; v.pvD2Op = passed ? 1 : 0.38;
    v.pvDates = v.pvD1 + ' – ' + v.pvD2;
    var pq = hsCleanQuote(f.quotes[0]);
    v.pvQuote = hsTrunc(pq, 64);
    v.pvQuoteDisp = pq ? 'block' : 'none';
    var pvFa = f.faith ? hsFind(HS_FAITHS, f.faith) : null, pvGuess = f.faith === 'other' ? hsFaithGuess(f.faithOther) : null;
    var pvSy = pvGuess ? hsFind(HS_SYMBOLS, pvGuess.sym) : pvFa && pvFa.sym ? hsFind(HS_SYMBOLS, pvFa.sym) : null;
    v.pvSymDisp = pvSy ? 'block' : 'none'; v.pvSymOp = pvSy ? 1 : 0;
    v.pvSymD = pvSy ? pvSy.d : 'M0 0'; v.pvSymFill = pvSy && pvSy.mode === 'fill' ? '#5f5b55' : 'none'; v.pvSymStroke = pvSy && pvSy.mode === 'stroke' ? '#5f5b55' : 'none'; v.pvSymSw = pvSy ? (pvSy.sw || 0) : 0;
    v.pvStoneD = hsStonePath('serp', 330, 194);

    var an = st.analysis || { found: [], motifs: [], faith: null };
    var nq = f.quotes.map(hsCleanQuote).filter(Boolean).length;
    v.buildName = hsNameParts(f.name).full || 'them';
    v.ghosts = ['serp', 'arch', 'flat'].map(function (s, i) { return { d: hsStonePath(s, 120, 92), delay: (i * 0.25) + 's' }; });
    var symNames = [];
    if (an.faith) symNames.push(hsSymLabel(an.faith.sym));
    an.motifs.slice(0, 3).forEach(function (m) { symNames.push(hsSymLabel(m.sym)); });
    var stepDefs = [
      { label: 'Listening to their story', detail: an.found.length ? 'We heard: ' + an.found.slice(0, 7).join(', ') : (f.story.trim() ? 'Keeping things timeless and classic.' : 'Working from their name, dates and the words you shared.') },
      { label: 'Choosing symbols that feel like them', detail: symNames.length ? symNames.join(', ') : 'A blossom, a tree of life and a dove' },
      { label: 'Setting their name with care', detail: 'Sizing the name, dates' + (nq ? ' and ' + (nq === 1 ? 'words' : 'words') : '') + (st.photos.length ? ', and their photo,' : '') + ' to three stones' },
      { label: 'Making sure it will carve beautifully', detail: 'Gentle margins, clear letters, nothing crowded' }
    ];
    v.buildSteps = stepDefs.map(function (s, i) {
      var done = i < st.buildStep, on = i === st.buildStep;
      return { label: s.label, detail: s.detail, op: done || on ? 1 : 0.45,
        ring: done ? accent : '#cfc9bd', ringTop: done || on ? accent : '#cfc9bd',
        fill: done ? accent : 'transparent', anim: on ? 'hsSpin .9s linear infinite' : 'none', checkDisp: done ? 'block' : 'none' };
    });

    if (!isStage) return v;

    var C = this.content();
    var partsUsed = ['name', 'dates'];
    if (nq) partsUsed.push(nq === 1 ? 'quote' : 'quotes');
    if (st.photos.length) partsUsed.push(st.photos.length === 1 ? 'photo' : 'photos');
    if (f.theme.trim()) partsUsed.push('style notes');
    if (f.story.trim()) partsUsed.push('story');
    v.headerName = C.np.full;
    var twoH = f.who === 'two' && String(f.name2 || '').trim(), fn1 = hsNameParts(f.name).first || f.name, fn2 = hsNameParts(f.name2 || '').first || f.name2;
    v.optHeadline = twoH ? (f.pair === 'matching' ? 'Three matching pairs for ' + fn1 + ' & ' + fn2 + ', made with care' : 'Three companion stones for ' + fn1 + ' & ' + fn2 + ', made with care') : 'Three designs for ' + v.headerName + ', made with care';
    v.headerSub = 'Each one tells their story a little differently, shaped by the ' + partsUsed.slice(0, -1).join(', ') + ' and ' + partsUsed[partsUsed.length - 1] + ' you shared. Take your time, and tap one to see it up close.';
    var chosen = st.sel >= 0 && scr !== 'options';
    v.hdrOp = chosen ? 0 : 1;
    v.hdrY = chosen ? -16 : 0;
    var dSel = chosen ? st.designs[st.sel] : null;
    v.capOp = focus ? 1 : 0;
    v.capVis = focus ? 'visible' : 'hidden';
    v.capDelay = focus ? '.35s' : '0s';
    v.capVisDelay = focus ? '0s' : '.45s';
    v.fbY = focus ? 0 : 20;
    v.capEyebrow = dSel ? 'Design ' + (st.sel + 1) + ' of 3' : '';
    v.capTitle = dSel ? dSel.title : '';
    v.capSpec = dSel ? hsTypeOf(dSel).label + ' · ' + dSel.W + '″ × ' + dSel.H + '″ · ' + hsFind(HS_SHAPES, dSel.shape).label + ' · ' + hsFind(HS_MATERIALS, dSel.material).label : '';

    var ease = 'cubic-bezier(.22,.8,.2,1)';
    var mkTrans = function (delay, hidden, slow) {
      var dur = slow ? '1.1s' : '.65s';
      return ['left', 'top', 'width', 'height'].map(function (p) { return p + ' ' + dur + ' ' + ease + ' ' + delay; })
        .concat(['transform ' + (slow ? '1.1s' : '.7s') + ' ' + ease + ' ' + delay, 'opacity .5s ease ' + delay, 'background-color .5s ease', 'border-radius .5s ease', 'visibility 0s linear ' + (hidden ? '.7s' : '0s')]).join(', ');
    };
    var editSel = edit ? st.selLayer : null;

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
    /* Words with the dates: presets or the family's own. */
    var dwNow = pp.dateWords || { id: 'none', a: '', b: '' };
    v.dateWordChips = HS_DATE_WORDS.map(function (w) {
      var on = (dwNow.id || 'none') === w.id, p = self.pill(on, accent, soft);
      return { label: w.label, bg: p.bg, bd: p.bd, pressed: p.pressed, pick: function () {
        var nw = w.id === 'custom' ? { id: 'custom', a: '', b: '' } : { id: w.id, a: w.a, b: w.b };
        self.setParam({ dateWords: nw }, 'Date words: ' + w.label);
      } };
    });
    v.dwCustomDisp = dwNow.id === 'custom' ? 'grid' : 'none';
    v.dwA = dwNow.a || ''; v.dwB = dwNow.b || '';
    v.onDwA = function (e) { self.setParam({ dateWords: Object.assign({}, self.cur().params.dateWords || {}, { id: 'custom', a: e.target.value }) }, 'Typed date words'); };
    v.onDwB = function (e) { self.setParam({ dateWords: Object.assign({}, self.cur().params.dateWords || {}, { id: 'custom', b: e.target.value }) }, 'Typed date words'); };
    var qSelNow = hsQuoteSel(pp).filter(function (k) { return !!C.quotes[k]; });
    /* Chosen quotes are listed in the order they'll be carved; move them with the arrows or by dragging. */
    var setQ = function (cur, label) { self.setParam({ quoteIdx: cur.length ? cur[0] : -1, quoteIdxs: cur }, label); };
    var qOrderList = qSelNow.map(function (k) { return { idx: k }; })
      .concat(C.quotes.map(function (q, k) { return { idx: k }; }).filter(function (x) { return qSelNow.indexOf(x.idx) < 0; }));
    v.quoteChips = qOrderList.map(function (x) {
      if (x.idx >= 0) x.label = '“' + hsTrunc(C.quotes[x.idx], 70) + '”';
      var on = x.idx < 0 ? !qSelNow.length : qSelNow.indexOf(x.idx) >= 0, p = self.pill(on, accent, soft), pos = qSelNow.indexOf(x.idx);
      var moveTo = function (to) { var cur = qSelNow.slice(); cur.splice(pos, 1); cur.splice(Math.max(0, Math.min(cur.length, to)), 0, x.idx); setQ(cur, 'Reordered quotes'); };
      var over = st.qDrag !== undefined && st.qDrag !== null && st.qOver === x.idx && st.qDrag !== x.idx && on && x.idx >= 0;
      return { label: (on && x.idx >= 0 ? (qSelNow.length > 1 ? (pos + 1) + '. ' : '✓ ') : '') + x.label, family: x.idx < 0 ? "'Instrument Sans', sans-serif" : "'EB Garamond', Georgia, serif", fstyle: x.idx < 0 ? 'normal' : 'italic', bg: p.bg, bd: over ? accent : p.bd, pressed: p.pressed,
        moveDisp: on && x.idx >= 0 && qSelNow.length > 1 ? 'flex' : 'none', drag: on && x.idx >= 0 && qSelNow.length > 1 ? 'true' : 'false',
        upOp: pos > 0 ? 1 : 0.3, downOp: pos >= 0 && pos < qSelNow.length - 1 ? 1 : 0.3,
        up: function () { if (pos > 0) moveTo(pos - 1); }, down: function () { if (pos >= 0 && pos < qSelNow.length - 1) moveTo(pos + 1); },
        upLabel: 'Move this quote up', downLabel: 'Move this quote down',
        onDragStart: function (e) { try { e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', String(x.idx)); } catch (err) {} self.setState({ qDrag: x.idx }); },
        onDragOver: function (e) { if (self.state.qDrag === null || self.state.qDrag === undefined || !on || x.idx < 0) return; e.preventDefault(); if (self.state.qOver !== x.idx) self.setState({ qOver: x.idx }); },
        onDrop: function (e) { e.preventDefault(); var from = self.state.qDrag; self.setState({ qDrag: null, qOver: null }); if (from === null || from === undefined || from === x.idx || !on) return; var cur = qSelNow.slice(), fi = cur.indexOf(from); if (fi < 0) return; cur.splice(fi, 1); cur.splice(cur.indexOf(x.idx) + (fi <= pos ? 1 : 0), 0, from); setQ(cur, 'Reordered quotes'); },
        onDragEnd: function () { self.setState({ qDrag: null, qOver: null }); },
        pick: function () {
          if (x.idx < 0) { self.setParam({ quoteIdx: -1, quoteIdxs: [] }); return; }
          var cur = qSelNow.slice(), at = cur.indexOf(x.idx);
          if (at >= 0) cur.splice(at, 1); else cur.push(x.idx);
          setQ(cur);
        } };
    });
    /* Side symbols: both sides or just one, and trading sides when they differ. */
    var sideLs = (dp.layers || []).filter(function (l) { return l.visible && l.side; });
    var sideOk = !!pp.sym1 && (pp.layout === 'family' || pp.layout === 'marker') && (sideLs.length > 0);
    v.flankDisp = sideOk ? 'flex' : 'none';
    var flNow = pp.flank === 'left' || pp.flank === 'right' ? pp.flank : 'both';
    v.flankChips = [['both', 'Both sides'], ['left', 'Left only'], ['right', 'Right only']].map(function (x) {
      var on = flNow === x[0], pl = self.pill(on, accent, soft);
      return { label: x[1], bg: pl.bg, bd: pl.bd, pressed: pl.pressed, pick: function () {
        if (flNow === x[0]) return;
        /* the symbol that stays keeps its look when it changes sides */
        var sw = !!pp.flankSwap;
        if (flNow !== 'both' && x[0] !== 'both') sw = !sw;
        self.setParam({ flank: x[0], flankSwap: sw }, x[0] === 'both' ? 'Symbols on both sides' : 'Symbol on the ' + x[0] + ' only');
      } };
    });
    var sideDiff = pp.layout === 'marker' && pp.sym2 && pp.sym2 !== pp.sym1 && flNow === 'both';
    v.flankSwapDisp = sideDiff ? 'inline-flex' : 'none';
    v.flankSwapAct = function () { self.setParam({ flankSwap: !pp.flankSwap }, 'Swapped the side symbols'); };
    v.orderResetDisp = pp.order && pp.order.length ? 'inline' : 'none';
    v.resetOrder = function () { self.setParam({ order: null }, 'Back to the layout’s order'); };
    v.quoteHint = C.quotesSuggested ? 'No words were shared, so these are gentle suggestions. Tap any of them to carve it or leave it off.'
      : C.noWords ? 'You chose to leave words off the stone, so it keeps to names and dates.'
      : C.quotes.length > 1 ? 'Tap each one to carve it or leave it off. We’ll let you know if the stone needs to be a little larger to fit them.' : '';
    v.quoteHintDisp = v.quoteHint ? 'block' : 'none';
    v.hasRole = !!C.roleLine; v.roleLine = C.roleLine || ''; v.roleOn = !!pp.showRole;
    /* A line drawn from their story is offered like any other quote: tap it to carve it or leave it off. */
    var rp = self.pill(!!pp.showRole, accent, soft);
    v.roleChipLabel = (pp.showRole ? '✓ ' : '') + (C.roleLine || ''); v.roleChipBg = rp.bg; v.roleChipBd = rp.bd; v.roleChipPressed = rp.pressed;
    v.toggleRole = function () { self.setParam({ showRole: !pp.showRole }); };
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
    var ptn = pp.partner || {};
    v.splitDisp = pp.layout === 'split' ? 'flex' : 'none';
    v.ptName = ptn.name || ''; v.ptBorn = ptn.born || ''; v.ptPassed = ptn.passed || '';
    var setPt = function (k) { return function (e) { var n = Object.assign({}, self.cur().params.partner || {}); n[k] = e.target.value; self.setParam({ partner: n }); }; };
    v.onPtName = setPt('name'); v.onPtBorn = setPt('born'); v.onPtPassed = setPt('passed');
    var fromIntake = !!C.partner;
    v.manualPtDisp = fromIntake ? 'none' : 'flex'; v.intakePtDisp = fromIntake ? 'flex' : 'none';
    v.intakePtText = fromIntake ? 'One side for ' + (C.np.first || C.np.full) + ', one for ' + (C.partner.np.first || C.partner.np.full) + ', from your answers.' : '';
    v.storyModeChips = [['own', 'Their own sides', 'A symbol from each of their stories'], ['blended', 'Blended together', 'One shared symbol on both sides']].map(function (x) {
      var on = (pp.storyMode || 'own') === x[0], p = self.pill(on, accent, soft);
      return { label: x[1], desc: x[2], bg: p.bg, bd: p.bd, pressed: p.pressed, pick: function () { self.setParam({ storyMode: x[0] }); } };
    });
    v.splitNote = ptn.name ? 'Each side holds one of them. Your chosen quote is shared beneath.' : 'For one person, their name and dates sit on one side and their words and portrait or symbol on the other. Add a partner to make it a companion stone.';
    v.roomNote = 'To keep everything clear and easy to carve, we gently left off ' + (left.length > 1 ? left.slice(0, -1).join(', ') + ' and ' + left[left.length - 1] : left[0] || '') + ' at this size. A larger size, a different layout, or fewer lines will make room.';
    v.photoChoices = [null].concat(st.photos).map(function (ph) {
      var id = ph ? ph.id : '', on = (pp.photo || '') === id;
      return { label: ph ? 'Use photo ' + ph.name : 'No photo', url: ph ? ph.url : '', imgDisp: ph ? 'block' : 'none', noneDisp: ph ? 'none' : 'block', pressed: on ? 'true' : 'false', bd: on ? accent : '#d3cdc1', pick: function () { self.setParam({ photo: id }); } };
    });
    v.gPhotoOn = !!pp.photo && !!C.photoById[pp.photo];
    var dSh = dp.shape, dHrt = dSh === 'heart' || dSh === 'dheart', effPlace = !dHrt && pp.layout === 'below' && pp.photoPlace !== 'top' ? 'bottom' : dHrt || dSh === 'teardrop' ? 'top' : (pp.photoPlace || 'left');
    v.placeChips = [['left', 'Left'], ['right', 'Right'], ['top', 'Above'], ['bottom', 'Below']].map(function (x) {
      var on = effPlace === x[0], p = self.pill(on, accent, soft);
      return { label: x[1], bg: p.bg, bd: p.bd, pressed: p.pressed, pick: function () { self.setParam({ photoPlace: x[0] }); } };
    });
    v.photoFinishChips = [['laser', 'Laser etch'], ['porcelain', 'Porcelain']].map(function (x) {
      var on = (pp.photoFinish || 'laser') === x[0], p = self.pill(on, accent, soft);
      return { label: x[1], bg: p.bg, bd: p.bd, pressed: p.pressed, pick: function () { self.setParam({ photoFinish: x[0] }); } };
    });
    v.laserWarnDisp = v.gPhotoOn && (pp.photoLook || 'photo') === 'photo' && (pp.photoFinish || 'laser') === 'laser' && !m.laserOk ? 'block' : 'none';
    var lkShape = function (id) { return id === 'circle' ? { w: 16, h: 16, rx: 8, ry: 8 } : id === 'square' ? { w: 16, h: 16, rx: 2, ry: 2 } : id === 'rect' ? { w: 13, h: 18, rx: 2, ry: 2 } : { w: 13, h: 18, rx: 6.5, ry: 9 }; };
    var lkFor = function (lk, laser, bw) {
      var x = hsFind(HS_PHOTO_LOOKS, lk);
      if (x.f) return { f: 'url(#lkp-' + x.f + ')', blend: 'normal' };
      return { f: laser || bw ? 'url(#lkp-bw)' : 'none', blend: laser ? 'screen' : 'normal' };
    };
    v.lkBg = m.face; v.lkLc = hsMix(m.frost, '#ffffff', 0.12); v.lkCol = hsMix(m.frost, '#ffffff', hsHexLum(m.face) < 0.32 ? 0.3 : 0.55);

    var gPh = v.gPhotoOn ? C.photoById[pp.photo] : null, gLook = pp.photoLook || 'photo', gLaser = (pp.photoFinish || 'laser') === 'laser';
    v.lookChips = HS_PHOTO_LOOKS.map(function (x) {
      var on = gLook === x.id, p = self.pill(on, accent, soft), fx = lkFor(x.id, gLaser, pp.photoTone === 'bw');
      return { label: x.label, sub: x.sub, url: gPh ? gPh.url : '', f: fx.f, blend: fx.blend, bg: p.bg, bd: p.bd, pressed: p.pressed,
        pick: function () { self.setParam({ photoLook: x.id }, 'Photo look: ' + x.label); } };
    });
    v.photoShapeChips = HS_PHOTO_SHAPES.map(function (x) {
      var on = (pp.photoShape || 'oval') === x.id, p = self.pill(on, accent, soft), sh = lkShape(x.id);
      return { label: x.label, sw: sh.w, sh: sh.h, srx: sh.rx, sry: sh.ry, sx: 12 - sh.w / 2, sy: 12 - sh.h / 2, bg: p.bg, bd: p.bd, pressed: p.pressed,
        pick: function () { self.setParam({ photoShape: x.id }, 'Photo shape: ' + x.label); } };
    });
    v.photoToneChips = [['color', 'Color'], ['bw', 'Black & white']].map(function (x) {
      var on = (gLaser ? 'bw' : (pp.photoTone || 'color')) === x[0], p = self.pill(on, accent, soft);
      return { label: x[1], bg: p.bg, bd: p.bd, pressed: p.pressed,
        pick: function () { self.setParam(x[0] === 'color' && gLaser ? { photoTone: 'color', photoFinish: 'porcelain' } : { photoTone: x[0] }, 'Photo in ' + x[1].toLowerCase()); } };
    });
    v.photoPlainDisp = gLook === 'photo' ? 'flex' : 'none';
    v.photoCarvedDisp = gLook === 'photo' ? 'none' : 'block';
    v.photoLaserToneDisp = gLook === 'photo' && gLaser ? 'block' : 'none';
    v.borderCards = [{ id: 'none', label: 'No border' }].concat(HS_BORDERS).map(function (bd) {
      var on = (pp.border || 'none') === bd.id, p = self.pill(on, accent, soft);
      var dash = bd.id === 'beaded' ? '0 5' : bd.id === 'rope' ? '3 1.5' : 'none';
      return { label: bd.label, face: m.face, ink: m.id === 'gray' ? '#3b3d42' : '#d5d7d9', d1: bd.id === 'none' ? 'none' : 'inline', d2: bd.id === 'double' ? 'inline' : 'none',
        sw: bd.id === 'beaded' ? 2.6 : bd.id === 'rope' ? 2 : 1.2, dash: dash, bg: p.bg, bd: p.bd, pressed: p.pressed, pick: function () { self.setParam({ border: bd.id }); } };
    });
    var carveChipList = function (key) {
      return HS_CARVES.map(function (c) {
        var on = (pp[key] || (key === 'carve' ? 'vcut' : 'frost')) === c.id, p = self.pill(on, accent, soft);
        var patch = {}; patch[key] = c.id;
        return { label: c.label, spec: c.spec, dot: hsCarveLook(c.id, m).color, bg: p.bg, bd: p.bd, pressed: p.pressed, pick: function () { self.setParam(patch); } };
      });
    };
    v.carveChips = carveChipList('carve');
    v.symCarveChips = carveChipList('symCarve');
    var surfNow = pp.surface || 'polished';
    v.surfaceCards = HS_SURFACES.map(function (sf) {
      var on = surfNow === sf.id, p = self.pill(on, accent, soft), fc = hsSurfaceFace(m, sf.id);
      var gl = sf.id === 'polished' ? 'linear-gradient(135deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0) 45%), ' : sf.id === 'honed' ? 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 60%), ' : '';
      return { label: sf.label, note: sf.note, swatch: hsGraniteBg(m, sf.id), bg: p.bg, bd: p.bd, pressed: p.pressed, pick: function () { self.setParam({ surface: sf.id }); } };
    });
    v.edgeChips = HS_EDGES.filter(function (e) { return !hsIsLying(dp) || e.id === 'smooth'; }).map(function (e) {
      var on = (pp.edges || 'smooth') === e.id, p = self.pill(on, accent, soft);
      return { label: e.label, bg: p.bg, bd: p.bd, pressed: p.pressed, pick: function () { self.setParam({ edges: e.id }); } };
    });
    var revOn = !!pp.reverseBefore;
    v.reverseDisp = revOn || surfNow === 'polished' ? 'flex' : 'none';
    v.reverseText = revOn ? 'Reverse look on: a soft ' + (surfNow === 'frosted' ? 'frosted' : 'honed') + ' face with polished, mirror-bright lettering. Undo puts back what you had.' : 'Love a glossy look? Try the reverse: a soft honed face with polished, mirror-bright lettering.';
    v.reverseBtn = revOn ? 'Undo' : 'Try it'; v.reversePressed = revOn ? 'true' : 'false';
    v.surfaceNote = hsFind(HS_SURFACES, surfNow).note;
    v.useReverse = function () { self.reverseLook(); };
    var present = {};
    dp.layers.forEach(function (l) { var g = hsLayerGroup(l); if (g && l.visible) { if (!present[g]) present[g] = l; } });
    v.finishRows = HS_FINISH_GROUPS.filter(function (g) { return !!present[g.id]; }).map(function (g) {
      var cur = present[g.id].carve || 'vcut', curPaint = present[g.id].paint || hsDefaultPaint(m);
      var fbNow = pp.finishBy || {}, follows = g.id !== 'name' && !fbNow[g.id];
      return {
        followText: follows ? 'Matches the name' : 'Set on its own', followDisp: g.id === 'name' ? 'none' : 'inline',
        matchDisp: g.id !== 'name' && !follows ? 'inline' : 'none', match: function () { self.matchName(g.id); },
        label: g.id === 'lines' ? present[g.id].name : g.label,
        chips: HS_CARVES.filter(function (c) { return c.id !== 'paint'; }).map(function (c) {
          var on = cur === c.id, p = self.pill(on, accent, soft), lk = hsCarveLook(c.id, m, curPaint, surfNow);
          return { label: c.label, spec: c.spec, dot: lk.gloss || lk.color, bg: p.bg, bd: p.bd, pressed: p.pressed, pick: function () { self.setFinish(g.id, c.id); } };
        }),
        isPaint: true,
        paints: HS_PAINTS.map(function (pc) {
          var on = cur === 'paint' && curPaint === pc.id;
          return { label: pc.label, col: pc.id, pressed: on ? 'true' : 'false', ring: on ? accent : '#d3cdc1', pick: function () { self.setPaint(g.id, pc.id); } };
        }),
        customNow: cur === 'paint' && curPaint ? curPaint : '#f4f1ea',
        customRing: cur === 'paint' && curPaint && !HS_PAINTS.some(function (pc) { return pc.id === curPaint; }) ? accent : '#d3cdc1',
        onCustom: function (e) { self.setPaint(g.id, e.target.value); }
      };
    });

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
    v.letterPresets = [{ label: 'Name', kind: 'name' }, { label: 'Dates', kind: 'dates' }, { label: 'Epitaph', kind: 'epitaph' }, { label: 'Free text', kind: 'text' }]
      .map(function (x) { return { label: x.label, add: function () { self.addText(x.kind); } }; });
    v.photoTiles = st.photos.map(function (p) { return { url: p.url, label: 'Place photo ' + p.name, add: function () { self.addPhoto(p.id); } }; });
    var symPaint = function (sy, color) { return { d: sy.d, fill: sy.mode === 'fill' ? color : 'none', stroke: sy.mode === 'stroke' ? color : 'none', sw: sy.sw || 0 }; };
    v.symbolTiles = HS_SYMBOLS.map(function (sy) {
      return Object.assign(symPaint(sy, '#2b2925'), { label: sy.label, short: sy.short, aria: 'Add symbol: ' + sy.label, add: function () { self.addSymbol(sy.id); } });
    });
    v.addBorder = function () { self.addBorder(); };

    v.rtabs = [{ id: 'layers', label: 'Layers' }, { id: 'measure', label: 'Measurements' }, { id: 'handoff', label: 'Handoff' }].map(function (t) {
      var on = st.rtab === t.id;
      return { label: t.label, pressed: on ? 'true' : 'false', bd: on ? accent : 'transparent', fg: on ? '#1e1c19' : '#5d584f', pick: function () { self.setState({ rtab: t.id, status: '' }); } };
    });
    var ltab = st.ltab || 'design';
    v.ltabs = [{ id: 'design', label: 'Design' }, { id: 'measure', label: 'Measurements' }, { id: 'handoff', label: 'Handoff' }].map(function (t) {
      var on = ltab === t.id;
      return { label: t.label, pressed: on ? 'true' : 'false', bd: on ? accent : 'transparent', fg: on ? '#1e1c19' : '#5d584f', pick: function () { self.setState({ ltab: t.id, status: '' }); } };
    });
    v.isLTabDesign = ltab === 'design'; v.lMeasDisp = ltab === 'design' ? 'none' : 'flex';
    v.isTabLayers = true; v.isTabMeasure = ltab === 'measure'; v.isTabHandoff = ltab === 'handoff';
    v.hasIssues = checks.length > 0; v.noIssues = checks.length === 0;
    v.issueTitle = checks.length + (checks.length === 1 ? ' small thing to tidy' : ' small things to tidy');
    v.issues = checks.map(function (c) { return { text: c.text, select: function () { self.setState({ selLayer: c.id, rtab: 'layers' }); } }; });
    v.reflow = function () { self.reflow(); };

    var sel = null;
    dp.layers.forEach(function (l) { if (l.id === st.selLayer) sel = l; });
    v.layerCount = dp.layers.length + (dp.layers.length === 1 ? ' layer' : ' layers');
    v.layerRows = dp.layers.slice().reverse().map(function (l) {
      var on = sel && l.id === sel.id, c = hsFind(HS_CARVES, l.carve);
      var r = { name: l.name, pressed: on ? 'true' : 'false', bg: on ? soft : '#ffffff', bd: on ? accent : '#e2ddd3',
        nameColor: l.visible ? '#1e1c19' : '#7d766b', eyeD: l.visible ? HS_EYE_OPEN : HS_EYE_SHUT, eyeColor: l.visible ? '#3d3a34' : '#7d766b',
        eyeLabel: (l.visible ? 'Hide ' : 'Show ') + l.name,
        select: function () { self.setState({ selLayer: l.id }); },
        toggle: function () { self.updLayer(l.id, { visible: !l.visible }); },
        del: function () { self.setState({ selLayer: l.id }); self.state.selLayer = l.id; self.remove(); },
        dragBd: st.layOver === l.id && st.layDrag && st.layDrag !== l.id ? accent : on ? accent : '#e2ddd3',
        onDragStart: function (e) { try { e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', l.id); } catch (err) {} self.setState({ layDrag: l.id }); },
        onDragOver: function (e) { if (!self.state.layDrag) return; e.preventDefault(); if (self.state.layOver !== l.id) self.setState({ layOver: l.id }); },
        onDrop: function (e) { e.preventDefault(); var from = self.state.layDrag; self.setState({ layDrag: null, layOver: null }); if (from && from !== l.id) self.restack(from, l.id); },
        onDragEnd: function () { self.setState({ layDrag: null, layOver: null }); } };
      var hid = l.visible ? '' : 'Hidden · ';
      var aj = l.extra ? null : (pp.adj || {})[l.key];
      r.tag = l.extra ? 'Added' : aj && HS_ADJ_SIZE.some(function (k) { return aj[k] !== undefined; }) ? 'Adjusted' : '';
      r.tagDisp = r.tag ? 'inline-block' : 'none';
      r.tagBg = l.extra ? '#e4efe8' : '#f4efe4'; r.tagFg = l.extra ? '#23553f' : '#6b5220';
      if (l.type === 'text') {
        r.sub = hid + hsFind(HS_FONTS, l.font).label + ' · ' + hsIn(l.ht) + ' · ' + c.label;
        r.iconVB = '0 0 24 24'; r.iconD = 'M5 6 H19 M12 6 V19'; r.iconFill = 'none'; r.iconStroke = '#3d3a34'; r.iconSW = 2.2;
      } else if (l.type === 'symbol') {
        var sy = hsFind(HS_SYMBOLS, l.sym);
        r.sub = hid + sy.label + ' · ' + hsIn(l.size) + ' · ' + c.label;
        r.iconVB = '0 0 100 100'; r.iconD = sy.d; r.iconFill = sy.mode === 'fill' ? '#3d3a34' : 'none'; r.iconStroke = sy.mode === 'stroke' ? '#3d3a34' : 'none'; r.iconSW = (sy.sw || 0) * 1.4;
      } else if (l.type === 'photo') {
        r.sub = hid + hsPhotoShort(l) + ' · ' + hsPhotoShapeLabel(l.frame) + ' · ' + hsIn1(l.w) + ' × ' + hsIn1(l.h);
        r.iconVB = '0 0 24 24'; r.iconD = 'M4 6 H20 V18 H4 Z M4 15 L9 11 L13 14 L16 12 L20 15'; r.iconFill = 'none'; r.iconStroke = '#3d3a34'; r.iconSW = 1.8;
      } else {
        r.sub = hid + hsFind(HS_BORDERS, l.bstyle).label + ' · ' + hsIn(l.inset) + ' inset · ' + c.label;
        r.iconVB = '0 0 24 24'; r.iconD = 'M4 20 V8 Q4 4 8 4 H16 Q20 4 20 8 V20 Z'; r.iconFill = 'none'; r.iconStroke = '#3d3a34'; r.iconSW = 2;
      }
      return r;
    });

    var isText = !!sel && sel.type === 'text', isSymbol = !!sel && sel.type === 'symbol', isBorder = !!sel && sel.type === 'border', isPhoto = !!sel && sel.type === 'photo';
    v.hasSel = !!sel; v.noSel = !sel;
    v.selName = sel ? sel.name : '';
    v.selIsText = isText; v.selIsSymbol = isSymbol; v.selIsBorder = isBorder; v.selIsPhoto = isPhoto;
    v.selShowCarve = !!sel && !isPhoto;
    v.selMovable = !!sel && !isBorder;
    v.selText = isText ? hsResvShow(sel.text) : '';
    v.onText = function (e) {
      if (!sel) return;
      var nt = String(e.target.value).split('\n').slice(0, 4).join('\n'), keep = (String(sel.text || '').match(HS_RESV_RE) || [])[0];
      if (keep) nt = nt.replace('(date added later)', keep);
      self.updLayer(sel.id, { text: nt });
    };
    v.fontPills = HS_FONTS.map(function (ft) {
      var on = isText && sel.font === ft.id, p = self.pill(on, accent, soft);
      return { label: ft.label, family: ft.family, fstyle: ft.style, bg: p.bg, bd: p.bd, pressed: p.pressed, pick: function () { if (sel) self.updLayer(sel.id, { font: ft.id }); } };
    });
    v.selHt = isText ? sel.ht : 1; v.selHtLabel = isText ? hsIn(sel.ht) : '';
    v.onHt = function (e) { if (sel) self.updLayer(sel.id, { ht: parseFloat(e.target.value) }); };
    v.selTrack = isText ? sel.track : 0; v.selTrackLabel = isText ? hsR(sel.track).toFixed(2) + ' em' : '';
    v.onTrack = function (e) { if (sel) self.updLayer(sel.id, { track: parseFloat(e.target.value) }); };
    v.symbolSwap = HS_SYMBOLS.map(function (sy) {
      var on = isSymbol && sel.sym === sy.id, p = self.pill(on, accent, soft);
      return Object.assign(symPaint(sy, on ? accent : '#2b2925'), { label: sy.label, bg: p.bg, bd: p.bd, pressed: p.pressed, pick: function () {
        if (!sel) return;
        var patch = { sym: sy.id }, old = hsSymLabel(sel.sym);
        if (sel.name.indexOf(old) === 0) patch.name = sy.label + sel.name.slice(old.length);
        self.updLayer(sel.id, patch);
      } });
    });
    v.selSize = isSymbol ? sel.size : 4; v.selSizeLabel = isSymbol ? hsIn(sel.size) : '';
    v.onSize = function (e) { if (sel) self.updLayer(sel.id, { size: parseFloat(e.target.value) }); };
    v.photoSwap = st.photos.map(function (p) {
      var on = isPhoto && sel.photo === p.id;
      return { url: p.url, label: 'Use photo ' + p.name, pressed: on ? 'true' : 'false', bd: on ? accent : '#dcd7cc', pick: function () { if (sel) self.updLayer(sel.id, { photo: p.id }); } };
    });
    v.finishPills = [{ id: 'laser', label: 'Laser etch' }, { id: 'porcelain', label: 'Porcelain' }].map(function (x) {
      var on = isPhoto && sel.carve === x.id, p = self.pill(on, accent, soft);
      return { label: x.label, bg: p.bg, bd: p.bd, pressed: p.pressed, pick: function () { if (sel) self.updLayer(sel.id, { carve: x.id }); } };
    });
    var eLaser = isPhoto && sel.carve === 'laser', eLook = isPhoto ? (sel.look || 'photo') : 'photo', ePh = isPhoto ? C.photoById[sel.photo] : null;
    v.framePills = HS_PHOTO_SHAPES.map(function (x) {
      var on = isPhoto && (sel.frame || 'oval') === x.id, p = self.pill(on, accent, soft), sh = lkShape(x.id);
      return { label: x.label, sw: sh.w, sh: sh.h, srx: sh.rx, sry: sh.ry, sx: 12 - sh.w / 2, sy: 12 - sh.h / 2, bg: p.bg, bd: p.bd, pressed: p.pressed,
        pick: function () { if (!sel) return; var ev = hsPhotoEven(x.id); self.updLayer(sel.id, { frame: x.id, h: ev ? sel.w : hsR(sel.w * 1.28, 2), ar: ev ? 1 : 1.28 }); } };
    });
    v.edLookPills = HS_PHOTO_LOOKS.map(function (x) {
      var on = eLook === x.id, p = self.pill(on, accent, soft), fx = lkFor(x.id, eLaser, isPhoto && sel.tone === 'bw');
      return { label: x.label, url: ePh ? ePh.url : '', f: fx.f, blend: fx.blend, bg: p.bg, bd: p.bd, pressed: p.pressed, pick: function () { if (sel) self.updLayer(sel.id, { look: x.id }); } };
    });
    v.edTonePills = [['color', 'Color'], ['bw', 'Black & white']].map(function (x) {
      var on = isPhoto && (eLaser ? 'bw' : (sel.tone || 'color')) === x[0], p = self.pill(on, accent, soft);
      return { label: x[1], bg: p.bg, bd: p.bd, pressed: p.pressed, pick: function () { if (sel) self.updLayer(sel.id, x[0] === 'color' && eLaser ? { tone: 'color', carve: 'porcelain' } : { tone: x[0] }); } };
    });
    v.edPhotoPlainDisp = eLook === 'photo' ? 'flex' : 'none';
    v.edPhotoCarvedDisp = eLook === 'photo' ? 'none' : 'block';
    v.edLaserToneDisp = eLook === 'photo' && eLaser ? 'block' : 'none';
    v.selPw = isPhoto ? sel.w : 7; v.selPwLabel = isPhoto ? hsIn1(sel.w) + ' × ' + hsIn1(sel.h) : '';
    v.onPw = function (e) { if (sel) { var w = parseFloat(e.target.value); self.updLayer(sel.id, { w: w, h: hsR(w * (sel.ar || 1.3), 2) }); } };
    v.borderPills = HS_BORDERS.map(function (bd) {
      var on = isBorder && sel.bstyle === bd.id, p = self.pill(on, accent, soft);
      return { label: bd.label, bg: p.bg, bd: p.bd, pressed: p.pressed, pick: function () { if (sel) self.updLayer(sel.id, { bstyle: bd.id }); } };
    });
    v.selInset = isBorder ? sel.inset : 1; v.selInsetLabel = isBorder ? hsIn(sel.inset) : '';
    v.onInset = function (e) { if (sel) self.updLayer(sel.id, { inset: parseFloat(e.target.value) }); };
    v.carvePills = HS_CARVES.filter(function (c) { return c.id !== 'paint'; }).map(function (c) {
      var on = !!sel && sel.carve === c.id, p = self.pill(on, accent, soft);
      return { label: c.label, spec: c.spec, dot: hsCarveLook(c.id, m).color, bg: p.bg, bd: p.bd, pressed: p.pressed, pick: function () { if (sel) self.updLayer(sel.id, { carve: c.id }); } };
    });
    v.edPaintDisp = sel && sel.type !== 'photo' ? 'flex' : 'none';
    v.edPaintNow = sel && sel.carve === 'paint' ? (sel.paint || hsDefaultPaint(m)) : '#f4f1ea';
    v.edPaintCustom = function (e) { if (sel) self.updLayer(sel.id, { carve: 'paint', paint: e.target.value }); };
    v.edPaints = HS_PAINTS.map(function (pc) {
      var on = !!sel && sel.carve === 'paint' && (sel.paint || hsDefaultPaint(m)) === pc.id;
      return { label: pc.label, col: pc.id, pressed: on ? 'true' : 'false', ring: on ? accent : '#d3cdc1', pick: function () { if (sel) self.updLayer(sel.id, { carve: 'paint', paint: pc.id }); } };
    });
    v.selPosLabel = !sel || isBorder ? '' : sel.extra ? hsIn(sel.x) + ' L · ' + hsIn(sel.y) + ' T' : hsOffWords(hsR(sel.x - sel.bx, 2), hsR(sel.y - sel.by, 2)) || 'Not moved';
    v.nudgeL = function () { self.nudge(-0.25, 0); }; v.nudgeR = function () { self.nudge(0.25, 0); };
    v.nudgeU = function () { self.nudge(0, -0.25); }; v.nudgeD = function () { self.nudge(0, 0.25); };
    v.centerH = function () { if (sel && !isBorder) self.updLayer(sel.id, { x: W / 2 }, true, 'Centered ' + sel.name); };
    var selIssues = sel ? checks.filter(function (c) { return c.id === sel.id; }) : [];
    v.selIssues = selIssues.map(function (c) { return { text: c.text }; });
    v.selHasIssue = selIssues.length > 0 && !isBorder;
    v.fitSel = function () { if (sel) self.fitLayer(sel.id); };
    v.forward = function () { self.move(1); }; v.backward = function () { self.move(-1); };
    v.duplicate = function () { self.duplicate(); }; v.remove = function () { self.remove(); };
    /* ---- Full editor: collapsible sections, history, layout adjustments, add-layer menu, per-type settings ---- */
    var open = st.edOpen || {};
    var nAdj = hsAdjCount(dp), adjMap = pp.adj || {}, nRemoved = Object.keys(adjMap).filter(function (k) { return adjMap[k].removed; }).length;
    var selL = null; dp.layers.forEach(function (l) { if (l.id === st.selLayer) selL = l; });
    var sums = {
      type: tyP.label, shape: shp.label, size: W + '″ wide × ' + H + '″ high',
      granite: m.label + (hsBaseH(dp) ? ' · on a ' + hsBaseMat(dp).label + ' base' : ''),
      surface: hsFind(HS_SURFACES, pp.surface || 'polished').label + ' · ' + hsFind(HS_EDGES, pp.edges || 'smooth').label.toLowerCase(),
      layout: hsFind(HS_LAYOUTS, pp.layout).label + (pp.flipX ? ' · mirrored' : '') + (nAdj ? ' · ' + nAdj + ' adjusted' : ''),
      lettering: hsFind(HS_FONTSETS, pp.fonts).label,
      vases: hsVaseOn(dp) ? hsFind(HS_VASE_KINDS, dp.vase.kind).label + ' · ' + hsVaseSpots(dp.vase).map(function (x) { return hsFind(HS_VASE_SPOTS, x).label.toLowerCase(); }).join(', ') + ' · ' + hsVaseW(dp.vase) + '″' : 'None',
      history: this.past.length ? this.past.length + (this.past.length === 1 ? ' change' : ' changes') + (this.future.length ? ' · ' + this.future.length + ' to redo' : '') : 'No changes yet',
      dcont: '', tcont: '', tstyle: '', sym: '', photo: '', border: '', finish: '', pos: ''
    };
    if (selL) {
      var cSel = hsFind(HS_CARVES, selL.carve);
      sums.dcont = selL.text ? hsResvShow(selL.text).replace(/\n/g, ' / ') : '';
      sums.tcont = selL.text ? hsResvShow(selL.text).replace(/\n/g, ' / ') : '';
      sums.tstyle = selL.type === 'text' ? hsFind(HS_FONTS, selL.font).label + ' · ' + hsIn(selL.ht) : '';
      sums.sym = selL.type === 'symbol' ? hsSymLabel(selL.sym) + ' · ' + hsIn(selL.size) : '';
      sums.photo = selL.type === 'photo' ? hsPhotoShapeLabel(selL.frame) + ' · ' + hsPhotoShort(selL) + ' · ' + hsIn1(selL.w) + ' wide' : '';
      sums.border = selL.type === 'border' ? hsFind(HS_BORDERS, selL.bstyle).label : '';
      sums.finish = selL.carve === 'paint' ? 'Painted' : cSel.label;
      var ox = selL.extra ? 0 : hsR(selL.x - selL.bx, 2), oy = selL.extra ? 0 : hsR(selL.y - selL.by, 2);
      sums.pos = selL.extra ? hsIn(selL.x) + ' from left · ' + hsIn(selL.y) + ' from top' : (ox || oy ? 'Moved ' + hsOffWords(ox, oy) : 'Where the layout puts it');
    }
    var defOpen = { type: true, layout: true, history: true, dcont: true, tcont: true, tstyle: false, sym: true, photo: true, border: true, finish: false, pos: true };
    v.ac = {};
    Object.keys(sums).forEach(function (k) {
      var on = open[k] !== undefined ? open[k] : !!defOpen[k];
      v.ac[k] = { disp: on ? 'flex' : 'none', exp: on ? 'true' : 'false', rot: on ? 180 : 0, sum: sums[k],
        toggle: function () { var o = Object.assign({}, self.state.edOpen || {}); o[k] = !on; self.setState({ edOpen: o }); } };
    });

    /* History, newest first; the current state is highlighted, redo steps are shown faded. */
    var past = this.past, fut = this.future, rows = [];
    fut.forEach(function (h, i) { rows.push({ label: h.label, n: -(fut.length - i), kind: 'future' }); });
    rows.push({ label: past.length ? past[past.length - 1].label : 'The design as it was made', n: 0, kind: 'now' });
    for (var hi = past.length - 2; hi >= 0; hi--) rows.push({ label: past[hi].label, n: past.length - 1 - hi, kind: 'past' });
    if (past.length) rows.push({ label: 'The design as it was made', n: past.length, kind: 'past' });
    v.histRows = rows.slice(0, 40).map(function (r) {
      return { label: r.kind === 'now' ? r.label + ' (now)' : r.label, current: r.kind === 'now' ? 'step' : 'false',
        bg: r.kind === 'now' ? soft : 'transparent', fg: r.kind === 'future' ? '#8a8378' : '#1e1c19', deco: 'none',
        dot: r.kind === 'now' ? accent : r.kind === 'future' ? '#d3cdc1' : '#9d968a', go: function () { if (r.n) self.jumpHist(r.n); } };
    });

    v.adjNote = nAdj ? nAdj + (nAdj === 1 ? ' part is' : ' parts are') + ' moved or resized from where the layout puts ' + (nAdj === 1 ? 'it' : 'them') + '. Adjustments follow the layout, so changing the stone or its size keeps them in step.' : 'Move or resize anything on the right and it is remembered relative to the layout, so changing the stone or its size keeps your touches in step.';
    v.keepAdj = pp.keepAdj !== false;
    v.toggleKeepAdj = function () { self.setKeepAdj(!(self.cur().params.keepAdj !== false)); };
    v.resetLayout = function () { self.resetLayout(); };
    v.fitLettering = function () { self.fitLettering(); };
    v.resetDisabled = !nAdj; v.resetOpacity = nAdj ? 1 : 0.5;
    v.restoreRemoved = function () { self.restoreRemoved(); };
    v.restoreDisp = nRemoved ? 'flex' : 'none';
    v.restoreLabel = 'Bring back ' + nRemoved + (nRemoved === 1 ? ' removed part' : ' removed parts');

    /* Add-layer menu */
    v.addExp = st.addOpen ? 'true' : 'false'; v.addDisp = st.addOpen ? 'flex' : 'none';
    v.toggleAdd = function () { self.setState({ addOpen: !self.state.addOpen, delConfirm: null }); };
    var two = f.who === 'two' && String(f.name2 || '').trim();
    v.addItems = [
      { label: 'Text', desc: 'A line of words, set in any typeface', vb: '0 0 24 24', d: 'M5 6 H19 M12 6 V19', fill: 'none', sw: 2.2, pick: function () { self.addText('text'); } },
      { label: 'Dates', desc: two ? 'Formatted dates for either person' : 'Birth and passing dates, formatted for you', vb: '0 0 24 24', d: 'M4 6 H20 V20 H4 Z M4 10 H20 M8 3 V7 M16 3 V7', fill: 'none', sw: 1.8, pick: function () { self.addText('dates', 1); } },
      { label: 'Image', desc: st.photos.length ? 'A portrait from your uploaded photos' : 'Upload a photo to place it', vb: '0 0 24 24', d: 'M4 6 H20 V18 H4 Z M4 15 L9 11 L13 14 L16 12 L20 15', fill: 'none', sw: 1.8, pick: function () { self.addPhoto(''); }, upload: !st.photos.length,
        onFiles: function (e) { self.setState({ pendingPhoto: true, addOpen: false }); self.handleFiles(e.target.files, 1); try { e.target.value = ''; } catch (err) {} } },
      { label: 'Symbol', desc: 'An icon: faith, nature, love and more', vb: '0 0 24 24', d: 'M12 3 L14.6 9 L21 9.5 L16 13.6 L17.6 20 L12 16.6 L6.4 20 L8 13.6 L3 9.5 L9.4 9 Z', fill: 'none', sw: 1.6, pick: function () { self.addSymbol(''); } },
      { label: 'Border', desc: 'A carved line that follows the stone', vb: '0 0 24 24', d: 'M4 20 V8 Q4 4 8 4 H16 Q20 4 20 8 V20 Z', fill: 'none', sw: 2, pick: function () { self.addBorder(); } }
    ].map(function (it) { it.isBtn = !it.upload; it.isUpload = !!it.upload; if (!it.onFiles) it.onFiles = v.noop; return it; });
    /* Deleting always asks first, in a small pop-up under the Delete button. */
    var delL = st.delConfirm ? dp.layers.filter(function (l) { return l.id === st.delConfirm; })[0] : null;
    v.delDisabled = !selL; v.delOpacity = selL ? 1 : 0.45;
    v.delTitle = selL ? 'Delete ' + selL.name : 'Select a layer to delete it';
    v.delExp = delL ? 'true' : 'false'; v.delDisp = delL ? 'flex' : 'none';
    v.delQ = delL ? 'Delete “' + delL.name + '”?' : '';
    v.delNote = delL ? (delL.extra ? 'This removes the part you added. ' : 'The layout won’t place it again unless you bring it back from the Layout section. ') + 'You can undo this from History.' : '';
    v.askDelete = function () { if (self.state.selLayer) self.setState({ delConfirm: self.state.selLayer, addOpen: false }); };
    v.cancelDelete = function () { self.setState({ delConfirm: null }); };
    v.confirmDelete = function () { var id = self.state.delConfirm; self.setState({ delConfirm: null }); if (id) { self.state.selLayer = id; self.remove(); } };
    v.edStatusDisp = edit && st.status && (st.ltab || 'design') !== 'handoff' ? 'block' : 'none';

    /* Selected layer, per type */
    var isDates = !!selL && hsIsDatesLayer(selL);
    v.selIsDates = isDates; v.selIsPlainText = !!selL && selL.type === 'text' && !isDates;
    v.selKind = !selL ? '' : isDates ? 'Dates layer' : selL.type === 'text' ? 'Text layer' : selL.type === 'symbol' ? 'Symbol layer' : selL.type === 'photo' ? 'Image layer' : 'Border layer';
    var selAdj = selL && !selL.extra ? (adjMap[selL.key] || {}) : (selL || {});
    var selPerson = selL ? (selL.person || (/Partner/.test(selL.key || '') ? 2 : 1)) : 1;
    var selStyle = selAdj.dateStyle || (selL && selL.extra ? selL.dateStyle : '') || pp.dateStyle || 'upper';
    var selStack = selL && selL.extra ? !!selL.dateStack : !!selAdj.dateStack;
    var nm1 = hsNameParts(f.name).first || 'First person', nm2 = hsNameParts(f.name2 || '').first || 'Second person';
    v.selWhoDisp = isDates && two ? 'flex' : 'none';
    v.selWhoChips = [[1, nm1], [2, nm2]].map(function (x) {
      var on = selPerson === x[0], p = self.pill(on, accent, soft);
      return { label: x[1], bg: p.bg, bd: p.bd, pressed: p.pressed, pick: function () {
        if (!selL) return;
        if (selL.extra) self.updLayer(selL.id, { person: x[0], name: x[0] === 2 ? 'Dates (' + nm2 + ')' : 'Dates' }, true, 'Dates now for ' + x[1]);
      } };
    });
    v.selWhoDisp = isDates && two && selL && selL.extra ? 'flex' : 'none';
    v.selDateFmts = [['upper', 'Capitals'], ['long', 'Upper and lower case'], ['numeric', 'All numbers'], ['years', 'Years only']].map(function (x) {
      var on = selStyle === x[0] && (!selL || selL.extra || selAdj.text === undefined), p = self.pill(on, accent, soft);
      var sample = hsResvShow(hsDatesText(dp, C, selPerson, x[0], selStack)) || x[1];
      return { label: sample, bg: p.bg, bd: p.bd, pressed: p.pressed, pick: function () {
        if (!selL) return;
        var patch = { dateStyle: x[0] };
        if (!selL.extra && selAdj.text !== undefined) patch.text = undefined;
        self.updLayer(selL.id, patch, true, 'Date format: ' + x[1]);
      } };
    });
    v.selDateStack = selStack;
    v.toggleDateStack = function () { if (selL) self.updLayer(selL.id, { dateStack: !selStack }, true, selStack ? 'Dates on one line' : 'One date per line'); };
    v.dateAutoDisp = isDates && !selL.extra && selAdj.text !== undefined ? 'inline' : 'none';
    var selDw = (selL && selL.extra ? selL.dateWords : selAdj.dateWords) || pp.dateWords || { id: 'none', a: '', b: '' };
    v.selDateWords = HS_DATE_WORDS.map(function (w) {
      var on = (selDw.id || 'none') === w.id, p = self.pill(on, accent, soft);
      return { label: w.label, bg: p.bg, bd: p.bd, pressed: p.pressed, pick: function () {
        if (!selL) return;
        var patch = { dateWords: w.id === 'custom' ? { id: 'custom', a: '', b: '' } : { id: w.id, a: w.a, b: w.b } };
        if (!selL.extra && selAdj.text !== undefined) patch.text = undefined;
        self.updLayer(selL.id, patch, true, 'Date words: ' + w.label);
      } };
    });
    v.selDwCustomDisp = isDates && selDw.id === 'custom' ? 'grid' : 'none';
    v.selDwA = selDw.a || ''; v.selDwB = selDw.b || '';
    v.onSelDwA = function (e) { if (selL) self.updLayer(selL.id, { dateWords: Object.assign({}, selDw, { id: 'custom', a: e.target.value }) }, true, 'Typed date words'); };
    v.onSelDwB = function (e) { if (selL) self.updLayer(selL.id, { dateWords: Object.assign({}, selDw, { id: 'custom', b: e.target.value }) }, true, 'Typed date words'); };
    v.dateUseAuto = function () { if (selL) self.updLayer(selL.id, { text: undefined }, true, 'Formatted dates for ' + selL.name); };

    /* Images: photos grouped by whose they are, each with its own upload. */
    var groups = two ? [[1, nm1], [2, nm2]] : [[1, hsNameParts(f.name).first || 'them']];
    v.photoGroups = groups.map(function (g) {
      var mine = st.photos.filter(function (p) { return (p.owner || 1) === g[0]; });
      return { title: two ? 'Photos of ' + g[1] : 'Photos', who: g[1], emptyDisp: mine.length ? 'none' : 'block',
        onFiles: function (e) { self.handleFiles(e.target.files, g[0]); try { e.target.value = ''; } catch (err) {} },
        photos: mine.map(function (p) {
          var on = !!selL && selL.type === 'photo' && selL.photo === p.id;
          return { url: p.url, label: 'Use photo ' + p.name, pressed: on ? 'true' : 'false', bd: on ? accent : '#dcd7cc', pick: function () { if (selL) self.updLayer(selL.id, { photo: p.id }, true, 'Changed photo'); } };
        }) };
    });

    v.selPosHead = selL && selL.extra ? 'Position on the stone' : 'Offset from the layout';
    v.selPosHint = selL && selL.extra ? 'You added this part, so it stays exactly where you put it. Drag it on the stone or use the arrows.' : 'Moves are remembered relative to where the layout places this part. Drag it on the stone, use the arrows, or the arrow keys (Shift for bigger steps).';
    v.resetSel = function () { if (selL) self.resetLayer(selL.id); };
    v.resetSelDisp = selL && !selL.extra && HS_ADJ_SIZE.some(function (k) { return selAdj[k] !== undefined; }) ? 'inline-flex' : 'none';

    var sec = this.sections(dp);
    var bh = hsBaseH(dp);
    v.statTiles = [
      { k: 'Stone', v: W + '″ W × ' + H + '″ H' },
      { k: 'Base', v: bh ? (W + 2 * hsBaseX(dp)) + '″ W × ' + hsBaseD(dp) + '″ D × ' + bh + '″ H' : 'None' },
      { k: 'Margin to ' + (dp.layers.some(function (l) { return l.visible && l.type === 'border'; }) ? 'border' : 'edge'), v: 'min ' + hsIn(hsClear(dp)) },
      { k: 'Type', v: tyP.label }
    ];
    v.measureRows = sec.rows.map(function (r) {
      var gp = sec.gaps[r.l.id], on = sel && sel.id === r.l.id;
      return { name: r.l.name, top: hsIn1(r.b.y0), h: hsIn(r.b.h), w: (r.l.type === 'text' ? '≈' : '') + hsIn1(r.b.w), gap: gp ? hsIn(gp.gap) : '–',
        bg: on ? soft : 'transparent', select: function () { self.setState({ selLayer: r.l.id }); } };
    });
    v.specRows = [
      { k: 'Type', v: tyP.label },
      { k: 'Shape', v: shp.label },
      { k: 'Granite', v: m.label },
      { k: 'Stone', v: W + '″ W × ' + H + '″ H × ' + (tyP.baseH ? '6' : '4') + '″ D [CONFIRM]' },
      { k: 'Base', v: bh ? (W + 2 * hsBaseX(dp)) + '″ W × ' + hsBaseD(dp) + '″ D × ' + bh + '″ H, ' + hsBaseMat(dp).label + ', ' + hsFind(HS_SURFACES, dp.baseSurface || 'polished').spec.toLowerCase() + ', ' + hsFind(HS_EDGES, dp.baseEdges || 'smooth').spec + ' [CONFIRM]' : 'None [CONFIRM]' },
      { k: 'Flower vases', v: hsVaseOn(dp) ? hsVaseSpec(dp) + '. ' + hsFind(HS_VASE_KINDS, dp.vase.kind).spec + ' [CONFIRM]' : 'None' },
      { k: 'Finish', v: hsFind(HS_SURFACES, pp.surface || 'polished').spec + ', ' + hsFind(HS_EDGES, pp.edges || 'smooth').spec + ' [CONFIRM]' },
      { k: 'Cemetery', v: '[CEMETERY NAME]' },
      { k: 'Section / lot', v: '[SECTION / LOT]' }
    ];
    var numD = this.numbering(dp);
    v.schedule = numD.ordered.map(function (l) {
      var c = Object.assign({}, hsFind(HS_CARVES, l.carve), { spec: hsCarveSpec(l, m) });
      var row = { num: numD.map[l.id], title: l.name, family: "'Instrument Sans', system-ui, sans-serif", fstyle: 'normal', lines: [] };
      if (l.type === 'text') {
        var ft = hsFind(HS_FONTS, l.font);
        row.content = hsResvShow(l.text); row.family = ft.family;
        if (hsHasResv(l.text)) row.lines.push({ k: 'Reserved', v: 'Space held for the passed date. Do not cut until it is added.' }); row.fstyle = ft.style;
        row.lines.push({ k: 'Method', v: c.spec }, { k: 'Typeface', v: ft.spec }, { k: 'Letters', v: hsIn(l.ht) + ' capitals, ' + hsR(l.track).toFixed(2) + ' em spacing' }, { k: 'Center', v: hsIn(l.x) + ' from left · ' + hsIn(l.y) + ' from top' });
      } else if (l.type === 'symbol') {
        row.content = hsSymLabel(l.sym);
        row.lines.push({ k: 'Method', v: c.spec }, { k: 'Size', v: hsIn(l.size) + ' square' }, { k: 'Center', v: hsIn(l.x) + ' from left · ' + hsIn(l.y) + ' from top' });
      } else if (l.type === 'photo') {
        row.content = hsPhotoShapeLabel(l.frame) + ' portrait';
        row.lines.push({ k: 'Method', v: hsPhotoMethod(l) }, { k: 'Size', v: hsIn(l.w) + ' × ' + hsIn(l.h) }, { k: 'Center', v: hsIn(l.x) + ' from left · ' + hsIn(l.y) + ' from top' });
      } else {
        var bd = hsFind(HS_BORDERS, l.bstyle);
        row.content = bd.label + ' following the ' + shp.label.toLowerCase();
        row.lines.push({ k: 'Method', v: c.spec }, { k: 'Inset', v: hsIn(l.inset) + ' from the stone edge' });
      }
      return row;
    });
    v.svgCode = edit && (st.ltab || 'design') === 'handoff' ? this.buildSvg(dp, false) : '';
    v.copySvg = function () { self.copySvg(); };
    v.downloadSvg = function () { self.downloadSvg(); };
    v.status = st.status;

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
  }
}
