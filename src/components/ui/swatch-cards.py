from markup import field, grid_style, lines, repeat

SIZES = {
    "compact": {"gap": "6px", "padding": "6px", "inner_gap": "5px", "border": "1px", "radius": "8px",
                "swatch_radius": "6px", "label": "12px"},
    "large": {"gap": "8px", "padding": "8px 8px 10px", "inner_gap": "7px", "border": "2px", "radius": "12px",
              "swatch_radius": "8px", "label": "15px"},
}


def title_attr(item, title):
    return "" if title is None else ' title="' + field(item, title) + '"'


def card(item, spec, swatch_height, title):
    return lines(
        '<button type="button" onClick="' + field(item, "pick") + '" aria-pressed="' + field(item, "pressed") + '"'
        + title_attr(item, title) + ' style="padding: ' + spec["padding"] + '; display: flex; flex-direction: column; '
        'gap: ' + spec["inner_gap"] + '; border: ' + spec["border"] + ' solid ' + field(item, "bd") + '; '
        'border-radius: ' + spec["radius"] + '; background: ' + field(item, "bg") + '; '
        'color: #1e1c19; text-align: left; cursor: pointer">',
        '<span style="height: %spx; border-radius: %s; background: %s; box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.18)"></span>'
        % (swatch_height, spec["swatch_radius"], field(item, "swatch")),
        '<span style="font-size: ' + spec["label"] + '; font-weight: 600">' + field(item, "label") + '</span>',
        "</button>")


def render(list, item, size, count, swatch_height, title=None):
    spec = SIZES[size]
    container = '<div style="' + grid_style(3, spec["gap"]) + '">'
    return repeat(container, list, item, count, card(item, spec, swatch_height, title))
