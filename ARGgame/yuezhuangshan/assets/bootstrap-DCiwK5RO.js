import{k as c,i as r,n as s,I as l}from"./content-3TOPq97T.js";function m(){let e=document.querySelector('link[rel="icon"]');e||(e=document.createElement("link"),e.rel="icon",document.head.appendChild(e)),e.href=l.favicon}function o(e,n){const a=document.createElement("div");return a.className="faux-bar",a.innerHTML=`
    <span class="faux-brand">${d(e)}</span>
    <span class="faux-url">https://${d(n)}/</span>
    <a class="btn" href="${i("index")}">返回导航首页</a>
  `,a}function i(e){return{index:"../../../yuezhuangshan.html",mail:"../mail/index.html",scenic:"../scenic/index.html",chat:"../chat/index.html",news:"../news/index.html",backend:"../backend/index.html",ending:"../ending/index.html"}[e]}function p(e){c(),m(),document.body.classList.add(`skin-${e.skin}`);const n=!r(e.node),a=o(e.brand,e.domain);if(document.body.prepend(a),n){const t=document.createElement("div");return t.className="page",t.innerHTML=`
      <h1>暂无法访问</h1>
      <p>${d(e.accessDeniedHint??"你还没有找到通往这里的入口。回到之前的线索继续调查。")}</p>
      <p><a class="btn" href="${i("index")}">返回导航首页</a></p>
    `,document.body.appendChild(t),{denied:!0}}return s(e.pageId),{denied:!1}}function d(e){return e.replace(/[&<>"']/g,n=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[n])}export{p as b,d as e};
