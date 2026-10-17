/* Storybook telling: each letter gets its moment, with breaths at the punctuation. */
function hsTellSchedule(text) {
  var per = 0.058, t = 0, words = [], cur = null;
  var pause = { ',': 0.42, ';': 0.5, ':': 0.5, '.': 1.05, '!': 1.05, '?': 1.05, '—': 0.45 };
  var chars = Array.from(String(text));
  chars.forEach(function (ch, i) {
    if (ch === '\n') { if (cur) { cur.br = true; words.push(cur); cur = null; } else if (words.length) words[words.length - 1].br = true; t += 0.75; return; }
    if (ch === ' ') { if (cur) { cur.sp = ' '; words.push(cur); cur = null; } t += per * 0.6; return; }
    if (!cur) cur = { chars: [], sp: '', br: false };
    cur.chars.push({ c: ch, d: Math.round(t * 1000) / 1000 });
    t += per;
    var next = chars[i + 1] || ' ';
    if (pause[ch] && (next === ' ' || next === '\n' || next === '”' || next === '"')) t += pause[ch];
    if ((ch === '”' || ch === '"') && pause[chars[i - 1]]) t += 0.2;
  });
  if (cur) words.push(cur);
  return { words: words, total: t };
}

