/* طريقة الدفع على الفاتورة */
(function(){
const PL={cash:'نقدي',vf:'فودافون كاش',ip:'إنستا باي'};
window.PM='cash';
let TP={};try{TP=JSON.parse(localStorage.tp||'{}')}catch(e){}
const stp=()=>{try{localStorage.tp=JSON.stringify(TP)}catch(e){}};
const R0=render;
render=function(){
 R0();
 if((ty!='sell'&&ty!='rsell')||!$('#a')||$('#pms'))return;
 const s=[...document.querySelectorAll('#a select')].find(x=>x.options[0]&&x.options[0].value===''&&x.options[0].textContent.trim()=='عميل نقدي');
 if(!s)return;
 const d=document.createElement('select');d.id='pms';
 d.innerHTML=Object.entries(PL).map(([k,v])=>'<option value="'+k+'"'+(k==PM?' selected':'')+'>طريقة الدفع: '+v+'</option>').join('');
 d.onchange=()=>{PM=d.value};
 s.after(d);
};
const D0=done;
done=function(){
 const pm=PM,L0=S.q.length,p=D0(),e=S.q.slice(L0).find(o=>o.k=='inv');
 if(e){TP[e.v.p_uid]=pm;stp()}
 PM='cash';
 return p;
};
const Y0=sync;
sync=async function(){
 await Y0();
 if(S.q.length||!navigator.onLine)return;
 for(const u of Object.keys(TP)){
  try{const r=await sb.rpc('p_inv_pay',{p_uid:u,p_pay:TP[u]});if(r&&r.error){S.err='pay ← '+r.error.message;sv();break}delete TP[u];stp()}catch(e){break}
 }
};
const F0=sb.from.bind(sb);
sb.from=function(t){
 const b=F0(t);
 if(t!='p_invoices')return b;
 const s=b.select.bind(b);
 b.select=function(c,o){return s(typeof c=='string'&&c.indexOf('*')<0&&/cust_name/.test(c)&&!/\bpay\b/.test(c)?c+',pay':c,o)};
 return b;
};
render();
})();
