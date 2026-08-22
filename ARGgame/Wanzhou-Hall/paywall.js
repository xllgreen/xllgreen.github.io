/**
 * 《晚舟堂》1 元自愿支持系统
 * 流程参考《松涛粮站》：localStorage / sessionStorage / Cookie 三重记录，
 * 支持弹层、已完成支持、稍后继续，以及首次进入游戏自动弹出一次。
 */
(function () {
  'use strict';

  const DEFAULT_CONFIG = Object.freeze({
    qrCode: 'paycode.png',
    price: '1元',
    title: '支持《晚舟堂》',
    studio: 'abc studio'
  });

  const Paywall = {
    STORAGE_KEY: '_wanzhoutang_support',
    SESSION_KEY: '_wanzhoutang_support_session',
    COOKIE_KEY: '_wanzhoutang_support_flag',
    AUTO_SHOWN_KEY: '_wanzhoutang_support_auto_shown_v1',
    _config: { ...DEFAULT_CONFIG },
    _autoTimer: 0,
    _autoPending: false,

    hasPaid() {
      try {
        const ls = localStorage.getItem(this.STORAGE_KEY);
        const ss = sessionStorage.getItem(this.SESSION_KEY);
        const cookie = this._getCookie(this.COOKIE_KEY);
        return Boolean(ls || ss || cookie);
      } catch (error) {
        console.warn('支持记录读取失败', error);
        return false;
      }
    },

    markPaid() {
      const token = this._generateToken();
      try { localStorage.setItem(this.STORAGE_KEY, token); } catch (error) { console.warn(error); }
      try { sessionStorage.setItem(this.SESSION_KEY, token); } catch (error) { console.warn(error); }
      this._setCookie(this.COOKIE_KEY, token, 365);
      this._markAutoShown();
      this._syncSupportButton(true);
    },

    show(config) {
      this._config = Object.assign({}, DEFAULT_CONFIG, config || {});
      this._markAutoShown();
      this._autoPending = false;
      window.clearTimeout(this._autoTimer);
      if (this.hasPaid()) {
        this._showThanks('已经记录过你的支持，感谢你为晚舟堂添了一盏灯。');
        this._syncSupportButton(true);
        return false;
      }

      let overlay = document.getElementById('paywall-overlay');
      if (!overlay) {
        this._createOverlay(this._config);
        overlay = document.getElementById('paywall-overlay');
      } else {
        this._refreshOverlay(this._config);
        overlay.hidden = false;
        overlay.style.display = 'flex';
      }

      document.documentElement.classList.add('paywall-open');
      requestAnimationFrame(() => requestAnimationFrame(() => overlay?.classList.add('paywall-show')));
      overlay?.querySelector('.paywall-close')?.focus({ preventScroll: true });
      return true;
    },

    autoShowOnce(config, delay = 900) {
      if (this._wasAutoShown() || this._autoPending) return false;
      if (this.hasPaid()) {
        this._markAutoShown();
        this._syncSupportButton(true);
        return false;
      }
      this._autoPending = true;
      const attempt = () => {
        if (this._wasAutoShown()) {
          this._autoPending = false;
          return;
        }
        const gameShell = document.getElementById('gameShell');
        const anotherDialogOpen = Boolean(document.querySelector('dialog[open]'));
        if ((gameShell && gameShell.hidden) || anotherDialogOpen) {
          this._autoTimer = window.setTimeout(attempt, 700);
          return;
        }
        this.show(config);
      };
      window.clearTimeout(this._autoTimer);
      this._autoTimer = window.setTimeout(attempt, Math.max(0, Number(delay) || 0));
      return true;
    },

    hide() {
      const overlay = document.getElementById('paywall-overlay');
      if (!overlay || overlay.hidden) return;
      overlay.classList.add('paywall-closing');
      overlay.classList.remove('paywall-show');
      window.setTimeout(() => {
        overlay.hidden = true;
        overlay.style.display = 'none';
        overlay.classList.remove('paywall-closing');
        document.documentElement.classList.remove('paywall-open');
      }, 360);
    },

    _onSupport() {
      this.markPaid();
      this.hide();
      this._showThanks('感谢你的支持！愿晚舟堂的灯火与故事继续留在人间。');
    },

    _createOverlay(config) {
      const html = `
        <div class="paywall-overlay" id="paywall-overlay" role="dialog" aria-modal="true" aria-labelledby="paywall-title" aria-describedby="paywall-description" hidden>
          <div class="paywall-card" role="document">
            <button class="paywall-close" type="button" aria-label="关闭支持窗口" title="关闭">&times;</button>
            <div class="paywall-card-inner">
              <header class="paywall-header">
                <div class="paywall-title-row">
                  <span class="paywall-heart" aria-hidden="true">桂</span>
                  <span class="paywall-title" id="paywall-title"></span>
                  <span class="paywall-heart" aria-hidden="true">舟</span>
                </div>
                <div class="paywall-subtitle">1 元自愿支持 · 不影响剧情、提示或结局</div>
              </header>

              <div class="paywall-body">
                <div class="paywall-qr-wrapper">
                  <img alt="一元支持收款码" class="paywall-qr-img">
                  <div class="paywall-qr-glow" aria-hidden="true"></div>
                </div>
                <div class="paywall-qr-tip">请使用 <strong>支付宝</strong> 扫码，自愿支持 <span data-pay-price></span></div>
                <div class="paywall-message" id="paywall-description">
                  <p class="paywall-msg-warm">你好，我是这部网页解谜的独立创作者。</p>
                  <p class="paywall-msg-body">
                    《晚舟堂》里的账本、钟讯、家书与旧药铺，都是一点点整理出来的。<br>
                    作品的全部五章、三级提示与三个结局均可免费游玩。<br>
                    若这段青溪旧事曾让你停留片刻，愿意支持 <strong>1 元</strong>，会成为我继续创作的动力。
                  </p>
                  <p class="paywall-msg-cute">1 元买不到一包药材，却能替晚舟堂多添一盏灯。</p>
                  <p class="paywall-msg-warm2">不支持也没有关系，关闭窗口即可继续完整调查。</p>
                </div>
              </div>

              <footer class="paywall-footer">
                <div class="paywall-hint">
                  <span class="paywall-hint-icon" aria-hidden="true">💡</span>
                  <span>支持记录保存在本机浏览器中；清除浏览器数据后可能会再次显示。</span>
                </div>
                <div class="paywall-btns">
                  <button class="paywall-btn paywall-btn-support" type="button">已完成支持 ♡</button>
                  <button class="paywall-btn paywall-btn-later" type="button">暂不支持，继续调查</button>
                </div>
              </footer>
              <div class="paywall-studio"></div>
            </div>
          </div>
        </div>`;

      document.body.insertAdjacentHTML('beforeend', html);
      const overlay = document.getElementById('paywall-overlay');
      overlay.hidden = false;
      overlay.style.display = 'flex';
      overlay.querySelector('.paywall-close').addEventListener('click', () => this.hide());
      overlay.querySelector('.paywall-btn-later').addEventListener('click', () => this.hide());
      overlay.querySelector('.paywall-btn-support').addEventListener('click', () => this._onSupport());
      overlay.addEventListener('click', (event) => {
        if (event.target === overlay) this.hide();
      });
      this._refreshOverlay(config);
    },

    _refreshOverlay(config) {
      const overlay = document.getElementById('paywall-overlay');
      if (!overlay) return;
      const image = overlay.querySelector('.paywall-qr-img');
      if (image) image.src = config.qrCode;
      const title = overlay.querySelector('.paywall-title');
      if (title) title.textContent = config.title;
      overlay.querySelectorAll('[data-pay-price]').forEach(node => { node.textContent = config.price; });
      const studio = overlay.querySelector('.paywall-studio');
      if (studio) studio.textContent = config.studio;
    },

    _showThanks(message) {
      document.querySelectorAll('.paywall-toast').forEach(node => node.remove());
      const toast = document.createElement('div');
      toast.className = 'paywall-toast';
      toast.setAttribute('role', 'status');
      toast.textContent = message;
      document.body.appendChild(toast);
      window.setTimeout(() => toast.classList.add('show'), 30);
      window.setTimeout(() => {
        toast.classList.remove('show');
        window.setTimeout(() => toast.remove(), 400);
      }, 3000);
    },

    _syncSupportButton(paid) {
      const button = document.getElementById('supportBtn');
      if (!button) return;
      button.classList.toggle('supported', Boolean(paid));
      button.setAttribute('aria-label', paid ? '已经支持作者，点击查看感谢' : '支持作者 1 元');
      const text = button.querySelector('.action-text');
      if (text) text.textContent = paid ? '已支持' : '支持作者 1元';
      const icon = button.querySelector('[aria-hidden="true"]');
      if (icon) icon.textContent = paid ? '谢' : '赏';
    },

    _wasAutoShown() {
      try { return localStorage.getItem(this.AUTO_SHOWN_KEY) === '1'; }
      catch (error) { return false; }
    },

    _markAutoShown() {
      try { localStorage.setItem(this.AUTO_SHOWN_KEY, '1'); } catch (error) { console.warn(error); }
    },

    _generateToken() {
      const raw = `${Date.now()}_${Math.random().toString(36).slice(2, 10)}_abc_studio`;
      try { return btoa(unescape(encodeURIComponent(raw))); }
      catch (error) { return raw; }
    },

    _setCookie(name, value, days) {
      try {
        const date = new Date(Date.now() + days * 86400000);
        document.cookie = `${name}=${encodeURIComponent(value)};expires=${date.toUTCString()};path=/;SameSite=Lax`;
      } catch (error) { console.warn(error); }
    },

    _getCookie(name) {
      try {
        const prefix = `${name}=`;
        return document.cookie.split(';').map(item => item.trim()).find(item => item.startsWith(prefix))?.slice(prefix.length) || '';
      } catch (error) {
        return '';
      }
    }
  };

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && document.getElementById('paywall-overlay')?.classList.contains('paywall-show')) {
      Paywall.hide();
    }
  });

  document.addEventListener('DOMContentLoaded', () => Paywall._syncSupportButton(Paywall.hasPaid()), { once: true });
  window.Paywall = Paywall;
}());
