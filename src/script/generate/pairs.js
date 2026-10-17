/* Two people. A shared companion stone gives each person their own side, with a symbol drawn from their own
   story; matching stones keep one design and carve it twice, once for each of them. */
function hsPairForm(form) { return Object.assign({}, form, { name: form.name2, born: form.born2, passed: form.passed2, passedLater: form.passedLater2, story: form.story2 || '' }); }
function hsPairDesigns(designs, form, photos, an, v, C) {
  var f1 = hsNameParts(form.name).first || 'them', f2 = hsNameParts(form.name2).first || 'them';
  if (form.pair === 'matching') {
    var mp2 = (photos || []).filter(function (x) { return x.owner === 2; })[0];
    designs.forEach(function (d) { if (d.params.photo && mp2) d.params = Object.assign({}, d.params, { photo2: mp2.id }); d.why = [('A matching pair: the same design carved for ' + f1 + ' and for ' + f2 + '. Switch between them any time.')].concat(d.why.slice(0, 3)); });
    return;
  }
  /* Each side's symbol comes from that person's own story alone, not the shared quotes or style notes. */
  var only = function (f) { return hsAnalyze(Object.assign({}, f, { quotes: [], theme: '', faith: 'none' })); };
  var a1 = only(form), a2 = only(hsPairForm(form));
  var own1 = a1.motifs[0] || an.faith || an.motifs[0] || { sym: 'blossom', words: [] };
  var blend = an.faith || an.motifs[0] || own1;
  var own2 = a2.motifs.filter(function (m) { return m.sym !== own1.sym; })[0] || a2.motifs[0] || own1;
  var words = function (m) { return m && m.words && m.words.length ? ' (“' + m.words.slice(0, 2).join('”, “') + '”)' : ''; };
  var looks = [['Side by side', designs[0].shape === 'flat' ? 'serp' : designs[0].shape, 54, 24], ['Two hearts, one stone', 'dheart', 48, 34], ['An open book', 'book', 52, 24]];
  designs.forEach(function (d, i) {
    var lk = looks[i] || looks[0];
    d.title = lk[0]; d.shape = lk[1];
    d.type = 'upright'; d.genType = 'upright'; d.base = true;
    d.W = lk[2]; d.H = lk[3]; d.genW = d.W; d.genH = d.H;
    var ph1 = (photos || []).filter(function (x) { return (x.owner || 1) === 1; })[0], ph2 = (photos || []).filter(function (x) { return x.owner === 2; })[0];
    var withPh = !!(ph1 || ph2);
    d.params = Object.assign({}, d.params, { layout: 'split', storyMode: 'own', sym1: own1.sym, sym2: own2.sym, symBlend: blend.sym, photo: withPh && ph1 ? ph1.id : '', photo2: withPh && ph2 ? ph2.id : '', showRole: false });
    d.layers = hsLayoutBest(d, C, true);
    d.why = [
      'A companion stone for ' + f1 + ' and ' + f2 + ', each with a side of their own',
      hsSymLabel(own1.sym) + ' for ' + f1 + words(own1) + ', ' + hsSymLabel(own2.sym).toLowerCase() + ' for ' + f2 + words(own2),
      withPh ? (ph1 && ph2 ? 'Each of their portraits on their own side' : 'The portrait sits on ' + (ph1 ? f1 : f2) + '’s side') : C.quotes.length ? 'Your quote set beneath, shared by them both' : 'Both names carved at the same size, so neither reads as secondary',
      hsFind(HS_SHAPES, d.shape).label + ' in ' + hsFind(HS_MATERIALS, d.material).label
    ];
  });
}

