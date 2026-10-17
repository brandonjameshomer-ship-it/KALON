from markup import field, grid_style, lines, repeat

SIZES = {
    "compact": {"gap": "6px", "height": "60px", "inner_gap": "4px", "border": "1px", "radius": "8px",
                "color": "", "icon": ("34", "23"), "label": "font-size: 11px; color: #3d3a34"},
    "large": {"gap": "8px", "height": "90px", "inner_gap": "8px", "border": "2px", "radius": "12px",
              "color": "color: #1e1c19; ", "icon": ("54", "36"), "label": "font-size: 14px"},
}


def aria_label(item, size):
    return ' aria-label="' + field(item, "label") + '"' if size == "compact" else ""


def tile(item, size):
    spec = SIZES[size]
    width, height = spec["icon"]
    return lines(
        '<button type="button" onClick="' + field(item, "pick") + '" aria-pressed="' + field(item, "pressed") + '"'
        + aria_label(item, size) + ' style="height: ' + spec["height"] + '; display: flex; flex-direction: column; '
        'align-items: center; justify-content: center; gap: ' + spec["inner_gap"] + '; '
        'border: ' + spec["border"] + ' solid ' + field(item, "bd") + '; border-radius: ' + spec["radius"] + '; '
        'background: ' + field(item, "bg") + '; ' + spec["color"] + 'cursor: pointer">',
        '<svg viewBox="-1 -1 38 26" width="' + width + '" height="' + height + '" aria-hidden="true"><path d="'
        + field(item, "d") + '" style="fill: ' + field(item, "fill") + '"></path></svg>',
        '<span style="' + spec["label"] + '">' + field(item, "label") + '</span>',
        "</button>")


def render(list, item, size, count=None):
    container = '<div style="' + grid_style(3, SIZES[size]["gap"]) + '">'
    return repeat(container, list, item, count, tile(item, size))
