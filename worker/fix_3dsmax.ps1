$ErrorActionPreference = 'Stop'
$root = 'c:/Users/49708/Documents/GitHub/xllgreen.github.io'
$sbDir = Join-Path $root 'Softwarebase'
$sbHtml = Join-Path $root 'Softwarebase.html'
$csvFile = (Get-ChildItem -Path $root -Filter *.csv | Select-Object -First 1).FullName
if (-not $csvFile) { throw 'csv not found' }

$maps = @(
  @{old='4dsMax'; year='2013'; label='3ds Max 2013'},
  @{old='5dsMax'; year='2012'; label='3ds Max 2012'},
  @{old='6dsMax'; year='2011'; label='3ds Max 2011'},
  @{old='7dsMax'; year='2010'; label='3ds Max 2010'},
  @{old='8dsMax'; year='2009'; label='3ds Max 2009'}
)

$sbContent = Get-Content $sbHtml -Raw -Encoding UTF8
$csvContent = Get-Content $csvFile -Raw -Encoding Default

foreach ($m in $maps) {
    $wrongName = $m.old -replace 'dsMax','ds Max'   # "4ds Max"
    $srcFile = Join-Path $sbDir "3DDesign-$($m.old).html"
    $dstFile = Join-Path $sbDir "3DDesign-3dsMax-$($m.year).html"

    # 1) 改文件内错误命名（head + 标题 span）
    $c = Get-Content $srcFile -Raw -Encoding UTF8
    $c = $c.Replace($wrongName, $m.label)
    $utf8 = New-Object System.Text.UTF8Encoding($false)
    [System.IO.File]::WriteAllText($srcFile, $c, $utf8)

    # 2) 重命名文件
    Move-Item -Path $srcFile -Destination $dstFile -Force

    # 3) 更新 Softwarebase.html 链接路径与显示名
    $sbContent = $sbContent.Replace("Softwarebase/3DDesign-$($m.old).html", "Softwarebase/3DDesign-3dsMax-$($m.year).html")
    $sbContent = $sbContent.Replace($wrongName, $m.label)

    # 4) 更新 csv 第二列名称
    $csvContent = $csvContent.Replace($wrongName, $m.label)
}

[System.IO.File]::WriteAllText($sbHtml, $sbContent, (New-Object System.Text.UTF8Encoding($false)))
[System.IO.File]::WriteAllText($csvFile, $csvContent, [System.Text.Encoding]::Default)
"done"
