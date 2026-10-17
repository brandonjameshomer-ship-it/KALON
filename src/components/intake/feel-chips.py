from markup import field, repeat


def chip(item):
    return ('<button type="button" onClick="' + field(item, "add") + '" aria-pressed="' + field(item, "pressed") + '" '
            'style="height: 50px; padding: 0 18px; display: flex; align-items: center; gap: 8px; '
            'border: 2px solid ' + field(item, "bd") + '; border-radius: 25px; background: ' + field(item, "bg") + '; '
            'color: #1e1c19; font-size: 18px; cursor: pointer">\n'
            '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="' + field(item, "icon") + '" '
            'style="fill: none; stroke: ' + field(item, "iconColor") + '; stroke-width: 2.4; stroke-linecap: round; '
            'stroke-linejoin: round"></path></svg>\n'
            '<span>' + field(item, "label") + '</span>\n'
            '</button>')


def render(list, item):
    return repeat('<div style="display: flex; flex-wrap: wrap; gap: 10px">', list, item, 10, chip(item))
