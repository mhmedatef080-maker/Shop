(function(){
 var l=document.createElement('link');l.rel='manifest';l.href='store.webmanifest';document.head.appendChild(l);
 if('serviceWorker' in navigator)navigator.serviceWorker.register('store-sw.js',{scope:'/Shop/store.html'}).catch(function(){});
 var dp=null,st=document.createElement('div');
 st.style.cssText='position:fixed;top:0;left:0;right:0;z-index:10;background:#0f766e;color:#fff;padding:10px;text-align:center;font-size:15px;display:none';
 document.body.appendChild(st);
 function hide(){st.style.display='none'}
 var standalone=matchMedia('(display-mode: standalone)').matches||navigator.standalone;
 if(standalone)return;
 addEventListener('beforeinstallprompt',function(e){
  e.preventDefault();dp=e;
  st.innerHTML='ثبّت المتجر على موبايلك <button id="ib" style="width:auto;margin:0 8px;padding:6px 14px;background:#fff;color:#0f766e;border-radius:8px">تثبيت</button><span id="ix" style="padding:6px">✕</span>';
  st.style.display='block';
  document.getElementById('ib').onclick=function(){dp.prompt();hide()};
  document.getElementById('ix').onclick=hide;
 });
 if(/iphone|ipad/i.test(navigator.userAgent)){
  st.innerHTML='للتثبيت: اضغط مشاركة ثم "إضافة إلى الشاشة الرئيسية" <span id="ix" style="padding:6px">✕</span>';
  st.style.display='block';document.getElementById('ix').onclick=hide;
 }
})();
