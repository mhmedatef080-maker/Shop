/* نص جملة */
(function(){
const P0=pr;
pr=function(x,u){
 if(mode=='h'&&ty!='rbuy'){
  const h=+x.half;
  if(h>0)return u?h*(+u.factor):h;
  const o=mode;mode='r';
  try{return P0(x,u)}finally{mode=o}
 }
 return P0(x,u);
};
function halfUI(){
 const w=$('#wp');
 if(w&&!$('#hp')){
  const d=document.createElement('div');d.className='r';
  d.innerHTML='<input id="hp" type="number" step="any" inputmode="decimal" placeholder="سعر نص جملة (اختياري)">';
  w.parentElement.after(d);
  const e=edit&&S.items.find(i=>i.id==edit);
  if(e&&+e.half)$('#hp').value=e.half;
 }
 const wb=[...document.querySelectorAll('button')].find(b=>b.textContent.trim()=='جملة');
 if(wb&&!wb.dataset.h){
  wb.dataset.h=1;
  const b=document.createElement('button');
  b.textContent='نص جملة';b.className=mode=='h'?'':'sec';
  b.onclick=()=>{mode='h';reprice()};
  wb.after(b);
 }
}
const R0=render;
render=function(){R0();halfUI()};
const S0=saveItem;
saveItem=function(){
 const h=$('#hp'),hv=h?(+h.value||0):null,ed=edit,n=$('#n')?$('#n').value.trim():'',L0=S.q.length;
 S0();
 if(hv===null||S.q.length<=L0)return;
 let id=ed;
 if(!id){const x=S.items.filter(i=>i.name===n).pop();id=x&&x.id}
 if(!id)return;
 S.q.forEach(o=>{if(o.k=='item'&&o.v&&o.v.id==id)o.v.half=hv});
 const it=S.items.find(i=>i.id==id);if(it)it.half=hv;
 sv();
};
render();
})();
