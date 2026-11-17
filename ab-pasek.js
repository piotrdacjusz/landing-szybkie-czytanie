/* Test A/B 17.11.2026 (decyzja Piotra): czy cena na pierwszym ekranie zmniejsza wejścia do koszyka „dla sprawdzenia ceny”.
   A = landing bez zmian, B = pasek Black Friday z ceną i licznikiem nad nagłówkiem hero (klik przewija do sekcji #cena).
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

    var css = d.createElement('style');
    css.textContent =
      '.ab-pasek{display:block;max-width:560px;margin:0 auto 18px;background:#fff;color:#1F2336;border-radius:14px;overflow:hidden;text-decoration:none;text-align:center;box-shadow:0 14px 34px rgba(0,0,0,.35)}' +
      '.ab-pasek .ab-bf{background:#1F2336;color:var(--zloto,#FEAC32);font-weight:900;letter-spacing:.32em;text-indent:.32em;text-transform:uppercase;font-size:.95rem;padding:8px 0}' +
      '.ab-pasek .ab-ceny{display:flex;align-items:center;justify-content:center;gap:10px;flex-wrap:wrap;padding:10px 12px 2px}' +
      '.ab-pasek s{font-weight:900;font-size:1.25rem;color:#C62828;text-decoration-thickness:3px}' +
      '.ab-pasek .ab-rabat{background:#C62828;color:#fff;font-weight:900;font-size:1rem;border-radius:7px;padding:3px 8px;transform:rotate(-4deg)}' +
      '.ab-pasek .ab-nowa{font-weight:900;font-size:2rem;line-height:1;color:#1F2336}' +
      '.ab-pasek .ab-nowa small{font-size:1rem}' +
      '.ab-pasek .ab-licznik{font-size:.9rem;font-weight:700;color:#4a4f63;padding:4px 12px 10px;font-variant-numeric:tabular-nums}' +
      '.ab-pasek .ab-licznik b{color:#1F2336}' +
      '.ab-pasek .ab-zobacz{display:block;background:#F1F5F9;color:#124429;font-weight:800;font-size:.95rem;padding:9px 12px;text-decoration:underline}';
    (d.head || d.documentElement).appendChild(css);

    var KONIEC = new Date('2026-12-13T21:00:00+01:00').getTime();
    var wstaw = function () {
      var miejsce = d.querySelector('.hero .hero-inner');
      if (!miejsce || d.querySelector('.ab-pasek')) return;
      var a = d.createElement('a');
      a.className = 'ab-pasek'; a.href = '#cena'; a.setAttribute('data-ab-klik', 'pasek');
      a.innerHTML = '<div class="ab-bf">Black Friday</div>' +
        '<div class="ab-ceny"><s>500 zł</s><span class="ab-rabat">−51%</span><span class="ab-nowa">247<small> zł</small></span></div>' +
        '<div class="ab-licznik">Cena Black Friday kończy się za <b id="abLicznik">…</b></div>' +
        '<span class="ab-zobacz">Zobacz, co dostajesz w tej cenie</span>';
      miejsce.insertBefore(a, miejsce.firstChild);
      a.addEventListener('click', function () { try { if (typeof window.clarity === 'function') window.clarity('event', 'ab-pasek-klik'); } catch (e) {} });
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
