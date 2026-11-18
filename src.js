/* مصدر الفاتورة + اسم المحل والتليفون */
(function(){
const NAME='دار هدهد',PHONE='01032257296';
if(S.shop=='الكاشير'||!S.shop){S.shop=NAME;sv()}
if(!PS.head){PS.head='للنظافات ورقيات وعناية شخصية وعطور · ت: '+PHONE;psv()}
if(!PS.foot||PS.foot=='شكراً لزيارتكم'){PS.foot='مكانكم 🌸';psv()}
let TG={};try{TG=JSON.parse(localStorage.tg||'{}')}catch(e){}
const stg=()=>{try{localStorage.tg=JSON.stringify(TG)}catch(e){}};
let SC=null;
const O0=ordInv;
ordInv=function(no){O0(no);SC=cart};
const D0=done;
done=function(){
 const store=SC&&cart===SC&&cart.length>0,by=localStorage.pn||(O()?'المالك':''),L0=S.q.length;
 const p=D0();
 const e=S.q.slice(L0).find(o=>o.k=='inv');
 if(e){
  TG[e.v.p_uid]={s:by,r:store?'store':''};stg();
  if(S.rp&&S.rp[0]&&S.rp[0].uid==e.v.p_uid){S.rp[0].by=store?'المتجر الإلكتروني':by;sv()}
 }
 if(store)SC=null;
 setTimeout(()=>{sync()},2500);
 return p;
};
const Y0=sync;
sync=async function(){
 await Y0();
 if(S.q.length||!navigator.onLine)return;
 for(const u of Object.keys(TG)){
  const t=TG[u];
  try{const r=await sb.rpc('p_inv_tag',{p_uid:u,p_seller:t.s||'',p_src:t.r||''});
   if(r&&r.error){S.err='tag ← '+r.error.message;sv();break}
   delete TG[u];stg();
  }catch(e){break}
 }
};
const F0=sb.from.bind(sb);
sb.from=function(t){
 const b=F0(t);
 if(t!='p_invoices')return b;
 const s=b.select.bind(b);
 b.select=function(c,o){
  const tg=typeof c=='string'&&c.indexOf('*')<0&&/cust_name/.test(c)&&!/seller/.test(c);
  const q=s(tg?c+',seller,src':c,o);
  if(tg){
   const th=q.then.bind(q);
   q.then=(a,b2)=>th(r=>{
    if(r&&r.data)r.data.forEach(x=>{const k=x.src=='store'?'🛒 من المتجر':x.seller?'البائع '+x.seller:'';if(k)x.cust_name=(x.cust_name?x.cust_name+' · ':'')+k});
    return a?a(r):r;
   },b2);
  }
  return q;
 };
 return b;
};
render();
})();
