/* تقرير المبيعات: المحصّل والآجل والباقي */
(function(){
let TX=null,T0=0;
async function ld(){if(!navigator.onLine||Date.now()-T0<20000)return;T0=Date.now();try{const r=await sb.from('p_cust_tx').select('inv,amount,kind,created_at').limit(5000);if(!r.error){TX=r.data;render()}}catch(e){}}
const row=(a,b,c)=>`<div class="it"><span>${a}</span><b${c?' class="e"':''}>${m(b)} ج</b></div>`;
const S0=rSales;
rSales=function(){
 ld();const h=S0();
 if(!TX||!O())return h;
 const rows=(R.rows||[]).filter(r=>r.type=='sell'),net=(R.rows||[]).filter(r=>TY[r.type]).reduce((s,r)=>s+TY[r.type]*(+r.total),0);
 const u=new Set(rows.map(r=>String(r.uid))),[a,b]=rng();
 let cr=0,pay=0,all=0;
 TX.forEach(t=>{const v=+t.amount;all+=v;
  if(t.kind=='sale'&&u.has(String(t.inv)))cr+=v;
  if(t.kind=='pay'){const d=new Date(t.created_at);if((!a||d>=a)&&(!b||d<b))pay-=v}});
 (S.cx||[]).forEach(t=>{const v=t.v.amount;all+=v;if(t.v.kind=='sale'&&u.has(String(t.v.inv)))cr+=v;if(t.v.kind=='pay')pay-=v});
 const col=net-cr;
 return h+`<div class="c"><b>التحصيل والآجل (${PER[R.per]})</b>${row('إجمالي المبيعات',net)}${row('اتحصّل من المبيعات',col)}${row('آجل (على حساب العملاء)',cr,cr>0)}${row('دفعات قديمة اتحصّلت',pay)}${row('إجمالي اللي دخل الدرج/الحسابات',col+pay)}<div class="mu" style="margin-top:6px">${'—'}</div>${row('لسه على العملاء (كل الفترات)',all,all>0)}</div>`;
};
})();
