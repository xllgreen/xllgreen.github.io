# Regenerate tools.html category nav + card grid with functional classification.
$ErrorActionPreference = 'Stop'
$root = 'c:/Users/49708/Documents/GitHub/xllgreen.github.io'
$toolsDir = Join-Path $root 'tools'
$htmlPath = Join-Path $root 'tools.html'
$worker = Join-Path $root 'worker'

# Load mapping data
$cgMap = @{}
(Get-Content (Join-Path $worker 'cg_map.txt') -Encoding UTF8) | ForEach-Object {
    if ($_ -match '^([a-z0-9]+)\|([a-z]+)$') { $cgMap[$Matches[1]] = $Matches[2] }
}
$jhKw = @()
(Get-Content (Join-Path $worker 'jhkw.txt') -Encoding UTF8) | ForEach-Object {
    if ($_ -match '^([a-z0-9\-]+)\|([a-z]+)$') { $jhKw += ,@($Matches[1], $Matches[2]) }
}
$origMap = @{}
(Get-Content (Join-Path $worker 'orig_map.txt') -Encoding UTF8) | ForEach-Object {
    if ($_ -match '^([a-z0-9\-\.]+)\|([a-z]+)$') { $origMap[$Matches[1]] = $Matches[2] }
}
$labels = @{}
$labelRaw = [System.IO.File]::ReadAllText((Join-Path $worker 'cat_labels.txt'), [System.Text.Encoding]::UTF8)
$labelRaw -split "`r?`n" | ForEach-Object {
    if ($_ -match '^([a-z]+)\|(.*)$') { $labels[$Matches[1]] = $Matches[2].Trim() }
}
# DEBUG removed

# Fixed display order for category buttons (after 'all')
$order = @('ai','text','image','audio','video','calc','convert','crypto','dev','color','time','business','life','edu','health','fun','game','misc')

# Common abbreviation map for slug prettifying
$slugMap = @{
    'ai'='AI'; 'api'='API'; 'ui'='UI'; 'ux'='UX'; 'css'='CSS'; 'html'='HTML'; 'json'='JSON';
    'yaml'='YAML'; 'xml'='XML'; 'csv'='CSV'; 'sql'='SQL'; 'url'='URL'; 'uri'='URI'; 'http'='HTTP';
    'https'='HTTPS'; 'ip'='IP'; 'tcp'='TCP'; 'udp'='UDP'; 'dns'='DNS'; 'uuid'='UUID'; 'ulid'='ULID';
    'id'='ID'; 'qr'='QR'; 'bmi'='BMI'; 'rgb'='RGB'; 'hex'='HEX'; 'jwt'='JWT'; 'pdf'='PDF';
    'png'='PNG'; 'jpg'='JPG'; 'gif'='GIF'; 'svg'='SVG'; 'mp3'='MP3'; 'mp4'='MP4'; 'wav'='WAV';
    'git'='Git'; 'regex'='Regex'; 'base64'='Base64'; 'base32'='Base32'; 'emoji'='Emoji'; 'crypto'='Crypto';
    'gpu'='GPU'; 'cpu'='CPU'; 'ssh'='SSH'; 'tls'='TLS'; 'ssl'='SSL'; 'oauth'='OAuth';
    '2025'='2025'; '2024'='2024'; 'to'='to'; 'vs'='vs'; 'and'='and'
}
function Prettify-Slug($slug) {
    $parts = $slug -split '-'
    $out = @()
    foreach ($p in $parts) {
        if ($p -eq '') { continue }
        if ($slugMap.ContainsKey($p.ToLower())) { $out += $slugMap[$p.ToLower()] }
        else { $out += (Get-Culture).TextInfo.ToTitleCase($p) }
    }
    return ($out -join ' ')
}

function Get-InnerText($html, $openPat, $closeTag) {
    $i = [regex]::Match($html, $openPat, [Text.RegularExpressions.RegexOptions]::IgnoreCase -bor [Text.RegularExpressions.RegexOptions]::Singleline)
    if (-not $i.Success) { return $null }
    $start = $i.Index + $i.Length
    $j = $html.IndexOf($closeTag, $start, [StringComparison]::OrdinalIgnoreCase)
    if ($j -lt 0) { return $null }
    $raw = $html.Substring($start, $j - $start)
    $raw = [regex]::Replace($raw, '<[^>]+>', '', [Text.RegularExpressions.RegexOptions]::IgnoreCase)
    $raw = [regex]::Replace($raw, '\s+', ' ').Trim()
    return $raw
}

