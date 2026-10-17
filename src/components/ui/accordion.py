from markup import chevron, heading_style, hole

VARIANTS = {"panel": ("20px", "bottom"), "inset": ("0px", "top")}


def toggle(state, title, pad):
    return ('<button type="button" onClick="' + hole(state + ".toggle") + '" aria-expanded="' + hole(state + ".exp") + '" '
            'style="width: 100%; min-height: 54px; display: flex; align-items: center; gap: 10px; padding: 8px ' + pad + '; '
            'border: 0; background: transparent; cursor: pointer; text-align: left; color: #1e1c19">\n'
            '<span style="flex-grow: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px">'
            '<span style="' + heading_style("compact") + '">' + title + '</span>'
            '<span style="font-size: 13px; color: #1e1c19; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">'
            + hole(state + ".sum") + '</span></span>\n'
            + chevron(state + ".rot", 18, "#5d584f", 2) + '\n'
            '</button>\n')


def render(key, title, body, variant="panel"):
    state = "ac." + key
    pad, divider = VARIANTS[variant]
    return ('<section style="border-' + divider + ': 1px solid #e4dfd5">\n'
            + toggle(state, title, pad)
            + '<div style="display: ' + hole(state + ".disp") + '; flex-direction: column; gap: 12px; padding: 0 ' + pad + ' 18px">\n'
            + body
            + '</div>\n</section>\n')
