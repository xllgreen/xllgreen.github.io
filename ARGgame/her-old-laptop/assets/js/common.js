// ===== ARG 公共脚本：进度、密码校验、跳转、日志、错误重试 =====
// 所有需要密码校验的页面都引用此脚本
// 密码优先从 assets/config/game-config.json 读取，加载失败则使用默认值

const Game = {
  // 总线索数（用于进度显示）
  TOTAL_CLUES: 17,

  // 已解锁线索的 key（写入 localStorage 后视为永久解锁）
  KEYS: {
    BOOT: 'lw_boot',                 // 开机
    NOTES_HINT: 'lw_notes_hint',     // 备忘录第4条提示
    WECHAT_LOGIN: 'lw_wechat_login',// 微信登录
    CHEN_CHAT: 'lw_chen_chat',      // 看过陈教授聊天
    ZHOU_CHAT: 'lw_zhou_chat',      // 看过周明学长聊天
    MOM_CHAT: 'lw_mom_chat',        // 看过妈妈聊天
    MAIL_LOGIN: 'lw_mail_login',    // 邮箱登录
    KEY_MAIL: 'lw_key_mail',        // 看过举报邮件
    BROWSER: 'lw_browser',          // 看过浏览器历史
    THESIS: 'lw_thesis',            // 看过论文文献
    FILES_UNLOCK: 'lw_files_unlock',// 解锁隐藏文件夹
    FINAL: 'lw_final',              // 最终触发
    ENDING: 'lw_ending',            // 达成结局
    EASTEREGG: 'lw_easteregg',      // 发现彩蛋
    FORUM_SEARCHED: 'lw_forum_searched', // 搜索过论坛
    BROWSER_SEARCHED: 'lw_browser_searched', // 搜索过浏览器
    SU_CHAT: 'lw_su_chat' // 看过苏晴聊天
  },

  // 所有线索的顺序（用于进度计算）
  ORDER: [
    'lw_boot','lw_notes_hint','lw_wechat_login','lw_chen_chat',
    'lw_zhou_chat','lw_mom_chat','lw_mail_login','lw_key_mail',
    'lw_browser','lw_thesis','lw_files_unlock','lw_final',
    'lw_ending','lw_easteregg','lw_forum_searched','lw_browser_searched','lw_su_chat'
  ],

  // 密码表（默认值，会被 JSON 配置覆盖）
  PWD: {
    boot: '0307',           // 锁屏开机密码 → config.passwords.lockscreen
    wechat: 'LW2024',       // 微信登录密码 → config.passwords.wechat
    mail: '0614',           // 邮箱密码 → config.passwords.mail
    files: 'ZHO114truth',   // 隐藏文件夹密码 → config.passwords.encrypted_folder
    final: 'SENDTHELIGHT'   // 最终触发码 → config.passwords.final_trigger
  },

  // 密码配置映射：Game.PWD key → config.passwords key
  PWD_CONFIG_MAP: {
    boot: 'lockscreen',
    wechat: 'wechat',
    mail: 'mail',
    files: 'encrypted_folder',
    final: 'final_trigger'
  },

  // 从 JSON 加载的完整配置（在 loadConfig 后可用）
  _config: null,
  _configLoaded: false,

  // 各谜题错误次数（按 pwdKey 累计）
  // 用于：超过阈值后给玩家更明确的提示
  failCount: {},

  // ====== 日志系统 ======
  // 统一前缀，方便控制台筛选。生产环境可关掉 DEBUG
  LOG_PREFIX: '[ARG]',
  DEBUG: true,

  log(...args) {
    if (this.DEBUG) console.log(this.LOG_PREFIX, ...args);
  },
  warn(...args) {
    console.warn(this.LOG_PREFIX, ...args);
  },
  error(...args) {
    console.error(this.LOG_PREFIX, ...args);
  },

  // ====== 工具方法 ======

  // 标记某条线索已发现
  mark(key) {
    if (!this.KEYS[key] && !Object.values(this.KEYS).includes(key)) {
      this.warn('未知线索 key:', key);
      return;
    }
    const k = this.KEYS[key] || key;
    if (!localStorage.getItem(k)) {
      localStorage.setItem(k, '1');
      this.log('✓ 线索解锁:', k);
      this.toast('线索 +1');
    }
  },

  // 直接用 key 值标记（更灵活）
  markRaw(rawKey) {
    if (!localStorage.getItem(rawKey)) {
      localStorage.setItem(rawKey, '1');
      this.log('✓ 线索解锁(raw):', rawKey);
    }
  },

  // 检查是否已解锁
  unlocked(key) {
    const k = this.KEYS[key] || key;
    return !!localStorage.getItem(k);
  },

  // 获取进度数（已发现线索数）
  progress() {
    return this.ORDER.filter(k => localStorage.getItem(k)).length;
  },

  // 校验密码（统一入口，自动累计失败次数、打日志）
  // 返回 true / false
  //   onOk   : 校验成功的回调（一般用来跳转）
  //   onFail : 校验失败的回调（一般用来显示错误提示）
  //   scene  : 场景名，用于日志识别（如 '锁屏'、'微信'、'邮箱'、'加密文件夹'、'最终触发'）
  verify(input, pwdKey, scene, onOk, onFail) {
    const val = (input || '').trim();
    this.log(`▶ 校验 [${scene}] 输入="${val}" 期望="${this.PWD[pwdKey]}"`);

    if (val === this.PWD[pwdKey]) {
      this.log(`✓ [${scene}] 通过`);
      this.failCount[pwdKey] = 0;
      if (typeof onOk === 'function') onOk();
      return true;
    }

    // 失败累计
    this.failCount[pwdKey] = (this.failCount[pwdKey] || 0) + 1;
    const n = this.failCount[pwdKey];
    this.warn(`✗ [${scene}] 第 ${n} 次失败 输入="${val}"`);

    // 失败 3 次以上，仅记录日志（不再弹卡关提示）
    if (n >= 3) {
      this.warn(`⚠ [${scene}] 已失败 ${n} 次`);
    }

    if (typeof onFail === 'function') onFail(n);
    return false;
  },

  // 校验密码（旧 API，保留向后兼容，同样做 trim 保持一致）
  check(input, pwdKey) {
    const v = (input == null ? '' : String(input)).trim();
    return v === this.PWD[pwdKey];
  },

  // 顶部 toast 提示
  toast(msg, duration = 1800) {
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), duration);
  },

  // "我"的内心独白（左下角半透明卡片，自动消失）
  // 用于在关键节点注入玩家角色的主观感受，强化沉浸感
  monologue(text, duration = 5000) {
    // 同一时刻只保留一条独白
    document.querySelectorAll('.monologue').forEach(el => el.remove());
    const el = document.createElement('div');
    el.className = 'monologue';
    el.innerHTML = `<span class="mono-quote">「</span>${text}<span class="mono-quote">」</span>`;
    document.body.appendChild(el);
    // 进场动画后等待 duration 再淡出
    setTimeout(() => {
      el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      el.style.opacity = '0';
      el.style.transform = 'translateY(8px)';
      setTimeout(() => el.remove(), 800);
    }, duration);
  },

  // 渲染底部进度条（每个内容页调用）
  renderProgress() {
    const cur = this.progress();
    const pct = Math.min(100, (cur / this.TOTAL_CLUES) * 100);

    const footer = document.createElement('div');
    footer.className = 'progress-footer';
    footer.innerHTML = `
      <span>${cur}/${this.TOTAL_CLUES}</span>
      <div class="progress-bar"><div class="fill" style="width:${pct}%"></div></div>
    `;
    document.body.appendChild(footer);
  },

  // 跳转（带相对路径处理）
  go(path) {
    location.href = path;
  },

  // 重置存档（测试/重玩用）
  reset() {
    this.ORDER.forEach(k => localStorage.removeItem(k));
    this.failCount = {};
    this.log('✓ 存档已清空');
    location.href = '/ARGgame/her-old-laptop/her-old-laptop.html';
  }
};

