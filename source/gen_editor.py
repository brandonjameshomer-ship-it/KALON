# Builds the full editor's two side panels.
H3 = 'margin: 0; font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #5d584f'
SMALL = 'font-size: 12px; color: #5d584f'
PILL = 'height: 36px; padding: 0 10px; border: 1px solid {bd}; border-radius: 8px; background: {bg}; color: #1e1c19; font-size: 12px; cursor: pointer'
STEP = 'width: 34px; height: 34px; border: 0; border-radius: 8px; background: #f1ede5; font-size: 18px; color: #1e1c19; cursor: pointer'
CHEV = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" style="flex: none; transform: rotate({rot}deg); transition: transform .2s ease"><path d="M6 9 L12 15 L18 9" style="fill: none; stroke: #5d584f; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round"></path></svg>'

def acc(key, title, body, pad='20px'):
    a = '{{ac.%s.' % key
    return f'''<section style="border-bottom: 1px solid #e4dfd5">
<button type="button" onClick="{a}toggle}}}}" aria-expanded="{a}exp}}}}" style="width: 100%; min-height: 54px; display: flex; align-items: center; gap: 10px; padding: 8px {pad}; border: 0; background: transparent; cursor: pointer; text-align: left; color: #1e1c19">
<span style="flex-grow: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px"><span style="{H3}">{title}</span><span style="font-size: 13px; color: #1e1c19; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{a}sum}}}}</span></span>
{CHEV.format(rot=a + 'rot}}')}
</button>
<div style="display: {a}disp}}}}; flex-direction: column; gap: 12px; padding: 0 {pad} 18px">
{body}
</div>
</section>'''

def stepper(label, minus, plus, value, aria_m, aria_p, extra=''):
    return f'''<div role="group" aria-label="{label}" style="display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 6px 8px; border: 1px solid #d8d1c4; border-radius: 10px; background: #ffffff">
<div style="display: flex; flex-direction: column; gap: 1px; min-width: 0"><span style="{SMALL}">{label}</span><span style="font-size: 14px; font-weight: 600; color: #1e1c19; white-space: nowrap">{{{{{value}}}}}</span>{extra}</div>
<div style="display: flex; gap: 6px; flex: none"><button type="button" onClick="{{{{{minus}}}}}" aria-label="{aria_m}" style="{STEP}">−</button><button type="button" onClick="{{{{{plus}}}}}" aria-label="{aria_p}" style="{STEP}">+</button></div>
</div>'''

# ---------------- LEFT: the stone and the big decisions ----------------
typeB = '''<div style="display: flex; flex-direction: column; gap: 6px">
<sc-for list="{{typeCards}}" as="zety" hint-placeholder-count="5">
<button type="button" onClick="{{zety.pick}}" aria-pressed="{{zety.pressed}}" title="{{zety.desc}}" style="display: flex; gap: 10px; align-items: center; padding: 6px 10px; border: 1px solid {{zety.bd}}; border-radius: 10px; background: {{zety.bg}}; text-align: left; cursor: pointer; color: #1e1c19">
<svg viewBox="0 0 80 50" width="48" height="30" aria-hidden="true" style="flex-shrink: 0"><path d="M4 44 H76" style="fill: none; stroke: #9d968a; stroke-width: 1.5; stroke-linecap: round"></path><path d="{{zety.icon}}" style="fill: {{zety.fill}}"></path></svg>
<span style="display: flex; flex-direction: column; gap: 1px; min-width: 0"><span style="font-size: 13px; font-weight: 600">{{zety.label}}</span><span style="font-size: 11px; color: #5d584f; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{{zety.size}}</span></span>
</button>
</sc-for>
</div>'''

shapeB = '''<div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 6px">
<sc-for list="{{shapeStd}}" as="zesh" hint-placeholder-count="6">
<button type="button" onClick="{{zesh.pick}}" aria-pressed="{{zesh.pressed}}" aria-label="{{zesh.label}}" style="height: 60px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; border: 1px solid {{zesh.bd}}; border-radius: 8px; background: {{zesh.bg}}; cursor: pointer">
<svg viewBox="-1 -1 38 26" width="34" height="23" aria-hidden="true"><path d="{{zesh.d}}" style="fill: {{zesh.fill}}"></path></svg>
<span style="font-size: 11px; color: #3d3a34">{{zesh.label}}</span>
</button>
</sc-for>
</div>
<span style="display: {{shapeFreeDisp}}; ''' + SMALL + '''">Special shapes, cut to order</span>
<div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 6px">
<sc-for list="{{shapeMore}}" as="zesm" hint-placeholder-count="6">
<button type="button" onClick="{{zesm.pick}}" aria-pressed="{{zesm.pressed}}" aria-label="{{zesm.label}}" style="height: 60px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; border: 1px solid {{zesm.bd}}; border-radius: 8px; background: {{zesm.bg}}; cursor: pointer">
<svg viewBox="-1 -1 38 26" width="34" height="23" aria-hidden="true"><path d="{{zesm.d}}" style="fill: {{zesm.fill}}"></path></svg>
<span style="font-size: 11px; color: #3d3a34">{{zesm.label}}</span>
</button>
</sc-for>
</div>
<sc-if value="{{mirrorShow}}" hint-placeholder-val="{{false}}">
<button type="button" onClick="{{toggleMirror}}" aria-pressed="{{mirrorPressed}}" style="min-height: 44px; padding: 6px 10px; display: flex; align-items: center; gap: 10px; border: 1px solid {{mirrorBd}}; border-radius: 10px; background: {{mirrorBg}}; color: #1e1c19; text-align: left; font-size: 12px; cursor: pointer">
<svg viewBox="-1 -1 38 26" width="30" height="20" aria-hidden="true" style="flex-shrink: 0"><path d="{{mirrorD}}" style="fill: {{mirrorFill}}"></path></svg>
<span>Mirror the shape on the bottom edge</span>
</button>
</sc-if>'''

sizeB = (stepper('Width', 'wMinus', 'wPlus', 'wLabel', 'Make the stone 2 inches narrower', 'Make the stone 2 inches wider') + '\n' +
         stepper('Height', 'hMinus', 'hPlus', 'hLabel', 'Make the stone 1 inch shorter', 'Make the stone 1 inch taller') + '''
<div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6px">
<button type="button" onClick="{{bestSize}}" title="Resize the stone to suit the lettering" style="min-height: 40px; padding: 4px 8px; border: 1px solid {{accent}}; border-radius: 8px; background: #ffffff; color: {{accent}}; font-size: 12px; font-weight: 600; line-height: 1.25; cursor: pointer">Best stone size</button>
<button type="button" onClick="{{fitLettering}}" title="Resize the lettering to suit the stone" style="min-height: 40px; padding: 4px 8px; border: 1px solid {{accent}}; border-radius: 8px; background: #ffffff; color: {{accent}}; font-size: 12px; font-weight: 600; line-height: 1.25; cursor: pointer">Best lettering fit</button>
</div>
<p aria-live="polite" style="display: {{sizeMsgDisp}}; margin: 0; font-size: 12px; line-height: 1.4; color: #23553f">{{sizeMsg}}</p>''')

