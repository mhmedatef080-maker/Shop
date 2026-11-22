/* المتجر: قسم الأكثر مبيعاً */
(function(){
let BS=null,L0=0;
const l0=list;
list=function(){
 l0();
 const l=$('#l');if(!l||cat||q.trim()||!BS||!BS.length||l.querySelector('.bsx'))return;
 const it=items(),L=BS.map(id=>{const i=it.findIndex(x=>x.id==id);return i<0?null:[it[i],i]}).filter(z=>z&&z[0].ok);
 if(!L.length)return;
 const d=document.createElement('div');d.className='bsx';
 d.innerHTML='<div style="font-weight:700;margin:10px 2px 0;color:#b45309">⭐ الأكثر مبيعاً</div><div style="display:flex;gap:8px;overflow-x:auto;padding:6px 2px">'+L.map(([x,i])=>'<div class="p" style="min-width:150px;flex:0 0 auto"><b>'+esc(x.name)+'</b><div class="pr"><span>'+m(x.price)+' ج'+(x.unit=='k'?' / كيلو':'')+'</span></div><button style="margin:6px 0 0;padding:8px" onclick="add('+i+')">أضف +</button></div>').join('')+'</div>';
 const hs=l.querySelectorAll('.sh'),a=l.querySelector('.cbx');
 if(hs.length>1)hs[1].before(d);else if(a)a.after(d);else l.prepend(d);
};
const r0=render;
render=function(){
 r0();
 if(!L0){L0=1;sb.rpc('p_best').then(r=>{if(r&&Array.isArray(r.data)&&r.data.length){BS=r.data;list()}},()=>{})}
};
})();
