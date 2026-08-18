$root='c:/Users/49708/Documents/GitHub/xllgreen.github.io'
$wm = @{}
$c=[System.IO.File]::ReadAllText((Join-Path $root 'worker/wordmap.txt'), [System.Text.Encoding]::UTF8)
$c -split "`r?`n" | ForEach-Object { if($_ -match '^([a-zA-Z0-9]+)\|(.*)$'){ $wm[$Matches[1].ToLower()]=$Matches[2].Trim() } }

function Translate($title){
    $words = $title -split '[\s\-]+' | Where-Object { $_ -ne '' }
    $out=@()
    foreach($w in $words){
        $lw=$w.ToLower()
        if($wm.ContainsKey($lw)){ $out += $wm[$lw] }
        else { $out += $w }
    }
    return ($out -join '')
}

# Parse eng titles
$lines = [System.IO.File]::ReadAllText((Join-Path $root 'worker/eng_titles.txt'), [System.Text.Encoding]::UTF8) -split "`r?`n"
$map=@{}
foreach($ln in $lines){
    if($ln -notmatch '^(tools/[^|]+)\|(.+)$'){ continue }
    $file=$Matches[1]; $title=$Matches[2]
    $nt=(Translate $title)
    # keep brand/english where unchanged looks better: if result equals original, leave
    $map[$file]=$nt
    Write-Output ($file + ' => ' + $nt)
}

# Save map for review
$sb=New-Object System.Text.StringBuilder
foreach($k in $map.Keys){ [void]$sb.AppendLine($k+'|'+$map[$k]) }
[System.IO.File]::WriteAllText((Join-Path $root 'worker/title_map.txt'), $sb.ToString(), [System.Text.Encoding]::UTF8)
Write-Output ('mapped '+$map.Count)
