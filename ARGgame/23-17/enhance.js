(() => {
'use strict';
const api=window.__G2317__;
if(!api){console.error('[23:17 enhance] QA bridge unavailable');return;}
try{if(window.__G2317_QA_QUERY_ADDED__){const u=new URL(location.href);u.searchParams.delete('qa');history.replaceState(null,'',u.href)}}catch(e){}
const $=(s)=>document.querySelector(s);
const SAVE_KEY='game2317_save_v2', OLD_SAVE='game2317_save_v1';
const XFACTS={
 WORKORDER_ANOMALY:'704报修工单在22:41由匿名来电创建，项目写的是“烟感线路”。',
 ACCESS_PATTERN:'冯川近三周四次夜间进入七楼，只有两次能对应真实住户报修。',
 PRIOR_VISIT:'705住户记得冯川前一周也在深夜来过，说是“统一检查烟感”。',
 CAMERA_SERIAL:'偷拍模块序列号与物业更换过的一批烟感设备采购号段相连。',
 BACKUP_TIME:'存储卡最后一次完整备份完成于22:59；23:03发生的并不是第一次备份。',
 ZHOU_PLAN:'周妍原计划第二天和同事小杜一起去派出所，她没有约冯川今晚谈判。',
 DU_MESSAGE:'22:35，周妍给小杜留过一句：“如果我明天没到，把共享盘交给警察。”',
 ELEVATOR_LOG:'23:08电梯停过七楼，但没有人下行；之后离开704的人走的是消防楼梯。',
 FIRE_DOOR:'23:10，通往天台的消防门报警被一枚物业权限钥匙短暂解除。',
 SMS_ANOMALY:'23:16求救短信只有本机收到记录，没有正常的发件侧送达回执。',
 DELAYED_SEND:'周妍手机里有一条22:59保存的延时求救草稿，收件人只写了“703”。',
 CLOCK_DRIFT:'第二轮之后，求救短信的本地日期会保留上一轮日期，与系统时间恰好错开一轮。',
 SAFE_HANDOFF:'小杜答应赶来接周妍，并在楼下等她，不让她再独自面对冯川。',
 REDUNDANT_BACKUP:'偷拍视频、工单照片和录音被复制到两个独立位置，不再只有一张存储卡。',
 PUBLIC_RECORD:'门禁、工单、电梯与消防门记录被整理成同一份可核对的时间证据。',
 GUARD_WATCH:'老赵收到明确姓名和时间点后，决定守住一楼出口并保留监控。'
};
const CHAINS=[
 {id:'access',name:'身份 / 权限',nodes:[['REPAIRMAN','维修员在22:50前后进入七楼'],['FENG','维修员身份：冯川'],['WORKORDER_ANOMALY','异常报修工单'],['ACCESS_PATTERN','夜间门禁模式'],['PRIOR_VISIT','705的前次目击'],['MASTER_KEY','704物业钥匙']]},
 {id:'evidence',name:'偷拍 / 证据',nodes:[['CAMERA','烟感里的偷拍设备'],['CAMERA_SERIAL','设备序列号来源'],['EVIDENCE_LOCATION','吊顶里的存储卡'],['BACKUP_TIME','22:59备份时间'],['FENG_MOTIVE','冯川的取证动机'],['REDUNDANT_BACKUP','证据冗余备份']]},
 {id:'human',name:'周妍 / 信任',nodes:[['ZHOU','704住户：周妍'],['HELP','23:16求救'],['ZHOU_PLAN','她原本的报警计划'],['DU_MESSAGE','小杜收到的预警'],['SAFE_HANDOFF','同伴接应方案']]},
 {id:'route',name:'行动 / 路线',nodes:[['ARGUMENT','22:56争执'],['ELEVATOR_LOG','23:08电梯空停'],['ROOFTOP','最终路线指向天台'],['FIRE_DOOR','23:10物业权限开门'],['TRUE_CAUSE','循环与23:17死亡相关'],['GUARD_WATCH','一楼出口监看']]},
 {id:'loop',name:'循环 / 异常',nodes:[['LOOP','23:17→22:47'],['SMS_ANOMALY','求救短信缺少发件回执'],['DELAYED_SEND','22:59延时求救草稿'],['CLOCK_DRIFT','短信日期错开一轮'],['TRUE_CAUSE','死亡是循环锚点']]}
];
const TRACKS={
 HOME:{files:['assets/bgm/home.mp3','assets/bgm/home.ogg'],label:'703 夜归'},
 CORRIDOR:{files:['assets/bgm/corridor.mp3','assets/bgm/corridor.ogg'],label:'七楼 白灯'},
 ROOM704:{files:['assets/bgm/room704.mp3','assets/bgm/room704.ogg'],label:'704 未关的台灯'},
 STAIR:{files:['assets/bgm/staircase.mp3','assets/bgm/staircase.ogg'],label:'消防楼梯 回声'},
 ROOF:{files:['assets/bgm/rooftop.mp3','assets/bgm/rooftop.ogg'],label:'天台 23:17'},
 GROUND:{files:['assets/bgm/ground.mp3','assets/bgm/ground.ogg'],label:'一楼 夜班'}
};
const LOCATION_TRACK={FOYER:'HOME',LIVING:'HOME',BEDROOM:'HOME',KITCHEN:'HOME',BATHROOM:'HOME',CORRIDOR_7F:'CORRIDOR',ELEVATOR:'CORRIDOR',ROOM_704:'ROOM704',STAIRCASE:'STAIR',ROOFTOP:'ROOF',LOBBY:'GROUND',PROPERTY_OFFICE:'GROUND',CONVENIENCE_STORE:'GROUND'};
let currentTrack='', activeAudio=0, bgmStarted=false, bgmSwitchToken=0;
const audios=[new Audio(),new Audio()];
audios.forEach(a=>{a.loop=true;a.preload='auto';a.volume=0;a.setAttribute('playsinline','')});
function bgmEnabled(){return localStorage.getItem('g2317_bgm')!=='off'}
function bgmVolume(){const v=Number(localStorage.getItem('g2317_bgm_volume')||34);return Math.max(0,Math.min(100,v))/100}
function trackForState(){const s=api.getState();return LOCATION_TRACK[s.location]||'HOME'}
function setBgmBadge(text){const badge=$('#bgmBadge');if(badge)badge.textContent=text}
function fadeAudio(a,to,d=450){const from=a.volume,start=performance.now();function tick(now){const p=Math.min(1,(now-start)/d);a.volume=from+(to-from)*p;if(p<1)requestAnimationFrame(tick);else if(to===0)a.pause()}requestAnimationFrame(tick)}
async function playTrackSource(audio,files){let lastError=null;for(const src of files){try{audio.pause();audio.removeAttribute('src');audio.load();audio.src=src;audio.currentTime=0;audio.volume=0;await audio.play();return src}catch(err){lastError=err;try{audio.pause()}catch(e){}}}throw lastError||new Error('No playable BGM source')}
function switchBgm(force=false){const key=trackForState(),spec=TRACKS[key];if(!spec)return;setBgmBadge(`声场 · ${spec.label}`);if(!bgmStarted)return;if(!bgmEnabled()){setBgmBadge('声场 · 已关闭');return}const active=audios[activeAudio];if(key===currentTrack&&!force&&!active.paused)return;const token=++bgmSwitchToken,next=1-activeAudio,incoming=audios[next],outgoing=audios[activeAudio];playTrackSource(incoming,spec.files).then(()=>{if(token!==bgmSwitchToken){incoming.pause();return}currentTrack=key;fadeAudio(outgoing,0,650);fadeAudio(incoming,bgmVolume(),800);activeAudio=next;setBgmBadge(`声场 · ${spec.label}`)}).catch(err=>{if(token!==bgmSwitchToken)return;currentTrack='';setBgmBadge(`声场 · ${spec.label} · 点击继续启用`);console.warn('[23:17 BGM] playback blocked or unsupported',err)})}
function startBgm(){bgmStarted=true;currentTrack='';if(!bgmEnabled()){setBgmBadge('声场 · 已关闭');return}switchBgm(true)}
function applyBgmSetting(){if(!bgmEnabled()){bgmSwitchToken++;currentTrack='';audios.forEach(a=>fadeAudio(a,0,250));setBgmBadge('声场 · 已关闭');return}if(!bgmStarted)return;const a=audios[activeAudio];if(a.paused||!currentTrack)switchBgm(true);else{fadeAudio(a,bgmVolume(),200);const spec=TRACKS[currentTrack];if(spec)setBgmBadge(`声场 · ${spec.label}`)}}
function retryBgmFromGesture(){if(!bgmStarted||!bgmEnabled())return;const a=audios[activeAudio];if(!currentTrack||a.paused)switchBgm(true)}
document.addEventListener('pointerdown',retryBgmFromGesture,{capture:true,passive:true});
document.addEventListener('keydown',retryBgmFromGesture,{capture:true});
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&bgmStarted&&bgmEnabled()&&(!currentTrack||audios[activeAudio].paused))setBgmBadge('声场 · 点击继续启用')});
function getState(){return api.getState()}
function setState(s){api.setState(s);updateFactStats()}
function factSet(s=getState()){const arr=s.meta&&Array.isArray(s.meta.factGraph)?s.meta.factGraph:[];return new Set(arr)}
function hasFact(id,s=getState()){return (s.meta.knowledge||[]).includes(id)||factSet(s).has(id)}
function addFact(id){if(!XFACTS[id])return false;const s=getState();s.meta.factGraph=Array.isArray(s.meta.factGraph)?s.meta.factGraph:[];if(s.meta.factGraph.includes(id))return false;s.meta.factGraph.push(id);setState(s);return true}
function addStrategy(name,fact){const s=getState();s.loopState.expansionStrategy={...(s.loopState.expansionStrategy||{}),[name]:true};s.meta.strategyLoops={...(s.meta.strategyLoops||{})};s.meta.strategyLoops[s.loop]={...(s.meta.strategyLoops[s.loop]||{}),[name]:true};if(fact){s.meta.factGraph=Array.isArray(s.meta.factGraph)?s.meta.factGraph:[];if(!s.meta.factGraph.includes(fact))s.meta.factGraph.push(fact)}setState(s)}
function strategy(name,s=getState()){return !!(s.loopState.expansionStrategy&&s.loopState.expansionStrategy[name])}
function now(){return ($('#clock')&&$('#clock').textContent)||'22:47'}
function logX(text,type='normal',player=false){const log=$('#log');if(!log)return;const d=document.createElement('div');d.className=`entry ${type} exp-log`;const safe=String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])).replace(/\n/g,'<br>');d.innerHTML=`<span class="time">${now()}</span>${player?'&gt; ':''}${safe}`;log.appendChild(d);log.scrollTop=log.scrollHeight}
function spend(minutes){if(minutes>0)api.advance(minutes);else api.setState(api.getState())}
function location(){return getState().location}
function needLocation(names,msg){if(names.includes(location()))return true;logX(msg,'system');return false}
function need(cond,msg){if(cond)return true;logX(msg,'system');return false}
function discover(id,text,cost=2){const fresh=addFact(id);logX(text+(fresh?`\n【事实链更新】${XFACTS[id]}`:'\n这条信息你已经核对过了。'),'clue');spend(cost)}
function lifestyle(raw){const t=raw.trim();const s=getState();
 if(/睡觉|睡一会|上床睡|躺下睡|直接睡|早点睡/.test(t)){logX(t,'player',true);if(!['BEDROOM','LIVING','FOYER'].includes(s.location)){logX('你现在不在适合睡觉的地方。至少先回703。','system');return true}if(s.location!=='BEDROOM'){s.location='BEDROOM';setState(s)}logX('你把手机调成静音，躺到床上。窗外偶尔有车灯扫过天花板。你真的试着把今晚当成普通的一天结束。','normal');spend(10);return true}
 if(/喝奶茶|买奶茶|点奶茶|奶茶/.test(t)){logX(t,'player',true);if(s.location==='CONVENIENCE_STORE'){logX('你从冷柜拿了一瓶奶茶。收银台上的电子钟比手机慢了一分钟。店员说这栋楼今晚已经有个穿维修服的人来买过烟。','normal');if(!hasFact('PRIOR_VISIT'))logX('这不是证据，但“维修服”三个字让你下意识记住了。','clue');spend(3)}else if(['FOYER','LIVING','BEDROOM','KITCHEN','BATHROOM'].includes(s.location)){logX('你翻了翻外卖软件，最后还是给自己点了杯奶茶。预计送达时间23:20——一个你第一轮还不知道能不能看到的时间。','normal');spend(4)}else{logX('你现在不在适合点单或喝东西的地方。先回703，或者去一楼便利店。','system')}return true}
 if(/洗漱|刷牙|洗脸|洗澡|冲澡/.test(t)){logX(t,'player',true);if(!['FOYER','LIVING','BEDROOM','KITCHEN','BATHROOM'].includes(s.location)){logX('你得先回703。这里显然不是洗漱的地方。','system');return true}s.location='BATHROOM';setState(s);logX('水声盖住了门外很轻的一次脚步。镜子迅速起雾，你刷牙时还在想明天8:30的闹钟。','normal');spend(/洗澡|冲澡/.test(t)?7:4);return true}
 if(/吃饭|吃东西|热外卖|泡面|夜宵/.test(t)){logX(t,'player',true);if(!['FOYER','LIVING','KITCHEN'].includes(s.location)){logX('先回703再弄吃的。','system');return true}s.location='KITCHEN';setState(s);logX('微波炉转盘慢慢转着。冰箱压缩机停下的一瞬间，走廊里那声电梯“叮”反而格外清楚。','normal');spend(5);return true}
 if(/刷手机|刷视频|看视频|玩手机|回消息|刷朋友圈|刷微博|刷小红书/.test(t)){logX(t,'player',true);logX('你随手刷了几分钟手机。群聊、外卖券、工作消息，一切都普通得让人犯困。','normal');spend(3);return true}
 if(/发呆|坐一会|躺一会|休息一下|歇一会/.test(t)){logX(t,'player',true);logX('你什么都没做。楼上的水管响了一阵，又安静下来。','normal');spend(3);return true}
 return false}
