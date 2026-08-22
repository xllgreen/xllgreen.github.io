const SAVE_KEY = "songfengling_cabin_save_v3";
const PAY_PROMPT_KEY = "songfengling_cabin_pay_prompted";

const relicCatalog = [
  ["diary", "1953 日记"],
  ["receipt", "汇款单"],
  ["workPermit", "护林证"],
  ["medal", "一等功奖章"],
  ["battleReport", "战斗报告"],
  ["finalLetter", "半封遗书"],
  ["martyrCert", "烈士证明"],
  ["familyPhotos", "陈家照片"],
  ["mug", "搪瓷杯"],
  ["soldierPhoto", "军装合影"],
  ["pineNeedle", "松针标本"],
  ["newspaper", "停战旧报"]
];

const defaultState = () => ({
  started: false,
  scene: "door",
  story: [],
  relics: [],
  scraps: [],
  keys: [],
  receiptOrder: [],
  selectedScraps: [],
  selectedRelics: [],
  deepEggs: {},
  naturalEggs: {},
  doorKnocks: 0,
  looseBrickClicks: 0,
  lampSequence: [],
  cabinetOpened: false,
  chestOpened: false,
  smokeDecoded: false,
  finalUnlocked: false,
  clueScore: 0
});

let state = loadState();
const toastQueue = [];
let toastShowing = false;

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

const scenes = {
  door: {
    title: "小屋门前",
    image: "scene-door.svg",
    caption: "山风从松林里下来，吹得门口半副春联轻轻发响。"
  },
  desk: {
    title: "主屋旧桌",
    image: "scene-desk.svg",
    caption: "桌面压着玻璃，玻璃下有旧日历、汇款单和一截褪色红绳。"
  },
  chest: {
    title: "炕边木箱",
    image: "scene-chest.svg",
    caption: "木箱铁箍被磨得发亮，像有人每年都要打开，又每年都不敢久看。"
  },
  cabinet: {
    title: "里间壁柜",
    image: "scene-cabinet.svg",
    caption: "壁柜背阴，柜门内侧贴着一张很小的松峰岭地形剪影。"
  },
  altar: {
    title: "窗前供桌",
    image: "scene-altar.svg",
    caption: "窗外松涛阵阵。供桌很干净，像一直有人在等一句迟到的报告。"
  }
};

const storySeeds = {
  door: "你站在松峰岭旧护林小屋前。李念军说，爷爷生前总讲：屋里东西不要乱扔，尤其是靠窗那只木箱。",
  desk: "门开后，一股松脂、皂角和旧纸气味涌出。墙上挂着护林证，日期停在 1997 年一次大雪巡山。",
  chest: "炕沿下的木箱终于露出来。箱盖里面写着四个淡字：班长教我。",
  cabinet: "三把小钥匙同时转动时，壁柜里落下一点干花末。这里藏的不是荣誉，而是另一个人的名字。",
  altar: "全部遗物摆到窗前时，你忽然意识到：这间小屋不是退隐处，而是一座守了六十年的无名哨位。"
};

function loadState() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    return raw ? { ...defaultState(), ...JSON.parse(raw) } : defaultState();
  } catch {
    return defaultState();
  }
}

function saveState() {
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}

function addStory(text) {
  if (!state.story.includes(text)) {
    state.story.unshift(text);
    state.story = state.story.slice(0, 12);
    saveState();
  }
}

function addRelic(id) {
  if (!state.relics.includes(id)) {
    state.relics.push(id);
    state.clueScore += 1;
    toast(`确认遗物：${relicCatalog.find(([key]) => key === id)?.[1] || id}`);
    saveState();
  }
}

function addDeepEgg(id, text) {
  if (!state.deepEggs[id]) {
    state.deepEggs[id] = true;
    state.clueScore += 2;
    addStory(text);
    toast("发现深层线索");
    if (Object.keys(state.deepEggs).length >= 5) addRelic("soldierPhoto");
    saveState();
  }
}

function addNaturalEgg(id, text) {
  if (!state.naturalEggs[id]) {
    state.naturalEggs[id] = true;
    state.clueScore += 1;
    addStory(text);
    saveState();
  }
}

function setScene(next) {
  state.scene = next;
  addStory(storySeeds[next]);
  saveState();
  render();
  if (next === "chest") maybeShowPaywall();
}

