/* الكاشير: العروض (سعر مخفض + عرض كمية) في بيع التجزئة */
(function(){
const P0=pr;
pr=function(x,u){
 if(!u&&mode=='r'&&ty=='sell'&&+x.sale>0&&+x.sale<+x.retail)return +x.sale;
 return P0(x,u);
};
const R0=render;
render=function(){
 if(ty=='sell'&&mode=='r')cart.forEach(c=>{
  if(c.uid||c.fx)return;
  const x=S.items.find(i=>i.id==c.id);if(!x)return;
  const b=pr(x,null);
  if(+x.bq>0&&+x.bp>0&&c.q>=+x.bq){const n=Math.floor(c.q/+x.bq+1e-9);c.p=(n*x.bp+(c.q-n*x.bq)*b)/c.q}else c.p=b;
 });
 R0();
};
const O0=ordInv;
ordInv=function(no){O0(no);cart.forEach(c=>{c.fx=1})};
})();
