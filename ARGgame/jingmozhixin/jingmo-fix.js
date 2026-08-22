/* 《静默之心》调查流程、搜索容错与证据核对补丁 v4.0 */
(function () {
  'use strict';

  const KEY = 'jingmozhixin_patch_v4';
  const LEGACY_KEYS = ['jingmozhixin_patch_v3', 'jingmozhixin_patch_v2'];
  const defaultState = {
    clues: [],
    priceParts: [],
    evidence: { priceRevision: false, roomAccess: false },
    page: 'home',
    archiveUnlocked: false,
    ending: '',
    bookingSubmitted: false,
    wrongArchiveAttempts: 0,
    clue1GuideSeen: false
  };

  const q = (selector, root = document) => root.querySelector(selector);
  const qa = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const safeText = (element, text) => { if (element) element.textContent = text; };

  function validClueId(id) {
    const value = Number(id);
    return Number.isInteger(value) && value >= 1 && value <= 7;
  }

  function normalizeState(raw) {
    const next = Object.assign({}, defaultState, raw || {});
    next.evidence = Object.assign({}, defaultState.evidence, (raw && raw.evidence) || {});
    next.clues = Array.from(new Set((next.clues || []).map(Number).filter(validClueId))).sort((a, b) => a - b);
    next.priceParts = Array.from(new Set((next.priceParts || []).filter(value => value === '307' || value === '514')));
    next.wrongArchiveAttempts = Number(next.wrongArchiveAttempts) || 0;
    next.clue1GuideSeen = Boolean(next.clue1GuideSeen);
    if (!(next.evidence.priceRevision && next.evidence.roomAccess)) {
      next.clues = next.clues.filter(id => id !== 7);
    }
    return next;
  }

  function loadState() {
    try {
      const current = localStorage.getItem(KEY);
      if (current) return normalizeState(JSON.parse(current));
      for (const legacyKey of LEGACY_KEYS) {
        const legacy = localStorage.getItem(legacyKey);
        if (legacy) {
          const migrated = normalizeState(JSON.parse(legacy));
          migrated.clues = migrated.clues.filter(id => id !== 7 || (migrated.evidence.priceRevision && migrated.evidence.roomAccess));
          return migrated;
        }
      }
    } catch (error) {
      console.warn('[静默之心] 读取存档失败，已使用安全初始状态。', error);
    }
    return normalizeState({});
  }

  let state = loadState();

  function saveState() {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (error) {
      console.warn('[静默之心] 保存进度失败。', error);
    }
  }

  function clueSet() {
    return new Set(state.clues.map(Number).filter(validClueId));
  }

  function status(host, message, type = '') {
    if (!host) return null;
    let element = q('.jmx-inline-status', host);
    if (!element) {
      element = document.createElement('div');
      element.className = 'jmx-inline-status';
      host.appendChild(element);
    }
    element.className = `jmx-inline-status ${type}`.trim();
    element.textContent = message;
    return element;
  }

  function syncGameState() {
    try {
      if (typeof gameState !== 'undefined' && gameState.cluesFound) {
        gameState.cluesFound.clear();
        state.clues.forEach(id => gameState.cluesFound.add(Number(id)));
      }
    } catch (error) {
      console.warn('[静默之心] 同步原游戏状态失败。', error);
    }
    safeText(q('#clue-found'), String(state.clues.length));
  }

  function clueInfo(id) {
    const override = {
      1: ['旧宣传照的时间标记', '第三张宣传照来自旧监控存档，照片右侧保留了“03-07”的录制时间。'],
      3: ['两处异常价格', '307与514分别被写入两个无关服务项目。它们只是异常值，必须继续查看价格备案历史。'],
      7: ['证据链闭合', '价格版本记录与307门禁缓存指向同一个日期；它与更早的照片时间构成两组按先后排列的月日信息。']
    };
    if (override[id]) return override[id];
    const fallback = {
      2: ['被删除的员工信息', '林默并非普通离职，任职年限可用于排除干扰数字。'],
      4: ['评价中的姓名异常', '评价对咨询师的称呼与人员信息存在值得核对之处。'],
      5: ['夜间房间记录', '307房间在非营业时段持续亮灯，公开用途与实际使用冲突。'],
      6: ['患者编号0482', '0482属于病例编号体系，不是日期。']
    };
    try {
      if (typeof clues !== 'undefined' && clues[id]) return [clues[id].desc, clues[id].text];
    } catch (error) {}
    return fallback[id] || ['未知线索', ''];
  }

  function showClueModal(id) {
    const info = clueInfo(id);
    safeText(q('#clue-modal-desc'), info[0]);
    safeText(q('#clue-modal-text'), info[1]);
    q('#clue-modal')?.classList.add('active');
  }

  function canSynthesize() {
    const set = clueSet();
    return [1, 3, 5].every(id => set.has(id)) && state.evidence.priceRevision && state.evidence.roomAccess;
  }

  function addClue(id, show = true) {
    id = Number(id);
    if (!validClueId(id)) return false;
    const set = clueSet();
    if (set.has(id)) {
      if (show) openDrawer();
      return false;
    }
    if (id === 7 && !canSynthesize()) {
      openDrawer();
      status(q('#jmx-drawer-body'), `证据链尚未闭合：${synthesisHint()}`, 'error');
      return false;
    }
    set.add(id);
    state.clues = Array.from(set).sort((a, b) => a - b);
    saveState();
    syncGameState();
    renderDrawer();
    renderEvidenceLaunches();
    if (show) showClueModal(id);
    return true;
  }

  window.findClue = function (id) {
    if (Number(id) === 3) {
      openDrawer();
      return;
    }
    addClue(Number(id), true);
  };

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, char => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    })[char]);
  }

  function installExtraStyles() {
    if (q('#jmx-v4-style')) return;
    const style = document.createElement('style');
    style.id = 'jmx-v4-style';
    style.textContent = `
      .jmx-photo-guide{position:absolute;right:16px;bottom:18px;z-index:12;border:1px solid rgba(255,255,255,.78);background:rgba(25,31,38,.78);color:#fff;border-radius:999px;padding:8px 12px;font:inherit;font-size:.76rem;cursor:pointer;backdrop-filter:blur(6px);box-shadow:0 6px 20px rgba(0,0,0,.22)}
      .jmx-photo-guide:hover,.jmx-photo-guide:focus-visible{background:rgba(139,38,53,.9);outline:2px solid #fff;outline-offset:2px}
      .hidden-hotspot.jmx-guided{width:86px!important;height:86px!important;border:3px solid rgba(255,236,160,.95)!important;background:rgba(255,236,160,.13);box-shadow:0 0 0 8px rgba(255,236,160,.13),0 0 28px rgba(255,236,160,.7);animation:jmxPulse 1.1s ease-in-out infinite}
      @keyframes jmxPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}
      .jmx-search-help{max-width:700px;margin:0 auto 18px;padding:12px 14px;border:1px solid var(--border);border-radius:10px;background:#fff;text-align:left;color:var(--text-light);font-size:.8rem;line-height:1.7}
      .jmx-search-chips{display:flex;flex-wrap:wrap;gap:7px;margin-top:9px}.jmx-search-chip{border:1px solid var(--border);background:var(--bg-warm);color:var(--primary);border-radius:999px;padding:6px 10px;font:inherit;font-size:.75rem;cursor:pointer}
      .jmx-search-chip:hover{border-color:var(--secondary);background:#fff}
      .jmx-result-note{margin-top:5px;font-size:.72rem;color:var(--accent)}
      .jmx-archive-progress{display:grid;gap:7px;margin:12px 0}.jmx-archive-progress div{padding:8px 10px;border-radius:7px;background:#f5f3ef;color:var(--text-light);font-size:.78rem}.jmx-archive-progress .done{background:#eef7f1;color:#28633d}.jmx-archive-progress .missing{background:#fff2f2;color:#7a2530}
      .jmx-archive-actions{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin:10px 0}.jmx-archive-actions button{border:1px solid var(--border);background:#fff;color:var(--primary);border-radius:8px;padding:9px;font:inherit;font-size:.75rem;cursor:pointer}.jmx-archive-actions button:hover{border-color:var(--secondary)}
      .jmx-check-row select.jmx-correct{border-color:#3d8659;background:#eef7f1}.jmx-check-row select.jmx-wrong{border-color:var(--accent);background:#fff2f2}
      @media(max-width:620px){.jmx-photo-guide{right:10px;bottom:12px}.jmx-archive-actions{grid-template-columns:1fr}}
    `;
    document.head.appendChild(style);
  }

  function buildTools() {
    if (q('.jmx-investigation-bar')) return;
    const bar = document.createElement('div');
    bar.className = 'jmx-investigation-bar';
    bar.innerHTML = '<button class="jmx-tool-btn" id="jmx-open-board" type="button">调查记录</button><button class="jmx-tool-btn" id="jmx-open-archive" type="button">档案入口</button>';
    q('header')?.insertAdjacentElement('afterend', bar);
    q('#jmx-open-board').onclick = openDrawer;
    q('#jmx-open-archive').onclick = () => window.showPage('archive');

    const overlay = document.createElement('div');
    overlay.className = 'jmx-overlay';
    overlay.onclick = closeDrawer;
    document.body.appendChild(overlay);

    const drawer = document.createElement('aside');
    drawer.className = 'jmx-drawer';
    drawer.setAttribute('aria-label', '调查记录');
    drawer.innerHTML = '<div class="jmx-drawer-head"><h3>调查记录与交叉核对</h3><button class="jmx-close" type="button" aria-label="关闭">×</button></div><div class="jmx-drawer-body" id="jmx-drawer-body"></div>';
    document.body.appendChild(drawer);
    q('.jmx-close', drawer).onclick = closeDrawer;
    buildEvidenceModal();
    renderDrawer();
  }

  function openDrawer() {
    q('.jmx-drawer')?.classList.add('open');
    q('.jmx-overlay')?.classList.add('show');
    renderDrawer();
  }

  function closeDrawer() {
    q('.jmx-drawer')?.classList.remove('open');
    q('.jmx-overlay')?.classList.remove('show');
  }

  function synthesisHint() {
    const parts = [];
    if (!clueSet().has(1)) parts.push('在首页第三张宣传照查看时间标记');
    if (!['307', '514'].every(value => state.priceParts.includes(value))) parts.push('在服务页分别记录307和514两处异常价格');
    else if (!state.evidence.priceRevision) parts.push('打开价格备案历史');
    if (!clueSet().has(5)) parts.push('在患者心声或预约回访中确认307夜间异常');
    else if (!state.evidence.roomAccess) parts.push('打开307门禁缓存');
    return parts.length ? parts.join('；') : '证据来源已经齐全，可以执行综合核对。';
  }

  function renderDrawer() {
    const body = q('#jmx-drawer-body');
    if (!body) return;
    const set = clueSet();
    let html = `<div class="jmx-progress">已确认 <strong>${set.size}/7</strong> 条调查记录。数字可能代表日期、房间、价格或病例编号，必须用独立记录互证。</div><div class="jmx-clue-grid">`;
    for (let id = 1; id <= 7; id += 1) {
      const info = clueInfo(id);
      html += `<div class="jmx-clue ${set.has(id) ? 'found' : ''}"><b>${set.has(id) ? '✓' : '○'} 记录 ${id}</b>${set.has(id) ? escapeHtml(info[0]) : (id === 1 ? '首页第三张宣传照有异常' : id === 7 ? '等待证据综合' : '尚未确认来源')}</div>`;
    }
    html += `</div><div class="jmx-synthesis"><b>证据核对进度</b><div class="jmx-evidence-state ${state.evidence.priceRevision ? 'done' : ''}">${state.evidence.priceRevision ? '✓' : '○'} 价格备案版本记录</div><div class="jmx-evidence-state ${state.evidence.roomAccess ? 'done' : ''}">${state.evidence.roomAccess ? '✓' : '○'} 307门禁使用记录</div><p>${escapeHtml(synthesisHint())}</p><button class="jmx-synthesis-action" id="jmx-synthesize" type="button" ${canSynthesize() ? '' : 'disabled'}>综合证据并形成第7条记录</button></div><button class="jmx-reset" id="jmx-reset" type="button">清空调查进度并重新体验</button>`;
    body.innerHTML = html;
    q('#jmx-reset').onclick = resetPatch;
    q('#jmx-synthesize').onclick = () => { closeDrawer(); addClue(7, true); };
  }

  function resetPatch() {
    if (!confirm('确定清空线索、档案和结局记录吗？')) return;
    try {
      localStorage.removeItem(KEY);
      LEGACY_KEYS.forEach(key => localStorage.removeItem(key));
    } catch (error) {}
    location.reload();
  }

  function guideClueOne(showMessage = true) {
    window.showPage('home');
    if (typeof window.setSlide === 'function') window.setSlide(2);
    else if (typeof setSlide === 'function') setSlide(2);
    const hotspot = q('.hidden-hotspot');
    if (!hotspot) return;
    hotspot.classList.add('jmx-guided');
    hotspot.scrollIntoView({ behavior: 'smooth', block: 'center' });
    state.clue1GuideSeen = true;
    saveState();
    if (showMessage) {
      const home = q('#page-home');
      status(home, '已定位到第三张宣传照。点击画面右侧闪烁区域，读取旧录像时间标记。', 'success');
    }
    window.setTimeout(() => hotspot.classList.remove('jmx-guided'), 12000);
  }

  function patchHotspot() {
    const hotspot = q('.hidden-hotspot');
    if (!hotspot) return;
    hotspot.setAttribute('tabindex', '0');
    hotspot.setAttribute('role', 'button');
    hotspot.setAttribute('aria-label', '查看旧宣传照右侧的录制时间');
    hotspot.title = '点击查看照片右侧的旧录像时间标记';
    hotspot.onkeydown = event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        hotspot.click();
      }
    };
    const slide = q('.slide-3');
    if (slide && !q('.jmx-photo-guide', slide)) {
      const button = document.createElement('button');
      button.className = 'jmx-photo-guide';
      button.type = 'button';
      button.textContent = '查看照片时间标记';
      button.onclick = event => {
        event.stopPropagation();
        hotspot.click();
      };
      slide.appendChild(button);
    }
  }

  function patchPrices() {
    qa('.price').forEach(element => {
      const text = element.textContent.replace(/\s/g, '');
      if (!text.includes('307') && !text.includes('514')) return;
      const part = text.includes('307') ? '307' : '514';
      element.onclick = function () {
        if (!state.priceParts.includes(part)) {
          state.priceParts.push(part);
          saveState();
        }
        renderPriceMarks();
        renderEvidenceLaunches();
        if (['307', '514'].every(value => state.priceParts.includes(value))) {
          addClue(3, true);
          status(q('#page-services'), '两处异常价格已记录。下一步点击页面下方“查看版本记录”，核对这些数字被写入的日期。', 'success');
        } else {
          status(q('#page-services'), `已记录 ${part}。还需要点击另一处异常价格。`);
        }
      };
      element.setAttribute('tabindex', '0');
      element.setAttribute('role', 'button');
      element.onkeydown = event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          element.click();
        }
      };
    });
    renderPriceMarks();
  }

  function renderPriceMarks() {
    qa('.price').forEach(element => {
      const text = element.textContent.replace(/\s/g, '');
      const part = text.includes('307') ? '307' : text.includes('514') ? '514' : '';
      if (!part) return;
      let mark = q('.jmx-price-mark', element);
      if (!mark) {
        mark = document.createElement('span');
        mark.className = 'jmx-price-mark';
        element.appendChild(mark);
      }
      const found = state.priceParts.includes(part);
      mark.classList.toggle('found', found);
      mark.textContent = found ? '已记录' : '点击记录';
    });
  }

  function patchRedactions() {
    qa('.redacted').forEach(element => {
      element.setAttribute('tabindex', '0');
      element.setAttribute('role', 'button');
      const reveal = () => {
        element.classList.add('jmx-revealed');
        addClue(2, true);
      };
      element.onclick = reveal;
      element.onkeydown = event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          reveal();
        }
      };
    });
  }

  function installEvidencePanels() {
    const services = q('#page-services');
    const table = q('.service-table', services || document);
    if (services && table && !q('#jmx-price-launch')) {
      const box = document.createElement('div');
      box.id = 'jmx-price-launch';
      box.className = 'jmx-evidence-launch';
      box.innerHTML = '<div><b>价格备案历史</b><span>先点击价目表中的307和514，再查看版本修改时间。</span></div><button type="button">查看版本记录</button>';
      table.insertAdjacentElement('afterend', box);
      q('button', box).onclick = openPriceLog;
    }

    const reviews = q('#page-reviews');
    const grid = q('.reviews-grid', reviews || document);
    if (reviews && grid && !q('#jmx-room-launch')) {
      const box = document.createElement('div');
      box.id = 'jmx-room-launch';
      box.className = 'jmx-evidence-launch';
      box.innerHTML = '<div><b>307房间门禁缓存</b><span>先在留言或预约回访中确认307房间的夜间异常。</span></div><button type="button">查看门禁记录</button>';
      grid.insertAdjacentElement('afterend', box);
      q('button', box).onclick = openRoomLog;
    }
    renderEvidenceLaunches();
  }

  function renderEvidenceLaunches() {
    const price = q('#jmx-price-launch');
    const room = q('#jmx-room-launch');
    if (price) {
      const ready = ['307', '514'].every(value => state.priceParts.includes(value));
      const button = q('button', price);
      button.disabled = false;
      button.textContent = state.evidence.priceRevision ? '重新查看版本记录' : ready ? '查看版本记录' : '去记录两处异常价格';
      price.classList.toggle('done', state.evidence.priceRevision);
    }
    if (room) {
      const ready = clueSet().has(5);
      const button = q('button', room);
      button.disabled = false;
      button.textContent = state.evidence.roomAccess ? '重新查看门禁记录' : ready ? '查看门禁记录' : '去确认307夜间异常';
      room.classList.toggle('done', state.evidence.roomAccess);
    }
    renderDrawer();
    renderArchiveProgress();
  }

  function buildEvidenceModal() {
    if (q('#jmx-evidence-modal')) return;
    const modal = document.createElement('div');
    modal.id = 'jmx-evidence-modal';
    modal.className = 'jmx-evidence-modal';
    modal.innerHTML = '<div class="jmx-evidence-card" role="dialog" aria-modal="true" aria-labelledby="jmx-evidence-title"><button class="jmx-evidence-close" type="button" aria-label="关闭">×</button><div id="jmx-evidence-content"></div></div>';
    document.body.appendChild(modal);
    q('.jmx-evidence-close', modal).onclick = closeEvidenceModal;
    modal.onclick = event => { if (event.target === modal) closeEvidenceModal(); };
  }

  function closeEvidenceModal() {
    q('#jmx-evidence-modal')?.classList.remove('show');
  }

  function showEvidence(title, lead, rows, footer) {
    const host = q('#jmx-evidence-content');
    if (!host) return;
    host.innerHTML = `<div class="jmx-evidence-kicker">内部缓存 / 只读副本</div><h3 id="jmx-evidence-title">${escapeHtml(title)}</h3><p>${escapeHtml(lead)}</p><div class="jmx-record-table">${rows.map(row => `<div><span>${escapeHtml(row[0])}</span><strong>${escapeHtml(row[1])}</strong></div>`).join('')}</div><div class="jmx-record-note">${escapeHtml(footer)}</div>`;
    q('#jmx-evidence-modal')?.classList.add('show');
  }

  function openPriceLog() {
    if (!['307', '514'].every(value => state.priceParts.includes(value))) {
      window.showPage('services');
      status(q('#page-services'), '请先点击价目表里的“¥307”和“¥514”。两处都显示“已记录”后，版本记录即可打开。', 'error');
      q('#page-services')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    state.evidence.priceRevision = true;
    saveState();
    showEvidence(
      '价格表版本变更记录',
      '系统保留了发布前后的字段差异。价格只是被写入的结果，真正需要记录的是修改日期。',
      [
        ['版本号', 'PRC-2026-0514-B'],
        ['修改时间', '2026-05-14 21:37'],
        ['个体咨询', '500 → 307'],
        ['危机干预', '800 → 514'],
        ['操作账号', 'LM-05（已停用）']
      ],
      '请记录：价格版本修改日期是05-14。还需要另一套独立系统确认同一天。'
    );
    renderEvidenceLaunches();
  }

  function openRoomLog() {
    if (!clueSet().has(5)) {
      window.showPage('reviews');
      status(q('#page-reviews'), '门禁缓存尚未解锁。请先展开林遥的留言，或在预约备注中输入“307”“夜间”或“灯”以获取值守摘要。', 'error');
      return;
    }
    state.evidence.roomAccess = true;
    saveState();
    showEvidence(
      '307房间门禁缓存',
      '这份记录来自与价目表不同的系统，可用于验证某个日期是否只是巧合。',
      [
        ['记录日期', '2026-05-14'],
        ['开门时间', '22:11:08'],
        ['关闭时间', '22:19:42'],
        ['房间', '307（对外标注：设备间）'],
        ['识别卡', 'LM-05'],
        ['状态', '异常时段访问']
      ],
      '请记录：门禁日期也是05-14。两套独立系统指向同一天。'
    );
    renderEvidenceLaunches();
  }

  window.jmxOpenPriceLog = openPriceLog;
  window.jmxOpenRoomLog = openRoomLog;
  window.jmxGuideClueOne = guideClueOne;

  const originalShowPage = window.showPage;
  window.showPage = function (page) {
    const target = q(`#page-${page}`);
    if (!target) return;
    try {
      originalShowPage(page);
    } catch (error) {
      qa('.page-section').forEach(section => section.classList.remove('active'));
      target.classList.add('active');
      window.scrollTo(0, 0);
    }
    state.page = page;
    saveState();
    q('header nav')?.classList.remove('jmx-open');
    if (page === 'archive') enhanceArchive();
    if (page === 'search') enhanceSearchPage();
    renderEvidenceLaunches();
  };

  function mobileMenu() {
    const nav = q('header nav');
    const actions = q('.header-actions');
    if (!nav || !actions || q('.jmx-mobile-menu')) return;
    const button = document.createElement('button');
    button.className = 'jmx-mobile-menu';
    button.type = 'button';
    button.setAttribute('aria-label', '展开导航');
    button.textContent = '☰';
    button.onclick = () => nav.classList.toggle('jmx-open');
    actions.insertAdjacentElement('afterend', button);
  }

  function evidenceProgressHtml() {
    const hasPhoto = clueSet().has(1);
    const hasPrice = state.evidence.priceRevision;
    const hasRoom = state.evidence.roomAccess;
    return `
      <div class="jmx-archive-progress" id="jmx-archive-progress">
        <div class="${hasPhoto ? 'done' : 'missing'}">${hasPhoto ? '✓' : '○'} 较早日期：第三张宣传照的录制时间</div>
        <div class="${hasPrice ? 'done' : 'missing'}">${hasPrice ? '✓' : '○'} 较晚日期记录一：价格备案修改时间</div>
        <div class="${hasRoom ? 'done' : 'missing'}">${hasRoom ? '✓' : '○'} 较晚日期记录二：307门禁缓存日期</div>
      </div>
      <div class="jmx-archive-actions">
        <button type="button" id="jmx-go-photo">去看第三张照片</button>
        <button type="button" id="jmx-go-price">去看价格备案</button>
        <button type="button" id="jmx-go-room">去看门禁记录</button>
      </div>`;
  }

  function enhanceArchive() {
    const gate = q('#archive-gate');
    if (!gate) return;
    if (!q('.jmx-archive-reason', gate)) {
      const box = document.createElement('div');
      box.className = 'jmx-archive-reason';
      box.innerHTML = `
        <h4>进入前完成三段证据核对</h4>
        <p>三个下拉框只是在选择“证据来源”。即使选项正确，也必须实际打开对应记录。系统会分别告诉你“选择错误”还是“证据尚未查看”。</p>
        ${evidenceProgressHtml()}
        <div class="jmx-check-row jmx-check-three">
          <select id="jmx-date-a" aria-label="较早日期来源">
            <option value="">较早日期来源</option>
            <option value="photo307">旧宣传照录制时间（03-07）</option>
            <option value="five">林默任职5年</option>
            <option value="patient">患者编号0482</option>
          </select>
          <select id="jmx-date-b" aria-label="较晚日期记录一">
            <option value="">较晚日期·记录一</option>
            <option value="price514">价格版本修改时间（05-14）</option>
            <option value="pricevalue">异常价格514本身</option>
            <option value="roomnumber">房间号307</option>
          </select>
          <select id="jmx-date-c" aria-label="较晚日期记录二">
            <option value="">较晚日期·记录二</option>
            <option value="room514">307门禁缓存日期（05-14）</option>
            <option value="review">患者评价发布日期</option>
            <option value="phone">页脚电话号码</option>
          </select>
        </div>
        <button class="jmx-tool-btn" id="jmx-check-reason" type="button">核对三个选项</button>
        <div id="jmx-reason-result"></div>`;
      gate.insertBefore(box, q('.archive-input', gate));
      q('#jmx-check-reason').onclick = checkReasonSelections;
    }

    bindArchiveActions();
    renderArchiveProgress();
    const password = q('#archive-password');
    if (password) {
      password.setAttribute('inputmode', 'numeric');
      password.setAttribute('autocomplete', 'off');
      password.setAttribute('aria-label', '六位档案访问凭证');
    }
  }

  function bindArchiveActions() {
    const photo = q('#jmx-go-photo');
    const price = q('#jmx-go-price');
    const room = q('#jmx-go-room');
    if (photo) photo.onclick = () => guideClueOne(true);
    if (price) price.onclick = openPriceLog;
    if (room) room.onclick = openRoomLog;
  }

  function renderArchiveProgress() {
    const old = q('#jmx-archive-progress');
    if (!old) return;
    const wrapper = document.createElement('div');
    wrapper.innerHTML = evidenceProgressHtml();
    const newProgress = q('#jmx-archive-progress', wrapper);
    const newActions = q('.jmx-archive-actions', wrapper);
    old.replaceWith(newProgress);
    const existingActions = q('.jmx-archive-actions');
    if (existingActions) existingActions.replaceWith(newActions);
    bindArchiveActions();
  }

  function markSelection(select, correctValue) {
    if (!select) return;
    select.classList.remove('jmx-correct', 'jmx-wrong');
    if (!select.value) return;
    select.classList.add(select.value === correctValue ? 'jmx-correct' : 'jmx-wrong');
  }

  function checkReasonSelections() {
    const a = q('#jmx-date-a');
    const b = q('#jmx-date-b');
    const c = q('#jmx-date-c');
    const host = q('#jmx-reason-result');
    if (!a || !b || !c || !host) return;

    markSelection(a, 'photo307');
    markSelection(b, 'price514');
    markSelection(c, 'room514');

    if (!a.value || !b.value || !c.value) {
      status(host, '请先完成三个下拉框。每一项都要选择一条“记录来源”。', 'error');
      return;
    }

    const choicesCorrect = a.value === 'photo307' && b.value === 'price514' && c.value === 'room514';
    if (!choicesCorrect) {
      const wrong = [];
      if (a.value !== 'photo307') wrong.push('较早日期来源');
      if (b.value !== 'price514') wrong.push('较晚日期记录一');
      if (c.value !== 'room514') wrong.push('较晚日期记录二');
      status(host, `选项中仍有错误：${wrong.join('、')}。房间号、价格数值、任职年限和病例编号本身都不是日期记录。`, 'error');
      return;
    }

    const missing = [];
    if (!clueSet().has(1)) missing.push('第三张宣传照时间标记');
    if (!state.evidence.priceRevision) missing.push('价格备案版本记录');
    if (!state.evidence.roomAccess) missing.push('307门禁缓存');

    if (missing.length) {
      status(host, `三个选项是正确的，但还没有实际查看：${missing.join('、')}。请使用上方三个“去看”按钮补齐记录；这不是答案错误。`, 'success');
      return;
    }

    if (!clueSet().has(7)) addClue(7, false);
    status(host, '证据链成立：03-07是较早日期，05-14被两套独立系统确认。请按先后顺序拼成六位访问凭证。', 'success');
    renderArchiveProgress();
  }

  window.checkArchivePassword = function () {
    const gate = q('#archive-gate');
    const content = q('#archive-content');
    const input = q('#archive-password');
    if (!gate || !content || !input) return;
    const password = input.value.replace(/\D/g, '').slice(0, 6);
    input.value = password;

    if (!clueSet().has(7) || !state.evidence.priceRevision || !state.evidence.roomAccess) {
      status(gate, `访问被拒绝：${synthesisHint()}。三个下拉框选对并不等于已经查看证据。`, 'error');
      return;
    }
    if (password.length !== 6) {
      status(gate, '凭证应为六位数字：把03-07和05-14去掉分隔符，再按时间先后拼接。', 'error');
      return;
    }
    if (password === '307514') {
      gate.style.display = 'none';
      content.classList.add('active');
      state.archiveUnlocked = true;
      saveState();
      appendEndingChoice();
      status(content, '档案已解锁。建议先阅读全部时间记录，再决定证据如何处理。', 'success');
    } else {
      state.wrongArchiveAttempts += 1;
      saveState();
      const message = state.wrongArchiveAttempts >= 2
        ? '仍未通过：03-07去掉分隔符是307，05-14去掉分隔符是514，按先后顺序组合。'
        : '凭证不正确：重新核对较早日期与较晚日期的先后顺序。';
      status(gate, message, 'error');
    }
  };

  function normalizeSearchTerm(value) {
    return String(value || '')
      .trim()
      .toLowerCase()
      .replace(/[，。、“”‘’；;：:、|/\\_-]+/g, ' ')
      .replace(/\s+/g, ' ');
  }

  function searchTokens(term) {
    const tokens = term.split(' ').filter(Boolean);
    const expanded = new Set(tokens);
    const aliases = {
      '线索一': ['线索1', '照片', '轮播', '录像', '03-07', '3月7日'],
      '线索1': ['线索一', '照片', '轮播', '录像', '03-07', '3月7日'],
      '第一条': ['线索1', '照片', '轮播'],
      '三月七日': ['03-07', '3月7日', '照片'],
      '五月十四日': ['05-14', '5月14日', '价格备案', '门禁'],
      '提示': ['线索', '调查'],
      '搜索词': ['林默', '307', '0482', '价格备案', '档案']
    };
    tokens.forEach(token => (aliases[token] || []).forEach(alias => expanded.add(alias)));
    return Array.from(expanded);
  }

  function enhanceSearchPage() {
    const page = q('#page-search');
    const searchBox = q('.search-big', page || document);
    if (!page || !searchBox || q('.jmx-search-help', page)) return;
    const help = document.createElement('div');
    help.className = 'jmx-search-help';
    help.innerHTML = '<b>搜索支持单个词、多关键词和带标点输入。</b><br>搜索结果会告诉你下一步去哪里；未解锁的缓存也会显示，不会再直接返回空白。<div class="jmx-search-chips"></div>';
    searchBox.insertAdjacentElement('afterend', help);
    const chips = ['线索一', '林默', '307', '0482', '价格备案', '档案'];
    const host = q('.jmx-search-chips', help);
    chips.forEach(text => {
      const button = document.createElement('button');
      button.className = 'jmx-search-chip';
      button.type = 'button';
      button.textContent = text;
      button.onclick = () => {
        const input = q('#big-search');
        if (input) input.value = text;
        window.doSearch(text);
      };
      host.appendChild(button);
    });
  }

  window.doSearch = function (keyword) {
    const host = q('#search-results');
    if (!host) return;
    enhanceSearchPage();
    const term = normalizeSearchTerm(keyword);
    host.innerHTML = '';
    if (!term) {
      host.innerHTML = '<div class="loading-text">请输入关键词，或点击上方推荐搜索词</div>';
      return;
    }

    const tokens = searchTokens(term);
    const data = [
      {
        title: '线索1：第三张宣传照的旧录像时间',
        desc: '首页轮播图第三张照片右侧有时间叠加标记。',
        url: '/home/slide-3',
        keywords: '线索一 线索1 第一条 照片 宣传照 轮播 第三张 录像 时间 03-07 3月7日 提示',
        action: () => guideClueOne(true),
        special: true,
        note: clueSet().has(1) ? '已找到，可重新定位' : '点击后自动切到第三张图并高亮可点击区域'
      },
      { title: '中心简介', desc: '成立时间、地址与公开业务说明。', page: 'about', url: '/about', keywords: '中心 简介 地址 业务' },
      { title: '咨询团队', desc: '张雅雯、林默与陈浩的公开履历。', page: 'about', url: '/about', keywords: '团队 林默 张雅雯 陈浩 离职 员工' },
      { title: '服务价格备案', desc: '不同项目的定价记录，部分字段存在异常。', page: 'services', url: '/services', keywords: '服务 价格 备案 307 514 异常价格', note: '进入后分别点击¥307和¥514' },
      { title: '患者评价索引', desc: '来访者留言与被折叠的夜间记录。', page: 'reviews', url: '/reviews', keywords: '患者 评价 留言 林遥 夜间 307 灯 0482' },
      { title: '预约与内部回访', desc: '在备注中输入林默、307、夜间或灯，可触发值守摘要。', page: 'booking', url: '/booking', keywords: '预约 回访 林默 307 夜间 灯 真相', note: '不需要填写真实姓名或电话' },
      { title: '受限：林默私人档案', desc: '入口存在，但凭证必须由多处记录交叉推导。', page: 'archive', url: '/archive', keywords: '林默 档案 真相 307 0482 密码 凭证 三个框', special: true },
      {
        title: '缓存：价格表版本记录',
        desc: state.evidence.priceRevision ? '已解锁：修改日期为2026-05-14。' : '先在服务页点击并记录307和514。',
        url: '/cache/price-history',
        keywords: '价格 备案 514 05-14 5月14日 版本 修改时间 缓存',
        action: openPriceLog,
        special: true,
        note: state.evidence.priceRevision ? '点击重新查看' : '未解锁时点击会带你去正确页面'
      },
      {
        title: '缓存：307房间门禁记录',
        desc: state.evidence.roomAccess ? '已解锁：记录日期为2026-05-14。' : '先确认307房间在夜间仍被使用。',
        url: '/cache/access-307',
        keywords: '307 房间 门禁 夜间 05-14 5月14日 缓存 灯',
        action: openRoomLog,
        special: true,
        note: state.evidence.roomAccess ? '点击重新查看' : '未解锁时点击会说明缺少哪一步'
      },
      { title: '患者编号索引', desc: '0482属于病例编号体系，不能直接当作日期。', page: 'reviews', url: '/patients/0482', keywords: '0482 患者 病例 编号' }
    ];

    const ranked = data.map(item => {
      const haystack = normalizeSearchTerm(`${item.title} ${item.desc} ${item.url} ${item.keywords || ''}`);
      let score = 0;
      tokens.forEach(token => {
        if (haystack.includes(token)) score += token.length >= 3 ? 3 : 1;
      });
      if (haystack.includes(term)) score += 5;
      return { item, score };
    }).filter(entry => entry.score > 0).sort((a, b) => b.score - a.score);

    if (!ranked.length) {
      host.innerHTML = '<div class="no-results">没有完全相同的词条，但你仍可尝试：线索一、林默、307、0482、价格备案、档案。搜索支持空格和标点。</div>';
      return;
    }

    ranked.forEach(({ item }) => {
      const element = document.createElement('div');
      element.className = `search-result-item ${item.special ? 'special-review' : ''}`;
      element.tabIndex = 0;
      element.innerHTML = '<h4></h4><p></p><div class="url"></div>' + (item.note ? '<div class="jmx-result-note"></div>' : '');
      safeText(q('h4', element), item.title);
      safeText(q('p', element), item.desc);
      safeText(q('.url', element), `jingxin.center${item.url}`);
      safeText(q('.jmx-result-note', element), item.note || '');
      element.onclick = () => item.action ? item.action() : window.showPage(item.page);
      element.onkeydown = event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          element.click();
        }
      };
      host.appendChild(element);
    });
  };

  window.submitBooking = function () {
    const form = q('.booking-form');
    const name = q('#book-name');
    const note = q('#book-note');
    if (!form || !name || !note) return;
    const alias = name.value.trim();
    const memo = note.value.trim();
    if (!alias) {
      status(form, '请输入调查代号；本游戏不需要填写真实姓名。', 'error');
      name.focus();
      return;
    }
    state.bookingSubmitted = true;
    saveState();
    if (/林默|真相|307|夜间|灯/.test(memo)) {
      status(form, '系统拦截了内部关键词，并返回值守摘要：307房间在非营业时段仍有门禁活动。现在可到“患者心声”页查看门禁缓存。', 'success');
      addClue(5, true);
    } else {
      status(form, '普通预约已模拟提交。若在调查307夜间异常，可在备注中输入“307”“夜间”或“灯”。');
    }
    renderEvidenceLaunches();
  };

  function bookingPrivacy() {
    const name = q('#book-name');
    const phone = q('#book-phone');
    if (name) {
      name.placeholder = '输入调查代号（无需真实姓名）';
      safeText(name.closest('.form-group')?.querySelector('label'), '调查代号');
    }
    if (phone) {
      phone.placeholder = '可留空，不会发送';
      safeText(phone.closest('.form-group')?.querySelector('label'), '回访编号（选填）');
    }
  }

  function appendEndingChoice() {
    const content = q('#archive-content');
    if (!content || q('.jmx-ending-box', content)) return;
    const box = document.createElement('div');
    box.className = 'jmx-ending-box';
    box.innerHTML = '<h4>证据处理决定</h4><p>真相已经明确，但公开方式会影响受害者隐私与证据效力。该选择不改变核心真相，只展示不同后续。</p><div class="jmx-ending-actions"><button type="button" data-ending="preserve">先保全证据，再联系警方</button><button type="button" data-ending="publish">立即公开全部档案</button></div><div class="jmx-ending-result" id="jmx-ending-result"></div>';
    content.appendChild(box);
    qa('button[data-ending]', box).forEach(button => button.onclick = () => chooseEnding(button.dataset.ending));
    if (state.ending) chooseEnding(state.ending, false);
  }

  function chooseEnding(kind, save = true) {
    const result = q('#jmx-ending-result');
    if (!result) return;
    state.ending = kind;
    if (save) saveState();
    result.classList.add('show');
    result.innerHTML = kind === 'preserve'
      ? '<b>结局：证据链</b><br>你制作只读副本、记录网页时间戳并联系魏警官。公开被延后，但关键证据和患者隐私得到保护，调查进入正式程序。'
      : '<b>结局：公开风暴</b><br>你立即发布全部资料，中心受到舆论追问；与此同时，未经处理的病例内容造成二次伤害，部分证据真实性也遭到质疑。';
  }

  function contentNote() {
    if (q('.jmx-content-note')) return;
    const footer = q('footer');
    if (!footer) return;
    const note = document.createElement('div');
    note.className = 'jmx-content-note';
    note.textContent = '内容说明：本作中的机构与事件均属虚构。剧情中的违法记忆实验不代表现实心理咨询、心理治疗或催眠实践；现实中需要帮助时，应咨询正规专业机构。';
    footer.insertAdjacentElement('beforebegin', note);
  }

  function imageFallbacks() {
    qa('img').forEach(image => image.addEventListener('error', () => {
      image.style.visibility = 'hidden';
      image.parentElement?.classList.add('jmx-img-fallback');
    }, { once: true }));
  }

  function miscFixes() {
    const modal = q('#clue-modal');
    if (modal) modal.addEventListener('click', event => {
      if (event.target === modal) window.closeClueModal?.();
    });
    qa('footer a[href="#"]').forEach(anchor => {
      if (!anchor.getAttribute('onclick')) anchor.onclick = event => event.preventDefault();
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        closeDrawer();
        closeEvidenceModal();
        q('#clue-modal')?.classList.remove('active');
      }
    });
    const big = q('#big-search');
    if (big) big.addEventListener('keydown', event => {
      if (event.key === 'Enter') {
        event.preventDefault();
        window.doSearch(big.value);
      }
    });
  }

  function restore() {
    syncGameState();
    if (state.archiveUnlocked) {
      const gate = q('#archive-gate');
      const content = q('#archive-content');
      if (gate) gate.style.display = 'none';
      content?.classList.add('active');
      appendEndingChoice();
    }
    if (state.page && q(`#page-${state.page}`)) {
      setTimeout(() => window.showPage(state.page), 0);
    }
  }

  function init() {
    installExtraStyles();
    buildTools();
    mobileMenu();
    patchPrices();
    patchRedactions();
    patchHotspot();
    installEvidencePanels();
    enhanceArchive();
    enhanceSearchPage();
    bookingPrivacy();
    contentNote();
    imageFallbacks();
    miscFixes();
    restore();
    renderEvidenceLaunches();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
