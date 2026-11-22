/* إيقاف بيع صنف (كاشير + متجر) حتى لو فيه رصيد */
(function(){
const V0=vItems;
vItems=function(){
 let h=V0();
 if(!O()||!/<button onclick="saveItem\(\)">/.test(h))return h;
 const e=edit?S.items.find(x=>x.id==edit):null;
 return h.replace('<button onclick="saveItem()">','<label style="display:flex;gap:8px;align-items:center;margin:8px 0"><input type="checkbox" id="stp" style="width:auto;margin:0" '+(e&&e.stop?'checked':'')+'> إيقاف بيع الصنف (كاشير ومتجر) حتى لو فيه رصيد</label><button onclick="saveItem()">');
};
const S0=saveItem;
saveItem=function(){
 const c=$('#stp'),cv=c?!!c.checked:undefined,ed=edit,nm=$('#n')?$('#n').value.trim():'',L0=S.q.length;
 S0();
 if(cv===undefined||S.q.length<=L0)return;
 const id=ed||(S.items.filter(i=>i.name===nm).pop()||{}).id;
 if(!id)return;
 S.q.forEach(o=>{if(o.k=='item'&&o.v&&o.v.id==id)o.v.stop=cv});
 const it=S.items.find(i=>i.id==id);if(it)it.stop=cv;
 sv();
};
const A0=add;
add=function(id,uid){
 const x=S.items.find(i=>i.id==id);
 if(x&&x.stop&&ty!='buy'&&ty!='rbuy'){msg='الصنف ده موقوف بيعه: '+x.name;render();return}
 return A0(id,uid);
};
const K0=stk;
stk=function(x){return K0(x)+(x&&x.stop?' ⛔ موقوف':'')};
render();
})();
