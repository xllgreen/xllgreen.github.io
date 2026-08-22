(() => {
  'use strict';

  const D = window.GAME_DATA;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  const E = {
    cover: $('#cover'), app: $('#gameApp'), newGame: $('#newGameBtn'), cont: $('#continueBtn'),
    page: $('#pageView'), url: $('#fakeUrl'), title: $('#pageTitle'), chapter: $('#chapterLabel'),
    progress: $('#progressBar'), eCount: $('#evidenceCount'), status: $('#statusText'), saveState: $('#saveState'),
    layout: $('.app-layout'), side: $('#sidePanel'), sideContent: $('#sideContent'), toast: $('#toast'),
    settingsDialog: $('#settingsDialog'), infoDialog: $('#infoDialog'), hintDialog: $('#hintDialog'), endingDialog: $('#endingDialog'),
    hintContent: $('#hintContent'), getHint: $('#getHintBtn')
  };

  const fresh = () => ({
    version: 8,
    started: false,
    current: 'mail',
    completed: {},
    evidence: [],
    hints: {},
    hintHistory: [],
    notes: '',
    settings: { intensity: 'standard', volume: 45, reduceMotion: false },
    audio: false,
    history: ['mail'],
    easter: [],
    visits: {},
    sequence: [],
    ending: null,
    savedAt: null,
    portalReads: {},
    readPages: {},
    wrongActions: 0,
    privacyProtected: null,
    finalEvidenceComplete: false
  });

  let state = fresh();
  let sideTab = 'evidence';
  let audioCtx = null;
  let ambientNodes = [];
  let portalView = null;
  let autoSupportTimer = null;

  const puzzleByPage = {
    staff: 'p1', handover: 'p2', call: 'p3', emr: 'p4', pacs: 'p5', maintenance: 'p6',
    cctv: 'p7', floorplan: 'p8', logs: 'p9', scene: 'p10', board: 'p11'
  };

  const PORTAL_LABELS = {
    home: ['首页', '⌂'],
    medical: ['医疗服务', '✚'],
    departments: ['科室导航', '▦'],
    guide: ['就医指南', '↗'],
    public: ['信息公开', '▤'],
    map: ['院内导航', '⌖']
  };

  const DEFAULT_PORTAL = {
    home: ['白塔医院首页', '白塔医院提供门急诊、住院、护理、医技与健康服务。网页保留医院概况、科室导航、就医服务、信息动态、院务公开和院内导航等栏目。'],
    medical: ['医疗服务', '门诊、住院、护理、检验、影像与药事业务分别由对应系统保存原始记录，系统之间以住院号和检查号关联。'],
    departments: ['科室导航', '七楼属于旧住院楼重症护理单元，护理岗位代码为 N；放射、药房与后勤记录由不同系统独立留痕。'],
    guide: ['就医指南', '旧住院楼七层设护士站、器械储藏室、氧气间与洗衣梯。2013年9月16日夜班23:30后停止普通探视。'],
    public: ['信息公开', '历史公告随网站改版迁入归档栏目，旧版镜像和版本库继续保留发布及修改记录。'],
    map: ['院内导航', '旧住院楼七楼平面图经历过三次备案调整；楼梯井和外墙位置未改变，可作为叠图基准。']
  };

  const PAGE_PORTAL = {
    mail: {
      home: ['白塔医院首页', '首页集中展示医疗服务、科室导航、就医指南、信息动态和院务公开，具体业务内容按所属栏目分别发布。'],
      public: ['历史公告索引', '旧版网站改版后，事故通报、职工荣誉与培训记录分别迁入不同归档栏目，发布时间也不完全相同。'],
      departments: ['护理单元历史资料', '七楼护理单元在旧系统中使用楼层与岗位代码组合标识；完整人员编号需与人事和培训归档共同核对。']
    },
    official: {
      home: ['白塔医院官网镜像', '2013年事故后医院对旧住院楼信息进行过多次整理。首页仍保留护理、人事、公告与患者服务入口。'],
      medical: ['患者服务·七楼', '2013年9月16日夜班23:30后七楼暂停探视，但系统仍记录到七份流食配送；该数量与公开床位表存在冲突。'],
      departments: ['科室导航·七楼护理单元', '旧住院楼七楼护理单元代码为 7F；护士岗位代码 N。员工编号的最后四位来自人员序号。'],
      public: ['院务公开·护理技能赛', '2012年第二届护理技能赛：一等奖杜蓉（11）；二等奖顾青禾（72）、苏岚（46）。顾青禾扫描件背面也写着“第二届护理技能赛”。'],
      guide: ['就医须知·旧楼', '事故当晚23:30后七楼进入封闭管理，普通家属加餐申请发生在次日，不应与当晚床位数量混为一谈。']
    },
    legacy: {
      public: ['2013年事故通报版本', '公开版写“六名重症患者死亡、一名护士失踪”。缓存差异只证明对象数量字段曾由7改为6；缓存中的修改人仅显示为匿名维护标识USR-04，无法据此确认对象身份或责任人。'],
      departments: ['科研目录残留', '被删除栏目只留下项目代号 WT-0713 与“夜间刺激观察”目录名。对象类型、项目全称、负责人和伦理状态均已从公开缓存移除，必须到后续业务系统核对。'],
      map: ['消防备案索引', '9月12日备案提到七楼新增“设备夹层”，但新版平面图没有显示对应房间。']
    },
    staff: {
      home: ['员工内网入口', '历史员工内网使用完整员工编号登录。账号编号由楼层、岗位代码和四位人员序号组成，临时密码由信息科按当时规则下发。'],
      departments: ['历史账号字段说明', '旧员工编号由工作单元、岗位代码和人员序号组成；扫描件损坏时需以同期人事、培训或排班资料复核。'],
      public: ['员工历史资料索引', '技能培训、岗位信息与账号迁移公告分别由护理部、人事处和信息科归档，可按年份与姓名查询。']
    },
    handover: {
      medical: ['住院膳食配送', '9月16日夜班七楼配送记录为七份流食；次日家属加餐发生在事故后，不能解释当晚数量。'],
      departments: ['医用气体监测', '六张登记床位合计25 L/min，但当晚总流量达到六床理论上限的117%，存在额外供氧对象。'],
      public: ['院感废物封签', '医疗废物系统留下未登记房间号 B7-0。膳食、供氧、废物三个独立系统同时指向“第七个护理对象”。']
    },
    call: {
      medical: ['护士呼叫系统说明', '呼叫线路、心跳模拟与氧气蜂鸣是三条独立轨道。规律心跳与每15秒氧气蜂鸣可被过滤，剩余脉冲为人工呼叫。'],
      departments: ['护理培训·摩斯表', '旧护士站培训手册将短闪记为点、长闪记为划；较长停顿分组。常用 SOS = ··· ——— ···。'],
      guide: ['事故夜线路状态', '00:17附近呼叫线仍有供电，且同一段信息反复强调 O₂；后续恢复设备时不要先恢复总电源。']
    },
    emr: {
      medical: ['病历摘要', '患者0713：林祈，17岁，42kg，右膝旧伤。事故夜病历记录“醒宁2.04mL”。'],
      departments: ['药事培训公式', '醒宁剂量0.06mg/kg，药液浓度2mg/mL；体积 = 体重 × 0.06 ÷ 2。'],
      public: ['护理与药房交叉记录', '责任护士杜蓉连续照护0713共37天，并三次申请终止夜间刺激，均被项目审批账号以“数据完整性”为由驳回。另有B6-04患者68kg、领用2.04mL的药房记录；若0713理论体积不同，说明病历字段可能被复制。审批账号的真实归属需到后续值班索引核对。']
    },
    pacs: {
      medical: ['PACS影像中心', 'PACS质控要求身份复核同时参考住院号、既往稳定骨性特征和设备原始信息，不能只依赖屏幕方向标记。'],
      departments: ['影像质控', '第二张影像方向标签存在翻转痕迹。将图像旋转180°并提高亮度、对比度后更容易比较旧伤位置。'],
      public: ['档案编号规则', '本组历史影像归档编号为0713。质控记录注明：同一患者的既往骨折位置在不同检查中应保持一致。']
    },
    maintenance: {
      medical: ['设备时间校准', '不同设备使用独立时钟：七楼监控慢8分40秒；洗衣梯控制器快1分20秒；大厅监控为标准时。'],
      guide: ['校准原则', '设备校时制度规定：慢于标准时钟的设备按偏差量回补，快于标准时钟的设备按偏差量扣减，维修报告记录校准后的标准时间。'],
      public: ['关键时间窗', '真正关键的是00:17—00:27十分钟：呼叫、洗衣梯、控制室、切氧和离院均发生在该窗口。']
    },
    cctv: {
      medical: ['病历稳定特征', '0713患者林祈的康复记录写有“右膝伸展末端受限，快走时右侧支撑相缩短”；顾青禾员工体检未记录步态异常。'],
      departments: ['护理制服登记', '顾青禾制服登记为S码，肩宽38cm、袖长55cm。值班备用护士服为M码，肩宽41cm、袖长58cm。'],
      public: ['腕带材质说明', '2013版住院腕带采用窄幅反光覆膜，强光下会形成连续亮环；护士袖口标识为织物刺绣，不会形成环形反光。']
    },
    news: {
      home: ['地方新闻库', '事故后的公开叙事主要来自院方通报与一张大厅监控截图，新闻稿没有披露制服尺码、腕带等身份细节。'],
      public: ['未刊更正来函', '记者曾收到匿名更正：“那个人不是顾青禾。请查洗衣房与旧图纸。”该来函未正式发表。'],
      map: ['院内通行记录', '未刊来函正文同时提到“洗衣房”和“旧图纸”，新闻库按原件保留该段文字。']
    },
    floorplan: {
      map: ['三版图纸叠合', '固定楼梯井和外墙后，旧图与新图的差异集中在设备间与旧手术室之间。'],
      departments: ['氧气管线', '旧氧气支管穿过器械储藏室后进入一块新版图纸中被抹去的空间。'],
      public: ['消防备案', '2013年9月12日消防备案标注“设备夹层”，其边界位于器械储藏室与旧手术室之间，并设有内部维护入口。']
    },
    logs: {
      public: ['版本审计规则', '跨过午夜的记录必须同时保留日期。身份显示字段、转运准备字段、死亡确认字段和公开通报字段不能被合并为同一种操作。'],
      departments: ['值班账号索引', '2013-09-16夜班账号：durong_n＝责任护士杜蓉；zhaobw_admin＝项目负责人兼系统管理员赵秉文。账号索引来自当夜排班签字页。'],
      medical: ['字段组说明', 'person与transfer字段属于身份/转运；death、dose、access与notice字段分别属于死亡、用药、门禁与公开通报。修改范围越跨系统，权限级别越高。']
    },
    scene: {
      medical: ['B7-0旧设备安全说明', '总电源恢复会自动复位旧阀门。若氧气尚未旁路恢复，先送总电可能造成供氧中断。'],
      guide: ['恢复顺序', '旧设备恢复规程要求先确认备用氧气旁路，再恢复应急电源；呼叫线路需保持在线，隔离门在最后确认后开启。'],
      departments: ['隔离门联锁', '隔离门最后打开。呼叫线路在门开启前不能断开，否则无法确认室内人员状态。']
    },
    board: {
      home: ['病案质量与历史归档', '重大事件病案归档要求分别记录患者身份、离院状态、死亡确认、身份信息更正、系统修改和设备操作责任，不得以单一汇总字段代替过程记录。'],
      public: ['信息公开与隐私保护', '院务公开应在说明事实经过的同时保护无关个人信息。涉及幸存患者现身份、联系方式和后续生活的信息不属于常规公开范围。'],
      medical: ['证据链复核规则', '最终报告必须让床位、呼叫、病历、影像、标准时间、监控身份、图纸、审计账号和设备联锁相互支持。任何单一证词都不能替代完整过程记录。']
    }
  };

  function setViewport() {
    document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
  }
  addEventListener('resize', setViewport, { passive: true });
  addEventListener('orientationchange', () => setTimeout(setViewport, 150));
  setViewport();

  function load() {
    try {
      const raw = localStorage.getItem(D.saveKey);
      if (!raw) return null;
      const x = JSON.parse(raw);
      return Object.assign(fresh(), x, {
        settings: Object.assign(fresh().settings, x.settings || {}),
        portalReads: x.portalReads || {},
        readPages: x.readPages || {}
      });
    } catch (e) {
      console.warn(e);
      try {
        const b = localStorage.getItem(D.saveKey + '_backup');
        return b ? Object.assign(fresh(), JSON.parse(b)) : null;
      } catch {
        return null;
      }
    }
  }

  function save(auto = true) {
    try {
      const old = localStorage.getItem(D.saveKey);
      if (old) localStorage.setItem(D.saveKey + '_backup', old);
      state.savedAt = new Date().toISOString();
      localStorage.setItem(D.saveKey, JSON.stringify(state));
      E.saveState.textContent = `${auto ? '自动' : '手动'}存档 ${new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}`;
      if (!auto) toast('进度已保存到本机浏览器');
      updateContinue();
    } catch (e) {
      toast('存档失败：浏览器可能禁用了本地存储');
      console.error(e);
    }
  }

  function updateContinue() { E.cont.disabled = !(load()?.started); }

  function startNew() {
    if (load()?.started && !confirm('开始新游戏会覆盖现有进度，确定继续吗？')) return;
    state = fresh();
    state.started = true;
    save();
    enter();
    go('mail');
  }

  function continueGame() {
    const s = load();
    if (!s) return;
    state = s;
    enter();
    applySettings();
    go(state.current || 'mail', false);
  }

  function enter() {
    E.cover.classList.add('hidden');
    E.app.classList.remove('hidden');
    updateProgress();
    renderSide();
    applySettings();
  }

  function meta(id) { return D.pages.find(p => p.id === id); }
  function unlocked(id) {
    const r = D.pageUnlock[id];
    if (r === true) return true;
    if (Array.isArray(r)) return r.every(key => !!state.completed[key]);
    return !!state.completed[r];
  }

  function go(id, record = true) {
    if (!unlocked(id)) { toast('该院内页面暂未取得访问权限'); return; }
    portalView = null;
    state.current = id;
    state.visits[id] = (state.visits[id] || 0) + 1;
    state.readPages[id] = true;
    if (record && state.history.at(-1) !== id) state.history.push(id);
    const p = meta(id);
    E.url.textContent = p.url;
    E.title.textContent = p.title;
    E.chapter.textContent = p.chapter;
    E.page.className = 'page-view';
    renderPage(id);
    updateProgress();
    save();
    if (Object.keys(state.completed).filter(k => state.completed[k]).length >= 1) scheduleAutoSupport();
    requestAnimationFrame(() => E.page.scrollTo({ top: 0, behavior: 'auto' }));
  }

  function renderNav() { /* 调查页左栏已取消，页面只通过站内链接与院内系统入口导航。 */ }

  function renderPage(id) {
    ({ mail, official, legacy, staff, handover, call, emr, pacs, maintenance, cctv, news, floorplan, logs, scene, board }[id] || mail)();
    bindCommon();
  }

  function bindCommon() {
    $$('[data-goto]', E.page).forEach(b => b.onclick = () => go(b.dataset.goto));
    $$('[data-easter]', E.page).forEach(b => {
      if (state.easter.includes(b.dataset.easter)) b.classList.add('found');
      b.onclick = () => addEaster(b.dataset.easter, b);
    });
    $$('[data-portal]', E.page).forEach(b => { b.onclick = () => showPortalInfo(b.dataset.portal); });
    $$('[data-site-article]', E.page).forEach(b => { b.onclick = () => showPortalArticle(+b.dataset.siteArticle); });
    $$('[data-return-source]', E.page).forEach(b => { b.onclick = returnFromPortal; });
    $$('[data-toggle-detail]', E.page).forEach(b => {
      b.onclick = () => {
        const target = $('#' + b.dataset.toggleDetail, E.page);
        if (!target) return;
        if (b.classList.contains('email-item')) {
          // 邮箱采用真实邮件客户端的单条阅读逻辑：切换邮件时先隐藏其它正文。
          $$('.email-item', E.page).forEach(x => {
            const panel = $('#' + x.dataset.toggleDetail, E.page);
            if (panel) panel.hidden = panel !== target;
            x.classList.toggle('active', x === b);
            x.setAttribute('aria-expanded', String(x === b));
          });
          target.hidden = false;
          target.scrollTop = 0;
        } else {
          const isHidden = target.hidden;
          target.hidden = !isHidden;
          b.setAttribute('aria-expanded', String(isHidden));
          b.textContent = isHidden ? '收起详情' : '查看详情';
        }
      };
    });
  }

  function updateProgress() {
    const done = Array.from({length:11}, (_,i) => `p${i+1}`).filter(k => state.completed[k]).length;
    E.progress.style.width = Math.max(3, Math.round(done / 11 * 100)) + '%';
    E.eCount.textContent = state.evidence.length;
  }

  function status(t) { E.status.textContent = t; }
  function toast(t) {
    E.toast.textContent = t;
    E.toast.classList.add('show');
    clearTimeout(toast.t);
    toast.t = setTimeout(() => E.toast.classList.remove('show'), 2200);
  }

  function addEvidence(id) {
    if (!D.evidence[id] || state.evidence.includes(id)) return;
    state.evidence.push(id);
    save(); updateProgress(); renderSide();
    toast(`证据板已记录：${D.evidence[id].name}`);
  }

  function addEaster(id, n) {
    if (state.easter.includes(id)) return;
    state.easter.push(id);
    n?.classList.add('found');
    save();
    toast(`发现残留编号碎片 ${state.easter.length}/6`);
    if (state.easter.length === 6) addEvidence('e22');
  }

  function complete(k, ev = [], msg = '谜题已解决') {
    if (state.completed[k]) return;
    state.completed[k] = true;
    ev.forEach(addEvidence);
    updateProgress(); save(); renderSide();
    toast(msg);
    if (k === 'p1') scheduleAutoSupport();
  }

  function result(id, ok, t) {
    const n = $('#' + id, E.page);
    if (n) n.innerHTML = `<div class="${ok ? 'success-box' : 'error-box'}">${t}</div>`;
  }

  const SITE_ARTICLES = {
    medical: [
      {
        title:'门诊与综合医疗服务', date:'2013-09-17', department:'医务处', image:'assets/hospital_day_exterior.webp', caption:'2013年白塔医院院区',
        body:[
          '白塔医院门诊服务按预约、分诊、候诊、诊疗、检查和复诊环节组织。普通门诊由一层大厅统一分诊，专科门诊按楼层设置候诊区；需进一步检查的患者由接诊科室开具申请后前往对应医技区域。夜间急诊实行独立入口和连续值守，门诊区域关闭后不再承担急诊分流。',
          '院内各业务系统分别记录挂号、护理、检验、影像和药事信息。为避免重复录入，患者住院号作为主要索引，但不同系统保留各自生成的原始时间戳和操作人记录。纸质申请单、业务系统记录与归档扫描件如存在时间差，以业务发生时的原始记录为准。',
          '2013年旧住院楼仍保留部分历史服务流程，其中七楼护理单元、影像中心、药房与后勤设备均由不同部门维护。涉及跨科室转运或夜间护理时，相关信息会分别留存在护理、门禁、设备和医技系统中。'
        ]
      },
      {
        title:'住院服务与探视管理', date:'2013-09-16', department:'住院处', image:'assets/portal/scenes/ward.webp', caption:'2013年普通住院病房',
        body:[
          '住院患者办理入院后，由住院处完成身份核验并生成住院号和腕带信息，随后由病区护士站接收入科。特殊护理单元需再次核对患者姓名、住院号、腕带和床位，转床、转科或临时观察均须在交接记录中注明时间与责任人。',
          '普通病区探视时间原则上安排在白天和晚间固定时段。重症、隔离及设备密集区域可根据医疗安全需要临时限制探视，封闭管理期间家属物品由指定窗口登记后转交。夜间病区如需临时调整探视安排，应由病区负责人和值班保卫共同记录。',
          '住院膳食、氧气、护理耗材和医疗废物分别由不同岗位登记。床位调整后，服务项目可能出现短时的系统不同步，因此病区在每日交班时需核对床位、膳食、供氧和腕带信息，避免因单一系统显示滞后造成误认。'
        ]
      },
      {
        title:'护理服务与交接班制度', date:'2013-09-15', department:'护理部', image:'assets/normal_nurse_station.webp', caption:'夜班护士站交接工作区',
        body:[
          '护理工作实行责任制分组管理。每个护理单元在交班时核对在院患者、重点观察对象、氧疗情况、静脉通路、特殊用药及未完成医嘱，并将无法通过常规床位表完整体现的临时观察事项单独列入交接记录。',
          '夜班交接除口头说明外，还需核对护士站系统、纸质交班本和床旁标识。涉及临时转运、身份信息变更或特殊抢救时，交班人员应注明操作发生的准确时间，避免后续班次仅依据汇总名单判断患者状态。',
          '护理部要求重大异常事件保留原始交班资料，不得以事后整理的汇总表替代当班记录。旧住院楼历史数据中，护士站系统和纸质记录曾并行使用，部分字段会因系统升级出现格式差异。'
        ]
      },
      {
        title:'检查检验预约与报告查询', date:'2013-09-14', department:'医技管理办公室', image:'assets/radiology_control_room.webp', caption:'放射科控制室与检查间',
        body:[
          '检验、放射、超声等检查由开单科室提出申请，患者信息通过住院号或门诊号传入医技系统。检查完成后，报告在业务系统中独立生成，并保留设备编号、检查时间、操作人员和审核人员等信息。',
          '影像资料除文字报告外，还包括原始图像和设备侧信息。患者体位、拍摄角度或图像翻转可能改变画面方向，但既往骨折、植入物等稳定特征通常不会随显示方向改变。历史影像如进行重新导出，系统仍应保留原始归档编号。',
          '检验及影像系统在网络中断时可暂存本机数据，网络恢复后再同步至中心服务器。遇到时间记录不一致时，科室会同时检查设备时钟、服务器接收时间和报告审核时间，以判断真实先后顺序。'
        ]
      },
      {
        title:'药事服务与用药管理', date:'2013-09-13', department:'药学部', image:'assets/pharmacy_window.webp', caption:'住院药房调配窗口',
        body:[
          '住院用药由医生下达医嘱，药房根据患者体重、药物浓度和给药途径进行调配核对。需按体重计算剂量的药物，应在医嘱和护理执行记录中同时保留体重、剂量、浓度和实际给药体积，任何一个字段变化都需要重新计算。',
          '药房领用记录以病区和患者为索引，退药、补领和抢救备用药均有独立状态。若出现相同体积被用于不同体重患者的情况，药师需核查是否为模板复制、录入错误或临时借药，并在复核记录中注明原因。',
          '旧住院楼药柜采用病区定数管理，抢救药由夜班护士和药房共同盘点。重大事件发生后，药品领用单、电子医嘱和护理执行单均应保留，不得仅以最终病历首页替代。'
        ]
      }
    ],
    departments: [
      {
        title:'内科系统', date:'2013-09-17', department:'医务处', image:'assets/portal/scenes/laboratory.webp', caption:'内科相关检验工作区',
        body:[
          '白塔医院内科系统由呼吸、神经、心血管、肾脏等专业组成，承担门诊、住院和会诊工作。不同专业病区按护理级别配置床位和护士站，需进行跨科会诊时由主管医生发起申请并记录会诊时间。',
          '旧住院楼部分高依赖患者由内科医生与七楼护理单元共同管理。病情变化时，医生记录主要诊疗判断，护士站记录生命体征、氧疗和护理操作，两类记录的生成时间和维护系统并不完全相同。',
          '科室调整或床位临时借用时，患者所在楼层可能与主管科室不一致。医院要求通过住院号和腕带确认身份，不以房间号或床位名称作为唯一识别依据。'
        ]
      },
      {
        title:'急重症医学部', date:'2013-09-16', department:'急重症医学部', image:'assets/portal/scenes/icu.webp', caption:'急重症监护区域',
        body:[
          '急重症医学部负责急诊抢救、重症监护及院内急危重症协作。旧住院楼七楼曾设置重症护理单元，与急诊、麻醉和设备科保持夜间联络，发生突发事件时可启动备用供氧和应急电源。',
          '重症区域采用更严格的人员和设备管理。除医生、护士外，进入封闭护理区的后勤和维修人员也需登记时间；患者转运时必须同步核对腕带、护理记录和必要设备，防止在紧急情况下发生身份混淆。',
          '夜间突发停电等事件中，病区首先保证呼吸支持、监护和呼叫线路。恢复设备时需按设备安全规程逐项确认，避免总电源复位导致阀门、门禁或老旧联锁装置同时动作。'
        ]
      },
      {
        title:'医技科室', date:'2013-09-15', department:'医技管理办公室', image:'assets/radiology_control_room.webp', caption:'影像设备控制区域',
        body:[
          '医技科室包括放射诊断、检验医学、超声及功能检查等部门。各系统独立保存设备信息和操作日志，报告上传至医院信息平台后仍保留原系统中的检查编号。',
          '放射影像在调阅时可进行旋转、窗宽窗位和对比度调整，这些显示操作不会改变原始影像文件。历史影像如存在方向标记异常，工作人员应结合骨性结构、既往损伤和设备日志进行核对。',
          '检验和影像区域夜间通常保留值班人员，急诊检查可通过绿色通道完成。重大异常时期的设备启动、报告生成和归档时间可用于复原当晚医技系统的运行状态。'
        ]
      },
      {
        title:'护理部', date:'2013-09-14', department:'护理部', image:'assets/portal/scenes/training_room.webp', caption:'护理技能培训教室',
        body:[
          '护理部负责护士岗位管理、排班、业务培训、护理质量和技能考核。员工编号按工作单元、岗位类别和人员序号组合生成，内部人事系统同时保存制服尺码、培训记录和岗位变更历史。',
          '技能竞赛和培训成绩属于护理业务档案的一部分，获奖名单会在院内网站公布。人员调岗后，历史技能记录仍保留原姓名和当时编号，因此可与同期员工证、排班表和岗位登记互相对应。',
          '夜间护理强调身份核验和交接连续性。对于发生过临时调床、抢救或人员替换的班次，护理部要求同时保留当班交接、门禁与患者腕带记录。'
        ]
      },
      {
        title:'药学部与医疗保障', date:'2013-09-13', department:'药学部 / 后勤保障处', image:'assets/oxygen_valve_room.webp', caption:'医用气体保障阀门间',
        body:[
          '药学部负责处方审核、住院药品调配和抢救药品管理，后勤保障处负责医用气体、供电、物流和部分专用设备维护。两类部门在临床抢救中互相配合，但业务记录分别保存在药事和设备系统中。',
          '医用氧气管线按照楼层和区域设置阀门，病区日常监测总流量并记录异常波动。设备维修涉及供氧、备用电或门禁联锁时，应由临床人员确认患者安全后再进行操作。',
          '旧住院楼的部分设备层和物流通道在后期改造中用途发生变化。后勤档案通常保留原始施工图、消防验收和维修记录，可用于确认旧设备位置和通行关系。'
        ]
      }
    ],
    guide: [
      {
        title:'门诊就医流程及就诊须知', date:'2013-09-17', department:'门诊部', image:'assets/portal/scenes/registration.webp', caption:'门诊挂号与收费窗口',
        body:[
          '门诊患者可在服务台完成预约确认、取号和分诊。首次就诊需核对有效身份信息，复诊患者可使用原就诊号调阅历史记录。医生开具检查后，患者按申请单指引前往相应医技区域，结果返回后再由接诊医生综合判断。',
          '门诊大厅与住院区域使用不同的人员流线，普通门诊结束后部分通道会关闭。夜间需要急诊处理的患者应从急诊入口进入，不建议经住院楼内部通道往返，以免影响病区门禁管理。',
          '特殊时期或楼宇调整期间，医院会通过公告栏和网站发布临时路线。患者应以当日现场指引为准，并保留缴费、检查和取药凭证便于后续查询。'
        ]
      },
      {
        title:'急诊就医流程及就诊须知', date:'2013-09-16', department:'急诊部', image:'assets/hospital_night_exterior.webp', caption:'夜间急诊入口',
        body:[
          '急诊实行24小时分诊制度。到院后先由分诊护士评估生命体征和紧急程度，危重患者直接进入抢救区，病情相对稳定者按分级顺序候诊。必要时可同时启动检验、影像和专科会诊。',
          '急诊转入住院病区时，须交接患者身份、诊疗经过、用药和随身物品。夜间转运通过指定电梯和通道进行，门禁系统记录刷卡时间，但该记录仅代表通道被使用，不单独代表具体人员身份。',
          '重大突发事件中，急诊与重症护理单元可共享应急资源。院内要求所有临时转运、备用氧气启用和抢救药领用在事后补全原始记录。'
        ]
      },
      {
        title:'住出院流程及住出院须知', date:'2013-09-15', department:'住院处', image:'assets/portal/scenes/ward.webp', caption:'住院病区病房',
        body:[
          '患者办理住院时由住院处核对身份并分配住院号，进入病区后由护士再次核对腕带和床位。出院时需完成医嘱确认、费用结算、药物领取和腕带注销，特殊情况下的转院或临时离院须有单独记录。',
          '病区门禁刷卡用于控制通行，不等同于出院确认。工作人员、患者陪同人员和后勤人员均可能在不同时间使用指定通道，因此涉及离院身份时仍应结合腕带、服装、护理记录和大厅影像核实。',
          '夜间发生紧急转运时，可先保障医疗安全后补办部分行政手续，但事后必须由责任科室补记时间、去向和交接人。住院处保留最终离院记录，病区则保存更细的过程信息。'
        ]
      },
      {
        title:'病历复印与影像资料申请', date:'2013-09-14', department:'病案室', image:'assets/portal/scenes/records_service.webp', caption:'病案复印服务窗口',
        body:[
          '出院病历完成质控后由病案室统一归档。申请复印时需提供患者身份信息和住院号，复印范围按规定包含病案首页、医嘱、检查报告及相关护理记录。未完成归档的材料需由原科室补齐后方可正式出具。',
          '影像资料由PACS系统单独保存，病历复印件中的影像报告不等同于原始影像。申请历史影像时应同时核对检查号、设备信息和患者住院号，以防不同患者资料因编号录入错误被误关联。',
          '病案室保留病历版本变更痕迹。事故或医疗质量复核期间，已归档材料原则上不得覆盖原始内容，必要的更正应以追加说明方式保留。'
        ]
      },
      {
        title:'夜间探视与特殊病区管理', date:'2013-09-13', department:'护理部 / 保卫处', image:'assets/hospital_night_exterior.webp', caption:'夜间住院楼入口',
        body:[
          '普通住院楼夜间实行安静管理，超过规定时间后原则上停止普通探视。重症和特殊护理单元可根据病情进一步限制人员进入，家属确需进入时由病区护士确认并登记。',
          '封闭管理期间，门禁刷卡、护理站记录和保卫巡查分别留痕。病区临时物品配送通常在指定位置完成，家属次日提交的加餐或生活用品申请不计入前一夜的病区配送数量。',
          '旧住院楼七层在2013年9月曾执行过夜间封闭管理。相关通道包括普通楼梯、医护电梯和内部物流通道，各通道的使用范围并不相同。'
        ]
      }
    ],
    public: [
      {
        title:'院务公开与服务信息', date:'2013-09-17', department:'院办公室', image:'assets/portal/scenes/meeting_room.webp', caption:'医院行政会议室',
        body:[
          '白塔医院通过网站和院内公告栏发布服务时间、收费说明、楼宇调整、制度更新及重要工作信息。正式公告由责任部门拟稿，院办公室审核后发布，并保留发布时间和经办账号。',
          '网站改版过程中，历史公告会迁入归档栏目。旧版网页、缓存文件和最终发布稿可能因格式调整存在差异，但涉及重大事件的修改应保留版本记录和修改时间。',
          '院务公开栏目同时收录护理质量、设备改造和部分人事表彰信息。不同部门发布的信息采用各自业务口径，页面日期指网站发布时间，不一定等同于业务发生时间。'
        ]
      },
      {
        title:'护理质量与技能培训', date:'2013-09-16', department:'护理部', image:'assets/portal/scenes/training_room.webp', caption:'护理技能培训教室',
        body:[
          '护理部每年组织岗位培训、理论考试和操作技能考核，并根据成绩进行表彰。技能赛报名资料包括姓名、工作单元、个人序号和竞赛编号，获奖名单会在院内网站公示。',
          '培训档案用于确认护士当时的岗位和业务资格。人员后续调岗或离职不会覆盖原始获奖信息，因此历史名单可与同期员工证和排班信息对应。',
          '第二届护理技能赛在2012年举行，比赛资料沿用当年的人员编号体系。院内归档中仍保留获奖人员名单和部分扫描材料。'
        ]
      },
      {
        title:'历史公告与停诊通知', date:'2013-09-15', department:'院办公室', image:'assets/archive_room.webp', caption:'历史网页与纸质档案存放区',
        body:[
          '医院网站对停诊、楼宇调整、探视变化和重大事件通报实行分类发布。公告发布后如需修订，原则上应保留原发布时间并注明更新时间，避免读者将修订内容误认为最初版本。',
          '2013年前后的旧版网站曾进行过栏目迁移，部分页面在现行网站只能通过历史归档访问。归档服务器保存页面源文件、发布时间和最后修改账号，用于网站维护和信息追溯。',
          '事故类公告通常由多个部门提供材料后统一发布。公开通报反映最终审核口径，而病区、设备和业务系统仍保留各自更细的过程记录。'
        ]
      },
      {
        title:'设备改造与消防备案', date:'2013-09-14', department:'后勤保障处', image:'assets/portal/scenes/fire_exit.webp', caption:'旧楼消防楼梯与疏散通道',
        body:[
          '医院楼宇改造涉及消防、供电、医用气体和疏散通道时，施工图、变更单和验收记录需分别归档。涉及住院区域的工程还需提前向临床科室说明施工范围和临时通行方案。',
          '旧住院楼在长期使用中曾多次调整设备间、储藏室和物流空间。消防备案通常以楼梯井、外墙和主要疏散通道作为固定参照，局部功能改变不会随意移动这些结构。',
          '2013年9月的设备备案资料中出现过“设备夹层”名称。后续版本平面图对部分内部功能进行了合并标注，但原施工和消防资料仍按当时名称存档。'
        ]
      },
      {
        title:'职工荣誉与岗位信息', date:'2013-09-13', department:'人事处', image:'assets/portal/scenes/records_service.webp', caption:'历史职工档案服务窗口',
        body:[
          '医院职工岗位信息由人事处统一维护，护理、医技和后勤人员的业务培训记录由对应部门补充。网站公开范围主要包括先进个人、技能竞赛、业务表彰和部分岗位招聘信息。',
          '历史员工编号由工作单元和人员序号组成，同一人员在岗位调整后可能出现新的部门标识，但原始档案不会删除。制服尺码、职业资格和培训记录属于内部人事信息，不在普通公开页面展示。',
          '荣誉公示中的竞赛编号与员工编号属于不同字段。2012年第二届技能赛归档迁移时，完整四位人员序号按“入职批次14 + 竞赛登记号后两位”生成；仍需按姓名、年份和工作单元确认对应关系。',
          '2013年员工服务平台切换期间，信息科对尚未完成口令迁移的历史账号使用一次性临时口令：登记姓名中的“名”取拼音首字母两位，再接最近值班日期的月日四位；首次登录后即要求改密。该规则仅适用于当年的旧平台镜像。'
        ]
      }
    ],
    map: [
      {
        title:'院区楼宇分布', date:'2013-09-17', department:'后勤保障处', image:'assets/hospital_day_exterior.webp', caption:'白塔医院院区楼宇实景',
        body:[
          '白塔医院院区由门诊楼、医技楼、住院楼、旧住院楼及后勤保障区域组成。患者主要通过门诊和住院大厅进入，急诊、污物运输和设备维修使用相对独立的通道，以减少交叉。',
          '旧住院楼位于院区北侧，楼内设置普通楼梯、医护电梯和内部物流设施。后期新住院楼投入使用后，旧楼部分区域逐步停止常规使用，但设备和档案在一段时间内仍保留。',
          '院区地图以楼宇外轮廓和主要道路为准。内部房间调整不会改变楼宇外墙和楼梯井的位置，因此历史图纸对照时可使用这些固定结构作为参照。'
        ]
      },
      {
        title:'旧住院楼导引', date:'2013-09-16', department:'后勤保障处', image:'assets/laundry_lift.webp', caption:'旧楼后勤通道与洗衣梯',
        body:[
          '旧住院楼采用分层护理结构，七层曾设置重症护理单元、护士站、器械储藏区及若干设备空间。医护人员和患者主要使用中央电梯及楼梯，物流则通过内部专用设施运送。',
          '楼层功能调整后，部分门牌和房间用途曾发生变化。医院导引图以对外使用区域为主，不会详细标示设备夹层、管井和封闭储藏空间。',
          '查询旧楼历史位置时，应以当年楼层图和消防资料为准。器械储藏室、氧气管线和设备空间之间存在维护通道，日常并不对患者开放。'
        ]
      },
      {
        title:'无障碍与消防通道', date:'2013-09-15', department:'保卫处 / 后勤保障处', image:'assets/portal/scenes/fire_exit.webp', caption:'旧楼消防疏散楼梯',
        body:[
          '医院公共区域设置无障碍通道和消防疏散标识。住院楼疏散以楼梯井、防火分区和外部集合点为核心，任何内部装修不得占用消防通道或改变主要疏散口。',
          '消防图纸中的楼梯井、外墙和防火门位置属于重要固定信息。房间用途或隔墙调整时，新的平面图会重新标注功能名称，但固定结构通常保持不变。',
          '设备层、管井等非公共空间需要授权进入。发生停电或火警时，部分防火门和门禁会进入应急状态，保卫和后勤人员需按现场情况确认通行。'
        ]
      },
      {
        title:'院内交通与物流通道', date:'2013-09-14', department:'后勤保障处', image:'assets/hospital_corridor.webp', caption:'旧楼内部物流通道',
        body:[
          '院内交通分为患者通行、医护转运和后勤物流三类。布草、餐食和医疗废物使用指定路线，避免与门诊患者流线长时间交叉。旧住院楼曾设置内部洗衣梯和污物通道。',
          '物流设施的控制器独立记录运行时间，设备时钟由后勤定期校准。控制器时间与监控服务器时间可能存在偏差，维修记录会注明校准量和处理日期。',
          '夜间物流频次较低，但紧急情况下可临时用于物资或设备转运。相关门禁和设备日志只记录通道或设备被使用，需要结合当班人员和业务记录确定具体用途。'
        ]
      },
      {
        title:'医技与后勤区域导引', date:'2013-09-13', department:'后勤保障处', image:'assets/oxygen_valve_room.webp', caption:'医气保障区域实景',
        body:[
          '医技楼与住院区域通过连廊和内部通道连接，便于急诊影像、检验标本和设备物资快速转运。后勤区域则集中设置供电、医用气体、洗衣和维修设施。',
          '医用气体主管线进入楼宇后按楼层分支，设备间负责阀门和压力监测。旧楼改造期间部分管线经过器械储藏区和封闭设备空间，因此后勤图纸比公开导引图包含更多内部结构。',
          '普通患者导引不会标示后勤检修入口。维修和消防备案资料中使用的空间名称可能与临床习惯称呼不同，查阅历史图纸时需注意同一位置在不同部门文件中的命名差异。'
        ]
      }
    ]
  };

  const CATEGORY_CONTEXT = {
    medical:['医疗服务信息由医务、护理、医技及药学等部门按业务范围维护。','服务记录以当时业务系统和科室原始登记为基础，后续汇总页面不会覆盖原始操作信息。'],
    departments:['科室介绍用于说明职责范围、人员归属和业务协作关系。','历史岗位和科室调整均保留原始归档，便于连续查询同一人员或业务单元。'],
    guide:['就医指南按患者实际办理流程编写，并根据楼宇和管理制度变化进行更新。','夜间及特殊病区管理以当时有效制度为准，临时调整由责任部门另行登记。'],
    public:['信息动态由院办公室汇总发布，来源包括临床、护理、后勤和人事等部门。','历史页面更新会保留发布时间、修改时间和经办信息，原始业务资料仍由责任部门保存。'],
    map:['院内导航以公共通行和患者服务为主，设备和检修空间不会全部对外标示。','历史楼宇调整可通过消防、施工和后勤图纸确认固定结构与功能变化。']
  };

  function portalNav() {
    return `<nav class="site-menu" aria-label="医院网站主导航">
      <button type="button" class="portal-link" data-portal="home">首页</button>
      <button type="button" class="portal-link" data-portal="departments">科室导航</button>
      <button type="button" class="portal-link" data-portal="medical">就医服务</button>
      <button type="button" class="portal-link" data-portal="guide">就医指南</button>
      <button type="button" class="portal-link" data-portal="public">信息动态</button>
      <button type="button" class="portal-link" data-portal="map">院内导航</button>
      <button type="button" class="portal-link staff-portal-link" data-goto="staff">员工入口</button>
    </nav>`;
  }

  function portalQuick() { return ''; }
  function portalPanel() { return ''; }

  function hospitalHeader(title = '白塔医院', sub = '守护生命 · 照亮长夜', mark = '十') {
    return `<div class="hospital-topline"><span>欢迎访问白塔医院官方网站</span><span>门诊服务 08:00—17:00　|　急诊 24小时</span></div>
      <header class="site-head">
        <div class="mark" aria-hidden="true">${mark}</div>
        <div class="site-brand"><h1>${title}</h1><p>${sub}</p></div>
        <div class="site-trust"><b>白塔医院</b><small>医疗服务 · 科室导航 · 信息公开</small></div>
      </header>${portalNav()}`;
  }

  function footerHtml() {
    return `<footer class="hospital-footer"><span>白塔医院 · 门诊咨询 010-5611XXXX</span><span>信息服务 · 隐私保护 · 网站地图</span></footer>`;
  }

  function currentPortalInfo(key) {
    return (PAGE_PORTAL[state.current] && PAGE_PORTAL[state.current][key]) || DEFAULT_PORTAL[key] || ['服务信息','暂无更多信息。'];
  }

  function portalArticles(key) {
    const templates = SITE_ARTICLES[key] || SITE_ARTICLES.public;
    const [t, dynamicBody] = currentPortalInfo(key);
    return templates.map((a, i) => {
      const copy = { ...a, body: [...a.body], primary: i === 0 };
      if (i === 0) {
        copy.title = t;
        const ctx = CATEGORY_CONTEXT[key] || CATEGORY_CONTEXT.public;
        copy.body = [ctx[0], dynamicBody, ...a.body.slice(0, 2), ctx[1]];
      }
      return copy;
    });
  }

  function showPortalInfo(key) {
    if (!PORTAL_LABELS[key]) key = 'home';
    portalView = { source: state.current, key, article: null };
    state.portalReads[state.current] = state.portalReads[state.current] || [];
    if (!state.portalReads[state.current].includes(key)) state.portalReads[state.current].push(key);
    save();
    if (key === 'home') return renderHospitalHome();
    renderPortalList(key);
  }

  function renderHospitalHome() {
    E.url.textContent = 'www.baita-hospital.cn/';
    E.title.textContent = '白塔医院官方网站';
    const source = state.current;
    E.page.className = 'page-view';
    E.page.innerHTML = `<div class="site-shell">${hospitalHeader()}
      <main class="public-home">
        <section class="home-hero">
          <img src="assets/hospital_day_exterior.webp" alt="2013年白塔医院院区外景">
          <div class="home-hero-copy"><span>白塔医院</span><h2>以患者为中心，以质量为核心</h2><p>门急诊、住院、护理、医技与健康服务信息统一发布。</p></div>
        </section>
        <section class="home-services" aria-label="快捷服务">
          <button data-portal="medical"><b>就医服务</b><span>门诊、住院、护理与检查</span></button>
          <button data-portal="departments"><b>科室导航</b><span>临床、护理与医技科室</span></button>
          <button data-portal="guide"><b>就医指南</b><span>流程、探视与病历服务</span></button>
          <button data-portal="public"><b>信息动态</b><span>公告、新闻与院务公开</span></button>
          <button data-portal="map"><b>院内导航</b><span>楼宇、交通与消防通道</span></button>
        </section>
        <div class="home-columns">
          <section class="home-news"><div class="home-section-title"><h3>医院动态</h3><button data-portal="public">更多 &gt;</button></div>
            <button class="news-list-row" data-portal="public"><span>旧住院楼楼宇调整公告</span><time>2013-09-18</time></button>
            <button class="news-list-row" data-portal="public"><span>护理质量与技能培训工作简报</span><time>2013-09-12</time></button>
            <button class="news-list-row" data-portal="public"><span>夜间病区探视管理提示</span><time>2013-09-10</time></button>
          </section>
          <section class="home-notice"><div class="home-section-title"><h3>患者服务</h3><button data-portal="guide">更多 &gt;</button></div>
            <button class="notice-tile" data-portal="guide">住院与探视须知</button>
            <button class="notice-tile" data-portal="medical">检查检验服务</button>
            <button class="notice-tile" data-portal="map">院内方位指南</button>
          </section>
        </div>
        <div class="return-strip"><button class="btn" data-return-source>返回刚才的页面</button><span>白塔医院官方网站</span></div>
      </main>${footerHtml()}</div>`;
    bindCommon();
    requestAnimationFrame(()=>E.page.scrollTo(0,0));
  }

  function renderPortalList(key) {
    const label = PORTAL_LABELS[key]?.[0] || '医院服务';
    const articles = portalArticles(key);
    E.url.textContent = `www.baita-hospital.cn/${key}/index.htm`;
    E.title.textContent = `${label} - 白塔医院`;
    E.page.className = 'page-view';
    E.page.innerHTML = `<div class="site-shell">${hospitalHeader()}
      <div class="breadcrumb">您现在的位置：<button data-portal="home">首页</button><span>›</span><b>${label}</b></div>
      <main class="category-layout">
        <aside class="category-side"><h2>${label}</h2>${Object.entries(PORTAL_LABELS).filter(([k])=>k!=='home').map(([k,[n]])=>`<button data-portal="${k}" class="${k===key?'active':''}">${n}</button>`).join('')}</aside>
        <section class="category-main"><header><h1>${label}</h1><p>白塔医院历史网站内容归档</p></header>
          <div class="article-list picture-news-list">${articles.map((a,i)=>`<button type="button" class="article-row article-photo-row" data-site-article="${i}"><img class="article-thumb" src="${a.image}" alt=""><span class="article-row-copy"><b>${a.title}</b><small>${a.department || '白塔医院'}</small></span><time>${a.date}</time></button>`).join('')}</div>
          <div class="pagination"><span class="pager-muted">上一页</span><b>1</b><span class="pager-muted">下一页</span></div>
          <div class="return-strip"><button class="btn" data-return-source>返回刚才的页面</button><span>白塔医院信息服务</span></div>
        </section>
      </main>${footerHtml()}</div>`;
    portalView = { source: state.current, key, article: null, articles };
    bindCommon();
    requestAnimationFrame(()=>E.page.scrollTo(0,0));
  }

  function showPortalArticle(index) {
    if (!portalView) return;
    const key = portalView.key;
    const articles = portalView.articles || portalArticles(key);
    const a = articles[index];
    if (!a) return;
    portalView.article = index;
    const label = PORTAL_LABELS[key]?.[0] || '医院服务';
    E.url.textContent = `www.baita-hospital.cn/${key}/${String(index+1).padStart(4,'0')}.htm`;
    E.title.textContent = `${a.title} - 白塔医院`;
    const paragraphs = (a.body || []).map(x => `<p>${x}</p>`).join('');
    const image = `<figure class="article-image"><img src="${a.image}" alt="${a.caption || a.title}"><figcaption>${a.caption || a.title}</figcaption></figure>`;
    E.page.innerHTML = `<div class="site-shell">${hospitalHeader()}
      <div class="breadcrumb">您现在的位置：<button data-portal="home">首页</button><span>›</span><button data-portal="${key}">${label}</button><span>›</span><b>${a.title}</b></div>
      <main class="article-detail"><h1>${a.title}</h1><div class="article-meta">发布部门：${a.department || '白塔医院'}　发布日期：${a.date}</div>${image}
        <div class="article-body">${paragraphs}</div>
        <div class="article-bottom-nav"><button data-portal="${key}">返回${label}列表</button><button data-return-source>返回上一页</button></div>
      </main>${footerHtml()}</div>`;
    bindCommon();
    requestAnimationFrame(()=>E.page.scrollTo(0,0));
  }

  function returnFromPortal() {
    if (!portalView) return;
    const source = portalView.source;
    portalView = null;
    const p = meta(source);
    E.url.textContent = p.url; E.title.textContent = p.title; E.chapter.textContent = p.chapter;
    E.page.className = 'page-view';
    renderPage(source);
    requestAnimationFrame(()=>E.page.scrollTo(0,0));
  }

  function browserBack() {
    if (portalView) return returnFromPortal();
    if (state.history.length <= 1) return toast('已经是本次浏览的第一页');
    state.history.pop();
    const prev = state.history.at(-1) || 'mail';
    go(prev, false);
  }

  function scheduleAutoSupport() {
    if (!window.Paywall || window.Paywall.hasAutoPrompted()) return;
    clearTimeout(autoSupportTimer);
    autoSupportTimer = setTimeout(() => {
      if (!E.app.classList.contains('hidden')) window.Paywall.showOnce();
    }, 3000);
  }

  function shell(title, sub, body, mark = '白') {
    return `<div class="site-shell">
      ${hospitalHeader(title, sub, mark)}
      <div class="site-body">${body}</div>
      ${footerHtml()}
    </div>`;
  }

  function moduleShell(title, sub, body, mark = '系') {
    return `<div class="module-shell">
      <div class="module-hospital-head">
        <div class="module-brand"><span class="module-mark">${mark}</span><div><b>白塔医院</b><small>${title}</small></div></div>
        <div class="module-tools">
          <button type="button" data-goto="staff">员工门户</button>
          <button type="button" data-portal="home">医院官网</button>
        </div>
      </div>
      <div class="module-title"><b>${title}</b><span>${sub}</span></div>
      ${body}
    </div>`;
  }

  function collect(id, label = '·') {
    return `<button type="button" class="collectible" data-easter="${id}" title="异常像素" aria-label="调查异常像素">${label}</button>`;
  }

  function mail() {
    status('旧邮件服务器恢复任务释放了一封滞留十三年的邮件');
    E.page.innerHTML = shell('白塔医院历史数据整理邮箱', '内部账号：songyan.contractor@baita.local', `
      <div class="section-heading"><div><span>01</span><h2>档案邮件中心</h2></div><p>历史邮件镜像 · 只读</p></div>
      <div class="email-list">
        <aside class="email-sidebar">
          <button class="email-item active" type="button" data-toggle-detail="mailMain"><b>【未读】如果你还能看到这封信</b><span class="small muted">顾青禾 · 00:00</span></button>
          <button class="email-item" type="button" data-toggle-detail="mailTask"><b>旧楼服务器清点任务</b><span class="small muted">信息科 · 昨天</span></button>
          <button class="email-item" type="button" data-toggle-detail="mailFood"><b>周五食堂窗口临时调整</b><span class="small muted">后勤 · 3天前</span></button>
        </aside>
        <article class="email-content">
          <div id="mailMain">
            <div class="mail-header"><h2>如果你还能看到这封信</h2><div class="muted">发件人：顾青禾　预设发送：2013-09-17 00:00　实际投递：2026-08-07 00:00</div></div>
            <div class="mail-delivery-log" aria-label="邮件服务器投递日志"><b>投递链恢复记录</b><span>2013-09-17 00:00　目标地址不存在，进入冻结重试队列</span><span>2014-01-06 03:12　旧域停用，队列镜像封存</span><span>2026-08-06 23:59　旧楼服务器清点任务挂载历史镜像</span><span>2026-08-07 00:00　收件别名恢复，滞留邮件释放</span></div>
            <div class="paper"><p>宋言：</p>
              <p>如果你还能收到这封信，说明旧服务器至少还有一部分没有被清掉。</p>
              <p>我不知道后来那份名单被改成了什么样。那一夜留下的记录来自不同系统，也不是同一个人、在同一个时间改的。把它们放到一起之前，先确认每一条记录到底是谁写的、用的是哪一只钟。</p>
              <p>附件是我以前的一张工牌扫描件。卡面已经磨坏了一处，原件背面还有我当年随手留下的字。真正需要的东西，不只存在于这张卡上。</p>
              <p>如果你最终看到一个“已经离开医院的人”，不要先相信姓名。人会换衣服，系统里的名字也会被替换；有些身体留下的习惯，却没有那么容易换掉。</p>
              <p>我不能在这封信里写得更明白。请从医院自己留下的资料开始，一项一项核对。等所有时间都回到同一条线上，你会知道哪里不对。</p>
              <p style="text-align:right">顾青禾</p></div>
            <div class="attachment media-card attachment-scan">
              <button type="button" id="idCardToggle" class="scan-image-button" aria-label="切换附件扫描页"><img id="idCardImage" src="assets/id_card_front.webp" alt="顾青禾旧员工证扫描件"></button>
              <div class="scan-meta"><b>IMG_7F_ARCH_02.webp</b><p class="small muted">附件扫描页 <span id="idCardPage">1 / 2</span></p>${collect('c1','03')}</div>
            </div>
          </div>
          <div id="mailTask" class="mail-extra mail-message" hidden>
            <div class="mail-header"><h2>旧楼服务器清点任务</h2><div class="muted">发件人：信息科　发送时间：2026-08-06 16:40</div></div>
            <div class="mail-plain"><p>各位同事：</p><p>旧住院楼服务器计划于今晚完成例行清点。23:59将临时挂载2013年退役邮件域与历史队列镜像；若旧收件别名重新建立，处于冻结状态的滞留邮件可能被系统自动释放。</p><p>请按设备编号核对网页镜像、员工内网、护士站交班、电子病历、PACS、后勤维护和监控归档的存储状态。部分老设备未接入统一校时服务，导出的时间戳可能与服务器时间存在偏差。涉及跨系统资料时，请保留原始设备时间和校时记录，不要直接覆盖。</p><p>本次仅做盘点和备份，不修改原始数据。</p><p style="text-align:right">信息科</p></div>
          </div>
          <div id="mailFood" class="mail-extra mail-message" hidden>
            <div class="mail-header"><h2>周五食堂窗口临时调整</h2><div class="muted">发件人：后勤服务中心　发送时间：3天前 09:15</div></div>
            <div class="mail-plain"><p>各科室：</p><p>因冷库检修，周五职工食堂二号窗口午间暂停供餐，一号窗口延长开放至13:30。住院患者膳食配送按原计划执行，病区临时加餐仍由护士站在次日工作时段统一申请。</p><p>请夜班人员提前安排用餐，感谢配合。</p><p style="text-align:right">后勤服务中心</p></div>
          </div>
        </article>
      </div>`,'邮');
    bindIdCardViewer();
  }

  function bindIdCardViewer() {
    const btn = $('#idCardToggle', E.page), img = $('#idCardImage', E.page), page = $('#idCardPage', E.page);
    if (!btn || !img || !page) return;
    let back = false;
    btn.onclick = () => {
      back = !back;
      img.src = back ? 'assets/id_card_back.webp' : 'assets/id_card_front.webp';
      img.alt = back ? '顾青禾旧员工证背面扫描件' : '顾青禾旧员工证正面扫描件';
      page.textContent = back ? '2 / 2' : '1 / 2';
      if (back && !state.evidence.includes('e01')) addEvidence('e01');
    };
  }

  function official() {
    status('白塔医院官方网站 · 历史页面镜像');
    E.page.innerHTML = `<div class="site-shell">${hospitalHeader()}
      <main class="public-home">
        <section class="home-hero">
          <img src="assets/hospital_day_exterior.webp" alt="2013年白塔医院院区外景">
          <div class="home-hero-copy"><span>白塔医院</span><h2>守护生命 · 照亮长夜</h2><p>医疗服务、科室导航、就医指南与信息动态均可进入查看详情。</p></div>
        </section>
        <section class="home-services">
          <button data-portal="medical"><b>就医服务</b><span>门诊 · 住院 · 护理 · 医技</span></button>
          <button data-portal="departments"><b>科室导航</b><span>临床科室与护理单元</span></button>
          <button data-portal="guide"><b>就医指南</b><span>流程 · 探视 · 病历服务</span></button>
          <button data-portal="public"><b>信息动态</b><span>公告 · 新闻 · 院务公开</span></button>
          <button data-portal="map"><b>院内导航</b><span>楼宇 · 交通 · 消防通道</span></button>
        </section>
        <div class="home-columns">
          <section class="home-news"><div class="home-section-title"><h3>医院动态</h3><button data-portal="public">更多 &gt;</button></div>
            <button class="news-list-row" data-goto="legacy"><span>旧住院楼楼宇调整及历史公告</span><time>2013-09-18</time></button>
            <button class="news-list-row" data-portal="public"><span>第二届护理技能赛获奖名单</span><time>2012-05-12</time></button>
            <button class="news-list-row" data-portal="guide"><span>夜间病区探视与封闭管理须知</span><time>2013-09-10</time></button>
          </section>
          <aside class="home-search"><h3>站内检索</h3><div class="searchbar"><input id="officialSearch" placeholder="输入姓名、年份或栏目"><button id="officialSearchBtn" class="mini-btn">搜索</button></div><div id="officialResults"><p class="muted small">可检索公开的人事、护理和事故通报。</p></div><button class="staff-entry" data-goto="staff">员工服务入口</button></aside>
        </div>
        <section class="homepage-highlight"><h3>护理服务</h3><p>护理部培训、荣誉与岗位信息请进入“信息动态 / 科室导航”查看。</p><button data-portal="public" class="mini-btn">查看护理质量与荣誉</button> ${collect('c2','11')}</section>
      </main>${footerHtml()}</div>`;
    $('#officialSearchBtn', E.page).onclick = () => {
      const q = $('#officialSearch', E.page).value.trim();
      const o = $('#officialResults', E.page);
      if (/顾青禾|技能|护理/.test(q)) o.innerHTML = '<button class="search-result result-button" data-portal="public"><b>顾青禾｜七楼护士</b><p>护理技能赛与岗位信息有公开记录，点击进入信息动态继续查找。</p></button>';
      else if (/停电|事故|2013/.test(q)) o.innerHTML = '<button class="search-result result-button" data-goto="legacy"><b>2013年9月17日旧楼停电通报</b><p>历史网页存在版本差异，点击查看旧版网站镜像。</p></button>';
      else o.innerHTML = '<p class="muted">未检索到精确结果。请检查姓名、年份或栏目关键词。</p>';
      bindCommon();
    };
  }

  function legacy() {
    status('网页快照：2013-09-19；部分字段与当前官网不一致');
    E.page.innerHTML = shell('白塔医院旧版网站镜像', 'archive snapshot / 2013-09-19', `
      <div class="section-heading"><div><span>03</span><h2>历史网页快照</h2></div><p>2013-09-19 只读缓存</p></div>
      <div class="archive-banner"><img src="assets/archive_room.webp" alt="白塔医院旧档案室"><div><b>2013年9月17日 · 旧住院楼停电事故</b><p>以下页面来自只读缓存，部分栏目已从现行官网删除。</p></div></div>
      <div class="grid-2">
        <article class="card"><h2>旧楼停电事故情况通报</h2><p>公开版：六名登记患者在旧楼停电中死亡；护士顾青禾被记为擅离岗位后失踪。</p><div class="clue warning"><b>缓存差异：</b>源文件曾出现 <code>subject_count=7</code>，04:11变为 <code>subject_count=6</code>。缓存没有保留七个对象的姓名，也不能证明多出的对象属于患者还是职工。</div><p class="small muted">维护标识：USR-04　最后修改：2013-09-17 04:11</p><button class="mini-btn" data-portal="public">查看版本说明</button></article>
        <article class="card"><h2>被删除的科研目录</h2><p>归档树仅残留目录 <code>/research/WT-0713</code>，页面标题字段被清空，摘要只剩“夜间刺激观察”。对象类型、项目全称、负责人和伦理结论都不在公开镜像中。</p><p class="small muted">最后状态：已删除　关联业务系统：未知</p><button class="mini-btn" data-portal="departments">查看目录残留</button></article>
      </div>
      <div class="card"><h3>同期公告</h3><div class="doc-row"><span>09/12</span><span>七楼新增“设备夹层”消防备案</span><span>${collect('c3','13')}</span></div><button class="mini-btn" data-portal="map">查看旧楼导航索引</button></div>`,'旧');
  }

  function staffAppCards() {
    const apps = [
      ['handover','护','护士站交班','床位、膳食、医气与夜班记录'],
      ['call','呼','呼叫控制台','历史呼叫线路离线缓存'],
      ['emr','病','电子病历','患者历史病历只读访问'],
      ['pacs','影','PACS影像','历史影像与质控记录'],
      ['maintenance','修','后勤维修','设备时钟与维护日志'],
      ['cctv','监','监控档案','旧楼与大厅视频归档'],
      ['news','闻','地方新闻镜像','事故后公开报道存档'],
      ['floorplan','图','历史图纸库','旧住院楼设施图纸'],
      ['logs','审','版本审计','交班与病历字段修改日志'],
      ['scene','设','设施维护终端','旧楼封闭设施控制'],
      ['board','案','病案质量复盘','历史事件归档复核']
    ];
    return apps.map(([id,mark,title,desc]) => {
      const open = unlocked(id);
      const done = !!state.completed[puzzleByPage[id]];
      const seen = !!state.readPages[id];
      const chip = !open ? '<span class="status-chip locked">未授权</span>' : done ? '<span class="status-chip done">已分析</span>' : seen ? '<span class="status-chip">已访问</span>' : '<span class="status-chip new">新记录</span>';
      return `<button class="card clickable-card ${open ? '' : 'locked-card'}" ${open ? `data-goto="${id}"` : 'type="button" disabled'}><span class="card-icon">${mark}</span>${chip}<h3>${title}</h3><p>${desc}</p></button>`;
    }).join('');
  }

  function staff() {
    status(state.completed.p1 ? '员工内网身份验证已通过' : '白塔医院员工服务平台');
    if (state.completed.p1) {
      E.page.innerHTML = shell('白塔医院员工内网', '登录用户：顾青禾（历史只读镜像）', `
        <div class="section-heading"><div><span>04</span><h2>员工工作台</h2></div><p>历史系统镜像 · 只读访问</p></div>
        <div class="staff-dashboard">
          <div class="staff-profile card"><img src="assets/id_card_front.webp" alt="顾青禾员工证扫描件"><div><h2>顾青禾</h2><p>七楼护理单元 · 护士 · 制服登记S码</p><p class="small muted">历史档案信息以各业务系统原始记录为准。</p></div></div>
          <h3 class="system-directory-title">可访问的历史系统</h3>
          <div class="grid-3 system-directory">${staffAppCards()}</div>
        </div>`,'员');
      return;
    }
    E.page.innerHTML = shell('白塔医院员工内网', '仅限在职人员及历史审计访问', `
      <div class="section-heading"><div><span>04</span><h2>员工身份认证</h2></div><p>2013版员工服务平台 · 历史镜像</p></div>
      <div class="login-layout">
        <div class="login-visual"><img src="assets/normal_nurse_station.webp" alt="白塔医院夜班护士站工作区"><div><b>员工服务平台</b><p>排班 · 护理交班 · 病区信息 · 内部档案</p></div></div>
        <div class="login-panel"><h2>历史账号登录</h2><p class="muted">账号与口令沿用当年员工服务平台规则。连续输错不会锁定历史镜像。</p><label>员工编号<input id="staffId" autocomplete="off" placeholder="请输入完整员工编号"></label><label>临时口令<input id="staffPass" type="password" autocomplete="off" placeholder="请输入临时口令"></label><button id="staffLogin" class="btn btn-primary">登录</button><div id="staffResult"></div></div>
      </div>`,'员');
    $('#staffLogin', E.page).onclick = () => {
      const id = $('#staffId', E.page).value.trim().toUpperCase();
      const p = $('#staffPass', E.page).value.trim().toUpperCase();
      if (id === '7F-N-1472' && p === 'QH0917') {
        complete('p1', ['e01', 'e02'], '员工内网验证通过');
        result('staffResult', true, '身份验证通过，正在载入历史工作台……');
        setTimeout(() => { E.page.className='page-view'; staff(); bindCommon(); save(); }, 280);
      } else result('staffResult', false, '编号或口令不匹配。历史镜像不会提示具体错误字段。');
    };
  }

  function handover() {
    status('正在比对床位、膳食、氧气和废物系统');
    E.page.innerHTML = shell('七楼护士站交班系统', '正式床位：B7-01—B7-06', `
      <div class="section-heading"><div><span>05</span><h2>病区交班总览</h2></div><p>系统只提供原始业务记录，不标注异常项。</p></div>
      <div class="grid-2"><div class="card"><h3>正式床位表</h3><table class="clinical-table"><tr><th>床位</th><th>常规流量</th></tr>${['01','02','03','04','05','06'].map((n,i)=>`<tr><td>B7-${n}</td><td>${[4,5,3,4,5,4][i]} L/min</td></tr>`).join('')}</table><p>登记合计：25 L/min；科室安全冗余上限：36 L/min。</p></div><div class="card"><img src="assets/oxygen_valve_room.webp" alt="七楼医用气体阀门间"><p class="small muted">七楼医气累计表与正式床位表由不同部门维护。</p></div></div>
      <div class="grid-3"><div class="raw-record"><b>营养配送</b><br>09-16 23:30　七楼流食 × 7<br>09-17 11:20　家属加餐 × 1</div><div class="raw-record"><b>医气累计</b><br>09-17 00:05　42 L/min<br>登记六床基准　36 L/min</div><div class="raw-record"><b>院感封签</b><br>09-17 00:12　B7-0<br>09-17 08:40　B7-02</div></div>
      <div class="puzzle-box"><h2>选择能共同证明“当夜存在第七名护理对象”的三条原始记录</h2><div class="choice-list" id="bedChoices"><label><input type="checkbox" value="meal">09-16 23:30　七楼流食×7</label><label><input type="checkbox" value="oxygen">09-17 00:05　医气42 L/min</label><label><input type="checkbox" value="waste">09-17 00:12　封签B7-0</label><label><input type="checkbox" value="extra">09-17 11:20　家属加餐×1</label><label><input type="checkbox" value="visitor">09-16 21:10　陪护申请未批准</label></div><button id="bedSubmit" class="btn btn-primary">提交证据组合</button><div id="bedResult"></div></div>`,'护');
    if (state.completed.p2) result('bedResult', true, '已确认：存在未登记的第七个护理对象。');
    $('#bedSubmit', E.page).onclick = () => {
      const v = $$('#bedChoices input:checked', E.page).map(x => x.value).sort().join(',');
      if (v === 'meal,oxygen,waste') {
        complete('p2', ['e03','e04','e05'], '确认隐藏床位B7-0');
        result('bedResult', true, '三套独立系统共同指向B7-0。');
      } else result('bedResult', false, '组合不能排除其他解释。当前证据组合仍存在其他解释。');
    };
  }

  function call() {
    E.page.classList.add('site-dark');
    status('呼叫线路离线缓存：检测到重复脉冲');
    E.page.innerHTML = moduleShell('护士呼叫控制台', 'NURSE-CALL // B7 // 00:17:03', `
      <div class="system-dark">
        <div class="terminal-card"><h2>三轨录音分离</h2><div class="track-controls"><label><input type="checkbox" checked> 心跳模拟</label><label><input type="checkbox" checked> 氧气蜂鸣</label><label><input type="checkbox" checked> 呼叫线路</label></div><div class="media-frame dark-media"><img class="media-safe waveform-img" src="assets/waveform_monitor.webp" alt="护士呼叫系统三轨历史波形"></div></div>
        <div class="terminal-card"><h3>离线培训资料</h3><p>旧系统把呼叫灯的短闪与长闪保存为脉冲记录；分组之间会留下明显长间隔。</p><p>培训资料并未为本条记录提供现成转写，字符表可在医院历史培训页面查阅。</p><button type="button" class="mini-btn dark-btn" data-portal="departments">护理培训资料</button></div>
        <div class="terminal-card"><h2>解码输入</h2><div class="answer-row"><input id="morseAnswer" placeholder="四组内容"><button id="morseSubmit" class="btn btn-primary">提交</button></div><div id="morseResult"></div>${collect('c4','17')}</div>
      </div>`,'呼');
    if (state.completed.p3) result('morseResult', true, '已解码：SOS / B70 / 0017 / O₂。');
    $('#morseSubmit', E.page).onclick = () => {
      const a = $('#morseAnswer', E.page).value.toUpperCase().replace(/[\/|,，]+/g, ' ').replace(/\s+/g, ' ').trim();
      if (a === 'SOS B70 0017 O2') {
        complete('p3', ['e06'], '呼叫信息解码成功');
        result('morseResult', true, '00:17从B7-0发出求救，并强调不要切断氧气。');
      } else result('morseResult', false, '分组或字符有误。');
    };
  }

  function emr() {
    status('患者0713病历存在剂量与体重不一致');
    E.page.innerHTML = shell('白塔医院电子病历系统', '患者编号 0713 · 历史只读', `
      <div class="section-heading"><div><span>07</span><h2>患者病历</h2></div><p>患者0713 · 历史只读</p></div>
      <div class="patient-summary card"><div class="patient-avatar">0713</div><div><h2>林祈</h2><p>17岁 · 42kg · 右膝旧伤</p><div class="tag-row"><span>旧楼七层</span><span>科研关联 WT-0713</span></div></div><button type="button" class="mini-btn" data-portal="medical">查看病历摘要</button></div>
      <div class="grid-2"><div class="card"><h3>用药记录</h3><p>醒宁 <b>2.04mL</b>，录入账号 zhaobw_admin。</p><button type="button" class="mini-btn" data-portal="departments">打开药事公式</button></div><div class="card"><h3>药房领用</h3><p>B6-04，68kg，领取2.04mL。</p><button type="button" class="mini-btn" data-portal="public">查看领用对照</button></div></div>
      <div class="puzzle-box"><h2>判断病历异常</h2><div class="answer-row"><label>42kg理论体积<input id="doseValue" type="number" step="0.01"></label><label>2.04mL来源<select id="doseSource"><option></option><option>B6-04</option><option>B7-02</option></select></label><label>结论<select id="doseConclusion"><option></option><option value="copy">病历数据从另一患者复制</option><option value="overdose">护士计算错误</option></select></label><button id="doseSubmit" class="btn btn-primary">提交</button></div><div id="doseResult"></div></div>`,'病');
    if (state.completed.p4) result('doseResult', true, '已确认病历复制。');
    $('#doseSubmit', E.page).onclick = () => {
      const v = parseFloat($('#doseValue', E.page).value), s = $('#doseSource', E.page).value, c = $('#doseConclusion', E.page).value;
      if (Math.abs(v - 1.26) < .011 && s === 'B6-04' && c === 'copy') {
        complete('p4', ['e07','e08'], '识别病历复制痕迹');
        result('doseResult', true, '2.04mL属于68kg患者，不属于林祈。');
      } else result('doseResult', false, '计算结果、来源记录或结论至少有一项不一致。');
    };
  }

  function pacs() {
    E.page.classList.add('site-dark');
    status('PACS：两张影像方向标记不一致');
    E.page.innerHTML = moduleShell('PACS医学影像中心', 'STUDY 0713 · 2 IMAGES', `
      <div class="system-dark">
        <div class="pacs-meta"><button type="button" data-portal="medical">影像身份核验规则</button><button type="button" data-portal="departments">影像质控说明</button><button type="button" data-portal="public">档案编号</button></div>
        <div class="xray-stage"><div class="xray-frame"><img src="assets/xray_a.webp" alt="影像A"></div><div class="xray-frame"><img id="xrayB" src="assets/xray_b.webp" alt="影像B"></div></div>
        <div class="xray-controls"><label>旋转<input id="xrRotate" type="range" min="0" max="360" step="90" value="0"><output id="rotOut">0°</output></label><label>亮度<input id="xrBright" type="range" min="70" max="170" value="100"><output id="brightOut">100%</output></label><label>对比度<input id="xrContrast" type="range" min="70" max="180" value="100"><output id="contrastOut">100%</output></label></div>
        <div class="terminal-card"><div class="answer-row"><label>结论<select id="xrConclusion"><option></option><option value="different">来自不同患者</option><option value="same">同一患者姿势差异</option></select></label><label>档案编号<input id="xrId" placeholder="四位数字"></label><button id="xrSubmit" class="btn btn-primary">提交</button></div><div id="xrResult"></div></div>
      </div>`,'影');
    const b = $('#xrayB', E.page);
    const upd = () => {
      const r = +$('#xrRotate', E.page).value, br = +$('#xrBright', E.page).value, co = +$('#xrContrast', E.page).value;
      b.style.transform = `rotate(${r}deg)`; b.style.filter = `brightness(${br / 100}) contrast(${co / 100})`;
      $('#rotOut', E.page).textContent = r + '°'; $('#brightOut', E.page).textContent = br + '%'; $('#contrastOut', E.page).textContent = co + '%';
    };
    ['xrRotate','xrBright','xrContrast'].forEach(id => $('#'+id, E.page).oninput = upd);
    if (state.completed.p5) result('xrResult', true, '已确认两张影像来自不同患者。');
    $('#xrSubmit', E.page).onclick = () => {
      const r = +$('#xrRotate', E.page).value, br = +$('#xrBright', E.page).value, co = +$('#xrContrast', E.page).value, c = $('#xrConclusion', E.page).value, id = $('#xrId', E.page).value.trim();
      if (r === 180 && br >= 130 && br <= 145 && co >= 145 && co <= 160 && c === 'different' && id === '0713') {
        complete('p5', ['e09','e10'], '确认影像身份错置');
        result('xrResult', true, '旧骨折位置与方向标记共同证明影像被替换。');
      } else result('xrResult', false, '影像处理参数或身份结论不符合当前资料。');
    };
  }

  function maintenance() {
    status('后勤系统时钟存在固定偏差');
    const events = [['呼叫','00:17 顾青禾呼叫'],['电梯','00:21 林祈进入洗衣梯'],['控制室','00:23 赵秉文进入控制室'],['氧气','00:25 氧气关闭'],['离院','00:27 林祈离院']];
    E.page.innerHTML = shell('后勤维修与设备时钟校准', '七楼监控慢8分40秒；洗衣梯快1分20秒；大厅标准时', `
      <div class="section-heading"><div><span>09</span><h2>设备运维档案</h2></div><p>设备时钟校准记录与原始时间戳。</p></div>
      <div class="maintenance-visual"><img src="assets/laundry_lift.webp" alt="旧住院楼洗衣梯控制器"><div><b>旧住院楼七层设备时钟</b><p>各控制器独立运行，事故后导出的记录顺序已经被打乱。</p></div></div>
      <div class="grid-2"><div class="card"><h2>时钟偏差表</h2><p>七楼呼叫缓存：-08:40</p><p>洗衣梯控制器：+01:20</p><p>控制室/医气/大厅：±00:00</p><button type="button" class="mini-btn" data-portal="medical">查看校准制度</button></div><div class="raw-record"><b>乱序原始记录</b><br>[E] 大厅　00:27:00　出口触发<br>[C] 医气　00:25:00　支路关闭<br>[A] 七楼　00:08:20　呼叫脉冲<br>[B] 洗衣梯　00:22:20　刷卡<br>[D] 控制室　00:23:00　门禁</div></div>
      <div class="puzzle-box"><h2>把每条记录换算为标准时间</h2><p class="muted">填写 HH:MM:SS；只有五条时间全部正确才会建立可靠时间线。</p><div class="answer-grid"><label>A 呼叫<input id="timeCall" placeholder="00:00:00"></label><label>B 洗衣梯<input id="timeLift" placeholder="00:00:00"></label><label>D 控制室<input id="timeControl" placeholder="00:00:00"></label><label>C 医气关闭<input id="timeOxygen" placeholder="00:00:00"></label><label>E 大厅出口<input id="timeExit" placeholder="00:00:00"></label></div><button id="timeSubmit" class="btn btn-primary" style="margin-top:12px">提交校准</button><div id="timeResult"></div></div>`,'修');
    if (state.completed.p6) result('timeResult', true, '真实顺序已校准。');
    $('#timeSubmit', E.page).onclick = () => {
      const norm = id => $('#' + id, E.page).value.replace(/\D/g,'').padStart(6,'0');
      const a = [norm('timeCall'),norm('timeLift'),norm('timeControl'),norm('timeOxygen'),norm('timeExit')];
      if (JSON.stringify(a) === JSON.stringify(['001700','002100','002300','002500','002700'])) {
        complete('p6', ['e11','e12'], '完成跨系统时间校准');
        result('timeResult', true, events.map(x => x[1]).join(' → '));
      } else result('timeResult', false, '至少一条标准时间不正确。请按偏差方向逐条换算。');
    };
  }

  function cctv() {
    status('监控画面人脸模糊，应使用步态与衣物证据');
    E.page.innerHTML = shell('监控档案', '2013-09-17 00:27 · 大厅出口', `
      <div class="section-heading"><div><span>10</span><h2>安防监控回放</h2></div><p>2013-09-17 归档视频</p></div>
      <div class="cctv-player card"><div class="media-frame cctv-media"><img class="cctv-sequence" src="assets/cctv_exit_sequence.webp" alt="大厅出口四帧连续监控画面"></div><div class="cctv-meta"><span>CAM-LOBBY-02</span><span>00:27:10—00:27:16</span><span>四帧连续画面</span></div><p class="small muted">系统未生成人物描述。请把连续步态、衣物轮廓和袖口局部与其他系统记录交叉核对。</p><div class="action-row"><button type="button" class="mini-btn" data-portal="medical">病历稳定特征</button><button type="button" class="mini-btn" data-portal="departments">制服登记</button><button type="button" class="mini-btn" data-portal="public">腕带材质说明</button></div></div>
      <div class="puzzle-box"><h2>建立离院者身份链</h2><p class="muted">系统不提供观察标签。请根据四帧画面自行描述，并与病历、制服登记和腕带资料逐项对应。</p><div class="answer-grid free-answer-grid"><label>步态异常部位<input id="cctvKnee" autocomplete="off" placeholder="身体部位"></label><label>画面中制服的登记尺码<input id="cctvUniform" autocomplete="off" placeholder="如：S码"></label><label>袖口反光物<input id="cctvBand" autocomplete="off" placeholder="物品名称"></label><label>离院者<input id="leaver" autocomplete="off" placeholder="输入姓名"></label></div><button id="cctvSubmit" class="btn btn-primary" style="margin-top:12px">提交身份链</button><div id="cctvResult"></div></div>`,'监');
    if (state.completed.p7) result('cctvResult', true, '已确认离院者是林祈。');
    $('#cctvSubmit', E.page).onclick = () => {
      const knee = normalizeAnswer($('#cctvKnee', E.page).value);
      const uniform = normalizeAnswer($('#cctvUniform', E.page).value).toUpperCase();
      const band = normalizeAnswer($('#cctvBand', E.page).value);
      const leaver = normalizeAnswer($('#leaver', E.page).value);
      if (/右膝/.test(knee) && /^M码?$/.test(uniform) && /(患者)?腕带/.test(band) && leaver === '林祈') {
        complete('p7', ['e13','e14','e15'], '确认身份交换');
        result('cctvResult', true, '护士服中的离院者是患者林祈。');
      } else result('cctvResult', false, '当前身份链仍不闭合。请分别写出异常部位、制服实际尺码、反光物和姓名。');
    };
  }

  function news() {
    status('地方新闻库保留了事故后的公开叙事');
    if (!state.completed.news_read) { state.completed.news_read = true; save(); updateProgress(); }
    E.page.innerHTML = shell('白城地方新闻库', '关键词：白塔医院 / 2013 / 失踪护士', `
      <div class="section-heading"><div><span>11</span><h2>地方新闻与更正来函</h2></div><p>地方新闻库 · 2013历史存档</p></div>
      <div class="news-feature"><img src="assets/local_newspaper.webp" alt="2013年白城地方报纸事故报道"><div><span>2013-09-18</span><h2>白塔医院旧楼停电事故引发关注</h2><p>公开报道逐字引用院方04:11版本，没有独立核对原始护理对象口径。</p></div></div>
      <div class="grid-2"><article class="card"><h2>护士失踪，院方称其擅离岗位</h2><p>报道仅使用大厅出口单帧截图作为身份依据；顾青禾的制服登记、林祈病历和腕带细节均未进入公开稿。</p><button type="button" class="mini-btn" data-portal="home">查看报道来源</button></article><article class="card"><h2>未公开的更正来函</h2><div class="paper"><p>“出口画面里的人不是顾青禾。她把自己的衣服留给了0713。洗衣梯后面还有一段被删掉的旧图纸。”</p><p class="small muted">收件：白城晚讯社会部　2013-09-19 02:14　未刊</p></div><button type="button" class="mini-btn" data-portal="public">查看来函背景</button>${collect('c5','08')}</article></div>`,'闻');
  }

  function floorplan() {
    status('三版平面图存在被删除的设备夹层');
    E.page.innerHTML = shell('旧楼平面图叠合工具', '固定楼梯井与外墙后对齐', `
      <div class="section-heading"><div><span>12</span><h2>院内导航 · 历史图纸</h2></div><p>旧住院楼七层 · 2010/2013版本</p></div>
      <div class="action-row"><button type="button" class="mini-btn" data-portal="map">查看叠图原则</button><button type="button" class="mini-btn" data-portal="departments">查看氧气管线</button><button type="button" class="mini-btn" data-portal="public">查看消防备案</button></div>
      <div id="planStage" class="plan-stage media-frame"><img src="assets/floor_old.webp" alt="旧版七楼平面图"><img id="planNew" class="plan-overlay" src="assets/floor_new.webp" alt="可拖动的新版七楼平面图叠层" draggable="false"><div class="plan-reveal" aria-hidden="true"><b>B7-0</b><span>隐藏边界</span></div></div>
      <div class="plan-workbench"><p>直接拖动上层图纸，使楼梯井、外墙转角和主氧管同时重合。结构接近时系统会自动吸附；下方按钮用于精细调整，不显示坐标或密码数值。</p><div class="plan-nudges" role="group" aria-label="图纸精细调整"><button type="button" data-plan-move="0,-5" aria-label="向上微调">↑</button><button type="button" data-plan-move="-5,0" aria-label="向左微调">←</button><button type="button" data-plan-reset>重置</button><button type="button" data-plan-move="5,0" aria-label="向右微调">→</button><button type="button" data-plan-move="0,5" aria-label="向下微调">↓</button><button type="button" data-plan-zoom="-0.01">缩小</button><button type="button" data-plan-zoom="0.01">放大</button></div><output id="planStatus" class="plan-status">固定结构尚未重合</output></div>
      <div class="puzzle-box"><label>显现边界的维护入口<input id="planEntrance" placeholder="房间名称"></label><button id="planSubmit" class="btn btn-primary">记录隐藏房间</button><div id="planResult"></div></div>`,'图');
    const stage = $('#planStage', E.page), n = $('#planNew', E.page), statusNode = $('#planStatus', E.page);
    const target = { x: 15, y: -10, s: .98 };
    const plan = { x: 0, y: 0, s: 1, snapped: false };
    let drag = null;
    const drawPlan = () => {
      n.style.setProperty('--ox', plan.x + 'px');
      n.style.setProperty('--oy', plan.y + 'px');
      n.style.setProperty('--os', plan.s);
      stage.classList.toggle('aligned', plan.snapped);
      if (plan.snapped) statusNode.textContent = '固定结构吻合：隐藏边界已显现';
      else {
        const distance = Math.abs(plan.x - target.x) + Math.abs(plan.y - target.y) + Math.abs(plan.s - target.s) * 180;
        statusNode.textContent = distance < 16 ? '三处基准已接近，继续微调' : '固定结构尚未重合';
      }
    };
    const snapIfClose = () => {
      if (Math.abs(plan.x - target.x) <= 4 && Math.abs(plan.y - target.y) <= 4 && Math.abs(plan.s - target.s) <= .006) {
        Object.assign(plan, target, { snapped: true });
        drawPlan();
        return true;
      }
      plan.snapped = false;
      drawPlan();
      return false;
    };
    n.onpointerdown = e => {
      drag = { id: e.pointerId, x: e.clientX, y: e.clientY, ox: plan.x, oy: plan.y };
      n.setPointerCapture?.(e.pointerId);
      n.classList.add('dragging');
    };
    n.onpointermove = e => {
      if (!drag || drag.id !== e.pointerId || plan.snapped) return;
      plan.x = Math.max(-40, Math.min(40, drag.ox + e.clientX - drag.x));
      plan.y = Math.max(-40, Math.min(40, drag.oy + e.clientY - drag.y));
      drawPlan();
    };
    const endDrag = e => {
      if (!drag || drag.id !== e.pointerId) return;
      drag = null;
      n.classList.remove('dragging');
      snapIfClose();
    };
    n.onpointerup = endDrag;
    n.onpointercancel = endDrag;
    $$('[data-plan-move]', E.page).forEach(b => b.onclick = () => {
      const [dx,dy] = b.dataset.planMove.split(',').map(Number);
      plan.x = Math.max(-40, Math.min(40, plan.x + dx));
      plan.y = Math.max(-40, Math.min(40, plan.y + dy));
      plan.snapped = false;
      snapIfClose();
    });
    $$('[data-plan-zoom]', E.page).forEach(b => b.onclick = () => {
      plan.s = Math.max(.92, Math.min(1.08, +(plan.s + Number(b.dataset.planZoom)).toFixed(2)));
      plan.snapped = false;
      snapIfClose();
    });
    $('[data-plan-reset]', E.page).onclick = () => { Object.assign(plan, { x:0, y:0, s:1, snapped:false }); drawPlan(); };
    drawPlan();
    if (state.completed.p8) result('planResult', true, '已发现B7-0与氧气支管。');
    $('#planSubmit', E.page).onclick = () => {
      const e = $('#planEntrance', E.page).value.trim();
      if (plan.snapped && /器械储藏室/.test(e)) {
        complete('p8', ['e16','e17'], '定位隐藏房间B7-0');
        result('planResult', true, '入口在器械储藏室，旧氧气支管通向B7-0。');
      } else result('planResult', false, plan.snapped ? '入口名称与显现后的维护标记不一致。' : '三处固定结构尚未同时重合。');
    };
  }

  function logs() {
    status('交班记录存在三次不同目的的改写');
    E.page.innerHTML = shell('交班版本库', '版本差异审计 / 2013-09-17', `
      <div class="section-heading"><div><span>13</span><h2>病历与交班审计</h2></div><p>版本差异审计 · 2013-09-17</p></div>
      <div class="audit-summary"><button type="button" data-portal="departments"><b>账号表</b><span>核对值班账号归属</span></button><button type="button" data-portal="public"><b>跨日</b><span>注意日期边界</span></button><button type="button" data-portal="medical"><b>字段组</b><span>比较修改范围</span></button></div>
      <div class="log-compare card"><table><tr><th>标准时间</th><th>账号</th><th>字段</th><th>旧值 → 新值</th></tr><tr><td>09-16 23:48</td><td>durong_n</td><td>person.display_name<br>transfer.ready</td><td>林祈 → 顾青禾<br>false → true</td></tr><tr><td>09-17 00:23</td><td>zhaobw_admin</td><td>death.time<br>room.id<br>dose.volume<br>access.owner</td><td>空 → 00:17<br>B7-0 → B7-02<br>1.26 → 2.04<br>0713 → 顾青禾</td></tr><tr><td>09-17 04:11</td><td>zhaobw_admin</td><td>notice.subject_count</td><td>七名护理对象 → 六名患者</td></tr></table></div>
      <div class="puzzle-box"><h2>自行归纳责任链</h2><p class="muted">不要选择预设结论。先从值班账号索引确定人物，再用字段范围概括两类修改的目的。</p><div class="answer-grid free-answer-grid"><label>durong_n归属<input id="logA" autocomplete="off" placeholder="姓名"></label><label>zhaobw_admin归属<input id="logB" autocomplete="off" placeholder="姓名"></label><label>救援性修改涉及什么<input id="logC" autocomplete="off" placeholder="概括至少两个字段目的"></label><label>掩盖性修改涉及什么<input id="logD" autocomplete="off" placeholder="概括至少三个字段目的"></label></div><button id="logSubmit" class="btn btn-primary" style="margin-top:12px">提交责任链</button><div id="logResult"></div></div>`,'审');
    if (state.completed.p9) result('logResult', true, '已区分救援改写与掩盖改写。');
    $('#logSubmit', E.page).onclick = () => {
      const a = normalizeAnswer($('#logA', E.page).value), b = normalizeAnswer($('#logB', E.page).value);
      const rescue = normalizeAnswer($('#logC', E.page).value), cover = normalizeAnswer($('#logD', E.page).value);
      if (a === '杜蓉' && b === '赵秉文' && /身份/.test(rescue) && /(离院|转运|救援)/.test(rescue) && /死亡/.test(cover) && /门禁/.test(cover) && /(通报|人数|官网)/.test(cover)) {
        complete('p9', ['e18','e19'], '还原三版交班记录');
        result('logResult', true, '杜蓉先交换身份救人；赵秉文随后篡改死亡与门禁记录。');
      } else result('logResult', false, '责任链仍有缺口：请核对两个账号，并分别概括身份/离院与死亡/门禁/通报字段。');
    };
  }

  function scene() {
    E.page.classList.add('site-dark');
    status('B7-0隔离门：旧设备需按安全顺序恢复');
    E.page.innerHTML = moduleShell('B7-0隔离区现场', '第七章 · 最后一次交班', `
      <div class="scene-page">
        <div class="scene-hero"><div class="scene-caption"><span>旧住院楼 · 七层</span><h1>B7-0</h1><p>隐藏在器械储藏室后的设备夹层。</p></div></div>
        <div class="scene-body"><div class="terminal-card"><h3>历史维护模式</h3><p>控制台没有恢复向导。联锁摘要仅保留三条：无压支路在上电时会被复位；隔离门需应急母线供电；呼叫回路断开后无法确认室内响应。</p><p class="small muted">B7-0呼叫缓存反复出现 O₂。错误操作会触发保护复位。${collect('c6','11')}</p></div><div class="sequence-grid" id="seq"><button class="sequence-btn" data-step="total" data-decoy="true">恢复楼层总电源</button><button class="sequence-btn" data-step="door">解除隔离门锁</button><button class="sequence-btn" data-step="oxygen">开启备用供氧</button><button class="sequence-btn" data-step="disconnect" data-decoy="true">断开故障呼叫线</button><button class="sequence-btn" data-step="power">恢复走廊应急电源</button><button class="sequence-btn" data-step="call">保持呼叫线路</button></div><button id="seqReset" class="btn" style="margin-top:12px">重置控制台</button><div id="seqResult"></div></div>
      </div>`,'隔');
    const correct = ['oxygen','power','call','door'];
    state.sequence = [];
    $$('[data-step]', E.page).forEach(b => b.onclick = () => {
      if (state.completed.p10) return;
      const expected = correct[state.sequence.length];
      if (b.dataset.step === expected) {
        state.sequence.push(expected); b.classList.add('done'); b.disabled = true;
        if (state.sequence.length === 4) {
          complete('p10', ['e20','e21'], '成功进入B7-0');
          result('seqResult', true, '未寄证词确认：杜蓉交换身份救出林祈，顾青禾留在B7-0维持供氧。');
        }
      } else {
        b.classList.add('wrong'); setTimeout(() => b.classList.remove('wrong'), 400);
        state.wrongActions += 1;
        state.sequence = [];
        $$('[data-step]', E.page).forEach(x => { x.disabled = false; x.classList.remove('done'); });
        result('seqResult', false, '顺序错误，设备保护已自动复位。');
        save();
      }
    });
    $('#seqReset', E.page).onclick = () => {
      state.sequence = [];
      $$('[data-step]', E.page).forEach(x => { x.disabled = false; x.classList.remove('done'); });
      result('seqResult', true, '已重置。');
    };
    if (state.completed.p10) result('seqResult', true, 'B7-0已打开，证词已归档。');
  }

  function board() {
    status('请提交事故真相与公开方式');
    E.page.innerHTML = shell('证据推演台', '终章：区分救援者、篡改者与受害者', `
      <div class="section-heading"><div><span>15</span><h2>历史事件复盘</h2></div><p>病案质量与系统审计联合复核</p></div>
      <div class="final-brief"><div><b>已取得证据</b><strong>${state.evidence.filter(id=>id!=='e22').length} / 21</strong></div><div><b>隐藏碎片</b><strong>${state.easter.length} / 6</strong></div><div class="muted">结局会综合证据完整度、危险操作、隐藏链与公开方式。</div></div>
      <div class="card"><h3>统一后的跨日时间线</h3><table class="timeline-table"><tr><th>标准时间</th><th>原始事件</th></tr><tr><td>09-16 23:48</td><td>护理账号变更0713显示身份与离院准备</td></tr><tr><td>09-17 00:00</td><td>顾青禾预设邮件进入队列；因目标别名不存在而冻结</td></tr><tr><td>09-17 00:17</td><td>B7-0呼叫缓存发出含O₂的脉冲</td></tr><tr><td>09-17 00:21</td><td>0713腕带进入洗衣梯</td></tr><tr><td>09-17 00:23</td><td>管理员账号进入控制室并开始批量改写</td></tr><tr><td>09-17 00:25</td><td>B7-0备用氧气支路被关闭</td></tr><tr><td>09-17 00:27</td><td>穿护士服者从大厅离院</td></tr><tr><td>09-17 04:11</td><td>官网口径由七名护理对象改为六名患者</td></tr><tr><td>2026-08-07 00:00</td><td>旧邮件域恢复，冻结队列把邮件投递给当前清点账号</td></tr></table></div>
      <div class="evidence-board free-report"><div class="question-card"><label>B7-0患者<input id="q1" autocomplete="off" placeholder="姓名"></label></div><div class="question-card"><label>00:27离院者<input id="q2" autocomplete="off" placeholder="姓名"></label></div><div class="question-card"><label>死在B7-0的人<input id="q3" autocomplete="off" placeholder="姓名"></label></div><div class="question-card"><label>身份交换者<input id="q4" autocomplete="off" placeholder="姓名"></label></div><div class="question-card"><label>最终篡改者<input id="q5" autocomplete="off" placeholder="姓名"></label></div><div class="question-card"><label>下令切氧者<input id="q6" autocomplete="off" placeholder="姓名"></label></div></div>
      <div class="puzzle-box"><label>用一句话写出杜蓉的目的<input id="q7" autocomplete="off" placeholder="她为什么修改身份与离院准备字段？"></label><label>公开方式<select id="disclose"><option value="protect">公开真相，但保护林祈现身份</option><option value="full">公开全部实名资料</option><option value="archive">只提交内部档案</option></select></label><button id="finalSubmit" class="btn btn-primary">提交调查报告</button><div id="finalResult"></div></div>`,'案');
    $('#finalSubmit', E.page).onclick = () => {
      const a = ['q1','q2','q3','q4','q5','q6'].map(id => normalizeAnswer($('#' + id, E.page).value));
      const purpose = normalizeAnswer($('#q7', E.page).value);
      if (JSON.stringify(a) === JSON.stringify(['林祈','林祈','顾青禾','杜蓉','赵秉文','赵秉文']) && /(救出|救走|帮助|保护).*林祈/.test(purpose)) {
        const mode = $('#disclose', E.page).value;
        state.privacyProtected = mode === 'protect';
        state.finalEvidenceComplete = Array.from({length:21},(_,i)=>`e${String(i+1).padStart(2,'0')}`).every(id=>state.evidence.includes(id));
        complete('p11', [], '事故真相已还原'); showEnding(mode);
      } else result('finalResult', false, '至少一项与已取得的原始记录冲突。');
    };
  }

  function showEnding(mode) {
    const variants = {
      protect: {
        title:'A：被保护的真相', art:'assets/local_newspaper.webp',
        summary:'调查报告公开赵秉文的篡改、切氧责任与违规试验链，同时隐去林祈当前身份。六名登记患者、隐藏患者林祈与死在夹层中的顾青禾被分别写回记录，人数口径不再混用。',
        news:'《白城晚讯》发布更正：大厅画面中的离院者不是失踪护士。报道只使用“幸存患者L”代称，焦点转向医院如何长期维持错误通报。',
        hospital:'医院撤下2013年旧通报，公开承认存在第七名护理对象和未备案设备夹层；赵秉文相关材料转交独立调查，顾青禾恢复在岗履职与事故受害者身份。',
        survivor:'三天后，清点邮箱收到一封无署名短笺：“名字没有再被写出来。谢谢你把她留下的那一夜还给她。”',
        caseState:'证据副本进入公开复核，幸存者现身份受到保护。'
      },
      full: {
        title:'B：所有名字', art:'assets/cctv_exit_sequence.webp',
        summary:'你公开了全部原始档案，包括林祈的现姓名、病历和离院路径。真相迅速传播，但幸存者也被重新拖回十三年前。',
        news:'多个账号转载监控帧和病历截图，“失踪护士反转”成为热点。赵秉文受到调查，林祈的住址、工作信息也随之被人肉扩散。',
        hospital:'医院被迫承认人数口径与违规项目，但声明将“患者隐私外泄”归因于材料提交者，试图把责任争议转向公开方式。',
        survivor:'清点邮箱只收到系统退信。此前用于联系的别名在报道发布两小时后永久注销。',
        caseState:'事实获得公开确认，但隐私伤害不可撤回。'
      },
      archive: {
        title:'C：封存副本', art:'assets/archive_room.webp',
        summary:'报告进入内部审计，原始记录得以保全，却没有形成公开更正。十三年前的叙事开始松动，但公众仍只看得到“六名患者、一名护士失踪”。',
        news:'地方新闻库没有新增报道。2013年的错误文章仍排在检索结果首位，未刊更正来函继续显示“内部资料”。',
        hospital:'院内审计把案件标记为“需进一步核实”，赵秉文账号权限被冻结；对外页面只增加一句“历史内容正在复核”。',
        survivor:'没有新邮件到达。匿名别名最后一次登录停在报告提交当晚。',
        caseState:'证据被保存但真相未公开，后续取决于内部程序。'
      }
    };
    const v = Object.assign({}, variants[mode] || variants.protect);
    let t = v.title;
    if (mode === 'protect' && state.finalEvidenceComplete && state.easter.length === 6) {
      t = 'S：第八张床';
      v.summary += ' 六枚残留编号拼出B8-11，证明这不是唯一一场被隐藏的试验。';
      v.caseState = 'B7-0案完整公开后，独立调查依据B8-11编号启动第二条证据保全链。';
    } else if (mode === 'protect' && state.wrongActions > 0) {
      t = 'A-：迟来的交班';
      v.hospital += ` 现场恢复记录同时注明你触发过${state.wrongActions}次保护复位，设备缓存有少量损耗，但关键证词仍可验证。`;
    }
    state.ending = t; save();
    E.endingDialog.querySelector('#endingContent').innerHTML = `<div class="ending-hero ending-${mode}"><h1>${t}</h1></div><div class="ending-body"><p class="ending-summary">${v.summary}</p><figure class="ending-report-image"><img src="${v.art}" alt="结局调查材料"><figcaption>报告提交后七日内形成的公开与归档记录</figcaption></figure><div class="ending-outcome-grid"><article><span>01 / 新闻后续</span><h2>公开叙事</h2><p>${v.news}</p></article><article><span>02 / 院方处置</span><h2>责任追查</h2><p>${v.hospital}</p></article><article><span>03 / 幸存者</span><h2>回信状态</h2><p>${v.survivor}</p></article><article><span>04 / 调查状态</span><h2>证据去向</h2><p>${v.caseState}</p></article></div><div class="ending-dossier"><b>调查记录</b><span>关键证据 ${state.evidence.filter(id=>id!=='e22').length}/21</span><span>隐藏碎片 ${state.easter.length}/6</span><span>危险操作 ${state.wrongActions}次</span><span>隐私${state.privacyProtected?'已保护':'未保护'}</span></div><p class="ending-lastline">十三年后，零点交班终于完成。</p><div class="ending-actions"><button id="endingClose" class="btn btn-primary">回到证据板</button><button id="endingRestart" class="btn">重新调查</button></div></div>`;
    E.endingDialog.showModal();
    $('#endingClose').onclick = () => E.endingDialog.close();
    $('#endingRestart').onclick = () => { E.endingDialog.close(); if (confirm('确定清除当前进度并重新开始吗？')) { localStorage.removeItem(D.saveKey); location.reload(); } };
  }

  function renderSide() {
    if (!E.sideContent) return;
    $$('[data-side]').forEach(b => b.classList.toggle('active', b.dataset.side === sideTab));
    if (sideTab === 'evidence') E.sideContent.innerHTML = state.evidence.length ? state.evidence.map(id => `<div class="evidence-item"><b>${D.evidence[id].name}</b><small>${D.evidence[id].desc}</small></div>`).join('') : '<p class="muted">尚未取得证据。</p>';
    else if (sideTab === 'notes') E.sideContent.innerHTML = `<textarea id="notesArea" class="notes-area" placeholder="记录你的推理……">${escapeHtml(state.notes)}</textarea><button id="saveNotes" class="btn" style="margin-top:8px">保存便签</button>`;
    else E.sideContent.innerHTML = state.history.map(id => `<div class="history-item">${meta(id)?.num || ''} ${meta(id)?.title || id}</div>`).join('');
    $('#saveNotes')?.addEventListener('click', () => { state.notes = $('#notesArea').value; save(false); });
  }

  function normalizeAnswer(s) { return String(s || '').trim().replace(/[\s，,、；;：:。.!！?？]/g, ''); }
  function escapeHtml(s) { return String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  function openSide(tab = 'evidence') { sideTab = tab; E.layout.classList.add('side-open'); renderSide(); }

  function openHint() {
    const p = puzzleByPage[state.current];
    if (!p || !D.hints[p]) { E.hintContent.innerHTML = '<p>当前页面没有必须解决的谜题。可以继续浏览站内栏目、相关系统或查看证据板梳理线索。</p>'; E.getHint.disabled = true; }
    else { E.getHint.disabled = !!state.completed[p]; renderHints(p); }
    E.hintDialog.showModal();
  }

  function renderHints(p) {
    const level = state.hints[p] || 0;
    E.hintContent.innerHTML = D.hints[p].map((h,i) => `<div class="hint-level ${i < level ? '' : 'locked'}"><b>第${i+1}级提示</b><p>${i < level ? h : '点击下方按钮解锁'}</p></div>`).join('');
    E.getHint.textContent = level >= 3 ? '已显示完整答案' : '获取下一级提示';
    E.getHint.disabled = level >= 3 || !!state.completed[p];
  }

  function nextHint() {
    const p = puzzleByPage[state.current];
    if (!p) return;
    state.hints[p] = Math.min(3, (state.hints[p] || 0) + 1);
    state.hintHistory.push({ p, level: state.hints[p], time: new Date().toISOString() });
    save(); renderHints(p);
  }

  function applySettings() {
    document.body.classList.toggle('reduce-motion', state.settings.reduceMotion);
    document.body.classList.remove('intensity-standard','intensity-mild','intensity-ambient');
    document.body.classList.add(`intensity-${state.settings.intensity}`);
    document.documentElement.style.setProperty('--game-volume', state.settings.volume / 100);
    $('#intensitySelect').value = state.settings.intensity;
    $('#volumeRange').value = state.settings.volume;
    $('#reduceMotion').checked = state.settings.reduceMotion;
    $('#audioBtn').classList.toggle('active', state.audio);
    $('#audioBtn').textContent = `音效：${state.audio ? '开' : '关'}`;
    $('#coverAudioBtn').textContent = `音效：${state.audio ? '开' : '关'}`;
    $('#coverAudioBtn').setAttribute('aria-pressed', String(state.audio));
    if (state.audio && !E.app.classList.contains('hidden')) startAmbient();
  }

  function stopAmbient() {
    ambientNodes.forEach(n => { try { n.stop?.(); } catch {} try { n.disconnect?.(); } catch {} });
    ambientNodes = [];
  }

  function startAmbient() {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      audioCtx = audioCtx || new Ctx();
      audioCtx.resume?.();
      stopAmbient();
      const master = audioCtx.createGain();
      const intensityGain = state.settings.intensity === 'standard' ? 1 : state.settings.intensity === 'mild' ? .72 : .48;
      master.gain.value = .014 * (state.settings.volume / 100) * intensityGain;
      master.connect(audioCtx.destination);
      const low = audioCtx.createOscillator();
      const overtone = audioCtx.createOscillator();
      low.type = 'sine'; low.frequency.value = 54;
      overtone.type = 'triangle'; overtone.frequency.value = 108.3;
      low.connect(master); overtone.connect(master);
      low.start(); overtone.start();
      ambientNodes = [low, overtone, master];
    } catch (e) { console.warn('环境音启动失败', e); }
  }

  function toggleAudio() {
    state.audio = !state.audio;
    if (state.audio) startAmbient(); else stopAmbient();
    save();
    $('#audioBtn').classList.toggle('active', state.audio);
    $('#audioBtn').textContent = `音效：${state.audio ? '开' : '关'}`;
    $('#coverAudioBtn').textContent = `音效：${state.audio ? '开' : '关'}`;
    $('#coverAudioBtn').setAttribute('aria-pressed', String(state.audio));
  }

  function closeMoreMenu() {
    $('#moreMenu').classList.add('hidden');
    $('#moreBtn').setAttribute('aria-expanded','false');
  }

  E.newGame.onclick = startNew;
  E.cont.onclick = continueGame;
  $('#coverSettingsBtn').onclick = () => { applySettings(); E.settingsDialog.showModal(); };
  $('#settingsBtn').onclick = () => { closeMoreMenu(); applySettings(); E.settingsDialog.showModal(); };
  $('#contentBtn').onclick = () => E.infoDialog.showModal();
  $('#audioBtn').onclick = toggleAudio;
  $('#coverAudioBtn').onclick = toggleAudio;
  $('#saveBtn').onclick = () => { closeMoreMenu(); save(false); };
  $('#noteBtn').onclick = () => openSide('notes');
  $('#evidenceBtn').onclick = () => openSide('evidence');
  $('#hintBtn').onclick = openHint;
  $('#supportBtn').onclick = () => { closeMoreMenu(); window.Paywall?.showManual(); };
  $('#moreBtn').onclick = e => {
    e.stopPropagation();
    const menu = $('#moreMenu');
    const opening = menu.classList.contains('hidden');
    menu.classList.toggle('hidden', !opening);
    $('#moreBtn').setAttribute('aria-expanded', String(opening));
  };
  $('#browserBackBtn').onclick = browserBack;
  $('#browserHomeBtn').onclick = () => showPortalInfo('home');
  E.getHint.onclick = nextHint;
  $('#closeSideBtn').onclick = () => E.layout.classList.remove('side-open');
  $$('[data-side]').forEach(b => b.onclick = () => { sideTab = b.dataset.side; renderSide(); });
  $('#applySettingsBtn').onclick = e => {
    e.preventDefault();
    state.settings = { intensity: $('#intensitySelect').value, volume: +$('#volumeRange').value, reduceMotion: $('#reduceMotion').checked };
    applySettings(); save(); E.settingsDialog.close(); toast('设置已保存');
  };


  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { E.layout.classList.remove('side-open'); closeMoreMenu(); }
    if (e.key === '?' && !E.app.classList.contains('hidden')) openHint();
  });
  document.addEventListener('click', e => { if (!e.target.closest('.top-actions')) closeMoreMenu(); });

  updateContinue(); applySettings();
  if (new URLSearchParams(location.search).has('test')) {
    window.__GAME_TEST__ = {
      getState: () => JSON.parse(JSON.stringify(state)), go, complete, addEvidence, showEnding, showPortalInfo, returnFromPortal,
      reset: () => { state = fresh(); state.started = true; save(); enter(); go('mail'); }
    };
  }
})();
