from markup import field, grid_style, lines, repeat

SIZES = {
    "compact": {"gap": "6px", "padding": "6px", "inner_gap": "4px", "border": "1px", "radius": "8px",
                "preview_height": "54", "label": "font-size: 12px; font-weight: 600; line-height: 1.25"},
    "large": {"gap": "10px", "padding": "10px", "inner_gap": "6px", "border": "2px", "radius": "12px",
              "preview_height": "92", "label": "font-size: 15px; font-weight: 600"},
}


def preview(item, height):
    ink = field(item, "ink")
    return lines(
        '<svg viewBox="' + field(item, "vb") + '" width="100%" height="' + height + '" preserveAspectRatio="xMidYMid meet" aria-hidden="true">',
        '<path d="' + field(item, "stoneD") + '" style="fill: ' + field(item, "face") + '"></path>',
        '<path d="' + field(item, "photoD") + '" style="fill: ' + ink + '; opacity: 0.5"></path>',
        '<path d="' + field(item, "symD") + '" style="fill: ' + ink + '; opacity: 0.8"></path>',
        '<path d="' + field(item, "textD") + '" style="fill: ' + ink + '"></path>',
        "</svg>")


def description(item, size):
    if size == "compact":
        return []
    return ['<span style="font-size: 13px; line-height: 1.4; color: #3d3a34">' + field(item, "desc") + '</span>']


def title(item, size):
    return ' title="' + field(item, "desc") + '"' if size == "compact" else ""


def card(item, size):
    spec = SIZES[size]
    return lines(
        '<button type="button" onClick="' + field(item, "pick") + '" aria-pressed="' + field(item, "pressed") + '"'
        + title(item, size) + ' style="padding: ' + spec["padding"] + '; display: flex; flex-direction: column; '
        'gap: ' + spec["inner_gap"] + '; border: ' + spec["border"] + ' solid ' + field(item, "bd") + '; '
        'border-radius: ' + spec["radius"] + '; background: ' + field(item, "bg") + '; '
        'color: #1e1c19; text-align: left; cursor: pointer">',
        preview(item, spec["preview_height"]),
        '<span style="' + spec["label"] + '">' + field(item, "label") + '</span>',
        *description(item, size),
        "</button>")


def render(list, item, size, count):
    container = '<div style="' + grid_style(2, SIZES[size]["gap"]) + '">'
    return repeat(container, list, item, count, card(item, size))
