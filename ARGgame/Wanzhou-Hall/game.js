'use strict';

const SAVE_KEY = 'wanzhoutang_save_v1';
const BACKUP_KEY = 'wanzhoutang_save_backup_v1';

const chapterMeta = [
  { id: 1, title: '归乡', subtitle: '晚舟旧堂', scene: 'assets/ink_shop_hd.webp', alt: '荒废而整洁的晚舟堂旧药铺内景' },
  { id: 2, title: '残卷', subtitle: '私塾密码', scene: 'assets/ink_school_hd.webp', alt: '阴冷的废弃民国私塾内景' },
  { id: 3, title: '钟鸣', subtitle: '渡口密讯', scene: 'assets/ink_ferry.webp', alt: '阴云下的青溪渡口与旧钟亭' },
  { id: 4, title: '药庐', subtitle: '隐忍真相', scene: 'assets/ink_hut_hd.webp', alt: '后山深处被树林包围的旧药庐' },
  { id: 5, title: '余响', subtitle: '青溪终章', scene: 'assets/ink_courtyard_hd.webp', alt: '阳光重新照进晚舟堂庭院，桂花树静静开放' }
];

const clueCatalog = {
  drawer_marks: { title: '药柜抽屉刻痕', text: '钥匙抽屉内侧有三组长短刻痕：-·-- / ·- / ---，像某种通信记号。' },
  ledger_gap: { title: '等额支出', text: '修桥善款二百元入账后，又有一笔同额药材支出；款项并非无故消失。' },
  epidemic_note: { title: '私塾隐句', text: '课案按天干排序后出现“山中有疫，药不可缓”。旧案发生时，邻乡正有疫情。' },
  morse_table: { title: '电报码对照表', text: '林晚舟曾学习电报技术。药柜刻痕可译为 YAO，即“药”。' },
  bell_message: { title: '渡口钟讯', text: '钟鸣长短音译为 HOU SHAN，指向“后山”。与“药”字线索合并，地点应是后山药庐。' },
  tablet_words: { title: '功德碑暗刻', text: '碑后刻着：“桥缓建，人先救；若有罪责，我一人担。”卷款流言第一次出现裂缝。' },
  letters_truth: { title: '六封家书', text: '家书时序证明：林晚舟主动承认携款潜逃，以免官府追究全镇与保长。' },
  paired_relics: { title: '成对遗物', text: '半枚银锁、同源笔迹与婴儿襁褓证明：守宅阿婆苏婉，是林砚的亲祖母。' },
  final_chain: { title: '完整证据链', text: '药款救灾、自污保镇、银锁认亲三条链互相印证，旧案真相已经闭合。' }
};

const hints = {
  'c1-herbs': [
    '诗句按春、夏、秋、冬依次写了四味药。先找每个季节对应的药名。',
    '顺序是：春采辛夷，夏取半夏，秋收茯苓，冬藏当归。',
    '依次点击：辛夷 → 半夏 → 茯苓 → 当归。'
  ],
  'c1-ledger': [
    '不要先看金额，先用节气和月份判断四页残账的先后。',
    '“正月冰未消”最早，“惊蛰后”“清明前”“梅雨初”依次在后。',
    '顺序：正月筹桥 → 惊蛰赊药 → 清明疫起 → 梅雨购药。'
  ],
  'c2-stems': [
    '天干的固定顺序是甲乙丙丁戊己庚辛。每张纸上的圈字会连成一句话。',
    '把带“甲”的纸放第一张，再依次排列到“辛”。',
    '正确句子是：山中有疫，药不可缓。'
  ],
  'c2-morse': [
    '把第一章抽屉里的三组刻痕当成三个英文字母，点是短痕，划是长痕。',
    '三组分别为 -·--、·-、---，在表中对应 Y、A、O。',
    '输入 YAO、药或“药”字均可。'
  ],
  'c3-bell': [
    '钟册以空格分隔字母，以斜杠分隔单词。先逐组查表。',
    '....=H，---=O，..-=U；第二词是 ... .... .- -.。',
    '完整答案是 HOU SHAN，也就是“后山”。'
  ],
  'c3-tablet': [
    '三处残缺组成一句完整的取舍：桥与人、百姓与罪名。',
    '前两句互为因果，最后一句说明谁承担后果。',
    '依次选择：桥缓建 / 人先救 / 罪我一人担。'
  ],
  'c4-letters': [
    '每封信都有季节锚点。按一年中的自然时序排列，不要被信中情绪干扰。',
    '冰未消 → 清明前 → 梅雨 → 桂花初开 → 初雪 → 次年惊蛰。',
    '顺序编号：1 → 2 → 3 → 4 → 5 → 6。'
  ],
  'c4-relics': [
    '每件遗物都要和阿婆身上的一个细节一一对应。先看最直接的银锁。',
    '银锁对银锁、药方对笔迹、襁褓对旧照片、桂花方对桂花糕。',
    '四项依次选：阿婆颈间半枚银锁 / 阿婆写下的药方 / 阿婆珍藏的母子照片 / 阿婆每年送来的桂花糕。'
  ],
  'c5-chain': [
    '最终整理不是寻找新事实，而是给三条证据链各自找到结论。',
    '账本与疫情对应“救灾”；官差文书与家书对应“自污保镇”；银锁与襁褓对应“祖母身份”。',
    '三项依次选择：挪款购药救灾 / 主动自污保全全镇 / 苏婉是亲祖母。'
  ]
};

const defaultState = () => ({
  version: 1,
  started: false,
  currentChapter: 1,
  unlockedChapter: 1,
  completedPuzzles: [],
  clues: [],
  notes: '',
  audioEnabled: true,
  reduceMotion: false,
  largeText: false,
  ending: null,
  completedAt: null,
  updatedAt: Date.now()
});

let state = defaultState();
let currentPuzzleId = 'c1-herbs';
let toastTimer = null;

const $ = (selector) => document.querySelector(selector);
const els = {};

