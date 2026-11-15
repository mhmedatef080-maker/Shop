const sb=supabase.createClient("https://gbdojrwoqimohxbymifw.supabase.co","sb_publishable_wbRliSrTZ-G6fZcL7hjEGA_AOg-38LA");
const $=s=>document.querySelector(s),esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])),m=n=>(Math.round(n*100)/100).toLocaleString('ar-EG');
let D=null,cat='',q='',open=0,msg='',done=null,pay='cod',cart={},CT=[],WAU='',PF=null;
try{cart=JSON.parse(localStorage.sc2||'{}')}catch(e){}
try{PF=JSON.parse(localStorage.pf||'null')}catch(e){}
const sv=()=>{try{localStorage.sc2=JSON.stringify(cart)}catch(e){}};
const normPh=t=>{let d=String(t||'').replace(/\D/g,'');if(d.startsWith('0020'))d='0'+d.slice(4);else if(d.startsWith('20')&&d.length==12)d='0'+d.slice(2);return d};
const okPh=p=>/^01[0125]\d{8}$/.test(p);
function cp(t){navigator.clipboard.writeText(t).then(()=>alert('اتنسخ'),()=>prompt('انسخ الرقم',t))}
function gate(){
 let g=$('#gt');if(!g){g=document.createElement('div');g.id='gt';g.className='gt';document.body.appendChild(g)}
 g.innerHTML=`<div><h1>${esc(D&&D.cfg.name||'أهلاً بيك')}</h1><p class="mu" style="text-align:center">سجّل اسمك ورقم موبايلك مرة واحدة وكمّل تسوق</p><input id="gn" placeholder="اسمك" value="${esc(PF?PF.n:'')}"><input id="gp" type="tel" inputmode="numeric" placeholder="رقم موبايلك (مثال 01001234567)" value="${esc(PF?PF.p:'')}"><div id="ge" style="color:#b91c1c;font-size:14px;min-height:20px"></div><button id="gb" onclick="reg()">ابدأ التسوق</button></div>`;
}
async function reg(){
 const n=$('#gn').value.trim(),p=normPh($('#gp').value);
 if(n.length<2){$('#ge').textContent='اكتب اسمك';return}
 if(!okPh(p)){$('#ge').textContent='اكتب رقم موبايل صحيح (11 رقم يبدأ بـ 01)';return}
 const b=$('#gb');b.disabled=true;b.textContent='لحظة…';
 try{await sb.rpc('p_register_customer',{p_name:n,p_phone:p})}catch(e){}
 PF={n,p};try{localStorage.pf=JSON.stringify(PF);localStorage.cn=n;localStorage.cph=p}catch(e){}
 const g=$('#gt');if(g)g.remove();if(D)render();
}
async function load(){
 const r=await sb.rpc('p_catalog');
 if(r.error||!r.data){$('#a').innerHTML='<p style="text-align:center;color:#b91c1c">تعذر تحميل المتجر، جرّب تاني بعد شوية</p>';return}
 D=r.data;if(!D.cfg)D.cfg={};document.title=D.cfg.name||'المتجر';render();
}
const items=()=>{let L=D.items||[];if(D.cfg.hideout=='1')L=L.filter(x=>x.ok||(x.units||[]).some(u=>u.ok));return L};
const opts=x=>[{id:'',name:x.unit=='k'?'كيلو':'قطعة',price:x.price,ok:x.ok}].concat((x.units||[]).map(u=>({id:u.id,name:u.name,price:u.price,ok:u.ok})));
const tot=()=>Object.values(cart).reduce((s,c)=>s+c.q*c.p,0),cnt=()=>Object.keys(cart).length;
const shipFee=()=>{const s=+(D.cfg.ship||0),f=+(D.cfg.free||0);return f>0&&tot()>=f?0:s};
const payOpts=()=>{const P=(D.cfg.pays||'').split(','),o=[['cod','الدفع عند الاستلام']];if(P.includes('vf')&&D.cfg.vf)o.push(['vf','فودافون كاش']);if(P.includes('ip')&&D.cfg.ip)o.push(['ip','إنستاباي']);return o};
