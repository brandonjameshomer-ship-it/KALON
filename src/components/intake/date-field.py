from markup import hole

CALENDAR = ('<svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true" style="flex: none; color: {{accent}}">'
            '<path d="M4 6.5 H20 V20 H4 Z M4 10.5 H20 M8.5 4 V8 M15.5 4 V8 M8 14 H9 M11.5 14 H12.5 M15 14 H16 M8 17 H9 '
            'M11.5 17 H12.5" style="fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; '
            'stroke-linejoin: round"></path></svg>')


def render(label, action, value, invalid, border, color):
    text = hole(value)
    return ('<div style="display: flex; flex-direction: column; gap: 8px">\n'
            '<span style="font-size: 18px; font-weight: 600">' + label + '</span>\n'
            '<button type="button" class="hs-big" onClick="' + hole(action) + '" aria-label="' + label + ': ' + text + '" '
            'aria-haspopup="dialog" aria-invalid="' + hole(invalid) + '" style="height: 64px; box-sizing: border-box; '
            'padding: 0 14px 0 18px; display: flex; align-items: center; justify-content: space-between; gap: 10px; '
            'border: 2px solid ' + hole(border) + '; border-radius: 12px; background: #ffffff; font-size: 22px; '
            'color: ' + hole(color) + '; text-align: left; cursor: pointer">'
            '<span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis">' + text + '</span>'
            + CALENDAR + '</button>\n'
            '</div>')
