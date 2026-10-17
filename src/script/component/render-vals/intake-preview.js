    var pvn = f.name.trim() ? f.name.trim().toUpperCase() : 'FULL NAME';
    if (f.who === 'two') {
      var n1 = hsNameParts(f.name), n2 = hsNameParts(f.name2 || '');
      pvn = n1.surname && n2.surname && n1.surname === n2.surname ? ((n1.first || 'NAME') + ' & ' + (n2.first || 'NAME') + ' ' + n1.surname).toUpperCase() : ((n1.first || 'NAME') + ' & ' + (n2.first || 'NAME')).toUpperCase();
    }
    v.pvName = pvn;
    v.pvNameSize = hsR(Math.max(22, Math.min(36, 300 / Math.max(1, hsTextW(pvn, 'roman', 1, 0.06) / 0.7 * 1.05))), 1);
    /* Dates always sit on one line, sized as if both were set, so the preview never jumps or wraps. */
    var pvShort = function (dt) { return dt ? HS_MONTHS[dt.m - 1].slice(0, 3).toUpperCase() + ' ' + dt.d + ', ' + dt.y : 'MMM DD, YYYY'; };
    v.pvD1 = pvShort(born); v.pvD2 = pvShort(passed);
    v.pvD1Op = born ? 1 : 0.38; v.pvD2Op = passed ? 1 : 0.38;
    v.pvDates = v.pvD1 + ' – ' + v.pvD2;
    var pq = hsCleanQuote(f.quotes[0]);
    v.pvQuote = hsTrunc(pq, 64);
    v.pvQuoteDisp = pq ? 'block' : 'none';
    var pvFa = f.faith ? hsFind(HS_FAITHS, f.faith) : null, pvGuess = f.faith === 'other' ? hsFaithGuess(f.faithOther) : null;
    var pvSy = pvGuess ? hsFind(HS_SYMBOLS, pvGuess.sym) : pvFa && pvFa.sym ? hsFind(HS_SYMBOLS, pvFa.sym) : null;
    v.pvSymDisp = pvSy ? 'block' : 'none'; v.pvSymOp = pvSy ? 1 : 0;
    v.pvSymD = pvSy ? pvSy.d : 'M0 0'; v.pvSymFill = pvSy && pvSy.mode === 'fill' ? '#5f5b55' : 'none'; v.pvSymStroke = pvSy && pvSy.mode === 'stroke' ? '#5f5b55' : 'none'; v.pvSymSw = pvSy ? (pvSy.sw || 0) : 0;
    v.pvStoneD = hsStonePath('serp', 330, 194);

