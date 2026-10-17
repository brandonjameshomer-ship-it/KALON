    /* date fields + picker */
    var dpFieldDisp = function (iso) { var dt = hsParseDate(iso); return dt ? HS_MONTHS[dt.m - 1] + ' ' + dt.d + ', ' + dt.y : ''; };
    v.softAccent = hsRgba(accent, 0.1);
    v.bornDisp = dpFieldDisp(f.born) || 'Choose a date'; v.bornFg = f.born ? '#1e1c19' : '#7a7368';
    v.born2Disp = dpFieldDisp(f.born2) || 'Choose a date'; v.born2Fg = f.born2 ? '#1e1c19' : '#7a7368';
    v.passed2Disp = dpFieldDisp(f.passed2) || 'Choose a date'; v.passed2Fg = f.passed2 ? '#1e1c19' : '#7a7368';
    v.passedDisp = dpFieldDisp(f.passed) || 'Choose a date'; v.passedFg = f.passed ? '#1e1c19' : '#7a7368';
    v.openBorn = function () { self.openDate('born'); }; v.openPassed = function () { self.openDate('passed'); };
    var dp = st.dp;
    v.dpOpen = !!dp;
    v.dpBackdrop = function (e) { if (e && e.target === e.currentTarget) self.dpClose(); };
    v.dpKey = function (e) {
      if (!e) return;
      if (e.key === 'Escape') { e.preventDefault(); self.dpClose(); return; }
      var inp = self._dpInput;
      if (e.key === 'Enter' && e.target === inp && self.state.dp && self.state.dp.sel && !self.state.dp.err) { e.preventDefault(); self.dpOk(); return; }
      /* Typing a number anywhere in the picker goes straight into the date box. */
      if (/^[0-9]$/.test(e.key) && inp && e.target !== inp && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        var cur = self.state.dp && self.state.dp.editing ? String(inp.value || '').replace(/\D/g, '') : '';
        if (v.dpOnHead) v.dpOnHead({ target: { value: cur + e.key } });
        try { inp.focus(); setTimeout(function () { try { var n = inp.value.length; inp.setSelectionRange(n, n); } catch (er) {} }, 0); } catch (er) {}
      }
    };
    /* The date box is ready to type into the moment the picker opens. */
    if (!dp) self._dpFocused = null;
    v.dpHeadRef = function (el) {
      self._dpInput = el || self._dpInput;
      if (el && dp && self._dpFocused !== dp.field) {
        self._dpFocused = dp.field;
        setTimeout(function () { try { el.focus(); el.select(); } catch (er) {} }, 30);
      }
    };
    v.dpHeadFocus = function (e) { try { e.target.select(); } catch (er) {} };
    if (dp) {
      var WD = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], today = hsIsoToday(), ty = +today.slice(0, 4), tm = +today.slice(5, 7) - 1;
      var pad = function (n) { return (n < 10 ? '0' : '') + n; };
      var selD = hsParseDate(dp.sel);
      var dpWho = f.who === 'two' ? (hsNameParts(/2$/.test(dp.field) ? f.name2 : f.name).first || '') : '';
      v.dpTitle = /^born/.test(dp.field) ? 'The day ' + (dpWho || 'they') + (dpWho ? ' was' : ' were') + ' born' : 'The day ' + (dpWho || 'they') + ' passed';
      v.dpHeadline = selD ? ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date(selD.y, selD.m - 1, selD.d).getDay()] + ', ' + HS_MONTHS[selD.m - 1] + ' ' + selD.d + ', ' + selD.y : 'Type it, or choose it below';
      /* The header is the date itself, ready to type into as MM/DD/YYYY; choosing on the calendar fills it in. */
      v.dpHeadText = dp.editing ? (dp.text || '') : selD ? pad(selD.m) + '/' + pad(selD.d) + '/' + selD.y : '';
      v.dpOnHead = function (e) {
        var dg = String(e.target.value || '').replace(/\D/g, '').slice(0, 8);
        var t = dg.slice(0, 2) + (dg.length > 2 ? '/' + dg.slice(2, 4) : '') + (dg.length > 4 ? '/' + dg.slice(4) : '');
        var patch = { text: t, editing: true, err: '' };
        if (dg.length === 8) {
          var mm = +dg.slice(0, 2), dd = +dg.slice(2, 4), yy = +dg.slice(4), okD = mm >= 1 && mm <= 12 && dd >= 1 && dd <= new Date(yy, mm, 0).getDate() && yy >= 1800;
          if (!okD) patch.err = 'That doesn’t look like a real date. Try MM/DD/YYYY, like 04/12/1941.';
          else {
            var iso = yy + '-' + pad(mm) + '-' + pad(dd), why = self.dpBlocked(iso, self.state.dp.field);
            if (why) patch.err = why;
            else { patch.sel = iso; patch.y = yy; patch.m = mm - 1; patch.view = 'day'; patch.page = yy - (((yy % 12) + 12) % 12); }
          }
        }
        self.dpSet(patch);
      };
      v.dpHeadOp = selD ? 1 : 0.6;
      v.dpCal = true; v.dpTyping = false;
      v.dpModeLabel = dp.typing ? 'Use the calendar' : 'Type the date instead';
      v.dpModeIcon = dp.typing ? 'M4 7 H20 V20 H4 Z M4 11 H20 M8.5 4.5 V8.5 M15.5 4.5 V8.5' : 'M4 20 L4.6 16.4 L15.8 5.2 A1.9 1.9 0 0 1 18.8 8.2 L7.6 19.4 Z M13.8 7.2 L16.8 10.2';
      v.dpToggleMode = function () { var d0 = self.state.dp; self.dpSet({ typing: !d0.typing, err: '', text: d0.sel ? d0.sel.slice(5, 7) + '/' + d0.sel.slice(8, 10) + '/' + d0.sel.slice(0, 4) : '' }); };
      v.dpText = dp.text; v.dpOnText = function (e) { self.dpSet({ text: e.target.value, err: '' }); };
      v.dpErr = dp.err || ''; v.dpErrDisp = dp.err ? 'block' : 'none';
      v.dpIsDay = dp.view === 'day'; v.dpIsMonth = dp.view === 'month'; v.dpIsYear = dp.view === 'year';
      v.dpNavLabel = dp.view === 'day' ? HS_MONTHS[dp.m] + ' ' + dp.y : dp.view === 'month' ? String(dp.y) : dp.page + ' – ' + (dp.page + 11);
      v.dpNavHint = dp.view === 'year' ? 'Choose a year' : dp.view === 'month' ? 'Choose a month' : '';
      v.dpNavCaret = dp.view === 'year' ? 'none' : 'inline';
      v.dpNavTap = function () { var d0 = self.state.dp; self.dpSet(d0.view === 'day' ? { view: 'month' } : d0.view === 'month' ? { view: 'year', page: d0.y - (((d0.y % 12) + 12) % 12) } : {}); };
      var step = function (dir) {
        var d0 = self.state.dp;
        if (d0.view === 'day') { var mm = d0.m + dir, yy = d0.y; if (mm < 0) { mm = 11; yy--; } if (mm > 11) { mm = 0; yy++; } self.dpSet({ m: mm, y: yy }); }
        else if (d0.view === 'month') self.dpSet({ y: d0.y + dir });
        else self.dpSet({ page: d0.page + dir * 12 });
      };
      v.dpPrev = function () { step(-1); }; v.dpNext = function () { step(1); };
      var nextBlocked = dp.view === 'day' ? (dp.y > ty || (dp.y === ty && dp.m >= tm)) : dp.view === 'month' ? dp.y >= ty : dp.page + 11 >= ty;
      v.dpNextOp = nextBlocked ? 0.3 : 1; v.dpNextDis = nextBlocked ? 'true' : 'false';
      v.dpNextPe = nextBlocked ? 'none' : 'auto';
      v.dpWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(function (s, i) { return { s: s, key: 'w' + i }; });
      var cell = function (on, dis, isToday) {
        return { bg: on ? accent : 'transparent', fg: on ? '#ffffff' : dis ? '#bdb6aa' : '#1e1c19', bd: isToday && !on ? accent : 'transparent', pe: dis ? 'none' : 'auto', w: on || isToday ? 700 : 500 };
      };
      if (dp.view === 'day') {
        var first = new Date(dp.y, dp.m, 1).getDay(), nd = new Date(dp.y, dp.m + 1, 0).getDate(), days = [];
        for (var bi = 0; bi < first; bi++) days.push({ label: '', aria: '', vis: 'hidden', bg: 'transparent', fg: '#1e1c19', bd: 'transparent', pe: 'none', w: 500, pressed: 'false', pick: function () {} });
        for (var dd = 1; dd <= nd; dd++) (function (dd) {
          var iso = dp.y + '-' + pad(dp.m + 1) + '-' + pad(dd), on = dp.sel === iso, dis = !!self.dpBlocked(iso, dp.field);
          days.push(Object.assign({ label: String(dd), aria: HS_MONTHS[dp.m] + ' ' + dd + ', ' + dp.y, vis: 'visible', pressed: on ? 'true' : 'false', pick: function () { self.dpSet({ sel: iso, editing: false, err: '' }); } }, cell(on, dis, iso === today)));
        })(dd);
        while (days.length % 7) days.push({ label: '', aria: '', vis: 'hidden', bg: 'transparent', fg: '#1e1c19', bd: 'transparent', pe: 'none', w: 500, pressed: 'false', pick: function () {} });
        v.dpDays = days;
      } else v.dpDays = [];
      v.dpMonths = dp.view === 'month' ? HS_MONTHS.map(function (mn, mi) {
        var on = selD && selD.y === dp.y && selD.m - 1 === mi, dis = dp.y > ty || (dp.y === ty && mi > tm);
        return Object.assign({ label: mn.slice(0, 3), aria: mn + ' ' + dp.y, pressed: on ? 'true' : 'false', pick: function () { self.dpSet({ m: mi, view: 'day' }); } }, cell(on, dis, dp.y === ty && mi === tm));
      }) : [];
      v.dpYears = dp.view === 'year' ? Array.apply(null, Array(12)).map(function (_, k) {
        var yy = dp.page + k, on = selD && selD.y === yy, dis = yy > ty;
        return Object.assign({ label: String(yy), aria: String(yy), pressed: on ? 'true' : 'false', pick: function () { self.dpSet({ y: yy, view: 'month' }); } }, cell(on, dis, yy === ty));
      }) : [];
      v.dpCancel = function () { self.dpClose(); };
      v.dpOk = function () { self.dpOk(); };
      v.dpClear = function () { self.dpClear(); };
      v.dpOkOp = dp.typing || dp.sel ? 1 : 0.4;
    } else {
      v.dpTitle = ''; v.dpHeadline = ''; v.dpHeadText = ''; v.dpOnHead = function () {}; v.dpHeadOp = 1; v.dpCal = false; v.dpTyping = false; v.dpModeLabel = ''; v.dpModeIcon = 'M0 0'; v.dpToggleMode = function () {};
      v.dpText = ''; v.dpOnText = function () {}; v.dpErr = ''; v.dpErrDisp = 'none'; v.dpIsDay = false; v.dpIsMonth = false; v.dpIsYear = false;
      v.dpNavLabel = ''; v.dpNavHint = ''; v.dpNavCaret = 'none'; v.dpNavTap = function () {}; v.dpPrev = function () {}; v.dpNext = function () {};
      v.dpNextOp = 1; v.dpNextDis = 'false'; v.dpNextPe = 'auto'; v.dpWeek = []; v.dpDays = []; v.dpMonths = []; v.dpYears = [];
      v.dpCancel = function () {}; v.dpOk = function () {}; v.dpClear = function () {}; v.dpOkOp = 1;
    }

