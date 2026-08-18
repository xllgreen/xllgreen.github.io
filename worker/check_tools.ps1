$ErrorActionPreference = 'Stop'
$root = 'c:/Users/49708/Documents/GitHub/xllgreen.github.io'
$htmlPath = Join-Path $root 'tools.html'
$toolsDir = Join-Path $root 'tools'

$content = [System.IO.File]::ReadAllText($htmlPath, [System.Text.Encoding]::UTF8)

# 提取所有 href="tools/xxx.html"
$refs = [regex]::Matches($content, 'href="(tools/[^"]+\.html)"') | ForEach-Object { $_.Groups[1].Value }
Write-Host ("Total card links in tools.html: " + $refs.Count)

# 校验文件是否存在
$missing = @()
foreach ($r in $refs) {
    $p = Join-Path $root $r
    if (-not (Test-Path $p)) { $missing += $r }
}
Write-Host ("Missing files (link but no file): " + $missing.Count)
$missing | ForEach-Object { Write-Host ("  MISSING: " + $_) }

# 反查：tools 目录里有没有文件没被引用（排除自研18个可能在别处）
$allHtml = Get-ChildItem -Path $toolsDir -Filter '*.html' | ForEach-Object { "tools/" + $_.Name }
$refSet = New-Object 'System.Collections.Generic.HashSet[string]'
$refs | ForEach-Object { [void]$refSet.Add($_) }
$orphan = $allHtml | Where-Object { -not $refSet.Contains($_) }
Write-Host ("Tool files not referenced in tools.html: " + $orphan.Count)
$orphan | ForEach-Object { Write-Host ("  ORPHAN: " + $_) }

# 抽样检查工具页面是否含功能（</script> 或 <script 或 <input）
$files = Get-ChildItem -Path $toolsDir -Filter '*.html'
$noScript = @()
$emptyish = @()
foreach ($f in $files) {
    $c = [System.IO.File]::ReadAllText($f.FullName, [System.Text.Encoding]::UTF8)
    if ($c.Length -lt 200) { $emptyish += $f.Name; continue }
    if ($c -notmatch '<script') { $noScript += $f.Name }
}
Write-Host ("Tool files with NO <script> (possible static/non-interactive): " + $noScript.Count)
$noScript | ForEach-Object { Write-Host ("  NOSCRIPT: " + $_) }
Write-Host ("Tool files suspiciously small (<200 bytes): " + $emptyish.Count)
$emptyish | ForEach-Object { Write-Host ("  TINY: " + $_) }
