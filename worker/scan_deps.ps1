$base = 'c:/Users/49708/Documents/GitHub/xllgreen.github.io/worker/html-tools-main/tools'
$files = Get-ChildItem -Path $base -Recurse -Filter app.html
$patterns = @('src="http', 'src=.http', 'cdn', 'unpkg', 'jsdelivr', 'googleapis', 'cdnjs', '<script src="https')
foreach ($f in $files) {
    $c = Get-Content $f.FullName -Raw
    $hits = @()
    foreach ($p in $patterns) {
        if ($c -match [regex]::Escape($p)) { $hits += $p }
    }
    if ($hits.Count -gt 0) {
        Write-Host "EXTERNAL: $($f.FullName.Replace($base,'')) -> $($hits -join ', ')"
    }
}
Write-Host "TOTAL app.html: $($files.Count)"
