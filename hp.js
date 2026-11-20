/* تعليق الفاتورة */
(function(){
const tot=c=>Math.round(c.reduce((s,x)=>s+x.q*x.p,0)*100)/100;
window.hpPut=()=>{
 if(!cart.length)return;
 S.hold=S.hold||[];
 S.hold.push({id:Date.now(),at:new Date().toISOString(),cart:JSON.parse(JSON.stringify(cart)),cust,ty,mode,by:localStorage.pn||''});
 cart=[];cust='';sv();render();
};
window.hpGet=id=>{
 if(cart.length){alert('علّق الفاتورة الحالية أو كمّلها الأول');return}
 const i=(S.hold||[]).findIndex(h=>h.id==id);if(i<0)return;
 const h=S.hold.splice(i,1)[0];
 ty=h.ty;mode=h.mode;cust=h.cust;cart=h.cart;sv();render();
};
window.hpDel=id=>{if(!confirm('مسح الفاتورة المعلقة؟'))return;S.hold=(S.hold||[]).filter(h=>h.id!=id);sv();render()};
const R0=render;
render=function(){
 R0();
 const a=$('#a');if(!a||tab!='sell'||$('#hpb'))return;
 const btn=[...a.querySelectorAll('button')].find(b=>/done\(\)/.test(b.getAttribute('onclick')||''));
 if(btn&&cart.length){const b=document.createElement('button');b.id='hpb';b.className='sec';b.textContent='⏸ علّق الفاتورة';b.setAttribute('onclick','hpPut()');btn.after(b)}
 const L=S.hold||[];
 if(L.length){
  const d=document.createElement('div');d.id='hpl';d.className='c';
  d.innerHTML='<b>فواتير معلقة ('+L.length+')</b>'+L.map(h=>'<div class="it" style="flex-wrap:wrap"><span>'+esc(h.cart.map(x=>x.n.split(' - ')[0]).slice(0,2).join('، '))+(h.cart.length>2?' …':'')+'<br><span class="mu">'+new Date(h.at).toLocaleTimeString('ar-EG',{hour:'2-digit',minute:'2-digit'})+' · '+h.cart.length+' صنف</span></span><b>'+m(tot(h.cart))+' ج</b><div class="r" style="width:100%"><button onclick="hpGet('+h.id+')">كمّل</button><button class="sec" onclick="hpDel('+h.id+')">مسح</button></div></div>').join('');
  a.insertBefore(d,a.children[1]||null);
 }
};
render();
})();
