var HS_SYMBOLS = (function () {
  var petals = '';
  for (var i = 0; i < 5; i++) {
    var a = -Math.PI / 2 + i * 2 * Math.PI / 5;
    petals += hsCirc(50 + 24 * Math.cos(a), 50 + 24 * Math.sin(a), 15) + ' ';
  }
  var rays = '';
  for (var j = 1; j <= 5; j++) {
    var b = Math.PI + j * Math.PI / 6;
    rays += 'M' + hsR(50 + 30 * Math.cos(b)) + ' ' + hsR(72 + 30 * Math.sin(b)) + ' L' + hsR(50 + 42 * Math.cos(b)) + ' ' + hsR(72 + 42 * Math.sin(b)) + ' ';
  }
  var spokes = '';
  for (var k = 0; k < 8; k++) {
    var c = k * Math.PI / 4;
    spokes += 'M' + hsR(50 + 11 * Math.cos(c)) + ' ' + hsR(50 + 11 * Math.sin(c)) + ' L' + hsR(50 + 38 * Math.cos(c)) + ' ' + hsR(50 + 38 * Math.sin(c)) + ' ';
    spokes += 'M' + hsR(50 + 38 * Math.cos(c)) + ' ' + hsR(50 + 38 * Math.sin(c)) + ' L' + hsR(50 + 45 * Math.cos(c)) + ' ' + hsR(50 + 45 * Math.sin(c)) + ' ';
  }
  return [
    { id: 'cross', label: 'Cross', short: 'Cross', mode: 'fill', d: 'M44 6 H56 V30 H78 V42 H56 V94 H44 V42 H22 V30 H44 Z' },
    { id: 'celtic', label: 'Celtic cross', short: 'Celtic', mode: 'stroke', sw: 6, d: 'M50 6 V94 M24 36 H76 ' + hsCirc(50, 36, 15) },
    { id: 'david', label: 'Star of David', short: 'David', mode: 'stroke', sw: 5, d: 'M50 10 L86 72 H14 Z M50 90 L14 28 H86 Z' },
    { id: 'crescent', label: 'Crescent and star', short: 'Crescent', mode: 'fill', d: 'M60 14 A40 40 0 1 0 60 90 A46 46 0 0 1 60 14 Z ' + hsStar(80, 40, 12, 5, 5) },
    { id: 'wheel', label: 'Dharma wheel', short: 'Wheel', mode: 'stroke', sw: 5, d: hsCirc(50, 50, 38) + ' ' + hsCirc(50, 50, 11) + ' ' + spokes },
    { id: 'lotus', label: 'Lotus', short: 'Lotus', mode: 'fill', d: 'M50 18 C61 36 61 60 50 76 C39 60 39 36 50 18 Z M48 78 C33 74 21 60 18 40 C32 46 44 58 48 78 Z M52 78 C67 74 79 60 82 40 C68 46 56 58 52 78 Z M46 82 C30 84 15 78 6 64 C22 62 38 68 46 82 Z M54 82 C70 84 85 78 94 64 C78 62 62 68 54 82 Z' },
    { id: 'dove', label: 'Dove', short: 'Dove', mode: 'fill', d: 'M10 56 L26 58 C34 54 44 52 52 52 C48 40 42 26 36 14 C52 20 64 34 70 46 C74 42 80 40 86 42 L92 46 L86 48 C84 58 76 66 62 70 C50 74 38 72 28 66 L12 68 L20 62 Z' },
    { id: 'heart', label: 'Heart', short: 'Heart', mode: 'fill', d: 'M50 88 C22 68 8 52 8 34 C8 20 19 10 32 10 C40 10 46 15 50 22 C54 15 60 10 68 10 C81 10 92 20 92 34 C92 52 78 68 50 88 Z' },
    { id: 'hearts', label: 'Two hearts', short: 'Hearts', mode: 'fill', d: 'M34 80 C16 66 6 55 6 42 C6 32 13 25 22 25 C28 25 32 28 34 33 C36 28 40 25 46 25 C55 25 62 32 62 42 C62 55 52 66 34 80 Z M66 78 C48 64 38 53 38 40 C38 30 45 23 54 23 C60 23 64 26 66 31 C68 26 72 23 78 23 C87 23 94 30 94 40 C94 53 84 64 66 78 Z' },
    { id: 'blossom', label: 'Blossom', short: 'Blossom', mode: 'fill', d: petals + hsCirc(50, 50, 9) },
    { id: 'tree', label: 'Tree of life', short: 'Tree', mode: 'stroke', sw: 4, d: hsCirc(50, 50, 44) + ' M50 80 V52 M50 66 L32 48 M50 66 L68 48 M50 56 L36 34 M50 56 L64 34 M50 54 V20 M32 48 L20 46 M68 48 L80 46 M36 34 L30 22 M64 34 L70 22 M50 80 L38 90 M50 80 L62 90 M50 80 V92' },
    { id: 'anchor', label: 'Anchor', short: 'Anchor', mode: 'stroke', sw: 5, d: 'M56 16 A6 6 0 1 1 44 16 A6 6 0 1 1 56 16 M50 22 V88 M34 34 H66 M18 60 Q22 86 50 88 Q78 86 82 60 M12 66 L18 58 L26 64 M88 66 L82 58 L74 64' },
    { id: 'sunrise', label: 'Sunrise', short: 'Sunrise', mode: 'stroke', sw: 4.5, d: 'M8 72 H92 M28 72 A22 22 0 0 1 72 72 ' + rays + 'M22 84 H78 M36 94 H64' },
    { id: 'mountains', label: 'Mountains', short: 'Mountains', mode: 'stroke', sw: 4.5, d: 'M6 84 L36 38 L50 58 L64 32 L94 84 Z M28.5 50 L34 55 L38 50 L44 54 ' + hsCirc(78, 20, 7) },
    { id: 'star', label: 'Star', short: 'Star', mode: 'fill', d: hsStar(50, 54, 44, 18, 5) },
    { id: 'temple', label: 'Temple spire', short: 'Temple', mode: 'fill', d: 'M14 94 H86 V76 H76 V60 L70 49 L64 60 V76 H56 V40 L50 17 L44 40 V76 H36 V60 L30 49 L24 60 V76 H14 Z ' + hsCirc(50, 10, 3.6) },
    { id: 'orthodox', label: 'Orthodox cross', short: 'Orthodox', mode: 'stroke', sw: 7, d: 'M50 6 V94 M38 20 H62 M22 38 H78 M34 74 L66 62' },
    { id: 'khanda', label: 'Khanda', short: 'Khanda', mode: 'stroke', sw: 4.5, d: 'M50 6 L50 80 M44 16 L50 6 L56 16 M43 74 H57 ' + hsCirc(50, 50, 17) + ' M31 20 Q10 50 31 80 M69 20 Q90 50 69 80 M26 76 L38 86 M74 76 L62 86' },
    { id: 'ninestar', label: 'Nine-pointed star', short: 'Nine-star', mode: 'fill', d: hsStar(50, 50, 45, 27, 9) },
    { id: 'yinyang', label: 'Yin and yang', short: 'Yin yang', mode: 'stroke', sw: 4.5, d: hsCirc(50, 50, 40) + ' M50 10 A20 20 0 0 1 50 50 A20 20 0 0 0 50 90 ' + hsCirc(50, 30, 5) + ' ' + hsCirc(50, 70, 5) }
  ];
})();
function hsSymLabel(id) { return hsFind(HS_SYMBOLS, id).label; }

