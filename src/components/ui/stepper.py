from markup import directive, hole

SIZES = {
    "compact": {"gap": "8px", "padding": "6px 8px", "readout": "gap: 1px; min-width: 0", "label": "12px; color: #5d584f",
                "value": "14px; font-weight: 600; color: #1e1c19; white-space: nowrap", "join": ""},
    "large": {"gap": "10px", "padding": "8px", "readout": "gap: 2px", "label": "13px; color: #4a463f",
              "value": "15px; font-weight: 600; color: #1e1c19", "join": "\n"},
}


def group_open(aria, display, spec):
    return ('<div role="group" aria-label="' + aria + '" style="display: ' + display + '; align-items: center; '
            'justify-content: space-between; gap: ' + spec["gap"] + '; padding: ' + spec["padding"] + '; '
            'border: 1px solid #d8d1c4; border-radius: 10px; background: #ffffff">')


def readout(label, value, spec):
    return ('<div style="display: flex; flex-direction: column; ' + spec["readout"] + '">'
            '<span style="font-size: ' + spec["label"] + '">' + label + '</span>'
            '<span style="font-size: ' + spec["value"] + '">' + hole(value) + '</span></div>')


def buttons(minus, minus_label, plus, plus_label, size, join):
    return join.join([
        '<div style="display: flex; gap: 6px; flex: none">',
        directive("step-button", action=minus, label=minus_label, glyph="−", size=size),
        directive("step-button", action=plus, label=plus_label, glyph="+", size=size),
        "</div>"])


def render(label, value, minus, minus_label, plus, plus_label, size, aria=None, display=None):
    spec = SIZES[size]
    return "\n".join([
        group_open(label if aria is None else aria, "flex" if display is None else hole(display), spec),
        readout(label, value, spec),
        buttons(minus, minus_label, plus, plus_label, size, spec["join"]),
        "</div>"])