graniteB = '''<div style="display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 6px">
<sc-for list="{{graniteCards}}" as="zegr" hint-placeholder-count="5">
<button type="button" onClick="{{zegr.pick}}" aria-pressed="{{zegr.pressed}}" aria-label="{{zegr.label}}" title="{{zegr.label}}: {{zegr.note}}" style="padding: 0; display: flex; flex-direction: column; align-items: center; gap: 4px; border: 0; background: transparent; cursor: pointer">
<span style="width: 42px; height: 42px; border-radius: 50%; border: 3px solid {{zegr.bd}}; background: {{zegr.swatch}}"></span>
<span style="font-size: 10px; line-height: 1.15; text-align: center; color: #3d3a34">{{zegr.label}}</span>
</button>
</sc-for>
</div>
<div style="display: {{baseShowDisp}}; flex-direction: column; gap: 8px; padding-top: 10px; border-top: 1px solid #ebe7de">
<span style="''' + H3 + '''">Base</span>
''' + stepper('Extends past the stone', 'baseOverMinus', 'baseOverPlus', 'baseOverLabel', 'Narrower base', 'Wider base') + '''
<div style="display: {{baseDepthDisp}}; flex-direction: column; gap: 8px">
''' + stepper('Depth, front to back', 'baseDepthMinus', 'baseDepthPlus', 'baseDepthLabel', 'Shallower base', 'Deeper base') + '''
</div>
<div style="display: {{baseSizeDisp}}; flex-direction: column; gap: 8px">
''' + stepper('Height', 'baseHtMinus', 'baseHtPlus', 'baseHtLabel', 'Lower base', 'Taller base') + '''
</div>
<div style="display: {{baseOnDisp}}; flex-direction: column; gap: 8px">
<span style="''' + SMALL + '''">Base granite</span>
<div style="display: flex; flex-wrap: wrap; gap: 6px">
<sc-for list="{{baseMats}}" as="zebg" hint-placeholder-count="6">
<button type="button" onClick="{{zebg.pick}}" aria-pressed="{{zebg.pressed}}" aria-label="Base: {{zebg.label}}" title="{{zebg.label}}" style="width: 30px; height: 30px; padding: 0; border-radius: 50%; border: 3px solid {{zebg.ring}}; background: {{zebg.swatch}}; cursor: pointer"></button>
</sc-for>
</div>
</div>
</div>'''

surfB = '''<div style="display: {{reverseDisp}}; flex-direction: column; gap: 8px; padding: 10px; border-radius: 10px; background: #f4efe4; border: 1px solid #e0d6c2">
<span style="font-size: 12px; line-height: 1.45; color: #3d3a34">{{reverseText}}</span>
<button type="button" onClick="{{useReverse}}" aria-pressed="{{reversePressed}}" style="align-self: flex-start; height: 34px; padding: 0 12px; border: 1px solid {{accent}}; border-radius: 8px; background: #ffffff; color: {{accent}}; font-size: 12px; font-weight: 600; cursor: pointer">{{reverseBtn}}</button>
</div>
<span style="''' + SMALL + '''">Stone surface</span>
<div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 6px">
<sc-for list="{{surfaceCards}}" as="zesu" hint-placeholder-count="3">
<button type="button" onClick="{{zesu.pick}}" aria-pressed="{{zesu.pressed}}" title="{{zesu.note}}" style="padding: 6px; display: flex; flex-direction: column; gap: 5px; border: 1px solid {{zesu.bd}}; border-radius: 8px; background: {{zesu.bg}}; color: #1e1c19; text-align: left; cursor: pointer">
<span style="height: 28px; border-radius: 6px; background: {{zesu.swatch}}; box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.18)"></span>
<span style="font-size: 12px; font-weight: 600">{{zesu.label}}</span>
</button>
</sc-for>
</div>
<span style="''' + SMALL + '''">Edges</span>
<div style="display: flex; flex-wrap: wrap; gap: 6px">
<sc-for list="{{edgeChips}}" as="zeed" hint-placeholder-count="2">
<button type="button" onClick="{{zeed.pick}}" aria-pressed="{{zeed.pressed}}" style="''' + PILL.format(bd='{{zeed.bd}}', bg='{{zeed.bg}}') + '''">{{zeed.label}}</button>
</sc-for>
</div>
<div style="display: {{baseOnDisp}}; flex-direction: column; gap: 8px; padding-top: 10px; border-top: 1px solid #ebe7de">
<span style="''' + SMALL + '''">Base finish</span>
<div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 6px">
<sc-for list="{{baseSurfCards}}" as="zebs" hint-placeholder-count="3">
<button type="button" onClick="{{zebs.pick}}" aria-pressed="{{zebs.pressed}}" style="padding: 6px; display: flex; flex-direction: column; gap: 5px; border: 1px solid {{zebs.bd}}; border-radius: 8px; background: {{zebs.bg}}; color: #1e1c19; text-align: left; cursor: pointer">
<span style="height: 20px; border-radius: 6px; background: {{zebs.swatch}}; box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.18)"></span>
<span style="font-size: 12px; font-weight: 600">{{zebs.label}}</span>
</button>
</sc-for>
</div>
<div style="display: flex; flex-wrap: wrap; gap: 6px">
<sc-for list="{{baseEdgeChips}}" as="zebe" hint-placeholder-count="2">
<button type="button" onClick="{{zebe.pick}}" aria-pressed="{{zebe.pressed}}" style="''' + PILL.format(bd='{{zebe.bd}}', bg='{{zebe.bg}}') + '''">{{zebe.label}}</button>
</sc-for>
</div>
</div>'''

def laycards(lst, al):
    return f'''<div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6px">
<sc-for list="{{{{{lst}}}}}" as="{al}" hint-placeholder-count="2">
<button type="button" onClick="{{{{{al}.pick}}}}" aria-pressed="{{{{{al}.pressed}}}}" title="{{{{{al}.desc}}}}" style="padding: 6px; display: flex; flex-direction: column; gap: 4px; border: 1px solid {{{{{al}.bd}}}}; border-radius: 8px; background: {{{{{al}.bg}}}}; color: #1e1c19; text-align: left; cursor: pointer">
<svg viewBox="{{{{{al}.vb}}}}" width="100%" height="54" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
<path d="{{{{{al}.stoneD}}}}" style="fill: {{{{{al}.face}}}}"></path>
<path d="{{{{{al}.photoD}}}}" style="fill: {{{{{al}.ink}}}}; opacity: 0.5"></path>
<path d="{{{{{al}.symD}}}}" style="fill: {{{{{al}.ink}}}}; opacity: 0.8"></path>
<path d="{{{{{al}.textD}}}}" style="fill: {{{{{al}.ink}}}}"></path>
</svg>
<span style="font-size: 12px; font-weight: 600; line-height: 1.25">{{{{{al}.label}}}}</span>
</button>
</sc-for>
</div>'''

