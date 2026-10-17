from markup import hole


def render(checked, on_change, title, note, display=None):
    return ('<label style="display: ' + ("flex" if display is None else hole(display)) + '; align-items: center; gap: 14px; '
            'min-height: 56px; padding: 10px 16px; border: 2px solid #cfc9bd; border-radius: 12px; background: #ffffff; cursor: pointer">\n'
            '<input type="checkbox" checked="' + hole(checked) + '" onChange="' + hole(on_change) + '" '
            'style="width: 24px; height: 24px; margin: 0; flex: none; accent-color: {{accent}}">\n'
            '<span style="display: flex; flex-direction: column; gap: 2px">'
            '<span style="font-size: 18px; font-weight: 600">' + title + '</span>'
            '<span style="font-size: 16px; color: #4a463f">' + note + '</span></span>\n'
            '</label>')
