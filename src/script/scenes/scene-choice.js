function hsSceneFor(an) {
  var top = an.motifs.length ? an.motifs[0].sym : '';
  var has = function (w) { return an.found.indexOf(w) >= 0; };
  if (top === 'anchor') return 'sea';
  if (top === 'mountains') return has('lake') || has('lakeside') ? 'lake' : 'mountains';
  if (top === 'blossom') return 'garden';
  if (an.faith && !an.motifs.length) return 'church';
  if (has('lake') || has('lakeside')) return 'lake';
  return 'meadow';
}
function hsSceneWhy(id, an, manual) {
  var sc = HS_SCENES[id] || HS_SCENES.meadow;
  if (manual) return 'Shown ' + sc.phrase + '.';
  var words = [];
  var match = { garden: 'blossom', mountains: 'mountains', lake: 'mountains', sea: 'anchor', meadow: 'tree' }[id];
  an.motifs.forEach(function (m) { if (m.sym === match) words = m.words.slice(0, 2); });
  if (id === 'lake' && words.indexOf('lake') < 0) words = ['lake'].concat(words).slice(0, 2);
  if (id === 'church' && an.faith && an.faith.words.length) words = an.faith.words.slice(0, 2);
  return 'We imagined it ' + sc.phrase + (words.length ? ', because you told us about “' + words.join('” and “') + '”' : '') + '. A gentle place to visit and remember.';
}