layoutB = ('<span style="' + SMALL + '">Symmetrical</span>\n' + laycards('layoutSym', 'zel1') + '''
<div style="display: flex; align-items: center; justify-content: space-between; gap: 8px"><span style="''' + SMALL + '''">Asymmetrical</span><button type="button" onClick="{{toggleFlip}}" aria-pressed="{{flipPressed}}" style="height: 32px; padding: 0 10px; display: flex; align-items: center; gap: 6px; border: 1px solid {{flipBd}}; border-radius: 8px; background: {{flipBg}}; color: #1e1c19; font-size: 12px; font-weight: 600; cursor: pointer"><svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M12 3 V21 M9 7 L4 12 L9 17 Z M15 7 L20 12 L15 17 Z" style="fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linejoin: round; stroke-linecap: round"></path></svg><span>{{flipLabel}}</span></button></div>
''' + laycards('layoutAsym', 'zel2') + '''
<div style="display: flex; flex-direction: column; gap: 8px; padding: 10px; border-radius: 10px; background: #f4efe4; border: 1px solid #e0d6c2">
<span style="font-size: 12px; line-height: 1.45; color: #3d3a34">{{adjNote}}</span>
<label style="display: flex; align-items: flex-start; gap: 8px; font-size: 12px; line-height: 1.4; color: #1e1c19; cursor: pointer">
<input type="checkbox" checked="{{keepAdj}}" onChange="{{toggleKeepAdj}}" style="width: 18px; height: 18px; margin: 0; flex: none; accent-color: {{accent}}">
<span>Keep my moves and resizes when I switch layouts</span>
</label>
<div style="display: flex; flex-wrap: wrap; gap: 6px">
<button type="button" onClick="{{resetLayout}}" disabled="{{resetDisabled}}" style="height: 34px; padding: 0 12px; border: 1px solid {{accent}}; border-radius: 8px; background: #ffffff; color: {{accent}}; font-size: 12px; font-weight: 600; cursor: pointer; opacity: {{resetOpacity}}">Reset to the layout</button>
<button type="button" onClick="{{restoreRemoved}}" style="display: {{restoreDisp}}; height: 34px; padding: 0 12px; border: 1px solid #cfc9bd; border-radius: 8px; background: #ffffff; color: #1e1c19; font-size: 12px; cursor: pointer">{{restoreLabel}}</button>
</div>
</div>''')

letterB = ('''<span style="''' + SMALL + '''">Typeface theme</span>
<div style="display: flex; flex-direction: column; gap: 6px">
<sc-for list="{{fontCards}}" as="zefo" hint-placeholder-count="5">
<button type="button" onClick="{{zefo.pick}}" aria-pressed="{{zefo.pressed}}" title="{{zefo.desc}}" style="padding: 6px 10px; display: flex; align-items: baseline; justify-content: space-between; gap: 8px; border: 1px solid {{zefo.bd}}; border-radius: 8px; background: {{zefo.bg}}; color: #1e1c19; text-align: left; cursor: pointer">
<span style="font-family: {{zefo.f1}}; font-style: {{zefo.s1}}; font-size: 16px; line-height: 1.2; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{{zefo.label}}</span>
<span style="font-family: {{zefo.f2}}; font-style: {{zefo.s2}}; font-size: 15px; color: #4a463f; flex: none">Aa</span>
</button>
</sc-for>
</div>
''' + stepper('All lettering size', 'textMinus', 'textPlus', 'textSizeLabel', 'Smaller lettering', 'Larger lettering') + '\n' +
  stepper('Space between lines', 'spaceMinus', 'spacePlus', 'spacingLabel', 'Closer spacing', 'More spacing') + '''
<button type="button" onClick="{{fitLettering}}" style="height: 38px; padding: 0 12px; border: 1px solid {{accent}}; border-radius: 8px; background: #ffffff; color: {{accent}}; font-size: 13px; font-weight: 600; cursor: pointer">Best lettering fit for this stone</button>
<p aria-live="polite" style="display: {{sizeMsgDisp}}; margin: 0; font-size: 12px; line-height: 1.4; color: #23553f">{{sizeMsg}}</p>
<div role="group" aria-label="Position on the stone" style="display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 6px 8px; border: 1px solid #d8d1c4; border-radius: 10px; background: #ffffff">
<div style="display: flex; flex-direction: column; gap: 1px; min-width: 0"><span style="''' + SMALL + '''">Position on the stone</span><span style="font-size: 14px; font-weight: 600; color: #1e1c19">{{vposLabel}}</span></div>
<div style="display: flex; gap: 6px; flex: none"><button type="button" onClick="{{vposUp}}" aria-label="Move all lettering up" style="''' + STEP + '''">↑</button><button type="button" onClick="{{vposDown}}" aria-label="Move all lettering down" style="''' + STEP + '''">↓</button></div>
</div>''')

histB = '''<div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6px">
<button type="button" onClick="{{undo}}" disabled="{{undoDisabled}}" title="{{undoTitle}}" style="height: 38px; display: flex; align-items: center; justify-content: center; gap: 6px; border: 1px solid #cfc9bd; border-radius: 8px; background: #ffffff; color: #1e1c19; font-size: 13px; font-weight: 600; cursor: pointer; opacity: {{undoOpacity}}"><svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M9 14 L4 9 L9 4 M4 9 H14 Q20 9 20 15 Q20 20 14 20 H10" style="fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round"></path></svg><span>Undo</span></button>
<button type="button" onClick="{{redo}}" disabled="{{redoDisabled}}" title="{{redoTitle}}" style="height: 38px; display: flex; align-items: center; justify-content: center; gap: 6px; border: 1px solid #cfc9bd; border-radius: 8px; background: #ffffff; color: #1e1c19; font-size: 13px; font-weight: 600; cursor: pointer; opacity: {{redoOpacity}}"><span>Redo</span><svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M15 14 L20 9 L15 4 M20 9 H10 Q4 9 4 15 Q4 20 10 20 H14" style="fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round"></path></svg></button>
</div>
<span style="font-size: 11px; color: #5d584f">Ctrl+Z to undo · Ctrl+Shift+Z to redo · arrow keys nudge the selected part</span>
<ol aria-label="Change history" style="margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 2px; max-height: 260px; overflow-y: auto">
<sc-for list="{{histRows}}" as="zehi" hint-placeholder-count="4">
<li style="display: flex">
<button type="button" onClick="{{zehi.go}}" aria-current="{{zehi.current}}" style="flex-grow: 1; min-height: 32px; display: flex; align-items: center; gap: 8px; padding: 4px 8px; border: 0; border-radius: 6px; background: {{zehi.bg}}; color: {{zehi.fg}}; font-size: 12px; text-align: left; cursor: pointer; text-decoration: {{zehi.deco}}">
<span style="width: 8px; height: 8px; flex: none; border-radius: 50%; background: {{zehi.dot}}"></span>
<span style="flex-grow: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{{zehi.label}}</span>
</button>
</li>
</sc-for>
</ol>'''

