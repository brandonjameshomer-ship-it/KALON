  numbering(d) {
    var vis = d.layers.filter(function (l) { return l.visible; });
    vis.sort(function (a, b) {
      var ab = a.type === 'border' ? 0 : 1, bb = b.type === 'border' ? 0 : 1;
      if (ab !== bb) return ab - bb;
      if (ab === 0) return 0;
      return (hsBox(a).y0 - hsBox(b).y0) || (a.x - b.x);
    });
    var map = {};
    vis.forEach(function (l, i) { map[l.id] = i + 1; });
    return { map: map, ordered: vis };
  }
  sections(d) {
    var items = d.layers.filter(function (l) { return l.visible && l.type !== 'border'; });
    var boxes = items.map(function (l) { return { l: l, b: hsBox(l) }; });
    var ruler = {}, gaps = {};
    boxes.forEach(function (a) {
      var hidden = boxes.some(function (o) { return o !== a && Math.min(o.b.y1, a.b.y1) - Math.max(o.b.y0, a.b.y0) > 0.2 && o.b.w > a.b.w; });
      if (!hidden) ruler[a.l.id] = true;
      var prev = null;
      boxes.forEach(function (o) { if (o !== a && o.b.y1 <= a.b.y0 + 0.05 && (!prev || o.b.y1 > prev.b.y1)) prev = o; });
      if (prev) gaps[a.l.id] = { gap: a.b.y0 - prev.b.y1, from: prev.b.y1 };
    });
    var rows = boxes.slice().sort(function (a, b) { return a.b.y0 - b.b.y0; });
    return { ruler: ruler, gaps: gaps, rows: rows };
  }

