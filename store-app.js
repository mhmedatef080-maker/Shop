(function(){
 try{
  var l=document.createElement('link');l.rel='manifest';l.href='store.webmanifest';document.head.appendChild(l);
  if('serviceWorker' in navigator){
   var sc=new URL('store.html',location.href).pathname;
   navigator.serviceWorker.register('store-sw.js',{scope:sc}).catch(function(){});
  }
 }catch(e){}
 var standalone=(window.matchMedia&&matchMedia('(display-mode: standalone)').matches)||navigator.standalone;
 if(standalone)return;
 try{if(localStorage.noinst==='1')return}catch(e){}
 var ev=null,ios=/iphone|ipad|ipod/i.test(navigator.userAgent);
 function bar(html){
  var d=document.getElementById('ib');
  if(!d){d=document.createElement('div');d.id='ib';
   d.style.cssText='position:fixed;top:0;left:0;right:0;z-index:10;background:#0f766e;color:#fff;padding:10px 12px;display:flex;align-items:center;gap:10px;font:14px system-ui,Tahoma,Arial,sans-serif';
   document.body.appendChild(d);document.body.style.paddingTop='44px'}
  d.innerHTML=html;
 }
 function hide(){var d=document.getElementById('ib');if(d)d.remove();document.body.style.paddingTop='';try{localStorage.noinst='1'}catch(e){}}
 window.ibHide=hide;
 window.ibGo=function(){
  if(!ev)return;ev.prompt();
  ev.userChoice.then(function(){ev=null;var d=document.getElementById('ib');if(d)d.remove();document.body.style.paddingTop=''});
 };
 window.addEventListener('beforeinstallprompt',function(e){
  e.preventDefault();ev=e;
  bar('<span style="flex:1">📲 ثبّت المتجر على تليفونك</span><button onclick="ibGo()" style="width:auto;margin:0;padding:6px 14px;border:0;border-radius:8px;background:#fff;color:#0f766e;font-weight:700">تثبيت</button><button onclick="ibHide()" style="width:auto;margin:0;padding:6px 10px;border:0;background:transparent;color:#fff;font-size:18px">✕</button>');
 });
 window.addEventListener('appinstalled',function(){var d=document.getElementById('ib');if(d)d.remove();document.body.style.paddingTop=''});
 if(ios){
  window.addEventListener('load',function(){
   bar('<span style="flex:1">📲 لتثبيت المتجر: اضغط <b>مشاركة</b> ثم <b>إضافة إلى الشاشة الرئيسية</b></span><button onclick="ibHide()" style="width:auto;margin:0;padding:6px 10px;border:0;background:transparent;color:#fff;font-size:18px">✕</button>');
  });
 }
})();
