const byNo=(a,b)=>((a.no||1e12)-(b.no||1e12))||String(a.name||'').localeCompare(String(b.name||''));
const _ir=iRows;
iRows=function(own){S.items.sort(byNo);return _ir(own)};
function quickSup(){
 const name=(prompt('اسم المورد الجديد')||'').trim();if(!name)return;
 const v={id:crypto.randomUUID(),name,phone:null,note:null};
 S.sup=SUPL().concat([v]);S.sq=(S.sq||[]).concat([{k:'sup',v}]);sv();
 const s=$('#sp');if(s){const o=document.createElement('option');o.value=v.id;o.textContent=name;s.appendChild(o);s.value=v.id}
 sync();
}
const _vi2=vItems;
vItems=function(){
 const h=_vi2();
 return O()?h.replace(/(<select id="sp">[\s\S]*?<\/select>)/,'<div class="r">$1<button class="sec" style="flex:0 0 auto;width:auto" onclick="quickSup()">＋ مورد</button></div>'):h;
};
render();
