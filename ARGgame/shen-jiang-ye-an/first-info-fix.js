'use strict';

/*
 * 第一处信息/异常题体验修复：
 * 1) 把 E01 / E03 的关键时间直接并列，降低“我到底要回答什么”的理解成本；
 * 2) 加入三项关系判断，不再强迫玩家命中自由文本关键词；
 * 3) 保留自由输入，并扩大自然语言接受范围；
 * 4) 不改变后续剧情、存档键、证据、阶段与结局逻辑。
 */
(() => {
  const PATCH_REVISION='2026-08-15-first-info-tolerance';
  const originalRenderPuzzle=renderPuzzle;
  const originalBindScene=bindScene;

  function normalizeAnswer(v){
    return String(v||'')
      .toLowerCase()
      .replace(/[\s，。！？、；;,.!?:："“”'‘’（）()【】\[\]—-]/g,'');
  }

  function hasAny(s,parts){return parts.some(x=>s.includes(x))}

  function clearlyReversed(s){
    const newsActor='(?:报馆|报纸|终校|短讯|角栏)';
    const policeActor='(?:巡捕|巡查|警方|警察)';
    return new RegExp(`${policeActor}比${newsActor}.*(?:更?早|先|快)`).test(s)
      || new RegExp(`${policeActor}.*(?:更?早|早于|先于|先到).*${newsActor}`).test(s)
      || new RegExp(`${newsActor}.*(?:更?晚|晚于|后于|之后才).*${policeActor}`).test(s)
      || /00?57.*(?:早于|先于|之前).*00?32/.test(s);
  }

  function flexibleAnomalyAnswer(v){
    const s=normalizeAnswer(v);
    if(!s||s.length<4||clearlyReversed(s))return false;

    const newsTerms=['报馆','报纸','终校','短讯','角栏','死讯','自尽','死亡消息','死亡信息'];
    const policeTerms=['巡捕','巡查','警方','警察','到场','抵达','来顾宅','到顾宅'];
    const orderTerms=['早','先','提前','之前','还没','尚未','已经','就','才','晚','后','更快','快于','早于','先于'];
    const mentionsNews=hasAny(s,newsTerms);
    const mentionsPolice=hasAny(s,policeTerms);
    const mentionsOrder=hasAny(s,orderTerms);
    const has0032=/0?0?32/.test(s);
    const has0057=/0?0?57/.test(s);

    // “00:32已经写自尽，00:57巡捕才到”一类直接时间对照。
    if(has0032&&has0057&&(mentionsNews||mentionsPolice||mentionsOrder))return true;

    // “报馆/死讯 比 巡捕到场更早”及大量同义表达。
    if(mentionsNews&&mentionsPolice&&mentionsOrder)return true;

    // “警察还没来，报纸已经写死了”这种先提警方、后提报馆的口语表达。
    if(/(?:巡捕|警方|警察).*(?:还没|尚未|未).*(?:到|来).*(?:报馆|报纸|终校|短讯|死讯|自尽).*(?:已经|就)/.test(s))return true;

    // “报馆00:32已经形成自尽记录，00:57才到场”。
    if(mentionsNews&&has0032&&has0057)return true;

    return false;
  }

  // 覆盖原先过窄的三组关键词判定；后续 checkAnomaly 仍调用同名函数。
  isAnomalyAnswer=flexibleAnomalyAnswer;

  renderPuzzle=function(scene){
    if(state.stage===1&&!state.expert&&!state.solved.anomaly&&(scene==='newsroom'||scene==='study')&&has('E01')&&has('E03')){
      const pick=state.anomalyPick||'';
      return `<section class="puzzle anomaly-guide"><h4>夹报核验 · 第一处异常</h4><p>先别猜凶手，也不用写“标准答案”。这里只比较两份已经取得的纸面记录：<strong>哪一条发生在前？</strong></p><div class="anomaly-source-grid"><div class="anomaly-source"><div class="source-id">E01 · 申江晚报终校样</div><strong>00:32</strong><p>角栏已经写入“顾文洲自尽”。</p></div><div class="anomaly-source"><div class="source-id">E03 · 巡捕到场簿</div><strong>00:57</strong><p>巡捕记录首次抵达顾宅。</p></div></div><p class="anomaly-question">仅根据这两份记录，哪一句可以直接成立？</p><div class="anomaly-choices"><button class="anomaly-choice ${pick==='news-first'?'selected':''}" data-anomaly-choice="news-first">报馆的“自尽”记录早于巡捕到场记录</button><button class="anomaly-choice ${pick==='police-first'?'selected':''}" data-anomaly-choice="police-first">巡捕先到顾宅，报馆随后才写入“自尽”</button><button class="anomaly-choice ${pick==='unknown'?'selected':''}" data-anomaly-choice="unknown">两份记录没有明确时刻，无法比较先后</button></div><div class="anomaly-or">或用自己的话写</div><p class="anomaly-free-note">例如“警察还没来，报纸就已经写了死讯”这样的自然说法也可以，不要求固定措辞。</p><div class="answer-row anomaly-answer-row"><input id="anomalyInput" class="answer-input" autocomplete="off" placeholder="可选：写下你的核验结论……"><button class="action-btn" data-action="check-anomaly">写入便笺</button></div></section>`;
    }
    return originalRenderPuzzle(scene);
  };

  function chooseAnomaly(value){
    if(!['news-first','police-first','unknown'].includes(value))return;
    state.anomalyPick=value;
    const input=document.querySelector('#anomalyInput');
    if(input){
      input.value=value==='news-first'?'00:32报馆已经写入“自尽”，早于00:57巡捕第一次到场。':value==='police-first'?'巡捕先到顾宅，报馆随后才写入自尽。':'两份记录没有明确时刻，无法比较先后。';
    }
    save();
    document.querySelectorAll('[data-anomaly-choice]').forEach(btn=>btn.classList.toggle('selected',btn.dataset.anomalyChoice===value));
  }

  bindScene=function(){
    originalBindScene();
    document.querySelectorAll('[data-anomaly-choice]').forEach(btn=>{
      btn.onclick=()=>chooseAnomaly(btn.dataset.anomalyChoice);
    });
    const input=document.querySelector('#anomalyInput');
    if(input){
      input.addEventListener('input',()=>{if(state.anomalyPick){state.anomalyPick='';document.querySelectorAll('[data-anomaly-choice]').forEach(btn=>btn.classList.remove('selected'));}});
      input.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();handleAction('check-anomaly')}});
    }
  };

  checkAnomaly=function(){
    const v=document.querySelector('#anomalyInput')?.value||'';
    const selected=state.anomalyPick||'';
    if(selected==='police-first'){
      return openModal('<div class="doc-head"><h3>再核一下两个时刻</h3></div><div class="doc-body"><p>E01 是 <strong>00:32</strong>，E03 是 <strong>00:57</strong>。这里先不判断谁可信，只比较纸面记录的先后。</p><p class="footer-note">你可以关闭后重新点选；答错不会丢失材料或扣除进度。</p></div>');
    }
    if(selected==='unknown'){
      return openModal('<div class="doc-head"><h3>两份记录其实可以比较</h3></div><div class="doc-body"><p>E01 与 E03 都留下了同一夜的明确分钟数：<strong>00:32</strong> 与 <strong>00:57</strong>。只需要判断哪一个更早。</p><p class="footer-note">这里不要求推断死亡时间，也不要求猜人物。</p></div>');
    }
    if(selected!=='news-first'&&!isAnomalyAnswer(v)){
      if(state.expert){
        return openModal('<div class="doc-head"><h3>便笺还不能成立</h3></div><div class="doc-body"><p>独立复核仍要求你自己写出两份记录的明确先后关系。只写“时间不对”或人物猜测都不能归档。</p></div>');
      }
      return openModal('<div class="doc-head"><h3>把两张纸放在一起看</h3></div><div class="doc-body"><p>这题只需要比较 <strong>E01 的00:32</strong> 和 <strong>E03 的00:57</strong>。关闭后可以直接点选三条关系中的一条，也可以继续用自己的话写。</p><p class="footer-note">不用写“标准答案”，像“警察还没来，报纸已经写了死讯”也能够识别。</p></div>');
    }
    state.solved.anomaly=true;
    state.anomalyPick='news-first';
    state.stage=2;
    addFact('00:32报馆已排出“自尽”，早于巡捕00:57第一次到场。');
    save();
    render();
    playFilm(FILMS.stage2);
  };

  // 轻量自检，供控制台/自动化回归调用，不影响正常游玩。
  window.__SHENJIANG_FIRST_INFO_PATCH__={
    revision:PATCH_REVISION,
    test(){
      const yes=[
        '报馆比巡捕更早形成了自尽记录',
        '警察还没来，报纸就已经写了死讯',
        '00:32已经写自尽，00:57巡捕才到',
        '死亡消息在警方到场之前就上了终校',
        '报纸的消息比警察到顾宅更快'
      ];
      const no=['时间不对','巡捕比报馆更早','我觉得方正礼有问题','00:57早于00:32'];
      return {ok:yes.every(isAnomalyAnswer)&&no.every(x=>!isAnomalyAnswer(x)),yes:yes.map(x=>[x,isAnomalyAnswer(x)]),no:no.map(x=>[x,isAnomalyAnswer(x)])};
    }
  };
})();
