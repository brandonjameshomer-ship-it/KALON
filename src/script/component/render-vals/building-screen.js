    var an = st.analysis || { found: [], motifs: [], faith: null };
    var nq = f.quotes.map(hsCleanQuote).filter(Boolean).length;
    v.buildName = hsNameParts(f.name).full || 'them';
    v.ghosts = ['serp', 'arch', 'flat'].map(function (s, i) { return { d: hsStonePath(s, 120, 92), delay: (i * 0.25) + 's' }; });
    var symNames = [];
    if (an.faith) symNames.push(hsSymLabel(an.faith.sym));
    an.motifs.slice(0, 3).forEach(function (m) { symNames.push(hsSymLabel(m.sym)); });
    var stepDefs = [
      { label: 'Listening to their story', detail: an.found.length ? 'We heard: ' + an.found.slice(0, 7).join(', ') : (f.story.trim() ? 'Keeping things timeless and classic.' : 'Working from their name, dates and the words you shared.') },
      { label: 'Choosing symbols that feel like them', detail: symNames.length ? symNames.join(', ') : 'A blossom, a tree of life and a dove' },
      { label: 'Setting their name with care', detail: 'Sizing the name, dates' + (nq ? ' and ' + (nq === 1 ? 'words' : 'words') : '') + (st.photos.length ? ', and their photo,' : '') + ' to three stones' },
      { label: 'Making sure it will carve beautifully', detail: 'Gentle margins, clear letters, nothing crowded' }
    ];
    v.buildSteps = stepDefs.map(function (s, i) {
      var done = i < st.buildStep, on = i === st.buildStep;
      return { label: s.label, detail: s.detail, op: done || on ? 1 : 0.45,
        ring: done ? accent : '#cfc9bd', ringTop: done || on ? accent : '#cfc9bd',
        fill: done ? accent : 'transparent', anim: on ? 'hsSpin .9s linear infinite' : 'none', checkDisp: done ? 'block' : 'none' };
    });

