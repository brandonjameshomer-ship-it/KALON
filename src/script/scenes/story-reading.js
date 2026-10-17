/* Read the story for the things that should appear in their place. */
function hsStoryScene(form) {
  var parts = [form.story, form.theme].concat(form.quotes || []);
  var text = parts.filter(Boolean).join(' . ').toLowerCase();
  var words = text.match(/[a-z']+/g) || [];
  var firstAt = function (list) { var best = -1, w = ''; list.forEach(function (x) { var i = words.indexOf(x); if (i >= 0 && (best < 0 || i < best)) { best = i; w = x; } }); return { at: best, word: w }; };
  var keeps = [];
  HS_KEEP_ORDER.forEach(function (k) { var f = firstAt(HS_KEEPS[k].words); if (f.at >= 0) keeps.push({ id: k, word: f.word, at: f.at }); });
  keeps.sort(function (a, b) { return a.at - b.at; });
  var tod = '', todWord = '', season = '', seasonWord = '', bestT = -1, bestS = -1;
  Object.keys(HS_TOD_WORDS).forEach(function (k) { var f = firstAt(HS_TOD_WORDS[k]); if (f.at >= 0 && (bestT < 0 || f.at < bestT)) { bestT = f.at; tod = k; todWord = f.word; } });
  Object.keys(HS_SEASON_WORDS).forEach(function (k) { var f = firstAt(HS_SEASON_WORDS[k]); if (f.at >= 0 && (bestS < 0 || f.at < bestS)) { bestS = f.at; season = k; seasonWord = f.word; } });
  if (/\b(every|each|in the|the) fall\b/.test(text) && (bestS < 0 || words.indexOf('fall') < bestS)) { season = 'autumn'; seasonWord = 'fall'; }
  if (!tod && keeps.some(function (k) { return k.id === 'stars'; })) { tod = 'night'; todWord = 'stars'; }
  var aurora = /\b(northern lights|aurora|alaska|norway|iceland|finland|lapland|yukon|arctic)\b/.test(text);
  if (aurora && !tod) { tod = 'night'; todWord = (/northern lights|aurora/.exec(text) || [''])[0]; }
  return { keeps: keeps, tod: tod, todWord: todWord, season: season, seasonWord: seasonWord, aurora: aurora, seed: hsHash((form.name || '') + '|' + (form.story || '')) };
}

/* Fill the gaps the story leaves with gentle, seeded chance. Same person → same place. */
function hsSceneMoment(form, sceneId, manual) {
  var ss = hsStoryScene(form), rng = hsRng(ss.seed ^ hsHash(sceneId));
  var tod = manual.tod || ss.tod, season = manual.season || ss.season;
  var r1 = rng(), r2 = rng();
  if (!tod) tod = r1 < 0.26 ? 'morning' : r1 < 0.66 ? 'afternoon' : r1 < 0.88 ? 'evening' : 'night';
  if (!season) season = sceneId === 'garden' ? (r2 < 0.55 ? 'spring' : 'summer') : (r2 < 0.35 ? 'spring' : r2 < 0.75 ? 'summer' : 'autumn');
  var water = sceneId === 'lake' || sceneId === 'sea';
  var keeps = ss.keeps.filter(function (k) {
    if (HS_KEEPS[k.id].water && !water) return false;
    if (k.id === 'steeple' && sceneId === 'church') return false;
    if (k.id === 'stars' && tod !== 'evening' && tod !== 'night') return false;
    if (season === 'winter' && (k.id === 'sunflowers' || k.id === 'butterflies')) return false;
    return true;
  }).slice(0, 5);
  return { tod: tod, season: season, keeps: keeps, story: ss, worship: hsFaithKind(form), aurora: ss.aurora, seed: (ss.seed ^ hsHash(sceneId)) >>> 0 };
}

function hsMomentWhy(sceneId, an, mo, manual) {
  var sc = HS_SCENES[sceneId] || HS_SCENES.meadow;
  var bits = mo.keeps.map(function (k) { return HS_KEEPS[k.id].phrase; });
  if (sceneId === 'church') bits.unshift('the old church nearby');
  var list = bits.length > 1 ? bits.slice(0, -1).join(', ') + ' and ' + bits[bits.length - 1] : bits[0] || '';
  var todTxt = { morning: 'on a soft ' + mo.season + ' morning', afternoon: 'on a golden ' + mo.season + ' afternoon', evening: 'on a gentle ' + mo.season + ' evening' }[mo.tod];
  var words = [];
  if (!manual.scene) {
    var match = { garden: 'blossom', mountains: 'mountains', lake: 'mountains', sea: 'anchor', meadow: 'tree' }[sceneId];
    an.motifs.forEach(function (m) { if (m.sym === match) words = m.words.slice(0, 1); });
    if (sceneId === 'lake' && words.indexOf('lake') < 0) words = ['lake'];
    if (sceneId === 'church' && an.faith && an.faith.words.length) words = an.faith.words.slice(0, 1);
  }
  mo.keeps.forEach(function (k) { if (words.indexOf(k.word) < 0) words.push(k.word); });
  if (!manual.season && mo.story.seasonWord && words.indexOf(mo.story.seasonWord) < 0) words.push(mo.story.seasonWord);
  if (!manual.tod && mo.story.todWord && words.indexOf(mo.story.todWord) < 0) words.push(mo.story.todWord);
  words = words.slice(0, 4);
  var wl = words.map(function (w) { return '“' + w + '”'; });
  var wtxt = wl.length > 1 ? wl.slice(0, -1).join(', ') + ' and ' + wl[wl.length - 1] : wl[0];
  return 'We imagined it ' + sc.phrase + (list ? ', with ' + list : '') + ', ' + todTxt + '.' + (words.length ? ' You told us about ' + wtxt + ', so we kept them close.' : ' A gentle place to visit and remember.');
}

