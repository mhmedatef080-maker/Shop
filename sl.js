/* العروض في شاشة الصنف: سعر العرض + عرض كمية (٣ بـ ١٠٠) */
(function(){
function ui(){
 const n=$('#n');
 if(!n||$('#sl')||!O())return;
 const e=edit&&S.items.find(i=>i.id==edit)||{},d=document.createElement('div');
 d.innerHTML='<input id="sl" type="number" step="any" inputmode="decimal" placeholder="سعر العرض في المتجر (اختياري)" value="'+esc(e.sale||'')+'"><div class="r"><input id="obq" type="number" step="any" inputmode="decimal" placeholder="عرض كمية: الكمية (٣)" value="'+esc(e.bq||'')+'"><input id="obp" type="number" step="any" inputmode="decimal" placeholder="بسعر (١٠٠)" value="'+esc(e.bp||'')+'"></div>';
 const c=$('#ct');(c?c.parentNode:n).after(d);
}
const R0=render;
render=function(){R0();ui()};
const S0=saveItem;
saveItem=function(){
 const c=$('#sl'),ed=edit,nm=$('#n')?$('#n').value.trim():'',L0=S.q.length,had=(ed&&S.items.find(i=>i.id==ed))||{};
 const num=id=>{const v=+($(id)||{}).value;return v>0?v:null};
 const A=c?{sale:num('#sl'),bq:num('#obq'),bp:num('#obp')}:null;
 if(A&&(!A.bq||!A.bp)){A.bq=null;A.bp=null}
 S0();
 if(!A||S.q.length<=L0)return;
 if(!A.sale&&!A.bq&&!had.sale&&!had.bq)return;
 const id=ed||(S.items.filter(i=>i.name===nm).pop()||{}).id;
 if(!id)return;
 S.q.forEach(o=>{if(o.k=='item'&&o.v&&o.v.id==id)Object.assign(o.v,A)});
 const it=S.items.find(i=>i.id==id);if(it)Object.assign(it,A);
 sv();
};
render();
})();