class AmbientAudio {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.timer = null;
    this.mode = 'warm';
    this.enabled = true;
    this.step = 0;
    this.rainSource = null;
    this.rainGain = null;
  }
  async init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      this.ctx = new AudioContext();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.16;
      this.master.connect(this.ctx.destination);
      this.ensureRain();
    }
    if (this.ctx.state === 'suspended') await this.ctx.resume();
    this.start();
  }
  setEnabled(enabled) {
    this.enabled = enabled;
    if (!enabled) this.stop();
    else this.init().catch(() => {});
    this.updateRain();
  }
  setMode(mode) {
    this.mode = mode;
    this.step = 0;
    this.updateRain();
    if (this.enabled) this.start();
  }
  start() {
    if (!this.ctx || !this.enabled) return;
    this.ensureRain();
    this.stop();
    this.updateRain();
    this.playPhrase();
    this.timer = window.setInterval(() => this.playPhrase(), 4200);
  }
  stop() {
    if (this.timer) window.clearInterval(this.timer);
    this.timer = null;
    if (this.rainGain && (!this.enabled || !this.ctx)) this.rainGain.gain.value = 0;
  }
  ensureRain() {
    if (!this.ctx || this.rainSource) return;
    const length = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, length, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < length; i += 1) {
      const white = Math.random() * 2 - 1;
      last = last * .985 + white * .015;
      data[i] = last * .7 + white * .05;
    }
    const source = this.ctx.createBufferSource();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();
    source.buffer = buffer;
    source.loop = true;
    filter.type = 'bandpass';
    filter.frequency.value = 1450;
    filter.Q.value = .45;
    gain.gain.value = 0;
    source.connect(filter).connect(gain).connect(this.master);
    source.start();
    this.rainSource = source;
    this.rainGain = gain;
  }
  updateRain() {
    if (!this.rainGain || !this.ctx) return;
    const levels = { warm:.012, cool:.022, fog:.030, cold:.040, healing:.009, dusk:.015, clear:.006 };
    const target = this.enabled ? (levels[this.mode] || .012) : 0;
    this.rainGain.gain.cancelScheduledValues(this.ctx.currentTime);
    this.rainGain.gain.setTargetAtTime(target, this.ctx.currentTime, .8);
  }

  playPhrase() {
    if (!this.ctx || !this.enabled) return;
    const palettes = {
      warm: [293.66, 369.99, 440.00, 369.99],
      cool: [246.94, 293.66, 369.99, 293.66],
      fog: [220.00, 277.18, 329.63, 277.18],
      cold: [196.00, 246.94, 293.66, 246.94],
      healing: [293.66, 369.99, 440.00, 493.88],
      dusk: [220.00, 261.63, 329.63, 293.66],
      clear: [329.63, 415.30, 493.88, 554.37]
    };
    const notes = palettes[this.mode] || palettes.warm;
    const now = this.ctx.currentTime;
    notes.forEach((freq, index) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = index % 2 ? 'sine' : 'triangle';
      osc.frequency.value = freq / (this.mode === 'cold' ? 2 : 1);
      gain.gain.setValueAtTime(0, now + index * 0.72);
      gain.gain.linearRampToValueAtTime(index === 0 ? 0.055 : 0.035, now + index * 0.72 + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.72 + 1.6);
      osc.connect(gain).connect(this.master);
      osc.start(now + index * 0.72);
      osc.stop(now + index * 0.72 + 1.7);
    });
    this.step += 1;
  }
  playDialogueCue(speaker = '') {
    if (!this.ctx || !this.enabled) return;
    const profiles = {
      '苏婉': [293.66, 369.99],
      '周满': [196.00, 246.94],
      '老更夫': [174.61, 220.00],
      '林砚': [246.94, 329.63]
    };
    const notes = profiles[speaker] || [246.94, 293.66];
    const now = this.ctx.currentTime;
    notes.forEach((freq, index) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();
      osc.type = index ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now + index * .34);
      filter.type = 'lowpass';
      filter.frequency.value = 1200;
      gain.gain.setValueAtTime(.0001, now + index * .34);
      gain.gain.exponentialRampToValueAtTime(.025, now + index * .34 + .025);
      gain.gain.exponentialRampToValueAtTime(.0001, now + index * .34 + .85);
      osc.connect(filter).connect(gain).connect(this.master);
      osc.start(now + index * .34);
      osc.stop(now + index * .34 + .9);
    });
  }

  playBell(pattern) {
    if (!this.ctx || !this.enabled) return;
    const now = this.ctx.currentTime;
    let offset = 0;
    pattern.forEach((mark) => {
      if (mark === '/') { offset += 0.55; return; }
      if (mark === ' ') { offset += 0.28; return; }
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = 392;
      const duration = mark === '-' ? 0.38 : 0.12;
      gain.gain.setValueAtTime(0.0001, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.11, now + offset + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + duration);
      osc.connect(gain).connect(this.master);
      osc.start(now + offset);
      osc.stop(now + offset + duration + 0.04);
      offset += duration + 0.12;
    });
  }
}
const audio = new AmbientAudio();

function cacheElements() {
  [
    'coverScreen','gameShell','newGameBtn','continueBtn','coverSettingsBtn','homeBtn','chapterLabel','audioBtn','hintBtn','supportBtn','notesBtn','saveBtn','settingsBtn','chapterNav','progressText','progressBar','sceneFrame','sceneImage','sceneCaption','sceneMood','sectionKicker','sectionTitle','storyContent','objectiveText','puzzleArea','feedback','clueBoardBtn','clueCount','evidenceList','portrait','speakerName','speakerThought','hintDialog','hintLevels','hintResult','notesDialog','notesArea','clearNotesBtn','clueDialog','clueBoard','settingsDialog','settingAudio','settingMotion','settingLargeText','manualSaveBtn','exportSaveBtn','importSaveInput','resetGameBtn','saveStatus','resetDialog','resetConfirmInput','confirmResetBtn','endingDialog','endingContent','toast','mobileCloseEvidence'
  ].forEach(id => { els[id] = document.getElementById(id); });
}

function sanitizeState(raw) {
  const clean = defaultState();
  if (!raw || typeof raw !== 'object') return clean;
  clean.started = Boolean(raw.started);
  clean.currentChapter = clampNumber(raw.currentChapter, 1, 5, 1);
  clean.unlockedChapter = clampNumber(raw.unlockedChapter, 1, 5, 1);
  clean.completedPuzzles = Array.isArray(raw.completedPuzzles) ? [...new Set(raw.completedPuzzles.filter(x => typeof x === 'string'))] : [];
  clean.clues = Array.isArray(raw.clues) ? [...new Set(raw.clues.filter(x => clueCatalog[x]))] : [];
  clean.notes = typeof raw.notes === 'string' ? raw.notes.slice(0, 30000) : '';
  clean.audioEnabled = raw.audioEnabled !== false;
  clean.reduceMotion = Boolean(raw.reduceMotion);
  clean.largeText = Boolean(raw.largeText);
  clean.ending = ['public','silent','legacy'].includes(raw.ending) ? raw.ending : null;
  clean.completedAt = typeof raw.completedAt === 'number' ? raw.completedAt : null;
  clean.updatedAt = typeof raw.updatedAt === 'number' ? raw.updatedAt : Date.now();
  if (clean.currentChapter > clean.unlockedChapter) clean.currentChapter = clean.unlockedChapter;
  return clean;
}

function clampNumber(value, min, max, fallback) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.max(min, Math.min(max, Math.round(n))) : fallback;
}

function loadState() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) state = sanitizeState(JSON.parse(raw));
  } catch (error) {
    console.warn('存档读取失败，尝试备份槽', error);
    try {
      const backup = localStorage.getItem(BACKUP_KEY);
      if (backup) state = sanitizeState(JSON.parse(backup));
    } catch (backupError) {
      console.warn('备份槽读取失败', backupError);
      state = defaultState();
    }
  }
}

function saveState(showMessage = false) {
  state.notes = els.notesArea ? els.notesArea.value : state.notes;
  state.updatedAt = Date.now();
  const json = JSON.stringify(state);
  try {
    const previous = localStorage.getItem(SAVE_KEY);
    if (previous) localStorage.setItem(BACKUP_KEY, previous);
    localStorage.setItem(SAVE_KEY, json);
    if (showMessage) showToast('进度已保存');
    if (els.saveStatus) els.saveStatus.textContent = `最近保存：${new Date(state.updatedAt).toLocaleString('zh-CN')}`;
    return true;
  } catch (error) {
    console.error('存档失败', error);
    showToast('存档失败，请尝试导出存档');
    return false;
  }
}

