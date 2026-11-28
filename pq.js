/* البياع: إرسال الفاتورة للمركزي + متابعة المنتظرة والمرفوضة */
(function(){
const P=window.PQX={rows:[],T:0};
const me=()=>localStorage.pn||(O()?'المالك':'بياع');
window.PQC=()=>localStorage.cn=='1';
const tt=()=>Math.round(cart.reduce((s,x)=>s+x.q*x.p,0)*100)/100;
const hm=t=>new Date(t).toLocaleTimeString('ar-EG',{hour:'numeric',minute:'2-digit'});
function lh(){
 return '<b>فواتيري عند المركزي</b>'+P.rows.map(r=>`<div class="it" style="flex-wrap:wrap"><span>${esc(r.cust_name||'نقدي')} · ${hm(r.created_at)}<br><span class="${r.status=='rej'?'e':'mu'}">${r.status=='rej'?'❌ مرفوضة: '+esc(r.reason||''):'⏳ في انتظار المركزي'}</span></span><b>${m(r.total)} ج</b><div class="r" style="flex:1 1 100%">${r.status=='rej'?`<button onclick="pqE('${r.id}')">تعديل وإعادة إرسال</button>`:`<button class="sec" onclick="pqX('${r.id}')">إلغاء</button>`}</div></div>`).join('');
}
function draw(){const e=$('#pql');if(e){e.innerHTML=lh();e.style.display=P.rows.length?'':'none'}}
async function ld(f){
 if(!auth||!navigator.onLine||(!f&&Date.now()-P.T<8000))return;P.T=Date.now();
 try{
  const r=await sb.from('p_pending').select('id,created_at,total,cust,cust_name,status,reason,cart').eq('by_name',me()).in('status',['wait','rej']).order('created_at');
  if(r&&!r.error&&Array.isArray(r.data)){P.rows=r.data;draw()}
 }catch(e){}
}
window.pqS=async()=>{
 if(ty!='sell'||!cart.length)return;
 if(!navigator.onLine){alert('محتاج نت عشان تبعت للمركزي');return}
 const c=S.custs.find(x=>x.id==cust),r=await sb.from('p_pending').insert({by_name:me(),cust:cust||null,cust_name:c?c.name:'نقدي',total:tt(),cart:cart});
 if(r.error){alert('ما اتبعتتش: '+r.error.message);return}
 cart=[];cust='';window.CRP='';msg='اتبعتت للمركزي ✓';render();ld(1);
};
window.pqX=async id=>{
 if(!confirm('إلغاء الفاتورة دي؟'))return;
 await sb.rpc('p_pend_set',{p_id:id,p_st:'void'});ld(1);
};
window.pqE=async id=>{
 const r=P.rows.find(x=>x.id==id);if(!r)return;
 if(cart.length&&!confirm('الفاتورة الحالية هتتمسح. نكمل؟'))return;
 cart=r.cart||[];cust=r.cust||'';ty='sell';
 await sb.rpc('p_pend_set',{p_id:id,p_st:'void'});P.rows=P.rows.filter(x=>x.id!=id);render();
};
const R0=render;
render=function(){
 R0();
 if(tab!='sell'||ty!='sell'||!$('#a')||PQC())return;
 const b=[...document.querySelectorAll('#a button')].find(x=>(x.getAttribute('onclick')||'')=='done()');
 if(b&&!$('#pqb')){const n=document.createElement('button');n.id='pqb';n.className='sec';n.textContent='إرسال للمركزي';n.onclick=pqS;b.after(n)}
 if(!$('#pql')){const d=document.createElement('div');d.id='pql';d.className='c';d.style.display='none';const nv=$('#a nav');nv?nv.before(d):$('#a').appendChild(d);draw()}
 ld();
};
setInterval(()=>{if(tab=='sell'&&!PQC())ld()},10000);
})();
