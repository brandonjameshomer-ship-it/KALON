import re
L=open('v6-backup.dc.html').read().split('\n')
opts='\n'.join(L[294:414]); editor='\n'.join(L[415:789])
def rep(s,a,b):
    assert s.count(a)==1,(a[:60],s.count(a)); return s.replace(a,b)
opts=rep(opts,'<span style="height: 24px; padding: 0 10px; display: flex;','<span style="height: 24px; padding: 0 10px; display: {{o.chkDisp}};')
opts=rep(opts,'isolation: isolate; z-index: {{o.z}}">','isolation: isolate; z-index: {{o.z}}; transform-origin: {{o.porigin}}; filter: {{o.pfilter}}">')
opts=rep(opts,'</defs>\n<ellipse cx="{{o.shCx}}"','''<linearGradient id="{{o.gWarm}}" x1="1" y1="0" x2="0.2" y2="1">\n<stop offset="0" style="stop-color: #ffe2aa; stop-opacity: 0.55"></stop>\n<stop offset="0.6" style="stop-color: #ffe2aa; stop-opacity: 0.08"></stop>\n<stop offset="1" style="stop-color: #6b5a3a; stop-opacity: 0.18"></stop>\n</linearGradient>\n<radialGradient id="{{o.gPillow}}" cx="0.5" cy="0.42" r="0.62">
<stop offset="0" style="stop-color: #ffffff; stop-opacity: 0.12"></stop>
<stop offset="0.7" style="stop-color: #ffffff; stop-opacity: 0"></stop>
<stop offset="1" style="stop-color: #000000; stop-opacity: 0.32"></stop>
</radialGradient>
</defs>
<ellipse cx="{{o.shCx}}"''')
opts=rep(opts,'<path d="{{o.stoneD}}" style="fill: url(#{{o.gSheen}})"></path>','''<path d="{{o.stoneD}}" style="fill: url(#{{o.gSheen}})"></path>
<path d="{{o.stoneD}}" style="display: {{o.pillowDisp}}; fill: url(#{{o.gPillow}})"></path>
<path d="{{o.stoneD}}" transform="{{o.bevelTf}}" style="display: {{o.bevelDisp}}; fill: none; stroke: #ffffff; stroke-opacity: 0.1; stroke-width: {{o.bevelSw}}"></path>
<path d="{{o.stoneD}}" style="display: {{o.lightDisp}}; fill: url(#{{o.gWarm}}); mix-blend-mode: soft-light"></path>\n<path d="{{o.spineD}}" style="display: {{o.spineDisp}}; fill: none; stroke: {{o.edge}}; stroke-width: 1.4; opacity: 0.85"></path>''')
editor=rep(editor,'<div style="display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 6px">\n<sc-for list="{{shapes}}"','<div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 6px">\n<sc-for list="{{shapes}}"')
editor=rep(editor,'hint-placeholder-count="12">\n<button type="button" onClick="{{sy.add}}"','hint-placeholder-count="16">\n<button type="button" onClick="{{sy.add}}"')
editor=editor.replace('<span>Layout checks pass</span>','<span>Everything will carve beautifully</span>')
exec(open('assemble_fin.py').read())
A=open('partA.html').read(); D=open('partD.html').read()
D=D.replace('<!--LOOKFX-->', '<svg width="0" height="0" aria-hidden="true" style="position: absolute; width: 0; height: 0; overflow: hidden"><defs>' + photo_fx('lkp', '1.6', '1.1', '0.4', '1.3', '{{lkCol}}', '0 1', '{{lkLc}}') + '</defs></svg>')
js=open('partJS.js').read()+open('paint.js').read()+open('partJS2.js').read()
props='{"accent":{"editor":"color","default":"#2f5b4f","options":["#2f5b4f","#43497a","#8a4b2f","#2b2a27"]},"$preview":{"width":1440,"height":900}}'
TPL=A+opts+'\n\n'+editor+'\n'+D
def rr(s,x,y,c=1):
    assert s.count(x)==c,(x[:70],s.count(x)); return s.replace(x,y)
