var HS_MOTIF_RULES = [
  { sym: 'cross', faith: true, words: ['church', 'faith', 'faithful', 'god', 'jesus', 'christ', 'lord', 'heaven', 'pray', 'prayer', 'prayed', 'bible', 'catholic', 'christian', 'choir', 'pastor', 'deacon', 'blessed', 'savior', 'amen', 'sunday'] },
  { sym: 'celtic', faith: true, words: ['irish', 'ireland', 'celtic', 'scotland', 'scottish', 'gaelic'] },
  { sym: 'david', faith: true, words: ['jewish', 'judaism', 'synagogue', 'shalom', 'hebrew', 'torah', 'rabbi', 'mitzvah'] },
  { sym: 'crescent', faith: true, words: ['muslim', 'islam', 'islamic', 'mosque', 'allah', 'quran', 'ramadan'] },
  { sym: 'temple', faith: true, weight: 4, words: ['mormon', 'mormons', 'lds', 'latter-day', 'latter day', 'latter-day saint', 'latter-day saints', 'latter day saints', 'moroni', 'book of mormon', 'sealed in the temple'] },
  { sym: 'orthodox', faith: true, weight: 4, words: ['orthodox christian', 'greek orthodox', 'russian orthodox', 'eastern orthodox', 'serbian orthodox', 'ukrainian orthodox', 'coptic', 'orthodox church', 'orthodox'] },
  { sym: 'khanda', faith: true, weight: 4, words: ['sikh', 'sikhs', 'sikhism', 'gurdwara', 'waheguru', 'khalsa', 'guru nanak'] },
  { sym: 'ninestar', faith: true, weight: 4, words: ['bahai', "baha'i", 'bahá’í', 'bahá’u’lláh', 'bahaullah'] },
  { sym: 'yinyang', faith: true, weight: 4, words: ['taoist', 'taoism', 'daoist', 'daoism', 'tao', 'dao', 'yin yang', 'yin and yang'] },
  { sym: 'wheel', faith: true, words: ['buddhist', 'buddhism', 'buddha', 'dharma', 'meditation', 'zen', 'sangha'] },
  { sym: 'lotus', faith: true, words: ['hindu', 'hinduism', 'lotus', 'yoga', 'diwali'] },
  { sym: 'blossom', words: ['garden', 'gardens', 'gardening', 'gardener', 'flower', 'flowers', 'rose', 'roses', 'bloom', 'blooms', 'blossom', 'tulip', 'tulips', 'lily', 'lilies', 'daisy', 'daisies', 'orchid', 'orchids', 'peony', 'peonies'] },
  { sym: 'tree', words: ['tree', 'trees', 'forest', 'woods', 'roots', 'family', 'grandchildren', 'grandkids', 'generations', 'oak', 'orchard', 'legacy'] },
  { sym: 'anchor', words: ['sea', 'ocean', 'navy', 'sailor', 'sailing', 'sailed', 'boat', 'boats', 'fishing', 'fisherman', 'harbor', 'coast', 'coastal', 'beach', 'marine', 'marines', 'captain'] },
  { sym: 'mountains', words: ['mountain', 'mountains', 'hike', 'hiking', 'hiker', 'camping', 'outdoors', 'trail', 'trails', 'ski', 'skiing', 'climb', 'climbing', 'cabin', 'lake', 'lakeside', 'wilderness', 'rockies', 'cascades'] },
  { sym: 'sunrise', words: ['sunrise', 'sunset', 'sunsets', 'sunshine', 'morning', 'mornings', 'dawn', 'farm', 'farmer', 'farming', 'ranch', 'rancher', 'fields', 'prairie'] },
  { sym: 'hearts', words: ['husband', 'wife', 'married', 'marriage', 'sweetheart', 'soulmate', 'devoted', 'anniversary'] },
  { sym: 'dove', words: ['peace', 'peaceful', 'gentle', 'dove', 'spirit', 'kindness', 'grace', 'calm'] },
  { sym: 'star', words: ['star', 'stars', 'sky', 'night', 'astronomy', 'shine', 'shining', 'bright', 'telescope'] },
  { sym: 'heart', weight: 0.5, words: ['heart', 'caring', 'compassion', 'love', 'loved', 'loving'] }
];

