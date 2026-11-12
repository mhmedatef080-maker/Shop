let LU=localStorage.lu||'',LERR='',UL=null,ULD=0,UM='',XM='',EP='month';
const CATS=['إيجار','كهرباء ومياه','مرتبات','نقل','صيانة','أخرى'];
const PX={today:'اليوم',yest:'أمس',week:'آخر 7 أيام',month:'هذا الشهر',all:'الكل'};

function vLogin(){return `<h1>🔒 ${esc(S.shop)}</h1><div class="c"><input id="lu" placeholder="اسم المستخدم" autocapitalize="off" autocomplete="username" value="${esc(LU)}"><input id="pw" type="password" placeholder="كلمة السر" autocomplete="current-password"><button onclick="login()">دخول</button><div class="e">${esc(LERR)}</div></div>`}
login=async function(){
 const u=($('#lu').value||'').trim().toLowerCase(),p=$('#pw').value;
 LU=u;
 if(!u||!p){LERR='اكتب اسم المستخدم وكلمة السر';render();return}
 const b=$('button');b.disabled=true;
 const {data,error}=await sb.auth.signInWithPassword({email:u.includes('@')?u:u+'@shopapp.com',password:p});
 if(error){LERR=navigator.onLine?'اسم المستخدم أو كلمة السر غلط':'محتاج نت للدخول أول مرة';render();return}
 const am=data.user.app_metadata||{},own=am.role==='owner'||data.user.email==='owner@shopapp.com';
 role=own?'o':'w';localStorage.pr=role;localStorage.pn=am.name||u;localStorage.lu=u;
 if(role!='o'){S.items.forEach(x=>delete x.buy);S.inv=S.inv.filter(x=>x.t!='rbuy'||!x.no)}
 LERR='';auth=true;nl=0;localStorage.pa='1';render();sync();
};

async function uCall(b){
 const {data,error}=await sb.functions.invoke('users',{body:b});
 if(error){let t=error.message;try{const j=await error.context.json();t=j.error||t}catch(e){}return{error:t}}
 if(data&&data.error)return{error:data.error};
 return{data};
}
async function uLoad(){const r=await uCall({action:'list'});if(r.error){UM=r.error}else{UL=r.data.users;UM=''}render()}
function vUsers(){
 if(UL===null&&!ULD&&!UM&&navigator.onLine){ULD=1;uLoad()}
 return `<div class="c"><b>المستخدمين</b>${UM?`<p class="e">${esc(UM)}</p>`:''}${(UL||[]).map(u=>`<div class="it"><span>${esc(u.name||u.username)}<br><span class="mu">${esc(u.username)} · ${u.role=='owner'?'مالك':'موظف'}${u.banned?' · موقوف':''}</span></span><span><button class="del" onclick="uPass('${u.id}')">كلمة سر</button><button class="del" onclick="uBan('${u.id}',${u.banned?0:1})">${u.banned?'تفعيل':'إيقاف'}</button><button class="del" onclick="uDel('${u.id}')">حذف</button></span></div>`).join('')||`<p class="mu">${UL?'-':'جاري التحميل…'}</p>`}
 <input id="nu" placeholder="اسم المستخدم (إنجليزي)" autocapitalize="off"><input id="nn" placeholder="الاسم الظاهر"><input id="np" type="password" placeholder="كلمة السر (6 على الأقل)"><select id="nr"><option value="staff">موظف</option><option value="owner">مالك (كل الصلاحيات)</option></select><button onclick="uAdd()">إضافة مستخدم</button></div>`;
}
async function uAdd(){
 const x=await uCall({action:'create',username:$('#nu').value.trim(),name:$('#nn').value.trim(),password:$('#np').value,role:$('#nr').value});
 if(x.error){UM=x.error;render();return}
 UM='';await uLoad();
}
async function uPass(id){const p=prompt('كلمة السر الجديدة (6 على الأقل)');if(!p)return;const x=await uCall({action:'setpass',id,password:p});UM=x.error||'';if(!x.error)alert('اتغيرت');render()}
async function uBan(id,on){const x=await uCall({action:'ban',id,on:!!on});UM=x.error||'';await uLoad()}
async function uDel(id){if(!confirm('حذف المستخدم نهائياً؟'))return;const x=await uCall({action:'delete',id});UM=x.error||'';await uLoad()}

async function fetchAll(n){let o=[],i=0;for(;;){const r=await sb.from(n).select('*').range(i,i+999);if(r.error)throw r.error;o=o.concat(r.data);if(r.data.length<1000)break;i+=1000}return o}
async function backup(){
 try{
  const out={at:new Date().toISOString()};
  for(const n of ['p_items','p_costs','p_units','p_customers','p_invoices','p_cogs','p_expenses'])out[n]=await fetchAll(n);
  const a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([JSON.stringify(out)],{type:'application/json'}));
  a.download='backup-'+new Date().toISOString().slice(0,10)+'.json';
  document.body.appendChild(a);a.click();a.remove();
 }catch(e){alert('فشل التحميل. اتأكد من النت')}
}
const _vs=vSet;
vSet=function(){return _vs()+(O()?`<div class="c"><b>نسخة احتياطية</b><p class="mu">بتنزل ملف فيه الأصناف والفواتير والعملاء والمصروفات.</p><button onclick="backup()">تحميل نسخة احتياطية</button></div>`+vUsers():'')};

