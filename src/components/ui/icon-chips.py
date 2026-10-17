from markup import field, repeat

STROKE = "stroke: currentColor; stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round"


def path(item, d, fill="none", css_class=None):
    class_attr = "" if css_class is None else ' class="' + field(item, css_class) + '"'
    return '<path' + class_attr + ' d="' + field(item, d) + '" style="fill: ' + fill + '; ' + STROKE + '"></path>'


def icon(item):
    clip = field(item, "clipId")
    return ('<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" style="display: block; overflow: visible">'
            '<defs><clipPath id="' + clip + '"><rect x="-2" y="-2" width="28" height="' + field(item, "clipH") + '"></rect>'
            '</clipPath></defs>'
            + path(item, "ia")
            + '<g style="clip-path: url(#' + clip + ')">' + path(item, "ib", css_class="cb") + path(item, "ib2", css_class="cb2") + '</g>'
            + path(item, "ic", fill=field(item, "fc"), css_class="cc")
            + path(item, "id2", css_class="cd")
            + '</svg>')


def chip(item):
    return ('<button type="button" class="hs-ic" onClick="' + field(item, "pick") + '" aria-pressed="' + field(item, "pressed") + '"'
            ' aria-label="' + field(item, "label") + '" title="' + field(item, "label") + '" style="width: 37px; height: 37px; '
            'display: grid; place-items: center; padding: 0; border: 2px solid ' + field(item, "bd") + '; border-radius: 50%; '
            'background: ' + field(item, "bg") + '; color: ' + field(item, "fg") + '; cursor: pointer">'
            + icon(item) + '</button>')


def render(label, list, item, count):
    container = '<div role="group" aria-label="' + label + '" style="display: flex; gap: 5px">'
    return repeat(container, list, item, count, chip(item))
