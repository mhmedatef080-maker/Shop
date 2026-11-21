/* تقرير طلبات المتجر */
(function(){
const OS=window.OSX={key:'',rows:null,load:0,err:'',open:null};
async function ld(){
 if(!O()||!navigator.onLine||OS.load)return;
 OS.load=1;OS.key=R.per;
 const[a,b]=rng();let q=sb.from('p_orders').select('*').order('no',{ascending:false}).limit(1000);
 if(a)q=q.gte('created_at',a.toISOString());if(b)q=q.lt('created_at',b.toISOString());
 const r=await q;OS.load=0;
 if(r.error){OS.err=r.error.message;OS.rows=null}else{OS.err='';OS.rows=(r.data||[]).map(o=>Object.assign({},o,{lines:o.lines||[],total:+o.total,ship:+o.ship}))}
 render();
}
const row=(a,b,c)=>`<div class="it"><span>${a}</span><b${c?' class="e"':''}>${b}</b></div>`;
function view(){
 const tabs=[['sales','المبيعات'],['profit','الأرباح'],['inv','الفواتير'],['sel','البياعين'],['ord','طلبات المتجر'],['low','النواقص']];
 let h=`<div class="c"><div class="r">${tabs.map(s=>`<button class="${R.sub==s[0]?'':'sec'}" onclick="R.sub='${s[0]}';R.open=null;render()">${s[1]}</button>`).join('')}</div><select onchange="R.per=this.value;OSX.key='';loadRep()">${Object.entries(PER).map(([k,v])=>`<option value="${k}" ${k==R.per?'selected':''}>${v}</option>`).join('')}</select></div>`;
 if(!O())return h+'<div class="c"><p class="mu">للمالك فقط</p></div>';
 if(OS.key!=R.per&&!OS.load)setTimeout(ld,0);
 if(OS.load||OS.key!=R.per)return h+'<div class="c"><p class="mu">جاري التحميل…</p></div>';
 if(!OS.rows)return h+`<div class="c"><p class="e">${esc(OS.err||'')}</p><button onclick="OSX.key='';OSX.rows=null;render()">إعادة المحاولة</button></div>`;
 const L=OS.rows,ok=L.filter(o=>o.st!='cancel'),cn=L.filter(o=>o.st=='cancel'),sum=a=>a.reduce((s,o)=>s+o.total,0);
 const paid=ok.filter(o=>o.pay_st=='paid'),ship=ok.reduce((s,o)=>s+o.ship,0);
 const it={};
 ok.forEach(o=>o.lines.forEach(l=>{const e=it[l.n]||(it[l.n]={q:0,s:0,kg:l.kg});e.q+=+l.q;e.s+=+l.q*+l.p}));
 const by=(f)=>{const g={};ok.forEach(o=>{const k=f(o),e=g[k]||(g[k]={n:0,s:0});e.n++;e.s+=o.total});return g};
 const bs=by(o=>STL[o.st]||o.st),bp=by(o=>PAYN[o.pay]||o.pay);
 const top=Object.entries(it).sort((a,b)=>b[1].s-a[1].s).slice(0,10);
 return h+`<div class="c"><b>ملخص طلبات المتجر</b>${row('عدد الطلبات (غير الملغية)',ok.length)}${row('إجمالي الطلبات',m(sum(ok))+' ج')}${row('منها مدفوع',m(sum(paid))+' ج ('+paid.length+')')}${row('منها لسه مش مدفوع',m(sum(ok)-sum(paid))+' ج ('+(ok.length-paid.length)+')',ok.length>paid.length)}${row('مصاريف توصيل محصّلة',m(ship)+' ج')}${row('طلبات ملغية',cn.length+' · '+m(sum(cn))+' ج',cn.length>0)}</div>
 <div class="c"><b>حسب الحالة</b>${Object.entries(bs).map(([k,e])=>row(k+' ('+e.n+')',m(e.s)+' ج')).join('')||'<p class="mu">-</p>'}</div>
 <div class="c"><b>حسب طريقة الدفع</b>${Object.entries(bp).map(([k,e])=>row(k+' ('+e.n+')',m(e.s)+' ج')).join('')||'<p class="mu">-</p>'}</div>
 <div class="c"><b>أكتر الأصناف طلباً</b>${top.map(([k,e])=>row(esc(k)+'<br><span class="mu">'+(+e.q.toFixed(3))+(e.kg?' كجم':'')+'</span>',m(e.s)+' ج')).join('')||'<p class="mu">-</p>'}</div>
 <div class="c"><b>كل الطلبات (${L.length})</b>${L.map(o=>{const op=OS.open==o.no;return `<div class="it" style="flex-wrap:wrap" onclick="OSX.open=${op?'null':o.no};render()"><span><b>#${o.no}</b> ${esc(o.name)}<br><span class="mu">${new Date(o.created_at).toLocaleString('ar-EG')} · ${STL[o.st]||o.st} · ${o.pay_st=='paid'?'مدفوع':'غير مدفوع'}</span></span><b>${m(o.total)} ج</b>${op?`<div style="flex:1 1 100%" class="mu">${esc(o.phone)} · ${esc(o.addr||'')}${o.lines.map(l=>`<div class="it"><span>${esc(l.n)}<br>${l.q}${l.kg?' كجم':''} × ${m(l.p)}</span><span>${m(l.q*l.p)} ج</span></div>`).join('')}</div>`:''}</div>`}).join('')||'<p class="mu">مفيش طلبات في الفترة دي</p>'}</div>`;
}
const V0=vRep;
vRep=function(){
 if(R.sub=='ord')return view();
 const h=V0();
 if(!O()||R.sub=='low')return h;
 return h.replace('</div>',`<button class="sec" onclick="R.sub='ord';R.open=null;render()">طلبات المتجر</button></div>`);
};
})();
