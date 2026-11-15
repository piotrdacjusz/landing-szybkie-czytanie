/* POGOTOWIE KONCENTRACJI — landing zima 2 (15.11.2026). Skrypt z landingu SC BF (app-trzy.js) bez wskaźnika tempa, licznika i półek;
   zgody, piksel, cofnięcie zgody i przejście UTM jak w index-zima.html (noc 14/15.11, audyt GPT 11). */
(function(){
  'use strict';
  var CENA = 247, KONIEC = '31.12.2026';
  var SKLEP = 'https://kursy.piecplus.pl/s/koncentracja91.html'; /* oferta 91, PK_kampania 247 zł (decyzja Piotra 15.11) */
  var WARIANT = 'zima2';
  var SVGNS = 'http://www.w3.org/2000/svg';
  var $ = function(id){ return document.getElementById(id); };
  document.querySelectorAll('[data-cena]').forEach(function(e){ e.textContent = CENA; });
  document.querySelectorAll('.js-koniec').forEach(function(e){ e.textContent = KONIEC ? 'Cena ' + CENA + ' zł do ' + KONIEC + '.' : ''; }); /* [moje] */

  /* ---------- nav ---------- */
  var nav = $('topnav'), burger = $('navBurger');
  function onScroll(){ nav.classList.toggle('scrolled', scrollY > 40); }
  addEventListener('scroll', onScroll, {passive:true}); onScroll();
  burger.addEventListener('click', function(){ var on = nav.classList.toggle('menu-open'); burger.setAttribute('aria-expanded', on); });
  document.querySelectorAll('.nav-links a').forEach(function(a){ a.addEventListener('click', function(){ nav.classList.remove('menu-open'); burger.setAttribute('aria-expanded','false'); }); });

  /* ---------- trasa: przystanki zapalają się przy przewijaniu, falista linia ---------- */
  (function(){
    var route = $('route'); if (!route) return;
    var kroki = Array.prototype.slice.call(route.querySelectorAll('.krok'));
    var box = route.querySelector('.route-line');
    var svg = document.createElementNS(SVGNS,'svg'), tlo = document.createElementNS(SVGNS,'path'), post = document.createElementNS(SVGNS,'path'), kropka = document.createElementNS(SVGNS,'circle');
    tlo.setAttribute('class','fala'); post.setAttribute('class','fala-postep'); kropka.setAttribute('class','fala-kropka'); kropka.setAttribute('r','6');
    svg.appendChild(tlo); svg.appendChild(post); svg.appendChild(kropka); box.appendChild(svg);
    var dl = 0, koniec = false, KOLORY = ['#FEAC32','#3D8BD9','#0E4379','#C62828','#FEAC32','#073462'];
    function buduj(){
      var hgt = box.getBoundingClientRect().height, d = 'M21 0', y = 0, strona = 1, krok = 70;
      while (y < hgt) { var ny = Math.min(hgt, y + krok); d += ' Q ' + (21 + strona*13) + ' ' + ((y+ny)/2).toFixed(1) + ' 21 ' + ny.toFixed(1); y = ny; strona = -strona; }
      tlo.setAttribute('d', d); post.setAttribute('d', d); dl = post.getTotalLength();
      post.style.strokeDasharray = dl + ' ' + dl; rysuj();
    }
    function rysuj(){
      var r = route.getBoundingClientRect(), anchor = innerHeight*0.6, p = Math.max(0, Math.min(1, (anchor - r.top) / r.height));
      kroki.forEach(function(k){ if (k.getBoundingClientRect().top < anchor) k.classList.add('reached'); });
      post.style.strokeDashoffset = (dl*(1-p)).toFixed(1);
      var pt = post.getPointAtLength(dl*p); kropka.setAttribute('cx', pt.x.toFixed(1)); kropka.setAttribute('cy', pt.y.toFixed(1));
      if (p >= 0.995 && !koniec) { koniec = true; fajerwerki(pt.x, pt.y, 46); setTimeout(function(){ fajerwerki(pt.x, pt.y, 78); }, 260); }
      if (p < 0.9) koniec = false;
    }
    function fajerwerki(x, y, zasieg){
      for (var i = 0; i < 18; i++) { var s = document.createElement('i'); s.className = 'iskra'; var kat = i/18*Math.PI*2 + Math.random()*.3, r = zasieg*(.6 + Math.random()*.6);
        s.style.left = x + 'px'; s.style.top = y + 'px'; s.style.background = KOLORY[i % KOLORY.length];
        s.style.setProperty('--dx', (Math.cos(kat)*r).toFixed(1) + 'px'); s.style.setProperty('--dy', (Math.sin(kat)*r).toFixed(1) + 'px');
        box.appendChild(s); (function(n){ setTimeout(function(){ n.remove(); }, 1150); })(s); }
    }
    buduj(); addEventListener('scroll', rysuj, {passive:true}); addEventListener('resize', buduj); addEventListener('load', buduj);
  })();

  /* ---------- zgody, piksel, pomiar ---------- */
  var PIXEL_ID = '458793526185383'; /* wspólny piksel SC i PK; ładuje się tylko po zgodzie */
  var CLARITY_ID = 'vjr23eh9gx';
  if (/github\.io$/.test(location.hostname)) { PIXEL_ID = ''; CLARITY_ID = ''; } /* podgląd roboczy: bez pomiaru */
  var KEY = 'e5p_consent', consent = null, pending = [];
  try { consent = localStorage.getItem(KEY); } catch(e){}
  function loadPixel(){ if (!PIXEL_ID || window.fbq) return;
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', PIXEL_ID); fbq('track', 'PageView'); }
  function loadClarity(){ if (!CLARITY_ID || window.clarity) return; (function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script",CLARITY_ID);
    try { window.clarity('set', 'lp_variant', WARIANT); } catch(e){} }
  var STD = /^(ViewContent|InitiateCheckout|Purchase|Lead|AddToCart)$/;
  function send(n,p){ if (window.fbq) try { fbq(STD.test(n)?'track':'trackCustom', n, p); } catch(e){} }
  function track(n,p){ p = Object.assign({lp_variant:WARIANT}, p||{}); (window.dataLayer=window.dataLayer||[]).push(Object.assign({event:n},p)); if (consent==='all') send(n,p); else if (consent===null) pending.push([n,p]); }
  var banner = $('cookies');
  function setConsent(v){
    /* cofnięcie zgody: Clarity i Meta dostają odwołanie, strona przeładowuje się bez ich skryptów */
    if (consent === 'all' && v !== 'all') {
      try { localStorage.setItem(KEY, v); } catch(e){}
      try { if (window.clarity) window.clarity('consent', false); } catch(e){}
      try { if (window.fbq) fbq('consent', 'revoke'); } catch(e){}
      location.reload(); return;
    }
    consent = v; try { localStorage.setItem(KEY, v); } catch(e){} banner.hidden = true;
    if (v === 'all') { loadPixel(); loadClarity(); pending.forEach(function(p){ send(p[0], p[1]); }); }
    pending = [];
  }
  banner.querySelectorAll('[data-consent]').forEach(function(b){ b.addEventListener('click', function(){ setConsent(b.getAttribute('data-consent')); }); });
  $('cookieSettings').addEventListener('click', function(){ banner.hidden = false; });
  if (consent === 'all') { loadPixel(); loadClarity(); } else if (consent === null) banner.hidden = false;

  /* ---------- hero: film z dowcipem o taczce (reklama „Spokój jest siłą”, jesień 2025) ---------- */
  (function(){ var b = $('heroPlay'); if (!b) return;
    b.addEventListener('click', function(){ if (b.classList.contains('is-playing')) return;
      var v = document.createElement('video'); v.src = 'assets/film-taczka.mp4'; v.controls = true; v.autoplay = true; v.playsInline = true; v.setAttribute('playsinline',''); v.setAttribute('title','Pogotowie Koncentracji: dowcip o pustej taczce');
      b.innerHTML = ''; b.classList.add('is-playing'); b.appendChild(v); b.removeAttribute('aria-label'); v.play && v.play().catch(function(){}); try { track('hero_film_play'); } catch(e){} });
  })();

  /* ---------- przycisk w nawigacji: kropka obiega obrys ---------- */
  (function(){ var c = document.querySelector('.nav-cta'), r = c && c.querySelector('.obrys rect'); if (!r) return; var an = null;
    function fit(){ var h = c.offsetHeight, w = c.offsetWidth; if (!h || !w) return; var rx = Math.max(1, h/2); r.setAttribute('rx', rx);
      var P = 0; try { P = r.getTotalLength(); } catch(e){} if (!P) P = 2*(w-2*rx) + 2*(h-2*rx) + 2*Math.PI*rx; var k = Math.max(6, P*0.025);
      r.style.strokeDasharray = k.toFixed(1) + ' ' + (P-k).toFixed(1); r.style.strokeDashoffset = P.toFixed(1);
      if (an) { try { an.cancel(); } catch(e){} an = null; }
      if (r.animate) an = r.animate([{strokeDashoffset:P,opacity:0,offset:0},{strokeDashoffset:P*0.867,opacity:1,offset:.04},{strokeDashoffset:0,opacity:1,offset:.34},{strokeDashoffset:0,opacity:0,offset:.38},{strokeDashoffset:0,opacity:0,offset:1}],{duration:6500,iterations:Infinity,delay:1500,easing:'linear'}); }
    fit(); addEventListener('resize', fit); addEventListener('load', fit); })();

  /* ---------- pomiar i przejście do koszyka z UTM ---------- */
  track('ViewContent', {content_name:'pogotowie-koncentracji', value:CENA, currency:'PLN'});
  var utm = location.search.replace(/^\?/,'').split('&').filter(function(p){ return /^(utm_|fbclid=)/.test(p); }).join('&');
  document.querySelectorAll('a[data-cta]').forEach(function(a){
    a.href = SKLEP + (utm ? '?' + utm : '');
    a.addEventListener('click', function(ev){
      track('InitiateCheckout', {content_name:'pogotowie-koncentracji', value:CENA, currency:'PLN', cta_place:a.getAttribute('data-cta')});
      if (consent === 'all' && window.fbq && !ev.metaKey && !ev.ctrlKey && !ev.shiftKey) { ev.preventDefault(); var u = a.href; setTimeout(function(){ location.href = u; }, 250); }
    });
  });
  document.querySelectorAll('details[data-acc]').forEach(function(d){ d.addEventListener('toggle', function(){ if (d.open) track('accordion_open', {card:d.getAttribute('data-acc')}); }); });
})();
