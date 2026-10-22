import json, re, glob, sys
from collections import defaultdict, Counter
A = re.compile(r'<a\s+([^>]*?)href=["\']([^"\']*)["\']([^>]*)>(.*?)</a>', re.I|re.S)
def clean(t): return re.sub(r'\s+',' ',re.sub(r'<[^>]+>','',t)).strip().lower()
def internal(u): return u.startswith('/') 
def norm(u): return u.split('#')[0].rstrip('/') or '/'
def collect():
    m=defaultdict(Counter)
    for f in glob.glob('src/data/blog/*.json'):
        for g in A.finditer(json.load(open(f)).get('html','')):
            a=clean(g.group(4)); u=g.group(2).strip()
            if a and internal(u): m[a][norm(u)]+=1
    for f in glob.glob('src/data/states/*.json'):
        s=json.dumps(json.load(open(f)))
        for g in re.finditer(r'\[([^\]]+)\]\((/[^)]+)\)',s): m[g.group(1).lower()][norm(g.group(2))]+=1
    return m
if __name__=='__main__':
    m=collect(); bad={a:c for a,c in m.items() if len(c)>1}
    empty=sum(len(re.findall(r'href=["\'](#?)["\']',json.load(open(f)).get('html',''))) for f in glob.glob('src/data/blog/*.json'))
    print('anchors',len(m),'conflicts',len(bad),'empty hrefs',empty)
    for a,c in list(bad.items())[:40]: print(' ',repr(a),dict(c))
    sys.exit(1 if bad or empty else 0)
