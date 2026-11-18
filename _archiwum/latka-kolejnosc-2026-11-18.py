# Kolejność sekcji wg Piotra 18.11.2026: hero → test tempa → 60 książek → kwadrans (bez 3 filarów) → tempo + Konieczny
# → Piotr Starzyński (bez zdjęcia z GPW) → opinie → oferta → droga krok po kroku → jak działa → sceptyk → reszta bez zmian.
import sys
src = open(sys.argv[1], encoding='utf8').read()
def cut(a, b):
    i = src.index(a); j = src.index(b, i); return i, j
M = {
 'S2': '<!-- ============================================================ 2. WSPÓLNIE',
 'TUN': '<!-- krawędź „wskaźnik tempa”',
 'KON': '<!-- opinia-stoper -->\n<div class="stoper-band"><figure class="stoper"><blockquote>Efekt jest taki',
 'S3': '<!-- ============================================================ 3. WIEM',
 'S5': '<!-- ============================================================ 5. TEST',
 'S6': '<!-- ============================================================ 6. 60',
 'OP': '<!-- ============================================================ 6b.',
 'SC': '<section class="story-call band dark-zone" id="sceptyk"',
 'S7': '<!-- ============================================================ 7. JAK',
 'CN': '<div class="stoper-band"><figure class="stoper"><blockquote>Kupiłem kurs na promocji',
 'KE': '<!-- krawędź „półka z książkami”',
}
pos = {k: src.index(v) for k, v in M.items()}
order = sorted(pos, key=pos.get)
assert order == ['S2','TUN','KON','S3','S5','S6','OP','SC','S7','CN','KE'], order
blk = {k: src[pos[k]:pos[order[n+1]] if n+1 < len(order) else None] for n, k in enumerate(order) if k != 'KE'}
head, tail = src[:pos['S2']], src[pos['KE']:]
# 3 filary out
s2 = blk['S2']; i = s2.index('    <h3 class="filary-h">'); j = s2.index('    <div class="kwadrans-rzad">'); blk['S2'] = s2[:i] + s2[j:]
# GPW photo out (only Slot)
s3 = blk['S3']; i = s3.index('      <figure class="slot-gpw">'); j = s3.index('      <figure class="slot-kor">'); blk['S3'] = s3[:i] + s3[j:]
# split section 7: jak działa / droga
s7 = blk['S7']; k = s7.index('    <h2 class="sec-title" style="margin-top:clamp(40px,7vh,72px)">Twoja droga krok po kroku</h2>')
jak = s7[:k].replace('id="droga" aria-label="Jak działa Szybkie Czytanie Online?"', 'id="jak" aria-label="Jak działa Szybkie Czytanie Online?"').rstrip() + '\n  </div>\n</section>\n\n'
droga = ('<!-- ============================================================ 7b. TWOJA DROGA (pod ofertą, Piotr 18.11) -->\n'
         '<section class="formats band" id="droga" aria-label="Twoja droga krok po kroku">\n  <div class="wrap">\n'
         + s7[k:].replace(' style="margin-top:clamp(40px,7vh,72px)"', '', 1))
jak = jak.replace('7. JAK DZIAŁA + TWOJA DROGA', '7. JAK DZIAŁA (po drodze, Piotr 18.11)')
out = head + blk['S5'] + blk['S6'] + blk['S2'] + blk['TUN'] + blk['KON'] + blk['S3'] + blk['OP'] + blk['CN'] + droga + jak + blk['SC'] + tail
open(sys.argv[2], 'w', encoding='utf8').write(out)
print(len(src), '→', len(out))