function investigation(raw){const t=raw.trim(),s=getState(),k=s.meta.knowledge||[];
 const player=()=>logX(t,'player',true);
 // Strategy branches
 if(/小杜/.test(t)&&/来接|过来接|接周妍|楼下等|陪周妍/.test(t)){player();if(!need(hasFact('DU_MESSAGE',s),'先联系小杜，确认她愿意介入。'))return true;addStrategy('escort','SAFE_HANDOFF');logX('小杜没有追问细节，只说：“我现在下楼。让她别一个人出来。”这一次，周妍有一个循环之外也认识她的人来接应。','clue');spend(2);return true}
 if(/备份.*云|云盘|复制.*证据|多.*备份|发给小杜.*证据|备份.*两份|三份备份/.test(t)){player();if(!need(s.loopState.evidence,'先拿到真正的存储卡。'))return true;addStrategy('redundantBackup','REDUNDANT_BACKUP');logX('你把存储卡内容复制到手机加密目录，又把关键清单发给小杜。现在冯川就算抢走原卡，也抹不掉全部证据。','clue');spend(3);return true}
 if(/工单.*门禁.*警方|门禁.*工单.*警|记录.*交给警方|整理.*时间证据|完整记录.*报警/.test(t)){player();if(!need(hasFact('WORKORDER_ANOMALY',s)&&hasFact('ACCESS_PATTERN',s),'至少先把异常工单和门禁模式两条线核对出来。'))return true;addStrategy('publicRecord','PUBLIC_RECORD');logX('你把工单创建时间、刷卡记录、电梯空停和消防门权限整理在同一张时间表里。它不靠口供，任何一项都能被后台再次核验。','clue');spend(3);return true}
 if(/老赵/.test(t)&&/拦|盯|守住|看住|别放.*走|出口/.test(t)){player();if(!need(k.includes('FENG')&&hasFact('ACCESS_PATTERN',s),'只凭“有个维修工”不足以让老赵冒险拦人；先确认姓名和异常门禁。'))return true;addStrategy('guardWatch','GUARD_WATCH');logX('老赵把冯川的名字写在便签上，关掉大厅电视：“我不跟他动手，但他要走，我会留住监控，也会第一时间告诉警察。”','clue');spend(2);return true}
 if(/查.*工单|工单.*查|翻.*工单|报修记录|维修记录/.test(t)){player();if(!needLocation(['PROPERTY_OFFICE'],'物业工单在一楼值班室。你得先去那里。'))return true;discover('WORKORDER_ANOMALY','老赵把纸质登记和电脑工单放在一起。22:41有一条704“烟感线路异常”，报修人一栏却只有匿名来电。六分钟后，冯川刷门禁进楼。',3);return true}
 if(/查.*门禁|刷卡记录|门禁记录|进出记录/.test(t)){player();if(!needLocation(['PROPERTY_OFFICE','LOBBY'],'门禁记录在一楼。'))return true;discover('ACCESS_PATTERN','你按姓名往前翻。冯川近三周四次在22点后刷卡进入七楼，但其中两晚根本找不到对应住户报修。',3);return true}
 if(/敲.*705|问.*705|705.*邻居|问邻居/.test(t)){player();if(!needLocation(['CORRIDOR_7F'],'要问705，先到七楼走廊。'))return true;discover('PRIOR_VISIT','705住户隔着门链回忆：“那个维修的？上周也来过，晚上十一点多，说统一检查烟感。我没让他进。”',2);return true}
 if(/序列号|设备编号|采购号|查.*烟感.*编号/.test(t)){player();if(!need(hasFact('CAMERA',s),'你还没有发现值得核对编号的设备。'))return true;if(!needLocation(['ROOM_704'],'编号在704烟感里的模块上。'))return true;discover('CAMERA_SERIAL','你拍下偷拍模块背面的序列号。前缀和物业公告里那批“烟感更换件”完全一致——至少有人利用了正常采购链。',2);return true}
 if(/存储卡.*时间|备份时间|文件时间|核对.*存储卡|检查.*存储卡|看.*备份/.test(t)){player();if(!need(s.loopState.evidence,'你还没有拿到吊顶里的存储卡。'))return true;discover('BACKUP_TIME','文件列表里最后一次完整备份结束于22:59。23:03新增的是一个很小的文本配置，不是视频备份。原先那条时间线需要重新解释。',2);return true}
 if(/周妍.*计划|问.*周妍.*明天|问.*周妍.*报警|为什么.*报警|准备怎么办/.test(t)){player();if(!need(k.includes('ZHOU'),'你还没有和周妍建立足够接触。'))return true;if(!needLocation(['ROOM_704','CORRIDOR_7F'],'要问她这件事，你得在704附近。'))return true;discover('ZHOU_PLAN','周妍沉默了一会：“我和小杜约好了，明早一起去派出所。我没约他今晚来，也没想和他谈。我只想把今晚熬过去。”',2);return true}
 if(/小杜/.test(t)&&/打电话|联系|问|发消息|叫/.test(t)){player();if(!need(k.includes('ZHOU')||k.includes('HELP'),'你还不知道为什么要联系小杜。'))return true;discover('DU_MESSAGE','小杜听见周妍名字立刻清醒了：“她22:35给我发过一句，如果明天没到公司，就把共享盘交给警察。我以为她只是害怕。”',2);return true}
 if(/电梯.*监控|查.*电梯|电梯记录|看.*监控.*电梯|调.*监控/.test(t)){player();if(!needLocation(['PROPERTY_OFFICE','LOBBY'],'电梯和大厅监控要去一楼核对。'))return true;discover('ELEVATOR_LOG','23:08的历史片段里，电梯在七楼停了十几秒，却没人进轿厢。镜头随后拍到楼梯防火门晃了一下。',3);return true}
 if(/消防门.*报警|查.*消防门|检查.*消防门|门禁报警|消防门记录/.test(t)){player();if(!needLocation(['STAIRCASE'],'要检查消防门，先去消防楼梯。'))return true;discover('FIRE_DOOR','门边报警器的维护记录灯还亮着。23:10有一次物业权限解除，持续41秒，足够两个人通过后重新落锁。',2);return true}
 if(/延时.*短信|延时.*发送|定时.*短信|草稿|周妍.*手机/.test(t)){player();if(!need(k.includes('ZHOU')&&(s.loopState.evidence||k.includes('EVIDENCE_LOCATION')),'你还接触不到足够私密的手机信息。'))return true;if(!needLocation(['ROOM_704'],'周妍的手机在704。'))return true;discover('DELAYED_SEND','周妍翻出一条22:59保存的延时求救草稿：正文正是“703，帮我报警。”收件人只写了房号备注，没有具体号码。她自己也愣住：“我没设过发送。”',2);return true}
 if(/短信.*详情|查看.*短信|短信.*回执|发送记录|求救.*时间戳/.test(t)){player();if(!need(k.includes('HELP')||k.includes('LOOP'),'你现在还没有一条值得反复核对的23:16短信。'))return true;discover('SMS_ANOMALY','你长按那条“703，帮我报警。”查看详情：本机有收到时间，却没有正常短信应有的发件回执字段。它像是直接出现在收件箱里。',1);return true}
 if(/对比.*时间|上一轮.*短信|短信.*日期|日期.*短信|时间错位|时间戳.*一轮/.test(t)){player();if(!need(hasFact('SMS_ANOMALY',s)&&s.loop>=2,'至少经历两轮、并先看过短信详情，才有东西可以对比。'))return true;discover('CLOCK_DRIFT','你把这一轮和上一轮的截图并排：正文、收到时刻都一样，但日期标签保留的是上一轮的日期。错位恰好是一整个循环。',1);return true}
 return false}
