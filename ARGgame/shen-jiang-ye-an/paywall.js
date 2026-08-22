'use strict';

/**
 * 《申江夜案》自愿支持系统
 * 结构沿用《松涛粮站》的纯前端 localStorage / sessionStorage / cookie 方案，
 * 只调整存储键、文案、视觉语气与当前作品的联动事件。
 */
const Paywall = {
  STORAGE_KEY: '_shenjiang_night_case_support',
  SESSION_KEY: '_shenjiang_night_case_session',
  COOKIE_KEY: '_shenjiang_support_flag',

  _safeGet(storage, key) {
    try { return storage && storage.getItem(key); } catch (_) { return ''; }
  },
  _safeSet(storage, key, value) {
    try { storage && storage.setItem(key, value); } catch (_) {}
  },
  hasPaid() {
    const ls = this._safeGet(window.localStorage, this.STORAGE_KEY);
    const ss = this._safeGet(window.sessionStorage, this.SESSION_KEY);
    const cookie = this._getCookie(this.COOKIE_KEY);
    return !!(ls || ss || cookie);
  },
  markPaid() {
    const token = this._generateToken();
    this._safeSet(window.localStorage, this.STORAGE_KEY, token);
    this._safeSet(window.sessionStorage, this.SESSION_KEY, token);
    this._setCookie(this.COOKIE_KEY, token, 365);
    window.dispatchEvent(new CustomEvent('shenjiang-support-updated'));
  },
  _generateToken() {
    const ts = Date.now();
    const rand = Math.random().toString(36).slice(2, 10);
    try { return btoa(`${ts}_${rand}_abc_studio_shenjiang`); }
    catch (_) { return `${ts}_${rand}_abc_studio_shenjiang`; }
  },
  _setCookie(name, value, days) {
    try {
      const d = new Date();
      d.setTime(d.getTime() + days * 86400000);
      document.cookie = `${name}=${encodeURIComponent(value)};expires=${d.toUTCString()};path=/;SameSite=Lax`;
    } catch (_) {}
  },
  _getCookie(name) {
    try {
      const prefix = name + '=';
      for (const part of document.cookie.split(';')) {
        const c = part.trim();
        if (c.startsWith(prefix)) return decodeURIComponent(c.slice(prefix.length));
      }
    } catch (_) {}
    return '';
  },

  show(config) {
    if (this.hasPaid()) return false;
    const overlay = document.getElementById('paywall-overlay');
    if (!overlay) this._createOverlay(config);
    else {
      overlay.style.display = 'flex';
      overlay.classList.remove('paywall-closing');
      overlay.classList.remove('paywall-show');
      requestAnimationFrame(() => requestAnimationFrame(() => overlay.classList.add('paywall-show')));
      const close = overlay.querySelector('.paywall-close');
      close && close.focus({preventScroll:true});
    }
    return true;
  },
  hide() {
    const overlay = document.getElementById('paywall-overlay');
    if (!overlay || overlay.style.display === 'none') return;
    overlay.classList.add('paywall-closing');
    overlay.classList.remove('paywall-show');
    setTimeout(() => {
      overlay.style.display = 'none';
      overlay.classList.remove('paywall-closing');
    }, 320);
  },
  isOpen() {
    const overlay = document.getElementById('paywall-overlay');
    return !!overlay && overlay.style.display !== 'none' && overlay.classList.contains('paywall-show');
  },
  _onSupport() {
    this.markPaid();
    this.hide();
    this._showThanks();
  },
  _showThanks() {
    const old = document.querySelector('.paywall-toast');
    old && old.remove();
    const toast = document.createElement('div');
    toast.className = 'paywall-toast';
    toast.textContent = '感谢你的支持。夜班灯还亮着，下一份终校也会继续。';
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 30);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 360);
    }, 3000);
  },
  _animateIn() {
    const overlay = document.getElementById('paywall-overlay');
    if (!overlay) return;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      overlay.classList.add('paywall-show');
      overlay.querySelector('.paywall-close')?.focus({preventScroll:true});
    }));
  },
  _createOverlay(config) {
    const cfg = Object.assign({
      qrCode: 'paycode.png',
      price: '1元',
      title: '支持《申江夜案》',
      studio: 'abc工作室'
    }, config || {});
    const html = `
      <div class="paywall-overlay" id="paywall-overlay" role="dialog" aria-modal="true" aria-labelledby="paywall-title">
        <div class="paywall-card">
          <button class="paywall-close" type="button" data-paywall-close aria-label="关闭支持窗口">×</button>
          <div class="paywall-card-inner">
            <div class="paywall-header">
              <div class="paywall-masthead">申 江 晚 报 · 夜 班 附 笺</div>
              <div class="paywall-title-row"><span class="paywall-star">✦</span><span id="paywall-title" class="paywall-title">${cfg.title}</span><span class="paywall-star">✦</span></div>
              <div class="paywall-subtitle">${cfg.price} 自愿支持 · 不影响任何剧情、提示或结局</div>
            </div>
            <div class="paywall-body">
              <div class="paywall-qr-wrapper">
                <img src="${cfg.qrCode}" alt="1元自愿支持收款码" class="paywall-qr-img" />
                <div class="paywall-qr-stamp">自愿</div>
              </div>
              <div class="paywall-qr-tip">使用收款码对应应用扫码支持 ${cfg.price}</div>
              <div class="paywall-message">
                <p class="paywall-msg-warm">你好，我是 ${cfg.studio} 的独立开发者。</p>
                <p class="paywall-msg-body">《申江夜案》的时间线、纸面证据、人物补录和年代细节，都经过了反复修改。<br>如果这场雨夜调查让你愿意多停留一会儿，可以自愿支持 <strong>${cfg.price}</strong>；不支持也不会影响完整游玩。</p>
                <p class="paywall-msg-cute">一块钱买不到一份真正的夜班报，但能让下一桩网页谜案继续付印。</p>
                <p class="paywall-msg-warm2">谢谢你愿意玩到这里，也谢谢每一条认真留下的反馈。</p>
              </div>
            </div>
            <div class="paywall-footer">
              <div class="paywall-hint"><span class="paywall-hint-icon">※</span><span>自动邀请只出现一次；关闭后仍可从“当前页提示”旁的“支持作者 1元”再次打开。清除浏览器数据会同时清除本地支持记录。</span></div>
              <div class="paywall-btns">
                <button class="paywall-btn paywall-btn-support" type="button" data-paywall-supported>已完成支持</button>
                <button class="paywall-btn paywall-btn-later" type="button" data-paywall-close>下次再说</button>
              </div>
            </div>
            <div class="paywall-studio">${cfg.studio} · 《申江夜案》</div>
          </div>
        </div>
      </div>`;
    document.body.insertAdjacentHTML('beforeend', html);
    const overlay = document.getElementById('paywall-overlay');
    overlay.querySelectorAll('[data-paywall-close]').forEach(btn => btn.addEventListener('click', () => this.hide()));
    overlay.querySelector('[data-paywall-supported]')?.addEventListener('click', () => this._onSupport());
    overlay.addEventListener('click', (event) => { if (event.target === overlay) this.hide(); });
    this._animateIn();
  }
};

window.Paywall = Paywall;
