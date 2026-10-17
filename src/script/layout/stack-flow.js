/* How far lowercase tails (g, p, y) or script flourishes hang below the last line's capital baseline. */
function hsTail(l) {
  if (!l || l.type !== 'text') return 0;
  var ls = hsLines(l), last = ls[ls.length - 1] || '';
  if (l.font === 'script') return l.ht * 0.4;
  return /[gjpqy]/.test(last) ? l.ht * 0.28 : 0;
}
function hsFlow(blocks, yTop, yBot, sp) {
  blocks = blocks.filter(Boolean);
  if (!blocks.length) return;
  var total = 0, gaps = 0;
  blocks.forEach(function (b, i) { b.h = b.h || hsBox(b.layer).h; b.tl = hsTail(b.layer); total += b.h; if (i) { total += b.gap + blocks[i - 1].tl; gaps += b.gap; } });
  var avail = yBot - yTop, extra = avail - total, k = 1, add = 0, lead = 0, ng = blocks.length - 1;
  /* Too tall: tighten the gaps, and if it still overflows, keep the group centered so it spills evenly top and bottom. */
  if (extra < 0) { k = gaps > 0 ? Math.max(0.3, (gaps + extra) / gaps) : 1; lead = (avail - (total - gaps * (1 - k))) / 2; }
  else { add = ng > 0 ? Math.min(1.2 * (sp || 1), extra * 0.5 / ng) : 0; lead = (extra - add * ng) / 2; }
  var y = yTop + lead;
  blocks.forEach(function (b, i) {
    if (i) y += b.gap * k + add + blocks[i - 1].tl;
    b.layer.y = hsR(y + b.h / 2, 2);
    (b.attach || []).forEach(function (a) { a.y = b.layer.y; });
    y += b.h;
  });
}

/* A custom top-to-bottom order the family chose by dragging parts onto each other. Parts named in the order
   trade places among themselves; everything else keeps its slot, and each part keeps its own size. */
function hsReorderBlocks(blocks, order, sp) {
  blocks.forEach(function (b) { if (b.layer) b.layer.inStack = true; });
  if (!order || !order.length || blocks.length < 2) return blocks;
  var rank = {}; order.forEach(function (k, i) { rank[k] = i; });
  var slots = [], moving = [];
  blocks.forEach(function (b, i) { var k = b.layer && b.layer.key; if (k !== undefined && rank[k] !== undefined) { slots.push(i); moving.push(b); } });
  if (moving.length < 2) return blocks;
  moving.sort(function (a, b) { return rank[a.layer.key] - rank[b.layer.key]; });
  var out = blocks.slice(), gaps = slots.map(function (i) { return blocks[i].gap; });
  slots.forEach(function (i, n) { out[i] = moving[n]; });
  /* spacing belongs to the slot, so the stone keeps its rhythm after a swap */
  slots.forEach(function (i, n) { out[i].gap = gaps[n] || (i ? 0.9 * (sp || 1) : 0); });
  if (out.length) out[0].gap = 0;
  return out;
}
