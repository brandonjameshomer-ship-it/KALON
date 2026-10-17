from markup import hole


def each_channel(attrs):
    return "".join("<%s %s></%s>" % (func, attrs, func) for func in ("feFuncR", "feFuncG", "feFuncB"))


def transfer(attrs, source=None, result=None):
    io = ""
    if source:
        io += ' in="%s"' % source
    if result:
        io += ' result="%s"' % result
    return "<feComponentTransfer%s>%s</feComponentTransfer>" % (io, each_channel(attrs))


def filter_open(id, suffix):
    return '<filter id="%s-%s" x="0" y="0" width="1" height="1" color-interpolation-filters="sRGB">' % (id, suffix)


def grayscale():
    return '<feColorMatrix in="SourceGraphic" type="saturate" values="0" result="g"></feColorMatrix>'


def tint_by_luminance(source, color):
    return ('<feColorMatrix in="%s" type="luminanceToAlpha" result="m"></feColorMatrix>' % source
            + '<feFlood flood-color="%s" result="f"></feFlood>' % color
            + '<feComposite in="f" in2="m" operator="in"></feComposite>')


def black_and_white(id):
    return ('<filter id="%s-bw" color-interpolation-filters="sRGB">' % id
            + '<feColorMatrix type="saturate" values="0"></feColorMatrix>'
            + transfer('type="linear" slope="1.1" intercept="-0.04"')
            + "</filter>")


def etched(id, frequency, levels, color):
    return (filter_open(id, "et") + grayscale()
            + transfer('type="gamma" amplitude="1.15" exponent="1.25" offset="-0.06"', "g", "c")
            + '<feTurbulence type="fractalNoise" baseFrequency="%s" numOctaves="1" seed="7" result="n"></feTurbulence>' % frequency
            + '<feColorMatrix in="n" type="matrix" values="-2.2 0 0 0 1.6  -2.2 0 0 0 1.6  -2.2 0 0 0 1.6  0 0 0 0 1" result="ni"></feColorMatrix>'
            + '<feComposite in="c" in2="ni" operator="arithmetic" k1="0" k2="1" k3="1" k4="-0.5" result="d"></feComposite>'
            + transfer('type="discrete" tableValues="%s"' % levels, "d", "t")
            + tint_by_luminance("t", color)
            + "</filter>")


def sketched(id, blur, color):
    return (filter_open(id, "sk") + grayscale()
            + transfer('type="table" tableValues="1 0"', "g", "inv")
            + '<feGaussianBlur in="inv" stdDeviation="%s" result="ib"></feGaussianBlur>' % blur
            + '<feBlend in="ib" in2="g" mode="color-dodge" result="sk"></feBlend>'
            + transfer('type="linear" slope="-2.2" intercept="2.05"', "sk", "ln")
            + tint_by_luminance("ln", color)
            + "</filter>")


def relief(id, blur, scale, light):
    return (filter_open(id, "rl") + grayscale()
            + '<feGaussianBlur in="g" stdDeviation="%s" result="gb"></feGaussianBlur>' % blur
            + transfer('type="discrete" tableValues="0 0.2 0.4 0.6 0.8 1"', "gb", "gp")
            + '<feGaussianBlur in="gp" stdDeviation="%s" result="gs"></feGaussianBlur>' % blur
            + '<feColorMatrix in="gs" type="luminanceToAlpha" result="h"></feColorMatrix>'
            + '<feDiffuseLighting in="h" surfaceScale="%s" diffuseConstant="1.15" lighting-color="%s" result="lit">' % (scale, light)
            + '<feDistantLight azimuth="225" elevation="42"></feDistantLight></feDiffuseLighting>'
            + '<feComposite in="lit" in2="SourceGraphic" operator="in"></feComposite>'
            + "</filter>")


def render(id, frequency, levels, sketch_blur, relief_blur, relief_scale, color, light):
    return (black_and_white(id)
            + etched(id, frequency, levels, hole(color))
            + sketched(id, sketch_blur, hole(color))
            + relief(id, relief_blur, relief_scale, hole(light)))
