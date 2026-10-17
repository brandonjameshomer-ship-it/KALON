from markup import directive, lines

BEST_SIZE_ICON = "M4 9 V4 H9 M15 4 H20 V9 M20 15 V20 H15 M9 20 H4 V15"


def dimension_stepper(name, minus, minus_label, plus, plus_label):
    return lines(
        '<div role="group" aria-label="' + name + '" style="display: flex; align-items: center; '
        'justify-content: space-between; gap: 6px; padding: 6px 8px; border: 1px solid #d8d1c4; '
        'border-radius: 10px; background: #ffffff">',
        directive("step-button", action=minus, label=minus_label, glyph="−", size="large"),
        '<span style="font-size: 14px; color: #3d3a34">' + name + '</span>',
        directive("step-button", action=plus, label=plus_label, glyph="+", size="large"),
        "</div>")


def render():
    return lines(
        directive("heading", text="Stone size", size="large"),
        '<div style="display: flex; align-items: center; justify-content: space-between; gap: 10px">',
        '<span style="font-size: 17px; font-weight: 600; color: #1e1c19">{{gSize}}</span>',
        directive("auto-fit-button", action="bestSize", icon=BEST_SIZE_ICON, label="Best size"),
        "</div>",
        directive("size-message", size="large"),
        '<div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px">',
        dimension_stepper("Width", "gWMinus", "Narrower", "gWPlus", "Wider"),
        dimension_stepper("Height", "gHMinus", "Shorter", "gHPlus", "Taller"),
        "</div>")
