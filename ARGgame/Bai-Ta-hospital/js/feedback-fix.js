(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const D = window.GAME_DATA || {};
  const KEY = D.saveKey || 'baita_hospital_save';
  const RESUME_KEY = '__baita_feedback_fix_resume__';
  const sessionGet = k => { try { return sessionStorage.getItem(k); } catch { return null; } };
  const sessionSet = (k,v) => { try { sessionStorage.setItem(k,v); } catch {} };
  const sessionRemove = k => { try { sessionStorage.removeItem(k); } catch {} };
  let morseAudio = null;
  let ambientAudio = null;
  let lastPageSignature = '';
  let observerTimer = 0;

  function readSave() {
    try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch { return null; }
  }
  function writeSave(s) {
    try { localStorage.setItem(KEY, JSON.stringify(s)); return true; } catch { return false; }
  }
  function toast(text) {
    const n = $('#toast');
    if (!n) return;
    n.textContent = text;
    n.classList.add('show');
    clearTimeout(toast.t);
    toast.t = setTimeout(() => n.classList.remove('show'), 2600);
  }
  function found(id) {
    const s = readSave();
    return !!s?.easter?.includes(id);
  }
  function collectFragment(id, label) {
    const s = readSave();
    if (!s) { toast('请先开始或继续一份调查存档'); return; }
    s.easter = Array.isArray(s.easter) ? s.easter : [];
    s.evidence = Array.isArray(s.evidence) ? s.evidence : [];
    if (s.easter.includes(id)) { toast(`碎片 ${label} 已在档案中`); return; }
    s.easter.push(id);
    if (s.easter.length >= 6 && D.evidence?.e22 && !s.evidence.includes('e22')) s.evidence.push('e22');
    s.savedAt = new Date().toISOString();
    if (!writeSave(s)) { toast('浏览器未允许写入本地存档'); return; }
    sessionSet(RESUME_KEY, '1');
    toast(`发现残留编号碎片 ${label}｜已写入存档`);
    setTimeout(() => location.reload(), 650);
  }

  function fragmentButton(id, label) {
    const isFound = found(id);
    return `<button type="button" data-hf-fragment="${id}" data-label="${label}" ${isFound ? 'disabled' : ''}>${isFound ? `碎片 ${label}｜已归档` : `检查页脚残留编号 ${label}`}</button>`;
  }

  function officialRecoveryHTML() {
    return `<section class="hf-archive-recovery" id="hfOfficialRecovery">
      <div class="hf-head"><strong>官网历史栏目恢复索引</strong><span>2013 → 改版迁移记录</span></div>
      <div class="hf-body">
        <p>新版首页把旧住院楼内容拆进了不同栏目。信息科迁移表仍保留两个可追溯入口，因此隐藏碎片不再依赖已经废弃的旧 <code>official()</code> 页面。</p>
        <div class="hf-columns">
          <article class="hf-doc">
            <h4>护理服务 → 七楼旧住院须知</h4>
            <p>旧页脚在迁移时没有完全清理。把鼠标移到页脚归档号附近，可以看到一段异常编号。</p>
            <div class="hf-fragment">11</div><br>${fragmentButton('c2','11')}
          </article>
          <article class="hf-doc">
            <h4>历史公告 → 旧版镜像</h4>
            <p>迁移日志注明：事故通报同时保存了一份“同期公告”快照。它没有出现在新版首页菜单中，但仍能从历史索引进入。</p>
            <button type="button" data-hf-legacy-toggle>打开旧版镜像「同期公告」</button>
            <div class="hf-legacy-panel" data-hf-legacy-panel hidden>
              <p><b>2013-09-12｜七楼设备夹层消防备案</b></p>
              <p class="small">归档页脚有一枚与正文无关的残留编号。</p>
              <div class="hf-fragment">13</div><br>${fragmentButton('c3','13')}
            </div>
          </article>
        </div>
      </div>
    </section>`;
  }

  function legacyRecoveryHTML() {
    return `<section class="hf-archive-recovery" id="hfLegacyRecovery">
      <div class="hf-head"><strong>同期公告｜归档页脚</strong><span>旧版镜像残留</span></div>
      <div class="hf-body"><article class="hf-doc"><h4>09/12 七楼新增“设备夹层”消防备案</h4><p>页面主体是普通备案信息，异常只留在页脚归档编号。</p><div class="hf-fragment">13</div><br>${fragmentButton('c3','13')}</article></div>
    </section>`;
  }

  function injectArchiveRecovery() {
    const page = $('#pageView');
    if (!page) return;
    const title = ($('#pageTitle')?.textContent || '').trim();
    const text = page.textContent || '';
    const officialScore = ['护理技能赛','患者服务','院务公开','医疗服务','科室导航'].filter(x => text.includes(x)).length;
    const looksOfficial = /官网|医院首页|官网镜像/.test(title) || officialScore >= 2;
    const looksMail = /邮箱/.test(title) || /历史数据整理邮箱/.test(text.slice(0,800));
    const looksLegacy = /旧版|历史镜像/.test(title) || (/事故通报/.test(text) && /缓存|版本/.test(text));
    if (looksOfficial && !looksMail && !looksLegacy && !$('#hfOfficialRecovery', page)) page.insertAdjacentHTML('beforeend', officialRecoveryHTML());
    if (looksLegacy && !$('#hfLegacyRecovery', page)) page.insertAdjacentHTML('beforeend', legacyRecoveryHTML());
  }

  const MORSE_WORDS = [
    ['...','---','...'],
    ['-...','--...','-----'],
    ['-----','-----','.----','--...'],
    ['---','..---']
  ];
  function morseVisual() {
    return `<div class="hf-morse-track">${MORSE_WORDS.map((word,wi) => `<div class="hf-morse-word" data-group="第 ${wi+1}/4 组">${word.map(code => `<span class="hf-morse-letter">${[...code].map(ch => `<i class="hf-morse-symbol ${ch==='.'?'dot':'dash'}"></i>`).join('')}</span>`).join('<span class="hf-morse-sep"></span>')}</div>`).join('')}</div>`;
  }
  function patchMorse() {
    const answer = $('#morseAnswer');
    const strip = $('#pulseStrip');
    if (!answer || !strip || strip.dataset.hfFixed === '1') return;
    strip.dataset.hfFixed = '1';
    strip.innerHTML = morseVisual();
    const play = $('#playMorse');
    if (play && !$('#hfMorseStatus')) play.insertAdjacentHTML('afterend', `<div class="hf-morse-status" id="hfMorseStatus"><span class="hf-audio-ready">CALL LINE 完整音轨已就绪</span><span>共 4 组；横向空间不足时可左右滑动灯条。</span></div>`);
  }

  function savedVolume(mult = 1) {
    const s = readSave();
    const v = Number(s?.settings?.volume ?? 45) / 100;
    return Math.max(0, Math.min(1, v * mult));
  }
  async function playMorseFile(btn) {
    try {
      morseAudio?.pause();
      morseAudio = new Audio('assets/audio/call_line_morse.wav');
      morseAudio.volume = savedVolume(.9);
      if (btn) { btn.disabled = true; btn.textContent = '播放中…'; }
      morseAudio.addEventListener('ended', () => { if (btn) { btn.disabled = false; btn.textContent = '播放筛选结果'; } }, {once:true});
      await morseAudio.play();
    } catch (e) {
      if (btn) { btn.disabled = false; btn.textContent = '播放筛选结果'; }
      playMorseFallback();
      toast('本地音轨未能直接播放，已切换浏览器合成脉冲');
    }
  }
  function playMorseFallback() {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      const ctx = new Ctx();
      const unit = .09, freq = 720;
      let t = ctx.currentTime + .06;
      const gain = ctx.createGain();
      gain.gain.value = .11 * savedVolume(1);
      gain.connect(ctx.destination);
      MORSE_WORDS.forEach((word, wi) => {
        word.forEach((code, li) => {
          [...code].forEach((ch, si) => {
            const dur = ch === '.' ? unit : unit * 3;
            const o = ctx.createOscillator(); o.type='sine'; o.frequency.value=freq; o.connect(gain); o.start(t); o.stop(t+dur); t += dur;
            if (si < code.length-1) t += unit;
          });
          if (li < word.length-1) t += unit * 3;
        });
        if (wi < MORSE_WORDS.length-1) t += unit * 7;
      });
      setTimeout(() => ctx.close?.(), Math.max(1000,(t-ctx.currentTime+1)*1000));
    } catch {}
  }

  function bodyIntensity() {
    if (document.body.classList.contains('intensity-mild')) return 'mild';
    if (document.body.classList.contains('intensity-ambient')) return 'ambient';
    return 'standard';
  }
  function ensureAmbient() {
    if (!ambientAudio) {
      ambientAudio = new Audio('assets/audio/hospital_ambient.wav');
      ambientAudio.loop = true;
      ambientAudio.preload = 'auto';
    }
    return ambientAudio;
  }
  async function syncAmbient(fromGesture = false) {
    const s = readSave();
    const appVisible = $('#gameApp') && !$('#gameApp').classList.contains('hidden');
    const on = !!s?.audio && appVisible;
    const a = ensureAmbient();
    const intensity = bodyIntensity();
    const factor = intensity === 'standard' ? .34 : intensity === 'mild' ? .17 : .11;
    a.volume = savedVolume(factor);
    if (!on) { a.pause(); return; }
    if (a.paused) {
      try { await a.play(); }
      catch { if (fromGesture) toast('浏览器阻止了环境音，请再次点击“音效：开”'); }
    }
  }

  function addModeDescription() {
    if ($('#horrorModeDetail')) return;
    const select = $('#intensitySelect');
    if (!select) return;
    const n = document.createElement('div');
    n.id = 'horrorModeDetail'; n.className = 'mode-detail';
    n.textContent = '标准恐怖：启用旧楼空调、电流、远处金属声的完整环境氛围，并低频率模拟荧光灯轻微闪动；不使用高频或强烈闪烁。勾选“减少动态”后闪烁完全关闭。';
    select.closest('label')?.insertAdjacentElement('afterend', n);
  }
  function updateHorrorIndicator() {
    const stats = $('.case-stats');
    if (!stats) return;
    let n = $('#hfHorrorIndicator');
    if (!n) { n = document.createElement('span'); n.id='hfHorrorIndicator'; n.className='hf-horror-indicator'; stats.appendChild(n); }
    const mode = bodyIntensity();
    n.textContent = mode === 'standard' ? '标准恐怖：完整氛围 / 轻度闪烁' : mode === 'mild' ? '轻柔模式：无闪烁' : '纯氛围模式';
  }
  function pageFlicker() {
    if (bodyIntensity() !== 'standard' || document.body.classList.contains('reduce-motion')) return;
    document.body.classList.remove('hf-flicker-event');
    void document.body.offsetWidth;
    document.body.classList.add('hf-flicker-event');
    setTimeout(() => document.body.classList.remove('hf-flicker-event'), 850);
  }

  function applyPatches() {
    injectArchiveRecovery();
    patchMorse();
    addModeDescription();
    updateHorrorIndicator();
    const sig = `${$('#pageTitle')?.textContent || ''}|${$('#fakeUrl')?.textContent || ''}`;
    if (sig && sig !== lastPageSignature) {
      const old = lastPageSignature; lastPageSignature = sig;
      if (old && /呼叫|监控|现场|B7|旧楼|call|cctv|scene/i.test(sig)) pageFlicker();
      syncAmbient(false);
    }
  }
  function schedulePatches() {
    clearTimeout(observerTimer);
    observerTimer = setTimeout(applyPatches, 40);
  }

  document.addEventListener('click', e => {
    const frag = e.target.closest('[data-hf-fragment]');
    if (frag) { e.preventDefault(); collectFragment(frag.dataset.hfFragment, frag.dataset.label); return; }
    const toggle = e.target.closest('[data-hf-legacy-toggle]');
    if (toggle) {
      const panel = toggle.parentElement.querySelector('[data-hf-legacy-panel]');
      if (panel) { panel.hidden = !panel.hidden; toggle.textContent = panel.hidden ? '打开旧版镜像「同期公告」' : '收起同期公告'; }
      return;
    }
  });

  /* 捕获阶段拦截旧 playMorse()，确保播放器一定使用完整四组本地音轨。 */
  document.addEventListener('click', e => {
    const btn = e.target.closest('#playMorse');
    if (!btn) return;
    e.preventDefault(); e.stopImmediatePropagation();
    playMorseFile(btn);
  }, true);

  document.addEventListener('click', e => {
    if (e.target.closest('#audioBtn,#coverAudioBtn,#applySettingsBtn')) setTimeout(() => { syncAmbient(true); updateHorrorIndicator(); }, 90);
  });
  document.addEventListener('pointerdown', () => syncAmbient(true), { once:true, passive:true });

  const obs = new MutationObserver(schedulePatches);
  obs.observe(document.documentElement, {childList:true,subtree:true,attributes:true,attributeFilter:['class']});
  addEventListener('storage', () => { schedulePatches(); syncAmbient(false); });
  addEventListener('visibilitychange', () => { if (document.hidden) ambientAudio?.pause(); else syncAmbient(false); });

  if (sessionGet(RESUME_KEY) === '1') {
    sessionRemove(RESUME_KEY);
    setTimeout(() => { const b=$('#continueBtn'); if (b && !b.disabled) b.click(); }, 140);
  }
  schedulePatches();
})();
