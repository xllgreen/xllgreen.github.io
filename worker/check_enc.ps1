$b = [System.IO.File]::ReadAllBytes('c:/Users/49708/Documents/GitHub/xllgreen.github.io/worker/cat_labels.txt')
Write-Output ("cat_labels head bytes: " + ($b[0..8] -join ','))
$t = [System.IO.File]::ReadAllBytes('c:/Users/49708/Documents/GitHub/xllgreen.github.io/tools/cg-ai-ai-coding-tools-2025.html')
Write-Output ("tool html head bytes: " + ($t[0..8] -join ','))
# try decode cat_labels as UTF8 and as Default
$u = [System.Text.Encoding]::UTF8.GetString($b, 0, [Math]::Min(20, $b.Length))
$d = [System.Text.Encoding]::Default.GetString($b, 0, [Math]::Min(20, $b.Length))
Write-Output ("UTF8 view:  $u")
Write-Output ("Default view: $d")
