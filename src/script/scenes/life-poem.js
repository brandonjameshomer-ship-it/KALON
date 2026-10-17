/* ---------- A few lines about their life, written like a small poem ---------- */
var HS_NUMWORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
var HS_TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
function hsNumWord(n) {
  if (n < 20) return HS_NUMWORDS[n];
  if (n < 100) return HS_TENS[Math.floor(n / 10)] + (n % 10 ? '-' + HS_NUMWORDS[n % 10] : '');
  if (n < 120) return 'one hundred' + (n % 100 ? ' and ' + hsNumWord(n % 100) : '');
  return String(n);
}
var HS_POEM_LOVES = [
  { w: ['roses', 'rose', 'garden', 'gardening', 'flowers', 'tulips', 'lilacs'], lines: ['{S} could coax a rose toward the light, and people too.', '{S} spent {p} springs with {p} hands in the soil, patient as the seasons.'] },
  { w: ['lake', 'cabin', 'cottage', 'dock'], lines: ['Summers belonged to the lake, to long gold evenings and doors left open.', 'There was always room at the cabin, and always one more chair.'] },
  { w: ['mountains', 'mountain', 'hiking', 'trail', 'trails'], lines: ['{S} loved the high country, where the air is thin and the view goes on forever.'] },
  { w: ['choir', 'sang', 'sing', 'singing', 'hymn', 'hymns'], lines: ['{S} sang, and {p} voice made Sunday feel like home.', 'Every hymn {s} sang is still somewhere in the rafters.'] },
  { w: ['piano', 'guitar', 'violin', 'music', 'band'], lines: ['There was always music wherever {s} {was}.'] },
  { w: ['fishing', 'fisherman', 'boat', 'boating', 'canoe'], lines: ['{S} was happiest on the water, line cast, nowhere else to be.'] },
  { w: ['sea', 'ocean', 'sailing', 'sailor', 'beach'], lines: ['The sea was never far from {p} heart.'] },
  { w: ['farm', 'farmer', 'farming', 'ranch', 'tractor', 'harvest'], lines: ['{S} worked the land with patient hands, and fed more people than {s} ever knew.'] },
  { w: ['birds', 'bird', 'birdwatching', 'cardinals', 'robins', 'feeder'], lines: ['{S} knew the birds by their songs, and they seemed to know {o} too.'] },
  { w: ['books', 'reading', 'library', 'poetry', 'novels'], lines: ['{S} always had a book half-read and a story ready to share.'] },
  { w: ['cooking', 'baking', 'kitchen', 'pie', 'pies', 'bread', 'recipes'], lines: ['{P} kitchen was the warmest room in any house.'] },
  { w: ['stars', 'stargazing', 'constellations', 'telescope'], lines: ['{S} never tired of the night sky, and taught others to look up.'] },
  { w: ['travel', 'traveled', 'travelled', 'traveling'], lines: ['{S} went out to meet the world, and brought it home in stories.'] },
  { w: ['teacher', 'taught', 'teaching'], lines: ['{S} taught, and {p} lessons are still being carried.'] },
  { w: ['nurse', 'nursing', 'doctor', 'caring'], lines: ['{S} spent a lifetime caring for others, gently and without fuss.'] },
  { w: ['laugh', 'laughter', 'jokes', 'joke', 'funny'], lines: ['{P} laugh could fill a room and stay there for days.'] },
  { w: ['dog', 'dogs', 'cat', 'cats', 'horses'], lines: ['Every animal {s} met seemed to trust {o} at once.'] }
];
function hsLifePoem(form, an, mo, sceneId) {
  var rng = hsRng(mo.seed ^ 0x5bd1e995);
  var pick = function (arr) { return arr[Math.floor(rng() * arr.length) % arr.length]; };
  var story = String(form.story || '').toLowerCase(), all = (story + ' ' + String(form.theme || '')).toLowerCase();
  var words = all.match(/[a-z']+/g) || [];
  var cnt = function (w) { return words.filter(function (x) { return x === w; }).length; };
  var fem = cnt('she') + cnt('her') + cnt('hers'), masc = cnt('he') + cnt('him') + cnt('his');
  if (an.roles.some(function (r) { return /Mother|Wife|Grandmother/.test(r); })) fem += 3;
  if (an.roles.some(function (r) { return /Father|Husband|Grandfather/.test(r); })) masc += 3;
  var g = fem > masc ? 'f' : masc > fem ? 'm' : 'n';
  var P = { f: { S: 'She', s: 'she', o: 'her', p: 'her', P: 'Her' }, m: { S: 'He', s: 'he', o: 'him', p: 'his', P: 'His' }, n: { S: 'They', s: 'they', o: 'them', p: 'their', P: 'Their' } }[g];
  var fill = function (t) { return t.replace(/\{S\}/g, P.S).replace(/\{s\}/g, P.s).replace(/\{o\}/g, P.o).replace(/\{p\}/g, P.p).replace(/\{P\}/g, P.P).replace(/\{was\}/g, g === 'n' ? 'were' : 'was'); };
  var name = hsNameParts(form.name).first || 'They';
  var b = hsParseDate(form.born), d = hsParseDate(form.passed), age = 0;
  if (b && d) { age = d.y - b.y - ((d.m < b.m || (d.m === b.m && d.d < b.d)) ? 1 : 0); }
  var lines = [];
  /* opening: about the life, not the loss */
  var seasonWord = { spring: 'springs', summer: 'summers', autumn: 'autumns', winter: 'winters' }[mo.season];
  var openers = [];
  if (age > 1) {
    var aw = hsNumWord(age); aw = aw.charAt(0).toUpperCase() + aw.slice(1);
    openers.push(aw + ' ' + seasonWord + ', and ' + name + ' made each one count.');
    openers.push(aw + ' years, lived with an open heart and a generous hand.');
  }
  openers.push(name + ' had a way of turning every day into something worth keeping.');
  openers.push(name + ' filled every room with warmth, and left it brighter than before.');
  lines.push(fill(pick(openers)));
  /* family */
  var fam = [], re = /(great-grandmother|great-grandfather|grandmother|grandfather|mother|father) of (\w+)/g, m;
  while ((m = re.exec(story))) fam.push({ role: m[1], n: m[2] });
  if (fam.length) {
    var famTxt = fam.slice(0, 2).map(function (f) { return 'a ' + f.role + ' of ' + f.n; }).join(' and ');
    lines.push(famTxt.charAt(0).toUpperCase() + famTxt.slice(1) + fill(', {s} {was} the heart of every table.'));
  } else if (an.roles.length) {
    var rl = an.roles.filter(function (r) { return !/Wife|Husband/.test(r); });
    if (rl.length) lines.push(fill('To the ones who called {o} ' + rl.join(' and ') + ', {s} {was} the heart of every table.'));
    else lines.push(fill('{S} loved one person for a lifetime, and it showed.'));
  }
  /* what they loved, in the order the family told it */
  var loves = HS_POEM_LOVES.map(function (L) {
    var at = -1; L.w.forEach(function (w) { var i = words.indexOf(w); if (i >= 0 && (at < 0 || i < at)) at = i; });
    return { L: L, at: at };
  }).filter(function (x) { return x.at >= 0; }).sort(function (a, c) { return a.at - c.at; });
  var used = 0;
  loves.forEach(function (x) { if (used < 2) { lines.push(fill(pick(x.L.lines))); used++; } });
  if (!used && an.veteran) { lines.push(fill('{S} served with quiet courage, and came home to serve everyone else.')); used++; }
  if (!used) lines.push(fill('{S} gave {p} time freely, and people never forgot it.'));
  /* closing: gentle, rooted in this place and moment */
  var when = { morning: mo.season + ' morning', afternoon: mo.season + ' afternoon', evening: mo.season + ' evening', night: mo.season + ' night' }[mo.tod];
  var closers = [
    'May every ' + mo.season + ' here carry something of ' + P.p + ' light.',
    fill('{P} light carries on in everyone {s} loved.'),
    'Let this ' + when + ' hold ' + P.o + ' gently.',
    fill('The light here is warm, the way {s} always {was}.')
  ];
  if (mo.tod === 'night') closers = ['Let the stars keep watch, the way ' + P.s + ' always did.', 'Let this ' + when + ' hold ' + P.o + ' gently.', fill('{P} light carries on, bright as any star.')];
  lines.push(fill(pick(closers)));
  return lines.join('\n');
}

