$SO = [System.Text.RegularExpressions.RegexOptions]::Singleline
$src = 'c:/Users/49708/Documents/GitHub/xllgreen.github.io/worker/html-tools-master/assets/css/tool-base.css'
$dst = 'c:/Users/49708/Documents/GitHub/xllgreen.github.io/static/chicogong-base.css'
$css = [System.IO.File]::ReadAllText($src, [System.Text.Encoding]::UTF8)
# remove html { ... } block
$css = [regex]::Replace($css, '(?s)html\s*\{.*?\}', '', $SO)
# remove body { ... } block
$css = [regex]::Replace($css, '(?s)body\s*\{.*?\}', '', $SO)
$append = @"

/* 作用域化：将原 body 全局样式移到工具容器，避免污染全站 header */
.tool-wrap {
  margin: 0;
  font-family: var(--font-sans);
  background: var(--bg-deep);
  color: var(--text-primary);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  min-height: 100vh;
  padding: 24px;
}
"@
[System.IO.File]::WriteAllText($dst, ($css.Trim() + $append), [System.Text.Encoding]::UTF8)
'WROTE ' + $dst