/* A faith typed in "Something else" is matched to its symbol, even when it isn't one of the listed choices. */
var HS_FAITH_NAMES = { temple: 'Latter-day Saint', orthodox: 'Orthodox Christian', khanda: 'Sikh', ninestar: 'Bahá’í', yinyang: 'Taoist', cross: 'Christian', celtic: 'Celtic Christian', david: 'Jewish', crescent: 'Muslim', wheel: 'Buddhist', lotus: 'Hindu' };
function hsFaithGuess(text) {
  var t = String(text || '').toLowerCase(); if (!t.trim()) return null;
  var best = null;
  HS_MOTIF_RULES.forEach(function (r) {
    if (!r.faith) return;
    var n = 0; r.words.forEach(function (w) { n += hsCount(t, w); });
    if (n && (!best || n * (r.weight || 1) > best.n)) best = { sym: r.sym, n: n * (r.weight || 1) };
  });
  return best ? { sym: best.sym, label: hsSymLabel(best.sym), faith: HS_FAITH_NAMES[best.sym] || '' } : null;
}

var HS_PREF_SHAPES = [
  ['heart', ['heart-shaped', 'heart shape', 'heart shaped']],
  ['flat', ['modern', 'simple', 'minimal', 'minimalist', 'clean', 'contemporary']],
  ['gothic', ['gothic', 'cathedral', 'old world', 'peaked']],
  ['arch', ['elegant', 'soft', 'romantic', 'rounded', 'oval', 'gentle', 'peaceful', 'loving', 'warm']],
  ['roof', ['strong', 'steady', 'sturdy']],
  ['serp', ['classic', 'traditional', 'timeless', 'serpentine']]
];
var HS_PREF_TYPES = [['grass', ['flat marker', 'grass marker', 'flush', 'flat grass marker', 'ground marker', 'lawn marker']], ['bevel', ['bevel', 'beveled']], ['pillow', ['pillow']], ['slant', ['slant', 'slanted']], ['upright', ['upright', 'standing']]];
var HS_PREF_MATS = [['black', ['black', 'jet']], ['gray', ['gray', 'grey', 'silver']], ['red', ['red', 'rose granite', 'pink']], ['pearl', ['blue', 'pearl']], ['mahogany', ['brown', 'mahogany']]];
var HS_PREF_FONTS = [['script', ['script', 'cursive', 'handwritten', 'calligraphy', 'elegant', 'loving', 'joyful', 'playful']], ['block', ['block', 'bold', 'sans', 'modern', 'strong']], ['gothic', ['old english', 'blackletter', 'gothic', 'celtic', 'old world']], ['garamond', ['warm', 'homey', 'gentle', 'peaceful']], ['roman', ['roman', 'classic', 'traditional', 'timeless', 'steady']]];
var HS_PREF_CARVES = [['gold', ['gold', 'gilded']], ['laser', ['laser', 'etched', 'etching']], ['frost', ['frosted', 'frost']], ['relief', ['raised', 'sculpted']]];

/* "The feeling" is about mood and meaningful places; concrete stone choices live on the "Details in mind" step. */
var HS_FEEL_CHIPS = ['Peaceful', 'Timeless', 'Gentle & loving', 'Joyful & bright', 'Strong & steady', 'Elegant', 'Warm & homey', 'Modern & simple', 'Faith-filled', 'Playful'];
var HS_PLACE_CHIPS = ['Garden & flowers', 'Mountains & trails', 'By the sea', 'Lakeside & cabin', 'Countryside & farm', 'Forest & trees', 'Under the stars', 'Church & chapel', 'Irish & Celtic roots'];
var HS_THEME_CHIPS = HS_FEEL_CHIPS.concat(HS_PLACE_CHIPS);

function hsCount(text, word) {
  var re = new RegExp('\\b' + word.replace(/-/g, '\\-').replace(/ /g, '\\s+') + '\\b', 'g');
  return (text.match(re) || []).length;
}

