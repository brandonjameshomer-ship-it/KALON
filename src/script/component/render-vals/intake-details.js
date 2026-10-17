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