function hasPuzzle(id) { return state.completedPuzzles.includes(id); }
function addPuzzle(id) { if (!hasPuzzle(id)) state.completedPuzzles.push(id); }
function addClue(id) { if (clueCatalog[id] && !state.clues.includes(id)) state.clues.push(id); }

function showToast(message) {
  if (!els.toast) return;
  els.toast.textContent = message;
  els.toast.classList.add('show');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => els.toast.classList.remove('show'), 2400);
}

function setFeedback(message, type = 'info') {
  els.feedback.className = `feedback show ${type}`;
  els.feedback.textContent = message;
}
function clearFeedback() {
  els.feedback.className = 'feedback';
  els.feedback.textContent = '';
}

function supportConfig() {
  return {
    qrCode: 'paycode.png',
    price: '1元',
    title: '支持《晚舟堂》',
    studio: 'abc studio'
  };
}

function showSupport(auto = false) {
  if (!window.Paywall) {
    if (!auto) showToast('支持模块暂未加载，请刷新页面后重试');
    return;
  }
  if (auto) {
    window.Paywall.autoShowOnce(supportConfig(), 900);
    return;
  }
  window.Paywall.show(supportConfig());
}

function startGame(newGame = false) {
  if (newGame) {
    state = defaultState();
    if (els.notesArea) els.notesArea.value = '';
  }
  state.started = true;
  els.coverScreen.hidden = true;
  els.gameShell.hidden = false;
  applySettings();
  renderAll();
  saveState(false);
  if (state.audioEnabled) audio.init().catch(() => {});
  showSupport(true);
}

function showCover() {
  saveState(false);
  [...document.body.classList].filter(c => c.startsWith('theme-')).forEach(c => document.body.classList.remove(c));
  document.body.classList.add('theme-cover');
  els.gameShell.hidden = true;
  els.coverScreen.hidden = false;
  els.continueBtn.hidden = !state.started;
  els.newGameBtn.textContent = state.started ? '重新归乡' : '入堂启卷';
}

function applySettings() {
  document.body.classList.toggle('reduce-motion', state.reduceMotion);
  document.body.classList.toggle('large-text', state.largeText);
  els.settingAudio.checked = state.audioEnabled;
  els.settingMotion.checked = state.reduceMotion;
  els.settingLargeText.checked = state.largeText;
  updateAudioButton();
  audio.setEnabled(state.audioEnabled);
}

function updateAudioButton() {
  els.audioBtn.setAttribute('aria-pressed', String(state.audioEnabled));
  els.audioBtn.querySelector('.action-text').textContent = state.audioEnabled ? '雨声开' : '雨声关';
  els.audioBtn.title = state.audioEnabled ? '关闭琴音、雨声与环境声' : '开启琴音、雨声与环境声';
}

function renderAll() {
  renderChapterNav();
  renderChapter();
  renderEvidence();
  renderClueBoard();
  updateProgress();
}

function renderChapterNav() {
  els.chapterNav.innerHTML = chapterMeta.map(ch => {
    const locked = ch.id > state.unlockedChapter;
    const complete = chapterComplete(ch.id);
    const classes = ['chapter-button'];
    if (ch.id === state.currentChapter) classes.push('active');
    if (complete) classes.push('complete');
    return `<button class="${classes.join(' ')}" data-chapter="${ch.id}" ${locked ? 'disabled' : ''} aria-current="${ch.id === state.currentChapter ? 'page' : 'false'}">
      <span class="chapter-number">${complete ? '✓' : ch.id}</span>
      <span class="chapter-name"><strong>${ch.title}</strong><span>${locked ? '尚未解锁' : ch.subtitle}</span></span>
    </button>`;
  }).join('');
  els.chapterNav.querySelectorAll('button[data-chapter]').forEach(button => {
    button.addEventListener('click', () => goToChapter(Number(button.dataset.chapter)));
  });
}

function chapterComplete(chapter) {
  const requirements = {
    1: ['c1-herbs','c1-ledger'],
    2: ['c2-stems','c2-morse'],
    3: ['c3-bell','c3-tablet'],
    4: ['c4-letters','c4-relics'],
    5: ['c5-chain']
  };
  return requirements[chapter].every(hasPuzzle);
}

function goToChapter(chapter) {
  if (chapter > state.unlockedChapter) {
    showToast('这一章尚未解锁');
    return;
  }
  state.currentChapter = chapter;
  clearFeedback();
  renderAll();
  saveState(false);
  window.scrollTo({ top: 0, behavior: state.reduceMotion ? 'auto' : 'smooth' });
}

function updateProgress() {
  const mainPuzzles = ['c1-herbs','c1-ledger','c2-stems','c2-morse','c3-bell','c3-tablet','c4-letters','c4-relics','c5-chain'];
  const done = mainPuzzles.filter(hasPuzzle).length;
  const percent = Math.round(done / mainPuzzles.length * 100);
  els.progressText.textContent = `${percent}%`;
  els.progressBar.style.width = `${percent}%`;
  els.clueCount.textContent = state.clues.length;
}

function renderChapter() {
  const meta = chapterMeta[state.currentChapter - 1];
  els.chapterLabel.textContent = `第${toChineseNumber(meta.id)}章 · ${meta.title}`;
  els.sectionKicker.textContent = `第${toChineseNumber(meta.id)}章`;
  els.sectionTitle.textContent = `${meta.title} · ${meta.subtitle}`;
  els.sceneImage.src = meta.scene;
  els.sceneImage.alt = meta.alt;
  els.sceneCaption.textContent = sceneCaptionForChapter(meta.id);
  clearFeedback();

  if (meta.id === 1) renderChapter1();
  if (meta.id === 2) renderChapter2();
  if (meta.id === 3) renderChapter3();
  if (meta.id === 4) renderChapter4();
  if (meta.id === 5) renderChapter5();
  if (state.audioEnabled) window.setTimeout(() => audio.playDialogueCue(els.speakerName.textContent), 120);
}

function toChineseNumber(n) { return ['零','一','二','三','四','五'][n] || String(n); }
function sceneCaptionForChapter(ch) { return ['','青溪镇 · 晚舟堂檐下','青溪镇 · 旧私塾雨窗','青溪镇 · 石桥老渡','后山 · 雾隐药庐','青溪镇 · 桂雨庭院'][ch]; }

const portraitMap = {
  '林砚': 'linyan',
  '林晚舟': 'linwanzhou',
  '林晚舟·家书': 'linwanzhou',
  '苏婉': 'suwan',
  '周满': 'zhouman',
  '老更夫': 'ferryman'
};

function setPortrait(person) {
  const key = portraitMap[person] || 'linyan';
  const spokenName = person.replace('·家书', '');
  els.portrait.className = `portrait portrait-${key}`;
  els.portrait.setAttribute('aria-label', `${spokenName}的民国旧照式肖像`);
  els.speakerName.textContent = person;
}

function setTheme(theme, mood) {
  [...document.body.classList].filter(c => c.startsWith('theme-')).forEach(c => document.body.classList.remove(c));
  document.body.classList.add(`theme-${theme}`);
  els.sceneMood.textContent = mood;
  audio.setMode(theme);
}

