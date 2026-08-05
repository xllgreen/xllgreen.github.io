# update_servers.ps1
# 从 spiritLHLS/speedtest.net-CN-ID 拉取最新测速节点，合并为本地 JSON。
# 用途：配合 Windows 任务计划程序每日运行，实现节点"每天更新"。
# 用法：powershell -ExecutionPolicy Bypass -File update_servers.ps1

$ErrorActionPreference = "Stop"
$base = Split-Path -Parent $MyInvocation.MyCommand.Definition
$outPath = Join-Path $base "static\speedtest_servers.json"
$repo = "https://raw.githubusercontent.com/spiritLHLS/speedtest.net-CN-ID/main"
$files = @("CN.csv", "CN_Mobile.csv", "CN_Telecom.csv", "CN_Unicom.csv", "HK.csv", "JP.csv", "SG.csv", "TW.csv")

function Parse-CsvLine($line) {
    $result = @()
    $cur = ""
    $inQ = $false
    foreach ($ch in $line.ToCharArray()) {
        if ($inQ) {
            if ($ch -eq '"') { $inQ = $false } else { $cur += $ch }
        } else {
            if ($ch -eq '"') { $inQ = $true }
            elseif ($ch -eq ',') { $result += $cur; $cur = "" }
            else { $cur += $ch }
        }
    }
    $result += $cur
    return $result
}

$servers = @()
foreach ($f in $files) {
    $url = "$repo/$f"
    try {
        $txt = (Invoke-WebRequest -Uri $url -TimeoutSec 30 -Headers @{ "User-Agent" = "Mozilla/5.0" }).Content
        # 处理可能的 BOM/编码
        if ($txt -is [byte[]]) { $txt = [System.Text.Encoding]::UTF8.GetString($txt) }
        $lines = $txt -split "`n" | Where-Object { $_.Trim().Length -gt 0 }
        if ($lines.Count -le 1) { continue }
        $header = Parse-CsvLine $lines[0]
        for ($i = 1; $i -lt $lines.Count; $i++) {
            $cols = Parse-CsvLine $lines[$i]
            if ($cols.Count -lt 8) { continue }
            $servers += [PSCustomObject]@{
                id       = $cols[0].Trim()
                country  = $cols[2].Trim()
                city     = $cols[3].Trim()
                ip       = $cols[4].Trim()
                host     = $cols[5].Trim()
                port     = if ($cols[6].Trim() -eq "") { 8080 } else { [int]$cols[6].Trim() }
                supplier = $cols[7].Trim()
            }
        }
        Write-Host "已处理 $f ($(($lines.Count)-1) 个节点)"
    } catch {
        Write-Warning "拉取 $f 失败: $_"
    }
}

if ($servers.Count -eq 0) {
    Write-Error "未获取到任何节点，保留原有 JSON。"
    exit 1
}

# 去重（按 id）
$servers = $servers | Sort-Object id -Unique

$obj = [PSCustomObject]@{
    updated = (Get-Date -Format "yyyy-MM-dd")
    source  = "https://github.com/spiritLHLS/speedtest.net-CN-ID"
    note    = "由 update_servers.ps1 自动更新。"
    servers = $servers
}

$json = $obj | ConvertTo-Json -Depth 3 -Compress
[System.IO.File]::WriteAllText($outPath, $json, [System.Text.Encoding]::UTF8)
Write-Host "完成：共写入 $($servers.Count) 个节点 -> $outPath"
