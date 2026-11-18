/* صور الأصناف */
(function(){
const BASE='https://gbdojrwoqimohxbymifw.supabase.co/storage/v1/object/public/img/';
const shrink=f=>new Promise((ok,no)=>{const im=new Image(),u=URL.createObjectURL(f);
 im.onload=()=>{const k=Math.min(1,700/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.round(im.width*k);c.height=Math.round(im.height*k);
  const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(im,0,0,c.width,c.height);
  c.toBlob(b=>{URL.revokeObjectURL(u);b?ok(b):no()},'image/jpeg',.78)};
 im.onerror=no;im.src=u});
const say=t=>{const e=$('#imm');if(e)e.textContent=t};
window.imUp=async inp=>{
 const f=inp.files&&inp.files[0],it=S.items.find(i=>i.id==edit);if(!f||!it)return;
 try{
  say('جاري التصغير…');const b=await shrink(f);
  if(S.q.length)await sync();
  say('جاري الرفع…');
  const r=await sb.storage.from('img').upload(it.id+'.jpg',b,{upsert:true,contentType:'image/jpeg',cacheControl:'3600'});
  if(r.error)throw r.error;
  const v=Date.now(),u=await sb.from('p_items').update({img_v:v}).eq('id',it.id);
  if(u.error)throw u.error;
  it.img_v=v;sv();render();say('تم رفع الصورة ✓ ('+Math.round(b.size/1024)+' ك)');
 }catch(e){say('فشل: '+((e&&e.message)||'تأكد من النت'))}
};
window.imDel=async()=>{
 const it=S.items.find(i=>i.id==edit);if(!it)return;
 try{await sb.storage.from('img').remove([it.id+'.jpg']);const u=await sb.from('p_items').update({img_v:null}).eq('id',it.id);if(u.error)throw u.error;it.img_v=null;sv();render();say('اتحذفت الصورة')}
 catch(e){say('فشل: '+((e&&e.message)||''))}
};
function ui(){
 if(!$('#n')||$('#imw'))return;
 const it=edit&&S.items.find(i=>i.id==edit),d=document.createElement('div');d.id='imw';
 d.innerHTML=it?(it.img_v?'<img src="'+BASE+it.id+'.jpg?v='+it.img_v+'" style="max-width:100%;max-height:160px;border-radius:10px;display:block;margin:6px 0">':'')+'<input id="imf" type="file" accept="image/*" onchange="imUp(this)">'+(it.img_v?'<button class="sec" onclick="imDel()">حذف الصورة</button>':'')+'<div id="imm" class="mu"></div>':'<p class="mu">احفظ الصنف الأول وبعدين افتحه وضيف صورته</p>';
 (($('#ct')||{}).parentElement||$('#n')).after(d);
}
const R0=render;
render=function(){R0();ui()};
render();
})();
