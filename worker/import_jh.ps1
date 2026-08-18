$ErrorActionPreference = 'Stop'
$SO = [System.Text.RegularExpressions.RegexOptions]::Singleline

$SRC = 'c:/Users/49708/Documents/GitHub/xllgreen.github.io/worker/html-tools-main/tools'
$OUT = 'c:/Users/49708/Documents/GitHub/xllgreen.github.io/tools'
$TEMPLATE = 'c:/Users/49708/Documents/GitHub/xllgreen.github.io/worker/tool_template.html'

$skip = @('base64-encode','base64-decode','timestamp-converter','qr-code-generator','password-generator','color-picker','unit-converter','word-counter','hash-generator','morse-code-encode','morse-code-decode','countdown-timer','json-formatter','markdown-to-html')

$tpl = [System.IO.File]::ReadAllText($TEMPLATE, [System.Text.Encoding]::UTF8)

$log = 'c:/Users/49708/Documents/GitHub/xllgreen.github.io/worker/jh_log.txt'
'START' | Set-Content $log

function Extract($head, $body) {
    $m = [regex]::Match($head, '<style>(.*?)</style>', $SO)
    $style = if ($m.Success) { $m.Groups[1].Value } else { '' }
    # body { -> .tool-wrap {
    $style = [regex]::Replace($style, 'body\s*\{', '.tool-wrap {', $SO)
    # remove clicks.js
    $body = [regex]::Replace($body, '<script\s+src="[^"]*clicks\.js"[^>]*>\s*</script>', '', $SO)
    # remove top fixed links and back link
    $body = [regex]::Replace($body, '<a\s+class="tool-home-link"[^>]*>.*?</a>', '', $SO)
    $body = [regex]::Replace($body, '<a\s+class="tool-doc-link"[^>]*>.*?</a>', '', $SO)
    $body = [regex]::Replace($body, '<a\s+href="\.\./\.\."\s+class="back-link"[^>]*>.*?</a>', '', $SO)
    return $style.Trim(), $body.Trim()
}

function TitleOf($body) {
    $m = [regex]::Match($body, '<h1[^>]*>(.*?)</h1>', $SO)
    if ($m.Success) {
        $t = [regex]::Replace($m.Groups[1].Value, '<[^>]+>', '')
        return $t.Trim()
    }
    return ''
}

$cnt = 0
foreach ($name in (Get-ChildItem $SRC -Directory | Sort-Object Name)) {
    $app = Join-Path $name.FullName 'app.html'
    if (-not (Test-Path $app)) { continue }
    if ($skip -contains $name.Name) { "skip $($name.Name)" | Add-Content $log; continue }
    $html = [System.IO.File]::ReadAllText($app, [System.Text.Encoding]::UTF8)
    $hm = [regex]::Match($html, '<head>(.*?)</head>', $SO)
    $bm = [regex]::Match($html, '<body>(.*?)</body>', $SO)
    if (-not $hm.Success -or -not $bm.Success) { "no head/body $($name.Name)" | Add-Content $log; continue }
    $style, $body = Extract $hm.Groups[1].Value $bm.Groups[1].Value
    $title = TitleOf $body
    if (-not $title) { $title = $name.Name }
    $outName = 'jh-' + $name.Name + '.html'
    $final = $tpl.Replace('__TITLE__', $title).Replace('__DESC__', ('Client-side tool - ' + $title)).Replace('__INLINE_STYLE__', $style).Replace('__BODY__', ("<div class=""tool-wrap"">`n" + $body + "`n</div>"))
    [System.IO.File]::WriteAllText((Join-Path $OUT $outName), $final, [System.Text.Encoding]::UTF8)
    $cnt++
    "gen $outName :: $title" | Add-Content $log
}
"GENERATED $cnt" | Add-Content $log
