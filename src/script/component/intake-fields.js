  setQuote(i, v) { var q = this.state.form.quotes.slice(); q[i] = v; this.setForm({ quotes: q }); }
  addQuote() { if (this.state.form.quotes.length < 4) this.setForm({ quotes: this.state.form.quotes.concat(['']) }); }
  removeQuote(i) { var q = this.state.form.quotes.slice(); q.splice(i, 1); if (!q.length) q = ['']; this.setForm({ quotes: q }); }
  toggleThemeChip(label) {
    var t = this.state.form.theme, low = t.toLowerCase(), l = label.toLowerCase();
    var idx = low.indexOf(l);
    if (idx >= 0) {
      var nt = (t.slice(0, idx) + t.slice(idx + label.length)).replace(/\s*,\s*,\s*/g, ', ').replace(/^[\s,]+|[\s,]+$/g, '');
      this.setForm({ theme: nt });
    } else {
      var tt = t.trim();
      this.setForm({ theme: tt ? tt.replace(/[.,;\s]+$/, '') + ', ' + l : label });
    }
  }
  handleFiles(list, owner) {
    var self = this;
    owner = owner === 2 ? 2 : 1;
    var files = Array.prototype.slice.call(list || []).filter(function (f) { return /^image\//.test(f.type); });
    var mineN = this.state.photos.filter(function (p) { return (p.owner || 1) === owner; }).length;
    files.slice(0, Math.max(0, 6 - mineN)).forEach(function (file) {
      var reader = new FileReader();
      reader.onload = function () {
        var img = new Image();
        img.onload = function () {
          var w = img.naturalWidth || 1, h = img.naturalHeight || 1, k = Math.min(1, 900 / Math.max(w, h)), url = reader.result;
          try {
            var c = document.createElement('canvas');
            c.width = Math.round(w * k); c.height = Math.round(h * k);
            c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
            url = c.toDataURL('image/jpeg', 0.86);
          } catch (err) {}
          var p = { id: 'p' + (self.nextId++), name: file.name, url: url, ratio: h / w, owner: owner };
          if (self.state.photos.filter(function (q) { return (q.owner || 1) === owner; }).length < 6) {
            self.setState({ photos: self.state.photos.concat([p]) });
            self.fillResv(owner, p.id);
            /* An image layer asked for before any photo existed gets this photo as soon as it arrives. */
            if (self.state.pendingPhoto && self.state.screen === 'edit') { self.setState({ pendingPhoto: false, status: '' }); self.addPhoto(p.id); }
          }
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }
  /* A spot saved for a photo takes the first real photo of that person as soon as one arrives, only for them. */
  fillResv(owner, pid) {
    var rid = 'resv-' + owner, hit = false;
    var designs = this.state.designs.map(function (d) {
      var p = d.params || {}, uses = p.photo === rid || p.photo2 === rid || d.layers.some(function (l) { return l.photo === rid; });
      if (!uses) return d;
      hit = true;
      var np = Object.assign({}, p);
      if (np.photo === rid) np.photo = pid;
      if (np.photo2 === rid) np.photo2 = pid;
      if (np.adj) { var na = {}; Object.keys(np.adj).forEach(function (k) { na[k] = np.adj[k].photo === rid ? Object.assign({}, np.adj[k], { photo: pid }) : np.adj[k]; }); np.adj = na; }
      if (np.extra) np.extra = np.extra.map(function (x) { return x.photo === rid ? Object.assign({}, x, { photo: pid }) : x; });
      return Object.assign({}, d, { params: np, layers: d.layers.map(function (l) { return l.photo === rid ? Object.assign({}, l, { photo: pid }) : l; }) });
    });
    if (hit) this.setState({ designs: designs });
  }
  removePhoto(id) { this.setState({ photos: this.state.photos.filter(function (p) { return p.id !== id; }) }); }
  fillSample() { var seen = {}; for (var k = 0; k < HS_WSTEPS.length - 1; k++) seen[k] = true; this.setState({ form: JSON.parse(JSON.stringify(HS_SAMPLE)), errors: {}, wstep: HS_WSTEPS.length - 1, wSeen: seen }); }
