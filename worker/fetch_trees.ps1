$repos = @('chicogong/html-tools', 'justhtmls/html-tools')
foreach ($repo in $repos) {
    $meta = Invoke-WebRequest -Uri "https://api.github.com/repos/$repo" -UseBasicParsing
    $m = $meta.Content | ConvertFrom-Json
    $branch = $m.default_branch
    Write-Host "=== $repo (branch: $branch) ==="
    $url = "https://api.github.com/repos/$repo/git/trees/$branch`?recursive=1"
    $resp = Invoke-WebRequest -Uri $url -UseBasicParsing
    $tree = $resp.Content | ConvertFrom-Json
    foreach ($item in $tree.tree) {
        if ($item.type -eq 'blob') {
            Write-Host $item.path
        }
    }
}
