/* عروض المتجر: السعر القديم مشطوب */
(function(){
let SL=null,L0=0;
function apply(z){
 (D.items||[]).forEach(x=>{
  const s=SL[x.id];if(!s||x.sale)return;
  const r=s.sale/s.old;x.sale=1;x.old=x.price;x.price=s.sale;
  (x.units||[]).forEach(u=>{u.old=u.price;u.price=Math.round(u.price*r*100)/100});
 });
}
const l0=list;
list=function(){
 l0();
 if(!SL)return;
 const t=q.trim().toLowerCase(),L=items().filter(x=>(!cat||(x.cat||'أخرى')==cat)&&(!t||(x.name||'').toLowerCase().includes(t)));
 [...document.querySelectorAll('#l .p')].forEach((c,i)=>{
  const x=L[i];if(!x||!x.sale||c.querySelector('.sl'))return;
  const b=c.querySelector('.pr');if(!b)return;
  const e=document.createElement('span');e.className='sl';e.style.cssText='color:#b91c1c;font-size:13px';
  e.innerHTML='🔥 عرض'+((x.units||[]).length?'':' <s style="color:#888">'+m(x.old)+' ج</s>');
  b.querySelector('b').after(e);
 });
};
const r0=render;
render=function(){
 r0();
 if(!L0){L0=1;sb.rpc('p_sales').then(r=>{if(r&&r.data&&r.data.length){SL={};r.data.forEach(z=>SL[z.id]={sale:+z.sale,old:+z.old});apply();render()}},()=>{})}
};
})();
