'use strict';

/*
 * 2026-08-16 调查结算补丁
 * - 正常模式责任链闭合后立即给出100分制结算；终稿伦理选择不改变分数。
 * - 独立复核3/3完成后给出S/A/B/C评级；仅复核错误次数影响评级。
 * - 成绩写入META_KEY，开始独立复核或重置案件后仍可回看。
 * - 兼容旧存档：能从既有证据、解谜、补录、提示记录与review状态补算成绩。
 */
(() => {
  const PATCH_REVISION='2026-08-16-score-settlement';
  const originalRender=render;
  const originalRenderFinale=renderFinale;
  const originalBindScene=bindScene;
  const originalRefreshBoot=refreshBoot;
  const originalCheckFinal=checkFinal;
  const originalCheckReview=checkReview;
  const originalEnding=ending;
  const originalContinueGame=continueGame;
  const originalStart=start;
  const originalMigrateState=typeof migrateState==='function'?migrateState:null;

  function repairReviewQueue(n){
    if(!n||!n.expert||n.solved?.review)return n;
    const variants=Object.keys(REVIEW_VARIANTS);
    const unique=[...new Set((Array.isArray(n.reviewQueue)?n.reviewQueue:[]).filter(x=>REVIEW_VARIANTS[x]))];
    if(unique.length<3){
      const refill=seededShuffle(variants,n.shuffleSeed+73).filter(x=>!unique.includes(x));
      while(unique.length<3&&refill.length)unique.push(refill.shift());
    }
    n.reviewQueue=unique.slice(0,3);
    n.reviewIndex=Math.min(n.reviewQueue.length,Math.max(0,Number(n.reviewIndex)||0));
    return n;
  }
  function clamp(n,min,max){return Math.max(min,Math.min(max,Number(n)||0))}
  function hintLevels(s){
    return Object.values((s&&s.hintHistory)||{}).reduce((sum,v)=>sum+clamp(v,0,3),0);
  }
  function normalGrade(score){
    if(score>=99)return 'S';
    if(score>=96)return 'A';
    if(score>=92)return 'B';
    return 'C';
  }
  function reviewGrade(wrong){
    if(wrong<=0)return 'S';
    if(wrong===1)return 'A';
    if(wrong===2)return 'B';
    return 'C';
  }
  function calculateNormal(s=state){
    const evidenceCount=new Set(Array.isArray(s.evidence)?s.evidence:[]).size;
    const evidence=Math.round(30*clamp(evidenceCount,0,18)/18);
    const logic=(s.solved?.anomaly?8:0)+(s.solved?.route?7:0)+(s.solved?.photoAudit?7:0)+(s.solved?.timeline?8:0);
    const interviewCount=Object.values(s.interviews||{}).filter(Boolean).length;
    const interviews=clamp(interviewCount,0,4)*5;
    const responsibility=s.solved?.final?10:0;
    const usedHints=hintLevels(s);
    const independence=10-Math.min(4,Math.floor(usedHints/5));
    const score=clamp(evidence+logic+interviews+responsibility+independence,0,100);
    return {
      score,
      grade:normalGrade(score),
      hintLevels:usedHints,
      evidenceCount,
      interviewCount,
      breakdown:{
        evidence:{label:'材料核验',value:evidence,max:30},
        logic:{label:'推理闭环',value:logic,max:30},
        interviews:{label:'补充采访',value:interviews,max:20},
        responsibility:{label:'责任链',value:responsibility,max:10},
        independence:{label:'调查独立性',value:independence,max:10}
      }
    };
  }
  function ensureMetrics(){
    if(!state.scoreMetrics||typeof state.scoreMetrics!=='object')state.scoreMetrics={};
    if(!Number.isFinite(Number(state.scoreMetrics.reviewWrong)))state.scoreMetrics.reviewWrong=0;
    state.scoreMetrics.reviewWrong=Math.max(0,Number(state.scoreMetrics.reviewWrong)||0);
    return state.scoreMetrics;
  }
  function scoreArchive(){
    const meta=getMeta();
    if(!meta.scoreArchive||typeof meta.scoreArchive!=='object')meta.scoreArchive={};
    return {meta,archive:meta.scoreArchive};
  }
  function persistNormal(endingType=state.ending||null){
    if(state.expert||!state.solved?.final)return null;
    const result=calculateNormal(state);
    const {meta,archive}=scoreArchive();
    const prev=archive.normal||{};
    archive.normal={...result,endedAs:endingType||prev.endedAs||null,updatedAt:new Date().toISOString()};
    setMeta(meta);
    return archive.normal;
  }
  function persistReview(legacy=false){
    if(!state.expert||!state.solved?.review)return null;
    const metrics=ensureMetrics();
    const wrong=legacy&&state.scoreMetrics?.reviewWrong==null?0:Math.max(0,Number(metrics.reviewWrong)||0);
    const {meta,archive}=scoreArchive();
    archive.review={grade:reviewGrade(wrong),wrong,completed:true,legacy:!!legacy,updatedAt:new Date().toISOString()};
    setMeta(meta);
    return archive.review;
  }
  function hydrateLegacyScore(){
    const {meta,archive}=scoreArchive();
    let changed=false;
    if(!archive.normal&&!state.expert&&state.solved?.final){
      const result=calculateNormal(state);
      archive.normal={...result,endedAs:state.ending||null,updatedAt:new Date().toISOString(),legacy:true};
      changed=true;
    }
    if(!archive.review&&state.expert&&state.solved?.review){
      const hasMetric=!!(state.scoreMetrics&&Number.isFinite(Number(state.scoreMetrics.reviewWrong)));
      const wrong=hasMetric?Math.max(0,Number(state.scoreMetrics.reviewWrong)||0):0;
      archive.review={grade:reviewGrade(wrong),wrong,completed:true,legacy:!hasMetric,updatedAt:new Date().toISOString()};
      changed=true;
    }
    if(changed)setMeta(meta);
    return archive;
  }
  function normalSummaryCard(result){
    if(!result)return '';
    return `<section class="score-summary"><div class="score-summary-head"><div><div class="score-kicker">调查结算 · 已归档</div><div class="score-title">本轮调查总评</div></div><div class="score-badge"><strong>${result.score}</strong><span>${result.grade} 级</span></div></div><p>责任链已经闭合，成绩已自动生成。三种终稿是记者伦理选择，<strong>不会改变调查得分</strong>。</p><button class="action-btn score-open-btn" data-score-open="1">查看详细成绩</button></section>`;
  }
  function reviewSummaryCard(result){
    if(!result)return '';
    const detail=result.legacy?'旧存档未记录复核错误次数，按完整通过补录评级。':result.wrong===0?'三项随机复核均一次通过。':`本轮复核共有 ${result.wrong} 次越过证据边界的选择，修正后全部通过。`;
    return `<section class="score-summary"><div class="score-summary-head"><div><div class="score-kicker">独立复核 · 3/3</div><div class="score-title">证据边界评级</div></div><div class="score-badge"><strong>${result.grade}</strong><span>复核评级</span></div></div><p>${detail}</p><button class="action-btn score-open-btn" data-score-open="1">查看调查成绩</button></section>`;
  }
  function breakdownRows(result){
    return Object.values(result.breakdown||{}).map(x=>{
      const pct=Math.round(100*x.value/x.max);
      return `<div class="score-row"><span>${x.label}</span><div class="score-bar"><i style="width:${pct}%"></i></div><span class="score-value">${x.value}/${x.max}</span></div>`;
    }).join('');
  }
  function showScoreArchive(prefer='all'){
    const archive=hydrateLegacyScore();
    const normal=archive.normal||null;
    const review=archive.review||null;
    if(!normal&&!review){
      openModal('<div class="doc-head"><h3>调查成绩</h3><div class="doc-meta">尚未形成结算</div></div><div class="doc-body"><div class="score-archive-empty">正常调查需要先闭合终稿责任链；独立复核需要完成三项随机交叉验证。完成时系统会自动弹出成绩，不需要另找结算按钮。</div></div>');
      return;
    }
    let body='<div class="score-sheet">';
    if(normal){
      body+=`<div class="score-hero"><div><div class="score-kicker">正常调查 · 100分制</div><h3>调查总评 ${normal.score} / 100</h3><p>${normal.grade==='S'?'证据、推理与责任链均保持了很高完整度。':normal.grade==='A'?'调查链条完整，少量提示不会影响案件结论。':normal.grade==='B'?'核心调查已经成立，仍有部分环节可在重玩时独立完成。':'案件可以结案，但材料或推理环节仍有明显补全空间。'}</p></div><div class="score-seal"><div><strong>${normal.score}</strong><br><span>调查总分</span><br><em>${normal.grade} 级</em></div></div></div><div class="score-breakdown">${breakdownRows(normal)}</div><p class="score-rule-note">计分只评价材料核验、推理闭环、补充采访、责任链与调查独立性。提示只轻微影响“调查独立性”；《号外》《第二版》《压稿》属于伦理选择，不参与高低分判定。</p>`;
    }
    if(review){
      const detail=review.legacy?'旧存档没有保存错误次数，因此按“完整通过”补记。':review.wrong===0?'三项随机证据边界复核全部一次通过。':`完成全部三项复核；过程中有 ${review.wrong} 次选择经重新核验后修正。`;
      body+=`<div class="review-result"><div class="review-result-head"><div><strong>独立复核</strong><div class="footer-note">随机复核 3/3 已归档</div></div><div class="review-grade">${review.grade}</div></div><p>${detail}</p></div>`;
    }else if(prefer==='review'){
      body+='<div class="review-result"><strong>独立复核尚未完成</strong><p>通过责任链后还需完成三项随机证据边界复核；第3项通过时会自动生成评级。</p></div>';
    }
    body+='</div>';
    openModal(`<div class="doc-head"><h3>调查成绩</h3><div class="doc-meta">正常调查与独立复核分别结算</div></div><div class="doc-body">${body}</div>`);
  }
  function refreshScoreButtons(){
    const archive=hydrateLegacyScore();
    const hasAny=!!(archive.normal||archive.review||(!state.expert&&state.solved?.final)||(state.expert&&state.solved?.review));
    const bootBtn=document.querySelector('#scoreArchiveBtn');
    const gameBtn=document.querySelector('#scoreBtn');
    if(bootBtn)bootBtn.classList.toggle('hidden',!hasAny);
    if(gameBtn)gameBtn.classList.toggle('hidden',!hasAny);
  }
  function bindScoreOpeners(){
    document.querySelectorAll('[data-score-open]').forEach(btn=>btn.onclick=()=>showScoreArchive());
  }
  function attachScoreButtons(){
    const bootBtn=document.querySelector('#scoreArchiveBtn');
    const gameBtn=document.querySelector('#scoreBtn');
    if(bootBtn)bootBtn.onclick=()=>showScoreArchive();
    if(gameBtn)gameBtn.onclick=()=>showScoreArchive();
    refreshScoreButtons();
  }

  if(originalMigrateState){
    migrateState=function(v){return repairReviewQueue(originalMigrateState(v))};
  }
  renderFinale=function(){
    const base=originalRenderFinale();
    if(!state.solved?.final)return base;
    if(state.expert){
      if(!state.solved.review)return base;
      const archive=hydrateLegacyScore();
      return reviewSummaryCard(archive.review)+base;
    }
    const result=persistNormal(state.ending||null)||calculateNormal(state);
    return normalSummaryCard(result)+base;
  };
  bindScene=function(){
    originalBindScene();
    bindScoreOpeners();
  };
  render=function(){
    const out=originalRender();
    refreshScoreButtons();
    return out;
  };
  refreshBoot=function(){
    const out=originalRefreshBoot();
    refreshScoreButtons();
    return out;
  };
  checkFinal=function(){
    const before=!!state.solved?.final;
    const out=originalCheckFinal();
    if(!before&&state.solved?.final&&!state.expert){
      persistNormal();
      refreshScoreButtons();
      showScoreArchive('normal');
    }
    return out;
  };
  checkReview=function(ok){
    ensureMetrics();
    const beforeDone=!!state.solved?.review;
    if(!ok&&!beforeDone){state.scoreMetrics.reviewWrong+=1;save()}
    const out=originalCheckReview(ok);
    if(!beforeDone&&state.solved?.review){
      persistReview(false);
      refreshScoreButtons();
      showScoreArchive('review');
    }
    return out;
  };
  ending=function(type){
    if(!state.expert&&state.solved?.final)persistNormal(type);
    return originalEnding(type);
  };
  continueGame=function(){
    const out=originalContinueGame();
    hydrateLegacyScore();
    refreshScoreButtons();
    return out;
  };
  start=function(expert=false){
    const out=originalStart(expert);
    ensureMetrics();
    refreshScoreButtons();
    return out;
  };

  window.__SHENJIANG_SCORE_PATCH__={
    revision:PATCH_REVISION,
    calculateNormal,
    reviewGrade,
    repairReviewQueue,
    showScoreArchive,
    test(){
      const full={
        evidence:Array.from({length:18},(_,i)=>`E${String(i+1).padStart(2,'0')}`),
        interviews:{gu:true,li:true,su:true,fang:true},
        solved:{anomaly:true,route:true,photoAudit:true,timeline:true,final:true},
        hintHistory:{}
      };
      const heavy={...full,hintHistory:{a:3,b:3,c:3,d:3,e:3,f:3,g:3}};
      const a=calculateNormal(full),b=calculateNormal(heavy);
      const repaired=repairReviewQueue({expert:true,solved:{review:false},reviewQueue:['phone','window'],reviewIndex:2,shuffleSeed:9});
      const ok=a.score===100&&a.grade==='S'&&b.score<100&&b.score>=96&&reviewGrade(0)==='S'&&reviewGrade(1)==='A'&&reviewGrade(2)==='B'&&reviewGrade(3)==='C'&&repaired.reviewQueue.length===3&&new Set(repaired.reviewQueue).size===3&&repaired.reviewIndex===2;
      return {ok,full:a,heavy:b,review:[0,1,2,3].map(reviewGrade),repairedQueue:repaired.reviewQueue};
    }
  };

  attachScoreButtons();
})();
