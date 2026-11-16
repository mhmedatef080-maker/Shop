/* فاتورة مشتريات: تضيف الكمية على القديم */
(function(){
TL.buy='فاتورة مشتريات';
let PB={sup:'',cost:'last',lines:[],note:'',open:''};
window.PB=PB;
const sups=()=>typeof SUPL=='function'?SUPL():(S.sup||[]);
const tOpts=()=>Object.entries(TL).filter(([k])=>O()||k!='rbuy').map(([k,v])=>`<option value="${k}" ${k==ty?'selected':''}>${v}</option>`).join('');
function vBuy(){
 const tot=PB.lines.reduce((s,l)=>s+l.q*l.p,0);
 return `<div class="c"><select onchange="ty=this.value;cart=[];render()">${tOpts()}</select>
 <select onchange="PB.sup=this.value"><option value="">المورد (اختياري)</option>${sups().map(s=>`<option value="${s.id}" ${s.id==PB.sup?'selected':''}>${esc(s.name)}</option>`).join('')}</select>
 <select onchange="PB.cost=this.value">${[['last','سعر الشراء: آخر سعر'],['avg','سعر الشراء: متوسط مرجّح'],['none','سعر الشراء: بدون تغيير']].map(o=>`<option value="${o[0]}" ${PB.cost==o[0]?'selected':''}>${o[1]}</option>`).join('')}</select>
 <input id="bq" placeholder="ابحث بالاسم أو الباركود" oninput="bLst()" onkeydown="if(event.key=='Enter')bPick()"><div id="bres"></div></div>
 <div class="c"><b>فاتورة مشتريات</b>${PB.lines.map((l,i)=>`<div class="it" style="flex-wrap:wrap"><span style="flex:1 1 100%">${esc(l.n)}</span><span class="q"><input type="number" step="any" inputmode="decimal" value="${l.q}" onchange="bSet(${i},'q',this.value)" style="width:70px"> × <input type="number" step="any" inputmode="decimal" value="${l.p}" onchange="bSet(${i},'p',this.value)" style="width:80px"></span><span>${m(l.q*l.p)} ج</span><button class="del" onclick="PB.lines.splice(${i},1);render()">✕</button></div>`).join('')||'<p class="mu">ابحث وضيف الأصناف</p>'}
 <div class="it"><b>الإجمالي</b><b>${m(tot)} ج</b></div><input id="bn" placeholder="ملاحظة (اختياري)" value="${esc(PB.note)}" onchange="PB.note=this.value">
 <div class="e">${esc(msg)}</div>${PB.lines.length?'<button onclick="bSave()">حفظ وإضافة للمخزون</button>':''}</div>
 <div class="c"><b>آخر المشتريات</b>${(S.pur||[]).slice(0,20).map(p=>`<div class="it" style="flex-wrap:wrap" onclick="PB.open=PB.open=='${p.id}'?'':'${p.id}';render()"><span>${new Date(p.created_at).toLocaleString('ar-EG')}<br><span class="mu">${esc(p.sup_name||'')} ${esc(p.by_name||'')}</span></span><span>${m(p.total)} ج</span>${PB.open==p.id?`<div class="mu" style="flex:1 1 100%">${(p.lines||[]).map(l=>esc(l.n)+' × '+l.q+' = '+m(l.q*l.p)).join('<br>')}</div>`:''}</div>`).join('')||'<p class="mu">لسه مفيش</p>'}</div>`;
}
window.bLst=()=>{$('#bres').innerHTML=lookup($('#bq').value).map(({x,u})=>`<div class="it" onclick="bAdd('${x.id}','${u?u.id:''}')"><span>${esc(x.name)}${u?' - '+esc(u.name):''}</span><span class="mu">${m(x.qty)}</span></div>`).join('')};
window.bPick=()=>{const r=lookup($('#bq').value);if(r.length)bAdd(r[0].x.id,r[0].u?r[0].u.id:'')};
window.bAdd=(id,uid)=>{
 const x=S.items.find(i=>i.id==id);if(!x)return;
 const u=uid?S.units.find(v=>v.id==uid):null,f=u?+u.factor:1,l=PB.lines.find(z=>z.id==id&&z.uid==uid);
 if(l)l.q=qr(l.q+1);else PB.lines.push({id,uid,n:x.name+(u?' - '+u.name:''),q:1,f,k:!u&&x.unit=='k',p:qr((+x.buy||0)*f)});
 msg='';render();
};
window.bSet=(i,k,v)=>{PB.lines[i][k]=+v||0;render()};
window.vBuy=vBuy;
})();
