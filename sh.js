/* قفل الوردية */
(function(){
const me=()=>localStorage.pn||(O()?'المالك':'موظف');
const d0=()=>{const d=new Date();d.setHours(0,0,0,0);return d.toISOString()};
let FR=null,RS='',LS=[];
async function load(){
 if(!navigator.onLine||!auth)return;
 try{
  const a=await sb.rpc('p_shift_last',{p_by:me()});if(!a.error)FR=a.data||d0();
  if(O()){const b=await sb.from('p_shifts').select('*').order('to_at',{ascending:false}).limit(8);if(!b.error)LS=b.data||[]}
  const e=$('#shx');if(e)e.innerHTML=body();
 }catch(e){}
}
const st={ok:'تمام ✓',pending:'⏳ محتاج اعتماد',approved:'اتعتمد ✓'};
function body(){
 let h='<p class="mu">'+esc(me())+' · من '+(FR?new Date(FR).toLocaleString('ar-EG'):'…')+'</p>'+
 '<input id="shf" type="number" step="any" inputmode="decimal" placeholder="العهدة (الفكة اللي بدأت بيها)" value="'+esc(localStorage.fl||'')+'">'+
 '<input id="shc" type="number" step="any" inputmode="decimal" placeholder="اللي عدّيته في الدرج دلوقتي">'+
 '<input id="shn" placeholder="ملاحظة (اختياري)"><button onclick="shClose()">قفل الوردية</button>'+(RS?'<p>'+RS+'</p>':'');
 if(O()&&LS.length)h+='<b>آخر الورديات</b>'+LS.map(s=>'<div class="it" style="flex-wrap:wrap"><span>'+esc(s.by_name)+'<br><span class="mu">'+new Date(s.to_at).toLocaleString('ar-EG')+'</span></span><span>الفرق: <b class="'+(+s.diff?'e':'')+'">'+m(s.diff)+'</b><br>'+(st[s.status]||s.status)+(s.status=='pending'?' <button class="sec" style="width:auto" onclick="shOk(\''+s.id+'\')">اعتماد</button>':'')+'</span></div>').join('');
 return h;
}
window.shClose=async()=>{
 const c=$('#shc').value;if(c===''){alert('اكتب اللي في الدرج');return}
 if(!navigator.onLine){alert('محتاج نت');return}
 if(S.q.length){await sync();if(S.q.length){alert('في فواتير لسه ما اتبعتتش. اتأكد من النت وجرّب تاني');return}}
 const f=+$('#shf').value||0;localStorage.fl=f;
 const r=await sb.rpc('p_shift_close',{p_by:me(),p_from:FR||d0(),p_float:f,p_counted:+c,p_note:$('#shn').value||null});
 if(r.error){alert('فشل: '+r.error.message);return}
 const s=r.data;RS='المتوقع: <b>'+m(s.expected)+'</b> ج · عدّيت: <b>'+m(s.counted)+'</b> ج<br>الفرق: <b class="'+(+s.diff?'e':'')+'">'+m(s.diff)+' ج</b> · '+(st[s.status]||'');
 FR=s.to_at;load();render();
};
window.shOk=async id=>{const r=await sb.rpc('p_shift_ok',{p_id:id});if(r.error){alert(r.error.message);return}load()};
const V0=vSet;
vSet=function(){setTimeout(load,50);return V0()+'<div class="c" id="shx">'+body()+'</div>'};
})();
