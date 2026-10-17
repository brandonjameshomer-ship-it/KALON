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
