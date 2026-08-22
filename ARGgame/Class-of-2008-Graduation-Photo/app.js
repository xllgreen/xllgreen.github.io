(() => {
  'use strict';
  const SAVE_KEY = 'grad2008_save_v1';

  const defaultState = () => ({
    started:false, scene:'gate', history:[], clues:[], items:[], flags:{}, hintLevel:{}, calls:[], ending:null,
    startedAt:Date.now(), lastPlayed:Date.now()
  });
  let state = load();

  const $ = s => document.querySelector(s);
  const titleScreen=$('#titleScreen'), gameScreen=$('#gameScreen'), stage=$('#stage'), sceneImage=$('#sceneImage'), sceneShade=$('#sceneShade'), hotspots=$('#hotspots');
  const sceneName=$('#sceneName'), sceneTime=$('#sceneTime'), chapterLabel=$('#chapterLabel'), clueCount=$('#clueCount');
  const objective=$('#objective'), ambientText=$('#ambientText'), toastEl=$('#toast'), modalLayer=$('#modalLayer'), modal=$('#modal');
  const backBtn=$('#backBtn'), phoneBtn=$('#phoneBtn');
  const tabletSceneName=$('#tabletSceneName'), tabletChapter=$('#tabletChapter'), tabletObjective=$('#tabletObjective'), tabletAmbient=$('#tabletAmbient');

  const clueDefs = {
    class_photo:['异常旧合影','牛皮纸袋里的春季合影中，有一名女生无法与40人的正式毕业名册对应。'],
    chen_absent:['陈嘉树没有进校','门卫值班记录显示今晚没有校友登记入校。'],
    old_map:['2008旧校区地图','地图上还保留着后来拆除的旧实验楼。'],
    room071:['“071”痕迹','307教室墙角和旧物编号里反复出现071。'],
    extra_desk:['消失的课桌','2008年的教室快照与现在对照后，靠窗区域少了一张课桌。'],
    duty_fragment:['值日表残页','残页写着“林□”，说明当年七班确实有一名林姓学生参与值日。'],
    photo_alias:['“阿遥”','摄影社旧照片背后写着“阿遥第一次自己冲照片”。'],
    temp071:['临时编号 TEMP-071','摄影社借用册里071没有正式学号，只标为临时成员。'],
    linyao:['姓名：林遥','“林□”与“阿遥”、071三条记录可以相互印证：她叫林遥。'],
    crack_photo:['5月12日裂缝照片','事故前一周的底片已经拍到旧实验楼明显裂缝。'],
    incident_audio:['5月19日广播','午间广播尾部录到“旧楼那边出事了”，时间接近12:47。'],
    medical:['医务室登记','5月19日12:58，高三七班一名姓名被涂黑的学生左肩挫伤、手臂擦伤。'],
    hidden_desk:['被搬走的旧课桌','器材室深处放着一张被单独搬走的旧学生桌，抽屉里有未冲洗胶卷。'],
    final_film:['5月19日未冲洗胶卷','胶卷27/36拍到了事故现场，也证明陈嘉树当时就在旧楼附近。'],
    chen_truth:['陈嘉树的沉默','他承认自己当年配合回收照片、删除墙报里的林遥名字，此后一直后悔。'],
    bookmark:['夹在摄影书里的书签','林遥写道：“我不是失踪了，我只是离开了那里。”'],
    full_photo:['完整合影边缘','原始照片边缘还能看到班主任。所谓“毕业照”其实是2008年春季活动合影。']
  };

  const itemDefs = {
    class_photo:['2008年旧合影','assets/img/class_photo.jpg'], map:['旧校区平面图','assets/img/map.jpg'],
    duty:['值日表残页','assets/img/duty.jpg'], medical:['医务室登记','assets/img/medical.jpg'],
    bookmark:['摄影书书签','assets/img/bookmark.jpg'], negative:['未冲洗胶卷','assets/img/negative.jpg'], developed:['显影照片','assets/img/developed.jpg']
  };

  function storageGet(){try{return localStorage.getItem(SAVE_KEY)}catch(e){return null}}
  function storageSet(v){try{localStorage.setItem(SAVE_KEY,v)}catch(e){/* 无存储权限时仍允许完整游玩 */}}
  function storageRemove(){try{localStorage.removeItem(SAVE_KEY)}catch(e){}}
  function load(){ try{ const s=JSON.parse(storageGet()); return s&&s.scene?Object.assign(defaultState(),s):defaultState(); }catch(e){return defaultState();} }
  function save(){ state.lastPlayed=Date.now(); storageSet(JSON.stringify(state)); updateHUD(); }
  function reset(){
    storageRemove(); state=defaultState();
    try{pendingCalls.length=0;}catch(e){}
    phoneBtn.classList.add('hidden'); phoneBtn.textContent='来电';
    closeModal(); gameScreen.classList.remove('active'); titleScreen.classList.add('active');
    sceneImage.src='assets/img/gate.jpg'; sceneName.textContent='旧校门'; sceneTime.textContent='19:43'; chapterLabel.textContent='第一章 · 照片里的人';
    objective.textContent=''; ambientText.textContent='远处传来拆除工地的金属碰撞声。'; hotspots.innerHTML='';
    updateHUD();
  }
  function hasClue(id){return state.clues.includes(id)}
  function hasItem(id){return state.items.includes(id)}
  function addClue(id,silent=false){ if(!clueDefs[id]||hasClue(id))return false; state.clues.push(id); save(); if(!silent) toast('线索已记录：'+clueDefs[id][0]); checkDerived(); return true; }
  function addItem(id){ if(!hasItem(id)){state.items.push(id); save();} }
  function flag(id,val=true){state.flags[id]=val;save()}
  function checkDerived(){
    if(hasClue('duty_fragment')&&hasClue('photo_alias')&&hasClue('temp071')&&!hasClue('linyao')){
      setTimeout(()=>{addClue('linyao'); toast('三条记录终于拼出了一个完整姓名：林遥。');},450);
    }
    if(hasClue('incident_audio')&&hasClue('medical')&&!state.flags.oldBuildingOpen){ state.flags.oldBuildingOpen=true; save(); toast('旧实验楼的事故时间已经能够相互印证。封闭区域值得再查。'); }
    syncCalls();
  }
  function normalizeState(){
    state.history=Array.isArray(state.history)?state.history:[]; state.clues=Array.isArray(state.clues)?state.clues:[]; state.items=Array.isArray(state.items)?state.items:[];
    state.flags=state.flags||{}; state.hintLevel=state.hintLevel||{}; state.calls=Array.isArray(state.calls)?state.calls:[];
    if(hasClue('incident_audio')&&hasClue('medical')) state.flags.oldBuildingOpen=true;
    if(state.scene==='rooftop') state.flags.rooftopOpen=true;
    if(!scenes?.[state.scene]) state.scene='gate';
  }

  const scenes = {
    gate:{name:'旧校门',time:'19:43',img:'assets/img/gate.jpg',chapter:'第一章 · 照片里的人',ambient:'老校区明天拆除，今晚是最后一次进入。',objective:()=>hasItem('class_photo')?'拿着307钥匙进入校舍。':'检查门边旧报箱。',spots:[
      [5,51,20,35,'报箱',()=>inspectGateMail()], [33,27,48,58,'校门',()=>go('guard')]
    ]},
    guard:{name:'门卫室',time:'19:49',img:'assets/img/guard.jpg',chapter:'第一章 · 照片里的人',ambient:'门卫室空着，桌面上的纸张还没来得及清走。',objective:()=>hasItem('map')?'拿走307备用钥匙，去三楼。':'找一张还能看清的旧校区平面图。',spots:[
      [46,58,31,32,'旧地图',()=>inspectMap()], [6,57,32,34,'值班桌',()=>inspectGuardLog()], [4,18,20,31,'钥匙板',()=>takeKey()], [84,18,14,68,'离开',()=>go('hallway')]
    ]},
    hallway:{name:'三楼走廊',time:'20:01',img:()=>state.flags.oldBuildingOpen?'assets/img/hallway_night.jpg':'assets/img/hallway.jpg',chapter:()=>hasClue('linyao')?'第三章 · 她真实存在过':'第二章 · 她坐在哪里',ambient:'日光灯发出很轻的电流声。所有门牌都还在，只是没人再上课。',objective:()=>nextObjective(),spots:[
      [60,25,18,55,'307教室',()=>state.flags.key?go('classroom'):toast('307锁着。门卫室应该有备用钥匙。')],
      [20,18,20,58,'摄影社',()=>go('photo')], [42,19,16,60,'广播室',()=>go('broadcast')],
      [2,35,18,54,'器材室',()=>go('sports')], [80,18,20,68,'旧实验楼',()=>state.flags.oldBuildingOpen?go('oldbuilding'):toast('封条还没必要动。先弄清5月19日发生了什么。')]
    ]},
    classroom:{name:'307教室',time:'20:08',img:()=>state.clues.length>7?'assets/img/classroom_late.jpg':'assets/img/classroom.jpg',chapter:'第二章 · 她坐在哪里',ambient:'粉尘味很重。这里不像案发现场，更像一间被时间放弃的普通教室。',objective:()=>hasClue('extra_desk')?'继续寻找071与林姓学生的关系。':'找到能与现在教室对应的2008年教室快照。',spots:[
      [15,22,42,32,'黑板',()=>inspectBlackboard()], [20,70,45,25,'课桌',()=>inspectDesks()], [3,5,11,25,'墙角',()=>inspectWall()], [67,25,25,35,'照片对照位置',()=>openCompare()]
    ]},
    photo:{name:'摄影社旧活动室',time:'20:22',img:'assets/img/photo_club.jpg',chapter:'第三章 · 照片不会忘记',ambient:'器材已经撤走大半，留下的照片夹和登记本比人更诚实。',objective:()=>hasClue('linyao')?'查找2008年5月留下的底片。':'从摄影社记录里确认071是谁。',spots:[
      [4,15,26,75,'旧相册',()=>inspectAlbum()], [33,56,28,34,'借用登记册',()=>inspectLedger()], [70,15,29,77,'暗房入口',()=>go('darkroom')], [50,24,14,20,'旧摄影书',()=>inspectBook()]
    ]},
    darkroom:{name:'摄影社暗房',time:'20:31',img:'assets/img/darkroom.jpg',chapter:'第三章 · 照片不会忘记',ambient:'安全灯把房间染成很脏的暗红色。显影盘里还有干掉的药渍。',objective:()=>hasItem('negative')&&!hasClue('final_film')?'把器材室找到的胶卷冲洗出来。':'检查底片夹与放大机。',spots:[
      [0,15,28,75,'底片夹',()=>inspectOldNegatives()], [31,23,35,66,'显影台',()=>openDevelop()], [71,28,29,65,'冲洗柜',()=>toast('空药瓶、相纸盒，还有2009年后才购入的耗材。与主线无关。')]
    ]},
    broadcast:{name:'校园广播室',time:'20:40',img:'assets/img/broadcast.jpg',chapter:'第四章 · 5月19日',ambient:'设备老得像随时会停转。两台磁带机里，一台还能工作。',objective:()=>hasClue('incident_audio')?'把广播时间与其他伤情记录对应。':'找到2008年5月19日午间广播。',spots:[
      [35,62,28,31,'磁带机A',()=>playTape()], [65,62,25,31,'磁带机B',()=>toast('里面是2007年运动会广播，只有口号和背景音乐。')], [4,55,26,34,'磁带盒',()=>toast('多数标签已经脱胶。最下面一盘写着“5.19 午间”。')]
    ]},
    sports:{name:'体育器材室',time:'20:51',img:'assets/img/sports.jpg',chapter:'第四章 · 5月19日',ambient:'门牌看起来比房间新。里面堆着校舍清理出来的杂物。',objective:()=>hasItem('negative')?'带着胶卷去摄影社暗房。':'找那张从307搬走的旧桌子。',spots:[
      [7,22,28,68,'器材室门',()=>inspectSportsDesk()], [45,22,47,60,'窗口与杂物',()=>inspectMedical()]
    ]},
    oldbuilding:{name:'旧实验楼',time:'21:07',img:'assets/img/oldbuilding.jpg',chapter:'第五章 · 谁拍了最后一张照片',ambient:'这里比教学楼更安静。墙体裂缝并不像“突然出现”的事故。',objective:()=>hasClue('final_film')?'带着显影出的照片上天台。':'你还缺一张能够证明现场人物的照片。',spots:[
      [30,10,40,50,'墙体裂缝',()=>inspectCracks()], [73,15,24,78,'上楼',()=>enterRooftop()], [2,62,22,33,'旧警戒带',()=>toast('警戒带已经褪成灰白。标签日期仍能看出“2008.5”。')]
    ]},
    rooftop:{name:'旧实验楼天台',time:'21:26',img:'assets/img/rooftop.jpg',chapter:'第六章 · 毕业',ambient:'风把楼下的施工围挡吹得作响。明早，这里就不会存在了。',objective:()=>hasClue('full_photo')?'你已经知道发生了什么。决定如何结束这次调查。':'重新检查完整底片的画面边缘。',spots:[
      [5,5,90,60,'天台与照片边缘',()=>inspectFullPhoto()], [0,70,100,30,'最后选择',()=>hasClue('full_photo')?openEndingChoice():toast('先把照片最后一个被裁掉的部分看清。')]
    ]}
  };

  function sceneObj(){return scenes[state.scene]}
  function resolve(v){return typeof v==='function'?v():v}
  function layoutHotspots(){
    if(!stage||!sceneImage||!hotspots)return;
    const sw=stage.clientWidth, sh=stage.clientHeight; if(!sw||!sh)return;
    const ratio=(sceneImage.naturalWidth&&sceneImage.naturalHeight)?sceneImage.naturalWidth/sceneImage.naturalHeight:16/9;
    let w=sw,h=w/ratio; if(h>sh){h=sh;w=h*ratio;}
    hotspots.style.left=((sw-w)/2)+'px';hotspots.style.top=((sh-h)/2)+'px';hotspots.style.width=w+'px';hotspots.style.height=h+'px';
  }
  function renderScene(){
    const s=sceneObj(); const ch=resolve(s.chapter), obj=resolve(s.objective); sceneImage.onload=layoutHotspots; sceneImage.src=resolve(s.img); sceneName.textContent=s.name; sceneTime.textContent=s.time; chapterLabel.textContent=ch; ambientText.textContent=s.ambient; objective.textContent=obj; if(tabletSceneName)tabletSceneName.textContent=s.name+' · '+s.time; if(tabletChapter)tabletChapter.textContent=ch; if(tabletObjective)tabletObjective.textContent=obj; if(tabletAmbient)tabletAmbient.textContent=s.ambient;
    hotspots.innerHTML=''; s.spots.forEach(([l,t,w,h,label,act])=>{ const b=document.createElement('button'); b.className='hotspot'; b.style.cssText=`left:${l}%;top:${t}%;width:${w}%;height:${h}%`; b.setAttribute('aria-label',label); b.title=''; b.addEventListener('click',e=>{e.stopPropagation(); act();}); hotspots.appendChild(b); });
    backBtn.disabled=state.history.length===0; updateHUD(); save(); requestAnimationFrame(layoutHotspots);
  }
  function go(id){ if(!scenes[id])return; if(state.scene!==id){state.history.push(state.scene); state.scene=id; save(); playStep(); renderScene();} }
  function back(){ const id=state.history.pop(); if(id){state.scene=id;save();renderScene();} }
  function nextObjective(){
    if(!state.flags.key)return '门卫室里有307备用钥匙。';
    if(!hasClue('extra_desk')||!hasClue('room071'))return '先去307教室调查照片与现场。';
    if(!hasClue('linyao'))return '摄影社应该还留着2008年的活动记录。';
    if(!hasClue('incident_audio'))return '去广播室确认5月19日发生过什么。';
    if(!hasItem('negative'))return '器材室里可能还有被搬走的307旧物。';
    if(!hasClue('final_film'))return '回摄影社暗房冲洗未冲洗胶卷。';
    return state.flags.oldBuildingOpen?'旧实验楼已经可以继续调查。':'整理现有证据。';
  }

  function inspectGateMail(){
    if(hasItem('class_photo')) return openClassPhoto();
    addItem('class_photo'); addClue('class_photo',true); flag('keyHint');
    openCustom('牛皮纸袋',`<div class="paper"><h3>给校史整理员</h3><p>纸袋里是一张被反复翻看过的旧合影。正式毕业名册只有40人，但照片右后排有一张脸无法对应任何姓名。</p><p>照片背面还有一行已经褪色的铅笔字：<b>“如果你认出她，今晚不要只相信别人说的话。”</b></p><p>下面压着一张便签：<b>307备用钥匙在门卫室。</b></p></div><div class="modal-actions"><button id="viewEnvelopePhoto">查看照片正反面</button></div>`,'narrow');
    setTimeout(()=>$('#viewEnvelopePhoto')?.addEventListener('click',openClassPhoto),0);
  }
  function openClassPhoto(){
    const back=!!state.flags.photoBack;
    openCustom('2008年春季合影',`<div class="photo-object"><div class="photo-frame"><img id="classPhotoFace" src="${back?'assets/img/class_photo_back.jpg':'assets/img/class_photo.jpg'}" alt="${back?'旧照片背面':'2008年旧合影'}"></div><div class="photo-side"><p>${back?'背面的铅笔字不是系统提示，而是当年真正写在照片上的内容。':'照片本身没有标出谁是异常者。需要继续寻找姓名、座位和社团记录。'}</p><button id="flipClassPhoto">${back?'翻回正面':'翻到背面'}</button><button id="photoClose">收起照片</button></div></div>`,'wide');
    setTimeout(()=>{ $('#flipClassPhoto')?.addEventListener('click',()=>{state.flags.photoBack=!back;save();openClassPhoto();}); $('#photoClose')?.addEventListener('click',closeModal); },0);
  }
  function inspectMap(){addItem('map');addClue('old_map');openProp('map','2008旧校区平面图')}
  function inspectGuardLog(){addClue('chen_absent'); openText('值班记录','今天的来访登记只有施工队和两名物业人员。<br><br>没有陈嘉树。<br><br>可刚才电话里，他明明说自己“在307里找到了一样东西”。')}
  function takeKey(){if(state.flags.key)return toast('307备用钥匙已经在你身上。');flag('key');toast('拿到：307教室备用钥匙。')}
  function inspectBlackboard(){ const fresh=addClue('room071'); openCustom('307 · 黑板近景',`<img class="prop-img" src="assets/img/classroom_blackboard.jpg" alt="黑板近景"><div class="paper"><p>${fresh?'被擦过很多次的粉笔灰下，还能隐约看到“071”。它不像座位号，更像某种临时编号。':'“071”的粉笔痕迹仍在同一个位置。'}</p></div>`,'wide'); }
  function inspectDesks(){ openCustom('307 · 靠窗课桌',`<img class="prop-img" src="assets/img/classroom_desks.jpg" alt="靠窗课桌近景"><div class="paper"><p>${hasClue('extra_desk')?'把2008教室快照与这里对照后，可以确认现在少了一张靠窗课桌。':'单看现在的课桌没有意义。你需要一张与这个视角能够对应的旧教室照片。'}</p></div>`,'wide'); }
  function inspectWall(){
    const fresh=!hasClue('duty_fragment'); if(fresh){addClue('duty_fragment');addItem('duty');}
    openCustom('307 · 墙角',`<img class="prop-img" src="assets/img/classroom_wall.jpg" alt="307墙角近景"><div class="paper"><h3>墙缝里的纸</h3><p>${fresh?'旧墙皮后夹着半张已经发脆的值日表。':'值日表残页仍夹在这里。'}其中一行只能看清：<b>“周二：韩凯 / 林□”</b>。</p><img class="prop-img" src="assets/img/duty.jpg" alt="值日表残页"></div>`,'wide');
  }
  function inspectAlbum(){ if(addClue('photo_alias')) openText('摄影社照片背面','一张2008年春天的社团活动照背后写着：<br><br><b>“阿遥第一次自己冲照片，差点把整卷都曝光了。”</b>'); else toast('“阿遥”这个称呼并不是你猜出来的，它确实存在于当年的照片背面。') }
  function inspectLedger(){ if(addClue('temp071')) openText('器材借用登记','2008年2月至5月，多次出现同一个借用编号：<b>TEMP-071</b>。<br>姓名栏没有正式学号，只写“临时成员”。'); else toast('TEMP-071在摄影社登记里出现了很多次。') }
  function inspectBook(){ if(!hasClue('linyao')) return toast('《摄影构图》里夹着一张旧书签，但现在还无法确认是谁写的。'); if(!hasClue('bookmark')){addClue('bookmark');addItem('bookmark');openProp('bookmark','摄影书里的书签');}else openProp('bookmark','摄影书里的书签'); }
  function inspectOldNegatives(){ if(addClue('crack_photo')) openText('底片夹 · 2008.05.12','一张试拍底片的背景里，旧实验楼墙面已经出现明显贯穿裂缝。事故并不是毫无预兆。'); else toast('5月12日的照片比任何人的回忆都更可靠。') }
  function playTape(){
    if(hasClue('incident_audio'))return openText('5月19日午间广播','12:46后，广播背景里有人急促地说：<br><br><b>“旧楼那边出事了——叫老师！”</b><br><br>随后磁带被停止。');
    openCustom('磁带 · 2008.05.19',`<div class="phone"><div class="dialogue"><p>【12:43】“今天午间广播先为大家播送……”</p><p>【12:46】远处传来桌椅移动与脚步声。</p><p>【12:47】<b>“旧楼那边出事了——叫老师！”</b></p><p>磁带突然停止。</p></div><div class="modal-actions"><button id="markTape">记录时间</button></div></div>`,'narrow');
    setTimeout(()=>$('#markTape')?.addEventListener('click',()=>{addClue('incident_audio');closeModal();}),0);
  }
  function inspectSportsDesk(){
    if(!hasClue('hidden_desk'))addClue('hidden_desk');
    const action=hasItem('negative')?'':'<div class="modal-actions"><button id="openDeskDrawer">查看抽屉夹层</button></div>';
    openCustom('一张被单独搬走的课桌',`<div class="paper"><h3>器材室深处</h3><p>门后的杂物堆里压着一张旧学生桌。桌面刻痕与307旧照片里的靠窗课桌一致，它没有跟其他课桌一起处理。</p><p>抽屉底板有被撬动过的痕迹。</p></div>${action}`,'narrow');
    if(!hasItem('negative'))setTimeout(()=>$('#openDeskDrawer')?.addEventListener('click',takeFilm),0);
  }
  function inspectMedical(){ if(!hasClue('medical')){addClue('medical');addItem('medical');openProp('medical','夹在杂物箱里的医务室复印件');}else openProp('medical','医务室登记'); }
  function takeFilm(){ if(hasItem('negative'))return openProp('negative','未冲洗胶卷'); addItem('negative'); toast('在旧桌抽屉夹层里找到一卷没有冲洗的135胶卷。'); openProp('negative','未冲洗胶卷 27 / 36'); }
  function inspectCracks(){ toast('裂缝经过后期修补，但位置与5月12日底片完全对应。学校当时已经知道旧楼存在风险。') }
  function enterRooftop(){if(!hasClue('final_film'))return toast('你还无法确定当年究竟谁在现场。先把找到的胶卷冲洗出来。');state.flags.rooftopOpen=true;save();go('rooftop');}
  function inspectFullPhoto(){
    if(!hasClue('final_film')) return toast('没有事故当天的照片，你无法判断这张合影到底被裁掉了什么。');
    if(addClue('full_photo')) openText('照片最右侧','完整底片比“毕业照”更宽。最右侧还站着周老师。<br><br>所以它并不是一张严格意义上的“毕业照”：画面里既有正式毕业名册中的学生，也有林遥和班主任。<br><br>它只是2008年春天的一次班级活动合影，后来被错误归档成了毕业照。');
    else toast('真正异常的不是照片人数，而是十八年后竟没人能说清其中一个人的名字。');
  }

  function openCompare(){
    if(!hasItem('class_photo'))return toast('你还没有拿到牛皮纸袋里的照片资料。');
    openCustom('照片对照 · 307教室',`<div class="compare-workspace" id="compareSpace"><img src="${resolve(scenes.classroom.img)}" class="compare-bg" alt="2026年的307教室"><img src="assets/img/classroom_snapshot.jpg" id="dragPhoto" class="compare-photo" alt="2008年教室快照"></div><div class="compare-tools"><span>透明度</span><input id="opacityRange" type="range" min="20" max="85" value="54"><span>缩放</span><input id="scaleRange" type="range" min="55" max="135" value="78"><span>旋转</span><input id="rotateRange" type="range" min="-10" max="10" value="0"><button id="resetCompare">复位</button><button id="lockCompare">固定对照</button></div><div class="compare-result">热点没有高亮。请自己拖动照片，并用缩放、旋转把黑板和前排桌沿大致对应起来。</div>`,'wide');
    setTimeout(()=>{
      const p=$('#dragPhoto'), opacity=$('#opacityRange'), scale=$('#scaleRange'), rotate=$('#rotateRange'), result=$('.compare-result'); if(!p)return;
      let drag=false,sx=0,sy=0,sl=0,st=0,touched=false;
      const transform=()=>{p.style.transform=`scale(${(+scale.value)/100}) rotate(${+rotate.value}deg)`;};
      opacity.addEventListener('input',()=>{p.style.opacity=opacity.value/100;touched=true;});
      scale.addEventListener('input',()=>{transform();touched=true;}); rotate.addEventListener('input',()=>{transform();touched=true;}); transform();
      const down=e=>{drag=true;touched=true;p.classList.add('drag');sx=e.clientX;sy=e.clientY;sl=p.offsetLeft;st=p.offsetTop;p.setPointerCapture?.(e.pointerId);e.preventDefault();};
      const move=e=>{if(!drag)return;p.style.left=(sl+e.clientX-sx)+'px';p.style.top=(st+e.clientY-sy)+'px';};
      const up=e=>{drag=false;p.classList.remove('drag');try{p.releasePointerCapture?.(e.pointerId)}catch(_){}};
      p.addEventListener('pointerdown',down);p.addEventListener('pointermove',move);p.addEventListener('pointerup',up);p.addEventListener('pointercancel',up);
      $('#resetCompare').addEventListener('click',()=>{p.style.left='21%';p.style.top='14%';opacity.value=54;scale.value=78;rotate.value=0;p.style.opacity=.54;transform();touched=true;});
      $('#lockCompare').addEventListener('click',()=>{
        if(!touched){result.textContent='先实际移动、缩放或旋转这张旧快照。只按“固定对照”不会直接得到答案。';return;}
        const fresh=addClue('extra_desk');
        result.innerHTML=fresh?'你把黑板边缘和前排桌沿大致对应后发现：<b>2008年靠窗一侧比现在多一张学生桌。</b> 那张桌后来被单独搬走了。':'你已经确认过：2008年的靠窗区域比现在多一张课桌。';
      });
    },0);
  }

  function openDevelop(){
    if(!hasItem('negative'))return toast('放大机还能工作，但你现在没有需要冲洗的胶卷。');
    if(hasClue('final_film'))return openProp('developed','已经冲洗出的27/36号照片');
    openCustom('暗房 · 冲洗27/36号底片',`<div class="darkroom-game"><h3>把曝光控制在一个合理范围，然后开始显影。</h3><div class="tray"><div class="develop-paper" id="devPaper"><img src="assets/img/developed.jpg" alt="逐渐显影的照片"></div></div><div class="develop-controls"><label>曝光 <input id="exposure" type="range" min="1" max="10" value="5"> <span id="expVal">5</span> 秒</label><div class="timer" id="devTimer">00:00</div><button id="devBtn">开始显影</button></div><p class="micro">操作失误不会导致失败。若曝光过亮或过暗，可以重新来一次。</p></div>`,'wide');
    setTimeout(()=>{
      const r=$('#exposure'), val=$('#expVal'), btn=$('#devBtn'), paper=$('#devPaper'), timer=$('#devTimer'); if(!r||!btn)return;
      let it=null,done=false;
      setModalCleanup(()=>{if(it)clearInterval(it);it=null;});
      r.addEventListener('input',()=>val.textContent=r.value);
      btn.addEventListener('click',()=>{
        const exp=+r.value; if(exp<3||exp>8){toast('画面细节几乎看不清。调整曝光再试一次。');return;}
        btn.disabled=true;paper.classList.add('processing');let sec=0;timer.textContent='00:00';
        it=setInterval(()=>{sec++;timer.textContent='00:'+String(sec).padStart(2,'0'); if(sec>=7){clearInterval(it);it=null;if(done)return;done=true;addItem('developed');addClue('final_film');setTimeout(()=>{closeModal();openProp('developed','27/36号照片：现场并不只有林遥和韩凯');},350);}},1000);
      });
    },0);
  }

  const callDefs={
    chen1:{caller:'陈嘉树',lines:[
      ['“你还在学校？”','我已经找到一个叫林遥的人。','继续'],
      ['……','当年班里没有这个名字。你是不是把社团的人看成七班学生了？','质疑'],
      ['你为什么知道我在查社团？','我只是猜的。老校舍里还能留下什么，无非就是那些东西。','结束']
    ]},
    chen2:{caller:'陈嘉树',lines:[
      ['你把那卷胶片冲出来了，对吗？','你怎么知道那里有胶片？','继续'],
      ['……我当时也在旧楼。','照片里那个反光位置的人，是你。','继续'],
      ['是。事故之后，老师让我们把有她名字的墙报、照片都收回来。我照做了。','所以牛皮纸袋也是你准备的。','继续'],
      ['我没敢进去。钥匙和照片是我白天托人放的。十八年了，我只是想知道——如果把所有记录都拿走，一个人是不是就等于没来过。','我知道了。','结束']
    ]}
  };
  let pendingCalls=[];
  function syncCalls(){
    if(state.clues.length>=6&&!state.calls.includes('chen1')) queueCall('chen1');
    if(hasClue('final_film')&&!state.calls.includes('chen2')) queueCall('chen2');
  }
  function queueCall(id){ if(state.calls.includes(id)||pendingCalls.includes(id))return;pendingCalls.push(id);phoneBtn.classList.remove('hidden');phoneBtn.textContent='来电 · '+callDefs[id].caller;save(); }
  function answerPhone(){const id=pendingCalls.shift();if(!id)return;state.calls.push(id);save();runCall(id); if(pendingCalls.length){phoneBtn.textContent='来电 · '+callDefs[pendingCalls[0]].caller}else phoneBtn.classList.add('hidden');}
  function runCall(id){const c=callDefs[id];let i=0;const draw=()=>{const [a,b,act]=c.lines[i];openCustom('电话',`<div class="phone"><div class="caller">${c.caller}</div><div class="time">通话中</div><div class="dialogue"><p>${a}</p><p><b>${b}</b></p></div><div class="phone-choices"><button id="callNext">${act==='结束'?'挂断':'继续'}</button></div></div>`,'narrow',false);setTimeout(()=>$('#callNext')?.addEventListener('click',()=>{i++; if(i>=c.lines.length){if(id==='chen2')addClue('chen_truth');closeModal();} else draw();}),0)};draw();}

  function openEndingChoice(){
    openCustom('最后的归档决定',`<div class="phone"><div class="dialogue"><p>天台上没有新的答案了。真正需要决定的是：你要如何处理这份十八年前的材料？</p></div><div class="phone-choices"><button data-end="archive"><b>把她写回来</b><br>将证据交给学校，要求在校史里补充林遥的旁听记录。</button><button data-end="photo"><b>照片就够了</b><br>不改正式毕业名单，只要求保存这张完整春季合影。</button><button data-end="public"><b>公开旧事</b><br>整理事故与删改记录，公开发布。</button>${hasClue('bookmark')?'<button data-end="hidden"><b>重新拍一张</b><br>离开前，在空教室设置一次定时自拍。</button>':''}</div></div>`,'narrow');
    setTimeout(()=>document.querySelectorAll('[data-end]').forEach(b=>b.addEventListener('click',()=>finish(b.dataset.end))),0);
  }
  function finish(type){ state.ending=type;save(); const data={
    archive:['结局A','把她写回来','学校最终在校史备注中增加了一行：\n“2008年春，高三七班旁听学生：林遥。”\n\n她没有被伪造成正式毕业生，也不再是照片里一个没有名字的人。'],
    photo:['结局B','照片就够了','你没有要求修改正式档案。\n校史馆只保留了那张完整照片，并把说明改成：\n“2008年春，高三七班合影。”\n\n有些存在不需要一张证书来证明。'],
    public:['结局C','公开旧事','事故资料被公开后，学校不得不回应当年的管理与删改问题。\n有人感谢你，也有人认为十八年后的追问只会重新伤害旧人。\n\n真相被看见，并不等于所有人都会因此轻松。'],
    hidden:['隐藏结局','重新拍一张','你回到已经停电的307，把相机架在讲台上。\n\n闪光灯亮起。\n\n照片里只有空教室和一排排旧桌椅。可最后一排窗边，似乎有一道比阴影更浅的人形。\n\n照片背面：2026.08 · 307最后一张照片。']
  }[type];
    const elapsed=Math.max(1,Math.round((Date.now()-state.startedAt)/60000));
    openCustom('',`<div class="ending"><div class="tag">${data[0]}</div><h2>${data[1]}</h2><p>${data[2].replace(/\n/g,'<br>')}</p><div class="stats">关键线索 ${state.clues.length}/${Object.keys(clueDefs).length}　·　隐藏资料 ${hasClue('bookmark')?1:0}/1　·　调查约 ${elapsed} 分钟</div><div class="modal-actions"><button id="reviewBtn">查看线索册</button><button id="restartBtn">重新调查</button></div><div class="support"><p>案件已经结束。如果这段调查让你愿意记住林遥几分钟，可以自愿支持作者继续做下一份档案。</p><div class="support-buttons"><button data-tip="1">¥1 支持一下</button><button data-tip="3">¥3 很喜欢这个故事</button><button data-tip="6">¥6 等下一案</button><button id="leaveSupport">暂不支持</button></div><p class="micro">收款码可在项目配置中替换；不支持也不会缺少任何剧情或结局。</p></div></div>`,'wide',false);
    setTimeout(()=>{$('#restartBtn').onclick=reset;$('#reviewBtn').onclick=openNotebook;$('#leaveSupport').onclick=()=>openTitle();document.querySelectorAll('[data-tip]').forEach(b=>b.onclick=()=>support(b.dataset.tip));},0);
  }
  function support(amount){
    openCustom('自愿支持',`<div class="paper"><h3>感谢支持 ¥${amount}</h3><p>当前交付包没有写入作者的真实收款码，以避免错误收款信息。</p><p>部署前，把你的微信/支付宝收款二维码图片放进 <b>assets/img/</b>，并按 README 中“付款入口配置”替换即可。</p><p>这不会影响玩家返回结局或完整游玩。</p></div><div class="modal-actions"><button id="supportBack">返回结局</button></div>`,'narrow'); setTimeout(()=>$('#supportBack').onclick=()=>finish(state.ending||'photo'),0);
  }

  function openNotebook(){
    const order=Object.keys(clueDefs); let html='<div class="notebook"><h2>校舍清点册 / 调查记录</h2><div class="notebook-grid">';
    order.forEach(id=>{const known=hasClue(id),d=clueDefs[id]; html+=`<div class="notecard ${known?'':'unknown'}"><strong>${known?d[0]:'尚未确认'}</strong><span>${known?d[1]:'还有一条记录没有找到。'}</span></div>`}); html+='</div></div>';openCustom('线索册',html,'wide');
  }
  function canMapTo(id){
    if(id==='classroom'&&!state.flags.key)return false;
    if(id==='oldbuilding'&&!state.flags.oldBuildingOpen)return false;
    if(id==='rooftop'&&!state.flags.rooftopOpen)return false;
    return true;
  }
  function openMap(){ if(!hasItem('map'))return toast('你还没有拿到旧校区地图。'); const loc=[['gate','校门'],['guard','门卫室'],['hallway','三楼走廊'],['classroom','307教室'],['photo','摄影社'],['darkroom','暗房'],['broadcast','广播室'],['sports','器材室'],['oldbuilding','旧实验楼'],['rooftop','天台']]; let bs=loc.map(([id,n])=>`<button data-loc="${id}" ${canMapTo(id)?'':'disabled'}>${n}</button>`).join('');openCustom('旧校区平面图',`<div class="map-wrap"><img src="assets/img/map.jpg" alt="旧校区地图"><div class="location-buttons">${bs}</div></div>`,'wide');setTimeout(()=>document.querySelectorAll('[data-loc]').forEach(b=>b.onclick=()=>{if(b.disabled)return;closeModal();go(b.dataset.loc)}),0); }
  function openPhoto(){ if(!hasItem('class_photo'))return toast('你还没有拿到那张旧合影。'); openClassPhoto(); }
  function openHint(){
    const key=state.scene; state.hintLevel[key]=(state.hintLevel[key]||0)+1; const l=Math.min(3,state.hintLevel[key]); save();
    const hints={
      gate:['门边有个旧报箱。','报箱里塞着一个牛皮纸袋。','先点击画面左下方的报箱区域。'],
      guard:['你需要能进入307的东西，也需要知道旧楼怎么走。','桌面地图和左侧钥匙板都值得检查。','先拿地图，再点击左上方钥匙板。'],
      hallway:[nextObjective(),nextObjective(),nextObjective()],
      classroom:['照片本身未必能直接对应现场，纸袋里可能还有同一天的教室快照。','去307右侧的照片对照位置，把2008教室快照与现在的教室叠在一起。','拖动照片，并用缩放/旋转把黑板和课桌大致对齐，再固定对照。'],
      photo:['071不是正式学号，摄影社可能把临时成员写在别的册子里。','分别检查旧相册和借用登记册。','拿到“阿遥”“TEMP-071”“林□”三条信息即可拼出姓名。'],
      darkroom:[hasItem('negative')?'桌上的放大机可以冲洗你找到的胶卷。':'这里先找旧底片；真正需要显影的胶卷在别处。',hasItem('negative')?'点击中央显影台。':'器材室里有一张从307搬走的旧桌子。',hasItem('negative')?'曝光在3～8秒都能成功。':'去器材室检查旧桌抽屉。'],
      broadcast:['找5月19日那盘午间广播。','磁带机A里能恢复关键时间。','点击中央偏左的磁带机A。'],
      sports:['那张消失的课桌可能没有被扔掉。','先检查左侧器材室门后的杂物，再查看旧桌抽屉夹层。','点击左侧器材室门，近看旧桌后打开抽屉夹层。'],
      oldbuilding:['事故地点本身只能证明风险，不能证明现场人物。','你需要冲洗器材室那卷胶片。','先回暗房完成显影，再上楼。'],
      rooftop:['最后一个问题藏在照片边缘。','完整底片比所谓“毕业照”更宽。','点击天台画面上半部分，检查完整照片边缘。']
    }; toast((hints[key]||['继续检查环境。'])[l-1]||hints[key][hints[key].length-1]);
  }

  function openProp(id,title){const d=itemDefs[id]; if(!d)return;openCustom(title,`<img class="prop-img" src="${d[1]}" alt="${d[0]}">`,'wide')}
  function openText(title,html){openCustom(title,`<div class="paper"><h3>${title}</h3><p>${html}</p></div>`,'narrow')}
  let modalClosable=true, modalCleanup=null;
  function runModalCleanup(){if(typeof modalCleanup==='function'){try{modalCleanup()}catch(e){}}modalCleanup=null;}
  function setModalCleanup(fn){modalCleanup=fn;}
  function openCustom(title,html,cls='',closable=true){ runModalCleanup();modalClosable=closable;modal.className='modal '+cls;modal.innerHTML=`${(title||closable)?`<div class="modal-head"><h2>${title||'调查结果'}</h2>${closable?'<button class="close" id="modalClose">×</button>':''}</div>`:''}<div class="modal-body">${html}</div>`;modalLayer.classList.remove('hidden');modalLayer.setAttribute('aria-hidden','false'); if(closable)setTimeout(()=>$('#modalClose')?.addEventListener('click',closeModal),0); }
  function closeModal(){runModalCleanup();modalLayer.classList.add('hidden');modalLayer.setAttribute('aria-hidden','true');modal.innerHTML='';modalClosable=true;}
  function toast(msg,d=2800){toastEl.textContent=msg;toastEl.classList.add('show');clearTimeout(toast._t);toast._t=setTimeout(()=>toastEl.classList.remove('show'),d)}

  function updateHUD(){clueCount.textContent=state.clues.length; $('#continueBtn')?.classList.toggle('hidden',!state.started);}
  function openTitle(){closeModal();gameScreen.classList.remove('active');titleScreen.classList.add('active');updateHUD();}
  function openPrologue(){
    if(state.flags.introSeen)return;
    openCustom('',`<div class="phone"><div class="time">2026 / 08 / 18　19:37</div><div class="dialogue"><p>陈嘉树在电话里说，老校区明早就要拆。他白天整理校史材料时看见一张2008年的旧合影：正式毕业名册只有40人，却有一个女生怎么也对不上姓名。</p><p>他约你晚上到307见面，可你赶到学校时，门卫室没有任何校友入校记录。</p><p><b>19:43，你站在旧校门外。门边报箱里露出一个牛皮纸袋。</b></p></div><div class="phone-choices"><button id="introGo">进去看看</button></div></div>`,'narrow',false);
    setTimeout(()=>$('#introGo')?.addEventListener('click',()=>{state.flags.introSeen=true;save();closeModal();}),0);
  }
  function startGame(fresh=false){if(fresh){state=defaultState();}state.started=true;if(!state.startedAt)state.startedAt=Date.now();save();titleScreen.classList.remove('active');gameScreen.classList.add('active');renderScene();if(!state.flags.introSeen)openPrologue();}

  // lightweight procedural sound; no external audio assets
  let audioCtx=null; function ctx(){if(!audioCtx)audioCtx=new (window.AudioContext||window.webkitAudioContext)();return audioCtx}
  function playStep(){try{const c=ctx();[0,.18,.36].forEach((dt,i)=>{const o=c.createOscillator(),g=c.createGain();o.type='triangle';o.frequency.value=74-i*8;g.gain.setValueAtTime(0,c.currentTime+dt);g.gain.linearRampToValueAtTime(.025,c.currentTime+dt+.02);g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+dt+.09);o.connect(g).connect(c.destination);o.start(c.currentTime+dt);o.stop(c.currentTime+dt+.1);});}catch(e){}}

  function menu(){openCustom('菜单',`<div class="menu-list"><button id="menuTitle">返回标题</button><button id="menuReset">重置案件（清除本地进度）</button><button id="menuCredits">素材与许可</button></div>`,'narrow');setTimeout(()=>{$('#menuTitle').onclick=openTitle;$('#menuReset').onclick=()=>{if(confirm('确定清除当前案件进度？'))reset()};$('#menuCredits').onclick=()=>openText('素材与许可','摄影场景来自Wikimedia Commons的自由许可素材，并经过裁切、调色和叙事加工。完整作者与许可信息见项目根目录 ATTRIBUTION.txt。');},0)}

  $('#startBtn').addEventListener('click',()=>startGame(true)); $('#continueBtn').addEventListener('click',()=>startGame(false)); $('#resetBtnTitle').addEventListener('click',()=>{if(confirm('确定清除案件进度？'))reset()}); backBtn.addEventListener('click',back); phoneBtn.addEventListener('click',answerPhone);
  document.querySelectorAll('[data-tool]').forEach(b=>b.addEventListener('click',()=>({photo:openPhoto,notebook:openNotebook,map:openMap,hint:openHint,settings:menu}[b.dataset.tool]||(()=>{}))()));
  modalLayer.addEventListener('click',e=>{if(e.target===modalLayer&&modalClosable)closeModal()}); window.addEventListener('keydown',e=>{if(e.key==='Escape'&&modalClosable&&!modalLayer.classList.contains('hidden'))closeModal()});
  window.addEventListener('resize',layoutHotspots);

  normalizeState(); syncCalls(); updateHUD(); if(state.started){ $('#continueBtn').classList.remove('hidden'); }
})();
