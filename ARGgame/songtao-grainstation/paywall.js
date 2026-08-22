/**
 * 通用付费打赏系统 v1.0
 * 纯前端 localStorage 方案 - 自愿打赏模式
 * 松涛粮站版本：沿用潮汐福利院付款流程，仅调整文案与存储标记
 */

const Paywall = {
  STORAGE_KEY: '_songtao_grainstation_support',
  SESSION_KEY: '_songtao_grainstation_session',
  COOKIE_KEY: '_songtao_pay_flag',

  /** 检查是否已打赏 */
  hasPaid() {
    // 三重存储交叉验证
    const ls = localStorage.getItem(this.STORAGE_KEY);
    const ss = sessionStorage.getItem(this.SESSION_KEY);
    const cookie = this._getCookie(this.COOKIE_KEY);
    // 至少有一处记录就视为已打赏（宽松策略，避免误判）
    return !!(ls || ss || cookie);
  },

  /** 标记已打赏（三重写入） */
  markPaid() {
    const token = this._generateToken();
    localStorage.setItem(this.STORAGE_KEY, token);
    sessionStorage.setItem(this.SESSION_KEY, token);
    this._setCookie(this.COOKIE_KEY, token, 365);
  },

  /** 生成签名令牌 */
  _generateToken() {
    const ts = Date.now();
    const rand = Math.random().toString(36).substring(2, 10);
    const sig = btoa(`${ts}_${rand}_abc_studio`);
    return sig;
  },

  /** Cookie 操作 */
  _setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${d.toUTCString()};path=/`;
  },

  _getCookie(name) {
    const cname = name + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i].trim();
      if (c.indexOf(cname) === 0) return c.substring(cname.length, c.length);
    }
    return '';
  },

  /** 显示打赏浮层 */
  show(config) {
    if (this.hasPaid()) return;

    const overlay = document.getElementById('paywall-overlay');
    if (!overlay) {
      this._createOverlay(config);
    } else {
      overlay.style.display = 'flex';
      overlay.classList.remove('paywall-show');
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          overlay.classList.add('paywall-show');
        });
      });
    }
  },

  /** 隐藏打赏浮层 */
  hide() {
    const overlay = document.getElementById('paywall-overlay');
    if (overlay) {
      overlay.classList.add('paywall-closing');
      overlay.classList.remove('paywall-show');
      setTimeout(() => {
        overlay.style.display = 'none';
        overlay.classList.remove('paywall-closing');
      }, 400);
    }
  },

  /** 已支持按钮点击 */
  _onSupport() {
    this.markPaid();
    this.hide();
    this._showThanks();
  },

  _showThanks() {
    const toast = document.createElement('div');
    toast.className = 'paywall-toast';
    toast.innerHTML = '感谢你的支持！硬盘继续转，真相继续亮着。';
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 50);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 3000);
  },

  _animateIn() {
    const overlay = document.getElementById('paywall-overlay');
    if (overlay) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          overlay.classList.add('paywall-show');
        });
      });
    }
  },

  /** 创建浮层DOM */
  _createOverlay(config) {
    const defaultConfig = {
      qrCode: 'paycode.png',
      price: '1元',
      title: '支持《松涛粮站》',
      studio: 'abc studio'
    };
    const cfg = Object.assign(defaultConfig, config || {});
    const html = `
      <div class="paywall-overlay" id="paywall-overlay">
        <div class="paywall-card">
          <button class="paywall-close" onclick="Paywall.hide()" title="关闭">&times;</button>
          <div class="paywall-card-inner">
            <div class="paywall-header">
              <div class="paywall-title-row">
                <span class="paywall-heart">♡</span>
                <span class="paywall-title">${cfg.title}</span>
                <span class="paywall-heart">♡</span>
              </div>
              <div class="paywall-subtitle">${cfg.price} 自愿打赏 · 感谢支持</div>
            </div>
            <div class="paywall-body">
              <div class="paywall-qr-wrapper">
                <img src="${cfg.qrCode}" alt="收款码" class="paywall-qr-img" />
                <div class="paywall-qr-glow"></div>
              </div>
              <div class="paywall-qr-tip">请用 <strong style="color:#1677ff;">某宝</strong> 扫码打赏 ${cfg.price}</div>
              <div class="paywall-message">
                <p class="paywall-msg-warm">你好，我是 abc studio 的独立开发者。</p>
                <p class="paywall-msg-body">
                  制作这部硬盘修复解谜花了很多个夜晚，每一张票据、每一段档案都反复打磨过。<br>
                  如果你在游玩过程中感受到了一丝触动，愿意支持 <strong>1元</strong> 打赏，<br>
                  那将是我继续创作的最大动力。
                </p>
                <p class="paywall-msg-cute">
                  1块钱买不到一杯奶茶，但能给这块 1997 年的老硬盘续上一口电。
                </p>
                <p class="paywall-msg-warm2">
                  后续还会有更多“青槐市封存档案”系列作品，感谢每一位愿意支持的你。
                </p>
              </div>
            </div>
            <div class="paywall-footer">
              <div class="paywall-hint">
                <span class="paywall-hint-icon">💡</span>
                <span>小提示：请勿清除浏览器数据，否则下次打开会再次看到这里哦~</span>
              </div>
              <div class="paywall-btns">
                <button class="paywall-btn paywall-btn-support" onclick="Paywall._onSupport()">
                  已完成支持 ♡
                </button>
                <button class="paywall-btn paywall-btn-later" onclick="Paywall.hide()">
                  下次一定
                </button>
              </div>
            </div>
            <div class="paywall-studio">abc studio</div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', html);
    this._animateIn();
  }
};

