$ErrorActionPreference = 'Continue'
$SO = [System.Text.RegularExpressions.RegexOptions]::Singleline
$TO = [TimeSpan]::FromSeconds(2)

$OUT = 'c:/Users/49708/Documents/GitHub/xllgreen.github.io/tools'
$log = 'c:/Users/49708/Documents/GitHub/xllgreen.github.io/worker/fixscope_log.txt'
'START' | Set-Content $log

function ScopeStyle($css){
    # body { -> .tool-wrap {
    $css = [regex]::Replace($css, 'body\s*\{', '.tool-wrap {', $SO)
    # html { -> remove (replace with empty, scoped none)
    $css = [regex]::Replace($css, '(?s)html\s*\{.*?\}', '', $SO)
    # universal reset variants -> .tool-wrap, .tool-wrap *
    $css = [regex]::Replace($css, '\*,\*\s*::before,\*\s*::after\s*\{', '.tool-wrap, .tool-wrap * {', $SO)
    $css = [regex]::Replace($css, '\*\s*::before,\*\s*::after\s*\{', '.tool-wrap *::before, .tool-wrap *::after {', $SO)
    $css = [regex]::Replace($css, '(?<![\w:.])\*\s*\{', '.tool-wrap * {', $SO)
    return $css
}

foreach($f in (Get-ChildItem $OUT -File -Filter *.html | Sort-Object Name)){
    try {
        $html = [System.IO.File]::ReadAllText($f.FullName, [System.Text.Encoding]::UTF8)
        $changed = $false
        # process each <style>...</style> block
        $m = [regex]::Match($html, '(?s)<style>(.*?)</style>')
        $offset = 0
        $sb = New-Object System.Text.StringBuilder
        while($m.Success){
            $blockStart = $m.Index
            $blockEnd = $m.Index + $m.Length
            $inner = $m.Groups[1].Value
            $scoped = ScopeStyle $inner
            if($scoped -ne $inner){ $changed = $true }
            $sb.Append($html.Substring($offset, $blockStart - $offset)) | Out-Null
            $sb.Append('<style>' + $scoped + '</style>') | Out-Null
            $offset = $blockEnd
            $m = $m.NextMatch()
        }
        if($changed){
            $sb.Append($html.Substring($offset)) | Out-Null
            [System.IO.File]::WriteAllText($f.FullName, $sb.ToString(), [System.Text.Encoding]::UTF8)
            "scoped $($f.Name)" | Add-Content $log
        }
    } catch {
        "ERR $($f.Name): $_" | Add-Content $log
    }
}
"DONE" | Add-Content $log