// ====== 解析站点根目录 ======
// 以 common.js 自身的 src 为锚点反推根目录，而不是用 location.pathname 推断：
// 部署在 GitHub Pages 子目录（如 username.github.io/her-old-laptop/）时，
// pathname 会把仓库名多算一层，导致 config / hints 路径 404。
// common.js 固定在 <root>/assets/js/common.js，往上两级即根目录。
function resolveSiteRoot() {
  const s = document.currentScript || document.querySelector('script[src*="common.js"]');
  if (s && s.src) {
    const base = new URL(s.src, location.href);
    return new URL('../../', base).href;
  }
  // 兜底：退回当前目录
  return new URL('./', location.href).href;
}
Game.ROOT = resolveSiteRoot();

// ====== 从 JSON 配置加载密码 ======
(function loadGameConfig() {
  const configPath = Game.ROOT + 'assets/config/game-config.json';

  fetch(configPath)
    .then(r => r.json())
    .then(c => {
      Game._config = c;
      Game._configLoaded = true;
      // 用 JSON 配置覆盖默认密码
      if (c.passwords) {
        for (const [pwdKey, configKey] of Object.entries(Game.PWD_CONFIG_MAP)) {
          if (c.passwords[configKey]) {
            Game.PWD[pwdKey] = c.passwords[configKey];
          }
        }
      }
      Game.log('✓ 配置加载完成');
    })
    .catch(() => {
      Game.warn('配置加载失败，使用默认密码');
      Game._configLoaded = true;
    });
})();

