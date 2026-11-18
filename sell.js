/* تقرير البياعين */
(function(){
const V0=vRep;
const nm=r=>r.src=='store'?'🛒 المتجر الإلكتروني':(r.seller||'بدون بائع');
function view(){
 const tabs=[['sales','المبيعات'],['profit','الأرباح'],['inv','الفواتير'],['sel','البياعين'],['low','النواقص']];
 let h=`<div class="c"><div class="r">${tabs.map(s=>`<button class="${R.sub==s[0]?'':'sec'}" onclick="R.sub='${s[0]}';R.open=null;render()">${s[1]}</button>`).join('')}</div><select onchange="R.per=this.value;loadRep()">${Object.entries(PER).map(([k,v])=>`<option value="${k}" ${k==R.per?'selected':''}>${v}</option>`).join('')}</select></div>`;
 if(R.loading)return h+'<div class="c"><p class="mu">جاري التحميل…</p></div>';
 if(!R.rows)return h+`<div class="c"><p class="e">${esc(R.err||'')}</p><button onclick="loadRep()">إعادة المحاولة</button></div>`;
 const g={};let T=0,N=0;
 R.rows.filter(r=>TY[r.type]).forEach(r=>{
  const k=nm(r),o=g[k]||(g[k]={n:0,s:0,p:0,l:[]}),t=+r.total*TY[r.type],c=R.cg[r.uid];
  o.n++;o.s+=t;o.l.push(r);if(c){o.p+=t-(+c.cogs);o.k=1}T+=t;N++;
 });
 const ks=Object.keys(g).sort((a,b)=>g[b].s-g[a].s);
 return h+`<div class="c"><b>مبيعات كل بائع</b>${ks.map(k=>{const o=g[k],op=R.open==k;
  return `<div class="it" style="flex-wrap:wrap" onclick="R.open=${op?'null':'this.dataset.k'};render()" data-k="${esc(k)}"><span>${esc(k)}<br><span class="mu">${o.n} فاتورة${o.k?" · ربح "+m(o.p)+" ج":""}</span></span><b>${m(o.s)} ج</b>${op?`<div style="flex:1 1 100%">${o.l.map(r=>`<div class="it"><span class="mu">#${r.no} ${new Date(r.created_at).toLocaleString('ar-EG')}</span><span>${m(+r.total*TY[r.type])} ج</span></div>`).join('')}</div>`:''}</div>`}).join('')||'<p class="mu">مفيش مبيعات في الفترة دي</p>'}
 <div class="it"><b>الإجمالي</b><b>${m(T)} ج · ${N} فاتورة</b></div></div>`;
}
vRep=function(){
 if(R.sub=='sel')return view();
 const h=V0();
 return R.sub=='low'?h:h.replace('</div>',`<button class="sec" onclick="R.sub='sel';R.open=null;render()">البياعين</button></div>`);
};
render();
})();
