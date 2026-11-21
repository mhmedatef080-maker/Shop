/* المتجر: باقات + خصم على إجمالي الطلب */
(function(){
let CB=[],DC={min:0,pct:0},L0=0;
function est(){
 const ls=Object.values(cart).map(c=>{const x=(D.items||[]).find(i=>i.id==c.id);return{id:c.id,b:!c.u,q:c.q,r:x?+x.price:c.p,c:c.q*c.p,u:0}});
 let cd=0;
 CB.forEach(b=>{
  let n=null,reg=0;
  b.comps.forEach(p=>{const a=ls.filter(l=>l.id==p.id&&l.b).reduce((s,l)=>s+l.q-l.u,0),k=Math.floor(a/p.q+1e-9);n=n==null?k:Math.min(n,k)});
  if(!n||n<1)return;
  b.comps.forEach(p=>{const l=ls.find(l=>l.id==p.id&&l.b);reg+=p.q*n*l.r});
  const d=reg-n*b.price;if(d<=0||reg<=0)return;
  b.comps.forEach(p=>{const l=ls.find(l=>l.id==p.id&&l.b);l.c=Math.max(0,l.c-d*(p.q*n*l.r/reg));l.u+=p.q*n});
  cd+=d;
 });
 let sub=ls.reduce((s,l)=>s+l.c,0),od=0;
 if(DC.min>0&&DC.pct>0&&sub>=DC.min){od=sub*DC.pct/100;sub-=od}
 const s0=+(D.cfg.ship||0),f=+(D.cfg.free||0);
 return{cd,od,sub,ship:f>0&&sub>=f?0:s0};
}
const b0=bar;
bar=function(){
 b0();const b=$('#b');
 if(b&&cnt()){const e=est();b.innerHTML='<button onclick="cartView()">🛒 السلة ('+cnt()+') · '+m(e.sub)+' ج</button>'}
};
const c0=cartView;
cartView=function(){
 c0();
 const e=est(),rows=[...document.querySelectorAll('#ov .pr')],t=k=>rows.find(r=>r.firstElementChild&&r.firstElementChild.textContent==k);
 const a=t('المنتجات'),mk=(l,v)=>{const d=document.createElement('div');d.className='pr';d.style.color='#b91c1c';d.innerHTML='<span>'+l+'</span><span>− '+m(v)+' ج</span>';return d};
 if(a){let p=a;if(e.cd>0.004){const d=mk('خصم الباقات',e.cd);p.after(d);p=d}if(e.od>0.004){const d=mk('خصم الطلب ('+DC.pct+'%)',e.od);p.after(d)}}
 const sh=t('التوصيل');if(sh)sh.lastElementChild.textContent=e.ship?m(e.ship)+' ج':'مجاني';
 const tt=t('الإجمالي');if(tt)tt.lastElementChild.textContent=m(e.sub+e.ship)+' ج';
};
window.addCombo=i=>{
 const b=CB[i];if(!b)return;
 const G=z=>(D.items||[]).find(x=>x.id==z.id);
 for(const p of b.comps){const x=G(p);if(!x||!x.ok){alert('الباقة فيها صنف غير متاح حالياً: '+(x?x.name:p.n));return}}
 b.comps.forEach(p=>{const x=G(p),k=x.id+'|',c=cart[k]||(cart[k]={id:x.id,u:'',n:x.name,p:x.price,q:0,kg:x.unit=='k'});c.q=Math.round((c.q+p.q)*1000)/1000;chg(k,0)});
 sv();bar();
};
const l0=list;
list=function(){
 l0();
 const l=$('#l');if(!l||cat||q.trim()||!CB.length||l.querySelector('.cbx'))return;
 const d=document.createElement('div');d.className='cbx';
 d.innerHTML='<div style="font-weight:700;margin:10px 2px 0;color:#b91c1c">🎁 باقات</div>'+CB.map((b,i)=>{const reg=b.comps.reduce((s,p)=>s+p.q*p.p,0);return '<div class="p"><div class="pr"><b>'+esc(b.name)+'</b><span>'+m(b.price)+' ج'+(reg>b.price?' <s style="color:#888">'+m(reg)+'</s>':'')+'</span></div><div class="mu">'+b.comps.map(p=>p.q+' × '+esc(p.n)).join(' + ')+'</div><button onclick="addCombo('+i+')">أضف الباقة +</button></div>'}).join('');
 l.prepend(d);
};
const r0=render;
render=function(){
 r0();
 if(!L0){L0=1;
  sb.rpc('p_combos_list').then(r=>{if(r&&r.data&&r.data.length){CB=r.data.map(b=>({id:b.id,name:b.name,price:+b.price,comps:(b.comps||[]).map(p=>({id:p.id,q:+p.q,n:p.n,p:+p.p}))}));list()}},()=>{});
  sb.rpc('p_disc').then(r=>{if(r&&r.data){DC={min:+r.data.min||0,pct:+r.data.pct||0};if(DC.pct>0&&DC.min>0){const h=$('#a h1');if(h&&!$('#dcn')){const d=document.createElement('div');d.id='dcn';d.className='nt';d.textContent='🎉 خصم '+DC.pct+'% على طلبك لو فوق '+DC.min+' ج';h.after(d)}}bar()}},()=>{});
 }
};
})();
