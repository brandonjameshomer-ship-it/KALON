    v.faithOtherOn = f.faith === 'other';
    var fg = f.faith === 'other' ? hsFaithGuess(f.faithOther) : null, fgSy = fg ? hsFind(HS_SYMBOLS, fg.sym) : null;
    v.faithGuessDisp = f.faith === 'other' && String(f.faithOther || '').trim() ? 'flex' : 'none';
    v.faithGuessText = fg ? 'We’ll carve the ' + fg.label.toLowerCase() + (fg.faith ? ', the ' + fg.faith + ' symbol' : '') + '.' : 'We’ll choose a symbol from their story, or you can pick one while refining.';
    v.faithGuessSymDisp = fgSy ? 'block' : 'none'; v.faithGuessD = fgSy ? fgSy.d : 'M0 0';
    v.faithGuessFill = fgSy && fgSy.mode === 'fill' ? accent : 'none'; v.faithGuessStroke = fgSy && fgSy.mode === 'stroke' ? accent : 'none'; v.faithGuessSw = fgSy ? (fgSy.sw || 0) : 0;
    v.storyCount = f.story.length ? f.story.length + ' characters' : '';

    var ws = Math.max(0, Math.min(HS_WSTEPS.length - 1, st.wstep)), wmeta = HS_WSTEPS[ws];
    HS_WSTEPS.forEach(function (s0, wi) { v['wIs_' + s0.id] = ws === wi; });
    v.wEyebrow = 'Question ' + (ws + 1) + ' of ' + HS_WSTEPS.length + (wmeta.req ? ' · Required' : ' · Optional');
    v.wTitle = wmeta.title; v.wSub = wmeta.sub;
    if (f.who === 'two') {
      if (wmeta.id === 'name') { v.wTitle = 'Let’s begin with their names'; v.wSub = 'Write each name just as you’d like it carved, along with the dates you’d like remembered.'; }
      if (wmeta.id === 'photos') { v.wTitle = 'Would you like to share photos of them?'; v.wSub = 'Add a picture of each of them. Every photo stays with the right person, so each portrait sits on their own side of the stone.'; }
      if (wmeta.id === 'story') { v.wTitle = 'Tell us about them both'; v.wSub = 'A few sentences for each. What they loved, where they felt at home, the life they built together.'; }
    }
    v.wSubDisp = v.wSub ? 'block' : 'none';
    v.wProg = Math.round((ws + 1) / HS_WSTEPS.length * 100);
    v.wBack = function () { self.wBack(); };
    v.wBackVis = ws > 0 ? 'visible' : 'hidden';
    v.wNext = function () { self.wNext(); };
    v.wSkip = function () { if (ws < HS_WSTEPS.length - 1) self.goStep(ws + 1); else self.build(); };
    v.wSkipDisp = wmeta.req || ws === HS_WSTEPS.length - 1 ? 'none' : 'block';
    var last = ws === HS_WSTEPS.length - 1;
    v.wNextLabel = last ? 'Create their designs' : 'Continue';
    v.wNextClass = last ? 'hs-create' : '';
    v.wNextRays = last ? 'M19.2 3.8 L21.2 1.8 M4.8 3.8 L2.8 1.8 M19.2 18.2 L21.2 20.2 M4.8 18.2 L2.8 20.2' : 'M0 0';
    v.wAnim = (ws % 2 ? 'hsRiseA' : 'hsRiseB') + ' .6s ease both';
    v.wNextIcon = last ? 'M12 3 L13.8 9.2 L20 11 L13.8 12.8 L12 19 L10.2 12.8 L4 11 L10.2 9.2 Z' : 'M9 5 L16 12 L9 19';
    var nq0 = f.quotes.map(hsCleanQuote).filter(Boolean).length;
    var seenId = function (id) { var k = -1; HS_WSTEPS.forEach(function (s0, i0) { if (s0.id === id) k = i0; }); return !!st.wSeen[k]; };
    var sumById = {
      name: f.who === 'two' && f.name.trim() ? (hsNameParts(f.name).first || f.name.trim()) + ' & ' + (hsNameParts(f.name2).first || '…') + (f.pair === 'matching' ? ' · matching stones' : ' · companion stone') : f.name.trim() ? f.name.trim() + (born || passed ? ' · ' + hsDateLine(born, passed, 'years', ' – ') : '') : 'Not yet',
      faith: f.faith === 'other' && hsFaithGuess(f.faithOther) ? (hsFaithGuess(f.faithOther).faith || hsFaithGuess(f.faithOther).label) : f.faith ? hsFind(HS_FAITHS, f.faith).label : seenId('faith') ? 'No symbol' : 'Not yet',
      quotes: f.noQuotes ? 'Leaving words off the stone' : nq0 ? nq0 + (nq0 === 1 ? ' quote' : ' quotes') : seenId('quotes') ? 'None, so we’ll suggest a few' : 'Not yet',
      photos: st.photos.length ? (f.who === 'two' && String(f.name2 || '').trim()
        ? [[1, hsNameParts(f.name).first || 'first'], [2, hsNameParts(f.name2).first || 'second']].map(function (z) { var n = st.photos.filter(function (q) { return (q.owner || 1) === z[0]; }).length; return n + ' of ' + z[1]; }).join(', ')
        : st.photos.length + (st.photos.length === 1 ? ' photo' : ' photos')) : (f.photoLater || f.photoLater2) ? 'A spot saved for later' : seenId('photos') ? 'None' : 'Not yet',
      story: f.story.trim() || String(f.story2 || '').trim() ? hsTrunc((f.story.trim() + ' ' + String(f.story2 || '').trim()).trim(), 38) : seenId('story') ? 'Skipped for now' : 'Not yet',
      style: f.theme.trim() ? hsTrunc(f.theme.trim(), 38) : seenId('style') ? 'We’ll choose for you' : 'Not yet',
      details: (function () { var pr = f.prefs || {}, names = []; HS_PREF_GROUPS.forEach(function (g) { (pr[g.id] || []).forEach(function (id) { var src = g.id === 'types' ? HS_TYPES : g.id === 'shapes' ? HS_SHAPES : g.id === 'mats' ? HS_MATERIALS : g.id === 'carves' ? hsPrefFinishes() : g.id === 'fonts' ? HS_FONTSETS : [{ id: 'none', label: 'No border' }].concat(HS_BORDERS); names.push(hsFind(src, id).label); }); }); return names.length ? hsTrunc(names.join(', '), 38) : seenId('details') ? 'Open to anything' : 'Not yet'; })()
    };
    var summaries = HS_WSTEPS.map(function (s0) { return sumById[s0.id]; });
    v.wList = HS_WSTEPS.map(function (s, i) {
      var on = i === ws, done = !!summaries[i] && summaries[i] !== 'Not yet';
      return { label: s.label, summary: summaries[i], current: on ? 'step' : 'false', bg: on ? '#fbfaf7' : 'transparent',
        n: done && !on ? '✓' : String(i + 1), numBg: on ? accent : done ? soft : '#ffffff', numFg: on ? '#ffffff' : done ? accent : '#4a463f', numBd: on || done ? accent : '#a39b8c',
        go: function () { if (i > ws) self.goStep(i); else self.setState({ wstep: i }); } };
    });
    var errs = st.errors.name || st.errors.date;
    v.footMsg = errs ? 'We’ll just need their name and at least one date.' : (last ? 'Whenever you’re ready.' : (wmeta.req ? 'Take your time.' : ''));
    v.footColor = errs ? '#9a2f22' : '#3d3a34';
    v.build = function () { self.build(); };
    v.fillSample = function () { self.fillSample(); };
