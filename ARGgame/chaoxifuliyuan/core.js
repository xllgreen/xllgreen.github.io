/**
 * 潮汐福利院：1999关停档案 - 核心游戏引擎
 * 负责：状态管理 / 线索系统 / 谜题验证 / 提示系统 / 进度存档 / UI辅助
 */

const Game = {
  SAVE_KEY: '_tide_orphanage_save',
  SAVE_VERSION: '1.0',

  // ========== 游戏状态 ==========
  state: {
    currentChapter: 1,        // 0=序章, 1-5=卷宗一至五
    unlockedChapters: [0, 1], // 已解锁的卷宗（序章+卷宗一默认解锁）
    clues: {},                // 已收集线索 {id: {title, desc, chapter}}
    puzzles: {},              // 已解谜题 {id: true}
    easterEggs: {},           // 已发现彩蛋 {id: true}
    doodles: {},              // 已发现涂鸦 {id: true}
    hintsUsed: {},            // 已使用提示 {puzzleId: level}
    truthBlanks: {},          // 真相填空 {slot: value}
    startTime: null,
    playTime: 0,
    endingType: null,
    archiveNumbers: ['CX001', 'CX037', 'CX124', 'CX256', 'CX419'],
    metaRevealed: false,      // 元反转：林慧的真相
  },

  // 线索总数（用于计算收集度）
  TOTAL_CLUES: 13,
  TOTAL_DOODLES: 5,
  TOTAL_EASTER_EGGS: 6,

  // ========== 存档系统 ==========
  save() {
    this.state.playTime = Date.now() - (this.state.startTime || Date.now());
    try {
      const data = {
        version: this.SAVE_VERSION,
        state: this.state,
        timestamp: Date.now()
      };
      localStorage.setItem(this.SAVE_KEY, JSON.stringify(data));
    } catch(e) {
      console.warn('存档失败:', e);
    }
  },

  load() {
    try {
      const raw = localStorage.getItem(this.SAVE_KEY);
      if (!raw) return false;
      const data = JSON.parse(raw);
      if (data.version !== this.SAVE_VERSION) return false;
      this.state = Object.assign(this.state, data.state);
      if (!this.state.startTime) this.state.startTime = Date.now();
      return true;
    } catch(e) {
      console.warn('读档失败:', e);
      return false;
    }
  },

  clearSave() {
    localStorage.removeItem(this.SAVE_KEY);
  },

  hasSave() {
    return !!localStorage.getItem(this.SAVE_KEY);
  },

  // ========== 卷宗管理 ==========
  unlockChapter(chapterId) {
    if (!this.state.unlockedChapters.includes(chapterId)) {
      this.state.unlockedChapters.push(chapterId);
      this.state.unlockedChapters.sort((a, b) => a - b);
      this.save();
      if (typeof AudioSys !== 'undefined') AudioSys.playUnlock();
      this.showToast('🔓 卷宗 ' + this.chapterName(chapterId) + ' 已解锁', 'success');
      this.updateChapterTabs();
    }
  },

  goToChapter(chapterId) {
    if (!this.state.unlockedChapters.includes(chapterId)) return;
    this.state.currentChapter = chapterId;
    this.save();

    // 切换标签页
    document.querySelectorAll('.archive-tab').forEach(tab => {
      tab.classList.toggle('active', parseInt(tab.dataset.chapter) === chapterId);
    });
    document.querySelectorAll('.archive-page').forEach(page => {
      page.classList.toggle('active', parseInt(page.dataset.chapter) === chapterId);
    });

    // 更新侧边栏
    document.querySelectorAll('.sidebar-item').forEach(item => {
      item.classList.toggle('active', parseInt(item.dataset.chapter) === chapterId);
    });

    // 更新状态栏
    this.updateStatusBar();
    if (typeof AudioSys !== 'undefined') AudioSys.playClick();
  },

  chapterName(id) {
    const names = ['序章·系统登录', '卷宗一·关停通报', '卷宗二·运营台账', '卷宗三·拆迁函件', '卷宗四·医疗记录', '卷宗五·机密真相'];
    return names[id] || '未知';
  },

  updateChapterTabs() {
    document.querySelectorAll('.archive-tab').forEach(tab => {
      const ch = parseInt(tab.dataset.chapter);
      if (this.state.unlockedChapters.includes(ch)) {
        tab.classList.remove('locked');
      } else {
        tab.classList.add('locked');
      }
    });
  },

  // ========== 谜题系统 ==========
  checkPuzzle(puzzleId, answer) {
    const answers = {
      'login_password': 'cx1987',
      'missing_child': '陈明',
      'outbreak_date': '1999.10.12',
      'procurement_anomaly': '1999.10.18',
      'journal_cipher': '假疫情拖时间',
      'newspaper_sort': '苏婉清挪用公款中饱私囊',
      'hidden_date': '0415',
      'music_cipher': '手术明',
      'drawer_password': '0415',
      'truth_puzzle': 'complete',
    };

    const expected = answers[puzzleId];
    if (!expected) return false;

    const userAnswer = String(answer).trim().toLowerCase();
    const correctAnswer = String(expected).trim().toLowerCase();

    if (userAnswer === correctAnswer) {
      this.solvePuzzle(puzzleId);
      return true;
    }

    // 特殊：missing_child 也接受"阿明"
    if (puzzleId === 'missing_child' && userAnswer === '阿明') {
      this.solvePuzzle(puzzleId);
      return true;
    }

    return false;
  },

  solvePuzzle(puzzleId) {
    if (this.state.puzzles[puzzleId]) return;
    this.state.puzzles[puzzleId] = true;
    this.save();

    if (typeof AudioSys !== 'undefined') AudioSys.playClue();
    this.showToast('✅ 谜题已解开！', 'success');

    // 触发对应的解锁逻辑
    this.onPuzzleSolved(puzzleId);
  },

  onPuzzleSolved(puzzleId) {
    // 各谜题解锁逻辑由 game.html 中的回调处理
    if (typeof onPuzzleSolved === 'function') {
      onPuzzleSolved(puzzleId);
    }
  },

  isPuzzleSolved(puzzleId) {
    return !!this.state.puzzles[puzzleId];
  },

  // ========== 线索系统 ==========
  addClue(id, title, desc, chapter) {
    if (this.state.clues[id]) return;
    this.state.clues[id] = { title, desc, chapter: chapter || this.state.currentChapter };
    this.save();
    this.updateCluePanel();
    if (typeof AudioSys !== 'undefined') AudioSys.playClue();
    this.showToast('📎 新线索：' + title, 'info');
  },

  hasClue(id) {
    return !!this.state.clues[id];
  },

  getClueCount() {
    return Object.keys(this.state.clues).length;
  },

  getCluePercentage() {
    return Math.round((this.getClueCount() / this.TOTAL_CLUES) * 100);
  },

  updateCluePanel() {
    const body = document.querySelector('.clue-panel-body');
    if (!body) return;

    body.innerHTML = '';

    // 按卷宗分组
    const chapters = {};
    for (const [id, clue] of Object.entries(this.state.clues)) {
      if (!chapters[clue.chapter]) chapters[clue.chapter] = [];
      chapters[clue.chapter].push({ id, ...clue });
    }

    for (const ch of Object.keys(chapters).sort()) {
      const chName = this.chapterName(parseInt(ch)) || '序章';
      const group = document.createElement('div');
      group.innerHTML = '<div style="font-weight:bold;font-size:11px;color:#666;margin:8px 0 4px;border-bottom:1px solid #ccc;">' + chName + '</div>';
      body.appendChild(group);

      chapters[ch].forEach(clue => {
        const item = document.createElement('div');
        item.className = 'clue-item';
        item.innerHTML = '<div class="clue-title">' + clue.title + '</div><div class="clue-desc">' + clue.desc + '</div>';
        body.appendChild(item);
      });
    }

    // 更新线索计数
    const counter = document.querySelector('.clue-panel-header .clue-count');
    if (counter) {
      counter.textContent = this.getClueCount() + '/' + this.TOTAL_CLUES;
    }

    // 更新状态栏
    this.updateStatusBar();
  },

  toggleCluePanel() {
    const panel = document.querySelector('.clue-panel');
    if (panel) {
      panel.classList.toggle('open');
      if (typeof AudioSys !== 'undefined') AudioSys.playClick();
    }
  },

  // ========== 提示系统 ==========
  hints: {
    'login_password': [
      '看看页面上有没有什么便签提示？',
      '便签上写着"初始密码：机构编号字母部分+成立年份"',
      '页面底部的机构介绍里有"潮汐福利院编号CX-1987"，字母部分是小写的cx，密码是cx1987'
    ],
    'missing_child': [
      '对比一下在院儿童名单和分流安置名单的人数',
      '在院24人，分流只有23人，少了谁？',
      '仔细找找名单中缺失的名字——陈明（阿明）'
    ],
    'outbreak_date': [
      '全景照片的背景里有什么线索？',
      '照片墙上的日历显示了日期',
      '日历翻到了10月12日，答案是1999.10.12'
    ],
    'procurement_anomaly': [
      '对比疫情爆发前后的医疗用品采购记录',
      '注意消毒用品和肝炎药物的采购时间',
      '异常采购日期是关停后的1999.10.18——疫情都"爆发"了才买药？'
    ],
    'journal_cipher': [
      '日记里的数字"3-3、2-5、1-9、4-2、4-3、4-4"代表楼层-房间号',
      '查看福利院房间分布图，找到对应房间的名称首字',
      '3楼3号=假(假期阅览室)，2楼5号=疫(疫情会议室)，1楼9号=情(情绪安抚室)，4楼2号=拖(拖延维修区)，4楼3号=时(时间塔楼)，4楼4号=间(间隔储物间)，答案是"假疫情拖时间"'
    ],
    'newspaper_sort': [
      '匿名举报信是报纸剪字拼成的，顺序被打乱了',
      '试着把文字重新排列成通顺的句子',
      '正确顺序是"苏婉清挪用公款中饱私囊"'
    ],
    'hidden_date': [
      '开发商信中提到"槐花开时树下了结"',
      '青槐市的槐花花期是4月，所以月份是04。苏婉清最在意的日子与阿明有关',
      '约定日期是4月15日（阿明的生日），输入0415'
    ],
    'music_cipher': [
      '校医笔记末尾的简谱"3565321"对应音符名称的首字母',
      '3=mi=M, 5=sol=S, 6=la=L, 5=sol=S, 3=mi=M, 2=re=R, 1=do=D。并非所有字母都需要使用，从中选出有意义的组合',
      '从中选出S、S、M，拼出"手术明"——指向阿明的手术'
    ],
    'drawer_password': [
      '抽屉密码提示"我这辈子最重要的日子"',
      '查看阿明的病历，找他的出生日期',
      '阿明出生于1992年4月15日，密码是0415'
    ],
    'truth_puzzle': [
      '根据所有线索，苏婉清的真正目的是什么？',
      '她是阿明的奶奶，伪造疫情是为了带走阿明',
      '填入：苏婉清（填"苏婉清"），伪造疫情（填"疫情"），带走阿明（填"带走阿明"）'
    ],
  },

  showHint(puzzleId) {
    const hints = this.hints[puzzleId];
    if (!hints) return;

    const level = (this.state.hintsUsed[puzzleId] || 0);
    if (level >= hints.length) {
      this.showToast('提示已用完', 'info');
      return;
    }

    this.state.hintsUsed[puzzleId] = level + 1;
    this.save();

    const hintPanel = document.querySelector('[data-hint-for="' + puzzleId + '"]');
    if (hintPanel) {
      hintPanel.classList.add('show');
      hintPanel.innerHTML = '<div class="hint-label">💡 提示 ' + (level + 1) + '/' + hints.length + '</div>' + hints[level];
    }

    if (typeof AudioSys !== 'undefined') AudioSys.playClick();
  },

  // ========== 彩蛋系统 ==========
  foundEasterEgg(id, name) {
    if (this.state.easterEggs[id]) return;
    this.state.easterEggs[id] = true;
    this.save();
    if (typeof AudioSys !== 'undefined') AudioSys.playClue();
    this.showToast('🌟 发现隐藏彩蛋：' + name, 'info');
  },

  foundDoodle(id) {
    if (this.state.doodles[id]) return;
    this.state.doodles[id] = true;
    this.save();
    if (typeof AudioSys !== 'undefined') AudioSys.playClue();

    const count = Object.keys(this.state.doodles).length;
    this.showToast('🎨 发现儿童涂鸦 (' + count + '/' + this.TOTAL_DOODLES + ')', 'info');

    if (count >= this.TOTAL_DOODLES) {
      setTimeout(() => {
        this.showDoodleReward();
      }, 1000);
    }
  },

  showDoodleReward() {
    this.showDialog('儿童集体画', `
      <div style="text-align:center;padding:12px;">
        <div style="font-size:48px;margin-bottom:12px;">🌈</div>
        <p>你找到了全部5处儿童涂鸦！</p>
        <p style="margin-top:8px;">一张泛黄的画纸缓缓展开——</p>
        <p style="margin-top:8px;font-style:italic;color:#666;">那是24个孩子手拉手画的全家福，<br>画的右下角歪歪扭扭写着：<br>"我们是一家人 —— 潮汐福利院全体小朋友 1999年春"</p>
        <p style="margin-top:12px;font-size:12px;color:#999;">（画纸的背面，有一行极小的字："奶奶，我想学走路。"）</p>
      </div>
    `, [
      { text: '收好这幅画', onclick: 'Game.closeDialog()' }
    ]);
  },

  getEasterEggCount() {
    return Object.keys(this.state.easterEggs).length;
  },

  // ========== 真相填空 ==========
  setTruthBlank(slot, value) {
    this.state.truthBlanks[slot] = value;
    this.save();
  },

  getTruthBlank(slot) {
    return this.state.truthBlanks[slot] || '';
  },

  checkTruthPuzzle() {
    const blanks = this.state.truthBlanks;
    const b1 = (blanks['person'] || '').trim();
    const b2 = (blanks['action'] || '').trim();
    const b3 = (blanks['result'] || '').trim();

    // 普通结局：只填对了action
    if (b2 === '疫情' && b1 === '' && b3 === '') {
      return 'normal';
    }

    // 隐藏结局：全部正确 + 足够深度彩蛋 + 全部线索（优先判定）
    if (b1 === '苏婉清' && b2 === '疫情' && b3 === '带走阿明' &&
        this.getEasterEggCount() >= 4 && this.getClueCount() >= this.TOTAL_CLUES) {
      return 'hidden';
    }

    // 真相结局：填对全部
    if (b1 === '苏婉清' && b2 === '疫情' && b3 === '带走阿明') {
      return 'true';
    }

    // 部分正确
    if (b2 === '疫情') {
      return 'partial';
    }

    return 'wrong';
  },

  // ========== 结局系统 ==========
  showEnding(type) {
    this.state.endingType = type;
    this.save();

    if (typeof showEndingScreen === 'function') {
      showEndingScreen(type);
    }
  },

  // ========== UI 辅助 ==========
  showToast(msg, type) {
    type = type || 'info';
    // 移除已有的toast
    const existing = document.querySelectorAll('.toast');
    existing.forEach(t => t.remove());

    const toast = document.createElement('div');
    toast.className = 'toast ' + type;
    toast.innerHTML = msg;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  },

  showDialog(title, content, buttons) {
    // 移除已有对话框
    this.closeDialog();

    const overlay = document.createElement('div');
    overlay.className = 'dialog-overlay';
    overlay.id = 'game-dialog';

    let btnHtml = '';
    (buttons || [{ text: '确定', onclick: 'Game.closeDialog()' }]).forEach((btn, i) => {
      const safeOnclick = btn.onclick.replace(/"/g, '&quot;');
      btnHtml += '<button class="win98-btn' + (i === 0 ? ' primary' : '') + '" onclick="' + safeOnclick + '">' + btn.text + '</button>';
    });

    overlay.innerHTML = `
      <div class="dialog-box">
        <div class="title-bar">
          <span class="title-bar-text">${title}</span>
          <div class="title-bar-controls">
            <button class="title-bar-btn" onclick="Game.closeDialog()">×</button>
          </div>
        </div>
        <div class="dialog-content">${content}</div>
        <div class="dialog-buttons">${btnHtml}</div>
      </div>
    `;

    document.body.appendChild(overlay);
    if (typeof AudioSys !== 'undefined') AudioSys.playClick();
  },

  closeDialog() {
    const dialog = document.getElementById('game-dialog');
    if (dialog) dialog.remove();
  },

  updateStatusBar() {
    const clueField = document.querySelector('.status-bar .clue-status');
    if (clueField) {
      clueField.textContent = '线索: ' + this.getClueCount() + '/' + this.TOTAL_CLUES;
    }

    const progressField = document.querySelector('.status-bar .progress-status');
    if (progressField) {
      progressField.textContent = '进度: ' + this.getCluePercentage() + '%';
    }

    const chapterField = document.querySelector('.status-bar .chapter-status');
    if (chapterField) {
      chapterField.textContent = this.chapterName(this.state.currentChapter);
    }
  },

  // ========== 涂抹文字 ==========
  toggleRedact(elem) {
    elem.classList.toggle('revealed');
    if (elem.classList.contains('revealed') && typeof AudioSys !== 'undefined') {
      AudioSys.playClick();
    }
  },

  // ========== 系统时间彩蛋 ==========
  checkDateEasterEgg() {
    if (this.state.easterEggs['date_1015']) return;
    const now = new Date();
    if (now.getMonth() === 9 && now.getDate() === 15) {
      // 10月15日（首批分流日）
      this.foundEasterEgg('date_1015', '系统时间·分流日');
      document.body.style.filter = 'grayscale(1)';
      this.showDialog('系统提示', `
        <div style="text-align:center;">
          <p>📅 检测到系统日期：${now.getFullYear()}年10月15日</p>
          <p style="margin-top:8px;">系统切换至历史模式...</p>
          <p style="margin-top:12px;color:#666;font-style:italic;">这一天，24个孩子走向了不同的人生。</p>
        </div>
      `, [
        { text: '继续查阅', onclick: 'Game.closeDialog(); document.body.style.filter="";' }
      ]);
    }
  },

  // ========== 隐藏手机号彩蛋 ==========
  checkPhoneNumber(input) {
    const phone = '01037124256'; // 后11位
    if (input.replace(/\D/g, '') === phone ||
        input.replace(/\D/g, '') === '001037124256419' ||
        input.replace(/\D/g, '').includes('01037124256')) {
      this.foundEasterEgg('phone_number', '隐藏手机号');
      this.showDialog('短信记录', `
        <div style="font-family:var(--font-mono);font-size:12px;">
          <p style="font-weight:bold;margin-bottom:8px;">📩 2000年3月7日 短信记录</p>
          <p style="margin-bottom:4px;">发件人：林慧</p>
          <p style="margin-bottom:4px;">收件人：苏婉清</p>
          <hr style="margin:8px 0;">
          <p>"姐，手术成功了。阿明他能站了。"</p>
          <p style="margin-top:8px;">"医生说再康复半年就能慢慢走路了。"</p>
          <p style="margin-top:4px;">"你做得对。我没有一天后悔帮你。"</p>
          <p style="margin-top:8px;color:#999;">——这条短信，她存了整整19年。</p>
        </div>
      `, [
        { text: '关闭', onclick: 'Game.closeDialog()' }
      ]);
      return true;
    }
    return false;
  },

  // ========== 姓名首字母彩蛋 ==========
  checkNameCipher(input) {
    const target = 'tamendouhaizai'; // 他们都还在
    if (input.trim().toLowerCase() === target) {
      this.foundEasterEgg('name_cipher', '姓名密语');
      this.showDialog('系统搜索结果', `
        <div style="font-size:13px;">
          <p style="font-weight:bold;margin-bottom:8px;">🔍 搜索关键词：TAMENDOUHAIZAI</p>
          <p style="margin-bottom:8px;">匹配结果：24条记录</p>
          <hr style="margin:8px 0;">
          <p style="font-style:italic;color:#666;margin-bottom:8px;">他们都还在。</p>
          <table class="doc-table" style="font-size:11px;">
            <tr><th>姓名</th><th>现状</th></tr>
            <tr><td>王小芳</td><td>某市小学语文教师，已婚</td></tr>
            <tr><td>李大壮</td><td>汽修店老板，两个孩子</td></tr>
            <tr><td>张小花</td><td>护士，在邻市医院工作</td></tr>
            <tr><td>陈阿强</td><td>退伍军人，现从事物流</td></tr>
            <tr><td>刘小梅</td><td>开了家面馆，生意不错</td></tr>
            <tr><td colspan="2" style="text-align:center;color:#999;">...其余19条记录已归档</td></tr>
          </table>
          <p style="margin-top:12px;font-style:italic;color:#999;text-align:center;">
            24个孩子，都平安长大了。<br>有人当了老师，有人开了小店，人生安稳。
          </p>
        </div>
      `, [
        { text: '关闭', onclick: 'Game.closeDialog()' }
      ]);
      return true;
    }
    return false;
  },

  // ========== 槐花飘落 ==========
  startPetals() {
    const container = document.body;
    const count = 20;
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const petal = document.createElement('div');
        petal.className = 'petal';
        petal.style.left = Math.random() * 100 + 'vw';
        petal.style.animationDuration = (5 + Math.random() * 5) + 's';
        petal.style.animationDelay = Math.random() * 3 + 's';
        petal.style.opacity = 0.3 + Math.random() * 0.4;
        container.appendChild(petal);
        setTimeout(() => petal.remove(), 12000);
      }, i * 300);
    }
  },

  // ========== 系统维护弹窗彩蛋 ==========
  triggerMaintenancePopup() {
    this.showDialog('系统维护通知', `
      <div style="text-align:center;">
        <p style="font-size:24px;margin-bottom:8px;">⚠️</p>
        <p style="font-weight:bold;">服务器即将进行例行维护</p>
        <p style="margin-top:8px;">预计 <span id="maint-countdown" style="font-family:var(--font-mono);font-size:18px;color:var(--danger);">10</span> 秒后断开连接</p>
        <p style="margin-top:8px;color:#999;font-size:12px;">您的查阅进度已自动保存</p>
      </div>
    `, [
      { text: '取消', onclick: 'Game.closeDialog(); Game.showToast("维护已取消，继续查阅~", "info");' },
      { text: '确定', onclick: 'window.location.href="chaoxifuliyuan.html";' }
    ]);

    // 倒计时
    let countdown = 10;
    const timer = setInterval(() => {
      countdown--;
      const elem = document.getElementById('maint-countdown');
      if (elem) elem.textContent = countdown;
      if (countdown <= 0) {
        clearInterval(timer);
        this.closeDialog();
        this.showToast('维护已取消', 'info');
      }
    }, 1000);
  },

  // ========== 初始化 ==========
  init() {
    // 加载存档
    this.load();

    // 初始化时间
    if (!this.state.startTime) {
      this.state.startTime = Date.now();
    }

    // 更新UI
    this.updateChapterTabs();
    this.updateCluePanel();
    this.updateStatusBar();

    // 检查系统时间彩蛋
    this.checkDateEasterEgg();

    // 设置30分钟维护弹窗
    setTimeout(() => {
      if (!this.state.easterEggs['maintenance']) {
        this.foundEasterEgg('maintenance', '系统维护');
        this.triggerMaintenancePopup();
      }
    }, 30 * 60 * 1000);

    // 保存初始状态
    this.save();

    console.log('%c潮汐福利院档案系统 v1.0 已启动', 'color: #000080; font-size: 14px; font-weight: bold;');
  }
};

// ========== 便捷函数 ==========
function showToast(msg, type) {
  Game.showToast(msg, type);
}

function showDialog(title, content, buttons) {
  Game.showDialog(title, content, buttons);
}

// 暴露全局
window.Game = Game;
window.showToast = showToast;
window.showDialog = showDialog;
