from markup import hole


def render(action, icon, label):
    return ('<button type="button" onClick="' + hole(action) + '" style="flex: none; height: 40px; padding: 0 14px; '
            'display: flex; align-items: center; gap: 7px; border: 2px solid {{accent}}; border-radius: 10px; '
            'background: #ffffff; color: {{accent}}; font-size: 14px; font-weight: 600; cursor: pointer">'
            '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="' + icon + '" '
            'style="fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; '
            'stroke-linejoin: round"></path></svg><span>' + label + '</span></button>')