function showGame() {
  $("#startScreen").classList.add("hidden");
  $("#gameScreen").classList.remove("hidden");
  $("#endingScreen").classList.add("hidden");
  state.started = true;
  if (!state.story.length) addStory(storySeeds.door);
  saveState();
  render();
}

function maybeShowPaywall() {
  if (localStorage.getItem(PAY_PROMPT_KEY)) return;
  localStorage.setItem(PAY_PROMPT_KEY, "1");
  if (window.Paywall && !Paywall.hasPaid()) {
    setTimeout(() => Paywall.show({
      title: "支持《松峰岭小屋》",
      price: "1元",
      studio: "abc studio",
      qrCode: "paycode.png"
    }), 1400);
  }
}

function render() {
  const scene = scenes[state.scene];
  $("#sceneTitle").textContent = scene.title;
  $("#sceneImage").src = scene.image;
  $("#sceneImage").alt = `${scene.title}场景图`;
  $("#sceneCaption").textContent = scene.caption;
  $("#progressBadge").textContent = `遗物 ${state.relics.length} / ${relicCatalog.length}`;
  $("#focusText").textContent = focusText();

  renderStory();
  renderInventory();
  renderHotspots();
  renderPuzzle();
}

function focusText() {
  if (state.scene === "door") return "先处理门口：看春联和护林守则，补全下联或叩门进入。";
  if (state.scene === "desk") {
    if (!state.relics.includes("diary")) return "先拼回 1953 日记：找齐三片纸，再按语序排列。";
    if (!state.relics.includes("receipt")) return "日记已拼好。现在只整理汇款单，按日期排出第一张。";
    return "主屋已整理完，下一步去炕边木箱。";
  }
  if (state.scene === "chest") {
    if (!state.chestOpened) return "先打开炕边木箱：从军帽、枪托、地形图推三位密码。";
    if (!state.smokeDecoded) return "木箱已打开。现在只译烟盒暗号。";
    return "木箱线索已整理完，下一步去里间壁柜。";
  }
  if (state.scene === "cabinet") {
    if (state.keys.length < 3) return `先找齐三把小钥匙，目前 ${state.keys.length}/3。`;
    if (!state.cabinetOpened) return "钥匙齐了。现在三钥同转，打开壁柜。";
    if (!state.finalUnlocked) return "壁柜已打开。现在把三句遗书嘱托配回对应照片。";
    return "壁柜真相已确认，下一步去窗前供桌。";
  }
  return "最后只做一件事：选择三件最能代表真相的遗物，向两位老人报告。";
}

function renderStory() {
  $("#storyLog").innerHTML = state.story.map(text => `<div class="story-entry">${escapeHtml(text)}</div>`).join("");
}

function renderInventory() {
  $("#inventorySummary").textContent = `${state.relics.length} / ${relicCatalog.length}`;
  $("#inventory").innerHTML = relicCatalog.map(([id, name]) => {
    const got = state.relics.includes(id);
    return `<div class="item ${got ? "" : "locked"}">${got ? "✦ " : "· "}${name}</div>`;
  }).join("");
}

