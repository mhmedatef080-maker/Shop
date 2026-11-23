/* المتجر: عدد المنتجات (إجمالي وعلى كل قسم) */
(function(){
const r0=render;
render=function(){
 r0();
 const it=items(),h=$('#a h1');
 if(!h||$('#icn'))return;
 const e=document.createElement('div');e.id='icn';e.className='mu';e.style.textAlign='center';e.textContent='🛍️ '+it.length+' منتج';
 h.after(e);
 const bs=document.querySelectorAll('.ch button');
 bs.forEach((b,j)=>{
  const n=j==0?it.length:it.filter(x=>(x.cat||'أخرى')==CT[j-1]).length;
  b.textContent+=' ('+n+')';
 });
};
})();
