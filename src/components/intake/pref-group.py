from markup import chevron, field, hole, loop_open


def check_mark(item):
    return ('<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" style="display: ' + field(item, "check") + '; flex: none">'
            '<path d="M5 12.5 L10 17 L19 7" style="fill: none; stroke: {{accent}}; stroke-width: 2.6; '
            'stroke-linecap: round; stroke-linejoin: round"></path></svg>')


def count_badge(state):
    return ('<span style="display: ' + hole(state + ".countDisp") + '; flex: none; min-width: 28px; height: 28px; '
            'padding: 0 8px; box-sizing: border-box; align-items: center; justify-content: center; border-radius: 14px; '
            'background: {{accent}}; color: #ffffff; font-size: 14px; font-weight: 600">' + hole(state + ".count") + '</span>')


def header(state, title):
    return ('<button type="button" onClick="' + hole(state + ".toggle") + '" aria-expanded="' + hole(state + ".exp") + '" '
            'style="width: 100%; min-height: 68px; display: flex; align-items: center; gap: 14px; padding: 10px 18px; '
            'border: 0; background: ' + hole(state + ".bg") + '; color: #1e1c19; text-align: left; cursor: pointer">\n'
            '<span style="flex-grow: 1; min-width: 0; display: flex; flex-direction: column; gap: 3px">'
            '<span style="font-size: 19px; font-weight: 600">' + title + '</span>'
            '<span style="font-size: 16px; color: ' + hole(state + ".sumFg") + '; white-space: nowrap; overflow: hidden; '
            'text-overflow: ellipsis">' + hole(state + ".sum") + '</span></span>\n'
            + count_badge(state) + '\n'
            + chevron(state + ".rot", 24, "#4a463f", 2.2) + '\n'
            '</button>\n')


def chip(item, lead):
    return ('<button type="button" onClick="' + field(item, "pick") + '" aria-pressed="' + field(item, "pressed") + '" '
            'style="min-height: 50px; padding: 0 16px; display: flex; align-items: center; gap: 10px; '
            'border: 2px solid ' + field(item, "bd") + '; border-radius: 25px; background: ' + field(item, "bg") + '; '
            'color: #1e1c19; font-size: 17px; cursor: pointer">\n'
            + lead + '<span>' + field(item, "label") + '</span>\n'
            + check_mark(item) + '\n'
            '</button>\n')


def render(key, title, list, item, lead="", first=False):
    state = "pg." + key
    divider = "" if first else "border-top: 2px solid #eee8dd; "
    return ('<section style="' + divider + 'display: flex; flex-direction: column">\n'
            + header(state, title)
            + '<div style="display: ' + hole(state + ".disp") + '; flex-wrap: wrap; gap: 10px; padding: 4px 18px 20px">\n'
            + loop_open(list, item, 5) + '\n'
            + chip(item, lead)
            + '</sc-for>\n</div>\n</section>')