function renderChapter1() {
  setTheme('warm','淡墨暖纸 · 檐雨初歇');
  setPortrait('林砚');
  if (!hasPuzzle('c1-herbs')) {
    currentPuzzleId = 'c1-herbs';
    els.speakerThought.textContent = '“晚辈只为收整旧宅而来。祖上的那桩污名，我原不愿再提。”';
    els.storyContent.innerHTML = `
      <p>民国四十一年，青溪镇河道整改。祖宅将在七日后拆除，你受父亲之托回乡清点遗物。</p>
      <p>守宅的苏婉阿婆替你推开药铺木门。屋里落了灰，药柜却被擦得很干净，像有人一直等着店主回来。</p>
      <div class="dialogue"><span class="speaker">苏婉：</span>“书房钥匙还在药柜里。晚舟做事，一向依四时章法，不肯乱放。”</div>
      <div class="document"><strong>《四季本草歌》</strong><br>春采辛夷，香先百草；夏取半夏，燥湿和中；秋收茯苓，安心利水；冬藏当归，养血归根。</div>`;
    els.objectiveText.textContent = '依照《四季本草歌》，按季节顺序开启药柜抽屉。';
    renderOrderPuzzle({
      id:'c1-herbs', title:'本草药柜', description:'依次点击四味药材，组成春、夏、秋、冬的正确顺序。',
      items:[['danggui','当归'],['fuling','茯苓'],['xinyi','辛夷'],['banxia','半夏']], correct:['xinyi','banxia','fuling','danggui'],
      onSuccess:() => { addClue('drawer_marks'); setFeedback('药柜发出一声轻响。钥匙抽屉打开了，内侧还留着三组陌生刻痕。','success'); delayedRender(); }
    });
    return;
  }
  if (!hasPuzzle('c1-ledger')) {
    currentPuzzleId = 'c1-ledger';
    els.speakerThought.textContent = '“这些长短刻痕，像是有意留给后来人的。祖父究竟要我看见什么？”';
    els.storyContent.innerHTML = `
      <p>抽屉里除了书房钥匙，还有三组长短不一的刻痕。你暂时无法辨认，只把它们抄进便笺。</p>
      <p>书房账桌上散着四张残页。镇上的旧说法是：林晚舟在修桥善款到位后，连夜携款潜逃。</p>
      <div class="document"><strong>残账提示</strong><br>纸页受潮，页码脱落。每页只留下节气、事项和金额。先还原时序，才能看清钱去了哪里。</div>`;
    els.objectiveText.textContent = '按照节气和月份，排列四张残账。';
    renderOrderPuzzle({
      id:'c1-ledger', title:'残页账本', description:'点击残页按时间先后排入账册。',
      items:[
        ['p3','清明前：邻乡药价暴涨，官库仍不放药。'],
        ['p1','正月冰未消：全镇修桥募捐入账二百元。'],
        ['p4','梅雨初：购黄连、藿香、苍术等药，支出二百元。'],
        ['p2','惊蛰后：赊购米粮与药包，暂记欠账。']
      ], correct:['p1','p2','p3','p4'],
      onSuccess:() => { addClue('ledger_gap'); unlockChapter(2); setFeedback('账页复原：修桥款确实被支出，但支出项目是整批疫病药材。','success'); delayedRender(); }
    });
    return;
  }
  currentPuzzleId = 'c1-ledger';
  els.speakerThought.textContent = '“款项确曾移用，可那一船药材，未必是为私。”';
  els.storyContent.innerHTML = `<p>第一章线索已经整理完毕。账本没有证明林晚舟清白，却证明流言遗漏了一件关键事实：消失的善款被换成了药。</p><div class="dialogue"><span class="speaker">苏婉：</span>“若真要查，便去镇东旧私塾。活人会避讳，旧纸不会。”</div>`;
  els.objectiveText.textContent = '前往废弃私塾，查找疫情与刻痕的来历。';
  renderContinueButton(2,'前往私塾');
}

function renderChapter2() {
  setTheme('cool','青灰旧卷 · 细雨入窗');
  setPortrait('周满');
  if (!hasPuzzle('c2-stems')) {
    currentPuzzleId = 'c2-stems';
    els.speakerThought.textContent = '“借拆屋之名请你归来，是因有些旧账，断不能同瓦砾一道埋了。”';
    els.storyContent.innerHTML = `<p>私塾荒废多年。镇长周满等在门口，手里拿着一串生锈的钥匙。他没有替林晚舟辩解，只说当年的课案被人故意打乱。</p><p>八张课案分别标着天干，纸角各圈出一个字。</p><div class="document"><strong>旧课案</strong><br>先生批注：“循甲乙之序，方见未说之事。”</div>`;
    els.objectiveText.textContent = '按天干顺序排列八张课案，读出圈字。';
    renderOrderPuzzle({
      id:'c2-stems', title:'天干课案', description:'依次点击甲、乙、丙、丁、戊、己、庚、辛。',
      items:[['geng','庚 · 可'],['yi','乙 · 中'],['wu','戊 · 药'],['jia','甲 · 山'],['xin','辛 · 缓'],['bing','丙 · 有'],['ji','己 · 不'],['ding','丁 · 疫']],
      correct:['jia','yi','bing','ding','wu','ji','geng','xin'],
      onSuccess:() => { addClue('epidemic_note'); setFeedback('圈字连成：“山中有疫，药不可缓。”','success'); delayedRender(); }
    });
    return;
  }
  if (!hasPuzzle('c2-morse')) {
    currentPuzzleId = 'c2-morse';
    els.speakerThought.textContent = '“晚舟早年习过电报。他常说，乱世里一句话送得出去，便可能救下一条命。”';
    els.storyContent.innerHTML = `<p>课案夹层里藏着一页民用电报码。林晚舟年轻时曾在邮电局学习，药柜里的长短刻痕终于有了解法。</p><p>短痕记作“·”，长痕记作“-”。第一章记录的三组符号是：</p><div class="document"><strong>-·--　/　·-　/　---</strong></div>`;
    els.objectiveText.textContent = '使用摩斯对照表，翻译药柜刻痕。';
    renderMorsePuzzle();
    return;
  }
  currentPuzzleId = 'c2-morse';
  els.speakerThought.textContent = '“刻痕只得一字——药。地点尚缺半句。”';
  els.storyContent.innerHTML = `<p>刻痕译为 YAO。周满提到，当年渡口更夫会用长短钟声替药铺传讯，旧钟册至今还在。</p><div class="dialogue"><span class="speaker">周满：</span>“沿河往渡口去罢。那一夜，钟声穿雨，比哪一年都急。”</div>`;
  els.objectiveText.textContent = '前往老渡口，寻找与“药”相连的地点。';
  renderContinueButton(3,'前往渡口');
}

