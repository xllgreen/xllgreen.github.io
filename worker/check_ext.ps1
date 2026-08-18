$ErrorActionPreference = 'Stop'
$root = 'c:/Users/49708/Documents/GitHub/xllgreen.github.io'
$toolsDir = Join-Path $root 'tools'

# 精准检测：外部 <script src="http..."> 和 <link href="http..."> 外链
$files = Get-ChildItem -Path $toolsDir -Filter '*.html'
$extScript = @()
$extLink = @()
foreach ($f in $files) {
    $c = [System.IO.File]::ReadAllText($f.FullName, [System.Text.Encoding]::UTF8)
    $s = [regex]::Matches($c, '<script[^>]+src="(https?://[^"]+)"') | ForEach-Object { $_.Groups[1].Value }
    $l = [regex]::Matches($c, '<link[^>]+href="(https?://[^"]+)"') | ForEach-Object { $_.Groups[1].Value }
    if ($s.Count -gt 0) { $extScript += ($f.Name + ' => ' + ($s -join ', ')) }
    if ($l.Count -gt 0) { $extLink += ($f.Name + ' => ' + ($l -join ', ')) }
}
Write-Host ("Files with external <script src=http...>: " + $extScript.Count)
$extScript | ForEach-Object { Write-Host ("  SCRIPT: " + $_) }
Write-Host ("Files with external <link href=http...>: " + $extLink.Count)
$extLink | ForEach-Object { Write-Host ("  LINK: " + $_) }
