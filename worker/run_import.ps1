$ErrorActionPreference = 'Stop'
try {
    $out = & python 'c:/Users/49708/Documents/GitHub/xllgreen.github.io/worker/import_justhtmls.py' 2>&1
    $out | Out-File -Encoding utf8 'c:/Users/49708/Documents/GitHub/xllgreen.github.io/worker/jh_out.txt'
    "DONE lines=$($out.Count)" | Out-File -Append -Encoding utf8 'c:/Users/49708/Documents/GitHub/xllgreen.github.io/worker/jh_out.txt'
} catch {
    "ERROR: $_" | Out-File -Encoding utf8 'c:/Users/49708/Documents/GitHub/xllgreen.github.io/worker/jh_out.txt'
}
