/**
 * 《静默之心》自愿支持系统 v1.0
 * 基于《松涛粮站》的纯前端 1 元支持流程改造：
 * - 不阻断剧情，不验证真实支付结果；
 * - localStorage / sessionStorage / Cookie 宽松记录；
 * - 顶部常驻入口；首次抵达“真相”或完成结局选择后仅自动提示一次。
 */
(function () {
  'use strict';

  const Paywall = {
    STORAGE_KEY: '_jingmozhixin_support',
    SESSION_KEY: '_jingmozhixin_support_session',
    COOKIE_KEY: '_jingmo_support_flag',
    PROMPT_KEY: '_jingmozhixin_support_prompted_v1',
    _lastFocus: null,
    _showTimer: 0,

    _safeGet(storage, key) {
      try { return storage.getItem(key) || ''; } catch (_) { return ''; }
    },

    _safeSet(storage, key, value) {
      try { storage.setItem(key, value); return true; } catch (_) { return false; }
    },

    hasPaid() {
      const ls = this._safeGet(window.localStorage, this.STORAGE_KEY);
      const ss = this._safeGet(window.sessionStorage, this.SESSION_KEY);
      const cookie = this._getCookie(this.COOKIE_KEY);
      return Boolean(ls || ss || cookie);
    },

    markPaid() {
      const token = this._generateToken();
      this._safeSet(window.localStorage, this.STORAGE_KEY, token);
      this._safeSet(window.sessionStorage, this.SESSION_KEY, token);
      this._setCookie(this.COOKIE_KEY, token, 365);
      this._updateSupportButton();
    },

    _generateToken() {
      const raw = `${Date.now()}_${Math.random().toString(36).slice(2, 10)}_jingmozhixin`;
      try { return window.btoa(unescape(encodeURIComponent(raw))); }
      catch (_) { return raw; }
    },

    _setCookie(name, value, days) {
      try {
        const expires = new Date(Date.now() + days * 86400000).toUTCString();
        document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires};path=/;SameSite=Lax`;
      } catch (_) {}
    },

    _getCookie(name) {
      try {
        const prefix = `${name}=`;
        const item = document.cookie.split(';').map(v => v.trim()).find(v => v.startsWith(prefix));
        return item ? decodeURIComponent(item.slice(prefix.length)) : '';
      } catch (_) { return ''; }
    },

    show(options) {
      const opts = Object.assign({ manual: false }, options || {});
      if (this.hasPaid()) {
        if (opts.manual) this._showThanks('你已经留下过支持记录，感谢你。');
        return;
      }

      this._lastFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      let overlay = document.getElementById('paywall-overlay');
      if (!overlay) overlay = this._createOverlay();
      overlay.hidden = false;
      overlay.classList.remove('paywall-closing');
      document.body.classList.add('paywall-open');
      requestAnimationFrame(() => requestAnimationFrame(() => overlay.classList.add('paywall-show')));
      const close = overlay.querySelector('.paywall-close');
      if (close) setTimeout(() => close.focus(), 30);
    },

    hide() {
      const overlay = document.getElementById('paywall-overlay');
      if (!overlay || overlay.hidden) return;
      overlay.classList.add('paywall-closing');
      overlay.classList.remove('paywall-show');
      document.body.classList.remove('paywall-open');
      window.setTimeout(() => {
        overlay.hidden = true;
        overlay.classList.remove('paywall-closing');
        if (this._lastFocus && document.contains(this._lastFocus)) this._lastFocus.focus();
      }, 260);
    },

    _onSupport() {
      this.markPaid();
      this.hide();
      this._showThanks('感谢你的支持。愿每一条被掩埋的证据，都能等到被看见。');
    },

    _showThanks(message) {
      document.querySelectorAll('.paywall-toast').forEach(node => node.remove());
      const toast = document.createElement('div');
      toast.className = 'paywall-toast';
      toast.setAttribute('role', 'status');
      toast.textContent = message || '感谢你的支持。';
      document.body.appendChild(toast);
      requestAnimationFrame(() => toast.classList.add('show'));
      window.setTimeout(() => {
        toast.classList.remove('show');
        window.setTimeout(() => toast.remove(), 300);
      }, 3200);
    },

    _createOverlay() {
      const overlay = document.createElement('div');
      overlay.className = 'paywall-overlay';
      overlay.id = 'paywall-overlay';
      overlay.hidden = true;
      overlay.innerHTML = `
        <div class="paywall-card" role="dialog" aria-modal="true" aria-labelledby="paywall-title" aria-describedby="paywall-message">
          <button class="paywall-close" type="button" aria-label="关闭支持窗口">&times;</button>
          <div class="paywall-card-inner">
            <header class="paywall-header">
              <div class="paywall-title-row">
                <span class="paywall-heart" aria-hidden="true">◇</span>
                <h2 class="paywall-title" id="paywall-title">支持《静默之心》</h2>
                <span class="paywall-heart" aria-hidden="true">◇</span>
              </div>
              <p class="paywall-subtitle">1元自愿支持 · 不影响继续游玩</p>
            </header>
            <div class="paywall-body">
              <div class="paywall-qr-wrapper">
                <img src="paycode.png" alt="作者收款码" class="paywall-qr-img">
                <div class="paywall-qr-fallback" hidden>收款码加载失败<br>请刷新后重试</div>
                <div class="paywall-qr-glow" aria-hidden="true"></div>
              </div>
              <div class="paywall-qr-tip">请使用支付宝扫描收款码，自愿支持 1 元</div>
              <div class="paywall-message" id="paywall-message">
                <p class="paywall-msg-warm">你好，我是这部网页解谜的独立创作者。</p>
                <p class="paywall-msg-body">从伪装官网、调查记录到证据交叉核对，很多细节都经历了反复修改。<br>作品可以免费完整游玩；觉得这次调查值得，也可以用 <strong>1元</strong> 支持后续创作。</p>
                <p class="paywall-msg-cute">一元不会解锁额外答案，也不会改变结局，只是给下一份封存档案留一盏灯。</p>
                <p class="paywall-msg-warm2">无论是否支持，都感谢你认真走到了这里。</p>
              </div>
            </div>
            <footer class="paywall-footer">
              <div class="paywall-hint"><span aria-hidden="true">ⓘ</span><span>“已完成支持”仅在当前浏览器保存本地记录；清除浏览器数据后可能再次显示。</span></div>
              <div class="paywall-btns">
                <button class="paywall-btn paywall-btn-support" type="button">已完成支持</button>
                <button class="paywall-btn paywall-btn-later" type="button">继续调查</button>
              </div>
            </footer>
            <div class="paywall-studio">独立网页解谜创作</div>
          </div>
        </div>`;

      document.body.appendChild(overlay);
      overlay.querySelector('.paywall-close').addEventListener('click', () => this.hide());
      overlay.querySelector('.paywall-btn-later').addEventListener('click', () => this.hide());
      overlay.querySelector('.paywall-btn-support').addEventListener('click', () => this._onSupport());
      overlay.addEventListener('click', event => { if (event.target === overlay) this.hide(); });
      const img = overlay.querySelector('.paywall-qr-img');
      img.addEventListener('error', () => {
        img.hidden = true;
        const fallback = overlay.querySelector('.paywall-qr-fallback');
        if (fallback) fallback.hidden = false;
      }, { once: true });
      return overlay;
    },

    _insertSupportButton() {
      if (document.getElementById('jingmo-support-button')) return;
      const actions = document.querySelector('.header-actions');
      if (!actions) return;
      const button = document.createElement('button');
      button.id = 'jingmo-support-button';
      button.type = 'button';
      button.className = 'jmx-support-button';
      button.addEventListener('click', () => this.show({ manual: true }));
      actions.appendChild(button);
      this._updateSupportButton();
    },

    _updateSupportButton() {
      const button = document.getElementById('jingmo-support-button');
      if (!button) return;
      const paid = this.hasPaid();
      button.textContent = paid ? '感谢支持' : '支持作者 1元';
      button.classList.toggle('is-supported', paid);
      button.setAttribute('aria-label', paid ? '已经记录支持，点击查看感谢提示' : '打开1元自愿支持窗口');
    },

    autoPrompt() {
      if (this.hasPaid()) return;
      if (this._safeGet(window.localStorage, this.PROMPT_KEY)) return;
      this._safeSet(window.localStorage, this.PROMPT_KEY, String(Date.now()));
      window.clearTimeout(this._showTimer);
      this._showTimer = window.setTimeout(() => this.show({ manual: false }), 850);
    },

    _bindCompletionHooks() {
      const originalShowPage = window.showPage;
      if (typeof originalShowPage === 'function' && !originalShowPage.__paywallWrapped) {
        const self = this;
        function wrappedShowPage(page) {
          const result = originalShowPage.apply(this, arguments);
          if (page === 'truth') self.autoPrompt();
          return result;
        }
        wrappedShowPage.__paywallWrapped = true;
        window.showPage = wrappedShowPage;
      }

      document.addEventListener('click', event => {
        const endingButton = event.target.closest && event.target.closest('[data-ending]');
        if (endingButton) this.autoPrompt();
      });
    },

    init() {
      this._insertSupportButton();
      this._bindCompletionHooks();
      document.addEventListener('keydown', event => {
        if (event.key === 'Escape') this.hide();
      });
      if (document.getElementById('page-truth')?.classList.contains('active')) this.autoPrompt();
    }
  };

  window.Paywall = Paywall;
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Paywall.init(), { once: true });
  } else {
    Paywall.init();
  }
})();
