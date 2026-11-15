function render(){
 const cats=[...new Set(items().map(x=>x.cat||'أخرى'))];CT=cats;
 const hi=PF?`<div class="mu" style="text-align:center">أهلاً ${esc(PF.n)} · <a href="#" onclick="gate();return false">تغيير</a></div>`:'';
 $('#a').innerHTML=`<h1>${esc(D.cfg.name||'المتجر')}</h1>${hi}${D.cfg.note?`<div class="nt">${esc(D.cfg.note)}</div>`:''}<input placeholder="ابحث عن منتج…" value="${esc(q)}" oninput="q=this.value;list()"><div class="ch"><button class="${cat?'sec':''}" onclick="cat='';render()">الكل</button>${cats.map((c,j)=>`<button class="${cat==c?'':'sec'}" onclick="cat=CT[${j}];render()">${esc(c)}</button>`).join('')}</div><div id="l"></div><div class="bar" id="b"></div>`;
 list();bar();
}
function list(){
 const t=q.trim().toLowerCase(),L=items().map((x,i)=>[x,i]).filter(([x])=>(!cat||(x.cat||'أخرى')==cat)&&(!t||(x.name||'').toLowerCase().includes(t)));
 $('#l').innerHTML=L.map(([x,i])=>{
  const o=opts(x),any=o.some(z=>z.ok);
  return `<div class="p"><div class="pr"><b>${esc(x.name)}</b>${o.length==1?`<span>${m(x.price)} ج${x.unit=='k'?' / كيلو':''}</span>`:''}</div>${any?`<div class="pr">${o.length>1?`<select id="u${i}">${o.map((z,j)=>`<option value="${j}" ${z.ok?'':'disabled'}>${esc(z.name)} — ${m(z.price)} ج${z.ok?'':' (غير متاح)'}</option>`).join('')}</select>`:'<span></span>'}<button style="width:auto;margin:0;padding:10px 16px" onclick="add(${i})">أضف +</button></div>`:'<span class="out">غير متاح حالياً</span>'}</div>`}).join('')||'<p class="mu" style="text-align:center">مفيش أصناف</p>';
}
function add(i){
 const x=items()[i],o=opts(x),s=$('#u'+i),z=o[s?+s.value:0];if(!z||!z.ok)return;
 const k=x.id+'|'+z.id,kg=x.unit=='k'&&!z.id,c=cart[k]||(cart[k]={id:x.id,u:z.id,n:x.name+(z.id?' - '+z.name:''),p:z.price,q:0,kg});
 c.p=z.price;c.q=Math.round((c.q+(kg?0.5:1))*100)/100;sv();bar();
}
function chg(k,d){const c=cart[k];if(!c)return;c.q=Math.round((c.q+d*(c.kg?0.25:1))*100)/100;if(c.q<=0)delete cart[k];sv();bar();if(open)cartView()}
function bar(){const b=$('#b');if(b)b.innerHTML=cnt()?`<button onclick="cartView()">🛒 السلة (${cnt()}) · ${m(tot())} ج</button>`:''}
function cartView(){
 open=1;let o=$('#ov');if(!o){o=document.createElement('div');o.id='ov';o.className='ov';document.body.appendChild(o)}
 if(!payOpts().some(z=>z[0]==pay))pay='cod';
 const sf=shipFee();
 o.innerHTML=`<h1>سلتك</h1>${Object.entries(cart).map(([k,c])=>`<div class="p"><div class="pr"><b>${esc(c.n)}</b><span>${m(c.q*c.p)} ج</span></div><div class="pr"><span class="mu">${m(c.p)} ج${c.kg?' / كيلو':''}</span><span class="q"><button class="sec" onclick="chg('${k}',-1)">−</button><span>${c.q}${c.kg?' كجم':''}</span><button class="sec" onclick="chg('${k}',1)">+</button></span></div></div>`).join('')||'<p class="mu">السلة فاضية</p>'}
 <div class="pr"><span>المنتجات</span><span>${m(tot())} ج</span></div>${D.cfg.ship&&+D.cfg.ship>0?`<div class="pr"><span>التوصيل</span><span>${sf?m(sf)+' ج':'مجاني'}</span></div>`:''}<div class="pr"><b>الإجمالي</b><b>${m(tot()+sf)} ج</b></div>
 <input id="cn" placeholder="اسمك" value="${esc(PF?PF.n:(localStorage.cn||''))}"><input id="cph" type="tel" inputmode="numeric" placeholder="رقم موبايلك" value="${esc(PF?PF.p:(localStorage.cph||''))}"><input id="ca" placeholder="العنوان بالتفصيل" value="${esc(localStorage.ca||'')}"><input id="cm" placeholder="ملاحظات (اختياري)">
 <b>طريقة الدفع</b>${payOpts().map(([k,v])=>`<label class="rd"><input type="radio" name="pay" value="${k}" ${pay==k?'checked':''} onchange="pay='${k}'"> ${v}</label>`).join('')}
 <div style="color:#b91c1c;font-size:14px">${esc(msg)}</div>
 <button id="sb" onclick="send()">✅ تأكيد الطلب</button><button class="sec" onclick="closeCart()">رجوع للمتجر</button>`;
                                                                        }
