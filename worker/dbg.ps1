$path = 'c:/Users/49708/Documents/GitHub/xllgreen.github.io/worker/cat_labels.txt'
$s = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)
# take the 'all|全部' label
$lines = $s -split "`n"
$first = $lines[0]
Write-Output ("Read line: [$first]")
# bytes of this .NET string when encoded back to UTF8
$b = [System.Text.Encoding]::UTF8.GetBytes($first)
Write-Output ("UTF8 bytes: " + ($b -join ','))
# write to debug file with StreamWriter UTF8 (no BOM)
$w = [System.IO.StreamWriter]::new('c:/Users/49708/Documents/GitHub/xllgreen.github.io/worker/dbg_out.txt', $false, [System.Text.Encoding]::UTF8)
$w.Write($first)
$w.Close()
