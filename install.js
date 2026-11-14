let IP=null;
addEventListener('beforeinstallprompt',e=>{e.preventDefault();IP=e;try{render()}catch(x){}});
addEventListener('appinstalled',()=>{IP=null;try{render()}catch(x){}});
const isApp=()=>matchMedia('(display-mode: standalone)').matches||navigator.standalone;
async function doInstall(){
 if(!IP){alert('افتح قائمة المتصفح ⋮ واختار «تثبيت التطبيق»');return}
 IP.prompt();await IP.userChoice;IP=null;render();
}
const _vs4=vSet;
vSet=function(){
 const box=`<div class="c"><b>تثبيت التطبيق</b>${isApp()?'<p class="ok">✓ التطبيق متثبت وشغال كتطبيق</p>':'<p class="mu">يتثبت على الموبايل بأيقونة ويفتح كامل الشاشة.</p><button onclick="doInstall()">📲 تثبيت التطبيق</button>'}</div>`;
 return box+_vs4();
};
render();
