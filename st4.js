/* صور الأصناف في المتجر */
(function(){
const B='https://gbdojrwoqimohxbymifw.supabase.co/storage/v1/object/public/img/',IM={};let L0=0;
const l0=list;
list=function(){
 l0();
 const t=q.trim().toLowerCase(),L=items().filter(x=>(!cat||(x.cat||'أخرى')==cat)&&(!t||(x.name||'').toLowerCase().includes(t)));
 [...document.querySelectorAll('#l .p')].forEach((c,i)=>{
  const x=L[i];if(!x||!IM[x.id]||c.querySelector('.im'))return;
  const g=document.createElement('img');g.className='im';g.loading='lazy';g.src=B+x.id+'.jpg?v='+IM[x.id];
  g.style.cssText='width:100%;max-height:170px;object-fit:contain;background:#fff;border-radius:10px;margin-bottom:6px';
  g.onerror=()=>g.remove();c.prepend(g);
 });
};
const r0=render;
render=function(){
 r0();
 if(!L0){L0=1;sb.rpc('p_img_list').then(r=>{if(r&&r.data&&r.data.length){r.data.forEach(z=>IM[z.id]=z.v);list()}},()=>{})}
};
})();
