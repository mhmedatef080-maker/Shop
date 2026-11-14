const FN=U+'/functions/v1/swift-api';
uCall=async function(b){
 try{
  const {data:{session}}=await sb.auth.getSession();
  const r=await fetch(FN,{method:'POST',body:JSON.stringify(Object.assign({token:session?session.access_token:''},b))});
  let j={};try{j=await r.json()}catch(e){}
  if(!r.ok||j.error)return{error:(j.error||j.message||'خطأ')+' ['+r.status+']'};
  return{data:j};
 }catch(e){return{error:'ما قدرتش أوصل للسيرفر: '+e.message}}
};
(function(){
 const _from=sb.from.bind(sb),_rpc=sb.rpc.bind(sb);
 const hook=(q,tag)=>{const th=q.then.bind(q);q.then=(a,b)=>th(r=>{if(r&&r.error&&r.status!==0){S.err=tag+' ← '+(r.error.message||'')+' ['+(r.error.code||r.status)+']';sv()}return a?a(r):r},b);return q};
 sb.from=function(t){const b=_from(t);['upsert','delete','insert','update'].forEach(k=>{const f=b[k].bind(b);b[k]=function(){return hook(f.apply(null,arguments),t+'.'+k)}});return b};
 sb.rpc=function(n,p){return hook(_rpc(n,p),'rpc.'+n)};
})();
const _vs2=vSet;
vSet=function(){return _vs2()+(O()&&(S.err||S.bad)?`<div class="c"><b>آخر خطأ من السيرفر</b><p class="e" style="direction:ltr;text-align:left">${esc(S.err||'لسه ما حصلش خطأ جديد')}</p><button class="sec" onclick="S.bad=0;S.err='';sv();render()">تصفير العداد</button></div>`:'')};
UL=null;ULD=0;UM='';
render();
