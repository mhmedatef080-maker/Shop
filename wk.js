/* الموظف: من غير الفواتير والعملاء | كاميرا الباركود في المشتريات */
(function(){
const R0=render;
render=function(){
 if(auth&&!O()&&(tab=='hist'||tab=='cust'))tab='sell';
 R0();
 if(auth&&!O())document.querySelectorAll('nav button').forEach(b=>{if(/go\('(hist|cust)'\)/.test(b.getAttribute('onclick')||''))b.remove()});
 const q=$('#bq');
 if(q&&!$('#bqs')){
  const d=document.createElement('div'),b=document.createElement('button');
  d.className='r';b.id='bqs';b.className='sec';b.style.cssText='flex:0 0 auto;width:auto';b.textContent='📷';
  b.onclick=()=>scan(c=>{$('#bq').value=c;bPick()});
  q.before(d);d.append(q,b);
 }
};
render();
})();
