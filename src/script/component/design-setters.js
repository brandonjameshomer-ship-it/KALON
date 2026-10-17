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
