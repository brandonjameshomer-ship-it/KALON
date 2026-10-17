var HS_TODS = [{ id: 'morning', label: 'Morning', icon: 'M3 18 H21 M7 18 A5 5 0 0 1 17 18 M12 7.5 V10 M5.2 11.2 L6.9 12.9 M18.8 11.2 L17.1 12.9 M2.5 15 H4.5 M19.5 15 H21.5' }, { id: 'afternoon', label: 'Afternoon', icon: 'M16.2 12 A4.2 4.2 0 1 1 7.8 12 A4.2 4.2 0 1 1 16.2 12 Z M12 2.5 V4.6 M12 19.4 V21.5 M2.5 12 H4.6 M19.4 12 H21.5 M5.3 5.3 L6.8 6.8 M17.2 17.2 L18.7 18.7 M5.3 18.7 L6.8 17.2 M17.2 6.8 L18.7 5.3' }, { id: 'evening', label: 'Evening', icon: 'M3 15 H21 M7 15 A5 5 0 0 1 17 15 M6 18.5 H18 M9 21.5 H15' }, { id: 'night', label: 'Night', icon: 'M16.5 16.8 A7 7 0 1 1 9.3 6 A5.6 5.6 0 0 0 16.5 16.8 Z M18 3 L18.6 4.6 L20.2 5.2 L18.6 5.8 L18 7.4 L17.4 5.8 L15.8 5.2 L17.4 4.6 Z M20.5 10 L20.8 10.8 L21.6 11.1 L20.8 11.4 L20.5 12.2 L20.2 11.4 L19.4 11.1 L20.2 10.8 Z' }];
var HS_SEASONS = [{ id: 'spring', label: 'Spring', icon: 'M15.1 7.6 A3.1 3.1 0 1 1 8.9 7.6 A3.1 3.1 0 1 1 15.1 7.6 Z M19.3 10.6 A3.1 3.1 0 1 1 13.1 10.6 A3.1 3.1 0 1 1 19.3 10.6 Z M17.7 15.6 A3.1 3.1 0 1 1 11.5 15.6 A3.1 3.1 0 1 1 17.7 15.6 Z M12.5 15.6 A3.1 3.1 0 1 1 6.3 15.6 A3.1 3.1 0 1 1 12.5 15.6 Z M10.9 10.6 A3.1 3.1 0 1 1 4.7 10.6 A3.1 3.1 0 1 1 10.9 10.6 Z M13.6 12 A1.6 1.6 0 1 1 10.4 12 A1.6 1.6 0 1 1 13.6 12 Z' }, { id: 'summer', label: 'Summer', icon: 'M5 19 C5 10.5 10.5 5 19 5 C19 13.5 13.5 19 5 19 Z M5 19 L13.5 10.5' }, { id: 'autumn', label: 'Autumn', icon: 'M12 21.5 V15.5 M12 15.5 L7 16.5 L8 13.2 L4 11 L7.2 10 L6.2 6 L9.6 8 L12 3 L14.4 8 L17.8 6 L16.8 10 L20 11 L16 13.2 L17 16.5 Z' }, { id: 'winter', label: 'Winter', icon: 'M12 3 V21 M4.2 7.5 L19.8 16.5 M4.2 16.5 L19.8 7.5 M9.6 4.6 L12 6.8 L14.4 4.6 M9.6 19.4 L12 17.2 L14.4 19.4 M3.9 10.5 L6.9 9.3 L6.4 6.2 M20.1 13.5 L17.1 14.7 L17.6 17.8 M3.9 13.5 L6.9 14.7 L6.4 17.8 M20.1 10.5 L17.1 9.3 L17.6 6.2' }];
var HS_TOD_WORDS = {
  morning: ['morning', 'mornings', 'sunrise', 'sunrises', 'dawn', 'coffee', 'breakfast', 'rooster'],
  evening: ['sunset', 'sunsets', 'evening', 'evenings', 'dusk', 'twilight', 'campfire', 'campfires', 'porch'],
  night: ['night', 'nights', 'stars', 'starry', 'stargazing', 'moon', 'moonlight', 'constellations', 'aurora', 'northern', 'fireflies']
};
var HS_SEASON_WORDS = {
  spring: ['spring', 'springtime', 'blossom', 'blossoms', 'april', 'tulips', 'daffodils', 'easter', 'lilacs', 'lilac'],
  summer: ['summer', 'summers', 'summertime', 'beach', 'july', 'august', 'swimming', 'picnic', 'picnics'],
  autumn: ['autumn', 'october', 'november', 'harvest', 'thanksgiving', 'pumpkin', 'pumpkins', 'football', 'hunting', 'foliage', 'leaves'],
  winter: ['winter', 'winters', 'snow', 'snowy', 'christmas', 'december', 'january', 'february', 'skiing', 'sledding', 'snowman', 'snowmen', 'hockey']
};
var HS_KEEPS = {
  roses: { words: ['rose', 'roses', 'rosebush', 'rosebushes'], phrase: 'roses close by' },
  cabin: { words: ['cabin', 'cottage', 'farmhouse', 'homestead', 'lodge'], phrase: 'a little cabin on the hill' },
  steeple: { words: ['church', 'choir', 'chapel', 'sunday', 'sundays', 'parish', 'hymn', 'hymns', 'congregation', 'pastor', 'deacon', 'synagogue', 'shul', 'mosque', 'temple', 'mandir', 'monastery'], phrase: 'a church steeple across the valley' },
  barn: { words: ['farm', 'farmer', 'farming', 'barn', 'ranch', 'rancher', 'tractor', 'tractors', 'cattle', 'cows', 'horses'], phrase: 'a red barn in the distance' },
  bench: { words: ['reading', 'books', 'bench', 'library', 'poetry', 'novels'], phrase: 'a bench for sitting a while' },
  birdhouse: { words: ['bird', 'birds', 'birdwatching', 'birdwatcher', 'feeder', 'feeders', 'cardinal', 'cardinals', 'robin', 'robins', 'bluebird', 'bluebirds', 'hummingbirds'], phrase: 'a birdhouse for visiting birds' },
  boat: { words: ['fishing', 'fisherman', 'boat', 'boating', 'sailing', 'sailor', 'canoe', 'canoeing', 'kayak', 'rowing'], phrase: 'a little boat on the water', water: true },
  sunflowers: { words: ['sunflower', 'sunflowers'], phrase: 'sunflowers nodding nearby' },
  butterflies: { words: ['butterfly', 'butterflies', 'monarch', 'monarchs'], phrase: 'butterflies drifting by' },
  apples: { words: ['apple', 'apples', 'orchard', 'orchards'], phrase: 'an apple tree heavy with fruit' },
  stars: { words: ['stars', 'stargazing', 'constellations', 'moon'], phrase: 'the first stars coming out' }
};
var HS_KEEP_ORDER = ['roses', 'cabin', 'steeple', 'barn', 'bench', 'birdhouse', 'boat', 'sunflowers', 'butterflies', 'apples', 'stars'];

