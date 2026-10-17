const m=require('./chk.js');const c=new m.Component();c.later=()=>{};c.setState=function(p){Object.assign(this.state,typeof p==='function'?p(this.state):p)};
c.fillSample();for(const v of [0,1,2]){c.build();c.showDesigns(v);c.state.designs.forEach((d,i)=>{const S=m.hsLayerStatus(d);console.log('v'+v,'D'+(i+1),d.tier,d.W+'x'+d.H,d.shape,'red',S.red,'yel',S.yellow,JSON.stringify(d.vase||null));});}
