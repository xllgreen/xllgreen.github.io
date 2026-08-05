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
 * 用法（前端拼接）： PROXY + "http://<host>:<port>/speedtest/xxx"
 * 例如： https://speedtest-proxy.xxx.workers.dev/http://115.169.22.130:8080/speedtest/server.php
 */

export default {
  async fetch(request) {
    const url = new URL(request.url);

    // /http://... 或 /https://... 形式：把路径当作目标 URL
    let target = url.pathname.replace(/^\//, "");
    if (!/^https?:\/\//i.test(target)) {
      return new Response("用法: " + url.origin + "/<目标完整URL>", { status: 400 });
    }

    const targetUrl = new URL(target);

    // 仅允许代理 speedtest.net 相关节点（简单白名单，避免被滥用）
    const allowed = /(speedtest|ooklaserver|jsinfo|sccncnc|shtel|bjtelecom|hbtelecom|sncnc|zjtelecom|hinet|singnet|bbtower|asahi-net|pccw|hgc|tk2|kix|sgnet|szhc|jsqiuying)/i;
    if (!allowed.test(targetUrl.hostname)) {
      return new Response("不允许的主机: " + targetUrl.hostname, { status: 403 });
    }

    // 构造转发请求（保留方法、请求体、部分头）
    const init = {
      method: request.method,
      headers: {},
      redirect: "follow",
    };
    // 透传常见头，去掉 host
    for (const [k, v] of request.headers) {
      if (k.toLowerCase() === "host") continue;
      init.headers[k] = v;
    }
    // 强制 target host
    init.headers["host"] = targetUrl.host;

    if (request.method !== "GET" && request.method !== "HEAD") {
      init.body = request.body;
    }

    try {
      const resp = await fetch(targetUrl.toString(), init);
      const newHeaders = new Headers(resp.headers);
      // 关键：添加 CORS 头，允许前端跨域读取
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
