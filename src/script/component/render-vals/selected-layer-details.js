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

