(()=>{
'use strict';
const D=window.ZERO_DATA;
const SAVE='zero-call-save-v2';
const LEGACY_SAVE='zero-call-save-v1';
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const norm=s=>String(s||'').toLowerCase().replace(/[\s·_\-—，。、“”‘’：:；;（）()\/\\？?！!]+/g,'');

const apps=[
  ['archive','硬盘目录','两份录音与节目备份',0],
  ['search','临江搜索','缓存搜索与旧链接',0],
  ['radio','FM93.7官网','节目、人员与旧公告',0],
  ['forum','临江生活论坛','132条城市生活缓存',0],
  ['phone','电信维护镜像','固定线路与交换区',1],
  ['news','新闻历史库','同一事件的多个版本',2],
  ['tower','旧塔设备系统','T1—T7与封存记录',2],
  ['oa','内部OA镜像','门禁、供电与制作日志',3],
  ['lab','检验副本','法医与电气复核',3],
  ['mail','调查请求箱','人物双来源核验',4]
];
const appMap=Object.fromEntries(apps.map(a=>[a[0],a]));
const panels={home,notes,bookmarks,people,timeline,final};
const initiallyDiscovered=['archive','search','radio'];

function initial(){return {
  version:4,stage:0,solved:[],facts:[],notes:[],bookmarks:[],viewed:[],hints:{},
  peopleViewed:[],completedSides:[],eggs:[],searchHistory:[],privacy:null,ending:null,
  finalAnswers:{},finalEvidence:{},audioSeen:false,soundEnabled:false,started:Date.now(),discoveredApps:[...initiallyDiscovered],
  introSeen:false,activeApp:'home',freshApps:[...initiallyDiscovered],sideDrafts:{},timelineDraft:[],portalOpen:false,finalAttempts:0,audioMarker:null,audioReviewDone:false,timelineCalibration:'',finalSummary:'',addressHistory:[]
};}
let S=initial();

function migrate(x){
  const base=initial();
  const out=Object.assign(base,x||{});
  ['solved','facts','notes','bookmarks','viewed','peopleViewed','completedSides','eggs','searchHistory'].forEach(k=>{if(!Array.isArray(out[k]))out[k]=[];});
  if(!out.hints||typeof out.hints!=='object')out.hints={};
  if(!out.finalAnswers||typeof out.finalAnswers!=='object')out.finalAnswers={};
  if(!out.finalEvidence||typeof out.finalEvidence!=='object')out.finalEvidence={};
  if(!out.sideDrafts||typeof out.sideDrafts!=='object')out.sideDrafts={};
  if(!Array.isArray(out.timelineDraft))out.timelineDraft=[];
  if(!Array.isArray(out.addressHistory))out.addressHistory=[];
  if(typeof out.audioReviewDone!=='boolean')out.audioReviewDone=false;
  if(typeof out.timelineCalibration!=='string')out.timelineCalibration='';
  if(typeof out.finalSummary!=='string')out.finalSummary='';
  if(typeof out.portalOpen!=='boolean')out.portalOpen=false;
  if(typeof out.soundEnabled!=='boolean')out.soundEnabled=false;
  if(!Array.isArray(out.discoveredApps)){
    out.discoveredApps=[...initiallyDiscovered];
    apps.filter(a=>a[3]<=Number(out.stage||0)).forEach(a=>{if(!out.discoveredApps.includes(a[0]))out.discoveredApps.push(a[0]);});
  }
  if(!Array.isArray(out.freshApps))out.freshApps=[];
  out.version=4;
  return out;
}
function save(render=true){localStorage.setItem(SAVE,JSON.stringify(S));if(render)renderShell();}
function load(){
  for(const key of [SAVE,LEGACY_SAVE]){
    try{const x=JSON.parse(localStorage.getItem(key));if(x){S=migrate(x);if(key===LEGACY_SAVE)localStorage.setItem(SAVE,JSON.stringify(S));return true;}}catch(e){}
  }
  return false;
}
function reset(){localStorage.removeItem(SAVE);localStorage.removeItem(LEGACY_SAVE);S=initial();location.reload();}
function addFact(f){if(f&&!S.facts.includes(f)){S.facts.push(f);S.notes.unshift({t:new Date().toLocaleTimeString('zh-CN',{hour12:false}),text:f});}}
const siteSounds={desk:'assets/audio/archive_roomtone.wav',archive:'assets/audio/archive_roomtone.wav',search:'assets/audio/archive_roomtone.wav',radio:'assets/audio/archive_roomtone.wav',forum:'assets/audio/keyboard_room.wav',phone:'assets/audio/phone_exchange.wav',news:'assets/audio/newsroom_roomtone.wav',tower:'assets/audio/t7_roomtone.wav',oa:'assets/audio/oa_relay.wav',lab:'assets/audio/archive_roomtone.wav',mail:'assets/audio/archive_roomtone.wav'};
function siteKey(v){return appMap[v]?v:'desk';}
function playFx(src,volume=.38){if(!S.soundEnabled)return;try{const a=new Audio(src);a.volume=volume;a.play().catch(()=>{});}catch(e){}}
function syncSoundscape(){const amb=$('#amb'),scene=$('#sceneAudio');if(!amb||!scene)return;amb.volume=.22;scene.volume=.16;if(!S.soundEnabled){amb.pause();scene.pause();return;}const key=siteKey(S.activeApp);const src=siteSounds[key]||siteSounds.desk;if(scene.dataset.src!==src){scene.pause();scene.src=src;scene.dataset.src=src;}amb.play().catch(()=>{});scene.play().catch(()=>{});}
function applyTheme(v){const g=$('#game');if(g)g.dataset.site=siteKey(v);syncSoundscape();}
function siteHeader(id,title,sub){const url=({archive:'HDD://PROGRAM/20100821',search:'cache://linjiang/search',radio:'http://fm937.lj/archive',forum:'bbs://linjiang-life/cache',phone:'telco://lj04/maint',news:'cms://linjiang-news/history',tower:'relay://old-tower/T7',oa:'intra://fm937/oa-mirror',lab:'case://forensic/copy',mail:'case://verification/inbox'}[id]||'archive://desk');return `<div class="site-chrome site-${esc(id)}"><span class="site-dot"></span><div class="site-title"><b>${esc(title)}</b><small>${esc(sub||'离线镜像 · 本地缓存')}</small></div><div class="site-address"><span>地址</span><code>${esc(url)}</code></div></div>`;}
function mark(v){if(!S.viewed.includes(v))S.viewed.push(v);S.activeApp=v;applyTheme(v);save(false);renderShell();}
function stageFromSolved(){const n=S.solved.length;const target=n>=15?7:n>=14?6:n>=12?5:n>=10?4:n>=7?3:n>=5?2:n>=2?1:0;if(target>S.stage)S.stage=target;}
function currentPuzzle(){return D.puzzles.find(x=>!S.solved.includes(x.id)&&x.stage<=S.stage)||D.puzzles.find(x=>!S.solved.includes(x.id));}
function appAvailable(id){const a=appMap[id];return !!a&&S.stage>=a[3];}
function appDiscovered(id){return S.discoveredApps.includes(id);}
function discoverApp(id,open=false){
  if(!appMap[id]||!appAvailable(id))return false;
  const isNew=!S.discoveredApps.includes(id);
  if(isNew){S.discoveredApps.push(id);S.freshApps.push(id);S.portalOpen=true;save(false);playFx('assets/audio/paper_rustle.wav',.24);toast(`你从缓存和旧链接里找到了一个新的入口：${appMap[id][1]}。它此前并不在桌面收藏夹里。`);}
  if(open)setTimeout(()=>openApp(id),isNew?250:0);
  renderShell();return true;
}
function stageLabel(){return ['01 · 录音裂缝','02 · 雨夜来电','03 · 十六年前','04 · 旧塔死因','05 · 每个人的谎言','06 · 四十二分钟','07 · 恢复四十七秒','08 · 结案'][S.stage];}

function renderShell(){
  if(!$('#game')||$('#game').classList.contains('hidden'))return;
  stageFromSolved();
  $('#stageText').textContent=stageLabel();
  $('#progressBar').style.width=(S.solved.length/D.puzzles.length*100)+'%';
  $('#solveText').textContent=`推理 ${S.solved.length}/${D.puzzles.length} · 人物核验 ${S.completedSides.length}/7`;
  const visible=apps.filter(a=>appDiscovered(a[0])&&appAvailable(a[0]));
  $('#apps').classList.toggle('collapsed',!S.portalOpen);
  const portal=$('#portalBtn');if(portal){portal.setAttribute('aria-expanded',String(S.portalOpen));portal.textContent=S.portalOpen?'收起旧链接':`旧链接 ${visible.length}/${apps.length}`;}
  $('#apps').innerHTML=`<div class="dock-label">浏览器恢复记录</div><div class="dock-scroll">${visible.map(a=>{
    const fresh=S.freshApps.includes(a[0]),active=S.activeApp===a[0];
    return `<button class="app-chip site-chip-${a[0]} ${fresh?'fresh':''} ${active?'active':''}" data-app="${a[0]}"><span>${esc(a[1])}</span><small>${esc(a[2])}</small>${fresh?'<em>新</em>':''}</button>`;
  }).join('')}</div><button class="dock-search" data-app="search">从缓存继续找入口</button>`;
  $$('[data-app]').forEach(b=>b.onclick=()=>openApp(b.dataset.app));
  $('#resourceStatus').title=`已恢复 ${visible.length}/${apps.length} 个旧网页入口；未发现的系统不会提前显示。`;
}
function routeTo(id){if(panels[id])return panels[id]();if(appMap[id])return openApp(id);}
function openApp(id){
  const meta=appMap[id];
  if(!meta)return home();
  if(!appAvailable(id))return toast('这个入口还没有出现在当前档案层级里。继续核实眼前的矛盾。',false);
  if(!appDiscovered(id))return toast('桌面上没有这个入口。试着从搜索缓存、旧链接或人物材料里把它找出来。',false);
  S.freshApps=S.freshApps.filter(x=>x!==id);mark(id);
  const fn={archive,search,radio,forum,phone,news,tower,oa,lab,mail}[id]||home;fn();
}
function conceptsHTML(){const arr=(D.concepts||[]).filter(c=>S.solved.includes(c.after));if(!arr.length)return '';return `<section class="concept-wrap"><h3>已经被你说清楚的事</h3>${arr.map(c=>`<article class="paper concept"><div class="kicker">概念回收</div><h3>${esc(c.title)}</h3><p>${esc(c.body)}</p></article>`).join('')}</section>`;}
function unresolvedHTML(){const p=currentPuzzle();return `<div class="unresolved"><span>尚未解释</span><b>${p?esc(p.title):'事实链已经闭合'}</b><small>${p?'系统不再直接告诉你该去哪个网站。需要时使用三级提示。':'可以整理终局卷宗。'}</small></div>`;}

function home(){
  mark('home');
  $('#view').innerHTML=`
  <section class="hero-panel home-hero"><img src="assets/images/studio.jpg" alt="FM93.7深夜直播间实景"><div class="shade"></div><div class="copy"><div class="kicker">CASE LJ-2010-0821 · 临江广播档案修复计划</div><h2>被剪掉的47秒</h2><p>你原本只负责把磁带、光盘和旧硬盘变成可以检索的文件。直到这个雨夜，两份本应相同的节目备份在片尾多出了四十七秒。</p><p>十六年前有人说过一句没人愿意听完的话。十六年后，又有人把另一句话剪掉了。</p></div></section>
  ${unresolvedHTML()}
  <div class="story-grid"><article class="paper"><h3>你为什么在这里</h3><p>临江市广播旧媒体数字化项目进入最后一批档案时，你被临时调来做交叉校验。江岚的名字本来只是一行旧目录，直到一个没有登记编号的硬盘被送进值班室。</p><p class="soft">档案不会自己说话。可当两份副本不一样时，沉默本身也会留下形状。</p></article><article class="paper"><h3>调查原则</h3><p>一个人撒谎，不等于一个人杀了人；一个链接藏得很深，也不等于它一定重要。先确认来源，再确认时间，最后才谈动机。</p><p>你可以随时收藏、写笔记或使用提示。第一级只给方向，第二级给定位，第三级才接近解法。</p></article></div>
  ${conceptsHTML()}${puzzleList()}`;
  bindPuzzles();
}
function puzzleList(){const ps=D.puzzles.filter(p=>p.stage<=S.stage);return `<section class="puzzle-stack"><div class="section-title"><span>推理桌</span><small>不是考试：请用你真正查到的材料作答</small></div>${ps.map(p=>puzzleHTML(p)).join('')}</section>`;}
function evidenceLockReason(o){if(o.requiresSide&&!S.completedSides.includes(o.requiresSide))return '先完成人物双来源核验';if(o.requiresView&&!S.viewed.includes(o.requiresView))return `先打开并阅读：${appMap[o.requiresView]?.[1]||o.requiresView}`;if(o.requiresSolved&&!S.solved.includes(o.requiresSolved))return '先完成前置推理';return '';}
function evidenceOptions(p,scope='puzzle'){const selected=scope==='final'?(S.finalEvidence[p.id]||[]):[];return `<div class="evidence-choice ${scope==='final'?'final-evidence-choice':''}">${(p.evidenceChoices||[]).map(o=>{const reason=evidenceLockReason(o),checked=selected.includes(o.id);return `<label class="${reason?'locked-evidence':''}"><input type="checkbox" ${scope==='final'?`data-final-ev="${p.id}"`:`data-ev="${p.id}"`} value="${esc(o.id)}" ${reason?'disabled':''} ${checked?'checked':''}><span>${reason?`<small>${esc(reason)}</small>`:''}${esc(o.label)}</span></label>`;}).join('')}</div>`;}
function fieldsPuzzle(p){return `<div class="field-grid">${(p.fields||[]).map(f=>`<label><span>${esc(f.label)}</span><input data-puzzle-field="${p.id}" data-field-id="${esc(f.id)}" placeholder="${esc(f.placeholder||'填写')}"></label>`).join('')}</div>`;}
function timelinePuzzle(p,label='拖动卡片调整顺序；触屏设备可用 ↑ ↓。'){return `<div class="sort-note">${esc(label)}</div><div class="timeline-sort" data-sort="${p.id}">${(p.timelineItems||[]).map((x,i)=>`<div class="sort-item" draggable="true" data-item="${x.id}"><span class="grip">⋮⋮</span><span>${esc(x.label)}</span><span class="sort-actions"><button type="button" data-up aria-label="上移">↑</button><button type="button" data-down aria-label="下移">↓</button></span></div>`).join('')}</div>`;}
function puzzleHTML(p){
  const done=S.solved.includes(p.id);
  if(done)return `<article class="paper puzzle solved" id="${p.id}"><div class="kicker">已确认 · ${esc(p.title)}</div><h3>${esc(p.prompt)}</h3><div class="status ok">结论：${esc(p.answer)}</div>${p.afterText?`<p class="after-note">${esc(p.afterText)}</p>`:''}</article>`;
  let body='';
  if(['text','number','time'].includes(p.type))body=`<div class="answer-box"><input data-puzzle-input="${p.id}" inputmode="${p.type==='number'?'numeric':'text'}" placeholder="${esc(p.placeholder||'写下你的判断')}"></div>`;
  if(p.type==='fields')body=fieldsPuzzle(p);
  if(p.type==='evidence')body=evidenceOptions(p);
  if(p.type==='evidenceText')body=`<div class="answer-box"><input data-puzzle-input="${p.id}" placeholder="${esc(p.placeholder||'输入答案')}"></div>${evidenceOptions(p)}`;
  if(p.type==='timeline')body=timelinePuzzle(p);
  if(p.type==='timelinePerson')body=timelinePuzzle(p)+`<div class="answer-box"><input data-puzzle-input="${p.id}" placeholder="${esc(p.placeholder||'输入人物')}"></div>`;
  if(p.type==='causalText')body=timelinePuzzle(p,'把“发生过什么”按因果先后排好，再写下你的解释。')+`<div class="answer-box"><input data-puzzle-input="${p.id}" placeholder="${esc(p.placeholder||'用一句话解释因果')}"></div>`;
  return `<article class="paper puzzle" id="${p.id}"><div class="kicker">待推理 · ${esc(p.title)}</div><h3>${esc(p.prompt)}</h3>${body}<div class="puzzle-actions"><button data-solve="${p.id}">提交推理</button><button class="text-btn" data-hint-one="${p.id}">只看这一题的提示</button></div></article>`;
}
function bindSorters(){
  $$('.timeline-sort').forEach(box=>{
    let dragging=null;
    box.querySelectorAll('.sort-item').forEach(item=>{
      item.addEventListener('dragstart',()=>{dragging=item;item.classList.add('dragging');});
      item.addEventListener('dragend',()=>{item.classList.remove('dragging');dragging=null;});
      item.addEventListener('dragover',e=>{e.preventDefault();if(!dragging||dragging===item)return;const r=item.getBoundingClientRect();const after=e.clientY>r.top+r.height/2;box.insertBefore(dragging,after?item.nextSibling:item);});
      const up=item.querySelector('[data-up]'),down=item.querySelector('[data-down]');
      up.onclick=()=>{const prev=item.previousElementSibling;if(prev)box.insertBefore(item,prev);};
      down.onclick=()=>{const next=item.nextElementSibling;if(next)box.insertBefore(next,item);};
    });
  });
}
function bindPuzzles(){
  $$('[data-solve]').forEach(b=>b.onclick=()=>solve(b.dataset.solve));
  $$('[data-hint-one]').forEach(b=>b.onclick=()=>hint(b.dataset.hintOne));
  bindSorters();
}
function matchesGroups(text,groups){const n=norm(text);return (groups||[]).every(g=>g.some(x=>n.includes(norm(x))));}
function selectedEvidence(id){return $$(`input[data-ev="${id}"]:checked`).map(x=>x.value);}
function evidenceSetOK(got,p){if(p.minEvidence&&got.length<p.minEvidence)return false;if(p.needAny)return p.needAny.some(set=>set.length===got.length&&set.every(x=>got.includes(x)));const need=p.need||[];return need.length?got.length===need.length&&need.every(x=>got.includes(x)):true;}
function checkEvidence(p){return evidenceSetOK(selectedEvidence(p.id),p);}
function checkFields(p){return (p.fields||[]).every(f=>{const el=$(`[data-puzzle-field="${p.id}"][data-field-id="${f.id}"]`);return matchesGroups(el?.value||'',f.acceptGroups||[]);});}
function checkOrder(p){const box=$(`[data-sort="${p.id}"]`);if(!box)return false;const got=[...box.querySelectorAll('.sort-item')].map(x=>x.dataset.item);return JSON.stringify(got)===JSON.stringify(p.answerOrder||[]);}
function checkPuzzle(p){
  const input=$(`[data-puzzle-input="${p.id}"]`),text=input?.value||'';
  if(['text','number','time'].includes(p.type)){const source=(p.id==='p13'&&S.timelineCalibration)?S.timelineCalibration:text;const base=matchesGroups(source,p.acceptGroups||[[p.answerValue||p.answer]]);if(p.requiresAudioMarker){const v=Number(S.audioMarker);return base&&Number.isFinite(v)&&v>=62&&v<90;}return base;}
  if(p.type==='fields')return checkFields(p);
  if(p.type==='evidence'){const base=checkEvidence(p);if(p.requiresAudioReview)return base&&S.audioReviewDone;return base;}
  if(p.type==='evidenceText')return matchesGroups(text,p.acceptGroups)&&checkEvidence(p);
  if(p.type==='timeline')return checkOrder(p);
  if(p.type==='timelinePerson')return checkOrder(p)&&matchesGroups(text,p.acceptGroups);
  if(p.type==='causalText')return checkOrder(p)&&matchesGroups(text,p.acceptGroups);
  return false;
}
function solve(id){
  const p=D.puzzles.find(x=>x.id===id);if(!p)return;
  if(!checkPuzzle(p))return toast('这套解释还没有闭合。别急着换答案，先问问自己：哪一条材料还没被解释？',false);
  const before=S.stage;if(!S.solved.includes(id))S.solved.push(id);(p.facts||[]).forEach(addFact);stageFromSolved();save(false);
  const advanced=S.stage>before;
  showModal(`<div class="kicker">${esc(p.title)}</div><h3>推理成立</h3><p>${esc(p.answer)}</p>${p.afterText?`<p class="case-reflection">${esc(p.afterText)}</p>`:''}${advanced?'<p class="unlock-note">档案层级变深了。搜索缓存里可能出现此前看不到的旧入口，但它们不会自动摆到桌面上。</p>':''}`);
  renderShell();home();
}
function toast(msg,ok=true){showModal(`<h3>${ok?'记录已更新':'推理未闭合'}</h3><p>${esc(msg)}</p>`);}

function audioWorkbenchHTML(){
  const pos=Number.isFinite(Number(S.audioMarker))?Number(S.audioMarker):52;
  const label=pos<28?'开场与第一轮热线':pos<62?'节目主体':pos<90?'片尾与结束语之前':'正式片尾之后';
  return `<section class="audio-workbench"><div class="section-title"><span>双轨录音比对台</span><small>不需要听力也能操作：波形、转录断点和时长差同时保留</small></div><div class="dual-wave"><div><b>公开归档 · 02:14:09</b><div class="long-wave public-wave">${Array.from({length:72},(_,i)=>`<i style="height:${24+((i*37)%61)}%"></i>`).join('')}</div></div><div><b>自动备份 · 02:14:56</b><div class="long-wave auto-wave">${Array.from({length:72},(_,i)=>`<i style="height:${22+((i*29+i%7*8)%67)}%"></i>`).join('')}</div></div></div><label class="scrub-label">把游标停在你认为两份档案第一次出现结构差异的位置<input id="audioScrub" type="range" min="0" max="100" value="${pos}"><span id="scrubReadout">当前：${esc(label)}</span></label><div class="workbench-actions"><button id="markAudio">在这里做记号</button><button id="playSplice" class="text-btn">播放剪辑断点恢复片段</button></div><p class="small">做记号不会告诉你“对/错”。它只是把你的观察带回推理桌；真正的结论仍需要文字说明。</p></section>`;
}
function bindAudioWorkbench(){
  const r=$('#audioScrub'),read=$('#scrubReadout'),markBtn=$('#markAudio'),play=$('#playSplice');if(!r)return;
  const label=v=>v<28?'开场与第一轮热线':v<62?'节目主体':v<90?'片尾与结束语之前':'正式片尾之后';
  r.oninput=()=>read.textContent='当前：'+label(Number(r.value));
  markBtn.onclick=()=>{S.audioMarker=Number(r.value);save(false);playFx('assets/audio/reel_stop.wav',.28);showModal(`<h3>已在双轨波形上留下记号</h3><p>位置：${esc(label(Number(r.value)))}</p><p class="small">这只是你的工作草稿，不会替你判断剪辑点。</p>`);};
  if(play)play.onclick=()=>{S.audioReviewDone=true;save(false);const a=new Audio('assets/audio/tape_splice.wav');a.play().catch(()=>{});showModal('<h3>剪辑断点复核已记录</h3><p>你把波形、转录断点和声音结构放在一起看过一次。即使浏览器没有播放声音，这一步也会保留文字/波形兜底。</p>');};
}
function archive(){
  $('#view').innerHTML=`${siteHeader('archive','节目硬盘恢复目录','2010-08-21 · 只读副本')}<div class="kicker">HDD / PROGRAM / 20100821</div><h2>硬盘目录</h2><p class="lede">文件名很冷，时间戳也很冷。可当两份“同一个节目”拥有不同长度时，它们之间的空白比任何备注都更响。</p><div class="media-grid"><article class="paper media-card"><img class="evidence-img" src="assets/images/evidence_tape.jpg" alt="公开版录音带档案实拍"><h3>零点来电_20100821_public.mp3</h3><p>公开归档长度：02:14:09</p><button data-bm="公开版录音">收藏</button></article><article class="paper media-card"><img class="evidence-img" src="assets/images/evidence_transcript.jpg" alt="自动备份转录档案实拍"><h3>AUTO_20100821_0000.wav</h3><p>自动备份长度：02:14:56</p><button data-bm="自动备份">收藏</button></article></div><article class="paper"><h3>转录断点</h3><p>公开版在江岚的结束语前出现一次不自然跳转；自动备份的波形在同一位置多出一段连续语音，内容尚未恢复。</p><p class="quote">“今天的节目就到这里——”这句话在两个版本里都存在。真正消失的东西，在它之前。</p></article>${audioWorkbenchHTML()}${audioCard('assets/audio/tape_load.wav','磁带机装载与走带声','卡舌落下，电机起转，磁带底噪慢慢铺开。','这只是档案修复现场的声音，不承担答案。')}${audioCard('assets/audio/tape_splice.wav','剪辑断点恢复片段','中段出现一次很短的波形塌陷，前后底噪连续，却像有人用剪刀把一句话整齐拿走。','不听声音也能通过两份长度和转录断点完成主线；这段音频只让“被剪掉”变得更可感。')}${audioCard('assets/audio/reel_stop.wav','走带停止与回卷尾声','磁带电机慢下来，压带轮松开，最后只剩很轻的机械余响。','它用来区分“正常结束”与“被切掉一段”的听觉质感，不提供独立答案。')}${puzzleList()}`;bindPuzzles();bindBM();bindAudioButtons();bindAudioWorkbench();
}
function expandQuery(raw){let q=norm(raw),terms=[q];for(const [key,vals] of Object.entries(D.searchAliases||{})){const group=[key,...vals].map(norm);if(group.some(v=>v&&q.includes(v))||group.some(v=>q&&v.includes(q)))terms.push(...group);}return [...new Set(terms.filter(Boolean))];}
function discoveryItems(){return Object.entries(D.discoveries||{}).filter(([id,d])=>!appDiscovered(id)&&S.stage>=d.stage).map(([id,d])=>({title:d.hitTitle||d.label,body:d.hitBody||d.blurb,src:'旧网页缓存索引',unlockApp:id,aliases:d.aliases}));}
function guessAddress(raw){const q=norm(raw);if(!q)return null;for(const [id,d] of Object.entries(D.discoveries||{})){if(appDiscovered(id)||S.stage<d.stage)continue;const paths=[...(d.paths||[]),...(d.aliases||[])].map(norm);if(paths.some(p=>p&&q.includes(p))||paths.some(p=>q.length>=4&&p.includes(q)))return id;}return null;}
function addressBarHTML(){return `<div class="address-workbench"><label><span>旧地址 / 路径恢复</span><input id="addressGuess" placeholder="例如：relay/T7、history/2003……（也可以粘贴你在页面里看到的残缺路径）"></label><button id="addressGo">尝试恢复</button></div>`;}
function bindAddressBar(){const input=$('#addressGuess'),btn=$('#addressGo');if(!input||!btn)return;const run=()=>{const raw=input.value.trim();if(!raw)return;S.addressHistory=[raw,...S.addressHistory.filter(x=>x!==raw)].slice(0,8);save(false);const id=guessAddress(raw);if(id){playFx('assets/audio/modem_handshake.wav',.2);discoverApp(id,true);}else toast('这个地址没有在当前缓存层级里留下可恢复入口。也许路径还少一段，或者你把一个普通资料页当成了隐藏站点。',false);};btn.onclick=run;input.onkeydown=e=>{if(e.key==='Enter')run();};}
function searchDataset(){return [
  ...D.forum.map(x=>({title:x.title,body:x.body,src:'临江生活论坛',egg:x.egg||false,unlockApp:appDiscovered('forum')?null:'forum'})),
  {title:'FM93.7 2009周年庆纪念品',body:'银灰色防雨外套仅向在职员工发放，每人一件。',src:'FM93.7官网'},
  {title:'2003-08-17 无码头风险通报草稿',body:'23:41已接到六码头工作人员风险报告。',src:'临江新闻旧缓存'},
  {title:'旧塔设备维修费用表',body:'T7电缆、转接面板、隔离门，2008封存。',src:'设备维护缓存'},
  ...D.people.map(p=>({title:p.name+'｜'+p.role,body:p.public,src:'人物公开档案'})),
  ...discoveryItems()
];}
function scoreItem(x,terms){let t=norm(x.title),b=norm(x.body),s=norm(x.src),score=0;for(const k of terms){if(t.includes(k))score+=5;if(b.includes(k))score+=2;if(s.includes(k))score+=1;}if(x.aliases){for(const a of x.aliases)for(const k of terms)if(norm(a).includes(k)||k.includes(norm(a)))score+=6;}return score;}
function search(){
  const history=S.searchHistory.slice(0,6);
  $('#view').innerHTML=`${siteHeader('search','临江市网页缓存检索','2010旧网页快照 · 非实时互联网')}<h2>临江搜索</h2><p class="lede">旧网页没有被完整保存，搜索缓存却记得一些已经从首页消失的入口。你需要自己决定什么值得继续点进去。</p>${addressBarHTML()}<div class="search"><input id="q" placeholder="人名、地点、编号、设备、旧事件……"><button id="go">搜索</button></div>${history.length?`<div class="history">最近搜索：${history.map(q=>`<button data-requery="${esc(q)}">${esc(q)}</button>`).join('')}</div>`:''}<div id="results" class="search-results"><div class="paper"><p>支持同义词和包含匹配，不需要猜唯一字符串。搜索结果不会自动标注“主线线索”。</p></div></div>`;
  const run=raw=>{
    const q=raw.trim();if(!q)return;
    S.searchHistory=[q,...S.searchHistory.filter(x=>x!==q)].slice(0,12);save(false);
    const terms=expandQuery(q),arr=searchDataset().map(x=>({...x,score:scoreItem(x,terms)})).filter(x=>x.score>0).sort((a,b)=>b.score-a.score);
    $('#results').innerHTML=arr.length?arr.slice(0,26).map(x=>`<article class="search-hit ${x.unlockApp?'old-link':''}"><div><h4>${esc(x.title)}</h4><small>${esc(x.src)}</small><p>${esc(x.body)}</p></div><div class="hit-actions">${x.unlockApp?`<button data-discover="${x.unlockApp}">进入旧链接</button>`:`<button data-bm="${esc(x.title)}" ${x.egg?'data-egg="'+esc(x.title)+'"':''}>收藏</button>`}</div></article>`).join(''):`<article class="paper"><p>没有直接结果。真正的旧互联网经常这样：不是“答案不存在”，只是你敲进去的词和当年的写法不一样。</p><p class="small">可以拆成更短的人名、地点、数字或设备名称再试。</p></article>`;
    bindBM();$$('[data-discover]').forEach(b=>b.onclick=()=>discoverApp(b.dataset.discover,true));
  };
  $('#go').onclick=()=>run($('#q').value);$('#q').onkeydown=e=>{if(e.key==='Enter')run($('#q').value);};
  $$('[data-requery]').forEach(b=>b.onclick=()=>{$('#q').value=b.dataset.requery;run(b.dataset.requery);});bindAddressBar();
}
function radio(){
  $('#view').innerHTML=`${siteHeader('radio','FM93.7 临江广播','旧官网镜像 · 节目与人员资料')}<div class="hero-panel"><img src="assets/images/studio.jpg" alt="FM93.7直播间实景"><div class="shade"></div><div class="copy"><div class="kicker">FM93.7</div><h2>临江广播</h2><p>午夜以后，城市里仍有很多人醒着。江岚说电台不是替他们解决问题，只是让一句话不至于落在没人听见的地方。</p></div></div>${audioCard('assets/audio/broadcast_signoff.wav','凌晨片尾报时与结束提示','短促报时音之后，主持麦克风关闭，片尾音乐尚未完全进入。','这段声音用于建立“节目结束前后”的结构感。')}${audioCard('assets/audio/radio_tuning.wav','旧频率调谐片段','短促的白噪、载波和调谐漂移。','没有隐藏语音，只用于恢复旧广播的听觉质感。')}<div class="story-grid"><article class="paper"><h3>2009周年庆</h3><p>纪念品：银灰防雨外套。发放范围：在职员工，每人一件，不公开销售。</p><button data-bm="FM93.7员工雨衣">收藏</button></article><article class="paper"><h3>《零点来电》</h3><p>主持：江岚　制作：陆沉　热线初筛：秦悦</p><p>2010-08-21节目于00:31左右提前结束。</p></article></div>${audioCard('assets/audio/radio_fragment.wav','FM93.7片尾恢复片段','底噪里能听见两段独立的片尾提示音，中间留着一小段没有被音乐盖住的空气。','它不直接给答案，只提醒你：节目结构本身也能证明剪辑发生在哪里。')}<article class="paper"><h3>听众留言摘录</h3><p class="quote">“她不怎么劝人想开一点。她会先问：那天到底发生了什么？”</p><p class="quote">“陆沉有一次把片尾卡带装反，江岚笑到播不了广告。那一段后来谁也没剪。”</p></article>`;bindBM();bindAudioButtons();
}
function forum(){
  let posts=D.forum,page=0,filtered=posts;
  $('#view').innerHTML=`${siteHeader('forum','临江生活论坛','只读缓存 · 2008—2011帖子')}<h2>临江生活论坛</h2><p class="lede">132条缓存里，大多数人只在讨论房租、停水、找猫和雨。真正的城市从来不是为了案件才存在。</p><div class="search"><input id="fq" placeholder="搜索标题、正文、标签或作者"><button id="fgo">筛选</button></div><div class="forum-tools"><button id="prevForum">上一页</button><span id="forumPage"></span><button id="nextForum">下一页</button></div><div id="flist"></div>`;
  const draw=()=>{let pages=Math.max(1,Math.ceil(filtered.length/30));page=Math.max(0,Math.min(page,pages-1));$('#forumPage').textContent=`第 ${page+1}/${pages} 页 · ${filtered.length}条`;const arr=filtered.slice(page*30,page*30+30);$('#flist').innerHTML=arr.map(x=>`<article class="forum-post"><h4>${esc(x.title)}</h4><small>${esc(x.date)} · ${esc(x.author)}</small><p>${esc(x.body)}</p><div>${x.tags.map(t=>`<span class="tag">${esc(t)}</span>`).join('')}</div><button data-bm="论坛：${esc(x.title)}" ${x.egg?'data-egg="'+esc(x.title)+'"':''}>收藏</button></article>`).join('')||'<article class="paper">没有匹配帖子。试试把关键词缩短。</article>';bindBM();$('#prevForum').disabled=page===0;$('#nextForum').disabled=page>=pages-1;};
  draw();$('#fgo').onclick=()=>{const q=norm($('#fq').value),terms=expandQuery(q);filtered=q?posts.filter(x=>scoreItem({title:x.title,body:x.body,src:x.tags.join(' ')+x.author},terms)>0):posts;page=0;draw();};$('#fq').onkeydown=e=>{if(e.key==='Enter')$('#fgo').click();};$('#prevForum').onclick=()=>{page--;draw();};$('#nextForum').onclick=()=>{page++;draw();};
}
function audioCard(src,title,transcript,clue){return `<article class="audio-card"><div class="audio-title"><span>声音档案</span><b>${esc(title)}</b></div><div class="mini-wave">${[31,62,28,75,45,68,37,83,49,65,30,72,41,79,35,56,86,44,70,33,61,77,39,69].map(h=>`<i style="height:${h}%"></i>`).join('')}</div><button data-playclip="${esc(src)}">播放</button><details><summary>文字/结构兜底</summary><p>${esc(transcript)}</p>${clue?`<p class="small">${esc(clue)}</p>`:''}</details></article>`;}
function bindAudioButtons(){$$('[data-playclip]').forEach(b=>b.onclick=()=>{const a=new Audio(b.dataset.playclip);a.play().catch(()=>toast('浏览器没有允许播放这段声音。文字/结构兜底仍然可以完成同一推理。',false));});}
function phone(){
  $('#view').innerHTML=`${siteHeader('phone','临江电信维护终端','04交换区 · 历史固定线路镜像')}<h2>临江电信维护镜像</h2><p class="lede">地址会搬家，号码不会立刻跟着搬。数据库里最顽固的往往不是谎言，只是来不及更新的旧字段。</p><div class="story-grid"><article class="doc"><h3>固定终端编号说明</h3><p><b>LJ-04-117</b></p><p>LJ＝临江市域；04＝交换区编号；117＝区内终端编号。</p><p>2009-11维护备注：北门公话亭外壳拆除，原117线路临时转接至毗邻24小时便利店，数据库地址待更新。</p></article><img class="evidence-img" src="assets/images/evidence_phone.jpg" alt="117电话线路维护单实拍"></div>${audioCard('assets/audio/phone_ring_far.wav','北门旧线路远端振铃','两声旧式机械铃后，线路接通前仍有轻微工频噪声。','响铃位置不能单独证明地址迁移，仍需维护备注与论坛旁证。')}${audioCard('assets/audio/phone_exchange.wav','第四交换区机房底噪','拨号音退去后，是继电器连续吸合的短促咔哒声。','环境声只帮助建立线路系统的真实感。')}${audioCard('assets/audio/phone_line_117.wav','117线路测试音','维护录音中可听到旧式线路拨号音、四区测试提示与末端继电器噪声。','声音不是唯一答案来源；编号说明与维护备注足以完成主线。')}<button data-bm="LJ-04-117维护单">收藏</button>`;bindBM();bindAudioButtons();
}
function news(){
  $('#view').innerHTML=`${siteHeader('news','临江新闻历史CMS','版本库 · 采访草稿 / 公开稿')}<div class="hero-panel"><img src="assets/images/newsroom.jpg" alt="临江日报旧编辑部实景"><div class="shade"></div><div class="copy"><div class="kicker">LOCAL NEWS ARCHIVE</div><h2>临江新闻历史库</h2><p>同一场事故，在不同版本里拥有不同的“第一次发生”。有些删改不会改变字数，却会把责任推到午夜之后。</p></div></div><div class="story-grid"><article class="doc"><h3>V1采访草稿</h3><p>2003-08-17 23:41，编辑部接到六码头工作人员风险报告。</p><p>23:47，FM93.7出现未经确认的“停止发船”警告。</p></article><article class="doc"><h3>V3公开版</h3><p>2003-08-18 00:23，六码头事故发生后，相关部门接报并处置。</p><p>此前广播内容被认定为误播。</p></article></div>${audioCard('assets/audio/broadcast_2003_warning.wav','2003旧广播恢复片段','恢复转录：“六码头停止发船。重复，六码头停止发船。风向和缆位有异常，不要等下一班。”','录音经过降噪重建，仅作为剧情档案；关键时间仍以V1/V3文字时间戳为准。')}<article class="paper"><p>历史CMS账号 <code>LQEDITOR</code> 为新闻中心公共编辑账号，不能单独指向梁启个人。</p><img class="evidence-img" src="assets/images/evidence_news.jpg" alt="旧新闻稿版本比较实拍"><button data-bm="2003新闻V1/V3差异">收藏</button></article>`;bindBM();bindAudioButtons();
}
function tower(){
  $('#view').innerHTML=`${siteHeader('tower','旧广播中继塔设备页','维护离线副本 · T1—T7')}<div class="hero-panel"><img src="assets/images/tower.jpg" alt="暴雨中的旧广播中继塔实景"><div class="shade"></div><div class="copy"><div class="kicker">OLD RELAY SITE</div><h2>旧广播中继塔</h2><p>维修表里一直有T7，公开结构图却只画到T6。雨打在铁皮上时，整座塔像一台还没彻底关机的旧机器。</p></div></div><div class="story-grid"><article class="paper"><img class="evidence-img" src="assets/images/evidence_map.jpg" alt="旧塔结构图实拍"><h3>T7旧转接室</h3><p>2008改造记录：T7与设备间之间的维护口以水泥永久封闭。</p></article><article class="paper"><img class="evidence-img" src="assets/images/relay7.jpg" alt="T7封闭维护口现场实拍"><h3>2010现场复核</h3><p>封层完整，无新开凿痕迹。发现一条通道，和证明它能被使用，是两件不同的事。</p></article></div>${audioCard('assets/audio/tower_door.wav','旧塔隔离门开合声','沉重金属门先摩擦门框，再由锁舌回弹。封闭维护口与正常隔离门的声音完全不同。','它只强化空间感；暗道是否可用仍由封层记录和现场复核决定。')}${audioCard('assets/audio/t7_roomtone.wav','T7设备间环境恢复','低频变压器嗡鸣、雨水敲击铁皮、间歇继电器声。约01:11后高压支路重新出现明显电气噪声。','声音可帮助理解“通电前后”的环境差异；主线仍保留电气日志。')}${S.stage>=3&&!appDiscovered('oa')?'<article class="old-link-card"><span>旧链接</span><b>设备维护页底部残留：/oa/power/gate-log</b><button data-discover="oa">尝试打开</button></article>':''}${S.solved.includes('p7')?'<article class="paper concept"><h3>“七码”</h3><p>它最初只是一个设备位置。后来因为有人从这里把真正的警告送进广播，普通编号才慢慢长成了城市传闻。</p></article>':''}`;bindAudioButtons();$$('[data-discover]').forEach(b=>b.onclick=()=>discoverApp(b.dataset.discover,true));
}
function oa(){
  $('#view').innerHTML=`${siteHeader('oa','FM93.7 内部OA镜像','只读恢复 · 门禁 / 供电 / 制作日志')}<div class="hero-panel"><img src="assets/images/control_room.jpg" alt="旧塔设备控制室实景"><div class="shade"></div><div class="copy"><div class="kicker">OFFLINE OA MIRROR</div><h2>电台内部OA镜像</h2><p>机器不会记得谁害怕过。它只把门禁、供电和同步失败一行一行留下。</p></div></div><div class="story-grid"><article class="paper"><h3>门禁控制器</h3><img class="evidence-img" src="assets/images/evidence_gate.jpg" alt="门禁同步失败日志实拍"><p>00:00 NTP SYNC FAIL。断网后控制器保持既有偏差：<b>-11:00</b>。</p><p class="small">日志告诉你偏差，真实时间需要自己换算。</p></article><article class="paper"><h3>备用供电</h3><img class="evidence-img" src="assets/images/evidence_power.jpg" alt="备用发电机日志实拍"><p>00:48备用回路启动；01:11设备间高压支路恢复。</p></article></div>${audioCard('assets/audio/oa_relay.wav','设备控制柜继电器声','持续低频电流声里夹着继电器吸合。同步失败不会发出“真相提示音”，机器只是在工作。','把声音和文字日志分开看：判断仍应以时间记录为准。')}`;bindAudioButtons();
}
function lab(){
  $('#view').innerHTML=`${siteHeader('lab','临江市法医技术检验副本','工作底稿 · 非公开摘要')}<h2>法医 / 技术检验副本</h2><p class="lede">这里的语言不会替任何人抒情。死亡时间、损伤和药物浓度只负责告诉你身体发生了什么。</p><div class="story-grid"><article class="paper"><img class="evidence-img" src="assets/images/evidence_autopsy.jpg" alt="完整法医工作底稿实拍"><h3>完整法医工作底稿</h3><p>推定死亡：00:54—01:03。右手电击损伤存在；血中镇静剂不足致死；颈部和口鼻部征象支持机械性窒息方向。</p></article><article class="paper"><h3>电气复核</h3><p>设备间危险电压直到01:11恢复。</p><p>如果死亡已经发生，电击就不能再被拿来解释“为什么死”，只能解释“现场为什么看起来像触电”。</p></article></div>`;
}
function mail(){
  const inv=D.sideInvestigations||[];
  $('#view').innerHTML=`${siteHeader('mail','人物补充调查请求箱','双来源核验 · 不以撒谎替代杀人证据')}<h2>调查请求箱</h2><p class="lede">这里没有“一键洗清嫌疑”。每个人都有三份材料，其中只有两份真正能解释他为什么撒谎。先选来源，再写结论。</p>${inv.map(m=>{
    const available=S.stage>=m.stage,done=S.completedSides.includes(m.id);const draft=S.sideDrafts[m.id]||'';
    return `<article class="paper side-card ${done?'done':''}"><div class="kicker">${done?'已核验':available?'待交叉核验':'尚未开放'} · ${esc(m.person)}</div><h3>${esc(m.title)}</h3>${available?`<p>${esc(m.body)}</p><div class="source-tray">${(m.documents||[]).map((d,i)=>`<label class="source-document"><input type="checkbox" data-side-doc="${m.id}" value="${esc(d.id||String(i))}" ${done?'disabled':''}><span><small>${esc(d.kind||'资料')} · ${esc(d.source||`来源 ${i+1}`)}</small><p>${esc(d.text||d)}</p></span></label>`).join('')}</div>${done?`<div class="status ok">${esc(m.fact)}</div>${m.memory?`<p class="case-reflection">${esc(m.memory)}</p>`:''}`:`<label class="verify-label">${esc(m.question||'这两份材料共同解释了什么？')}<textarea data-side-input="${m.id}" placeholder="先选两份能够互相支撑的来源，再用自己的话写结论">${esc(draft)}</textarea></label><button data-side="${m.id}">提交双来源核验</button>`}`:`<p>继续推进后，相关材料才会进入数字化档案。</p>`}</article>`;
  }).join('')}`;
  $$('[data-side]').forEach(b=>b.onclick=()=>completeSide(b.dataset.side));
  $$('[data-side-input]').forEach(t=>t.oninput=()=>{S.sideDrafts[t.dataset.sideInput]=t.value;save(false);});
}
function completeSide(id){
  const m=D.sideInvestigations.find(x=>x.id===id);if(!m||S.stage<m.stage)return;
  const input=$(`[data-side-input="${id}"]`);const text=input?.value||S.sideDrafts[id]||'';
  const picked=$$(`input[data-side-doc="${id}"]:checked`).map(x=>x.value),need=m.needDocs||[];
  const docsOK=picked.length===need.length&&need.every(x=>picked.includes(x));
  if(!docsOK)return toast('这两份来源还不能互相证明同一件事。别选“看起来相关”的材料，选能够解释谎言原因的材料。',false);
  if(!matchesGroups(text,m.acceptGroups||[]))return toast('来源选对了，但你的解释还少了关键因果。试着回答：这个人究竟在保护、逃避或隐瞒什么？',false);
  if(!S.completedSides.includes(id))S.completedSides.push(id);addFact(m.fact);save(false);playFx('assets/audio/paper_rustle.wav',.25);const used=(m.documents||[]).filter(d=>picked.includes(d.id)).map(d=>d.source).join(' ＋ ');const excluded=(m.documents||[]).filter(d=>!picked.includes(d.id)).map(d=>d.source).join('、');showModal(`<h3>${esc(m.person)} · 核验完成</h3><p>${esc(m.fact)}</p><p class="source-proof"><b>采用来源：</b>${esc(used)}</p><p class="small"><b>未作为核心证明：</b>${esc(excluded||'无')}</p>${m.memory?`<p class="case-reflection">${esc(m.memory)}</p>`:''}<p class="small">一句谎言被解释清楚了，但它仍然不能替代主线里的死亡证据。</p>`);renderShell();mail();
}
function relationshipBoardHTML(){
  const viewed=D.people.filter(p=>S.peopleViewed.includes(p.id)||p.id==='jianglan');
  if(viewed.length<2)return `<article class="paper relation-board"><h3>人物之间</h3><p>先读至少两份人物档案。关系不会因为名单上有一条线就自动成为证据。</p></article>`;
  const rows=[];for(const p of viewed){for(const r of (p.relations||[]).slice(0,3))rows.push(`<li><b>${esc(p.name)}</b><span>—</span>${esc(r)}</li>`);}
  return `<article class="paper relation-board"><div class="kicker">RELATION NOTES · 只显示已读档案</div><h3>人物之间不是八座孤岛</h3><ul>${rows.slice(0,14).join('')}</ul><p class="memory-note">关系只说明他们为什么会互相影响；它从不自动说明谁该为死亡负责。</p></article>`;
}
function people(){
  $('#view').innerHTML=`<h2>人物档案</h2><p class="lede">八个人，八种不愿说出口的事。你可以记住一张脸，但不要把一张脸当作证据。</p>${relationshipBoardHTML()}<div class="people-grid">${D.people.map(p=>{const done=S.completedSides.includes(p.id),victim=p.id==='jianglan';return `<button class="person-card" data-person="${p.id}"><img src="assets/images/${p.images[0]}" alt="${esc(p.name)}档案照片"><span><b>${esc(p.name)}</b><small>${esc(p.role)}</small><em class="person-state ${done?'done':''}">${victim?'案件核心人物':done?'已核验':'待核验'}</em></span></button>`;}).join('')}</div>`;$$('[data-person]').forEach(x=>x.onclick=()=>personDetail(x.dataset.person));
}
function personDetail(id){
  const p=D.people.find(x=>x.id===id);if(!p)return people();if(!S.peopleViewed.includes(id))S.peopleViewed.push(id);save(false);
  const inv=D.sideInvestigations.find(x=>x.id===id),done=S.completedSides.includes(id),victim=id==='jianglan';
  $('#view').innerHTML=`<button id="backPeople" class="text-btn">← 返回人物</button><section class="person-detail"><div class="portrait-stack"><img src="assets/images/${p.images[0]}" alt="${esc(p.name)}人物档案照片">${p.images.slice(1).map(i=>`<img src="assets/images/${i}" alt="${esc(p.name)}相关写实档案照片">`).join('')}</div><div><div class="kicker">${esc(p.role)}</div><h2>${esc(p.name)}</h2><p class="lede">${esc(p.public)}</p>${p.quote?`<p class="person-quote">${esc(p.quote)}</p>`:''}${p.relations?.length?`<div class="relation-chips">${p.relations.map(r=>`<span>${esc(r)}</span>`).join('')}</div>`:''}${victim?`<article class="paper"><h3>当前已知</h3><p>${esc(p.secret)}</p><p>${esc(p.lie)}</p>${p.memory?`<p class="memory-note">${esc(p.memory)}</p>`:''}</article>`:done?`<article class="paper"><h3>核验完成</h3><p><b>隐藏事实：</b>${esc(p.secret)}</p><p><b>谎言真正指向：</b>${esc(p.lie)}</p>${p.memory?`<p class="memory-note">${esc(p.memory)}</p>`:''}</article>`:`<article class="paper"><h3>尚未核验</h3><p>公开档案只能告诉你这个人说了什么，不能告诉你为什么说谎。</p>${inv&&S.stage>=inv.stage?'<button id="goSide">发起双来源核验</button>':'<p class="small">推进案件后，更多材料会进入数字化目录。</p>'}</article>`}</div></section>`;
  $('#backPeople').onclick=people;if($('#goSide'))$('#goSide').onclick=()=>{discoverApp('mail');openApp('mail');};
}
const timelineSourceEvents=()=>{const corrected=S.solved.includes('p13');return [
  {id:'photo',time:'00:58',source:'相机独立时钟',body:'陈屿原片拍到旧塔灯光',reliable:'独立时钟'},
  {id:'broadcast',time:'00:31',source:'广播节目记录',body:'节目提前结束，江岚离开直播间',reliable:'台内节目时钟'},
  {id:'power',time:'01:11',source:'供电日志',body:'设备间高压支路恢复',reliable:'设备日志'},
  {id:'taxi',time:'00:34',source:'出租车计价器',body:'何闻小票：江岚上车',reliable:'独立计价器'},
  {id:'gate',time:corrected?'01:04':'00:53*',source:'门禁控制器',body:corrected?'已校正：控制器慢11分钟':'同步失败，必须先校正',reliable:corrected?'已校正':'需校准'},
  {id:'death',time:'00:54—01:03',source:'法医推定',body:'死亡窗口',reliable:'医学区间'},
  {id:'luchen',time:'00:42',source:'制作日志',body:'陆沉最后一条可核实台内记录',reliable:'台内日志'}
];};
function freeTimelineHTML(){const events=timelineSourceEvents();const map=Object.fromEntries(events.map(x=>[x.id,x]));const ids=S.timelineDraft.length===events.length&&S.timelineDraft.every(x=>map[x])?S.timelineDraft:events.map(x=>x.id);return `<div class="free-timeline" data-free-sort>${ids.map(id=>{const x=map[id];return `<div class="sort-item free-item" draggable="true" data-item="${x.id}"><span class="grip">⋮⋮</span><span><b>${esc(x.time)}</b> · ${esc(x.source)}<small>${esc(x.body)} · ${esc(x.reliable)}</small></span><span class="sort-actions"><button type="button" data-up>↑</button><button type="button" data-down>↓</button></span></div>`;}).join('')}</div>`;}
function bindFreeTimeline(){const box=$('[data-free-sort]');if(!box)return;const persist=()=>{S.timelineDraft=[...box.querySelectorAll('.sort-item')].map(x=>x.dataset.item);save(false);};let dragging=null;box.querySelectorAll('.sort-item').forEach(item=>{item.addEventListener('dragstart',()=>{dragging=item;item.classList.add('dragging');});item.addEventListener('dragend',()=>{item.classList.remove('dragging');dragging=null;persist();});item.addEventListener('dragover',e=>{e.preventDefault();if(!dragging||dragging===item)return;const r=item.getBoundingClientRect();box.insertBefore(dragging,e.clientY>r.top+r.height/2?item.nextSibling:item);});item.querySelector('[data-up]').onclick=()=>{const prev=item.previousElementSibling;if(prev){box.insertBefore(item,prev);persist();}};item.querySelector('[data-down]').onclick=()=>{const next=item.nextElementSibling;if(next){box.insertBefore(next,item);persist();}};});}
function timeline(){
  applyTheme('desk');
  const corrected=S.solved.includes('p13');
  $('#view').innerHTML=`<div class="timeline-workbench-head"><div><div class="kicker">MANUAL CHRONOLOGY BOARD</div><h2>四十二分钟 · 手工时间线</h2></div><div class="timeline-head-actions"><button id="cameraFx" class="text-btn">听一次相机快门校时</button><button id="shuffleTimeline" class="text-btn">恢复原始散乱顺序</button></div></div><p class="lede">系统不替你排序。把来自广播、计价器、相机、门禁、法医和供电日志的卡片拖到你认为正确的位置；这张工作台只是草稿，真正的推理仍要在推理桌提交。</p><div class="timeline-reliability"><span>独立时钟</span><span>台内日志</span><span>医学区间</span><span class="needs-fix">门禁：${corrected?'已校正为01:04':'仍显示00:53，待校准'}</span></div><article class="calibration-slip"><div><b>门禁校时草稿</b><small>控制器显示 00:53 · 已知慢 11 分钟</small></div><input id="timelineCalibration" placeholder="写下你换算的真实时刻" value="${esc(S.timelineCalibration||'')}"><button id="saveCalibration">夹进时间线</button></article>${freeTimelineHTML()}<article class="paper"><h3>为什么不直接给一条“标准时间线”</h3><p>不同系统各自记得一部分夜晚。相机、广播和计价器可以互相校验；门禁控制器出现同步失败，法医给的是一个区间。只有先判断时钟是否可信，排序才有意义。</p><p class="memory-note">时间线不是答案展示板。它应该允许你先排错，再重新排一次。</p></article>`;
  bindFreeTimeline();$('#cameraFx').onclick=()=>playFx('assets/audio/camera_shutter.wav',.34);$('#shuffleTimeline').onclick=()=>{S.timelineDraft=[];save(false);timeline();};const cal=$('#timelineCalibration');if(cal)cal.oninput=()=>{S.timelineCalibration=cal.value;save(false);};if($('#saveCalibration'))$('#saveCalibration').onclick=()=>{const ok=matchesGroups(S.timelineCalibration,[['01:04','1:04','0104']]);showModal(`<h3>校时草稿已夹入卷宗</h3><p>${ok?'这个换算与现有时钟证据可以彼此解释。可以回推理桌正式提交。':'这个时刻与“慢11分钟”的记录还对不上。草稿会保留，你可以继续改。'}</p>`);};
}
function notes(){$('#view').innerHTML=`<h2>调查笔记</h2><p class="lede">这里记录的是已经被证据确认的事实。没有被确认的怀疑，不会因为写得漂亮就变成结论。</p>${conceptsHTML()}${S.notes.map(n=>`<article class="note"><small>${esc(n.t)}</small><div>${esc(n.text)}</div></article>`).join('')||'<article class="paper">还没有确认事实。</article>'}`;}
function bookmarks(){$('#view').innerHTML=`<h2>收藏</h2><article class="paper"><p>跨站调查最容易丢的是“我刚才在哪见过这句话”。收藏只负责帮你记住，不替你判断。</p><p>城市记忆：<b>${S.eggs.length}/8</b></p></article>${S.bookmarks.map(x=>`<article class="bookmark">☆ ${esc(x)}</article>`).join('')||'<article class="paper">你可以在网页、论坛和证物旁点击“收藏”。</article>'}`;}
function bindBM(){$$('[data-bm]').forEach(b=>b.onclick=()=>{if(!S.bookmarks.includes(b.dataset.bm))S.bookmarks.push(b.dataset.bm);const egg=b.dataset.egg;if(egg&&!S.eggs.includes(egg))S.eggs.push(egg);save(false);renderShell();showModal(`<h3>${egg?'发现一段城市记忆':'已收藏'}</h3><p>${esc(b.dataset.bm)}</p>${egg?`<p class="small">这不是主线答案。它只是让临江这座城多留下一个普通人的声音。</p>`:''}`);});}
function hint(id=null){
  const p=id?D.puzzles.find(x=>x.id===id):currentPuzzle();if(!p||S.solved.includes(p.id))return toast('这条推理已经完成，或者主线事实已闭合。');
  const n=Math.min((S.hints[p.id]||0)+1,3);S.hints[p.id]=n;save(false);
  const leads=(D.leads?.[p.id]||[]);let extra='';
  if(n===1)extra='<p class="small">这一级只给思考方向，不告诉入口。</p>';
  if(n===2&&leads.length)extra=`<p class="small">可以留意这些词：${leads.map(x=>esc(x.label)).join(' / ')}</p>`;
  if(n===3&&leads.length){const candidate=leads.map(x=>x.app).find(x=>appMap[x]&&appAvailable(x)&&!appDiscovered(x));extra=`<p class="small">你已经使用三级提示。${candidate?`如果仍找不到入口，可以 <button data-hint-discover="${candidate}">直接恢复相关旧链接</button>`:'这一级已经非常接近解法。'}</p>`;}
  showModal(`<div class="kicker">${esc(p.title)} · ${n}/3级提示</div><h3>调查提示</h3><p>${esc(p.hints[n-1])}</p>${extra}`);
  const btn=$('[data-hint-discover]');if(btn)btn.onclick=()=>{discoverApp(btn.dataset.hintDiscover);$('#modal').classList.add('hidden');};
}
function finalEvidenceOK(q){const got=S.finalEvidence[q.id]||[];return evidenceSetOK(got,q);}
function final(){
  applyTheme('desk');
  if(S.solved.length<D.puzzles.length){$('#view').innerHTML=`<h2>终局卷宗尚未开放</h2><article class="paper"><p>还有 ${D.puzzles.length-S.solved.length} 个核心推理没有闭合。</p><p>你不需要把所有论坛帖子读完，也不需要找到全部彩蛋。只要让关键事实能够互相解释。</p><button id="backHome">回到推理桌</button></article>`;$('#backHome').onclick=home;return;}
  const groups=[];for(const q of D.endQuestions){let g=groups.find(x=>x.name===(q.section||'事实链'));if(!g){g={name:q.section||'事实链',items:[]};groups.push(g);}g.items.push(q);}
  let counter=0;
  $('#view').innerHTML=`<div class="report-head"><div><div class="kicker">FINAL INVESTIGATION REPORT</div><h2>终局调查报告</h2></div><div class="report-stamp">待提交</div></div><p class="lede">最后不再是“答九道题”。每一段结论都要用自己的话写，并勾出真正支撑它的材料。文字说得通、证据也对得上，才算一份可以交出去的调查报告。</p><article class="paper report-meta"><p>人物核验 ${S.completedSides.length}/7 · 三级提示 ${Object.values(S.hints).filter(x=>x>=3).length}题 · 报告尝试 ${S.finalAttempts||0}次</p></article><article class="report-summary"><label><span>案件摘要 · 40—220字</span><textarea id="finalSummary" maxlength="220" placeholder="不用写得像答案册。用你自己的话，说清江岚为什么来到旧塔、47秒为何被剪，以及谁最终跨过了那条线。">${esc(S.finalSummary||'')}</textarea></label><small id="summaryCount">${(S.finalSummary||'').length}/220</small></article><div class="final-sheet report-sections">${groups.map(g=>`<section class="report-section"><h3>${esc(g.name)}</h3>${g.items.map(q=>{counter++;return `<article class="final-question"><span>${counter}. ${esc(q.q)}</span><textarea data-final="${q.id}" placeholder="${esc(q.placeholder||'写下你的结论')}">${esc(S.finalAnswers[q.id]||'')}</textarea><div class="citation-title">引用能够证明这段话的材料</div>${evidenceOptions(q,'final')}</article>`;}).join('')}</section>`).join('')}</div><button id="submitFinal" class="primary-large">核对并生成结案报告</button>`;
  const fsu=$('#finalSummary'),fsc=$('#summaryCount');if(fsu){fsu.oninput=()=>{S.finalSummary=fsu.value;if(fsc)fsc.textContent=fsu.value.length+'/220';save(false);};}$$('[data-final]').forEach(t=>t.oninput=()=>{S.finalAnswers[t.dataset.final]=t.value;save(false);});
  $$('[data-final-ev]').forEach(c=>c.onchange=()=>{const id=c.dataset.finalEv;S.finalEvidence[id]=$$(`input[data-final-ev="${id}"]:checked`).map(x=>x.value);save(false);});
  $('#submitFinal').onclick=submitFinal;
}
function submitFinal(){
  const sum=String(S.finalSummary||'').trim();const summaryOK=sum.length>=40&&sum.length<=220&&matchesGroups(sum,[['江岚'],['47秒','四十七秒'],['陆沉']]);
  let badText=[],badEvidence=[];D.endQuestions.forEach((q,i)=>{const el=$(`[data-final="${q.id}"]`),v=el?.value||'';S.finalAnswers[q.id]=v;S.finalEvidence[q.id]=$$(`input[data-final-ev="${q.id}"]:checked`).map(x=>x.value);if(!matchesGroups(v,q.acceptGroups))badText.push(i+1);if(!finalEvidenceOK(q))badEvidence.push(i+1);});S.finalAttempts=(S.finalAttempts||0)+1;save(false);
  if(!summaryOK||badText.length||badEvidence.length){let parts=[];if(!summaryOK)parts.push('案件摘要需要40—220字，并清楚提到江岚、47秒和陆沉');if(badText.length)parts.push(`第 ${badText.join('、')} 项的文字结论仍缺关键事实`);if(badEvidence.length)parts.push(`第 ${badEvidence.join('、')} 项引用的材料不能支撑结论`);return toast(parts.join('；')+'。报告不会因为一句话听起来合理就自动通过。',false);}
  reviewFinalReport();
}
function reviewFinalReport(){
  playFx('assets/audio/paper_rustle.wav',.28);
  const evidenceLabel=(q,id)=>q.evidenceChoices?.find(x=>x.id===id)?.label||id;
  const groups=[];for(const q of D.endQuestions){let g=groups.find(x=>x.name===(q.section||'事实链'));if(!g){g={name:q.section||'事实链',items:[]};groups.push(g);}g.items.push(q);}
  $('#view').innerHTML=`<section class="report-review"><div class="report-head"><div><div class="kicker">REPORT PREVIEW</div><h2>结案报告 · 核对页</h2></div><div class="report-stamp ready">事实链闭合</div></div><p class="ending-lede">你把散落在十六年里的时间戳、旧链接、谎言和声音重新装订在一起。现在再读一遍：这不是答案册，而是一份会决定哪些事实被留下的档案。</p><article class="review-summary"><div class="kicker">案件摘要</div><p>${esc(S.finalSummary||'')}</p></article>${groups.map(g=>`<section class="review-section"><h3>${esc(g.name)}</h3>${g.items.map(q=>`<article><b>${esc(q.q)}</b><p>${esc(S.finalAnswers[q.id]||'')}</p><small>引用：${(S.finalEvidence[q.id]||[]).map(id=>esc(evidenceLabel(q,id))).join('；')}</small></article>`).join('')}</section>`).join('')}<div class="report-actions"><button id="reviseReport">返回修改</button><button id="confirmReport" class="primary-large">确认提交，进入档案公开选择</button></div></section>`;
  $('#reviseReport').onclick=final;$('#confirmReport').onclick=()=>{playFx('assets/audio/paper_rustle.wav',.34);endingChoice();};
}
function waveHTML(){const bars=[12,24,18,38,29,54,44,67,36,58,74,42,31,65,50,82,35,46,69,28,57,76,33,49,61,39,72,55,30,68,41,59,79,47,34,63,51,73,27,56,70,45,32,62,40,71,25];return `<div class="wave" aria-label="47秒档案波形">${bars.map(h=>`<i style="height:${h}%"></i>`).join('')}</div>`;}
function endingChoice(){
  const sideCount=S.completedSides.length,tier3=Object.values(S.hints).filter(x=>x>=3).length,best=sideCount>=7&&tier3===0;
  $('#view').innerHTML=`<section class="ending"><div class="kicker">CASE RESOLVED</div><h2>47秒已经恢复</h2><p class="ending-lede">${esc(D.endingCopy?.resolved||'47秒已经恢复。')}</p>${waveHTML()}<div class="audio-controls"><button id="play47">播放47秒档案音频</button><span id="audioNote">声音并非通关门槛；完整文字转录始终保留。</span></div><div class="doc transcript"><p>秦川：“七码不是频道号。”</p><p>江岚：“那是什么？”</p><p>秦川：“是旧塔下面第七个转接室。”</p><p>秦川：“2003年的那句话，是我播的。”</p><p>江岚：“那你为什么现在才找我？”</p><p>秦川：“因为有人又在删东西。”</p></div><h3>你要怎样留下这份档案？</h3><div class="ending-choice"><button data-end="full"><b>完整播出</b><small>姓名与材料全部公开。事实最完整，也会让无关隐私再次暴露。</small></button><button data-end="edit"><b>编辑之后</b><small>法律事实完整提交，只对与责任无关的私人身份最小化处理。</small></button>${best?'<button data-end="best"><b>不剪掉任何人 · 隐藏结局</b><small>不是“什么都公开”，而是不剪掉任何能够证明责任的事实。</small></button>':''}</div><article class="paper completion"><h3>隐藏结局条件</h3><p class="${sideCount>=7?'ok-text':'warn-text'}">人物核验 ${sideCount}/7 ${sideCount>=7?'✓':'— 可在调查请求箱补全'}</p><p class="${tier3===0?'ok-text':'warn-text'}">三级直接提示 ${tier3}题 ${tier3===0?'✓':'— 本轮无法进入隐藏结局'}</p></article></section>`;
  $('#play47').onclick=()=>{const a=$('#finalAudio');a.play().then(()=>{$('#audioNote').textContent='正在播放。你仍可以同时阅读转录。';}).catch(()=>{$('#audioNote').textContent='浏览器没有允许播放，已保留文字/波形模式。';});S.audioSeen=true;save(false);};$$('[data-end]').forEach(b=>b.onclick=()=>showEnding(b.dataset.end));
}
function showEnding(e){
  S.ending=e;save(false);const copy=D.endingCopy||{};
  const data={
    full:['《完整播出》',copy.full||'你选择完整公开。','秦川的旧身份再次被公开；苏曼承认旧稿删改；季衡接受设备责任调查。'],
    edit:['《编辑之后》',copy.edit||'你选择最小化无关身份。','秦悦只以“热线接线员”出现在公开记录中；何闻的无证运营没有成为猎奇新闻；梁启仍需为旧案的信息压制负责。'],
    best:['《不剪掉任何人》',copy.best||'节目安静七秒。','片尾没有公布秦川现在的住址，也没有替任何人洗白。节目只留下能够证明责任的事实。']
  }[e];
  $('#view').innerHTML=`<section class="ending"><div class="kicker">ENDING · ${e==='best'?'03':e==='edit'?'02':'01'}/03</div><h2>${data[0]}</h2><p class="ending-lede">${esc(data[1])}</p><article class="paper"><h3>人物后续</h3><p>${esc(data[2])}</p><p>陆沉因江岚死亡案进入重新调查程序；2003六码头事故另案重启责任复核。不是所有迟到的调查都能把时间还回来，但至少记录不必继续错下去。</p></article><img class="evidence-img ending-img" src="assets/images/rain_street.jpg" alt="雨后的临江旧城实景"><div class="footer-actions"><button data-act2="export">导出结案存档</button><button data-act2="restart">重新调查</button></div></section>`;$$('[data-act2]').forEach(b=>b.onclick=()=>b.dataset.act2==='restart'?reset():exportSave());
}
function showModal(html){$('#modalBody').innerHTML=html;$('#modal').classList.remove('hidden');}
function showIntro(){
  S.introSeen=true;save(false);
  showModal(`<div class="kicker">临江广播旧媒体数字化项目 · 夜班</div><h2>你不是警察。</h2><p>你只是负责把旧磁带、光盘和硬盘恢复成可检索文件的人。档案馆的工作通常很安静：听底噪，核时间码，给没有名字的文件补上日期。</p><p>今晚零点过后，值班室收到一块没有入库编号的旧硬盘。里面有两份2010年8月21日的《零点来电》。</p><p>一份比另一份短了四十七秒。</p><p class="quote">窗外的雨一直下。你把耳机戴好，第一次按下播放键。</p><button id="introClose" class="primary-large">打开档案</button>`);$('#introClose').onclick=()=>{$('#modal').classList.add('hidden');home();};
}
function exportSave(){const blob=new Blob([JSON.stringify(S,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='零点来电_调查存档_v2.3.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);}
function importSaveFile(file){const r=new FileReader();r.onload=()=>{try{const x=JSON.parse(r.result);if(!x||!Array.isArray(x.solved)||!Array.isArray(x.facts))throw Error('bad');S=migrate(x);localStorage.setItem(SAVE,JSON.stringify(S));showModal('<h3>存档导入成功</h3><p>旧记录已经接回当前版本。未发现的新入口会按你原来的阶段做兼容处理。</p>');renderShell();home();}catch(e){showModal('<h3>存档导入失败</h3><p>文件不是有效的《零点来电》调查存档。</p>');}};r.readAsText(file);}
function resourceCheck(){
  const status=$('#resourceStatus');let pending=0,fail=0;
  const refs=['assets/images/hero.jpg','assets/images/studio.jpg','assets/images/tower.jpg','assets/images/evidence_phone.jpg','assets/images/evidence_autopsy.jpg','assets/images/person_jianglan_1.jpg','assets/images/newsroom.jpg','assets/audio/rain_loop.wav','assets/audio/final_47s.wav','assets/audio/phone_line_117.wav','assets/audio/broadcast_2003_warning.wav','assets/audio/t7_roomtone.wav','assets/audio/tape_splice.wav','assets/audio/radio_fragment.wav','assets/audio/archive_roomtone.wav','assets/audio/newsroom_roomtone.wav','assets/audio/phone_exchange.wav','assets/audio/oa_relay.wav','assets/audio/paper_rustle.wav','assets/audio/camera_shutter.wav','assets/audio/thunder_distant.wav','assets/audio/tape_load.wav','assets/audio/radio_tuning.wav','assets/audio/reel_stop.wav','assets/audio/broadcast_signoff.wav','assets/audio/phone_ring_far.wav','assets/audio/keyboard_room.wav','assets/audio/tower_door.wav','assets/audio/modem_handshake.wav','assets/images/person_jianglan_1_v23.jpg','assets/images/person_luchen_1_v23.jpg','assets/images/person_jiheng_1_v23.jpg','assets/images/person_suman_1_v23.jpg','assets/images/person_qinyue_1_v23.jpg','assets/images/person_hewen_1_v23.jpg','assets/images/person_chenyu_1_v23.jpg','assets/images/person_liangqi_1_v23.jpg'];
  const finish=()=>{pending--;if(pending===0){status.textContent=fail?`本地资源自检 · ${fail}项异常（有文字兜底）`:'本地资源自检 · 正常';status.className=fail?'resource-warn':'resource-ok';}};
  refs.forEach(src=>{pending++;if(src.endsWith('.wav')){const a=new Audio();a.oncanplaythrough=finish;a.onerror=()=>{fail++;finish();};a.src=src;}else{const i=new Image();i.onload=finish;i.onerror=()=>{fail++;finish();};i.src=src;}});
}
function dataSelfTest(){
  const errors=[];const ids=new Set(D.puzzles.map(x=>x.id));
  if(D.puzzles.length!==15)errors.push('核心推理不是15项');
  if(D.people.length!==8)errors.push('人物不是8名');
  if(D.forum.length!==132)errors.push('论坛缓存不是132条');
  D.puzzles.forEach(p=>{
    if(!p.type)errors.push(`${p.id}缺type`);if(!p.answer)errors.push(`${p.id}缺answer`);if(!Array.isArray(p.facts))errors.push(`${p.id}缺facts`);
    if(['text','number','time','evidenceText','timelinePerson','causalText'].includes(p.type)&&!p.acceptGroups)errors.push(`${p.id}缺acceptGroups`);
    if(p.type==='fields'&&(!Array.isArray(p.fields)||p.fields.some(f=>!f.acceptGroups)))errors.push(`${p.id}多字段规则不完整`);
    if(['evidence','evidenceText'].includes(p.type)&&(!p.evidenceChoices||(!p.need&&!p.needAny&&!p.minEvidence)))errors.push(`${p.id}证据组合不完整`);
    if(['timeline','timelinePerson','causalText'].includes(p.type)&&(!p.answerOrder||!p.timelineItems))errors.push(`${p.id}时间/因果排序不完整`);
  });
  D.endQuestions.forEach(q=>{if(!q.id||!q.acceptGroups||!q.evidenceChoices||(!q.need&&!q.needAny&&!q.minEvidence))errors.push(`终局规则缺失 ${q.id||''}`);});
  Object.values(D.leads||{}).flat().forEach(x=>{if(x.app&&!appMap[x.app]&&!panels[x.app])errors.push(`提示引用未知入口 ${x.app}`);});
  D.sideInvestigations.forEach(x=>{if(!D.people.some(p=>p.id===x.id)||!x.acceptGroups||!Array.isArray(x.documents)||x.documents.length<3||!Array.isArray(x.needDocs)||x.needDocs.length!==2)errors.push(`人物核验异常 ${x.id}`);});
  return errors;
}
function pureFlowTest(){
  const errors=[];const tmp={stage:0,solved:[]};
  for(const p of D.puzzles){if(p.stage>tmp.stage)errors.push(`${p.id}在阶段${tmp.stage}不可达`);tmp.solved.push(p.id);const n=tmp.solved.length;tmp.stage=n>=15?7:n>=14?6:n>=12?5:n>=10?4:n>=7?3:n>=5?2:n>=2?1:0;}
  if(tmp.solved.length!==15||tmp.stage!==7)errors.push('主线无法推进到终局');
  return errors;
}
function start(newGame=false){
  if(newGame)S=initial();else load();
  $('#boot').classList.add('hidden');$('#game').classList.remove('hidden');renderShell();home();save(false);syncSoundscape();resourceCheck();if($('#soundBtn'))$('#soundBtn').textContent=S.soundEnabled?'声音：开启':'声音：关闭';
  const errs=[...dataSelfTest(),...pureFlowTest()];if(errs.length){console.error('ZERO_CALL_SELFTEST',errs);$('#resourceStatus').textContent=`数据自检 · ${errs.length}项异常`;$('#resourceStatus').className='resource-warn';}
  if(newGame&&!S.introSeen)showIntro();
}

$$('[data-act]').forEach(b=>b.onclick=()=>{
  if(b.dataset.act==='new')start(true);
  if(b.dataset.act==='continue'){if(load())start(false);else showModal('<h3>没有可继续的存档</h3><p>这台浏览器里还没有留下调查记录。</p>');}
  if(b.dataset.act==='reset')showModal('<h3>重置案件？</h3><p>这会清除当前浏览器里的调查进度。建议先导出存档。</p><button id="confirmReset" class="danger">确认重置</button>');
});
$('#modal').addEventListener('click',e=>{if(e.target.id==='confirmReset')reset();if(e.target.id==='modal')$('#modal').classList.add('hidden');});
$$('[data-panel]').forEach(b=>b.onclick=()=>{S.activeApp='panel-'+b.dataset.panel;applyTheme('desk');save(false);(panels[b.dataset.panel]||home)();renderShell();});
$('#portalBtn').onclick=()=>{S.portalOpen=!S.portalOpen;save(false);renderShell();};
$('#hintBtn').onclick=()=>hint();$('#saveBtn').onclick=exportSave;$('#importBtn').onclick=()=>$('#importFile').click();$('#importFile').onchange=e=>{if(e.target.files[0])importSaveFile(e.target.files[0]);};
$('#soundBtn').onclick=()=>{S.soundEnabled=!S.soundEnabled;save(false);syncSoundscape();$('#soundBtn').textContent=S.soundEnabled?'声音：开启':'声音：关闭';if(S.soundEnabled){playFx('assets/audio/thunder_distant.wav',.2);showModal('<h3>声音档案已开启</h3><p>雨声之外，不同旧网页会有各自的机房、编辑室或磁带底噪。所有关键声音仍保留文字与结构兜底。</p>');}};
$('.close').onclick=()=>$('#modal').classList.add('hidden');
window.addEventListener('error',e=>{const t=e.target;if(t&&t.tagName==='IMG'&&!t.dataset.fallback){t.dataset.fallback='1';t.src='assets/images/archive.jpg';t.alt=(t.alt||'图片')+'（原图加载异常，已显示写实档案占位图）';}if(t&&t.tagName==='AUDIO'){const status=$('#resourceStatus');if(status){status.textContent='音频资源异常 · 已启用文字兜底';status.className='resource-warn';}}},true);
setInterval(()=>{if($('#clock'))$('#clock').textContent=new Date().toLocaleString('zh-CN',{hour12:false});},1000);
$('[data-act="continue"]').disabled=!(localStorage.getItem(SAVE)||localStorage.getItem(LEGACY_SAVE));
})();
