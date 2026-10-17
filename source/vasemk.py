def vase_body(big):
    bh = '44px' if big else '36px'; fs = '15px' if big else '12px'
    lab = 'font-size: 14px; color: #3d3a34' if big else 'font-size: 12px; font-weight: 600; color: #3d3a34'
    bw = '2px' if big else '1px'
    pre = 'zv' if big else 'zev'
    BTN = 'width: 36px; height: 36px; border: 0; border-radius: 8px; background: #f1ede5; font-size: 20px; color: #1e1c19; cursor: pointer'
    box = 'padding: 8px; border: 1px solid #d8d1c4; border-radius: 10px; background: #ffffff' if big else 'padding: 6px 8px; border: 1px solid #d8d1c4; border-radius: 8px; background: #ffffff'
    def chips(lst, alias, cols):
        return (f'<div style="display: grid; grid-template-columns: repeat({cols}, minmax(0, 1fr)); gap: 6px">\n'
                f'<sc-for list="{{{{{lst}}}}}" as="{alias}" hint-placeholder-count="{cols}">\n'
                f'<button type="button" onClick="{{{{{alias}.pick}}}}" aria-pressed="{{{{{alias}.pressed}}}}" style="height: {bh}; border: {bw} solid {{{{{alias}.bd}}}}; border-radius: 10px; background: {{{{{alias}.bg}}}}; color: #1e1c19; font-size: {fs}; cursor: pointer">{{{{{alias}.label}}}}</button>\n'
                f'</sc-for>\n</div>\n')
    k = pre + 'k'
    t = (f'<div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6px">\n'
         f'<sc-for list="{{{{vaseKindChips}}}}" as="{k}" hint-placeholder-count="2">\n'
         f'<button type="button" onClick="{{{{{k}.pick}}}}" aria-pressed="{{{{{k}.pressed}}}}" style="min-height: {bh}; padding: 4px 8px; display: flex; align-items: center; justify-content: center; gap: 8px; border: {bw} solid {{{{{k}.bd}}}}; border-radius: 10px; background: {{{{{k}.bg}}}}; color: #1e1c19; font-size: {fs}; line-height: 1.2; cursor: pointer"><svg viewBox="-8 -19 16 20" width="14" height="18" aria-hidden="true" style="flex: none"><path d="{{{{{k}.icon}}}}" style="fill: {{{{{k}.fill}}}}"></path></svg><span>{{{{{k}.label}}}}</span></button>\n'
         f'</sc-for>\n</div>\n'
         f'<div style="display: {{{{vaseOnDisp}}}}; flex-direction: column; gap: 10px">\n'
         f'<span style="{lab}">{{{{vaseSideTitle}}}}</span>\n' + chips('vaseSideChips', pre + 's', 2) +
         f'<div style="display: {{{{vaseLyDisp}}}}; flex-direction: column; gap: 6px">\n<span style="{lab}">Side vases at the</span>\n' + chips('vaseLyChips', pre + 'l', 3) + '</div>\n')
    if big:
        t += (f'<div style="display: {{{{vaseRiseDisp}}}}; flex-direction: column; gap: 6px">\n<span style="{lab}">Side vase height</span>\n' + chips('vaseHtChips', 'zvh', 4) + '</div>\n')
    else:
        t += (f'<div role="group" aria-label="Side vase height" style="display: {{{{vaseRiseDisp}}}}; align-items: center; justify-content: space-between; gap: 10px; {box}">\n'
              f'<span style="display: flex; flex-direction: column; gap: 1px"><span style="font-size: 12px; color: #4a463f">Side vase height</span><span style="font-size: 13px; font-weight: 600; color: #1e1c19">{{{{vaseRiseLabel}}}}</span></span>\n'
              f'<span style="display: flex; gap: 6px; flex: none"><button type="button" onClick="{{{{vaseUp}}}}" aria-label="Move the side vases up" style="{BTN}">↑</button><button type="button" onClick="{{{{vaseDown}}}}" aria-label="Move the side vases down" style="{BTN}">↓</button></span>\n</div>\n')
    t += (f'<span style="{lab}">{{{{vaseFrontTitle}}}}</span>\n' + chips('vaseFrontChips', pre + 'f', 3) +
          f'<div role="group" aria-label="Vase size" style="display: flex; align-items: center; justify-content: space-between; gap: 10px; {box}">\n'
          f'<span style="display: flex; flex-direction: column; gap: 1px"><span style="font-size: 13px; color: #4a463f">Vase size</span><span style="font-size: 15px; font-weight: 600; color: #1e1c19">{{{{vaseSizeLabel}}}}</span></span>\n'
          f'<span style="display: flex; gap: 6px; flex: none"><button type="button" onClick="{{{{vaseSmaller}}}}" aria-label="Smaller vases" style="{BTN}">−</button><button type="button" onClick="{{{{vaseLarger}}}}" aria-label="Larger vases" style="{BTN}">+</button></span>\n</div>\n'
          '</div>')
    return t
