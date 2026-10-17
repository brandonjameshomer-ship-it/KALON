from markup import field, grid_style, lines, repeat


def tile(item):
    return lines(
        '<button type="button" onClick="' + field(item, "pick") + '" aria-pressed="' + field(item, "pressed") + '"'
        ' aria-label="' + field(item, "label") + '" title="' + field(item, "label") + '" style="height: 54px; padding: 0; '
        'display: flex; align-items: center; justify-content: center; border: 2px solid ' + field(item, "bd") + '; '
        'border-radius: 10px; background: ' + field(item, "bg") + '; color: #3d3a34; font-size: 13px; cursor: pointer">',
        '<svg viewBox="0 0 100 100" width="30" height="30" aria-hidden="true" style="display: ' + field(item, "svgDisp") + '">'
        '<path d="' + field(item, "d") + '" style="fill: ' + field(item, "fill") + '; stroke: ' + field(item, "stroke") + '; '
        'stroke-width: ' + field(item, "sw") + '; fill-rule: evenodd; stroke-linecap: round; stroke-linejoin: round"></path></svg>',
        '<span style="display: ' + field(item, "noneDisp") + '">None</span>',
        "</button>")


def render(list, item, count):
    return repeat('<div style="' + grid_style(5, "6px") + '">', list, item, count, tile(item))
