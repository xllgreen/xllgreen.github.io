$p='c:/Users/49708/Documents/GitHub/xllgreen.github.io/worker/title_map.txt'
$c=[System.IO.File]::ReadAllText($p,[System.Text.Encoding]::UTF8)
$c=$c.Replace('tools/cg-ai-mcp-clients.html|MCPClients','tools/cg-ai-mcp-clients.html|MCP客户端')
$c=$c.Replace('tools/cg-converter-csv-json.html|CSVJSON','tools/cg-converter-csv-json.html|CSV/JSON转换')
$c=$c.Replace('tools/cg-seo-og-preview.html|OGPreview','tools/cg-seo-og-preview.html|OG预览')
$c=$c.Replace('tools/cg-seo-meta-tags-generator.html|BBCodeConverter','tools/cg-seo-meta-tags-generator.html|BBCode转换器')
$c=$c.Replace('tools/cg-game-tic-tac-toe.html|TicTacToe','tools/cg-game-tic-tac-toe.html|井字棋')
[System.IO.File]::WriteAllText($p,$c,[System.Text.Encoding]::UTF8)
Write-Output 'patched'