function renderChapter3() {
  const reversed = hasPuzzle('c3-tablet');
  setTheme(reversed ? 'fog' : 'cool', reversed ? '墨雾漫江 · 旧说动摇' : '烟雨渡口 · 钟声隔水');
  setPortrait('老更夫');
  if (!hasPuzzle('c3-bell')) {
    currentPuzzleId = 'c3-bell';
    els.speakerThought.textContent = '“那一夜装了三船药箱。林掌柜只留一句：桥可缓，人命不可缓。”';
    els.storyContent.innerHTML = `<p>旧钟亭临水而立。钟册把每次敲击记作短点与长划，恰好可以使用私塾找到的对照表。</p><p>最后一行被红笔圈住：</p><div class="document"><strong>.... --- ..-　/　... .... .- -.</strong></div>`;
    els.objectiveText.textContent = '听取或阅读钟鸣序列，翻译隐藏地点。';
    renderBellPuzzle();
    return;
  }
  if (!hasPuzzle('c3-tablet')) {
    currentPuzzleId = 'c3-tablet';
    els.speakerThought.textContent = '“碑前尽是骂名，碑后却像留着一句无人敢读的话。”';
    els.storyContent.innerHTML = `<p>钟讯译为“后山”。你们在渡口功德碑背面发现被灰浆盖住的刻字。三处字句残缺，需要结合账本与更夫证词补全。</p><div class="document"><strong>____，____，____。</strong><br>旁注：桥材可以再等，疫病不会等人。</div>`;
    els.objectiveText.textContent = '补全功德碑后的三句暗刻。';
    renderTabletPuzzle();
    return;
  }
  currentPuzzleId = 'c3-tablet';
  els.speakerThought.textContent = '“桥缓建，人先救；若有罪责，我一人担。”';
  els.storyContent.innerHTML = `<p>第一层真相显现：林晚舟没有把善款据为己有。他用钱买药，救了山中疫民。</p><p>但新的疑问更沉重——如果只是救人，为什么他不解释，反而任由“卷款潜逃”的骂名落在自己身上？</p><div class="dialogue"><span class="speaker">周满：</span>“后山药庐尚存几封未寄家书。只是纸上之言，未必比流言轻。”</div>`;
  els.objectiveText.textContent = '进入后山药庐，查明林晚舟为何主动消失。';
  renderContinueButton(4,'进入后山');
}

function renderChapter4() {
  const kinship = hasPuzzle('c4-relics');
  setTheme(kinship ? 'healing' : 'cold', kinship ? '灰雾渐散 · 暖光回归' : '冷调褪色 · 暗角加深');
  setPortrait(kinship ? '苏婉' : '林砚');
  if (!hasPuzzle('c4-letters')) {
    currentPuzzleId = 'c4-letters';
    els.speakerThought.textContent = '“祖父并非仓皇出走。他把旁人的退路安排妥当，才独自隐入山中。”';
    els.storyContent.innerHTML = `<p>药庐桌上有六封无日期家书。信中没有明确年月，只有冰河、清明、梅雨、桂花、初雪与次年惊蛰等季节线索。</p><p>若能复原顺序，就能看清林晚舟从筹桥到消失的完整决定。</p>`;
    els.objectiveText.textContent = '依据季节、疫情与修桥进度，排列六封家书。';
    renderOrderPuzzle({
      id:'c4-letters', title:'无日期家书', description:'依次点击六封信。每封信开头的编号仅用于操作，不代表正确顺序。',
      items:[
        ['l4','④ 桂花初开：若官差来问，只说我携款逃了。'],
        ['l2','② 清明前：邻乡疫起，官库扣药不发。'],
        ['l6','⑥ 次年惊蛰：孩子平安，银锁另一半留给他。'],
        ['l1','① 正月冰未消：桥料已议定，等开河便动工。'],
        ['l5','⑤ 初雪后：我留在山中，别让林家后人寻我。'],
        ['l3','③ 梅雨正盛：我已将善款换药，今夜走水路。']
      ],
      correct:['l1','l2','l3','l4','l5','l6'],
      onSuccess:() => { addClue('letters_truth'); setFeedback('六封信连成完整时序：他主动背下罪名，换取全镇修桥资格与保长平安。','success'); delayedRender(); }
    });
    return;
  }
  if (!hasPuzzle('c4-relics')) {
    currentPuzzleId = 'c4-relics';
    setPortrait('林晚舟·家书');
    els.speakerThought.textContent = '“若官差来问，只说我携款逃了。孩子平安，银锁另一半留给他。”';
    els.storyContent.innerHTML = `<p>药庐木箱里留着半枚银锁、一张母子旧照、几页药方和桂花糕方。苏婉阿婆此时赶到门口，颈间同样挂着半枚银锁。</p><div class="dialogue"><span class="speaker">苏婉：</span>“有些名分一旦说破，晚舟替众人挡下的祸，怕要循声回来。”</div>`;
    els.objectiveText.textContent = '把四件遗物与阿婆身上的对应细节配对。';
    renderRelicPuzzle();
    return;
  }
  currentPuzzleId = 'c4-relics';
  els.speakerThought.textContent = '“我看着你长大，却不敢应你一声祖母。这一声，足足迟了二十年。”';
  els.storyContent.innerHTML = `<p>第三层真相终于落地。苏婉不是受托守宅的远亲，而是林晚舟的妻子、你的亲祖母。</p><p>她隐姓守了二十年，不是因为不想相认，而是担心旧案重启，牵连林家后人，也让林晚舟用一生换来的平安失去意义。</p><div class="dialogue"><span class="speaker">苏婉：</span>“砚儿，这卷旧事如今交到你手里。如何留下，便由你落笔。”</div>`;
  els.objectiveText.textContent = '回到晚舟堂，整理完整证据链并决定旧案的去向。';
  renderContinueButton(5,'返回晚舟堂');
}

function renderChapter5() {
  setTheme(state.ending === 'silent' ? 'dusk' : state.ending ? 'clear' : 'healing', state.ending === 'silent' ? '薄暮微凉 · 安静沉淀' : '庭院暖光 · 桂影浮动');
  setPortrait('林砚');
  if (!hasPuzzle('c5-chain')) {
    currentPuzzleId = 'c5-chain';
    els.speakerThought.textContent = '“每一句结论都须有物证相托，否则所谓真相，也不过是另一场流言。”';
    els.storyContent.innerHTML = `<p>你把账本、课案、钟册、碑文、家书与遗物铺满堂屋。周满提出最后的要求：不要凭感动替林晚舟正名，要让每条结论都能被证据支撑。</p><p>整理完成后，你将决定是否公开旧案。三个选择都要付出代价，也没有一个答案能替所有人消除遗憾。</p>`;
    els.objectiveText.textContent = '为三条核心证据链选择正确结论。';
    renderFinalChainPuzzle();
    return;
  }
  currentPuzzleId = 'c5-chain';
  els.speakerThought.textContent = state.ending ? endingThought(state.ending) : '“立碑、封卷，抑或把善意留在寻常烟火里。”';
  els.storyContent.innerHTML = `<p>证据链已经闭合：</p><div class="document">① 修桥款流向药材，钟册与疫情记录互证——所谓卷款，实为救灾。<br>② 家书、官差文书与碑后暗刻互证——所谓逃亡，实为自污保镇。<br>③ 半枚银锁、笔迹与襁褓互证——守宅苏婉，是林家真正的祖母。</div><p>${state.ending ? '你已经作出过一次选择。仍可回看另外两种可能，它们不会覆盖已保存的首次结局。' : '现在，旧案将以怎样的方式留在青溪？'}</p>`;
  els.objectiveText.textContent = state.ending ? '回看结局，或重新审视其他选择。' : '选择你认为最合适的处理方式。';
  renderEndingChoices();
}

