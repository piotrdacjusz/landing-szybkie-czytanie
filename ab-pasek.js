/* Test A/B 17.11.2026 (decyzja Piotra): czy cena na pierwszym ekranie zmniejsza wejścia do koszyka „dla sprawdzenia ceny”.
   A = landing bez zmian, B = pasek Black Friday jak na 5plus.edu.pl (z licznikiem) na samej górze strony (klik przewija do sekcji #cena).
   Losowanie 50/50 przy pierwszym wejściu, zapamiętane w localStorage („sc_ab_cena”), wymuszenie: ?ab=a albo ?ab=b.
   Clarity dostaje znacznik ab_cena=A|B dopiero wtedy, gdy sam się załaduje (po zgodzie); ten skrypt Clarity nie ładuje
   i nie tworzy window.clarity, bo landing ładuje Clarity tylko wtedy, gdy window.clarity jeszcze nie istnieje.
   Na stronie podziękowania skrypt tylko oznacza wariant (bez paska). Koniec testu: usunąć znacznik <script src="ab-pasek.js">. */
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

    var font = d.createElement('link'); font.rel = 'stylesheet';
    font.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans:wght@600;800;900&display=swap';
    (d.head || d.documentElement).appendChild(font);
    /* wygląd 1:1 z paskiem na 5plus.edu.pl (decyzja Piotra 17.11), zamiast nazwy kursu licznik */
    var css = d.createElement('style');
    css.textContent =
      '.nkbf{position:relative;z-index:60;display:block;background:#124429;text-decoration:none;font-family:"Noto Sans",system-ui,-apple-system,"Segoe UI",sans-serif;line-height:1.15;color:#073462}' +
      '.nkbf *{box-sizing:border-box;text-decoration:none;font-family:inherit}' +
      '.nkbf-w{max-width:1200px;margin:0 auto;padding:12px 20px;display:flex;align-items:center;justify-content:center;gap:12px 36px;flex-wrap:wrap}' +
      '.nkbf-t{display:flex;flex-direction:column;gap:3px}' +
      '.nkbf-o{font-weight:800;letter-spacing:.2em;text-transform:uppercase;font-size:12px;color:#FEAC32}' +
      '.nkbf-n{font-weight:900;font-size:24px;white-space:nowrap;color:#fff;font-variant-numeric:tabular-nums}' +
      '.nkbf-c{display:flex;align-items:center;gap:14px}' +
      '.nkbf-s{position:relative;font-size:18px;font-weight:600;white-space:nowrap;color:rgba(255,255,255,.8)}' +
      '.nkbf-s:after{content:"";position:absolute;left:-4px;right:-4px;top:50%;height:3px;background:#FEAC32;border-radius:2px;transform:rotate(-7deg)}' +
      '.nkbf-p{font-weight:900;font-size:38px;line-height:1;white-space:nowrap;color:#FEAC32}' +
      '.nkbf-r{background:#fff;font-weight:900;font-size:17px;padding:5px 12px;border-radius:999px;transform:rotate(-4deg);white-space:nowrap;color:#073462}' +
      '.nkbf-b{background:#FEAC32;font-weight:900;font-size:16px;padding:11px 24px;border-radius:999px;white-space:nowrap;color:#073462}' +
      '@media (max-width:767px){.nkbf-w{padding:12px 14px 14px;gap:9px 14px}.nkbf-t{width:100%;align-items:center;text-align:center}.nkbf-o{font-size:11px}.nkbf-n{font-size:21px}.nkbf-c{gap:11px}.nkbf-s{font-size:16px}.nkbf-p{font-size:31px}.nkbf-r{font-size:15px;padding:4px 10px}.nkbf-b{font-size:15px;padding:9px 18px}}' +
      '@media (max-width:359px){.nkbf-n{font-size:19px}.nkbf-p{font-size:27px}.nkbf-b{width:100%;text-align:center}}';
    (d.head || d.documentElement).appendChild(css);

    var KONIEC = new Date('2026-12-13T21:00:00+01:00').getTime();
    var wstaw = function () {
      if (!d.body || d.querySelector('.nkbf')) return;
      var a = d.createElement('a');
      a.className = 'nkbf'; a.href = '#cena'; a.setAttribute('aria-label', 'Promocja Black Friday: 247 zł zamiast 500 zł, do 13 grudnia. Zobacz ofertę');
      a.innerHTML = '<span class="nkbf-w"><span class="nkbf-t"><span class="nkbf-o">Promocja Black Friday</span>' +
        '<span class="nkbf-n">Kończy się za <span id="abLicznik">…</span></span></span>' +
        '<span class="nkbf-c"><span class="nkbf-s">500 zł</span><span class="nkbf-p">247 zł</span><span class="nkbf-r">−51%</span></span>' +
        '<span class="nkbf-b">Zobacz ofertę →</span></span>';
      d.body.insertBefore(a, d.body.firstChild);
      a.addEventListener('click', function () { try { if (typeof window.clarity === 'function') window.clarity('event', 'ab-pasek-klik'); } catch (e) {} });
      /* górne menu landingu jest przyklejone do góry ekranu: dopóki pasek jest widoczny, menu stoi pod nim */
      var nav = d.getElementById('topnav');
      var ustaw = function () { if (nav) nav.style.top = Math.max(0, a.offsetHeight - window.scrollY) + 'px'; };
      ustaw(); window.addEventListener('scroll', ustaw, { passive: true }); window.addEventListener('resize', ustaw);
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
