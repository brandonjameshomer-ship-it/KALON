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
