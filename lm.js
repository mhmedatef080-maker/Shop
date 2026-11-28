/* حدود الأجل + عميل موثوق + عدد فواتير كل عميل */
(function(){
let N={},T=0;
const r2=v=>Math.round(v*100)/100,tt=()=>r2(cart.reduce((s,x)=>s+x.q*x.p,0));
window.lmMax=(id,tot)=>{
 const c=S.custs.find(x=>x.id==id);
 return c?r2(tot*(c.trusted?0.2:0.1)):0;
};
function ld(){
 if(!navigator.onLine||!auth||Date.now()-T<60000)return;T=Date.now();
 sb.rpc('p_cust_cnt').then(r=>{if(r&&!r.error&&Array.isArray(r.data)){N={};r.data.forEach(z=>N[z.cust]=+z.n);if(tab=='cust')render()}},()=>{});
}
window.lmT=id=>{
 if(!O())return;
 const c=S.custs.find(x=>x.id==id);if(!c)return;
 c.trusted=!c.trusted;S.q.push({k:'cust',v:Object.assign({},c)});sv();render();sync();
};
const V0=vCust;
vCust=function(){
 let h=V0();ld();
 S.custs.forEach(c=>{
  const old=`<div class="it"><span>${esc(c.name)}</span><span class="mu">${esc(c.phone||'')}</span></div>`;
  if(!h.includes(old))return;
  const b=O()?`<button class="${c.trusted?'':'sec'}" style="width:auto;margin:0;padding:6px 10px" onclick="lmT('${c.id}')">${c.trusted?'موثوق ✓':'موثوق؟'}</button>`:(c.trusted?'<span class="ok">موثوق</span>':'');
  h=h.replace(old,`<div class="it"><span>${esc(c.name)} <b>(${N[c.id]||0})</b><br><span class="mu">${esc(c.phone||'')} · عدد الفواتير</span></span>${b}</div>`);
 });
 return h;
};
const D0=done;
done=function(){
 if(ty=='sell'&&!O()&&cart.length){
  const tot=tt(),pd=String(window.CRP||'').trim(),rem=pd===''?0:r2(tot-(+pd||0));
  if(rem>0.009){
   const mx=cust?lmMax(cust,tot):0;
   if(rem>mx+0.009){alert(cust?'الأجل أكبر من المسموح. أقصى أجل لهذا العميل '+m(mx)+' ج':'العميل النقدي مفيش له أجل. اختار عميل مسجل أو ادفع كامل');return}
  }
 }
 return D0();
};
const R0=render;
render=function(){
 R0();
 const e=$('#crb');
 if(!e||ty!='sell'||$('#lmh'))return;
 const d=document.createElement('div');d.id='lmh';d.className='mu';
 d.textContent=O()?'':'أقصى أجل مسموح: '+m(lmMax(cust,tt()))+' ج'+((S.custs.find(x=>x.id==cust)||{}).trusted?' (موثوق)':'');
 e.appendChild(d);
};
})();
