let IQ='';
function iRows(own){
 const q=IQ.trim().toLowerCase();
 const L=S.items.filter(x=>!q||(x.name||'').toLowerCase().includes(q)||x.barcode===IQ.trim());
 return L.map(x=>`<div class="it"${own?` onclick="edit='${x.id}';msg='';render();scrollTo(0,0)"`:''}><span>${esc(x.name)}<br><span class="mu">${m(x.retail)} / ${m(x.wholesale)}${x.unit=='k'?' للكيلو':''} · ${esc(x.barcode||'')}${uOf(x.id).length?' · '+uOf(x.id).length+' وحدة':''}</span></span><span class="${lw(x)?'e':''}">${stk(x)}${own?` <button class="del" onclick="event.stopPropagation();delItem('${x.id}')">✕</button>`:''}</span></div>`).join('')||'<p class="mu">مفيش أصناف</p>';
}
vItems=function(){
 const srch=own=>`<div class="c"><input placeholder="بحث بالاسم أو الباركود" value="${esc(IQ)}" oninput="IQ=this.value;$('#il').innerHTML=iRows(${own})"><div id="il">${iRows(own)}</div></div>`;
 if(!O())return srch(0);
 const e=edit?S.items.find(x=>x.id==edit):null,us=e?uOf(e.id):[],bu=e&&e.unit=='k'?'كجم':'قطعة';
 return `<div class="c"><b>${e?'تعديل صنف':'صنف جديد'}</b><input id="n" placeholder="اسم الصنف" value="${esc(e?e.name:'')}">
 <select id="un"><option value="p" ${e&&e.unit=='k'?'':'selected'}>يُباع بالقطعة</option><option value="k" ${e&&e.unit=='k'?'selected':''}>يُباع بالكيلو (الأسعار للكيلو)</option></select>
 <div class="r"><input id="bc" placeholder="الباركود" value="${esc(e?e.barcode:'')}"><button class="sec" style="flex:0 0 auto;width:auto" onclick="scan(c=>$('#bc').value=c)">📷</button></div>
 <div class="r"><input id="rp" type="number" step="any" inputmode="decimal" placeholder="سعر التجزئة" value="${e?e.retail:''}"><input id="wp" type="number" step="any" inputmode="decimal" placeholder="سعر الجملة" value="${e?e.wholesale:''}"></div>
 <div class="r"><input id="bp" type="number" step="any" inputmode="decimal" placeholder="سعر الشراء" value="${e?e.buy:''}"><input id="mq" type="number" step="any" inputmode="decimal" placeholder="الحد الأدنى" value="${e&&e.minq?e.minq:''}"></div>
 ${e?`<div class="mu">الكمية الحالية (${bu}) — عدّلها لتصحيح الجرد</div><input id="qc" type="number" step="any" inputmode="decimal" value="${qr(e.qty)}">
 <div class="r"><input id="qq" type="number" step="any" inputmode="decimal" placeholder="إضافة بضاعة جديدة (اختياري)">${us.length?`<select id="qu"><option value="1">${bu}</option>${us.map(u=>`<option value="${u.factor}">${esc(u.name)} (${u.factor})</option>`).join('')}</select>`:''}</div>`:`<input id="qc" type="number" step="any" inputmode="decimal" placeholder="الكمية">`}
 <button onclick="saveItem()">حفظ</button>${e?`<button class="sec" onclick="edit=null;render()">إلغاء</button>`:''}<div class="e">${msg}</div></div>
 ${e?`<div class="c"><b>وحدات التغليف</b><p class="mu">المخزون والأسعار الأساسية بوحدة الصنف (${bu}). كل وحدة ليها باركودها.</p>${us.map(u=>`<div class="it"><span>${esc(u.name)} = ${u.factor} ${bu}<br><span class="mu">${esc(u.barcode||'')} · ${m(u.retail)} / ${m(u.wholesale)}</span></span><button class="del" onclick="delUnit('${u.id}')">✕</button></div>`).join('')}
 <input id="un_n" placeholder="اسم الوحدة (كرتونة / باكيت / شكارة)"><div class="r"><input id="un_f" type="number" step="any" inputmode="decimal" placeholder="تساوي كام ${bu}"><input id="un_b" placeholder="باركود الوحدة"></div><div class="r"><input id="un_r" type="number" step="any" inputmode="decimal" placeholder="سعر التجزئة"><input id="un_w" type="number" step="any" inputmode="decimal" placeholder="سعر الجملة"></div><button onclick="addUnit()">إضافة وحدة</button></div>`:''}
 ${srch(1)}`;
};
saveItem=function(){
 const name=$('#n').value.trim();if(!name){msg='اكتب اسم الصنف';render();return}
 const bc=$('#bc').value.trim()||null;
 if(bc&&dupBc(bc,edit)){msg='الباركود ده مستخدم قبل كده';render();return}
 const f={name,barcode:bc,retail:+$('#rp').value||0,wholesale:+$('#wp').value||0,minq:+$('#mq').value||0,unit:$('#un').value},b=+$('#bp').value||0;
 if(edit){
  const x=S.items.find(i=>i.id==edit),cur=$('#qc').value===''?x.qty:+$('#qc').value,add=qr((+($('#qq')?$('#qq').value:0)||0)*(+($('#qu')?$('#qu').value:1)||1)),nq=qr(cur+add),d=qr(nq-x.qty);
  Object.assign(x,f,{buy:b});x.qty=nq;
  S.q.push({k:'item',v:Object.assign({id:edit},f)},{k:'cost',v:{id:edit,buy:b}});
  if(d)S.q.push({k:'adj',id:edit,d});
  edit=null;
 }else{
  const id=crypto.randomUUID(),q0=qr(+$('#qc').value||0);
  S.items.push(Object.assign({id,qty:q0,buy:b},f));
  S.items.sort((a,c)=>a.name.localeCompare(c.name));
  S.q.push({k:'item',v:Object.assign({id,qty:q0},f)},{k:'cost',v:{id,buy:b}});
 }
 msg='تم الحفظ ✓';sv();render();sync();
};
render();
