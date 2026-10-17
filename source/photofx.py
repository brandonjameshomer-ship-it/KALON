def photo_fx(pid, fq, sb, rb, ss, col, tv, lc='#a8a8a8'):
    """Filters that turn a photo into something carvable. pid = id prefix (may be a template hole)."""
    ch = lambda tag, attrs: ''.join('<%s %s></%s>' % (f, attrs, f) for f in ('feFuncR', 'feFuncG', 'feFuncB'))
    return ''.join([
      # Black & white photo (porcelain)
      '<filter id="%s-bw" color-interpolation-filters="sRGB">' % pid,
      '<feColorMatrix type="saturate" values="0"></feColorMatrix>',
      '<feComponentTransfer>' + ch('', 'type="linear" slope="1.1" intercept="-0.04"') + '</feComponentTransfer>',
      '</filter>',
      # Etched: stippled dots, like a hand-etched portrait
      '<filter id="%s-et" x="0" y="0" width="1" height="1" color-interpolation-filters="sRGB">' % pid,
      '<feColorMatrix in="SourceGraphic" type="saturate" values="0" result="g"></feColorMatrix>',
      '<feComponentTransfer in="g" result="c">' + ch('', 'type="gamma" amplitude="1.15" exponent="1.25" offset="-0.06"') + '</feComponentTransfer>',
      '<feTurbulence type="fractalNoise" baseFrequency="%s" numOctaves="1" seed="7" result="n"></feTurbulence>' % fq,
      '<feColorMatrix in="n" type="matrix" values="-2.2 0 0 0 1.6  -2.2 0 0 0 1.6  -2.2 0 0 0 1.6  0 0 0 0 1" result="ni"></feColorMatrix>',
      '<feComposite in="c" in2="ni" operator="arithmetic" k1="0" k2="1" k3="1" k4="-0.5" result="d"></feComposite>',
      '<feComponentTransfer in="d" result="t">' + ch('', 'type="discrete" tableValues="%s"' % tv) + '</feComponentTransfer>',
      '<feColorMatrix in="t" type="luminanceToAlpha" result="m"></feColorMatrix>',
      '<feFlood flood-color="%s" result="f"></feFlood>' % col,
      '<feComposite in="f" in2="m" operator="in"></feComposite>',
      '</filter>',
      # Sketched: pencil-like lines
      '<filter id="%s-sk" x="0" y="0" width="1" height="1" color-interpolation-filters="sRGB">' % pid,
      '<feColorMatrix in="SourceGraphic" type="saturate" values="0" result="g"></feColorMatrix>',
      '<feComponentTransfer in="g" result="inv">' + ch('', 'type="table" tableValues="1 0"') + '</feComponentTransfer>',
      '<feGaussianBlur in="inv" stdDeviation="%s" result="ib"></feGaussianBlur>' % sb,
      '<feBlend in="ib" in2="g" mode="color-dodge" result="sk"></feBlend>',
      '<feComponentTransfer in="sk" result="ln">' + ch('', 'type="linear" slope="-2.2" intercept="2.05"') + '</feComponentTransfer>',
      '<feColorMatrix in="ln" type="luminanceToAlpha" result="m"></feColorMatrix>',
      '<feFlood flood-color="%s" result="f"></feFlood>' % col,
      '<feComposite in="f" in2="m" operator="in"></feComposite>',
      '</filter>',
      # Sculpted: a raised relief lit from the upper left
      '<filter id="%s-rl" x="0" y="0" width="1" height="1" color-interpolation-filters="sRGB">' % pid,
      '<feColorMatrix in="SourceGraphic" type="saturate" values="0" result="g"></feColorMatrix>',
      '<feGaussianBlur in="g" stdDeviation="%s" result="gb"></feGaussianBlur>' % rb,
      '<feComponentTransfer in="gb" result="gp">' + ch('', 'type="discrete" tableValues="0 0.2 0.4 0.6 0.8 1"') + '</feComponentTransfer>',
      '<feGaussianBlur in="gp" stdDeviation="%s" result="gs"></feGaussianBlur>' % rb,
      '<feColorMatrix in="gs" type="luminanceToAlpha" result="h"></feColorMatrix>',
      '<feDiffuseLighting in="h" surfaceScale="%s" diffuseConstant="1.15" lighting-color="%s" result="lit"><feDistantLight azimuth="225" elevation="42"></feDistantLight></feDiffuseLighting>' % (ss, lc),
      '<feComposite in="lit" in2="SourceGraphic" operator="in"></feComposite>',
      '</filter>',
    ])
