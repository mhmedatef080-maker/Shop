/* المالك: خصم على الطلب + باقات المتجر */
(function(){
let CL=[],MS='',F={n:'',p:'',r:[{},{},{}]};
async function load(){
 if(!navigator.onLine||!auth)return;
 try{const r=await sb.from('p_combos').select('*').eq('active',true).order('created_at');if(!r.error){CL=r.data||[];const e=$('#dcl');if(e)e.innerHTML=lst()}}catch(e){}
}
const nm=id=>{const x=S.items.find(i=>i.id==id);return x?x.name:'؟'};
const lst=()=>CL.map(b=>'<div class="it" style="flex-wrap:wrap"><span><b>'+esc(b.name)+'</b><br><span class="mu">'+(b.comps||[]).map(p=>p.q+' × '+esc(nm(p.id))).join(' + ')+'</span></span><span>'+m(b.price)+' ج <button class="del" onclick="dcDel(\''+b.id+'\')">✕</button></span></div>').join('')||'<p class="mu">مفيش باقات</p>';
const opt=()=>'<option value="">— صنف —</option>'+S.items.slice().sort((a,b)=>a.name.localeCompare(b.name)).map(x=>'<option value="'+x.id+'">'+esc(x.name)+'</option>').join('');
function card(){
 const c=S.cfg||{};
 return '<div class="c" id="dcc"><b>خصم على الطلب (المتجر)</b><div class="r"><input id="dmn" type="number" inputmode="decimal" placeholder="لو الطلب فوق (ج)" value="'+esc(c.dmin||'')+'"><input id="dpc" type="number" inputmode="decimal" placeholder="نسبة الخصم %" value="'+esc(c.dpct||'')+'"></div><button onclick="dcSave()">حفظ الخصم</button>'+
 '<b style="display:block;margin-top:10px">باقات المتجر</b><div id="dcl">'+lst()+'</div><input id="dbn" placeholder="اسم الباقة" value="'+esc(F.n)+'"><input id="dbp" type="number" inputmode="decimal" placeholder="سعر الباقة" value="'+esc(F.p)+'">'+
 [0,1,2].map(i=>'<div class="r"><select id="dbs'+i+'">'+opt()+'</select><input id="dbq'+i+'" type="number" inputmode="decimal" placeholder="الكمية"></div>').join('')+
 '<button onclick="dcAdd()">إضافة باقة</button><p class="e">'+esc(MS)+'</p></div>';
}
window.dcSave=async()=>{
 const rows=[{key:'dmin',val:$('#dmn').value||'0'},{key:'dpct',val:$('#dpc').value||'0'}];
 const r=await sb.from('p_settings').upsert(rows);
 if(r.error)MS='ما اتحفظش: '+r.error.message;else{MS='اتحفظ ✓';S.cfg=Object.assign({},S.cfg||{});rows.forEach(z=>S.cfg[z.key]=z.val);sv()}
 render();
};
window.dcAdd=async()=>{
 const comps=[0,1,2].map(i=>({id:$('#dbs'+i).value,q:+$('#dbq'+i).value})).filter(p=>p.id&&p.q>0),n=$('#dbn').value.trim(),pr=+$('#dbp').value;
 F.n=n;F.p=$('#dbp').value;
 if(!n||!(pr>0)||comps.length<2){MS='اكتب الاسم والسعر وصنفين على الأقل';render();return}
 const r=await sb.from('p_combos').insert({name:n,price:pr,comps});
 if(r.error){MS='ما اتحفظش: '+r.error.message}else{MS='اتضافت ✓';F={n:'',p:'',r:[]}}
 render();
};
window.dcDel=async id=>{if(!confirm('مسح الباقة؟'))return;await sb.from('p_combos').delete().eq('id',id);load()};
const V0=vSet;
vSet=function(){setTimeout(load,50);return V0()+(O()?card():'')};
})();
