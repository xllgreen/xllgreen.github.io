(function () {
  'use strict';

  const TOTAL_CLUES = 23;
  const TOTAL_EGGS = 10;
  const SAVE_KEY = '_songtao_grainstation_save_v1';
  const SECTOR_ORDER = ['9', '7', '0', '3', '1', '2'];
  const FRAGMENT_ANSWER = ['二季度', '粮款', '盘点', '库存', '实收', '差额', '120万'];
  const FAKE_INVOICES = ['ST9704018', 'ST9705031', 'ST9706044'];
  const SMEAR_VALUES = { a: '1,120,000', b: '-730,000', c: '650,000' };
  const TIMELINE_ANSWER = ['wage', 'hospital', 'trip', 'report', 'stocktake', 'missing'];

  const partitionNames = {
    C: 'C: 系统与日常文件',
    D: 'D: 账务与票据档案',
    E: 'E: 人事与往来文件',
    F: 'F: 加密私密分区',
    H: '隐藏扇区：真相与结局'
  };

  const timelineEvents = {
    wage: { date: '3月5日', text: '首次停发工资，值班人数减半' },
    hospital: { date: '4月22日', text: '医院催缴尘肺病治疗费' },
    trip: { date: '6月24日', text: '王厚德外出核对粮商底单' },
    report: { date: '6月29日', text: '举报信寄出，上级准备突击查账' },
    stocktake: { date: '7月1日 上午', text: '季度盘点发现账面亏空' },
    missing: { date: '7月1日 夜', text: '站长失联，办公室抽屉清空' }
  };

  const clueDefs = {
    system_access: ['硬盘修复完成', '坏道扇区按 HDS-LZ-970312 顺序修复，系统仅恢复出四个可用分区。', 'C'],
    sys_log: ['异常删除日志', '盘点表在 1997-07-01 夜间被删除并覆写，说明有人在案发当天处理痕迹。', 'C'],
    memo: ['D 盘密码线索', '备忘录写着“发不出工资的那个月”，并提到张副站长多次来过财务室。', 'C'],
    duty_roster: ['三月停发工资', '值班表显示 1997 年 3 月在岗人数骤降到 23 人，第一次停发工资发生在 3 月。', 'C'],
    restored_q2: ['二季度盘点表', '回收站碎片还原后确认账面与库存折价差额为 120 万。', 'C'],
    wage_month: ['D 盘口令：03', '工资停发月份与 D 盘口令吻合，说明口令由粮站内部人员设置。', 'C'],
    fake_invoices: ['三张伪造发票', 'ST-9704-018、ST-9705-031、ST-9706-044 的编号、公章和水印规则均异常。', 'D'],
    zhang_ledger: ['张副站长私人账', '私人账记录显示张副站长私卖陈粮、伪造损耗，并准备将亏空推给王厚德。', 'D'],
    ledger_smears: ['涂改数字显色', '荧光显色还原了实际收购款、异常销售回款与医院垫付转账。', 'D'],
    hospital_transfer: ['65 万医院转账', '实际亏空 185 万，其中 65 万被转入县人民医院，用于尘肺病职工押金与药费。', 'D'],
    zhou_case: ['老周诊断证明', '老周尘肺三期，每月药费接近一个普通职工半月工资。', 'E'],
    lin_case: ['林秀莲垫付记录', '食堂负责人林秀莲多次为困难职工家属垫付伙食。', 'E'],
    workers_case: ['12 名职工同批发病', '人事档案显示多人因仓库粉尘暴露患病，工伤款长期未批。', 'E'],
    iodine_letter: ['给医院的密写信', '碘酒显影后可见王厚德请求医院先给职工垫药费，并由其个人担保。', 'E'],
    timeline: ['案发前后时间线', '王厚德在亏空曝光前一周已知账目问题，却持续联系医院、工会和职工家属。', 'E'],
    f_password: ['女儿高考日', '王厚德最对不起女儿的那天是 1997 年 7 月 7 日，高考第一天。', 'F'],
    diary: ['私人日记摘页', '日记显示王厚德明知张副站长已失控，却仍把职工医药费放在第一位。', 'F'],
    donation: ['匿名捐款凭证', '王厚德将个人积蓄匿名捐给县总工会医疗救助。', 'F'],
    audio_transcript: ['争吵录音转录', '录音证实王厚德要求张副站长把钱全留给工人，自己承担罪名。', 'F'],
    hidden_sector: ['隐藏扇区入口', '未分配空间中残留了一组隐藏扇区，包含未发出的自首书和给女儿的信。', 'H'],
    confession: ['未发出的自首书', '王厚德愿担法律后果，但请求先保障职工遣散费和医疗救助款。', 'H'],
    daughter_letter: ['给王晓燕的信', '王厚德把真相藏进硬盘，希望女儿长大后仍能相信有人值得被救。', 'H'],
    court_thanks: ['判决与感谢信', '判决未认定王厚德个人非法占有粮款，2005 年职工联名为他写感谢信。', 'H']
  };

  const hints = {
    fragments: [
      '先拼文件标题，再拼表格字段。',
      '“二季度粮款盘点”是标题，后面接“库存、实收、差额”。',
      '正确顺序：二季度 / 粮款 / 盘点 / 库存 / 实收 / 差额 / 120万。'
    ],
    dpass: [
      '备忘录说密码是“发不出工资的那个月”。',
      '值班表里哪一个月人数突然减半？',
      '第一次停发工资是 1997 年 3 月，输入 03。'
    ],
    invoices: [
      '先看编号是否连续，再看红章是否压线。',
      '假发票还会暴露在水印方向和字距上。',
      '选择 ST-9704-018、ST-9705-031、ST-9706-044。'
    ],
    shortage: [
      '必须先选择“荧光显色”，点击三处涂改区域。',
      '显色后会出现三个关键数字：1,120,000、-730,000、650,000。',
      '实际总亏空是 1850000，也可输入 185万。'
    ],
    timeline: [
      '先排长期困境，再排案发前一周的动作。',
      '停发工资早于医院催费；查粮商早于举报信。',
      '正确顺序：停发工资 → 医院催费 → 站长出差 → 举报信寄出 → 盘点亏空 → 站长失联。'
    ],
    fpass: [
      '“最对不起女儿的那天”和高考有关。',
      '日记与信件都指向 1997 年高考第一天。',
      '输入 0707。'
    ],
    audio: [
      '不是把噪声降到最低，而是留一点底噪让人声边缘保真。',
      '降噪强度太高会吞掉辅音，人声增益太低听不清。',
      '把降噪调到 20-30，增益调到 75-85 左右。'
    ],
    truth: [
      '谁承担了名义上的罪？',
      '他承担罪名的目的不是自保，而是给职工家庭争取缓冲。',
      '答案：王厚德 / 保住职工生计 / 自首揽责。'
    ]
  };

  function defaultState() {
    return {
      repaired: false,
      sectorSequence: [],
      unlockedPartitions: ['C'],
      currentPartition: 'C',
      activeTool: 'magnifier',
      clues: {},
      puzzles: {},
      eggs: {},
      hintsUsed: {},
      fragmentSlots: Array(7).fill(''),
      selectedInvoices: [],
      revealedSmears: [],
      timelineOrder: ['stocktake', 'hospital', 'missing', 'wage', 'trip', 'report'],
      selectedTimelineIndex: -1,
      fUnlocked: false,
      hiddenUnlocked: false,
      truth: { person: '', reason: '', choice: '' },
      focusedTruthSlot: 'person',
      endingType: '',
      paywallShown: false,
      recycleClicks: 0,
      lastSaved: 0
    };
  }

  function cloneDefaultMerge(saved) {
    const base = defaultState();
    const state = Object.assign(base, saved || {});
    state.unlockedPartitions = Array.isArray(state.unlockedPartitions) ? state.unlockedPartitions : ['C'];
    state.sectorSequence = Array.isArray(state.sectorSequence) ? state.sectorSequence : [];
    state.fragmentSlots = Array.isArray(state.fragmentSlots) && state.fragmentSlots.length === 7 ? state.fragmentSlots : Array(7).fill('');
    state.selectedInvoices = Array.isArray(state.selectedInvoices) ? state.selectedInvoices : [];
    state.revealedSmears = Array.isArray(state.revealedSmears) ? state.revealedSmears : [];
    state.timelineOrder = Array.isArray(state.timelineOrder) && state.timelineOrder.length === 6 ? state.timelineOrder : base.timelineOrder;
    state.truth = Object.assign({ person: '', reason: '', choice: '' }, state.truth || {});
    state.clues = state.clues || {};
    state.puzzles = state.puzzles || {};
    state.eggs = state.eggs || {};
    state.hintsUsed = state.hintsUsed || {};
    return state;
  }

  const Game = {
    state: defaultState(),
    selectedFragment: '',
    draggedFragment: '',
    draggedTimelineIndex: -1,

    init() {
      this.load();
      this.attachGlobalEvents();
      this.attachFragmentDrag();
      this.updateFakeClock();
      this.renderAll();
      if (this.state.repaired) {
        setTimeout(() => AudioSys && AudioSys.startAmbience(), 250);
      }
      setInterval(() => this.updateFooterClock(), 1000);
      setTimeout(() => this.triggerBadSectorPopup(), 30 * 60 * 1000);
      console.log('%c松涛粮站硬盘修复档案 v1.0', 'color:#91f0a4;font-size:14px;font-weight:bold;');
    },

    load() {
      try {
        const raw = localStorage.getItem(SAVE_KEY);
        this.state = cloneDefaultMerge(raw ? JSON.parse(raw) : null);
      } catch (error) {
        console.warn('读档失败', error);
        this.state = defaultState();
      }
    },

    save() {
      this.state.lastSaved = Date.now();
      try {
        localStorage.setItem(SAVE_KEY, JSON.stringify(this.state));
      } catch (error) {
        console.warn('存档失败', error);
      }
      const indicator = document.getElementById('save-indicator');
      if (indicator) indicator.textContent = '自动保存：' + new Date().toLocaleTimeString('zh-CN', { hour12: false });
    },

    clearSave() {
      localStorage.removeItem(SAVE_KEY);
    },

    attachGlobalEvents() {
      document.addEventListener('keydown', (event) => {
        if (event.key === 'F2') {
          event.preventDefault();
          this.showBIOS();
        }
        if (event.ctrlKey && (event.key || '').toLowerCase() === 'f') {
          event.preventDefault();
          this.openSearch();
        }
        if (event.ctrlKey && event.altKey && (event.key === 'Delete' || event.code === 'Delete')) {
          event.preventDefault();
          this.showTaskManager();
        }
      });

      document.addEventListener('click', (event) => {
        const menu = document.getElementById('context-menu');
        if (menu && !menu.contains(event.target)) menu.classList.add('hidden');
      });
    },

    attachFragmentDrag() {
      document.querySelectorAll('#fragment-bank button').forEach((btn) => {
        btn.addEventListener('dragstart', (event) => {
          if (btn.classList.contains('used')) {
            event.preventDefault();
            return;
          }
          this.draggedFragment = btn.dataset.frag;
          event.dataTransfer.setData('text/plain', btn.dataset.frag);
        });
      });

      document.querySelectorAll('#fragment-slots button').forEach((slot) => {
        slot.addEventListener('dragover', (event) => event.preventDefault());
        slot.addEventListener('drop', (event) => {
          event.preventDefault();
          const word = event.dataTransfer.getData('text/plain') || this.draggedFragment;
          if (word) this.placeFragment(slot, word);
        });
      });
    },

    attachTimelineDrag() {
      const list = document.getElementById('timeline-list');
      if (!list) return;
      list.querySelectorAll('[data-event]').forEach((item, index) => {
        item.addEventListener('click', () => {
          this.state.selectedTimelineIndex = index;
          this.renderTimeline();
          this.save();
        });
        item.addEventListener('dragstart', (event) => {
          this.draggedTimelineIndex = index;
          event.dataTransfer.setData('text/plain', String(index));
        });
        item.addEventListener('dragover', (event) => event.preventDefault());
        item.addEventListener('drop', (event) => {
          event.preventDefault();
          const from = Number(event.dataTransfer.getData('text/plain'));
          const to = index;
          if (Number.isInteger(from)) this.moveTimeline(from, to);
        });
      });
    },

    renderAll() {
      document.getElementById('boot-stage').classList.toggle('hidden', this.state.repaired);
      document.getElementById('game-stage').classList.toggle('hidden', !this.state.repaired);
      this.renderSectors();
      this.renderPartitions();
      this.renderFragments();
      this.renderInvoices();
      this.renderSmears();
      this.renderTimeline();
      this.renderPuzzles();
      this.renderTruth();
      this.updateCluePanel();
      this.updateProgress();
      this.updateToolUI();
      this.updateAudioMeters();
      this.updateFooterClock();
    },

    renderSectors() {
      document.querySelectorAll('.sector').forEach((btn) => {
        btn.classList.toggle('done', this.state.sectorSequence.includes(btn.dataset.sector));
      });
      const progress = document.getElementById('sector-progress');
      if (progress) progress.textContent = this.state.sectorSequence.length + '/6';
    },

    clickSector(btn) {
      if (this.state.repaired) return;
      const value = btn.dataset.sector;
      const expected = SECTOR_ORDER[this.state.sectorSequence.length];
      if (value !== expected || this.state.sectorSequence.includes(value)) {
        this.state.sectorSequence = [];
        document.querySelectorAll('.sector').forEach((sector) => {
          sector.classList.remove('done');
          sector.classList.add('wrong');
          setTimeout(() => sector.classList.remove('wrong'), 360);
        });
        this.logRepair('寻道顺序错误，坏道映射已重置。');
        this.play('playError');
        this.save();
        this.renderSectors();
        return;
      }
      this.state.sectorSequence.push(value);
      this.logRepair('扇区 BAD-0' + value + ' 已重映射。');
      this.play('playClick');
      this.save();
      this.renderSectors();
    },

    submitRepair() {
      const input = (document.getElementById('serial-input').value || '').replace(/\D/g, '');
      const sequence = this.state.sectorSequence.join('');
      if (sequence !== SECTOR_ORDER.join('')) {
        this.toast('请先按贴纸顺序修复 6 个坏扇区。', 'error');
        this.play('playError');
        return;
      }
      if (input !== '970312') {
        this.toast('编号校验失败。硬盘贴纸后 6 位是 970312。', 'error');
        this.play('playError');
        return;
      }
      this.state.repaired = true;
      this.state.puzzles.repair = true;
      this.addClue('system_access', null, null, null, true);
      this.save();
      this.play('playUnlock');
      this.renderAll();
      AudioSys && AudioSys.startAmbience();
      this.toast('硬盘修复完成，C: 分区已挂载。', 'success');
      if (!this.state.paywallShown) {
        this.state.paywallShown = true;
        this.save();
        setTimeout(() => this.showSupport(true), 800);
      }
    },

    logRepair(message) {
      const log = document.getElementById('repair-status');
      if (!log) return;
      const line = document.createElement('div');
      line.textContent = '> ' + message;
      log.appendChild(line);
      log.scrollTop = log.scrollHeight;
    },

    renderPartitions() {
      if (!this.state.unlockedPartitions.includes(this.state.currentPartition)) {
        this.state.currentPartition = 'C';
      }
      document.querySelectorAll('.partition-tab').forEach((tab) => {
        const p = tab.dataset.partition;
        tab.classList.toggle('locked', !this.state.unlockedPartitions.includes(p));
        tab.classList.toggle('active', this.state.currentPartition === p);
      });
      document.querySelectorAll('.partition-page').forEach((page) => {
        page.classList.toggle('active', page.dataset.partitionPage === this.state.currentPartition);
      });
      const title = document.getElementById('partition-title');
      if (title) title.textContent = partitionNames[this.state.currentPartition] || '';
      const footer = document.getElementById('footer-partition');
      if (footer) footer.textContent = partitionNames[this.state.currentPartition] || '';
    },

    goPartition(partition) {
      if (!this.state.unlockedPartitions.includes(partition)) {
        this.toast('该分区尚未解锁。', 'error');
        this.play('playError');
        return;
      }
      this.state.currentPartition = partition;
      this.save();
      this.renderPartitions();
      this.play('playClick');
    },

    unlockPartition(partition) {
      if (!this.state.unlockedPartitions.includes(partition)) {
        this.state.unlockedPartitions.push(partition);
        this.save();
        this.toast('分区 ' + partition + ': 已解锁。', 'success');
        this.play('playUnlock');
      }
      this.renderPartitions();
    },

    setTool(tool) {
      this.state.activeTool = tool;
      this.save();
      this.updateToolUI();
      this.play('playClick');
    },

    updateToolUI() {
      const names = {
        magnifier: '放大镜',
        highlighter: '荧光显色',
        iodine: '碘酒显影',
        denoise: '降噪器'
      };
      document.querySelectorAll('.ribbon-tool[data-tool]').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.tool === this.state.activeTool);
      });
      const status = document.getElementById('tool-status');
      if (status) status.textContent = '当前工具：' + (names[this.state.activeTool] || '放大镜');
    },

    collectFile(id) {
      this.addClue(id);
    },

    addClue(id, title, desc, partition, silent) {
      const def = clueDefs[id];
      if (!def && !title) return;
      if (this.state.clues[id]) {
        if (!silent) this.toast('该线索已经记录。', 'info');
        return;
      }
      this.state.clues[id] = {
        title: title || def[0],
        desc: desc || def[1],
        partition: partition || def[2] || this.state.currentPartition,
        at: Date.now()
      };
      this.save();
      this.updateCluePanel();
      this.updateProgress();
      if (!silent) {
        this.toast('新线索：' + this.state.clues[id].title, 'success');
        this.play('playClue');
      }
    },

    getClueCount() {
      return Object.keys(this.state.clues).length;
    },

    getCluePercent() {
      return Math.min(100, Math.round((this.getClueCount() / TOTAL_CLUES) * 100));
    },

    getEggCount() {
      return Object.keys(this.state.eggs).length;
    },

    updateProgress() {
      const count = this.getClueCount();
      const percent = this.getCluePercent();
      const counter = document.getElementById('clue-counter');
      const bar = document.getElementById('progress-bar');
      const text = document.getElementById('progress-text');
      if (counter) counter.textContent = count + '/' + TOTAL_CLUES;
      if (bar) bar.style.width = percent + '%';
      if (text) text.textContent = percent + '%';
    },

    updateCluePanel() {
      const list = document.getElementById('clue-list');
      if (!list) return;
      const clues = Object.entries(this.state.clues);
      if (!clues.length) {
        list.innerHTML = '<div class="clue-item"><div class="clue-title">暂无线索</div><div class="clue-desc">打开文件、完成谜题或触发隐藏内容后会记录在这里。</div></div>';
        return;
      }
      list.innerHTML = clues
        .sort((a, b) => a[1].at - b[1].at)
        .map(([id, clue]) => `
          <div class="clue-item" data-clue="${id}">
            <div class="clue-title">${this.escape(clue.title)}</div>
            <div class="clue-desc">${this.escape(clue.desc)}</div>
          </div>
        `).join('');
    },

    toggleCluePanel() {
      document.getElementById('clue-panel').classList.toggle('open');
      this.play('playClick');
    },

    renderFragments() {
      const slots = document.querySelectorAll('#fragment-slots button');
      slots.forEach((slot, index) => {
        const value = this.state.fragmentSlots[index] || '';
        slot.dataset.value = value;
        slot.textContent = value || '?';
        slot.classList.toggle('filled', !!value);
      });
      document.querySelectorAll('#fragment-bank button').forEach((btn) => {
        const used = this.state.fragmentSlots.includes(btn.dataset.frag);
        btn.classList.toggle('used', used);
        btn.classList.toggle('selected', this.selectedFragment === btn.dataset.frag);
      });
    },

    pickFragment(btn) {
      if (this.state.puzzles.fragments || btn.classList.contains('used')) return;
      this.selectedFragment = btn.dataset.frag;
      this.renderFragments();
      this.play('playClick');
    },

    placeFragment(slot, forcedWord) {
      if (this.state.puzzles.fragments) return;
      const word = forcedWord || this.selectedFragment;
      if (!word || this.state.fragmentSlots.includes(word)) return;
      const index = Number(slot.dataset.slot);
      if (!Number.isInteger(index)) return;
      this.state.fragmentSlots[index] = word;
      this.selectedFragment = '';
      this.save();
      this.renderFragments();
      this.play('playClick');
    },

    resetFragments() {
      this.state.fragmentSlots = Array(7).fill('');
      this.selectedFragment = '';
      this.save();
      this.renderFragments();
    },

    checkFragments() {
      if (this.state.fragmentSlots.join('|') !== FRAGMENT_ANSWER.join('|')) {
        this.toast('碎片顺序还不对，文件头和字段顺序再核一遍。', 'error');
        this.play('playError');
        return;
      }
      this.state.puzzles.fragments = true;
      this.addClue('restored_q2');
      this.save();
      this.renderPuzzles();
      this.toast('盘点表还原成功。', 'success');
    },

    checkDPassword() {
      const value = (document.getElementById('d-password').value || '').trim().replace(/\D/g, '');
      if (['03', '3', '199703'].includes(value)) {
        this.state.puzzles.dpass = true;
        this.addClue('wage_month');
        this.unlockPartition('D');
        this.state.currentPartition = 'D';
        this.save();
        this.renderAll();
      } else {
        this.toast('口令不正确。注意“月份”应为两位数。', 'error');
        this.play('playError');
      }
    },

    toggleInvoice(btn) {
      if (this.state.puzzles.invoices) return;
      const id = btn.dataset.invoice;
      const selected = new Set(this.state.selectedInvoices);
      if (selected.has(id)) selected.delete(id);
      else selected.add(id);
      this.state.selectedInvoices = Array.from(selected);
      this.save();
      this.renderInvoices();
      this.play('playClick');
    },

    renderInvoices() {
      document.querySelectorAll('#invoice-grid button').forEach((btn) => {
        btn.classList.toggle('selected', this.state.selectedInvoices.includes(btn.dataset.invoice));
      });
    },

    checkInvoices() {
      const picked = this.state.selectedInvoices.slice().sort().join('|');
      const answer = FAKE_INVOICES.slice().sort().join('|');
      if (picked !== answer) {
        this.toast('可疑票据组合不正确。假票一定同时违反至少两条规则。', 'error');
        this.play('playError');
        return;
      }
      this.state.puzzles.invoices = true;
      this.addClue('fake_invoices');
      this.save();
      this.renderPuzzles();
      this.toast('票据验真完成，隐藏账簿已恢复。', 'success');
    },

    revealSmear(elem) {
      if (this.state.activeTool !== 'highlighter') {
        this.toast('需要先在工具栏选择“荧光显色”。', 'info');
        return;
      }
      const id = elem.dataset.smear;
      if (!this.state.revealedSmears.includes(id)) {
        this.state.revealedSmears.push(id);
        this.save();
      }
      if (this.state.revealedSmears.length >= 3) {
        this.addClue('ledger_smears');
      }
      this.renderSmears();
      this.play('playClue');
    },

    renderSmears() {
      document.querySelectorAll('.smear').forEach((elem) => {
        const id = elem.dataset.smear;
        const revealed = this.state.revealedSmears.includes(id) || this.state.puzzles.shortage;
        elem.classList.toggle('revealed', revealed);
        elem.textContent = revealed ? SMEAR_VALUES[id] : '涂改';
      });
    },

    checkShortage() {
      if (this.state.revealedSmears.length < 3) {
        this.toast('还有涂改区域没有显色。', 'error');
        this.play('playError');
        return;
      }
      const raw = (document.getElementById('shortage-input').value || '').trim();
      const normalized = raw.replace(/[,\s元￥]/g, '');
      const correct = normalized === '1850000' || normalized === '185万' || normalized === '185';
      if (!correct) {
        this.toast('金额核对失败。显色记录指向 185 万实际亏空。', 'error');
        this.play('playError');
        return;
      }
      this.state.puzzles.shortage = true;
      this.addClue('hospital_transfer');
      this.unlockPartition('E');
      this.state.currentPartition = 'E';
      this.save();
      this.renderAll();
      this.toast('资金流向确认，E: 人事往来分区已解锁。', 'success');
    },

    revealIodineLetter() {
      if (this.state.activeTool !== 'iodine') {
        this.toast('需要先在工具栏选择“碘酒显影”。', 'info');
        return;
      }
      this.state.puzzles.iodine = true;
      this.addClue('iodine_letter');
      this.save();
      this.renderPuzzles();
      this.play('playClue');
    },

    renderTimeline() {
      const list = document.getElementById('timeline-list');
      if (!list) return;
      list.innerHTML = this.state.timelineOrder.map((id, index) => {
        const ev = timelineEvents[id];
        const selected = this.state.selectedTimelineIndex === index ? ' selected' : '';
        return `<div draggable="true" class="${selected}" data-event="${id}"><span>${ev.date}</span>${ev.text}</div>`;
      }).join('');
      this.attachTimelineDrag();
    },

    moveTimeline(from, to) {
      if (from === to || from < 0 || to < 0) return;
      const order = this.state.timelineOrder;
      const [item] = order.splice(from, 1);
      order.splice(to, 0, item);
      this.state.selectedTimelineIndex = to;
      this.save();
      this.renderTimeline();
      this.play('playClick');
    },

    nudgeTimeline(direction) {
      const index = this.state.selectedTimelineIndex;
      if (index < 0) {
        this.toast('先点击选中一个时间节点。', 'info');
        return;
      }
      const target = index + direction;
      if (target < 0 || target >= this.state.timelineOrder.length) return;
      this.moveTimeline(index, target);
    },

    checkTimeline() {
      if (!this.state.puzzles.iodine) {
        this.toast('先把空白信显影，时间线才有完整语境。', 'info');
        return;
      }
      if (this.state.timelineOrder.join('|') !== TIMELINE_ANSWER.join('|')) {
        this.toast('时间线仍有矛盾：举报信应在盘点亏空曝光前寄出。', 'error');
        this.play('playError');
        return;
      }
      this.state.puzzles.timeline = true;
      this.addClue('timeline');
      this.unlockPartition('F');
      this.state.currentPartition = 'F';
      this.save();
      this.renderAll();
      this.toast('时间线闭合，F: 私密分区可尝试解密。', 'success');
    },

    checkFPassword() {
      const value = (document.getElementById('f-password').value || '').trim().replace(/\D/g, '');
      if (value === '0707' || value === '19970707') {
        this.state.fUnlocked = true;
        this.state.puzzles.fpass = true;
        this.addClue('f_password');
        this.save();
        this.renderPuzzles();
        this.toast('F: 分区解密完成。', 'success');
        this.play('playUnlock');
      } else {
        this.toast('密码错误。那一天和王晓燕有关。', 'error');
        this.play('playError');
      }
    },

    updateAudioMeters() {
      const noise = Number((document.getElementById('noise-slider') || {}).value || 55);
      const voice = Number((document.getElementById('voice-slider') || {}).value || 45);
      const meter = document.getElementById('audio-meter');
      if (!meter) return;
      const good = this.isAudioReadable();
      meter.classList.toggle('good', good);
      meter.textContent = good ? '信噪比：可转录 / 人声边缘清晰' : '信噪比：不可读 / 当前 ' + noise + ' / ' + voice;
    },

    isAudioReadable() {
      const noise = Number((document.getElementById('noise-slider') || {}).value || 55);
      const voice = Number((document.getElementById('voice-slider') || {}).value || 45);
      return noise >= 18 && noise <= 34 && voice >= 70 && voice <= 90;
    },

    checkAudio() {
      if (!this.isAudioReadable()) {
        this.toast('转录失败：噪声和人声比例仍不稳定。', 'error');
        this.play('playError');
        return;
      }
      this.state.puzzles.audio = true;
      this.addClue('audio_transcript');
      this.save();
      this.renderPuzzles();
      this.play('playDramatic');
      this.toast('录音转录成功。右键未分配空间可查看隐藏扇区。', 'success');
    },

    renderPuzzles() {
      document.getElementById('restored-ledger')?.classList.toggle('hidden', !this.state.puzzles.fragments);
      document.getElementById('private-ledger')?.classList.toggle('hidden', !this.state.puzzles.invoices);
      document.getElementById('hospital-transfer')?.classList.toggle('hidden', !this.state.puzzles.shortage);
      document.getElementById('timeline-result')?.classList.toggle('hidden', !this.state.puzzles.timeline);
      document.getElementById('invisible-letter')?.classList.toggle('revealed', !!this.state.puzzles.iodine);
      document.getElementById('f-lock')?.classList.toggle('hidden', !!this.state.fUnlocked);
      document.getElementById('f-content')?.classList.toggle('hidden', !this.state.fUnlocked);
      document.getElementById('audio-transcript')?.classList.toggle('hidden', !this.state.puzzles.audio);
      this.renderSmears();
      if (this.state.hiddenUnlocked && !this.state.unlockedPartitions.includes('H')) {
        this.state.unlockedPartitions.push('H');
      }
      this.renderPartitions();
    },

    openHiddenByRightClick(event) {
      event.preventDefault();
      event.stopPropagation();
      this.tryOpenHidden();
    },

    tryOpenHidden() {
      if (!this.state.puzzles.audio) {
        this.toast('未分配空间响应很弱，先把损坏录音转录出来。', 'info');
        return;
      }
      if (this.getCluePercent() < 60) {
        this.toast('线索收集度不足 60%，隐藏扇区校验不通过。', 'info');
        return;
      }
      this.state.hiddenUnlocked = true;
      this.addClue('hidden_sector');
      this.unlockPartition('H');
      this.state.currentPartition = 'H';
      this.save();
      this.renderAll();
      this.toast('隐藏扇区 0x0717 已挂载。', 'success');
    },

    focusTruthSlot(slot) {
      this.state.focusedTruthSlot = slot;
      this.save();
      this.renderTruth();
    },

    placeTruth(value) {
      const slot = this.state.focusedTruthSlot || 'person';
      this.state.truth[slot] = value;
      const order = ['person', 'reason', 'choice'];
      const next = order[Math.min(order.indexOf(slot) + 1, order.length - 1)];
      this.state.focusedTruthSlot = next;
      this.save();
      this.renderTruth();
      this.play('playClick');
    },

    renderTruth() {
      document.querySelectorAll('.truth-blank').forEach((btn) => {
        const slot = btn.dataset.slot;
        btn.textContent = this.state.truth[slot] || '____';
        btn.classList.toggle('focused', this.state.focusedTruthSlot === slot);
      });
    },

    submitTruth() {
      const truth = this.state.truth;
      const correct = truth.person === '王厚德' && truth.reason === '保住职工生计' && truth.choice === '自首揽责';
      let type = 'normal';
      if (correct && this.getCluePercent() >= 50) {
        type = 'true';
      }
      if (correct && this.getClueCount() >= TOTAL_CLUES && this.getEggCount() >= 8) {
        type = 'perfect';
      }
      this.state.puzzles.truth = correct;
      this.state.endingType = type;
      this.save();
      this.showEnding(type);
    },

    showEnding(type) {
      const existing = document.querySelector('.ending-screen');
      if (existing) existing.remove();

      const endings = {
        normal: {
          title: '普通结局：疑案重启',
          body: `
            <p>修复报告仅能确认张副站长存在伪造票据与栽赃嫌疑。王厚德是否携款潜逃，仍被写作“去向不明”。</p>
            <p>档案馆决定将粮站案重新整理入库。硬盘关闭前，系统日志停在 1997 年 7 月 7 日。</p>
          `,
          quote: '有些真相不是没人看见，是没人把碎片拼到最后。'
        },
        true: {
          title: '真相结局：他把自己交了出去',
          body: `
            <p>完整证据链显示：张副站长私卖陈粮、伪造票据并栽赃王厚德；王厚德早知失控，却选择揽责，为职工争取遣散费、医药费和最后的缓冲时间。</p>
            <p>2020 年，一张旧照片被补录进档案：一群头发花白的老人围着一家小粮油店，招牌写着“厚德粮油”。</p>
          `,
          quote: '他失去了名誉和前程，却让许多人有了继续生活的时间。'
        },
        perfect: {
          title: '圆满结局：硬盘里留给女儿的答案',
          body: `
            <p>你找齐了关键线索和深层彩蛋。系统额外恢复出王晓燕的后续记录：她后来考上医科大学，成为呼吸科医生，长期参与尘肺病公益筛查。</p>
            <p>2005 年王厚德出狱那天，老周、林秀莲和当年的职工家属都去了车站。王晓燕没有喊“爸”，只把听诊器放进他的旧帆布包。</p>
            <p>硬盘最后写入一行很轻的字：如果清白来得太晚，至少别让善意也迟到。</p>
          `,
          quote: '他失去了名誉和前程，却换来了所有人的人生。'
        }
      };
      const data = endings[type] || endings.normal;
      const screen = document.createElement('div');
      screen.className = 'ending-screen';
      screen.innerHTML = `
        <div class="ending-card">
          <div class="ending-title">${data.title}</div>
          <div class="ending-content">
            ${data.body}
            <div class="ending-quote">${data.quote}</div>
            <p style="color:#91a68e;font-size:13px;margin-top:14px;">线索：${this.getClueCount()}/${TOTAL_CLUES}　彩蛋：${this.getEggCount()}/${TOTAL_EGGS}</p>
          </div>
          <div class="ending-actions">
            <button class="retro-btn" data-close-ending>继续查阅</button>
            <button class="retro-btn primary" data-support-ending>支持作者 1元</button>
          </div>
        </div>
      `;
      document.body.appendChild(screen);
      screen.querySelector('[data-close-ending]').addEventListener('click', () => screen.remove());
      screen.querySelector('[data-support-ending]').addEventListener('click', () => this.showSupport());
      this.play(type === 'normal' ? 'playDramatic' : 'playUnlock');
    },

    foundEgg(id, name) {
      if (this.state.eggs[id]) {
        this.toast('彩蛋已发现：' + name, 'info');
        return;
      }
      this.state.eggs[id] = { name, at: Date.now() };
      this.save();
      this.toast('发现彩蛋：' + name + '（' + this.getEggCount() + '/' + TOTAL_EGGS + '）', 'success');
      this.play('playClue');
    },

    openMinesweeper() {
      this.foundEgg('minesweeper', '损坏的扫雷.exe');
      this.showDialog('扫雷.exe', `
        <p>文件已损坏，无法运行。</p>
        <p style="color:#e6c56f;">错误代码：MINE_1997_BAD_SECTOR。窗口关闭前，你听见一声很轻的硬盘敲击。</p>
      `);
    },

    recycleClick() {
      this.state.recycleClicks += 1;
      this.save();
      if (this.state.recycleClicks < 5) {
        this.toast('回收站为空。' + this.state.recycleClicks + '/5', 'info');
        return;
      }
      this.foundEgg('deep_recycle', '已彻底删除的照片');
      this.showDialog('回收站 / 深层文件', `
        <div style="text-align:center;">
          <div style="font-size:56px;">🖼️</div>
          <p>恢复出一张王晓燕童年照。照片背面写着：</p>
          <p style="color:#e6c56f;font-family:var(--serif);">“爸爸永远以你为傲。”</p>
        </div>
      `);
    },

    showDustCard() {
      this.foundEgg('dust_card', '尘肺病科普卡片');
      this.showDialog('尘肺病科普卡片', `
        <p>90 年代部分粮站、矿区和仓储单位防尘条件不足，长期粉尘暴露会导致不可逆肺部纤维化。</p>
        <p>这张卡片被压在诊断证明角落，像是后来数字化时补上的说明。</p>
      `);
    },

    showEssayEgg() {
      this.foundEgg('essay', '王晓燕作文夹页');
      this.showDialog('高考模拟作文：《我的父亲》', `
        <p>“我父亲是粮站站长。他走路很快，说话很响，但每次路过卖梨的摊子都会停一下，因为我小时候爱吃梨。”</p>
        <p>作文写到一半停住了，下面只有一句被橡皮擦淡的字：他答应过高考那天送我。</p>
      `);
    },

    showSystemClockEgg() {
      const dates = ['1997-03-05', '1997-04-24', '1997-06-29', '1997-07-01', '1997-07-07'];
      const date = dates[Math.floor(Math.random() * dates.length)];
      document.getElementById('fake-clock').textContent = date;
      this.foundEgg('clock_jump', '系统时间跳动');
      if (date === '1997-07-01') {
        document.body.classList.add('black-white');
        this.showDialog('历史模式 / 1997-07-01', `
          <p>“今天香港回归，大喇叭播了一天国歌。可我知道，有些东西要变了。”</p>
          <p style="color:#91a68e;">界面短暂切换为黑白模式。</p>
        `, [{ text: '恢复显示', action: () => { document.body.classList.remove('black-white'); this.closeDialog(); } }]);
      }
    },

    updateFakeClock() {
      const clock = document.getElementById('fake-clock');
      if (clock) clock.textContent = '1997-07-01';
    },

    showBIOS() {
      this.foundEgg('bios', 'BIOS 隐藏界面');
      this.showDialog('PhoenixBIOS Setup Utility', `
        <table class="bios-table">
          <tr><td>Primary Master</td><td>ST3400A / 400MB</td></tr>
          <tr><td>Power-On Hours</td><td>004912</td></tr>
          <tr><td>Last Continuous Boot</td><td>1997-07-01 至 1997-07-13</td></tr>
          <tr><td>Remark</td><td>案发后仍连续开机 12 天，打印“补助签收表”。</td></tr>
        </table>
      `);
    },

    showTaskManager() {
      this.showDialog('复古任务管理器', `
        <table class="task-table">
          <tr><th>进程</th><th>状态</th><th>操作</th></tr>
          <tr><td>hdd_rescue.exe</td><td>运行中</td><td>-</td></tr>
          <tr><td>archive_viewer.exe</td><td>运行中</td><td>-</td></tr>
          <tr><td class="process-danger">thank_you.exe</td><td>隐藏</td><td><button class="retro-btn" id="end-thank-process">结束进程</button></td></tr>
        </table>
      `);
      setTimeout(() => {
        document.getElementById('end-thank-process')?.addEventListener('click', () => this.endThankProcess());
      }, 0);
    },

    endThankProcess() {
      this.closeDialog();
      this.foundEgg('thank_process', 'thank_you.exe');
      this.showDialog('2005 年职工联名感谢信', `
        <p>王站长：</p>
        <p>那年我们拿到的不是很多钱，但够老周多撑几年，够孩子们开学，够家里锅里有米。</p>
        <p>我们后来才知道你替我们背了什么。欠你的不是钱，是一句清白。</p>
        <p class="signature">松涛粮站十二名老职工　2005 年</p>
      `);
    },

    handleViewerContext(event) {
      if (!this.state.repaired) return;
      event.preventDefault();
      const menu = document.getElementById('context-menu');
      if (!menu) return;
      menu.style.left = Math.min(event.clientX, window.innerWidth - 170) + 'px';
      menu.style.top = Math.min(event.clientY, window.innerHeight - 130) + 'px';
      menu.classList.remove('hidden');
      this.play('playClick');
    },

    contextAction(action) {
      document.getElementById('context-menu')?.classList.add('hidden');
      if (action === 'sector') {
        this.tryOpenHidden();
        return;
      }
      if (action === 'hex') {
        this.foundEgg('hex_address', '十六进制密址');
        this.showDialog('十六进制查看器', `
          <p style="font-family:var(--mono);word-break:break-all;">00 57 48 44 2D 4C 5A ... 6C 69 6E 68 65 78 69 61 6E</p>
          <p>ASCII 尾注恢复：临河县向阳路17号 厚德粮油</p>
          <p style="color:#91a68e;">把地址输入系统搜索框，会有额外结果。</p>
        `);
        return;
      }
      this.showDialog('文件属性', `
        <p>文件系统：FAT16 / 最后写入：1997-07-13 02:16</p>
        <p>恢复状态：部分簇链断裂，存在人为删除痕迹。</p>
      `);
    },

    openSearch() {
      this.showDialog('系统搜索', `
        <p>输入关键词、地址或跨作品线索。</p>
        <div class="inline-form">
          <input id="search-input" class="retro-input" placeholder="例如 厚德粮油 / 潮汐福利院" autocomplete="off">
          <button class="retro-btn primary" id="search-submit">搜索</button>
        </div>
        <div id="search-result" style="margin-top:12px;"></div>
      `);
      setTimeout(() => {
        const input = document.getElementById('search-input');
        const btn = document.getElementById('search-submit');
        input?.focus();
        input?.addEventListener('keydown', (event) => {
          if (event.key === 'Enter') this.searchArchive();
        });
        btn?.addEventListener('click', () => this.searchArchive());
      }, 0);
    },

    searchArchive() {
      const input = (document.getElementById('search-input')?.value || '').trim();
      const result = document.getElementById('search-result');
      if (!result) return;
      if (!input) {
        result.innerHTML = '<p style="color:#d35b4d;">请输入搜索内容。</p>';
        return;
      }
      if (/厚德粮油|临河县|向阳路|17/.test(input)) {
        this.foundEgg('shop_address', '厚德粮油地址');
        result.innerHTML = `
          <div class="restored-box">
            <p><b>匹配结果：</b>2004-2020 工商登记：临河县向阳路17号，厚德粮油。</p>
            <p>备注：店主王某，经营范围粮油、杂货。每年 7 月第一周有多名外县老人到访。</p>
          </div>`;
        return;
      }
      if (/潮汐|福利院|采购/.test(input)) {
        this.foundEgg('series_tide', '潮汐福利院联动');
        result.innerHTML = `
          <div class="restored-box">
            <p><b>跨案索引：</b>1999 年潮汐福利院粮食采购记录中出现“松涛粮站陈米折价捐赠”。</p>
            <p>系统备注：同属“青槐市 90 年代封存档案”系列。</p>
          </div>`;
        return;
      }
      if (/育华|粮票|学校/.test(input)) {
        this.foundEgg('series_school', '育华中学联动');
        result.innerHTML = `
          <div class="restored-box">
            <p><b>跨案索引：</b>育华中学 1998 年困难生补助表夹有松涛粮站旧粮票。</p>
          </div>`;
        return;
      }
      if (/王晓燕|呼吸科|医科/.test(input)) {
        this.foundEgg('xiaoyan_record', '王晓燕后续记录');
        result.innerHTML = `
          <div class="restored-box">
            <p><b>匹配结果：</b>王晓燕，呼吸科医师，长期参与尘肺病公益筛查。</p>
            <p>记录权限：需圆满结局证据链才能写入最终报告。</p>
          </div>`;
        return;
      }
      result.innerHTML = '<p style="color:#91a68e;">未找到匹配结果。旧硬盘里，有些词要换一种问法。</p>';
    },

    showSupport(silentIfPaid) {
      if (typeof Paywall === 'undefined') return;
      if (Paywall.hasPaid()) {
        if (!silentIfPaid) this.toast('已记录你的支持，感谢！', 'success');
        return;
      }
      Paywall.show({
        qrCode: 'paycode.png',
        price: '1元',
        title: '支持《松涛粮站》',
        studio: 'abc studio'
      });
    },

    showHint(id) {
      const list = hints[id];
      if (!list) return;
      const used = this.state.hintsUsed[id] || 0;
      const index = Math.min(used, list.length - 1);
      this.state.hintsUsed[id] = Math.min(used + 1, list.length);
      this.save();
      this.showDialog('提示 ' + (index + 1) + '/' + list.length, `<p>${list[index]}</p>`);
    },

    confirmReset() {
      this.showDialog('重新开始', `
        <p>确定要清除《松涛粮站》的游戏进度并从硬盘修复重新开始吗？</p>
        <p style="color:#91a68e;">这不会清除你的 1 元支持记录。</p>
      `, [
        { text: '取消', action: () => this.closeDialog() },
        { text: '确定重开', primary: true, action: () => { this.clearSave(); window.location.reload(); } }
      ]);
    },

    triggerBadSectorPopup() {
      if (!this.state.repaired || this.state.eggs.bad_sector_popup) return;
      this.foundEgg('bad_sector_popup', '坏道扩散假警告');
      let countdown = 5;
      this.showDialog('系统警告', `
        <p style="color:#d35b4d;font-weight:bold;">检测到硬盘坏道扩散，即将强制关机。</p>
        <p>倒计时 <span id="bad-countdown">5</span> 秒。</p>
        <p style="color:#91a68e;">当然，这台 486 只是想吓你一下。</p>
      `, [{ text: '取消关机', primary: true, action: () => this.closeDialog() }]);
      const timer = setInterval(() => {
        countdown -= 1;
        const span = document.getElementById('bad-countdown');
        if (span) span.textContent = String(countdown);
        if (countdown <= 0 || !span) {
          clearInterval(timer);
          if (span) this.closeDialog();
        }
      }, 1000);
    },

    updateFooterClock() {
      const clock = document.getElementById('footer-clock');
      if (!clock) return;
      const now = new Date();
      clock.textContent = now.toLocaleString('zh-CN', { hour12: false });
    },

    showDialog(title, content, buttons) {
      this.closeDialog();
      const overlay = document.createElement('div');
      overlay.className = 'dialog-overlay';
      overlay.id = 'game-dialog';
      overlay.innerHTML = `
        <div class="dialog-box">
          <div class="dialog-title">${title}</div>
          <div class="dialog-content">${content}</div>
          <div class="dialog-actions"></div>
        </div>
      `;
      const actions = overlay.querySelector('.dialog-actions');
      const btns = buttons && buttons.length ? buttons : [{ text: '关闭', action: () => this.closeDialog() }];
      btns.forEach((btn) => {
        const button = document.createElement('button');
        button.className = 'retro-btn' + (btn.primary ? ' primary' : '');
        button.textContent = btn.text;
        button.addEventListener('click', btn.action || (() => this.closeDialog()));
        actions.appendChild(button);
      });
      document.body.appendChild(overlay);
      this.play('playClick');
    },

    closeDialog() {
      document.getElementById('game-dialog')?.remove();
    },

    toast(message, type) {
      const existing = document.querySelectorAll('.toast');
      existing.forEach((toast) => toast.remove());
      const toast = document.createElement('div');
      toast.className = 'toast ' + (type || 'info');
      toast.textContent = message;
      document.body.appendChild(toast);
      requestAnimationFrame(() => toast.classList.add('show'));
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 220);
      }, 2600);
    },

    play(method) {
      if (typeof AudioSys !== 'undefined' && AudioSys[method]) {
        AudioSys[method]();
      }
    },

    escape(value) {
      return String(value).replace(/[&<>"']/g, (char) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[char]));
    }
  };

  window.Game = Game;
  document.addEventListener('DOMContentLoaded', () => Game.init());
})();
