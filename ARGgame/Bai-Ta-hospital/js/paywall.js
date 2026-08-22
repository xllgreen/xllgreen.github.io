/**
 * 白塔医院：零点交班 — 1元自愿支持
 * 沿用《松涛粮站》的纯前端自愿打赏逻辑：不校验真实付款、不锁游戏内容。
 */
window.Paywall = {
  STORAGE_KEY: '_abc_studio_baita_support',
  SESSION_KEY: '_abc_studio_baita_session',
  COOKIE_KEY: '_abc_baita_flag',
  AUTO_KEY: '_abc_baita_support_prompted_v2',

  hasSupported() {
    try {
      return !!(localStorage.getItem(this.STORAGE_KEY) || sessionStorage.getItem(this.SESSION_KEY) || this._getCookie(this.COOKIE_KEY));
    } catch (_) { return !!this._getCookie(this.COOKIE_KEY); }
  },

  markSupported() {
    const token = btoa(`${Date.now()}_${Math.random().toString(36).slice(2,10)}_baita`);
    try { localStorage.setItem(this.STORAGE_KEY, token); } catch (_) {}
    try { sessionStorage.setItem(this.SESSION_KEY, token); } catch (_) {}
    this._setCookie(this.COOKIE_KEY, token, 365);
  },

  hasAutoPrompted() {
    try { return localStorage.getItem(this.AUTO_KEY) === '1'; } catch (_) { return false; }
  },

  markAutoPrompted() {
    try { localStorage.setItem(this.AUTO_KEY, '1'); } catch (_) {}
  },

  showOnce(config = {}) {
    if (this.hasAutoPrompted()) return false;
    if (this.hasSupported()) { this.markAutoPrompted(); return false; }
    this.markAutoPrompted();
    this.show(config);
    return true;
  },

  showManual(config = {}) {
    this.markAutoPrompted();
    this.show(config);
    return true;
  },

  show(config = {}) {
    const existing = document.getElementById('paywall-overlay');
    if (existing) {
      existing.style.display = 'flex';
      existing.classList.remove('paywall-closing');
      requestAnimationFrame(() => existing.classList.add('paywall-show'));
      return;
    }
    const cfg = Object.assign({
      qrCode: 'assets/paycode.png',
      price: '1元',
      title: '支持白塔医院档案调查',
      studio: 'abc studio'
    }, config);
    const html = `
      <div class="paywall-overlay" id="paywall-overlay" role="dialog" aria-modal="true" aria-label="1元自愿支持">
        <div class="paywall-card">
          <button class="paywall-close" type="button" onclick="Paywall.hide()" title="关闭">×</button>
          <div class="paywall-card-inner">
            <div class="paywall-header">
              <div class="paywall-title-row"><span class="paywall-heart">♡</span><span>${cfg.title}</span><span class="paywall-heart">♡</span></div>
              <div class="paywall-subtitle">${cfg.price} 自愿打赏 · 不付款也可完整游玩</div>
            </div>
            <div class="paywall-body">
              <div>
                <div class="paywall-qr-wrapper"><img src="${cfg.qrCode}" alt="支付宝固定金额1元收款码" class="paywall-qr-img"></div>
                <div class="paywall-qr-tip">使用支付宝扫码，固定金额 ${cfg.price}</div>
              </div>
              <div class="paywall-message">
                <p class="paywall-msg-warm">你已经进入白塔医院的历史网络。</p>
                <p>《白塔医院：零点交班》可以免费完整游玩。若你喜欢这种伪医院网页、跨系统查证和档案推理的形式，可以自愿支持 1 元。</p>
                <p class="paywall-msg-cute">扫码与否都不会锁住页面、提示、线索或结局。</p>
                <p>感谢你愿意把时间留给十三年前那场没有完成的交班。</p>
              </div>
            </div>
            <div class="paywall-footer">
              <div class="paywall-hint">“已完成支持”只用于本机记录，不会自动验证付款。</div>
              <div class="paywall-btns">
                <button class="paywall-btn paywall-btn-support" type="button" onclick="Paywall._onSupport()">已完成支持 ♡</button>
                <button class="paywall-btn" type="button" onclick="Paywall.hide()">继续调查</button>
              </div>
            </div>
            <div class="paywall-studio">${cfg.studio} / 白塔医院档案调查项目</div>
          </div>
        </div>
      </div>`;
    document.body.insertAdjacentHTML('beforeend', html);
    const overlay = document.getElementById('paywall-overlay');
    requestAnimationFrame(() => requestAnimationFrame(() => overlay.classList.add('paywall-show')));
  },

  hide() {
    const overlay = document.getElementById('paywall-overlay');
    if (!overlay) return;
    overlay.classList.add('paywall-closing');
    overlay.classList.remove('paywall-show');
    setTimeout(() => { overlay.style.display = 'none'; }, 360);
  },

  _onSupport() {
    this.markSupported();
    this.hide();
    const toast = document.createElement('div');
    toast.className = 'paywall-toast';
    toast.textContent = '感谢支持。调查不会因此改变任何线索或结局。';
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 30);
    setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 350); }, 2800);
  },

  _setCookie(name, value, days) {
    try {
      const d = new Date(Date.now() + days * 86400000);
      document.cookie = `${name}=${encodeURIComponent(value)};expires=${d.toUTCString()};path=/;SameSite=Lax`;
    } catch (_) {}
  },
  _getCookie(name) {
    try {
      const prefix = `${name}=`;
      const row = document.cookie.split(';').map(x => x.trim()).find(x => x.startsWith(prefix));
      return row ? decodeURIComponent(row.slice(prefix.length)) : '';
    } catch (_) { return ''; }
  }
};