function renderOrderPuzzle(config) {
  const { id,title,description,items,correct,onSuccess } = config;
  let selected = [];
  els.puzzleArea.innerHTML = `<div class="puzzle-card"><h3>${title}</h3><p class="puzzle-desc">${description}</p><div class="sequence-list" id="sequenceChoices"></div><div class="puzzle-actions"><button type="button" class="puzzle-reset" id="sequenceReset">清空顺序</button><button type="button" class="puzzle-submit" id="sequenceSubmit">确认排列</button></div></div>`;
  const container = $('#sequenceChoices');
  function draw() {
    container.innerHTML = items.map(([key,label]) => {
      const index = selected.indexOf(key);
      return `<button type="button" class="sequence-item ${index >= 0 ? 'selected' : ''}" data-key="${key}">${index >= 0 ? `<span class="order-badge">${index + 1}</span>` : ''}${label}</button>`;
    }).join('');
    container.querySelectorAll('button').forEach(btn => btn.addEventListener('click', () => {
      const key = btn.dataset.key;
      const index = selected.indexOf(key);
      if (index >= 0) selected.splice(index,1); else selected.push(key);
      draw();
    }));
  }
  draw();
  $('#sequenceReset').addEventListener('click', () => { selected = []; draw(); clearFeedback(); });
  $('#sequenceSubmit').addEventListener('click', () => {
    if (selected.length !== correct.length) return setFeedback(`还需选择 ${correct.length - selected.length} 项。点击已选项目可以撤回。`,'error');
    const mismatch = selected.findIndex((key,index) => key !== correct[index]);
    if (mismatch >= 0) return setFeedback(`第 ${mismatch + 1} 个位置不对。可以结合提示重新检查时序。`,'error');
    addPuzzle(id); onSuccess(); saveState(false); updateProgress(); renderEvidence(); renderChapterNav();
  });
}

function renderMorsePuzzle() {
  const table = [['A','.-'],['E','.'],['L','.-..'],['O','---'],['U','..-'],['Y','-.--'],['H','....'],['S','...'],['N','-.'],['R','.-.']];
  els.puzzleArea.innerHTML = `<div class="puzzle-card"><h3>刻痕译读</h3><p class="puzzle-desc">对照字母表，把三组刻痕译成一个拼音词。</p><div class="morse-table">${table.map(x=>`<div class="morse-cell"><strong>${x[0]}</strong><br>${x[1]}</div>`).join('')}</div><input id="morseInput" class="text-input" placeholder="输入英文字母或对应汉字" autocomplete="off"><div class="puzzle-actions"><button type="button" class="puzzle-submit" id="morseSubmit">确认译文</button></div></div>`;
  const submit = () => {
    const value = $('#morseInput').value.trim().toUpperCase().replace(/\s+/g,'');
    if (!value) return setFeedback('请先输入译文。','error');
    if (!['YAO','药','藥'].includes(value)) return setFeedback('三组符号分别对应三个字母。当前译文不正确。','error');
    addPuzzle('c2-morse'); addClue('morse_table'); unlockChapter(3); setFeedback('刻痕译为 YAO——“药”。药柜给出的只是地点的一半。','success'); saveState(false); delayedRender();
  };
  $('#morseSubmit').addEventListener('click', submit);
  $('#morseInput').addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });
}

function renderBellPuzzle() {
  els.puzzleArea.innerHTML = `<div class="puzzle-card"><h3>钟鸣密讯</h3><p class="puzzle-desc">可以直接阅读符号，也可以播放长短钟声。斜杠表示词语间隔。</p><div class="bell-sequence"><span class="bell-group">....</span><span class="bell-group">---</span><span class="bell-group">..-</span><strong>/</strong><span class="bell-group">...</span><span class="bell-group">....</span><span class="bell-group">.-</span><span class="bell-group">-.</span></div><div class="puzzle-actions"><button type="button" class="secondary-btn" id="playBellBtn">播放钟声</button></div><input id="bellInput" class="text-input" placeholder="输入拼音或中文地点" autocomplete="off"><div class="puzzle-actions"><button type="button" class="puzzle-submit" id="bellSubmit">确认地点</button></div></div>`;
  $('#playBellBtn').addEventListener('click', async () => { await audio.init(); audio.playBell('.... --- ..- / ... .... .- -.'.split('')); });
  const submit = () => {
    const value = $('#bellInput').value.trim().toUpperCase().replace(/[\s_-]+/g,'');
    if (!value) return setFeedback('请先输入地点。','error');
    if (!['HOUSHAN','后山'].includes(value)) return setFeedback('第一词是三个字母，第二词是四个字母。译文还不正确。','error');
    addPuzzle('c3-bell'); addClue('bell_message'); setFeedback('钟讯译为 HOU SHAN——后山。与“药”合并，目标是后山药庐。','success'); saveState(false); delayedRender();
  };
  $('#bellSubmit').addEventListener('click', submit);
  $('#bellInput').addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });
}

function renderTabletPuzzle() {
  els.puzzleArea.innerHTML = `<div class="puzzle-card"><h3>功德碑残字</h3><p class="puzzle-desc">从每组候选中选出能与账本、疫情和更夫证词同时成立的句子。</p><div class="inline-fields">
    <label>第一处<select id="tablet1" class="select-input"><option value="">请选择</option><option>桥先建</option><option>桥缓建</option><option>桥不建</option></select></label>
    <label>第二处<select id="tablet2" class="select-input"><option value="">请选择</option><option>名先留</option><option>人先救</option><option>账先平</option></select></label>
    <label>第三处<select id="tablet3" class="select-input"><option value="">请选择</option><option>罪我一人担</option><option>功归全镇记</option><option>钱由后人还</option></select></label>
  </div><div class="puzzle-actions"><button type="button" class="puzzle-submit" id="tabletSubmit">补全碑文</button></div></div>`;
  $('#tabletSubmit').addEventListener('click', () => {
    const values = [$('#tablet1').value,$('#tablet2').value,$('#tablet3').value];
    if (values.some(v=>!v)) return setFeedback('三处残字都需要选择。','error');
    const correct = ['桥缓建','人先救','罪我一人担'];
    const wrong = values.findIndex((v,i)=>v!==correct[i]);
    if (wrong >= 0) return setFeedback(`第 ${wrong + 1} 处与现有证据不符。先考虑“桥”和“人命”谁更不能等待。`,'error');
    addPuzzle('c3-tablet'); addClue('tablet_words'); unlockChapter(4); setFeedback('碑后暗刻完整显现。第一层反转成立：卷款是假，救灾是真。','success'); saveState(false); delayedRender();
  });
}

