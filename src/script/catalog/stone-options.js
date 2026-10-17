var HS_SHAPES = [
  { id: 'flat', label: 'Flat top', short: 'Flat' },
  { id: 'serp', label: 'Serpentine', short: 'Serp' },
  { id: 'arch', label: 'Oval top', short: 'Oval' },
  { id: 'roof', label: 'Roof top', short: 'Roof' },
  { id: 'gothic', label: 'Gothic peak', short: 'Gothic' },
  { id: 'teardrop', label: 'Teardrop', short: 'Teardrop' },
  { id: 'heart', label: 'Heart', short: 'Heart', special: true },
  { id: 'dheart', label: 'Double heart', short: '2 Hearts', special: true },
  { id: 'book', label: 'Open book', short: 'Book', special: true },
  { id: 'wave', label: 'Rolling wave', short: 'Wave', special: true },
  { id: 'mountain', label: 'Mountain ridge', short: 'Ridge', special: true },
  { id: 'hill', label: 'Sunrise hill', short: 'Hill', special: true }
];

var HS_TYPES = [
  { id: 'upright', label: 'Upright', W: 40, H: 24, baseH: 6, baseX: 3, desc: 'A standing headstone on a granite base. The most room for names, symbols and a portrait.', size: 'Usually 24–48″ wide and 20–30″ high', icon: 'M24 36 V12 Q24 8 28 8 H52 Q56 8 56 12 V36 Z M18 36 H62 V44 H18 Z' },
  { id: 'slant', label: 'Slant', W: 30, H: 16, baseH: 4, baseX: 2, desc: 'An angled face on a sturdy block. Easy to read and lower than an upright.', size: 'Usually 24–36″ wide and about 16″ high', icon: 'M26 38 L32 16 H54 V38 Z M20 38 H60 V44 H20 Z' },
  { id: 'bevel', label: 'Bevel', W: 24, H: 12, baseH: 4, baseX: 2, desc: 'A low marker whose face slopes gently toward the front, just above the grass.', size: 'Usually 24″ × 12″, about 6″ high at the back', icon: 'M16 44 V37 L64 32 V44 Z' },
  { id: 'pillow', label: 'Pillow', W: 24, H: 14, baseH: 4, baseX: 2, desc: 'A low marker with softly rounded, raised edges like a pillow.', size: 'Usually 24″ × 14″, about 8″ high', icon: 'M16 44 V38 Q16 32 24 32 H56 Q64 32 64 38 V44 Z' },
  { id: 'grass', label: 'Flat', W: 24, H: 12, baseH: 4, baseX: 2, desc: 'Set level with the lawn on a granite base. Some memorial-park cemeteries require these.', size: 'Usually 24″ × 12″ × 4″', icon: 'M14 44 V40 H66 V44 Z' }
];

var HS_LAYOUTS = [
  { id: 'family', label: 'Family name headline', desc: 'Surname across the top, flanked by symbols.' },
  { id: 'classic', label: 'Centered classic', desc: 'Symbol, opening line, name, dates and quote.' },
  { id: 'side', label: 'Modern side panel', desc: 'A large symbol or portrait beside the lettering.' },
  { id: 'marker', label: 'Simple & compact', desc: 'Name, dates and a short line. Suits small markers.' },
  { id: 'below', label: 'Image below', desc: 'Name, dates and words first, with the symbol or portrait beneath.' },
  { id: 'split', label: 'Two sides', desc: 'Each half has its own story. Made for open books, double hearts and couples.' }
];

var HS_BORDERS = [
  { id: 'single', label: 'Single line', w: 0.16, dash: 'none' },
  { id: 'double', label: 'Double line', w: 0.12, dash: 'none' },
  { id: 'beaded', label: 'Beaded', w: 0.34, dash: '0 0.72' },
  { id: 'rope', label: 'Rope', w: 0.26, dash: '0.45 0.18' }
];

var HS_FAITHS = [
  { id: 'none', label: 'No symbol, thank you', sym: '' },
  { id: 'christian', label: 'Christian', sym: 'cross' },
  { id: 'celtic', label: 'Celtic Christian', sym: 'celtic' },
  { id: 'jewish', label: 'Jewish', sym: 'david' },
  { id: 'muslim', label: 'Muslim', sym: 'crescent' },
  { id: 'buddhist', label: 'Buddhist', sym: 'wheel' },
  { id: 'hindu', label: 'Hindu', sym: 'lotus' },
  { id: 'spiritual', label: 'Spiritual', sym: 'dove' },
  { id: 'other', label: 'Something else', sym: '' }
];

var HS_WSTEPS = [
  { id: 'name', label: 'Their name', req: true, title: 'Let’s begin with their name', sub: 'Write it just as you’d like it carved, along with the dates you’d like remembered.' },
  { id: 'faith', label: 'Faith', title: 'Would you like a symbol of faith?', sub: 'Choose one that holds meaning, or skip this if it doesn’t feel right.' },
  { id: 'quotes', label: 'Words to remember', title: 'Are there words that feel like them?', sub: 'A saying they loved, a favorite verse, or something the family always said. Share as many as four, and each design will carry one.' },
  { id: 'photos', label: 'A photo', title: 'Would you like to share a photo?', sub: 'A smiling, front-facing picture works beautifully. It can be etched into dark granite or set in a porcelain frame.' },
  { id: 'story', label: 'Their story', title: 'Tell us about the person you love', sub: 'What made them laugh, where they felt at home, who they cherished. The little things matter here, and they’ll gently guide the symbols, the words and the final setting.' },
  { id: 'style', label: 'The feeling', title: 'What feels right to you?', sub: '' },
  { id: 'details', label: 'Details in mind', title: 'Any details already in mind?', sub: 'Pick anything you already know you’d like to see, as many as you like. Leave it all open and we’ll choose what suits them best, with three different takes.' },
];
