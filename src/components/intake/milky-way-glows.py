from markup import hole


def glow(index):
    prefix = "scn.mwG.%d." % index
    cx, cy = hole(prefix + "cx"), hole(prefix + "cy")
    return ('<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + hole(prefix + "rx") + '" ry="' + hole(prefix + "ry") + '" '
            'transform="rotate(' + hole(prefix + "rot") + ' ' + cx + ' ' + cy + ')" style="fill: url(#lpMw)"></ellipse>')


def render(count):
    return "\n".join(glow(index) for index in range(count))
