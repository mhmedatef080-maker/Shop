/* تقرير حركة صنف: كل عمليات بيع الصنف بالتاريخ والوقت */
(function(){
const P=window.MVX={id:'',q:''};
const dt=t=>new Date(t).toLocaleString('ar-EG',{weekday:'short',day:'numeric',month:'numeric',year:'numeric',hour:'numeric',minute:'2-digit'});
function found(){
 const t=P.q.trim().toLowerCase();if(!t)return[];
 return S.items.filter(x=>(x.name||'').toLowerCase().includes(t)||String(x.barcode||'')==t).slice(0,8);
}
const BT=s=>`<button class="${s?'sec':''}" onclick="R.sub='mv';R.open=null;render()">حركة صنف</button></div>`;
function pickH(){
 return found().map(x=>`<button class="sec" style="margin:2px 0" onclick="MVX.id='${x.id}';render()">${esc(x.name)}</button>`).join('')||(P.q?'<p class="mu">مفيش صنف بالاسم ده</p>':'');
}
window.mvQ=v=>{P.q=v;const e=$('#mvp');if(e)e.innerHTML=pickH()};
function ops(id){
 const o=[];
 (R.rows||[]).forEach(r=>{
  if(!TY[r.type])return;
  (r.lines||[]).forEach(l=>{if(l.id==id)o.push({r,l,sg:TY[r.type]})});
 });
 return o;
}
function body(){
 const it=S.items.find(x=>x.id==P.id);
 if(!it)return '';
 const o=ops(P.id);let q=0,rev=0;
 o.forEach(z=>{const uq=z.l.uq!=null?+z.l.uq:+z.l.q;q+=z.sg*(+z.l.q);rev+=z.sg*uq*(+z.l.p)});
 const lst=o.map(z=>{
  const l=z.l,uq=l.uq!=null?+l.uq:+l.q;
  return `<div class="it"><span>${dt(z.r.created_at)}<br><span class="mu">فاتورة ${z.r.no||''}${z.sg<0?' · مرتجع':''}${z.r.cust_name?' · '+esc(z.r.cust_name):''}</span></span><span style="text-align:left" class="${z.sg<0?'e':''}">${z.sg<0?'−':''}${qr(uq)}${l.u?' '+esc(l.u):ku(it)} × ${m(l.p)}<br><span class="mu">${m(z.sg*uq*(+l.p))} ج</span></span></div>`;
 }).join('')||'<p class="mu">مفيش مبيعات للصنف ده في الفترة المختارة</p>';
 return `<div class="c"><b>${esc(it.name)}</b><div class="it"><span>عدد العمليات</span><b>${o.length}</b></div><div class="it"><span>الكمية المباعة (صافي)</span><b>${qr(q)}${ku(it)}</b></div><div class="it"><span>الإيراد</span><b>${m(rev)} ج</b></div><button class="sec" onclick="MVX.id='';render()">صنف تاني</button></div><div class="c">${lst}</div>`;
}
function view(){
 const sv0=R.sub,ld0=R.loading;R.sub='sales';R.loading=1;
 let h=vRep();R.sub=sv0;R.loading=ld0;
 h=h.split('<div class="c"><p class="mu">جاري التحميل')[0].replace(`<button class="" onclick="R.sub='sales'`,`<button class="sec" onclick="R.sub='sales'`).replace('</div>',BT(0));
 if(!O())return h+'<div class="c"><p class="mu">للمالك فقط</p></div>';
 if(R.loading)return h+'<div class="c"><p class="mu">جاري التحميل…</p></div>';
 if(!R.rows){setTimeout(()=>{if(R.sub=='mv'&&!R.rows&&!R.loading)loadRep()},0);return h+`<div class="c"><p class="e">${esc(R.err||'جاري التحميل…')}</p></div>`}
 const sel=`<div class="c"><b>حركة صنف</b><input placeholder="ابحث باسم الصنف أو الباركود" value="${esc(P.q)}" oninput="mvQ(this.value)"><div id="mvp">${P.id?'':pickH()}</div></div>`;
 return h+(P.id?'':sel)+body()+'<p class="mu" style="margin:6px">الفترة من القايمة فوق · بيعرض آخر 1000 فاتورة في الفترة.</p>';
}
const V0=vRep;
vRep=function(){
 if(R.sub=='mv'&&!P.busy){P.busy=1;try{return view()}finally{P.busy=0}}
 const h=V0();
 if(P.busy||!O()||R.sub=='low'||h.includes('>حركة صنف</button>'))return h;
 return h.replace('</div>',BT(1));
};
})();
