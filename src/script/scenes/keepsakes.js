/* ---------- keepsakes: little painted things from their story ---------- */
function hsCabin(x, y, s, glow) {
  return [
    { d: 'M' + hsP(x - 26 * s) + ' ' + hsP(y) + ' L' + hsP(x - 25 * s) + ' ' + hsP(y - 23 * s) + ' L' + hsP(x) + ' ' + hsP(y - 43 * s) + ' L' + hsP(x + 26 * s) + ' ' + hsP(y - 24 * s) + ' L' + hsP(x + 26 * s) + ' ' + hsP(y) + ' Z', c: '#b48a67' },
    { d: hsRectD(x - 12 * s, y - 29 * s, x + 12 * s, y - 27 * s) + hsRectD(x - 6 * s, y - 36 * s, x + 6 * s, y - 34 * s), c: '#caa482' },
    { d: hsRectD(x - 25 * s, y - 20 * s, x - 2 * s, y - 17.5 * s) + hsRectD(x - 25 * s, y - 11 * s, x - 2 * s, y - 8.5 * s), c: '#caa482' },
    { d: 'M' + hsP(x + 11 * s) + ' ' + hsP(y - 36 * s) + ' V' + hsP(y - 52 * s) + ' H' + hsP(x + 19 * s) + ' V' + hsP(y - 30 * s) + ' Z', c: '#8a6a58' },
    { d: 'M' + hsP(x - 33 * s) + ' ' + hsP(y - 24 * s) + ' L' + hsP(x) + ' ' + hsP(y - 47 * s) + ' L' + hsP(x + 33 * s) + ' ' + hsP(y - 25 * s) + ' L' + hsP(x + 30 * s) + ' ' + hsP(y - 21 * s) + ' L' + hsP(x) + ' ' + hsP(y - 41 * s) + ' L' + hsP(x - 30 * s) + ' ' + hsP(y - 20 * s) + ' Z', c: '#6f5143' },
    { d: hsRectD(x - 14 * s, y - 15 * s, x - 5 * s, y), c: '#5c4436' },
    { d: hsRectD(x + 7 * s, y - 18 * s, x + 18 * s, y - 9 * s), c: glow ? '#ffd98a' : '#e6d8bd' }
  ];
}
function hsWorship(kind, x, y, s, glow) {
  var P = function (a, b) { return hsP(x + a * s) + ' ' + hsP(y + b * s); };
  var win = glow ? '#f7cf86' : '#8e8170';
  if (kind === 'synagogue') return [
    { d: 'M' + P(-30, 0) + ' L' + P(-30, -38) + ' L' + P(30, -38) + ' L' + P(30, 0) + ' Z', c: '#e2d7c4' },
    { d: 'M' + P(-34, -37) + ' L' + P(0, -52) + ' L' + P(34, -37) + ' Z', c: '#a8987f' },
    { d: 'M' + P(-18, 0) + ' L' + P(-18, -16) + ' Q' + P(-18, -24) + ' ' + P(-10, -24) + ' Q' + P(-2, -24) + ' ' + P(-2, -16) + ' L' + P(-2, 0) + ' Z M' + P(6, -10) + ' L' + P(6, -22) + ' Q' + P(12, -30) + ' ' + P(18, -22) + ' L' + P(18, -10) + ' Z', c: win },
    { d: 'M' + P(0, -66) + ' L' + P(-6, -55.5) + ' L' + P(6, -55.5) + ' Z M' + P(0, -52) + ' L' + P(-6, -62.5) + ' L' + P(6, -62.5) + ' Z', c: '#c9a24a' }
  ];
  if (kind === 'mosque') return [
    { d: 'M' + P(31, 0) + ' L' + P(31, -62) + ' L' + P(34, -70) + ' L' + P(37, -62) + ' L' + P(37, 0) + ' Z', c: '#ddd2bf' },
    { d: 'M' + P(29.5, -46) + ' H' + P(38.5, -46).split(' ')[0] + ' V' + hsP(y - 43 * s) + ' H' + hsP(x + 29.5 * s) + ' Z', c: '#a8987f' },
    { d: 'M' + P(-26, 0) + ' L' + P(-26, -24) + ' L' + P(26, -24) + ' L' + P(26, 0) + ' Z', c: '#e6dccb' },
    { d: 'M' + P(-17, -24) + ' Q' + P(-17, -44) + ' ' + P(0, -46) + ' Q' + P(17, -44) + ' ' + P(17, -24) + ' Z', c: '#9fb8ae' },
    { d: 'M' + P(-8, 0) + ' L' + P(-8, -10) + ' Q' + P(0, -18) + ' ' + P(8, -10) + ' L' + P(8, 0) + ' Z', c: win },
    { d: 'M' + P(2.5, -58) + ' A' + hsP(5 * s) + ' ' + hsP(5 * s) + ' 0 1 0 ' + P(2.5, -50) + ' A' + hsP(3.8 * s) + ' ' + hsP(3.8 * s) + ' 0 1 1 ' + P(2.5, -58) + ' Z M' + P(-0.6, -46) + ' L' + P(-0.6, -51) + ' L' + P(0.6, -51) + ' L' + P(0.6, -46) + ' Z', c: '#c9a24a' }
  ];
  if (kind === 'pagoda') return [
    { d: 'M' + P(-17, 0) + ' L' + P(-17, -16) + ' L' + P(17, -16) + ' L' + P(17, 0) + ' Z M' + P(-12, -26) + ' L' + P(-12, -36) + ' L' + P(12, -36) + ' L' + P(12, -26) + ' Z M' + P(-8, -44) + ' L' + P(-8, -52) + ' L' + P(8, -52) + ' L' + P(8, -44) + ' Z', c: '#dcc9a9' },
    { d: 'M' + P(-30, -15) + ' Q' + P(-20, -19) + ' ' + P(-15, -27) + ' L' + P(15, -27) + ' Q' + P(20, -19) + ' ' + P(30, -15) + ' Z M' + P(-23, -35) + ' Q' + P(-15, -38) + ' ' + P(-11, -45) + ' L' + P(11, -45) + ' Q' + P(15, -38) + ' ' + P(23, -35) + ' Z M' + P(-16, -51) + ' Q' + P(-10, -54) + ' ' + P(-6, -60) + ' L' + P(6, -60) + ' Q' + P(10, -54) + ' ' + P(16, -51) + ' Z M' + P(-0.8, -60) + ' L' + P(-0.8, -72) + ' L' + P(0.8, -72) + ' L' + P(0.8, -60) + ' Z', c: '#7a5446' },
    { d: 'M' + P(-5, 0) + ' L' + P(-5, -9) + ' L' + P(5, -9) + ' L' + P(5, 0) + ' Z', c: win }
  ];
  if (kind === 'mandir') return [
    { d: 'M' + P(-26, 0) + ' L' + P(-26, -18) + ' L' + P(26, -18) + ' L' + P(26, 0) + ' Z', c: '#e3cfae' },
    { d: 'M' + P(-13, -18) + ' Q' + P(-15, -50) + ' ' + P(0, -72) + ' Q' + P(15, -50) + ' ' + P(13, -18) + ' Z', c: '#d6b98e' },
    { d: 'M' + P(-24, -18) + ' Q' + P(-24, -28) + ' ' + P(-17, -30) + ' Q' + P(-10, -28) + ' ' + P(-10, -18) + ' Z M' + P(-5, -72) + ' Q' + P(0, -76) + ' ' + P(5, -72) + ' Q' + P(0, -69) + ' ' + P(-5, -72) + ' Z', c: '#c6a576' },
    { d: 'M' + P(-0.6, -74) + ' L' + P(-0.6, -86) + ' L' + P(9, -82) + ' L' + P(0.6, -79) + ' L' + P(0.6, -74) + ' Z', c: '#d9853b' },
    { d: 'M' + P(-5, 0) + ' L' + P(-5, -9) + ' Q' + P(0, -14) + ' ' + P(5, -9) + ' L' + P(5, 0) + ' Z', c: win }
  ];
  var ch = hsChurch(x, y, s, glow);
  if (kind === 'chapel-plain') ch.splice(3, 1);
  return ch;
}
function hsFaithKind(form) {
  var f = form.faith;
  if (f === 'christian' || f === 'celtic') return 'chapel';
  if (f === 'jewish') return 'synagogue';
  if (f === 'muslim') return 'mosque';
  if (f === 'buddhist') return 'pagoda';
  if (f === 'hindu') return 'mandir';
  if (f) return 'chapel-plain';
  var t = (String(form.story || '') + ' ' + String(form.theme || '')).toLowerCase();
  if (/\b(synagogue|shul|rabbi|torah|jewish)\b/.test(t)) return 'synagogue';
  if (/\b(mosque|imam|quran|qur'an|ramadan|muslim)\b/.test(t)) return 'mosque';
  if (/\b(buddha|buddhist|monastery|meditation)\b/.test(t)) return 'pagoda';
  if (/\b(hindu|mandir|diwali|puja)\b/.test(t)) return 'mandir';
  return 'chapel';
}
var HS_WORSHIP_LABEL = { chapel: 'Churchyard', 'chapel-plain': 'Chapel', synagogue: 'Synagogue', mosque: 'Mosque', pagoda: 'Temple', mandir: 'Temple' };
function hsChurch(x, y, s, glow) {
  return [
    { d: 'M' + hsP(x - 34 * s) + ' ' + hsP(y) + ' V' + hsP(y - 26 * s) + ' L' + hsP(x - 10 * s) + ' ' + hsP(y - 42 * s) + ' L' + hsP(x + 14 * s) + ' ' + hsP(y - 26 * s) + ' V' + hsP(y) + ' Z', c: '#e4dac8' },
    { d: 'M' + hsP(x + 12 * s) + ' ' + hsP(y) + ' V' + hsP(y - 58 * s) + ' L' + hsP(x + 20 * s) + ' ' + hsP(y - 80 * s) + ' L' + hsP(x + 28 * s) + ' ' + hsP(y - 58 * s) + ' V' + hsP(y) + ' Z', c: '#d5c9b4' },
    { d: 'M' + hsP(x - 34 * s) + ' ' + hsP(y - 25 * s) + ' L' + hsP(x - 10 * s) + ' ' + hsP(y - 41 * s) + ' L' + hsP(x + 12 * s) + ' ' + hsP(y - 27 * s) + ' L' + hsP(x - 10 * s) + ' ' + hsP(y - 37 * s) + ' Z ' + 'M' + hsP(x + 12 * s) + ' ' + hsP(y - 57 * s) + ' L' + hsP(x + 20 * s) + ' ' + hsP(y - 80 * s) + ' L' + hsP(x + 21 * s) + ' ' + hsP(y - 75 * s) + ' L' + hsP(x + 14 * s) + ' ' + hsP(y - 57 * s) + ' Z', c: '#a8987f' },
    { d: hsRectD(x + 19.2 * s, y - 92 * s, x + 20.8 * s, y - 80 * s) + hsRectD(x + 16.5 * s, y - 88.5 * s, x + 23.5 * s, y - 87 * s), c: '#9b8b74' },
    { d: 'M' + hsP(x - 16 * s) + ' ' + hsP(y) + ' V' + hsP(y - 9 * s) + ' Q' + hsP(x - 12 * s) + ' ' + hsP(y - 14 * s) + ' ' + hsP(x - 8 * s) + ' ' + hsP(y - 9 * s) + ' V' + hsP(y) + ' Z ' +
      'M' + hsP(x + 17 * s) + ' ' + hsP(y - 36 * s) + ' V' + hsP(y - 44 * s) + ' Q' + hsP(x + 20 * s) + ' ' + hsP(y - 48 * s) + ' ' + hsP(x + 23 * s) + ' ' + hsP(y - 44 * s) + ' V' + hsP(y - 36 * s) + ' Z', c: glow ? '#f7cf86' : '#8e8170' }
  ];
}
function hsBarn(x, y, s) {
  return [
    { d: 'M' + hsP(x + 30 * s) + ' ' + hsP(y) + ' V' + hsP(y - 46 * s) + ' Q' + hsP(x + 38 * s) + ' ' + hsP(y - 56 * s) + ' ' + hsP(x + 46 * s) + ' ' + hsP(y - 46 * s) + ' V' + hsP(y) + ' Z', c: '#cfc6b3' },
    { d: 'M' + hsP(x - 30 * s) + ' ' + hsP(y) + ' V' + hsP(y - 28 * s) + ' L' + hsP(x - 18 * s) + ' ' + hsP(y - 42 * s) + ' L' + hsP(x + 18 * s) + ' ' + hsP(y - 42 * s) + ' L' + hsP(x + 30 * s) + ' ' + hsP(y - 28 * s) + ' V' + hsP(y) + ' Z', c: '#a8594a' },
    { d: 'M' + hsP(x - 32 * s) + ' ' + hsP(y - 27 * s) + ' L' + hsP(x - 19 * s) + ' ' + hsP(y - 44 * s) + ' L' + hsP(x + 19 * s) + ' ' + hsP(y - 44 * s) + ' L' + hsP(x + 32 * s) + ' ' + hsP(y - 27 * s) + ' L' + hsP(x + 30 * s) + ' ' + hsP(y - 25 * s) + ' L' + hsP(x + 18 * s) + ' ' + hsP(y - 40 * s) + ' L' + hsP(x - 18 * s) + ' ' + hsP(y - 40 * s) + ' L' + hsP(x - 30 * s) + ' ' + hsP(y - 25 * s) + ' Z', c: '#6b4a40' },
    { d: hsRectD(x - 10 * s, y - 20 * s, x + 10 * s, y), c: '#7f3f33' },
    { d: 'M' + hsP(x - 10 * s) + ' ' + hsP(y - 20 * s) + ' L' + hsP(x + 10 * s) + ' ' + hsP(y) + ' L' + hsP(x + 8.5 * s) + ' ' + hsP(y) + ' L' + hsP(x - 10 * s) + ' ' + hsP(y - 18.5 * s) + ' Z M' + hsP(x + 10 * s) + ' ' + hsP(y - 20 * s) + ' L' + hsP(x - 10 * s) + ' ' + hsP(y) + ' L' + hsP(x - 8.5 * s) + ' ' + hsP(y) + ' L' + hsP(x + 10 * s) + ' ' + hsP(y - 18.5 * s) + ' Z', c: '#efe4d2' }
  ];
}
function hsBench(x, y, s) {
  return [
    { d: hsRectD(x - 28 * s, y - 13 * s, x - 25 * s, y) + hsRectD(x + 25 * s, y - 13 * s, x + 28 * s, y) + hsRectD(x - 27 * s, y - 30 * s, x - 24.5 * s, y - 13 * s) + hsRectD(x + 24.5 * s, y - 30 * s, x + 27 * s, y - 13 * s), c: '#5f4636' },
    { d: hsRectD(x - 31 * s, y - 16 * s, x + 31 * s, y - 12 * s) + hsRectD(x - 30 * s, y - 29 * s, x + 30 * s, y - 25.5 * s) + hsRectD(x - 30 * s, y - 23 * s, x + 30 * s, y - 19.5 * s), c: '#8b6a4f' },
    { d: hsRectD(x - 31 * s, y - 16 * s, x + 31 * s, y - 15 * s) + hsRectD(x - 30 * s, y - 29 * s, x + 30 * s, y - 28 * s), c: '#b08f6c' }
  ];
}
function hsBirdhouse(x, y, s) {
  return [
    { d: hsRectD(x - 2 * s, y - 56 * s, x + 2 * s, y), c: '#6a5244' },
    { d: 'M' + hsP(x - 10 * s) + ' ' + hsP(y - 54 * s) + ' V' + hsP(y - 72 * s) + ' L' + hsP(x) + ' ' + hsP(y - 81 * s) + ' L' + hsP(x + 10 * s) + ' ' + hsP(y - 72 * s) + ' V' + hsP(y - 54 * s) + ' Z', c: '#c9a37d' },
    { d: 'M' + hsP(x - 13 * s) + ' ' + hsP(y - 70 * s) + ' L' + hsP(x) + ' ' + hsP(y - 84 * s) + ' L' + hsP(x + 13 * s) + ' ' + hsP(y - 70 * s) + ' L' + hsP(x + 11 * s) + ' ' + hsP(y - 68 * s) + ' L' + hsP(x) + ' ' + hsP(y - 80 * s) + ' L' + hsP(x - 11 * s) + ' ' + hsP(y - 68 * s) + ' Z', c: '#7a5546' },
    { d: hsCirc(x, y - 64 * s, 2.8 * s) + ' ' + hsRectD(x - 0.6 * s, y - 60 * s, x + 0.6 * s, y - 57 * s), c: '#3f3129' }
  ];
}

