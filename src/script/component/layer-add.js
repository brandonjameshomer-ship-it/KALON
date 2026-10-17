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
