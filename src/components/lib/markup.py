import json


def hole(path):
    return "{{" + path + "}}"


def field(item, name):
    return hole(item + "." + name)


def lines(*parts):
    return "\n".join(parts)


def directive(name, **args):
    return "<!--@" + name + " " + json.dumps(args) + "-->"


def grid_style(columns, gap):
    return "display: grid; grid-template-columns: repeat(%d, minmax(0, 1fr)); gap: %s" % (columns, gap)


def loop_open(list, item, count=None):
    hint = "" if count is None else ' hint-placeholder-count="%s"' % count
    return '<sc-for list="' + hole(list) + '" as="' + item + '"' + hint + '>'


def repeat(container, list, item, count, body):
    return lines(container, loop_open(list, item, count), body, "</sc-for>", "</div>")


def heading_style(size, margin="0"):
    font_size, color = {"compact": ("11px", "#5d584f"), "large": ("13px", "#4a463f")}[size]
    return ("margin: " + margin + "; font-size: " + font_size + "; font-weight: 600; letter-spacing: 0.08em; "
            "text-transform: uppercase; color: " + color)


def chevron(rotation, size, color, stroke_width):
    return ('<svg viewBox="0 0 24 24" width="%s" height="%s" aria-hidden="true" style="flex: none; '
            'transform: rotate(%sdeg); transition: transform .2s ease"><path d="M6 9 L12 15 L18 9" '
            'style="fill: none; stroke: %s; stroke-width: %s; stroke-linecap: round; stroke-linejoin: round"></path></svg>'
            % (size, size, hole(rotation), color, stroke_width))
