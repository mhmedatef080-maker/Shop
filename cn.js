/* شاشة المركزي: يكتب المدفوع ويحفظ أو يرفض */
(function(){
const P=window.CNX={rows:[],sig:'',T:0};
const hm=t=>new Date(t).toLocaleTimeString('ar-EG',{hour:'numeric',minute:'2-digit'});
const r2=v=>Math.round(v*100)/100;
async function ld(f){
 if(!auth||!navigator.onLine||(!f&&Date.now()-P.T<4000))return;P.T=Date.now();
 try{
  const r=await sb.from('p_pending').select('*').eq('status','wait').order('created_at');
  if(r&&!r.error&&Array.isArray(r.data)){
   const sg=r.data.map(x=>x.id).join();P.rows=r.data;
   if(sg!=P.sig){P.sig=sg;if(tab=='sell'&&PQC())render()}
  }
 }catch(e){}
}
function card(r){
 const c=S.custs.find(x=>x.id==r.cust),t=+r.total,lo=r2(t-lmMax(r.cust,t));
 return `<div class="c"><div class="it"><span><b>${esc(r.cust_name||'نقدي')}</b>${c&&c.trusted?' · موثوق':''}<br><span class="mu">البياع ${esc(r.by_name||'')} · ${hm(r.created_at)}</span></span><b>${m(t)} ج</b></div>${(r.cart||[]).map(x=>`<div class="mu">${esc(x.n)} × ${x.q}</div>`).join('')}
 <input id="cnp_${r.id}" type="number" step="any" inputmode="decimal" value="${t}" placeholder="المدفوع">
 <select id="cnm_${r.id}"><option value="cash">نقدي</option><option value="vf">فودافون كاش</option><option value="ip">إنستا باي</option></select>
 <p class="mu">أقل مبلغ مسموح: ${m(lo)} ج</p>
 <div class="r"><button onclick="cnOk('${r.id}')">تم الحفظ</button><button class="del" onclick="cnNo('${r.id}')">رفض</button></div></div>`;
}
window.cnOk=async id=>{
 const r=P.rows.find(x=>x.id==id);if(!r)return;
 const pd=r2(+$('#cnp_'+id).value),t=+r.total,lo=r2(t-lmMax(r.cust,t));
 if(!(pd>=0)||pd>t+0.009){alert('المدفوع لازم يكون بين صفر وإجمالي الفاتورة');return}
 if(pd<lo-0.009){alert('المدفوع قليل. أقل مبلغ مسموح '+m(lo)+' ج');return}
 const k=await sb.rpc('p_pend_set',{p_id:id,p_st:'done',p_paid:pd});
 if(k.error||k.data!==true){alert('الفاتورة دي اتلغت أو اتغيّرت. هحدّث القايمة');ld(1);return}
 const pn=localStorage.pn,pm=$('#cnm_'+id).value;
 try{
  if(r.by_name)localStorage.pn=r.by_name;
  cart=r.cart||[];cust=r.cust||'';ty='sell';window.CRP=pd<t-0.009?String(pd):'';PM=pm;
  done();
 }finally{if(pn==null)localStorage.removeItem('pn');else localStorage.pn=pn}
 P.rows=P.rows.filter(x=>x.id!=id);P.sig=P.rows.map(x=>x.id).join();render();
};
window.cnNo=async id=>{
 const s=prompt('سبب الرفض (مثلاً: سعر غلط)');if(!s||!s.trim())return;
 const k=await sb.rpc('p_pend_set',{p_id:id,p_st:'rej',p_reason:s.trim()});
 if(k.error||k.data!==true)alert('الفاتورة دي اتلغت أو اتغيّرت');
 ld(1);
};
const V0=vSell;
vSell=function(){
 if(!PQC())return V0();
 ld();
 return `<div class="c" style="background:#fee2e2;color:#b91c1c"><b>🚫 ممنوع الأجل: المدفوع لازم يغطي الفاتورة إلا الحد المسموح</b></div><div class="c"><b>فواتير منتظرة (${P.rows.length})</b><div class="r"><button class="sec" onclick="CNX.T=0;ld2()">تحديث</button><button class="sec" onclick="rp(0)">🖨 طباعة آخر فاتورة</button></div><div class="e">${msg}</div></div>`+(P.rows.map(card).join('')||'<div class="c"><p class="mu">مفيش فواتير منتظرة</p></div>');
};
window.ld2=()=>ld(1);
const U0=vSet;
vSet=function(){
 return U0()+(O()?`<div class="c"><b>تلفون المركزي</b><label style="display:flex;gap:8px;align-items:center"><input type="checkbox" style="width:auto;margin:0" ${PQC()?'checked':''} onchange="localStorage.cn=this.checked?'1':'';render()"> الجهاز ده هو المركزي (بيستقبل الفواتير)</label></div>`:'');
};
setInterval(()=>{if(PQC()&&tab=='sell')ld()},5000);
})();