old_ed = open('editor_cur.html').read()
_ri = old_ed.index('<aside aria-label="Layers, measurements and handoff"')
_ro = old_ed[_ri:]
_m0 = _ro.index('<sc-if value="{{isTabMeasure}}"')
_m1 = _ro.rindex('</div>\n</aside>')
measHand = _ro[_m0:_m1].replace('grid-template-columns: minmax(0, 1fr) 48px 48px 48px 48px', 'grid-template-columns: minmax(0, 1fr) 40px 40px 40px 40px')
left = ('''<aside aria-label="The stone, measurements and handoff" style="position: absolute; left: 0; top: 64px; width: 300px; height: 836px; box-sizing: border-box; display: flex; flex-direction: column; background: #fbfaf7; border-right: 1px solid #dcd7cc; z-index: 10; transform: translateX({{lpX}}px); visibility: {{panelVis}}; transition: {{panelTrans}}">
<div role="tablist" aria-label="Panels" style="display: flex; gap: 2px; padding: 8px 12px 0; border-bottom: 1px solid #dcd7cc; flex: none">
<sc-for list="{{ltabs}}" as="zelt" hint-placeholder-count="3">
<button type="button" role="tab" onClick="{{zelt.pick}}" aria-selected="{{zelt.pressed}}" style="flex-grow: 1; height: 42px; border: 0; border-bottom: 2px solid {{zelt.bd}}; background: transparent; color: {{zelt.fg}}; font-size: 13px; font-weight: 600; cursor: pointer">{{zelt.label}}</button>
</sc-for>
</div>
<div style="flex-grow: 1; overflow-y: auto; direction: rtl">
<div style="direction: ltr">
<sc-if value="{{isLTabDesign}}" hint-placeholder-val="{{true}}">
<div>
''' + acc('type', 'Headstone type', typeB) + '\n' + acc('shape', 'Shape', shapeB) + '\n' + acc('size', 'Size', sizeB) + '\n' + acc('vases', 'Flower vases', open('vase_editor.html').read()) + '\n' +
  acc('granite', 'Granite &amp; base', graniteB) + '\n' + acc('surface', 'Surface &amp; edges', surfB) + '\n' + acc('layout', 'Layout', layoutB) + '\n' +
  acc('lettering', 'Lettering', letterB) + '\n' + acc('history', 'History', histB) + '''
</div>
</sc-if>
<div style="padding: 16px 20px 28px; display: {{lMeasDisp}}; flex-direction: column">
''' + measHand + '''
</div>
</div>
</div>
</aside>''')

# ---------------- RIGHT: layers and the selected layer ----------------
old = open('editor_cur.html').read()
ri = old.index('<aside aria-label="Layers, measurements and handoff"')
right_old = old[ri:]
# Layers tab content is replaced; Measurements and Handoff are kept as they are.
lt0 = right_old.index('<sc-if value="{{isTabLayers}}"')
lt1 = right_old.index('<sc-if value="{{isTabMeasure}}"')

INS = lambda key, title, body: acc(key, title, body, pad='0px').replace('border-bottom: 1px solid #e4dfd5', 'border-top: 1px solid #e4dfd5')

textStyle = '''<span style="''' + SMALL + '''">Typeface</span>
<div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 6px">
<sc-for list="{{fontPills}}" as="fp" hint-placeholder-count="6">
<button type="button" onClick="{{fp.pick}}" aria-pressed="{{fp.pressed}}" style="height: 50px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; border: 1px solid {{fp.bd}}; border-radius: 8px; background: {{fp.bg}}; color: #1e1c19; cursor: pointer">
<span style="font-family: {{fp.family}}; font-style: {{fp.fstyle}}; font-size: 19px; line-height: 1">Aa</span>
<span style="font-size: 10px; color: #3d3a34">{{fp.label}}</span>
</button>
</sc-for>
</div>
<div style="display: flex; flex-direction: column; gap: 4px">
<div style="display: flex; justify-content: space-between; font-size: 12px"><span style="color: #5d584f">Letter height (capitals)</span><span style="font-weight: 600; font-variant-numeric: tabular-nums">{{selHtLabel}}</span></div>
<input type="range" min="0.5" max="4" step="0.05" value="{{selHt}}" onChange="{{onHt}}" aria-label="Letter height in inches" style="width: 100%; height: 28px; margin: 0; accent-color: {{accent}}">
</div>
<div style="display: flex; flex-direction: column; gap: 4px">
<div style="display: flex; justify-content: space-between; font-size: 12px"><span style="color: #5d584f">Letter spacing</span><span style="font-weight: 600; font-variant-numeric: tabular-nums">{{selTrackLabel}}</span></div>
<input type="range" min="0" max="0.4" step="0.01" value="{{selTrack}}" onChange="{{onTrack}}" aria-label="Letter spacing in em" style="width: 100%; height: 28px; margin: 0; accent-color: {{accent}}">
</div>'''

textContent = '''<label style="display: flex; flex-direction: column; gap: 6px">
<span style="''' + SMALL + '''">Inscription (one line per row, up to 4)</span>
<textarea rows="2" value="{{selText}}" onChange="{{onText}}" style="box-sizing: border-box; padding: 10px 12px; resize: vertical; border: 1px solid #cfc9bd; border-radius: 8px; background: #ffffff; font-size: 14px; line-height: 1.45; color: #1e1c19"></textarea>
</label>'''

