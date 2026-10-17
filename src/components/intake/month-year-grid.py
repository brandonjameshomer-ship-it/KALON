from markup import field, hole, lines, loop_open


def cell(item, font_size):
    return ('<button type="button" onClick="' + field(item, "pick") + '" aria-label="' + field(item, "aria") + '" '
            'aria-pressed="' + field(item, "pressed") + '" style="height: 60px; border: 2px solid ' + field(item, "bd") + '; '
            'border-radius: 30px; background: ' + field(item, "bg") + '; color: ' + field(item, "fg") + '; '
            'font-size: ' + str(font_size) + 'px; font-weight: ' + field(item, "w") + '; '
            'pointer-events: ' + field(item, "pe") + '; cursor: pointer">' + field(item, "label") + '</button>')


def render(show, list, item, font_size):
    return lines(
        '<sc-if value="' + hole(show) + '" hint-placeholder-val="{{false}}">',
        '<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; padding: 8px 6px 12px">',
        loop_open(list, item, 12),
        cell(item, font_size),
        "</sc-for>",
        "</div>",
        "</sc-if>")