function handleCommand(raw){return lifestyle(raw)||investigation(raw)}
function interceptSubmit(e){const input=$('#commandInput');if(!input)return;const raw=input.value.trim();if(!raw)return;if(handleCommand(raw)){e.preventDefault();e.stopImmediatePropagation();input.value='';setTimeout(()=>input.focus(),0)}}
function wireCommandInterception(){const send=$('#sendBtn'),input=$('#commandInput');send.addEventListener('click',interceptSubmit,true);input.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){const raw=input.value.trim();if(raw&&(lifestyleMatch(raw)||investigationMatch(raw))){e.preventDefault();e.stopImmediatePropagation();handleCommand(raw);input.value='';setTimeout(()=>input.focus(),0)}}},true)}
function lifestyleMatch(t){return /睡觉|睡一会|上床睡|躺下睡|直接睡|早点睡|喝奶茶|买奶茶|点奶茶|奶茶|洗漱|刷牙|洗脸|洗澡|冲澡|吃饭|吃东西|热外卖|泡面|夜宵|刷手机|刷视频|看视频|玩手机|回消息|刷朋友圈|刷微博|刷小红书|发呆|坐一会|躺一会|休息一下|歇一会/.test(t)}
function investigationMatch(t){return /工单|报修记录|维修记录|门禁|刷卡记录|进出记录|705|问邻居|序列号|设备编号|采购号|存储卡.*时间|备份时间|文件时间|核对.*存储卡|周妍.*计划|周妍.*明天|周妍.*报警|准备怎么办|小杜|电梯.*监控|电梯记录|消防门|门禁报警|短信.*详情|短信.*回执|发送记录|求救.*时间戳|延时.*短信|延时.*发送|定时.*短信|草稿|周妍.*手机|上一轮.*短信|短信.*日期|时间错位|时间戳.*一轮|云盘|复制.*证据|多.*备份|记录.*交给警方|完整记录.*报警|老赵.*拦|老赵.*盯|老赵.*守住|老赵.*出口/.test(t)}
function chainProgress(chain,s=getState()){let n=0;for(const [id] of chain.nodes)if(hasFact(id,s))n++;return[n,chain.nodes.length]}
function completeChains(s=getState()){return CHAINS.filter(c=>{const[n,total]=chainProgress(c,s);return n===total}).length}
function visibleChainFacts(chain,s=getState()){return chain.nodes.filter(([id])=>hasFact(id,s))}
function visibleChains(s=getState()){return CHAINS.map(chain=>({chain,nodes:visibleChainFacts(chain,s)})).filter(x=>x.nodes.length>0)}
function knownGraphCount(s=getState()){const ids=new Set();for(const chain of CHAINS)for(const [id] of chain.nodes)if(hasFact(id,s))ids.add(id);return ids.size}
function updateFactStats(){const c=$('#chainCount');if(!c)return;const s=getState(),opened=visibleChains(s).length,closed=completeChains(s);c.textContent=closed?`${closed} 条闭合`:opened?`${opened} 条展开`:'未展开'}
function factGraphHTML(){const s=getState(),visible=visibleChains(s),known=knownGraphCount(s);const cols=visible.map(({chain,nodes})=>{const complete=nodes.length===chain.nodes.length;return`<section class="fact-chain"><h3>${chain.name}</h3>${nodes.map(([id,label])=>`<div class="fact-node known ${id==='TRUE_CAUSE'?'cross':''}">● ${label}${XFACTS[id]?`<small>${XFACTS[id]}</small>`:''}</div>`).join('')}<div class="chain-status ${complete?'done':''}">${complete?'链条闭合':`已归档 ${nodes.length} 条`}</div></section>`}).join('');const body=cols||`<div class="fact-map-empty"><b>还没有形成可归档的关联。</b><span>图谱只会记录你亲自确认过的事实；尚未发现的节点、链条名称和调查方向不会提前出现。</span></div>`;return`<div class="fact-map"><div class="fact-map-head"><div><strong>23:17</strong><br><span>你确认过的事实会逐步连成关系。空白不会替你预告答案。</span></div><span>已归档 ${known} 条事实</span></div><div class="fact-chains">${body}</div><div class="fact-map-legend fact-map-note"><span>继续从现场、人物和已经掌握的事实中交叉核对。只有真正发现后，新的关系才会出现在图谱里。</span></div>${endingArchiveHTML(s)}</div>`}
function endingArchiveHTML(s){const seen=s.meta&&Array.isArray(s.meta.endingsSeen)?s.meta.endingsSeen:[];const names={EVIDENCE:'《证据》',LIVE:'《活到明天》',WHY:'《你为什么记得？》',RECORD:'《记录不会说谎》',ESCORT:'《有人来接她》',BACKUP:'《第三份备份》',SMS:'《23:16 从未发送》'};const visible=seen.map(id=>names[id]).filter(Boolean),all=Object.keys(names).every(id=>seen.includes(id));if(!visible.length)return`<div class="story-choice"><b>留下的结果</b><br><span class="story-muted">尚未留下可回看的结局。不同选择可能让今晚留下不同痕迹。</span></div>`;return`<div class="story-choice"><b>${all?'留下的结果 · 已全部归档':`留下的结果 · 已归档 ${visible.length} 个`}</b><br>${visible.map(n=>`<span class="life-chip"><b>●</b>${n}</span>`).join('')}${all?'':`<span class="life-chip locked-life"><b>○</b>还有未见的结果</span>`}</div>`}
function openFactGraph(e){if(e){e.preventDefault();e.stopImmediatePropagation()}$('#modalTitle').textContent='多链条事实图谱';$('#modalBody').innerHTML=factGraphHTML();$('#modal').classList.remove('hidden')}
function showSettings(){const sheet=$('#settingsSheet');$('#bgmToggle').checked=bgmEnabled();$('#bgmVolume').value=Math.round(bgmVolume()*100);$('#sfxToggle').checked=localStorage.getItem('g2317_sound')!=='off';$('#motionToggle').checked=localStorage.getItem('g2317_motion')==='reduced';sheet.classList.remove('hidden')}
function hideSettings(){$('#settingsSheet').classList.add('hidden')}
function resetGame(){try{localStorage.removeItem(SAVE_KEY);localStorage.removeItem(OLD_SAVE)}catch(e){}const s=api.baseState();api.setState(s);try{localStorage.removeItem(SAVE_KEY);localStorage.removeItem(OLD_SAVE)}catch(e){}$('#log').innerHTML='';logX('22:47。你加班回到出租屋。钥匙刚插进703的门锁。\n明天8:30还要上班。今晚最好早点睡。','normal');logX('所有循环记录、事实链与结局记录都已清除。','system');updateFactStats();switchBgm(true)}
function resetConfirm(){const body=`<div class="reset-confirm"><div class="warning">这会清除循环次数、已知事实、事实图谱、结局记录和当前进度。声音设置会保留。</div><div class="actions"><button id="cancelReset" class="ghost">留下记录</button><button id="doReset" class="primary">确认烧掉</button></div></div>`;$('#modalTitle').textContent='烧掉所有记录？';$('#modalBody').innerHTML=body;$('#modal').classList.remove('hidden');setTimeout(()=>{$('#cancelReset').onclick=()=>$('#modal').classList.add('hidden');$('#doReset').onclick=()=>{resetGame();$('#modal').classList.add('hidden')}},0)}
function startNew(){resetGame();$('#startScreen').classList.add('hidden');startBgm();$('#commandInput').focus()}
function startContinue(){const s=getState();$('#startScreen').classList.add('hidden');$('#log').innerHTML='';logX(`你重新翻开循环记录。第 ${s.loop} 轮，${now()}。你还记得 ${(s.meta.knowledge||[]).length} 条核心事实，地点是 ${$('#sceneLabel').textContent||'当前场景'}。`,'system');logX('事实会留下，上一轮的行动过程不会。需要回忆时，打开“事实图谱”或“时间线”。','normal');startBgm();$('#commandInput').focus()}
function setupStart(){const had=!!window.__G2317_HAD_SAVE__,cont=$('#startContinueBtn'),newBtn=$('#startNewBtn');cont.disabled=!had;if(!had)cont.textContent='上一轮还不存在';else{const s=getState();$('#startSubtitle').textContent=`钥匙停在703门锁里。你已经记住了 ${Math.max(0,(s.meta.knowledge||[]).length)} 条核心事实，第 ${s.loop} 轮仍在继续。`;newBtn.textContent='从22:47重新来过'}let newArmed=false,newTimer=null;newBtn.onclick=()=>{if(!had){startNew();return}if(!newArmed){newArmed=true;newBtn.textContent='再按一次，从头开始';clearTimeout(newTimer);newTimer=setTimeout(()=>{newArmed=false;newBtn.textContent='从22:47重新来过'},3000);return}clearTimeout(newTimer);startNew()};cont.onclick=startContinue;$('#startSettingsBtn').onclick=showSettings;let resetArmed=false,resetTimer=null;$('#startResetBtn').onclick=()=>{if(!resetArmed){resetArmed=true;$('#startResetBtn').textContent='再按一次，确认烧掉';clearTimeout(resetTimer);resetTimer=setTimeout(()=>{resetArmed=false;$('#startResetBtn').textContent='烧掉所有记录'},3000);return}clearTimeout(resetTimer);resetGame();resetArmed=false;$('#startResetBtn').textContent='记录已清空';cont.disabled=true;cont.textContent='上一轮还不存在';$('#startSubtitle').textContent='记录已经烧掉。22:47又只剩一把钥匙和一扇703的门。'}}
function setupSettings(){$('#settingsClose').onclick=hideSettings;$('#settingsSheet').addEventListener('click',e=>{if(e.target.id==='settingsSheet')hideSettings()});$('#settingsBtn').onclick=showSettings;$('#resetSaveBtn').onclick=resetConfirm;$('#bgmToggle').onchange=e=>{localStorage.setItem('g2317_bgm',e.target.checked?'on':'off');applyBgmSetting()};$('#bgmVolume').oninput=e=>{localStorage.setItem('g2317_bgm_volume',String(e.target.value));applyBgmSetting()};$('#sfxToggle').onchange=e=>{const desired=e.target.checked,current=localStorage.getItem('g2317_sound')!=='off';if(desired!==current)$('#soundBtn').click()};$('#motionToggle').onchange=e=>{localStorage.setItem('g2317_motion',e.target.checked?'reduced':'full');document.body.classList.toggle('no-motion',e.target.checked)};document.body.classList.toggle('no-motion',localStorage.getItem('g2317_motion')==='reduced')}
function appendIdeas(){setTimeout(()=>{const box=$('#ideas');if(!box||box.classList.contains('hidden'))return;const s=getState();let extras=s.loop===1&&!hasFact('LOOP',s)?['洗漱一下','喝奶茶','早点睡']:['查物业工单','查门禁记录','问705邻居'];if((s.meta.knowledge||[]).includes('ZHOU'))extras.push('联系小杜问周妍');if(s.loopState.evidence)extras.push('核对存储卡备份时间');if((s.meta.knowledge||[]).includes('HELP'))extras.push('查看求救短信详情');extras.slice(0,5).forEach(x=>{if([...box.querySelectorAll('button')].some(b=>b.textContent===x))return;const b=document.createElement('button');b.className='idea';b.textContent=x;b.onclick=()=>{$('#commandInput').value=x;$('#commandInput').focus()};box.appendChild(b)})},0)}
function scrubCitationArtifacts(root){const nodes=[];if(root.nodeType===1)nodes.push(root,...root.querySelectorAll('.entry'));for(const n of nodes){if(n.innerHTML&&n.innerHTML.includes('cite'))n.innerHTML=n.innerHTML.replace(/cite新的事实/g,'【新的事实】').replace(/cite[^]*/g,'')}}
function rememberEnding(id){const s=getState();s.meta.endingsSeen=Array.isArray(s.meta.endingsSeen)?s.meta.endingsSeen:[];if(s.meta.endingsSeen.includes(id))return false;s.meta.endingsSeen.push(id);setState(s);return true}
function endingScores(s){const p={};CHAINS.forEach(c=>p[c.id]=chainProgress(c,s)[0]);return p}
let endingRewriting=false;
function rewriteEnding(){const end=$('#ending'),title=$('#endingTitle');if(!end||end.classList.contains('hidden')||endingRewriting)return;if(end.dataset.expansionRewritten==='1'&&title&&title.textContent===end.dataset.expansionOutput)return;endingRewriting=true;end.dataset.expansionRewritten='0';end.dataset.expansionOutput='';const oldRoute=$('#endingRouteExtra');if(oldRoute&&oldRoute.remove)oldRoute.remove();const s=getState(),p=endingScores(s),text=$('#endingText'),stats=$('#endingStats');let id='';const original=title.textContent;
 if(original.includes('你为什么记得')){if(p.loop>=5&&p.evidence>=4){id='SMS';title.textContent='《23:16 从未发送》';text.textContent='23:18。警方在七楼控制住冯川。\n\n00:03，周妍坐在你旁边。你把每一轮的短信截图摆在一起：那条23:16求救没有正常发件回执，日期还总比世界慢一轮。\n\n周妍看完那条22:59的延时草稿，脸色一点点白下去。\n“我写过这句话，”她说，“可我从来不知道703的号码。”\n\n你的手机再次亮起。\n未知号码：\n“这次你终于看见我了。”';}else{id='WHY'}}
 else if(original.includes('证据')){if(strategy('escort',s)&&strategy('redundantBackup',s)&&p.human>=4&&p.evidence>=4){id='ESCORT';title.textContent='《有人来接她》';text.textContent='23:17。没有撞击声。\n23:18。\n\n小杜已经在楼下等着。周妍第一次不是独自从704走出来。警方在老赵保留的监控和你的录音里补齐证据，冯川没有机会把“住户纠纷”重新包装成一次普通报修。\n\n周妍坐进小杜的车前回头说：“明天我还是会去派出所。”\n这一次，“明天”真的存在。';}
 else if(strategy('publicRecord',s)&&strategy('guardWatch',s)&&p.access>=4&&p.route>=4){id='RECORD';title.textContent='《记录不会说谎》';text.textContent='23:17之后，时间继续。\n\n工单、门禁、电梯空停、消防门权限、存储卡与录音被放在同一条时间线上。冯川可以否认一句话，却无法同时否认五套彼此独立的记录。\n\n老赵守住一楼出口，警车到达时他只说了一句：“人在这，监控也在。”\n\n你第一次意识到，救下一个人不一定靠某个完美瞬间，也可以靠让事实彼此作证。';}
 else if(strategy('redundantBackup',s)&&p.evidence>=4){id='BACKUP';title.textContent='《第三份备份》';text.textContent='23:18。时间继续向前。\n\n原始存储卡在证物袋里，第二份在你的手机，第三份已经到了小杜手里。冯川被控制后仍坚持自己只是来维修，但他再也无法让证据只剩一个可以抢走的物件。\n\n周妍低声问：“你为什么做了三份？”\n你看了一眼23:18。\n“因为我试过只留一份。”';}
 else{id='EVIDENCE'}}
 else if(original.includes('活到明天')){if(strategy('escort',s)){id='ESCORT';title.textContent='《先离开这里》';text.textContent='23:18。\n\n周妍没有上天台。小杜在楼下接到她，你们把现有证据交给警方。冯川在警车抵达前离开，但他的姓名、门禁和异常工单都已经留下。\n\n这不是最完整的答案，却是周妍第一次不用独自等到23:17。';}else if(strategy('redundantBackup',s)){id='BACKUP';title.textContent='《云端还亮着》';text.textContent='23:18。周妍活了下来，冯川却先一步离开。\n\n好在存储卡已经不是唯一证据。云端同步的文件仍在上传，进度从99%跳到100%。\n\n循环结束了，但调查没有。你们至少把明天留了下来。';}else{id='LIVE'}}
 if(id){end.dataset.expansionRewritten='1';end.dataset.expansionOutput=title.textContent;rememberEnding(id);const closed=completeChains(s);if(closed)stats.textContent+=` · 已闭合事实链 ${closed} 条`;const route=document.createElement('div');route.id='endingRouteExtra';route.className='ending-route';route.textContent=`本结局受本轮策略与已确认事实影响。已归档结局：${(getState().meta.endingsSeen||[]).length} 个`;stats.insertAdjacentElement('afterend',route)}endingRewriting=false}
