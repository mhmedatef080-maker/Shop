let PS=Object.assign({w:58,auto:0,head:'',foot:'شكراً لزيارتكم'},JSON.parse(localStorage.ps||'{}'));
const psv=()=>{localStorage.ps=JSON.stringify(PS)};

function rcCanvas(r){
 const W=PS.w==80?576:384,PD=8,H=3000,c=document.createElement('canvas');c.width=W;c.height=H;
 const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,W,H);x.fillStyle='#000';x.direction='rtl';
 let y=6;
 const font=(sz,b)=>{x.font=(b?'bold ':'')+sz+'px sans-serif'};
 const wrap=(s,mw)=>{const w=String(s).split(' '),o=[];let l='';w.forEach(t=>{const n=l?l+' '+t:t;if(x.measureText(n).width>mw&&l){o.push(l);l=t}else l=n});if(l)o.push(l);return o};
 const T=(s,sz=24,b=0,al='right')=>{font(sz,b);x.textAlign=al;const px=al=='center'?W/2:al=='left'?PD:W-PD;wrap(s,W-2*PD).forEach(l=>{y+=sz+5;x.fillText(l,px,y)})};
 const R=(a,b,sz=24,bd=0)=>{font(sz,bd);y+=sz+5;x.textAlign='right';x.fillText(a,W-PD,y);x.textAlign='left';x.fillText(b,PD,y)};
 const D=()=>{y+=10;for(let i=PD;i<W-PD;i+=10)x.fillRect(i,y,5,2);y+=6};
 const z=S.inv.find(i=>i.uid==r.uid),no=r.no||(z&&z.no),num=no?'#'+no:(r.tmp||'');
 const TT={sell:'فاتورة بيع',rsell:'مرتجع بيع',rbuy:'مرتجع مشتريات'}[r.t]||'فاتورة';
 T(S.shop,34,1,'center');
 if(PS.head)T(PS.head,22,0,'center');
 D();T(TT+' '+num,26,1);T(new Date(r.ts).toLocaleString('ar-EG'),22);
 if(r.cn&&r.cn!='نقدي')T('العميل: '+r.cn,22);
 if(r.by)T('البائع: '+r.by,22);
 D();
 r.lines.forEach(l=>{T(l.n,24,1);R(qr(l.q)+(l.k?' كجم':'')+' × '+m(l.p),m(l.q*l.p),24)});
 D();R('الإجمالي',m(r.tot)+' ج',30,1);D();
 if(PS.foot)T(PS.foot,22,0,'center');
 y+=24;
 return {x,W,h:y};
}
function escpos(r){
 const {x,W,h}=rcCanvas(r),d=x.getImageData(0,0,W,h).data,wb=W/8,out=[0x1B,0x40];
 for(let y0=0;y0<h;y0+=200){
  const hh=Math.min(200,h-y0);
  out.push(0x1D,0x76,0x30,0,wb&255,wb>>8,hh&255,hh>>8);
  for(let yy=y0;yy<y0+hh;yy++)for(let bx=0;bx<wb;bx++){let v=0;for(let b=0;b<8;b++){if(d[(yy*W+bx*8+b)*4]<150)v|=0x80>>b}out.push(v)}
 }
 out.push(0x1B,0x64,4,0x1D,0x56,0x42,0);
 return new Uint8Array(out);
}
function b64(u){let s='';for(let i=0;i<u.length;i+=8192)s+=String.fromCharCode.apply(null,u.subarray(i,i+8192));return btoa(s)}
function printInv(r){location.href='intent:base64,'+b64(escpos(r))+'#Intent;scheme=RawBT;package=ru.a402d.RawBTprinter;end;'}
function testPrint(){printInv({t:'sell',tmp:'م0',cn:'نقدي',by:localStorage.pn||'',ts:new Date().toISOString(),lines:[{n:'صنف تجريبي',q:2,p:25},{n:'مسحوق سايب',q:0.5,p:60,k:1}],tot:80})}
function rp(i){
 const r=(S.rp||[])[i];if(!r)return;
 const z=S.inv.find(x=>x.uid==r.uid);if(z&&z.no)r.no=z.no;
 printInv(r);
}
const sleep=t=>new Promise(r=>setTimeout(r,t));
const _dn=done;
done=async function(){
 if(!cart.length)return;
 const c=S.custs.find(x=>x.id==cust);
 const snap={t:ty,cn:ty=='rbuy'?'مورد':c?c.name:'نقدي',ts:new Date().toISOString(),by:localStorage.pn||'',lines:cart.map(x=>({n:x.n,q:x.q,p:x.p,k:x.k})),tot:Math.round(cart.reduce((s,x)=>s+x.q*x.p,0)*100)/100};
 _dn();
 const inv=S.inv[0];snap.uid=inv.uid;snap.tmp=inv.tmp;
 S.rp=[snap].concat(S.rp||[]).slice(0,30);sv();
 if(PS.auto){
  if(navigator.onLine){for(let i=0;i<6;i++){await sleep(250);const z=S.inv.find(x=>x.uid==snap.uid);if(z&&z.no){snap.no=z.no;break}}}
  printInv(snap);
 }
};
const _vsl=vSell;
vSell=function(){
 const h=_vsl(),r=(S.rp||[])[0];
 if(!r)return h;
 const z=S.inv.find(x=>x.uid==r.uid),n=(z&&z.no)?'#'+z.no:r.tmp;
 return h+`<div class="c"><b>آخر فاتورة</b><div class="it"><span>${n} · ${m(r.tot)} ج</span><button class="sec" style="width:auto;margin:0" onclick="rp(0)">🖨 طباعة</button></div></div>`;
};
const _vs3=vSet;
vSet=function(){
 return _vs3()+`<div class="c"><b>الطباعة (RawBT)</b><select onchange="PS.w=+this.value;psv()"><option value="58" ${PS.w==58?'selected':''}>ورق 58 مم</option><option value="80" ${PS.w==80?'selected':''}>ورق 80 مم</option></select>
 <label style="display:flex;gap:8px;align-items:center;margin:8px 0"><input type="checkbox" style="width:auto;margin:0" ${PS.auto?'checked':''} onchange="PS.auto=this.checked?1:0;psv()"> طباعة تلقائية بعد كل فاتورة</label>
 <input placeholder="سطر أعلى الفاتورة (عنوان أو تليفون)" value="${esc(PS.head)}" onchange="PS.head=this.value;psv()">
 <input placeholder="سطر أسفل الفاتورة" value="${esc(PS.foot)}" onchange="PS.foot=this.value;psv()">
 <button onclick="testPrint()">🖨 طباعة تجريبية</button>
 <p class="mu">لازم تطبيق RawBT يكون منزّل والطابعة متضافة فيه. لو الكروم سأل افتح بـ RawBT اختار موافق.</p></div>`;
};
render();
