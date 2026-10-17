# --- surface finish, rock pitch edges, glossy polished lettering, fit outlines ---
opts=rep(opts,'<path d="{{o.stoneD}}" style="fill: {{o.face}}; stroke: {{o.edge}}; stroke-width: 1.4"></path>\n<path d="{{o.stoneD}}" style="fill: #ffffff; opacity: 0.35; filter: url(#{{o.fGrain}})"></path>\n<path d="{{o.stoneD}}" style="fill: url(#{{o.gSheen}})"></path>',
'''<path d="{{o.stoneD}}" style="fill: {{o.faceS}}; stroke: {{o.edge}}; stroke-width: 1.4"></path>
<path d="{{o.stoneD}}" style="fill: #ffffff; opacity: {{o.grainOp}}; filter: url(#{{o.fGrain}})"></path>
<path d="{{o.stoneD}}" style="fill: url(#{{o.gSheen}}); opacity: {{o.sheenOp}}"></path>
<clipPath id="{{o.clipStone}}"><path d="{{o.stoneD}}"></path></clipPath>
<g style="display: {{o.rockDisp}}; clip-path: url(#{{o.clipStone}})">
<path d="{{o.stoneD}}" style="fill: none; stroke: {{o.rockCol}}; stroke-width: {{o.rockW}}"></path>
<path d="{{o.stoneD}}" style="fill: none; stroke: {{o.rockCol}}; stroke-width: {{o.rockW2}}; stroke-dasharray: {{o.rockDash}}; stroke-linecap: round"></path>
<path d="{{o.stoneD}}" style="fill: none; stroke: {{o.rockCol}}; stroke-width: {{o.rockW4}}; stroke-dasharray: {{o.rockDash3}}; stroke-dashoffset: {{o.rockOff}}; stroke-linecap: round"></path>
<path d="{{o.stoneD}}" style="fill: none; stroke: {{o.rockCol2}}; stroke-width: {{o.rockW3}}; stroke-dasharray: {{o.rockDash2}}; stroke-linecap: round; opacity: 0.35"></path>
<path d="{{o.stoneD}}" style="fill: none; stroke: {{o.edge}}; stroke-width: {{o.rockW5}}; opacity: 0.45"></path>
</g>''')
opts=rep(opts,'color: {{l.color}}; text-shadow: {{l.shadow}}; opacity: {{l.op}}; pointer-events: none">{{l.text}}</div>',
'color: {{l.color}}; text-shadow: {{l.shadow}}; opacity: {{l.op}}; background-image: {{l.gloss}}; background-size: 100% {{l.lhpx}}px; background-repeat: repeat-y; -webkit-background-clip: {{l.clip}}; background-clip: {{l.clip}}; -webkit-text-fill-color: {{l.fill}}; pointer-events: none">{{l.text}}</div>')
opts=rep(opts,'<rect x="{{l.hx}}" y="{{l.hy}}" width="{{l.hw}}" height="{{l.hh}}" style="display: {{l.selDisp}};',
'<rect x="{{l.wx}}" y="{{l.wy}}" width="{{l.ww}}" height="{{l.wh}}" rx="{{l.wRx}}" style="display: {{l.warnDisp}}; fill: {{l.warnFill}}; stroke: {{l.warnCol}}; stroke-width: 1.5; stroke-dasharray: {{l.warnDash}}; vector-effect: non-scaling-stroke"></rect>\n<rect x="{{l.hx}}" y="{{l.hy}}" width="{{l.hw}}" height="{{l.hh}}" style="display: {{l.selDisp}};')
editor=rep(editor,'<span>{{cp.label}}</span>\n</button>\n</sc-for>\n</div>','''<span>{{cp.label}}</span>
</button>
</sc-for>
</div>
<div style="display: {{edPaintDisp}}; flex-wrap: wrap; align-items: center; gap: 6px; padding-top: 4px">
<span style="width: 100%; font-size: 12px; color: #4a463f">Or paint it</span>
<sc-for list="{{edPaints}}" as="zep" hint-placeholder-count="9">
<button type="button" onClick="{{zep.pick}}" aria-pressed="{{zep.pressed}}" aria-label="{{zep.label}} paint" title="{{zep.label}}" style="width: 30px; height: 30px; padding: 0; border-radius: 50%; border: 2px solid {{zep.ring}}; background: {{zep.col}}; box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.25); cursor: pointer"></button>
</sc-for>
<label title="Any color" style="position: relative; width: 30px; height: 30px; border-radius: 50%; border: 2px solid #d3cdc1; background: conic-gradient(#e0474c, #e8b53a, #6cc070, #3aa6c9, #6b5bd6, #d04fa8, #e0474c); cursor: pointer; overflow: hidden"><input type="color" value="{{edPaintNow}}" onInput="{{edPaintCustom}}" aria-label="Pick any paint color" style="position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer"></label>
</div>''')
# --- base granite ---
opts=rep(opts,'<stop offset="0" style="stop-color: {{o.face}}"></stop>\n<stop offset="1" style="stop-color: {{o.edge}}"></stop>','<stop offset="0" style="stop-color: {{o.bFace}}"></stop>\n<stop offset="1" style="stop-color: {{o.bEdge}}"></stop>')
opts=rep(opts,'style="display: {{o.baseDisp}}; fill: url(#{{o.gBase}}); stroke: {{o.edge}}; stroke-width: 1"></rect>','style="display: {{o.baseDisp}}; fill: url(#{{o.gBase}}); stroke: {{o.bEdge}}; stroke-width: 1"></rect>')
editor=rep(editor,'<label style="display: flex; align-items: center; gap: 10px; min-height: 36px; font-size: 13px; color: #3d3a34; cursor: pointer">\n<input type="checkbox" checked="{{base}}"','<label style="display: {{baseShowDisp}}; align-items: center; gap: 10px; min-height: 36px; font-size: 13px; color: #3d3a34; cursor: pointer">\n<input type="checkbox" checked="{{base}}"')
editor=rep(editor,'<span>Show base ({{baseLabel}})</span>\n</label>','''<span>Show base ({{baseLabel}})</span>
</label>
<div style="display: {{baseMatDisp}}; flex-wrap: wrap; align-items: center; gap: 6px">
<span style="font-size: 12px; color: #4a463f; margin-right: 2px">Base granite</span>
<sc-for list="{{baseMats}}" as="zbm" hint-placeholder-count="6">
<button type="button" onClick="{{zbm.pick}}" aria-pressed="{{zbm.pressed}}" aria-label="Base: {{zbm.label}}" title="{{zbm.label}}" style="width: 28px; height: 28px; padding: 0; border-radius: 50%; border: 2px solid {{zbm.ring}}; background: {{zbm.swatch}}; cursor: pointer"></button>
</sc-for>
</div>''')
# --- base texture, finish, rock pitch ---
opts=rep(opts,'<rect x="{{o.baseX}}" y="{{o.baseY}}" width="{{o.baseW}}" height="{{o.baseH}}" rx="2" style="display: {{o.baseDisp}}; fill: url(#{{o.gBase}}); stroke: {{o.bEdge}}; stroke-width: 1"></rect>','''<g style="display: {{o.baseDisp}}">
<clipPath id="{{o.clipBase}}"><rect x="{{o.baseX}}" y="{{o.baseY}}" width="{{o.baseW}}" height="{{o.baseH}}" rx="2"></rect></clipPath>
<rect x="{{o.baseX}}" y="{{o.baseY}}" width="{{o.baseW}}" height="{{o.baseH}}" rx="2" style="fill: url(#{{o.gBase}}); stroke: {{o.bEdge}}; stroke-width: 1"></rect>
<rect x="{{o.baseX}}" y="{{o.baseY}}" width="{{o.baseW}}" height="{{o.baseH}}" rx="2" style="fill: #ffffff; opacity: {{o.bGrainOp}}; filter: url(#{{o.fGrain}})"></rect>
<rect x="{{o.baseX}}" y="{{o.baseY}}" width="{{o.baseW}}" height="{{o.baseH}}" rx="2" style="fill: url(#{{o.gSheen}}); opacity: {{o.bSheenOp}}"></rect>
<g style="display: {{o.bRockDisp}}; clip-path: url(#{{o.clipBase}})">
<rect x="{{o.baseX}}" y="{{o.baseY}}" width="{{o.baseW}}" height="{{o.baseH}}" rx="2" style="fill: none; stroke: {{o.bRockCol}}; stroke-width: {{o.bRockW}}"></rect>
<rect x="{{o.baseX}}" y="{{o.baseY}}" width="{{o.baseW}}" height="{{o.baseH}}" rx="2" style="fill: none; stroke: {{o.bRockCol}}; stroke-width: {{o.bRockW2}}; stroke-dasharray: {{o.bRockDash}}; stroke-linecap: round"></rect>
<rect x="{{o.baseX}}" y="{{o.baseY}}" width="{{o.baseW}}" height="{{o.baseH}}" rx="2" style="fill: none; stroke: {{o.bRockCol2}}; stroke-width: {{o.bRockW3}}; stroke-dasharray: {{o.bRockDash2}}; stroke-linecap: round; opacity: 0.35"></rect>
</g>
<rect x="{{o.baseX}}" y="{{o.baseY}}" width="{{o.baseW}}" height="{{o.baseH}}" rx="2" style="fill: none; stroke: {{o.bEdge}}; stroke-width: 1"></rect>
</g>''')
# --- lying marker base: stone casts a soft shadow onto the slab ---
opts=rep(opts,'<path d="{{o.stoneD}}" style="fill: {{o.faceS}}; stroke: {{o.edge}}; stroke-width: 1.4"></path>','<path d="{{o.stoneD}}" transform="{{o.lyShadowTf}}" style="display: {{o.lyShadowDisp}}; fill: #000000; opacity: 0.45; filter: url(#{{o.fShBlur2}})"></path>\n<path d="{{o.stoneD}}" style="fill: {{o.faceS}}; stroke: {{o.edge}}; stroke-width: 1.4"></path>')
opts=rep(opts,'<ellipse cx="{{o.shCx}}" cy="{{o.shCy}}" rx="{{o.shRx}}" ry="{{o.shRy}}" style="fill: url(#{{o.gShadow}})"></ellipse>','''<ellipse cx="{{o.shCx}}" cy="{{o.shCy}}" rx="{{o.shRx}}" ry="{{o.shRy}}" style="display: {{o.shDisp}}; fill: url(#{{o.gShadow}})"></ellipse>
<filter id="{{o.fShBlur}}" x="-25%" y="-25%" width="150%" height="150%"><feGaussianBlur stdDeviation="{{o.fShStd}}"></feGaussianBlur></filter>
<filter id="{{o.fShBlur2}}" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="{{o.fShStd2}}"></feGaussianBlur></filter>
<path d="{{o.fpD}}" transform="{{o.fpT2}}" style="display: {{o.fpDisp}}; fill: #3c3226; opacity: 0.42; filter: url(#{{o.fShBlur}})"></path>''')
editor=rep(editor,'<button type="button" onClick="{{hPlus}}" aria-label="Make the stone 1 inch taller" style="width: 44px; height: 40px; border: 1px solid #d3cdc1; border-radius: 8px; background: #ffffff; font-size: 18px; color: #1e1c19; cursor: pointer">+</button>\n</div>\n</div>','<button type="button" onClick="{{hPlus}}" aria-label="Make the stone 1 inch taller" style="width: 44px; height: 40px; border: 1px solid #d3cdc1; border-radius: 8px; background: #ffffff; font-size: 18px; color: #1e1c19; cursor: pointer">+</button>\n</div>\n</div>\n<button type="button" onClick="{{bestSize}}" style="height: 40px; padding: 0 12px; border: 1px solid {{accent}}; border-radius: 8px; background: #ffffff; color: {{accent}}; font-size: 13px; font-weight: 600; cursor: pointer">Best size for this lettering</button>\n<p aria-live="polite" style="display: {{sizeMsgDisp}}; margin: 0; font-size: 12px; line-height: 1.4; color: #23553f">{{sizeMsg}}</p>')

