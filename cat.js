/* خانة القسم في شاشة الصنف */
(function(){
function ui(){
 const n=$('#n');
 if(!n||$('#ct'))return;
 const e=edit&&S.items.find(i=>i.id==edit),cs=[...new Set(S.items.map(x=>x.cat).filter(Boolean))];
 const d=document.createElement('div');
 d.innerHTML='<input id="ct" list="ctl" placeholder="القسم (عطور / منظفات / ورقيات ...)" value="'+esc(e&&e.cat?e.cat:'')+'"><datalist id="ctl">'+cs.map(c=>'<option value="'+esc(c)+'">').join('')+'</datalist>';
 n.after(d);
}
const R0=render;
render=function(){R0();ui()};
const S0=saveItem;
saveItem=function(){
 const c=$('#ct'),cv=c?(c.value.trim()||null):undefined,ed=edit,nm=$('#n')?$('#n').value.trim():'',L0=S.q.length;
 S0();
 if(cv===undefined||S.q.length<=L0)return;
 const id=ed||(S.items.filter(i=>i.name===nm).pop()||{}).id;
 if(!id)return;
 S.q.forEach(o=>{if(o.k=='item'&&o.v&&o.v.id==id)o.v.cat=cv});
 const it=S.items.find(i=>i.id==id);if(it)it.cat=cv;
 sv();
};
render();
})();
