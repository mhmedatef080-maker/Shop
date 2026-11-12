let R={sub:'sales',per:'today',rows:null,cg:{},loading:0,err:'',open:null};
const PER={today:'اليوم',yest:'أمس',week:'آخر 7 أيام',month:'هذا الشهر',all:'الكل (آخر 1000)'};
const TY={sell:1,rsell:-1};
const dk=t=>new Date(t).toLocaleDateString('ar-EG');
function rng(){const n=new Date(),d=new Date(n.getFullYear(),n.getMonth(),n.getDate()),D=864e5,p=R.per;
 if(p=='today')return[d,null];if(p=='yest')return[new Date(d-D),d];if(p=='week')return[new Date(d-6*D),null];if(p=='month')return[new Date(n.getFullYear(),n.getMonth(),1),null];return[null,null]}
async function loadRep(){
 R.loading=1;R.err='';render();
 const [a,b]=rng();
 let q=sb.from('p_invoices').select('no,uid,type,cust_name,total,lines,created_at').order('no',{ascending:false}).limit(1000);
 if(a)q=q.gte('created_at',a.toISOString());if(b)q=q.lt('created_at',b.toISOString());
 const [r1,r2]=await Promise.all([q,sb.from('p_cogs').select('uid,cogs,det').limit(5000)]);
 R.loading=0;
 if(r1.error){R.rows=null;R.err=navigator.onLine?'تعذر تحميل التقرير':'محتاج نت للتقارير';render();return}
 R.rows=r1.data;R.cg={};(r2.data||[]).forEach(z=>R.cg[z.uid]=z);render();
}
function agg(){
 const rows=(R.rows||[]).filter(r=>TY[r.type]);
 let sales=0,ks=0,cogs=0,cnt=0,unk=0;const days={},items={};
 rows.forEach(r=>{
  const sg=TY[r.type],t=+r.total*sg,g=R.cg[r.uid];
  sales+=t;cnt++;
  const k=dk(r.created_at),d=days[k]||(days[k]={s:0,p:0,n:0});d.s+=t;d.n++;
  if(g){ks+=t;cogs+=+g.cogs;d.p+=t-(+g.cogs)}else unk++;
  (r.lines||[]).forEach((l,i)=>{
   const uq=l.uq!=null?+l.uq:+l.q,rev=sg*uq*(+l.p),c=g&&g.det&&g.det[i]!=null?+g.det[i]:null;
   const it=items[l.id]||(items[l.id]={n:String(l.n||'').split(' - ')[0],rev:0,p:0});
   it.rev+=rev;if(c!=null)it.p+=rev-sg*(+l.q)*c;
  });
 });
 return {sales,ks,cogs,cnt,unk,days:Object.entries(days),items:Object.values(items)};
}
function vRep(){
 const sub=[['sales','المبيعات'],['profit','الأرباح'],['inv','الفواتير'],['low','النواقص']];
 let h=`<div class="c"><div class="r">${sub.map(s=>`<button class="${R.sub==s[0]?'':'sec'}" onclick="R.sub='${s[0]}';R.open=null;render()">${s[1]}</button>`).join('')}</div>`;
 if(R.sub!='low')h+=`<select onchange="R.per=this.value;loadRep()">${Object.entries(PER).map(([k,v])=>`<option value="${k}" ${k==R.per?'selected':''}>${v}</option>`).join('')}</select>`;
 h+='</div>';
 if(R.sub=='low')return h+rLow();
 if(R.loading)return h+'<div class="c"><p class="mu">جاري التحميل…</p></div>';
 if(!R.rows)return h+`<div class="c"><p class="e">${esc(R.err||'')}</p><button onclick="loadRep()">إعادة المحاولة</button></div>`;
 return h+({sales:rSales,profit:rProfit,inv:rInv}[R.sub])();
}
function rSales(){
 const a=agg();
 return `<div class="c"><b>ملخص المبيعات</b>
 <div class="it"><span>صافي المبيعات (بعد المرتجع)</span><b>${m(a.sales)} ج</b></div>
 <div class="it"><span>عدد الفواتير</span><span>${a.cnt}</span></div>
 <div class="it"><span>متوسط الفاتورة</span><span>${a.cnt?m(a.sales/a.cnt):'-'} ج</span></div></div>
 <div class="c"><b>حسب اليوم</b>${a.days.map(([k,v])=>`<div class="it"><span>${k}<br><span class="mu">${v.n} فاتورة</span></span><span>${m(v.s)} ج</span></div>`).join('')||'<p class="mu">مفيش مبيعات في الفترة دي</p>'}</div>
 <div class="c"><b>أكتر الأصناف مبيعاً</b>${a.items.sort((x,y)=>y.rev-x.rev).slice(0,10).map(i=>`<div class="it"><span>${esc(i.n)}</span><span>${m(i.rev)} ج</span></div>`).join('')||'<p class="mu">-</p>'}</div>`;
}
function rProfit(){
 const a=agg(),pf=a.ks-a.cogs,mg=a.ks?pf/a.ks*100:0;
 return `<div class="c"><b>تقرير الربح</b>
 <div class="it"><span>المبيعات</span><span>${m(a.ks)} ج</span></div>
 <div class="it"><span>تكلفة البضاعة المباعة</span><span>${m(a.cogs)} ج</span></div>
 <div class="it"><b>صافي الربح</b><b class="${pf<0?'e':'ok'}">${m(pf)} ج</b></div>
 <div class="it"><span>هامش الربح</span><span>${m(mg)}٪</span></div>
 ${a.unk?`<p class="mu">${a.unk} فاتورة من غير تكلفة اتخطت من الحساب.</p>`:''}<p class="mu">الربح قبل المصاريف (إيجار وعمال وغيره).</p></div>
 <div class="c"><b>الربح حسب اليوم</b>${a.days.map(([k,v])=>`<div class="it"><span>${k}</span><span class="${v.p<0?'e':''}">${m(v.p)} ج</span></div>`).join('')||'<p class="mu">-</p>'}</div>
 <div class="c"><b>أكتر الأصناف ربحاً</b>${a.items.sort((x,y)=>y.p-x.p).slice(0,10).map(i=>`<div class="it"><span>${esc(i.n)}</span><span class="${i.p<0?'e':''}">${m(i.p)} ج</span></div>`).join('')||'<p class="mu">-</p>'}</div>`;
}
function rInv(){
 const rows=R.rows;
 return `<div class="c"><b>الفواتير (${rows.length})</b>${rows.map(r=>{
  const g=R.cg[r.uid],sg=TY[r.type]||0,open=R.open==r.no,pf=g&&sg?sg*(+r.total)-(+g.cogs):null;
  return `<div class="it" style="flex-wrap:wrap" onclick="R.open=${open?'null':r.no};render()"><span><b>#${r.no}</b> ${TL[r.type]||''}<br><span class="mu">${esc(r.cust_name||'')} · ${new Date(r.created_at).toLocaleString('ar-EG')}</span></span><span>${m(r.total)} ج${pf!=null?`<br><span class="mu ${pf<0?'e':''}">ربح ${m(pf)}</span>`:''}</span>${open?`<div style="width:100%;margin-top:6px">${(r.lines||[]).map((l,i)=>{const uq=l.uq!=null?+l.uq:+l.q,c=g&&g.det&&g.det[i]!=null?+g.det[i]:null;return `<div class="it mu"><span>${esc(l.n)}<br>${qr(uq)} × ${m(l.p)}</span><span>${m(uq*l.p)} ج${c!=null?`<br>تكلفة ${m(c*l.q)}`:''}</span></div>`}).join('')}</div>`:''}</div>`}).join('')||'<p class="mu">مفيش فواتير في الفترة دي</p>'}</div>`;
}
function rLow(){
 const L=S.items.filter(x=>+x.minq>0&&x.qty<=+x.minq).sort((a,b)=>a.qty/a.minq-b.qty/b.minq);
 const need=x=>Math.max(qr(+x.minq*2-x.qty),0);
 let est=0;L.forEach(x=>est+=need(x)*(+x.buy||0));
 return `<div class="c"><b>تقرير النواقص (${L.length})</b><p class="mu">المقترح للطلب = للوصول لضعف الحد الأدنى.</p>${L.map(x=>`<div class="it"><span>${esc(x.name)}<br><span class="mu">الموجود ${stk(x)} · الحد الأدنى ${x.minq}</span></span><span>اطلب ${qr(need(x))}${ku(x)}</span></div>`).join('')||'<p class="mu">مفيش نواقص ✓</p>'}${L.length?`<div class="it"><span>تكلفة تقديرية</span><b>${m(est)} ج</b></div><button onclick="cpNeed()">نسخ قائمة الطلب للواتساب</button>`:''}</div>`;
}
function cpNeed(){const t=S.items.filter(x=>+x.minq>0&&x.qty<=+x.minq).map(x=>x.name+' — '+qr(Math.max(+x.minq*2-x.qty,0))+ku(x)).join('\n');navigator.clipboard.writeText('طلب بضاعة:\n'+t).then(()=>alert('اتنسخت'),()=>alert('ما اتنسختش'))}

const _rd=render;
const ONAV=[['sell','فاتورة'],['items','أصناف'],['cust','عملاء'],['rep','تقارير'],['set','إعداد']];
const navO=()=>`<nav>${ONAV.map(t=>`<button class="${tab==t[0]?'on':''}" onclick="go('${t[0]}')">${t[1]}</button>`).join('')}</nav>`;
render=function(){
 if(!(auth&&O()))return _rd();
 if(tab=='hist'||tab=='low')tab='rep';
 if(tab=='rep'){$('#a').innerHTML=`<h1>${esc(S.shop)} <small></small></h1>`+vRep()+navO();hd();return}
 _rd();const nv=document.querySelector('nav');if(nv)nv.outerHTML=navO();
};
go=function(t){if(O()&&(t=='hist'||t=='low'))t='rep';tab=t;msg='';edit=null;render();if(t=='rep'&&O())loadRep()};
render();
