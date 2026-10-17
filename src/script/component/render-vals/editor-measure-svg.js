    var sec = this.sections(dp);
    var bh = hsBaseH(dp);
    v.statTiles = [
      { k: 'Stone', v: W + '″ W × ' + H + '″ H' },
      { k: 'Base', v: bh ? (W + 2 * hsBaseX(dp)) + '″ W × ' + hsBaseD(dp) + '″ D × ' + bh + '″ H' : 'None' },
      { k: 'Margin to ' + (dp.layers.some(function (l) { return l.visible && l.type === 'border'; }) ? 'border' : 'edge'), v: 'min ' + hsIn(hsClear(dp)) },
      { k: 'Type', v: tyP.label }
    ];
    v.measureRows = sec.rows.map(function (r) {
      var gp = sec.gaps[r.l.id], on = sel && sel.id === r.l.id;
      return { name: r.l.name, top: hsIn1(r.b.y0), h: hsIn(r.b.h), w: (r.l.type === 'text' ? '≈' : '') + hsIn1(r.b.w), gap: gp ? hsIn(gp.gap) : '–',
        bg: on ? soft : 'transparent', select: function () { self.setState({ selLayer: r.l.id }); } };
    });
    v.specRows = [
      { k: 'Type', v: tyP.label },
      { k: 'Shape', v: shp.label },
      { k: 'Granite', v: m.label },
      { k: 'Stone', v: W + '″ W × ' + H + '″ H × ' + (tyP.baseH ? '6' : '4') + '″ D [CONFIRM]' },
      { k: 'Base', v: bh ? (W + 2 * hsBaseX(dp)) + '″ W × ' + hsBaseD(dp) + '″ D × ' + bh + '″ H, ' + hsBaseMat(dp).label + ', ' + hsFind(HS_SURFACES, dp.baseSurface || 'polished').spec.toLowerCase() + ', ' + hsFind(HS_EDGES, dp.baseEdges || 'smooth').spec + ' [CONFIRM]' : 'None [CONFIRM]' },
      { k: 'Flower vases', v: hsVaseOn(dp) ? hsVaseSpec(dp) + '. ' + hsFind(HS_VASE_KINDS, dp.vase.kind).spec + ' [CONFIRM]' : 'None' },
      { k: 'Finish', v: hsFind(HS_SURFACES, pp.surface || 'polished').spec + ', ' + hsFind(HS_EDGES, pp.edges || 'smooth').spec + ' [CONFIRM]' },
      { k: 'Cemetery', v: '[CEMETERY NAME]' },
      { k: 'Section / lot', v: '[SECTION / LOT]' }
    ];
    var numD = this.numbering(dp);
    v.schedule = numD.ordered.map(function (l) {
      var c = Object.assign({}, hsFind(HS_CARVES, l.carve), { spec: hsCarveSpec(l, m) });
      var row = { num: numD.map[l.id], title: l.name, family: "'Instrument Sans', system-ui, sans-serif", fstyle: 'normal', lines: [] };
      if (l.type === 'text') {
        var ft = hsFind(HS_FONTS, l.font);
        row.content = hsResvShow(l.text); row.family = ft.family;
        if (hsHasResv(l.text)) row.lines.push({ k: 'Reserved', v: 'Space held for the passed date. Do not cut until it is added.' }); row.fstyle = ft.style;
        row.lines.push({ k: 'Method', v: c.spec }, { k: 'Typeface', v: ft.spec }, { k: 'Letters', v: hsIn(l.ht) + ' capitals, ' + hsR(l.track).toFixed(2) + ' em spacing' }, { k: 'Center', v: hsIn(l.x) + ' from left · ' + hsIn(l.y) + ' from top' });
      } else if (l.type === 'symbol') {
        row.content = hsSymLabel(l.sym);
        row.lines.push({ k: 'Method', v: c.spec }, { k: 'Size', v: hsIn(l.size) + ' square' }, { k: 'Center', v: hsIn(l.x) + ' from left · ' + hsIn(l.y) + ' from top' });
      } else if (l.type === 'photo') {
        row.content = hsPhotoShapeLabel(l.frame) + ' portrait';
        row.lines.push({ k: 'Method', v: hsPhotoMethod(l) }, { k: 'Size', v: hsIn(l.w) + ' × ' + hsIn(l.h) }, { k: 'Center', v: hsIn(l.x) + ' from left · ' + hsIn(l.y) + ' from top' });
      } else {
        var bd = hsFind(HS_BORDERS, l.bstyle);
        row.content = bd.label + ' following the ' + shp.label.toLowerCase();
        row.lines.push({ k: 'Method', v: c.spec }, { k: 'Inset', v: hsIn(l.inset) + ' from the stone edge' });
      }
      return row;
    });
    v.svgCode = edit && (st.ltab || 'design') === 'handoff' ? this.buildSvg(dp, false) : '';
    v.copySvg = function () { self.copySvg(); };
    v.downloadSvg = function () { self.downloadSvg(); };
    v.status = st.status;

