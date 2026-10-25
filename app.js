(function(){
  'use strict';
  var CENA = 197; /* zł — decyzja Piotra 25.10.2026: 500 przekreślone → 197, najniższa cena z 30 dni = 500 (szybka sprzedaż od 13.10) */
  var SKLEP = 'https://kursy.piecplus.pl/s/szybkieczytanieonline2025.html';
  var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var SVGNS = 'http://www.w3.org/2000/svg';
  var $ = function(id){ return document.getElementById(id); };
  function fmt(n){ return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }
  document.querySelectorAll('[data-cena]').forEach(function(e){ e.textContent = fmt(CENA); });

  /* ---------- nav ---------- */
  var nav = $('topnav'), burger = $('navBurger');
  function onScroll(){ nav.classList.toggle('scrolled', scrollY > 40); }
  addEventListener('scroll', onScroll, {passive:true}); onScroll();
  burger.addEventListener('click', function(){ var on = nav.classList.toggle('menu-open'); burger.setAttribute('aria-expanded', on); });
  document.querySelectorAll('.nav-links a').forEach(function(a){ a.addEventListener('click', function(){ nav.classList.remove('menu-open'); burger.setAttribute('aria-expanded','false'); }); });

  /* ---------- deck: trzy pytania ---------- */
  var Q = [
    {k:'NAUCZ SIĘ 1 / 3', t:'Naucz się skupienia', d:'Żeby nie miało znaczenia, czy czytasz w fotelu, czy zatłoczonym autobusie.', href:'#droga'},
    {k:'NAUCZ SIĘ 2 / 3', t:'Naucz się wychwytywać kluczowe słowa i filtrować informacje', d:'Żeby od razu wiedzieć, który tekst warto przeczytać.', href:'#droga'},
    {k:'NAUCZ SIĘ 3 / 3', t:'Naucz się czytać szybko i ze zrozumieniem', d:'Po kwadransie kursu przyspieszysz swoje czytanie dwukrotnie. Poźniej zamiast jednej książki będziesz czytać pięć.', href:'#droga'}
  ];
  var qi = 0, dots = [], auto = true, info = $('deckInfo'), items = document.querySelectorAll('.ep-item');
  function showQ(n){
    qi = (n + Q.length) % Q.length; var q = Q[qi];
    function set(){ $('epKicker').textContent = q.k; $('epTitle').textContent = q.t; $('epDesc').textContent = q.d; $('playQ').setAttribute('href', q.href); info.style.opacity = 1; }
    if (REDUCED) set(); else { info.style.opacity = 0; setTimeout(set, 300); }
    dots.forEach(function(d,k){ d.setAttribute('aria-current', k===qi ? 'true' : 'false'); });
    items.forEach(function(it,k){ it.setAttribute('aria-current', k===qi ? 'true' : 'false'); });
  }
  Q.forEach(function(q,k){ var b = document.createElement('button'); b.type='button'; b.className='ep-dot'; b.setAttribute('aria-label', q.k); b.addEventListener('click', function(){ auto=false; showQ(k); }); $('epDots').appendChild(b); dots.push(b); });
  dots[0].setAttribute('aria-current','true');
  $('prevQ').addEventListener('click', function(){ auto=false; showQ(qi-1); });
  $('nextQ').addEventListener('click', function(){ auto=false; showQ(qi+1); });
  items.forEach(function(it){ it.addEventListener('mouseenter', function(){ auto=false; showQ(+it.getAttribute('data-q')); }); });
  if (!REDUCED) setInterval(function(){ if (auto) showQ(qi+1); }, 6000);

  /* ---------- taśma strojenia ---------- */
  (function(){
    var ticks = $('tunerTicks'), needle = $('tunerNeedle'), edge = $('tunerEdge'); if (!ticks) return;
    var B = 46, frag = document.createDocumentFragment();
    for (var i=0, x=0; x<=1200; i++, x=i*18){ var major = i%5===0, ln = document.createElementNS(SVGNS,'line');
      ln.setAttribute('x1',x); ln.setAttribute('x2',x); ln.setAttribute('y1', B-(major?21:10)); ln.setAttribute('y2', B-1);
      ln.setAttribute('stroke','#F4EAD5'); ln.setAttribute('stroke-width', major?2:1); ln.setAttribute('opacity', major?0.72:0.4); ln.setAttribute('vector-effect','non-scaling-stroke'); frag.appendChild(ln); }
    ticks.appendChild(frag);
    var seq = [0.38, 0.22, 0.61, 0.38, 0.74, 0.45], s = 0;
    function place(f){ needle.style.transform = 'translateX(' + (f * (edge.clientWidth||innerWidth)).toFixed(1) + 'px)'; }
    place(seq[0]);
    if (!REDUCED) setInterval(function(){ s=(s+1)%seq.length; place(seq[s]); }, 3400);
    addEventListener('resize', function(){ place(seq[s]); });
  })();

  /* ---------- kalkulator ---------- */
  var range = $('korki');
  function calc(){ var m = +range.value, rok = m*10; $('korkiVal').innerHTML = fmt(m) + ' <small>zł / mies.</small>'; $('rok').innerHTML = fmt(rok) + ' <small>zł</small>'; $('razy').textContent = Math.round(rok/CENA) + '×'; }
  if (range){ range.addEventListener('input', calc); calc(); }

  /* ---------- szyna opinii: przeciąganie ---------- */
  (function(){ var rail = $('blogRail'), down=false, sx=0, sl=0;
    rail.addEventListener('pointerdown', function(e){ down=true; sx=e.clientX; sl=rail.scrollLeft; rail.classList.add('dragging'); });
    addEventListener('pointerup', function(){ down=false; rail.classList.remove('dragging'); });
    rail.addEventListener('pointermove', function(e){ if(!down) return; rail.scrollLeft = sl - (e.clientX - sx); });
  })();

  /* ---------- trasa z przystankami ---------- */
  var trailEl = $('trail'), trailSvg = $('trailSvg'), trailPath = $('trailPath'), trailDone, wanderer, halo, stopDots = [], marks = [], trailLen = 0, pinPts = [];
  var stops = Array.prototype.slice.call(document.querySelectorAll('.stop'));
  function crPath(p){ var d='M'+p[0].x.toFixed(1)+' '+p[0].y.toFixed(1); for (var i=0;i<p.length-1;i++){ var p0=p[Math.max(i-1,0)],p1=p[i],p2=p[i+1],p3=p[Math.min(i+2,p.length-1)];
    d+=' C '+(p1.x+(p2.x-p0.x)/6).toFixed(1)+' '+(p1.y+(p2.y-p0.y)/6).toFixed(1)+', '+(p2.x-(p3.x-p1.x)/6).toFixed(1)+' '+(p2.y-(p3.y-p1.y)/6).toFixed(1)+', '+p2.x.toFixed(1)+' '+p2.y.toFixed(1); } return d; }
  function genTrail(){
    var W = trailEl.clientWidth, H = trailEl.offsetHeight, tr = trailEl.getBoundingClientRect(), mobile = innerWidth <= 900, pts = [], cx = W/2;
    pinPts = [];
    pts.push({x: mobile ? 26 : cx, y: 0});
    stops.forEach(function(st, i){
      var card = st.querySelector('.fmt').getBoundingClientRect(), side = st.querySelector('.stop-side').getBoundingClientRect();
      var top = card.top - tr.top, bot = side.bottom - tr.top, mid = top + (card.height)/2;
      if (mobile){
        var pin = {x: 26, y: top + 30}; pinPts.push(pin);
        pts.push({x: 20 + (i%2?8:0), y: top - 10}); pts.push(pin); pts.push({x: 34 - (i%2?8:0), y: bot - 10});
      } else {
        var left = (i % 2 === 1); /* nth-child liczy od SVG: 1. przystanek jest po prawej; karta po lewej → trasa po prawej */
        var xSide = left ? card.right - tr.left + 70 : card.left - tr.left - 70;
        var pin = {x: xSide, y: top + 40}; pinPts.push(pin);
        pts.push(pin); pts.push({x: xSide + (left?22:-22), y: mid + 60}); pts.push({x: cx, y: bot + 30});
      }
    });
    pts.push({x: mobile ? 26 : cx, y: H});
    trailSvg.setAttribute('viewBox', '0 0 '+W+' '+H);
    var d = crPath(pts); trailPath.setAttribute('d', d); trailLen = trailPath.getTotalLength();
    if (!trailDone){
      trailDone = trailPath.cloneNode(); trailDone.id='trailDone'; trailSvg.appendChild(trailDone);
      stops.forEach(function(st){ var sa = st.style.getPropertyValue('--sa') || 'var(--mech)'; var c = document.createElementNS(SVGNS,'circle'); c.setAttribute('class','stop-dot'); c.setAttribute('r','6'); c.style.setProperty('--sa', sa); trailSvg.appendChild(c); stopDots.push(c); });
      halo = document.createElementNS(SVGNS,'circle'); halo.id='wandererHalo'; halo.setAttribute('r','13'); trailSvg.appendChild(halo);
      wanderer = document.createElementNS(SVGNS,'circle'); wanderer.id='wanderer'; wanderer.setAttribute('r','7'); trailSvg.appendChild(wanderer);
    } else trailDone.setAttribute('d', d);
    trailDone.style.strokeDasharray = trailLen+' '+trailLen;
    /* znaczniki przystanków = najbliższy punkt ścieżki do pina */
    marks = []; var N = 400, samples = [];
    for (var i=0;i<=N;i++){ var l = trailLen*i/N, pt = trailPath.getPointAtLength(l); samples.push({l:l,x:pt.x,y:pt.y}); }
    pinPts.forEach(function(a, i){ var best=0, bd=1e18; samples.forEach(function(s){ var dd=(s.x-a.x)*(s.x-a.x)+(s.y-a.y)*(s.y-a.y); if(dd<bd){bd=dd;best=s.l;} }); marks.push(best);
      stopDots[i].setAttribute('cx', a.x.toFixed(1)); stopDots[i].setAttribute('cy', a.y.toFixed(1)); });
    setProgress(lastP);
  }
  var lastP = 0;
  function setProgress(p){
    lastP = p; var drawn = p*trailLen;
    trailDone.style.strokeDashoffset = Math.max(0, trailLen - drawn);
    var pt = trailPath.getPointAtLength(drawn);
    wanderer.setAttribute('cx', pt.x); wanderer.setAttribute('cy', pt.y); halo.setAttribute('cx', pt.x); halo.setAttribute('cy', pt.y);
    var vis = p > .002 && p < .998; wanderer.style.opacity = vis?1:0; halo.style.opacity = vis?.35:0;
    marks.forEach(function(m, i){ if (m <= drawn + 1){ stops[i].classList.add('reached'); stopDots[i].classList.add('reached'); } });
  }
  function onTrailScroll(){
    var r = trailEl.getBoundingClientRect(), anchor = innerHeight*0.72;
    var p = (anchor - r.top) / r.height; p = Math.max(0, Math.min(1, p));
    setProgress(p);
  }
  if (!REDUCED) document.documentElement.classList.add('js-motion');
  genTrail(); onTrailScroll();
  addEventListener('scroll', onTrailScroll, {passive:true});
  addEventListener('resize', function(){ genTrail(); onTrailScroll(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function(){ genTrail(); onTrailScroll(); });
  document.querySelectorAll('#trail details').forEach(function(d){ d.addEventListener('toggle', function(){ var t=0; var iv=setInterval(function(){ genTrail(); onTrailScroll(); if(++t>12) clearInterval(iv); }, 40); }); });
  if (REDUCED){ stops.forEach(function(s){ s.classList.add('reached'); }); stopDots.forEach(function(d){ d.classList.add('reached'); }); }

  /* ---------- krawędzie (1:1 z home.js Radia Bielany) ---------- */
  (function buildEdges(){
    var COL = { las:'#123526', las2:'#16402E', krem:'#F4EAD5', krem2:'#EFE4CC', cegla:'#C7512D', zloto:'#E8A33D', grafit:'#191917' };
    var OBJ = COL.grafit;
    function mulberry32(a){ return function(){ a|=0; a=a+0x6D2B79F5|0; var t=Math.imul(a^a>>>15,1|a); t=t+Math.imul(t^t>>>7,61|t)^t; return((t^t>>>14)>>>0)/4294967296; }; }
    function E(t,a){ var e=document.createElementNS(SVGNS,t); for(var k in a) e.setAttribute(k,a[k]); return e; }
    function svgBox(H){ var s=E('svg',{viewBox:'0 0 1200 '+H, preserveAspectRatio:'none'}); s.style.width='100%'; s.style.height=H+'px'; s.style.display='block'; return s; }
    function quadFrom1(pts){ var d=''; for(var i=1;i<pts.length;i++){ var a=pts[i-1], b=pts[i]; d+=' Q '+a[0]+' '+a[1]+' '+((a[0]+b[0])/2)+' '+((a[1]+b[1])/2); } var l=pts[pts.length-1]; d+=' L '+l[0]+' '+l[1]; return d; }
    function anim(el,name,dur,phase){ if(REDUCED) return; el.style.animation = name+' '+(+dur).toFixed(2)+'s ease-in-out '+(-phase).toFixed(2)+'s infinite'; }
    function drawEqualizer(H){ var s=svgBox(H), r=mulberry32(23), x=0;
      while(x<1200){ var w=13+Math.round(r()*22), h=8+Math.round(r()*34), rad=Math.min(w/2,5), topY=H-h;
        var d='M '+x+' '+(H+2)+' L '+x+' '+(topY+rad)+' Q '+x+' '+topY+' '+(x+rad)+' '+topY+' L '+(x+w-rad)+' '+topY+' Q '+(x+w)+' '+topY+' '+(x+w)+' '+(topY+rad)+' L '+(x+w)+' '+(H+2)+' Z';
        var p=E('path',{d:d, fill:COL.las, 'class':'eq-bar'}); var amp=0.12+r()*0.18, dur=1.7+r()*1.5, phase=r()*dur;
        p.style.setProperty('--lo',(1-amp).toFixed(3)); p.style.setProperty('--hi',(1+amp).toFixed(3)); anim(p,'eqbreath',dur,phase); s.appendChild(p); x+=w+(8+Math.round(r()*11)); }
      return s; }
    var G_TOP=112, G_DIP=8, OBJ_BOTTOM=G_TOP+G_DIP;
    function svgObj(vbW,vbH,inner){ return '<svg viewBox="0 0 '+vbW+' '+vbH+'" preserveAspectRatio="xMidYMax meet" xmlns="'+SVGNS+'">'+inner+'</svg>'; }
    function crown(cs){ return cs.map(function(c){ return '<circle cx="'+c[0]+'" cy="'+c[1]+'" r="'+c[2]+'" fill="'+OBJ+'"/>'; }).join(''); }
    function trunk(cx,wBot,wTop,yTop,yBot){ var bl=cx-wBot/2,br=cx+wBot/2,tl=cx-wTop/2,tr=cx+wTop/2; return '<path fill="'+OBJ+'" d="M '+bl+' '+yBot+' L '+tl+' '+yTop+' L '+tr+' '+yTop+' L '+br+' '+yBot+' Z"/>'; }
    function treeA(){ return {vbW:120,vbH:150,inner:trunk(60,15,8,92,150)+crown([[60,56,38],[34,66,24],[86,64,26],[44,40,25],[80,42,23],[62,29,22],[60,80,20],[24,54,15],[96,52,15]])}; }
    function treeB(){ return {vbW:96,vbH:132,inner:trunk(48,12,6.5,84,132)+crown([[48,52,30],[30,62,20],[66,60,21],[37,35,19],[61,33,18],[48,22,17],[48,72,17],[20,50,12],[76,48,12]])}; }
    function treeC(){ return {vbW:78,vbH:104,inner:trunk(39,10,5.5,66,104)+crown([[39,44,24],[24,52,16],[54,50,17],[30,30,15],[48,28,14],[39,20,13],[39,60,14]])}; }
    function benchSVG(){ var L=OBJ, p='';
      p+='<path fill="'+L+'" d="M 8 8 L 15 8 L 15 24 L 26 24 L 26 30 L 15 30 L 15 33 L 20 46 L 13 46 L 8 33 Z"/>';
      p+='<path fill="'+L+'" d="M 122 8 L 115 8 L 115 24 L 104 24 L 104 30 L 115 30 L 115 33 L 110 46 L 117 46 L 122 33 Z"/>';
      p+='<rect x="15" y="9" width="100" height="5.5" rx="2.5" fill="'+L+'"/><rect x="15" y="17" width="100" height="5.5" rx="2.5" fill="'+L+'"/><rect x="10" y="27" width="110" height="6.5" rx="2.5" fill="'+L+'"/><rect x="40" y="33" width="6" height="13" fill="'+L+'"/><rect x="84" y="33" width="6" height="13" fill="'+L+'"/>';
      return {vbW:130,vbH:48,inner:p}; }
    function lanternSVG(){ var L=OBJ, cx=22, p=''; p+=trunk(cx,9,5.5,44,150); p+='<rect x="'+(cx-11)+'" y="145" width="22" height="6" rx="2" fill="'+L+'"/><path fill="'+L+'" d="M 10 44 L 34 44 L 30 22 L 14 22 Z"/><path fill="'+L+'" d="M 8 22 L 36 22 L 22 9 Z"/><circle cx="22" cy="7" r="2.6" fill="'+L+'"/>'; return {vbW:44,vbH:150,inner:p,headLocal:[22,33]}; }
    function placeObj(wrap,obj,leftPct,renderH){ var w=renderH*obj.vbW/obj.vbH, top=OBJ_BOTTOM-renderH; var d=document.createElement('div'); d.className='park-obj'; d.style.left=leftPct+'%'; d.style.top=top+'px'; d.style.width=w.toFixed(1)+'px'; d.style.height=renderH+'px'; d.style.transform='translateX(-50%)'; d.innerHTML=svgObj(obj.vbW,obj.vbH,obj.inner); wrap.appendChild(d); }
    function drawPark(H){ var wrap=document.createElement('div'); wrap.style.cssText='position:relative;height:'+H+'px;background:'+COL.krem2+';overflow:hidden';
      var s=svgBox(H); s.style.position='absolute'; s.style.left='0'; s.style.top='0';
      var g=[[-2,G_TOP+2],[170,G_TOP-2],[380,G_TOP+1],[600,G_TOP-1],[820,G_TOP+2],[1030,G_TOP-1],[1202,G_TOP+1]];
      s.appendChild(E('path',{d:'M -2 '+(H+2)+' L -2 '+g[0][1]+quadFrom1(g)+' L 1202 '+(H+2)+' Z', fill:COL.grafit})); wrap.appendChild(s);
      var pool=document.createElement('div'); pool.className='lamp-glow'; pool.style.left='63.5%'; pool.style.top=(G_TOP-6)+'px'; pool.style.width='210px'; pool.style.height='132px'; anim(pool,'lampPulse',4.5,0); wrap.appendChild(pool);
      placeObj(wrap,treeA(),13,112); placeObj(wrap,treeB(),31,94); placeObj(wrap,treeC(),85,74); placeObj(wrap,benchSVG(),65,36);
      var lan=lanternSVG(); placeObj(wrap,lan,60,118); var scale=118/lan.vbH, headY=(OBJ_BOTTOM-118)+lan.headLocal[1]*scale;
      var head=document.createElement('div'); head.className='lamp-glow lamp-glow--head'; head.style.left='60%'; head.style.top=headY+'px'; head.style.width='92px'; head.style.height='92px'; anim(head,'lampPulse',4.5,0); wrap.appendChild(head);
      var dot=document.createElement('div'); dot.className='lamp-dot'; dot.style.left='60%'; dot.style.top=headY+'px'; anim(dot,'dotPulse',4.5,0); wrap.appendChild(dot);
      return wrap; }
    var KOP_DK='rgba(18,53,38,';
    function envSVG(w,h,type,stamp){ var dk=KOP_DK;
      var g='<rect x="0.5" y="0.5" width="'+(w-1)+'" height="'+(h-1)+'" rx="4.5" fill="'+COL.krem+'" stroke="'+dk+'.16)" stroke-width="1"/>';
      g+='<rect x="1.5" y="1.5" width="'+(w-3)+'" height="'+(h*0.42).toFixed(1)+'" rx="4" fill="rgba(255,255,255,.28)"/>';
      if(type==='env'){ g+='<path d="M1 2 L '+(w/2)+' '+(h*0.54).toFixed(1)+' L '+(w-1)+' 2" fill="none" stroke="'+dk+'.28)" stroke-width="1.3"/>'; g+='<path d="M2 '+(h-2)+' L '+(w/2)+' '+(h*0.48).toFixed(1)+' L '+(w-2)+' '+(h-2)+'" fill="none" stroke="'+dk+'.14)" stroke-width="1"/>'; }
      else { g+='<line x1="'+(w*0.52).toFixed(1)+'" y1="7" x2="'+(w*0.52).toFixed(1)+'" y2="'+(h-7)+'" stroke="'+dk+'.16)" stroke-width="1"/>'; for(var k=0;k<3;k++){ var yy=(h*(0.34+k*0.16)).toFixed(1); g+='<line x1="'+(w*0.58).toFixed(1)+'" y1="'+yy+'" x2="'+(w-10)+'" y2="'+yy+'" stroke="'+dk+'.2)" stroke-width="1.3"/>'; } g+='<rect x="9" y="'+(h*0.3).toFixed(1)+'" width="'+(w*0.34).toFixed(1)+'" height="'+(h*0.4).toFixed(1)+'" rx="2" fill="'+dk+'.05)"/>'; }
      if(stamp){ var sx=w-25, sy=6; g+='<rect x="'+sx+'" y="'+sy+'" width="18" height="21" rx="1.5" fill="'+stamp+'"/><rect x="'+(sx+2)+'" y="'+(sy+2)+'" width="14" height="17" rx="1" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="1" stroke-dasharray="2 1.6"/><path d="M '+(sx-17)+' '+(sy+6)+' q 4 -3 8 0 t 8 0 t 8 0" fill="none" stroke="'+dk+'.32)" stroke-width="1.2"/><path d="M '+(sx-17)+' '+(sy+11)+' q 4 -3 8 0 t 8 0 t 8 0" fill="none" stroke="'+dk+'.22)" stroke-width="1.2"/>'; }
      return '<svg width="'+w+'" height="'+h+'" viewBox="0 0 '+w+' '+h+'" style="display:block;overflow:visible;filter:drop-shadow(0 7px 13px rgba(18,53,38,.22))">'+g+'</svg>'; }
    function drawKoperty(){ var narrow=innerWidth<=700, H=narrow?158:190, yB=narrow?44:50;
      var wrap=document.createElement('div'); wrap.style.cssText='position:relative;height:'+H+'px;background:'+COL.krem;
      var s=svgBox(H); s.style.position='absolute'; s.style.left='0'; s.style.top='0'; var rr=mulberry32(3), amp=4, n=12, pts=[];
      for(var i=0;i<=n;i++){ var x=Math.round(i*1200/n), y=yB+Math.sin(i*1.15+3)*amp*0.45+(rr()-0.5)*amp*0.9; pts.push([x,+y.toFixed(1)]); }
      pts[0][0]=-2; pts[n][0]=1202; s.appendChild(E('path',{d:'M -2 -2 L -2 '+pts[0][1]+quadFrom1(pts)+' L 1202 -2 Z', fill:COL.las2})); wrap.appendChild(s);
      var WIDE=[[10,40,-8,122,78,'env',COL.cegla],[26,60,6,128,82,'card',COL.zloto],[39,45,-3,108,72,'env',null],[55,63,9,120,80,'card',COL.cegla],[72,43,-6,116,78,'env',COL.zloto],[89,57,4,104,72,'env',null]];
      var NARROW=[[16,34,-6,88,64,'env',COL.cegla],[39,50,6,96,68,'card',COL.zloto],[63,37,-4,84,60,'env',null],[86,52,4,80,60,'env',COL.cegla]];
      (narrow?NARROW:WIDE).forEach(function(e,i){ var d=document.createElement('div'); d.className='kop-ov'; d.style.cssText='left:'+e[0]+'%;top:'+e[1]+'px;transform:translateX(-50%) rotate('+e[2]+'deg);z-index:'+(i+2); d.innerHTML=envSVG(e[3],e[4],e[5],e[6]); wrap.appendChild(d); });
      return wrap; }
    document.querySelectorAll('.eq-edge').forEach(function(h){ h.appendChild(drawEqualizer(130)); });
    document.querySelectorAll('.kop-edge').forEach(function(h){ h.appendChild(drawKoperty()); });
    $('park-edge').appendChild(drawPark(170));
  })();

  /* ---------- zgody, piksel, pomiar (wzorzec z landingu 8 klasy) ---------- */
  var PIXEL_ID = ''; /* TODO: ID Piksela Meta fundacji. Pusty = piksel się nie ładuje. */
  var CLARITY_ID = 'vjr23eh9gx';
  var KEY = 'sc_consent', consent = null, pending = [];
  try { consent = localStorage.getItem(KEY); } catch(e){}
  function loadPixel(){ if (!PIXEL_ID || window.fbq) return;
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', PIXEL_ID); fbq('track', 'PageView'); }
  function loadClarity(){ if (window.clarity) return; (function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script",CLARITY_ID); }
  var STD = /^(ViewContent|InitiateCheckout|Purchase|Lead|AddToCart)$/;
  function send(n,p){ if (window.fbq) try { fbq(STD.test(n)?'track':'trackCustom', n, p); } catch(e){} }
  function track(n,p){ p=p||{}; (window.dataLayer=window.dataLayer||[]).push(Object.assign({event:n},p)); if (consent==='all') send(n,p); else if (consent===null) pending.push([n,p]); }
  var banner = $('cookies');
  function setConsent(v){ consent=v; try{ localStorage.setItem(KEY,v); }catch(e){} banner.hidden=true; if(v==='all'){ loadPixel(); loadClarity(); pending.forEach(function(p){ send(p[0],p[1]); }); } pending=[]; }
  banner.querySelectorAll('[data-consent]').forEach(function(b){ b.addEventListener('click', function(){ setConsent(b.getAttribute('data-consent')); }); });
  $('cookieSettings').addEventListener('click', function(){ banner.hidden=false; });
  if (consent==='all'){ loadPixel(); loadClarity(); } else if (consent===null) banner.hidden=false;
  track('ViewContent', {content_name:'szybkie-czytanie-online', value:CENA, currency:'PLN'});
  var utm = location.search.replace(/^\?/,'').split('&').filter(function(p){ return /^(utm_|fbclid=)/.test(p); }).join('&');
  document.querySelectorAll('a[data-cta]').forEach(function(a){ a.href = SKLEP + (utm ? '?'+utm : ''); a.addEventListener('click', function(){ track('InitiateCheckout', {content_name:'szybkie-czytanie-online', value:CENA, currency:'PLN', cta_place:a.getAttribute('data-cta')}); }); });
  document.querySelectorAll('details[data-acc], #trail details').forEach(function(d){ d.addEventListener('toggle', function(){ if (d.open) track('accordion_open', {card:d.getAttribute('data-acc')||d.id}); }); });
})();
