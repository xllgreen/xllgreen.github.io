$ErrorActionPreference = 'Continue'
$SO = [System.Text.RegularExpressions.RegexOptions]::Singleline
$TO = [TimeSpan]::FromSeconds(2)

$SRC = 'c:/Users/49708/Documents/GitHub/xllgreen.github.io/worker/html-tools-master/tools'
$OUT = 'c:/Users/49708/Documents/GitHub/xllgreen.github.io/tools'
$TEMPLATE = 'c:/Users/49708/Documents/GitHub/xllgreen.github.io/worker/tool_template.html'

$skipContains = @('word-counter','case-converter','base64','timestamp','/qr','password','color-picker','unit-converter','/hash','morse','countdown','/json','markdown','diff-checker','duplicate-remover','line-sorter','frequency-analyzer','lorem','cn-convert','chinese-converter','emoji')

function SafeRegex($input, $pat) {
    try {
        $rx = New-Object System.Text.RegularExpressions.Regex($pat, ($SO -bor [System.Text.RegularExpressions.RegexOptions]::IgnoreCase), $TO)
        $m = $rx.Match($input)
        if ($m.Success) { return $m.Groups[1].Value }
    } catch {}
    return ''
}

function ExtractBetween($html, $tag) {
    # returns inner content between <tag ...> and </tag>, using string index (no regex backtracking)
    $open = $html.IndexOf('<' + $tag)
    if ($open -lt 0) { return $null }
    $gt = $html.IndexOf('>', $open)
    if ($gt -lt 0) { return $null }
    $close = $html.IndexOf('</' + $tag + '>', $gt)
    if ($close -lt 0) { return $null }
    return $html.Substring($gt + 1, $close - $gt - 1)
}

$tpl = [System.IO.File]::ReadAllText($TEMPLATE, [System.Text.Encoding]::UTF8)
$log = 'c:/Users/49708/Documents/GitHub/xllgreen.github.io/worker/cg_log.txt'
'START' | Set-Content $log

$cnt = 0
foreach ($cat in (Get-ChildItem $SRC -Directory | Sort-Object Name)) {
    foreach ($f in (Get-ChildItem $cat.FullName -File -Filter *.html | Sort-Object Name)) {
        if ($f.Name -eq 'index.html') { continue }
        $rel = $cat.Name + '/' + $f.BaseName
        $skip = $false
        foreach ($s in $skipContains) { if ($rel -like "*$s*") { $skip = $true; break } }
        if ($skip) { "skip $rel" | Add-Content $log; continue }
        try {
            $html = [System.IO.File]::ReadAllText($f.FullName, [System.Text.Encoding]::UTF8)
            $body = ExtractBetween $html 'body'
            if ($null -eq $body) { "nobody $rel" | Add-Content $log; continue }
            $head = ExtractBetween $html 'head'
            $style = ''
            if ($null -ne $head) { $style = SafeRegex $head '<style>(.*?)</style>' }
            if (-not $style) { $style = SafeRegex $body '<style>(.*?)</style>' }
            # remove tool-chrome.js
            $body = [regex]::Replace($body, '<script\s+src="[^"]*tool-chrome\.js"[^>]*>\s*</script>', '', $SO)
            # remove first tool-owned <header> using string-safe approach
            $body = $body.Replace('<!-- 全局 UI 注入 -->', '')
            $hpos = $body.IndexOf('<header')
            if ($hpos -ge 0) {
                $hclose = $body.IndexOf('</header>', $hpos)
                if ($hclose -ge 0) { $body = $body.Remove($hpos, $hclose + 9 - $hpos) }
            }
            $title = SafeRegex $body '<h1[^>]*>(.*?)</h1>'
            if (-not $title) { $title = SafeRegex $html '<title>(.*?)</title>' }
            if (-not $title) { $title = $f.BaseName }
            $title = $title -replace '\s*-\s*WebUtils\s*$', '' -replace '\s*-\s*ToolKitty\s*$', ''
            $desc = 'Client-side tool - ' + $title
            $outName = 'cg-' + $cat.Name + '-' + $f.BaseName + '.html'
            $headExtra = '<link rel="stylesheet" href="/static/chicogong-base.css?v=1.0">' + "`n    <style>`n" + $style.Trim() + "`n    </style>"
            $final = $tpl.Replace('__TITLE__', $title).Replace('__DESC__', $desc)
            $final = [regex]::Replace($final, '(?s)(<link rel="stylesheet" href="/static/enhance.css[^>]*>)', ('$1' + "`n    " + $headExtra), $SO)
            $final = $final.Replace('__INLINE_STYLE__', '')
            # remove now-empty template style blocks
            $final = [regex]::Replace($final, '(?s)<style>\s*</style>\s*', '', $SO)
            $final = $final.Replace('__BODY__', ("<div class=""tool-wrap"">`n" + $body.Trim() + "`n</div>"))
            [System.IO.File]::WriteAllText((Join-Path $OUT $outName), $final, [System.Text.Encoding]::UTF8)
            $cnt++
        } catch {
            "ERR $rel : $_" | Add-Content $log
        }
    }
}
"GENERATED $cnt" | Add-Content $log
