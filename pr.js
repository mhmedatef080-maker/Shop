/* تقرير المشتريات */
(function(){
const P=window.PRX={key:'',rows:null,load:0,err:'',open:null};
async function ld(){
 if(!O()||!navigator.onLine||P.load)return;
 P.load=1;P.key=R.per;
 const[a,b]=rng();let q=sb.from('p_purchases').select('*').order('created_at',{ascending:false}).limit(1000);
 if(a)q=q.gte('created_at',a.toISOString());if(b)q=q.lt('created_at',b.toISOString());
 const r=await q;P.load=0;
 if(r.error){P.err=r.error.message;P.rows=null}else{P.err='';P.rows=(r.data||[]).map(o=>Object.assign({},o,{lines:o.lines||[],total:+o.total}))}
 render();
}
const row=(a,b,c)=>`<div class="it"><span>${a}</span><b${c?' class="e"':''}>${b}</b></div>`;
function view(){
 const tabs=[['sales','المبيعات'],['profit','الأرباح'],['inv','الفواتير'],['sel','البياعين'],['ord','طلبات المتجر'],['pur','المشتريات'],['low','النواقص']];
 let h=`<div class="c"><div class="r">${tabs.map(s=>`<button class="${R.sub==s[0]?'':'sec'}" onclick="R.sub='${s[0]}';R.open=null;render()">${s[1]}</button>`).join('')}</div><select onchange="R.per=this.value;PRX.key='';loadRep()">${Object.entries(PER).map(([k,v])=>`<option value="${k}" ${k==R.per?'selected':''}>${v}</option>`).join('')}</select></div>`;
 if(!O())return h+'<div class="c"><p class="mu">للمالك فقط</p></div>';
 if(P.key!=R.per&&!P.load)setTimeout(ld,0);
 if(P.load||P.key!=R.per)return h+'<div class="c"><p class="mu">جاري التحميل…</p></div>';
 if(!P.rows)return h+`<div class="c"><p class="e">${esc(P.err||'')}</p><button onclick="PRX.key='';PRX.rows=null;render()">إعادة المحاولة</button></div>`;
 const L=P.rows,sum=L.reduce((s,o)=>s+o.total,0),sp={},it={};
 L.forEach(o=>{const k=o.sup_name||'بدون مورد',e=sp[k]||(sp[k]={n:0,s:0});e.n++;e.s+=o.total;o.lines.forEach(l=>{const z=it[l.n]||(it[l.n]={q:0,s:0});z.q+=+l.q;z.s+=+l.q*+l.p})});
 const top=Object.entries(it).sort((a,b)=>b[1].s-a[1].s).slice(0,10);
 return h+`<div class="c"><b>ملخص المشتريات</b>${row('عدد الفواتير',L.length)}${row('إجمالي المشتريات',m(sum)+' ج')}</div>
 <div class="c"><b>حسب المورد</b>${Object.entries(sp).sort((a,b)=>b[1].s-a[1].s).map(([k,e])=>row(esc(k)+' ('+e.n+')',m(e.s)+' ج')).join('')||'<p class="mu">-</p>'}</div>
 <div class="c"><b>أكتر الأصناف شراءً</b>${top.map(([k,e])=>row(esc(k)+'<br><span class="mu">'+(+e.q.toFixed(3))+'</span>',m(e.s)+' ج')).join('')||'<p class="mu">-</p>'}</div>
 <div class="c"><b>كل الفواتير (${L.length})</b>${L.map(o=>{const op=P.open==o.id;return `<div class="it" style="flex-wrap:wrap" onclick="PRX.open=${op?'null':"'"+o.id+"'"};render()"><span>${new Date(o.created_at).toLocaleString('ar-EG')}<br><span class="mu">${esc(o.sup_name||'بدون مورد')}${o.by_name?' · '+esc(o.by_name):''}${o.note?' · '+esc(o.note):''}</span></span><b>${m(o.total)} ج</b>${op?`<div style="flex:1 1 100%">${o.lines.map(l=>`<div class="it"><span>${esc(l.n)}<br><span class="mu">${l.q} × ${m(l.p)}</span></span><span>${m(l.q*l.p)} ج</span></div>`).join('')}</div>`:''}</div>`}).join('')||'<p class="mu">مفيش مشتريات في الفترة دي</p>'}</div>`;
}
const V0=vRep;
vRep=function(){
 if(R.sub=='pur')return view();
 const h=V0();
 if(!O()||R.sub=='low'||h.includes('>المشتريات</button>'))return h;
 return h.replace('</div>',`<button class="sec" onclick="R.sub='pur';R.open=null;render()">المشتريات</button></div>`);
};
})();
