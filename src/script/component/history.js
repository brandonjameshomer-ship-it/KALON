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
