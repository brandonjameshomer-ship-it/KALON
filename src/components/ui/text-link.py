from markup import hole


def render(action, display, label, font_size, align_start=False):
    align = "align-self: flex-start; " if align_start else ""
    return ('<button type="button" onClick="' + hole(action) + '" style="display: ' + hole(display) + '; ' + align
            + 'padding: 0; border: 0; background: transparent; color: {{accent}}; font-size: ' + str(font_size) + 'px; '
            'font-weight: 600; text-decoration: underline; cursor: pointer">' + label + '</button>')
