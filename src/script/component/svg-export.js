  buildSvg(d, full) {
    var W = d.W, H = d.H, m = hsFind(HS_MATERIALS, d.material), shp = hsFind(HS_SHAPES, d.shape), ty = hsTypeOf(d);
    var path = hsStoneFor(d, W, H), num = this.numbering(d), photos = this.state.photos, bh = hsBaseH(d);
    var out = [];
    out.push('<?xml version="1.0" encoding="UTF-8"?>');
    out.push('<!-- Headstone design: ' + ty.label + ', ' + shp.label + ', ' + m.label + ' granite, ' + hsFind(HS_SURFACES, d.params.surface || 'polished').spec.toLowerCase() + ', ' + hsFind(HS_EDGES, d.params.edges || 'smooth').spec + ', face ' + W + 'in x ' + H + 'in' + (bh ? ', base ' + (W + 2 * hsBaseX(d)) + 'in x ' + bh + 'in' : '') + ' -->');
    out.push('<!-- Units are inches at 1:1. Text is live: convert to outlines before cutting the stencil. -->');
    out.push('<svg xmlns="http://www.w3.org/2000/svg" width="' + W + 'in" height="' + H + 'in" viewBox="0 0 ' + W + ' ' + H + '">');
    out.push('  <g id="stone-outline" data-role="cut-line" data-type="' + hsEsc(ty.label) + '">');
    out.push('    <path d="' + path + '" fill="none" stroke="#000000" stroke-width="0.04"/>');
    out.push('  </g>');
    num.ordered.forEach(function (l) {
      var c = hsFind(HS_CARVES, l.carve), n = num.map[l.id];
      var method = l.type === 'photo' ? hsPhotoMethod(l) : hsCarveSpec(l, m);
      var attrs = ' id="layer-' + n + '-' + hsSlug(l.name) + '" data-layer="' + n + '" data-type="' + l.type + '" data-carve="' + hsEsc(method) + '"';
      if (l.type === 'text') {
        var f = hsFind(HS_FONTS, l.font), fs = hsR(l.ht / f.cap, 3), b = hsBox(l);
        out.push('  <g' + attrs + ' data-font="' + hsEsc(f.spec) + '" data-letter-height="' + l.ht + 'in"' + (hsHasResv(l.text) ? ' data-reserved="space held for a date to be carved later"' : '') + '>');
        hsLines(l).map(hsResvStrip).forEach(function (s, i) {
          var by = hsR(b.y0 + l.ht + i * l.ht * HS_LH, 3);
          out.push('    <text x="' + hsR(l.x, 3) + '" y="' + by + '" text-anchor="middle" font-family="' + f.svg + '"' + (f.style === 'italic' ? ' font-style="italic"' : '') + ' font-size="' + fs + '" letter-spacing="' + hsR(l.track * fs, 3) + '" fill="#000000">' + hsEsc(s) + '</text>');
        });
        out.push('  </g>');
      } else if (l.type === 'symbol') {
        var sy = hsFind(HS_SYMBOLS, l.sym);
        var tf = 'translate(' + hsR(l.x - l.size / 2, 3) + ' ' + hsR(l.y - l.size / 2, 3) + ') scale(' + hsR(l.size / 100, 4) + ')';
        var paint = sy.mode === 'fill' ? 'fill="#000000" fill-rule="evenodd"' : 'fill="none" stroke="#000000" stroke-width="' + sy.sw + '" stroke-linecap="round" stroke-linejoin="round"';
        out.push('  <g' + attrs + ' data-symbol="' + hsEsc(sy.label) + '" data-size="' + l.size + 'in">');
        out.push('    <path transform="' + tf + '" ' + paint + ' d="' + sy.d.replace(/\s+/g, ' ').trim() + '"/>');
        out.push('  </g>');
      } else if (l.type === 'photo') {
        var p = null;
        photos.forEach(function (x) { if (x.id === l.photo) p = x; });
        var pb = hsBox(l), rx = hsPhotoRound(l.frame) ? hsR(l.w / 2, 3) : 0.06, ry = hsPhotoRound(l.frame) ? hsR(l.h / 2, 3) : 0.06;
        var cid = 'clip-' + n;
        out.push('  <g' + attrs + ' data-frame="' + (l.frame || 'oval') + '" data-look="' + (l.look || 'photo') + '" data-tone="' + (l.look && l.look !== 'photo' ? 'carved' : l.carve === 'laser' || l.tone === 'bw' ? 'black-and-white' : 'color') + '" data-size="' + hsR(l.w) + 'in x ' + hsR(l.h) + 'in">');
        out.push('    <clipPath id="' + cid + '"><rect x="' + hsR(pb.x0, 3) + '" y="' + hsR(pb.y0, 3) + '" width="' + hsR(l.w, 3) + '" height="' + hsR(l.h, 3) + '" rx="' + rx + '" ry="' + ry + '"/></clipPath>');
        out.push('    <image clip-path="url(#' + cid + ')" preserveAspectRatio="xMidYMid slice" x="' + hsR(pb.x0, 3) + '" y="' + hsR(pb.y0, 3) + '" width="' + hsR(l.w, 3) + '" height="' + hsR(l.h, 3) + '" href="' + (p ? (full ? p.url : 'data:image/jpeg;base64,…[embedded photo]') : '') + '"/>');
        out.push('    <rect x="' + hsR(pb.x0, 3) + '" y="' + hsR(pb.y0, 3) + '" width="' + hsR(l.w, 3) + '" height="' + hsR(l.h, 3) + '" rx="' + rx + '" ry="' + ry + '" fill="none" stroke="#000000" stroke-width="0.03"/>');
        out.push('  </g>');
      } else {
        var bd = hsFind(HS_BORDERS, l.bstyle);
        var line = 'fill="none" stroke="#000000" stroke-width="' + bd.w + '" stroke-linecap="round"' + (bd.dash !== 'none' ? ' stroke-dasharray="' + bd.dash + '"' : '');
        var tfi = function (i) { return 'translate(' + hsR(i, 3) + ' ' + hsR(i, 3) + ') scale(' + hsR((W - 2 * i) / W, 4) + ' ' + hsR((H - 2 * i) / H, 4) + ')'; };
        out.push('  <g' + attrs + ' data-border="' + hsEsc(bd.label) + '" data-inset="' + l.inset + 'in">');
        out.push('    <path transform="' + tfi(l.inset) + '" ' + line + ' d="' + path + '"/>');
        if (l.bstyle === 'double') out.push('    <path transform="' + tfi(l.inset + 0.55) + '" ' + line + ' d="' + path + '"/>');
        out.push('  </g>');
      }
    });
    out.push('</svg>');
    return out.join('\n');
  }
  copySvg() {
    var self = this, d = this.cur(); if (!d) return;
    var code = this.buildSvg(d, true);
    try {
      navigator.clipboard.writeText(code).then(function () {
        self.setState({ status: 'Copied. Paste it into an .svg file or send it to the carver.' });
      }, function () {
        self.setState({ status: 'Copying is blocked here. Use Download instead.' });
      });
    } catch (err) {
      this.setState({ status: 'Copying is blocked here. Use Download instead.' });
    }
  }
  downloadSvg() {
    var d = this.cur(); if (!d) return;
    try {
      var blob = new Blob([this.buildSvg(d, true)], { type: 'image/svg+xml' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url; a.download = 'headstone-' + hsSlug(this.state.form.name || 'design') + '.svg';
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 3000);
      this.setState({ status: 'Download started.' });
    } catch (err) {
      this.setState({ status: 'Downloads are blocked here. Use Copy SVG in the full editor instead.' });
    }
  }

