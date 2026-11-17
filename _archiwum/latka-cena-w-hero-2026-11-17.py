import sys
f=sys.argv[1]; h=open(f).read()
CSS='''<style id="cena-w-hero">/* cena Black Friday w hero nad pierwszym przyciskiem (decyzja Piotra 17.11.2026) */
[hidden]{display:none!important}
.hero-cena{margin:22px auto 4px;text-align:center;line-height:1.15}
.hero-cena .hc-o{font-weight:900;letter-spacing:.24em;text-indent:.24em;text-transform:uppercase;font-size:.8rem;color:#FEAC32}
.hero-cena .hc-c{display:flex;align-items:center;justify-content:center;gap:14px;margin-top:6px}
.hero-cena .hc-s{position:relative;font-size:1.25rem;font-weight:700;color:rgba(255,255,255,.75);white-space:nowrap}
.hero-cena .hc-s:after{content:"";position:absolute;left:-4px;right:-4px;top:50%;height:3px;background:#FEAC32;border-radius:2px;transform:rotate(-7deg)}
.hero-cena .hc-p{font-weight:900;font-size:3rem;line-height:1;color:#FEAC32;white-space:nowrap}
.hero-cena .hc-p small{font-size:1.4rem}
.hero-cena .hc-r{background:#fff;color:#073462;font-weight:900;font-size:1.05rem;padding:4px 11px;border-radius:999px;transform:rotate(-4deg);white-space:nowrap}
.hero-cena .hc-l{margin-top:8px;font-size:.92rem;font-weight:700;color:rgba(255,255,255,.85);font-variant-numeric:tabular-nums}
.hero-cena .hc-l b{color:#fff}
</style>
</head>'''
assert h.count('</head>')==1; h=h.replace('</head>',CSS,1)
BTN='<a class="btn-kup" data-cta="hero"'
assert h.count(BTN)==1
BOX='''<div class="hero-cena"><div class="hc-o">Black Friday</div><div class="hc-c"><span class="hc-s">500 zł</span><span class="hc-p">247<small> zł</small></span><span class="hc-r">−51%</span></div><div class="hc-l">Cena kończy się za <b id="hcLicznik">26 dni</b></div></div>
    <script>(function(){var K=new Date('2026-12-13T21:00:00+01:00').getTime(),e=document.getElementById('hcLicznik'),z=function(x){return(x<10?'0':'')+x};function t(){var r=Math.max(0,Math.floor((K-Date.now())/1000));e.textContent=Math.floor(r/86400)+' dni '+z(Math.floor(r%86400/3600))+':'+z(Math.floor(r%3600/60))+':'+z(r%60)}t();setInterval(t,1000)})();</script>
    '''
h=h.replace(BTN,BOX+BTN,1)
# ukryte (decyzja Piotra 17.11): opinia-stoper po hero, nagłówek „Wspólnie powalczymy” i akapit wstępu; strona zaczyna się po hero od „Czytanie = czas + skupienie”
i=h.index('<!-- opinia-stoper zaraz po hero'); j=h.index('<div class="stoper-band">',i)
h=h[:j]+'<!-- ukryte 17.11.2026 (Piotr) --><div class="stoper-band" hidden>'+h[j+len('<div class="stoper-band">'):]
for old in ['<h2 class="hand-title">Wspólnie powalczymy o Twoje czytanie</h2>','<p class="sec-lead">Chcesz czytać, ale nie masz']:
    assert h.count(old)>=1
    k=h.index(old); tag=old.split('>')[0]
    h=h[:k]+tag+' hidden>'+h[k+len(tag)+1:]
open(f,'w').write(h)
print('ok')