# The stone inside a design panel moves on the panel's own timing, so it travels in a straight line
_old_inner = 'transform: translate(-50%, -50%) scale({{o.sc}}); transform-origin: 50% 50%; transition: left .65s cubic-bezier(.22,.8,.2,1), top .65s cubic-bezier(.22,.8,.2,1), transform .65s cubic-bezier(.22,.8,.2,1)"'
_new_inner = 'transform: translate(-50%, -50%) scale({{o.sc}}); transform-origin: 50% 50%; transition: {{o.strans}}"'
assert _old_inner in opts, 'inner stone transition'
opts = opts.replace(_old_inner, _new_inner)
editor = open('editor_new.html').read()

# Selection on the stone is cyan, so it never reads as the yellow "a little snug" warning
opts = opts.replace('style="display: {{l.selDisp}}; fill: none; stroke: #f0b54a;', 'style="display: {{l.selDisp}}; fill: none; stroke: #22d3ee;')
opts = opts.replace('style="display: {{l.bSelDisp}}; fill: none; stroke: #f0b54a;', 'style="display: {{l.bSelDisp}}; fill: none; stroke: #22d3ee;')
opts = opts.replace('font-size: {{l.mFs}}px; color: #f5c979; text-shadow:', 'font-size: {{l.mFs}}px; color: #67e8f9; text-shadow:')
opts = opts.replace('style="display: {{o.guideDisp}}; fill: none; stroke: #d9962b;', 'style="display: {{o.guideDisp}}; fill: none; stroke: #22d3ee;')

