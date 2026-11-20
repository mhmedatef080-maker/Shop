/* المبيعات والآجل (ولمين) والمصروفات (ولمين) وصافي الإيراد: إجمالي ولكل بائع */
(function(){
let TX=null,T0=0;
async function ld(){if(!navigator.onLine||Date.now()-T0<20000)return;T0=Date.now();try{const r=await sb.from('p_cust_tx').select('inv,amount,kind,created_at').limit(5000);if(!r.error){TX=r.data;render()}}catch(e){}}
const nm=r=>r.src=='store'?'🛒 المتجر الإلكتروني':(r.seller||'بدون بائع');
const cn=r=>String(r.cust_name||'').replace(/( · )?(البائع .*|🛒 من المتجر)$/,'').trim()||'عميل';
const row=(a,b,c,s)=>`<div class="it"><span>${a}</span><b${c?' class="e"':''}>${s||''}${m(b)} ج</b></div>`;
const sub=(a,b)=>`<div class="mu" style="display:flex;justify-content:space-between;padding:2px 14px"><span>${a}</span><span>${m(b)} ج</span></div>`;
const mk=()=>({s:0,c:0,e:0,cl:{},el:[]});
function calc(){
 const rows=(R.rows||[]).filter(r=>TY[r.type]),[a,b]=rng(),G={},U={};
 const g=k=>G[k]||(G[k]=mk());
 rows.forEach(r=>{g(nm(r)).s+=TY[r.type]*(+r.total);if(r.type=='sell')U[String(r.uid)]={k:nm(r),n:cn(r)}});
 let pay=0,all=0;
 const tx=(TX||[]).map(t=>({inv:t.inv,v:+t.amount,k:t.kind,d:t.created_at})).concat((S.cx||[]).map(t=>({inv:t.v.inv,v:t.v.amount,k:t.v.kind,d:new Date().toISOString()})));
 tx.forEach(t=>{all+=t.v;
  const u=U[String(t.inv)];
  if(t.k=='sale'&&u){const o=g(u.k);o.c+=t.v;o.cl[u.n]=(o.cl[u.n]||0)+t.v}
  if(t.k=='pay'){const d=new Date(t.d);if((!a||d>=a)&&(!b||d<b))pay-=t.v}});
 (S.exp||[]).forEach(x=>{const d=new Date(x.created_at);if((!a||d>=a)&&(!b||d<b)){const w=x.by_name||'المالك',o=g(w);o.e+=+x.amount;o.el.push({t:[x.cat,x.note].filter(Boolean).join(' - ')+' ('+w+')',v:+x.amount})}});
 const T=mk();Object.values(G).forEach(o=>{T.s+=o.s;T.c+=o.c;T.e+=o.e;T.el=T.el.concat(o.el);for(const k in o.cl)T.cl[k]=(T.cl[k]||0)+o.cl[k]});
 return{G,T,pay,all};
}
const blk=o=>row('إجمالي المبيعات',o.s)+row('منها: الآجل',o.c,o.c>0,'− ')+Object.entries(o.cl).filter(e=>e[1]).map(e=>sub('على '+esc(e[0]),e[1])).join('')+row('المصروفات',o.e,o.e>0,'− ')+o.el.map(x=>sub(esc(x.t),x.v)).join('')+row('<b>صافي الإيراد</b>',o.s-o.c-o.e);
const S0=rSales;
rSales=function(){
 ld();const h=S0();
 if(!TX||!O())return h;
 const{T,pay,all}=calc();
 return h+`<div class="c"><b>صافي الإيراد (${PER[R.per]})</b>${blk(T)}<div class="mu" style="margin-top:6px">خارج الحساب:</div>${row('دفعات قديمة اتحصّلت في الفترة',pay)}${row('لسه على العملاء (كل الفترات)',all,all>0)}</div>`;
};
const V0=vRep;
vRep=function(){
 ld();const h=V0();
 if(R.sub!='sel'||!TX||!O()||!R.rows||R.loading)return h;
 const{G}=calc();
 return h+Object.entries(G).map(([k,o])=>`<div class="c"><b>${esc(k)}</b>${blk(o)}</div>`).join('');
};
})();