let lastLoop=getState().loop;
function watchLoopReset(){const s=getState();if(s.loop>lastLoop){const prev=lastLoop;lastLoop=s.loop;setTimeout(()=>{const ns=getState(),used=ns.meta.strategyLoops&&ns.meta.strategyLoops[prev];if(used&&used.escort)logX(`【伪结局记录】第${prev}轮，你让周妍离开了危险路线，但循环仍然重启。救人和终止循环不是同一件事。`,'clue')},80)}}
function setupObservers(){const scene=$('#sceneWrap');new MutationObserver(()=>{switchBgm();updateFactStats();watchLoopReset()}).observe(scene,{attributes:true,attributeFilter:['data-location']});const clock=$('#clock');new MutationObserver(()=>{updateFactStats();watchLoopReset();rewriteEnding()}).observe(clock,{childList:true,characterData:true,subtree:true});const end=$('#ending');new MutationObserver(()=>{if(end.classList.contains('hidden'))end.dataset.expansionRewritten='0';else rewriteEnding()}).observe(end,{attributes:true,attributeFilter:['class']});const log=$('#log');new MutationObserver(ms=>ms.forEach(m=>m.addedNodes.forEach(scrubCitationArtifacts))).observe(log,{childList:true,subtree:true});$('#ideasBtn').addEventListener('click',appendIdeas);$('#knowledgeBtn').addEventListener('click',openFactGraph,true)}
function patchContinue(){const btn=$('#continueBtn');let carry=[];btn.addEventListener('click',()=>{carry=Array.isArray(getState().meta.endingsSeen)?[...getState().meta.endingsSeen]:[]},true);btn.addEventListener('click',()=>{setTimeout(()=>{const s=getState();s.meta.factGraph=[];s.meta.endingsSeen=carry;setState(s);updateFactStats();switchBgm(true)},0)})}
wireCommandInterception();setupStart();setupSettings();setupObservers();patchContinue();updateFactStats();switchBgm();scrubCitationArtifacts(document);
})();