// 获取完整配置（供需要结局/浏览器/论坛等配置的页面使用）
// 返回 Promise，确保配置加载完成后再使用
Game.getConfig = function() {
  if (this._configLoaded) return Promise.resolve(this._config);
  return new Promise((resolve, reject) => {
    let attempts = 0;
    const check = setInterval(() => {
      attempts++;
      if (this._configLoaded) {
        clearInterval(check);
        resolve(this._config);
      } else if (attempts > 50) { // 5秒超时
        clearInterval(check);
        reject(new Error('配置加载超时'));
      }
    }, 100);
  });
};

// 自动给所有 .icon 和 .chat-item 加 hover 反馈（已用 CSS 实现，这里无需重复）
// 自动渲染时间到顶栏（如果存在 .clock）
// 自动注入 macOS 交通灯到 .window-bar
document.addEventListener('DOMContentLoaded', () => {
  const clock = document.querySelector('.topbar .clock, .clock');
  if (clock) {
    const update = () => {
      const d = new Date();
      const hh = String(d.getHours()).padStart(2, '0');
      const mm = String(d.getMinutes()).padStart(2, '0');
      const wd = ['日','一','二','三','四','五','六'][d.getDay()];
      clock.textContent = `周${wd} ${hh}:${mm}`;
    };
    update();
    setInterval(update, 30000);
  }

  // 注入 macOS 交通灯按钮到所有 .window-bar
  document.querySelectorAll('.window-bar').forEach(bar => {
    // 跳过已注入的
    if (bar.querySelector('.traffic-lights')) return;

    const lights = document.createElement('div');
    lights.className = 'traffic-lights';

    const close = document.createElement('button');
    close.className = 'tl close';
    close.title = '关闭';
    close.addEventListener('click', () => {
      const back = bar.querySelector('.back');
      if (back && back.getAttribute('href')) {
        location.href = back.getAttribute('href');
      } else {
        history.back();
      }
    });

    const minimize = document.createElement('button');
    minimize.className = 'tl minimize';
    minimize.title = '最小化';
    // 装饰性按钮，点击时窗口抖动
    minimize.addEventListener('click', () => {
      const win = document.querySelector('.window');
      if (win) {
        win.style.transform = 'scale(0.97)';
        setTimeout(() => { win.style.transform = ''; }, 200);
      }
    });

    const maximize = document.createElement('button');
    maximize.className = 'tl maximize';
    maximize.title = '最大化';
    // 装饰性按钮，点击无实际效果
    maximize.addEventListener('click', () => {});

    lights.appendChild(close);
    lights.appendChild(minimize);
    lights.appendChild(maximize);
    bar.insertBefore(lights, bar.firstChild);
  });
});
