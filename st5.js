/* عروض المتجر: السعر القديم مشطوب + العروض أول القائمة */
(function(){
let SL=null,L0=0;
function apply(z){
 (D.items||[]).forEach(x=>{
  const s=SL[x.id];if(!s||x.sale)return;
  const r=s.sale/s.old;x.sale=1;x.old=x.price;x.price=s.sale;
  (x.units||[]).forEach(u=>{u.old=u.price;u.price=Math.round(u.price*r*100)/100});
 });
 D.items.sort((a,b)=>(b.sale?1:0)-(a.sale?1:0));
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
 if(cat||t)return;
 const cs=[...document.querySelectorAll('#l .p')],f=cs.find(c=>c.querySelector('.sl')),g=cs.find(c=>!c.querySelector('.sl'));
 const h=(tx)=>{const d=document.createElement('div');d.className='sh';d.style.cssText='font-weight:700;margin:10px 2px 0;color:#b91c1c';d.textContent=tx;return d};
 if(f&&!document.querySelector('.sh')){f.before(h('🔥 العروض'));if(g){const k=h('كل المنتجات');k.style.color='#1b1f24';g.before(k)}}
};
const r0=render;
render=function(){
 r0();
 if(!L0){L0=1;sb.rpc('p_sales').then(r=>{if(r&&r.data&&r.data.length){SL={};r.data.forEach(z=>SL[z.id]={sale:+z.sale,old:+z.old});apply();render()}},()=>{})}
};
})();