function renderRelicPuzzle() {
  const options = [
    '阿婆颈间半枚银锁','阿婆写下的药方','阿婆珍藏的母子照片','阿婆每年送来的桂花糕','镇长的旧印章','渡口更夫的铜铃'
  ];
  const rows = [
    ['木箱中的半枚银锁','阿婆颈间半枚银锁'],
    ['林晚舟家书末页笔迹','阿婆写下的药方'],
    ['绣着“砚”字的旧襁褓','阿婆珍藏的母子照片'],
    ['林晚舟亲笔桂花糕方','阿婆每年送来的桂花糕']
  ];
  els.puzzleArea.innerHTML = `<div class="puzzle-card"><h3>遗物互证</h3><p class="puzzle-desc">为左侧遗物选择最能证明人物关系的对应细节。每个错误项会单独指出。</p><div class="inline-fields">${rows.map((row,i)=>`<label>${row[0]}<select id="relic${i}" class="select-input"><option value="">请选择对应细节</option>${options.map(o=>`<option>${o}</option>`).join('')}</select></label>`).join('')}</div><div class="puzzle-actions"><button type="button" class="puzzle-submit" id="relicSubmit">核对遗物</button></div></div>`;
  $('#relicSubmit').addEventListener('click', () => {
    const values = rows.map((_,i)=>$(`#relic${i}`).value);
    if (values.some(v=>!v)) return setFeedback('还有遗物没有配对。','error');
    const wrong = values.reduce((arr,v,i)=>{ if(v!==rows[i][1]) arr.push(i+1); return arr; },[]);
    if (wrong.length) return setFeedback(`第 ${wrong.join('、')} 项对应不成立。直接证物应优先于泛泛的熟悉感。`,'error');
    addPuzzle('c4-relics'); addClue('paired_relics'); unlockChapter(5); setFeedback('所有遗物相互印证：苏婉就是林砚的亲祖母。','success'); saveState(false); delayedRender();
  });
}

function renderFinalChainPuzzle() {
  const groups = [
    ['账本支出 + 疫情课案 + 渡口药船',['挪款购药救灾','携款用于经商','账目由后人伪造']],
    ['官差追责文书 + 六封家书 + 碑后暗刻',['主动自污保全全镇','畏罪逃亡山中','镇长强迫其顶罪']],
    ['半枚银锁 + 同源笔迹 + 旧襁褓',['苏婉是亲祖母','苏婉只是受托管家','苏婉是镇长亲属']]
  ];
  els.puzzleArea.innerHTML = `<div class="puzzle-card"><h3>证据链复盘</h3><p class="puzzle-desc">每条结论都必须由一组独立证据支撑，不能只凭人物自述。</p><div class="inline-fields">${groups.map((g,i)=>`<label>${g[0]}<select id="chain${i}" class="select-input"><option value="">选择结论</option>${g[1].map(o=>`<option>${o}</option>`).join('')}</select></label>`).join('')}</div><div class="puzzle-actions"><button type="button" class="puzzle-submit" id="chainSubmit">完成复盘</button></div></div>`;
  $('#chainSubmit').addEventListener('click', () => {
    const correct = ['挪款购药救灾','主动自污保全全镇','苏婉是亲祖母'];
    const values = correct.map((_,i)=>$(`#chain${i}`).value);
    if (values.some(v=>!v)) return setFeedback('三条证据链都需要结论。','error');
    const wrong = values.findIndex((v,i)=>v!==correct[i]);
    if (wrong >= 0) return setFeedback(`第 ${wrong + 1} 条结论无法同时解释该组证据。`,'error');
    addPuzzle('c5-chain'); addClue('final_chain'); setFeedback('全部证据链闭合。你可以在不依赖流言的情况下，讲清这桩旧案。','success'); saveState(false); delayedRender();
  });
}

function renderContinueButton(chapter,label) {
  els.puzzleArea.innerHTML = `<div class="puzzle-card"><p class="puzzle-desc">本章已完成。已获得的线索可以在线索板中随时回看。</p><div class="puzzle-actions"><button type="button" class="primary-btn" id="continueChapterBtn">${label}</button></div></div>`;
  $('#continueChapterBtn').addEventListener('click', () => goToChapter(chapter));
}

function renderEndingChoices() {
  const choices = [
    ['public','立碑正名','公开全部证据，为林晚舟恢复名誉。真相会被看见，也会重新搅动沉寂多年的镇子。'],
    ['silent','沉默守秘','只把证据留给林家与周满，保护苏婉余生安稳。镇上的旧名声仍不会改变。'],
    ['legacy','烟火人间','不造神、不隐藏，把药庐改成义诊与乡史小馆，让后来人从行动中理解这段善意。']
  ];
  els.puzzleArea.innerHTML = `<div class="puzzle-card"><h3>旧案的去向</h3><p class="puzzle-desc">三个结局都保留真实代价，没有影响解锁内容的“唯一正确答案”。首次选择会记入存档。</p><div class="option-grid">${choices.map(c=>`<button type="button" class="option-button" data-ending="${c[0]}"><strong>${c[1]}</strong><br><small>${c[2]}</small></button>`).join('')}</div></div>`;
  els.puzzleArea.querySelectorAll('[data-ending]').forEach(button => button.addEventListener('click', () => showEnding(button.dataset.ending)));
}

function showEnding(type) {
  const endings = {
    public: {
      tag:'结局一 · 立碑正名', title:'天光之下', theme:'clear', bg:'assets/ink_courtyard_hd.webp',
      text:'你将账本、家书与官差文书交给省城报馆。林晚舟的名字终于从“卷款逃犯”改回“青溪义士”。碑前来的人很多，有敬意，也有猎奇。苏婉站在人群外，没有上前。她说，晚舟若还在，大概只会问桥是否牢、药是否够。你明白，正名抚平了一个名字，却无法让往事重新安静。'
    },
    silent: {
      tag:'结局二 · 沉默守秘', title:'薄暮无碑', theme:'dusk', bg:'assets/ink_courtyard_hd.webp',
      text:'你没有公开旧案，只把证据封存在林家木箱。晚舟堂被修好，苏婉终于可以在院里被你叫一声祖母。镇民仍在旧碑前重复当年的说法，你偶尔想辩解，最终只是把药铺重新开门。这个选择保护了活着的人，也让一个名字继续承受误解。'
    },
    legacy: {
      tag:'结局三 · 烟火人间', title:'善意有后来', theme:'healing', bg:'assets/ink_courtyard_hd.webp',
      text:'你没有为林晚舟塑一尊无瑕的像，也没有把真相锁回箱底。药庐成为义诊室，晚舟堂的一角陈列经过隐私处理的旧账与药方。孩子们知道，曾有人让桥晚建一年，让一村人多活许多年。苏婉在桂花树下教你做糕。故事不再只是碑上的定论，而成为镇上继续发生的善意。'
    }
  };
  const ending = endings[type];
  if (!state.ending) {
    state.ending = type;
    state.completedAt = Date.now();
    saveState(false);
  }
  setTheme(ending.theme, type === 'silent' ? '薄暮微凉 · 安静沉淀' : '桂影浮动 · 暖光铺陈');
  els.endingContent.style.backgroundImage = `url('${ending.bg}')`;
  els.endingContent.innerHTML = `<div class="ending-inner"><div class="ending-tag">${ending.tag}</div><h2>${ending.title}</h2><p>${ending.text}</p><div class="ending-actions"><button type="button" class="primary-btn" id="endingReturn">回到庭院</button><button type="button" class="secondary-btn" id="endingOther">查看其他可能</button></div></div>`;
  els.endingDialog.showModal();
  $('#endingReturn').addEventListener('click', () => { els.endingDialog.close(); renderAll(); });
  $('#endingOther').addEventListener('click', () => { els.endingDialog.close(); renderAll(); });
}

