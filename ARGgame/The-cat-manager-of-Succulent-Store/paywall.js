"use strict";

(() => {
  const STORAGE_KEY = "cat_shop_voluntary_support_v2";

  function supported() {
    try { return Boolean(localStorage.getItem(STORAGE_KEY)); }
    catch (_) { return false; }
  }

  function markSupported() {
    try { localStorage.setItem(STORAGE_KEY, String(Date.now())); }
    catch (_) { /* 支持状态写入失败不影响游戏 */ }
  }

  function hide() {
    const overlay = document.getElementById("supportOverlay");
    if (!overlay) return;
    overlay.classList.remove("show");
    window.setTimeout(() => overlay.remove(), 220);
  }

  function show() {
    const old = document.getElementById("supportOverlay");
    if (old) { old.classList.add("show"); return; }
    const overlay = document.createElement("div");
    overlay.id = "supportOverlay";
    overlay.className = "paywall-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-labelledby", "supportTitle");
    overlay.innerHTML = `
      <section class="paywall-card">
        <button class="paywall-close" data-support-close aria-label="关闭">×</button>
        <p class="paywall-kicker">完全自愿 · 不影响游玩</p>
        <h2 id="supportTitle">给猫店长添一颗小鱼干</h2>
        <div class="paywall-free-note">
          <strong>不支持也能完整游玩。</strong>
          <span>全部 12 章、三级免费提示、所有结局和图鉴都不会被付款锁定。</span>
        </div>
        <div class="paywall-body">
          <img src="paycode.png" alt="一元自愿支持收款码" class="paywall-qr-img">
          <div class="paywall-copy">
            <p>这是一项对独立创作的自愿支持，不是购买提示，也不是解锁章节。</p>
            <p>扫码金额为 <b>¥1</b>。完成后可点击“我已支持”，本浏览器只会记住感谢状态。</p>
          </div>
        </div>
        <div class="paywall-btns">
          <button class="paywall-btn primary" data-support-done>${supported() ? "已经支持过了，谢谢你" : "我已完成 ¥1 支持"}</button>
          <button class="paywall-btn secondary" data-support-close>暂不支持，继续游戏</button>
        </div>
        <p class="paywall-foot">关闭弹窗不会影响进度，也不会在章节中自动弹出。</p>
      </section>`;
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add("show"));
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay || event.target.closest("[data-support-close]")) hide();
      if (event.target.closest("[data-support-done]")) {
        markSupported();
        hide();
        window.dispatchEvent(new CustomEvent("catshop:supported"));
      }
    });
    const close = overlay.querySelector(".paywall-close");
    close?.focus();
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && document.getElementById("supportOverlay")) hide();
  });

  window.Paywall = { show, hide, hasPaid: supported, markPaid: markSupported };
})();