# Photo looks: black & white, etched, sketched and sculpted filters for each portrait
exec(open('photofx.py').read())
opts = rep(opts, '<defs><clipPath id="{{l.clipId}}">', '<defs>' + photo_fx('{{l.fxId}}', '{{l.fxFq}}', '{{l.fxSb}}', '{{l.fxRb}}', '{{l.fxSs}}', '{{l.fxCol}}', '{{l.fxTv}}', '{{l.fxLc}}') + '<clipPath id="{{l.clipId}}">')

# Border selection sits outside and inside the band instead of on it
opts = rep(opts, '<path d="{{l.stoneD}}" transform="{{l.btf1}}" style="display: {{l.bSelDisp}}; fill: none; stroke: #22d3ee;', '<path d="{{l.stoneD}}" transform="{{l.btfS2}}" style="display: {{l.bSelDisp}}; fill: none; stroke: #22d3ee; stroke-width: 1.5; stroke-dasharray: 6 4; vector-effect: non-scaling-stroke"></path>\n<path d="{{l.stoneD}}" transform="{{l.btfS1}}" style="display: {{l.bSelDisp}}; fill: none; stroke: #22d3ee;')

# Flower vases beside the stone: gradients plus one group per vase
opts = rep(opts, '</defs>\n<ellipse cx="{{o.shCx}}"', '''<linearGradient id="{{o.gVaseA}}" x1="0" y1="0" x2="1" y2="0">
<stop offset="0" style="stop-color: #6f737a"></stop>
<stop offset="0.16" style="stop-color: #b9bcc2"></stop>
<stop offset="0.33" style="stop-color: #f2f3f5"></stop>
<stop offset="0.5" style="stop-color: #a3a7ad"></stop>
<stop offset="0.7" style="stop-color: #858990"></stop>
<stop offset="0.85" style="stop-color: #d9dbdf"></stop>
<stop offset="1" style="stop-color: #666a70"></stop>
</linearGradient>
<linearGradient id="{{o.gVaseG}}" x1="0" y1="0" x2="1" y2="0">
<stop offset="0" style="stop-color: {{o.vgE}}"></stop>
<stop offset="0.3" style="stop-color: {{o.vgL}}"></stop>
<stop offset="0.55" style="stop-color: {{o.vgF}}"></stop>
<stop offset="1" style="stop-color: {{o.vgE}}"></stop>
</linearGradient>
</defs>
<ellipse cx="{{o.shCx}}"''')
opts = rep(opts, '<path d="{{o.spineD}}" style="display: {{o.spineDisp}};', '''<sc-for list="{{o.vases}}" as="zva" hint-placeholder-count="0">
<g transform="{{zva.tf}}">
<ellipse cx="0" cy="{{zva.shCy}}" rx="{{zva.shRx}}" ry="{{zva.shRy}}" style="display: {{zva.shDisp}}; fill: #000000; opacity: 0.35; filter: url(#{{o.fShBlur2}})"></ellipse>
<g style="display: {{zva.sideDisp}}">
<rect x="{{zva.plX}}" y="{{zva.plY}}" width="{{zva.plW}}" height="{{zva.plH}}" rx="1.5" style="display: {{zva.brDisp}}; fill: #55595f; stroke: rgba(0, 0, 0, 0.4); stroke-width: 0.8"></rect>
<rect x="{{zva.brX}}" y="{{zva.brY}}" width="{{zva.brW}}" height="{{zva.brH}}" rx="1.5" style="display: {{zva.brDisp}}; fill: #6b6f76; stroke: rgba(0, 0, 0, 0.35); stroke-width: 0.8"></rect>
<path d="{{zva.d}}" style="fill: {{zva.fill}}; stroke: {{zva.stroke}}; stroke-width: 0.9"></path>
<path d="{{zva.d}}" style="display: {{zva.grainDisp}}; fill: #ffffff; opacity: 0.3; filter: url(#{{o.fGrain}})"></path>
<path d="{{zva.ringD}}" style="fill: none; stroke: {{zva.ringCol}}; stroke-width: 0.9; opacity: 0.45"></path>
<rect x="{{zva.clX}}" y="{{zva.clY}}" width="{{zva.clW}}" height="{{zva.clH}}" rx="1.5" style="display: {{zva.brDisp}}; fill: #7a7e85; stroke: rgba(0, 0, 0, 0.4); stroke-width: 0.8"></rect>
<ellipse cx="0" cy="{{zva.rimCy}}" rx="{{zva.rimRx}}" ry="{{zva.rimRy}}" style="fill: {{zva.rimFill}}"></ellipse>
</g>
<g style="display: {{zva.lyDisp}}">
<circle cx="{{zva.lySh}}" cy="{{zva.lySh}}" r="{{zva.lyR}}" style="fill: #000000; opacity: 0.4; filter: url(#{{o.fShBlur2}})"></circle>
<circle cx="0" cy="0" r="{{zva.lyR}}" style="fill: {{zva.fill}}; stroke: {{zva.stroke}}; stroke-width: 0.9"></circle>
<circle cx="0" cy="0" r="{{zva.lyR}}" style="display: {{zva.grainDisp}}; fill: #ffffff; opacity: 0.3; filter: url(#{{o.fGrain}})"></circle>
<circle cx="0" cy="0" r="{{zva.lyR3}}" style="fill: none; stroke: {{zva.ringCol}}; stroke-width: 0.9; opacity: 0.5"></circle>
<circle cx="0" cy="0" r="{{zva.lyR2}}" style="fill: {{zva.rimFill}}"></circle>
</g>
</g>
</sc-for>
<path d="{{o.spineD}}" style="display: {{o.spineDisp}};''')

