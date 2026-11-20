/* سعر العرض للمتجر في شاشة الصنف */
(function(){
function ui(){
 const n=$('#n');
 if(!n||$('#sl')||!O())return;
 const e=edit&&S.items.find(i=>i.id==edit),d=document.createElement('div');
 d.innerHTML='<input id="sl" type="number" step="any" inputmode="decimal" placeholder="سعر العرض في المتجر (اختياري - فاضي = من غير عرض)" value="'+esc(e&&e.sale?e.sale:'')+'">';
 const c=$('#ct');(c?c.parentNode:n).after(d);
}
const R0=render;
render=function(){R0();ui()};
const S0=saveItem;
saveItem=function(){
 const c=$('#sl'),ed=edit,nm=$('#n')?$('#n').value.trim():'',L0=S.q.length,had=ed&&S.items.find(i=>i.id==ed);
 const sv0=c?(+c.value>0?+c.value:null):undefined;
 S0();
 if(sv0===undefined||S.q.length<=L0)return;
 if(sv0===null&&!(had&&had.sale))return;
 const id=ed||(S.items.filter(i=>i.name===nm).pop()||{}).id;
 if(!id)return;
 S.q.forEach(o=>{if(o.k=='item'&&o.v&&o.v.id==id)o.v.sale=sv0});
 const it=S.items.find(i=>i.id==id);if(it)it.sale=sv0;
 sv();
};
render();
})();
