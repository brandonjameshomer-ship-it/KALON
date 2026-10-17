from markup import hole


def render(show, action, label, disabled=None, opacity=None):
    disabled_attr = ' disabled="' + hole(disabled) + '"' if disabled else ""
    opacity_style = "; opacity: " + hole(opacity) if opacity else ""
    return ('<sc-if value="' + hole(show) + '" hint-placeholder-val="{{false}}">\n'
            '<button type="button" onClick="' + hole(action) + '"' + disabled_attr + ' style="height: 42px; padding: 0 14px; '
            'border: 1px solid #cfc9bd; border-radius: 8px; background: #ffffff; color: #1e1c19; font-size: 14px; '
            'font-weight: 500; cursor: pointer' + opacity_style + '">' + label + '</button>\n'
            '</sc-if>')
