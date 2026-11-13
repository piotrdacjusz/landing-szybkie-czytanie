(function(){
  'use strict';
  var CENA = 247; /* zł — propozycja 12.11.2026 (D1, czeka na potwierdzenie Piotra): 500 przekreślone → 247, najniższa cena z 30 dni = 500 (szybka sprzedaż od 13.10) */
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

  /* ---------- wskaźnik tempa: 126 (przeciętne) ↔ 630 (po kursie) ---------- */
  (function(){
    var ticks = $('tunerTicks'), needle = $('tunerNeedle'), edge = $('tunerEdge'); if (!ticks) return;
    var B = 46, frag = document.createDocumentFragment();
    for (var i=0, x=0; x<=1200; i++, x=i*18){ var major = i%5===0, ln = document.createElementNS(SVGNS,'line');
      ln.setAttribute('x1',x); ln.setAttribute('x2',x); ln.setAttribute('y1', B-(major?21:10)); ln.setAttribute('y2', B-1);
      ln.setAttribute('stroke','#FFFFFF'); ln.setAttribute('stroke-width', major?2:1); ln.setAttribute('opacity', major?0.72:0.4); ln.setAttribute('vector-effect','non-scaling-stroke'); frag.appendChild(ln); }
    ticks.appendChild(frag);
    var POS = [0.09, 0.91], s = 0;
    function place(f){ needle.style.transform = 'translateX(' + (f * (edge.clientWidth||innerWidth)).toFixed(1) + 'px)'; }
    place(POS[0]);
    if (!REDUCED) setInterval(function(){ s = 1 - s; place(POS[s]); }, 3000);
    addEventListener('resize', function(){ place(POS[s]); });
  })();

  /* ---------- licznik Black Friday (cena BF do 13.12.2026 21:00) ---------- */
  (function(){
    var KONIEC = new Date('2026-12-13T21:00:00+01:00').getTime();
    var d=$('lkD'), h=$('lkH'), m=$('lkM'), s=$('lkS'); if (!d) return;
    function p2(n){ return (n<10?'0':'')+n; }
    function tick(){ var r = Math.max(0, KONIEC - Date.now()), t = Math.floor(r/1000);
      d.textContent = Math.floor(t/86400); h.textContent = p2(Math.floor(t%86400/3600)); m.textContent = p2(Math.floor(t%3600/60)); s.textContent = p2(t%60); }
    tick(); setInterval(tick, 1000);
  })();

  /* ---------- trasa: przystanki zapalają się przy przewijaniu ---------- */
  (function(){
    var route = $('route'), fill = $('routeFill'); if (!route) return;
    var kroki = Array.prototype.slice.call(route.querySelectorAll('.krok'));
    function onScroll(){
      var r = route.getBoundingClientRect(), anchor = innerHeight*0.6;
      var p = Math.max(0, Math.min(1, (anchor - r.top) / r.height));
      fill.style.height = (p*100).toFixed(1) + '%';
      kroki.forEach(function(k){ if (k.getBoundingClientRect().top < anchor) k.classList.add('reached'); });
    }
    addEventListener('scroll', onScroll, {passive:true}); onScroll();
  })();

  /* ---------- krawędzie: półka z książkami (zamiast kopert i equalizera) + park ---------- */
  (function buildEdges(){
    var COL = { las:'#124429', las2:'#195237', krem:'#FFFFFF', krem2:'#DBE9F4', cegla:'#FEAC32', zloto:'#FEAC32', grafit:'#1F2336' };
    var OBJ = COL.grafit;
    function mulberry32(a){ return function(){ a|=0; a=a+0x6D2B79F5|0; var t=Math.imul(a^a>>>15,1|a); t=t+Math.imul(t^t>>>7,61|t)^t; return((t^t>>>14)>>>0)/4294967296; }; }
    function E(t,a){ var e=document.createElementNS(SVGNS,t); for(var k in a) e.setAttribute(k,a[k]); return e; }
    function svgBox(H){ var s=E('svg',{viewBox:'0 0 1200 '+H, preserveAspectRatio:'none'}); s.style.width='100%'; s.style.height=H+'px'; s.style.display='block'; return s; }
    function quadFrom1(pts){ var d=''; for(var i=1;i<pts.length;i++){ var a=pts[i-1], b=pts[i]; d+=' Q '+a[0]+' '+a[1]+' '+((a[0]+b[0])/2)+' '+((a[1]+b[1])/2); } var l=pts[pts.length-1]; d+=' L '+l[0]+' '+l[1]; return d; }
    function anim(el,name,dur,phase){ if(REDUCED) return; el.style.animation = name+' '+(+dur).toFixed(2)+'s ease-in-out '+(-phase).toFixed(2)+'s infinite'; }
    var PALETA = ['#124429','#073462','#FEAC32','#2F6B4C','#DBE9F4','#0E4379','#FFFFFF'];
    function drawBooks(H, gora, dol){
      var s = svgBox(H), r = mulberry32(11), x = 6, SHELF = H - 10;
      s.appendChild(E('rect',{x:-2,y:-2,width:1204,height:H+4,fill:gora}));
      s.appendChild(E('rect',{x:-2,y:SHELF,width:1204,height:H-SHELF+2,fill:dol}));
      while (x < 1196){
        var w = 16 + Math.round(r()*22), h = 46 + Math.round(r()*(H-70)), col = PALETA[Math.floor(r()*PALETA.length)];
        if (col === gora) col = '#FEAC32';
        var y = SHELF - h, g = E('g',{});
        g.appendChild(E('rect',{x:x,y:y,width:w,height:h,rx:2,fill:col,stroke:'rgba(0,0,0,.18)','stroke-width':1}));
        var c2 = (col==='#FFFFFF'||col==='#DBE9F4'||col==='#FEAC32') ? 'rgba(31,35,54,.35)' : 'rgba(255,255,255,.45)';
        g.appendChild(E('rect',{x:x+3,y:y+10,width:w-6,height:3,fill:c2}));
        g.appendChild(E('rect',{x:x+3,y:y+h-16,width:w-6,height:3,fill:c2}));
        if (r() < .08 && x < 1100){ g.setAttribute('transform','rotate(-12 '+(x+w)+' '+SHELF+')'); x += 10; }
        s.appendChild(g); x += w + 2 + Math.round(r()*3);
      }
      return s;
    }
    document.querySelectorAll('.ksiazki-edge').forEach(function(el){ el.appendChild(drawBooks(innerWidth <= 700 ? 96 : 120, el.getAttribute('data-gora'), el.getAttribute('data-dol'))); });
  })();

  /* ---------- zgody, piksel, pomiar (wzorzec z landingu 8 klasy) ---------- */
  var PIXEL_ID = '458793526185383'; /* piksel „Szybkie Czytanie Online” (ten sam co w szybkiej sprzedaży WTL) */
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

  /* ---------- hero: film z ławki (jesień 2025, „Dla przyjemności”) ---------- */
  (function(){ var b=document.getElementById('heroPlay'); if(!b) return;
    b.addEventListener('click', function(){ if (b.classList.contains('is-playing')) return;
      var v=document.createElement('video'); v.src='assets/lawka-jesien.mp4'; v.controls=true; v.autoplay=true; v.playsInline=true; v.setAttribute('playsinline',''); v.setAttribute('title','Szybkie Czytanie Online: stos książek na ławce');
      b.innerHTML=''; b.classList.add('is-playing'); b.appendChild(v); b.removeAttribute('aria-label'); v.play&&v.play().catch(function(){}); try{ track('hero_film_play'); }catch(e){} });
  })();
  /* ---------- przycisk w nawigacji: obrys dopasowany do pigułki ---------- */
  (function(){ var c=document.querySelector('.nav-cta'), r=c&&c.querySelector('.obrys rect'); if(!r) return; function fit(){ r.setAttribute('rx', Math.max(1, c.offsetHeight/2)); } fit(); addEventListener('resize', fit); })();
  track('ViewContent', {content_name:'szybkie-czytanie-online', value:CENA, currency:'PLN'});
  var utm = location.search.replace(/^\?/,'').split('&').filter(function(p){ return /^(utm_|fbclid=)/.test(p); }).join('&');
  document.querySelectorAll('a[data-cta]').forEach(function(a){ a.href = SKLEP + (utm ? '?'+utm : ''); a.addEventListener('click', function(){ track('InitiateCheckout', {content_name:'szybkie-czytanie-online', value:CENA, currency:'PLN', cta_place:a.getAttribute('data-cta')}); }); });
  document.querySelectorAll('details[data-acc]').forEach(function(d){ d.addEventListener('toggle', function(){ if (d.open) track('accordion_open', {card:d.getAttribute('data-acc')||d.id}); }); });
})();
