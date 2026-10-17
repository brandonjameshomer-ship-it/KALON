    if (!isStage) return v;

    var C = this.content();
    var partsUsed = ['name', 'dates'];
    if (nq) partsUsed.push(nq === 1 ? 'quote' : 'quotes');
    if (st.photos.length) partsUsed.push(st.photos.length === 1 ? 'photo' : 'photos');
    if (f.theme.trim()) partsUsed.push('style notes');
    if (f.story.trim()) partsUsed.push('story');
    v.headerName = C.np.full;
    var twoH = f.who === 'two' && String(f.name2 || '').trim(), fn1 = hsNameParts(f.name).first || f.name, fn2 = hsNameParts(f.name2 || '').first || f.name2;
    v.optHeadline = twoH ? (f.pair === 'matching' ? 'Three matching pairs for ' + fn1 + ' & ' + fn2 + ', made with care' : 'Three companion stones for ' + fn1 + ' & ' + fn2 + ', made with care') : 'Three designs for ' + v.headerName + ', made with care';
    v.headerSub = 'Each one tells their story a little differently, shaped by the ' + partsUsed.slice(0, -1).join(', ') + ' and ' + partsUsed[partsUsed.length - 1] + ' you shared. Take your time, and tap one to see it up close.';
    var chosen = st.sel >= 0 && scr !== 'options';
    v.hdrOp = chosen ? 0 : 1;
    v.hdrY = chosen ? -16 : 0;
    var dSel = chosen ? st.designs[st.sel] : null;
    v.capOp = focus ? 1 : 0;
    v.capVis = focus ? 'visible' : 'hidden';
    v.capDelay = focus ? '.35s' : '0s';
    v.capVisDelay = focus ? '0s' : '.45s';
    v.fbY = focus ? 0 : 20;
    v.capEyebrow = dSel ? 'Design ' + (st.sel + 1) + ' of 3' : '';
    v.capTitle = dSel ? dSel.title : '';
    v.capSpec = dSel ? hsTypeOf(dSel).label + ' · ' + dSel.W + '″ × ' + dSel.H + '″ · ' + hsFind(HS_SHAPES, dSel.shape).label + ' · ' + hsFind(HS_MATERIALS, dSel.material).label : '';

    var ease = 'cubic-bezier(.22,.8,.2,1)';
    var mkTrans = function (delay, hidden, slow) {
      var dur = slow ? '1.1s' : '.65s';
      return ['left', 'top', 'width', 'height'].map(function (p) { return p + ' ' + dur + ' ' + ease + ' ' + delay; })
        .concat(['transform ' + (slow ? '1.1s' : '.7s') + ' ' + ease + ' ' + delay, 'opacity .5s ease ' + delay, 'background-color .5s ease', 'border-radius .5s ease', 'visibility 0s linear ' + (hidden ? '.7s' : '0s')]).join(', ');
    };
    var editSel = edit ? st.selLayer : null;

