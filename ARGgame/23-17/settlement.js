(() => {
'use strict';
const api=window.__G2317__;
if(!api){console.error('[23:17 settlement] game bridge unavailable');return;}
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const CORE_FACTS=['LOOP','HELP','ZHOU','REPAIRMAN','FENG','ARGUMENT','MASTER_KEY','CAMERA','EVIDENCE_LOCATION','ROOFTOP','FENG_MOTIVE','POLICE_NEED_PROOF','CONFESSION_ROUTE','TRUE_CAUSE'];
const FACT_GROUPS=[
 {name:'人物 / 动机',ids:['ZHOU','FENG','FENG_MOTIVE','ZHOU_PLAN','DU_MESSAGE','SAFE_HANDOFF']},
 {name:'时间 / 路线',ids:['REPAIRMAN','ARGUMENT','ROOFTOP','BACKUP_TIME','ELEVATOR_LOG','FIRE_DOOR']},
 {name:'证据 / 权限',ids:['MASTER_KEY','CAMERA','EVIDENCE_LOCATION','POLICE_NEED_PROOF','CONFESSION_ROUTE','WORKORDER_ANOMALY','ACCESS_PATTERN','PRIOR_VISIT','CAMERA_SERIAL','REDUNDANT_BACKUP','PUBLIC_RECORD','GUARD_WATCH']},
 {name:'循环 / 异常',ids:['LOOP','HELP','TRUE_CAUSE','SMS_ANOMALY','DELAYED_SEND','CLOCK_DRIFT']}
];
const ENDING_IDS={
 '《活到明天》':'LIVE','《先离开这里》':'ESCORT','《云端还亮着》':'BACKUP',
 '《证据》':'EVIDENCE','《有人来接她》':'ESCORT','《记录不会说谎》':'RECORD','《第三份备份》':'BACKUP',
 '《你为什么记得？》':'WHY','《23:16 从未发送》':'SMS'
};
const ENDING_NAMES={LIVE:'《活到明天》',EVIDENCE:'《证据》',WHY:'《你为什么记得？》',RECORD:'《记录不会说谎》',ESCORT:'《有人来接她》',BACKUP:'《第三份备份》',SMS:'《23:16 从未发送》'};
let renderTimer=0,rendering=false,originalStartContinue=null;
function factSet(s){return new Set([...(s.meta?.knowledge||[]),...(s.meta?.factGraph||[])]);}
function totalFacts(){return new Set(FACT_GROUPS.flatMap(g=>g.ids)).size;}
function endingTier(title){
 if(/你为什么记得|23:16 从未发送/.test(title))return{key:'hidden',label:'隐藏结局',mark:'异常仍在'};
 if(/证据|有人来接她|记录不会说谎|第三份备份/.test(title))return{key:'truth',label:'真相结局',mark:'证据闭合'};
 return{key:'survival',label:'生还结局',mark:'明天存在'};
}
function summaryLine(tier,title){
 if(tier.key==='hidden')return title.includes('23:16 从未发送')?'你让23:18出现，也终于看见了那条求救短信不属于正常时间。':'你让23:18出现，也摸到了循环留下的一处裂缝。';
 if(tier.key==='truth')return '你不只把周妍留在了明天，也让足够多的事实彼此作证。';
 return '你把明天留给了周妍；今晚仍有一些事实没有完全闭合。';
}
function missingGroups(s){const known=factSet(s);return FACT_GROUPS.map(g=>({name:g.name,count:g.ids.filter(id=>!known.has(id)).length})).filter(x=>x.count>0);}
function hintUnlocked(s){return Object.values(s.meta?.hints||{}).reduce((sum,n)=>sum+Math.max(0,Math.min(3,Number(n)||0)),0);}
function timelineCount(s){return Math.min(8,new Set(s.meta?.timelineKnown||[]).size);}
function recordFromState(s,title){
 const tier=endingTier(title),known=factSet(s),missing=missingGroups(s),l=s.loopState||{};
 return{
  version:1,title,tier:tier.key,tierLabel:tier.label,tierMark:tier.mark,loop:Math.max(1,Number(s.loop)||1),actions:Math.max(0,Number(s.meta?.totalActions)||0),
  coreKnown:(s.meta?.knowledge||[]).filter(x=>CORE_FACTS.includes(x)).length,coreTotal:CORE_FACTS.length,knownTotal:[...known].filter(id=>FACT_GROUPS.some(g=>g.ids.includes(id))).length,factTotal:totalFacts(),
  timeline:timelineCount(s),hints:hintUnlocked(s),missing,zhou:l.zhouSafe?'安全':'状态未确认',evidence:l.evidence?'已保全':known.has('EVIDENCE_LOCATION')?'位置已确认':'未取得',feng:l.fengDetained?'已控制':'未控制',loopStatus:'已终止',summary:summaryLine(tier,title),endingId:ENDING_IDS[title]||'',createdAt:Date.now()
 };
}
function sameRecord(a,b){return a&&b&&a.title===b.title&&a.loop===b.loop&&a.actions===b.actions&&a.knownTotal===b.knownTotal;}
function persistRecord(record){
 const s=api.getState();s.meta=s.meta||{};const arr=Array.isArray(s.meta.nightRecords)?s.meta.nightRecords.filter(x=>x&&typeof x==='object'):[];
 if(!sameRecord(arr[arr.length-1],record))arr.push(record);s.meta.nightRecords=arr.slice(-20);api.setState(s);return s.meta.nightRecords;
}
function getRecords(){const s=api.getState();return Array.isArray(s.meta?.nightRecords)?s.meta.nightRecords:[];}
function currentRecord(){const records=getRecords();return records[records.length-1]||null;}
function missedHTML(record){
 if(!record.missing?.length)return '<div class="night-complete">今晚能被稳定确认的记录已经完整。你仍可以选择不同的做法，看它会留下什么结果。</div>';
 return `<div class="night-missing"><div class="night-section-label">这一晚还有什么没看见</div><p>仍有一些稳定事实没有被你确认。这里不直接显示答案，只告诉你它们属于哪一类。</p><div class="night-chips">${record.missing.map(x=>`<span>${esc(x.name)} <b>×${x.count}</b></span>`).join('')}</div></div>`;
}
function recordHTML(record,compact=false){
 if(!record)return '<div class="night-empty">还没有留下可以回看的今夜记录。</div>';
 const status=[['周妍',record.zhou],['证据',record.evidence],['冯川',record.feng],['循环',record.loopStatus]];
 return `<article class="night-record ${compact?'compact':''}">
  <div class="night-record-head"><div><span class="night-tier tier-${esc(record.tier)}">${esc(record.tierLabel)}</span><h3>${esc(record.title)}</h3></div><span class="night-mark">${esc(record.tierMark)}</span></div>
  <p class="night-summary">${esc(record.summary)}</p>
  <div class="night-metrics"><div><span>循环</span><strong>${record.loop}</strong><small>轮</small></div><div><span>核心事实</span><strong>${record.coreKnown}/${record.coreTotal}</strong></div><div><span>时间线</span><strong>${record.timeline}/8</strong></div><div><span>行动</span><strong>${record.actions}</strong><small>次</small></div></div>
  <div class="night-status">${status.map(([k,v])=>`<div><span>${k}</span><b>${esc(v)}</b></div>`).join('')}</div>
  ${compact?'':`<div class="night-footnote">提示记录：共解锁 ${record.hints} 级提示。提示只用于回看，不改变结局层级。</div>${missedHTML(record)}`}
 </article>`;
}
function archiveHTML(){const records=getRecords();if(!records.length)return recordHTML(null);return `<div class="night-archive"><div class="night-archive-note">这里只记录你真正到达过的结果，不展示尚未触发的结局名称。</div>${[...records].reverse().map((r,i)=>`<div class="night-archive-item"><span class="night-archive-index">${String(records.length-i).padStart(2,'0')}</span>${recordHTML(r,true)}</div>`).join('')}</div>`;}
function showArchive(){const modal=$('#modal');if(!modal)return;$('#modalTitle').textContent='今夜记录';$('#modalBody').innerHTML=archiveHTML();modal.classList.remove('hidden');}
function ensureStartArchiveButton(){
 const actions=$('#startScreen .start-actions');if(!actions)return;let b=$('#startRecordsBtn');const records=getRecords(),has=records.length>0;
 if(!has){if(b)b.remove();return;}if(!b){b=document.createElement('button');b.id='startRecordsBtn';b.className='start-secondary night-start-records';b.textContent='回看今夜记录';b.onclick=showArchive;const settings=$('#startSettingsBtn');actions.insertBefore(b,settings||null);}
 const newBtn=$('#startNewBtn'),cont=$('#startContinueBtn'),s=api.getState();
 if(newBtn){newBtn.textContent='从22:47重新经历';newBtn.onclick=()=>prepareFreshRun(false);}
 if(cont&&(Number(s.time)>=23*60+17||cont.disabled)){cont.disabled=false;cont.textContent=Number(s.time)>=23*60+17?'从下一次22:47继续':'沿着记录继续';cont.onclick=Number(s.time)>=23*60+17?()=>prepareFreshRun(false):(originalStartContinue||cont.onclick);}
}
function prepareFreshRun(showTitle){
 const prev=api.getState(),endings=Array.isArray(prev.meta?.endingsSeen)?[...prev.meta.endingsSeen]:[],records=Array.isArray(prev.meta?.nightRecords)?[...prev.meta.nightRecords]:[];
 api.resetGame();const fresh=api.getState();fresh.meta.endingsSeen=endings;fresh.meta.nightRecords=records;fresh.meta.factGraph=[];api.setState(fresh);
 const end=$('#ending');if(end)end.classList.add('hidden');ensureStartArchiveButton();
 if(showTitle){$('#startScreen')?.classList.remove('hidden');const sub=$('#startSubtitle');if(sub)sub.textContent='23:17已经过去。记录还在，但下一次22:47尚未开始。';const cont=$('#startContinueBtn');if(cont){cont.disabled=false;cont.textContent='沿着记录继续';cont.onclick=originalStartContinue||cont.onclick;}}
 else if(originalStartContinue){originalStartContinue.call($('#startContinueBtn'));}
 else{$('#startScreen')?.classList.add('hidden');$('#commandInput')?.focus();}
}
function support(){const modal=$('#modal');if(!modal)return;$('#modalTitle').textContent='自愿支持';$('#modalBody').innerHTML='<p>完整游戏与全部结局不因付款受限。正式上线时可在这里接入你的自愿支持方式。</p>';modal.classList.remove('hidden');}
function wireEndingActions(){const actions=$('#ending .ending-actions');if(!actions)return;actions.innerHTML='<button id="nightArchiveBtn" class="ghost">回看今夜记录</button><button id="nightRestartBtn" class="primary">从22:47重新经历</button><button id="nightTitleBtn" class="ghost">回到标题</button><button id="nightSupportBtn" class="ghost night-support">自愿支持</button>';$('#nightArchiveBtn').onclick=showArchive;$('#nightRestartBtn').onclick=()=>prepareFreshRun(false);$('#nightTitleBtn').onclick=()=>prepareFreshRun(true);$('#nightSupportBtn').onclick=support;}
function renderSettlement(){
 if(rendering)return;const end=$('#ending'),title=$('#endingTitle');if(!end||end.classList.contains('hidden')||!title?.textContent.trim())return;
 rendering=true;try{
  const s=api.getState(),record=recordFromState(s,title.textContent.trim()),records=persistRecord(record),card=end.querySelector('.ending-card');if(!card)return;
  let wrap=$('#nightSettlement');if(!wrap){wrap=document.createElement('section');wrap.id='nightSettlement';wrap.className='night-settlement';const stats=$('#endingStats');stats?.insertAdjacentElement('afterend',wrap);}
  wrap.innerHTML=`<div class="night-rule"><span>23:18</span><i></i><span>今夜记录</span></div>${recordHTML(record,false)}<div class="night-archive-count">已留下 ${records.length} 份今夜记录 · 结局名称只在你真正到达后归档</div>`;
  const stats=$('#endingStats');if(stats)stats.classList.add('night-original-stats');wireEndingActions();ensureStartArchiveButton();end.dataset.nightSettlement='1';
 }finally{rendering=false;}
}
function scheduleRender(){clearTimeout(renderTimer);renderTimer=setTimeout(renderSettlement,0);}
function migrateLegacyFinishedState(){
 const s=api.getState();if((s.meta?.nightRecords||[]).length||Number(s.time)!==23*60+17)return;const l=s.loopState||{};let title='';
 if(l.evidence&&l.policeCalled&&l.fengDetained&&l.warnedZhou&&(l.confession||(s.meta?.knowledge||[]).includes('CONFESSION_ROUTE')))title=(s.meta?.knowledge||[]).includes('TRUE_CAUSE')&&((s.meta?.knowledge||[]).length>=CORE_FACTS.length)?'《你为什么记得？》':'《证据》';
 else if(l.evidence&&l.policeCalled&&l.warnedZhou)title='《活到明天》';if(!title)return;persistRecord(recordFromState(s,title));
}
function setup(){
 originalStartContinue=$('#startContinueBtn')?.onclick||null;migrateLegacyFinishedState();ensureStartArchiveButton();const end=$('#ending'),title=$('#endingTitle');if(end)new MutationObserver(()=>{if(!end.classList.contains('hidden'))scheduleRender();}).observe(end,{attributes:true,attributeFilter:['class']});if(title)new MutationObserver(scheduleRender).observe(title,{childList:true,characterData:true,subtree:true});
 document.addEventListener('click',e=>{if(e.target?.id==='startResetBtn'||e.target?.id==='doReset')setTimeout(ensureStartArchiveButton,80)},true);
 if(end&&!end.classList.contains('hidden'))scheduleRender();
}
setup();
if(location.search.includes('qa=1'))window.__G2317_SETTLEMENT__={recordFromState,endingTier,missingGroups,persistRecord,getRecords,renderSettlement,prepareFreshRun,archiveHTML};
})();
