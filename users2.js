uCall=async function(b){
 try{
  const {data:{session}}=await sb.auth.getSession();
  const r=await fetch(U+'/functions/v1/users',{method:'POST',body:JSON.stringify(Object.assign({token:session?session.access_token:''},b))});
  const j=await r.json();
  if(j.error)return{error:j.error};
  return{data:j};
 }catch(e){return{error:'ما قدرتش أوصل للسيرفر: '+e.message}}
};
UL=null;ULD=0;UM='';
render();
