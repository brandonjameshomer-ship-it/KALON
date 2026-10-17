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