window.Paywall = Paywall;

/**
 * 玩家反馈修复补丁 v1.1
 * 1. 增加王晓燕高考日期的前置证据，消除 0707 无法推导的问题。
 * 2. 修复初始线索总数显示 0/22 与实际 23 条不一致。
 * 3. 保持原存档、主线和自愿打赏逻辑不变。
 *
 * 该补丁放在 paywall.js 内，是为了让现有 songtao-grainstation.html 无需增加新的脚本标签。
 * paywall.js 在 core.js 之前加载，补丁会在 window.load 后等待 Game 初始化再挂载。
 */
const SongtaoFeedbackFix = {
  _applied: false,
  _timer: 0,

  init() {
    if (this._applied) return;
    if (!window.Game || !document.querySelector('[data-partition-page="E"]')) {
      this._timer += 1;
      if (this._timer < 80) setTimeout(() => this.init(), 50);
      return;
    }

    this._applied = true;
    this.fixInitialClueCounter();
    this.insertXiaoyanEvidence();
    this.rewriteFPasswordGuide();
    this.patchFPasswordLogic();
    this.patchFPasswordHints();
  },

  fixInitialClueCounter() {
    const counter = document.getElementById('clue-counter');
    if (counter && counter.textContent.trim() === '0/22') counter.textContent = '0/23';
  },

  insertXiaoyanEvidence() {
    if (document.getElementById('xiaoyan-exam-evidence')) return;
    const ePage = document.querySelector('[data-partition-page="E"] .doc-stack');
    if (!ePage) return;

    const card = document.createElement('section');
    card.id = 'xiaoyan-exam-evidence';
    card.className = 'paper xiaoyan-evidence-paper';
    card.innerHTML = `
      <div class="stamp">口令依据</div>
      <h2>松涛县第一中学 · 1997 年高考送考安排</h2>
      <p>恢复来源：王晓燕人事关系附件 / 高三（2）班家校联系记录。</p>
      <table class="archive-table exam-schedule-table">
        <tr><th>日期</th><th>安排</th><th>家长记录</th></tr>
        <tr class="bad-row"><td><b>7 月 7 日</b></td><td>高考第一天 / 上午语文</td><td>王晓燕家长未到，班主任代签</td></tr>
        <tr><td>7 月 8 日</td><td>第二天考试</td><td>母亲陪同</td></tr>
        <tr><td>7 月 9 日</td><td>考试结束</td><td>—</td></tr>
      </table>
      <p class="password-rule-note"><b>分区口令规则：</b>提示中的“那天”取日期的月、日，按 MMDD 四位输入；不是晓燕的学号或准考证号。</p>
      <p class="derivation-line">高考第一天：1997 年 <b>07 月 07 日</b> → 月日口令 <b>0707</b></p>
      <button class="inline-link" type="button" data-record-xiaoyan>记录为口令线索</button>
    `;

    const grainTicket = ePage.querySelector('.grain-ticket');
    if (grainTicket) ePage.insertBefore(card, grainTicket);
    else ePage.appendChild(card);

    card.querySelector('[data-record-xiaoyan]')?.addEventListener('click', () => {
      this.recordXiaoyanClue(false);
    });
  },

  rewriteFPasswordGuide() {
    const lock = document.getElementById('f-lock');
    if (!lock) return;
    const prompt = lock.querySelector('p');
    if (prompt) {
      prompt.innerHTML = '密码提示：“他最对不起女儿的那天”。请返回 <b>E 盘《1997 年高考送考安排》</b>，找到王厚德缺席的高考第一天，再按 <b>MMDD</b> 输入月日；不是晓燕的学号或准考证号。';
    }

    if (!lock.querySelector('[data-show-xiaoyan-evidence]')) {
      const form = lock.querySelector('.inline-form');
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'retro-btn evidence-jump-btn';
      button.dataset.showXiaoyanEvidence = '1';
      button.textContent = '返回 E 盘查看日期依据';
      button.addEventListener('click', () => this.showXiaoyanEvidence());
      if (form) form.appendChild(button);
      else lock.appendChild(button);
    }
  },

  showXiaoyanEvidence() {
    if (!window.Game) return;
    Game.goPartition('E');
    setTimeout(() => {
      const card = document.getElementById('xiaoyan-exam-evidence');
      card?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      card?.classList.remove('evidence-pulse');
      requestAnimationFrame(() => card?.classList.add('evidence-pulse'));
    }, 60);
  },

  recordXiaoyanClue(silent) {
    if (!window.Game) return;
    Game.addClue(
      'f_password',
      '王晓燕高考送考安排',
      'E 盘家校记录明确写明：王厚德缺席的是 1997 年 7 月 7 日高考第一天；分区口令取月日 MMDD，即 0707。',
      'E',
      !!silent
    );
  },

  patchFPasswordLogic() {
    if (Game.__xiaoyanPasswordPatched) return;
    Game.__xiaoyanPasswordPatched = true;

    Game.checkFPassword = function () {
      const input = document.getElementById('f-password');
      const value = ((input && input.value) || '').trim().replace(/\D/g, '');
      if (value === '0707' || value === '19970707') {
        this.state.fUnlocked = true;
        this.state.puzzles.fpass = true;
        SongtaoFeedbackFix.recordXiaoyanClue(true);
        this.save();
        this.renderPuzzles();
        this.toast('F: 分区解密完成。口令来自 E 盘高考送考安排。', 'success');
        this.play('playUnlock');
      } else {
        this.toast('密码错误。先返回 E 盘查看《1997 年高考送考安排》，取高考第一天的月日 MMDD。', 'error');
        this.play('playError');
      }
    };
  },

  patchFPasswordHints() {
    if (Game.__xiaoyanHintPatched) return;
    Game.__xiaoyanHintPatched = true;
    const original = Game.showHint.bind(Game);
    const fHints = [
      '不要在 F 盘已经锁住的日记里找答案。先返回 E 盘，打开《1997 年高考送考安排》。',
      '安排表标出王晓燕高考第一天是 1997 年 7 月 7 日，王厚德当天缺席。口令只取月和日。',
      '按 MMDD 输入：07 月 07 日 → 0707。'
    ];

    Game.showHint = function (id) {
      if (id !== 'fpass') return original(id);
      const used = this.state.hintsUsed.fpass || 0;
      const index = Math.min(used, fHints.length - 1);
      this.state.hintsUsed.fpass = Math.min(used + 1, fHints.length);
      this.save();
      this.showDialog('提示 ' + (index + 1) + '/' + fHints.length, `<p>${fHints[index]}</p>`);
    };
  }
};

window.SongtaoFeedbackFix = SongtaoFeedbackFix;
if (document.readyState === 'complete') {
  SongtaoFeedbackFix.init();
} else {
  window.addEventListener('load', () => SongtaoFeedbackFix.init(), { once: true });
}
