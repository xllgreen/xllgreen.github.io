$ErrorActionPreference = 'Stop'
$root = 'c:/Users/49708/Documents/GitHub/xllgreen.github.io'
$toolsDir = Join-Path $root 'tools'

# 检测工具页面是否引用外部资源（CDN/外链），影响"离线可用"声明
$files = Get-ChildItem -Path $toolsDir -Filter '*.html'
$external = @()
$cdnDomains = @('cdn\.', 'unpkg\.com', 'jsdelivr\.net', 'googleapis\.com', 'cdnjs\.cloudflare\.com', 'https?://(?!xllgreen\.github\.io)', 'src="http', 'href="http')
foreach ($f in $files) {
    $c = [System.IO.File]::ReadAllText($f.FullName, [System.Text.Encoding]::UTF8)
    $hit = $false
    foreach ($d in $cdnDomains) {
        if ($c -match $d) { $hit = $true; break }
    }
    if ($hit) { $external += $f.Name }
}
Write-Host ("Tool files referencing external URLs (not fully offline): " + $external.Count)
$external | ForEach-Object { Write-Host ("  EXTERNAL: " + $_) }

# 抽样检查 cg-calculator-age 是否真有交互逻辑
$sample = Join-Path $toolsDir 'cg-calculator-age-calculator.html'
if (Test-Path $sample) {
    $c = [System.IO.File]::ReadAllText($sample, [System.Text.Encoding]::UTF8)
    Write-Host ("--- sample age-calculator ---")
    Write-Host ("size: " + $c.Length)
    Write-Host ("has input: " + ($c -match '<input'))
    Write-Host ("has function: " + ($c -match 'function\s+\w+\s*\('))
    Write-Host ("has event listener: " + ($c -match 'addEventListener|onclick'))
}
