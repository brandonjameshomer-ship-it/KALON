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

