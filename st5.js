/* عروض المتجر: سعر مشطوب + عرض كمية (٣ كجم بـ ١٠٠) + العروض أول القائمة */
(function(){
let SL=null,L0=0;
const nm=x=>x.unit=='k'?'كجم':'قطع';
function apply(){
 (D.items||[]).forEach(x=>{
  const s=SL[x.id];if(!s||x.offer)return;
  x.offer=1;
  if(s.sale){const r=s.sale/s.old;x.sale=1;x.old=x.price;x.price=s.sale;(x.units||[]).forEach(u=>{u.old=u.price;u.price=Math.round(u.price*r*100)/100})}
  if(s.bq){x.bq=s.bq;x.bp=s.bp}
 });
 D.items.sort((a,b)=>(b.offer?1:0)-(a.offer?1:0));
}
function fix(){
 Object.values(cart).forEach(c=>{
  const x=(D.items||[]).find(i=>i.id==c.id);if(!x||c.u)return;
  if(x.bq&&c.q>=x.bq){const n=Math.floor(c.q/x.bq+1e-9);c.p=(n*x.bp+(c.q-n*x.bq)*x.price)/c.q}else c.p=x.price;
 });
 sv();bar();if(open)cartView();
}
['add','chg','gset'].forEach(f=>{const o=window[f];if(typeof o!='function')return;window[f]=function(){o.apply(this,arguments);if(SL)fix()}});
const l0=list;
list=function(){
 l0();
 if(!SL)return;
 const t=q.trim().toLowerCase(),L=items().filter(x=>(!cat||(x.cat||'أخرى')==cat)&&(!t||(x.name||'').toLowerCase().includes(t)));
 [...document.querySelectorAll('#l .p')].forEach((c,i)=>{
  const x=L[i];if(!x||!x.offer||c.querySelector('.sl'))return;
  const b=c.querySelector('.pr');if(!b)return;
  const e=document.createElement('div');e.className='sl';e.style.cssText='color:#b91c1c;font-size:14px;font-weight:700';
  e.innerHTML='🔥 '+(x.bq?x.bq+' '+nm(x)+' بـ '+m(x.bp)+' ج ':'عرض ')+(x.sale&&!(x.units||[]).length?'<s style="color:#888;font-weight:400">'+m(x.old)+' ج</s>':'');
  b.after(e);
 });
 if(cat||t)return;
 const cs=[...document.querySelectorAll('#l .p')],f=cs.find(c=>c.querySelector('.sl')),g=cs.find(c=>!c.querySelector('.sl'));
 const h=tx=>{const d=document.createElement('div');d.className='sh';d.style.cssText='font-weight:700;margin:10px 2px 0;color:#b91c1c';d.textContent=tx;return d};
 if(f&&!document.querySelector('.sh')){f.before(h('🔥 العروض'));if(g){const k=h('كل المنتجات');k.style.color='#1b1f24';g.before(k)}}
};
const r0=render;
render=function(){
 r0();
 if(!L0){L0=1;sb.rpc('p_sales').then(r=>{if(r&&r.data&&r.data.length){SL={};r.data.forEach(z=>SL[z.id]={sale:z.sale?+z.sale:0,old:+z.old,bq:z.bq?+z.bq:0,bp:z.bp?+z.bp:0});apply();render()}},()=>{})}
};
})();
