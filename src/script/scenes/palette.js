/* ---------- mood palette: season + time of day over the chosen setting ---------- */
function hsPalette(sc, tod, season) {
  var p = Object.assign({}, sc);
  var green = HS_SCENES.meadow;
  if (season === 'spring') {
    p.leaf1 = '#e3b2bf'; p.leaf2 = '#f4d7de'; p.leaf3 = '#c08c9c';
    p.g1 = hsMix(sc.g1, '#b6cd90', 0.25); p.grass = hsMix(sc.grass, '#7d9c58', 0.2);
  } else if (season === 'summer') {
    p.leaf1 = green.leaf1; p.leaf2 = green.leaf2; p.leaf3 = green.leaf3;
  } else if (season === 'winter') {
    p.leaf1 = '#4f6a55'; p.leaf2 = '#6f8a72'; p.leaf3 = '#3f5646'; p.trunk = '#6b5b50';
    p.g1 = '#eef1f3'; p.g2 = '#d3dbe2'; p.grass = '#9a9272';
    p.h1 = hsMix(sc.h1, '#e3e7ed', 0.72); p.h2 = hsMix(sc.h2, '#eaedf0', 0.74);
    p.mt1 = hsMix(sc.mt1, '#dfe4ea', 0.35); p.mt2 = hsMix(sc.mt2, '#e6eaee', 0.45);
    p.w1 = hsMix(sc.w1, '#dde8ef', 0.35); p.w2 = hsMix(sc.w2, '#c9d9e3', 0.3);
    p.sky1 = hsMix(sc.sky1, '#d3deea', 0.45); p.sky2 = hsMix(sc.sky2, '#efebe8', 0.4); p.sky3 = hsMix(sc.sky3, '#f5f1ec', 0.3);
  } else if (season === 'autumn') {
    p.leaf1 = hsMix('#c98d4c', sc.leaf1, 0.12); p.leaf2 = hsMix('#e3b46a', sc.leaf2, 0.1); p.leaf3 = hsMix('#9a5d36', sc.leaf3, 0.12);
    p.g1 = hsMix(sc.g1, '#c7b57c', 0.38); p.g2 = hsMix(sc.g2, '#9e8e58', 0.38); p.grass = hsMix(sc.grass, '#8f8347', 0.42);
    p.h1 = hsMix(sc.h1, '#d4c090', 0.3); p.h2 = hsMix(sc.h2, '#c9ad76', 0.36);
  }
  if (tod === 'morning') {
    ['h1', 'h2', 'g1', 'g2', 'mt1', 'mt2', 'w1', 'w2', 'leaf1', 'leaf2', 'leaf3', 'grass', 'trunk'].forEach(function (k2) { p[k2] = hsMix(p[k2], '#e4ebe8', 0.12); });
    p.sky1 = hsMix(p.sky1, '#dce8ef', 0.45); p.sky2 = hsMix(p.sky2, '#f6e9df', 0.45); p.sky3 = hsMix(p.sky3, '#fbf1e4', 0.4);
    p.sun = '#fff4d8'; p.sunDisc = '#fffaf0'; p.cloud = '#ffffff'; p.tint = '#eaf1f2'; p.tintOp = 0.1;
  } else if (tod === 'evening') {
    ['h1', 'mt1', 'mt2', 'w1'].forEach(function (k2) { p[k2] = hsMix(p[k2], '#9c8ca6', 0.3); });
    ['h2', 'w2', 'leaf2'].forEach(function (k2) { p[k2] = hsMix(p[k2], '#a08a8e', 0.18); });
    ['g1', 'g2', 'leaf1', 'leaf3', 'grass', 'trunk'].forEach(function (k2) { p[k2] = hsMix(p[k2], season === 'winter' ? '#8a84a2' : '#6e6048', season === 'winter' ? 0.16 : 0.12); });
    p.sky1 = hsMix('#b7b3d0', sc.sky1, 0.2); p.sky2 = hsMix('#efc9ac', sc.sky2, 0.15); p.sky3 = hsMix('#f7d9b0', sc.sky3, 0.1);
    p.sun = '#ffc78a'; p.sunDisc = '#ffe3b4'; p.cloud = '#fbe0d0'; p.tint = '#f3a36a'; p.tintOp = 0.1;
  } else if (tod === 'night') {
    var nt = season === 'winter' ? '#7d8fb8' : '#27324f';
    ['h1', 'mt1', 'mt2'].forEach(function (k2) { p[k2] = hsMix(p[k2], '#2e3a5e', 0.58); });
    ['h2', 'w1', 'w2'].forEach(function (k2) { p[k2] = hsMix(p[k2], '#2a3558', 0.52); });
    ['g1', 'g2'].forEach(function (k2) { p[k2] = hsMix(p[k2], nt, season === 'winter' ? 0.42 : 0.5); });
    ['leaf1', 'leaf2', 'leaf3', 'grass', 'trunk'].forEach(function (k2) { p[k2] = hsMix(p[k2], '#26304c', 0.5); });
    p.sky1 = '#0c1530'; p.sky2 = '#1d2b54'; p.sky3 = '#3d4677';
    p.sun = '#b9c8f5'; p.sunDisc = '#f4f0e2'; p.cloud = '#56618c'; p.tint = '#18234a'; p.tintOp = 0.12;
  } else {
    p.sun = '#ffe9bf'; p.sunDisc = '#fff8e6'; p.cloud = '#ffffff'; p.tint = '#ffd9a0'; p.tintOp = 0.05;
  }
  return p;
}

