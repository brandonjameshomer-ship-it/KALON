GOLD = "rgba(214, 156, 72, 0.7)"


def render(left, bottom, size, duration, delay):
    return ('<span style="position: absolute; left: %s%%; bottom: %spx; width: %spx; height: %spx; border-radius: 50%%; '
            'background: %s; box-shadow: 0 0 %spx 2px %s; opacity: 0; animation: hsMote %ss ease-in-out %ss infinite"></span>'
            % (left, bottom, size, size, GOLD, size * 2, GOLD, duration, delay))
