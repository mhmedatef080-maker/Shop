/* حسابات الموردين: كام علينا ليهم */
(function(){
let SDP='',OP='',F={s:'',a:'',n:''},MS='';
const L=()=>S.stx||[];
const bal=id=>L().filter(t=>t.sup==id).reduce((s,t)=>s+(t.kind=='buy'?1:-1)*(+t.amount||0),0);
const add=(sup,kind,amount,note)=>{
 const t={id:crypto.randomUUID(),sup,kind,amount:Math.round(amount*100)/100,note:note||null,by_name:localStorage.pn||'',created_at:new Date().toISOString()};
 S.stx=[t].concat(L());S.sxq=(S.sxq||[]).concat([t]);
};
const V0=vBuy;
vBuy=function(){
 let h=V0();
 if(!PB.sup)return h;
 const tot=PB.lines.reduce((s,l)=>s+l.q*l.p,0);
 return h.replace('<button onclick="bSave()">','<input type="number" inputmode="decimal" placeholder="المدفوع للمورد دلوقتي (فاضي = دفعت الكل)" value="'+esc(SDP)+'" oninput="SDP2(this.value)"><div class="mu" id="sdr">الباقي على المورد: '+m(Math.max(tot-(SDP===''?tot:+SDP||0),0))+' ج</div><button onclick="bSave()">');
};
window.SDP2=v=>{SDP=v;const t=PB.lines.reduce((s,l)=>s+l.q*l.p,0),e=$('#sdr');if(e)e.textContent='الباقي على المورد: '+m(Math.max(t-(v===''?t:+v||0),0))+' ج'};
const B0=bSave;
window.bSave=function(){
 const sup=PB.sup,tot=Math.round(PB.lines.reduce((s,l)=>s+l.q*l.p,0)*100)/100,pd=SDP===''?tot:Math.min(Math.max(+SDP||0,0),tot);
 B0();
 if(!sup||PB.lines.length||!(tot>0))return;
 add(sup,'buy',tot,'فاتورة مشتريات');
 if(pd>0)add(sup,'pay',pd,'مدفوع وقت الشراء');
 SDP='';sv();render();sync();
};
window.sdAdd=kind=>{
 const s=$('#sds').value,a=+$('#sda').value,n=$('#sdn').value.trim();
 F={s,a:$('#sda').value,n};
 if(!s||!(a>0)){MS='اختار المورد واكتب مبلغ';render();return}
 add(s,kind,a,n||(kind=='pay'?'سداد':'رصيد سابق'));
 MS='اتسجل ✓';F={s,a:'',n:''};sv();render();sync();
};
window.sdOpen=id=>{OP=OP==id?'':id;render()};
function card(){
 const S0=SUPL(),tot=S0.reduce((s,x)=>s+Math.max(bal(x.id),0),0);
 const rows=S0.map(x=>{const b=bal(x.id);
  return '<div class="it" style="flex-wrap:wrap" onclick="sdOpen(\''+x.id+'\')"><span>'+esc(x.name)+'</span><b class="'+(b>0.004?'e':'')+'">'+(b>0.004?'علينا '+m(b)+' ج':b<-0.004?'ليا '+m(-b)+' ج':'متصفّي')+'</b>'+
  (OP==x.id?'<div style="flex:1 1 100%">'+(L().filter(t=>t.sup==x.id).slice(0,15).map(t=>'<div class="mu">'+new Date(t.created_at).toLocaleDateString('ar-EG')+' · '+(t.kind=='buy'?'شراء +':'سداد −')+m(t.amount)+' ج'+(t.note?' · '+esc(t.note):'')+'</div>').join('')||'<div class="mu">مفيش حركات</div>')+'</div>':'')+'</div>'}).join('')||'<p class="mu">ضيف موردين الأول</p>';
 return '<div class="c"><b>حسابات الموردين</b><div class="it"><span>إجمالي اللي علينا</span><b class="e">'+m(tot)+' ج</b></div>'+rows+'</div>'+
 '<div class="c"><b>تسجيل حركة</b><select id="sds"><option value="">المورد</option>'+S0.map(x=>'<option value="'+x.id+'" '+(F.s==x.id?'selected':'')+'>'+esc(x.name)+'</option>').join('')+'</select><input id="sda" type="number" inputmode="decimal" placeholder="المبلغ" value="'+esc(F.a)+'"><input id="sdn" placeholder="ملاحظة (اختياري)" value="'+esc(F.n)+'"><div class="r"><button onclick="sdAdd(\'pay\')">سدّدت له</button><button class="sec" onclick="sdAdd(\'buy\')">عليا له (رصيد سابق)</button></div><div class="e">'+esc(MS)+'</div></div>';
}
const C0=vCust;
vCust=function(){const h=C0();return O()&&SUPT=='sup'?h+card():h};
async function push(){
 if(!O()||!auth)return;S.sxq=S.sxq||[];
 try{while(S.sxq.length){
  const r=await sb.from('p_sup_tx').upsert(S.sxq[0]);
  if(r.error){if(r.status===0||/fetch|network|does not exist|schema cache/i.test(r.error.message||''))throw 0;S.bad++;S.sxq.shift();sv();continue}
  S.sxq.shift();sv()}}catch(e){}
}
async function pull(){
 if(!O()||!auth||(S.sxq&&S.sxq.length))return;
 try{const r=await sb.from('p_sup_tx').select('*').order('created_at',{ascending:false}).limit(3000);if(!r.error){S.stx=r.data.map(t=>Object.assign({},t,{amount:+t.amount}));sv()}}catch(e){}
}
const Y0=sync;
sync=async function(){await push();await Y0();await pull()};
render();
})();
