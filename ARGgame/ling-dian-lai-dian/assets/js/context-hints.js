(()=>{
'use strict';

const D=window.ZERO_DATA;
if(!D)return;

const SAVE_KEY='zero-call-save-v2';
const LEGACY_SAVE='zero-call-save-v1';
const HINT_KEY='zero-call-context-hints-v1';
const APP_NAMES={
  home:'档案桌面',archive:'硬盘目录',search:'临江搜索',radio:'FM93.7官网',forum:'临江生活论坛',
  phone:'电信维护镜像',news:'新闻历史库',tower:'旧塔设备系统',oa:'内部OA镜像',lab:'检验副本',mail:'调查请求箱',
  'panel-notes':'调查笔记','panel-bookmarks':'收藏','panel-people':'人物','panel-timeline':'时间线','panel-final':'结案','panel-home':'档案桌面'
};
const SIDE_NAMES=Object.fromEntries((D.sideInvestigations||[]).map(x=>[x.id,x.person||x.title||x.id]));
const PUZZLE_BY_ID=Object.fromEntries((D.puzzles||[]).map(x=>[x.id,x]));

function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
function loadGame(){
  for(const key of [SAVE_KEY,LEGACY_SAVE]){
    try{const x=JSON.parse(localStorage.getItem(key)||'null');if(x&&Array.isArray(x.solved))return x;}catch(e){}
  }
  return {stage:0,solved:[],viewed:[],completedSides:[],hints:{},activeApp:'home',discoveredApps:['archive','search','radio'],audioMarker:null,audioReviewDone:false};
}
function loadHintState(){
  try{
    const x=JSON.parse(localStorage.getItem(HINT_KEY)||'null');
    if(x&&typeof x==='object'){
      if(!x.levels||typeof x.levels!=='object')x.levels={};
      if(!x.history||typeof x.history!=='object')x.history={};
      return x;
    }
  }catch(e){}
  return {levels:{},history:{}};
}
function saveHintState(x){try{localStorage.setItem(HINT_KEY,JSON.stringify(x));}catch(e){}}
function hintId(p){return p?.id||'final';}
function hintHistoryKey(p,page){return `${hintId(p)}@@${page||'home'}`;}
function unlockedLevel(p){
  const hs=loadHintState(),S=loadGame(),id=hintId(p);
  return Math.max(Number(hs.levels?.[id]||0),Number(S.hints?.[id]||0));
}
function storeHintHistory(p,page,level,view){
  const hs=loadHintState(),key=hintHistoryKey(p,page);
  if(!hs.history[key]||typeof hs.history[key]!=='object')hs.history[key]={};
  hs.history[key][String(level)]={
    puzzleId:hintId(p),puzzleTitle:p?.title||'终局卷宗',page:page||'home',pageTitle:APP_NAMES[page]||'档案桌面',
    level:Number(level),text:String(view?.text||''),prereq:!!view?.prereq,at:Date.now()
  };
  saveHintState(hs);
}
function getHintHistory(p,page,level){
  const hs=loadHintState(),key=hintHistoryKey(p,page);
  return hs.history?.[key]?.[String(level)]||null;
}
function mirrorHintLevelToGame(p,level){
  const id=hintId(p),target=Math.max(0,Math.min(3,Number(level)||0));
  if(!target)return;
  for(const key of [SAVE_KEY,LEGACY_SAVE]){
    try{
      const raw=localStorage.getItem(key);if(!raw)continue;
      const x=JSON.parse(raw);if(!x||!Array.isArray(x.solved))continue;
      if(!x.hints||typeof x.hints!=='object')x.hints={};
      if(Number(x.hints[id]||0)>=target)continue;
      x.hints[id]=target;localStorage.setItem(key,JSON.stringify(x));
    }catch(e){}
  }
}
function mirrorExistingHintLevels(){
  const hs=loadHintState();Object.entries(hs.levels||{}).forEach(([id,level])=>mirrorHintLevelToGame({id},level));
}
function activePage(S){
  const a=String(S.activeApp||'home');
  if(APP_NAMES[a])return a;
  const site=document.querySelector('#game')?.dataset.site;
  return APP_NAMES[site]?site:'home';
}
function currentPuzzle(S){
  return (D.puzzles||[]).find(p=>!S.solved.includes(p.id)&&Number(p.stage||0)<=Number(S.stage||0)) ||
         (D.puzzles||[]).find(p=>!S.solved.includes(p.id)) || null;
}
function leadsFor(p){return (D.leads?.[p.id]||[]);}
function pageMatchesPuzzle(page,p){
  if(!p)return false;
  if(page==='home'||page==='panel-home')return true;
  if(page==='panel-notes'||page==='panel-bookmarks')return false;
  if(page==='panel-final')return false;
  if(page==='panel-timeline')return ['timeline','timelinePerson','causalText'].includes(p.type)||['p13','p14'].includes(p.id);
  if(page==='panel-people')return leadsFor(p).some(x=>x.app==='people')||(p.evidenceChoices||[]).some(x=>x.requiresSide);
  if(leadsFor(p).some(x=>x.app===page))return true;
  return (p.evidenceChoices||[]).some(x=>x.requiresView===page);
}
function pagePuzzle(S,page){
  const available=(D.puzzles||[]).filter(p=>!S.solved.includes(p.id)&&Number(p.stage||0)<=Number(S.stage||0));
  if(page==='panel-final')return currentPuzzle(S);
  const found=available.find(p=>pageMatchesPuzzle(page,p));
  return found||currentPuzzle(S);
}
function appLabel(id){
  const lead=Object.values(D.leads||{}).flat().find(x=>x.app===id);
  return lead?.label||APP_NAMES[id]||id;
}
function chooseNeedSet(p,S){
  const choices=p.evidenceChoices||[];
  if(Array.isArray(p.need)&&p.need.length)return p.need;
  if(Array.isArray(p.needAny)&&p.needAny.length){
    const score=set=>set.reduce((n,id)=>{
      const o=choices.find(x=>x.id===id);return n+(o&&optionMissing(o,S).length?1:0);
    },0);
    return [...p.needAny].sort((a,b)=>score(a)-score(b))[0]||[];
  }
  return choices.map(x=>x.id);
}
function optionMissing(o,S){
  const out=[];
  if(o?.requiresView&&!S.viewed?.includes(o.requiresView))out.push({kind:'view',id:o.requiresView,label:appLabel(o.requiresView)});
  if(o?.requiresSide&&!S.completedSides?.includes(o.requiresSide))out.push({kind:'side',id:o.requiresSide,label:SIDE_NAMES[o.requiresSide]||o.requiresSide});
  if(o?.requiresSolved&&!S.solved?.includes(o.requiresSolved))out.push({kind:'solved',id:o.requiresSolved,label:PUZZLE_BY_ID[o.requiresSolved]?.title||o.requiresSolved});
  return out;
}
function missingPrereqs(p,S){
  const out=[];
  const wanted=new Set(chooseNeedSet(p,S));
  (p.evidenceChoices||[]).filter(o=>wanted.has(o.id)).forEach(o=>optionMissing(o,S).forEach(x=>out.push(x)));
  if(p.requiresAudioMarker&&(S.audioMarker===null||S.audioMarker===undefined||S.audioMarker===''))out.push({kind:'audioMarker',label:'双轨录音比对台的波形记号'});
  if(p.requiresAudioReview&&!S.audioReviewDone)out.push({kind:'audioReview',label:'波形 / 转录 / 来源复核'});
  const seen=new Set();return out.filter(x=>{const k=x.kind+':'+(x.id||x.label);if(seen.has(k))return false;seen.add(k);return true;});
}
function prerequisiteText(miss,level){
  if(!miss.length)return '';
  if(level===1)return '这一步目前不是“想不到答案”，而是还有前置材料没有完成。先补齐前置，再回到这道推理，会比继续猜更有效。';
  const labels=miss.map(x=>{
    if(x.kind==='view')return `阅读「${x.label}」`;
    if(x.kind==='side')return `完成「${x.label}」的人物双来源核验`;
    if(x.kind==='solved')return `先闭合推理「${x.label}」`;
    if(x.kind==='audioMarker')return '先在硬盘目录的双轨录音比对台留下一个结构差异记号';
    if(x.kind==='audioReview')return '先在硬盘目录完成一次“波形 / 转录 / 来源”复核';
    return x.label;
  });
  if(level===2)return `当前缺少：${labels.join('；')}。这些条件没有满足前，后面的选项即使看起来合理也不会形成完整证据链。`;
  const exact=miss.map(x=>{
    if(x.kind==='view')return `从「旧链接」进入「${x.label}」，真正打开并读过对应材料`;
    if(x.kind==='side')return `进入「调查请求箱」，找到${x.label}，选择两份相互独立的材料并写清其隐瞒原因`;
    if(x.kind==='solved')return `先回推理桌完成「${x.label}」`;
    if(x.kind==='audioMarker')return '进入「硬盘目录」→ 双轨录音比对台，把游标停在两份录音第一次出现结构差异的位置并点击“在这里做记号”';
    if(x.kind==='audioReview')return '进入「硬盘目录」→ 双轨录音比对台，点击“播放剪辑断点恢复片段”，完成一次复核记录';
    return x.label;
  });
  return `具体前置路径：${exact.join('；')}。完成后再回来提交这道推理。`;
}
function pageIntro(page,p,isRelevant,level){
  const name=APP_NAMES[page]||'当前页面';
  if(page==='panel-notes'){
    return level===1?'调查笔记只负责把已经确认的事实集中起来。先找有没有一条“已经确认、但还没有被当前推理使用”的记录。':
      level===2?`当前未闭合的是「${p?.title||'主线事实'}」。从笔记里先找与它同一时间、同一地点或同一人物的记录，再回到原始来源核对。`:
      `笔记不是新证据来源。若你已经能复述「${p?.title||'当前推理'}」需要的两端事实，就回到对应旧网页或推理桌提交，不需要在笔记页继续翻。`;
  }
  if(page==='panel-bookmarks'){
    return level===1?'收藏页不会生成新的主线证据，它只是帮助你找回之前认为重要的句子。':
      level===2?`当前未闭合的是「${p?.title||'主线事实'}」。优先回看与这道题相关的收藏，不必为了通关把全部城市彩蛋找齐。`:
      '如果收藏里没有直接相关材料，就回到“旧链接”或推理桌；彩蛋与普通城市记忆不是主线前置条件。';
  }
  if(page==='panel-final')return '';
  if(isRelevant){
    const lead=leadsFor(p).find(x=>x.app===page);
    if(level===1)return `你现在在「${name}」。这页确实和「${p.title}」有关，先只找能回答“${lead?.why||'这条材料究竟证明什么'}”的内容，不要同时追所有支线。`;
    if(level===2)return `当前页的作用：${lead?.why||'补齐这道推理的一端证据。'} 先把这条来源与另一份独立来源对照，再决定结论。`;
  }
  if(!isRelevant){
    if(level===1)return `你现在在「${name}」，但这里暂时不是「${p?.title||'当前主线'}」最直接的证据页。可以阅读，但不要因为页面内容多就默认答案一定藏在这里。`;
    if(level===2){const leads=leadsFor(p);return leads.length?`「${p.title}」更值得回到：${leads.map(x=>`「${x.label}」`).join(' / ')}。`:'这一步更适合回到档案桌面，从当前未解推理本身重新拆条件。';}
  }
  return '';
}
function finalPageHint(S,level){
  const remaining=(D.puzzles||[]).filter(p=>!S.solved.includes(p.id));
  if(remaining.length){
    const p=currentPuzzle(S);
    if(level===1)return `终局卷宗还没开放：仍有 ${remaining.length} 个核心推理未闭合。现在不需要提前猜凶手，先把「${p?.title||'当前主线'}」做完。`;
    if(level===2)return `当前最靠前的缺口是「${p?.title||'主线推理'}」。结案页不会绕过前置条件；回推理桌或它对应的来源页继续调查。`;
    const leads=p?leadsFor(p):[];return leads.length?`先去 ${leads.map(x=>`「${x.label}」`).join(' / ')}，补齐「${p.title}」后再回来。`:'先完成剩余核心推理，再进入结案报告。';
  }
  if(level===1)return '终局不是“选凶手”。先用40—220字把江岚为何到旧塔、47秒为何消失、谁最终实施致死行为连成一段，再逐项引用证据。';
  if(level===2)return '报告每一项都同时检查“文字事实”和“引用材料”。如果一句话正确但证据勾错，仍然不会通过；先写结论，再只勾真正能直接支撑它的材料。';
  return '案件摘要需要明确包含江岚、47秒（或四十七秒）和陆沉三组关键信息；九项事实链则按各自问题分别引用对应材料。';
}
function computeHintView(p,page,level,S){
  if(page==='panel-final')return {text:finalPageHint(S,level),prereq:false};
  const miss=missingPrereqs(p,S),relevant=pageMatchesPuzzle(page,p);
  let text='';
  if(miss.length)text=prerequisiteText(miss,level);
  else{
    const intro=pageIntro(page,p,relevant,level);
    if(level===1)text=intro||p.hints?.[0]||'先拆清题目真正要求证明的事实。';
    if(level===2)text=[intro,p.hints?.[Math.min(1,(p.hints?.length||1)-1)]].filter(Boolean).join(' ');
    if(level===3){
      const leads=leadsFor(p),leadText=leads.length?`相关来源：${leads.map(x=>`「${x.label}」`).join(' / ')}。`:'';
      text=[intro,leadText,p.hints?.[Math.min(2,(p.hints?.length||1)-1)]].filter(Boolean).join(' ');
    }
  }
  return {text,prereq:miss.length>0};
}
function reviewNav(p,page,currentLevel){
  const max=Math.max(0,Math.min(3,unlockedLevel(p)));
  if(!max)return '';
  const buttons=Array.from({length:max},(_,i)=>i+1).map(n=>`<button type="button" class="context-hint-review-btn${n===Number(currentLevel)?' active':''}" data-context-hint-review="${esc(hintId(p))}" data-context-hint-page="${esc(page)}" data-context-hint-level="${n}">回看 ${n}级</button>`).join('');
  return `<div class="context-hint-review"><span>已解锁提示</span>${buttons}<button type="button" class="context-hint-archive-btn" data-context-hint-archive-open>全部回看</button></div>`;
}
function archiveLink(){
  const hs=loadHintState();
  const has=Object.keys(hs.history||{}).length||Object.values(hs.levels||{}).some(x=>Number(x)>0);
  return has?'<div class="context-hint-archive-link"><button type="button" data-context-hint-archive-open>查看已解锁提示记录</button></div>':'';
}
function renderHintModal(p,page,level,view,review=false){
  const prefix=`<div class="context-hint-meta"><span>当前页面 · ${esc(APP_NAMES[page]||'档案桌面')}</span><span>${esc(p?.title||'终局卷宗')} · ${level}/3</span>${review?'<span>回看模式 · 不增加提示等级</span>':''}</div>`;
  const pre=view?.prereq?'<p class="context-prereq-note">检测到前置条件未满足，因此这一层优先提示前置条件，不提前泄露后续答案。</p>':'';
  const nav=reviewNav(p,page,level);
  showModal(`${review?'回看 · ':''}${p?.title||'终局卷宗'} · ${level}/3级提示`,`${prefix}<p>${esc(view?.text||'')}</p>${pre}${nav}`);
}
function backfillArchive(){
  const hs=loadHintState(),S=loadGame();
  let changed=false;
  Object.entries(S.hints||{}).forEach(([id,level])=>{
    const n=Math.max(Number(hs.levels?.[id]||0),Number(level||0));
    if(Number(hs.levels?.[id]||0)!==n){hs.levels[id]=n;changed=true;}
  });
  Object.entries(hs.levels||{}).forEach(([id,maxRaw])=>{
    const max=Math.min(3,Number(maxRaw||0));if(max<=0)return;
    const p=PUZZLE_BY_ID[id]||{id,title:id==='final'?'终局卷宗':id,hints:[]};
    const already=Object.keys(hs.history||{}).some(k=>k.startsWith(id+'@@'));
    if(already)return;
    const page='home',key=hintHistoryKey(p,page);hs.history[key]=hs.history[key]||{};
    for(let level=1;level<=max;level++){
      const view=computeHintView(p,page,level,S);
      hs.history[key][String(level)]={puzzleId:id,puzzleTitle:p.title||id,page,pageTitle:APP_NAMES[page],level,text:view.text,prereq:!!view.prereq,at:0,reconstructed:true};
    }
    changed=true;
  });
  if(changed)saveHintState(hs);
  return hs;
}
function showHintArchive(){
  const hs=backfillArchive();
  const groups=Object.entries(hs.history||{}).map(([key,levels])=>{
    const vals=Object.values(levels||{}).filter(Boolean).sort((a,b)=>Number(a.level)-Number(b.level));
    if(!vals.length)return null;
    const first=vals[0],max=Math.max(...vals.map(x=>Number(x.level)||0));
    return {key,first,max,lastAt:Math.max(...vals.map(x=>Number(x.at)||0))};
  }).filter(Boolean).sort((a,b)=>b.lastAt-a.lastAt||String(a.first.puzzleTitle).localeCompare(String(b.first.puzzleTitle),'zh-CN'));
  if(!groups.length){showModal('提示回看','<p>本局还没有解锁过提示。首次查看某一级提示后，它会保存在本机并可随时回看。</p>');return;}
  const html=groups.map(g=>{
    const f=g.first,buttons=Array.from({length:g.max},(_,i)=>i+1).map(n=>`<button type="button" data-context-hint-review="${esc(f.puzzleId)}" data-context-hint-page="${esc(f.page)}" data-context-hint-level="${n}">${n}级</button>`).join('');
    return `<section class="context-hint-archive-row"><div><strong>${esc(f.puzzleTitle)}</strong><small>${esc(f.pageTitle||APP_NAMES[f.page]||'档案桌面')}</small></div><div class="context-hint-archive-levels">${buttons}</div></section>`;
  }).join('');
  showModal('提示回看',`<p class="context-hint-archive-intro">这里只显示本局已经解锁过的层级。回看不会继续升级提示，也不会额外影响隐藏结局条件。</p><div class="context-hint-archive-list">${html}</div>`);
}
function showModal(title,html){
  const modal=document.querySelector('#modal'),body=document.querySelector('#modalBody');if(!modal||!body)return;
  body.innerHTML=`<div class="kicker">${esc(title)}</div><h3>调查提示</h3>${html}`;
  modal.classList.remove('hidden');
}
function nextLevel(p){
  const hs=loadHintState(),id=hintId(p),n=Math.min(Number(hs.levels[id]||0)+1,3);
  hs.levels[id]=n;saveHintState(hs);mirrorHintLevelToGame(p,n);return n;
}
function showForPuzzle(p,page,forced=false){
  const S=loadGame();
  if(!p){showModal('事实链已闭合',`<p>当前核心推理已经完成，可以整理终局卷宗。</p>${archiveLink()}`);return;}
  if(S.solved.includes(p.id)){
    const max=unlockedLevel(p);
    if(max>0){
      const level=Math.min(3,max),hist=getHintHistory(p,page,level),view=hist?{text:hist.text,prereq:hist.prereq}:computeHintView(p,page,level,S);
      renderHintModal(p,page,level,view,true);return;
    }
    showModal(p.title,`<p>这条推理已经完成，且本局此前没有解锁过它的提示。</p>${archiveLink()}`);return;
  }
  const unlocked=unlockedLevel(p);
  if(unlocked>=3){
    const level=3,hist=getHintHistory(p,page,level),view=hist?{text:hist.text,prereq:hist.prereq}:computeHintView(p,page,level,S);
    if(!hist)storeHintHistory(p,page,level,view);
    renderHintModal(p,page,level,view,true);return;
  }
  const level=nextLevel(p),view=computeHintView(p,page,level,S);
  storeHintHistory(p,page,level,view);
  renderHintModal(p,page,level,view,false);
  refreshHintConsequences();
}
function showContext(){
  const S=loadGame();const page=activePage(S);
  if(page==='panel-final'){
    const p=currentPuzzle(S)||{id:'final',title:'终局卷宗'},unlocked=unlockedLevel(p);
    if(unlocked>=3){
      const level=3,hist=getHintHistory(p,page,level),view=hist?{text:hist.text,prereq:hist.prereq}:computeHintView(p,page,level,S);
      if(!hist)storeHintHistory(p,page,level,view);
      renderHintModal(p,page,level,view,true);return;
    }
    const level=nextLevel(p),view=computeHintView(p,page,level,S);
    storeHintHistory(p,page,level,view);renderHintModal(p,page,level,view,false);refreshHintConsequences();return;
  }
  showForPuzzle(pagePuzzle(S,page),page);
}
function combinedTier3Count(){
  const S=loadGame(),hs=loadHintState();
  const ids=new Set([...Object.keys(S.hints||{}),...Object.keys(hs.levels||{})]);
  let n=0;ids.forEach(id=>{if(Math.max(Number(S.hints?.[id]||0),Number(hs.levels?.[id]||0))>=3)n++;});return n;
}
function refreshHintConsequences(){
  const count=combinedTier3Count();
  const meta=document.querySelector('.report-meta p');
  if(meta)meta.textContent=meta.textContent.replace(/三级提示\s*\d+题/,`三级提示 ${count}题`);
  if(count>0){
    document.querySelector('[data-end="best"]')?.remove();
    const completion=document.querySelector('.completion');
    if(completion){
      const ps=[...completion.querySelectorAll('p')];
      const target=ps.find(x=>x.textContent.includes('三级直接提示'));
      if(target){target.className='warn-text';target.textContent=`三级直接提示 ${count}题 — 本轮无法进入隐藏结局`;}
    }
  }
}

const hintBtn=document.querySelector('#hintBtn');
if(hintBtn){hintBtn.onclick=showContext;hintBtn.title='根据当前页面、当前主线与前置条件动态提示';}

/* 新案件 / 重置 / 导入时，让页面上下文提示记录与当前案件保持一致。
 * 原生游戏的三级提示仍保存在正式存档中；这里仅清除额外的页面提示计数。 */
function resetContextHints(){try{localStorage.removeItem(HINT_KEY);}catch(e){}}
document.addEventListener('click',e=>{
  const reset=e.target.closest?.('[data-act="new"],[data-act2="restart"],#confirmReset');
  if(reset)resetContextHints();
},true);
const importFile=document.querySelector('#importFile');
if(importFile)importFile.addEventListener('change',()=>resetContextHints(),true);

document.addEventListener('click',e=>{
  const open=e.target.closest?.('[data-context-hint-archive-open]');
  if(open){e.preventDefault();e.stopImmediatePropagation();showHintArchive();return;}
  const b=e.target.closest?.('[data-context-hint-review]');if(!b)return;
  e.preventDefault();e.stopImmediatePropagation();
  const id=b.dataset.contextHintReview,page=b.dataset.contextHintPage||'home',level=Math.max(1,Math.min(3,Number(b.dataset.contextHintLevel||1)));
  const p=PUZZLE_BY_ID[id]||{id,title:id==='final'?'终局卷宗':id,hints:[]};
  const hist=getHintHistory(p,page,level),view=hist?{text:hist.text,prereq:hist.prereq}:computeHintView(p,page,level,loadGame());
  if(!hist)storeHintHistory(p,page,level,view);
  renderHintModal(p,page,level,view,true);
},true);

document.addEventListener('click',e=>{
  const b=e.target.closest?.('[data-hint-one]');if(!b)return;
  e.preventDefault();e.stopImmediatePropagation();
  const p=PUZZLE_BY_ID[b.dataset.hintOne];showForPuzzle(p,activePage(loadGame()),true);
},true);

/* 原版隐藏结局要求整局没有使用三级直接提示。
 * 页面上下文提示使用独立存储，因此这里同步拦截隐藏结局入口，避免一个动画帧内的竞态。 */
document.addEventListener('click',e=>{
  const best=e.target.closest?.('[data-end="best"]');
  if(!best||combinedTier3Count()===0)return;
  e.preventDefault();e.stopImmediatePropagation();
  showModal('隐藏结局条件未满足','<p>本轮已经使用过三级直接提示，因此无法进入隐藏结局。其他结局仍可正常完成。</p>');
},true);

const view=document.querySelector('#view');
if(view){let raf=0;new MutationObserver(()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(refreshHintConsequences);}).observe(view,{childList:true});}
/* V3.2 旧版上下文提示曾单独存储。升级后把已使用等级同步进正式案件存档，
 * 这样导出/导入仍会正确保留三级提示使用记录与隐藏结局资格。 */
mirrorExistingHintLevels();
refreshHintConsequences();
})();
