import urllib.request, re, gzip

def get_og(url):
    req = urllib.request.Request(url, headers={'User-Agent':'Mozilla/5.0','Accept-Encoding':'gzip'})
    resp = urllib.request.urlopen(req, timeout=15)
    data = resp.read()
    if resp.info().get('Content-Encoding')=='gzip':
        data = gzip.decompress(data)
    html = data.decode('utf-8','ignore')
    m = re.search(r'og:image[^>]*content="([^"]+)"', html)
    return m.group(1) if m else 'NONE'

urls=[
    'https://www.cuisinonsencouleurs.fr/2018/10/khizou-mchermel-salade-carottes-marocaine.html',
    'https://www.cuisinonsencouleurs.fr/2018/10/loubia-les-haricots-blancs-a-la-marocaine.html',
    'https://www.cuisinonsencouleurs.fr/2018/10/pastilla-au-poulet-et-aux-amandes.html',
    'https://www.cuisinonsencouleurs.fr/2018/05/rghayef-dial-lferan-litteralement-rghayef-du-four.html',
    'https://www.cuisinonsencouleurs.fr/2018/05/harcha-aux-olives-noires-aux-tomates-sechees.html',
    'https://www.cuisinonsencouleurs.fr/2018/05/briouates-aux-crevettes-et-a-la-vermicelle-de-chine.html',
    'https://www.cuisinonsencouleurs.fr/2018/04/tajine-de-veau-aux-oignons-aux-tomates.html',
    'https://www.cuisinonsencouleurs.fr/2018/03/bissara-puree-de-feves-sechees.html',
]
for u in urls:
    try:
        print(get_og(u))
    except Exception as e:
        print(f'ERROR: {e}')
