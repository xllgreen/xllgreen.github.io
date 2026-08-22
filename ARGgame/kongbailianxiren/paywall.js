/**
 * 《空白联系人》1 元自愿支持系统
 * 沿用《松涛粮站》的纯前端浮层交互，按本作的手机界面与叙事氛围调整。
 */
(function () {
  'use strict';

  const Paywall = {
    STORAGE_KEY: '_blank_contact_support',
    SESSION_KEY: '_blank_contact_support_session',
    COOKIE_KEY: '_blank_contact_support_flag',
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
        this._showThanks('此前已记录你的支持。谢谢你听完这通未接来电。');
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
      if (!this._documentKeydown) {
        this._documentKeydown = (event) => {
          if (event.key === 'Escape') {
            event.preventDefault();
            this.hide();
          }
        };
      }
      document.addEventListener('keydown', this._documentKeydown);
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
      if (this._documentKeydown) document.removeEventListener('keydown', this._documentKeydown);
      setTimeout(() => {
        overlay.style.display = 'none';
        overlay.hidden = true;
        overlay.classList.remove('paywall-closing');
        if (this._previousFocus && typeof this._previousFocus.focus === 'function') {
          this._previousFocus.focus();
        }
      }, 280);
    },

    _onSupport() {
      this.markPaid();
      this.hide();
      this._showThanks('感谢支持。愿下一通重要的电话，都能被及时接起。');
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
        setTimeout(() => toast.remove(), 320);
      }, 3200);
    },

    _createOverlay(config) {
      const cfg = Object.assign({
        qrCode: 'paycode.png',
        price: '1元',
        title: '支持《空白联系人》',
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
              <div class="paywall-signal" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
              <h2 class="paywall-title" id="paywall-title">${cfg.title}</h2>
              <div class="paywall-subtitle">${cfg.price} 自愿支持 · 不影响剧情、结局与重玩</div>
            </header>
            <div class="paywall-body">
              <div class="paywall-qr-wrapper">
                <img src="${cfg.qrCode}" alt="${cfg.price}收款码" class="paywall-qr-img">
                <span class="paywall-scan-line" aria-hidden="true"></span>
              </div>
              <div class="paywall-qr-tip">请使用支付宝扫码支持 ${cfg.price}</div>
              <div class="paywall-message">
                <p class="paywall-msg-warm">你好，我是 ${cfg.studio} 的独立创作者。</p>
                <p class="paywall-msg-body">
                  从旧手机、碎片日记到最后一通未接来电，<br>
                  《空白联系人》由许多个夜晚一点点拼成。<br>
                  若这段故事曾让你停留片刻，愿意留下 <strong>${cfg.price}</strong> 支持，<br>
                  它会成为下一部网页解谜继续上线的动力。
                </p>
                <p class="paywall-msg-cute">一元很小，却足够让下一盏屏幕继续亮着。</p>
                <p class="paywall-msg-warm2">支持完全自愿，关闭后可继续重玩，不会锁定任何内容。</p>
              </div>
            </div>
            <footer class="paywall-footer">
              <div class="paywall-hint"><span aria-hidden="true">●</span><span>“已完成支持”只在当前浏览器记录；清理浏览器数据后记录会消失。</span></div>
              <div class="paywall-btns">
                <button type="button" class="paywall-btn paywall-btn-support">已完成支持</button>
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
