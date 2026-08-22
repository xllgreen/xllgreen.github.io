# Cloudflare Worker 接入

1. Cloudflare Dashboard → Workers & Pages → Create → Hello World。
2. Worker → Settings / Bindings → Add binding → Workers AI，变量名填 `AI`。
3. 将 `worker.js` 全部复制到 Edit code。
4. 把 `ALLOWED_ORIGINS` 改成实际前端 Origin，例如 `https://mike798-cloud.github.io`；如使用自定义域名或 Pages 域名，也加入集合。
5. Deploy 后得到 `https://xxx.workers.dev`。
6. 编辑根目录 `config.js`，填写 `/action` 地址。

前端默认 4.5 秒 AI 超时；超时、网络失败或 Worker 报错都会自动回退本地规则，不阻塞游戏。
Worker 会限制玩家文本长度、请求体大小和 `visibleContext` 的字段/长度。若你在 Cloudflare 配置了 Rate Limiting binding，变量名可设为 `RATE_LIMITER`，代码会自动启用。

Worker 只解析行动，不掌握真相、时间线、NPC状态和结局判定。
