$ErrorActionPreference = 'Continue'
$SO = [System.Text.RegularExpressions.RegexOptions]::Singleline
$TO = [TimeSpan]::FromSeconds(2)

$OUT = 'c:/Users/49708/Documents/GitHub/xllgreen.github.io/tools'
$TEMPLATE = 'c:/Users/49708/Documents/GitHub/xllgreen.github.io/worker/tool_template.html'
$log = 'c:/Users/49708/Documents/GitHub/xllgreen.github.io/worker/unify_log.txt'
'START' | Set-Content $log

$tpl = [System.IO.File]::ReadAllText($TEMPLATE, [System.Text.Encoding]::UTF8)

function SafeRegex($input, $pat){
    try {
        $rx = New-Object System.Text.RegularExpressions.Regex($pat, ($SO -bor [System.Text.RegularExpressions.RegexOptions]::IgnoreCase), $TO)
        $m = $rx.Match($input)
        if($m.Success){ return $m.Groups[1].Value }
    } catch {}
    return ''
}
function ExtractBetween($html, $tag){
    $open = $html.IndexOf('<' + $tag)
    if($open -lt 0){ return $null }
    $gt = $html.IndexOf('>', $open)
    if($gt -lt 0){ return $null }
    $close = $html.IndexOf('</' + $tag + '>', $gt)
    if($close -lt 0){ return $null }
    return $html.Substring($gt + 1, $close - $gt - 1)
}

foreach($f in (Get-ChildItem $OUT -File -Filter *.html | Where-Object { $_.Name -notlike 'jh-*' -and $_.Name -notlike 'cg-*' } | Sort-Object Name)){
    try {
        $html = [System.IO.File]::ReadAllText($f.FullName, [System.Text.Encoding]::UTF8)
        $head = ExtractBetween $html 'head'
        $body = ExtractBetween $html 'body'
        if($null -eq $body){ "nobody $($f.Name)" | Add-Content $log; continue }
        # collect head inline styles
        $styles = ''
        if($null -ne $head){
            $m = [regex]::Match($head, '<style>(.*?)</style>', $SO)
            while($m.Success){ $styles += $m.Groups[1].Value + "`n"; $m = $m.NextMatch() }
        }
        # also styles inside body
        $m = [regex]::Match($body, '<style>(.*?)</style>', $SO)
        while($m.Success){ $styles += $m.Groups[1].Value + "`n"; $m = $m.NextMatch() }
        # remove old custom header
        $hpos = $body.IndexOf('<header')
        if($hpos -ge 0){
            $hclose = $body.IndexOf('</header>', $hpos)
            if($hclose -ge 0){ $body = $body.Remove($hpos, $hclose + 9 - $hpos) }
        }
        # remove tool-common.js reference
        $body = [regex]::Replace($body, '<script\s+src="tool-common\.js"[^>]*>\s*</script>', '', $SO)
        # fix relative static paths
        $body = $body.Replace('../static/', '/static/')
        $styles = $styles.Replace('../static/', '/static/')
        # scope global body rule into .tool-wrap to avoid overriding site header
        $styles = [regex]::Replace($styles, 'body\s*\{', '.tool-wrap {', $SO)
        # scope global universal reset into .tool-wrap
        $styles = [regex]::Replace($styles, '(?s)(\*,\*\s*::before,\*\s*::after|\*\s*::before,\*\s*::after|\*)\s*\{', '.tool-wrap, .tool-wrap * {', $SO)
        # avoid double .main nesting: rename first <div class="main" to tool-main
        $body = $body.Replace('<div class="main"', '<div class="tool-main"')
        # title (use known-good mapping; original Chinese titles were lost on first rewrite)
        $titleMap = @{
            'json'='JSON Formatter'; 'base64'='Base64'; 'timestamp'='Timestamp Converter';
            'qrcode'='QR Code Generator'; 'markdown'='Markdown Preview'; 'password'='Password Generator';
            'colorpicker'='Color Picker'; 'unit-converter'='Unit Converter'; 'stopwatch'='Stopwatch';
            'countdown'='Countdown Timer'; 'wordcount'='Word Counter'; 'hash'='Hash Generator';
            'morse'='Morse Code'; 'metronome'='Metronome'; 'reaction-time'='Reaction Time Test';
            'emotional-neglect'='Emotional Neglect Self-Test'; 'silk-screen'='Silk Screen Halftone';
            'lyric-wave'='Lyric Wave Player'
        }
        $title = if($titleMap[$f.BaseName]){ $titleMap[$f.BaseName] } else { $f.BaseName }
        $desc = SafeRegex $html '<meta name="description" content="([^"]*)"'
        if(-not $desc){ $desc = 'Client-side tool - ' + $title }
        $final = $tpl.Replace('__TITLE__', $title).Replace('__DESC__', $desc).Replace('__INLINE_STYLE__', $styles.Trim())
        $final = $final.Replace('__BODY__', ("<div class=""tool-wrap"">`n" + $body.Trim() + "`n</div>"))
        [System.IO.File]::WriteAllText($f.FullName, $final, [System.Text.Encoding]::UTF8)
        "unified $($f.Name)" | Add-Content $log
    } catch {
        "ERR $($f.Name): $_" | Add-Content $log
    }
}
"DONE" | Add-Content $log
