import os, re, sys, traceback

LOG = 'c:/Users/49708/Documents/GitHub/xllgreen.github.io/worker/jh_log.txt'
def log(*a):
    with open(LOG, 'a', encoding='utf-8') as f:
        f.write(' '.join(str(x) for x in a) + '\n')

log('START')

SRC = 'c:/Users/49708/Documents/GitHub/xllgreen.github.io/worker/html-tools-main/tools'
OUT = 'c:/Users/49708/Documents/GitHub/xllgreen.github.io/tools'
TEMPLATE = 'c:/Users/49708/Documents/GitHub/xllgreen.github.io/worker/tool_template.html'

SKIP = {
    'base64-encode', 'base64-decode', 'timestamp-converter', 'qr-code-generator',
    'password-generator', 'color-picker', 'unit-converter', 'word-counter',
    'hash-generator', 'morse-code-encode', 'morse-code-decode', 'countdown-timer',
    'json-formatter', 'markdown-to-html',
}

def slugify(name):
    return 'jh-' + name

def extract(head, body):
    m = re.search(r'<style>(.*?)</style>', head, re.S)
    style = m.group(1) if m else ''
    style = re.sub(r'(?s)body\s*\{', '.tool-wrap {', style, count=1)
    body = re.sub(r'<script\s+src="[^"]*clicks\.js"[^>]*>\s*</script>', '', body)
    body = re.sub(r'<a\s+class="tool-home-link"[^>]*>.*?</a>', '', body, flags=re.S)
    body = re.sub(r'<a\s+class="tool-doc-link"[^>]*>.*?</a>', '', body, flags=re.S)
    body = re.sub(r'<a\s+href="\.\./\.\."\s+class="back-link"[^>]*>.*?</a>', '', body, flags=re.S)
    return style.strip(), body.strip()

def title_of(body):
    m = re.search(r'<h1[^>]*>(.*?)</h1>', body, re.S)
    if m:
        return re.sub(r'<[^>]+>', '', m.group(1)).strip()
    return ''

def main():
    tpl = open(TEMPLATE, encoding='utf-8').read()
    log('template len', len(tpl))
    cnt = 0
    for name in sorted(os.listdir(SRC)):
        d = os.path.join(SRC, name)
        app = os.path.join(d, 'app.html')
        if not os.path.isfile(app):
            continue
        if name in SKIP:
            log('skip', name)
            continue
        html = open(app, encoding='utf-8').read()
        hm = re.search(r'<head>(.*?)</head>', html, re.S)
        bm = re.search(r'<body>(.*?)</body>', html, re.S)
        if not hm or not bm:
            log('no head/body', name)
            continue
        style, body = extract(hm.group(1), bm.group(1))
        title = title_of(body) or name
        out_name = slugify(name) + '.html'
        final = (tpl
                 .replace('__TITLE__', title)
                 .replace('__DESC__', '纯前端工具：' + title)
                 .replace('__INLINE_STYLE__', style)
                 .replace('__BODY__', '<div class="tool-wrap">\n' + body + '\n</div>'))
        with open(os.path.join(OUT, out_name), 'w', encoding='utf-8') as f:
            f.write(final)
        cnt += 1
        log('gen', out_name, title)
    log('GENERATED', cnt)

if __name__ == '__main__':
    try:
        main()
    except Exception:
        log('EXCEPTION', traceback.format_exc())
    log('END')
