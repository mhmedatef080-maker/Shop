function closeCart(){open=0;done=null;msg='';const o=$('#ov');if(o)o.remove()}
async function send(){
 if(!cnt())return;
 const n=$('#cn').value.trim(),p=normPh($('#cph').value),a=$('#ca').value.trim(),nt=$('#cm').value.trim();
 if(n.length<2||!okPh(p)){msg='اكتب اسمك ورقم موبايل صحيح (11 رقم يبدأ بـ 01)';cartView();return}
 if(!a){msg='اكتب عنوان التوصيل';cartView();return}
 PF={n,p};try{localStorage.pf=JSON.stringify(PF);localStorage.cn=n;localStorage.cph=p;localStorage.ca=a}catch(e){}
 const b=$('#sb');b.disabled=true;b.textContent='جاري الإرسال…';
 const r=await sb.rpc('p_place_order',{p_name:n,p_phone:p,p_addr:a,p_note:nt,p_pay:pay,p_lines:Object.values(cart).map(c=>({id:c.id,u:c.u,q:c.q}))});
 if(r.error||!r.data){msg=(r.error&&r.error.message)||'تعذر إرسال الطلب، جرّب تاني';cartView();return}
 done=Object.assign({},r.data,{pay,n});cart={};sv();bar();doneView();
}
function doneView(){
 const o=$('#ov'),d=done,c=D.cfg,wa=(c.wa||'').replace(/\D/g,'');
 const PN={cod:'عند الاستلام',vf:'فودافون كاش',ip:'إنستاباي'};
 const num=d.pay=='vf'?c.vf:d.pay=='ip'?c.ip:'';
 const pi=d.pay=='cod'?`هتدفع ${m(d.total)} ج عند الاستلام.`:`حوّل ${m(d.total)} ج على ${d.pay=='vf'?'فودافون كاش':'إنستاباي'}:<b style="font-size:20px;direction:ltr;display:block;text-align:center;margin:6px 0">${esc(num)}</b><button class="sec" onclick="cp('${esc(num)}')">نسخ الرقم</button>`;
 const t='طلب رقم '+d.no+' - '+d.n+'\nالإجمالي: '+m(d.total)+' ج\nالدفع: '+PN[d.pay]+(d.pay!='cod'?'\n(مرفق صورة التحويل)':'');
 WAU='https://wa.me/'+wa+'?text='+encodeURIComponent(t);
 o.innerHTML=`<h1>✅ تم تسجيل طلبك</h1><div class="p" style="text-align:center"><div>رقم طلبك</div><b style="font-size:28px">#${d.no}</b><div class="mu">${m(d.sub)} ج${d.ship>0?' + توصيل '+m(d.ship)+' ج':''}</div><b>الإجمالي ${m(d.total)} ج</b></div><div class="p">${pi}<p class="mu">${d.pay!='cod'?'بعد التحويل افتح واتساب وارفق صورة التحويل (برقم الطلب) عشان نأكد.':'هنكلمك لتأكيد الطلب.'}</p></div>${wa?`<button onclick="location.href=WAU">📲 ${d.pay!='cod'?'ابعت صورة التحويل على واتساب':'تأكيد على واتساب'}</button>`:''}<button class="sec" onclick="closeCart()">رجوع للمتجر</button>`;
}
if(!PF)gate();
load();
setTimeout(function(){if(!D&&document.getElementById('a').textContent.indexOf('جاري')>-1)document.getElementById('a').innerHTML='<p style="text-align:center;color:#b91c1c">الاتصال بطيء، حدّث الصفحة</p>'},8000);
