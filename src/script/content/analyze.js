function hsNameParts(full) {
  var clean = String(full || '').trim().replace(/\s+/g, ' ');
  var t = clean.split(' ').filter(Boolean), suffix = '';
  if (t.length > 2 && /^(jr\.?|sr\.?|ii|iii|iv)$/i.test(t[t.length - 1])) suffix = t.pop();
  var last = t.length > 1 ? t.pop() : '';
  return { given: t.join(' ') + (suffix ? ' ' + suffix : ''), surname: last, full: clean, first: clean.split(' ')[0] || '' };
}
function hsCleanQuote(q) {
  var s = String(q || '').replace(/\s+/g, ' ').trim();
  s = s.replace(/^["“”'‘’]+/, '').replace(/["“”'‘’]+$/, '').trim();
  return s.slice(0, 180);
}

function hsAnalyze(f) {
  var faithTyped = f.faith === 'other' ? String(f.faithOther || '').toLowerCase() : '';
  var story = (String(f.story || '') + ' ' + String(f.faithOther || '')).toLowerCase(), theme = String(f.theme || '').toLowerCase();
  var qs = (f.quotes || []).join(' ').toLowerCase();
  var scored = [], found = [];
  HS_MOTIF_RULES.forEach(function (r) {
    var score = 0, words = [];
    r.words.forEach(function (w) {
      var n = hsCount(story, w) + 2 * hsCount(theme, w) + hsCount(qs, w) + (r.faith ? 6 * hsCount(faithTyped, w) : 0);
      if (n) { score += n * (r.weight || 1); words.push(w); }
    });
    if (score) scored.push({ sym: r.sym, faith: !!r.faith, score: score, words: words });
  });
  scored.sort(function (a, b) { return b.score - a.score; });
  var faith = null;
  scored.forEach(function (s) { if (s.faith && !faith) faith = s; });
  var chosen = hsFind(HS_FAITHS, f.faith || 'other');
  if (f.faith === 'none') faith = null;
  else if (f.faith && chosen.sym) faith = { sym: chosen.sym, faith: true, words: [], chosen: true };
  var motifs = scored.filter(function (s) { return !s.faith; });
  scored.forEach(function (s) { s.words.forEach(function (w) { if (found.indexOf(w) < 0) found.push(w); }); });

  var she = hsCount(story, 'she') + hsCount(story, 'her') + hsCount(story, 'hers');
  var he = hsCount(story, 'he') + hsCount(story, 'him') + hsCount(story, 'his');
  var g = she > he ? 'f' : he > she ? 'm' : '';
  var any = function (ws) { return ws.some(function (w) { return hsCount(story, w) > 0; }); };
  var roles = [];
  if (any(['wife']) && g !== 'f') roles.push('Husband');
  else if (any(['husband']) && g !== 'm') roles.push('Wife');
  else if (g && any(['married', 'widow', 'widower'])) roles.push(g === 'f' ? 'Wife' : 'Husband');
  if (any(['mother', 'mom', 'mama', 'mum']) && g !== 'm') roles.push('Mother');
  else if (any(['father', 'dad', 'papa']) && g !== 'f') roles.push('Father');
  else if (g && any(['children', 'kids', 'son', 'sons', 'daughter', 'daughters'])) roles.push(g === 'f' ? 'Mother' : 'Father');
  if (any(['grandmother', 'grandma', 'nana', 'granny']) && g !== 'm') roles.push('Grandmother');
  else if (any(['grandfather', 'grandpa', 'granddad', 'grandad']) && g !== 'f') roles.push('Grandfather');
  else if (g && any(['grandchildren', 'grandkids', 'grandson', 'granddaughter'])) roles.push(g === 'f' ? 'Grandmother' : 'Grandfather');
  var roleLine = roles.length ? 'Beloved ' + (roles.length === 1 ? roles[0] : roles.slice(0, -1).join(', ') + ' & ' + roles[roles.length - 1]) : '';

  var vet = '';
  if (any(['served', 'veteran', 'enlisted', 'deployed', 'war'])) {
    var br = [['air force', 'U.S. Air Force'], ['coast guard', 'U.S. Coast Guard'], ['marine corps', 'U.S. Marine Corps'], ['marines', 'U.S. Marine Corps'], ['navy', 'U.S. Navy'], ['army', 'U.S. Army']];
    for (var i = 0; i < br.length; i++) { if (hsCount(story, br[i][0])) { vet = br[i][1] + ' Veteran'; break; } }
  }

  var prefs = { shapes: [], type: '', material: '', fonts: [], carve: '', words: [] };
  HS_PREF_SHAPES.forEach(function (p) { p[1].forEach(function (w) { if (hsCount(theme, w) && prefs.shapes.indexOf(p[0]) < 0) { prefs.shapes.push(p[0]); prefs.words.push(w); } }); });
  HS_PREF_TYPES.forEach(function (p) { p[1].forEach(function (w) { if (!prefs.type && hsCount(theme, w)) { prefs.type = p[0]; prefs.words.push(w); } }); });
  HS_PREF_MATS.forEach(function (p) { p[1].forEach(function (w) { if (!prefs.material && hsCount(theme, w)) { prefs.material = p[0]; prefs.words.push(w); } }); });
  HS_PREF_FONTS.forEach(function (p) { p[1].forEach(function (w) { if (hsCount(theme, w) && prefs.fonts.indexOf(p[0]) < 0) { prefs.fonts.push(p[0]); prefs.words.push(w); } }); });
  HS_PREF_CARVES.forEach(function (p) { p[1].forEach(function (w) { if (!prefs.carve && hsCount(theme, w)) { prefs.carve = p[0]; prefs.words.push(w); } }); });
  prefs.words = prefs.words.filter(function (w, i) { return prefs.words.indexOf(w) === i; });

  var reading = /\b(book|books|read|reading|reader|teacher|taught|library|librarian|writer|poet|poetry|author|scholar)\b/.test(story + ' ' + theme);
  return { motifs: motifs, faith: faith, roleLine: roleLine, roles: roles, veteran: vet, prefs: prefs, found: found, reading: reading };
}