function renderHotspots() {
  const root = $("#hotspots");
  const button = (label, action, done = false) => `<button class="chip ${done ? "done" : ""}" data-action="${action}">${label}</button>`;
  const deepCount = Object.keys(state.deepEggs).length;
  if (state.scene === "door") {
    root.innerHTML = [
      button("看上联：守山守林守初心", "readCouplet", state.naturalEggs.couplet),
      button("读护林守则木牌", "readRules", state.naturalEggs.rules),
      button("拨一下青铜铃", "ringBell", state.naturalEggs.bell),
      button("连续叩门", "knockDoor", state.deepEggs.knock)
    ].join("");
  } else if (state.scene === "desk") {
    if (!state.relics.includes("diary")) {
      root.innerHTML = [
        button("拉开桌屉找纸片", "findScrapDrawer", state.scraps.includes("drawer")),
        button("摸旧军衣口袋", "findScrapCoat", state.scraps.includes("coat")),
        button("翻日历夹层", "findScrapCalendar", state.scraps.includes("calendar"))
      ].join("");
    } else if (!state.relics.includes("receipt")) {
      root.innerHTML = [
        button("看旧报纸", "readNewspaper", state.relics.includes("newspaper")),
        button("拿起松针标本", "takePine", state.relics.includes("pineNeedle")),
        button("可选：煤油灯暗线", "lampHint", state.deepEggs.lamps)
      ].join("");
    } else {
      root.innerHTML = [
        button("去炕边木箱", "goChest", false),
        button("回头叩门三下", "knockDoor", state.deepEggs.knock)
      ].join("");
    }
  } else if (state.scene === "chest") {
    if (!state.chestOpened) {
      root.innerHTML = [
        button("查看军帽年份 1951", "capClue", state.naturalEggs.cap),
        button("查看枪托编号 07", "rifleClue", state.naturalEggs.rifle),
        button("查看地形图 312 高地", "mapClue", state.naturalEggs.map)
      ].join("");
    } else if (!state.smokeDecoded) {
      root.innerHTML = [
        button("擦拭奖章背面", "medalBack", state.naturalEggs.medalBack),
        button("可选：地图坐标 1-3-7", "map137", state.deepEggs.map137)
      ].join("");
    } else {
      root.innerHTML = [
        button("去里间壁柜", "goCabinet", false),
        button("可选：地图坐标 1-3-7", "map137", state.deepEggs.map137)
      ].join("");
    }
  } else if (state.scene === "cabinet") {
    if (state.keys.length < 3) {
      root.innerHTML = [
        button("拆开日记封皮", "keyDiary", state.keys.includes("diary")),
        button("摸军衣暗扣", "keyButton", state.keys.includes("button")),
        button("轻敲松动青砖", "keyBrick", state.keys.includes("brick"))
      ].join("");
    } else if (!state.cabinetOpened) {
      root.innerHTML = [
        button("三钥同转", "openCabinet", false)
      ].join("");
    } else if (!state.finalUnlocked) {
      root.innerHTML = [
        button("可选：多敲几下青砖", "brickNote", state.deepEggs.brickNote),
        button("可选：翻 1987 年捐款收据", "donation", state.deepEggs.donation)
      ].join("");
    } else {
      root.innerHTML = [
        button("去窗前供桌", "goAltar", false),
        button("可选：翻 1987 年捐款收据", "donation", state.deepEggs.donation)
      ].join("");
    }
  } else {
    root.innerHTML = [
      button(`深层线索 ${deepCount}/5`, "deepCount", deepCount >= 5),
      button("查看搪瓷杯水印", "mug", state.relics.includes("mug")),
      button("开始摆放遗物", "focusFinal", state.finalUnlocked)
    ].join("");
  }
}

function renderPuzzle() {
  const root = $("#puzzlePanel");
  if (state.scene === "door") return renderDoorPuzzle(root);
  if (state.scene === "desk") return renderDeskPuzzle(root);
  if (state.scene === "chest") return renderChestPuzzle(root);
  if (state.scene === "cabinet") return renderCabinetPuzzle(root);
  return renderFinalPuzzle(root);
}

function renderDoorPuzzle(root) {
  root.innerHTML = `
    <p>门口春联下联缺了三个字。上联是“守山守林守初心”，护林守则里有一句被磨亮：护林、护家、护英灵。</p>
    <input id="doorAnswer" autocomplete="off" placeholder="填入下联最后三个字" />
    <button class="primary-btn" data-action="submitDoor">贴上下联</button>
    <div class="paper-note">门缝里有极轻的声音：不是锁打不开，是屋里的人怕承诺被忘记。</div>
  `;
}

