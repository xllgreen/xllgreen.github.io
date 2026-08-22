(function () {
  const SAVE_KEY = "guihuaxiang_no3_save_v1";
  const PAY_PROMPT_KEY = "guihuaxiang_pay_prompted_v1";

  const $ = (sel) => document.querySelector(sel);
  const scene = $("#scene");

  const noteData = [
    { date: "1998-05-02", lead: "储", body: "物箱边坐着一个扎羊角辫的小姑娘，不买东西，只盯着漫画书看。" },
    { date: "1999-09-01", lead: "物", body: "价签换了三回，陈婆婆还是把橘子糖按一颗两分记在账上。" },
    { date: "2000-02-14", lead: "间", body: "口的桂花还没开，有人把半张电影票根塞进玻璃台板下面。" },
    { date: "2001-06-28", lead: "钥", body: "匙扣上的小铃铛丢了，婆婆说听不见也好，省得吵着孩子写作业。" },
    { date: "2002-07-15", lead: "匙", body: "子大的雨下了一整天，小月亮还是来买了草莓冰棍。" },
    { date: "2003-10-05", lead: "藏", body: "着糖的铁盒被孩子们发现，婆婆嘴上骂，手上又添了三颗。" },
    { date: "2004-01-22", lead: "在", body: "柜台下找到一截铅笔头，是婆婆给小月亮削作业铅笔留下的。" },
    { date: "2005-04-11", lead: "青", body: "石板路翻修，店门口多了一只铁皮青蛙，肚子里有空腔。" },
    { date: "2006-08-03", lead: "蛙", body: "声从巷口水沟里传来，陈念说像收音机里坏掉的夏天。" },
    { date: "2007-07-15", lead: "肚", body: "子饿的小孩排在柜台前，婆婆给每人多塞一颗橘子硬糖。" },
    { date: "2009-12-30", lead: "里", body: "面那张便签写着：婆婆的糖最甜。字小得像怕被人发现。" },
    { date: "2010-07-23", lead: "面", body: "朝清晨的车站，小月亮走了，只留下一幅画夹在门缝里。" }
  ];

  const objectData = [
    { key: "frog", year: 1998, name: "铁皮青蛙", hint: "巷口翻修那年，孩子们第一次听见它肚子里的铃声。" },
    { key: "gum", year: 2001, name: "大大泡泡糖", hint: "陈念掉第一颗牙那年，婆婆说泡泡不能吹太大。" },
    { key: "game", year: 2004, name: "黑白游戏机", hint: "小月亮考了双百分，婆婆允许她多玩十分钟。" },
    { key: "soda", year: 2008, name: "橘子汽水", hint: "奥运开幕那天，全巷的人挤在店门口看小电视。" }
  ];

  const photoSlots = [1998, 2001, 2004, 2008];

  const hints = {
    1: [
      "账本扉页说“最盼的日子”。先看哪些日期被婆婆反复圈出来。",
      "四条被圈出来的记录都落在同一天：每年暑假开始、小月亮会来店里的日子。",
      "第一章密码是 0715。那是 7 月 15 日，也是婆婆每年最盼小月亮来的日子。"
    ],
    2: [
      "便签不用看内容的真假，先把它们当成一串时间碎片。",
      "把 12 张便签按日期从早到晚排好，再读每张便签开头第一个字。",
      "正确顺序会读出“储物间钥匙藏在青蛙肚里面”。"
    ],
    3: [
      "货架上的旧物都有对应年份，把物件放进相册空缺年份里。",
      "相册补齐后会露出收音机密码。留意胶片边缘的四个红色角标。",
      "照片对应：1998 铁皮青蛙、2001 泡泡糖、2004 游戏机、2008 橘子汽水。收音机密码是 2008。"
    ],
    4: [
      "铁皮信箱密码是小月亮的生日，不是第一章的 0715。",
      "前三章里反复出现了另一个日期：最后一笔账、最后一张便签，以及小月亮离开的那天。",
      "信箱密码是 0723。那天是小月亮生日，也是她来不及道别就搬走的清晨。"
    ],
    5: [
      "结局由隐藏纪念物数量、便签选择、最终回复共同决定。",
      "如果想要最完整的圆满，需要集齐糖纸、铅笔头、儿童画，并承认自己就是小月亮。",
      "真结局条件：3 件隐藏纪念物 + 选择“我就是小月亮，我一直记得她”。"
    ]
  };

  const endings = {
    true: {
      title: "桂花再开时",
      stamp: "真结局",
      body(choice) {
        const bank = choice === "box"
          ? "你把当年那张五元纸币从铁盒里取出，和新老花镜一起放在旧收银台旁。"
          : "你把那张夹回账本的五元纸币轻轻翻出来，像把一段欠了很久的夏天重新摆正。";
        return [
          "周末你回了一趟老巷。房子已经拆了，桂花树却还在，树下新开了一间社区书屋。",
          "陈念把杂货铺的旧物都搬了进去：玻璃糖罐、断腿老花镜、那本写满“算了”的旧账本，还有你小时候塞进门缝的画。",
          bank,
          "最后一本日记的最后一页写着：“知道她过得好，就放心了。”",
          "风吹过来，桂花香混着橘子硬糖的甜。你终于轻声说：婆婆，我回来了。"
        ];
      }
    },
    warm: {
      title: "糖盒里的夏天",
      stamp: "温暖结局",
      body() {
        return [
          "陈念给你寄来一个旧铁皮糖盒。盒盖已经掉漆，里面却整整齐齐放着橘子硬糖、半截铅笔、还有一张被压平的旧便签。",
          "你在便签背面补上的那句话，被陈念也抄了一遍：对不起，当年没敢说，谢谢你等我长大。",
          "你没有马上回到老巷，但把糖盒放在书桌边。加班到深夜时，你会剥一颗糖，像有人又在柜台后面轻轻说：慢点吃，别噎着。",
          "遗憾没有完全消失，但它不再冷。它被装进糖盒里，慢慢变成一盏小灯。"
        ];
      }
    },
    soft: {
      title: "温柔的陌生人",
      stamp: "治愈结局",
      body() {
        return [
          "你帮陈念整理完了这个纪念站，在留言墙写下：“这家杂货铺一定很温暖。”",
          "你始终没有完全认出自己就是故事里的小月亮，只觉得偶然闯进了一段很温柔的旧时光。",
          "关掉页面前，你把网站发给一个朋友，说：你看，原来有人被偷偷惦记了这么多年。",
          "桂花巷三号把秘密安安静静留在了夏天里。而你带着那一点暖意，继续往前走。"
        ];
      }
    }
  };

  const defaultState = () => ({
    started: false,
    chapter: 1,
    unlocked: 1,
    chapter1Solved: false,
    banknoteChoice: "",
    noteOrder: [7, 2, 10, 0, 5, 11, 1, 8, 3, 9, 4, 6],
    noteSelected: -1,
    noteSolved: false,
    stickyChoice: "",
    selectedObject: "",
    albumSlots: { 1998: "", 2001: "", 2004: "", 2008: "" },
    albumSolved: false,
    radioPlayed: false,
    keepsakes: { wrapper: false, pencil: false, drawing: false },
    mailboxOpen: false,
    lettersRevealed: false,
    finalChoice: "",
    replyText: "",
    ending: "",
    hintLog: []
  });

  let state = loadState();
  let audio = {
    ctx: null,
    timer: null,
    enabled: false
  };

  function loadState() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return defaultState();
      return Object.assign(defaultState(), JSON.parse(raw));
    } catch (err) {
      return defaultState();
    }
  }

  function saveState() {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  }

  function resetGame() {
    if (!confirm("确定要重置桂花巷三号的整理进度吗？")) return;
    localStorage.removeItem(SAVE_KEY);
    localStorage.removeItem(PAY_PROMPT_KEY);
    state = defaultState();
    $("#app").hidden = true;
    $("#boot").style.display = "grid";
    render();
  }

  function toast(msg) {
    const el = $("#toast");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => el.classList.remove("show"), 2600);
  }

  function playClick() {
    if (!audio.ctx) return;
    const osc = audio.ctx.createOscillator();
    const gain = audio.ctx.createGain();
    osc.type = "triangle";
    osc.frequency.value = 620;
    gain.gain.setValueAtTime(0.0001, audio.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.035, audio.ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, audio.ctx.currentTime + 0.12);
    osc.connect(gain).connect(audio.ctx.destination);
    osc.start();
    osc.stop(audio.ctx.currentTime + 0.13);
  }

  function toggleAudio() {
    if (!audio.ctx) {
      audio.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    audio.enabled = !audio.enabled;
    $("#audioBtn").textContent = audio.enabled ? "关闭风铃 BGM" : "开启风铃 BGM";
    if (audio.enabled) {
      startChimes();
      toast("风铃声开了。桂花巷好像有风吹过。");
    } else {
      clearInterval(audio.timer);
      audio.timer = null;
    }
  }

  function startChimes() {
    clearInterval(audio.timer);
    const notes = [523, 587, 659, 784, 880];
    const ring = () => {
      if (!audio.enabled || !audio.ctx) return;
      const now = audio.ctx.currentTime;
      const osc = audio.ctx.createOscillator();
      const gain = audio.ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = notes[Math.floor(Math.random() * notes.length)];
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.025, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);
      osc.connect(gain).connect(audio.ctx.destination);
      osc.start(now);
      osc.stop(now + 1.7);
    };
    ring();
    audio.timer = setInterval(ring, 4200);
  }


  function progress() {
    let p = 6;
    if (state.chapter1Solved) p = 22;
    if (state.noteSolved) p = 42;
    if (state.radioPlayed) p = 64;
    if (state.lettersRevealed) p = 84;
    if (state.ending) p = 100;
    p += keepsakeCount() * 3;
    return Math.min(100, p);
  }

  function keepsakeCount() {
    return Object.values(state.keepsakes).filter(Boolean).length;
  }

  function unlockChapter(n) {
    if (state.unlocked < n) state.unlocked = n;
  }

  function goChapter(n) {
    if (n > state.unlocked) return;
    state.chapter = n;
    saveState();
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function updateChrome() {
    $("#progressText").textContent = progress() + "%";
    $("#progressBar").style.width = progress() + "%";
    $("#keepsakeCount").textContent = keepsakeCount() + " / 3";
    [...$("#keepsakeDots").children].forEach((dot, i) => dot.classList.toggle("found", i < keepsakeCount()));
    $("#chapterLabel").textContent = ["第一章", "第二章", "第三章", "第四章", "第五章"][state.chapter - 1];
    $$("#chapterTabs button").forEach(btn => {
      const ch = Number(btn.dataset.chapter);
      btn.disabled = ch > state.unlocked;
      btn.classList.toggle("active", ch === state.chapter);
    });
  }

  function $$(sel) {
    return [...document.querySelectorAll(sel)];
  }

  function setNotice(text) {
    $("#storyNotice").textContent = text;
  }

  function render() {
    updateChrome();
    if (!state.started) return;
    if (state.chapter === 1) renderChapter1();
    if (state.chapter === 2) renderChapter2();
    if (state.chapter === 3) renderChapter3();
    if (state.chapter === 4) renderChapter4();
    if (state.chapter === 5) renderChapter5();
    bindCommonScene();
    saveState();
  }

  function bindCommonScene() {
    $$("[data-go]").forEach(btn => btn.addEventListener("click", () => goChapter(Number(btn.dataset.go))));
  }

  function renderChapter1() {
    setNotice("收银台玻璃下面压着旧日历。账本扉页写着：开门密码，是我最盼的日子。");
    scene.innerHTML = `
      <div class="chapter-head">
        <div>
          <h2>第一章：收银台的旧账本</h2>
          <p>掉漆的木质收银台、半张电影票根、一副断腿老花镜。旧账本摊在最亮的地方，像有人刚刚离开。</p>
        </div>
        <span class="tag">入门谜题 · 温柔开场</span>
      </div>
      <div class="grid-2">
        <div class="wood-counter">
          <div class="glass"></div>
          <div class="old-calendar"><span>七月</span><b>15</b><span>暑假第一天</span></div>
          <div class="ticket">桂花巷电影院<br>半张票根<br>2003 / 夏</div>
          <div class="glasses"><i></i></div>
          <button class="banknote" id="banknoteBtn" title="查看五元纸币">¥5</button>
          <div class="ledger">
            <h3>陈桂兰杂货铺赊账簿</h3>
            <table>
              <tr><td><span class="circled">07/15</span></td><td>小月亮 赊草莓冰棍 1 根</td><td>算了</td></tr>
              <tr><td><span class="circled">07/15</span></td><td>小月亮 借看漫画 1 本</td><td>算了</td></tr>
              <tr><td><span class="circled">07/15</span></td><td>小月亮 橘子硬糖 2 颗</td><td>算了</td></tr>
              <tr><td><span class="circled">07/15</span></td><td>小月亮 草莓冰棍 1 根</td><td>算了</td></tr>
              <tr><td>2010/07/23</td><td>小月亮 今天走了？</td><td>没划掉</td></tr>
            </table>
          </div>
        </div>
        <div class="panel">
          <h3>留 言 墙 解 锁</h3>
          <p>扉页上有婆婆用铅笔描了好几遍的一句话：<br>“开门密码，是我最盼的日子。”</p>
          <div class="puzzle-box">
            <label for="ledgerCode">输入四位密码</label>
            <div class="password-row">
              <input id="ledgerCode" maxlength="4" inputmode="numeric" placeholder="____" autocomplete="off" />
              <button class="key-btn" id="checkLedger">确认</button>
            </div>
            <div class="feedback ${state.chapter1Solved ? "ok" : ""}" id="ledgerFeedback">
              ${state.chapter1Solved ? "旧留言墙已解锁。那些被风吹皱的便签，终于能看见了。" : "线索都在账本里。"}
            </div>
          </div>
          <div class="puzzle-box" style="margin-top:14px">
            <strong>五元纸币</strong>
            <p>纸币夹在账本最前面，是小月亮外婆当年硬塞给婆婆的冰棍钱。婆婆一直没花。</p>
            <div class="choice-row">
              <button class="soft-btn ${state.banknoteChoice === "ledger" ? "selected" : ""}" data-bank="ledger">放回账本原位</button>
              <button class="soft-btn ${state.banknoteChoice === "box" ? "selected" : ""}" data-bank="box">单独收进铁盒保存</button>
            </div>
          </div>
          ${state.chapter1Solved ? `<button class="chapter-next" data-go="2">去留言墙看看 ›</button>` : ""}
        </div>
      </div>
    `;

    $("#checkLedger").addEventListener("click", checkLedger);
    $("#ledgerCode").addEventListener("keydown", e => {
      if (e.key === "Enter") checkLedger();
    });
    $("#banknoteBtn").addEventListener("click", () => showModal("那张五元纸币", "纸币边角已经软了，折痕像一条细细的河。背面用铅笔写着：小月亮冰棍钱。婆婆没有收，也没有退，只是把它夹在最前面，像怕忘了什么。"));
    $$("[data-bank]").forEach(btn => btn.addEventListener("click", () => {
      state.banknoteChoice = btn.dataset.bank;
      toast(btn.dataset.bank === "box" ? "你把纸币放进铁盒。它像一枚被保存的夏天。" : "你把纸币放回账本。旧账仍在原处，像等待一声谢谢。");
      render();
    }));
  }

  function checkLedger() {
    playClick();
    const val = $("#ledgerCode").value.trim();
    if (val === "0715") {
      state.chapter1Solved = true;
      unlockChapter(2);
      $("#ledgerFeedback").textContent = "密码正确。留言墙的便签纸一张张亮了起来。";
      $("#ledgerFeedback").className = "feedback ok";
      toast("第二章已解锁。");
      setTimeout(render, 600);
    } else {
      $("#ledgerFeedback").textContent = "密码不对。婆婆最盼的，似乎不是最后离开的那天。";
      $("#ledgerFeedback").className = "feedback bad";
    }
    saveState();
  }

  function renderChapter2() {
    setNotice("留言墙贴满了褪色便签。陈念在角落留了一行小字：先按日子排好，再读开头。");
    const solvedPhrase = noteData.map(n => n.lead).join("");
    const sortedCorrect = state.noteOrder.every((idx, pos) => idx === pos);
    scene.innerHTML = `
      <div class="chapter-head">
        <div>
          <h2>第二章：留言墙的便签纸</h2>
          <p>学生的考试祈福、街坊的随手留言、半撕掉的道歉。便签边角卷起，像很多人没说完的话。</p>
        </div>
        <span class="tag">排序谜题 · 低压无失败</span>
      </div>
      <div class="grid-2">
        <div class="wall">
          <div class="notes-grid">
            ${state.noteOrder.map(idx => stickyHTML(noteData[idx])).join("")}
          </div>
        </div>
        <div class="panel">
          <h3>按时间整理便签</h3>
          <p>按日期从早到晚排列。整理完成后，每张便签第一个字会连成一句位置提示。</p>
          <div class="note-sorter" id="noteSorter">
            ${state.noteOrder.map((idx, pos) => noteRowHTML(noteData[idx], pos)).join("")}
          </div>
          <div class="note-control">
            <button id="moveUp">上移</button>
            <button id="moveDown">下移</button>
            <button id="checkNotes">确认顺序</button>
          </div>
          <div class="feedback ${state.noteSolved ? "ok" : sortedCorrect ? "ok" : ""}" id="noteFeedback">
            ${state.noteSolved ? `便签开头连起来是：${solvedPhrase}` : sortedCorrect ? "顺序看起来已经对了，确认一下吧。" : "选中一张便签后，可以上下移动。"}
          </div>
          ${state.noteSolved ? `
            <div class="phrase">储物间钥匙藏在青蛙肚里面。货架上的铁皮青蛙，原来不是普通摆件。</div>
            <div class="puzzle-box" style="margin-top:14px">
              <strong>半撕掉的便签</strong>
              <p>只剩半句：“对不起，当年没敢说……” 这大概是婆婆女儿年轻时偷偷回来留下的。</p>
              <div class="choice-row">
                <button class="soft-btn ${state.stickyChoice === "complete" ? "selected" : ""}" data-sticky="complete">写下：谢谢你还等我长大</button>
                <button class="soft-btn ${state.stickyChoice === "keep" ? "selected" : ""}" data-sticky="keep">原样放好，不打扰</button>
              </div>
            </div>
            <button class="chapter-next" data-go="3">去老货架与相册 ›</button>
          ` : ""}
        </div>
      </div>
    `;
    $$("#noteSorter .note-row").forEach(row => row.addEventListener("click", () => {
      state.noteSelected = Number(row.dataset.pos);
      renderChapter2();
    }));
    $("#moveUp").addEventListener("click", () => moveNote(-1));
    $("#moveDown").addEventListener("click", () => moveNote(1));
    $("#checkNotes").addEventListener("click", checkNotes);
    $$("[data-sticky]").forEach(btn => btn.addEventListener("click", () => {
      state.stickyChoice = btn.dataset.sticky;
      toast(btn.dataset.sticky === "complete" ? "你替那张便签补上了一句迟到的话。" : "你把便签放回原处，让遗憾保持它原本的样子。");
      render();
    }));
  }

  function stickyHTML(n) {
    return `<div class="sticky"><div class="date">${n.date}</div><div class="body">${n.lead}${n.body}</div></div>`;
  }

  function noteRowHTML(n, pos) {
    return `
      <div class="note-row ${state.noteSelected === pos ? "selected" : ""}" data-pos="${pos}">
        <div><strong>${n.date}</strong><br><span>${n.lead}${n.body}</span></div>
        <button type="button">选择</button>
      </div>
    `;
  }

  function moveNote(delta) {
    playClick();
    const pos = state.noteSelected;
    if (pos < 0) return toast("先选中一张便签。");
    const next = pos + delta;
    if (next < 0 || next >= state.noteOrder.length) return;
    const arr = state.noteOrder;
    [arr[pos], arr[next]] = [arr[next], arr[pos]];
    state.noteSelected = next;
    saveState();
    renderChapter2();
  }

  function checkNotes() {
    playClick();
    const ok = state.noteOrder.every((idx, pos) => idx === pos);
    if (ok) {
      state.noteSolved = true;
      unlockChapter(3);
      toast("第三章已解锁。货架上的铁皮青蛙轻轻响了一下。");
      render();
    } else {
      $("#noteFeedback").textContent = "还不对。日期越早，越应该排在前面。";
      $("#noteFeedback").className = "feedback bad";
    }
    saveState();
  }

  function renderChapter3() {
    setNotice("老货架落着一层薄灰。相册缺了四张照片，收音机也在等一个四位密码。");
    scene.innerHTML = `
      <div class="chapter-head">
        <div>
          <h2>第三章：货架与旧相册</h2>
          <p>铁皮青蛙、大大泡泡糖、黑白游戏机、橘子汽水。每一件旧物都像一个年份的门牌。</p>
        </div>
        <span class="tag">物件匹配 · 隐藏收集</span>
      </div>
      <div class="shelf-scene">
        <div class="shelf">
          ${objectData.map(objectCardHTML).join("")}
        </div>
        <div class="album">
          <h3>封皮磨破的相册</h3>
          <p>选择货架上的物件，再点击对应年份的相册空位。</p>
          <div class="album-grid">
            ${photoSlots.map(slotHTML).join("")}
          </div>
          <div class="radio">
            <strong>卡带收音机</strong>
            <div class="radio-face" aria-hidden="true"></div>
            <p>${state.albumSolved ? "相册补齐后，胶片边缘露出四个红色角标：2 · 0 · 0 · 8" : "按播放键没有反应。也许得先把相册补完整。"}</p>
            <div class="password-row">
              <input id="radioCode" maxlength="4" inputmode="numeric" placeholder="____" ${state.albumSolved ? "" : "disabled"} />
              <button class="key-btn" id="radioBtn" ${state.albumSolved ? "" : "disabled"}>${state.radioPlayed ? "已播放" : "播放"}</button>
            </div>
            <div class="feedback ${state.radioPlayed ? "ok" : ""}" id="radioFeedback">
              ${state.radioPlayed ? "婆婆的录音已经播放：小月亮啊，草莓味的给你留着了，什么时候回来拿啊。" : "收音机里的磁带还没有转动。"}
            </div>
          </div>
          <div class="collectibles">
            ${collectibleHTML("wrapper", "皱巴巴的橘子糖纸", svgWrapper())}
            ${collectibleHTML("pencil", "半块带橡皮的铅笔头", svgPencil())}
            ${collectibleHTML("drawing", "泛黄的儿童画", svgDrawing())}
          </div>
          ${state.radioPlayed ? `<button class="chapter-next" data-go="4">带着钥匙去储物间 ›</button>` : ""}
        </div>
      </div>
    `;
    $$(".object-card").forEach(card => card.addEventListener("click", () => {
      if (card.classList.contains("used")) return;
      state.selectedObject = card.dataset.key;
      renderChapter3();
    }));
    $$(".photo-slot").forEach(slot => slot.addEventListener("click", () => fillPhoto(Number(slot.dataset.year))));
    $$(".collectible").forEach(item => item.addEventListener("click", () => collectKeepsake(item.dataset.keep)));
    $("#radioBtn").addEventListener("click", checkRadio);
    $("#radioCode").addEventListener("keydown", e => {
      if (e.key === "Enter") checkRadio();
    });
  }

  function objectCardHTML(o) {
    const used = Object.values(state.albumSlots).includes(o.key);
    return `
      <button class="object-card ${state.selectedObject === o.key ? "selected" : ""} ${used ? "used" : ""}" data-key="${o.key}">
        ${objectSVG(o.key)}
        <strong>${o.name}</strong>
        <small>${o.hint}</small>
      </button>
    `;
  }

  function slotHTML(year) {
    const key = state.albumSlots[year];
    if (!key) {
      return `<button class="photo-slot" data-year="${year}">${year}<br>照片缺失</button>`;
    }
    const obj = objectData.find(o => o.key === key);
    return `
      <button class="photo-slot filled" data-year="${year}">
        <div class="photo-card">
          ${photoSVG(year, key)}
          <strong>${year} · ${obj.name}</strong>
        </div>
      </button>
    `;
  }

  function fillPhoto(year) {
    playClick();
    if (!state.selectedObject) return toast("先从货架上选一件旧物。");
    const obj = objectData.find(o => o.key === state.selectedObject);
    if (!obj) return;
    if (Object.values(state.albumSlots).includes(obj.key)) return toast("这件旧物已经放进相册了。");
    if (obj.year !== year) return toast("年份对不上。再看看物件说明里的时间。");
    state.albumSlots[year] = obj.key;
    state.selectedObject = "";
    state.albumSolved = photoSlots.every(y => state.albumSlots[y]);
    if (state.albumSolved) toast("相册补齐了。收音机密码从胶片边缘浮出来。");
    saveState();
    renderChapter3();
  }

  function checkRadio() {
    playClick();
    if (!state.albumSolved || state.radioPlayed) return;
    if ($("#radioCode").value.trim() === "2008") {
      state.radioPlayed = true;
      unlockChapter(4);
      $("#radioFeedback").textContent = "磁带沙沙响起：小月亮啊，草莓味的给你留着了，什么时候回来拿啊。";
      $("#radioFeedback").className = "feedback ok";
      toast("第四章已解锁。铁皮信箱在储物间里等着。");
      setTimeout(render, 800);
    } else {
      $("#radioFeedback").textContent = "磁带没有转动。相册边缘那四个红色角标更像答案。";
      $("#radioFeedback").className = "feedback bad";
    }
    saveState();
  }

  function collectKeepsake(key) {
    if (state.keepsakes[key]) {
      toast("这件纪念物已经收好了。");
      return;
    }
    state.keepsakes[key] = true;
    const names = { wrapper: "橘子糖纸", pencil: "铅笔头", drawing: "儿童画" };
    toast(`找到隐藏纪念物：${names[key]}`);
    saveState();
    render();
  }

  function collectibleHTML(key, label, svg) {
    return `
      <button class="collectible ${state.keepsakes[key] ? "found" : ""}" data-keep="${key}" title="${label}">
        ${svg}
        <span class="screen-reader">${label}</span>
      </button>
    `;
  }

  function renderChapter4() {
    setNotice("储物间比外面安静许多。铁皮信箱挂着铜锁，密码是婆婆最盼的另一个日子。");
    scene.innerHTML = `
      <div class="chapter-head">
        <div>
          <h2>第四章：储物间的铁皮信箱</h2>
          <p>绿漆信箱立在墙角，锁孔旁贴着一枚褪色桂花贴纸。信箱里像装着好多年没寄出去的风。</p>
        </div>
        <span class="tag">反转章 · 迟来的赴约</span>
      </div>
      <div class="storage">
        <div class="mailbox">
          ${svgMailbox(state.mailboxOpen)}
        </div>
        <div class="panel" style="background:rgba(255,244,215,.92);color:var(--ink)">
          <h3>铁皮信箱密码</h3>
          <p>婆婆最盼的日子，不止 7 月 15 日。还有一个她年年记着、却没等到你回来的日子。</p>
          <div class="password-row">
            <input id="mailCode" maxlength="4" inputmode="numeric" placeholder="____" ${state.mailboxOpen ? "disabled" : ""} />
            <button class="key-btn" id="mailBtn" ${state.mailboxOpen ? "disabled" : ""}>开锁</button>
          </div>
          <div class="feedback ${state.mailboxOpen ? "ok" : ""}" id="mailFeedback">
            ${state.mailboxOpen ? "铜锁开了。信箱里叠着一沓没寄出去的信，收信人都是“小月亮”。" : "想想 2010 年 7 月 23 日为什么没有被划掉。"}
          </div>
          ${state.mailboxOpen ? lettersHTML() : ""}
        </div>
      </div>
    `;
    $("#mailBtn").addEventListener("click", checkMailbox);
    $("#mailCode").addEventListener("keydown", e => {
      if (e.key === "Enter") checkMailbox();
    });
    const revealBtn = $("#revealLetters");
    if (revealBtn) revealBtn.addEventListener("click", revealLetters);
  }

  function lettersHTML() {
    return `
      <div class="letters">
        <div class="letter">小月亮：巷口桂花开了，今年比去年香。草莓味冰棍也进了，冻在最里面。</div>
        <div class="letter">小月亮：你说要给我买新老花镜，我可记着呢。买不买都行，你过得好就行。</div>
        <div class="letter">小月亮：听说你考去外地了，要好好读书。别像婆婆年轻时候，只会算糖钱。</div>
        <div class="letter">最后一封只写了半句：等不到你放假了，你要好好……</div>
      </div>
      ${state.lettersRevealed ? `
        <div class="reveal">
          信堆最底下，是你当年塞进门缝里的儿童画。背面有婆婆用铅笔描了无数遍的三个字：小月亮。<br>
          你终于明白，匿名委托不是偶然。陈念找了你三年，只为了替婆婆把这些东西交到你手上。
        </div>
        <button class="chapter-next" data-go="5">给陈念回信 ›</button>
      ` : `<button class="chapter-next" id="revealLetters">翻到最底下</button>`}
    `;
  }

  function checkMailbox() {
    playClick();
    if ($("#mailCode").value.trim() === "0723") {
      state.mailboxOpen = true;
      $("#mailFeedback").textContent = "铜锁咔哒一声。那些没寄出的信终于有了收件人。";
      $("#mailFeedback").className = "feedback ok";
      toast("信箱打开了。");
      setTimeout(render, 600);
    } else {
      $("#mailFeedback").textContent = "锁没有开。第一章最后一笔账，和第二章最后一张便签，指向同一天。";
      $("#mailFeedback").className = "feedback bad";
    }
    saveState();
  }

  function revealLetters() {
    state.lettersRevealed = true;
    unlockChapter(5);
    toast("第五章已解锁。陈念的聊天窗亮了。");
    saveState();
    render();
  }

  function renderChapter5() {
    setNotice("聊天窗头像是一块旧门帘。陈念说：我终于找到你了，但我怕太突然，所以先假装成匿名委托。");
    const custom = state.replyText || "婆婆，对不起。我好像回来得太晚了。";
    scene.innerHTML = `
      <div class="chapter-head">
        <div>
          <h2>第五章：最后的回信</h2>
          <p>所有旧物都整理完了。剩下的，是你终于可以写出的那封回信。</p>
        </div>
        <span class="tag">多结局 · 无负面结局</span>
      </div>
      <div class="chat-scene">
        <div class="chat-window">
          <div class="chat-title"><div class="avatar"></div><div><strong>陈念</strong><br><small>桂花巷三号纪念站制作者</small></div></div>
          <div class="chat-body">
            <div class="bubble from">谢谢你帮我整理到最后。其实……我知道你可能就是婆婆一直等的“小月亮”。</div>
            <div class="bubble from">婆婆去年冬天走了。她走得很安详，手里攥着那张画。她没有怪你，她只是很想知道你过得好不好。</div>
            <div class="bubble from">如果你愿意，可以给她，也给自己，留一句话。</div>
            ${state.finalChoice ? `<div class="bubble to">${custom}</div>` : ""}
          </div>
          <div class="reply-box">
            <textarea id="replyText" placeholder="写下你想留下的话……">${escapeHTML(state.replyText)}</textarea>
            <div class="reply-options">
              <button class="choice-btn ${state.finalChoice === "moon" ? "selected" : ""}" data-final="moon">我就是小月亮，我一直记得她</button>
              <button class="choice-btn ${state.finalChoice === "thanks" ? "selected" : ""}" data-final="thanks">谢谢她替我保存了那个夏天</button>
              <button class="choice-btn ${state.finalChoice === "blessing" ? "selected" : ""}" data-final="blessing">我帮你整理完了，替我祝婆婆安好</button>
            </div>
          </div>
        </div>
        <div class="panel">
          <h3>你的整理结果</h3>
          <p>隐藏纪念物：${keepsakeCount()} / 3</p>
          <p>五元纸币：${state.banknoteChoice === "box" ? "收进铁盒" : state.banknoteChoice === "ledger" ? "放回账本" : "未处理"}</p>
          <p>遗憾便签：${state.stickyChoice === "complete" ? "补上了一句话" : state.stickyChoice === "keep" ? "原样放好" : "未选择"}</p>
          <button class="chapter-next" id="finishBtn" ${state.finalChoice ? "" : "disabled"}>送出最后的回信</button>
          <div id="endingBox">${state.ending ? endingHTML(state.ending) : ""}</div>
        </div>
      </div>
    `;
    $("#replyText").addEventListener("input", e => {
      state.replyText = e.target.value;
      saveState();
    });
    $$("[data-final]").forEach(btn => btn.addEventListener("click", () => {
      state.finalChoice = btn.dataset.final;
      if (!state.replyText) {
        state.replyText = btn.dataset.final === "moon"
          ? "我就是小月亮。我一直记得草莓冰棍、橘子硬糖，也记得她说“慢点吃”。"
          : btn.dataset.final === "thanks"
            ? "谢谢她替我保存了那个夏天。那时候我太小，不懂有人在身后等我长大。"
            : "谢谢你让我见到这家杂货铺。替我祝婆婆安好，也祝桂花巷永远有风。";
      }
      render();
    }));
    $("#finishBtn").addEventListener("click", finishEnding);
  }

  function finishEnding() {
    playClick();
    if (!state.finalChoice) return toast("先选择一种回复。");
    if (state.finalChoice === "moon" && keepsakeCount() === 3) state.ending = "true";
    else if (keepsakeCount() >= 1 && state.stickyChoice === "complete" && state.finalChoice !== "blessing") state.ending = "warm";
    else state.ending = "soft";
    saveState();
    render();
    setTimeout(() => $("#endingBox").scrollIntoView({ behavior: "smooth", block: "center" }), 100);
  }

  function endingHTML(type) {
    const e = endings[type];
    const lines = e.body(state.banknoteChoice);
    return `
      <div class="ending-card">
        <span class="stamp">${e.stamp}</span>
        <h3>${e.title}</h3>
        ${lines.map(line => `<p>${line}</p>`).join("")}
        <button class="soft-btn" onclick="window.scrollTo({top:0,behavior:'smooth'})">回到纪念站顶部</button>
      </div>
    `;
  }

  function showModal(title, body) {
    $("#modalBody").innerHTML = `<h2>${title}</h2><p>${body}</p>`;
    $("#modal").hidden = false;
  }

  function openHints() {
    $("#hintDrawer").classList.add("show");
    $("#hintDrawer").setAttribute("aria-hidden", "false");
    renderHintLog();
  }

  function closeHints() {
    $("#hintDrawer").classList.remove("show");
    $("#hintDrawer").setAttribute("aria-hidden", "true");
  }

  function showHint(level) {
    const text = hints[state.chapter][level - 1];
    $("#hintOutput").textContent = text;
    const record = `第${state.chapter}章 · ${level}级提示：${text}`;
    if (!state.hintLog.includes(record)) state.hintLog.push(record);
    saveState();
    renderHintLog();
  }

  function renderHintLog() {
    $("#hintLog").innerHTML = state.hintLog.length
      ? state.hintLog.slice().reverse().map(x => `<small>${x}</small>`).join("")
      : "<small>还没有查看过提示。</small>";
  }

  function escapeHTML(str) {
    return String(str || "").replace(/[&<>"']/g, s => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[s]));
  }

  function objectSVG(key) {
    const map = {
      frog: `<svg viewBox="0 0 180 120" role="img" aria-label="铁皮青蛙"><defs><linearGradient id="frogG" x1="0" x2="1"><stop stop-color="#5f9b62"/><stop offset="1" stop-color="#9dc76e"/></linearGradient></defs><ellipse cx="90" cy="68" rx="58" ry="36" fill="url(#frogG)" stroke="#2f6738" stroke-width="5"/><circle cx="58" cy="39" r="18" fill="#75ad63" stroke="#2f6738" stroke-width="4"/><circle cx="122" cy="39" r="18" fill="#75ad63" stroke="#2f6738" stroke-width="4"/><circle cx="58" cy="39" r="7" fill="#1d2a19"/><circle cx="122" cy="39" r="7" fill="#1d2a19"/><path d="M67 73 Q90 90 113 73" fill="none" stroke="#2f6738" stroke-width="5" stroke-linecap="round"/><path d="M43 89 L20 102 M137 89 L160 102" stroke="#2f6738" stroke-width="6" stroke-linecap="round"/></svg>`,
      gum: `<svg viewBox="0 0 180 120" role="img" aria-label="大大泡泡糖"><rect x="24" y="38" width="132" height="46" rx="12" fill="#ff8fb1" stroke="#a74466" stroke-width="5"/><path d="M24 61 L4 43 L4 80 Z M156 61 L176 43 L176 80 Z" fill="#ffd1df" stroke="#a74466" stroke-width="4"/><circle cx="90" cy="61" r="22" fill="#ffd9e6"/><path d="M72 61 H108" stroke="#a74466" stroke-width="5" stroke-linecap="round"/></svg>`,
      game: `<svg viewBox="0 0 180 120" role="img" aria-label="黑白游戏机"><rect x="40" y="18" width="100" height="86" rx="14" fill="#e7e2d5" stroke="#53483d" stroke-width="5"/><rect x="56" y="30" width="68" height="38" rx="4" fill="#7f9076" stroke="#3e493d" stroke-width="4"/><circle cx="62" cy="85" r="8" fill="#444"/><circle cx="119" cy="84" r="6" fill="#b65a45"/><circle cx="134" cy="76" r="6" fill="#587aa4"/><path d="M76 84 H93 M84 76 V93" stroke="#444" stroke-width="5" stroke-linecap="round"/></svg>`,
      soda: `<svg viewBox="0 0 180 120" role="img" aria-label="橘子汽水"><path d="M70 14 H110 L116 104 H64 Z" fill="#f0a33a" stroke="#8d4d1e" stroke-width="5"/><rect x="68" y="44" width="44" height="28" rx="6" fill="#ffe7a4"/><path d="M75 58 Q90 42 105 58 Q90 75 75 58" fill="#f28c24"/><rect x="74" y="6" width="32" height="12" rx="4" fill="#47795a"/></svg>`
    };
    return map[key] || "";
  }

  function photoSVG(year, key) {
    return `<svg viewBox="0 0 180 100" role="img" aria-label="${year}照片"><rect width="180" height="100" fill="#efe0bf"/><rect x="8" y="8" width="164" height="84" rx="4" fill="#c9d5bd"/><circle cx="135" cy="26" r="14" fill="#f2c45e"/><path d="M0 83 Q46 45 90 82 T180 78 V100 H0 Z" fill="#8aa36a"/><rect x="42" y="40" width="42" height="42" rx="4" fill="#8d5531"/><path d="M36 42 H90 L82 30 H44 Z" fill="#6f4126"/><circle cx="104" cy="57" r="13" fill="#30302c"/><path d="M104 70 V88 M90 83 Q104 76 118 83" stroke="#30302c" stroke-width="5" stroke-linecap="round"/><text x="12" y="24" font-size="14" fill="#7d5130">${year}</text>${objectSVG(key).replace("<svg", "<svg x='118' y='54' width='45' height='35'")}</svg>`;
  }

  function svgWrapper() {
    return `<svg viewBox="0 0 120 80" role="img" aria-label="橘子糖纸"><path d="M20 18 L100 12 L92 62 L28 68 Z" fill="#f59d3d" stroke="#8f5326" stroke-width="3"/><path d="M20 18 L4 34 L24 42 Z M100 12 L116 30 L96 40 Z" fill="#ffd07c" stroke="#8f5326" stroke-width="3"/><circle cx="60" cy="40" r="18" fill="#ffe1a0"/><path d="M47 40 Q60 26 73 40 Q60 56 47 40" fill="#f09024"/></svg>`;
  }

  function svgPencil() {
    return `<svg viewBox="0 0 120 80" role="img" aria-label="铅笔头"><path d="M22 50 L80 16 L96 32 L38 66 Z" fill="#f0c15d" stroke="#86552b" stroke-width="3"/><path d="M80 16 L92 8 L108 24 L96 32 Z" fill="#e98f8f" stroke="#86552b" stroke-width="3"/><path d="M22 50 L10 72 L38 66 Z" fill="#d8b28a" stroke="#86552b" stroke-width="3"/><path d="M10 72 L19 56 L29 66 Z" fill="#3b2a20"/></svg>`;
  }

  function svgDrawing() {
    return `<svg viewBox="0 0 120 90" role="img" aria-label="儿童画"><rect x="18" y="8" width="84" height="74" rx="4" fill="#fff4c9" stroke="#a77944" stroke-width="3"/><path d="M30 57 L60 28 L90 57" fill="none" stroke="#d15b45" stroke-width="5" stroke-linecap="round"/><rect x="42" y="57" width="36" height="18" fill="#7aa05d"/><circle cx="33" cy="23" r="8" fill="#e9b842"/><path d="M47 69 Q60 59 73 69" stroke="#68452d" stroke-width="3" fill="none"/><text x="36" y="48" font-size="10" fill="#68452d">婆婆</text></svg>`;
  }

  function svgMailbox(open) {
    return `<svg viewBox="0 0 360 320" role="img" aria-label="铁皮信箱">
      <defs><linearGradient id="mbg" x1="0" x2="1"><stop stop-color="#416c56"/><stop offset="1" stop-color="#6c9b76"/></linearGradient></defs>
      <rect x="74" y="72" width="212" height="180" rx="18" fill="url(#mbg)" stroke="#203b2e" stroke-width="8"/>
      <rect x="96" y="104" width="168" height="40" rx="8" fill="#335d49"/>
      <text x="180" y="132" text-anchor="middle" fill="#e8f0d8" font-size="22" font-family="serif">桂花巷三号</text>
      <path d="M118 172 H242" stroke="#d9c28d" stroke-width="8" stroke-linecap="round"/>
      <circle cx="180" cy="212" r="24" fill="#d2a33d" stroke="#75501e" stroke-width="5"/>
      <path d="M180 212 v22" stroke="#75501e" stroke-width="5" stroke-linecap="round"/>
      ${open ? `<path d="M84 84 Q180 26 276 84" fill="#88b584" stroke="#203b2e" stroke-width="8"/><g transform="translate(126 164) rotate(-8)"><rect width="118" height="82" rx="5" fill="#fff1cf" stroke="#a77944" stroke-width="3"/><path d="M0 0 L59 44 L118 0" fill="none" stroke="#d1aa69" stroke-width="3"/></g>` : `<path d="M88 84 Q180 24 272 84" fill="none" stroke="#203b2e" stroke-width="8"/>`}
      <path d="M116 258 H244" stroke="#1d2b22" stroke-width="12" stroke-linecap="round"/>
    </svg>`;
  }

  function checkAlbumSolved() {
    state.albumSolved = photoSlots.every(y => state.albumSlots[y]);
  }

  document.addEventListener("click", e => {
    if (e.target.closest("button")) playClick();
  });

  $("#startBtn").addEventListener("click", () => {
    state.started = true;
    $("#boot").style.display = "none";
    $("#app").hidden = false;
    saveState();
    render();
  });

  $("#audioBtn").addEventListener("click", toggleAudio);
  $("#resetBtn").addEventListener("click", resetGame);
  $("#hintBtn").addEventListener("click", openHints);
  $("#closeHint").addEventListener("click", closeHints);
  $("#hintDrawer").addEventListener("click", e => { if (e.target.id === "hintDrawer") closeHints(); });
  $$(".hint-levels button").forEach(btn => btn.addEventListener("click", () => showHint(Number(btn.dataset.level))));
  $("#modalClose").addEventListener("click", () => $("#modal").hidden = true);
  $("#modal").addEventListener("click", e => { if (e.target.id === "modal") $("#modal").hidden = true; });
  $$("#chapterTabs button").forEach(btn => btn.addEventListener("click", () => goChapter(Number(btn.dataset.chapter))));

  window.GuihuaGame = {
    getState: () => state,
    goChapter,
    render,
    solveAll() {
      state.chapter1Solved = true;
      state.noteSolved = true;
      state.albumSlots = { 1998: "frog", 2001: "gum", 2004: "game", 2008: "soda" };
      state.albumSolved = true;
      state.radioPlayed = true;
      state.mailboxOpen = true;
      state.lettersRevealed = true;
      state.keepsakes = { wrapper: true, pencil: true, drawing: true };
      state.unlocked = 5;
      saveState();
      render();
    }
  };

  checkAlbumSolved();
  if (state.started) {
    $("#boot").style.display = "none";
    $("#app").hidden = false;
  }
  render();
})();
