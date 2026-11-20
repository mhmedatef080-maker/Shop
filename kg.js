/* الكاشير: الأصناف بالكيلو بالجرام */
(function(){
const R0=render;
render=function(){
 R0();
 document.querySelectorAll('#a input[onchange^="qty("]').forEach(e=>{
  const m=/^qty\((\d+),0,this\.value\)$/.exec(e.getAttribute('onchange')||'');if(!m)return;
  const i=+m[1],c=cart[i];if(!c||!c.k||e.dataset.g)return;
  e.dataset.g=1;e.step='1';e.setAttribute('inputmode','numeric');e.value=Math.round(c.q*1000);
  e.setAttribute('onchange','qty('+i+',0,(+this.value||0)/1000)');
  const u=document.createElement('span');u.className='mu';u.textContent=' جم';e.after(u);
  const bs=[...e.parentNode.querySelectorAll('button.qb')];
  [[0.25,'٢٥٠'],[0.5,'٥٠٠'],[1,'١ كجم']].forEach((p,j)=>{if(bs[j]){bs[j].textContent=p[1];bs[j].setAttribute('onclick','qty('+i+',0,'+p[0]+')')}});
 });
};
render();
})();