function renderDeskPuzzle(root) {
  const scrapsDone = state.scraps.length >= 3;
  const diaryDone = state.relics.includes("diary");
  const receiptDone = state.relics.includes("receipt");
  if (!diaryDone) {
    root.innerHTML = `
      <div class="focus-step">步骤 1 / 2：先拼回 1953 日记。找齐三片纸后，再按语序点选。</div>
      <p>主屋旧桌上暂时只需要处理日记碎片。纸片分别藏在桌屉、旧军衣口袋、日历夹层里。</p>
      <div class="visual-row">
        ${["drawer", "calendar", "coat"].map(id => `<button class="choice-btn ${state.selectedScraps.includes(id) ? "selected" : ""}" data-scrap="${id}">
          <small>${scrapMeta(id).tag}</small>${scrapMeta(id).text}
        </button>`).join("")}
      </div>
      <button class="primary-btn" data-action="checkScraps" ${scrapsDone ? "" : "disabled"}>按纸边和语序拼合日记</button>
      <div class="paper-note">目标语序：“复员回乡 → 答应班长 → 一定做到”。</div>
    `;
    return;
  }

  if (!receiptDone) {
    root.innerHTML = `
      <div class="focus-step">步骤 2 / 2：日记已拼好。现在整理汇款单。</div>
      <p>汇款单散落在玻璃下。点击卡片按时间排序，再填入最早一张的日期。</p>
      <div class="visual-row">
        ${receiptCards().map(card => `<button class="receipt ${state.receiptOrder.includes(card.id) ? "done" : ""}" data-receipt="${card.id}">
          <small>${card.date}</small>${card.to}<br />${card.note}
        </button>`).join("")}
      </div>
      <div class="paper-note">当前排序：${state.receiptOrder.map(id => receiptCards().find(card => card.id === id)?.date).filter(Boolean).join(" → ") || "尚未选择"}</div>
      <input id="receiptAnswer" placeholder="最早汇款日期，如 1953.11.07" />
      <button class="primary-btn" data-action="checkReceipts">收好汇款单，打开炕沿暗格</button>
      <details class="optional-box">
        <summary>可选暗线：三盏煤油灯</summary>
        <p>煤油灯底部刻着三个位置：主屋、里间、窗前。按从门到山风的路线点亮。</p>
        <div class="inline-actions">
          <button class="chip" data-lamp="main">主屋灯</button>
          <button class="chip" data-lamp="inner">里间灯</button>
          <button class="chip" data-lamp="window">窗前灯</button>
        </div>
      </details>
    `;
    return;
  }

  root.innerHTML = `
    <div class="focus-step">主屋已整理完。下一步去炕边木箱。</div>
    <p>日记和汇款单已经归档。你发现收款人并不是李家，而是陈铁柱的母亲。</p>
    <button class="ghost-btn" data-action="goChest">去炕边木箱</button>
  `;
}

function renderChestPuzzle(root) {
  if (!state.chestOpened) {
    root.innerHTML = `
      <div class="focus-step">步骤 1 / 2：先打开木箱。</div>
      <p>木箱密码不是生日。箱盖里写着“班长教我的暗号”：军帽年份取十位，枪托编号取个位，地形图高地取末位。</p>
      <div class="visual-row">
        <div class="scrap"><small>军帽</small>1951 年，十位数被汗渍磨亮。</div>
        <div class="scrap"><small>枪托</small>编号 07，最后一刀刻得很深。</div>
        <div class="scrap"><small>地形图</small>松峰岭 312 高地。</div>
      </div>
      <input id="chestCode" maxlength="3" inputmode="numeric" placeholder="三位木箱密码" />
      <button class="primary-btn" data-action="unlockChest">转动铜锁</button>
    `;
    return;
  }

  if (!state.smokeDecoded) {
    root.innerHTML = `
      <div class="focus-step">步骤 2 / 2：木箱已打开。现在译烟盒暗号。</div>
      <p>烟盒内侧不是歌词，是通信兵用火柴痕写下的阵地口令。</p>
      <div class="paper-note">丨丨— / 丨— / —丨丨 / 丨— / ··· —— ··· / 松 / 峰</div>
      <input id="smokeAnswer" placeholder="译出的八个字" />
      <button class="primary-btn" data-action="decodeSmoke">译出烟盒暗号</button>
      <details class="optional-box">
        <summary>可选暗线</summary>
        <p>奖章背面和地形图坐标里还有额外线索，可在左侧按钮区慢慢查看。</p>
      </details>
    `;
    return;
  }

  root.innerHTML = `
    <div class="focus-step">木箱线索已整理完。下一步去里间壁柜。</div>
    <p>烟盒暗号已译出，战斗报告和奖章也能对上了。</p>
    <button class="ghost-btn" data-action="goCabinet">去里间壁柜</button>
  `;
}

