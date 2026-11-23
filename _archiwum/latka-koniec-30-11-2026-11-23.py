import re,sys
p='index-bf-trzy.html'; t=open(p,encoding='utf8').read(); o=t
zam=[("Cena kończy się 13.12 o 21:00, za <b id=\"hcLicznik\">26 dni</b>","Cena kończy się 30.11 o 21:00, za <b id=\"hcLicznik\">7 dni</b>"),
("new Date('2026-12-13T21:00:00+01:00')","new Date('2026-11-30T21:00:00+01:00')"),
("Cena Black Friday kończy się 13.12 o 21:00, za","Cena Black Friday kończy się 30.11 o 21:00, za"),
("'v5-2211'","'v6-2311'")]
for a,b in zam:
  n=t.count(a); print(n,'×',a[:50]); 
  if n==0: sys.exit('BRAK: '+a)
  t=t.replace(a,b)
open(p,'w',encoding='utf8').write(t)
p='app-trzy.js'; t=open(p,encoding='utf8').read()
for a,b in [("cena BF do 13.12.2026 21:00","cena BF do 30.11.2026 21:00"),("new Date('2026-12-13T21:00:00+01:00')","new Date('2026-11-30T21:00:00+01:00')")]:
  n=t.count(a); print(n,'×',a[:50])
  if n==0: sys.exit('BRAK: '+a)
  t=t.replace(a,b)
open(p,'w',encoding='utf8').write(t)
