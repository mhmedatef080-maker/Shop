/* المتجر: تتبع الطلب للعميل */
(function(){
const K='my_orders',LB={new:'استلمنا طلبك',conf:'تم تأكيد طلبك',ship:'خرج للتوصيل',done:'تم التسليم',cancel:'الطلب اتلغى'},ST=['new','conf','ship','done'];
const ls=()=>{try{return JSON.parse(localStorage.getItem(K)||'[]')}catch(e){return[]}};
const sv2=a=>{try{localStorage.setItem(K,JSON.stringify(a.slice(0,12)))}catch(e){}};
document.addEventListener('DOMContentLoaded',()=>{
 const dv=doneView;
 doneView=function(){
  dv();
  if(done&&!done.tk){done.tk=1;const a=ls().filter(x=>x.no!=done.no);a.unshift({no:done.no,p:(PF&&PF.p)||localStorage.cph||''});sv2(a)}
 };
});
function card(r){
 const i=ST.indexOf(r.st),can=r.st=='cancel';
 return '<div class="p"><div class="pr"><b>طلب #'+r.no+'</b><span class="mu">'+new Date(r.at).toLocaleDateString('ar-EG')+'</span></div><div class="mu">'+esc((r.items||[]).slice(0,3).join('، '))+((r.items||[]).length>3?' …':'')+'</div>'+
 '<div style="font-weight:700;color:'+(can?'#b91c1c':'#0f766e')+';font-size:17px">'+(LB[r.st]||r.st)+'</div>'+
 (can?'':'<div style="display:flex;gap:4px">'+ST.map((s,j)=>'<div style="flex:1;height:6px;border-radius:3px;background:'+(j<=i?'#0f766e':'#e3e6ea')+'"></div>').join('')+'</div>')+
 '<div class="pr"><span class="mu">الإجمالي</span><b>'+m(r.total)+' ج</b></div><div class="mu">'+(r.pay_st=='paid'?'مدفوع ✓':(r.pay=='cod'?'الدفع عند الاستلام':'في انتظار تأكيد التحويل'))+'</div></div>';
}
window.tkClose=()=>{const o=$('#tkv');if(o)o.remove()};
window.tkOpen=async()=>{
 let o=$('#tkv');if(!o){o=document.createElement('div');o.id='tkv';o.className='ov';o.style.zIndex=8;document.body.appendChild(o)}
 const a=ls();
 o.innerHTML='<h1>📦 طلباتي</h1><p class="mu" style="text-align:center">جاري التحميل…</p>';
 const R=await Promise.all(a.map(x=>sb.rpc('p_track',{p_no:x.no,p_phone:x.p}).then(r=>r&&r.data?r.data:null,()=>null)));
 const L=R.filter(Boolean);
 o.innerHTML='<h1>📦 طلباتي</h1>'+(L.map(card).join('')||'<p class="mu" style="text-align:center">مفيش طلبات على الجهاز ده. دوّر برقم الطلب والموبايل:</p>')+
 '<b>دوّر على طلب</b><input id="tkn" type="number" inputmode="numeric" placeholder="رقم الطلب"><input id="tkp" type="tel" inputmode="numeric" placeholder="رقم موبايلك" value="'+esc(localStorage.cph||'')+'"><div id="tke" style="color:#b91c1c;font-size:14px"></div><button onclick="tkFind()">بحث</button><button class="sec" onclick="tkOpen()">تحديث</button><button class="sec" onclick="tkClose()">رجوع للمتجر</button>';
};
window.tkFind=async()=>{
 const n=+$('#tkn').value,p=$('#tkp').value.trim();
 if(!n||p.replace(/\D/g,'').length<8){$('#tke').textContent='اكتب رقم الطلب وموبايلك';return}
 const r=await sb.rpc('p_track',{p_no:n,p_phone:p});
 if(!r||!r.data){$('#tke').textContent='ما لقيناش طلب بالبيانات دي';return}
 const a=ls().filter(x=>x.no!=n);a.unshift({no:n,p});sv2(a);tkOpen();
};
const r0=render;
render=function(){
 r0();
 const h=$('#a h1');if(!h||$('#tkb'))return;
 const b=document.createElement('div');b.id='tkb';b.style.cssText='text-align:center;margin:4px 0';
 b.innerHTML='<a href="#" style="color:#0f766e;font-weight:600;font-size:15px" onclick="tkOpen();return false">📦 تتبع طلبي</a>';
 h.after(b);
};
})();
