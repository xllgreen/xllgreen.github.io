/**
 * 通用付费支持系统 v1.0
 * 复用潮汐福利院的纯前端 localStorage / sessionStorage / cookie 标记方案。
 * 当前作品适配：《桂花巷三号杂货铺》
 */

const Paywall = {
  STORAGE_KEY: "_abc_studio_support_guihuaxiang",
  SESSION_KEY: "_abc_studio_session_guihuaxiang",
  COOKIE_KEY: "_abc_pay_flag_guihuaxiang",

  hasPaid() {
    const ls = localStorage.getItem(this.STORAGE_KEY);
    const ss = sessionStorage.getItem(this.SESSION_KEY);
    const cookie = this._getCookie(this.COOKIE_KEY);
    return !!(ls || ss || cookie);
  },

  markPaid() {
    const token = this._generateToken();
    localStorage.setItem(this.STORAGE_KEY, token);
    sessionStorage.setItem(this.SESSION_KEY, token);
    this._setCookie(this.COOKIE_KEY, token, 365);
  },

  _generateToken() {
    const ts = Date.now();
    const rand = Math.random().toString(36).slice(2, 10);
    return btoa(`${ts}_${rand}_abc_studio_guihuaxiang`);
  },

  _setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${d.toUTCString()};path=/`;
  },

  _getCookie(name) {
    const cname = name + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      const c = ca[i].trim();
      if (c.indexOf(cname) === 0) return c.substring(cname.length);
    }
    return "";
  },

  show(config) {
    if (this.hasPaid()) return;
    const overlay = document.getElementById("paywall-overlay");
    if (!overlay) {
      this._createOverlay(config);
    } else {
      overlay.style.display = "flex";
      overlay.classList.remove("paywall-show");
      requestAnimationFrame(() => {
        requestAnimationFrame(() => overlay.classList.add("paywall-show"));
      });
    }
  },

  hide() {
    const overlay = document.getElementById("paywall-overlay");
    if (overlay) {
      overlay.classList.add("paywall-closing");
      overlay.classList.remove("paywall-show");
      setTimeout(() => {
        overlay.style.display = "none";
        overlay.classList.remove("paywall-closing");
      }, 400);
    }
  },

  _onSupport() {
    this.markPaid();
    this.hide();
    this._showThanks();
  },

  _showThanks() {
    const toast = document.createElement("div");
    toast.className = "paywall-toast";
    toast.innerHTML = "谢谢你给桂花巷续了一盏灯。继续慢慢逛吧 ♡";
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add("show"), 50);
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 400);
    }, 3200);
  },

  _animateIn() {
    const overlay = document.getElementById("paywall-overlay");
    if (overlay) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => overlay.classList.add("paywall-show"));
      });
    }
  },

  _createOverlay(config) {
    const defaultConfig = {
      qrCode: "paycode.png",
      price: "1元",
      title: "给桂花巷续一盏灯",
      studio: "abc studio"
    };
    const cfg = Object.assign(defaultConfig, config || {});

    const html = `
      <div class="paywall-overlay" id="paywall-overlay">
        <div class="paywall-card">
          <button class="paywall-close" onclick="Paywall.hide()" title="关闭">&times;</button>
          <div class="paywall-card-inner">
            <div class="paywall-header">
              <div class="paywall-title-row">
                <span class="paywall-heart">✿</span>
                <span class="paywall-title">${cfg.title}</span>
                <span class="paywall-heart">✿</span>
              </div>
              <div class="paywall-subtitle">${cfg.price} 支持 · 感谢每一次认真游玩</div>
            </div>
            <div class="paywall-body">
              <div>
                <div class="paywall-qr-wrapper">
                  <img src="${cfg.qrCode}" alt="收款码" class="paywall-qr-img" />
                  <div class="paywall-qr-glow"></div>
                </div>
                <div class="paywall-qr-tip">请用 <strong>某宝</strong> 扫码支持 ${cfg.price}</div>
              </div>
              <div class="paywall-message">
                <p class="paywall-msg-warm">你好，我是 abc studio 的独立开发者。</p>
                <p class="paywall-msg-body">
                  《桂花巷三号杂货铺》是一部慢慢翻旧物、慢慢说再见的互动解谜作品。<br>
                  如果这家小店让你想起了某个夏天，愿意用 <strong>1元</strong> 支持一下，<br>
                  就像替柜台上的风铃添了一点亮光。
                </p>
                <p class="paywall-msg-cute">
                  1块钱买不到一瓶橘子汽水，但能让开发者熬夜时多笑一下 (´▽｀)ノ♪
                </p>
                <p class="paywall-msg-warm2">
                  支持完成后点击“已完成支持”，浏览器会记住这次心意。
                </p>
              </div>
            </div>
            <div class="paywall-footer">
              <div class="paywall-hint">
                <span class="paywall-hint-icon">💡</span>
                <span>小提示：请勿清除浏览器数据，否则下次打开可能会再次看到这里。</span>
              </div>
              <div class="paywall-btns">
                <button class="paywall-btn paywall-btn-support" onclick="Paywall._onSupport()">已完成支持 ♡</button>
                <button class="paywall-btn paywall-btn-later" onclick="Paywall.hide()">稍后再说</button>
              </div>
            </div>
            <div class="paywall-studio">${cfg.studio}</div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML("beforeend", html);
    this._animateIn();
  }
};

window.Paywall = Paywall;