function erng(){const n=new Date(),d=new Date(n.getFullYear(),n.getMonth(),n.getDate()),D=864e5;
 if(EP=='today')return[d,null];if(EP=='yest')return[new Date(d-D),d];if(EP=='week')return[new Date(d-6*D),null];if(EP=='month')return[new Date(n.getFullYear(),n.getMonth(),1),null];return[null,null]}
function vExp(){
 S.exp=S.exp||[];S.eq=S.eq||[];
 const [a,b]=erng(),rows=S.exp.filter(x=>{const t=new Date(x.created_at);return(!a||t>=a)&&(!b||t<b)}),tot=rows.reduce((s,x)=>s+(+x.amount),0);
 return `<div class="c"><b>مصروف جديد</b><input id="ea" type="number" step="any" inputmode="decimal" placeholder="المبلغ"><select id="ec">${CATS.map(c=>`<option>${c}</option>`).join('')}</select><input id="en" placeholder="ملاحظة (اختياري)"><button onclick="addExp()">تسجيل المصروف</button><div class="e">${XM}</div>${S.eq.length?`<p class="mu">⏳ ${S.eq.length} لم تُرسل</p>`:''}</div>
 <div class="c"><div class="r"><b>المصروفات</b><select onchange="EP=this.value;render()">${Object.entries(PX).map(([k,v])=>`<option value="${k}" ${k==EP?'selected':''}>${v}</option>`).join('')}</select></div><div class="it"><b>الإجمالي</b><b>${m(tot)} ج</b></div>${rows.map(x=>`<div class="it"><span>${esc(x.cat||'')}${x.note?' · '+esc(x.note):''}<br><span class="mu">${new Date(x.created_at).toLocaleString('ar-EG')}${x.by_name?' · '+esc(x.by_name):''}</span></span><span>${m(x.amount)} ج <button class="del" onclick="delExp('${x.id}')">✕</button></span></div>`).join('')||'<p class="mu">مفيش مصروفات</p>'}</div>`;
}
function addExp(){
 const a=+$('#ea').value;if(!(a>0)){XM='اكتب المبلغ';render();return}
 S.exp=S.exp||[];S.eq=S.eq||[];
 const v={id:crypto.randomUUID(),amount:a,cat:$('#ec').value,note:$('#en').value.trim()||null,created_at:new Date().toISOString(),by_name:localStorage.pn||''};
 S.exp.unshift(v);S.eq.push({k:'exp',v});XM='اتسجل ✓';sv();render();sync();
}
function delExp(id){if(!confirm('مسح المصروف؟'))return;S.exp=S.exp.filter(x=>x.id!=id);S.eq.push({k:'del',id});sv();render();sync()}
async function syncExp(){
 if(!O()||!auth)return;
 S.eq=S.eq||[];
 try{
  while(S.eq.length){
   const o=S.eq[0];
   const r=o.k=='exp'?await sb.from('p_expenses').upsert(o.v):await sb.from('p_expenses').delete().eq('id',o.id);
   if(r.error){if(r.status===0||/fetch|network/i.test(r.error.message||''))throw 0;S.bad++;S.eq.shift();sv();continue}
   S.eq.shift();sv();
  }
  const r=await sb.from('p_expenses').select('*').order('created_at',{ascending:false}).limit(1000);
  if(!r.error&&!S.eq.length){S.exp=r.data.map(x=>Object.assign({},x,{amount:+x.amount}));sv()}
 }catch(e){}
}
const _sy=sync;
sync=async function(){await _sy();await syncExp()};
addEventListener('online',()=>sync());
setInterval(()=>{if(S.eq&&S.eq.length)sync()},15000);

if(typeof rProfit=='function'){
 const _rp=rProfit;
 rProfit=function(){
  const h=_rp(),[a,b]=rng(),g=agg(),pf=g.ks-g.cogs;
  const ex=(S.exp||[]).filter(x=>{const t=new Date(x.created_at);return(!a||t>=a)&&(!b||t<b)}).reduce((s,x)=>s+(+x.amount),0);
  return h+`<div class="c"><b>بعد المصروفات</b><div class="it"><span>ربح المبيعات</span><span>${m(pf)} ج</span></div><div class="it"><span>المصروفات</span><span>${m(ex)} ج</span></div><div class="it"><b>صافي الربح النهائي</b><b class="${pf-ex<0?'e':'ok'}">${m(pf-ex)} ج</b></div></div>`;
 };
}

const navX=()=>{const T=[['sell','فاتورة'],['items','أصناف'],['cust','عملاء'],['exp','مصروفات']];if(typeof vRep=='function')T.push(['rep','تقارير']);T.push(['set','إعداد']);return `<nav>${T.map(t=>`<button class="${tab==t[0]?'on':''}" onclick="go('${t[0]}')">${t[1]}</button>`).join('')}</nav>`};
const _rd3=render;
render=function(){
 if(!auth){$('#a').innerHTML=vLogin();return}
 if(O()&&tab=='exp'){$('#a').innerHTML=`<h1>${esc(S.shop)} <small></small></h1>`+vExp()+navX();hd();return}
 _rd3();
 if(O()){const nv=document.querySelector('nav');if(nv)nv.outerHTML=navX()}
};
render();sync();
