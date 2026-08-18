$ErrorActionPreference = 'Stop'

function U($cp){ return [System.Char]::ConvertFromUtf32($cp) }

$OUT = 'c:/Users/49708/Documents/GitHub/xllgreen.github.io/tools'
$TOOLSHTML = 'c:/Users/49708/Documents/GitHub/xllgreen.github.io/tools.html'

$catEmoji = @{
    'text'=U(0x1F4C4); 'image'=U(0x1F5BC); 'audio'=U(0x1F3B5); 'calc'=U(0x1F9EE); 'time'=U(0x1F552);
    'crypto'=U(0x1F510); 'dev'=U(0x1F4BB); 'converter'=U(0x1F504); 'color'=U(0x1F3A8); 'misc'=U(0x1F9F0); 'fun'=U(0x1F3B2)
}
$catLabel = @{
    'text'='Text'; 'image'='Image'; 'audio'='Audio'; 'calc'='Calc'; 'time'='Time';
    'crypto'='Crypto'; 'dev'='Dev'; 'converter'='Convert'; 'color'='Color'; 'misc'='Misc'; 'fun'='Fun'
}

function JhCat($name){
    $n=$name.ToLower()
    if($n -match 'image|png|jpg|svg|photo|crop|compress|resize|watermark|qr|favicon'){return 'image'}
    if($n -match 'audio|sound|music|voice|speech|tts|tone|noise|pitch'){return 'audio'}
    if($n -match 'calc|math|number|percentage|profit|loan|tip|bmi|age'){return 'calc'}
    if($n -match 'time|date|timer|countdown|clock|calendar|schedule'){return 'time'}
    if($n -match 'crypto|hash|encrypt|decrypt|password|base64|jwt|md5|sha|rsa|aes|token'){return 'crypto'}
    if($n -match 'json|xml|yaml|sql|html|css|js|regex|code|format|diff|uuid|slug|url|api|color|hex|rgb'){return 'dev'}
    if($n -match 'color|hex|rgb|hsl|palette'){return 'color'}
    if($n -match 'convert|unit|translate|case|currency|transform'){return 'converter'}
    if($n -match 'word|text|case|lorem|counter|count|sort|duplicate|emoji|font'){return 'text'}
    return 'misc'
}
function CgCat($cgcat){
    switch($cgcat){
        'text'{'text'}; 'image'{'image'}; 'audio'{'audio'}; 'calculator'{'calc'}; 'math'{'calc'};
        'time'{'time'}; 'crypto'{'crypto'}; 'dev'{'dev'}; 'color'{'color'}; 'converter'{'converter'};
        'data'{'dev'}; 'network'{'dev'}; 'seo'{'dev'}; 'ai'{'misc'}; 'tools'{'misc'}; 'weather'{'misc'};
        default{'misc'}
    }
}
function GetMeta($path, $tag){
    $c = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)
    $m = [regex]::Match($c, "<$tag[^>]*>(.*?)</$tag>", [System.Text.RegularExpressions.RegexOptions]::Singleline)
    if($m.Success){ return $m.Groups[1].Value.Trim() }
    return ''
}
function GetDesc($path){
    $c = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)
    $m = [regex]::Match($c, '<meta name="description" content="([^"]*)"', [System.Text.RegularExpressions.RegexOptions]::Singleline)
    if($m.Success){ return $m.Groups[1].Value.Trim() }
    return ''
}

