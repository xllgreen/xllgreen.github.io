'use strict';
/*
 * 2026-08-16 剧情/流程严谨性加固
 * - 明确 10 月 16 日深夜 → 17 日凌晨的跨午夜时间线。
 * - 修正“底片相似人物 = 方正礼本人”的提前定性。
 * - 细化顾曼青初始伤害与方正礼 23:41 后延误救助的责任边界。
 * - 将 E18 改为当夜医官“初步复核”，避免凌晨前出现过度确定的正式法医结论。
 * - 终稿前强制补看 E02 付印签条，避免没见过签条却在结局中直接引用 00:32 签付印。
 * - 去除“最佳结局”标签；独立复核通关后不再重复提示“独立复核已解锁”。
 * - 收紧第一处异常自由文本判定，防止只写两个时间但主体颠倒也被误判通过。
 */
(() => {
  const PATCH_REVISION='2026-08-16-story-hardening';

  // ---------- 叙事资料修订：只补证据边界，不改变谜题答案 ----------
  if(typeof FILMS!=='undefined'&&FILMS.intro?.[0]){
    FILMS.intro[0].k='1936年10月16日深夜—17日凌晨 · 雨夜';
    FILMS.intro[0].t='十六日深夜，夜班编辑室仍亮着灯。跨过午夜以后，十七日晨版的终校还没有锁死。校样、签条和临时送来的短讯混在同一张桌上。';
  }
  if(typeof FILMS!=='undefined'&&FILMS.intro?.[1]){
    FILMS.intro[1].k='10月16日夜 · 霞飞路顾宅';
  }
  if(typeof EVIDENCE!=='undefined'){
    Object.assign(EVIDENCE.E05,{
      title:'许医生当夜出诊笺',
      summary:'许成章医生离开顾宅前留下的伤情与送院建议。',
      facsimile:'许成章医师出诊笺\n23:05离宅\n后脑受创，意识混乱，仍能回应。建议送院观察，不宜独处。\n病人当时拒绝送院。',
      body:'出诊笺记有23:05离宅，并写明顾文洲当时仍能回应；许医生建议送院观察、不宜独处，同时记下“病人当时拒绝送院”。这份记录只能证明当时仍存在观察与求医必要，不能单独判断之后何时死亡。'
    });
    Object.assign(EVIDENCE.E06,{
      summary:'报馆附近公用电话亭的一条市话计次记录。',
      facsimile:'市话外线计次\n10月17日 00:27　霞飞路公用电话亭 → 申江晚报',
      body:'计次簿登记10月17日00:27有一通市话由报馆附近的霞飞路公用电话亭拨向《申江晚报》。栏位只有线路与时刻，没有拨号人姓名；电话亭到报馆步行只需数分钟，因此00:31返岗在时间上并不冲突。'
    });
    Object.assign(EVIDENCE.E08,{
      facsimile:'底片 12-A\n10月16日 22:24\n背景：第二场演出牌 / 后台挂钟',
      body:'底片编号12-A。背景同时拍到第二场演出牌与后台挂钟，时刻约为10月16日22:24；苏婉站在后台更衣镜旁。照片只能固定她在这一时刻的位置。'
    });
    Object.assign(EVIDENCE.E09,{
      facsimile:'底片 19-C\n10月16日 23:41\n门厅敞门一瞬：深色马甲 / 细领带 / 右手公文夹',
      body:'底片编号19-C。街拍时恰逢顾宅门厅开门，门厅时钟指向10月16日23:41；画面中的男子穿深色马甲、细领带，右手夹公文夹。面部不够清楚，因此这张底片只能证明“出现一名衣着体态与方正礼相近的男子”，不能单独把人定死。'
    });
    Object.assign(EVIDENCE.E10,{
      facsimile:'唐慎照相馆冲洗簿\n10月16日 23:58　收 19-C 卷　即洗',
      body:'顾宅附近的唐慎照相馆冲洗簿登记10月16日23:58收19-C卷并立即冲洗，卷号与门厅底片边缘编号一致。它用于确认19-C在当夜已经进入冲洗流程，不负责确认画面人物身份。'
    });
    Object.assign(EVIDENCE.E11,{
      title:'书桌废纸碎片',
      summary:'废纸篓里几张带编辑式短句、但没有署名的纸片。',
      facsimile:'……照旧。可付。\n末段不必改……',
      body:'纸片保留“照旧”“可付”“末段不必改”等短句，与编辑工作用语相近；没有完整署名，也没有足够连续的笔迹。它可以作为追问线索，却不能直接证明桌面遗书由谁书写。'
    });
    Object.assign(EVIDENCE.E12,{
      facsimile:'补充口供 · 顾曼青\n“我推了他。他撞到桌角。医生来时，他还会应我。\n医生劝他去医院，他不肯，还叫我出去。我最后还是离开了。”',
      body:'顾曼青承认争执中推搡哥哥，顾文洲后脑撞到桌角；她确认许医生离开时顾文洲仍能回应，也承认在医生建议送院、顾文洲本人拒绝后，她最终离开了顾宅。她对最初伤害负直接责任，离开病人同样是需要写进复盘的失当，但这与23:41以后有人见其状况恶化仍主动不求救、转而整理现场，是两个不同阶段的行为。'
    });
    Object.assign(EVIDENCE.E14,{
      facsimile:'补充口供 · 苏婉\n“顾先生让我把信给方编辑。信封写着华康洋行往来账。\n他说，若第二天他不露面，就请报馆公开。”',
      body:'苏婉写明10月16日21:40前已与顾文洲分开，并代他把一封交给方正礼的材料送到报馆；她记得信封写有“华康洋行往来账”，顾文洲交代若第二天自己不露面就请报馆公开。苏婉不知道材料真伪，也不知道信中具体账目，因此这份补录只负责证明“材料存在、被转交以及公开意图”。'
    });
    Object.assign(EVIDENCE.E15,{
      facsimile:'第二份口供 · 方正礼\n10月16日23:41后入顾宅；见顾文洲呼吸异常、仍有气息，未呼救；整理桌面与遗书。\n10月17日00:27公用电话亭致电报馆；00:31返编辑部；00:32签付印。',
      body:'方正礼承认10月16日23:41后进入顾宅；他看到顾文洲呼吸异常、仍有气息，却没有叫医生或巡捕，而是整理桌面与遗书。之后他于10月17日00:27从公用电话亭致电报馆，00:31返编辑部，00:32签付印。身份与行为最终以这份本人补录闭合，而不是由23:41底片单独完成身份鉴定。'
    });
    Object.assign(EVIDENCE.E17,{
      facsimile:'夜班出入簿\n10月16日 23:26　方正礼 出\n10月17日 00:31　方正礼 入\n旁注：雨大，方袖口尽湿。罗敬安',
      body:'离岗簿记录方正礼10月16日23:26签出、10月17日00:31重新签入；旁注写“雨大，方袖口尽湿。罗敬安”。它只能证明离岗窗口，不能单独证明这段时间去了顾宅。'
    });
    Object.assign(EVIDENCE.E18,{
      title:'巡捕房医官初步复核笺',
      summary:'巡捕到场后，医官结合当夜伤情与许医生出诊笺写下的初步意见。',
      facsimile:'巡捕房医官 · 初步复核\n后脑撞击后的表现与进行性颅内出血相符。\n23:05仍有反应，不能视为当场死亡。\n若23:41仍有气息，当时立即求医仍存在救治可能。\n——初步意见，待正式检验',
      body:'这是巡捕到场后的当夜初步医事意见，不是已经完成的正式尸检报告。医官结合许医生23:05的记录与现场情况认为：伤情表现与进行性颅内出血相符，不能把最初撞击直接等同于当场死亡；若23:41仍有气息，当时立即求医仍存在救治可能。它支持“后续不求救具有独立意义”，但不把医学可能性写成百分之百可救。'
    });
  }

  if(typeof PEOPLE!=='undefined'&&PEOPLE.gu){
    PEOPLE.gu.moment='她补录后没有立刻离开，只把一张旧电影票压在桌上。那是兄妹少年时第一次自己买票看的电影。她说：“我恨过他很久，也确实在医生走后离开了。我不想拿他的脾气替自己开脱——可我更没想到，后来有人看见他还活着，会选择什么都不做。”';
  }

  // 同步提示与独立复核中的旧称呼，避免同一材料一会儿叫“法医复核”、一会儿叫“医官初步复核”。
  if(typeof HINT_LIBRARY!=='undefined'){
    const replacements=[
      ['法医复核','医官初步复核'],
      ['法医意见','医官初步意见']
    ];
    Object.values(HINT_LIBRARY).forEach(entry=>{
      if(!entry?.levels)return;
      entry.levels=entry.levels.map(text=>replacements.reduce((v,[a,b])=>v.replaceAll(a,b),text));
    });
  }
  if(typeof REVIEW_VARIANTS!=='undefined'&&REVIEW_VARIANTS.window){
    REVIEW_VARIANTS.window.question='哪组材料共同支持“最初撞击并非当场死亡，23:41以后仍不求救具有独立意义”？';
    REVIEW_VARIANTS.window.options=REVIEW_VARIANTS.window.options.map(([label,text,flag])=>[label,text.replace('法医复核','医官初步复核'),flag]);
  }

  // ---------- 第一处异常：收紧自由文本边界 ----------
  function normalize(v){
    return String(v||'').toLowerCase().replace(/[\s，。！？、；;,.!?:："“”'‘’（）()【】\[\]—-]/g,'');
  }
  function hasAny(s,arr){return arr.some(x=>s.includes(x));}
  function hardenedAnomalyAnswer(v){
    const s=normalize(v);
    if(!s||s.length<5)return false;
    const news='(?:报馆|报纸|终校|短讯|角栏|死讯|自尽|死亡消息|死亡信息)';
    const police='(?:巡捕|巡查|警方|警察)';
    const newsRe=new RegExp(news),policeRe=new RegExp(police);
    const mentionsNews=newsRe.test(s),mentionsPolice=policeRe.test(s);
    if(!mentionsNews||!mentionsPolice)return false;

    // 明确写反的一律拒绝。
    const reversed=[
      new RegExp(`${police}.*(?:比)?${news}.*(?:更?早|先|快)`),
      new RegExp(`${police}.*(?:早于|先于).*${news}`),
      new RegExp(`${news}.*(?:晚于|后于|更晚).*${police}`),
      /00?57.*(?:早于|先于|之前).*00?32/,
      new RegExp(`00?32.*${police}.*00?57.*${news}`),
      new RegExp(`${police}.*00?32.*${news}.*00?57`)
    ];
    if(reversed.some(r=>r.test(s)))return false;

    const correct=[
      // “报馆比巡捕更早”“报纸消息比警察更快”。
      new RegExp(`${news}.*(?:比)?${police}.*(?:更?早|先|快)`),
      // “报馆早于巡捕”。
      new RegExp(`${news}.*(?:早于|先于|提前于).*${police}`),
      // “死亡消息在警方到场之前已经上终校”。
      new RegExp(`${news}.*${police}.*(?:之前|以前).*?(?:已经|就|先)?`),
      // “警察还没来，报纸已经写了死讯”。
      new RegExp(`${police}.*(?:还没|尚未|未).*?(?:到|来|抵达).*${news}.*(?:已经|就)`),
      // 明确分钟数并绑定对应主体。
      new RegExp(`${news}.*00?32.*${police}.*00?57`),
      new RegExp(`00?32.*${news}.*00?57.*${police}`),
      new RegExp(`${news}.*00?32.*00?57.*${police}`)
    ];
    return correct.some(r=>r.test(s));
  }
  if(typeof isAnomalyAnswer==='function')isAnomalyAnswer=hardenedAnomalyAnswer;

  // ---------- 时间线：明确跨午夜 ----------
  if(typeof renderTimelinePuzzle==='function'){
    renderTimelinePuzzle=function(){
      const items={
        su:'10月16日 22:24 · 舞厅后台合照中的苏婉',
        doctor:'10月16日 23:05 · 许医生离开顾宅',
        fang:'10月16日 23:41 · 顾宅门厅底片中的男子',
        phone:'10月17日 00:27 · 公用电话亭外线拨向报馆',
        police:'10月17日 00:57 · 巡捕第一次抵达顾宅'
      };
      return `<section class="puzzle story-hardened-timeline"><h4>排片时间线 · 跨过午夜</h4><p>这五条记录从<strong>10月16日深夜</strong>跨到<strong>10月17日凌晨</strong>。具体分钟数都在原件里；按实际先后依次点击，不要把00点后的记录误排到22点之前。</p><div class="midnight-divider-note">十六日深夜 → 午夜 → 十七日凌晨</div><div class="timeline-board"><div class="timeline-pool">${Object.entries(items).map(([id,t])=>`<button class="timeline-choice ${state.timelinePick.includes(id)?'used':''}" data-time="${id}" ${state.timelinePick.includes(id)?'disabled':''}>${t}</button>`).join('')}</div><div class="timeline-result"><strong>记者手写顺序</strong><ol>${state.timelinePick.map(id=>`<li>${items[id]}</li>`).join('')}</ol></div></div><div class="answer-row"><button class="action-btn" data-action="check-timeline">核对时间线</button><button class="action-btn" data-action="undo-time">撤回一步</button><button class="action-btn" data-action="reset-time">全部重排</button></div></section>`;
    };
  }

  // ---------- 采访：不在补录前把 E09 的相似人物直接写成方正礼 ----------
  if(typeof startInterview==='function'){
    startInterview=function(id){
      if(!canInterview(id))return;
      let q={
        gu:[['family','“你和哥哥是不是一直关系很差？”'],['doctor','“许医生23:05离开时写他仍能回应，也建议送院。你离开前发生了什么？”'],['money','“你欠了哥哥多少钱？”']],
        li:[['voice','“你是不是百分之百确定来电就是方正礼？”'],['boundary','“E06与E07只证明线路。请把你亲耳听到的部分和你不能确定的部分分开说。”'],['fear','“方正礼是不是威胁过你？”']],
        su:[['rumor','“大家都说你是最后见到顾文洲的人，对吗？”'],['photo','“E08把你固定在22:24后台。你21:40前与顾文洲分开后，还替他做过什么？”'],['romance','“你和顾文洲究竟是什么关系？”']],
        fang:[['motive','“500元收条是不是说明你一定杀了他？”'],['path','“23:41门厅底片里的人衣着体态与你相近；E17又显示你23:26至00:31离岗。再结合00:27外线，请你把这段时间的去向逐段说明。”'],['note','“废纸上有编辑式短句，所以桌面遗书一定是你写的？”']]
      }[id];
      if(state.expert)q=seededShuffle(q,state.shuffleSeed+id.charCodeAt(0));
      openModal(`<div class="doc-head"><h3>${PEOPLE[id].name} · 补充采访</h3><div class="doc-meta">不要诱导人物承认记者已经假定的结论。</div></div><div class="doc-body"><p class="interview-voice">${PEOPLE[id].voice}</p><p>选择一条真正由现有材料支撑、同时尊重证据边界的问题。</p><div class="question-list">${q.map(([v,t])=>`<button class="question-btn" data-interview-choice="${id}|${v}">${t}</button>`).join('')}</div></div>`);
      bindModalActions();
    };
  }

  // ---------- 终稿前完整性：E02 必须真正翻过 ----------
  if(typeof renderInterviewAdvance==='function'){
    renderInterviewAdvance=function(){
      const all=Object.values(state.interviews).every(Boolean);
      if(!all)return '';
      if(!has('E18')){
        return '<section class="puzzle final-gate-warning"><h4>补录已齐，医事复核尚缺</h4><p>四份补录已经归档，但<strong>E18 · 巡捕房医官初步复核笺</strong>还没有展开。责任链需要区分“最初伤害”和“23:41后仍不求救”，不能跳过这份伤情边界材料。</p><p class="footer-note">回到“顾宅”，展开E18后再回补充采访席。</p></section>';
      }
      if(!has('E02')){
        return '<section class="puzzle final-gate-warning"><h4>终稿前还缺一张签条</h4><p>四份补录已经归档，但你还没有真正翻阅<strong>E02 · 付印签条</strong>。终稿会引用“00:32是谁签字付印”，不能让结论跑在原件前面。</p><p class="footer-note">回到“报馆”，展开E02后再回补充采访席。</p></section>';
      }
      return '<section class="puzzle"><h4>补录归档</h4><p>四份补录、E02付印签条与当夜医官初步复核均已归档。案件袋已经具备进入终稿的最低完整性。</p><button class="action-btn" data-action="to-finale">进入终稿</button></section>';
    };
  }

  // 旧存档兼容：旧版本允许漏看 E02 后直接进入终稿；不回退其结局，只给出补档提醒。
  if(typeof renderFinale==='function'){
    const originalRenderFinaleHardening=renderFinale;
    renderFinale=function(){
      const base=originalRenderFinaleHardening();
      if(state.solved?.final&&!has('E02')){
        return '<section class="puzzle final-gate-warning"><h4>旧档案补核 · E02尚未展开</h4><p>这份旧存档已经闭合责任链，但当时版本允许跳过<strong>E02 · 付印签条</strong>。你已取得的结局不会被回退；建议回“报馆”展开E02，使“00:32签付印”的报道事实与玩家实际看过的原件一致。</p></section>'+base;
      }
      return base;
    };
  }

  // ---------- 责任链用语：限定“后续阶段”的主要责任 ----------
  if(typeof finalItem==='function'){
    const originalFinalItem=finalItem;
    finalItem=function(id,label){
      const wording={
        injury:'最初伤害',
        rescue:'23:41后延误救助（主要责任）',
        staging:'整理并伪装“自尽”现场',
        tip:'00:27提前送讯'
      }[id]||label;
      return originalFinalItem(id,wording);
    };
  }

  // ---------- 结局：伦理选择不再用“最佳”预设答案；复核模式给正确完成反馈 ----------
  if(typeof ending==='function'){
    ending=function(type){
      const data={
        sensational:{title:'结局 · 号外',text:'你把所有姓名与私人关系一起推上头版。巡捕房迅速重查，报纸销量暴涨；但苏婉和顾曼青的生活也被永久钉在最耸动的叙事里。你公开了已经核实的事实，也把一些与责任无关的东西一起卖掉了。'},
        best:{title:'结局 · 第二版',text:'你写清顾曼青造成最初伤害，并注明她在医嘱后离开的失当；同时把方正礼23:41后见顾文洲仍有气息却不求救、整理现场、00:27从公用电话亭送讯、00:31返岗、00:32签付印的后续链条逐段写清。与责任无关的私生活被删去，报馆自身的核验失守也留在版面上。'},
        suppress:{title:'结局 · 压稿',text:'你先把完整材料交给巡捕房，报纸只留“案件重新调查中”。程序得到最大尊重，但公众暂时看不到一条在官方到场之前就被写成“自尽”的死讯怎样差点替代事实。几周后，内部整改开始，却没有头版记住它。'}
      }[type];
      if(!data)return;
      state.ending=type;state.completedOnce=true;save();
      const meta=getMeta();meta.expertUnlocked=true;meta.endings=[...new Set([...(meta.endings||[]),type])];setMeta(meta);refreshBoot();
      const modeCopy=state.expert
        ?'<p><strong>独立复核已完成。</strong>本轮三项随机交叉验证已经归档；你仍可用其他终稿观察不同的记者伦理后果。</p>'
        :'<p><strong>独立复核已解锁。</strong>复核模式会隐藏程序提示、打乱同场景材料和采访选项，并在终局从多类证据边界题中随机抽取三项交叉验证。</p>';
      playFilm([...FILMS.ending],()=>openModal(`<div class="ending"><div class="edition">申江晚报 · ${type==='best'?'第二版':type==='sensational'?'号外':'暂缓稿'}</div><h3>${data.title}</h3><p>${data.text}</p>${modeCopy}<p>报道档案：${new Set(meta.endings).size}/3。</p></div>`));
    };
  }

  // ---------- 页面说明：统一跨午夜口径 ----------
  if(typeof objective==='function'){
    const originalObjective=objective;
    objective=function(){
      const base=originalObjective();
      if(state.stage===2&&state.solved?.route&&state.solved?.photoAudit&&!state.solved?.timeline){
        return '电话线路与暗房验片均已归档。把10月16日深夜到17日凌晨的五个锚点按跨午夜顺序排好。';
      }
      if(state.stage===4&&state.solved?.final&&!has('E02')){
        return '旧存档责任链已保留，但E02付印签条尚未实际展开；建议回报馆补核，补齐00:32签付印的原件依据。';
      }
      if(state.stage===3&&Object.values(state.interviews||{}).every(Boolean)&&!has('E18')){
        return '四份补录已齐；先回顾宅展开E18医官初步复核，明确最初伤害与后续不求救的医学边界。';
      }
      if(state.stage===3&&Object.values(state.interviews||{}).every(Boolean)&&has('E18')&&!has('E02')){
        return '补录与医事复核已齐，但终稿会引用00:32付印签字；先回报馆真正翻阅E02付印签条。';
      }
      return base;
    };
  }

  window.__SHENJIANG_STORY_HARDENING__={
    revision:PATCH_REVISION,
    test(){
      const anomalyCases={
        yes:['报馆的自尽记录早于巡捕到场','警察还没到，报纸就已经写了死讯','报馆00:32已经写入自尽，巡捕00:57才到'],
        no:['时间不对','巡捕先于报馆','00:57早于00:32','00:32巡捕到场，00:57报馆写自尽']
      };
      const anomalyOk=anomalyCases.yes.every(isAnomalyAnswer)&&anomalyCases.no.every(x=>!isAnomalyAnswer(x));
      const evidenceOk=EVIDENCE.E09.body.includes('不能单独')&&EVIDENCE.E18.title.includes('初步')&&EVIDENCE.E17.body.includes('10月16日23:26')&&EVIDENCE.E17.body.includes('10月17日00:31');
      return {ok:anomalyOk&&evidenceOk,anomalyOk,evidenceOk,revision:PATCH_REVISION};
    }
  };
})();
