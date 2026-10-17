from markup import hole

SIZES = {"compact": ("34px", "18px"), "large": ("36px", "20px")}


def render(action, label, glyph, size):
    side, font_size = SIZES[size]
    return ('<button type="button" onClick="' + hole(action) + '" aria-label="' + label + '" style="width: ' + side + '; '
            'height: ' + side + '; border: 0; border-radius: 8px; background: #f1ede5; font-size: ' + font_size + '; '
            'color: #1e1c19; cursor: pointer">' + glyph + '</button>')