$cards = @()
$origCards = @(
    '<a class="tool-card" data-cat="text" data-keywords="json format" href="tools/json.html"><h3>' + $catEmoji['text'] + ' JSON</h3><p>Format / minify / validate JSON.</p></a>',
    '<a class="tool-card" data-cat="text" data-keywords="base64" href="tools/base64.html"><h3>' + $catEmoji['text'] + ' Base64</h3><p>Text to/from Base64.</p></a>',
    '<a class="tool-card" data-cat="time" data-keywords="timestamp" href="tools/timestamp.html"><h3>' + $catEmoji['time'] + ' Timestamp</h3><p>Timestamp to date.</p></a>',
    '<a class="tool-card" data-cat="image" data-keywords="qrcode" href="tools/qrcode.html"><h3>' + $catEmoji['image'] + ' QR Code</h3><p>Generate QR code.</p></a>',
    '<a class="tool-card" data-cat="text" data-keywords="markdown" href="tools/markdown.html"><h3>' + $catEmoji['text'] + ' Markdown</h3><p>Live Markdown preview.</p></a>',
    '<a class="tool-card" data-cat="fun" data-keywords="password" href="tools/password.html"><h3>' + $catEmoji['fun'] + ' Password</h3><p>Random password generator.</p></a>',
    '<a class="tool-card" data-cat="image" data-keywords="color eyedropper" href="tools/colorpicker.html"><h3>' + $catEmoji['image'] + ' Color Picker</h3><p>Screen color pick.</p></a>',
    '<a class="tool-card" data-cat="calc" data-keywords="unit converter" href="tools/unit-converter.html"><h3>' + $catEmoji['calc'] + ' Unit Converter</h3><p>Length/weight/temp.</p></a>',
    '<a class="tool-card" data-cat="time" data-keywords="stopwatch" href="tools/stopwatch.html"><h3>' + $catEmoji['time'] + ' Stopwatch</h3><p>Precise timer.</p></a>',
    '<a class="tool-card" data-cat="time" data-keywords="countdown" href="tools/countdown.html"><h3>' + $catEmoji['time'] + ' Countdown</h3><p>Set time alarm.</p></a>',
    '<a class="tool-card" data-cat="text" data-keywords="word count" href="tools/wordcount.html"><h3>' + $catEmoji['text'] + ' Word Count</h3><p>Chars/words/lines.</p></a>',
    '<a class="tool-card" data-cat="text" data-keywords="hash sha" href="tools/hash.html"><h3>' + $catEmoji['text'] + ' Hash</h3><p>SHA-1/256/384/512.</p></a>',
    '<a class="tool-card" data-cat="fun" data-keywords="morse" href="tools/morse.html"><h3>' + $catEmoji['fun'] + ' Morse</h3><p>Text to Morse.</p></a>',
    '<a class="tool-card" data-cat="audio" data-keywords="metronome" href="tools/metronome.html"><h3>' + $catEmoji['audio'] + ' Metronome</h3><p>Beat trainer.</p></a>',
    '<a class="tool-card" data-cat="fun" data-keywords="reaction time" href="tools/reaction-time.html"><h3>' + $catEmoji['fun'] + ' Reaction Time</h3><p>Click test.</p></a>',
    '<a class="tool-card" data-cat="fun" data-keywords="emotional neglect" href="tools/emotional-neglect.html"><h3>' + $catEmoji['fun'] + ' Emotional Neglect</h3><p>Self-assessment.</p></a>',
    '<a class="tool-card" data-cat="image" data-keywords="silk screen halftone" href="tools/silk-screen.html"><h3>' + $catEmoji['image'] + ' Silk Screen</h3><p>Halftone (MIT).</p></a>',
    '<a class="tool-card" data-cat="audio" data-keywords="lyric wave player" href="tools/lyric-wave.html"><h3>' + $catEmoji['audio'] + ' Lyric Wave</h3><p>Wave + lyrics (MIT).</p></a>'
)
$cards += $origCards

foreach($f in (Get-ChildItem $OUT -File -Filter 'jh-*.html' | Sort-Object Name)){
    $name = $f.BaseName.Substring(3)
    $cat = JhCat $name
    $title = (GetMeta $f.FullName 'title') -replace '\s*-\s*Medicalstu.*$',''
    if(-not $title){ $title = $name }
    $desc = GetDesc $f.FullName
    if(-not $desc){ $desc = $title }
    $emoji = if($catEmoji[$cat]){$catEmoji[$cat]}else{$catEmoji['misc']}
    $kw = ($title + ' ' + $name).ToLower()
    $cards += ('<a class="tool-card" data-cat="{0}" data-keywords="{1}" href="tools/{2}"><h3>{3} {4}</h3><p>{5}</p></a>' -f $cat, $kw, $f.Name, $emoji, $title, $desc)
}
foreach($f in (Get-ChildItem $OUT -File -Filter 'cg-*.html' | Sort-Object Name)){
    $rest = $f.BaseName.Substring(3)
    $parts = $rest.Split('-', 2)
    $cgcat = $parts[0]
    $cat = CgCat $cgcat
    $title = (GetMeta $f.FullName 'title') -replace '\s*-\s*Medicalstu.*$',''
    if(-not $title){ $title = $parts[1] }
    $desc = GetDesc $f.FullName
    if(-not $desc){ $desc = $title }
    $emoji = if($catEmoji[$cat]){$catEmoji[$cat]}else{$catEmoji['misc']}
    $kw = ($title + ' ' + $rest).ToLower()
    $cards += ('<a class="tool-card" data-cat="{0}" data-keywords="{1}" href="tools/{2}"><h3>{3} {4}</h3><p>{5}</p></a>' -f $cat, $kw, $f.Name, $emoji, $title, $desc)
}

$catOrder = @('text','image','audio','calc','time','crypto','dev','converter','color','misc','fun')
$catBtns = '<button class="cat-btn active" data-cat="all">All</button>'
foreach($c in $catOrder){
    $catBtns += ('<button class="cat-btn" data-cat="{0}">{1}</button>' -f $c, $catLabel[$c])
}

$html = [System.IO.File]::ReadAllText($TOOLSHTML, [System.Text.Encoding]::UTF8)
$newCats = '<div class="tool-cats" id="toolCats">' + "`n            " + ($catBtns -join "`n            ") + "`n        </div>"
$newGrid = '<div class="tools-grid" id="toolGrid">' + "`n            " + ($cards -join "`n            ") + "`n        </div>"

$html = [regex]::Replace($html, '(?s)<div class="tool-cats" id="toolCats">.*?</div>\s*(?=<!-- 工具卡片网格 -->)', $newCats + "`n`n        ", [System.Text.RegularExpressions.RegexOptions]::Singleline)
$html = [regex]::Replace($html, '(?s)<div class="tools-grid" id="toolGrid">.*?</div>\s*(?=<p class="tool-empty")', $newGrid + "`n`n        ", [System.Text.RegularExpressions.RegexOptions]::Singleline)

[System.IO.File]::WriteAllText($TOOLSHTML, $html, [System.Text.Encoding]::UTF8)
'CARDS=' + $cards.Count
