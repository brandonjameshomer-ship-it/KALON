from markup import hole


def render(label, readout, value, on_change, min, max, step, aria_label):
    return ('<div style="display: flex; flex-direction: column; gap: 4px">\n'
            '<div style="display: flex; justify-content: space-between; font-size: 12px">'
            '<span style="color: #5d584f">' + label + '</span>'
            '<span style="font-weight: 600; font-variant-numeric: tabular-nums">' + hole(readout) + '</span></div>\n'
            '<input type="range" min="' + min + '" max="' + max + '" step="' + step + '" value="' + hole(value) + '" '
            'onChange="' + hole(on_change) + '" aria-label="' + aria_label + '" '
            'style="width: 100%; height: 28px; margin: 0; accent-color: {{accent}}">\n'
            '</div>')