# A front vase stands in front of the lettering, so it is drawn after the layer loop
_ls = opts.index('<sc-for list="{{o.layers}}" as="l">')
_depth, _pos = 0, _ls
import re as _re
for _m in _re.finditer(r'<(/?)sc-for\b', opts[_ls:]):
    _depth += -1 if _m.group(1) else 1
    if _depth == 0:
        _pos = _ls + _m.end(); break
_pos = opts.index('>', _pos) + 1
opts = opts[:_pos] + '''
<svg viewBox="{{o.vb}}" preserveAspectRatio="xMidYMid meet" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: 100%; height: 100%; overflow: visible; pointer-events: none">
<sc-for list="{{o.vasesFront}}" as="zvf" hint-placeholder-count="0">
<g transform="{{zvf.tf}}">
<ellipse cx="0" cy="{{zvf.shCy}}" rx="{{zvf.shRx}}" ry="{{zvf.shRy}}" style="fill: #000000; opacity: 0.4; filter: url(#{{o.fShBlur2}})"></ellipse>
<path d="{{zvf.d}}" style="fill: {{zvf.fill}}; stroke: {{zvf.stroke}}; stroke-width: 0.9"></path>
<path d="{{zvf.d}}" style="display: {{zvf.grainDisp}}; fill: #ffffff; opacity: 0.3; filter: url(#{{o.fGrain}})"></path>
<path d="{{zvf.ringD}}" style="fill: none; stroke: {{zvf.ringCol}}; stroke-width: 0.9; opacity: 0.45"></path>
<ellipse cx="0" cy="{{zvf.rimCy}}" rx="{{zvf.rimRx}}" ry="{{zvf.rimRy}}" style="fill: {{zvf.rimFill}}"></ellipse>
</g>
</sc-for>
</svg>''' + opts[_pos:]

