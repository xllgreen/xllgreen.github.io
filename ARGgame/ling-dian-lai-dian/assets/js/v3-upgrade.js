(()=>{
'use strict';
const D=window.ZERO_DATA;
if(!D||typeof D!=='object')return;

// V3.0 数据层优化：不改变主线答案/证物ID，只改善文本自然度、容错与提示颗粒度。
const add=(arr,...vals)=>{
  if(!Array.isArray(arr))return;
  vals.flat().forEach(v=>{if(v!=null&&!arr.includes(v))arr.push(v);});
};

// 1) 论坛：保留132条内容和所有主线关键词，但去掉批量“年月闲聊#000”标题/账号模板感。
const handles=[
  '北门夜班','河堤二楼','旧城阿岑','93.7夜听','六码头家属','广电路住户','总站小卖部','西城修伞铺',
  '雨天不开窗','临江骑车人','东桥值夜','南市场摊主','老式收音机','沿江公交迷','晚班护士','城北胶片店',
  '码头风大','猫叫醒我','西城租客','老周修电器','电台门口','河堤散步','总站末班车','凌晨便利店',
  '旧城区停水群','一把坏雨伞','江边摄影','临江天气站','三中毕业生','北门IC卡','夜里听广播','桥下钓鱼人'
];
function forumTitle(post){
  const body=String(post.body||'').trim();
  const tag=(post.tags&&post.tags[0])||'临江';
  const first=(body.split(/[。！？!?]/)[0]||'').trim();
  const id=Number(post.id)||0;
  const lead=first.length>30?first.slice(0,25)+'…':first;
  const patterns=[
    ()=>`[${tag}] ${lead||'这两天有人注意吗'}`,
    ()=>`${tag}这边：${lead||'求个准信'}`,
    ()=>`刚从${tag}回来，${lead||'随手记一条'}`,
    ()=>`问个事｜${lead||tag}`,
    ()=>`${lead||tag+'今晚什么情况'}，有人也遇到吗`,
    ()=>`老临江人进｜${lead||tag}`,
    ()=>`路过${tag}看到的：${lead||'说不上来哪里不对'}`,
    ()=>`${tag}夜里一条｜${lead||'先留个记录'}`
  ];
  return patterns[id%patterns.length]();
}
if(Array.isArray(D.forum)){
  D.forum.forEach((p,i)=>{
    if(!p||typeof p!=='object')return;
    if(!p.egg&&/闲聊#\d+/i.test(String(p.title||'')))p.title=forumTitle(p);
    if(/^江城网友\d+$/i.test(String(p.author||'')))p.author=handles[i%handles.length];
  });
}

// 2) 核心谜题：一级提示只讲方法，二级提示指向材料类型，三级再接近答案；扩充自然语言容错。
const hint1={
  p1:'先把案件放一边，只做一次最普通的时长相减。',
  p2:'比较两个版本第一次出现“不连续”的位置，不要先猜是谁剪的。',
  p3:'把编号当成通信系统字段，而不是日期或密码。',
  p4:'数据库地址和2010年实际响铃位置可能不是同一个地方。',
  p5:'先问这件物品“谁能合法拿到”，再问目击者看见了什么。',
  p6:'先按时间戳排事实，不要按后来公开报道的叙述顺序排。',
  p7:'把都市传闻里的“七码”放回维修技术语境。',
  p8:'发现一个结构存在，不等于证明2010年还能通过它。',
  p9:'把法医死亡窗口的最晚值与危险电压恢复时刻直接比较。',
  p10:'先逐个排除“存在的伤害”是否真的足以致死，再看剩下的机制。',
  p11:'身份链要同时回答“秦悦为什么删号码”和“匿名者为何知道旧塔”。',
  p12:'把“接入方式是否合法”和“警告内容是真是假”分成两个问题。',
  p13:'门禁没有撒谎，只是它自己的钟慢了；先修正时钟再使用记录。',
  p14:'先固定所有独立时钟能证明的时刻，再看谁仍留在空白窗口里。',
  p15:'47秒的危险不在一句单独台词，而在它一次把几条原本分散的事实连起来。'
};
const hint2={
  p1:'公开版与自动备份的分钟数相同，差异只在最后的秒数。',
  p2:'看“结束语”前后：公开转录和自动备份波形在哪一处第一次分叉。',
  p3:'去电信维护镜像读“固定终端编号说明”。',
  p4:'一份材料应来自维护记录，另一份应来自当时实际使用者的城市记录。',
  p5:'把FM93.7周年庆发放记录和便利店目击放在一起。',
  p6:'新闻V1草稿与V3公开稿给了三条能直接排序的时间戳。',
  p7:'旧塔维修表里反复出现T7；论坛老职工也解释过这个俗称。',
  p8:'需要“当年封闭记录”与“2010现场封层状态”两类独立材料。',
  p9:'法医最晚死亡时刻是01:03，设备日志另有危险电压恢复时刻。',
  p10:'法医底稿给直接死亡方向；毒理或电气复核负责排除更醒目的假解释。',
  p11:'先完成人物核验中的秦悦，再回旧塔资料找秦川2003年的工作/设备关系。',
  p12:'顺序应从“风险先出现”开始，再到非法接入、广播警告与事后定性。',
  p13:'OA写明控制器同步失败并保持-11分钟偏差，把00:53向后补。',
  p14:'节目结束、出租车、陆沉最后台内记录、校正后门禁是四个关键节点。',
  p15:'回硬盘目录完成一次波形/转录/来源复核，再看身份、T7、2003三条线。'
};
if(Array.isArray(D.puzzles)){
  D.puzzles.forEach(p=>{
    if(!p||!p.id)return;
    if(Array.isArray(p.hints)){
      if(hint1[p.id])p.hints[0]=hint1[p.id];
      if(hint2[p.id])p.hints[1]=hint2[p.id];
    }
  });
  const by=id=>D.puzzles.find(p=>p.id===id);
  add(by('p2')?.acceptGroups?.[0],'片尾结束前','片尾结束语前','主持人结束语之前','正式片尾之前');
  add(by('p4')?.acceptGroups?.[0],'总站北门旁便利店','北门旁边便利店','原公话旁便利店');
  add(by('p7')?.acceptGroups?.[0],'T7旧转接室','第七号旧转接室','七码转接室','7号转接室');
  add(by('p10')?.acceptGroups?.[0],'机械窒息','压迫性窒息','外力窒息');
  add(by('p12')?.acceptGroups?.[2],'警告是真的','警告并非虚假','内容没有造假','风险确实存在');
  add(by('p13')?.acceptGroups?.[0],'凌晨1点04分','1点04分','一点零四分');
}

// 3) 人物核验：七条支线保留相同判定逻辑，但减少统一模板口吻，让不同职业/材料更像不同调查请求。
const sideBodies={
  qinyue:'热线纸本被改过一次，但改动本身不能证明共谋。把号码痕迹和她的人事关系附件分开读，再判断她究竟在替谁遮挡。',
  hewen:'计价器不关心司机有没有营业资格。先让小票回答“车去了哪里”，再让稽查记录回答“他为什么不肯承认”。',
  chenyu:'照片只能证明镜头里出现过的光和时间。把原片信息与设备/电视时钟旁证并排，不要要求镜头替你看见一个人。',
  suman:'新闻编辑留下的是版本差异，不是 confession。把草稿时间与公开版删改记录对在一起，区分她的职业责任与2010年的直接作案证据。',
  jiheng:'设备维护记录会留下手艺习惯，也会留下退休后的时间边界。判断他隐瞒旧塔问题，与判断他能否在案发窗口出现，是两件事。',
  liangqi:'旧案责任很重，因此更容易成为“看起来就像凶手”的人。先用独立记录处理2010时间窗，再讨论他2003年做过什么。',
  luchen:'制作日志、门禁和节目剪辑都指向同一个工作角色，但最终责任仍要靠时间链和47秒动机共同闭合。'
};
if(Array.isArray(D.sideInvestigations))D.sideInvestigations.forEach(m=>{if(sideBodies[m.id])m.body=sideBodies[m.id];});

// 4) 终局自然语言容错：仍要求每一条事实成立，不降低证据引用要求。
if(Array.isArray(D.endQuestions)){
  const q1=D.endQuestions.find(q=>q.id==='q1');
  if(q1){add(q1.acceptGroups?.[0],'匿名来电者','来电者身份');add(q1.acceptGroups?.[1],'7号转接','旧塔转接室','旧转接室');add(q1.acceptGroups?.[2],'2003事故真相','2003事故','旧事故','真实警告');}
  const q2=D.endQuestions.find(q=>q.id==='q2');
  if(q2){add(q2.acceptGroups?.[0],'第七号','七码');add(q2.acceptGroups?.[1],'旧转接室','转接位置','转接设备');}
  const q3=D.endQuestions.find(q=>q.id==='q3');
  if(q3){add(q3.acceptGroups?.[2],'警告并非虚假','内容真实','风险确实存在');}
}

// 5) 图片呈现顺序做“档案来源差异化”：避免八人列表清一色同构正面照；不删任何原图片。
const firstImageIndex={jianglan:1,qinyue:0,luchen:2,suman:1,jiheng:0,hewen:2,chenyu:1,liangqi:0};
if(Array.isArray(D.people))D.people.forEach(p=>{
  if(!Array.isArray(p.images)||p.images.length<2)return;
  const idx=firstImageIndex[p.id];
  if(Number.isInteger(idx)&&idx>0&&idx<p.images.length){const picked=p.images[idx];p.images=[picked,...p.images.filter(x=>x!==picked)];}
});

// 6) 数据审计结果供调试台读取。只验证升级层不会破坏主线结构。
const audit=[];
if(!Array.isArray(D.puzzles)||D.puzzles.length!==15)audit.push('核心推理节点数量异常');
if(!Array.isArray(D.endQuestions)||D.endQuestions.length<1)audit.push('终局问题缺失');
if(!Array.isArray(D.people)||D.people.length!==8)audit.push('人物档案数量异常');
if(!Array.isArray(D.sideInvestigations)||D.sideInvestigations.length!==7)audit.push('人物核验数量异常');
if(!Array.isArray(D.forum)||D.forum.length!==132)audit.push('论坛缓存数量异常');
window.ZERO_UPGRADE_AUDIT={version:'3.0.0',errors:audit,forumCount:D.forum?.length||0,puzzleCount:D.puzzles?.length||0};
})();


/* ---- V3 UI / accessibility / performance enhancement layer ---- */
(()=>{
'use strict';
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const view=$('#view');
const modal=$('#modal');
let raf=0,modalReturnFocus=null;
const audit=window.ZERO_UPGRADE_AUDIT||{errors:[]};
const siteNotes={
  archive:['恢复台批注','只读硬盘镜像。先比较文件时长、时间戳与转录断点；文件名不是结论。'],
  search:['缓存索引说明','这是2010年前后的网页快照索引，不是实时互联网。旧称、简称和错误拼写都可能比标准词更有用。'],
  radio:['站务页页脚','节目单、人员表和周年庆资料来自不同年份的旧官网备份，页面样式不保证一致。'],
  forum:['BBS只读缓存','头像和IP段没有完整恢复。帖子按原日期保留；生活闲聊与案件材料混在一起，没有“关键线索”标记。'],
  phone:['04交换区维护终端','线路编号比门牌地址稳定。迁移、转接和数据库更新可能发生在不同日期。'],
  news:['历史CMS版本库','草稿、送审稿与公开稿并排保存。版本差异只能证明编辑过程，不能单独证明谁在撒谎。'],
  tower:['T7维护离线页','结构图说明“有什么”，封存与现场复核说明“还能不能用”。两类材料不要混成一句。'],
  oa:['内部OA只读镜像','门禁、供电和制作日志使用不同设备时钟。出现同步失败时，先校时，再排列人物行动。'],
  lab:['技术检验副本','医学区间与设备日志回答的是不同问题。损伤存在，不等于它就是直接死因。'],
  mail:['补充调查请求箱','每条人物核验都要求两个独立来源。解释谎言只缩小嫌疑，不替代死亡责任证据。']
};
function lowPower(){
  try{return matchMedia('(prefers-reduced-motion: reduce)').matches||((navigator.hardwareConcurrency||8)<=4)||(navigator.deviceMemory&&navigator.deviceMemory<=4);}catch(e){return false;}
}
if(lowPower())document.documentElement.classList.add('low-power');

audit.errors=Array.isArray(audit.errors)?audit.errors:[];
function addFieldNote(){
  if(!view||!$('.site-chrome',view)||$('.field-note',view))return;
  const site=$('#game')?.dataset.site;
  const copy=siteNotes[site];
  if(!copy)return;
  const note=document.createElement('aside');
  note.className='field-note';
  note.setAttribute('aria-label','档案使用说明');
  note.innerHTML=`<span>${copy[0]}</span><p>${copy[1]}</p>`;
  const chrome=$('.site-chrome',view);
  chrome.insertAdjacentElement('afterend',note);
}
function evidenceMounts(){
  $$('.evidence-img',view).forEach((img,i)=>{
    img.loading='lazy';img.decoding='async';img.draggable=false;
    if(img.closest('.evidence-mount'))return;
    const fig=document.createElement('figure');fig.className='evidence-mount';fig.dataset.scan=String((i%9)+1).padStart(2,'0');
    img.parentNode.insertBefore(fig,img);fig.appendChild(img);
    const cap=document.createElement('figcaption');cap.textContent=img.alt||'案件数字化扫描副本';fig.appendChild(cap);
  });
}
function lazyMedia(){
  $$('img',view).forEach(img=>{if(!img.closest('.hero-panel'))img.loading='lazy';img.decoding='async';img.draggable=false;});
  $$('audio',view).forEach(a=>a.preload='none');
}
function forumRows(){
  $$('.forum-post',view).forEach((post,i)=>{
    if(post.dataset.row)return;
    post.dataset.row=String(i+1).padStart(2,'0');
    post.setAttribute('tabindex','0');
  });
}
function formA11y(){
  $$('input:not([type="file"]),textarea',view).forEach(el=>{
    el.autocomplete='off';el.spellcheck=false;
    if(!el.getAttribute('aria-label')){
      const ph=el.getAttribute('placeholder');
      if(ph)el.setAttribute('aria-label',ph);
    }
  });
  $$('button',view).forEach(b=>{if(!b.hasAttribute('type'))b.type='button';});
}
function siteSemantics(){
  const site=$('#game')?.dataset.site||'desk';
  view?.setAttribute('data-view-site',site);
  const chrome=$('.site-chrome',view);if(chrome)chrome.setAttribute('role','banner');
  const search=$('.search',view);if(search)search.setAttribute('role','search');
}
function enhanceRelationshipBoard(){
  const board=$('.relation-board',view);if(!board||board.dataset.enhanced)return;
  board.dataset.enhanced='1';
  $$('li',board).forEach((li,i)=>li.style.setProperty('--rel-index',i));
}
function enhanceTimeline(){
  $$('.sort-item',view).forEach((item,i)=>{
    item.setAttribute('aria-label',`时间卡片 ${i+1}，可拖拽或使用上下按钮调整顺序`);
    item.setAttribute('role','listitem');
  });
  const box=$('[data-free-sort]',view);if(box)box.setAttribute('role','list');
}
function puzzleMethods(){
  const map={text:'文字判断',number:'时长计算',time:'时间校准',fields:'多字段核验',evidence:'证据组合',evidenceText:'结论＋证据',timeline:'手工排序',timelinePerson:'时间线＋人物',causalText:'因果排序＋解释'};
  (window.ZERO_DATA?.puzzles||[]).forEach(p=>{
    const card=document.getElementById(p.id);if(!card||card.querySelector('.puzzle-method'))return;
    const tag=document.createElement('span');tag.className='puzzle-method';tag.textContent=map[p.type]||'交叉核验';
    const head=card.querySelector('.kicker');head?.insertAdjacentElement('afterend',tag);
  });
}
function markSiteButtons(){
  const site=$('#game')?.dataset.site;
  $$('[data-app]').forEach(b=>b.toggleAttribute('aria-current',b.dataset.app===site));
}
function finalReportGuidance(){
  const box=$('#finalSummary',view);if(!box||$('.summary-requirements',view))return;
  const note=document.createElement('p');note.className='summary-requirements';
  note.textContent='报告格式：40—220字，并明确写出江岚、47秒和陆沉之间的关系。这里检查的是摘要是否完整，不要求背诵固定句式。';
  box.closest('.report-summary')?.appendChild(note);
}
function updateResourceBadge(){
  const status=$('#resourceStatus');if(!status)return;
  status.dataset.build='3.0.0';
  if(audit.errors.length){status.className='resource-warn';status.textContent=`数据升级自检 · ${audit.errors.length}项异常`;status.title=audit.errors.join('；');}
}
function enhance(){
  if(!view)return;
  addFieldNote();evidenceMounts();lazyMedia();forumRows();formA11y();siteSemantics();enhanceRelationshipBoard();enhanceTimeline();puzzleMethods();markSiteButtons();finalReportGuidance();updateResourceBadge();
  document.documentElement.classList.add('upgrade-ready');
}
function schedule(){if(raf)return;raf=requestAnimationFrame(()=>{raf=0;enhance();});}
if(view){new MutationObserver(schedule).observe(view,{childList:true,subtree:true});}
if($('#game'))new MutationObserver(schedule).observe($('#game'),{attributes:true,attributeFilter:['data-site']});
if(modal){
  new MutationObserver(()=>{
    if(modal.classList.contains('hidden')){
      if(modalReturnFocus&&document.contains(modalReturnFocus))setTimeout(()=>modalReturnFocus.focus({preventScroll:true}),0);
      modalReturnFocus=null;return;
    }
    if(!modalReturnFocus&&!modal.contains(document.activeElement))modalReturnFocus=document.activeElement;
    const title=$('h1,h2,h3',modal);if(title&&!title.id)title.id='modalTitle';
    const focus=$('button,input,textarea,select,[tabindex]:not([tabindex="-1"])',modal);if(focus)setTimeout(()=>focus.focus({preventScroll:true}),0);
  }).observe(modal,{attributes:true,attributeFilter:['class'],childList:true,subtree:true});
}
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&modal&&!modal.classList.contains('hidden')){modal.classList.add('hidden');return;}
  if(e.key==='Tab'&&modal&&!modal.classList.contains('hidden')){
    const items=$$('button:not([disabled]),input:not([disabled]),textarea:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])',modal).filter(x=>x.offsetParent!==null);
    if(items.length){const first=items[0],last=items[items.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}
  }
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){
    const q=$('#q')||$('#fq')||$('#addressGuess');if(q){e.preventDefault();q.focus();q.select?.();}
  }
});
document.addEventListener('click',e=>{
  const p=e.target.closest?.('[data-panel]');if(p){$$('[data-panel]').forEach(b=>b.removeAttribute('aria-current'));p.setAttribute('aria-current','page');}
});
window.addEventListener('pageshow',schedule);
schedule();
})();
