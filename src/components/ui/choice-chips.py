from markup import field, grid_style, repeat

SIZES = {
    "compact": {"height": "36px", "padding": "0 10px", "border": "1px", "radius": "8px", "font": "12px"},
    "large": {"height": "44px", "padding": "0 16px", "border": "2px", "radius": "10px", "font": "15px"},
}


def container(columns):
    if columns is None:
        return '<div style="display: flex; flex-wrap: wrap; gap: 6px">'
    return '<div style="' + grid_style(columns, "6px") + '">'


def chip(item, spec, padded, radius):
    padding = "padding: " + spec["padding"] + "; " if padded else ""
    return ('<button type="button" onClick="' + field(item, "pick") + '" aria-pressed="' + field(item, "pressed") + '" '
            'style="height: ' + spec["height"] + '; ' + padding + 'border: ' + spec["border"] + ' solid ' + field(item, "bd") + '; '
            'border-radius: ' + radius + '; background: ' + field(item, "bg") + '; color: #1e1c19; '
            'font-size: ' + spec["font"] + '; cursor: pointer">' + field(item, "label") + '</button>')


def render(list, item, size, columns=None, count=None, radius=None):
    spec = SIZES[size]
    return repeat(container(columns), list, item, count, chip(item, spec, columns is None, radius or spec["radius"]))
