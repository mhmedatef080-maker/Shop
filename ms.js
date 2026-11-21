/* الصنف لأكتر من مورد */
(function(){
let T0=0;
const ids=x=>Array.isArray(x.sups)&&x.sups.length?x.sups:(x.supplier?[x.supplier]:[]);
window.msIds=ids;
window.msSync=()=>{const c=[...document.querySelectorAll('.msc:checked')].map(i=>i.value),s=$('#sp');if(s)s.value=c[0]||''};
const V0=vItems;
vItems=function(){
 let h=V0();
 if(!O()||!/<select id="sp">/.test(h))return h;
 const e=edit?S.items.find(x=>x.id==edit):null,cur=e?ids(e):[];
 const box='<div class="c" id="msb"><b>الموردين (اختار أكتر من واحد لو بتشتريه من أكتر من مورد)</b>'+SUPL().map(s=>'<label style="display:flex;gap:8px;align-items:center;margin:6px 0"><input type="checkbox" class="msc" style="width:auto;margin:0" value="'+s.id+'" '+(cur.includes(s.id)?'checked':'')+' onchange="msSync()"> '+esc(s.name)+'</label>').join('')+(SUPL().length?'':'<p class="mu">ضيف موردين من تبويب عملاء ← الموردين</p>')+'</div>';
 return h.replace(/<select id="sp">[\s\S]*?<\/select>/,m=>m.replace('<select id="sp">','<select id="sp" style="display:none">')+box);
};
const S0=saveItem;
saveItem=function(){
 const has=!!$('#sp'),c=has?[...document.querySelectorAll('.msc:checked')].map(i=>i.value):null,n0=S.q.length;
 if(has)msSync();
 S0();
 if(!has)return;
 for(let i=n0;i<S.q.length;i++){const o=S.q[i];if(o.k=='cost'){o.v.supplier=c[0]||null;o.v.sups=c;const x=S.items.find(z=>z.id==o.v.id);if(x){x.supplier=c[0]||null;x.sups=c}}}
 sv();
};
async function ld(){
 if(!O()||!navigator.onLine||!auth||Date.now()-T0<30000)return;T0=Date.now();
 try{const r=await sb.from('p_costs').select('id,sups');if(r.error)return;
  const mp={};r.data.forEach(z=>{if(Array.isArray(z.sups))mp[z.id]=z.sups});
  let ch=0;S.items.forEach(x=>{if(x.id in mp&&JSON.stringify(x.sups)!=JSON.stringify(mp[x.id])){x.sups=mp[x.id];ch=1}});
  if(ch){sv();render()}}catch(e){}
}
const R0=render;
render=function(){R0();ld()};
render();
})();