# Responsive: the stage follows the window (see renderVals: LW, LH, gpL, rpL, scTf)
TPL=rr(TPL,'<div style="position: relative; width: 1440px; height: 900px; overflow: clip;','<div style="position: relative; width: {{LW}}px; height: {{LH}}px; overflow: clip; transform: scale({{rootScale}}); transform-origin: 0 0;')
TPL=rr(TPL,'width: 1440px; height: 900px','width: {{LW}}px; height: {{LH}}px',3)
TPL=rr(TPL,'left: 0; top: 0; width: 1440px; height: 64px;','left: 0; top: 0; width: {{LW}}px; height: 64px; white-space: nowrap;')
TPL=rr(TPL,'<div style="position: absolute; left: 0; top: 64px; width: 1440px; height: 836px; display: grid;','<div style="position: absolute; left: 0; top: 64px; width: {{LW}}px; height: {{LH64}}px; display: grid;')
TPL=rr(TPL,'<div style="position: absolute; left: 0; top: 64px; width: 1440px; height: 836px; display: flex;','<div style="position: absolute; left: 0; top: 64px; width: {{LW}}px; height: {{LH64}}px; display: flex;')
TPL=rr(TPL,'<div aria-hidden="true" style="position: absolute; left: 0; top: 0; width: 1440px; height: 836px; pointer-events: none; overflow: hidden">','<div aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {{LW}}px; height: {{LH64}}px; pointer-events: none; overflow: hidden">')
TPL=rr(TPL,'<div aria-hidden="true" style="position: absolute; left: 0; top: 64px; width: 1440px; height: 836px; overflow: hidden;','<div aria-hidden="true" style="position: absolute; left: 0; top: 64px; width: 1440px; height: 836px; transform-origin: 0 0; transform: {{scTf}}; overflow: hidden;',2)
TPL=rr(TPL,'height: 836px; box-sizing: border-box; display: flex; flex-direction: column; background: #fbfaf7','height: {{LH64}}px; box-sizing: border-box; display: flex; flex-direction: column; background: #fbfaf7',3)
TPL=rr(TPL,'<aside aria-label="Layers" style="position: absolute; left: 1080px;','<aside aria-label="Layers" style="position: absolute; left: {{rpL}}px;')
TPL=rr(TPL,'<aside aria-label="Guided changes" style="position: absolute; left: 1020px;','<aside aria-label="Guided changes" style="position: absolute; left: {{gpL}}px;')
TPL=rr(TPL,'grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr); column-gap: 16px; align-items: center; padding: 0 20px;','grid-template-columns: {{hdrCols}}; column-gap: 16px; align-items: center; padding: 0 20px;')
TPL=rr(TPL,'left: 40px; top: 84px; width: 1200px;','left: 40px; top: 84px; width: {{hdrW}}px;')
TPL=rr(TPL,"body{margin:0;background:#efece5;","body{margin:0;overflow:hidden;background:#efece5;")
out=TPL+"<script type=\"text/x-dc\" data-dc-script data-props='"+props+"'>\n"+js+"</script>\n</body>\n</html>\n"
open('hs/project/Main.dc.html','w').write(out)
tpl=out.split('<script type="text/x-dc"')[0]
open('holes.txt','w').write('\n'.join(sorted(set(re.findall(r'\{\{\s*([a-zA-Z_.$0-9]+)\s*\}\}',tpl)))))
open('chk.js','w').write('class DCLogic{constructor(){this.state={};this.props={}} setState(p){Object.assign(this.state,typeof p==="function"?p(this.state):p)}}\n'+js+'\nmodule.exports={hsBox,hsClear,hsLayoutBest,hsLayerStatus,HS_SURFACES,hsLeftOff,hsFitSuggest,hsWorship,hsCabin,hsAnalyze,Component,hsStoryScene,hsTellSchedule,hsLifePoem,hsSceneMoment,hsAnalyze,hsGenerate,hsChecks,HS_SAMPLE,hsLayout,hsContentFrom};')
for t in ['sc-if','sc-for','div','svg','button','label','section','aside','g']:
    o=len(re.findall(r'<'+t+r'[\s>]',tpl)); c=len(re.findall(r'</'+t+'>',tpl))
    if o!=c: print('UNBALANCED',t,o,c)