datesContent = '''<div style="display: {{selWhoDisp}}; flex-direction: column; gap: 6px">
<span style="''' + SMALL + '''">Whose dates</span>
<div style="display: flex; flex-wrap: wrap; gap: 6px">
<sc-for list="{{selWhoChips}}" as="zewh" hint-placeholder-count="2">
<button type="button" onClick="{{zewh.pick}}" aria-pressed="{{zewh.pressed}}" style="''' + PILL.format(bd='{{zewh.bd}}', bg='{{zewh.bg}}') + '''">{{zewh.label}}</button>
</sc-for>
</div>
</div>
<span style="''' + SMALL + '''">Quick format</span>
<div style="display: flex; flex-direction: column; gap: 6px">
<sc-for list="{{selDateFmts}}" as="zedt" hint-placeholder-count="4">
<button type="button" onClick="{{zedt.pick}}" aria-pressed="{{zedt.pressed}}" style="min-height: 40px; padding: 6px 12px; border: 1px solid {{zedt.bd}}; border-radius: 8px; background: {{zedt.bg}}; color: #1e1c19; font-family: 'EB Garamond', Georgia, serif; font-size: 15px; text-align: left; cursor: pointer; white-space: pre-line">{{zedt.label}}</button>
</sc-for>
</div>
<label style="display: flex; align-items: center; gap: 8px; font-size: 13px; color: #1e1c19; cursor: pointer">
<input type="checkbox" checked="{{selDateStack}}" onChange="{{toggleDateStack}}" style="width: 18px; height: 18px; margin: 0; accent-color: {{accent}}">
<span>One date per line</span>
</label>
<span style="''' + SMALL + '''">Words with the dates</span>
<div style="display: flex; flex-wrap: wrap; gap: 6px">
<sc-for list="{{selDateWords}}" as="zedw" hint-placeholder-count="6">
<button type="button" onClick="{{zedw.pick}}" aria-pressed="{{zedw.pressed}}" style="''' + PILL.format(bd='{{zedw.bd}}', bg='{{zedw.bg}}') + '''">{{zedw.label}}</button>
</sc-for>
</div>
<div style="display: {{selDwCustomDisp}}; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6px">
<label style="display: flex; flex-direction: column; gap: 3px"><span style="font-size: 11px; color: #5d584f">Before the first date</span><input type="text" value="{{selDwA}}" onChange="{{onSelDwA}}" placeholder="Born" style="height: 36px; box-sizing: border-box; padding: 0 10px; border: 1px solid #cfc9bd; border-radius: 8px; background: #ffffff; font-size: 13px; color: #1e1c19; width: 100%"></label>
<label style="display: flex; flex-direction: column; gap: 3px"><span style="font-size: 11px; color: #5d584f">Before the second date</span><input type="text" value="{{selDwB}}" onChange="{{onSelDwB}}" placeholder="Passed" style="height: 36px; box-sizing: border-box; padding: 0 10px; border: 1px solid #cfc9bd; border-radius: 8px; background: #ffffff; font-size: 13px; color: #1e1c19; width: 100%"></label>
</div>
<button type="button" onClick="{{dateUseAuto}}" style="display: {{dateAutoDisp}}; align-self: flex-start; padding: 0; border: 0; background: transparent; color: {{accent}}; font-size: 12px; font-weight: 600; text-decoration: underline; cursor: pointer">Go back to the formatted dates</button>
<details style="font-size: 12px; color: #5d584f"><summary style="cursor: pointer; min-height: 28px">Type the dates myself</summary>
<textarea rows="2" value="{{selText}}" onChange="{{onText}}" aria-label="Dates as carved" style="box-sizing: border-box; width: 100%; margin-top: 6px; padding: 8px 10px; resize: vertical; border: 1px solid #cfc9bd; border-radius: 8px; background: #ffffff; font-size: 14px; line-height: 1.45; color: #1e1c19"></textarea>
</details>'''

symContent = '''<span style="''' + SMALL + '''">Choose an icon</span>
<div style="display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 6px">
<sc-for list="{{symbolSwap}}" as="ss" hint-placeholder-count="12">
<button type="button" onClick="{{ss.pick}}" aria-pressed="{{ss.pressed}}" aria-label="{{ss.label}}" title="{{ss.label}}" style="height: 42px; display: flex; align-items: center; justify-content: center; border: 1px solid {{ss.bd}}; border-radius: 8px; background: {{ss.bg}}; cursor: pointer; padding: 0">
<svg viewBox="0 0 100 100" width="24" height="24" aria-hidden="true"><path d="{{ss.d}}" style="fill: {{ss.fill}}; stroke: {{ss.stroke}}; stroke-width: {{ss.sw}}; fill-rule: evenodd; stroke-linecap: round; stroke-linejoin: round"></path></svg>
</button>
</sc-for>
</div>
<div style="display: flex; flex-direction: column; gap: 4px">
<div style="display: flex; justify-content: space-between; font-size: 12px"><span style="color: #5d584f">Symbol size</span><span style="font-weight: 600; font-variant-numeric: tabular-nums">{{selSizeLabel}}</span></div>
<input type="range" min="1" max="12" step="0.1" value="{{selSize}}" onChange="{{onSize}}" aria-label="Symbol size in inches" style="width: 100%; height: 28px; margin: 0; accent-color: {{accent}}">
</div>'''

photoContent = '''<sc-for list="{{photoGroups}}" as="zeph" hint-placeholder-count="1">
<div style="display: flex; flex-direction: column; gap: 6px">
<span style="font-size: 12px; font-weight: 600; color: #3d3a34">{{zeph.title}}</span>
<div style="display: flex; flex-wrap: wrap; gap: 6px">
<sc-for list="{{zeph.photos}}" as="zepp" hint-placeholder-count="2">
<button type="button" onClick="{{zepp.pick}}" aria-pressed="{{zepp.pressed}}" aria-label="{{zepp.label}}" style="width: 52px; height: 52px; padding: 2px; border: 2px solid {{zepp.bd}}; border-radius: 8px; background: #ffffff; cursor: pointer">
<img src="{{zepp.url}}" alt="" style="width: 100%; height: 100%; object-fit: cover; display: block; border-radius: 5px">
</button>
</sc-for>
<label title="Upload a photo of {{zeph.who}}" style="position: relative; width: 52px; height: 52px; display: flex; align-items: center; justify-content: center; border: 1px dashed #b3ab9c; border-radius: 8px; background: #ffffff; cursor: pointer">
<input type="file" accept="image/*" multiple="{{yes}}" onChange="{{zeph.onFiles}}" aria-label="Upload a photo of {{zeph.who}}" style="position: absolute; left: 0; top: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer">
<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M12 16 V4 M7 9 L12 4 L17 9 M4 15 V19 Q4 20 5 20 H19 Q20 20 20 19 V15" style="fill: none; stroke: {{accent}}; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round"></path></svg>
</label>
</div>
<span style="display: {{zeph.emptyDisp}}; font-size: 12px; color: #5d584f">No photos of {{zeph.who}} yet. Upload one here.</span>
</div>
</sc-for>
<span style="''' + SMALL + '''">Style</span>
<div style="display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 6px">
<sc-for list="{{edLookPills}}" as="zelk" hint-placeholder-count="4">
<button type="button" onClick="{{zelk.pick}}" aria-pressed="{{zelk.pressed}}" style="padding: 4px 2px 6px; display: flex; flex-direction: column; align-items: center; gap: 4px; border: 1px solid {{zelk.bd}}; border-radius: 8px; background: {{zelk.bg}}; cursor: pointer">
<svg viewBox="0 0 48 60" width="40" height="50" aria-hidden="true" style="display: block; border-radius: 5px; isolation: isolate"><rect width="48" height="60" style="fill: {{lkBg}}"></rect><image href="{{zelk.url}}" width="48" height="60" preserveAspectRatio="xMidYMid slice" style="filter: {{zelk.f}}; mix-blend-mode: {{zelk.blend}}"></image></svg>
<span style="font-size: 11px; font-weight: 600; color: #1e1c19">{{zelk.label}}</span>
</button>
</sc-for>
</div>
<span style="display: {{edPhotoCarvedDisp}}; font-size: 12px; line-height: 1.4; color: #5d584f">Carved into the granite, drawn from the photo.</span>
<span style="''' + SMALL + '''">Shape</span>
<div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6px">
<sc-for list="{{framePills}}" as="fr">
<button type="button" onClick="{{fr.pick}}" aria-pressed="{{fr.pressed}}" style="height: 36px; display: flex; align-items: center; justify-content: center; gap: 6px; border: 1px solid {{fr.bd}}; border-radius: 8px; background: {{fr.bg}}; color: #1e1c19; font-size: 12px; cursor: pointer"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><rect x="{{fr.sx}}" y="{{fr.sy}}" width="{{fr.sw}}" height="{{fr.sh}}" rx="{{fr.srx}}" ry="{{fr.sry}}" style="fill: none; stroke: currentColor; stroke-width: 1.8"></rect></svg><span>{{fr.label}}</span></button>
</sc-for>
</div>
<div style="display: {{edPhotoPlainDisp}}; flex-direction: column; gap: 6px">
<span style="''' + SMALL + '''">How it's made</span>
<div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6px">
<sc-for list="{{finishPills}}" as="fn">
<button type="button" onClick="{{fn.pick}}" aria-pressed="{{fn.pressed}}" style="height: 36px; border: 1px solid {{fn.bd}}; border-radius: 8px; background: {{fn.bg}}; color: #1e1c19; font-size: 12px; cursor: pointer">{{fn.label}}</button>
</sc-for>
</div>
<span style="''' + SMALL + '''">Colors</span>
<div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6px">
<sc-for list="{{edTonePills}}" as="zetn">
<button type="button" onClick="{{zetn.pick}}" aria-pressed="{{zetn.pressed}}" style="height: 36px; border: 1px solid {{zetn.bd}}; border-radius: 8px; background: {{zetn.bg}}; color: #1e1c19; font-size: 12px; cursor: pointer">{{zetn.label}}</button>
</sc-for>
</div>
<span style="display: {{edLaserToneDisp}}; font-size: 12px; line-height: 1.4; color: #5d584f">Laser etching is always black and white. Color switches to porcelain.</span>
</div>
<div style="display: flex; flex-direction: column; gap: 4px">
<div style="display: flex; justify-content: space-between; font-size: 12px"><span style="color: #5d584f">Photo width</span><span style="font-weight: 600; font-variant-numeric: tabular-nums">{{selPwLabel}}</span></div>
<input type="range" min="3" max="16" step="0.1" value="{{selPw}}" onChange="{{onPw}}" aria-label="Photo width in inches" style="width: 100%; height: 28px; margin: 0; accent-color: {{accent}}">
</div>'''

