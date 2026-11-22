# Piotr 22.11.2026 po audycie GPT („popraw to wszystko”): skrót oferty i warunek przy obietnicy w hero, stała data końca ceny, dostęp przy przycisku w cenie.
import sys
p = sys.argv[1]; t = open(p, encoding='utf-8').read()
zm = [
 ('<div class="hc-l">Cena kończy się za <b id="hcLicznik">',
  '<div class="hc-l">Cena kończy się 13.12 o 21:00, za <b id="hcLicznik">'),
 ('</b></div></div>\n    <script>(function(){var K=',
  '</b></div><div class="hc-w">Dostęp na rok · około miesiąca po 15 minut dziennie · 30 dni na zwrot</div></div>\n    <script>(function(){var K='),
 ('<p class="bf-koniec">Cena Black Friday kończy się za</p>',
  '<p class="bf-koniec">Cena Black Friday kończy się 13.12 o 21:00, za</p>'),
 ('<a class="btn-kup" data-cta="cena" href="https://kursy.piecplus.pl/s/szybkieczytanieonline2025.html">Kupuję kurs</a>',
  '<a class="btn-kup" data-cta="cena" href="https://kursy.piecplus.pl/s/szybkieczytanieonline2025.html">Kupuję kurs</a>\n      <p class="bf-dostep">Dostęp na cały rok, od razu po zakupie.</p>'),
 ('.hero-cena .hc-l b{color:#fff}',
  '.hero-cena .hc-l b{color:#fff}\n.hero-cena .hc-w{margin-top:6px;font-size:.85rem;font-weight:700;color:rgba(255,255,255,.85);text-wrap:balance}\n.bf-dostep{margin-top:10px;font-size:.95rem;font-weight:700;color:#4a4f63}'),
]
for a, b in zm:
    n = t.count(a)
    if n != 1: sys.exit(f'BŁĄD: {n} trafień dla: {a[:60]}')
    t = t.replace(a, b)
open(p, 'w', encoding='utf-8').write(t); print('ok, zmian:', len(zm))