function renderCabinetPuzzle(root) {
  const keyReady = state.keys.length >= 3;
  if (!keyReady) {
    root.innerHTML = `
      <div class="focus-step">步骤 1 / 3：先找齐三把小钥匙。</div>
      <p>壁柜有三只小锁：日记封皮、旧军衣暗扣、松动青砖里各藏着一把钥匙。</p>
      <div class="paper-note">已找到钥匙 ${state.keys.length}/3。先不用处理遗书和照片，等柜门打开再说。</div>
    `;
    return;
  }

  if (!state.cabinetOpened) {
    root.innerHTML = `
      <div class="focus-step">步骤 2 / 3：钥匙齐了。现在打开壁柜。</div>
      <p>三把小钥匙同时转动时，壁柜里落下一点干花末。这里藏的不是荣誉，而是另一个人的名字。</p>
      <button class="primary-btn" data-action="openCabinet">三钥同转</button>
    `;
    return;
  }

  if (!state.finalUnlocked) {
    root.innerHTML = `
      <div class="focus-step">步骤 3 / 3：把遗书里的三句嘱托，配回对应照片。</div>
      <p>壁柜里露出陈铁柱烈士证明、半封信和几张陈家照片。先完成主线配对，可选暗线稍后再看。</p>
      <div class="letter-match">
        <label>“娘若问起，就说我还在阵地上听电话。”</label>
        <select id="matchMother"><option value="">选择照片</option><option value="mother">陈母在门口</option><option value="xiaomei">小梅入学照</option><option value="child">陈家孩子军装照</option></select>
        <label>“小梅要继续念书，她不能再替我走山路。”</label>
        <select id="matchXiaomei"><option value="">选择照片</option><option value="mother">陈母在门口</option><option value="xiaomei">小梅入学照</option><option value="child">陈家孩子军装照</option></select>
        <label>“若有一天孩子当兵，请告诉他，信号不能断。”</label>
        <select id="matchChild"><option value="">选择照片</option><option value="mother">陈母在门口</option><option value="xiaomei">小梅入学照</option><option value="child">陈家孩子军装照</option></select>
      </div>
      <button class="primary-btn" data-action="checkMatches">贴回照片背面</button>
      <details class="optional-box">
        <summary>可选暗线</summary>
        <p>青砖和 1987 年捐款收据里还有深层线索，可在左侧按钮区慢慢查看。</p>
      </details>
    `;
    return;
  }

  root.innerHTML = `
    <div class="focus-step">壁柜真相已确认。下一步去窗前供桌。</div>
    <p>遗书和照片已经配回去了。现在可以把最重要的三件遗物摆到窗前。</p>
    <button class="ghost-btn" data-action="goAltar">去窗前供桌</button>
  `;
}

function renderFinalPuzzle(root) {
  const options = [
    ["medal", "一等功奖章"],
    ["workPermit", "护林证"],
    ["diary", "1953 日记"],
    ["finalLetter", "半封遗书"],
    ["receipt", "汇款单"],
    ["soldierPhoto", "陈家孩子军装照"]
  ].filter(([id]) => state.relics.includes(id));
  root.innerHTML = `
    <p>请选择三件最适合放到窗前的遗物。顺序会决定你看到的结局。</p>
    <div class="visual-row">
      ${options.map(([id, label]) => `<button class="relic-btn ${state.selectedRelics.includes(id) ? "selected" : ""}" data-relic="${id}">${label}</button>`).join("")}
    </div>
    <div class="paper-note">当前顺序：${state.selectedRelics.map(id => options.find(([key]) => key === id)?.[1] || id).join(" → ") || "尚未摆放"}</div>
    <button class="primary-btn" data-action="finishGame" ${state.selectedRelics.length === 3 ? "" : "disabled"}>向两位老人报告整理结果</button>
  `;
}

function scrapMeta(id) {
  return {
    drawer: { tag: "桌屉纸片", text: "复员回乡那天，松峰岭雪停了。" },
    calendar: { tag: "日历夹层", text: "答应班长的事，不能让老人等空门。" },
    coat: { tag: "军衣口袋", text: "一定要做到。哪怕没人知道。" }
  }[id];
}

function receiptCards() {
  return [
    { id: "r1979", date: "1979.08.01", to: "陈小梅", note: "学费和棉鞋钱" },
    { id: "r1953", date: "1953.11.07", to: "陈母", note: "第一次汇款，附米票" },
    { id: "r2013", date: "2013.04.05", to: "陈家孙辈", note: "入伍路费" },
    { id: "r1960", date: "1960.02.14", to: "陈母", note: "药费，勿回信" },
    { id: "r1998", date: "1998.08.01", to: "陈家", note: "孩子上学" }
  ];
}

function normalize(text) {
  return (text || "").replace(/[，。,.\s年/-]/g, "").trim();
}

