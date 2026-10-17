from markup import hole


def render(value, on_change, invalid, border, font_size, required=False):
    required_attr = ' required="{{yes}}"' if required else ""
    return ('<label style="display: flex; flex-direction: column; gap: 8px">\n'
            '<span style="font-size: 18px; font-weight: 600">Full name '
            '<span aria-hidden="true" style="color: #9a2f22">*</span></span>\n'
            '<input class="hs-big" type="text" value="' + hole(value) + '" onChange="' + hole(on_change) + '" '
            'placeholder="As it will read forever in stone"' + required_attr + ' aria-invalid="' + hole(invalid) + '" '
            'autocomplete="off" style="height: 64px; box-sizing: border-box; padding: 0 18px; '
            'border: 2px solid ' + hole(border) + '; border-radius: 12px; background: #ffffff; '
            'font-size: ' + str(font_size) + 'px; color: #1e1c19">\n'
            '</label>')
