# Buduje podgląd landingu BF SC na GitHub Pages: zasoby z serwera, piksel i Clarity zaślepione, noindex.
import re, sys
src, dst = sys.argv[1], sys.argv[2]
s = open(src, encoding='utf8').read(); L = 'https://5plus.edu.pl/szybkie-czytanie-black-friday/'
s = s.replace('src="assets/ulson-avatar.webp"', 'src="https://piotrdacjusz.github.io/landing-szybkie-czytanie/assets/ulson-avatar.webp"')
s = re.sub(r'(src|href|poster|data-src)="(assets/|styles-trzy\.css|app-trzy\.js)', lambda m: f'{m.group(1)}="{L}{m.group(2)}', s)
s = re.sub(r"url\((['\"]?)assets/", lambda m: f"url({m.group(1)}{L}assets/", s)
s = s.replace('<head>', '<head>\n<meta name="robots" content="noindex,nofollow">\n<script>window.fbq=function(){};window.clarity=function(){};try{if(!localStorage.getItem("sc_consent"))localStorage.setItem("sc_consent","none")}catch(e){}</script>', 1)
open(dst, 'w', encoding='utf8').write(s)
