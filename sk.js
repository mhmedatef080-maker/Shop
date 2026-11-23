/* تقرير رصيد المخزن بالتاريخ */
(function(){
const P=window.SKX={d:'',key:'',map:null,load:0,err:'',q:'',z:0};
const td=()=>{const t=new Date();return t.getFullYear()+'-'+String(t.getMonth()+1).padStart(2,'0')+'-'+String(t.getDate()).padStart(2,'0')};
async function pg(tb,cols,from){let out=[],o=0;for(;;){const r=await sb.from(tb).select(cols).gte('created_at',from).order('created_at').range(o,o+999);if(r.error)throw r.error;out=out.concat(r.data||[]);if((r.data||[]).length<1000||o>20000)break;o+=1000}return out}
async function ld(){
 if(P.load||!O()||!navigator.onLine)return;P.load=1;P.err='';
 try{
  const key=P.d,f=new Date(P.d+'T00:00:00');f.setDate(f.getDate()+1);
  const[iv,pu]=await Promise.all([pg('p_invoices','type,lines',f.toISOString()),pg('p_purchases','lines',f.toISOString())]),dl={},ad=(i,v)=>{dl[i]=(dl[i]||0)+v};
  iv.forEach(i=>(i.lines||[]).forEach(l=>{const q=+l.q||0;ad(l.id,i.type=='rsell'?q:(i.type=='sell'||i.type=='rbuy')?-q:0)}));
  pu.forEach(p=>(p.lines||[]).forEach(l=>ad(l.id,(+l.q||0)*(+l.f||1))));
  P.map=dl;P.key=key;
 }catch(e){P.err=e.message||'خطأ';P.map=null;P.key=''}
 P.load=0;render();
}
window.skSet=v=>{P.d=v||td();P.key='';P.map=null;render()};
window.skQ=v=>{P.q=v;const e=$('#skl');if(e)e.innerHTML=rows().h};
const old=()=>P.d&&P.d<td();
const qt=x=>old()?qr((+x.qty||0)-(P.map[x.id]||0)):+x.qty||0;
function rows(){
 const t=P.q.trim().toLowerCase();let nb=0,ns=0,n=0;
 const h=S.items.slice().sort((a,b)=>a.name.localeCompare(b.name)).filter(x=>!t||(x.name||'').toLowerCase().includes(t)).map(x=>{
  const q=qt(x);if(q<=0&&!P.z)return '';
  const v=Math.max(q,0);nb+=v*(+x.buy||0);ns+=v*(+x.retail||0);if(q>0)n++;
  return `<div class="it"><span>${esc(x.name)}<br><span class="mu">شراء ${m(x.buy||0)} · بيع ${m(x.retail||0)}</span></span><span style="text-align:left" class="${q<0?'e':''}">${qr(q)}${ku(x)}<br><span class="mu">${m(v*(+x.buy||0))} ← ${m(v*(+x.retail||0))}</span></span></div>`}).join('')||'<p class="mu">مفيش أصناف</p>';
 return{h,nb,ns,n};
}
function view(){
 const tabs=[['sales','المبيعات'],['profit','الأرباح'],['inv','الفواتير'],['sel','البياعين'],['ord','طلبات المتجر'],['pur','المشتريات'],['stk','رصيد المخزن'],['low','النواقص']];
 let h=`<div class="c"><div class="r">${tabs.map(s=>`<button class="${R.sub==s[0]?'':'sec'}" onclick="R.sub='${s[0]}';render()">${s[1]}</button>`).join('')}</div></div>`;
 if(!O())return h+'<div class="c"><p class="mu">للمالك فقط</p></div>';
 if(!P.d)P.d=td();
 const dp=`<div class="c"><b>رصيد المخزن</b><input type="date" value="${P.d}" max="${td()}" onchange="skSet(this.value)">`;
 if(old()&&P.key!=P.d){if(!P.load&&!P.err)setTimeout(ld,0);return h+dp+`<p class="mu">${P.err?'':'جاري الحساب…'}</p>${P.err?`<p class="e">${esc(P.err)}</p><button onclick="SKX.err='';render()">إعادة المحاولة</button>`:''}</div>`}
 const r=rows();
 return h+dp+`${old()?'<p class="mu">تقريبي: محسوب من الفواتير والمشتريات اللي بعد التاريخ ده، وبأسعار الشراء والبيع الحالية. مش بيشمل تعديل الكميات اليدوي أو الجرد.</p>':''}
 <div class="it"><span>أصناف ليها رصيد</span><b>${r.n}</b></div><div class="it"><span>الإجمالي بسعر الشراء (الأصل)</span><b>${m(r.nb)} ج</b></div><div class="it"><span>الإجمالي بسعر البيع</span><b>${m(r.ns)} ج</b></div><div class="it"><span>الربح المتوقع</span><b>${m(r.ns-r.nb)} ج</b></div>
 <input placeholder="ابحث باسم الصنف" value="${esc(P.q)}" oninput="skQ(this.value)"><label style="display:flex;gap:8px;align-items:center"><input type="checkbox" style="width:auto;margin:0" ${P.z?'checked':''} onchange="SKX.z=this.checked?1:0;render()"> إظهار الأصناف اللي رصيدها صفر</label></div><div class="c" id="skl">${r.h}</div>`;
}
const V0=vRep;
vRep=function(){
 if(R.sub=='stk')return view();
 const h=V0();
 if(!O()||R.sub=='low'||h.includes('>رصيد المخزن</button>'))return h;
 return h.replace('</div>',`<button class="sec" onclick="R.sub='stk';render()">رصيد المخزن</button></div>`);
};
})();
