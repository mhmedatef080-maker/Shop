/* تقرير النواقص حسب المورد */
(function(){
const need=x=>Math.max(qr(+x.minq*2-x.qty),0);
const low=()=>S.items.filter(x=>+x.minq>0&&x.qty<=+x.minq).sort((a,b)=>a.qty/a.minq-b.qty/b.minq);
function groups(){
 const g={};
 low().forEach(x=>{const k=x.supplier&&supName(x.supplier)?x.supplier:'';(g[k]||(g[k]=[])).push(x)});
 return Object.keys(g).sort((a,b)=>a===''?1:b===''?-1:supName(a).localeCompare(supName(b))).map(k=>({k,n:k?supName(k):'مورد غير محدد',ph:k?((SUPL().find(s=>s.id==k)||{}).phone||''):'',L:g[k]}));
}
const txt=g=>'طلب بضاعة'+(g.k?' ('+g.n+')':'')+':\n'+g.L.map(x=>x.name+' — '+qr(need(x))+ku(x)).join('\n');
window.lnCp=i=>{const g=groups()[i];if(g)navigator.clipboard.writeText(txt(g)).then(()=>alert('اتنسخت'),()=>alert('ما اتنسختش'))};
window.lnWa=i=>{const g=groups()[i];if(g&&g.ph)window.open('https://wa.me/'+waN(g.ph)+'?text='+encodeURIComponent(txt(g)),'_blank')};
rLow=function(){
 const G=groups(),n=G.reduce((s,g)=>s+g.L.length,0);
 if(!n)return '<div class="c"><b>تقرير النواقص (0)</b><p class="mu">مفيش نواقص ✓</p></div>';
 let all=0;
 const h=G.map((g,i)=>{
  const est=g.L.reduce((s,x)=>s+need(x)*(+x.buy||0),0);all+=est;
  return `<div class="c"><b>${esc(g.n)} (${g.L.length})</b>${g.ph?`<div class="mu">${esc(g.ph)}</div>`:''}${g.L.map(x=>`<div class="it"><span>${esc(x.name)}<br><span class="mu">الموجود ${stk(x)} · الحد الأدنى ${x.minq}</span></span><span>اطلب ${qr(need(x))}${ku(x)}</span></div>`).join('')}<div class="it"><span>تكلفة تقديرية</span><b>${m(est)} ج</b></div><div class="r"><button onclick="lnCp(${i})">نسخ القائمة</button>${g.ph?`<button class="sec" onclick="lnWa(${i})">واتساب للمورد</button>`:''}</div></div>`}).join('');
 return `<div class="c"><b>تقرير النواقص (${n})</b><p class="mu">المقترح للطلب = للوصول لضعف الحد الأدنى. مقسّم حسب المورد.</p><div class="it"><span>التكلفة التقديرية الكلية</span><b>${m(all)} ج</b></div></div>`+h;
};
})();
