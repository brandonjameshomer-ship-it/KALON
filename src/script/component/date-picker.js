  /* ---- Large, calm date picker (Material-style dialog) ---- */
  openDate(field) {
    var f = this.state.form, cur = hsParseDate(f[field]), now = new Date(), ty = now.getFullYear();
    var isBorn = /^born/.test(field), sfx = field.replace(/^(born|passed)/, ''), other = hsParseDate(f[(isBorn ? 'passed' : 'born') + sfx]);
    var y, m, view;
    if (cur) { y = cur.y; m = cur.m - 1; view = 'day'; }
    else if (isBorn) { y = other ? other.y - 75 : 1950; m = 0; view = 'year'; }
    else { y = other && other.y > ty - 1 ? other.y : ty; m = now.getMonth(); view = other ? 'year' : 'day'; if (!other) y = ty; }
    this.setState({ dp: { field: field, view: view, y: y, m: m, page: y - (((y % 12) + 12) % 12), sel: f[field] || '', typing: false, text: '', err: '' } });
  }
  dpSet(patch) { this.setState({ dp: Object.assign({}, this.state.dp, patch) }); }
  dpClose() { this.setState({ dp: null }); }
  dpOk() {
    var dp = this.state.dp; if (!dp) return;
    if (dp.editing && String(dp.text || '').trim()) {
      var iso = hsParseLooseDate(dp.text);
      if (!iso) { this.dpSet({ err: 'Try a date like 04/12/1941 or April 12, 1941.' }); return; }
      var why = this.dpBlocked(iso, dp.field);
      if (why) { this.dpSet({ err: why }); return; }
      dp = Object.assign({}, dp, { sel: iso });
    }
    var patch = {}; patch[dp.field] = dp.sel || '';
    this.setForm(patch); this.setState({ dp: null });
  }
  dpClear() { var dp = this.state.dp; if (!dp) return; var patch = {}; patch[dp.field] = ''; this.setForm(patch); this.setState({ dp: null }); }
  dpBlocked(iso, field) {
    var today = hsIsoToday(), f = this.state.form;
    if (iso > today) return 'That date is still to come.';
    var sfx = field.replace(/^(born|passed)/, ''), fb = f['born' + sfx], fp = f['passed' + sfx];
    if (/^born/.test(field) && fp && iso > fp) return 'Born needs to come before passed.';
    if (/^passed/.test(field) && fb && iso < fb) return 'Passed needs to come after born.';
    return '';
  }