borderContent = '''<span style="''' + SMALL + '''">Border style</span>
<div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6px">
<sc-for list="{{borderPills}}" as="bp" hint-placeholder-count="4">
<button type="button" onClick="{{bp.pick}}" aria-pressed="{{bp.pressed}}" style="height: 36px; border: 1px solid {{bp.bd}}; border-radius: 8px; background: {{bp.bg}}; color: #1e1c19; font-size: 12px; cursor: pointer">{{bp.label}}</button>
</sc-for>
</div>
<div style="display: flex; flex-direction: column; gap: 4px">
<div style="display: flex; justify-content: space-between; font-size: 12px"><span style="color: #5d584f">Inset from edge</span><span style="font-weight: 600; font-variant-numeric: tabular-nums">{{selInsetLabel}}</span></div>
<input type="range" min="0.4" max="3" step="0.05" value="{{selInset}}" onChange="{{onInset}}" aria-label="Border inset in inches" style="width: 100%; height: 28px; margin: 0; accent-color: {{accent}}">
</div>'''

finishContent = '''<div style="display: flex; flex-wrap: wrap; gap: 6px">
<sc-for list="{{carvePills}}" as="cp" hint-placeholder-count="5">
<button type="button" onClick="{{cp.pick}}" aria-pressed="{{cp.pressed}}" title="{{cp.spec}}" style="height: 36px; padding: 0 10px; display: flex; align-items: center; gap: 6px; border: 1px solid {{cp.bd}}; border-radius: 8px; background: {{cp.bg}}; color: #1e1c19; font-size: 12px; cursor: pointer">
<span style="width: 10px; height: 10px; border-radius: 50%; background: {{cp.dot}}; box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.3)"></span>
<span>{{cp.label}}</span>
</button>
</sc-for>
</div>
<div style="display: flex; flex-wrap: wrap; align-items: center; gap: 6px">
<span style="width: 100%; font-size: 12px; color: #4a463f">Or paint it</span>
<sc-for list="{{edPaints}}" as="zep" hint-placeholder-count="9">
<button type="button" onClick="{{zep.pick}}" aria-pressed="{{zep.pressed}}" aria-label="{{zep.label}} paint" title="{{zep.label}}" style="width: 28px; height: 28px; padding: 0; border-radius: 50%; border: 2px solid {{zep.ring}}; background: {{zep.col}}; box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.25); cursor: pointer"></button>
</sc-for>
<label title="Any color" style="position: relative; width: 28px; height: 28px; border-radius: 50%; border: 2px solid #d3cdc1; background: conic-gradient(#e0474c, #e8b53a, #6cc070, #3aa6c9, #6b5bd6, #d04fa8, #e0474c); cursor: pointer; overflow: hidden"><input type="color" value="{{edPaintNow}}" onInput="{{edPaintCustom}}" aria-label="Pick any paint color" style="position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer"></label>
</div>'''

NUD = 'height: 36px; border: 1px solid #d3cdc1; border-radius: 8px; background: #ffffff; font-size: 15px; color: #1e1c19; cursor: pointer'
posContent = '''<div style="display: flex; justify-content: space-between; align-items: baseline; gap: 8px"><span style="''' + SMALL + '''">{{selPosHead}}</span><span style="font-size: 13px; font-weight: 600; font-variant-numeric: tabular-nums">{{selPosLabel}}</span></div>
<div style="display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 6px">
<button type="button" onClick="{{nudgeL}}" aria-label="Move left a quarter inch" style="''' + NUD + '''">←</button>
<button type="button" onClick="{{nudgeU}}" aria-label="Move up a quarter inch" style="''' + NUD + '''">↑</button>
<button type="button" onClick="{{nudgeD}}" aria-label="Move down a quarter inch" style="''' + NUD + '''">↓</button>
<button type="button" onClick="{{nudgeR}}" aria-label="Move right a quarter inch" style="''' + NUD + '''">→</button>
<button type="button" onClick="{{centerH}}" aria-label="Center horizontally on the stone" style="''' + NUD + '''; font-size: 11px">Center</button>
</div>
<button type="button" onClick="{{resetSel}}" style="display: {{resetSelDisp}}; align-items: center; align-self: flex-start; height: 32px; padding: 0 10px; border: 1px solid {{accent}}; border-radius: 8px; background: #ffffff; color: {{accent}}; font-size: 12px; font-weight: 600; cursor: pointer">Put it back where the layout had it</button>
<span style="font-size: 11px; line-height: 1.4; color: #5d584f">{{selPosHint}}</span>'''

