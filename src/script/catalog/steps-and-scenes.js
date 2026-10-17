var HS_GSTEPS = [
  { id: 'type', label: 'Stone type', title: 'Choose a stone type', sub: 'The overall form of the memorial. Some cemeteries only allow certain types, so it’s worth a quick check with them.' },
  { id: 'shape', label: 'Shape', title: 'Choose a shape', sub: 'The outline of the stone. Every stone type can use any of these shapes.' },
  { id: 'granite', label: 'Granite', title: 'Choose the granite', sub: 'The color of the stone. Darker granite shows lettering and portraits most clearly.' },
  { id: 'fonts', label: 'Typeface', title: 'Pick a typeface and the words', sub: 'The lettering style, how the dates read, and the words carved with them.' },
  { id: 'symbols', label: 'Symbols & photo', title: 'Symbols and photo', sub: 'Pick the carved symbols, and whether to place a portrait.' },
  { id: 'layout', label: 'Layout', title: 'Arrange the layout', sub: 'Where the name, dates and words sit on the stone, and how large they are.' },
  { id: 'finish', label: 'Finish', title: 'Surface and finish', sub: 'How the face of the stone feels, and how each part is carved, polished, gilded or painted.' }
];

var HS_SCENES = {
  meadow: { label: 'Meadow & oak', phrase: 'in an open meadow beneath an old oak', sky1: '#d4e1e5', sky2: '#f3eadb', sky3: '#f7f0e4', h1: '#c9d1b0', h2: '#b2c197', g1: '#a8b98b', g2: '#8a9e6d', leaf1: '#809b69', leaf2: '#a6bb8c', leaf3: '#627c51', petal: '#c4d2a6', trunk: '#7b6553', grass: '#6c8254', w1: '#b9d0da', w2: '#9fbccb', mt1: '#c3ccd3', mt2: '#aebab8' },
  garden: { label: 'Flower garden', phrase: 'in a flowering garden', sky1: '#dde6e9', sky2: '#f6ece1', sky3: '#f8f2e9', h1: '#cdd4ae', h2: '#b6c496', g1: '#adbe8c', g2: '#8fa46f', leaf1: '#e2b6c0', leaf2: '#f1d4da', leaf3: '#c797a4', petal: '#f0cbd3', trunk: '#7b6553', grass: '#6c8254', w1: '#b9d0da', w2: '#9fbccb', mt1: '#c3ccd3', mt2: '#aebab8' },
  mountains: { label: 'Mountain meadow', phrase: 'in a quiet mountain meadow', sky1: '#cadae4', sky2: '#eceeea', sky3: '#f4f0e7', h1: '#c1cdaa', h2: '#aabb91', g1: '#a1b585', g2: '#82986a', leaf1: '#728d5f', leaf2: '#95ae7e', leaf3: '#5b7349', petal: '#b3c69a', trunk: '#6f5b4b', grass: '#62794d', w1: '#b3cdd8', w2: '#96b6c6', mt1: '#b9c4ce', mt2: '#a3b2b2' },
  lake: { label: 'Lakeside', phrase: 'beside a still lake', sky1: '#cedde6', sky2: '#eeefea', sky3: '#f5f1e8', h1: '#c1cda8', h2: '#aab98f', g1: '#a0b385', g2: '#809769', leaf1: '#6f8b5d', leaf2: '#92ab7c', leaf3: '#58714a', petal: '#b2c49a', trunk: '#6f5b4b', grass: '#62794d', w1: '#b6d0db', w2: '#94b5c5', mt1: '#c7d0d9', mt2: '#b2bebf' },
  sea: { label: 'By the sea', phrase: 'on a grassy rise above the sea', sky1: '#cfdee6', sky2: '#f1f0ea', sky3: '#f6f1e8', h1: '#d3caa9', h2: '#cfc8a5', g1: '#bcbd96', g2: '#9d9f76', leaf1: '#809b69', leaf2: '#a6bb8c', leaf3: '#627c51', petal: '#ece5d2', trunk: '#7b6553', grass: '#7c7f55', w1: '#b3cdd8', w2: '#90b3c4', mt1: '#c3ccd3', mt2: '#aebab8' },
  church: { label: 'Churchyard', phrase: 'in a peaceful churchyard', sky1: '#dcdde6', sky2: '#f3e4d2', sky3: '#f7eee3', h1: '#c8cfab', h2: '#b0bf93', g1: '#a6b888', g2: '#879c6a', leaf1: '#809b69', leaf2: '#a6bb8c', leaf3: '#627c51', petal: '#c4d2a6', trunk: '#7b6553', grass: '#6c8254', w1: '#b9d0da', w2: '#9fbccb', mt1: '#c3ccd3', mt2: '#aebab8' }
};
var HS_SCENE_ORDER = ['meadow', 'garden', 'mountains', 'lake', 'sea', 'church'];

var HS_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