# Collect tools
$files = Get-ChildItem $toolsDir -File -Filter *.html | Where-Object { $_.Name -notmatch '\.(ps1|tar\.gz)$' -and $_.Name -ne 'tools.html' }
$cards = @()
$usedCats = @{}

foreach ($f in $files) {
    $name = $f.Name
    $content = Get-Content $f.FullName -Raw -Encoding UTF8
    # title
    $title = Get-InnerText $content '<h1[^>]*>' '</h1>'
    if (-not $title) {
        $m = [regex]::Match($content, '<title>(.*?)</title>', [Text.RegularExpressions.RegexOptions]::IgnoreCase -bor [Text.RegularExpressions.RegexOptions]::Singleline)
        if ($m.Success) { $title = $m.Groups[1].Value -replace '\s*-\s*Medicalstu.*$','' }
    }
    if (-not $title) {
        $slug = $name -replace '\.html$','' -replace '^cg-[a-z0-9]+-','' -replace '^jh-',''
        $title = (Prettify-Slug $slug)
    }
    if ($title -match '^[a-z0-9\-]+$') {
        $title = (Prettify-Slug $title)
    }
    # description
    $desc = $null
    $dm = [regex]::Match($content, '<meta name="description" content="(.*?)"', [Text.RegularExpressions.RegexOptions]::IgnoreCase -bor [Text.RegularExpressions.RegexOptions]::Singleline)
    if ($dm.Success) { $desc = $dm.Groups[1].Value.Trim() }
    if (-not $desc -or $desc -match '^Client-side tool - ') { $desc = $title }
    # classify
    $cat = 'misc'
    if ($origMap.ContainsKey($name)) { $cat = $origMap[$name] }
    elseif ($name -match '^cg-([a-z0-9]+)-') {
        $cc = $Matches[1]
        if ($cgMap.ContainsKey($cc)) { $cat = $cgMap[$cc] } else { $cat = 'misc' }
    }
    elseif ($name -match '^jh-(.+)\.html$') {
        $slug = $Matches[1]
        foreach ($kv in $jhKw) { if ($slug -match [regex]::Escape($kv[0])) { $cat = $kv[1]; break } }
    }
    $usedCats[$cat] = $true
    $href = 'tools/' + $name
    $kw = ($title + ' ' + $name) -replace '\.html$',''
    $cards += ,@($href, $title, $desc, $cat, $kw)
}

# Build nav
$nav = '        <div class="tool-cats" id="toolCats">' + "`n"
$nav += '            <button class="cat-btn active" data-cat="all" data-zh="全部" data-en="All">全部</button>' + "`n"
foreach ($c in $order) {
    if ($usedCats.ContainsKey($c)) {
        $lbl = if ($labels.ContainsKey($c)) { $labels[$c] } else { $c }
        $nav += '            <button class="cat-btn" data-cat="' + $c + '" data-zh="' + $lbl + '" data-en="' + $c + '">' + $lbl + '</button>' + "`n"
    }
}
$nav += '        </div>'

# Build grid
$grid = '        <div class="tools-grid" id="toolGrid">' + "`n"
foreach ($card in $cards) {
    $href, $title, $desc, $cat, $kw = $card
    $grid += '            <a class="tool-card" data-cat="' + $cat + '" data-keywords="' + $kw + '" href="' + $href + '"><h3>' + $title + '</h3><p>' + $desc + '</p></a>' + "`n"
}
$grid += '        </div>'

# Replace in tools.html
$full = [System.IO.File]::ReadAllText($htmlPath, [System.Text.Encoding]::UTF8)
# toolCats block
$catsStart = $full.IndexOf('<div class="tool-cats" id="toolCats">')
$catsEnd = $full.IndexOf('</div>', $catsStart) + 6
$full = $full.Remove($catsStart, $catsEnd - $catsStart).Insert($catsStart, $nav)
# tools-grid block
$gridStart = $full.IndexOf('<div class="tools-grid" id="toolGrid">')
$gridEnd = $full.IndexOf('</div>', $gridStart) + 6
$full = $full.Remove($gridStart, $gridEnd - $gridStart).Insert($gridStart, $grid)

$sw = [System.IO.StreamWriter]::new($htmlPath, $false, [System.Text.Encoding]::UTF8)
$sw.Write($full)
$sw.Close()
Write-Output ("Total cards: " + $cards.Count)
Write-Output ("Categories used: " + (($usedCats.Keys | Sort-Object) -join ', '))
