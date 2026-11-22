/* سعر لكل صنف في الفاتورة: تجزئة / جملة / نص جملة */
(function(){
const PT=(x,u,t)=>{const o=mode;if(t)mode=t;try{return pr(x,u)}finally{mode=o}};
const get=c=>{const x=S.items.find(z=>z.id==c.id);return x?{x,u:c.uid?S.units.find(v=>v.id==c.uid):null}:null};
window.lnT=(i,t)=>{const c=cart[i],g=c&&get(c);if(!g)return;c.t=t||undefined;if(t=='w'||t=='h'){c.fx=1;c.fxt=1}else if(c.fxt){c.fx=undefined;c.fxt=undefined}c.p=PT(g.x,g.u,c.t);render()};
reprice=function(){cart.forEach(c=>{const g=get(c);if(g)c.p=PT(g.x,g.u,c.t)});render()};
const V0=vSell;
vSell=function(){
 const h=V0();
 if(ty=='rbuy'||ty=='buy')return h;
 return h.replace(/<button class="del" onclick="cart\.splice\((\d+),1\);render\(\)">/g,(m0,i)=>{
  const c=cart[+i]||{};
  return '<select style="width:auto;padding:4px;margin:0 4px" onchange="lnT('+i+',this.value)">'+[['','تلقائي'],['r','تجزئة'],['w','جملة'],['h','نص جملة']].map(o=>'<option value="'+o[0]+'" '+((c.t||'')==o[0]?'selected':'')+'>'+o[1]+'</option>').join('')+'</select>'+m0;
 });
};
render();
})();