layersTab = '''<div style="display: flex; flex-direction: column; gap: 14px">
<sc-if value="{{hasIssues}}" hint-placeholder-val="{{false}}">
<div style="display: flex; flex-direction: column; gap: 6px; padding: 10px 12px; border-radius: 10px; background: #fbf1df; border: 1px solid #e6c68d">
<span style="font-size: 13px; font-weight: 600; color: #5e4012">{{issueTitle}}</span>
<sc-for list="{{issues}}" as="is">
<button type="button" onClick="{{is.select}}" style="min-height: 28px; padding: 2px 0; border: 0; background: transparent; color: #5e4012; font-size: 12px; line-height: 1.45; text-align: left; cursor: pointer; text-decoration: underline; text-underline-offset: 2px">{{is.text}}</button>
</sc-for>
<button type="button" onClick="{{reflow}}" style="align-self: flex-start; height: 32px; padding: 0 10px; border: 1px solid #c99a4a; border-radius: 8px; background: #ffffff; color: #5e4012; font-size: 12px; font-weight: 600; cursor: pointer">Even out vertical spacing</button>
</div>
</sc-if>
<sc-if value="{{noIssues}}" hint-placeholder-val="{{true}}">
<div style="display: flex; align-items: center; gap: 8px; padding: 8px 12px; border-radius: 10px; background: #e4efe8; color: #23553f; font-size: 13px; font-weight: 600">
<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M5 12.5 L10 17 L19 7" style="fill: none; stroke: #23553f; stroke-width: 2.4; stroke-linecap: round; stroke-linejoin: round"></path></svg>
<span>Everything will carve beautifully</span>
</div>
</sc-if>

<section style="display: flex; flex-direction: column; gap: 8px">
<div style="position: relative; display: flex; align-items: center; justify-content: space-between; gap: 8px">
<div style="display: flex; flex-direction: column"><h2 style="''' + H3 + '''">Layers</h2><span style="font-size: 11px; color: #5d584f">{{layerCount}} · drag to reorder</span></div>
<div style="display: flex; gap: 6px">
<button type="button" onClick="{{toggleAdd}}" aria-expanded="{{addExp}}" aria-haspopup="menu" style="height: 36px; padding: 0 12px; white-space: nowrap; display: flex; align-items: center; gap: 6px; border: 1px solid {{accent}}; border-radius: 8px; background: {{accent}}; color: #ffffff; font-size: 13px; font-weight: 600; cursor: pointer">
<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M12 5 V19 M5 12 H19" style="fill: none; stroke: #ffffff; stroke-width: 2.4; stroke-linecap: round"></path></svg><span>Add layer</span></button>
<button type="button" onClick="{{askDelete}}" disabled="{{delDisabled}}" aria-haspopup="dialog" aria-expanded="{{delExp}}" title="{{delTitle}}" style="height: 36px; padding: 0 12px; white-space: nowrap; display: flex; align-items: center; gap: 6px; border: 1px solid #e3c1bb; border-radius: 8px; background: #ffffff; color: #9a2f22; font-size: 13px; font-weight: 600; cursor: pointer; opacity: {{delOpacity}}">
<svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true"><path d="M5 7 H19 M10 7 V4.5 H14 V7 M7 7 L8 20 H16 L17 7 M10.5 11 V16.5 M13.5 11 V16.5" style="fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round"></path></svg><span>Delete</span></button>
</div>
<div role="alertdialog" aria-label="Confirm delete" style="display: {{delDisp}}; position: absolute; right: 0; top: 42px; z-index: 21; width: 270px; flex-direction: column; gap: 10px; padding: 14px; border: 1px solid #e3c1bb; border-radius: 12px; background: #ffffff; box-shadow: 0 12px 32px rgba(30, 24, 16, 0.18)">
<span style="font-size: 14px; font-weight: 600; color: #1e1c19">{{delQ}}</span>
<span style="font-size: 12px; line-height: 1.45; color: #4a463f">{{delNote}}</span>
<div style="display: flex; justify-content: flex-end; gap: 8px">
<button type="button" onClick="{{cancelDelete}}" style="height: 34px; padding: 0 12px; border: 1px solid #cfc9bd; border-radius: 8px; background: #ffffff; color: #1e1c19; font-size: 13px; cursor: pointer">Keep it</button>
<button type="button" onClick="{{confirmDelete}}" style="height: 34px; padding: 0 12px; border: 1px solid #9a2f22; border-radius: 8px; background: #9a2f22; color: #ffffff; font-size: 13px; font-weight: 600; cursor: pointer">Delete layer</button>
</div>
</div>
<div role="menu" aria-label="Add a layer" style="display: {{addDisp}}; position: absolute; right: 0; top: 42px; z-index: 20; width: 250px; flex-direction: column; padding: 6px; border: 1px solid #d8d1c4; border-radius: 12px; background: #ffffff; box-shadow: 0 12px 32px rgba(30, 24, 16, 0.18)">
<sc-for list="{{addItems}}" as="zead" hint-placeholder-count="5">
<sc-if value="{{zead.isBtn}}" hint-placeholder-val="{{true}}">
<button type="button" role="menuitem" onClick="{{zead.pick}}" style="width: 100%; min-height: 48px; display: flex; align-items: center; gap: 10px; padding: 6px 10px; border: 0; border-radius: 8px; background: transparent; color: #1e1c19; text-align: left; cursor: pointer">
<span style="width: 30px; height: 30px; flex: none; border-radius: 8px; background: #efece5; display: flex; align-items: center; justify-content: center"><svg viewBox="{{zead.vb}}" width="16" height="16" aria-hidden="true"><path d="{{zead.d}}" style="fill: {{zead.fill}}; stroke: #3d3a34; stroke-width: {{zead.sw}}; stroke-linecap: round; stroke-linejoin: round"></path></svg></span>
<span style="display: flex; flex-direction: column; gap: 1px"><span style="font-size: 13px; font-weight: 600">{{zead.label}}</span><span style="font-size: 11px; color: #5d584f">{{zead.desc}}</span></span>
</button>
</sc-if>
<sc-if value="{{zead.isUpload}}" hint-placeholder-val="{{false}}">
<label role="menuitem" style="position: relative; min-height: 48px; display: flex; align-items: center; gap: 10px; padding: 6px 10px; border-radius: 8px; color: #1e1c19; cursor: pointer">
<input type="file" accept="image/*" onChange="{{zead.onFiles}}" aria-label="Upload a photo for a new image layer" style="position: absolute; left: 0; top: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer">
<span style="width: 30px; height: 30px; flex: none; border-radius: 8px; background: #efece5; display: flex; align-items: center; justify-content: center"><svg viewBox="{{zead.vb}}" width="16" height="16" aria-hidden="true"><path d="{{zead.d}}" style="fill: {{zead.fill}}; stroke: #3d3a34; stroke-width: {{zead.sw}}; stroke-linecap: round; stroke-linejoin: round"></path></svg></span>
<span style="display: flex; flex-direction: column; gap: 1px"><span style="font-size: 13px; font-weight: 600">{{zead.label}}</span><span style="font-size: 11px; color: #5d584f">{{zead.desc}}</span></span>
</label>
</sc-if>
</sc-for>
</div>
</div>
<div style="display: flex; flex-direction: column; gap: 4px; max-height: 230px; overflow-y: auto">
<sc-for list="{{layerRows}}" as="r" hint-placeholder-count="6">
<div class="hs-lrow" draggable="true" onDragStart="{{r.onDragStart}}" onDragOver="{{r.onDragOver}}" onDrop="{{r.onDrop}}" onDragEnd="{{r.onDragEnd}}" title="Drag to move this layer above or below others" style="display: flex; align-items: center; border-radius: 8px; border: 1px solid {{r.dragBd}}; background: {{r.bg}}">
<span aria-hidden="true" style="width: 14px; flex: none; padding-left: 6px; color: #9d968a; font-size: 12px; line-height: 1; letter-spacing: -1px">⋮⋮</span>
<button type="button" onClick="{{r.select}}" aria-pressed="{{r.pressed}}" style="flex-grow: 1; min-width: 0; height: 42px; display: flex; align-items: center; gap: 10px; padding: 0 10px; border: 0; background: transparent; cursor: pointer; text-align: left">
<span style="width: 26px; height: 26px; flex-shrink: 0; border-radius: 6px; background: #efece5; display: flex; align-items: center; justify-content: center">
<svg viewBox="{{r.iconVB}}" width="16" height="16" aria-hidden="true"><path d="{{r.iconD}}" style="fill: {{r.iconFill}}; stroke: {{r.iconStroke}}; stroke-width: {{r.iconSW}}; fill-rule: evenodd; stroke-linecap: round; stroke-linejoin: round"></path></svg>
</span>
<span style="flex-grow: 1; min-width: 0; display: flex; flex-direction: column">
<span style="display: flex; align-items: center; gap: 6px; min-width: 0"><span style="font-size: 13px; font-weight: 600; color: {{r.nameColor}}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{{r.name}}</span><span style="display: {{r.tagDisp}}; flex: none; padding: 1px 6px; border-radius: 999px; background: {{r.tagBg}}; color: {{r.tagFg}}; font-size: 10px; font-weight: 600">{{r.tag}}</span></span>
<span style="font-size: 11px; color: #5d584f; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{{r.sub}}</span>
</span>
</button>
<button type="button" onClick="{{r.toggle}}" aria-label="{{r.eyeLabel}}" style="width: 36px; height: 42px; flex-shrink: 0; border: 0; background: transparent; cursor: pointer; display: flex; align-items: center; justify-content: center">
<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="{{r.eyeD}}" style="fill: none; stroke: {{r.eyeColor}}; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round"></path></svg>
</button>
</div>
</sc-for>
</div>
<span aria-live="polite" style="display: {{edStatusDisp}}; font-size: 12px; color: #5e4012">{{status}}</span>
</section>

<sc-if value="{{noSel}}" hint-placeholder-val="{{false}}">
<p style="margin: 0; padding-top: 12px; border-top: 1px solid #dcd7cc; font-size: 13px; line-height: 1.5; color: #5d584f">Select a layer to change it, or drag lettering, symbols and photos right on the stone.</p>
</sc-if>

<sc-if value="{{hasSel}}" hint-placeholder-val="{{true}}">
<section aria-label="Selected layer" style="display: flex; flex-direction: column">
<div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 10px 0">
<div style="display: flex; flex-direction: column; gap: 1px; min-width: 0"><span style="''' + H3 + '''">{{selKind}}</span><span style="font-size: 16px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{{selName}}</span></div>
<div style="display: flex; gap: 6px; flex: none">
<button type="button" onClick="{{duplicate}}" style="height: 32px; padding: 0 10px; border: 1px solid #d3cdc1; border-radius: 8px; background: #ffffff; font-size: 12px; color: #1e1c19; cursor: pointer">Duplicate</button>
<button type="button" onClick="{{askDelete}}" style="height: 32px; padding: 0 10px; border: 1px solid #e3c1bb; border-radius: 8px; background: #ffffff; font-size: 12px; color: #9a2f22; cursor: pointer">Delete</button>
</div>
</div>
<sc-if value="{{selHasIssue}}" hint-placeholder-val="{{false}}">
<div style="display: flex; flex-direction: column; gap: 6px; margin-bottom: 10px; padding: 10px 12px; border-radius: 8px; background: #fbf1df; border: 1px solid #e6c68d">
<sc-for list="{{selIssues}}" as="si">
<span style="font-size: 12px; line-height: 1.45; color: #5e4012">{{si.text}}</span>
</sc-for>
<button type="button" onClick="{{fitSel}}" style="align-self: flex-start; height: 32px; padding: 0 10px; border: 1px solid #c99a4a; border-radius: 8px; background: #ffffff; color: #5e4012; font-size: 12px; font-weight: 600; cursor: pointer">Fit inside the margins</button>
</div>
</sc-if>
<sc-if value="{{selIsDates}}" hint-placeholder-val="{{false}}">
''' + INS('dcont', 'Date format', datesContent) + '''
</sc-if>
<sc-if value="{{selIsPlainText}}" hint-placeholder-val="{{true}}">
''' + INS('tcont', 'Wording', textContent) + '''
</sc-if>
<sc-if value="{{selIsText}}" hint-placeholder-val="{{true}}">
''' + INS('tstyle', 'Lettering style', textStyle) + '''
</sc-if>
<sc-if value="{{selIsSymbol}}" hint-placeholder-val="{{false}}">
''' + INS('sym', 'Icon', symContent) + '''
</sc-if>
<sc-if value="{{selIsPhoto}}" hint-placeholder-val="{{false}}">
''' + INS('photo', 'Image', photoContent) + '''
</sc-if>
<sc-if value="{{selIsBorder}}" hint-placeholder-val="{{false}}">
''' + INS('border', 'Border', borderContent) + '''
</sc-if>
<sc-if value="{{selShowCarve}}" hint-placeholder-val="{{true}}">
''' + INS('finish', 'Finish', finishContent) + '''
</sc-if>
<sc-if value="{{selMovable}}" hint-placeholder-val="{{true}}">
''' + INS('pos', 'Position', posContent) + '''
</sc-if>
</section>
</sc-if>
</div>

'''
right = ('''<aside aria-label="Layers" style="position: absolute; left: 1080px; top: 64px; width: 360px; height: 836px; box-sizing: border-box; display: flex; flex-direction: column; background: #fbfaf7; border-left: 1px solid #dcd7cc; z-index: 10; transform: translateX({{rpX}}px); visibility: {{panelVis}}; transition: {{panelTrans}}">
<div style="flex-grow: 1; overflow-y: auto; padding: 16px 20px 28px">
''' + layersTab + '''
</div>
</aside>''')
open('editor_new.html', 'w').write(left + '\n\n' + right)
print('ok', len(left), len(right))
