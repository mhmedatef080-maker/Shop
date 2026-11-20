/* نسخة احتياطية كاملة + تذكير أسبوعي */
(function(){
const T=['p_items','p_costs','p_units','p_customers','p_invoices','p_cogs','p_expenses','p_suppliers','p_purchases','p_cust_tx','p_orders','p_settings'];
async function all(n){let o=[],i=0;for(;;){const r=await sb.from(n).select('*').range(i,i+999);if(r.error)throw r.error;o=o.concat(r.data);if(r.data.length<1000)break;i+=1000}return o}
window.backup=async function(){
 if(!navigator.onLine){alert('مفيش نت');return}
 const out={at:new Date().toISOString()},bad=[];
 for(const n of T){try{out[n]=await all(n)}catch(e){bad.push(n)}}
 if(bad.length>3){alert('فشل التحميل. اتأكد من النت');return}
 out.S=S;
 const a=document.createElement('a');
 a.href=URL.createObjectURL(new Blob([JSON.stringify(out)],{type:'application/json'}));
 a.download='backup-'+new Date().toISOString().slice(0,10)+'.json';
 document.body.appendChild(a);a.click();a.remove();
 try{localStorage.bkAt=Date.now()}catch(e){}
 alert(bad.length?'تم التحميل. جداول ما اتحملتش: '+bad.join(' , '):'تم تحميل النسخة ✓');render();
};
const R0=render;
render=function(){
 R0();
 if(!O()||!$('#a')||$('#bkn'))return;
 const t=+localStorage.bkAt||0;
 if(Date.now()-t<6048e5)return;
 const d=document.createElement('div');d.id='bkn';d.className='c';
 d.innerHTML='<b>⚠️ لازم نسخة احتياطية</b><p class="mu">'+(t?'آخر نسخة من '+Math.floor((Date.now()-t)/864e5)+' يوم':'ما عملتش نسخة قبل كده')+'</p><button onclick="backup()">حمّل النسخة دلوقتي</button>';
 $('#a').insertBefore(d,$('#a').children[1]||null);
};
render();
})();
