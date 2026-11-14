let OD={rows:null,f:'open',load:0,err:''},PM='';
const PAYN={cod:'عند الاستلام',vf:'فودافون كاش',ip:'إنستاباي'},STL={new:'جديد',conf:'مؤكد',ship:'اتشحن',done:'اتسلّم',cancel:'ملغي'};
(function(){const st=document.createElement('style');st.textContent='nav button{font-size:11px!important;padding:12px 0!important}';document.head.appendChild(st)})();
const waN=p=>{p=String(p||'').replace(/\D/g,'');return p.startsWith('0')?'2'+p:p};
const newCnt=()=>(OD.rows||[]).filter(o=>o.st=='new').length;
const navY=()=>{const T=[['sell','فاتورة'],['items','أصناف'],['cust','عملاء'],['ord','طلبات'+(newCnt()?' ('+newCnt()+')':'')],['exp','مصروفات']];if(typeof vRep=='function')T.push(['rep','تقارير']);T.push(['set','إعداد']);return `<nav>${T.map(t=>`<button class="${tab==t[0]?'on':''}" onclick="go('${t[0]}')">${t[1]}</button>`).join('')}</nav>`};

async function loadOrd(){
 if(!O()||!auth||!navigator.onLine)return;
 OD.load=1;if(tab=='ord')render();
 const r=await sb.from('p_orders').select('*').order('no',{ascending:false}).limit(300);
 OD.load=0;
 if(r.error){OD.err='تعذر تحميل الطلبات: '+r.error.message}
 else{OD.err='';OD.rows=r.data.map(o=>Object.assign({},o,{lines:o.lines||[],total:+o.total,sub:+o.sub,ship:+o.ship}))}
 if(tab=='ord')render();else{const nv=document.querySelector('nav');if(nv&&O())nv.outerHTML=navY()}
}
function vOrd(){
 const F=[['open','المفتوحة'],['new','جديد'],['all','الكل'],['done','اتسلّم'],['cancel','ملغي']];
 const L=(OD.rows||[]).filter(o=>OD.f=='all'||(OD.f=='open'?['new','conf','ship'].includes(o.st):o.st==OD.f));
 return `<div class="c"><div class="r"><select onchange="OD.f=this.value;render()">${F.map(([k,v])=>`<option value="${k}" ${k==OD.f?'selected':''}>${v}</option>`).join('')}</select><button class="sec" onclick="loadOrd()">تحديث</button></div>${OD.err?`<p class="e">${esc(OD.err)}</p>`:''}${OD.load?'<p class="mu">جاري التحميل…</p>':''}</div>`+
 (L.map(o=>`<div class="c"><div class="it"><b>طلب #${o.no}</b><span class="mu">${new Date(o.created_at).toLocaleString('ar-EG')}</span></div>
 <div>${esc(o.name)} · <a href="tel:${esc(o.phone)}">${esc(o.phone)}</a> · <a href="https://wa.me/${waN(o.phone)}" target="_blank">واتساب</a></div>
 <div class="mu">${esc(o.addr||'بدون عنوان')}${o.note?' · '+esc(o.note):''}</div>
 ${o.lines.map(l=>`<div class="it"><span>${esc(l.n)}<br><span class="mu">${l.q}${l.kg?' كجم':''} × ${m(l.p)}</span></span><span>${m(l.q*l.p)} ج</span></div>`).join('')}
 <div class="it"><span>الإجمالي${o.ship>0?' (شامل توصيل '+m(o.ship)+')':''}</span><b>${m(o.total)} ج</b></div>
 <div class="it"><span>الدفع: ${PAYN[o.pay]||''}</span><b class="${o.pay_st=='paid'?'ok':'e'}">${o.pay_st=='paid'?'مدفوع ✓':'غير مدفوع'}</b></div>
 <p class="mu">الحالة: <b>${STL[o.st]||o.st}</b></p>
 <div class="r"><button class="sec" onclick="ordSt(${o.no},'conf')">تأكيد</button><button class="sec" onclick="ordSt(${o.no},'ship')">اتشحن</button><button class="sec" onclick="ordSt(${o.no},'done')">اتسلّم</button></div>
 <div class="r"><button class="sec" onclick="ordPay(${o.no},${o.pay_st=='paid'?0:1})">${o.pay_st=='paid'?'إلغاء الدفع':'تم الدفع'}</button><button onclick="ordInv(${o.no})">حوّل لفاتورة</button><button class="sec" onclick="ordSt(${o.no},'cancel')">إلغاء الطلب</button></div></div>`).join('')||'<div class="c"><p class="mu">مفيش طلبات</p></div>');
}
async function ordSt(no,st){
 const r=await sb.from('p_orders').update({st}).eq('no',no);
 if(r.error){alert('فشل: '+r.error.message);return}
 const o=OD.rows.find(x=>x.no==no);if(o)o.st=st;render();
}
async function ordPay(no,on){
 const v=on?'paid':'unpaid',r=await sb.from('p_orders').update({pay_st:v}).eq('no',no);
 if(r.error){alert('فشل: '+r.error.message);return}
 const o=OD.rows.find(x=>x.no==no);if(o)o.pay_st=v;render();
}
function ordInv(no){
 const o=OD.rows.find(x=>x.no==no);if(!o)return;
 ty='sell';
 cart=o.lines.map(l=>{const x=S.items.find(i=>i.id==l.id),u=l.u?S.units.find(v=>v.id==l.u):null;return{id:l.id,uid:l.u||'',n:l.n,q:+l.q,p:+l.p,f:u?+u.factor:1,k:!u&&!!x&&x.unit=='k'}});
 cust='';msg='من طلب #'+o.no+' ('+o.name+')';tab='sell';render();
}
function vPay(){
 const c=S.cfg||{},P=(c.pays||'').split(',');
 return `<div class="c"><b>طرق الدفع والشحن للمتجر</b>
 <label style="display:flex;gap:8px;align-items:center;margin:6px 0"><input type="checkbox" checked disabled style="width:auto;margin:0"> الدفع عند الاستلام (دايماً)</label>
 <label style="display:flex;gap:8px;align-items:center;margin:6px 0"><input type="checkbox" id="pvf" style="width:auto;margin:0" ${P.includes('vf')?'checked':''}> فودافون كاش</label><input id="pvfn" inputmode="numeric" placeholder="رقم فودافون كاش" value="${esc(c.vf||'')}">
 <label style="display:flex;gap:8px;align-items:center;margin:6px 0"><input type="checkbox" id="pip" style="width:auto;margin:0" ${P.includes('ip')?'checked':''}> إنستاباي</label><input id="pipn" placeholder="عنوان إنستاباي (مثال name@instapay)" value="${esc(c.ip||'')}">
 <div class="r"><input id="psh" type="number" inputmode="decimal" placeholder="سعر التوصيل" value="${esc(c.ship||'')}"><input id="pfr" type="number" inputmode="decimal" placeholder="توصيل مجاني فوق مبلغ" value="${esc(c.free||'')}"></div>
 <button onclick="savePay()">حفظ</button><p class="e">${esc(PM)}</p></div>`;
}
async function savePay(){
 const P=['cod'];if($('#pvf').checked)P.push('vf');if($('#pip').checked)P.push('ip');
 const rows=[['pays',P.join(',')],['vf',$('#pvfn').value.trim()],['ip',$('#pipn').value.trim()],['ship',$('#psh').value||'0'],['free',$('#pfr').value||'0']].map(([key,val])=>({key,val}));
 const r=await sb.from('p_settings').upsert(rows);
 if(r.error){PM='ما اتحفظش: '+r.error.message}else{PM='اتحفظ ✓';S.cfg=Object.assign({},S.cfg||{});rows.forEach(z=>S.cfg[z.key]=z.val);sv()}
 render();
}
const _vs6=vSet;
vSet=function(){return _vs6()+(O()?vPay():'')};
const _rd6=render;
render=function(){
 if(auth&&O()&&tab=='ord'){$('#a').innerHTML=`<h1>${esc(S.shop)} <small></small></h1>`+vOrd()+navY();hd();return}
 _rd6();
 if(auth&&O()){const nv=document.querySelector('nav');if(nv)nv.outerHTML=navY()}
};
const _go3=go;
go=function(t){_go3(t);if(t=='ord'&&O())loadOrd()};
setInterval(()=>{if(O()&&auth&&navigator.onLine)loadOrd()},60000);
render();setTimeout(()=>{if(O()&&auth)loadOrd()},1500);
