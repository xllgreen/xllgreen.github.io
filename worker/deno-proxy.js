/**
 * Deno Deploy：speedtest.net 反向代理
 * 相比 Cloudflare Workers，Deno 对"出站 fetch 任意 IP:端口"没有边缘限制，
 * 更适合做 speedtest 节点代理（避免 Cloudflare 的 1003 错误）。
 *
 * 部署步骤（无需 Node/本地构建）：
 * 1. 打开 https://deno.com/deploy → 用 GitHub 登录 → New Project
 * 2. 选择 "Deploy from URL" 或 "Playground"：
 *    - Playground：把本文件内容粘贴进去，Save & Deploy（得到 https://<项目名>.deno.dev）
 *    - 或关联 GitHub 仓库，指定入口文件为 worker/deno-proxy.js
 * 3. 在 test.html 的「代理前缀」框填入该地址（如 https://xxx.deno.dev/），点「应用」。
 *
 * 用法（前端用 ?u= base64 编码目标）：
 *   <前缀>?u=<目标完整URL的base64>
 */

function handler(req) {
  const url = new URL(req.url);

  // 优先 ?u= 参数（支持 base64 或明文 encodeURIComponent）
  let target = url.searchParams.get("u");
  if (target) {
    try {
      const decoded = atob(target);
      if (/^https?:\/\//i.test(decoded)) target = decoded;
    } catch (e) { /* 非 base64，按明文 */ }
  }
  if (!target) {
    target = url.pathname.replace(/^\//, "");
  }
  if (!target || !/^https?:\/\//i.test(target)) {
    return new Response(
      "用法:\n  " + url.origin + "/?u=<目标完整URL的base64>",
      { status: 400, headers: { "Content-Type": "text/plain; charset=utf-8" } }
    );
  }

  const targetUrl = new URL(target);

  // 白名单：允许 speedtest 节点（含关键字的主机 或 任意 IPv4 地址）
  const allowed = /(speedtest|ookla|jsinfo|sccncnc|shtel|bjtelecom|hbtelecom|sncnc|zjtelecom|hinet|singnet|bbtower|asahi-net|pccw|hgc|tk2|kix|sgnet|szhc|jsqiuying|\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b)/i;
  if (!allowed.test(targetUrl.hostname)) {
    return new Response("不允许的主机: " + targetUrl.hostname, { status: 403 });
  }

  // 构造转发请求（透传方法/请求体，重写 host）
  const headers = {};
  for (const [k, v] of req.headers) {
    if (k.toLowerCase() === "host") continue;
    headers[k] = v;
  }
  headers["host"] = targetUrl.host;

  const init = { method: req.method, headers };
  if (req.method !== "GET" && req.method !== "HEAD") {
    init.body = req.body;
  }

  // 处理浏览器 CORS 预检
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, HEAD, OPTIONS",
        "Access-Control-Allow-Headers": "*",
      },
    });
  }

  return fetch(targetUrl.toString(), init).then((resp) => {
    const h = new Headers(resp.headers);
    h.set("Access-Control-Allow-Origin", "*");
    h.set("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS");
    h.set("Access-Control-Allow-Headers", "*");
    return new Response(resp.body, {
      status: resp.status,
      statusText: resp.statusText,
      headers: h,
    });
  }).catch((e) => {
    return new Response("代理错误: " + e.message, { status: 502 });
  });
}

// 兼容两种 Deno 入口方式
export default { fetch: handler };
if (typeof addEventListener !== "undefined") {
  addEventListener("fetch", (event) => {
    event.respondWith(handler(event.request));
  });
}
