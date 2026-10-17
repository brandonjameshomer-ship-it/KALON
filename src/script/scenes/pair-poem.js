/* Two people: a few lines for each life, then one closing line that holds them together. */
function hsPairPoem(form, mo, sceneId) {
  var f2 = hsPairForm(form), a1 = hsAnalyze(form), a2 = hsAnalyze(f2);
  var mo2 = Object.assign({}, mo, { seed: ((mo.seed || 1) ^ 0x2a2a2a) >>> 0 });
  var l1 = hsLifePoem(form, a1, mo, sceneId).split('\n'), l2 = hsLifePoem(f2, a2, mo2, sceneId).split('\n');
  var body1 = l1.slice(0, Math.max(1, Math.min(2, l1.length - 1))), body2 = l2.slice(0, Math.max(1, Math.min(2, l2.length - 1)));
  /* never say the same thing twice about the two of them */
  var alt = [', the steady hand everyone leaned on.', ', the one who kept everyone laughing.', ', the quiet strength of the family.'];
  body2 = body2.map(function (ln, k) {
    var dup = body1.some(function (b1) { return b1.slice(-24) === ln.slice(-24); });
    return dup ? ln.replace(/, (she|he|they) (was|were) the heart of every table\.$|, [^,]*\.$/, alt[k % alt.length]) : ln;
  });
  var when = mo.season + ' ' + mo.tod;
  var closers = ['Side by side now, the way they always were.', 'Together still, under this ' + when + '.', 'Two lives, one story, and a love that carries on.'];
  if (mo.tod === 'night') closers.push('Let the stars keep watch over them both.');
  var rng = hsRng((mo.seed || 7) ^ 0x1234567);
  return body1.concat(body2, [closers[Math.floor(rng() * closers.length) % closers.length]]).join('\n');
}
