var HS_QUOTE_SUGGEST = {
  general: ['Forever in our hearts', 'Always loved, never forgotten', 'Love lives on', 'Until we meet again', 'Loved beyond words, missed beyond measure'],
  christian: ['The Lord is my shepherd', 'Well done, good and faithful servant', 'Safe in the arms of Jesus'],
  catholic: ['Eternal rest grant unto them, O Lord', 'The Lord is my shepherd'],
  jewish: ['May their memory be a blessing'],
  garden: ['Loved and tended, like the garden', 'In every bloom, we see you'],
  sea: ['Fair winds and following seas'],
  mountains: ['The mountains are calling'],
  family: ['A life of love, a family forever grateful']
};
function hsSuggestQuotes(form, an) {
  var pool = [], add = function (k) { (HS_QUOTE_SUGGEST[k] || []).forEach(function (q) { if (pool.indexOf(q) < 0) pool.push(q); }); };
  var fs = String((an && an.faith && an.faith.sym) || ''), st = String(form.story || '') + ' ' + String(form.theme || '');
  if (/jew|star of david|menorah/i.test(form.faith || '') || fs === 'david') add('jewish');
  if (/catholic/i.test(form.faith || '')) add('catholic');
  if (/christ|baptist|methodist|luther|church|faith/i.test(form.faith || '') || fs === 'cross') add('christian');
  if (/garden|flower|rose|bloom/i.test(st)) add('garden');
  if (/sea|ocean|sail|navy|boat/i.test(st)) add('sea');
  if (/mountain|hik|trail|peak/i.test(st)) add('mountains');
  if (an && an.roles && an.roles.length > 1) add('family');
  add('general');
  return pool.slice(0, 3);
}
function hsContentFrom(form, an, photos) {
  var byId = {};
  photos = hsPhotoSet(form, photos);
  photos.forEach(function (p) { byId[p.id] = p; });
  var partner = form.who === 'two' && form.pair !== 'matching' && String(form.name2 || '').trim() ? { np: hsNameParts(form.name2), born: hsParseDate(form.born2), passed: hsParseDate(form.passed2) || (hsPassedLater(form, 2) ? HS_RESV_DATE : null) } : null;
  /* Their own words are used as they gave them, with nothing added. Left blank, the designs offer gentle
     suggestions; and when they'd rather have no words at all, the stone keeps to names and dates. */
  var own = (form.quotes || []).map(hsCleanQuote).filter(Boolean), none = !!form.noQuotes;
  return { np: hsNameParts(form.name), born: hsParseDate(form.born), passed: hsParseDate(form.passed) || (hsPassedLater(form, 1) ? HS_RESV_DATE : null), partner: partner,
    quotes: none ? [] : own.length ? own : hsSuggestQuotes(form, an), quotesOwn: !none && own.length > 0, quotesSuggested: !none && !own.length, noWords: none,
    extraOk: !none && !own.length, roleLine: an.roleLine, veteran: an.veteran, photoById: byId, photos: photos || [] };
}

