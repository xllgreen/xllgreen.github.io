$vendor = 'c:/Users/49708/Documents/GitHub/xllgreen.github.io/static/vendor'
Get-ChildItem $vendor -File | Where-Object { $_.Name -match 'wasm|worker|katex.min.css|leaflet.css|css' } | ForEach-Object { Write-Host ($_.Name + "  " + $_.Length) }
