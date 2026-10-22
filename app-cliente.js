
(function(){
'use strict';
var ALE=window.ALE,BRL=ALE.BRL,esc=ALE.esc;
var $=function(s,r){return (r||document).querySelector(s)};
var pad=function(n){return String(n).padStart(4,'0')};

var SCHEDULE=ALE.SCHEDULE;
var DIAS=['dom','seg','ter','qua','qui','sex','sáb'];
function hh(h){return String(h).padStart(2,'0')+':00'}
function openStatus(){
  var m=S.settings.modo;
  if(m==='fechada')return {open:false,text:'Fechado no momento',manual:true};
  if(m==='aberta')return {open:true,text:'Aberto agora'};
  var p=new Intl.DateTimeFormat('en-US',{timeZone:'America/Sao_Paulo',weekday:'short',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date()),o={};
  p.forEach(function(x){o[x.type]=x.value});
  var d=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(o.weekday),t=(+o.hour)+(+o.minute)/60,s=SCHEDULE[d];
  if(s&&t>=s[0]&&t<s[1])return {open:true,text:'Aberto até '+hh(s[1])};
  if(s&&t<s[0])return {open:false,text:'Fechado · abre hoje às '+hh(s[0])};
  for(var i=1;i<=7;i++){var k=(d+i)%7;if(SCHEDULE[k])return {open:false,text:'Fechado · abre '+(i===1?'amanhã':DIAS[k])+' às '+hh(SCHEDULE[k][0])}}
  return {open:false,text:'Fechado'};
}

/* ---------- dados: cardápio e configurações vêm do Firebase; estes valores são só a reserva ---------- */
var MENU=[];
var S={mode:'entrega',cart:[],view:'menu',q:'',when:'asap',sched:'',coupon:null,upSeen:false,
  settings:{name:'Ale Top Lanches',whatsapp:'',pix:'',pickup:'',zones:[],promo:{on:true,min:30},destaque:'',modo:'auto',eta:{base:30,alto:40,movimento:false},extras:[],off:{}}};
var photoCache={},photoAsked={},rerenderT=0;
function num(v,d){v=parseFloat(v);return isFinite(v)?v:d}
function resolvePhoto(it){
  if(it.foto==='ref'){if(photoCache[it.id])return photoCache[it.id];if(!photoAsked[it.id]&&window.AleApp&&window.AleApp.loadPhoto){photoAsked[it.id]=1;window.AleApp.loadPhoto(it.id)}return ''}
  return ALE.fotoOk(it.foto)?it.foto:'';
}
function applyMenu(doc){
  if(!doc||!Array.isArray(doc.categorias))return false;
  var today=ALE.hoje(),off={};
  MENU=doc.categorias.map(function(g){
    return {cat:String(g.cat||''),sub:String(g.sub||''),note:String(g.note||''),x:!!g.x,br:!!g.br,items:(Array.isArray(g.items)?g.items:[]).map(function(it){
      var v=(Array.isArray(it.v)&&it.v.length?it.v:[{n:'',p:0}]).map(function(x){return {n:String(x.n||''),p:Math.max(0,num(x.p,0))}});
      var o={id:String(it.id),name:String(it.name||''),desc:String(it.desc||''),v:v,foto:typeof it.foto==='string'?it.foto:'',x:!!g.x,br:!!g.br,esg:it.esg===today};
      o.ph=resolvePhoto(o);if(o.esg)off[o.id]=true;return o})};
  });
  S.settings.extras=(Array.isArray(doc.adicionais)?doc.adicionais:[]).map(function(x){return {id:String(x.id),name:String(x.name||''),price:Math.max(0,num(x.price,0))}});
  S.settings.off=off;
  S.cart=S.cart.filter(function(l){return findItem(l.id)&&l.qty>0});
  return true;
}
function applyConfig(c){
  if(!c||typeof c!=='object')return false;var s=S.settings;
  if(c.nome)s.name=String(c.nome);
  if(c.whatsapp)s.whatsapp=String(c.whatsapp);
  s.pix=String(c.pix||'');s.pickup=String(c.retirada||'');
  if(Array.isArray(c.zonas))s.zones=c.zonas.map(function(z,i){return {id:String(z.id||('z'+i)),name:String(z.name||''),fee:(z.fee===null||z.fee===''||z.fee===undefined)?null:Math.max(0,num(z.fee,0))}}).filter(function(z){return z.name});
  if(c.promo)s.promo={on:!!c.promo.on,min:Math.max(0,num(c.promo.min,0))};
  s.destaque=String(c.destaque||'');
  s.modo=(c.modo==='aberta'||c.modo==='fechada')?c.modo:'auto';
  if(c.eta)s.eta={base:Math.max(10,num(c.eta.base,30)),alto:Math.max(10,num(c.eta.alto,40)),movimento:!!c.eta.movimento};
  return true;
}
applyMenu(ALE.CARDAPIO_PADRAO);applyConfig(ALE.CONFIG_PADRAO);
try{var c1=JSON.parse(localStorage.getItem('aletop_cardapio')||'null');if(c1)applyMenu(c1)}catch(e){}
try{var c2=JSON.parse(localStorage.getItem('aletop_config')||'null');if(c2)applyConfig(c2)}catch(e){}

function vPrice(it,i){return it.v[i].p}
function minPrice(it){var m=Infinity;for(var i=0;i<it.v.length;i++){m=Math.min(m,vPrice(it,i))}return m}
function findItem(id){for(var i=0;i<MENU.length;i++){for(var j=0;j<MENU[i].items.length;j++){if(MENU[i].items[j].id===id)return MENU[i].items[j]}}}
function toast(msg){var t=$('#toast');t.textContent=msg;t.hidden=false;clearTimeout(toast.h);toast.h=setTimeout(function(){t.hidden=true},2200)}
function waDigits(){return S.settings.whatsapp.replace(/\D/g,'')}
function waPretty(){var d=waDigits();if(d.indexOf('55')===0)d=d.slice(2);return d.length===11?'('+d.slice(0,2)+') '+d.slice(2,7)+'-'+d.slice(7):S.settings.whatsapp}
function money(n){return n.toFixed(2).replace('.',',')}
function moneyH(n){var p=n.toFixed(2).split('.');return p[0]+'<sup>,'+p[1]+'</sup>'}

/* ---------- horários, tempo estimado e agendamento ---------- */
function p2(n){return String(n).padStart(2,'0')}
function spNow(){var p=new Intl.DateTimeFormat('en-US',{timeZone:'America/Sao_Paulo',weekday:'short',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date()),o={};p.forEach(function(x){o[x.type]=x.value});return o}
function todaySP(){return ALE.hoje()}
function slotList(mode){
  var o=spNow(),nowMin=(+o.hour)*60+(+o.minute),d=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(o.weekday),sc=SCHEDULE[d];
  if(!sc)return [];
  var step=window.innerWidth<=640?30:15,first=Math.ceil(nowMin/step)*step,last=sc[1]*60,out=[];
  for(var m=first;m<=last;m+=step){out.push({hm:p2(Math.floor(m/60))+':'+p2(m%60),full:false})}
  return out;
}
function etaRange(mode){var E=S.settings.eta,e=E.movimento?E.alto:E.base,lo=mode==='retirada'?Math.max(15,e-10):e;return [lo,lo+5]}
function etaText(mode){var r=etaRange(mode);return '~'+r[0]+'–'+r[1]+' min'}
function pixPending(){return !S.settings.pix||/cadastre/i.test(S.settings.pix)}
function pickPending(){return !S.settings.pickup||/cadastre/i.test(S.settings.pickup)}
function zonesShown(){return S.settings.zones.filter(function(z){return !/exemplo/i.test(z.name)})}
function calc(zv){
  var st=subtotal(),fi=feeInfo(zv,st);
  return {st:st,fi:fi,d:0,free:false,fee:fi.fee,total:st+fi.fee};
}
/* carrinho guardado neste aparelho, para não perder o pedido se a internet cair */
function saveCart(){try{localStorage.setItem('aletop2cart',JSON.stringify(S.cart))}catch(e){}}
try{var sc=JSON.parse(localStorage.getItem('aletop2cart')||'[]');if(Array.isArray(sc))S.cart=sc.filter(function(l){return l&&findItem(l.id)&&l.qty>0})}catch(e){}
function netState(){var b=$('#offBar');if(b)b.hidden=navigator.onLine}
window.addEventListener('online',netState);window.addEventListener('offline',netState);
setInterval(function(){renderHero();updateBar()},30000);
window.addEventListener('pagehide',saveCart);setInterval(saveCart,2000);


function renderHero(){
  var st=openStatus(),s=S.settings,li=[];
  $('#storeName').textContent=s.name;document.title=s.name;
  li.push('<li><span class="dot'+(st.open?'':' off')+'"></span><b>'+esc(st.text)+'</b></li>');
  li.push('<li>Ter a sáb <b>16h–23h</b> · Dom <b>18h–23h</b></li>');
  li.push('<li>Entrega <b class="num">'+etaText('entrega')+'</b> · Retirada <b class="num">'+etaText('retirada')+'</b></li>');
  li.push('<li>Pedidos <b class="num">'+esc(waPretty())+'</b></li>');
  li.push('<li>Pix, <b>dinheiro</b> e <b>cartões</b></li>');
  document.body.classList.toggle('closed',!st.open);var cb=$('#closedBar');if(cb){cb.hidden=st.open;cb.textContent=st.open?'':closedMsg()}
  $('#info').innerHTML=li.join('');var fw=$('#footWa');if(fw)fw.textContent='Pedidos '+waPretty();
  var P=s.promo;$('#promo').hidden=!P.on||S.view!=='menu';
  $('#promoTxt').textContent='em pedidos para entrega acima de '+BRL(P.min)+'.';
}

/* ---------- rolo de fotos no topo ---------- */
var REEL=['combosemana','baconcrispy','americano','duplobacon','baconcheddar','frangosupreme','farmbacon','file','shmisto','shnachos','prcostela','especial','casa','mini4','mini2','familia','batata','batatacb'];
var R={pos:0,hold:false,last:0,t:0,period:0,n:0};
var reduceMotion=false;try{reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches}catch(e){}
function renderReel(){
  var ids=REEL.filter(function(id){return findItem(id)&&findItem(id).ph&&!S.settings.off[id]});
  function card(id,clone){var it=findItem(id);
    return '<button type="button" class="ph" data-add="'+id+'"'+(clone?' tabindex="-1" aria-hidden="true"':'')+' aria-label="Pedir '+esc(it.name)+'"><img src="'+esc(it.ph)+'" alt="" width="168" height="168" draggable="false"><span class="cap"><b>'+esc(it.name)+'</b><span class="num">'+(it.v.length>1?'a partir de ':'')+BRL(minPrice(it))+'</span></span></button>'}
  var st=$('#strip');
  st.innerHTML=ids.map(function(id){return card(id,false)}).join('')+ids.map(function(id){return card(id,true)}).join('');
  R.n=ids.length;R.pos=0;R.period=0;st.scrollLeft=0;
}
function reelPeriod(){var st=$('#strip');if(R.n&&st.children[R.n])R.period=st.children[R.n].offsetLeft-st.children[0].offsetLeft;return R.period}
function reelTick(ts){
  var st=$('#strip');
  if(R.last&&!R.hold&&!reduceMotion&&S.view==='menu'&&!$('#layer').firstChild&&R.n){
    var p=R.period>0?R.period:reelPeriod();
    if(p>0){R.pos+=Math.min(ts-R.last,50)*0.04;if(R.pos>=p)R.pos-=p;st.scrollLeft=R.pos}
  }
  R.last=ts;requestAnimationFrame(reelTick);
}
function reelHold(){R.hold=true;clearTimeout(R.t)}
function reelRelease(ms){clearTimeout(R.t);R.t=setTimeout(function(){var st=$('#strip'),p=reelPeriod(),x=st.scrollLeft;if(p>0&&x>=p){x-=p;st.scrollLeft=x}R.pos=x;R.hold=false},ms)}
(function(){
  var st=$('#strip');
  st.addEventListener('pointerenter',reelHold);st.addEventListener('pointerdown',reelHold);
  st.addEventListener('pointerleave',function(){reelRelease(600)});
  st.addEventListener('pointerup',function(){reelRelease(2500)});
  st.addEventListener('pointercancel',function(){reelRelease(2500)});
  st.addEventListener('scroll',function(){if(R.hold)reelRelease(2500)},{passive:true});
  $('#rPrev').onclick=function(){reelHold();st.scrollBy({left:-340,behavior:'smooth'});reelRelease(3000)};
  $('#rNext').onclick=function(){reelHold();st.scrollBy({left:340,behavior:'smooth'});reelRelease(3000)};
})();

/* ---------- cardápio com busca ---------- */
function norm(t){return String(t).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'')}
function rebuildLine(l){
  var p=String(l.key).split('|'),it=findItem(p[0]);if(!it||S.settings.off[it.id])return null;
  var vi=+p[1],v=it.v[vi];if(!v)return null;
  var ids=p[2]?p[2].split(','):[],ex=[],u=vPrice(it,vi),X=S.settings.extras;
  for(var i=0;i<ids.length;i++){var x=X.filter(function(q){return q.id===ids[i]})[0];if(!x)return null;ex.push(x.name);u+=x.price}
  return {key:l.key,id:it.id,name:it.name+(v.n?' ('+v.n+')':''),unit:u,qty:l.qty,extras:ex,obs:p.slice(3).join('|'),br:it.br};
}
function lastLines(){var out=[];try{var a=JSON.parse(localStorage.getItem('aletop2last')||'[]');a.forEach(function(l){var r=rebuildLine(l);if(r)out.push(r)})}catch(e){}return out}
function renderRepeat(){
  var b=$('#repeatBox');if(!b)return;var L=lastLines();
  if(!L.length||S.q){b.innerHTML='';return}
  var n=L.reduce(function(a,l){return a+l.qty},0),t=L.reduce(function(a,l){return a+l.unit*l.qty},0);
  b.innerHTML='<button type="button" class="repeat" id="repeatGo"><span><b>Repetir meu último pedido</b><small>'+n+(n===1?' item':' itens')+' · '+BRL(t)+'</small></span><span class="rp">Repetir</span></button>';
}
document.addEventListener('click',function(e){
  if(!e.target.closest('#repeatGo'))return;
  if(!openStatus().open){toast(closedMsg());return}
  var L=lastLines();if(!L.length)return;
  L.forEach(function(l){var e2=S.cart.filter(function(c){return c.key===l.key})[0];if(e2)e2.qty+=l.qty;else S.cart.push(l)});
  saveCart();updateBar();toast('Último pedido adicionado');openUpsell();
});
function renderMenu(){
  var q=norm(S.q||'').trim(),cats='',html='',found=0,f;
  f=findItem(S.settings.destaque);
  $('#featBox').innerHTML=(!q&&f&&!S.settings.off[f.id])?'<button type="button" class="feat" data-add="'+esc(f.id)+'">'+(f.ph?'<img src="'+esc(f.ph)+'" alt="" width="640" height="160">':'')+'<span class="fb"><span class="k">Destaque da semana</span><h2>'+esc(f.name)+'</h2>'+(f.desc?'<p>'+esc(f.desc)+'</p>':'')+'<span class="fp"><span class="num">'+(f.v.length>1?'a partir de ':'')+BRL(minPrice(f))+'</span><span>Pedir</span></span></span></button>':'';
  MENU.forEach(function(g,gi){
    var items=g.items.filter(function(it){return !q||norm(it.name+' '+it.desc+' '+g.cat).indexOf(q)>=0});
    if(!items.length)return;
    found+=items.length;
    cats+='<a href="#c'+gi+'" data-go="c'+gi+'">'+esc(g.cat)+'</a>';
    html+='<section class="sec" id="c'+gi+'"><h2>'+esc(g.cat)+'</h2>'+(g.sub&&!q?'<p class="csub">'+esc(g.sub)+'</p>':'')+(g.note&&!q?'<p class="cnote">'+esc(g.note)+'</p>':'');
    items.forEach(function(it){
      var off=!!S.settings.off[it.id],multi=it.v.length>1;
      html+='<article class="item'+(off?' off':'')+'"><div><h3>'+esc(it.name)+(off?'<span class="tag">Esgotado</span>':'')+'</h3>'+(it.desc?'<p>'+esc(it.desc)+'</p>':'')+'<div class="price num"><small>'+(multi?'a partir de R$':'R$')+'</small>'+moneyH(minPrice(it))+'</div></div>'+
        '<div class="side'+(it.ph?' ph':'')+'"'+(it.ph&&!off?' data-add="'+it.id+'"':'')+'>'+(it.ph?'<img src="'+esc(it.ph)+'" alt="" width="92" height="92" loading="lazy">':'')+'<button type="button" class="add" data-add="'+it.id+'" aria-label="Adicionar '+esc(it.name)+'"'+(off?' disabled':'')+'>+</button></div></article>';
    });
    html+='</section>';
  });
  if(!found)html='<p class="empty">Nada encontrado para “'+esc(S.q)+'”. Tente outro nome, como bacon, costela ou shawarma.</p>';
  $('#cats').innerHTML=cats;$('#menu').innerHTML=html;
  spy.last=null;spy();renderRepeat();
}
/* destaca no topo a categoria que está na tela */
var spyRaf=0;
function spy(){
  if(S.view!=='menu')return;
  var cur=null;
  [].forEach.call(document.querySelectorAll('#menu .sec'),function(s){if(s.getBoundingClientRect().top<=120)cur=s.id});
  var act=null;
  [].forEach.call(document.querySelectorAll('#cats a'),function(c){var on=c.dataset.go===cur;c.classList.toggle('on',on);if(on)act=c});
  if(act&&spy.last!==cur){
    spy.last=cur;var box=$('#cats');
    if(box.scrollTo)box.scrollTo({left:box.scrollLeft+act.getBoundingClientRect().left-box.getBoundingClientRect().left-box.clientWidth/2+act.offsetWidth/2,behavior:'smooth'});
  }
}
window.addEventListener('scroll',function(){if(!spyRaf)spyRaf=requestAnimationFrame(function(){spyRaf=0;spy()})},{passive:true});
$('#q').addEventListener('input',function(){S.q=this.value;$('#qClear').hidden=!S.q;renderMenu()});
$('#qClear').onclick=function(){S.q='';$('#q').value='';this.hidden=true;renderMenu();$('#q').focus()};
$('#cats').addEventListener('click',function(e){var a=e.target.closest('[data-go]');if(!a)return;e.preventDefault();var el=document.getElementById(a.dataset.go);if(el)el.scrollIntoView({behavior:'smooth',block:'start'})});

function cartCount(){return S.cart.reduce(function(a,l){return a+l.qty},0)}
function subtotal(){return S.cart.reduce(function(a,l){return a+l.unit*l.qty},0)}
function brindeCount(lines){return lines.reduce(function(a,l){return a+(l.br?l.qty:0)},0)}
function zoneById(id){return S.settings.zones.filter(function(z){return z.id===id})[0]}
function updateBar(){
  var n=cartCount();if(!n)S.upSeen=false;$('#bar').hidden=n===0||S.view!=='menu'||!!$('#layer').firstChild||!openStatus().open;
  $('#barCnt').textContent=n;$('#barTot').textContent=BRL(subtotal());
}
function closeLayer(){$('#layer').innerHTML='';updateBar()}
function openLayer(html){$('#layer').innerHTML='<div class="veil" id="veil">'+html+'</div>';updateBar();$('#veil').addEventListener('mousedown',function(e){if(e.target.id==='veil')closeLayer()})}

function closedMsg(){var c=openStatus();if(c.manual)return 'Estamos fechados no momento. Voltamos em breve.';return 'Estamos fechados. '+c.text.replace('Fechado · a','A')+'. Os pedidos só são aceitos no horário de atendimento.'}
function openItem(id){
  var it=findItem(id);if(!it)return;
  if(!openStatus().open){toast(closedMsg());return}var qty=1,X=S.settings.extras;
  var vr=it.v.length>1?'<div class="group"><h3>Escolha uma opção</h3>'+it.v.map(function(v,i){return '<label class="opt"><input type="radio" name="var" value="'+i+'"'+(i===0?' checked':'')+'><span>'+esc(v.n)+'</span><span class="num">'+BRL(vPrice(it,i))+'</span></label>'}).join('')+'</div>':'';
  var ex=it.x&&X.length?'<div class="group"><h3>Adicionais</h3>'+X.map(function(x){return '<label class="opt"><input type="checkbox" value="'+x.id+'"><span>'+esc(x.name)+'</span><span class="num">+ '+BRL(x.price)+'</span></label>'}).join('')+'</div>':'';
  openLayer('<div class="sheet" role="dialog" aria-modal="true" aria-label="'+esc(it.name)+'"><div class="sh-head"><div><h2>'+esc(it.name)+'</h2>'+(it.desc?'<p class="note">'+esc(it.desc)+'</p>':'')+'</div><button type="button" class="x" id="xClose" aria-label="Fechar">✕</button></div>'+vr+ex+
   '<div class="fld group"><label for="iObs">Observação para a cozinha</label><textarea id="iObs" placeholder="Ex.: sem cebola, sem milho, ponto da carne"></textarea></div>'+
   '<div style="display:flex;align-items:center;justify-content:space-between;gap:12px"><span class="lbl">Quantidade</span><span class="step"><button type="button" id="iMinus" aria-label="Diminuir">−</button><output id="iQty" class="num">1</output><button type="button" id="iPlus" aria-label="Aumentar">+</button></span></div>'+
   '<button type="button" class="cta" id="iAdd"><span>Adicionar ao pedido</span><span class="num" id="iTot"></span></button></div>');
  var sh=$('#veil');
  function vi(){var r=sh.querySelector('input[name=var]:checked');return r?+r.value:0}
  function unit(){var u=vPrice(it,vi());sh.querySelectorAll('input[type=checkbox]:checked').forEach(function(c){u+=X.filter(function(x){return x.id===c.value})[0].price});return u}
  function upd(){$('#iQty').textContent=qty;$('#iTot').textContent=BRL(unit()*qty)}
  sh.addEventListener('change',upd);upd();
  $('#xClose').onclick=closeLayer;
  $('#iMinus').onclick=function(){if(qty>1){qty--;upd()}};
  $('#iPlus').onclick=function(){if(qty<20){qty++;upd()}};
  $('#iAdd').onclick=function(){
    var ids=[].map.call(sh.querySelectorAll('input[type=checkbox]:checked'),function(c){return c.value}).sort();
    var names=ids.map(function(i){return X.filter(function(x){return x.id===i})[0].name});
    var v=it.v[vi()],nm=it.name+(v.n?' ('+v.n+')':''),obs=$('#iObs').value.trim(),key=it.id+'|'+vi()+'|'+ids.join(',')+'|'+obs;
    var e=S.cart.filter(function(l){return l.key===key})[0];
    if(e)e.qty+=qty;else S.cart.push({key:key,id:it.id,name:nm,unit:unit(),qty:qty,extras:names,obs:obs,br:it.br});
    closeLayer();toast('Adicionado ao pedido');
  };
}
document.addEventListener('click',function(e){var b=e.target.closest('[data-add]');if(b&&!b.disabled)openItem(b.dataset.add)});

function feeInfo(zv,st){
  var P=S.settings.promo;
  if(S.mode!=='entrega')return {fee:0,txt:'Grátis (retirada)',tbd:false,free:false};
  if(zv==='outro')return {fee:0,txt:'a combinar',tbd:true,free:false};
  if(!zv)return {fee:0,txt:'escolha o bairro',tbd:false,free:false};
  if(P.on&&st>=P.min)return {fee:0,txt:'Grátis',tbd:false,free:true};
  var zz=zoneById(zv);if(!zz||zz.fee==null||zz.fee==='')return {fee:0,txt:'a combinar',tbd:true,free:false};
  return {fee:zz.fee,txt:BRL(zz.fee),tbd:false,free:false};
}
function openCart(){
  if(!S.cart.length)return;
  var cl=openStatus();
  if(!cl.open){toast(closedMsg());return}
  var zopts='<option value="">Escolha seu bairro</option>'+zonesShown().map(function(z){return '<option value="'+z.id+'">'+esc(z.name)+(z.fee==null||z.fee===''?'':' · '+BRL(z.fee))+'</option>'}).join('')+'<option value="outro">Outro bairro (frete combinado no WhatsApp)</option>';
  openLayer('<div class="sheet" role="dialog" aria-modal="true" aria-label="Seu pedido"><div class="sh-head"><h2>Seu pedido</h2><button type="button" class="x" id="xClose" aria-label="Fechar">✕</button></div>'+
   (cl.open?'':'<div class="box-warn">Estamos fechados agora. '+esc(cl.text.replace('Fechado · ',''))+'. Você já pode montar o pedido e enviar.</div>')+
   (navigator.onLine?'':'<div class="box-warn">Sem internet. Seu pedido continua salvo aqui. Reconecte para finalizar.</div>')+
   '<section class="stp"><div class="stph"><i>1</i><h3>Seu pedido</h3></div><div id="cLines"></div><div id="cBrinde"></div><div id="cUp"></div></section>'+
   '<section class="stp"><div class="stph"><i>2</i><h3>Como você quer receber</h3></div><div class="seg" id="cSeg"><button type="button" data-mode="entrega">Entrega</button><button type="button" data-mode="retirada">Retirada</button></div>'+
    '<div class="fld" id="fName"><label for="cName">Nome</label><input id="cName" autocomplete="name" placeholder="Como devemos te chamar"><span class="err"></span></div>'+
    '<div class="fld" id="fPhone"><label for="cPhone">WhatsApp</label><input id="cPhone" inputmode="tel" autocomplete="tel" placeholder="(00) 90000-0000"><span class="err"></span></div>'+
    '<div id="addr"><div class="row2 s"><div class="fld" id="fStreet"><label for="cStreet">Rua</label><input id="cStreet" autocomplete="street-address"><span class="err"></span></div><div class="fld" id="fNum"><label for="cNum">Número</label><input id="cNum" inputmode="numeric"><span class="err"></span></div></div>'+
    '<div class="fld" id="fZone"><label for="cZone">Bairro</label><select id="cZone">'+zopts+'</select><span class="err"></span></div>'+
    '<div class="fld" id="fComp"><label for="cComp">Complemento ou ponto de referência</label><input id="cComp" placeholder="Apto, bloco, casa de esquina"><span class="err"></span></div></div>'+
    '<div id="pickup"><div class="box-ok" style="margin-top:12px">Retirada no balcão: '+esc(pickPending()?'enviamos o endereço da loja pelo WhatsApp':S.settings.pickup)+'</div></div>'+
    '<div class="sub">Quando você quer?</div><div id="cWhen"></div></section>'+
   '<section class="stp"><div class="stph"><i>3</i><h3>Pagamento</h3></div><div id="fPay">'+
    '<label class="opt"><input type="radio" name="pay" value="Pix"><span><b>Pix</b><br><small class="note">Você paga e envia o comprovante pelo WhatsApp. O pedido só começa depois dele</small></span></label>'+
    '<label class="opt"><input type="radio" name="pay" value="Crédito"><span><b>Cartão de crédito</b><br><small class="note">Na maquininha, na entrega ou retirada</small></span></label>'+
    '<label class="opt"><input type="radio" name="pay" value="Débito"><span><b>Cartão de débito</b><br><small class="note">Na maquininha, na entrega ou retirada</small></span></label>'+
    '<label class="opt"><input type="radio" name="pay" value="Dinheiro"><span><b>Dinheiro</b><br><small class="note">Você paga na entrega ou na retirada</small></span></label>'+
    '<span class="err" style="color:var(--err);font-size:13px"></span></div>'+
    '<div id="cashBox" class="cash" hidden><div class="sub" style="margin-top:0">Precisa de troco?</div><div class="seg" id="cChSeg"><button type="button" data-ch="no" aria-pressed="true">Não preciso</button><button type="button" data-ch="yes" aria-pressed="false">Preciso de troco</button></div>'+
    '<div class="fld" id="fChange" hidden><label for="cChange">Troco para quanto? (R$)</label><input id="cChange" inputmode="decimal" placeholder="Ex.: 100"><small class="note" id="cChHint"></small><span class="err"></span></div></div></section>'+
   '<section class="stp"><div class="stph"><i>4</i><h3>Observação</h3></div><div class="fld"><textarea id="cNote" aria-label="Observação geral" placeholder="Algo mais que a cozinha ou o entregador deva saber"></textarea></div></section>'+
   '<section class="stp"><div class="stph"><i>5</i><h3>Total</h3></div>'+
   '<div class="sum" id="cSum"></div></section>'+
   '<button type="button" class="cta" id="cGo"'+(!navigator.onLine?' disabled':'')+'><span>Finalizar pedido</span><span class="num" id="cGoT"></span></button>'+
   '<p class="note">Você confirma pelo WhatsApp na próxima tela.</p></div>');
  var sh=$('#veil');
  function lines(){
    $('#cLines').innerHTML=S.cart.map(function(l,i){
      return '<div class="line"><div><b>'+esc(l.name)+'</b>'+(l.extras.length?'<small>+ '+esc(l.extras.join(', '))+'</small>':'')+(l.obs?'<small>Obs: '+esc(l.obs)+'</small>':'')+'</div><div class="tot num">'+BRL(l.unit*l.qty)+'</div>'+
        '<span class="step"><button type="button" data-q="'+i+'" data-d="-1" aria-label="Diminuir '+esc(l.name)+'">−</button><output class="num">'+l.qty+'</output><button type="button" data-q="'+i+'" data-d="1" aria-label="Aumentar '+esc(l.name)+'">+</button></span></div>';
    }).join('');
    var b=brindeCount(S.cart);$('#cBrinde').innerHTML=b?'<div class="box-ok">Brinde: '+b+' × Coca-Cola lata 350 ml na compra de shawarma.</div>':'';
  }
  function summary(){
    var zv=$('#cZone').value;
    S.coupon=null;
    var k=calc(zv),fi=k.fi,P=S.settings.promo,hint='';
    if(S.mode==='entrega'&&P.on&&!fi.tbd&&!k.free){hint=k.st>=P.min?'<div class="box-ok">Frete grátis aplicado.</div>':'<div class="box-warn">Faltam '+BRL(P.min-k.st)+' para frete grátis.</div>'}
    $('#cSum').innerHTML='<div><span>Subtotal</span><span class="num">'+BRL(k.st)+'</span></div>'+(k.d?'<div><span>Desconto ('+esc(S.coupon.code)+')</span><span class="num">− '+BRL(k.d)+'</span></div>':'')+'<div><span>Frete</span><span class="num">'+(k.free?'Grátis (cupom)':fi.txt)+'</span></div><div class="t"><span>Total</span><span class="num">'+BRL(k.total)+'</span></div>'+hint+(fi.tbd?'<div class="box-warn">O frete deste bairro será informado por nós no WhatsApp.</div>':'')+(S.coupon&&S.coupon.type==='frete'&&S.mode!=='entrega'?'<div class="box-warn">O cupom de frete grátis vale só para entrega.</div>':'');
    $('#cGoT').textContent=BRL(k.total);
    $('#cSum').insertAdjacentHTML('beforeend','<p class="note">'+(S.when==='sched'&&S.sched?'Agendado para hoje às '+S.sched+'.':'Tempo estimado: '+etaText(S.mode)+'.')+'</p>');
  }
  function upsell(){
    var drinks=MENU.filter(function(g){return g.cat==='Bebidas'})[0].items.map(function(i){return i.id});
    var hasD=S.cart.some(function(l){return drinks.indexOf(l.id)>=0}),hasP=S.cart.some(function(l){return l.id==='batata'||l.id==='batatacb'});
    var ids=[];if(!hasD)['cocalata','guaranalata','coca600'].forEach(function(i){ids.push(i)});if(!hasP)ids.push('batata');
    ids=ids.filter(function(i){return findItem(i)&&!S.settings.off[i]}).slice(0,4);
    $('#cUp').innerHTML='';return;
    $('#cUp').innerHTML=ids.length?'<div class="group"><h3>Que tal levar também?</h3><div class="up">'+ids.map(function(i){var it=findItem(i),v=it.v[0];return '<button type="button" data-up="'+i+'"><span>'+esc(it.name+(v.n&&it.v.length>1?' '+v.n.toLowerCase():''))+'</span><b class="num">+ '+BRL(vPrice(it,0))+'</b></button>'}).join('')+'</div></div>':'';
  }
  function renderSched(){
    var sl=slotList(S.mode),any=sl.some(function(x){return !x.full}),box=$('#cWhen');
    if(!any)S.when='asap';
    if(S.when==='sched'){var cur=sl.filter(function(x){return x.hm===S.sched&&!x.full})[0];if(!cur){var f=sl.filter(function(x){return !x.full})[0];S.sched=f?f.hm:''}}
    var last=SCHEDULE[['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(spNow().weekday)];
    box.innerHTML='<div class="seg" id="cWseg"><button type="button" data-when="asap" aria-pressed="'+(S.when!=='sched')+'">Em '+etaText(S.mode)+'</button><button type="button" data-when="sched" aria-pressed="'+(S.when==='sched')+'">Escolher horário</button></div>'+
      (S.when==='sched'&&any?'<div class="fld"><label for="cSched">Horário de hoje</label><select id="cSched">'+sl.map(function(x){return '<option value="'+x.hm+'"'+(x.full?' disabled':'')+(S.sched===x.hm?' selected':'')+'>'+x.hm+(x.full?' · lotado':'')+'</option>'}).join('')+'</select></div>':'')+
      (S.when==='sched'&&!any?'<p class="note k">Sem horários livres hoje'+(last?'. Os horários vão até '+p2(last[1])+':00, respeitando a antecedência mínima':'')+'. Seu pedido segue sem horário marcado.</p>':'');
    summary();
  }
  function mode(){
    [].forEach.call(sh.querySelectorAll('#cSeg button'),function(b){b.setAttribute('aria-pressed',String(b.dataset.mode===S.mode))});
    $('#addr').hidden=S.mode!=='entrega';$('#pickup').hidden=S.mode!=='retirada';renderSched();
  }
  lines();upsell();mode();
  $('#xClose').onclick=closeLayer;
  sh.addEventListener('click',function(e){
    var q=e.target.closest('[data-q]');
    if(q){var l=S.cart[+q.dataset.q];l.qty+=+q.dataset.d;if(l.qty<=0)S.cart.splice(+q.dataset.q,1);if(!S.cart.length){closeLayer();return}lines();upsell();summary();return}
    var up=e.target.closest('[data-up]');
    if(up){var ui=findItem(up.dataset.up),uv=ui.v[0],uk=ui.id+'|0||',ue=S.cart.filter(function(c){return c.key===uk})[0];if(ue)ue.qty++;else S.cart.push({key:uk,id:ui.id,name:ui.name+(uv.n?' ('+uv.n+')':''),unit:vPrice(ui,0),qty:1,extras:[],obs:'',br:ui.br});saveCart();lines();upsell();summary();toast('Adicionado: '+ui.name);return}
    var wh=e.target.closest('[data-when]');
    if(wh){S.when=wh.dataset.when;if(S.when==='sched'&&!slotList(S.mode).some(function(x){return !x.full})){S.when='asap';renderSched();$('#cWhen').insertAdjacentHTML('beforeend','<p class="note k">Sem horários livres hoje. Os horários vão até a hora de fechar, respeitando a antecedência mínima. Seu pedido segue sem horário marcado.</p>');return}renderSched();return}
    var m=e.target.closest('#cSeg [data-mode]');if(m){S.mode=m.dataset.mode;mode();syncMode()}
  });
  function cashUi(){
    var p=sh.querySelector('input[name=pay]:checked'),cash=!!p&&p.value==='Dinheiro',yes=sh.querySelector('#cChSeg [aria-pressed=true]').dataset.ch==='yes';
    setErr('fChange');    $('#cashBox').hidden=!cash;$('#fChange').hidden=!(cash&&yes);
    var h=$('#cChHint'),v=moneyVal($('#cChange').value),t=calc($('#cZone').value).total;
    h.textContent=(cash&&yes&&v>t)?'Levaremos '+BRL(v-t)+' de troco.':'Informe a nota que você vai entregar.';
  }
  sh.addEventListener('click',function(e){var c=e.target.closest('#cChSeg [data-ch]');if(!c)return;[].forEach.call(sh.querySelectorAll('#cChSeg button'),function(b){b.setAttribute('aria-pressed',String(b===c))});cashUi()});
  sh.addEventListener('input',function(e){if(e.target.id==='cChange')cashUi()});
  $('#fPay').addEventListener('change',cashUi);
  $('#cZone').addEventListener('change',function(){summary();cashUi()});
  sh.addEventListener('change',function(e){if(e.target.id==='cSched'){S.sched=e.target.value;summary()}});
  $('#cPhone').addEventListener('input',function(e){var d=e.target.value.replace(/\D/g,'').slice(0,11);var o=d;if(d.length>2)o='('+d.slice(0,2)+') '+d.slice(2);if(d.length>7)o='('+d.slice(0,2)+') '+d.slice(2,7)+'-'+d.slice(7);e.target.value=o});
  $('#cGo').onclick=function(){submit(sh)};
}
function syncMode(){[].forEach.call(document.querySelectorAll('#modeSeg button'),function(b){b.setAttribute('aria-pressed',String(b.dataset.mode===S.mode))})}
$('#modeSeg').addEventListener('click',function(e){var b=e.target.closest('[data-mode]');if(!b)return;S.mode=b.dataset.mode;syncMode()});
$('#barBtn').onclick=openUpsell;
function upIds(){
  var drinks=MENU.filter(function(g){return g.cat==='Bebidas'})[0].items.map(function(i){return i.id});
  var hasD=S.cart.some(function(l){return drinks.indexOf(l.id)>=0}),hasP=S.cart.some(function(l){return l.id==='batata'||l.id==='batatacb'});
  var d=hasD?[]:(hasP?['cocalata','guaranalata','coca600','fantauva']:['cocalata','guaranalata']),p=hasP?[]:(hasD?['batata','batatacb']:['batata','batatacb']);
  var ok=function(i){return findItem(i)&&!S.settings.off[i]};
  return {d:d.filter(ok),p:p.filter(ok)};
}
function drinkSvg(id){
  var col=/guarana/.test(id)?'#1F9D3B':/fanta/.test(id)?'#6B2C91':/zero/.test(id)?'#1A1A1A':'#D6001C',bottle=/600|2l/.test(id);
  if(bottle)return '<svg viewBox="0 0 40 72" width="34" height="62" aria-hidden="true"><rect x="15" y="2" width="10" height="8" rx="2" fill="#222"/><path d="M15 10h10v8c6 4 9 9 9 16v30a6 6 0 0 1-6 6H12a6 6 0 0 1-6-6V34c0-7 3-12 9-16z" fill="'+col+'"/><path d="M6 36q7-5 14 0t14 0v10q-7 5-14 0t-14 0z" fill="#fff" opacity=".9"/><rect x="9" y="22" width="3" height="40" rx="1.5" fill="#fff" opacity=".25"/></svg>';
  return '<svg viewBox="0 0 40 64" width="38" height="60" aria-hidden="true"><rect x="7" y="4" width="26" height="4" rx="2" fill="#B8B8B8"/><rect x="6" y="7" width="28" height="50" rx="3" fill="'+col+'"/><rect x="6" y="56" width="28" height="4" rx="2" fill="#B8B8B8"/><path d="M6 26q7-5 14 0t14 0v10q-7 5-14 0t-14 0z" fill="#fff" opacity=".9"/><rect x="9" y="10" width="3" height="44" rx="1.5" fill="#fff" opacity=".28"/></svg>';
}
function upCard(id){
  var it=findItem(id),key=id+'|0||',ln=S.cart.filter(function(l){return l.key===key})[0],v=it.v[0];
  var vn=(it.v.length>1&&v.n)?' '+v.n.toLowerCase():'';
  return '<div class="uc'+(ln?' on':'')+'"><div class="uimg">'+(it.ph?'<img src="'+esc(it.ph)+'" alt="">':drinkSvg(id))+'</div><b class="un">'+esc(it.name+vn)+'</b><span class="num up">'+BRL(vPrice(it,0))+'</span>'+
    (ln?'<span class="step"><button type="button" data-uq="'+id+'" data-d="-1" aria-label="Diminuir '+esc(it.name)+'">−</button><output class="num">'+ln.qty+'</output><button type="button" data-uq="'+id+'" data-d="1" aria-label="Aumentar '+esc(it.name)+'">+</button></span>':'<button type="button" class="uadd" data-uq="'+id+'" data-d="1">Adicionar</button>')+'</div>';
}
function openUpsell(){
  if(!S.cart.length)return;
  if(!openStatus().open){toast(closedMsg());return}
  var u=upIds();
  if(S.upSeen||(!u.d.length&&!u.p.length)){openCart();return}
  function body(){
    var u2=upIds(),all={d:u.d,p:u.p};
    return (all.d.length?'<h3 class="uh">Para beber</h3><div class="upg">'+all.d.map(upCard).join('')+'</div>':'')+(all.p.length?'<h3 class="uh">Para acompanhar</h3><div class="upg">'+all.p.map(upCard).join('')+'</div>':'');
  }
  openLayer('<div class="sheet" role="dialog" aria-modal="true" aria-label="Quer acrescentar?"><div class="sh-head"><div><h2>Quer acrescentar?</h2><p class="note">Combina com o seu pedido. Toque para adicionar.</p></div><button type="button" class="x" id="xClose" aria-label="Fechar">✕</button></div><div id="upBody">'+body()+'</div>'+
    '<button type="button" class="cta" id="upGo"><span>Continuar</span><span class="num" id="upTot"></span></button><button type="button" class="ghost full" id="upNo">Não, obrigado</button></div>');
  var sh=$('#veil');
  function tot(){$('#upTot').textContent=BRL(subtotal())}
  tot();
  $('#xClose').onclick=closeLayer;
  sh.addEventListener('click',function(e){
    var q=e.target.closest('[data-uq]');
    if(q){
      var id=q.dataset.uq,it=findItem(id),v=it.v[0],key=id+'|0||',ln=S.cart.filter(function(l){return l.key===key})[0],d=+q.dataset.d;
      if(ln){ln.qty+=d;if(ln.qty<=0)S.cart.splice(S.cart.indexOf(ln),1)}else if(d>0)S.cart.push({key:key,id:id,name:it.name+(v.n?' ('+v.n+')':''),unit:vPrice(it,0),qty:1,extras:[],obs:'',br:it.br});
      saveCart();var sc=sh.querySelector('.sheet').scrollTop;$('#upBody').innerHTML=body();sh.querySelector('.sheet').scrollTop=sc;tot();return}
    if(e.target.closest('#upGo')||e.target.closest('#upNo')){S.upSeen=true;openCart()}
  });
}

function phoneOk(v){
  var d=v.replace(/\D/g,'');if(d.length<10||d.length>11)return false;
  var ddd=+d.slice(0,2);if(ddd<11||ddd>99)return false;
  var n=d.slice(2);
  if(n.length===9&&n[0]!=='9')return false;
  if(n.length===8&&!/^[2-5]/.test(n))return false;
  if(new Set(n.split('')).size<=2)return false;
  var t=n.slice(-7);
  if(/(\d)\1{3,}/.test(n))return false;
  if('01234567890123'.indexOf(t)>=0||'98765432109876'.indexOf(t)>=0)return false;
  return true;
}
function semNum(v){v=v.trim();return /^0+$/.test(v)||/^(s\/?n|sem n[uú]mero)$/i.test(v)}
function numOk(v){v=v.trim();return semNum(v)||/^\d{1,5}\s?[a-zA-Z]?$/.test(v)}
function nameOk(v){return /\p{L}{2,}/u.test(v)&&!/^\d+$/.test(v.trim())&&!/(.)\1{3,}/i.test(v.replace(/\s/g,''))}
function setErr(id,msg){var f=$('#'+id);if(!f)return;f.classList.toggle('bad',!!msg);var s=f.querySelector('.err');if(s)s.textContent=msg||''}
function moneyVal(t){t=String(t||'').replace(/[^\d,.]/g,'');if(t.indexOf(',')>=0)t=t.replace(/\./g,'').replace(',','.');var v=parseFloat(t);return isFinite(v)?v:0}
function payText(o){if(o.pay==='Dinheiro')return o.change?'Dinheiro - troco para '+BRL(o.change)+' (levar '+BRL(o.change-o.total)+' de troco)':'Dinheiro - sem troco';return o.pay==='Pix'?'Pix (vou enviar o comprovante)':'Cartão de '+o.pay.toLowerCase()+' na maquininha'}
function submit(sh){
  if(!openStatus().open){closeLayer();toast(closedMsg());renderHero();return}
  if(!navigator.onLine){toast('Sem internet. Reconecte para finalizar.');return}
  var name=$('#cName').value.trim(),phone=$('#cPhone').value.trim(),street=$('#cStreet').value.trim(),num=$('#cNum').value.trim(),zv=$('#cZone').value;
  var payEl=sh.querySelector('input[name=pay]:checked'),ok=true,first=null;
  function bad(id,msg,inp){setErr(id,msg);ok=false;if(!first)first=inp}
  setErr('fComp');setErr('fName');setErr('fPhone');setErr('fStreet');setErr('fNum');setErr('fZone');
  if(!nameOk(name))bad('fName','Informe seu nome, com letras.','#cName');
  if(!phoneOk(phone))bad('fPhone','Informe um WhatsApp válido, com DDD. Ex.: (42) 99999-1234.','#cPhone');
  if(S.mode==='entrega'){
    if(!/\p{L}{3,}/u.test(street))bad('fStreet','Informe o nome da rua.','#cStreet');
    if(!numOk(num))bad('fNum','Informe o número da casa. Sem número? Digite 0 ou S/N.','#cNum');
    else if(semNum(num)&&$('#cComp').value.trim().length<4)bad('fComp','Sem número, informe um ponto de referência. Ex.: casa azul ao lado da padaria.','#cComp');
    if(!zv)bad('fZone','Escolha o bairro para calcular o frete.','#cZone');
  }
  var pe=$('#fPay .err');pe.textContent='';setErr('fChange');var chg=0;
  if(!payEl){pe.textContent='Escolha a forma de pagamento.';ok=false;if(!first)first='#fPay input'}
  if(payEl&&payEl.value==='Dinheiro'&&sh.querySelector('#cChSeg [aria-pressed=true]').dataset.ch==='yes'){
    chg=moneyVal($('#cChange').value);var tt=calc(zv).total;
    if(!(chg>tt))bad('fChange','Informe um valor maior que o total ('+BRL(tt)+'). Ex.: '+BRL(Math.ceil((tt+1)/10)*10).replace('R$','').trim()+'.','#cChange');
  }
  if(!ok){var el=$(first,sh);if(el){el.scrollIntoView({block:'center'});el.focus()}return}
  S.coupon=null;
  if(S.when==='sched'){var sl0=slotList(S.mode).filter(function(x){return x.hm===S.sched})[0];if(!sl0||sl0.full){toast('Esse horário ficou indisponível. Escolha outro.');return}}
  var st=subtotal(),fi=feeInfo(zv,st),z=zv&&zv!=='outro'?zoneById(zv):null;
  var o={id:Math.floor(Date.now()/1000)%10000,ts:Date.now(),time:new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit',timeZone:'America/Sao_Paulo'}),name:name,phone:phone,mode:S.mode,street:street,number:num,comp:$('#cComp').value.trim(),
    zone:S.mode==='entrega'?(zv==='outro'?'Outro bairro (combinar frete)':z.name):'',feeTbd:fi.tbd,feeFree:fi.free,pay:payEl.value,note:$('#cNote').value.trim(),brinde:brindeCount(S.cart),
    items:S.cart.map(function(l){return {name:l.name,qty:l.qty,extras:l.extras,obs:l.obs,total:l.unit*l.qty}}),subtotal:st,fee:fi.fee};
  o.total=o.subtotal+o.fee;
  var cc=calc(zv);o.fee=cc.fee;o.feeFree=fi.free||cc.free;o.discount=0;o.coupon='';o.total=o.subtotal-cc.d+o.fee;o.change=payEl.value==='Dinheiro'?chg:0;
  if(S.when==='sched'&&S.sched){o.sched=S.sched}
  try{localStorage.setItem('aletop2last',JSON.stringify(S.cart.map(function(l){return {key:l.key,qty:l.qty}})))}catch(e){}
  S.cart=[];S.upSeen=false;S.when='asap';S.sched='';S.coupon=null;saveCart();renderHero();renderRepeat();showDone(o);
}

function waText(o){
  var L=['*Pedido #'+pad(o.id)+' - '+S.settings.name+'*',''];
  o.items.forEach(function(i){L.push(i.qty+'x '+i.name+(i.extras.length?' (+ '+i.extras.join(', ')+')':'')+' - '+BRL(i.total));if(i.obs)L.push('   Obs: '+i.obs)});
  if(o.brinde)L.push('Brinde: '+o.brinde+' × Coca-Cola lata 350 ml');
  L.push('');L.push('Tipo: '+(o.mode==='entrega'?'Entrega':'Retirada'));L.push('Horário: '+(o.sched?'agendado para hoje às '+o.sched:'sem horário marcado'));
  if(o.mode==='entrega'){L.push('Endereço: '+o.street+', '+o.number+(o.comp?' ('+o.comp+')':'')+' - '+o.zone)}
  if(o.note)L.push('Obs: '+o.note);L.push('');
  L.push('Subtotal: '+BRL(o.subtotal));if(o.mode==='entrega')L.push('Frete: '+(o.feeTbd?'a combinar':(o.feeFree?'grátis (promoção)':BRL(o.fee))));
  L.push('*Total: '+BRL(o.total)+(o.feeTbd?' + frete':'')+'*');L.push('');
  L.push('Pagamento: '+payText(o));
  L.push('Nome: '+o.name);
  return L.join('\n');
}

function showDone(o){
  var msg=waText(o),href='https://wa.me/'+waDigits()+'?text='+encodeURIComponent(msg);
  var warn=o.pay==='Pix'?'<div class="box-warn" style="margin-top:12px"><b>Importante:</b> seu pedido só começa a ser preparado depois que você enviar o comprovante do Pix pelo WhatsApp.</div>':'';
  var pixHtml=o.pay==='Pix'?'<div class="pixbox"><b>Chave Pix</b><br><span class="mono" id="pixKey">'+esc(pixPending()?'A chave Pix será enviada pelo WhatsApp':S.settings.pix)+'</span> <button type="button" class="ghost" id="copyPix" style="padding:4px 10px;margin-left:6px">Copiar</button><br><span class="note">Valor: '+BRL(o.total)+(o.feeTbd?' + frete':'')+'</span></div>':'';
  $('#layer').innerHTML='<div class="veil" id="veil"><div class="sheet" role="dialog" aria-modal="true" aria-label="Pedido criado"><div class="sh-head"><div><h2>Pedido #'+pad(o.id)+' criado</h2><p class="note">'+(o.pay==='Pix'?'Falta enviar o comprovante do Pix pelo WhatsApp.':'Falta só enviar pelo WhatsApp para confirmarmos.')+'</p></div><button type="button" class="x" id="xClose" aria-label="Fechar">✕</button></div>'+
   '<ol class="steps"><li><i>1</i><span>Toque no botão verde para abrir o WhatsApp com o pedido pronto.</span></li><li><i>2</i><span>'+(o.pay==='Pix'?'Faça o Pix e envie o comprovante na conversa. Sem o comprovante o pedido não começa.':'Envie a mensagem. Pagamento '+(o.pay==='Dinheiro'?'em dinheiro':'na maquininha')+', na '+(o.mode==='entrega'?'entrega':'retirada')+'.')+'</span></li><li><i>3</i><span>Aguarde nossa confirmação. '+(o.sched?'Seu pedido está agendado para hoje às '+o.sched+'.':'Tempo estimado: '+etaText(o.mode)+'.')+'</span></li></ol>'+pixHtml+warn+
   '<a class="wa" href="'+href+'" target="_blank" rel="noopener">Enviar pedido no WhatsApp</a>'+
   '<p class="note">WhatsApp da loja: <span class="mono">'+esc(waPretty())+'</span></p>'+
   '<button type="button" class="ghost full" id="copyMsg">Copiar mensagem do pedido</button>'+
   '<button type="button" class="ghost full" id="doneClose">Voltar ao cardápio</button></div></div>';
  updateBar();
  $('#xClose').onclick=$('#doneClose').onclick=closeLayer;
  $('#copyMsg').onclick=function(){copy(msg,'Mensagem copiada')};
  if($('#copyPix'))$('#copyPix').onclick=function(){if(pixPending()){toast('A chave será enviada pelo WhatsApp');return}copy(S.settings.pix,'Chave Pix copiada')};
}
function copy(t,m){
  function fb(){var el=document.createElement('textarea');el.value=t;document.body.appendChild(el);el.select();try{document.execCommand('copy');toast(m)}catch(e){toast('Selecione e copie o texto')}el.remove()}
  try{navigator.clipboard.writeText(t).then(function(){toast(m)},fb)}catch(e){fb()}
}

document.addEventListener('keydown',function(e){if(e.key==='Escape'&&$('#layer').firstChild)closeLayer()});
renderHero();renderMenu();renderReel();updateBar();netState();
requestAnimationFrame(reelTick);
function refreshAll(){renderMenu();renderReel();renderHero();updateBar()}
window.AleApp={
  setMenu:function(doc){if(applyMenu(doc)){try{localStorage.setItem('aletop_cardapio',JSON.stringify(doc))}catch(e){}refreshAll()}},
  setConfig:function(c){if(applyConfig(c)){try{localStorage.setItem('aletop_config',JSON.stringify(c))}catch(e){}refreshAll()}},
  setPhoto:function(id,src){if(!ALE.fotoOk(src))return;photoCache[id]=src;var it=findItem(id);if(it)it.ph=src;clearTimeout(rerenderT);rerenderT=setTimeout(function(){renderMenu();renderReel()},150)},
  loadPhoto:null
};
document.dispatchEvent(new Event('aleapp-ready'));
})();
