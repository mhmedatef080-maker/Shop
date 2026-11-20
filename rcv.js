/* الفاتورة في التقارير بشكل ورقة البيع + تقرير طرق الدفع */
(function(){
const PL={cash:'نقدي',vf:'فودافون كاش',ip:'إنستا باي'};
const cn=r=>String(r.cust_name||'').replace(/( · )?(البائع .*|🛒 من المتجر)$/,'');
let RM=null,T0=0;
async function ld(){if(!navigator.onLine||Date.now()-T0<20000)return;T0=Date.now();try{const r=await sb.from('p_cust_tx').select('inv,amount').eq('kind','sale').limit(5000);if(!r.error){RM={};r.data.forEach(t=>{RM[t.inv]=(RM[t.inv]||0)+(+t.amount)});render()}}catch(e){}}
const pdl=r=>{if(!RM||r.type!='sell')return '';let q=RM[String(r.uid)]||0;(S.cx||[]).forEach(t=>{if(t.v.inv==r.uid)q+=t.v.amount});q=Math.round(q*100)/100;const p=Math.round((+r.total-q)*100)/100;return `<div style="display:flex;justify-content:space-between"><span>المدفوع</span><span>${m(p)} ج</span></div>`+(q>0?`<div style="display:flex;justify-content:space-between;color:#b91c1c;font-weight:700"><span>الباقي على العميل</span><span>${m(q)} ج</span></div>`:'')};
const rcpt=r=>{
 const g=R.cg[r.uid],sg=TY[r.type]||0,pf=g&&sg?sg*(+r.total)-(+g.cogs):null,B='border-top:1px dashed #999;margin:6px 0';
 return `<div style="width:100%;margin-top:8px;background:#fff;border:1px solid #ddd;border-radius:8px;padding:10px;font-size:15px;color:#111" onclick="event.stopPropagation()">
 <div style="text-align:center;font-weight:700;font-size:19px">${esc(S.shop)}</div>${PS.head?`<div style="text-align:center;font-size:13px">${esc(PS.head)}</div>`:''}
 <div style="${B}"></div><b>${TL[r.type]||'فاتورة'} #${r.no}</b><div>${new Date(r.created_at).toLocaleString('ar-EG')}</div>
 ${cn(r)&&cn(r)!='نقدي'?`<div>العميل: ${esc(cn(r))}</div>`:''}${r.src=='store'?'<div>المصدر: المتجر الإلكتروني</div>':r.seller?`<div>البائع: ${esc(r.seller)}</div>`:''}
 <div style="${B}"></div>${(r.lines||[]).map(l=>{const uq=l.uq!=null?+l.uq:+l.q;return `<div style="margin:3px 0"><b>${esc(l.n)}</b><div style="display:flex;justify-content:space-between"><span>${qr(uq)} × ${m(l.p)}</span><span>${m(uq*l.p)}</span></div></div>`}).join('')}
 <div style="${B}"></div><div style="display:flex;justify-content:space-between;font-size:19px;font-weight:700"><span>الإجمالي</span><span>${m(r.total)} ج</span></div>
 ${pdl(r)}<div>طريقة الدفع: ${PL[r.pay]||'غير محدد'}</div>${PS.foot?`<div style="${B}"></div><div style="text-align:center;font-size:13px">${esc(PS.foot)}</div>`:''}</div>
 ${pf!=null?`<div class="mu ${pf<0?'e':''}" style="width:100%">ربح الفاتورة: ${m(pf)} ج</div>`:''}`;
};
rInv=function(){
 const rows=R.rows;ld();
 return `<div class="c"><b>الفواتير (${rows.length})</b>${rows.map(r=>{const op=R.open==r.no;
  return `<div class="it" style="flex-wrap:wrap" onclick="R.open=${op?'null':r.no};render()"><span><b>#${r.no}</b> ${TL[r.type]||''}<br><span class="mu">${esc([cn(r),PL[r.pay],new Date(r.created_at).toLocaleString('ar-EG')].filter(Boolean).join(' · '))}</span></span><span>${m(r.total)} ج</span>${op?rcpt(r):''}</div>`}).join('')||'<p class="mu">مفيش فواتير</p>'}</div>`;
};
const S0=rSales;
rSales=function(){
 const t={};(R.rows||[]).filter(r=>TY[r.type]).forEach(r=>{const k=PL[r.pay]||'غير محدد',o=t[k]||(t[k]={n:0,s:0});o.n++;o.s+=TY[r.type]*(+r.total)});
 return S0()+`<div class="c"><b>حسب طريقة الدفع</b>${Object.entries(t).map(([k,o])=>`<div class="it"><span>${k}<br><span class="mu">${o.n} فاتورة</span></span><span>${m(o.s)} ج</span></div>`).join('')||'<p class="mu">-</p>'}</div>`;
};
})();
