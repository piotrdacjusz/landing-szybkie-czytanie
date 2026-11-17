/* Test A/B 17.11.2026 (decyzja Piotra): czy cena na pierwszym ekranie zmniejsza wejścia do koszyka „dla sprawdzenia ceny”.
   A = landing bez zmian, B = cena Black Friday z licznikiem w hero, nad pierwszym przyciskiem zakupu (pierwsza wersja z paskiem u góry odrzucona przez Piotra).
   Losowanie 50/50 przy pierwszym wejściu, zapamiętane w localStorage („sc_ab_cena”), wymuszenie: ?ab=a albo ?ab=b.
   Clarity dostaje znacznik ab_cena=A|B dopiero wtedy, gdy sam się załaduje (po zgodzie); ten skrypt Clarity nie ładuje
   i nie tworzy window.clarity, bo landing ładuje Clarity tylko wtedy, gdy window.clarity jeszcze nie istnieje.
   Na stronie podziękowania skrypt tylko oznacza wariant (bez ceny). Koniec testu: usunąć znacznik <script src="ab-pasek.js">. */
(function () {
  try {
    var K = 'sc_ab_cena', v = null, d = document;
    var q = location.search.match(/[?&]ab=(a|b)(?:&|$)/i);
    if (q) v = q[1].toUpperCase();
    if (!v) { try { v = localStorage.getItem(K); } catch (e) {} }
    if (v !== 'A' && v !== 'B') v = Math.random() < 0.5 ? 'A' : 'B';
    try { localStorage.setItem(K, v); } catch (e) {}
    d.documentElement.setAttribute('data-ab', v);
    (window.dataLayer = window.dataLayer || []).push({ event: 'ab_cena', ab_cena: v });
    var n = 0, t = setInterval(function () {
      if (typeof window.clarity === 'function') { try { window.clarity('set', 'ab_cena', v); } catch (e) {} clearInterval(t); }
      else if (++n > 360) clearInterval(t);
    }, 500);
    if (v !== 'B' || /\/dziekuje/.test(location.pathname)) return;

    /* wariant B (Piotr 17.11, druga wersja): cena Black Friday wkomponowana w hero, tuż nad pierwszym przyciskiem zakupu */
    var css = d.createElement('style');
    css.textContent =
      '.ab-cena{margin:22px auto 4px;text-align:center;line-height:1.15}' +
      '.ab-cena .ab-o{font-weight:900;letter-spacing:.24em;text-indent:.24em;text-transform:uppercase;font-size:.8rem;color:#FEAC32}' +
      '.ab-cena .ab-c{display:flex;align-items:center;justify-content:center;gap:14px;margin-top:6px}' +
      '.ab-cena .ab-s{position:relative;font-size:1.25rem;font-weight:700;color:rgba(255,255,255,.75);white-space:nowrap}' +
      '.ab-cena .ab-s:after{content:"";position:absolute;left:-4px;right:-4px;top:50%;height:3px;background:#FEAC32;border-radius:2px;transform:rotate(-7deg)}' +
      '.ab-cena .ab-p{font-weight:900;font-size:3rem;line-height:1;color:#FEAC32;white-space:nowrap}' +
      '.ab-cena .ab-p small{font-size:1.4rem}' +
      '.ab-cena .ab-r{background:#fff;color:#073462;font-weight:900;font-size:1.05rem;padding:4px 11px;border-radius:999px;transform:rotate(-4deg);white-space:nowrap}' +
      '.ab-cena .ab-l{margin-top:8px;font-size:.92rem;font-weight:700;color:rgba(255,255,255,.85);font-variant-numeric:tabular-nums}' +
      '.ab-cena .ab-l b{color:#fff}';
    (d.head || d.documentElement).appendChild(css);

    var KONIEC = new Date('2026-12-13T21:00:00+01:00').getTime();
    var wstaw = function () {
      var btn = d.querySelector('.hero a.btn-kup[data-cta="hero"]');
      if (!btn || d.querySelector('.ab-cena')) return;
      var box = d.createElement('div');
      box.className = 'ab-cena';
      box.innerHTML = '<div class="ab-o">Black Friday</div>' +
        '<div class="ab-c"><span class="ab-s">500 zł</span><span class="ab-p">247<small> zł</small></span><span class="ab-r">−51%</span></div>' +
        '<div class="ab-l">Cena kończy się za <b id="abLicznik">…</b></div>';
      btn.parentNode.insertBefore(box, btn);
      var el = d.getElementById('abLicznik'), dwa = function (x) { return (x < 10 ? '0' : '') + x; };
      var tick = function () {
        var r = Math.max(0, Math.floor((KONIEC - Date.now()) / 1000));
        var dni = Math.floor(r / 86400), h = Math.floor(r % 86400 / 3600), m = Math.floor(r % 3600 / 60), s = r % 60;
        el.textContent = dni + ' dni ' + dwa(h) + ':' + dwa(m) + ':' + dwa(s);
      };
      tick(); setInterval(tick, 1000);
    };
    if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', wstaw); else wstaw();
  } catch (e) {}
})();