# Reserved spaces: dates still to come render blank (outlined while designing); saved photo spots too
opts = rep(opts, 'pointer-events: none">{{l.text}}</div>', 'pointer-events: none"><sc-for list="{{l.segs}}" as="zsg"><span style="outline: {{zsg.ol}}; outline-offset: 3px; border-radius: 4px"><span style="visibility: {{zsg.vis}}">{{zsg.t}}</span></span></sc-for></div>')
opts = rep(opts, 'style="clip-path: url(#{{l.clipId}}); filter: url(#{{l.imgF}}); opacity: {{l.pop}}"></image>', 'style="display: {{l.imgDisp}}; clip-path: url(#{{l.clipId}}); filter: url(#{{l.imgF}}); opacity: {{l.pop}}"></image>')
opts = rep(opts, 'style="display: {{l.frameDisp}}; fill: none; stroke: #b08d57; stroke-width: {{l.frameW}}"></rect>', '''style="display: {{l.frameDisp}}; fill: none; stroke: #b08d57; stroke-width: {{l.frameW}}"></rect>
<g style="display: {{l.resvMatteDisp}}">
<filter id="{{l.resvFx}}" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="{{l.resvBlur}}"></feGaussianBlur></filter>
<rect x="{{l.px0}}" y="{{l.py0}}" width="{{l.pw}}" height="{{l.ph}}" rx="{{l.rx}}" ry="{{l.ry}}" style="fill: {{l.resvMatte}}; opacity: 0.85; filter: url(#{{l.resvFx}})"></rect>
<path d="{{l.resvSilD}}" style="fill: {{l.resvSil}}; opacity: 0.55; filter: url(#{{l.resvFx}})"></path>
</g>
<text x="{{l.resvLx}}" y="{{l.resvLy}}" text-anchor="middle" dominant-baseline="middle" style="display: {{l.resvDisp}}; font-family: 'Instrument Sans', sans-serif; font-size: {{l.resvFs}}px; fill: rgba(225, 228, 231, 0.85)">{{l.resvLabel}}</text>''')

