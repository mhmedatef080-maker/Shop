/* التقارير: اختيار يوم محدد */
(function(){
const td=()=>{const t=new Date();return t.getFullYear()+'-'+String(t.getMonth()+1).padStart(2,'0')+'-'+String(t.getDate()).padStart(2,'0')};
PER.day='يوم محدد';R.day=R.day||td();
const g0=rng;
rng=function(){
 if(R.per!='day')return g0();
 const a=new Date((R.day||td())+'T00:00:00'),b=new Date(a);b.setDate(b.getDate()+1);return[a,b];
};
window.dyS=v=>{
 R.day=v||td();
 if(window.PRX)PRX.key='';if(window.OSX)OSX.key='';
 loadRep();
};
const V0=vRep;
vRep=function(){
 const h=V0();
 if(R.per!='day'||h.includes('class="dy"')||!h.includes('</select>'))return h;
 return h.replace('</select>',`</select><input class="dy" type="date" value="${R.day}" max="${td()}" onchange="dyS(this.value)">`);
};
})();
