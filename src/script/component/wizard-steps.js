  goStep(to) {
    var from = this.state.wstep, seen = Object.assign({}, this.state.wSeen);
    for (var k = from; k < to; k++) seen[k] = true;
    this.setState({ wstep: to, wSeen: seen });
  }

  validateName() {
    var f = this.state.form, errors = {};
    if (!f.name.trim()) errors.name = 'We’ll just need their name to begin.';
    if (!f.born && !f.passed) errors.date = 'Add at least one date, whichever you have.';
    if (f.who === 'two') {
      if (!String(f.name2 || '').trim()) errors.name2 = 'We’ll need their name too.';
      if (!f.born2 && !f.passed2) errors.date2 = 'Add at least one date for them, whichever you have.';
    }
    if (errors.name || errors.date || errors.name2 || errors.date2) { this.setState({ errors: errors, wstep: 0 }); return false; }
    return true;
  }
  wNext() {
    var s = this.state.wstep;
    if (s === 0 && !this.validateName()) return;
    if (s < HS_WSTEPS.length - 1) this.goStep(s + 1); else this.build();
  }
  wBack() { if (this.state.wstep > 0) this.setState({ wstep: this.state.wstep - 1 }); }

