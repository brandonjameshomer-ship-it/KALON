from markup import hole


def render(label, value, on_change, placeholder):
    return ('<label style="display: flex; flex-direction: column; gap: 8px">\n'
            '<span style="font-size: 18px; font-weight: 600">' + label + '</span>\n'
            '<textarea class="hs-big" rows="7" value="' + hole(value) + '" onChange="' + hole(on_change) + '" '
            'placeholder="' + placeholder + '" style="box-sizing: border-box; padding: 16px 18px; resize: vertical; '
            'border: 2px solid #cfc9bd; border-radius: 12px; background: #ffffff; font-size: 21px; line-height: 1.5; '
            'color: #1e1c19"></textarea>\n'
            '</label>')
