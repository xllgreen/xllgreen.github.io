/**
 * Cloudflare Worker：speedtest.net 反向代理
 * 作用：绕过浏览器 CORS 限制，让纯静态 GitHub Pages 上的 test.html
 *       能对 speedtest.net 节点做完整的下载/上传测速。
 *
 * 部署步骤：
 * 1. 登录 https://dash.cloudflare.com → Workers & Pages → Create Worker
 * 2. 用本文件内容替换默认代码，保存并部署（得到如 https://speedtest-proxy.<sub>.workers.dev）
 * 3. 在 test.html 的「代理前缀」框填入该地址，点「应用」即可。
 *
 * 两种用法（前端用 ?u= 方式，最稳妥，避免 // 被 Cloudflare 规范化吞掉）：
 *   A. 查询参数： <前缀>?u=<目标完整URL编码>
 *      例： https://xxx.workers.dev/?u=http%3A%2F%2F115.169.22.130%3A8080%2Fspeedtest%2Fserver.php
 *   B. 路径方式： <前缀>/<目标完整URL>（不推荐，可能被规范化）
 */

export default {
  async fetch(request) {
    const url = new URL(request.url);

    // 优先用 ?u= 查询参数；否则回退到 path 方式
    let target = url.searchParams.get("u");
    if (!target) {
      target = url.pathname.replace(/^\//, "");
    }
    if (!target || !/^https?:\/\//i.test(target)) {
      return new Response(
        "用法:\n" +
        "  " + url.origin + "/?u=<目标完整URL(需 encodeURIComponent)>\n" +
        "  " + url.origin + "/<目标完整URL>",
        { status: 400, headers: { "Content-Type": "text/plain; charset=utf-8" } }
      );
    }

    const targetUrl = new URL(target);

    // 白名单：允许 speedtest 节点（通常是 IP:8080 或含 speedtest/ookla 等关键字的主机）
    // 也可临时放开做自测，但建议保持严格以避免被盗用。
    const allowed = /(speedtest|ookla|jsinfo|sccncnc|shtel|bjtelecom|hbtelecom|sncnc|zjtelecom|hinet|singnet|bbtower|asahi-net|pccw|hgc|tk2|kix|sgnet|szhc|jsqiuying|\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}:8080\b)/i;
    if (!allowed.test(targetUrl.hostname) && !/:\d{2,5}$/.test(targetUrl.host)) {
      return new Response("不允许的主机: " + targetUrl.hostname, { status: 403 });
    }

    // 构造转发请求
    const init = {
      method: request.method,
      headers: {},
      redirect: "follow",
    };
    for (const [k, v] of request.headers) {
      if (k.toLowerCase() === "host") continue;
      if (k.toLowerCase() === "cf-connecting-ip") continue;
      init.headers[k] = v;
    }
    init.headers["host"] = targetUrl.host;

    if (request.method !== "GET" && request.method !== "HEAD") {
      init.body = request.body;
    }

    try {
      const resp = await fetch(targetUrl.toString(), init);
      const newHeaders = new Headers(resp.headers);
      newHeaders.set("Access-Control-Allow-Origin", "*");
      newHeaders.set("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS");
      newHeaders.set("Access-Control-Allow-Headers", "*");
      return new Response(resp.body, {
        status: resp.status,
        statusText: resp.statusText,
        headers: newHeaders,
      });
    } catch (e) {
      return new Response("代理错误: " + e.message, { status: 502 });
    }
  },
};
