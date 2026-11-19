/* حسابات العملاء (1): الفاتورة والمزامنة */
(function(){
const CB={},T0={};
window.CRP='';
const pend=c=>(S.cx||[]).filter(t=>t.v.cust==c).reduce((s,t)=>s+t.v.amount,0);
const by=()=>localStorage.pn||(O()?'المالك':'');
window.crBal=c=>CB[c]==null?null:CB[c]+pend(c);
const txt=()=>{const b=crBal(cust);return b==null?'حسابه السابق: …':'حسابه السابق: <b class="'+(b>0?'e':'')+'">'+m(Math.abs(b))+' ج '+(b>0?'(عليه)':b<0?'(له)':'')+'</b>'};
async function fetchBal(c){
 if(!c||!navigator.onLine||Date.now()-(T0[c]||0)<15000)return;T0[c]=Date.now();
 try{const r=await sb.rpc('p_cust_bal',{p_cust:c});if(!r.error&&r.data!=null){CB[c]=+r.data;const e=$('#crt');if(e&&cust==c)e.innerHTML=txt()}}catch(e){}
}
function addTx(t){S.cx=(S.cx||[]).concat([{v:Object.assign({id:crypto.randomUUID(),by:by()},t)}]);sv()}
window.crPay=()=>{
 const v=+($('#crd')||{}).value;if(!cust||!(v>0))return;
 addTx({cust,amount:-v,kind:'pay'});msg='تم تسجيل الدفعة ✓';render();sync();
};
const R0=render;
render=function(){
 R0();
 if(ty!='sell'||!$('#a'))return;
 const s=[...document.querySelectorAll('#a select')].find(x=>x.options[0]&&x.options[0].value===''&&x.options[0].textContent.trim()=='عميل نقدي');
 if(!s)return;
 if(!s.dataset.cr){s.dataset.cr=1;s.addEventListener('change',()=>{CRP='';render()})}
 if(!cust||$('#crb'))return;
 const d=document.createElement('div');d.id='crb';
 d.innerHTML='<div id="crt" class="mu">'+txt()+'</div><input id="crp" type="number" step="any" inputmode="decimal" placeholder="المدفوع الآن (فاضي = كله مدفوع)" value="'+esc(CRP)+'" oninput="CRP=this.value"><div class="r"><input id="crd" type="number" step="any" inputmode="decimal" placeholder="دفعة على حسابه"><button class="sec" style="flex:0 0 auto;width:auto" onclick="crPay()">سجّل دفعة</button></div>';
 s.after(d);fetchBal(cust);
};
const D0=done;
done=function(){
 const c=cust,t=ty,tot=Math.round(cart.reduce((s,x)=>s+x.q*x.p,0)*100)/100,pd=String(CRP).trim(),L0=S.q.length;
 const p=D0();
 const e=S.q.slice(L0).find(o=>o.k=='inv');
 if(e&&t=='sell'&&c&&pd!==''){
  const rem=Math.round(Math.max(0,Math.min(tot,tot-(+pd||0)))*100)/100;
  if(rem>0)addTx({cust:c,amount:rem,kind:'sale',inv:String(e.v.p_uid)});
 }
 CRP='';
 return p;
};
async function push(){
 if(!auth||!navigator.onLine)return;S.cx=S.cx||[];
 try{while(S.cx.length){
  const t=S.cx[0].v,r=await sb.rpc('p_cust_add',{p_id:t.id,p_cust:t.cust,p_amount:t.amount,p_kind:t.kind,p_inv:t.inv||null,p_note:t.note||null,p_by:t.by||''});
  if(r.error){if(r.status===0||/fetch|network|does not exist|schema cache|Could not find/i.test(r.error.message||''))throw 0;S.bad++;S.err='cust ← '+r.error.message;S.cx.shift();sv();continue}
  if(CB[t.cust]!=null)CB[t.cust]+=t.amount;S.cx.shift();sv();
 }}catch(e){}
}
const Y0=sync;
sync=async function(){await push();await Y0()};
render();
})();
