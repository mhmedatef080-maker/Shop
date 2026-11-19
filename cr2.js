/* حسابات العملاء (2): شاشة المالك */
(function(){
let L=null,T=0;
const V0=vCust;
vCust=function(){
 const h=V0();
 if(!O())return h;
 if(navigator.onLine&&Date.now()-T>10000){T=Date.now();sb.rpc('p_cust_bals').then(r=>{if(!r.error&&r.data){L=r.data;if(tab=='cust')render()}},()=>{})}
 const pe={};(S.cx||[]).forEach(t=>pe[t.v.cust]=(pe[t.v.cust]||0)+t.v.amount);
 const bl={};(L||[]).forEach(z=>bl[z.cust]=+z.bal);Object.keys(pe).forEach(k=>bl[k]=(bl[k]||0)+pe[k]);
 const rows=S.custs.filter(c=>bl[c.id]).sort((a,b)=>bl[b.id]-bl[a.id]);
 return h+`<div class="c"><b>حسابات العملاء</b>${rows.map(c=>`<div class="it" style="flex-wrap:wrap"><span>${esc(c.name)}<br><span class="mu">${esc(c.phone||'')}</span></span><b class="${bl[c.id]>0?'e':''}">${m(Math.abs(bl[c.id]))} ج ${bl[c.id]>0?'عليه':'له'}</b><div class="r" style="flex:1 1 100%"><button class="sec" onclick="crOw('${c.id}')">استلام دفعة</button></div></div>`).join('')||'<p class="mu">مفيش حسابات مفتوحة</p>'}
 <b>رصيد افتتاحي</b><select id="cro"><option value="">اختار العميل</option>${S.custs.map(c=>`<option value="${c.id}">${esc(c.name)}</option>`).join('')}</select><input id="cra" type="number" step="any" inputmode="decimal" placeholder="المبلغ"><div class="r"><button onclick="crAdd(1)">دين سابق عليه</button><button class="sec" onclick="crAdd(-1)">رصيد له</button></div></div>`;
};
const add=(id,v,k)=>{S.cx=(S.cx||[]).concat([{v:{id:crypto.randomUUID(),cust:id,amount:v,kind:k,by:localStorage.pn||'المالك'}}]);T=0;sv();render();sync()};
window.crOw=id=>{const v=+String(prompt('المبلغ المستلم من العميل')||'').replace(/[^\d.]/g,'');if(v>0)add(id,-v,'pay')};
window.crAdd=sg=>{const id=$('#cro').value,v=+$('#cra').value;if(id&&v>0)add(id,sg*v,'adj')};
})();
