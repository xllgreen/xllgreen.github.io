import{l as f,I as p,M as a,g as h,h as I,d as c,u as m}from"./content-3TOPq97T.js";import{b as N,e as d}from"./bootstrap-DCiwK5RO.js";import{C as n}from"./clues-BYTSZugx.js";const{denied:E}=N({pageId:"mail",brand:"云雁邮",domain:"yunyan.mail",skin:"mail",node:"P01",accessDeniedHint:"邮箱尚未开通。"});E&&(document.getElementById("root").hidden=!0);const g=document.getElementById("root");g.hidden=!1;const v=[{id:"awardNotice",...a.awardNotice,requireNode:"P01"},{id:"bankStatement",...a.bankStatement,requireNode:"P01"},{id:"preInvite",...a.preInvite,requireNode:"P01"},{id:"invite",...a.invite,key:n.INVITE,requireNode:"P01"},{id:"schedule",...a.schedule,requireNode:"P01"},{id:"checkin",...a.checkin,key:n.CREDENTIAL_HINT,requireNode:"P01"},{id:"hotelConfirm",...a.hotelConfirm,requireNode:"P01"},{id:"spam",...a.spam,requireNode:"P01"},{id:"peerAuthor",...a.peerAuthor,requireNode:"P02"},{id:"shenranWarn",...a.shenranWarn,requireNode:"P04"}];function k(){return v.filter(t=>h(t.requireNode??"P01")).sort((t,e)=>t.date<e.date?1:-1)}let l=new Set(f().readMails);const r=document.getElementById("mailList"),s=document.getElementById("mailView");s.innerHTML='<div class="mail-view-empty">← 从左侧选择一封邮件查看</div>';function y(){const t=k();r.innerHTML=t.map(e=>{const i=!l.has(e.id);return`<div class="mail-item ${i?"unread":""}" data-id="${e.id}" tabindex="0" role="button">
        <div style="display:flex; gap:0.6em; align-items:center">
          <img class="mail-avatar" src="${p.mailAvatar}" alt="" width="32" height="32" />
          <div>
            <div>${i?'<span class="mail-dot">●</span> ':""}<strong>${d(e.subject)}</strong></div>
            <div style="opacity:0.6; font-size:0.85em">${d(e.from)}</div>
            <div style="opacity:0.5; font-size:0.8em">${d(e.date)}</div>
          </div>
        </div>
      </div>`}).join(""),r.querySelectorAll(".mail-item").forEach(e=>{const i=e.dataset.id;e.addEventListener("click",()=>u(i)),e.addEventListener("keydown",o=>{(o.key==="Enter"||o.key===" ")&&(o.preventDefault(),u(i))})}),L(t)}function u(t){const e=v.find(i=>i.id===t);l.add(t),I(i=>{i.readMails.includes(t)||i.readMails.push(t)}),y(),r.querySelectorAll(".mail-item").forEach(i=>i.classList.toggle("active",i.dataset.id===t)),s.innerHTML=`
    <div style="opacity:0.7; font-size:0.85em">发件人：${d(e.from)}</div>
    <div style="opacity:0.7; font-size:0.85em">收件人：${d(e.to??"我")}</div>
    <div style="opacity:0.5; font-size:0.8em">${d(e.date)}</div>
    <h2 style="margin:0.4em 0">${d(e.subject)}</h2>
    <div class="mail-body">${d(e.body)}</div>
  `,s.scrollTop=0,e.key===n.INVITE&&(c(n.INVITE),m("P02"),m("P03")),e.key===n.CREDENTIAL_HINT&&c(n.CREDENTIAL_HINT)}function L(t){const e=t.filter(o=>!l.has(o.id)).length,i=document.getElementById("readHint");e>0?i.innerHTML=`<span style="color:#ff8a8a">●</span> ${e} 封未读`:i.textContent=""}y();
