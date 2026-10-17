from markup import field, loop_open

PARTS = (("d0", "c0"), ("d1", "c1"), ("d2", "c2"), ("fl", "flC"), ("fc", "fcC"))


def part(item, shape, color):
    return '<path d="' + field(item, shape) + '" style="fill: ' + field(item, color) + '"></path>\n'


def render(list, item):
    width, height = field(item, "w"), field(item, "h")
    return (loop_open(list, item, 0) + '\n'
            '<div style="position: absolute; left: ' + field(item, "left") + 'px; top: ' + field(item, "top") + 'px; '
            'width: ' + width + 'px; height: ' + height + 'px; transform-origin: 50% 100%; '
            'animation: ' + field(item, "anim") + ' ' + field(item, "dur") + 's ease-in-out infinite; '
            'animation-delay: ' + field(item, "delay") + 's">\n'
            '<svg width="' + width + '" height="' + height + '" style="display: block; overflow: visible">\n'
            + "".join(part(item, shape, color) for shape, color in PARTS)
            + '</svg>\n</div>\n</sc-for>')
