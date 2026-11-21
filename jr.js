/* جرد المخزن */
(function(){
let J={},Q='',C='';
const cats=()=>[...new Set(S.items.map(x=>x.cat).filter(Boolean))];
const rows=()=>S.items.filter(x=>(!C||x.cat==C)&&(!Q||((x.name||'')+' '+(x.barcode||'')).toLowerCase().includes(Q.toLowerCase())));
const df=x=>{const v=J[x.id];return v===undefined||v===''?null:qr(+v-x.qty)};
const dt=x=>{const d=df(x);return d===null?'':d==0?'✓ مطابق':(d>0?'زيادة +':'نقص ')+qr(Math.abs(d))+ku(x)};
const cn=()=>S.items.filter(x=>df(x)!==null);
function sm(){let lo=0,hi=0,n=0;cn().forEach(x=>{const d=df(x);if(d<0)lo-=d*(+x.buy||0);else hi+=d*(+x.buy||0);if(d)n++});return{lo,hi,n}}
function lst(){return rows().map(x=>'<div class="it" style="flex-wrap:wrap"><span>'+esc(x.name)+'<br><span class="mu">في السيستم: '+stk(x)+'</span></span><span style="text-align:center"><input type="number" step="any" inputmode="decimal" style="width:90px" data-i="'+x.id+'" value="'+(J[x.id]===undefined?'':esc(J[x.id]))+'" oninput="jrIn(this)"><br><span class="mu" id="jd'+x.id+'">'+dt(x)+'</span></span></div>').join('')||'<p class="mu">مفيش أصناف</p>'}
function ft(){const s=sm(),e=$('#jrf');if(e)e.innerHTML='اتعدّ '+cn().length+' صنف · فروق '+s.n+' · نقص '+m(s.lo)+' ج · زيادة '+m(s.hi)+' ج'}
function ui(){
 let o=$('#jro');if(!o){o=document.createElement('div');o.id='jro';o.style.cssText='position:fixed;inset:0;background:#fff;overflow:auto;z-index:99;padding:10px 12px 90px';document.body.appendChild(o)}
 o.innerHTML='<div class="r"><b style="flex:1">جرد المخزن</b><button class="sec" style="width:auto" onclick="jrClose()">إغلاق</button></div><input id="jrq" placeholder="ابحث بالاسم أو الباركود" value="'+esc(Q)+'" oninput="jrQ(this.value)"><select id="jrc" onchange="jrC(this.value)"><option value="">كل الأقسام</option>'+cats().map(c=>'<option '+(c==C?'selected':'')+' value="'+esc(c)+'">'+esc(c)+'</option>').join('')+'</select><p class="mu">اكتب العدد الفعلي اللي عديته قدام كل صنف. اللي تسيبه فاضي مش هيتغيّر.</p><div id="jrl">'+lst()+'</div><div style="position:fixed;bottom:0;left:0;right:0;background:#fff;padding:10px 12px;border-top:1px solid #ddd"><div class="mu" id="jrf"></div><button onclick="jrOk()">اعتماد الجرد</button></div>';
 ft();
}
window.jrOpen=()=>{J={};Q='';C='';ui()};
window.jrClose=()=>{const o=$('#jro');if(o)o.remove()};
window.jrIn=e=>{J[e.dataset.i]=e.value;const x=S.items.find(i=>i.id==e.dataset.i),d=$('#jd'+e.dataset.i);if(d&&x)d.textContent=dt(x);ft()};
window.jrQ=v=>{Q=v;const l=$('#jrl');if(l)l.innerHTML=lst()};
window.jrC=v=>{C=v;const l=$('#jrl');if(l)l.innerHTML=lst()};
window.jrOk=()=>{
 const all=cn(),L=all.filter(x=>df(x)!=0),s=sm();
 if(!all.length){alert('ما كتبتش أي عدد');return}
 if(!confirm('اعتماد الجرد؟\nأصناف اتعدّت: '+all.length+'\nأصناف فيها فرق: '+L.length+'\nقيمة النقص: '+m(s.lo)+' ج\nقيمة الزيادة: '+m(s.hi)+' ج'))return;
 const rec=[];
 L.forEach(x=>{const d=df(x);S.q.push({k:'adj',id:x.id,d});rec.push({n:x.name,w:x.qty,a:+J[x.id],b:+x.buy||0});x.qty=qr(+J[x.id])});
 S.cnt=[{t:Date.now(),n:all.length,lo:s.lo,hi:s.hi,r:rec}].concat(S.cnt||[]).slice(0,15);
 sv();jrClose();J={};render();
 if(navigator.onLine&&typeof sync=='function')sync();
};
const card=()=>{
 const H=(S.cnt||[]).slice(0,5).map(c=>'<details style="margin:6px 0"><summary>'+new Date(c.t).toLocaleDateString('ar-EG')+' · '+c.n+' صنف · نقص '+m(c.lo)+' ج · زيادة '+m(c.hi)+' ج</summary>'+(c.r.map(z=>'<div class="mu">'+esc(z.n)+': '+qr(z.w)+' ← '+qr(z.a)+'</div>').join('')||'<div class="mu">مفيش فروق</div>')+'</details>').join('');
 return '<div class="c"><b>جرد المخزن</b><p class="mu">عدّ البضاعة الفعلية وقارنها بالسيستم وعدّل الفروق.</p><button onclick="jrOpen()">ابدأ جرد</button>'+(H?'<b style="display:block;margin-top:10px">آخر الجرد</b>'+H:'')+'</div>';
};
const V0=vSet;
vSet=function(){return V0()+(O()?card():'')};
})();
