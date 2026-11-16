/* فاتورة مشتريات (2): الحفظ والمزامنة */
(function(){
const sups=()=>typeof SUPL=='function'?SUPL():(S.sup||[]);
window.bSave=()=>{
 if(!PB.lines.length)return;
 if(PB.lines.some(l=>!(l.q>0))){msg='اكتب كمية لكل صنف';render();return}
 const ts=new Date().toISOString(),sp=sups().find(s=>s.id==PB.sup);
 PB.lines.forEach(l=>{
  const x=S.items.find(i=>i.id==l.id);if(!x)return;
  const bq=qr(l.q*l.f),uc=l.p/(l.f||1),oq=Math.max(+x.qty||0,0),ob=+x.buy||0;
  let nb=ob;
  if(l.p>0&&PB.cost=='last')nb=uc;
  if(l.p>0&&PB.cost=='avg')nb=oq+bq>0?(oq*ob+bq*uc)/(oq+bq):uc;
  nb=Math.round(nb*1e4)/1e4;
  if(nb!==ob){x.buy=nb;S.q.push({k:'cost',v:{id:x.id,buy:nb}})}
  x.qty=qr((+x.qty||0)+bq);S.q.push({k:'adj',id:x.id,d:bq});
 });
 const rec={id:crypto.randomUUID(),sup:sp?sp.id:null,sup_name:sp?sp.name:null,total:Math.round(PB.lines.reduce((s,l)=>s+l.q*l.p,0)*100)/100,lines:PB.lines.map(l=>({id:l.id,n:l.n,q:l.q,f:l.f,p:l.p})),by_name:localStorage.pn||'',note:PB.note||null,created_at:ts};
 S.bq=(S.bq||[]).concat([{v:rec}]);S.pur=[rec].concat(S.pur||[]);
 PB.lines=[];PB.note='';msg='تم الحفظ ✓ الكميات اتضافت على المخزون';sv();render();sync();
};
const V0=vSell;
vSell=function(){
 if(ty=='buy'&&O())return vBuy();
 const h=V0();return O()?h:h.replace(/<option value="buy"[^>]*>[^<]*<\/option>/,'');
};
async function bPush(){
 if(!O()||!auth)return;S.bq=S.bq||[];
 try{while(S.bq.length){
  const r=await sb.from('p_purchases').upsert(S.bq[0].v);
  if(r.error){if(r.status===0||/fetch|network|does not exist|schema cache/i.test(r.error.message||''))throw 0;S.bad++;S.bq.shift();sv();continue}
  S.bq.shift();sv()}}catch(e){}
}
async function bPull(){
 if(!O()||!auth||(S.bq&&S.bq.length)||S.q.length)return;
 try{const r=await sb.from('p_purchases').select('*').order('created_at',{ascending:false}).limit(30);if(!r.error){S.pur=r.data;sv()}}catch(e){}
}
const Y0=sync;
sync=async function(){await bPush();await Y0();await bPull()};
render();
})();
