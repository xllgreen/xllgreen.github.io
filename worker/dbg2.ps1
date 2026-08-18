$test = '<button data-zh="全部" data-en="All">全部</button>'
[System.IO.File]::WriteAllText('c:/Users/49708/Documents/GitHub/xllgreen.github.io/worker/dbg2_out.txt', $test, [System.Text.Encoding]::UTF8)
$b = [System.IO.File]::ReadAllBytes('c:/Users/49708/Documents/GitHub/xllgreen.github.io/worker/dbg2_out.txt')
Write-Output ('dbg2 bytes: ' + ($b -join ','))
