    var born = hsParseDate(f.born), passed = hsParseDate(f.passed);
    v.fName = f.name; v.fBorn = f.born; v.fPassed = f.passed; v.fTheme = f.theme; v.fStory = f.story; v.fFaithOther = f.faithOther || '';
    v.onName = function (e) { self.setForm({ name: e.target.value }); };
    v.onBorn = function (e) { self.setForm({ born: e.target.value }); };
    v.onPassed = function (e) { self.setForm({ passed: e.target.value }); };
    /* one person or two */
    var two = f.who === 'two';
    v.twoDisp = two ? 'flex' : 'none';
    v.whoChips = [['one', 'One person', 'M19.4 8 A3.4 3.4 0 1 1 12.6 8 A3.4 3.4 0 1 1 19.4 8 Z M9.5 21 C9.5 16.5 12.5 14 16 14 C19.5 14 22.5 16.5 22.5 21'], ['two', 'Two people, together', 'M15.1 8.3 A3.1 3.1 0 1 1 8.9 8.3 A3.1 3.1 0 1 1 15.1 8.3 Z M23.1 8.3 A3.1 3.1 0 1 1 16.9 8.3 A3.1 3.1 0 1 1 23.1 8.3 Z M3.8 21 C3.8 16.4 7.4 13.8 11.2 13.8 C13.4 13.8 15.2 14.8 16 16.2 M28.2 21 C28.2 16.4 24.6 13.8 20.8 13.8 C18.6 13.8 16.8 14.8 16 16.2']].map(function (x) {
      var on = (f.who || 'one') === x[0], p = self.pill(on, accent, soft);
      return { label: x[1], icon: x[2], ic: on ? accent : '#5d584f', bg: p.bg, bd: p.bd, pressed: p.pressed, pick: function () { self.setForm({ who: x[0] }); } };
    });
    v.pairChips = [['shared', 'One shared companion stone', 'Both names on a single stone, each with their own side.'], ['matching', 'Matching stones, one each', 'Two stones designed as a pair, side by side.']].map(function (x) {
      var on = (f.pair || 'shared') === x[0], p = self.pill(on, accent, soft);
      return { label: x[1], desc: x[2], bg: p.bg, bd: p.bd, pressed: p.pressed, pick: function () { self.setForm({ pair: x[0] }); } };
    });
    v.p1Heading = 'The first person'; v.p2Heading = 'The second person';
    v.fName2 = f.name2 || ''; v.onName2 = function (e) { self.setForm({ name2: e.target.value }); };
    v.name2Err = st.errors.name2 || ''; v.name2ErrDisp = st.errors.name2 ? 'block' : 'none';
    v.name2Invalid = st.errors.name2 ? 'true' : 'false'; v.name2Bd = st.errors.name2 ? '#9a2f22' : '#b3ab9c';
    v.date2Err = st.errors.date2 || ''; v.date2ErrDisp = st.errors.date2 ? 'block' : 'none';
    v.date2Invalid = st.errors.date2 ? 'true' : 'false'; v.date2Bd = st.errors.date2 ? '#9a2f22' : '#b3ab9c';
    v.openBorn2 = function () { self.openDate('born2'); }; v.openPassed2 = function () { self.openDate('passed2'); };
    var first1 = hsNameParts(f.name).first || 'them', first2 = hsNameParts(f.name2).first || 'them';
    v.story1Label = two ? 'About ' + first1 : 'A few sentences about them';
    v.story2Label = 'About ' + first2; v.story2Ph = 'What did ' + (first2 === 'them' ? 'they' : first2) + ' love? Where were they happiest?';
    v.fStory2 = f.story2 || ''; v.onStory2 = function (e) { self.setForm({ story2: e.target.value }); };
