let CD={id:null,per:'all',st:null,load:0,err:''},SUPT='cust',SM='';
const SUPL=()=>S.sup||[];
const supName=id=>{const s=SUPL().find(z=>z.id==id);return s?s.name:''};

iRows=function(own){
 const q=IQ.trim().toLowerCase(),qs=IQ.trim().replace('#','');
 const L=S.items.filter(x=>!q||(x.name||'').toLowerCase().includes(q)||x.barcode===IQ.trim()||String(x.no)===qs);
 return L.map(x=>`<div class="it"${own?` onclick="edit='${x.id}';msg='';render();scrollTo(0,0)"`:''}><span><span class="mu">#${x.no||'—'}</span> ${esc(x.name)}<br><span class="mu">${m(x.retail)} / ${m(x.wholesale)}${x.unit=='k'?' للكيلو':''} · ${esc(x.barcode||'')}${uOf(x.id).length?' · '+uOf(x.id).length+' وحدة':''}${own&&x.supplier?' · '+esc(supName(x.supplier)):''}</span></span><span class="${lw(x)?'e':''}">${stk(x)}${own?` <button class="del" onclick="event.stopPropagation();openCard('${x.id}')">كارت</button><button class="del" onclick="event.stopPropagation();delItem('${x.id}')">✕</button>`:''}</span></div>`).join('')||'<p class="mu">مفيش أصناف</p>';
};
const _lk=lookup;
lookup=function(q){const r=_lk(q),t=String(q).trim();if(r.length||!/^#?\d{1,6}$/.test(t))return r;const x=S.items.find(i=>i.no==+t.replace('#',''));return x?[{x,u:null}]:r};

const _vi=vItems;
vItems=function(){
 let h=_vi();
 if(O()){
  const e=edit?S.items.find(x=>x.id==edit):null;
  const sel=`<select id="sp"><option value="">المورد: غير محدد</option>${SUPL().map(s=>`<option value="${s.id}" ${e&&e.supplier==s.id?'selected':''}>${esc(s.name)}</option>`).join('')}</select>`;
  h=h.replace('<button onclick="saveItem()">',sel+(e?`<button class="sec" onclick="openCard('${e.id}')">كارت الصنف</button>`:'')+'<button onclick="saveItem()">');
 }
 return h;
};
const _si=saveItem;
saveItem=function(){
 const sp=$('#sp')?$('#sp').value:null,n0=S.q.length;
 _si();
 if(sp===null)return;
 for(let i=n0;i<S.q.length;i++){const o=S.q[i];if(o.k=='cost'){o.v.supplier=sp||null;const x=S.items.find(z=>z.id==o.v.id);if(x)x.supplier=sp||null}}
 sv();render();
};

const _vc=vCust;
vCust=function(){
 if(!O())return _vc();
 return `<div class="c"><div class="r"><button class="${SUPT=='cust'?'':'sec'}" onclick="SUPT='cust';render()">العملاء</button><button class="${SUPT=='sup'?'':'sec'}" onclick="SUPT='sup';render()">الموردين</button></div></div>`+(SUPT=='sup'?vSup():_vc());
};
function vSup(){
 const cnt=id=>S.items.filter(x=>x.supplier==id).length;
 return `<div class="c"><b>مورد جديد</b><input id="sn2" placeholder="اسم المورد"><input id="sp2" type="tel" placeholder="التليفون"><input id="snt" placeholder="ملاحظة (اختياري)"><button onclick="addSup()">حفظ</button><div class="e">${SM}</div></div>
 <div class="c">${SUPL().map(s=>`<div class="it"><span>${esc(s.name)}<br><span class="mu">${esc(s.phone||'')}${s.note?' · '+esc(s.note):''} · ${cnt(s.id)} صنف</span></span><button class="del" onclick="delSup('${s.id}')">✕</button></div>`).join('')||'<p class="mu">لسه مفيش موردين</p>'}</div>`;
}
function addSup(){
 const name=$('#sn2').value.trim();if(!name){SM='اكتب اسم المورد';render();return}
 const v={id:crypto.randomUUID(),name,phone:$('#sp2').value.trim()||null,note:$('#snt').value.trim()||null};
 S.sup=SUPL().concat([v]);S.sq=(S.sq||[]).concat([{k:'sup',v}]);SM='';sv();render();sync();
}
function delSup(id){
 if(!confirm('مسح المورد؟ الأصناف هتفضل من غير مورد'))return;
 S.sup=SUPL().filter(s=>s.id!=id);S.items.forEach(x=>{if(x.supplier==id)x.supplier=null});
 S.sq=(S.sq||[]).concat([{k:'delsup',id}]);sv();render();sync();
}
async function supPush(){
 if(!O()||!auth)return;S.sq=S.sq||[];
 try{while(S.sq.length){const o=S.sq[0];
  const r=o.k=='sup'?await sb.from('p_suppliers').upsert(o.v):await sb.from('p_suppliers').delete().eq('id',o.id);
  if(r.error){if(r.status===0||/fetch|network/i.test(r.error.message||''))throw 0;S.bad++;S.sq.shift();sv();continue}
  S.sq.shift();sv()}}catch(e){}
}
async function supPull(){
 if(!O()||!auth||(S.sq&&S.sq.length)||S.q.length)return;
 try{
  const [a,b]=await Promise.all([sb.from('p_suppliers').select('*').order('name'),sb.from('p_costs').select('id,supplier')]);
  if(!a.error)S.sup=a.data;
  if(!b.error){const mp={};b.data.forEach(z=>mp[z.id]=z.supplier);S.items.forEach(x=>{if(x.id in mp)x.supplier=mp[x.id]})}
  sv();
 }catch(e){}
}
const _sy4=sync;
sync=async function(){await supPush();await _sy4();await supPull()};
setInterval(()=>{if(S.sq&&S.sq.length)sync()},15000);

function openCard(id){CD={id,per:CD.per||'all',st:null,load:0,err:''};tab='card';render();loadCard()}
async function loadCard(){
 CD.load=1;CD.err='';render();
 const n=new Date(),d0=new Date(n.getFullYear(),n.getMonth(),n.getDate()),p=CD.per;
 const from=p=='today'?d0:p=='week'?new Date(d0-6*864e5):p=='month'?new Date(n.getFullYear(),n.getMonth(),1):null;
 const r=await sb.rpc('p_item_stats',{p_item:CD.id,p_from:from?from.toISOString():null});
 CD.load=0;
 if(r.error){CD.st=null;CD.err=navigator.onLine?('تعذر تحميل الإحصائيات: '+r.error.message):'محتاج نت للإحصائيات'}
 else CD.st=(r.data&&r.data[0])||{qty:0,sales:0,revenue:0,profit:0,last_sale:null};
 render();
}
function vCard(){
 const x=S.items.find(i=>i.id==CD.id);
 if(!x)return `<div class="c"><button onclick="go('items')">رجوع</button></div>`;
 const us=uOf(x.id),bu=x.unit=='k'?'كجم':'قطعة',bp=+x.buy||0,mg=x.retail?((x.retail-bp)/x.retail*100):0,st=CD.st;
 return `<div class="c"><div class="r"><button class="sec" style="flex:0 0 auto;width:auto" onclick="go('items')">← رجوع</button><button class="sec" style="flex:0 0 auto;width:auto" onclick="tab='items';edit='${x.id}';render()">تعديل</button></div><h3 style="margin:8px 0">#${x.no||'—'} ${esc(x.name)}</h3>
 <div class="it"><span>الباركود</span><span>${esc(x.barcode||'-')}</span></div>
 <div class="it"><span>الوحدة</span><span>${x.unit=='k'?'بالكيلو':'بالقطعة'}</span></div>
 <div class="it"><span>المورد</span><span>${esc(supName(x.supplier)||'غير محدد')}</span></div>
 <div class="it"><span>سعر الشراء</span><span>${m(bp)} ج</span></div>
 <div class="it"><span>سعر التجزئة</span><span>${m(x.retail)} ج</span></div>
 <div class="it"><span>سعر الجملة</span><span>${m(x.wholesale)} ج</span></div>
 <div class="it"><span>هامش التجزئة</span><span>${m(mg)}٪ · ${m(x.retail-bp)} ج</span></div>
 <div class="it"><span>المخزون</span><b class="${lw(x)?'e':''}">${stk(x)}</b></div>
 <div class="it"><span>الحد الأدنى</span><span>${x.minq||'-'}</span></div>
 <div class="it"><span>قيمة المخزون (بسعر الشراء)</span><span>${m(x.qty*bp)} ج</span></div>
 ${us.length?`<p class="mu">${us.map(u=>esc(u.name)+' = '+u.factor+' '+bu).join(' · ')}</p>`:''}</div>
 <div class="c"><div class="r"><b>المبيعات</b><select onchange="CD.per=this.value;loadCard()">${[['today','اليوم'],['week','آخر 7 أيام'],['month','هذا الشهر'],['all','الكل']].map(([k,v])=>`<option value="${k}" ${k==CD.per?'selected':''}>${v}</option>`).join('')}</select></div>
 ${CD.load?'<p class="mu">جاري التحميل…</p>':CD.err?`<p class="e">${esc(CD.err)}</p>`:st?`<div class="it"><span>عدد مرات البيع</span><b>${st.sales}</b></div><div class="it"><span>الكمية المباعة</span><b>${qr(+st.qty)} ${bu}</b></div><div class="it"><span>الإيراد</span><span>${m(+st.revenue)} ج</span></div><div class="it"><span>الربح</span><b class="${+st.profit<0?'e':'ok'}">${m(+st.profit)} ج</b></div><div class="it"><span>آخر بيع</span><span>${st.last_sale?new Date(st.last_sale).toLocaleString('ar-EG'):'-'}</span></div>`:''}</div>`;
}
const _rd4=render;
render=function(){
 if(auth&&O()&&tab=='card'){$('#a').innerHTML=`<h1>${esc(S.shop)} <small></small></h1>`+vCard()+navX();hd();return}
 _rd4();
};

if(typeof rInv=='function'){
 const _ri=rInv;
 rInv=function(){return `<div class="c"><div class="r"><input id="isn" type="number" inputmode="numeric" placeholder="رقم الفاتورة"><button style="flex:0 0 auto;width:auto" onclick="findInv()">بحث</button></div></div>`+_ri()};
}
async function findInv(){
 const n=+$('#isn').value;if(!n)return;
 const a=await sb.from('p_invoices').select('no,uid,type,cust_name,total,lines,created_at').eq('no',n);
 if(a.error||!a.data.length){alert('مفيش فاتورة بالرقم ده');return}
 const b=await sb.from('p_cogs').select('uid,cogs,det').eq('uid',a.data[0].uid);
 R.rows=a.data;R.cg={};(b.data||[]).forEach(z=>R.cg[z.uid]=z);R.open=n;render();
}
render();sync();
