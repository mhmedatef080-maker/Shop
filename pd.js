/* المدفوع والباقي للعميل النقدي */
(function(){
window.PDV='';
const tot=()=>Math.round(cart.reduce((s,x)=>s+x.q*x.p,0)*100)/100;
const txt=()=>{const p=+PDV;if(!(p>0))return '';const r=Math.round((p-tot())*100)/100;return r>=0?'الباقي للعميل: <b>'+m(r)+' ج</b>':'ناقص: <b class="e">'+m(-r)+' ج</b>'};
window.pdIn=v=>{PDV=v.value;const e=$('#pdt');if(e)e.innerHTML=txt()};
const R0=render;
render=function(){
 R0();
 if(ty!='sell'||cust||!$('#a')||$('#pdb'))return;
 const s=[...document.querySelectorAll('#a select')].find(x=>x.options[0]&&x.options[0].value===''&&x.options[0].textContent.trim()=='عميل نقدي');
 if(!s)return;
 if(!s.dataset.pd){s.dataset.pd=1;s.addEventListener('change',()=>{PDV=''})}
 const d=document.createElement('div');d.id='pdb';
 d.innerHTML='<input type="number" step="any" inputmode="decimal" placeholder="المدفوع من العميل (اختياري)" value="'+esc(PDV)+'" oninput="pdIn(this)"><div id="pdt" class="mu">'+txt()+'</div>';
 (s.parentNode.querySelector('#pms')||s).after(d);
};
const D0=done;
done=function(){const p=D0();PDV='';return p};
render();
})();
