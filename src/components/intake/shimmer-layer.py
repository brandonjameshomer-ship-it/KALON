from markup import hole


def render(d, duration, delay=None):
    delay_style = "; animation-delay: %ss" % delay if delay is not None else ""
    return ('<div style="position: absolute; left: 0; top: 0; width: 1440px; height: 836px; display: {{scn.shimDisp}}; '
            'animation: hsShimmer %ss ease-in-out infinite%s">\n'
            '<svg viewBox="0 0 1440 836" width="1440" height="836" style="display: block">'
            '<path d="%s" style="fill: #ffffff; opacity: {{scn.shimOp}}"></path></svg>\n'
            '</div>' % (duration, delay_style, hole(d)))
