$base = 'c:/Users/49708/Documents/GitHub/xllgreen.github.io/worker/html-tools-master/tools'
$out = 'c:/Users/49708/Documents/GitHub/xllgreen.github.io/worker/chicogong_tools.txt'
$lines = @()
foreach ($cat in (Get-ChildItem $base -Directory | Sort-Object Name)) {
    foreach ($f in (Get-ChildItem $cat.FullName -File -Filter *.html | Sort-Object Name)) {
        if ($f.Name -eq 'index.html') { continue }
        $lines += ($cat.Name + '/' + $f.BaseName)
    }
}
$lines | Set-Content $out
"TOTAL=$($lines.Count)" | Add-Content $out
$lines.Count
