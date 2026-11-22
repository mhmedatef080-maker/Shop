/* الكاشير: الأكثر مبيعاً (اختصار للإضافة السريعة) */
(function(){
let T=0;
async function ld(){
 if(!navigator.onLine||!auth||Date.now()-T<1800000)return;T=Date.now();
 try{const r=await sb.rpc('p_best_pos');if(r&&Array.isArray(r.data)){S.bsp=r.data;sv();render()}}catch(e){}
}
const V0=vSell;
vSell=function(){
 const h=V0();
 if(ty!='sell'||!h.includes('<div id="res"></div>'))return h;
 const L=(S.bsp||[]).map(id=>S.items.find(x=>x.id==id)).filter(x=>x&&!x.stop);
 if(!L.length)return h;
 return h.replace('<div id="res"></div>','<div id="res"></div><div class="mu" style="margin:6px 0 2px">⭐ الأكثر مبيعاً</div><div style="display:flex;gap:6px;overflow-x:auto;padding:2px 0 6px">'+L.map(x=>'<button class="sec" style="width:auto;flex:0 0 auto;margin:0;padding:8px 12px" onclick="add(\''+x.id+'\',\'\')">'+esc(x.name)+'<br><span class="mu">'+m(pr(x,null))+' ج</span></button>').join('')+'</div>');
};
const R0=render;
render=function(){R0();ld()};
render();
})();
