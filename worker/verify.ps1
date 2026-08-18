$h = [System.IO.File]::ReadAllText('c:/Users/49708/Documents/GitHub/xllgreen.github.io/tools.html', [System.Text.Encoding]::UTF8)
$i = $h.IndexOf('id="toolCats"')
Write-Output $h.Substring($i, 420)
