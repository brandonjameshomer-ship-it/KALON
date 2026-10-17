const m=require('./chk.js');const fs=require('fs');
const tpl=fs.readFileSync('hs/project/Main.dc.html','utf8').split('<script type="text/x-dc"')[0];
const loops={};for(const mm of tpl.matchAll(/<sc-for list="\{\{\s*([\w.]+)\s*\}\}" as="(\w+)"/g)) loops[mm[2]]=mm[1];
const holes=fs.readFileSync('holes.txt','utf8').split('\n').filter(Boolean);
const LAYER_OPTIONAL=new Set(['btf1','btf2','d2','bw','dash','bSelDisp','symD','symTf','symFill','symStroke','symSw','family','fstyle','fs','ls','tx','ty','lhpx','text','shadow','img','px0','py0','pw','ph','rx','ry','clipId','imgF','blend','frameDisp','frameW','pop']);
function resolve(v,alias){const path=loops[alias];if(!path)return null;const [a,...rest]=path.split('.');let base;if(loops[a]){const par=resolve(v,a);if(!par||!par.length)return [];base=par.flatMap(x=>{let o=x;for(const r of rest)o=o&&o[r];return o||[]});return base;} base=v[a];for(const r of rest)base=base&&base[r];return base||[];}
function check(v,label){const miss=new Set();for(const h of holes){const [a,b]=h.split('.');if(b===undefined){if(!(a in v)&&!/^\d/.test(a)&&!['true','false'].includes(a))miss.add(h);continue;}
 if(!loops[a]){if(!(a in v)||v[a]==null||!(b in v[a]))miss.add(h);continue;}
 const items=resolve(v,a);for(const it of items){if(!(b in it)||it[b]===undefined){if(a==='l'&&LAYER_OPTIONAL.has(b))continue;miss.add(h+'@'+label);}}}
 if(miss.size)console.log('MISSING',label,[...miss].join(' '));}
const c=new m.Component();c.later=(fn)=>{};
c.fillSample();c.state.photos=[{id:'p1',name:'a.jpg',url:'data:x',ratio:1.3}];
check(c.renderVals(),'intake');
for(let i=0;i<6;i++){c.state.wstep=i;check(c.renderVals(),'w'+i);}
c.build();check(c.renderVals(),'building');
c.showDesigns(0);c.state.revealed=true;check(c.renderVals(),'options');
c.choose(1);check(c.renderVals(),'focus');
c.startGuided();for(let i=0;i<7;i++){c.state.gstep=i;check(c.renderVals(),'g'+i);}
// exercise guided actions
c.setParam({layout:'marker'});c.setType('grass');c.setShape('dheart');c.setParam({photoPlace:'right'});c.setShape('book');c.setType('slant');c.setParam({layout:'side',fonts:'gothic'});c.setType('pillow');c.setParam({layout:'family'});
let v=c.renderVals();console.log('after guided:',c.cur().type,c.cur().shape,c.cur().W,c.cur().H,m.hsChecks(c.cur()).map(x=>x.text));
c.startEdit();for(const t of ['layers','measure','handoff']){c.state.rtab=t;check(c.renderVals(),'edit-'+t);}
c.goFinal();c.state.finShown=true;v=c.renderVals();check(v,'final');console.log('scene',c.state.scene,v.finWhy);
// all designs checks for all types/layouts
let RED=0,YEL=0,EDGE=0;const C=m.hsContentFrom(c.state.form,c.state.analysis,c.state.photos);
for(const type of ['upright','slant','bevel','pillow','grass'])for(const lay of ['family','classic','side','marker','below'])for(const shape of ['serp','flat','arch','roof','gothic','heart','dheart','book','teardrop']){
 const d=JSON.parse(JSON.stringify(c.state.designs[1]));d.type=type;d.shape=shape;d.params.layout=lay;
 const info={upright:[40,24],slant:[30,16],bevel:[24,12],pillow:[24,14],grass:[24,12]}[type];d.W=info[0];d.H=info[1];if(shape==='heart')d.H=Math.max(d.H,Math.round(d.W*.8));if(shape==='dheart')d.H=Math.max(d.H,Math.round(d.W*.62));d.base=['upright','slant'].includes(type);
 d.layers=m.hsLayoutBest(d,C);const ch=m.hsChecks(d);const S=m.hsLayerStatus(d);RED+=S.red;YEL+=S.yellow;EDGE+=ch.filter(x=>x.kind==="edge").length;if(S.red)console.log("RED",type,lay,shape,d.fitScale,S.list.filter(x=>x.level==="red").map(x=>x.name+":"+x.text).join(" | "));if(0)console.log(type,lay,shape,ch.length,ch.map(x=>x.kind+':'+x.text.slice(0,40)).join(' | '));}
console.log("TOTAL red",RED,"yellow",YEL,"edge",EDGE);
