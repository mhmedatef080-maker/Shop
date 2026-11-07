const C='pos1',L=['pro.html','https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.js'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(L)))});
self.addEventListener('activate',e=>e.waitUntil(clients.claim()));
const T=r=>new Promise((ok,no)=>{const t=setTimeout(no,4000);fetch(r).then(x=>{clearTimeout(t);ok(x)},e=>{clearTimeout(t);no(e)})});
self.addEventListener('fetch',e=>{
 const r=e.request,u=new URL(r.url);
 if(r.method!=='GET'||!(u.origin===location.origin||u.host==='cdn.jsdelivr.net'))return;
 e.respondWith(T(r).then(x=>{const c=x.clone();caches.open(C).then(k=>k.put(r,c));return x}).catch(()=>caches.match(r).then(m=>m||caches.match('pro.html'))));
});