function handleAction(action) {
  const actionMap = {
    readCouplet: () => addNaturalEgg("couplet", "半副春联的红纸背面写着：长根，别忘了松峰岭。"),
    readRules: () => addNaturalEgg("rules", "护林守则最后一行被反复摩挲：护林、护家、护英灵。"),
    ringBell: () => { playTone("bell"); addNaturalEgg("bell", "青铜铃响了一下，屋里仿佛有人把搪瓷杯放回桌上。"); },
    knockDoor,
    submitDoor,
    findScrapDrawer: () => findScrap("drawer"),
    findScrapCoat: () => findScrap("coat"),
    findScrapCalendar: () => findScrap("calendar"),
    lampHint: showLampPuzzle,
    checkScraps,
    readNewspaper: () => { addRelic("newspaper"); addNaturalEgg("newspaper", "旧报纸报道停战消息，边角写着：铁柱，今天山上很安静。"); },
    takePine: () => addRelic("pineNeedle"),
    checkReceipts,
    goChest: () => setScene("chest"),
    capClue: () => addNaturalEgg("cap", "军帽内衬写着 1951，十位数字被汗渍磨得发白。"),
    rifleClue: () => addNaturalEgg("rifle", "枪托编号 07，像是某个年轻人故意留下的暗号。"),
    mapClue: () => addNaturalEgg("map", "地形图上 312 高地被圈了三层，旁边写着“人在台在”。"),
    map137: () => addDeepEgg("map137", "你按地形图坐标 1-3-7 读出暗线：阵地不是守住的，是一个个名字撑住的。"),
    medalBack: () => addNaturalEgg("medalBack", "奖章背面极浅地刻着两个字：铁柱。"),
    unlockChest,
    decodeSmoke,
    goCabinet: () => setScene("cabinet"),
    keyDiary: () => findKey("diary", "日记封皮里掉出第一把小铜钥匙。"),
    keyButton: () => findKey("button", "军衣暗扣夹层有第二把钥匙，还带着皂角味。"),
    keyBrick: () => findKey("brick", "松动青砖后藏着第三把钥匙和一小撮干松针。"),
    brickNote,
    donation: () => addDeepEgg("donation", "1987 年捐款收据显示，李长根曾以陈铁柱名义资助过潮汐福利院的孩子。"),
    openCabinet,
    checkMatches,
    goAltar: () => setScene("altar"),
    mug: () => { addRelic("mug"); addNaturalEgg("mugMark", "搪瓷杯倒入清水后浮出淡淡水印：最可爱的人。"); },
    deepCount: () => toast(`深层线索 ${Object.keys(state.deepEggs).length}/5`),
    focusFinal: () => toast("把三件遗物按你理解的真相顺序摆上去。"),
    finishGame
  };
  actionMap[action]?.();
  render();
}

function submitDoor() {
  const value = ($("#doorAnswer")?.value || "").trim();
  if (value === "护英灵") {
    addStory("下联补全：护林护家护英灵。门闩轻轻落下，像屋里有人终于点头。");
    setScene("desk");
  } else {
    toast("门没有动。再看看护林守则被磨亮的三个字。");
  }
}

function knockDoor() {
  state.doorKnocks += 1;
  playTone("knock");
  if (state.doorKnocks >= 3) {
    addDeepEgg("knock", "你连续叩门三下，屋里传来很轻的一句：进来吧，门没锁。");
    setScene("desk");
  } else {
    toast(`叩门 ${state.doorKnocks}/3`);
  }
  saveState();
}

function findScrap(id) {
  if (!state.scraps.includes(id)) {
    state.scraps.push(id);
    addStory(`找到日记碎片：${scrapMeta(id).text}`);
    playTone("paper");
  }
}

function checkScraps() {
  if (state.scraps.length < 3) return toast("还缺日记碎片。");
  const order = ["drawer", "calendar", "coat"];
  if (state.selectedScraps.join(",") !== order.join(",")) return toast("语序还不顺。按“复员回乡 → 答应班长 → 一定做到”来拼。");
  addRelic("diary");
  addRelic("workPermit");
  addStory("1953 年复员日记拼回来了：李长根没有写自己立功，只写“答应班长的事，一定要做到”。");
}

function checkReceipts() {
  const correct = ["r1953", "r1960", "r1979", "r1998", "r2013"].join(",");
  if (state.receiptOrder.join(",") !== correct) return toast("汇款单顺序不对，先看日期。");
  const answer = normalize($("#receiptAnswer")?.value);
  if (answer !== "19531107") return toast("最早那张被红线圈住，日期是 1953.11.07。");
  addRelic("receipt");
  addStory("最早一张汇款单日期是 1953.11.07。收款人不是李家，而是陈铁柱的母亲。炕沿暗格弹开了。");
}

