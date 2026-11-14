const normP=t=>{let d=String(t||'').replace(/\D/g,'');if(d.startsWith('0020'))d='0'+d.slice(4);else if(d.startsWith('20')&&d.length==12)d='0'+d.slice(2);return d};
const _oi=ordInv;
ordInv=function(no){
 _oi(no);
 const o=(OD.rows||[]).find(x=>x.no==no);if(!o)return;
 const c=S.custs.find(x=>normP(x.phone)==normP(o.phone));
 if(c){cust=c.id;render()}
};
render();