# Rearranging in the guided walkthrough: drop zones, the lit target and a ghost of where the swapped part lands
opts = rep(opts, '<rect x="{{l.hx}}" y="{{l.hy}}" width="{{l.hw}}" height="{{l.hh}}" style="display: {{l.selDisp}};',
 '<rect x="{{l.zx}}" y="{{l.zy}}" width="{{l.zw}}" height="{{l.zh}}" rx="{{l.zRx}}" style="display: {{l.zDisp}}; fill: {{l.zFill}}; stroke: {{l.zStroke}}; stroke-width: {{l.zSw}}; stroke-dasharray: {{l.zDash}}; vector-effect: non-scaling-stroke"></rect>\n<rect x="{{l.z2x}}" y="{{l.z2y}}" width="{{l.z2w}}" height="{{l.z2h}}" rx="{{l.zRx}}" style="display: {{l.z2Disp}}; fill: {{l.z2Fill}}; stroke: {{l.z2Stroke}}; stroke-width: {{l.z2Sw}}; stroke-dasharray: {{l.z2Dash}}; vector-effect: non-scaling-stroke"></rect>\n<rect x="{{l.hx}}" y="{{l.hy}}" width="{{l.hw}}" height="{{l.hh}}" style="display: {{l.selDisp}};')
opts = rep(opts, '<div aria-hidden="true" style="display: {{l.selDivDisp}};',
 '<div aria-hidden="true" style="display: {{l.zLabDisp}}; position: absolute; left: {{l.zLx}}px; top: {{l.zLy}}px; transform: {{l.zLabTf}}; padding: 2px 8px; border-radius: 6px; background: rgba(12, 22, 26, 0.88); font-family: \'Instrument Sans\', sans-serif; font-weight: 600; font-size: {{l.mFs}}px; color: #67e8f9; white-space: nowrap; pointer-events: none; z-index: 3">{{l.zLabel}}</div>\n<div aria-hidden="true" style="display: {{l.z2LabDisp}}; position: absolute; left: {{l.z2Lx}}px; top: {{l.z2Ly}}px; transform: translateX(-50%); padding: 2px 8px; border-radius: 6px; background: rgba(12, 22, 26, 0.88); font-family: \'Instrument Sans\', sans-serif; font-weight: 600; font-size: {{l.mFs}}px; color: #67e8f9; white-space: nowrap; pointer-events: none; z-index: 3">{{l.z2Label}}</div>\n<div aria-hidden="true" style="display: {{l.selDivDisp}};')
