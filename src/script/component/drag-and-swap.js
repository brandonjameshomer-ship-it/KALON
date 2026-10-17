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

