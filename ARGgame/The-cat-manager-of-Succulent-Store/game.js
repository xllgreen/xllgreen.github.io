"use strict";

(() => {
  const SAVE_KEY = "cat_succulent_shop_save_v2";
  const BACKUP_KEY = "cat_succulent_shop_save_v2_backup";
  const LEGACY_SAVE_KEY = "cat_succulent_shop_save_v1";
  const TOTAL_CHAPTERS = 12;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const PLANTS = [
    ["taodan","桃蛋",2,"圆润粉叶，像落在窗台上的一颗桃子。"],
    ["xiongtongzi","熊童子",3,"叶尖带小爪印，最像猫店长的手套。"],
    ["yulu","玉露",3,"半透明窗叶，适合明亮散射光的窗边。"],
    ["nailao","奶酪",8,"暖黄叶片，像午后被晒软的一小块奶酪。"],
    ["zile","紫乐",7,"紫粉色调，安静但很会长成惊喜。"],
    ["jingye","静夜",8,"端正莲座，外婆最爱摆在收银台左侧。"],
    ["chengmenglu","橙梦露",6,"橙色叶缘，像日落时分的老社区。"],
    ["shengshihua","生石花",7,"像小石头一样沉默，却会突然开花。"],
    ["qianchuan","钱串",10,"一节一节往上长，适合新年订单。"],
    ["xicaishu","吸财树",10,"叶片像小小吸管，名字听起来很会招财。"],
    ["lanxinghua","蓝星花",5,"蓝色小星，适合给情绪开一扇窗。"],
    ["fenxueshan","粉雪山玫瑰",2,"粉白层叠，像一封没寄出的柔软信。"],
    ["mantianxing","蓝色满天星",5,"细碎蓝点，像夜风里散开的星。"],
    ["yangganju","洋甘菊",5,"带着淡淡茶香，适合写给失落的人。"],
    ["xiaoju","小雏菊",5,"普通但真诚，像一句刚好递到手里的安慰。"],
    ["fenglingcao","白色风铃草",5,"风一吹就轻轻晃，像外婆门口的铃声。"],
    ["margaret","玛格丽特",5,"一捧小太阳，送给总忘记夸自己的人。"],
    ["youhuahunli","油画婚礼",11,"斑斓叶片，像旧相册里被阳光染过的婚礼。"],
    ["changshouhua","长寿花",11,"年节常客，给长辈的祝福要热闹一点。"],
    ["junzilan","君子兰",12,"叶片端正，开花时像小小火炬。"],
    ["taiyanghua","太阳花",6,"晒一点光就认真开放，像不服输的孩子。"],
    ["xunzhangju","勋章菊",7,"花心像小勋章，稳稳压在加重陶盆里。"],
    ["bohe","薄荷",10,"揉一揉指尖清凉，雨天闻起来格外醒神。"],
    ["guibeizhu","龟背竹",12,"大叶子像一把旧伞，替窗台遮住太响的世界。"],
    ["wenzhu","文竹",12,"细细密密，像外婆写字时的笔画。"],
    ["qinyerong","琴叶榕",12,"叶片像琴，适合摆在门口听风。"],
    ["maocao","猫草",10,"猫店长会认真嚼三口，然后装作没发生。"],
    ["maobohe","猫薄荷",10,"打开后，小三花的尾巴会快乐到失去管理。"],
    ["sanhua","三花猫爪",3,"外婆培育的变异多肉，叶片带三色猫爪纹。"],
    ["fenbanxianren","粉斑迷你仙人球",4,"粉色小刺座，像害羞却努力防守的小刺猬。"],
    ["xiangrikui","童年向日葵花苗",6,"当年的一粒籽，悄悄在后院等你长大。"],
    ["liuxingcao","流星雨夜光草",5,"傍晚会在窗边发出像流星尾巴一样的光。"]
  ].map(([id,name,sprite,desc]) => ({id,name,sprite:`plant_sprite_${String(sprite).padStart(2,"0")}.png`,desc}));
  const PLANT_BY_ID = Object.fromEntries(PLANTS.map(p => [p.id,p]));

  const ACHIEVEMENTS = [
    ["open","推开玻璃门"],["trust","第一次被允许靠近"],["price","价格牌归位"],["customer","第一位客人"],
    ["catfriend","猫咪信任"],["note","温柔便签"],["rain","雨天订单"],["petfamily","宠物家庭方案"],
    ["key","七片钥匙"],["greenhouse","花房重启"],["memory","记忆拼图"],["choice","做出选择"],
    ["clear","全章节通关"],["feeder","猫粮供应商"],["groomer","梳毛师"],["player","逗猫棒冠军"],
    ["pet10","摸到第十下"],["collector","图鉴收藏家"],["logger","外婆便签收藏"],["nohint","独立解开一章"],
    ["hint3","看过三级提示"],["meteor","傍晚流星"],["support","支持独立创作"],["reborn","老店新生"]
  ].map(([id,name]) => ({id,name}));
  const ACH_BY_ID = Object.fromEntries(ACHIEVEMENTS.map(a => [a.id,a]));

  const EGGS = [
    ["pawprints","玻璃上的十枚猫爪印"],["leftEar","左耳缺角里的旧名字"],["fish","水缸里抢镜的小鱼"],
    ["bell","风铃红线"],["apron","旧围裙口袋"],["marble","童年玻璃弹珠"],
    ["radio","1998年的收音机"],["paperCrane","纸鹤上的一句话"],["moonWater","月光浇水"],
    ["catnip","猫薄荷事故"],["meteor","每日傍晚流星雨"],["idleBloom","安静三秒后的花开"]
  ].map(([id,name]) => ({id,name}));
  const EGG_BY_ID = Object.fromEntries(EGGS.map(e => [e.id,e]));

  const CHAPTERS = [
    {title:"空铺初遇",focus:"按让流浪猫安心的顺序接近它。",scene:"玻璃门发出轻响。花盆后，一双圆眼睛警惕地看着你。",hints:["先降低自己的存在感，不要直接伸手。","正确顺序从“蹲下”开始，最后要留出等待时间。","依次选择：蹲下保持距离 → 放下小鱼干 → 安静等待。"]},
    {title:"整理铺面",focus:"把四张价格牌按从低到高的顺序放回花盆。",scene:"旧价格牌混在抽屉里。背面有外婆写的铅笔数字。",hints:["不是按花盆大小，而是按数字排序。","最低是 12，最高是 36。","依次点击：12 → 20 → 28 → 36。"]},
    {title:"首位客人",focus:"根据客人的窗台条件推荐一盆合适的植物。",scene:"一位刚搬来的客人说：窗边只有明亮散射光，偶尔会忘记浇水。",hints:["注意“散射光”和“偶尔忘浇水”两个条件。","三种候选里，透明窗叶的那盆更符合描述。","选择玉露。"]},
    {title:"午间小憩",focus:"用不打扰猫咪的顺序完成午间照顾。",scene:"猫店长趴在账本上打盹，尾巴却悄悄勾住了梳子。",hints:["先满足最基本的需求，再整理毛发，最后互动。","顺序是吃东西、梳毛、玩耍。","依次选择：喂一点 → 轻轻梳毛 → 逗猫棒。"]},
    {title:"小姑娘的便签",focus:"写下一句至少 12 个字、没有敷衍重复的鼓励。",scene:"放学的小姑娘把一张揉皱的纸塞进留言盒：‘我好像什么都做不好。’",hints:["不需要猜固定答案，写一句具体、真诚的话即可。","至少 12 个字，不要只重复同一个字。","例如：今天已经很努力了，慢一点也没有关系。"]},
    {title:"雨天下单",focus:"为连续阴雨天的阳台订单选择更稳妥的组合。",scene:"雨水敲着遮雨棚。订单备注写着：‘通风一般，最近一周都见不到太阳。’",hints:["阴雨天要优先考虑排水和减少额外浇水。","选择带排水孔的盆，并暂缓浇水。","选择“排水孔陶盆＋暂缓浇水”。"]},
    {title:"铲屎官的需求",focus:"给有宠物的家庭设计安全摆放方案。",scene:"客人抱着一只好奇的幼猫，希望绿植和猫都能平安。",hints:["关键不只在植物名称，也在猫能否接触。","使用稳固高架，并把垂落枝叶收好。","选择“稳固高架＋收拢垂叶＋说明养护”。"]},
    {title:"深夜寻钥匙",focus:"根据四处线索拼出钥匙碎片顺序。",scene:"停电后，猫店长把四枚钥匙碎片推到月光下：柜台、门铃、围裙、花盆。",hints:["便签写着：先听铃，再看柜台；花盆在围裙之后。","门铃是 3，柜台是 1，围裙是 4，花盆是 2。","依次点击碎片：3 → 1 → 4 → 2。"]},
    {title:"后院花房",focus:"按旧养护卡设置晨光、通风和浇水。",scene:"花房控制台还能亮。旧卡片写着：晨光两格，通风三格，浇水一格。",hints:["三个数字已经写在场景说明里。","把三个下拉框分别设为 2、3、1。","晨光 2；通风 3；浇水 1。"]},
    {title:"记忆碎片",focus:"把四段记忆按年份排成时间线。",scene:"相册页散在地上：初见阿花、你离开老社区、外婆关店、今天重开。",hints:["先找最早的 1998，再找今天。","年份依次是 1998、2003、2023、2026。","按 1998 → 2003 → 2023 → 2026 点击。"]},
    {title:"结局选择",focus:"选择你愿意承担的生活方式，并确认它。",scene:"晨光照进花房。外婆没有替你留下标准答案，只留下了一把能从里面打开的钥匙。",hints:["这一章没有错误结局，选择与你真实感受最接近的方案。","三种选择都会保留多肉铺，只是你投入生活的方式不同。","选中任意方案后点击确认即可。"]},
    {title:"永恒铺面",focus:"自由营业、补全图鉴，并随时回看你的结局。",scene:"门铃再次响起。猫店长跳上柜台，像外婆当年那样认真巡视每一盆植物。",hints:["自由营业没有失败条件。","可以预览流星雨、查看图鉴、照顾猫店长或回看结局。","所有按钮都可反复体验，不会清除主线进度。"]}
  ];

  const CHAPTER_PLANTS = {
    1:["taodan","xiongtongzi"],2:["jingye","zile","nailao"],3:["yulu","shengshihua","fenbanxianren"],
    4:["maocao","maobohe"],5:["yangganju","xiaoju","lanxinghua"],6:["changshouhua","qianchuan","xicaishu"],
    7:["guibeizhu","wenzhu","qinyerong"],8:["fenglingcao","margaret"],9:["youhuahunli","junzilan","bohe"],
    10:["taiyanghua","xiangrikui","sanhua"],11:["fenxueshan","mantianxing","xunzhangju"],12:["chengmenglu","liuxingcao"]
  };
  const CHAPTER_ACH = {1:"trust",2:"price",3:"customer",4:"catfriend",5:"note",6:"rain",7:"petfamily",8:"key",9:"greenhouse",10:"memory",11:"choice",12:"reborn"};

  function freshState(){
    return {version:2,started:false,chapter:1,viewChapter:1,completed:[],chapterData:{},logs:[],inventory:[],plants:[],achievements:[],eggs:[],hintsViewed:{},ending:null,
      cat:{affection:0,pet:0,feed:0,groom:0,play:0,ear:0},settings:{sound:true,reducedMotion:false,textScale:1},stats:{actions:0},lastSaved:null};
  }

  function mergeDeep(base, incoming){
    if(Array.isArray(base)) return Array.isArray(incoming) ? incoming : base;
    if(base && typeof base === "object"){
      const out={...base};
      if(incoming && typeof incoming === "object") Object.keys(incoming).forEach(key=>{
        out[key]=key in base ? mergeDeep(base[key],incoming[key]) : incoming[key];
      });
      return out;
    }
    return incoming === undefined ? base : incoming;
  }

  function parseSave(raw){
    if(!raw) return null;
    const parsed=JSON.parse(raw);
    const merged=mergeDeep(freshState(),parsed);
    merged.version=2;
    merged.chapter=Math.max(1,Math.min(TOTAL_CHAPTERS,Number(merged.chapter)||1));
    merged.viewChapter=Math.max(1,Math.min(merged.chapter,Number(merged.viewChapter)||merged.chapter));
    return merged;
  }

  function migrateLegacy(raw){
    const old=JSON.parse(raw);const next=freshState();
    next.started=Boolean(old.started);next.chapter=Math.max(1,Math.min(TOTAL_CHAPTERS,Number(old.chapter)||1));next.viewChapter=next.chapter;
    next.completed=Array.from({length:Math.max(0,next.chapter-1)},(_,i)=>i+1);
    next.logs=Array.isArray(old.log)?old.log.filter(x=>typeof x==="string").slice(-80):[];
    next.logs.unshift("系统已将旧版存档迁移到新版流程；章节、植物、猫咪亲近度和主要彩蛋已保留。");
    next.inventory=Array.isArray(old.inventory)?old.inventory.filter(x=>typeof x==="string").slice(-40):[];
    const legacyPlants=Array.isArray(old.plants)?old.plants:[];
    next.plants=legacyPlants.filter(id=>PLANT_BY_ID[id]);
    next.completed.forEach(ch=>(CHAPTER_PLANTS[ch]||[]).forEach(id=>uniquePush(next.plants,id)));
    const oldCat=old.cat&&typeof old.cat==="object"?old.cat:{};
    ["affection","pet","feed","groom","play","ear"].forEach(key=>next.cat[key]=Math.max(0,Number(oldCat[key])||0));
    if(next.started)uniquePush(next.achievements,"open");
    next.completed.forEach(ch=>{if(CHAPTER_ACH[ch])uniquePush(next.achievements,CHAPTER_ACH[ch])});
    if(next.chapter===12){uniquePush(next.achievements,"clear");uniquePush(next.achievements,"reborn");(CHAPTER_PLANTS[12]||[]).forEach(id=>uniquePush(next.plants,id));}
    const eggMap={paw10:"pawprints",leftEarVoice:"leftEar",radio1998:"radio",paperCrane:"paperCrane",moonWater:"moonWater",catnipDrunk:"catnip",meteorEvening:"meteor",idleBloom:"idleBloom",oldApron:"apron",childhoodMarble:"marble",redString:"bell"};
    (Array.isArray(old.eggs)?old.eggs:[]).forEach(id=>{if(eggMap[id])uniquePush(next.eggs,eggMap[id])});
    return next;
  }

  function loadState(){
    try{
      const main=localStorage.getItem(SAVE_KEY);
      if(main) return parseSave(main);
    }catch(error){console.warn("主存档读取失败",error)}
    try{
      const backup=localStorage.getItem(BACKUP_KEY);
      if(backup){const recovered=parseSave(backup);recovered.logs.unshift("系统从备份存档恢复了进度。");return recovered;}
    }catch(error){console.warn("备份存档读取失败",error)}
    try{
      const legacy=localStorage.getItem(LEGACY_SAVE_KEY);
      if(legacy)return migrateLegacy(legacy);
    }catch(error){console.warn("旧版存档迁移失败",error)}
    return freshState();
  }

  let state=loadState();
  let lastFocus=null;
  let audioContext=null;
  let idleTimer=null;

  function safeSave(manual=false){
    state.lastSaved=Date.now();
    try{
      const previous=localStorage.getItem(SAVE_KEY);
      if(previous) localStorage.setItem(BACKUP_KEY,previous);
      localStorage.setItem(SAVE_KEY,JSON.stringify(state));
      updateSaveStatus(manual ? "手动存档完成" : "已自动保存");
      if(manual) toast("进度已安全保存");
      return true;
    }catch(error){
      console.error("存档失败",error);
      updateSaveStatus("存档失败，请导出备份");
      toast("浏览器未能写入存档，请在设置中导出备份");
      return false;
    }
  }

  function updateSaveStatus(text){
    const el=$("#saveStatus");
    if(!el) return;
    el.textContent=text;
    if(state.lastSaved && text.includes("保存")){
      const d=new Date(state.lastSaved);
      el.title=`最近保存：${d.toLocaleString()}`;
    }
  }

  function getData(ch=state.viewChapter){
    const key=String(ch);
    if(!state.chapterData[key]) state.chapterData[key]={};
    return state.chapterData[key];
  }
  function uniquePush(list,value){if(!list.includes(value)) list.push(value)}
  function addLog(text){uniquePush(state.logs,text);if(state.logs.length>=12) unlockAchievement("logger")}
  function addItem(text){if(!state.inventory.includes(text)){state.inventory.push(text);toast(`获得线索：${text}`)}}
  function discoverPlant(id){if(PLANT_BY_ID[id]&&!state.plants.includes(id)){state.plants.push(id);toast(`图鉴点亮：${PLANT_BY_ID[id].name}`);if(state.plants.length===PLANTS.length)unlockAchievement("collector")}}
  function unlockAchievement(id){if(ACH_BY_ID[id]&&!state.achievements.includes(id)){state.achievements.push(id);toast(`成就解锁：${ACH_BY_ID[id].name}`)}}
  function unlockEgg(id){if(EGG_BY_ID[id]&&!state.eggs.includes(id)){state.eggs.push(id);toast(`彩蛋发现：${EGG_BY_ID[id].name}`)}}

  function toast(message){
    const host=$("#toastHost");if(!host)return;
    const el=document.createElement("div");el.className="toast";el.textContent=message;host.appendChild(el);
    window.setTimeout(()=>el.remove(),3300);
  }

  function beep(type="ok"){
    if(!state.settings.sound) return;
    try{
      const Ctx=window.AudioContext||window.webkitAudioContext;if(!Ctx)return;
      audioContext=audioContext||new Ctx();
      const osc=audioContext.createOscillator();const gain=audioContext.createGain();
      osc.type="sine";osc.frequency.setValueAtTime(type==="ok"?520:220,audioContext.currentTime);
      if(type==="ok")osc.frequency.exponentialRampToValueAtTime(760,audioContext.currentTime+.11);
      gain.gain.setValueAtTime(.08,audioContext.currentTime);gain.gain.exponentialRampToValueAtTime(.001,audioContext.currentTime+.18);
      osc.connect(gain).connect(audioContext.destination);osc.start();osc.stop(audioContext.currentTime+.2);
    }catch(_){/* 音频不可用不影响流程 */}
  }

  function escapeHTML(value){return String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
  function isCompleted(ch){return state.completed.includes(ch)}
  function hintsFor(ch){return state.hintsViewed[String(ch)]||[]}

  function completeChapter(ch){
    if(ch!==state.viewChapter) return;
    if(!isCompleted(ch)){
      state.completed.push(ch);
      (CHAPTER_PLANTS[ch]||[]).forEach(discoverPlant);
      if(CHAPTER_ACH[ch]) unlockAchievement(CHAPTER_ACH[ch]);
      if(hintsFor(ch).length===0) unlockAchievement("nohint");
      addLog(`第 ${ch} 章「${CHAPTERS[ch-1].title}」完成。`);
      if(ch===1) unlockAchievement("open");
    }
    if(ch<TOTAL_CHAPTERS){
      state.chapter=Math.max(state.chapter,ch+1);state.viewChapter=ch+1;
      if(ch===11){
        unlockAchievement("clear");
        unlockAchievement("reborn");
        (CHAPTER_PLANTS[12]||[]).forEach(discoverPlant);
        addLog("你没有复刻外婆的人生，而是为自己留下了一扇能从里面打开的门。");
        addLog("永恒铺面已经开放，猫店长把最后两盆植物推到了窗边。");
      }
    }
    safeSave();render();
    window.setTimeout(()=>$("#mainPanel")?.focus(),30);
  }

  function progressPercent(){
    const story=(Math.min(11,state.completed.length)/11)*78;
    const collect=(state.plants.length/PLANTS.length)*12+(state.achievements.length/ACHIEVEMENTS.length)*6+(state.eggs.length/EGGS.length)*4;
    return Math.min(100,Math.round(story+collect));
  }

  function chapterStep(ch){
    const d=getData(ch);
    if(ch===1)return (d.seq||[]).length;
    if(ch===2)return (d.order||[]).length;
    if(ch===4)return (d.seq||[]).length;
    if(ch===8)return (d.order||[]).length;
    if(ch===10)return (d.order||[]).length;
    if(ch===5)return Math.min(3,Math.floor((d.note||"").trim().length/4));
    return isCompleted(ch)?3:1;
  }

  function renderParticles(){
    const host=$("#warmParticles");if(!host||host.children.length)return;
    for(let i=0;i<16;i++){const p=document.createElement("i");p.className="particle";p.style.left=`${Math.random()*100}%`;p.style.animationDelay=`-${Math.random()*12}s`;p.style.opacity=String(.2+Math.random()*.45);host.appendChild(p)}
  }

  function renderScene(){
    const ch=state.viewChapter;
    $("#sceneStage").innerHTML=`<div class="scene-caption">${escapeHTML(CHAPTERS[ch-1].scene)}</div><img class="scene-cat-mini" src="cat_sprite.png" alt="猫店长在场景中巡视" data-scene-cat>`;
  }

  function choice(action,value,title,desc="",selected=false){
    return `<button class="choice-button ${selected?"selected":""}" data-action="${action}" data-value="${escapeHTML(value)}"><strong>${escapeHTML(title)}</strong>${desc?`<small>${escapeHTML(desc)}</small>`:""}</button>`;
  }
  function task(title,body){return `<section class="task-card"><h4 class="task-title"><b>✓</b>${title}</h4>${body}</section>`}
  function seqTrack(values,labels={}){return `<div class="sequence-track">${values.length?values.map(v=>`<span class="sequence-token">${escapeHTML(labels[v]||v)}</span>`).join(""):`<span class="empty">尚未选择</span>`}</div>`}
  function chapterHeader(text){return `<div class="chapter-intro"><div><h3>${escapeHTML(CHAPTERS[state.viewChapter-1].title)}</h3><p>${text}</p></div>${isCompleted(state.viewChapter)?'<span class="free-label">已完成，可回看</span>':''}</div>`}

  function renderCh1(){const d=getData(1),labels={crouch:"蹲下",snack:"放下小鱼干",wait:"安静等待"};return chapterHeader("外婆曾说，靠近一只害怕的猫，不是让它立刻相信你，而是先让它拥有拒绝你的余地。")+task("安排接近顺序",seqTrack(d.seq||[],labels)+`<div class="choices">${choice("ch1","crouch","蹲下保持距离","让视线低一些")}${choice("ch1","snack","把小鱼干伸到鼻尖","尽快建立关系")}${choice("ch1","wait","安静坐在门边","把选择权交给它")}</div><p class="task-help">选错不会扣除任何内容，猫店长只会退回花盆后重新观察。</p>`)}
  function renderCh2(){const d=getData(2);return chapterHeader("四张价格牌分别写着 28、12、36、20。外婆的习惯是从左到右由低到高。")+task("按价格从低到高点击",seqTrack(d.order||[])+`<div class="choices">${[28,12,36,20].map(n=>choice("ch2",n,`${n} 元`,"旧木牌")).join("")}</div>`)}
  function renderCh3(){const d=getData(3);return chapterHeader("首位客人住在北向公寓，窗台有明亮散射光，出差时偶尔会忘记浇水。")+task("推荐一盆植物",`<div class="choices">${choice("ch3","yulu","玉露","透明窗叶，喜明亮散射光",d.pick==="yulu")}${choice("ch3","taiyanghua","太阳花","更偏爱充足日照",d.pick==="taiyanghua")}${choice("ch3","bohe","薄荷","需要更稳定的水分",d.pick==="bohe")}</div>`)}
  function renderCh4(){const d=getData(4),labels={feed:"喂一点",groom:"轻轻梳毛",play:"逗猫棒"};return chapterHeader("午后最容易让照顾变成打扰。观察猫店长的尾巴和耳朵，再决定顺序。")+task("完成三步午间照顾",seqTrack(d.seq||[],labels)+`<div class="choices">${choice("ch4","play","先用逗猫棒叫醒它")}${choice("ch4","feed","先放下一小份猫粮")}${choice("ch4","groom","等它吃完后轻轻梳毛")}</div>`)}
  function renderCh5(){const d=getData(5);return chapterHeader("留言盒里有一张揉皱的纸：‘我好像什么都做不好。’你可以写自己的话，不存在固定句式。")+task("写一张真诚便签",`<textarea class="note-input" id="encourageNote" maxlength="120" placeholder="例如：今天已经很努力了，慢一点也没有关系。">${escapeHTML(d.note||"")}</textarea><div class="counter" id="noteCounter">${(d.note||"").trim().length} / 至少 12 字</div><button class="task-button" data-action="ch5-submit">把便签放进留言盒</button><p class="task-help">系统只检查长度和是否为明显重复字符，不评价你的表达方式。</p>`)}
  function renderCh6(){const d=getData(6);return chapterHeader("连续阴雨、通风一般、最近一周都见不到太阳。此时最重要的是避免积水。")+task("选择订单组合",`<div class="choices">${choice("ch6","rain-safe","排水孔陶盆＋暂缓浇水","附上通风提醒",d.pick==="rain-safe")}${choice("ch6","rain-water","无孔玻璃杯＋立即浇透","看起来更清澈",d.pick==="rain-water")}${choice("ch6","rain-mist","每天喷水三次","保持叶面湿润",d.pick==="rain-mist")}</div>`)}
  function renderCh7(){const d=getData(7);return chapterHeader("幼猫会攀爬、拉扯垂叶。安全方案应同时考虑摆放稳定、接触距离和清楚说明。")+task("设计宠物家庭方案",`<div class="choices">${choice("ch7","pet-safe","稳固高架＋收拢垂叶＋说明养护","先控制接触风险",d.pick==="pet-safe")}${choice("ch7","pet-low","全部放在地面","方便猫咪闻一闻",d.pick==="pet-low")}${choice("ch7","pet-secret","不告诉客人注意事项","避免增加顾虑",d.pick==="pet-secret")}</div>`)}
  function renderCh8(){const d=getData(8);return chapterHeader("线索写着：‘先听铃，再看柜台；花盆在围裙之后。’碎片编号对应：柜台 1、花盆 2、门铃 3、围裙 4。")+task("按线索点击钥匙碎片",seqTrack(d.order||[])+`<div class="choices">${[1,2,3,4].map(n=>choice("ch8",n,`碎片 ${n}`,({1:"柜台",2:"花盆",3:"门铃",4:"围裙"})[n])).join("")}</div>`)}
  function renderCh9(){const d=getData(9);return chapterHeader("旧养护卡写得很清楚：晨光两格，通风三格，浇水一格。真正的难点是你愿不愿意相信外婆留下的简单答案。")+task("设置花房控制台",`<div class="control-grid"><label>晨光<select id="lightControl"><option>1</option><option ${d.light==2?"selected":""}>2</option><option ${d.light==3?"selected":""}>3</option></select></label><label>通风<select id="airControl"><option>1</option><option>2</option><option ${d.air==3?"selected":""}>3</option></select></label><label>浇水<select id="waterControl"><option ${d.water==1?"selected":""}>1</option><option>2</option><option>3</option></select></label></div><button class="task-button" data-action="ch9-submit">启动花房</button>`)}
  function renderCh10(){const d=getData(10),labels={1998:"1998 · 外婆遇见阿花",2003:"2003 · 你离开老社区",2023:"2023 · 外婆关店",2026:"2026 · 今天重新开门"};return chapterHeader("四段记忆没有要求你回到过去，只要求你承认它们确实发生过。")+task("排列记忆时间线",seqTrack(d.order||[],labels)+`<div class="choices">${[2023,1998,2026,2003].map(y=>choice("ch10",y,labels[y])).join("")}</div>`)}
  function renderCh11(){const d=getData(11);return chapterHeader("这里没有唯一的‘治愈答案’。留下不等于勇敢，离开也不等于逃避；重要的是选择能够长期承担的生活。")+task("选择新的生活方式",`<div class="choices">${choice("ch11","stay","留在铺子","把它变成自己的日常",d.ending==="stay")}${choice("ch11","balance","半日营业","保留工作，也给窗台留出时间",d.ending==="balance")}${choice("ch11","entrust","交给社区共管","你继续远行，但不再切断联系",d.ending==="entrust")}</div>${d.ending?`<div class="ending-card"><h4>${endingTitle(d.ending)}</h4>${endingText(d.ending)}</div><button class="task-button" data-action="ch11-confirm">确认这个选择</button>`:`<p class="task-help">先选择一个方案，再决定是否确认。</p>`}`)}
  function renderCh12(){return chapterHeader(`${endingTitle(state.ending||"balance")}。${endingText(state.ending||"balance")}`)+task("自由营业",`<div class="free-shop">${choice("free","meteor","预览傍晚流星雨","任何时间都可以检查效果")}${choice("free","plant","随机点亮一盆图鉴","补全遗漏植物")}${choice("free","memory","回看结局便签","重新阅读你的选择")}${choice("free","quiet","和猫店长安静待三秒","也许会有彩蛋")}</div><p class="task-help">自由营业不会清除主线。重新开店需要在顶部点击“重新开店”并输入确认文字。</p>`)}

  function endingTitle(value){return ({stay:"结局：窗台常亮",balance:"结局：半日晴窗",entrust:"结局：会回来的路"})[value]||"结局：半日晴窗"}
  function endingText(value){return ({stay:"你把营业时间写在门口，也把休息日认真写了上去。猫店长负责巡店，你负责不再把自己用到耗尽。",balance:"你没有立刻辞掉一切，而是给生活留出半天。外婆的铺子不再是一份债，而是一处可以回来呼吸的地方。",entrust:"社区一起照看花房，你带着钥匙继续远行。每个月第一天，猫店长都会收到你寄来的新便签。"})[value]||""}

  function renderChapter(){return [renderCh1,renderCh2,renderCh3,renderCh4,renderCh5,renderCh6,renderCh7,renderCh8,renderCh9,renderCh10,renderCh11,renderCh12][state.viewChapter-1]()}

  function renderRoadmap(){
    $("#chapterRoadmap").innerHTML=CHAPTERS.map((ch,i)=>{const n=i+1,unlocked=n<=state.chapter;return `<button class="chapter-chip ${n===state.viewChapter?"current":""} ${isCompleted(n)?"done":""}" data-chapter="${n}" ${unlocked?"":"disabled"} title="${unlocked?"查看本章":"完成前一章后解锁"}">${n}. ${ch.title}</button>`}).join("");
  }

  function renderSide(){
    const affection=state.cat.affection;
    $("#affectionText").textContent=`亲近度 ${affection}`;
    $("#catStage").textContent=affection>=18?"松弛的胖店长，会主动把头送到手心":affection>=8?"会跟在脚边巡店的黏人小猫":"炸毛怕生，但会偷偷观察你";
    $("#progressText").textContent=`${progressPercent()}%`;$("#progressBar").style.width=`${progressPercent()}%`;
    $("#plantCount").textContent=`${state.plants.length} / ${PLANTS.length}`;$("#achievementCount").textContent=`${state.achievements.length} / ${ACHIEVEMENTS.length}`;$("#eggCount").textContent=`${state.eggs.length} / ${EGGS.length}`;
    $("#storyLog").innerHTML=state.logs.length?state.logs.slice().reverse().map(x=>`<p>${escapeHTML(x)}</p>`).join(""):'<p class="empty">完成任务后，外婆的便签会记录在这里。</p>';
    $("#inventory").innerHTML=state.inventory.length?state.inventory.map(x=>`<span>${escapeHTML(x)}</span>`).join(""):'<span class="empty">暂无线索</span>';
  }

  function applySettings(){
    document.documentElement.style.setProperty("--text-scale",String(state.settings.textScale||1));
    document.body.classList.toggle("reduce-motion",Boolean(state.settings.reducedMotion));
  }

  function render(){
    applySettings();renderParticles();
    $("#startScreen").classList.toggle("hidden",state.started);$("#gameScreen").classList.toggle("hidden",!state.started);
    $("#continueBtn").disabled=!hasSave();
    if(!state.started)return;
    const ch=state.viewChapter;$("#chapterTitle").textContent=CHAPTERS[ch-1].title;$("#chapterBadge").textContent=`第 ${ch} / ${TOTAL_CHAPTERS} 章`;
    $("#focusText").textContent=CHAPTERS[ch-1].focus;
    const step=Math.min(3,chapterStep(ch));$("#stepDots").innerHTML=[1,2,3].map(n=>`<i class="${n<=step?"done":""}"></i>`).join("");
    renderRoadmap();renderScene();$("#mainPanel").innerHTML=renderChapter();renderSide();
    if(state.lastSaved)updateSaveStatus(`已保存 · ${new Date(state.lastSaved).toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})}`);
    resetIdleBloom();
  }

  function hasSave(){try{return Boolean(localStorage.getItem(SAVE_KEY)||localStorage.getItem(LEGACY_SAVE_KEY))}catch(_){return false}}
  function startNewGame(){
    if(hasSave()){openConfirmNew();return}
    beginFresh();
  }
  function beginFresh(){state=freshState();state.started=true;state.logs=["你辞掉了长期透支自己的工作，回到外婆留下的多肉铺。","玻璃门没有锁，门后有一只左耳缺角的三花猫。"];
    state.plants=["jingye"];safeSave();render();unlockAchievement("open");safeSave();}
  function continueGame(){state=loadState();state.started=true;state.viewChapter=Math.min(state.viewChapter||state.chapter,state.chapter);safeSave();render()}

  function openModal(html){lastFocus=document.activeElement;$("#modalBody").innerHTML=html;$("#modal").classList.remove("hidden");window.setTimeout(()=>$("#modalClose")?.focus(),20)}
  function closeModal(){$("#modal").classList.add("hidden");$("#modalBody").innerHTML="";lastFocus?.focus?.()}

  function openConfirmNew(){openModal(`<h2 id="modalTitle">开始新游戏？</h2><p>检测到本地存档。开始新游戏会覆盖当前主进度，但系统会把覆盖前的内容保存在备份槽中。</p><div class="modal-actions"><button data-modal-action="new-confirm" class="primary">备份并开始</button><button data-modal-action="close">取消</button></div>`)}
  function openReset(){openModal(`<h2 id="modalTitle">重新开店</h2><p>这会清除当前进度。为避免误触，请输入 <strong>重新开店</strong>。</p><input id="resetPhrase" class="note-input" style="min-height:auto" autocomplete="off" placeholder="输入：重新开店"><div class="modal-actions"><button data-modal-action="reset-confirm" class="danger-soft">确认清除</button><button data-modal-action="close">取消</button></div>`)}

  function openHints(){
    const ch=state.viewChapter,viewed=hintsFor(ch);
    openModal(`<h2 id="modalTitle">第 ${ch} 章免费提示</h2><p><span class="free-label">完全免费</span> 提示不会消耗次数、不会要求付款，也不会锁定结局。建议逐级查看。</p><div class="hint-levels">${CHAPTERS[ch-1].hints.map((hint,i)=>`<section class="hint-level ${i===2?"spoiler":""}"><h3>${["方向提示","具体指引","接近答案"][i]}</h3>${viewed.includes(i)?`<p>${escapeHTML(hint)}</p>`:`<button class="task-button secondary" data-reveal-hint="${i}">显示本级提示</button>`}</section>`).join("")}</div>`)
  }

  function revealHint(level){
    const key=String(state.viewChapter);if(!state.hintsViewed[key])state.hintsViewed[key]=[];uniquePush(state.hintsViewed[key],level);if(level===2)unlockAchievement("hint3");safeSave();openHints();
  }

  function openSettings(){
    openModal(`<h2 id="modalTitle">设置与存档</h2><div class="settings-grid">
      <div class="setting-row"><div><label>游戏音效</label><small>仅播放轻提示音和猫咪反馈</small></div><button data-setting="sound">${state.settings.sound?"已开启":"已关闭"}</button></div>
      <div class="setting-row"><div><label>减少动态效果</label><small>关闭漂浮、呼吸和流星动画</small></div><button data-setting="motion">${state.settings.reducedMotion?"已开启":"已关闭"}</button></div>
      <div class="setting-row"><div><label for="textScale">文字大小</label><small>适用于整个游戏界面</small></div><select id="textScale"><option value="0.9" ${state.settings.textScale===.9?"selected":""}>较小</option><option value="1" ${state.settings.textScale===1?"selected":""}>标准</option><option value="1.12" ${state.settings.textScale===1.12?"selected":""}>较大</option></select></div>
      <div class="setting-row"><div><label>存档备份</label><small>导出为 JSON，可在其他浏览器导入</small></div><div><button data-modal-action="export">导出</button> <button data-modal-action="import">导入</button><input type="file" id="importFile" accept="application/json" hidden></div></div>
    </div><div class="modal-actions"><button data-modal-action="manual-save" class="primary">立即保存</button><button data-modal-action="close">完成</button></div>`)
  }

  function openCollection(tab="plants"){
    const tabs=`<div class="collection-tabs"><button class="${tab==="plants"?"active":""}" data-collection-tab="plants">植物 ${state.plants.length}/${PLANTS.length}</button><button class="${tab==="ach"?"active":""}" data-collection-tab="ach">成就 ${state.achievements.length}/${ACHIEVEMENTS.length}</button><button class="${tab==="eggs"?"active":""}" data-collection-tab="eggs">彩蛋 ${state.eggs.length}/${EGGS.length}</button></div>`;
    let grid="";
    if(tab==="plants")grid=PLANTS.map(p=>`<article class="collection-item ${state.plants.includes(p.id)?"":"locked"}"><img src="${p.sprite}" alt=""><strong>${state.plants.includes(p.id)?p.name:"尚未发现"}</strong><small>${state.plants.includes(p.id)?p.desc:"继续营业后会自然解锁"}</small></article>`).join("");
    if(tab==="ach")grid=ACHIEVEMENTS.map(a=>`<article class="collection-item ${state.achievements.includes(a.id)?"":"locked"}"><strong>${state.achievements.includes(a.id)?a.name:"未解锁成就"}</strong><small>${state.achievements.includes(a.id)?"已经写进营业记录":"尝试照顾猫、独立解谜或收集图鉴"}</small></article>`).join("");
    if(tab==="eggs")grid=EGGS.map(e=>`<article class="collection-item ${state.eggs.includes(e.id)?"":"locked"}"><strong>${state.eggs.includes(e.id)?e.name:"隐藏彩蛋"}</strong><small>${state.eggs.includes(e.id)?"你发现了窗台的小秘密":"点击场景、照顾猫或在自由营业中探索"}</small></article>`).join("");
    openModal(`<h2 id="modalTitle">营业收藏册</h2>${tabs}<div class="collection-grid">${grid}</div>`)
  }

  function exportSave(){
    safeSave();const blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=`猫店长存档_${new Date().toISOString().slice(0,10)}.json`;a.click();URL.revokeObjectURL(url);toast("存档文件已导出");
  }

  function importSave(file){
    if(!file)return;const reader=new FileReader();reader.onload=()=>{try{const imported=parseSave(String(reader.result));if(!imported)throw new Error("空文件");state=imported;state.started=true;safeSave();closeModal();render();toast("存档导入成功")}catch(error){console.error(error);toast("无法导入：文件不是有效存档")}};reader.readAsText(file);
  }

  function wrong(resetFn,message){resetFn();beep("bad");toast(message);safeSave();render()}
  function actionSequence(data,key,value,correct,done){
    const arr=data[key]||(data[key]=[]);const expected=correct[arr.length];
    if(String(value)!==String(expected)){wrong(()=>data[key]=[],"顺序不对，已恢复到本题起点。你可以查看免费提示。");return}
    arr.push(typeof expected==="number"?expected:String(expected));state.stats.actions++;beep();safeSave();
    if(arr.length===correct.length){done();return}render();
  }

  function handleAction(action,value){
    const d=getData();
    if(action==="ch1")return actionSequence(d,"seq",value,["crouch","snack","wait"],()=>{addItem("猫爪形旧门牌");completeChapter(1)});
    if(action==="ch2")return actionSequence(d,"order",Number(value),[12,20,28,36],()=>{addItem("外婆的价格铅笔");completeChapter(2)});
    if(action==="ch3"){d.pick=value;if(value!=="yulu"){beep("bad");toast("客人的光照和浇水习惯与这盆不太匹配，再看看条件。");safeSave();render();return}addItem("第一张新订单");completeChapter(3);return}
    if(action==="ch4")return actionSequence(d,"seq",value,["feed","groom","play"],()=>{state.cat.affection+=3;completeChapter(4)});
    if(action==="ch5-submit"){
      const text=(d.note||"").trim();const chars=[...text.replace(/\s/g,"")];const unique=new Set(chars);
      if(chars.length<12){beep("bad");toast("再多写一点吧，至少需要 12 个字。请写你真正想说的话。");return}
      if(unique.size<4){beep("bad");toast("这张便签像是重复字符，请换成一句完整的话。");return}
      addItem("被认真折好的鼓励便签");completeChapter(5);return;
    }
    if(action==="ch6"){d.pick=value;if(value!=="rain-safe"){beep("bad");toast("连续阴雨时，这个方案会增加积水风险。再试一次。");safeSave();render();return}completeChapter(6);return}
    if(action==="ch7"){d.pick=value;if(value!=="pet-safe"){beep("bad");toast("幼猫仍然能直接接触或拉扯植物，方案还不够稳妥。");safeSave();render();return}completeChapter(7);return}
    if(action==="ch8")return actionSequence(d,"order",Number(value),[3,1,4,2],()=>{addItem("拼合的花房钥匙");unlockEgg("bell");completeChapter(8)});
    if(action==="ch9-submit"){
      d.light=Number($("#lightControl")?.value);d.air=Number($("#airControl")?.value);d.water=Number($("#waterControl")?.value);
      if(d.light!==2||d.air!==3||d.water!==1){beep("bad");toast("控制台没有启动。请重新核对旧养护卡的三个数字。");safeSave();render();return}
      addItem("重新亮起的花房灯");completeChapter(9);return;
    }
    if(action==="ch10")return actionSequence(d,"order",Number(value),[1998,2003,2023,2026],()=>{addItem("完整的旧相册");unlockEgg("radio");completeChapter(10)});
    if(action==="ch11"){d.ending=value;safeSave();render();return}
    if(action==="ch11-confirm"){if(!d.ending){toast("请先选择一种生活方式");return}state.ending=d.ending;completeChapter(11);return}
    if(action==="free"){
      if(value==="meteor"){spawnMeteors(true);unlockEgg("meteor");unlockAchievement("meteor")}
      if(value==="plant"){const locked=PLANTS.filter(p=>!state.plants.includes(p.id));if(locked.length)discoverPlant(locked[Math.floor(Math.random()*locked.length)].id);else toast("植物图鉴已经全部点亮")}
      if(value==="memory")openModal(`<h2 id="modalTitle">${endingTitle(state.ending)}</h2><p style="line-height:1.9">${endingText(state.ending)}</p><p>外婆便签：店不是用来困住谁的。门能从里面打开，才算真正的家。</p>`)
      if(value==="quiet"){toast("你和猫店长一起安静下来……");window.clearTimeout(idleTimer);idleTimer=window.setTimeout(()=>{unlockEgg("idleBloom");toast("三秒后，窗台上的花同时晃了晃。")},3000)}
      safeSave();renderSide();return;
    }
  }

  function handleCare(type){
    if(!["pet","feed","groom","play"].includes(type))return;
    state.cat[type]+=1;state.cat.affection+=1;beep();burstPaws();
    if(type==="pet"&&state.cat.pet>=10){unlockAchievement("pet10");unlockEgg("pawprints")}
    if(type==="feed"&&state.cat.feed>=3)unlockAchievement("feeder");
    if(type==="groom"&&state.cat.groom>=3)unlockAchievement("groomer");
    if(type==="play"&&state.cat.play>=3)unlockAchievement("player");
    if(state.cat.affection>=8)unlockAchievement("catfriend");
    if(state.cat.feed>=2&&state.cat.play>=2)unlockEgg("catnip");
    safeSave();renderSide();
  }

  function burstPaws(){
    const rect=$("#catButton")?.getBoundingClientRect();const x=rect?rect.left+rect.width/2:innerWidth/2,y=rect?rect.top+rect.height/2:innerHeight/2;
    for(let i=0;i<5;i++){const p=document.createElement("span");p.className="paw-burst";p.textContent="🐾";p.style.left=`${x}px`;p.style.top=`${y}px`;p.style.setProperty("--x",`${-55+Math.random()*110}px`);p.style.setProperty("--y",`${-50-Math.random()*80}px`);document.body.appendChild(p);setTimeout(()=>p.remove(),950)}
  }

  function spawnMeteors(force=false){
    if(state.settings.reducedMotion)return;
    const hour=new Date().getHours();if(!force&&(hour<17||hour>=20))return;
    const host=$("#meteorLayer");for(let i=0;i<9;i++)setTimeout(()=>{const m=document.createElement("i");m.className="meteor";m.style.left=`${45+Math.random()*60}%`;m.style.top=`${Math.random()*45}%`;host.appendChild(m);setTimeout(()=>m.remove(),1900)},i*160);
  }

  function resetIdleBloom(){window.clearTimeout(idleTimer);if(state.viewChapter===12)idleTimer=window.setTimeout(()=>{unlockEgg("idleBloom");safeSave();renderSide()},12000)}

  function bindEvents(){
    $("#startBtn").addEventListener("click",startNewGame);$("#continueBtn").addEventListener("click",continueGame);
    $("#settingsBtnStart").addEventListener("click",openSettings);$("#settingsBtn").addEventListener("click",openSettings);
    $("#supportBtnStart").addEventListener("click",()=>window.Paywall?.show());$("#supportBtn").addEventListener("click",()=>window.Paywall?.show());
    $("#manualSaveBtn").addEventListener("click",()=>safeSave(true));$("#hintBtn").addEventListener("click",openHints);$("#resetBtn").addEventListener("click",openReset);$("#collectionBtn").addEventListener("click",()=>openCollection());
    $("#modalClose").addEventListener("click",closeModal);$("#modal").addEventListener("click",e=>{if(e.target.id==="modal")closeModal()});
    $("#chapterRoadmap").addEventListener("click",e=>{const b=e.target.closest("[data-chapter]");if(!b||b.disabled)return;state.viewChapter=Number(b.dataset.chapter);safeSave();render();$("#mainPanel")?.focus()});
    $("#mainPanel").addEventListener("click",e=>{const b=e.target.closest("[data-action]");if(b)handleAction(b.dataset.action,b.dataset.value)});
    $("#mainPanel").addEventListener("input",e=>{if(e.target.id==="encourageNote"){const d=getData(5);d.note=e.target.value;$("#noteCounter").textContent=`${d.note.trim().length} / 至少 12 字`;safeSave()}});
    $("#catButton").addEventListener("click",()=>handleCare("pet"));
    $(".cat-actions").addEventListener("click",e=>{const b=e.target.closest("[data-care]");if(b)handleCare(b.dataset.care)});
    $("#sceneStage").addEventListener("click",e=>{if(e.target.closest("[data-scene-cat]")){state.cat.ear++;beep();burstPaws();if(state.cat.ear>=3)unlockEgg("leftEar");safeSave();renderSide()}});
    $("#modalBody").addEventListener("click",e=>{
      const hint=e.target.closest("[data-reveal-hint]");if(hint)return revealHint(Number(hint.dataset.revealHint));
      const tab=e.target.closest("[data-collection-tab]");if(tab)return openCollection(tab.dataset.collectionTab);
      const setting=e.target.closest("[data-setting]");if(setting){if(setting.dataset.setting==="sound")state.settings.sound=!state.settings.sound;if(setting.dataset.setting==="motion")state.settings.reducedMotion=!state.settings.reducedMotion;safeSave();openSettings();return}
      const action=e.target.closest("[data-modal-action]")?.dataset.modalAction;
      if(action==="close")closeModal();
      if(action==="new-confirm"){try{const old=localStorage.getItem(SAVE_KEY);if(old)localStorage.setItem(BACKUP_KEY,old)}catch(_){}closeModal();beginFresh()}
      if(action==="reset-confirm"){if($("#resetPhrase")?.value.trim()!=="重新开店"){toast("确认文字不正确，存档未清除");return}try{localStorage.removeItem(SAVE_KEY)}catch(_){}state=freshState();closeModal();render();toast("当前进度已清除，备份槽仍保留最近一次存档")}
      if(action==="manual-save")safeSave(true);
      if(action==="export")exportSave();
      if(action==="import")$("#importFile")?.click();
    });
    $("#modalBody").addEventListener("change",e=>{if(e.target.id==="textScale"){state.settings.textScale=Number(e.target.value);safeSave();applySettings()}if(e.target.id==="importFile")importSave(e.target.files?.[0])});
    document.addEventListener("keydown",e=>{if(e.key==="Escape"){if(!$("#modal").classList.contains("hidden"))closeModal()}if(e.ctrlKey&&e.key.toLowerCase()==="s"){e.preventDefault();safeSave(true)}});
    window.addEventListener("catshop:supported",()=>{unlockAchievement("support");safeSave();toast("谢谢你。支持状态只用于显示感谢，不解锁任何内容。")});
    window.addEventListener("beforeunload",()=>safeSave(false));
  }

  function boot(){
    bindEvents();render();applySettings();spawnMeteors(false);
    if(new Date().getHours()>=17&&new Date().getHours()<20){unlockAchievement("meteor");unlockEgg("meteor");safeSave()}
    window.setInterval(()=>{if(state.started)safeSave(false)},45000);
  }

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot);else boot();
})();
