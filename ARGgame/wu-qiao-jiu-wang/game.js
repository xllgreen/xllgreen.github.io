(() => {
  "use strict";

  const D = window.WUQIAO_DATA;
  const A = window.WUQIAO_APPS;
  const SAVE_KEY = "wuqiao_404_save_v1";
  const ROUTE_KEY = "wuqiao_404_routes_ever";

  const LOGIN_PASSWORD = "080717";

  const DEFAULT_STATE = {
    schemaVersion: 2,
    stage: 0,
    evidence: [],
    routes: [],
    activeRoute: null,
    currentApp: "case",
    notes: "",
    hints: {},
    errors: {},
    searches: [],
    appViews: {},
    drafts: {},
    revisitMode: false,
    settings: { sound: true, reduceMotion: false, lowFear: false },
    ending: null
  };

  const $ = (q, root = document) => root.querySelector(q);
  const $$ = (q, root = document) => Array.from(root.querySelectorAll(q));
  const esc = (value = "") => String(value).replace(/[&<>'"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;","\"":"&quot;"})[c]);
  const norm = (value = "") => String(value).trim().toLowerCase().replace(/[\s_—–-]+/g, "").replace(/：/g, ":").replace(/／/g, "/");
  const rawDraft = (key, name) => String(state.drafts?.[key]?.[name] || "");

  function optionList(options, selectedValue = "") {
    return options.map(([value, label]) => `<option value="${esc(value)}" ${String(selectedValue) === String(value) ? "selected" : ""}>${esc(label)}</option>`).join("");
  }

  function keywordSelect(name, label, options, key = String(state.stage)) {
    return `<label class="keyword-field"><span>${esc(label)}</span><select name="${esc(name)}"><option value="">请选择关键词</option>${optionList(options, rawDraft(key, name))}</select></label>`;
  }

  function beginnerCard(title, rows) {
    return `<aside class="beginner-card"><div class="beginner-badge">小白判读卡</div><h4>${esc(title)}</h4><ul>${rows.map(([term, text]) => `<li><b>${esc(term)}</b><span>${esc(text)}</span></li>`).join("")}</ul></aside>`;
  }

  const storageGet = key => { try { return localStorage.getItem(key); } catch (_) { return null; } };
  const storageSet = (key, value) => { try { localStorage.setItem(key, value); return true; } catch (_) { return false; } };
  const storageRemove = key => { try { localStorage.removeItem(key); } catch (_) { /* in-memory play still works */ } };

  let state = loadState();
  let toastTimer = 0;
  let audioCtx = null;
  let ambience = null;
  let ambienceTickTimer = 0;
  let bootTimer = 0;
  let windowDrag = null;
  let activeSystemWindow = null;

  function normalizeState(parsed) {
    const base=structuredClone(DEFAULT_STATE);
    if (!parsed || typeof parsed!=="object" || ![1,2].includes(Number(parsed.schemaVersion))) return base;
    const validApps=new Set(["case",...Object.keys(D.platformMeta)]);
    const validRoutes=new Set(Object.keys(D.routeData));
    const validEndings=new Set(Object.keys(D.endingText));
    const stage=Number.isInteger(Number(parsed.stage))?Math.max(0,Math.min(Number(parsed.stage),D.stages.length-1)):0;
    return {
      ...base,
      ...parsed,
      schemaVersion:2,
      stage,
      evidence:Array.isArray(parsed.evidence)?parsed.evidence.filter(item=>item&&typeof item.id==="string"&&typeof item.label==="string").slice(0,80):[],
      routes:Array.isArray(parsed.routes)?[...new Set(parsed.routes.filter(id=>validRoutes.has(id)))].slice(0,2):[],
      activeRoute:validRoutes.has(parsed.activeRoute)?parsed.activeRoute:null,
      currentApp:validApps.has(parsed.currentApp)?parsed.currentApp:"case",
      notes:typeof parsed.notes==="string"?parsed.notes.slice(0,10000):"",
      hints:parsed.hints&&typeof parsed.hints==="object"&&!Array.isArray(parsed.hints)?parsed.hints:{},
      errors:parsed.errors&&typeof parsed.errors==="object"&&!Array.isArray(parsed.errors)?parsed.errors:{},
      searches:Array.isArray(parsed.searches)?parsed.searches.slice(-80):[],
      appViews:parsed.appViews&&typeof parsed.appViews==="object"&&!Array.isArray(parsed.appViews)?parsed.appViews:{},
      drafts:parsed.drafts&&typeof parsed.drafts==="object"&&!Array.isArray(parsed.drafts)?parsed.drafts:{},
      revisitMode:Boolean(parsed.revisitMode),
      settings:{...base.settings,...(parsed.settings&&typeof parsed.settings==="object"?parsed.settings:{})},
      ending:validEndings.has(parsed.ending)?parsed.ending:null
    };
  }

  function loadState() {
    try {
      const parsed = JSON.parse(storageGet(SAVE_KEY) || "null");
      return normalizeState(parsed);
    } catch (_) {
      return structuredClone(DEFAULT_STATE);
    }
  }

  function save(silent = true) {
    try {
      if (!storageSet(SAVE_KEY, JSON.stringify(state))) throw new Error("storage unavailable");
      if (!silent) toast("调查已保存在本机。", "success");
      return true;
    } catch (_) {
      if (!silent) toast("浏览器未允许本机存档，请检查隐私或存储设置。", "error");
      return false;
    }
  }

  function routesEver() {
    try { const parsed=JSON.parse(storageGet(ROUTE_KEY) || "[]"); return Array.isArray(parsed)?[...new Set(parsed.filter(id=>D.routeData[id]))]:[]; }
    catch (_) { return []; }
  }

  function recordRouteEver(id) {
    const set = new Set(routesEver());
    set.add(id);
    storageSet(ROUTE_KEY, JSON.stringify([...set]));
  }

  function toast(message, kind = "") {
    const el = $("#toast");
    clearTimeout(toastTimer);
    el.textContent = message;
    el.className = `toast ${kind} show`;
    toastTimer = setTimeout(() => { el.className = "toast"; }, 2800);
    if (state.settings.sound) beep(kind === "error" ? 160 : 520, kind === "error" ? .12 : .07);
  }

  function ensureAudio() {
    try {
      audioCtx ||= new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === "suspended") audioCtx.resume();
      return audioCtx;
    } catch (_) { return null; }
  }

  function beep(freq, duration, type = "triangle", volume = .032) {
    if (!state.settings.sound) return;
    try {
      const ctx = ensureAudio();
      if (!ctx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(volume, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(.0001, audioCtx.currentTime + duration);
      osc.connect(gain).connect(audioCtx.destination);
      osc.start(); osc.stop(audioCtx.currentTime + duration);
    } catch (_) { /* audio is optional */ }
  }

  function stopAmbience() {
    clearTimeout(ambienceTickTimer);
    ambienceTickTimer = 0;
    if (!ambience) return;
    const current = ambience;
    const now = audioCtx?.currentTime || 0;
    try {
      current.gain.gain.cancelScheduledValues(now);
      current.gain.gain.setTargetAtTime(.0001, now, .08);
      setTimeout(() => current.nodes.forEach(node => { try { node.stop?.(); } catch (_) {} }), 350);
    } catch (_) {}
    ambience = null;
  }

  function playDiskTick() {
    if (!state.settings.sound || !audioCtx || !ambience) return;
    const now = audioCtx.currentTime;
    const source = audioCtx.createBufferSource();
    const gain = audioCtx.createGain();
    const buffer = audioCtx.createBuffer(1, Math.ceil(audioCtx.sampleRate * .025), audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    source.buffer = buffer;
    gain.gain.setValueAtTime(.012, now);
    gain.gain.exponentialRampToValueAtTime(.0001, now + .025);
    source.connect(gain).connect(audioCtx.destination);
    source.start(now);
    ambienceTickTimer = setTimeout(playDiskTick, 6500 + Math.random() * 6500);
  }

  function startAmbience(scene = "desktop") {
    if (!state.settings.sound) { stopAmbience(); return; }
    if (ambience?.scene === scene) return;
    stopAmbience();
    const ctx = ensureAudio();
    if (!ctx) return;
    try {
      const seconds = 3;
      const buffer = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate);
      const channel = buffer.getChannelData(0);
      let brown = 0;
      for (let i = 0; i < channel.length; i++) {
        brown = (brown + .018 * (Math.random() * 2 - 1)) / 1.018;
        channel[i] = brown * 3.2;
      }
      const noise = ctx.createBufferSource();
      const filter = ctx.createBiquadFilter();
      const hum = ctx.createOscillator();
      const humGain = ctx.createGain();
      const master = ctx.createGain();
      const presets = {
        boot: [310, .007, 52, .003],
        rain: [1250, .013, 55, .0035],
        office: [680, .009, 60, .0025],
        disk: [430, .008, 50, .004],
        desktop: [520, .008, 55, .003]
      };
      const [cutoff, noiseGain, humFreq, humVolume] = presets[scene] || presets.desktop;
      noise.buffer = buffer;
      noise.loop = true;
      filter.type = "lowpass";
      filter.frequency.value = cutoff;
      hum.type = "sine";
      hum.frequency.value = humFreq;
      humGain.gain.value = humVolume;
      master.gain.setValueAtTime(.0001, ctx.currentTime);
      master.gain.linearRampToValueAtTime(noiseGain, ctx.currentTime + .8);
      noise.connect(filter).connect(master);
      hum.connect(humGain).connect(master);
      master.connect(ctx.destination);
      noise.start(); hum.start();
      ambience = { scene, gain: master, nodes: [noise, hum] };
      ambienceTickTimer = setTimeout(playDiskTick, 4000 + Math.random() * 3500);
    } catch (_) { ambience = null; }
  }

  function addEvidence(id, label) {
    if (!state.evidence.some(e => e.id === id)) state.evidence.push({ id, label });
  }

  function advance(id, label) {
    addEvidence(id, label);
    state.stage = Math.min(state.stage + 1, D.stages.length - 1);
    state.currentApp = "case";
    save();
    renderAll();
    toast(`已校验：${label}`, "success");
  }

  function draft(stage, name) { return esc(state.drafts?.[stage]?.[name] || ""); }
  function bindDrafts(form, key = String(state.stage)) {
    if (!form) return;
    form.addEventListener("input", e => {
      if (!e.target.name) return;
      state.drafts[key] ||= {};
      state.drafts[key][e.target.name] = e.target.value;
      save();
    });
  }

  function showDesktop(openWindow = false) {
    $("#boot").hidden = true;
    $("#desktop").hidden = false;
    applySettings();
    startAmbience(openWindow ? "rain" : "desktop");
    renderAll();
    $("#start-menu").hidden = true;
    $("#start-menu-btn").setAttribute("aria-expanded", "false");
    if (openWindow) openApp(state.currentApp || "case", false);
    else {
      $("#app-window").hidden = true;
      $("#task-button").hidden = true;
      $("#desktop-welcome").hidden = false;
    }
  }

  function renderAll() {
    const [chapter, name] = D.stages[state.stage];
    $("#stage-label").textContent = `${chapter} · ${name}`;
    const progress = Math.round((state.stage / (D.stages.length - 1)) * 100);
    $("#progress-bar").style.width = `${progress}%`;
    $("#progress-text").textContent = `${progress}%`;
    $("#hint-level").textContent = `${Math.min(state.hints[state.stage] || 0, 3)}/3`;
    $("#evidence-count").textContent = `${state.evidence.length}条已校验`;
    $("#evidence-list").innerHTML = state.evidence.length
      ? state.evidence.slice(-8).map(e => `<li><span class="source-ids">${esc(e.id)}</span> ${esc(e.label)}</li>`).join("")
      : "<li>尚无。浏览和搜索不会自动记录。</li>";
    $("#route-badges").innerHTML = state.routes.length
      ? state.routes.map(r => `<span>${esc(r)} · ${esc(D.routeData[r].name)}</span>`).join("")
      : "<span>尚未挂载</span>";
    $("#notes").value = state.notes || "";
    if (!$("#app-window").hidden) openApp(state.currentApp || "case", false);
  }

  function openApp(app, persist = true) {
    activeSystemWindow = null;
    state.currentApp = app;
    if (persist) save();
    $$(".nav-app").forEach(btn => btn.classList.toggle("active", btn.dataset.app === app));
    const title = app === "case" ? "调查记录簿" : D.platformMeta[app].name;
    $("#app-window").hidden = false;
    $("#app-window").dataset.app = app;
    $("#desktop-welcome").hidden = true;
    $("#task-button").hidden = false;
    $("#task-icon").textContent = app === "case" ? "▤" : ($(`.nav-app[data-app="${app}"] .desktop-icon i`)?.textContent || "□");
    $("#window-title").textContent = title;
    $("#task-name").textContent = title;
    $("#window-icon").textContent = app === "case" ? "▤" : ($(`.nav-app[data-app="${app}"] .desktop-icon i`)?.textContent || "□");
    if (app === "case") renderCase(); else renderPlatform(app);
    startAmbience(app === "case" ? "rain" : (["qq", "sms", "mail"].includes(app) ? "office" : "disk"));
    $("#window-content").scrollTop = 0;
  }

  const pageHead = (kicker, title, text) => `<header class="page-head"><div><div class="kicker">${esc(kicker)}</div><h2>${esc(title)}</h2><p>${text}</p></div></header>`;
  const feedback = () => `<div class="feedback" data-feedback aria-live="polite"></div>`;
  const submitRow = (label = "校验并写入记录") => `<div class="submit-row"><button class="submit-button" type="submit">${esc(label)}</button><span class="source-ids">选择完成并校验通过后推进</span></div>`;

  function renderCase() {
    const c = $("#window-content");
    if (state.ending) {
      c.innerHTML = pageHead("CASE CLOSED", D.endingText[state.ending][0], "本周目调查已经归档。可回看旧网材料，或在设置中开始新周目；跨周目路线记录会保留。") + endingSummary(state.ending, false);
      return;
    }
    const renderers = [renderMount, renderSourceTree, renderPhoto, renderIdentity, render231, renderContact, () => renderRoute(1), () => renderRoute(2), renderAuthor, renderProfit, renderFinal];
    renderers[state.stage]();
  }

  function setError(form, message) {
    const el = $("[data-feedback]", form);
    if (el) { el.textContent = message; el.className = "feedback error"; }
    form.classList.remove("shake"); void form.offsetWidth; form.classList.add("shake");
    state.errors[state.stage] = (state.errors[state.stage] || 0) + 1;
    save();
    toast(message, "error");
  }

  function renderMount() {
    const c = $("#window-content");
    c.innerHTML = pageHead("PROLOGUE / 暑期第1天", "安全打开蓝鲸网吧旧硬盘", "这一步不考电脑术语。先把后台记录翻译成日常说法，再选择对应的硬盘、电脑和打开方式。") + `
      <div class="stage-grid"><section class="panel"><h3>当前可查材料</h3><ul class="material-list"><li>机箱资产贴：<span class="source-ids">蓝鲸网吧 · 17号机</span></li><li>蓝鲸后台的卷标扫描中，只有一块硬盘同时写着“LJ-17”和“只读挂载”。</li><li>系统日期曾回退，所以不能按“最后开机时间”猜硬盘。</li></ul>${beginnerCard("三个词其实很简单", [["卷标", "硬盘的名字；这里要找与17号机相同编号的名字。"], ["机位", "网吧电脑编号；机箱贴已经写明是17号机。"], ["只读", "只看资料、不修改原硬盘，是最安全的打开方式。"]])}<img class="evidence-photo" src="assets/evidence-devices.webp" alt="旧IDE硬盘、会员卡、CCD相机和翻盖手机组成的物证照片"></section>
      <form id="stage-form" class="form-panel"><h3>选择挂载参数</h3><div class="field-grid">${keywordSelect("label","硬盘卷标",[["DATA-02","DATA-02"],["LJ-17","LJ-17"],["SYSTEM","SYSTEM"]],"0")}${keywordSelect("seat","对应机位",[["12","12号机"],["17","17号机"],["21","21号机"]],"0")}${keywordSelect("mode","打开方式",[["readwrite","读写（会改动原盘）"],["readonly","只读（只看不改）"],["format","格式化（清空硬盘）"]],"0")}</div>${submitRow("安全打开硬盘")}${feedback()}</form></div>`;
    const form = $("#stage-form"); bindDrafts(form);
    form.addEventListener("submit", e => {
      e.preventDefault(); const fd = new FormData(form);
      if (norm(fd.get("label")) !== "lj17" || norm(fd.get("seat")) !== "17" || fd.get("mode") !== "readonly") return setError(form, "还有一项没有对应上：硬盘名字要和17号机一致，打开方式要保证不修改原硬盘。");
      advance("H-17", "17号机硬盘只读挂载");
    });
  }

  function renderSourceTree() {
    const c = $("#window-content");
    c.innerHTML = pageHead("CHAPTER 01", "原帖与转载溯源", "在天崖、百渡和新琅查看同一故事的不同版本。无需手打来源编号，按发布时间选择版本，并用两个关键词补全变化。") + `
      <div class="stage-grid"><section class="panel"><h3>版本关系</h3><p>草稿、公开帖、转载和总结并不是四条独立证据，而是一条不断被改写的传播链。</p><ol class="timeline"><li><time>08-12</time><span>最早创作稿</span></li><li><time>08-14</time><span>论坛公开版本</span></li><li><time>08-15</time><span>跨站转载</span></li><li><time>2009-02</time><span>后期总结</span></li></ol>${beginnerCard("来源编号怎么看", [["T", "天崖社区里的主题或楼层。"], ["B", "百渡帖吧里的转载或广告。"], ["N", "后来整理的网络文章。"]])}</section>
      <form id="stage-form" class="form-panel"><h3>按时间拼好来源树</h3><div class="field-grid">${keywordSelect("v1","08-12 · 最早创作稿",[["T-00","T-00 接龙草稿"],["T-01","T-01 公开帖"],["B-01","B-01 跨站转载"]],"1")}${keywordSelect("v2","08-14 · 论坛公开版",[["T-00","T-00 接龙草稿"],["T-01","T-01 公开帖"],["B-01","B-01 跨站转载"]],"1")}${keywordSelect("v3","08-15 · 跨站转载",[["T-01","T-01 公开帖"],["B-01","B-01 跨站转载"],["N-01","N-01 后期总结"]],"1")}${keywordSelect("v4","2009-02 · 后期总结",[["B-01","B-01 跨站转载"],["N-01","N-01 后期总结"],["C-404","C-404 恢复页"]],"1")}${keywordSelect("change","第一次改变故事性质的版本",[["T-00","T-00 接龙草稿"],["T-01","T-01 公开帖"],["B-01","B-01 跨站转载"]],"1")}${keywordSelect("removed","该版本删掉了",[["writing_tag","“接龙创作”标签"],["photo","旧站照片"],["author","作者账号"]],"1")}${keywordSelect("added","同时加入了",[["search_wording","真实寻人式措辞"],["fiction_rule","每人续写一段的规则"],["deletion_request","删除照片和号码的请求"]],"1")}</div>${submitRow()}${feedback()}</form></div>`;
    const form=$("#stage-form"); bindDrafts(form); form.addEventListener("submit",e=>{e.preventDefault();const f=new FormData(form);const order=["t00","t01","b01","n01"];const vals=[f.get("v1"),f.get("v2"),f.get("v3"),f.get("v4")].map(norm);if(vals.some((v,i)=>v!==order[i])||norm(f.get("change"))!=="t01"||f.get("removed")!=="writing_tag"||f.get("added")!=="search_wording")return setError(form,"来源树还有一处接错。按时间排四个版本，再找出最早删掉“接龙”标签、改成寻人口吻的那一版。");advance("T-CHAIN","原帖—公开版—转载—总结来源树");});
  }

  function renderPhoto() {
    const c=$("#window-content");c.innerHTML=pageHead("CHAPTER 02 / PART A","照片先于故事","先直接看两张图的差异，再用三个可读字段核实。这里不需要理解图像数据库或手打软件全名。")+`
      <div class="stage-grid photo-stage"><section class="panel"><h3>WQ-OLD-05 与 rw_0813</h3><div class="photo-compare"><figure><img src="assets/bus-station-original.webp" alt="无人站台的旧客运站原始照片"><figcaption>恢复文件 A · WQ-OLD-05</figcaption></figure><figure><img src="assets/bus-station-rain.webp" alt="左侧加入红伞人物的旧客运站传播图"><figcaption>恢复文件 B · rw_0813</figcaption></figure></div>${beginnerCard("不用懂图片元数据", [["源文件", "这张图是从哪一张图改出来的。"], ["软件字段", "最后保存图片时使用的软件。"], ["背景定年", "用画面里不会轻易变化的物体判断照片年代。"]])}</section>
      <form id="stage-form" class="form-panel"><h3>用关键词完成鉴定</h3><div class="field-grid single">${keywordSelect("original","原始版本",[["A","恢复文件 A"],["B","恢复文件 B"],["unknown","无法判断"]],"2")}${keywordSelect("landmark","用于判断年代的固定背景",[["billboard","右侧旧广告牌"],["umbrella","红伞"],["rain","雨夜天气"]],"2")}${keywordSelect("landmark_state","后台记录写着它",[["removed_2006","已于2006年拆除"],["built_2008","2008年刚建成"],["unknown","没有年代记录"]],"2")}${keywordSelect("software","文件链中的编辑软件",[["photoshop_cs2","Adobe Photoshop CS2"],["paint","画图程序"],["camera","相机固件"]],"2")}${keywordSelect("region","两图新增的区域",[["red_figure","红伞人物"],["billboard","右侧广告牌"],["bus_stop","站台顶棚"]],"2")}${keywordSelect("background","旧站背景属于",[["original_background","2005年原图内容"],["new_background","2008年新拍内容"],["generated","完全生成的画面"]],"2")}${keywordSelect("figure","红伞人物属于",[["added_later","后期加入"],["original_person","原始现场人物"],["unrelated","无法比较"]],"2")}</div>${submitRow()}${feedback()}</form></div>`;
    const form=$("#stage-form");bindDrafts(form);form.addEventListener("submit",e=>{e.preventDefault();const f=new FormData(form);if(f.get("original")!=="A"||f.get("landmark")!=="billboard"||f.get("landmark_state")!=="removed_2006"||f.get("software")!=="photoshop_cs2"||f.get("region")!=="red_figure"||f.get("background")!=="original_background"||f.get("figure")!=="added_later")return setError(form,"鉴定链还有一项不一致。先看红伞人物只出现在哪一张图，再用广告牌拆除年份和软件字段核实。");advance("P-VERIFY","旧站原图与传播图版本鉴伪");});
  }

  function renderIdentity() {
    const saved=state.drafts?.[3]?.sources||[];
    const c=$("#window-content");c.innerHTML=pageHead("CHAPTER 02 / PART B","白纸风筝是否存在","你只能选两项组成‘最低充分证据组’。选择过多会掩盖论证，选择查无记录又会把缺失数据误当成不存在。")+`
      <form id="stage-form" class="form-panel identity-form"><section><h3>候选材料 · 只能选择两项</h3><div class="evidence-choice-grid">
        <label><input type="checkbox" name="sources" value="L-00" ${saved.includes("L-00")?"checked":""}><b>L-00</b><span>三校组合检索无固定匹配</span></label>
        <label><input type="checkbox" name="sources" value="T-00" ${saved.includes("T-00")?"checked":""}><b>T-00</b><span>原始版块、规则与第一段</span></label>
        <label><input type="checkbox" name="sources" value="L-03" ${saved.includes("L-03")?"checked":""}><b>L-03</b><span>三组语言习惯与冲突上线时段</span></label>
        <label><input type="checkbox" name="sources" value="LK-06" ${saved.includes("LK-06")?"checked":""}><b>LK-06</b><span>陆珂转学名册与隐藏字段</span></label>
      </div><p class="notice">问题是“白纸风筝这一身份如何产生”，不是“现实中有没有一位生活细节相似的人”。</p>${beginnerCard("“查无结果”不能等于“不存在”", [["L-00", "只说明这份不完整校友录里没查到。"], ["T-00", "直接写着这是接龙创作。"], ["L-03", "三组不同写作习惯，说明不止一个人续写。"]])}</section><section><h3>身份简报 C1</h3><div class="field-grid single"><label>当前身份判断<select name="identity"><option value="">请选择</option><option value="collective" ${draft(3,"identity")==="collective"?"selected":""}>多人接龙形成的虚构角色</option><option value="missing" ${draft(3,"identity")==="missing"?"selected":""}>真实失踪者</option><option value="unknown" ${draft(3,"identity")==="unknown"?"selected":""}>证据不足</option></select></label>${keywordSelect("counter","“查无学籍”只能说明",[["index_incomplete","当前索引可能不完整"],["person_absent","现实中一定没有这个人"],["name_fake","所有相似姓名都是假的"]],"3")}${keywordSelect("origin_proof","T-00证明",[["fiction_rule","故事起点是接龙创作"],["missing_case","发生过真实失踪"],["commercial_ad","这是收费广告"]],"3")}${keywordSelect("multi_proof","L-03证明",[["multi_writers","存在多组写作习惯"],["same_writer","全文只有一位作者"],["no_writer","无法判断是否有人写过"]],"3")}</div>${submitRow("提交C1简报")}${feedback()}</section></form>`;
    const form=$("#stage-form");bindDrafts(form);form.addEventListener("change",()=>{state.drafts[3]||={};state.drafts[3].sources=new FormData(form).getAll("sources");save();});form.addEventListener("submit",e=>{e.preventDefault();const f=new FormData(form),src=f.getAll("sources");if(src.length!==2||!src.includes("T-00")||!src.includes("L-03")||f.get("identity")!=="collective"||f.get("counter")!=="index_incomplete"||f.get("origin_proof")!=="fiction_rule"||f.get("multi_proof")!=="multi_writers")return setError(form,"最低证据组或关键词还有一项不成立。选一项证明接龙起点、一项证明多人续写，并记住“没查到”不等于“不存在”。");advance("C1","白纸风筝身份简报");});
  }

  function render231() {
    const c=$("#window-content");c.innerHTML=pageHead("CHAPTER 03 / PART A","恢复被删的第231楼","三条残片分别保留句子前半、后半和送达状态。用关键词下拉补全原句，不会再因为“并不是/不是”等同义表达判错。")+`
      <div class="stage-grid"><section class="panel"><h3>残片对照</h3><p><span class="source-ids">F-231-A</span> 保留开头；<span class="source-ids">F-231-B</span> 保留结尾；<span class="source-ids">S-DUTY</span> 保留值班回执。</p><div class="notice danger">二手截图把原句改成“我就是白纸风筝”。必须用引用时间与原标点恢复上下文。</div></section>
      <form id="stage-form" class="form-panel"><h3>关键词填空</h3><p class="sentence-preview">“这段话来自我的___。我___你们说的人，也不需要被___。请删掉___。”</p><div class="field-grid">${keywordSelect("w1","缺词1",[["博客","博客"],["短信","短信"],["学校","学校"]],"4")}${keywordSelect("w2","缺词2",[["不是","不是 / 并不是"],["就是","就是"],["认识","认识"]],"4")}${keywordSelect("w3","缺词3",[["寻找","寻找"],["证明","证明"],["采访","采访"]],"4")}${keywordSelect("w4","缺词4",[["照片和号码","照片和号码"],["所有回帖","所有回帖"],["接龙原文","接龙原文"]],"4")}${keywordSelect("posted","发布时间",[["18:54","18:54"],["18:58","18:58"],["19:03","19:03"]],"4")}${keywordSelect("deleted","删除时间",[["18:54","18:54"],["18:58","18:58"],["19:03","19:03"]],"4")}</div>${submitRow()}${feedback()}</form></div>`;
    const form=$("#stage-form");bindDrafts(form);form.addEventListener("submit",e=>{e.preventDefault();const f=new FormData(form);if(f.get("w1")!=="博客"||f.get("w2")!=="不是"||f.get("w3")!=="寻找"||f.get("w4")!=="照片和号码"||f.get("posted")!=="18:54"||f.get("deleted")!=="19:03")return setError(form,"还有一个关键词或时间没有对应残片。注意原句是否认身份，18:54发布、19:03删除。");advance("F-231","第231楼原文与删除时间");});
  }

  function renderContact() {
    const c=$("#window-content");c.innerHTML=pageHead("CHAPTER 03 / PART B","第37项联系人","声讯广告写“按37转接”，短信备份却写“通讯录第37项”。请根据送达记录确定真实账号，并制作不会识别当事人的公开稿。")+`
      <div class="stage-grid"><section class="panel"><h3>号码分歧</h3><table class="facts-table"><tr><th>材料</th><th>37的含义</th></tr><tr><td>百渡声讯广告</td><td>语音分机37</td></tr><tr><td>飞讯通讯录</td><td>第37项联系人</td></tr><tr><td>博客与聊天</td><td>半盏汽水 / 尾号0417</td></tr></table><img class="evidence-photo" src="assets/blog-stilllife.webp" alt="红伞、旧收音机、纸质车票与翻盖手机的写实静物照片"></section>
      <form id="stage-form" class="form-panel"><h3>账号匹配与隐私填空</h3><div class="field-grid">${keywordSelect("index","通讯录序号",[["37","第37项"],["17","第17项"],["231","第231项"]],"5")}${keywordSelect("tail","号码尾号",[["0417","0417"],["0017","0017"],["0812","0812"]],"5")}${keywordSelect("time","短信送达时间",[["18:54","18:54"],["18:58","18:58"],["19:03","19:03"]],"5")}${keywordSelect("alias","博客别名",[["半盏汽水","半盏汽水"],["纸舟","纸舟"],["北纬30度","北纬30度"]],"5")}${keywordSelect("public_name","公开稿中的称呼",[["person","当事人"],["real_name","真实姓名"],["alias","博客别名"]],"5")}${keywordSelect("public_number","号码处理",[["hide","完全不公开尾号"],["masked","公开***0417"],["full","公开完整号码"]],"5")}${keywordSelect("public_school","学校处理",[["hide","学校与去向全部隐去"],["old_school","只公开原学校"],["new_school","公开接收学校"]],"5")}</div><div class="privacy-preview"><b>公开稿预览</b><p>调查确认第37项联系人是“当事人”；号码、学校、去向与私人别名均不公开。</p></div>${submitRow()}${feedback()}</form></div>`;
    const form=$("#stage-form");bindDrafts(form);form.addEventListener("submit",e=>{e.preventDefault();const f=new FormData(form);if(f.get("index")!=="37"||f.get("tail")!=="0417"||f.get("time")!=="18:58"||f.get("alias")!=="半盏汽水"||f.get("public_name")!=="person"||f.get("public_number")!=="hide"||f.get("public_school")!=="hide")return setError(form,"账号匹配或隐私处理还有一项不正确。调查时可以核对尾号，但公开时不应留下尾号、别名或学校。");advance("M-37","第37项联系人与隐私稿");});
  }

  function renderRoute(number) {
    const c=$("#window-content");
    if (!state.activeRoute) {
      const completed = state.routes.map(id => `${id} ${D.routeData[id].name}`).join("、") || "无";
      const archived=routesEver();
      const savedChoice=rawDraft(String(state.stage),"routeChoice");
      c.innerHTML=pageHead(number===1?"CHAPTER 04":"CHAPTER 05",state.revisitMode?"档案续查：选择未完成路线":number===1?"挂载第一条调查路线":"挂载第二条调查路线","档案号仍保留为线索编号，但不再要求手打。选择你想调查的材料包，之后用关键词补全证据关系。")+`
        <div class="stage-grid"><section class="panel"><h3>本周目已完成</h3><p>${esc(completed)}</p><h3>跨周目档案</h3><p>${archived.length?archived.map(id=>`${esc(id)} ${esc(D.routeData[id].name)}`).join("、"):"尚无"}</p>${beginnerCard("四条路线分别回答什么", [["热门寻人", "目击如何互相复制，又如何接入收费热线。"], ["当事人档案", "虚构角色与真实信息被盗用者如何区分。"], ["技术还原", "用时间先后判断谁写入、谁删除。"], ["商业追责", "知情、收费、删澄清如何连成责任链。"]])}<div class="notice">${state.revisitMode?"续查模式会排除已经完成的路线，前六章证据无需重复录入。":"单周目需完成两条不同路线。若想触发有边界的公开，优先关注当事人档案与商业追责。"}</div></section>
        <form id="route-code-form" class="form-panel"><h3>选择下一档案包</h3><div class="route-picker">${Object.entries(D.routeData).map(([routeId,route])=>`<label class="route-pick ${state.routes.includes(routeId)||(state.revisitMode&&archived.includes(routeId)&&archived.length<4)?"unavailable":""}"><input type="radio" name="routeChoice" value="${esc(routeId)}" ${savedChoice===routeId?"checked":""}><b>${esc(route.name)}</b><span>${esc(route.code)}</span><small>${esc(route.scene)}</small></label>`).join("")}</div>${submitRow("挂载所选档案包")}${feedback()}</form></div>`;
      const form=$("#route-code-form");bindDrafts(form);form.addEventListener("submit",e=>{e.preventDefault();const id=new FormData(form).get("routeChoice");if(!id||!D.routeData[id])return setError(form,"请先选择一条调查路线。");if(state.routes.includes(id))return setError(form,"这条路线本周目已经完成，请选择另一组档案。");if(state.revisitMode&&archived.includes(id)&&archived.length<4)return setError(form,"这条路线已在上周目归档。续查模式请选择尚未完成的路线。");state.activeRoute=id;save();renderCase();});
      return;
    }
    const id=state.activeRoute,r=D.routeData[id],key=`route-${id}`;
    const sceneNames=r.scene.split(" / ");
    c.innerHTML=pageHead(number===1?"CHAPTER 04":"CHAPTER 05",r.name,`已挂载：${esc(r.code)} · ${esc(r.scene)}`)+`
      <div class="route-scene-copy"><h3>${esc(r.name)}</h3><p>${esc(r.intro)}</p><div class="notice">每道题先选一组材料，再用两个关键词补全“材料说明了什么”。不需要自己组织句子。</div></div>
      <form id="route-form" class="form-panel"><h3>三次证据判断</h3><div class="route-scenes challenge-scenes">${r.challenges.map((challenge,index)=>`<section class="scene-card challenge-card"><img src="${r.images[index]}" alt="${esc(sceneNames[index])}写实档案场景"><h4>场景${index+1} · ${esc(sceneNames[index])}</h4><p class="challenge-prompt">${esc(challenge.prompt)}</p><div class="route-options">${challenge.options.map(([value,label])=>`<label><input type="radio" name="choice_${index}" value="${esc(value)}" ${state.drafts[key]?.[`choice_${index}`]===value?"checked":""}><span>${esc(label)}</span></label>`).join("")}</div><div class="route-keyword-fills"><b>关键词填空</b>${challenge.fills.map(([label,answer,options],slot)=>keywordSelect(`fill_${index}_${slot}`,label,options,key)).join("")}</div></section>`).join("")}</div>${submitRow("提交路线判断")}${feedback()}</form>`;
    const form=$("#route-form");bindDrafts(form,key);form.addEventListener("submit",e=>{e.preventDefault();const f=new FormData(form);const failed=r.challenges.findIndex((challenge,index)=>f.get(`choice_${index}`)!==challenge.answer||challenge.fills.some(([,answer],slot)=>f.get(`fill_${index}_${slot}`)!==answer));if(failed>=0)return setError(form,`场景${failed+1}还有一项没有形成证据关系。先确认材料组，再逐个补全它们共同说明的事实。`);state.routes.push(id);recordRouteEver(id);addEvidence(`ROUTE-${id}`,r.name);state.activeRoute=null;state.stage++;save();renderAll();openModal(`<div class="modal-body character-reveal"><div class="kicker">ROUTE ${esc(id)} / 人物侧写更新</div><h2>${esc(r.name)}已归档</h2><p>${esc(r.reveal)}</p><div class="notice safe">跨周目路线进度：${routesEver().length}/4。新周目只需续查未完成路线。</div><button class="submit-button" data-close-route>继续调查</button></div>`);$("[data-close-route]")?.addEventListener("click",closeModal);toast(`${r.name}已完成`,"success");});
  }

  function renderAuthor() {
    const c=$("#window-content");c.innerHTML=pageHead("CHAPTER 05 / AUTHOR","谁写了第404楼","不需要理解系统日志格式，只比较“谁的登录时段包含23:48”，再区分内容原时间和恢复显示时间。")+`
      <div class="stage-grid"><section class="panel"><img class="evidence-photo" src="assets/netcafe-night.webp" alt="2008年深夜网吧内景与空置的17号机"><h3>待比较的四个时间窗</h3><div class="time-window-grid"><span><b>ADMIN-LOG</b>20:03—20:16 管理员维护</span><span><b>C-404-META</b>23:48 表单写入</span><span><b>Q-17</b>22:42—00:10 纸舟在线</span><span><b>R-26</b>2026恢复执行</span></div>${beginnerCard("时间窗只看“包含关系”", [["直接支持", "23:48落在纸舟22:42—00:10的登录时段内。"], ["排除项", "管理员20:16已经离开，不覆盖23:48。"], ["恢复时间", "2026是工具重新显示文件的时间，不是内容写入时间。"]])}</section>
      <form id="stage-form" class="form-panel"><h3>作者归因</h3><div class="field-grid single"><label>作者<select name="author"><option value="">请选择</option><option value="qinhe" ${draft(8,"author")==="qinhe"?"selected":""}>秦禾 / 纸舟</option><option value="admin" ${draft(8,"author")==="admin"?"selected":""}>网吧管理员</option><option value="hunan" ${draft(8,"author")==="hunan"?"selected":""}>胡南 / 北纬30度</option></select></label><label>直接支持<select name="support"><option value="">请选择</option><option value="login_write" ${draft(8,"support")==="login_write"?"selected":""}>Q-17登录窗覆盖C-404-META写入时刻</option><option value="same_seat" ${draft(8,"support")==="same_seat"?"selected":""}>两人都使用过17号机</option><option value="restore_date" ${draft(8,"support")==="restore_date"?"selected":""}>恢复器在2026显示此页</option></select></label><label>排除项<select name="exclude"><option value="">请选择</option><option value="admin_ended" ${draft(8,"exclude")==="admin_ended"?"selected":""}>管理员维护在草稿写入前已结束</option><option value="old_machine" ${draft(8,"exclude")==="old_machine"?"selected":""}>17号机后来停用</option><option value="no_network" ${draft(8,"exclude")==="no_network"?"selected":""}>当前离线镜像无法上网</option></select></label>${keywordSelect("display_action","2026发生的是",[["recovered","恢复器重新显示旧缓存"],["new_post","有人新发布一楼"],["clock_changed","作者修改了系统时间"]],"8")}${keywordSelect("content_time","内容真正写入于",[["2009_cache","2009年23:48的表单缓存"],["2026_reply","2026年新回复"],["2008_admin","2008年管理员维护时"]],"8")}</div>${submitRow()}${feedback()}</form></div>`;
    const form=$("#stage-form");bindDrafts(form);form.addEventListener("submit",e=>{e.preventDefault();const f=new FormData(form);if(f.get("author")!=="qinhe"||f.get("support")!=="login_write"||f.get("exclude")!=="admin_ended"||f.get("display_action")!=="recovered"||f.get("content_time")!=="2009_cache")return setError(form,"归因还有一项时间关系不一致。23:48要落在登录窗内，并把2009内容写入与2026恢复显示分开。");advance("C-404-AUTHOR","第404楼作者与恢复器误标");});
  }

  function renderProfit() {
    const c=$("#window-content");c.innerHTML=pageHead("CHAPTER 05 / RESPONSIBILITY","传播与收益链","分别选择“事前知情、收益对应、压制澄清”的证据。责任结论改为关键词选择，不再要求自己写一段完全匹配的中文。")+`
      <div class="stage-grid"><section class="panel"><img class="evidence-photo" src="assets/office-desk.webp" alt="2008年论坛版务办公室、旧电脑、打印结算表与小灵通"><h3>跨站候选材料</h3><ul class="material-list"><li><span class="source-ids">A-22</span> 版块移动与231楼删除</li><li><span class="source-ids">B-37</span> 热线脚本、时间与结算索引</li><li><span class="source-ids">E-FWD</span> 推广前的转发邮件头</li><li><span class="source-ids">E-VS</span> 分成结算与收款主体</li><li><span class="source-ids">EM-04</span> 删除后的内部回复</li></ul>${beginnerCard("结算索引相当于订单号", [["VS-200808", "同时出现在热线页和结算邮件，证明两份记录属于同一业务。"], ["金额大小", "金额再大也不能单独证明钱来自哪条热线。"], ["责任链", "要同时看到知情、获利和压低澄清，不能只抓一项。"]])}</section>
      <form id="stage-form" class="form-panel"><h3>责任链 C4</h3><div class="field-grid single"><label>事前知情证据<select name="knowledge"><option value="">请选择</option><option value="fwd" ${draft(9,"knowledge")==="fwd"?"selected":""}>E-FWD保留“接龙”主题且要求外页隐藏</option><option value="views" ${draft(9,"knowledge")==="views"?"selected":""}>B-01具有高回复量</option><option value="school" ${draft(9,"knowledge")==="school"?"selected":""}>L-00查无固定学籍匹配</option></select></label><label>收益对应证据<select name="profit"><option value="">请选择</option><option value="code" ${draft(9,"profit")==="code"?"selected":""}>B-37与E-VS使用同一VS-200808索引</option><option value="amount" ${draft(9,"profit")==="amount"?"selected":""}>结算金额大于2000元</option><option value="hotline" ${draft(9,"profit")==="hotline"?"selected":""}>热线每分钟收费1元</option></select></label><label>压制澄清证据<select name="suppress"><option value="">请选择</option><option value="delete_mail" ${draft(9,"suppress")==="delete_mail"?"selected":""}>A-22删除231楼，EM-04要求不发公开说明</option><option value="move_only" ${draft(9,"suppress")==="move_only"?"selected":""}>只依据移动版块</option><option value="fake_sighting" ${draft(9,"suppress")==="fake_sighting"?"selected":""}>纸舟发布向西假目击</option></select></label><label>主要责任人<select name="owner"><option value="">请选择</option><option value="hunan" ${draft(9,"owner")==="hunan"?"selected":""}>胡南 / 北纬30度</option><option value="qinhe" ${draft(9,"owner")==="qinhe"?"selected":""}>秦禾 / 纸舟</option></select></label>${keywordSelect("chain","三类证据合起来说明",[["full_chain","胡南明知故事源于接龙，仍通过热线获利并删除澄清"],["only_popular","帖子只是很受欢迎"],["only_mistake","胡南只是无意中移动了版块"]],"9")}</div>${submitRow()}${feedback()}</form></div>`;
    const form=$("#stage-form");bindDrafts(form);form.addEventListener("submit",e=>{e.preventDefault();const f=new FormData(form);if(f.get("knowledge")!=="fwd"||f.get("profit")!=="code"||f.get("suppress")!=="delete_mail"||f.get("owner")!=="hunan"||f.get("chain")!=="full_chain")return setError(form,"责任链尚未闭合。分别确认推广前知情、热线与结算同源，以及删掉本人澄清后仍不发说明。");advance("C4","胡南传播操纵与收益责任链");});
  }

  function buildPublicSummary(form) {
    const owner = form.owner === "hunan" ? "胡南" : form.owner === "qinhe" ? "秦禾" : "相关人员";
    const privacy = form.privacy === "fully_redacted" ? "隐去当事人的姓名、别名、号码、学校和去向" : "按所选范围处理当事人信息";
    return `调查保留原帖改写、删帖与收费结算的来源链，说明${owner}的相关责任；公开时${privacy}，并遵守授权范围。`;
  }

  function renderFinal() {
    const c=$("#window-content"),key="final",saved=state.drafts[key]||{};
    const selected=(name,value)=>saved[name]===value?"selected":"";
    const checked=value=>(saved.sources||[]).includes(value)?"checked":"";
    c.innerHTML=pageHead("FINAL REPORT","留下哪一版","终章全部使用明确选项。系统会根据你的选择自动生成公开摘要，不再要求玩家猜判题关键词或凑够字数。")+`
      <section class="character-dossiers"><h3>三个人，而不是三个证据标签</h3>${Object.values(D.characters).map(person=>`<article><b>${esc(person.name)}</b><em>${esc(person.role)}</em><p>${esc(person.conflict)}</p><small>${esc(person.sources)}</small></article>`).join("")}</section>
      <section class="consent-receipt"><div><span>授权回执</span><time>${esc(D.consentReceipt.date)}</time></div><h3>${esc(D.consentReceipt.title)}</h3><p>${esc(D.consentReceipt.text)}</p><b>${esc(D.consentReceipt.scope)}</b></section>
      <form id="final-form" class="form-panel final-report"><h3>雾桥旧网调查报告</h3><div class="field-grid">
        <label>1. 白纸风筝的身份<select name="f1"><option value="">请选择</option><option value="fiction_collective" ${selected("f1","fiction_collective")}>多人接龙形成的虚构角色</option><option value="real_missing" ${selected("f1","real_missing")}>有明确身份的真实失踪者</option><option value="identity_uncertain" ${selected("f1","identity_uncertain")}>证据不足</option></select></label>
        <label>2. 传播图的红影<select name="f2"><option value="">请选择</option><option value="composited_later" ${selected("f2","composited_later")}>在2005年原图上后期加入</option><option value="original_scene" ${selected("f2","original_scene")}>原始现场人物</option><option value="photo_uncertain" ${selected("f2","photo_uncertain")}>证据不足</option></select></label>
        <label>3. 当事人对寻找的态度<select name="f3"><option value="">请选择</option><option value="asked_to_stop" ${selected("f3","asked_to_stop")}>明确要求停止寻找与传播</option><option value="wanted_search" ${selected("f3","wanted_search")}>希望继续公开寻找</option><option value="attitude_uncertain" ${selected("f3","attitude_uncertain")}>证据不足</option></select></label>
        <label>4. 胡南是否知情及获利<select name="f4"><option value="">请选择</option><option value="knew_and_profited" ${selected("f4","knew_and_profited")}>明知接龙性质并收取分成</option><option value="unaware_no_profit" ${selected("f4","unaware_no_profit")}>不知情且未获利</option><option value="profit_uncertain" ${selected("f4","profit_uncertain")}>证据不足</option></select></label>
        <label>5. 第404楼显示在2026的原因<select name="f5"><option value="">请选择</option><option value="recovery_mislabel" ${selected("f5","recovery_mislabel")}>恢复器把2009缓存误挂到2026展示层</option><option value="new_reply_2026" ${selected("f5","new_reply_2026")}>2026年有人新发回复</option><option value="time_uncertain" ${selected("f5","time_uncertain")}>证据不足</option></select></label>
        <label>“第37个号码”的含义<select name="number"><option value="">请选择</option><option value="contact_37" ${selected("number","contact_37")}>通讯录第37项联系人</option><option value="hotline_37" ${selected("number","hotline_37")}>收费热线37分机</option><option value="number_uncertain" ${selected("number","number_uncertain")}>无法区分</option></select></label>
        <label>主要责任人<select name="owner"><option value="">请选择</option><option value="hunan" ${selected("owner","hunan")}>胡南 / 北纬30度</option><option value="qinhe" ${selected("owner","qinhe")}>秦禾 / 纸舟</option><option value="owner_uncertain" ${selected("owner","owner_uncertain")}>证据不足</option></select></label>
        <label>隐私处理<select name="privacy"><option value="">请选择</option><option value="fully_redacted" ${selected("privacy","fully_redacted")}>姓名、别名、尾号、学校、去向与私人原文全部隐去</option><option value="partial_redaction" ${selected("privacy","partial_redaction")}>只隐去姓名，保留别名与尾号</option><option value="identify_person" ${selected("privacy","identify_person")}>公开身份和转学去向以增强可信度</option></select></label>
        <fieldset class="source-picker"><legend>责任来源组 · 勾选所有必要来源</legend>${[["A-22","去标签与删231楼"],["B-37","热线公开记录"],["E-FWD","推广前已知接龙"],["E-VS","分成结算"],["Q-17","纸舟登录记录"]].map(([id,label])=>`<label><input type="checkbox" name="sources" value="${id}" ${checked(id)}><b>${id}</b> ${label}</label>`).join("")}</fieldset>
        <label>授权范围<select name="consent"><option value="">请选择</option><option value="limited_consent" ${selected("consent","limited_consent")}>按回执有限公开，并允许撤回</option><option value="assumed_consent" ${selected("consent","assumed_consent")}>未回复，但推定同意</option><option value="no_consent" ${selected("consent","no_consent")}>未取得同意</option></select></label>
        <label>公开策略<select name="strategy"><option value="">请选择</option><option value="bounded_publish" ${selected("strategy","bounded_publish")}>有边界地公开来源链</option><option value="seal_all" ${selected("strategy","seal_all")}>全部永久封存</option><option value="publish_everything" ${selected("strategy","publish_everything")}>完整公开全部材料</option></select></label>
        <section class="summary-field auto-summary"><b>系统生成的公开摘要</b><p id="summary-preview">选择责任人和隐私范围后，这里会自动生成摘要。</p><small>摘要只负责呈现你的结构化选择，不参与关键词判题。</small></section>
      </div>${submitRow("提交最终报告")}${feedback()}<div class="notice">结局只读取明确选项、必要来源、授权边界与已完成路线，不读取玩家自由表述。</div></form>`;
    const form=$("#final-form");
    const updateSummary=()=>{const current=Object.fromEntries(new FormData(form).entries());$("#summary-preview").textContent=buildPublicSummary(current);};
    bindDrafts(form,key);form.addEventListener("change",()=>{state.drafts[key]||={};state.drafts[key].sources=new FormData(form).getAll("sources");save();updateSummary();});updateSummary();
    form.addEventListener("submit",e=>{e.preventDefault();const fd=new FormData(form);const f=Object.fromEntries(fd.entries());f.sources=fd.getAll("sources");f.summary=buildPublicSummary(f);const required=["f1","f2","f3","f4","f5","number","owner","privacy","consent","strategy"];if(required.some(name=>!f[name]))return setError(form,"报告仍有空项。错误结论也可以提交，但每一项都必须明确作答。");const ending=calculateEnding(f);state.ending=ending;addEvidence("FINAL",`最终报告：${ending}`);save();showEnding(ending);renderAll();});
  }

  function calculateEnding(f) {
    return window.WUQIAO_LOGIC.calculateEnding(f, { routes: state.routes, routesEver: routesEver() });
  }

  function endingSummary(code, includeActions=true) {
    const [title,text]=D.endingText[code],routeCount=routesEver().length;
    const nextLabel=routeCount>=2&&routeCount<4?"续查未完成路线":"开始新周目";
    const reactions={
      A1:["搜索页再次出现‘正在寻找’标签。","陆珂要求删除整份报告。"],A2:["旧热线被换皮后重新上线。","读者把消费记录当成目击证词。"],
      B1:["个人信息被保护，责任链也一并消失。","胡南随后发布了唯一可检索的自辩。"],B2:["档案被归类为无法核实的都市传说。","可验证的删帖和结算失去解释框架。"],
      C1:["标题把少年创作者写成主谋。","胡南以‘普通版务’身份退出报道。"],C2:["来源断裂让真实结算记录也遭到质疑。","当事人仍被迫证明自己不是那个角色。"],
      S:["来源、改写、删帖和结算并列公开。","陆珂只确认边界获得遵守，不再解释去向。"],"S+":["四组档案形成可复核的完整版本史。","第404楼被重写为道歉与纠错，而非新的传说。"]
    }[code];
    return `<section class="modal-body"><div class="ending-code">ARCHIVE ENDING ${esc(code)}</div><h2>${esc(title)}</h2><blockquote>${esc(text)}</blockquote><div class="ending-modules"><div><b>公开页面</b><br>${esc(reactions[0])}</div><div><b>人物后续</b><br>${esc(reactions[1])}</div><div><b>跨周目档案</b><br>已完成 ${routeCount}/4 条路线。${routeCount<4?"续查时前六章不必重做。":"四条路线已全部归档。"}</div><div><b>判定依据</b><br>结构化选项、来源组、授权边界与路线记录。</div></div>${includeActions?`<div class="submit-row"><button class="submit-button" data-close-ending>返回档案</button><button class="subtle-button" data-new-run>${nextLabel}</button></div>`:""}</section>`;
  }

  function showEnding(code) {
    const modal=$("#modal");modal.hidden=false;modal.querySelector(".modal-card").className="modal-card ending-card";$("#modal-content").innerHTML=endingSummary(code,true);$("[data-close-ending]")?.addEventListener("click",closeModal);$("[data-new-run]")?.addEventListener("click",()=>resetGame(true));
  }

  const navButtons = (items, location) => items.map(item => `<button type="button" data-platform-view="${esc(item.view)}" data-nav-location="${esc(location)}">${esc(item.label)}</button>`).join("");

  function legacyList(title, items, aside = false) {
    return `<aside class="${aside ? "legacy-aside" : "legacy-side"}"><h3>${esc(title)}</h3><div class="legacy-nav-list">${navButtons(items, aside ? "aside" : "side")}</div></aside>`;
  }

  function sourceRecord(app, id) {
    const base = D.platformResults[app]?.find(item => item.id === id) || {};
    const extra = A[app]?.records?.[id] || {};
    return { id, title: id, author: "旧索引", date: "时间不详", text: "当前镜像只保留索引。", ...base, ...extra };
  }

  function archiveTitle(title, subtitle = "") {
    return `<header class="archive-view-head"><h3>${esc(title)}</h3>${subtitle ? `<p>${esc(subtitle)}</p>` : ""}</header>`;
  }

  function openRecordButton(app, id, label) {
    return `<button type="button" class="legacy-link" data-record-id="${esc(id)}" data-record-app="${esc(app)}">${esc(label)}</button>`;
  }

  function forumTable(app, ids, title, subtitle = "本机离线缓存；数量为当前页面实际可打开的主题。") {
    const records = ids.map(id => sourceRecord(app, id));
    return `${archiveTitle(title, subtitle)}<div class="forum-table"><div class="forum-row forum-head"><span>主题</span><span>作者</span><span>回复/查看</span><span>最后更新</span></div>${records.map(record => `<div class="forum-row"><div>${openRecordButton(app, record.id, record.title)}<small>${esc(record.board || record.type || "旧索引")}</small></div><span>${esc(record.author)}</span><span>${Number(record.replies || 0)}/${Number(record.views || 1)}</span><time>${esc(record.date)}</time></div>`).join("")}</div>`;
  }

  function renderForumRecord(app, id) {
    const record = sourceRecord(app, id);
    const floors = record.floors || [];
    return `<div class="forum-breadcrumb"><button type="button" data-platform-view="topics">返回主题列表</button><span>›</span><span>${esc(record.board || record.type || "旧索引")}</span></div>${archiveTitle(record.title, `来源编号 ${record.id} · ${record.date}`)}<article class="thread-floor thread-owner"><aside><b>${esc(record.author)}</b><small>楼主</small></aside><div><div class="thread-meta">发表于 ${esc(record.date)} · ${esc(record.board || record.type || "")}</div>${record.image ? `<img class="archive-inline-photo" src="${esc(record.image)}" alt="${esc(record.title)}相关的年代写实照片">` : ""}<div class="thread-copy">${esc(record.body || record.text).replaceAll("\n", "<br>")}</div></div></article>${floors.map(floor => `<article class="thread-floor"><aside><b>${esc(floor[1])}</b><small>${esc(String(floor[0]))}楼</small></aside><div><div class="thread-meta">${esc(floor[2])}</div><div class="thread-copy">${esc(floor[3])}</div></div></article>`).join("")}<p class="archive-read-note">打开主题、翻楼层和查看图片只用于阅读，不会自动写入调查记录。</p>`;
  }

  function photoGrid(items, title) {
    return `${archiveTitle(title, "图片均来自旧硬盘的写实档案；点击图片条目只打开说明。")}
      <div class="archive-photo-grid">${items.map(item => `<button type="button" class="archive-photo-card" data-photo-caption="${esc(item.caption)}"><img src="${esc(item.src)}" alt="${esc(item.alt)}"><span>${esc(item.title)}</span><small>${esc(item.date || "")}</small></button>`).join("")}</div>`;
  }

  function infoCards(title, items, subtitle = "") {
    return `${archiveTitle(title, subtitle)}<div class="archive-card-grid">${items.map(item => `<article class="archive-card"><h4>${esc(item.title)}</h4><p>${esc(item.text)}</p>${item.view ? `<button type="button" class="legacy-action" data-platform-view="${esc(item.view)}">打开</button>` : ""}</article>`).join("")}</div>`;
  }

  function renderTianya(view) {
    const all = ["T-01", "T-00", "TY-LOCAL", "TY-BUS", "F-231-A", "F-231-B", "A-22", "TY-NET", "C-404"];
    if (view.startsWith("topic:") || view.startsWith("record:")) return renderForumRecord("tianya", view.split(":")[1]);
    if (view === "home") return infoCards("天崖社区 · 雾桥分站", [
      { title: "雾桥杂谈 · 86主题", text: "本机缓存9个可打开主题，最近更新2009-01-05。", view: "topics" },
      { title: "接龙创作 · 41主题", text: "创作版保留草稿标签、接龙规则和作者顺序。", view: "writing" },
      { title: "城市生活 · 53主题", text: "公交、旧站、网吧和雨季生活记录。", view: "city" },
      { title: "站务申诉 · 12主题", text: "删帖申请、版面移动与值班处理记录。", view: "moderation" }
    ], "版面数量已按本机真实缓存规模收束，不用虚假的上千条主题制造体量。");
    if (view === "writing") return forumTable("tianya", ["T-00"], "接龙创作");
    if (view === "city") return forumTable("tianya", ["TY-LOCAL", "TY-BUS", "TY-NET"], "城市生活");
    if (view === "feelings") return forumTable("tianya", ["TY-BUS", "F-231-B"], "情感天地");
    if (view === "moderation") return forumTable("tianya", ["A-22", "F-231-B"], "版务处理");
    if (view === "elite") return forumTable("tianya", ["T-00", "TY-LOCAL"], "精品区");
    if (view === "authors") return infoCards("作者索引", [
      { title: "纸舟", text: "接龙发起者；常用全角标点与“其实”。", view: "topic:T-00" },
      { title: "北纬30度", text: "版面管理员；移动公开帖并删除第231楼。", view: "topic:A-22" },
      { title: "南岸旧邮差", text: "保留第231楼前半引用。", view: "topic:F-231-A" }
    ]);
    if (view === "timeline") return forumTable("tianya", [...all].sort((a,b) => sourceRecord("tianya", a).date.localeCompare(sourceRecord("tianya", b).date)), "按发布时间");
    return forumTable("tianya", all, "雾桥杂谈");
  }

  function renderBaidu(view) {
    if (view.startsWith("topic:") || view.startsWith("record:")) return renderForumRecord("baidu", view.split(":")[1]);
    if (view === "portal") return `<section class="baidu-portal"><div class="portal-logo">百<span>渡</span></div><p>离线网页快照 · 2008年8月索引</p><div class="portal-quick">${["白纸风筝", "旧客运站", "第37个号码", "删帖快照"].map(q => `<button type="button" data-platform-view="search:${esc(q)}">${esc(q)}</button>`).join("")}</div></section>${infoCards("索引提示", [{title:"热度不是可信度",text:"高回复主题可能只是重复转载；请核对来源编号和最早时间。"},{title:"查无结果不是不存在",text:"当前镜像只含四个本地吧与少量网页缓存。"}])}`;
    if (view === "photos") return photoGrid([
      { src: "assets/bus-station-rain.webp", title: "旧客运站雨夜", date: "传播图版本", caption: "背景来自2005年原图，红色人物区域后来加入。", alt: "雨夜旧客运站写实照片" },
      { src: "assets/photo-lab.webp", title: "冲印店工作台", date: "2008-08-13", caption: "订单rw_0813保留软件字段和源文件号。", alt: "旧式电脑与打印机的冲印店写实照片" },
      { src: "assets/netcafe-exterior.webp", title: "蓝鲸网吧门口", date: "2009年冬", caption: "倒闭前的网吧外观，不能证明帖文内容。", alt: "雨夜旧网吧门面写实照片" },
      { src: "assets/river-street.webp", title: "河东公交站", date: "2008-08", caption: "方向材料只说明出城方向，不展示当事人位置。", alt: "河边旧街公交站写实照片" }
    ], "图片索引");
    if (view === "qa") return infoCards("知道 · 已缓存问答", [
      { title: "互相转载能算多个证据吗？", text: "不能。若都回到同一帖子，只能算一条来源链。" },
      { title: "为什么帖子被删后摘要还在？", text: "旧索引会延迟刷新，引用页也可能保留片段。" },
      { title: "声讯热线按37是什么意思？", text: "在广告里是分机；不能据此推断通讯录联系人。" }
    ]);
    if (view === "help") return forumTable("baidu", ["B-01", "B-37", "B-CACHE"], "寻人互助吧");
    if (view === "strange") return forumTable("baidu", ["B-02", "B-01"], "城市怪谈吧");
    if (view === "elite") return forumTable("baidu", ["B-CACHE", "B-37"], "精品区");
    if (view === "authors") return infoCards("按作者查看", [{title:"雾桥互助",text:"高热转载账号；未保留最早创作标签。",view:"topic:B-01"},{title:"雾桥声讯",text:"热线广告账号；记录上线时间与结算索引。",view:"topic:B-37"},{title:"不具名网友",text:"低热缓存保存了删帖争议。",view:"topic:B-CACHE"}]);
    const ids = view === "timeline" ? ["B-37", "B-01", "B-CACHE", "B-02"] : ["B-01", "B-02", "B-37", "B-CACHE"];
    return forumTable("baidu", ids, "雾桥吧 · 本机缓存");
  }

  function renderBlogRecord(id) {
    const record = sourceRecord("blog", id);
    const comments = record.comments || [];
    return `<div class="blog-breadcrumb"><button type="button" data-platform-view="posts">返回博文目录</button> &gt; ${esc(record.authorName || record.author)}</div><article class="blog-post"><h2>${esc(record.title)}</h2><div class="blog-post-meta">${esc(record.date)}　作者：${esc(record.authorName || record.author)}　来源编号：${esc(record.id)}</div>${record.image ? `<img src="${esc(record.image)}" alt="${esc(record.title)}的年代写实照片">` : ""}<div class="blog-post-copy">${esc(record.body || record.text).replaceAll("\n", "<br>")}</div></article><section class="blog-comments"><h3>评论 (${comments.length})</h3>${comments.length ? comments.map(item => `<div><b>${esc(item[0])}</b><time>${esc(item[1])}</time><p>${esc(item[2])}</p></div>`).join("") : "<p>博主已关闭评论。</p>"}</section><p class="archive-read-note">阅读博文和评论不会自动推进；调查簿会把日期、别名和文件号做成候选项供你选择。</p>`;
  }

  function blogList(ids, title) {
    return `${archiveTitle(title, "博文按旧RSS和本机浏览缓存恢复。")}${ids.map(id => { const r=sourceRecord("blog",id); return `<article class="blog-list-item"><time>${esc(r.date)}</time><div><h3>${openRecordButton("blog",id,r.title)}</h3><p>${esc(r.text)}</p><small>作者：${esc(r.authorName || r.author)} · ${esc(r.type || "博文")}</small></div></article>`; }).join("")}`;
  }

  function renderBlog(view) {
    if (view.startsWith("record:")) return renderBlogRecord(view.slice(7));
    if (view === "home") return `<section class="blog-profile"><img src="assets/blog-stilllife.webp" alt="红伞、收音机与旧车票的年代写实静物"><div><h2>半盏汽水的博园</h2><p>“离开不是失踪，只是不想再被找到。”</p><dl><dt>日志</dt><dd>8篇</dd><dt>相册</dt><dd>6张</dd><dt>好友</dt><dd>12人</dd></dl></div></section>${blogList(["L-RED","L-BUS","L-RADIO","L-BOUNDARY"],"最近更新与未发布草稿")}`;
    if (view === "photos") return photoGrid([{src:"assets/blog-stilllife.webp",title:"雨停之前",date:"2008-08-03",caption:"红伞、旧收音机和车票；没有旧站人物照片。",alt:"红伞和旧收音机静物写实照片"},{src:"assets/bus-station-original.webp",title:"旧站练习片05",date:"2005-10-02",caption:"WQ-OLD-05原图；站台无人。后续传播版本才加入红影。",alt:"没有人物的旧客运站雨夜原图"},{src:"assets/bus-station-rain.webp",title:"rw_0813传播图",date:"2008-08-13",caption:"由WQ-OLD-05修改的传播版本，左侧加入红伞人物。",alt:"加入红伞人物的旧客运站传播图"},{src:"assets/photo-lab.webp",title:"冲印订单",date:"2008-08-13",caption:"rw_0813冲印环境与旧式电脑。",alt:"旧式冲印工作台写实照片"}],"公开相册与恢复文件");
    if (view === "rss") return blogList(["L-RED","L-BUS","L-RADIO","L-BOUNDARY","P-05","P-08","N-01"],"RSS与草稿缓存");
    if (view === "authors") return infoCards("作者索引", [{title:"半盏汽水",text:"生活随笔；2008-08后停止更新。",view:"record:L-RED"},{title:"像素雨",text:"旧城摄影与文件信息。",view:"record:P-05"},{title:"雾桥旧闻簿",text:"2009年的二手总结，来源链不完整。",view:"record:N-01"}]);
    if (view === "circles") return infoCards("好友圈子", [{title:"旧城摄影圈 · 9人",text:"讨论底片、冲印和旧站建筑。",view:"record:P-05"},{title:"14路乘客 · 6人",text:"公交时刻与沿江生活记录。",view:"record:L-BUS"},{title:"雾桥旧闻 · 11人",text:"大量内容来自互相转载，需谨慎核验。",view:"record:N-01"}]);
    if (view === "guestbook") return infoCards("好友留言", [{title:"纸舟 · 2008-08-05",text:"一路平安。"},{title:"像素雨 · 2008-08-06",text:"收音机别扔，回来我帮你修。"},{title:"系统 · 2008-08-18",text:"博主已关闭新留言。"}]);
    if (view === "life" || view === "archive:2008-08") return blogList(["L-RED","L-BUS","L-RADIO","L-BOUNDARY"],"生活随笔与未发布草稿");
    if (view === "archive:2005-10") return blogList(["P-05"],"2005年10月归档");
    if (view === "archive:2006-11") return infoCards("2006年11月归档", [{title:"旧站广告牌拆除",text:"博主只转载了市政公告，没有现场照片。"}]);
    if (view === "archive:2008-07") return infoCards("2008年7月归档", [{title:"转学手续",text:"只写了“收拾东西”，未公开学校与住址。"},{title:"沿江大风",text:"记录红伞损坏，与论坛寻人无关。"}]);
    if (view === "misc") return blogList(["N-01"],"未分类");
    return blogList(["L-RED","L-BUS","L-RADIO","L-BOUNDARY","P-05","P-08","N-01"],"全部博文");
  }

  function renderAlumni(view) {
    const data=A.alumni;
    if (view.startsWith("record:")) { const r=sourceRecord("alumni",view.slice(7)); return `${archiveTitle(r.title,`来源编号 ${r.id}`)}<article class="alumni-record"><p>${esc(r.body || r.text)}</p>${r.profile ? `<button type="button" class="legacy-action" data-platform-view="person:${esc(r.profile)}">查看对应名册项</button>` : ""}</article>`; }
    if (view.startsWith("person:")) { const p=data.profiles[view.slice(7)]; return `${archiveTitle("同学资料", "个人联系方式已按旧校友录隐私设置隐藏。")}${p ? `<article class="alumni-profile-card"><span class="alumni-avatar">同</span><div><h3>${esc(p.name)}</h3><p>${esc(p.school)} · ${esc(p.grade)}</p><p>${esc(p.note)}</p></div></article>` : `<div class="empty-results">该同学设置为隐身，本机没有更多资料。</div>`}`; }
    if (view === "home") return infoCards("狐搜校友录", [{title:"我的班级",text:"雾桥一中2005级3班，本机缓存38名同学。",view:"classes"},{title:"同音姓名检索",text:"姓名必须结合届别与转学日期，不能只凭读音。",view:"names"},{title:"班级留言",text:"公开留言不含电话、现住址与接收学校。",view:"messages"}]);
    if (view === "classes" || view.startsWith("school:")) return `${archiveTitle("班级目录", "只显示本机缓存过的学校与班级，不代表完整学籍库。")}<div class="class-directory"><button type="button" data-platform-view="school:wq1"><b>雾桥一中</b><span>2005级3班 · 38人</span></button><button type="button" data-platform-view="school:lab"><b>市实验中学</b><span>2006级2班 · 27人</span></button><button type="button" data-platform-view="school:hx"><b>河西职校</b><span>2005级摄影班 · 31人</span></button></div>`;
    if (view === "people" || view.startsWith("group:")) return `${archiveTitle("同学列表", "点击姓名查看公开资料。")}${Object.entries(data.profiles).map(([key,p]) => `<button type="button" class="person-row" data-platform-view="person:${esc(key)}"><span class="presence-dot"></span><b>${esc(p.name)}</b><small>${esc(p.school)} · ${esc(p.grade)}</small></button>`).join("")}`;
    if (view === "messages") return infoCards("班级留言", [{title:"南岸旧邮差 · 08-17",text:"网上流传的女生不是本班同学，请不要拿同音姓名对号入座。"},{title:"玻璃海 · 08-18",text:"有人已经要求删照片和号码，别继续问接收学校。"},{title:"像素雨 · 08-19",text:"旧站照片是2005年的作业，不是今年的现场照。"}]);
    if (view === "names") return `${archiveTitle("同音姓名", "同音结果必须结合届别与状态继续核验。")}${openRecordButton("alumni","LK-06","陆珂 / 路珂 / 陆可　共3项")}`;
    if (view === "transfers") return `${archiveTitle("转学记录", "接收学校字段受隐私设置保护。")}${openRecordButton("alumni","LK-06","2006级 · 2008-07-28 · 陆珂")}`;
    if (view === "grades") return infoCards("按届别", [{title:"2005级 · 69人",text:"雾桥一中与河西职校本机缓存。"},{title:"2006级 · 27人",text:"市实验中学本机缓存，含4条转学记录。"},{title:"2007级 · 18人",text:"资料不完整，不能用于排除身份。"}]);
    if (view === "schools") return infoCards("按学校", [{title:"雾桥一中",text:"2个班级缓存。",view:"school:wq1"},{title:"市实验中学",text:"1个班级与4条转学记录。",view:"school:lab"},{title:"河西职校",text:"摄影班相册可查。",view:"school:hx"}]);
    if (view === "searchHelp") return infoCards("组合检索说明", [{title:"姓名＋届别",text:"只用姓名会混入同音结果。"},{title:"届别＋学校",text:"只能证明缓存内是否存在对应记录。"},{title:"语言特征",text:"多人写作需回到L-03比对，不能由校友录自动判断。",view:"record:L-03"}]);
    return `${archiveTitle("校友索引")}${openRecordButton("alumni","L-00","三校组合检索：无固定匹配")}`;
  }

  function renderChat(friendKey) {
    const friend=A.qq.friends[friendKey];
    if (!friend) return `<div class="empty-results">本机没有这位联系人的聊天记录。</div>`;
    return `<section class="chat-window"><header><span class="chat-avatar">企</span><div><h3>${esc(friend.name)} <small>(${esc(friend.account)})</small></h3><p>${esc(friend.signature)}</p></div><em>${esc(friend.status)}</em></header><div class="chat-history">${friend.chats.map(line => `<div class="chat-line ${line[1]==="纸舟"||line[1]==="系统"?"self":"peer"}"><time>${esc(line[0])}</time><b>${esc(line[1])}</b><p>${esc(line[2])}</p></div>`).join("")}</div><footer><textarea aria-label="消息输入框" placeholder="离线镜像无法发送新消息" disabled></textarea><button type="button" data-legacy-command="offline-send">发送</button></footer></section><p class="archive-read-note">聊天记录提供人物语气和时间上下文；调查簿会用关键词选项确认你的理解。</p>`;
  }

  function renderQQ(view) {
    const friends=A.qq.friends;
    if (view.startsWith("chat:")) return renderChat(view.slice(5));
    if (view.startsWith("record:")) {
      const id=view.slice(7);
      if (id==="M-37" || id==="Q-PROMISE") return renderChat("soda");
      if (id==="Q-17") return `${archiveTitle("本机自动登录日志", "来源编号 Q-17")}${renderChat("front")}`;
    }
    if (view === "account") return `<section class="qq-account"><span class="chat-avatar">企</span><div><h2>纸舟 · 27***18</h2><p>状态：离线镜像　等级：19</p><p>个性签名：其实，出处比结论更重要。</p><small>最近自动登录：2009-01-03 22:42 / 17号机</small></div></section>`;
    if (view === "contacts" || view.startsWith("group:")) {
      const group=view.startsWith("group:")?view.slice(6):"";
      const list=Object.entries(friends).filter(([,f])=>!group || group==="friends" || (group==="classmates"&&f.group==="同学") || (group==="online"&&f.group==="网友") || group==="strangers");
      if (group==="strangers") return `<div class="empty-results">陌生人列表为空。本机未缓存临时会话。</div>`;
      return `${archiveTitle("好友列表", "点击好友姓名打开本机聊天记录。")}<div class="friend-list">${list.map(([key,f])=>`<button type="button" data-platform-view="chat:${esc(key)}"><span class="presence-dot ${f.status==="在线"?"online":""}"></span><b>${esc(f.name)}</b><small>${esc(f.group)} · ${esc(f.status)}</small><em>${esc(f.signature)}</em></button>`).join("")}</div>`;
    }
    if (view === "offline") return infoCards("离线消息", [{title:"南岸旧邮差 · 08-16 18:57",text:"我引用到了231楼前半，哈希末位7c。",view:"chat:postman"},{title:"像素雨 · 08-13 23:15",text:"rw_0813的源图是WQ-OLD-05。",view:"chat:pixel"}]);
    if (view === "group") return `<section class="chat-window"><header><span class="chat-avatar">群</span><div><h3>雾桥旧城摄影 · 8人</h3><p>本机缓存群消息 6条</p></div></header><div class="chat-history"><div class="chat-line peer"><time>2008-08-13 23:16</time><b>像素雨</b><p>谁把WQ-OLD-05改成寻人图了？</p></div><div class="chat-line self"><time>2008-08-13 23:19</time><b>纸舟</b><p>先留原图和冲印订单，别在群里贴号码。</p></div><div class="chat-line peer"><time>2008-08-13 23:21</time><b>玻璃海</b><p>我会保存图片缓存，不转发传播图。</p></div></div></section>`;
    if (view === "logs") return infoCards("本机日志", [{title:"22:42 自动登录",text:"会员QH0812在17号机登录纸舟账号。",view:"chat:front"},{title:"23:48 表单写入",text:"第404楼草稿在纸舟在线时段写入。"},{title:"00:10 自动离线",text:"会话持续到次日零点十分。"}]);
    if (view === "tools") return infoCards("工具", [{title:"消息管理器",text:"按联系人、日期和正文查找本机片段。",view:"recent"},{title:"导出记录",text:"恢复环境只读，导出功能已锁定。"},{title:"安全中心",text:"网络已断开；不会连接真实账号。"}]);
    const recent=["soda","pixel","north","front","postman"];
    return `${archiveTitle("最近会话", "点击好友查看完整的按时间排列记录。")}<div class="recent-chat-list">${recent.map(key=>{const f=friends[key],last=f.chats[f.chats.length-1];return `<button type="button" data-platform-view="chat:${esc(key)}"><span class="chat-avatar">${esc(f.name[0])}</span><div><b>${esc(f.name)}</b><p>${esc(last[2])}</p></div><time>${esc(last[0].slice(5))}</time></button>`;}).join("")}</div>`;
  }

  function renderSMS(view) {
    const data=A.sms;
    if (view.startsWith("record:")) view=`message:${view.slice(7)}`;
    if (view.startsWith("message:")) { const msg=data.messages.find(item=>item.id===view.slice(8)); if(!msg)return `<div class="empty-results">短信不存在。</div>`; return `<div class="sms-phone"><header><button type="button" data-platform-view="${esc(msg.folder)}">‹ 返回</button><b>${esc(msg.peer)}</b><span>${esc(msg.status)}</span></header><dl><dt>号码</dt><dd>${esc(msg.number)}</dd><dt>时间</dt><dd>${esc(msg.date)}</dd><dt>状态</dt><dd>${esc(msg.status)}</dd></dl><article>${esc(msg.text)}</article><footer>来源编号：${esc(msg.id)}</footer></div>`; }
    if (view.startsWith("contact:")) { const contact=data.contacts.find(item=>item.key===view.slice(8)); return contact ? `${archiveTitle(`通讯录第${contact.index}项`, "号码在公开界面中保持遮挡。")}<article class="contact-card"><b>${esc(contact.name)}</b><span>${esc(contact.number)}</span><p>${esc(contact.note)}</p></article>` : `<div class="empty-results">联系人不存在。</div>`; }
    if (view === "home") return infoCards("飞讯短信 2008", [{title:"收件箱 · 9",text:"本机恢复4条与调查有关的短信。",view:"inbox"},{title:"已发送 · 6",text:"含第231楼删除请求。",view:"sent"},{title:"送达报告 · 4",text:"可核对读取与删除时间。",view:"reports"},{title:"通讯录",text:"联系人编号与声讯分机必须区分。",view:"contacts"}]);
    if (view === "contacts") return `${archiveTitle("通讯录", "点击联系人查看编号、遮挡号码与备注。")}<div class="sms-contact-list">${data.contacts.map(c=>`<button type="button" data-platform-view="contact:${esc(c.key)}"><span>${c.index}</span><b>${esc(c.name)}</b><small>${esc(c.number)}</small></button>`).join("")}</div>`;
    if (view === "tools") return infoCards("短信工具", [{title:"号码尾号检索",text:"输入尾号可查本机短信与通讯录；不会还原完整号码。"},{title:"送达状态说明",text:"“已送达”表示短信中心接收，不等于收件人已阅读。",view:"reports"},{title:"备份信息",text:"来源为旧翻盖手机本地备份。"}]);
    const folder=["inbox","sent","drafts","reports"].includes(view)?view:"inbox";
    const labels={inbox:"收件箱",sent:"已发送",drafts:"草稿箱",reports:"送达报告"};
    const items=data.messages.filter(item=>item.folder===folder);
    return `${archiveTitle(labels[folder], `当前恢复 ${items.length} 条可打开记录。`)}<div class="sms-list">${items.map(msg=>`<button type="button" data-platform-view="message:${esc(msg.id)}"><time>${esc(msg.date)}</time><b>${esc(msg.peer)}</b><span>${esc(msg.text)}</span><em>${esc(msg.status)}</em></button>`).join("")||"<div class=\"empty-results\">此文件夹为空。</div>"}</div>`;
  }

  function renderMail(view) {
    const data=A.mail;
    if (view.startsWith("record:") || view.startsWith("message:")) {
      const id=view.split(":")[1],msg=data.messages.find(item=>item.id===id);
      if(!msg)return `<div class="empty-results">邮件正文未能恢复。</div>`;
      const guides={
        "E-FWD":[["先看时间", "邮件在热线上线前一晚发出，属于事前记录。"], ["再看主题", "转发主题仍保留“接龙”，说明发件人已经知情。"], ["最后看要求", "正文要求外页隐藏“接龙”字样。"]],
        "E-VS":[["结算索引", "VS-200808相当于订单号，可与热线页一一对应。"], ["收款主体", "HN-MEDIA对应胡南一方。"], ["金额", "只证明存在分成，金额大小本身不是责任依据。"]],
        "EM-04":[["前一动作", "第231楼已在19:03被删除。"], ["邮件时间", "19:08紧接删帖之后。"], ["正文意思", "明确要求不发公开说明，让澄清更难被看见。"]]
      };
      const rows=guides[id]||[["发件人/收件人", "判断这封信是谁发给谁。"], ["时间", "与其他材料比较先后。"], ["正文", "寻找明确提出的动作或要求。"]];
      return `<article class="mail-reader"><header><button type="button" data-platform-view="${esc(msg.folder)}">返回列表</button><h2>${esc(msg.subject)}</h2></header>${beginnerCard("这封邮件只看三件事",rows)}<dl><dt>发件人：</dt><dd>${esc(msg.from)}</dd><dt>收件人：</dt><dd>${esc(msg.to)}</dd><dt>时间：</dt><dd>${esc(msg.date)}</dd></dl><div class="mail-body">${esc(msg.body)}</div>${msg.attachment?`<button type="button" class="mail-attachment" data-legacy-command="attachment" data-caption="${esc(msg.attachment)}">📎 ${esc(msg.attachment)}</button>`:""}<details><summary>技术字段（可选，不懂也不影响解谜）</summary><pre>${esc(msg.headers)}</pre></details><footer>来源编号：${esc(msg.id)}</footer></article>`;
    }
    if (["compose","reply","forward"].includes(view)) return `${archiveTitle(view==="compose"?"写信":view==="reply"?"回复邮件":"转发邮件", "恢复环境已断网，只能演示旧式编辑界面。")}
      <form class="mail-compose"><label>收件人<input value="" placeholder="name@example.com"></label><label>主题<input value="${view==="reply"?"Re: ":view==="forward"?"Fw: ":""}"></label><label>正文<textarea rows="9"></textarea></label><button type="button" data-legacy-command="mail-save">保存到草稿箱</button></form>`;
    if (view === "contacts") return infoCards("邮箱通讯录", [{title:"声讯结算",text:"service@voice.invalid"},{title:"论坛版务",text:"moderator@tianya.invalid"},{title:"胡南工作邮箱",text:"hn-media@letter.invalid"}]);
    if (view === "settings") return infoCards("邮箱设置", [{title:"POP3收信",text:"上次成功：2009-01-04 00:02"},{title:"垃圾邮件过滤",text:"规则版本2008.7；已删除文件夹仍保留3封恢复邮件。"},{title:"显示邮件头",text:"默认折叠；打开邮件后可展开原始头信息。"}]);
    if (view === "help") return infoCards("帮助", [{title:"如何判断转发链？",text:"比较From、To、Received和转发主题，不能只读正文。"},{title:"附件名能证明什么？",text:"附件名用于连接结算与脚本记录，内容仍需其他来源支持。"}]);
    if (view === "attachments") return `${archiveTitle("附件管理", "点击附件仅查看文件说明，不会打开外部程序。")}${data.messages.filter(m=>m.attachment).map(m=>`<button type="button" class="attachment-row" data-platform-view="message:${esc(m.id)}"><b>${esc(m.attachment)}</b><span>${esc(m.subject)}</span><time>${esc(m.date)}</time></button>`).join("")}`;
    if (view === "headers") return infoCards("邮件头索引", data.messages.map(m=>({title:m.id,text:`${m.date} · ${m.from} → ${m.to}`,view:`message:${m.id}`})));
    if (view === "searchHelp") return infoCards("全文搜索", [{title:"主题",text:"适合查“结算”“脚本V3”。"},{title:"附件",text:"适合查settle_0815.xls。"},{title:"发件人",text:"适合核对真实发送链。"}]);
    const folder=["inbox","sent","deleted"].includes(view)?view:"inbox";
    let messages=data.messages.filter(m=>m.folder===folder); if(view==="starred")messages=data.messages.filter(m=>m.starred);
    const title=view==="starred"?"星标邮件":({inbox:"收件箱",sent:"已发送",deleted:"已删除"}[folder]);
    return `${archiveTitle(title, `恢复 ${messages.length} 封可打开邮件。`)}<div class="mail-list">${messages.map(msg=>`<button type="button" data-platform-view="message:${esc(msg.id)}"><span>${msg.starred?"★":"☆"}</span><b>${esc(msg.from)}</b><strong>${esc(msg.subject)}</strong><small>${esc(msg.body.slice(0,42))}…</small><time>${esc(msg.date)}</time></button>`).join("")||"<div class=\"empty-results\">此文件夹没有恢复邮件。</div>"}</div>`;
  }

  function backendTable(view) {
    const table=A.backend.tables[view];
    if(!table)return "";
    return `${archiveTitle(table.title, "先看白话说明，再读高亮行；原始表格保留用于核对。")}
      ${beginnerCard(table.guide,table.columnHelp)}
      <table class="backend-table"><thead><tr>${table.columns.map(c=>`<th>${esc(c)}</th>`).join("")}</tr></thead><tbody>${table.rows.map((row,index)=>`<tr class="${table.focusRows?.includes(index)?"focus-row":""}">${row.map(cell=>`<td>${esc(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table>
      <p class="plain-takeaway"><b>这张表能得出：</b>${esc(table.takeaway)}</p>`;
  }

  function renderBackend(view) {
    if (view.startsWith("record:")) { const r=sourceRecord("backend",view.slice(7)); return `${archiveTitle(r.title,`来源编号 ${r.id} · ${r.date}`)}<article class="alumni-record"><p>${esc(r.text)}</p><p><b>记录类型：</b>${esc(r.type||"恢复索引")}</p></article>`; }
    if (A.backend.tables[view]) return backendTable(view);
    if (view === "volume:IDE-03") return `${archiveTitle("IDE-03 / LJ-17", "写保护已启用")}${backendTable("volumes")}<div class="notice safe">调查簿会提供候选项；你只需根据高亮行选择LJ-17与只读方式。</div>`;
    if (view === "seat:17") return `${archiveTitle("17号机", "资产记录与会员票据交叉页")}${backendTable("seats")}${backendTable("tickets")}`;
    if (view.startsWith("status:")) { const key=view.slice(7),map={disk:["硬盘状态","IDE-03健康度87%，当前只读。"],index:["索引状态","八个应用索引已建立，删除页仅保留摘要。"],clock:["系统钟异常","CMOS失效曾让日期回退到2002年；“最近修改”不可直接作为证据。"],protect:["写保护","所有旧档案包禁止写回，浏览不会改变原始时间。"]}; return infoCards(map[key]?.[0]||"状态",[{title:"检测结果",text:map[key]?.[1]||"无更多信息。"}]); }
    if (view === "file") return infoCards("文件(F)", [{title:"打开镜像",text:"IDE-03已挂载为LJ-17。",view:"volumes"},{title:"保存索引",text:"恢复环境只读，不能覆盖原盘。"},{title:"退出",text:"关闭窗口不会丢失调查存档。"}]);
    if (view === "edit") return infoCards("编辑(E)", [{title:"复制字段",text:"为避免自动送答案，本工具不提供一键复制到调查记录。"},{title:"查找",text:"使用上方精确检索框。"},{title:"首选项",text:"时间显示采用原始时区GMT+8。"}]);
    if (view === "view") return infoCards("查看(V)", [{title:"按卷标",text:"查看IDE设备与分区标签。",view:"volumes"},{title:"按机位",text:"查看资产号与会员票据。",view:"seats"},{title:"按时间",text:"比较写入时间与恢复显示时间。",view:"cache"}]);
    if (view === "tools") return infoCards("工具(T)", [{title:"缓存恢复",text:"恢复IE表单与被删摘要。",view:"cache"},{title:"时钟校正",text:"保留原始时间并标注异常，不替换证据。",view:"status:clock"},{title:"写保护检查",text:"所有卷当前只读。",view:"status:protect"}]);
    return backendTable("volumes");
  }

  function renderAppView(app, view) {
    const output={tianya:renderTianya,baidu:renderBaidu,blog:renderBlog,alumni:renderAlumni,qq:renderQQ,sms:renderSMS,mail:renderMail,backend:renderBackend}[app]?.(view) || `<div class="empty-results">该应用页面未能恢复。</div>`;
    const target=$("#legacy-view");
    if(target)target.innerHTML=output;
    $$(`[data-platform-view]`, $("#window-content")).forEach(btn=>btn.classList.toggle("active", btn.dataset.platformView===view));
  }

  function renderPlatform(app) {
    const c=$("#window-content"),meta=D.platformMeta[app],ui=A[app];
    const last=[...state.searches].reverse().find(s=>s.app===app);
    const scope=last?.scope||"all";
    const view=state.appViews?.[app]||ui.defaultView;
    c.innerHTML=`<div class="search-shell"><section class="legacy-site legacy-${app}">
      <div class="legacy-menubar">${navButtons(ui.menu,"menu")}</div>
      <header class="legacy-banner"><div class="legacy-brand"><h2>${esc(meta.name)}</h2><small>${app==="backend"?"本机恢复工具 2.3":"2008离线应用镜像"}</small></div><div class="legacy-slogan">${esc(meta.note)}</div></header>
      <nav class="legacy-tabs">${navButtons(ui.tabs,"tabs")}</nav>
      <div class="legacy-body">${legacyList(ui.sideTitle,ui.side)}<main class="legacy-main">
        <form id="search-form" class="search-row"><input name="query" value="${esc(last?.query||"")}" placeholder="${esc(meta.placeholder)}" aria-label="搜索词"><select name="scope" aria-label="搜索范围"><option value="all" ${scope==="all"?"selected":""}>全部字段</option><option value="title" ${scope==="title"?"selected":""}>标题</option><option value="author" ${scope==="author"?"selected":""}>作者</option></select><button class="search-button" type="submit">${app==="backend"?"执行检索":"搜索"}</button></form>
        <div class="search-help"><b>不会电脑也能查：</b>输入调查簿里出现的来源编号、人物名或粗体词即可。所有菜单和条目都能打开；阅读材料不会误触推进。</div>
        <section id="legacy-view" class="legacy-view"></section><section id="search-results" class="search-results" hidden></section>
      </main>${legacyList(ui.asideTitle,ui.aside,true)}</div></section></div>`;
    const form=$("#search-form");
    form.addEventListener("submit",e=>{e.preventDefault();const fd=new FormData(form);const query=String(fd.get("query")||"").trim();if(!query){toast("请输入从材料中提炼的关键词。","error");return;}state.searches.push({app,query,scope:fd.get("scope"),at:Date.now()});state.searches=state.searches.slice(-80);state.appViews[app]="search";save();showResults(app,query,fd.get("scope"));});
    c.querySelector(".legacy-site").addEventListener("click",e=>{
      const record=e.target.closest("[data-record-id]");
      const nav=e.target.closest("[data-platform-view]");
      const photo=e.target.closest("[data-photo-caption]");
      const command=e.target.closest("[data-legacy-command]");
      if(record){const recordApp=record.dataset.recordApp||app;state.appViews[app]=`record:${record.dataset.recordId}`;save();renderAppView(recordApp,`record:${record.dataset.recordId}`);$("#search-results").hidden=true;$("#legacy-view").hidden=false;return;}
      if(nav){const next=nav.dataset.platformView;if(next.startsWith("search:")){const query=next.slice(7);form.elements.query.value=query;state.searches.push({app,query,scope:"all",at:Date.now()});state.searches=state.searches.slice(-80);state.appViews[app]="search";save();showResults(app,query,"all");return;}state.appViews[app]=next;save();$("#search-results").hidden=true;$("#legacy-view").hidden=false;renderAppView(app,next);return;}
      if(photo){openModal(`<div class="modal-body"><h2>照片说明</h2><p>${esc(photo.dataset.photoCaption)}</p><p class="notice">查看图片不会自动取得线索。</p></div>`);return;}
      if(command){const action=command.dataset.legacyCommand;if(action==="offline-send")toast("离线镜像无法发送消息。","error");if(action==="attachment")openModal(`<div class="modal-body"><h2>附件信息</h2><p>文件：${esc(command.dataset.caption||"")}</p><p>附件只读，关键字段仍需与邮件头和其他平台交叉核对。</p></div>`);if(action==="mail-save")toast("已保存到临时草稿；该操作不影响调查进度。","success");}
    });
    renderAppView(app,view);
    if(view==="search"&&last)showResults(app,last.query,last.scope);
  }

  function showResults(app,query,scope="all") {
    const tokens=norm(query).match(/[a-z]+\d*|\d{2,}|[\u4e00-\u9fff]{2,}/g)||[norm(query)];
    const results=D.platformResults[app].filter(r=>{
      const hay=scope==="title"?r.title:scope==="author"?r.author:`${r.keys} ${r.title} ${r.text} ${r.author} ${r.id}`;
      return tokens.some(t=>norm(hay).includes(t));
    });
    const target=$("#search-results");if(!target)return;$("#legacy-view").hidden=true;target.hidden=false;
    target.innerHTML=`${archiveTitle(`检索结果：${query}`,`当前索引返回 ${results.length} 条；结果按应用自身的旧式索引规则排列。`)}${results.length?results.map(r=>`<article class="result-card"><div class="result-meta"><span>${esc(r.date)}</span><span>${esc(r.author)}</span><span>${esc(r.type)}</span></div><h3>${openRecordButton(app,r.id,r.title)}</h3><p>${esc(r.text)}</p><footer>来源编号：<span class="source-ids">${esc(r.id)}</span> · 点击标题打开原页结构</footer></article>`).join(""):`<div class="empty-results">旧索引没有返回结果。查无结果只能说明当前索引范围不匹配，不能单独证明对象不存在。</div>`}`;
  }

  function beginBoot() {
    clearTimeout(bootTimer);
    startAmbience("boot");
    $("#story-stage").hidden=true;
    $("#login-stage").hidden=true;
    $("#post-stage").hidden=false;
    const lines=$$("[data-boot-line]");
    lines.forEach(line=>line.classList.remove("visible"));
    const step=state.settings.reduceMotion?20:260;
    lines.forEach((line,index)=>setTimeout(()=>{line.classList.add("visible");if(index===1)beep(620,.035);},step*(index+1)));
    bootTimer=setTimeout(showLogin,step*(lines.length+2));
  }

  function showLogin() {
    $("#post-stage").hidden=true;
    $("#login-stage").hidden=false;
    $("#login-password").value="";
    $("#login-error").textContent="";
    setTimeout(()=>$("#login-password").focus(),40);
  }

  function openSystemWindow(type) {
    const panels={
      computer:["▣","我的电脑",`<div class="system-dialog"><h2>我的电脑</h2><div class="drive-list"><div class="drive-item"><span class="drive-icon">C:</span><b>本地磁盘 (C:)</b><p>系统与程序文件。可用空间 18.4 GB。</p></div><div class="drive-item"><span class="drive-icon">D:</span><b>旧盘恢复区 (D:)</b><p>已启用写保护。调查程序从此分区读取镜像。</p></div><div class="drive-item"><span class="drive-icon">A:</span><b>3½ 软盘 (A:)</b><p>未插入磁盘。</p></div><div class="drive-item"><span class="drive-icon">E:</span><b>DVD 驱动器 (E:)</b><p>驱动器中没有光盘。</p></div></div><p class="notice">系统图标只还原旧电脑操作环境，不会提供或自动记录主线线索。</p></div>`],
      documents:["▤","我的文档",`<div class="system-dialog"><h2>我的文档</h2><table class="file-list"><tr><th>名称</th><th>类型</th><th>修改日期</th></tr><tr><td>我的图片</td><td>文件夹</td><td>2009-01-04</td></tr><tr><td>我的音乐</td><td>文件夹</td><td>2008-07-18</td></tr><tr><td>新建文本文档.txt</td><td>文本文档</td><td>2008-08-07</td></tr><tr><td>桌面整理说明.txt</td><td>文本文档</td><td>2026-08-07</td></tr></table><p class="notice">调查材料集中在九个桌面程序中；这里没有隐藏答案。</p></div>`],
      network:["▥","网上邻居",`<div class="system-dialog"><h2>网上邻居</h2><table class="file-list"><tr><th>网络位置</th><th>状态</th></tr><tr><td>蓝鲸网吧工作组</td><td>网络电缆已拔出</td></tr><tr><td>本地连接</td><td>受限制或无连接</td></tr></table><p class="notice">本游戏使用硬盘中的离线镜像，不会打开或跳转到真实网站。</p></div>`],
      recycle:["♲","回收站",`<div class="system-dialog"><h2>回收站</h2><p>回收站为空。</p><p class="notice">旧网页的删除记录来自镜像索引，不会通过翻找系统回收站取得。</p></div>`]
    };
    const panel=panels[type];if(!panel)return;activeSystemWindow=type;
    $$(".nav-app").forEach(btn=>btn.classList.remove("active"));
    $("#app-window").hidden=false;$("#app-window").dataset.app="system";$("#desktop-welcome").hidden=true;$("#task-button").hidden=false;
    $("#window-icon").textContent=panel[0];$("#task-icon").textContent=panel[0];$("#window-title").textContent=panel[1];$("#task-name").textContent=panel[1];$("#window-content").innerHTML=panel[2];
    closeStartMenu();
  }

  function closeStartMenu(){$("#start-menu").hidden=true;$("#start-menu-btn").setAttribute("aria-expanded","false");}
  function toggleStartMenu(){const menu=$("#start-menu"),open=menu.hidden;menu.hidden=!open;$("#start-menu-btn").setAttribute("aria-expanded",String(open));}
  function toggleNotes(force){const notes=$("#notebook");notes.hidden=typeof force==="boolean"?!force:!notes.hidden;if(!notes.hidden)$("#notes").focus();}
  function hideWindow(keepTask=true){$("#app-window").hidden=true;$("#task-button").hidden=!keepTask;}
  function toggleMaximize(){const win=$("#app-window");win.classList.toggle("maximized");win.removeAttribute("style");}

  function showRunDialog(){
    openModal(`<form id="run-form" class="run-dialog"><h2>运行</h2><p>请输入程序、文件夹、文档或 Internet 资源的名称。</p><label>打开：<input name="command" value="" autofocus></label><div class="submit-row"><button class="submit-button" type="submit">确定</button><button class="subtle-button" type="button" data-cancel-run>取消</button></div><div class="feedback" data-feedback></div></form>`);
    const form=$("#run-form");form.addEventListener("submit",e=>{e.preventDefault();const cmd=norm(new FormData(form).get("command"));if(["notepad","记事本"].includes(cmd)){closeModal();toggleNotes(true);return;}if(["control","控制面板"].includes(cmd)){closeModal();showSettings();return;}if(["explorer","我的电脑"].includes(cmd)){closeModal();openSystemWindow("computer");return;}const feedback=$("[data-feedback]",form);feedback.textContent="找不到该文件。请确认名称是否正确，然后重试。";feedback.className="feedback error";});$("[data-cancel-run]").addEventListener("click",closeModal);
  }

  function powerOff(){
    if(!confirm("要关闭这台旧电脑吗？调查进度会保存在本机。"))return;
    save();stopAmbience();closeStartMenu();$("#desktop").hidden=true;$("#boot").hidden=false;$("#story-stage").hidden=false;$("#post-stage").hidden=true;$("#login-stage").hidden=true;$("#app-window").hidden=true;$("#notebook").hidden=true;$("#resume-note").hidden=false;
  }

  function beginWindowDrag(e){
    if(e.target.closest(".window-controls")||$("#app-window").classList.contains("maximized")||innerWidth<=760)return;
    const win=$("#app-window"),rect=win.getBoundingClientRect();windowDrag={x:e.clientX-rect.left,y:e.clientY-rect.top,w:rect.width,h:rect.height};
    win.style.left=`${rect.left}px`;win.style.top=`${rect.top}px`;win.style.right="auto";win.style.bottom="auto";win.style.width=`${rect.width}px`;win.style.height=`${rect.height}px`;e.currentTarget.setPointerCapture?.(e.pointerId);
  }
  function moveWindow(e){if(!windowDrag)return;const win=$("#app-window"),maxX=innerWidth-windowDrag.w,maxY=innerHeight-64;win.style.left=`${Math.max(0,Math.min(maxX,e.clientX-windowDrag.x))}px`;win.style.top=`${Math.max(0,Math.min(maxY,e.clientY-windowDrag.y))}px`;}
  function endWindowDrag(){windowDrag=null;}

  function showHint() {
    const list=[...(D.hints[state.stage]||[])];
    if ([6,7].includes(state.stage) && state.activeRoute) {
      const route=D.routeData[state.activeRoute];
      list[2]=route.challenges.map((challenge,index)=>{
        const evidence=challenge.options.find(([value])=>value===challenge.answer)?.[1]||challenge.answer;
        const fills=challenge.fills.map(([,answer,options])=>options.find(([value])=>value===answer)?.[1]||answer).join("；");
        return `场景${index+1}：${evidence}；关键词：${fills}`;
      }).join(" / ");
    }
    const level=Math.min((state.hints[state.stage]||0)+1,3);state.hints[state.stage]=level;save();$("#hint-level").textContent=`${level}/3`;openModal(`<div class="modal-body"><h2>阶段提示 ${level}/3</h2><div class="hint-step"><strong>${level}</strong><p>${esc(list[level-1])}</p></div>${level<3?'<p class="notice">再次点击顶部“提示”会展开下一层。第三级给出当前页面的完整选择。</p>':'<p class="notice safe">完整答案已显示。使用提示不影响结局。</p>'}</div>`);
  }

  function openModal(html, extraClass="") { const modal=$("#modal");modal.hidden=false;modal.querySelector(".modal-card").className=`modal-card ${extraClass}`;$("#modal-content").innerHTML=html; }
  function closeModal() { $("#modal").hidden=true;$("#modal-content").innerHTML="";$("#modal").querySelector(".modal-card").className="modal-card"; }


  function showSettings() {
    openModal(`<div class="modal-body"><h2>蓝鲸17号机控制面板</h2><div class="field-grid single"><label><span><input type="checkbox" id="setting-motion" ${state.settings.reduceMotion?"checked":""}> 减少闪烁与动态</span></label><label><span><input type="checkbox" id="setting-fear" ${state.settings.lowFear?"checked":""}> 低恐怖模式（关闭CRT噪点）</span></label></div><div class="submit-row"><button class="subtle-button" data-export>导出存档JSON</button><label class="subtle-button">导入存档<input id="import-save" type="file" accept="application/json" hidden></label></div><div class="notice">重新开始会清除本周目进度，但保留跨周目路线记录。</div><button class="subtle-button" data-reset>重新开始本周目</button></div>`);
    $("#setting-motion").addEventListener("change",e=>{state.settings.reduceMotion=e.target.checked;applySettings();save();});
    $("#setting-fear").addEventListener("change",e=>{state.settings.lowFear=e.target.checked;applySettings();save();});
    $("[data-export]").addEventListener("click",exportSave);$("#import-save").addEventListener("change",importSave);$("[data-reset]").addEventListener("click",()=>{if(confirm("确定清除本周目调查进度并重新开始吗？"))resetGame(false);});
  }

  function applySettings(){document.body.classList.toggle("reduce-motion",state.settings.reduceMotion);document.body.classList.toggle("low-fear",state.settings.lowFear);$("#sound-btn").textContent=state.settings.sound?"♪":"×";}
  function exportSave(){const blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="雾桥旧网调查存档.json";a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500);}
  function importSave(e){const file=e.target.files?.[0];if(!file)return;const reader=new FileReader();reader.onload=()=>{try{const parsed=JSON.parse(reader.result);if(!parsed||![1,2].includes(Number(parsed.schemaVersion)))throw new Error();state=normalizeState(parsed);save();closeModal();renderAll();toast("存档导入成功。","success");}catch(_){toast("存档格式无效或版本不兼容。","error");}};reader.readAsText(file);}
  function resetGame(fromEnding){const settings={...state.settings},archived=routesEver();state=structuredClone(DEFAULT_STATE);state.settings=settings;if(fromEnding&&archived.length>=2&&archived.length<4){state.stage=6;state.revisitMode=true;state.evidence=[{id:"H-17",label:"上周目：只读挂载"},{id:"T-CHAIN",label:"上周目：来源树"},{id:"P-VERIFY",label:"上周目：图片鉴伪"},{id:"C1",label:"上周目：身份简报"},{id:"F-231",label:"上周目：第231楼"},{id:"M-37",label:"上周目：隐私边界"}];}storageRemove(SAVE_KEY);save();closeModal();showDesktop(true);if(fromEnding)toast(state.revisitMode?"档案续查已开始：前六章证据已继承，只需完成剩余路线。":"新周目已开始；跨周目路线记录已保留。","success");}

  function init() {
    $("#resume-note").hidden=!storageGet(SAVE_KEY);
    $("#power-on").addEventListener("click",beginBoot);
    $("#login-form").addEventListener("submit",e=>{e.preventDefault();const password=String(new FormData(e.currentTarget).get("password")||"").trim();if(password!==LOGIN_PASSWORD){$("#login-error").textContent="密码不正确。请按维修贴的“月日＋机号”重新输入。";$("#login-password").select();beep(155,.12);return;}$("#login-error").textContent="正在加载个人设置…";beep(620,.06);setTimeout(()=>showDesktop(false),state.settings.reduceMotion?20:350);});
    $("#app-nav").addEventListener("click",e=>{const btn=e.target.closest("[data-app]");if(btn)openApp(btn.dataset.app);});
    $(".system-icons").addEventListener("click",e=>{const btn=e.target.closest("[data-system]");if(btn)openSystemWindow(btn.dataset.system);});
    $("#notes").addEventListener("input",e=>{state.notes=e.target.value;save();});
    $("#hint-btn").addEventListener("click",showHint);
    $("#notes-btn").addEventListener("click",()=>toggleNotes());$("#notes-close").addEventListener("click",()=>toggleNotes(false));
    $("#settings-btn").addEventListener("click",showSettings);$("#save-btn").addEventListener("click",()=>save(false));
    $("#sound-btn").addEventListener("click",()=>{state.settings.sound=!state.settings.sound;applySettings();save();if(state.settings.sound)startAmbience(state.currentApp==="case"?"rain":(["qq","sms","mail"].includes(state.currentApp)?"office":"disk"));else stopAmbience();toast(state.settings.sound?"环境声与界面音已开启。":"所有声音已关闭。","success");});
    $("#start-menu-btn").addEventListener("click",e=>{e.stopPropagation();toggleStartMenu();});
    $("#start-menu").addEventListener("click",e=>{const app=e.target.closest("[data-app]");const system=e.target.closest("[data-system]");const action=e.target.closest("[data-start-action]");if(app){openApp(app.dataset.app);closeStartMenu();return;}if(system){openSystemWindow(system.dataset.system);return;}if(!action)return;closeStartMenu();if(action.dataset.startAction==="settings")showSettings();if(action.dataset.startAction==="notes")toggleNotes(true);if(action.dataset.startAction==="run")showRunDialog();if(action.dataset.startAction==="power")powerOff();});
    $("#task-button").addEventListener("click",()=>{if(!$("#app-window").hidden){hideWindow(true);return;}if(activeSystemWindow)openSystemWindow(activeSystemWindow);else openApp(state.currentApp||"case",false);});
    $(".window-controls").addEventListener("click",e=>{const action=e.target.closest("[data-window-action]")?.dataset.windowAction;if(action==="minimize")hideWindow(true);if(action==="maximize")toggleMaximize();if(action==="close")hideWindow(false);});
    $("#window-titlebar").addEventListener("dblclick",e=>{if(!e.target.closest(".window-controls"))toggleMaximize();});
    $("#window-titlebar").addEventListener("pointerdown",beginWindowDrag);$("#window-titlebar").addEventListener("pointermove",moveWindow);$("#window-titlebar").addEventListener("pointerup",endWindowDrag);$("#window-titlebar").addEventListener("pointercancel",endWindowDrag);
    $("#modal").addEventListener("click",e=>{if(e.target.id==="modal"||e.target.closest(".modal-close"))closeModal();});
    document.addEventListener("click",e=>{if(!e.target.closest("#start-menu")&&!e.target.closest("#start-menu-btn"))closeStartMenu();});
    document.addEventListener("keydown",e=>{if(e.key==="Escape"){if(!$("#modal").hidden)closeModal();else closeStartMenu();}if(e.altKey&&e.key.toLowerCase()==="h"&&!$("#desktop").hidden){e.preventDefault();showHint();}});
    setInterval(()=>{$("#system-time").textContent=new Date().toLocaleString("zh-CN",{hour12:false}).replaceAll("/","-");},1000);
    applySettings();
  }

  window.WuqiaoGame = { getState:()=>structuredClone(state), calculateEnding, openApp, beginBoot, openSystemWindow };
  init();
})();
