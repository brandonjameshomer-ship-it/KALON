from markup import heading_style

TAGS = {"compact": "h2", "large": "h3"}


def render(text, size, margin="0"):
    tag = TAGS[size]
    return "<" + tag + ' style="' + heading_style(size, margin) + '">' + text + "</" + tag + ">"
