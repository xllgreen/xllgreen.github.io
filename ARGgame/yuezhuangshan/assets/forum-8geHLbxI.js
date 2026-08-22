import{F as r}from"./content-3TOPq97T.js";import{b as f,e as n}from"./bootstrap-DCiwK5RO.js";const{denied:y}=f({pageId:"forum",brand:"岳桩村乡邻论坛",domain:"yuezhuang-cun.cn",skin:"forum",node:"SIDE_FORUM",accessDeniedHint:"论坛需要先了解岳桩山的基本情况。"});y&&(document.getElementById("root").hidden=!0);const p=document.getElementById("root");p.hidden=!1;const s=document.getElementById("forumList"),i=document.getElementById("forumDetail"),m=document.getElementById("forumSearch");let d="全部";function u(t){s.innerHTML=t.map(e=>`<li class="forum-item" data-id="${e.id}" tabindex="0" role="button">
      <span class="forum-cat">${n(e.category)}</span>
      <span class="forum-title ${e.id==="f2"?"key":""}">${n(e.title)}</span>
      <span class="forum-meta">${n(e.user)} · ${n(e.date)}</span>
      <span class="forum-meta">${e.replies} 回复</span>
    </li>`).join(""),s.querySelectorAll(".forum-item").forEach(e=>{const o=()=>b(e.dataset.id);e.addEventListener("click",o),e.addEventListener("keydown",a=>{(a.key==="Enter"||a.key===" ")&&(a.preventDefault(),o())})})}function b(t){const e=r.find(o=>o.id===t);s.hidden=!0,i.hidden=!1,i.innerHTML=`
    <div class="forum-detail">
      <button class="btn" id="backToList" style="float:right; color:#333; border-color:#999">返回列表</button>
      <h2>${n(e.title)}</h2>
      <div class="meta">${n(e.user)} · ${n(e.date)} · 【${n(e.category)}】 · ${e.replies} 回复</div>
      <div class="body">${n(e.body??e.snippet)}</div>
      <hr style="margin:1em 0; border-color:#ddd" />
      <div style="font-size:13px; color:#999">— 本帖有 ${e.replies} 条回复，暂未显示 —</div>
    </div>`,document.getElementById("backToList").addEventListener("click",v),i.scrollIntoView({behavior:"smooth"})}function v(){i.hidden=!0,s.hidden=!1}const E=["全部",...Array.from(new Set(r.map(t=>t.category)))],l=document.getElementById("forumFilter");l.innerHTML=E.map(t=>`<button class="btn forum-filter-btn ${t==="全部"?"active":""}" data-cat="${t}" style="color:#333; border-color:#bbb; font-size:13px; padding:3px 10px">${t}</button>`).join(" ");function c(){const t=m.value.trim().toLowerCase();let e=d==="全部"?r:r.filter(o=>o.category===d);t&&(e=e.filter(o=>o.title.toLowerCase().includes(t)||(o.body??o.snippet).toLowerCase().includes(t))),u(e)}l.querySelectorAll(".forum-filter-btn").forEach(t=>{t.addEventListener("click",()=>{d=t.dataset.cat,l.querySelectorAll(".forum-filter-btn").forEach(e=>e.classList.remove("active")),t.classList.add("active"),c()})});document.getElementById("forumSearchBtn").addEventListener("click",c);m.addEventListener("keydown",t=>{t.key==="Enter"&&c()});u(r);