function unlockChest() {
  if (($("#chestCode")?.value || "").trim() !== "572") return toast("铜锁没开。军帽十位、枪托个位、312 高地末位。");
  state.chestOpened = true;
  addStory("木箱打开，最上层不是奖章，而是一只用旧烟盒压住的通信记录本。");
  playTone("metal");
  saveState();
}

function decodeSmoke() {
  if (!state.chestOpened) return toast("先打开木箱。");
  const ans = normalize($("#smokeAnswer")?.value);
  if (ans !== normalize("人在台在死守松峰")) return toast("烟盒暗号还没译准。八个字，是阵地口令。");
  state.smokeDecoded = true;
  addRelic("medal");
  addRelic("battleReport");
  addStory("烟盒暗号译出：人在台在，死守松峰。战斗报告证明，李长根曾在通信台旁坚守三天三夜，并因此获一等功。");
  saveState();
}

function findKey(id, text) {
  if (!state.keys.includes(id)) {
    state.keys.push(id);
    addStory(text);
    playTone("metal");
    saveState();
  }
}

function brickNote() {
  state.looseBrickClicks += 1;
  if (state.looseBrickClicks >= 5) {
    addDeepEgg("brickNote", "青砖后的小纸条写着：谢谢长根爷爷，我长大了也要当兵。");
  } else {
    toast(`青砖微微松动 ${state.looseBrickClicks}/5`);
  }
  saveState();
}

function openCabinet() {
  if (state.keys.length < 3) return toast("三把钥匙还没齐。");
  state.cabinetOpened = true;
  addRelic("martyrCert");
  addRelic("familyPhotos");
  addStory("壁柜打开：陈铁柱烈士证明、半封遗书和几十年陈家照片被整齐包在油纸里。原来李长根守的不是自己的荣誉，是班长的家。");
  saveState();
}

function checkMatches() {
  if (!state.cabinetOpened) return toast("先打开壁柜。");
  if ($("#matchMother").value === "mother" && $("#matchXiaomei").value === "xiaomei" && $("#matchChild").value === "child") {
    state.finalUnlocked = true;
    addRelic("finalLetter");
    addStory("遗书和照片配回去了。信中最后一句被泪水洇开：若我回不来，替我照看娘和小梅。");
    saveState();
  } else {
    toast("照片背面的年份和称呼还没对上。");
  }
}

function showLampPuzzle() {
  toast("灯谜就在当前线索面板里：主屋 → 里间 → 窗前。");
}

function touchLamp(id) {
  state.lampSequence.push(id);
  const correct = ["main", "inner", "window"];
  const current = state.lampSequence.join(",");
  if (!correct.join(",").startsWith(current)) {
    state.lampSequence = [];
    toast("火苗晃了一下，顺序错了。");
  } else if (state.lampSequence.length === 3) {
    state.lampSequence = [];
    addDeepEgg("lamps", "三盏灯次第亮起，墙上显出一张年轻合影：李长根和陈铁柱并肩站在通信线旁。");
  } else {
    toast("灯芯亮了。");
  }
  saveState();
}

function finishGame() {
  const order = state.selectedRelics.join(",");
  const deepCount = Object.keys(state.deepEggs).length;
  let ending = "normal";
  if (order === "medal,finalLetter,soldierPhoto" && deepCount >= 5) ending = "perfect";
  else if (order === "medal,finalLetter,receipt") ending = "truth";
  showEnding(ending);
}

function showEnding(kind) {
  $("#gameScreen").classList.add("hidden");
  $("#endingScreen").classList.remove("hidden");
  $("#endingCard").innerHTML = endingHtml(kind);
  window.scrollTo(0, 0);
  setTimeout(() => {
    $("#tributeCredits").classList.remove("hidden");
  }, 2600);
}

function endingHtml(kind) {
  if (kind === "perfect") {
    return `
      <h2>完美结局：信号永远长明</h2>
      <p>你把奖章、遗书和陈家孩子的军装照放在窗前。山下传来脚步声，几名年轻通信兵上山致敬，其中一人姓陈。</p>
      <p>他立正敬礼，说自己的太奶奶叫陈小梅。李长根守了六十年的承诺，终于有了回声。</p>
      <p>两只搪瓷杯并排放好：李长根，陈铁柱。一个守住通信台，一个守住战友的家。松涛吹过窗纸，像很远处的电台又一次接通。</p>
    `;
  }
  if (kind === "truth") {
    return `
      <h2>真相结局：两个人的哨位</h2>
      <p>你把奖章、遗书和汇款单放在一起。荣誉不再只是李长根的名字，而是陈铁柱推开战友、背起炸药包时留下的余温。</p>
      <p>1951 年的松峰岭上，一个人守住通信台；之后六十年，另一个人替他守住母亲、妹妹和后代。</p>
      <p>你在整理单最后写下：请以陈铁柱、李长根二人共同事迹建档。</p>
    `;
  }
  return `
    <h2>普通结局：山中老兵</h2>
    <p>你把奖章、护林证和日记放在窗前。李长根是一位值得尊敬的老兵，也是一位守山护林的老人。</p>
    <p>只是小屋深处仍有抽屉未开，照片背后还有没有说完的名字。山风很轻，像在提醒你：真相有时比荣誉更重。</p>
  `;
}

