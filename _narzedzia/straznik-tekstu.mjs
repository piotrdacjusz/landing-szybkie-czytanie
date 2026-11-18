// Strażnik tekstu landingu (Piotr 18.11.2026: „najkrótszy scroll, czytelny, bez wdów i bękartów”).
// Uruchom: node _narzedzia/straznik-tekstu.mjs <url> [--szer=360,390]
// Sprawdza na telefonie: wdowy (ostatnia linijka akapitu z jednym słowem), tekst wychodzący poza ekran albo swój kafelek,
// obrazek wystający z kafelka, zbyt duże litery w zwykłym tekście (> 24 px poza nagłówkami i ceną), wysokość sekcji w ekranach.
// Kod wyjścia 1 = są błędy. Nic nie wysyła (piksel i Clarity zaślepione w podglądzie).
import { chromium } from '/Users/piotr/mailer-5plus/silnik-skryptow/skrypty-pod-lekcje/node_modules/playwright/index.mjs';
const url = process.argv[2]; if (!url) { console.log('użycie: node straznik-tekstu.mjs <url> [--szer=360,390]'); process.exit(2); }
const szer = (process.argv.find(a => a.startsWith('--szer=')) || '--szer=360,375,390,414').slice(7).split(',').map(Number);
const b = await chromium.launch(); let bledy = 0;
for (const w of szer) {
  const p = await b.newPage({ viewport: { width: w, height: 800 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await p.addInitScript(() => { window.fbq = () => {}; window.clarity = () => {}; try { localStorage.setItem('sc_consent', 'none'); } catch (e) {} });
  await p.route(/facebook|clarity\.ms|googletagmanager|youtube/, r => r.abort());
  await p.goto(url, { waitUntil: 'load' }); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(800);
  const wynik = await p.evaluate(() => {
    const W = innerWidth, out = { wdowy: [], wyjscia: [], obrazki: [], duze: [], sekcje: [] };
    const widoczny = e => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && !e.closest('[hidden],details:not([open]) > :not(summary)'); };
    const nazwa = e => (e.closest('section,[id]')?.id || '?') + ' › ' + e.tagName.toLowerCase() + (e.className && typeof e.className === 'string' ? '.' + e.className.split(' ')[0] : '');
    const bloki = [...document.querySelectorAll('p,h1,h2,h3,h4,figcaption,li,blockquote,summary span,.hand-big,.hand-cap,.notice-h,.stos-q,.krotko-t,.big-line')].filter(e => widoczny(e) && !e.closest('footer,nav,.cookie,#cookie,[role=dialog]'));
    for (const e of bloki) {
      if ([...e.children].some(c => bloki.includes(c))) continue; // bierzemy najniższy poziom
      const slowa = []; const tw = document.createTreeWalker(e, NodeFilter.SHOW_TEXT); let n;
      while ((n = tw.nextNode())) { const t = n.textContent; const re = /\S+/g; let m; while ((m = re.exec(t))) { const r = document.createRange(); r.setStart(n, m.index); r.setEnd(n, m.index + m[0].length); const rc = r.getClientRects()[0]; if (rc && rc.width) slowa.push({ s: m[0], top: Math.round(rc.top + rc.height / 2), right: rc.right }); } }
      if (!slowa.length) continue;
      const linie = []; for (const s of slowa) { const l = linie.find(l => Math.abs(l.top - s.top) < 6); if (l) l.sl.push(s); else linie.push({ top: s.top, sl: [s] }); }
      linie.sort((a, b) => a.top - b.top);
      const ost = linie[linie.length - 1].sl.filter(s => /[\p{L}\p{N}]/u.test(s.s));
      if (linie.length >= 2 && ost.length === 1) out.wdowy.push(nazwa(e) + ': „' + e.textContent.trim().replace(/\s+/g, ' ').slice(-50) + '” (' + linie.length + ' linijki)');
      const maxR = Math.max(...slowa.map(s => s.right)); if (maxR > W + 1) out.wyjscia.push(nazwa(e) + ': tekst wychodzi poza ekran o ' + Math.round(maxR - W) + ' px');
      const cs = getComputedStyle(e), fs = parseFloat(cs.fontSize), prog = /Caveat/.test(cs.fontFamily) ? 30 : 22; if (fs > prog && !/^H[12]$/.test(e.tagName) && !e.closest('.cena,.hero-cena,.hc-c') && !e.matches('.hero-film figcaption')) out.duze.push(nazwa(e) + ': ' + Math.round(fs) + ' px „' + e.textContent.trim().slice(0, 40) + '”');
    }
    for (const img of document.querySelectorAll('.plogo img,.plogo b,.partner img')) { const k = img.closest('.partner'); if (!k || !widoczny(img)) continue; const a = img.getBoundingClientRect(), c = k.getBoundingClientRect(); if (a.left < c.left - 1 || a.right > c.right + 1 || a.top < c.top - 1 || a.bottom > c.bottom + 1) out.obrazki.push(nazwa(k) + ': „' + (img.alt || img.textContent) + '” wystaje z kafelka'); }
    for (const e of document.querySelectorAll('body *')) { if (!widoczny(e) || e.closest('.tuner-edge,.ksiazki-edge,svg')) continue; const r = e.getBoundingClientRect(); if (r.right > W + 2 && getComputedStyle(e).position !== 'fixed' && !e.closest('[style*="overflow"],.video-frame')) { out.wyjscia.push(nazwa(e) + ': element szerszy niż ekran (' + Math.round(r.right - W) + ' px)'); break; } }
    for (const s of document.querySelectorAll('main > section')) if (widoczny(s)) out.sekcje.push((s.id || s.className.split(' ')[0]) + ' ' + (s.offsetHeight / innerHeight).toFixed(1));
    out.calosc = (document.documentElement.scrollHeight / innerHeight).toFixed(1);
    return out;
  });
  const n = wynik.wdowy.length + wynik.wyjscia.length + wynik.obrazki.length + wynik.duze.length; bledy += n;
  console.log(`\n=== ${w} px: ${n} uwag, strona = ${wynik.calosc} ekranu`);
  for (const [k, t] of [['wdowy', 'WDOWA'], ['wyjscia', 'POZA EKRAN'], ['obrazki', 'WYSTAJE'], ['duze', 'ZA DUŻE']]) for (const x of wynik[k]) console.log(t + '  ' + x);
  console.log('sekcje (ekrany): ' + wynik.sekcje.join(' · '));
  await p.close();
}
await b.close(); process.exit(bledy ? 1 : 0);