function endingThought(type) {
  return {
    public:'“名誉回来了，可被围观的人仍是活生生的人。”',
    silent:'“有些安稳以遗憾为代价，我会记得这份代价。”',
    legacy:'“不必把他写成完人，只要让那份选择继续帮助后来的人。”'
  }[type];
}

function unlockChapter(chapter) {
  state.unlockedChapter = Math.max(state.unlockedChapter, chapter);
}

function delayedRender() {
  window.setTimeout(() => { renderAll(); }, state.reduceMotion ? 20 : 900);
}

function renderEvidence() {
  if (!state.clues.length) {
    els.evidenceList.innerHTML = '<div class="evidence-empty">尚未收录物证。完成谜题后，关键证据会自动加入此处。</div>';
    return;
  }
  els.evidenceList.innerHTML = state.clues.slice().reverse().map(id => `<div class="evidence-item"><strong>${clueCatalog[id].title}</strong><span>${clueCatalog[id].text}</span></div>`).join('');
}

function renderClueBoard() {
  if (!state.clues.length) {
    els.clueBoard.innerHTML = '<p class="dialog-note">线索板目前是空的。先从晚舟堂药柜开始调查。</p>';
    return;
  }
  els.clueBoard.innerHTML = state.clues.map(id => `<article class="clue-card"><h3>${clueCatalog[id].title}</h3><p>${clueCatalog[id].text}</p></article>`).join('');
}

function openHintDialog() {
  const list = hints[currentPuzzleId] || ['回看本章已经收录的线索。','当前没有额外提示。','请检查是否已经完成本章谜题。'];
  els.hintResult.textContent = '选择一个等级查看。';
  els.hintLevels.innerHTML = ['一级：方向','二级：关键线索','三级：接近答案'].map((label,i)=>`<button type="button" class="hint-level" data-level="${i}">${label}</button>`).join('');
  els.hintLevels.querySelectorAll('button').forEach(btn => btn.addEventListener('click', () => { els.hintResult.textContent = list[Number(btn.dataset.level)]; }));
  els.hintDialog.showModal();
}

function exportSave() {
  saveState(false);
  const blob = new Blob([JSON.stringify(state,null,2)], { type:'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `晚舟堂存档_${new Date().toISOString().slice(0,10)}.json`;
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
  showToast('存档已导出');
}

async function importSave(file) {
  try {
    const text = await file.text();
    const raw = JSON.parse(text);
    const imported = sanitizeState(raw);
    if (!imported.started && imported.completedPuzzles.length === 0) throw new Error('文件中没有有效游戏进度');
    state = imported;
    els.notesArea.value = state.notes;
    applySettings();
    saveState(false);
    els.settingsDialog.close();
    startGame(false);
    showToast('存档导入成功');
  } catch (error) {
    console.error(error);
    els.saveStatus.textContent = `导入失败：${error.message || '文件格式不正确'}`;
  } finally {
    els.importSaveInput.value = '';
  }
}

function resetGame() {
  localStorage.removeItem(SAVE_KEY);
  localStorage.removeItem(BACKUP_KEY);
  state = defaultState();
  els.notesArea.value = '';
  els.resetDialog.close();
  els.settingsDialog.close();
  els.gameShell.hidden = true;
  els.coverScreen.hidden = false;
  els.continueBtn.hidden = true;
  els.newGameBtn.textContent = '入堂启卷';
  [...document.body.classList].filter(c => c.startsWith('theme-')).forEach(c => document.body.classList.remove(c));
  document.body.classList.add('theme-cover');
  audio.stop();
  showToast('旧进度已清除');
}

function setupEvents() {
  els.newGameBtn.addEventListener('click', () => {
    if (state.started) {
      els.resetConfirmInput.value = '';
      els.confirmResetBtn.disabled = true;
      els.resetDialog.showModal();
    } else {
      startGame(true);
    }
  });
  els.continueBtn.addEventListener('click', () => startGame(false));
  els.homeBtn.addEventListener('click', showCover);
  [els.coverSettingsBtn,els.settingsBtn].forEach(btn => btn.addEventListener('click', () => els.settingsDialog.showModal()));
  els.audioBtn.addEventListener('click', () => { state.audioEnabled = !state.audioEnabled; els.settingAudio.checked = state.audioEnabled; applySettings(); saveState(false); showToast(state.audioEnabled ? '音效已开启' : '音效已关闭'); });
  els.hintBtn.addEventListener('click', openHintDialog);
  els.supportBtn.addEventListener('click', () => showSupport(false));
  els.notesBtn.addEventListener('click', () => { els.notesArea.value = state.notes; els.notesDialog.showModal(); });
  els.saveBtn.addEventListener('click', () => saveState(true));
  els.clueBoardBtn.addEventListener('click', () => { renderClueBoard(); els.clueDialog.showModal(); });
  els.clearNotesBtn.addEventListener('click', () => { if (confirm('确定清空便笺吗？')) { els.notesArea.value=''; state.notes=''; saveState(false); } });
  els.notesDialog.addEventListener('close', () => { state.notes = els.notesArea.value; saveState(false); });
  els.settingAudio.addEventListener('change', () => { state.audioEnabled = els.settingAudio.checked; applySettings(); saveState(false); });
  els.settingMotion.addEventListener('change', () => { state.reduceMotion = els.settingMotion.checked; applySettings(); saveState(false); });
  els.settingLargeText.addEventListener('change', () => { state.largeText = els.settingLargeText.checked; applySettings(); saveState(false); });
  els.manualSaveBtn.addEventListener('click', () => saveState(true));
  els.exportSaveBtn.addEventListener('click', exportSave);
  els.importSaveInput.addEventListener('change', e => { if (e.target.files[0]) importSave(e.target.files[0]); });
  els.resetGameBtn.addEventListener('click', () => { els.resetConfirmInput.value=''; els.confirmResetBtn.disabled=true; els.resetDialog.showModal(); });
  els.resetConfirmInput.addEventListener('input', () => { els.confirmResetBtn.disabled = els.resetConfirmInput.value.trim() !== '重新归乡'; });
  els.confirmResetBtn.addEventListener('click', resetGame);
  els.mobileCloseEvidence.addEventListener('click', () => $('.evidence-panel').classList.remove('open'));
  window.addEventListener('beforeunload', () => saveState(false));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && els.endingDialog.open) els.endingDialog.close();
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') { event.preventDefault(); saveState(true); }
  });
}

function init() {
  cacheElements();
  loadState();
  els.notesArea.value = state.notes;
  els.continueBtn.hidden = !state.started;
  els.newGameBtn.textContent = state.started ? '重新归乡' : '入堂启卷';
  applySettings();
  setupEvents();
  if (window.Paywall) window.Paywall._syncSupportButton(window.Paywall.hasPaid());
  if (state.started) {
    els.continueBtn.hidden = false;
  }
}

document.addEventListener('DOMContentLoaded', init);