function resetGame() {
  const ok = confirm("确定清除本作存档并重新开始吗？");
  if (!ok) return;
  localStorage.removeItem(SAVE_KEY);
  localStorage.removeItem(PAY_PROMPT_KEY);
  state = defaultState();
  $("#startScreen").classList.remove("hidden");
  $("#gameScreen").classList.add("hidden");
  $("#endingScreen").classList.add("hidden");
}

function toast(text) {
  toastQueue.push(text);
  if (toastShowing) return;
  showNextToast();
}

function showNextToast() {
  const text = toastQueue.shift();
  if (!text) {
    toastShowing = false;
    return;
  }
  toastShowing = true;
  const node = document.createElement("div");
  node.className = "toast";
  node.textContent = text;
  document.body.appendChild(node);
  requestAnimationFrame(() => node.classList.add("show"));
  setTimeout(() => {
    node.classList.remove("show");
    setTimeout(() => {
      node.remove();
      showNextToast();
    }, 260);
  }, 2100);
}

function playTone(kind) {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const freq = { bell: 920, knock: 130, paper: 420, metal: 690 }[kind] || 440;
    osc.frequency.value = freq;
    osc.type = kind === "bell" ? "sine" : "triangle";
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.28);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch {
    /* audio is optional */
  }
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

document.addEventListener("click", (event) => {
  const actionTarget = event.target.closest("[data-action]");
  if (actionTarget) handleAction(actionTarget.dataset.action);

  const scrapTarget = event.target.closest("[data-scrap]");
  if (scrapTarget) {
    const id = scrapTarget.dataset.scrap;
    if (!state.scraps.includes(id)) return toast("先在场景中找到这片日记。");
    state.selectedScraps = state.selectedScraps.filter(x => x !== id);
    state.selectedScraps.push(id);
    saveState();
    render();
  }

  const receiptTarget = event.target.closest("[data-receipt]");
  if (receiptTarget) {
    const id = receiptTarget.dataset.receipt;
    state.receiptOrder = state.receiptOrder.filter(x => x !== id);
    state.receiptOrder.push(id);
    saveState();
    render();
  }

  const relicTarget = event.target.closest("[data-relic]");
  if (relicTarget) {
    const id = relicTarget.dataset.relic;
    state.selectedRelics = state.selectedRelics.filter(x => x !== id);
    state.selectedRelics.push(id);
    state.selectedRelics = state.selectedRelics.slice(-3);
    saveState();
    render();
  }

  const lampTarget = event.target.closest("[data-lamp]");
  if (lampTarget) touchLamp(lampTarget.dataset.lamp);
});

$("#startBtn").addEventListener("click", showGame);
$("#continueBtn").addEventListener("click", showGame);
$("#supportBtn").addEventListener("click", () => Paywall.show({
  title: "支持《松峰岭小屋》",
  price: "1元",
  studio: "abc studio",
  qrCode: "paycode.png"
}));
$("#resetBtn").addEventListener("click", resetGame);
$("#backToGameBtn").addEventListener("click", () => $("#tributeCredits").classList.add("hidden"));

$$(".optional-history img").forEach((img) => {
  img.addEventListener("error", () => img.closest(".optional-history")?.classList.add("hidden"));
});

if (state.started) {
  $("#continueBtn").classList.remove("hidden");
} else {
  $("#continueBtn").classList.add("hidden");
}

window.GameDebug = {
  getState: () => JSON.parse(JSON.stringify(state)),
  setScene,
  reset: () => {
    localStorage.removeItem(SAVE_KEY);
    localStorage.removeItem(PAY_PROMPT_KEY);
    state = defaultState();
    saveState();
    render();
  }
};
