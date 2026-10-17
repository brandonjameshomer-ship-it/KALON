SIZES = {"compact": ("12px", "1.4"), "large": ("14px", "1.45")}


def render(size):
    font_size, line_height = SIZES[size]
    return ('<p aria-live="polite" style="display: {{sizeMsgDisp}}; margin: 0; font-size: ' + font_size + '; '
            'line-height: ' + line_height + '; color: #23553f">{{sizeMsg}}</p>')
