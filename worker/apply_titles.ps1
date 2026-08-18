$root='c:/Users/49708/Documents/GitHub/xllgreen.github.io'
$htmlPath=Join-Path $root 'tools.html'
# load map
$map=@{}
$c=[System.IO.File]::ReadAllText((Join-Path $root 'worker/title_map.txt'), [System.Text.Encoding]::UTF8)
$c -split "`r?`n" | ForEach-Object { if($_ -match '^(tools/[^|]+)\|(.*)$'){ $map[$Matches[1]]=$Matches[2] } }

$s=[System.IO.File]::ReadAllText($htmlPath, [System.Text.Encoding]::UTF8)
$re=[System.Text.RegularExpressions.Regex]::new('<a class="tool-card" data-cat="([^"]+)" data-keywords="([^"]*)" href="(tools/[^"]+\.html)"><h3>([\s\S]*?)</h3>', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
$changed=0
$sb=New-Object System.Text.StringBuilder
$last=0
foreach($m in $re.Matches($s)){
    [void]$sb.Append($s.Substring($last, $m.Index-$last))
    $file=$m.Groups[3].Value
    $old=$m.Groups[4].Value
    if($map.ContainsKey($file)){
        $new=$map[$file]
        # build new anchor
        $newAnchor='<a class="tool-card" data-cat="'+$m.Groups[1].Value+'" data-keywords="'+$m.Groups[2].Value+'" href="'+$file+'"><h3>'+$new+'</h3>'
        [void]$sb.Append($newAnchor)
        $changed++
    } else {
        [void]$sb.Append($m.Value)
    }
    $last=$m.Index+$m.Length
}
[void]$sb.Append($s.Substring($last))
[System.IO.File]::WriteAllText($htmlPath, $sb.ToString(), [System.Text.Encoding]::UTF8)
Write-Output ("changed $changed titles")
