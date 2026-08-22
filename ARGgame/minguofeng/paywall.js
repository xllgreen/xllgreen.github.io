/**
 * 《山河谍影》1 元自愿支持系统
 * 基于《松涛粮站》的纯前端浮层流程改编。
 */
(function () {
  'use strict';

  const Paywall = {
    STORAGE_KEY: '_shanhe_spy_support',
    SESSION_KEY: '_shanhe_spy_session',
    COOKIE_KEY: '_shanhe_pay_flag',
    _previousFocus: null,

    hasPaid() {
      try {
        return Boolean(
          localStorage.getItem(this.STORAGE_KEY) ||
          sessionStorage.getItem(this.SESSION_KEY) ||
          this._getCookie(this.COOKIE_KEY)
        );
      } catch (error) {
        return Boolean(this._getCookie(this.COOKIE_KEY));
      }
    },

    markPaid() {
      const token = this._generateToken();
      try { localStorage.setItem(this.STORAGE_KEY, token); } catch (error) {}
      try { sessionStorage.setItem(this.SESSION_KEY, token); } catch (error) {}
      this._setCookie(this.COOKIE_KEY, token, 365);
    },

    _generateToken() {
      const source = `${Date.now()}_${Math.random().toString(36).slice(2, 10)}_abc_studio`;
      try { return btoa(source); } catch (error) { return source; }
    },

    _setCookie(name, value, days) {
      try {
        const expires = new Date(Date.now() + days * 86400000).toUTCString();
        document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires};path=/;SameSite=Lax`;
      } catch (error) {}
    },

    _getCookie(name) {
      try {
        const prefix = `${name}=`;
        const item = document.cookie.split(';').map(v => v.trim()).find(v => v.indexOf(prefix) === 0);
        return item ? decodeURIComponent(item.slice(prefix.length)) : '';
      } catch (error) {
        return '';
      }
    },

    show(config) {
      if (this.hasPaid()) {
        this._showThanks('此前已记录你的支持，感谢同行。');
        return;
      }

      this._previousFocus = document.activeElement;
      let overlay = document.getElementById('paywall-overlay');
      if (!overlay) {
        this._createOverlay(config);
        overlay = document.getElementById('paywall-overlay');
      } else {
        overlay.hidden = false;
        overlay.style.display = 'flex';
        overlay.classList.remove('paywall-closing');
        requestAnimationFrame(() => overlay.classList.add('paywall-show'));
      }

      document.body.classList.add('paywall-open');
      setTimeout(() => {
        const closeButton = overlay && overlay.querySelector('.paywall-close');
        if (closeButton) closeButton.focus();
      }, 80);
    },

    hide() {
      const overlay = document.getElementById('paywall-overlay');
      if (!overlay || overlay.hidden) return;
      overlay.classList.add('paywall-closing');
      overlay.classList.remove('paywall-show');
      document.body.classList.remove('paywall-open');
      setTimeout(() => {
        overlay.style.display = 'none';
        overlay.hidden = true;
        overlay.classList.remove('paywall-closing');
        if (this._previousFocus && typeof this._previousFocus.focus === 'function') {
          this._previousFocus.focus();
        }
      }, 320);
    },

    _onSupport() {
      this.markPaid();
      this.hide();
      this._showThanks('感谢你的支持！旧报纸会继续翻页，下一份真相也会继续见报。');
    },

    _showThanks(message) {
      const oldToast = document.querySelector('.paywall-toast');
      if (oldToast) oldToast.remove();
      const toast = document.createElement('div');
      toast.className = 'paywall-toast';
      toast.setAttribute('role', 'status');
      toast.textContent = message;
      document.body.appendChild(toast);
      requestAnimationFrame(() => toast.classList.add('show'));
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 350);
      }, 3200);
    },

    _createOverlay(config) {
      const cfg = Object.assign({
        qrCode: 'paycode.png',
        price: '1元',
        title: '支持《山河谍影》',
        studio: 'abc studio'
      }, config || {});

      const overlay = document.createElement('div');
      overlay.className = 'paywall-overlay';
      overlay.id = 'paywall-overlay';
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-modal', 'true');
      overlay.setAttribute('aria-labelledby', 'paywall-title');
      overlay.innerHTML = `
        <div class="paywall-card" role="document">
          <button type="button" class="paywall-close" aria-label="关闭支持窗口" title="关闭">&times;</button>
          <div class="paywall-card-inner">
            <header class="paywall-header">
              <div class="paywall-title-row">
                <span class="paywall-heart" aria-hidden="true">◇</span>
                <h2 class="paywall-title" id="paywall-title">${cfg.title}</h2>
                <span class="paywall-heart" aria-hidden="true">◇</span>
              </div>
              <div class="paywall-subtitle">${cfg.price} 自愿支持 · 不影响继续游玩</div>
            </header>
            <div class="paywall-body">
              <div class="paywall-qr-wrapper">
                <img src="${cfg.qrCode}" alt="${cfg.price}收款码" class="paywall-qr-img">
                <div class="paywall-qr-glow" aria-hidden="true"></div>
              </div>
              <div class="paywall-qr-tip">请使用支付宝扫码支持 ${cfg.price}</div>
              <div class="paywall-message">
                <p class="paywall-msg-warm">你好，我是 ${cfg.studio} 的独立创作者。</p>
                <p class="paywall-msg-body">
                  从泛黄报纸、密电暗号到三种终局，这段民国谍影由许多个夜晚一点点拼成。<br>
                  若这趟调查曾让你驻足片刻，愿意留下 <strong>${cfg.price}</strong> 支持，<br>
                  它会成为下一部网页解谜继续写下去的动力。
                </p>
                <p class="paywall-msg-cute">一元未必能买下一份旧报，却能让下一份真相继续见报。</p>
                <p class="paywall-msg-warm2">支持完全自愿，关闭窗口后可正常重玩，不会锁定任何剧情与结局。</p>
              </div>
            </div>
            <footer class="paywall-footer">
              <div class="paywall-hint"><span aria-hidden="true">※</span><span>点击“已完成支持”只在本机记录，清理浏览器数据后记录会消失。</span></div>
              <div class="paywall-btns">
                <button type="button" class="paywall-btn paywall-btn-support">已完成支持 ◇</button>
                <button type="button" class="paywall-btn paywall-btn-later">下次一定</button>
              </div>
            </footer>
            <div class="paywall-studio">${cfg.studio}</div>
          </div>
        </div>`;

      overlay.addEventListener('click', (event) => {
        if (event.target === overlay) this.hide();
      });
      overlay.querySelector('.paywall-close').addEventListener('click', () => this.hide());
      overlay.querySelector('.paywall-btn-later').addEventListener('click', () => this.hide());
      overlay.querySelector('.paywall-btn-support').addEventListener('click', () => this._onSupport());
      overlay.addEventListener('keydown', (event) => this._handleKeydown(event));

      document.body.appendChild(overlay);
      requestAnimationFrame(() => overlay.classList.add('paywall-show'));
    },

    _handleKeydown(event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        this.hide();
        return;
      }
      if (event.key !== 'Tab') return;
      const overlay = document.getElementById('paywall-overlay');
      if (!overlay) return;
      const focusable = Array.from(overlay.querySelectorAll('button, [href], input, [tabindex]:not([tabindex="-1"])'))
        .filter(el => !el.disabled && el.offsetParent !== null);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  };

  window.Paywall = Paywall;
})();
