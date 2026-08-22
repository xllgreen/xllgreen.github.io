'use strict';

const APP_REVISION='2026-08-14-final-hardening';

const SAVE_KEY='shenjiang-night-case-v2';
const META_KEY='shenjiang-night-case-meta-v1';
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];

const SCENES={
  newsroom:{title:'申江晚报夜班编辑室',short:'报馆',chapter:'夜班终校仍在继续',image:'assets/images/scene_newsroom.png',ambience:'rain',minStage:1,note:'夜班编辑室 · 终版前'},
  study:{title:'顾宅书房',short:'顾宅',chapter:'雨夜之后留下的书房',image:'assets/images/study_gun_glass.jpg',ambience:'rain',minStage:1,note:'顾宅书桌 · 巡捕到场后复原'},
  switchboard:{title:'霞飞路电话总机室',short:'电话局',chapter:'一夜之间接通过无数线路',image:'assets/images/scene_switchboard.png',ambience:'rain',minStage:2,note:'霞飞路总机室 · 手工转接'},
  darkroom:{title:'唐慎照相馆暗房',short:'暗房',chapter:'红灯下等待显影的底片',image:'assets/images/scene_darkroom.png',ambience:'rain',minStage:2,note:'唐慎照相馆 · 当夜冲洗'},
  interviews:{title:'补充采访席',short:'补录',chapter:'凌晨以后重新坐下的人们',image:'assets/images/interview_fang.jpg',ambience:'rain',minStage:3,note:'报馆侧室 · 凌晨补录'},
  finale:{title:'记者桌 · 终稿',short:'终稿',chapter:'天亮以前的最后一版',image:'assets/images/scene_newsroom.png',ambience:'rain',minStage:4,note:'《申江晚报》记者桌 · 天亮前'}
};

const PEOPLE={
  gu:{name:'顾曼青',img:'assets/images/interview_gu.jpg',role:'顾文洲之妹。留学归国，与兄长关系长期紧张。',voice:'“你们报纸已经写了什么？先告诉我这个。”',moment:'她补录后没有立刻离开，只把一张旧电影票压在桌上。那是兄妹少年时第一次自己买票看的电影。她说：“我恨过他很久，可我没想让那一下变成他的最后一晚。”'},
  fang:{name:'方正礼',img:'assets/images/interview_fang.jpg',role:'《申江晚报》夜班编辑。负责当夜终版与临时短讯。',voice:'“终版只等一刻钟。你要问，就问能落到纸上的。”',moment:'方正礼钱包里一直夹着十年前第一篇署名报道的剪报，纸已经磨得发白。他不是不相信新闻；恰恰因为太相信“版面决定现实”，才一步步把自己放到了事实前面。'},
  su:{name:'苏婉',img:'assets/images/interview_su.jpg',role:'舞厅歌女。与顾文洲相识，近日被卷入许多传闻。',voice:'“舞厅里的话最好卖，也最不值钱。你拿证据来问。”',moment:'苏婉要求记者删掉舞厅后台其他姑娘的姓名：“她们今晚还得唱，明天还得活。”她并不怕自己的名字见报，只是不愿别人替她一起付流言的账。'},
  li:{name:'黎月白',img:'assets/images/interview_li.jpg',role:'霞飞路电话总机接线员。当夜负责多路人工转接。',voice:'“线号我能签字，声音只能说我听见了什么。”',moment:'黎月白随身带一本小册子，记的不是秘密，而是每次断线、误接和被骂的时刻。她说总机员最怕的不是听见不该听的，而是“明明接对了线，最后却没人相信你”。'},
  luo:{name:'罗敬安',img:null,role:'《申江晚报》当夜校对。一直留在编辑室赶终版。',voice:'“我把铅字留了下来。那一晚我没追问来源，这是我的错，但不是凶案里的那一种错。”',moment:'罗敬安不是核心嫌疑人。他承认自己当时只顾赶版，没有追问消息来源；“方编辑说来源他担，我就把铅字留下了。”这份疏忽被写进内部复盘，但没有被包装成凶案责任。'}
};

const EVIDENCE={
  E01:{title:'终校样',scene:'newsroom',type:'news',sound:'paper',summary:'一张带红笔改动与终校时刻的角栏样张。',facsimile:'申江晚报　夜班终校\n角栏：华康洋行经理顾文洲昨夜于寓所自尽\n终校：00:32',body:'终校样右下角写着“00:32”，角栏短讯已经排入“顾文洲自尽”。纸面没有附消息来源，也没有死亡证明。'},
  E02:{title:'付印签条',scene:'newsroom',type:'slip',sound:'typewriter',summary:'夹在终校样后的短讯付印签条。',facsimile:'角栏短讯已核，可付印。\n签：方正礼　00:32',body:'签条只有一句“角栏短讯已核，可付印”，下方署名方正礼，时刻00:32。'},
  E03:{title:'巡捕到场簿',scene:'study',type:'ledger',sound:'paper',summary:'法租界巡捕房当夜的一页到场登记。',facsimile:'霞飞路巡查记录\n00:57　抵顾宅　顾文洲案',body:'巡查记录写明“00:57 抵顾宅 顾文洲案”。本页没有记载更早的巡捕到场记录。'},
  E04:{title:'现场复原笔记',scene:'study',type:'sketch',sound:'paper',summary:'巡查人员按书房原状画下的桌面与椅位笔记。',facsimile:'桌面：枪 / 半杯酒 / 遗书\n椅脚擦痕与现位不合\n右侧抽屉开启，纸屑被翻动',body:'笔记逐项记录枪、酒杯、遗书、椅脚擦痕、开启的抽屉与翻动纸屑。未使用现代编号牌，也没有在纸上直接写出“自尽”或“他杀”的判断。'},
  E05:{title:'许医生出诊笺',scene:'study',type:'medical',sound:'paper',summary:'许成章医生离开顾宅前留下的出诊笺。',facsimile:'许成章医师出诊笺\n23:05离宅\n后脑受创，意识混乱，仍能回应。建议送院观察，不宜独处。',body:'出诊笺记有离宅时刻23:05，并写“后脑受创，意识混乱，仍能回应。建议送院观察，不宜独处”。'},
  E06:{title:'公用电话计次簿',scene:'switchboard',type:'ledger',sound:'phone',summary:'霞飞路公用电话亭的一条市话计次记录。',facsimile:'市话外线计次\n00:27　霞飞路公用电话亭 → 申江晚报',body:'计次簿登记00:27有一通市话由霞飞路公用电话亭拨向《申江晚报》。栏位只有线路与时刻，没有拨号人姓名。'},
  E07:{title:'总机转接簿',scene:'switchboard',type:'ledger',sound:'paper',summary:'报馆总机当夜的一条人工转接记录。',facsimile:'00:27　外线 → 申江晚报总机 → 编辑室3号\n接听：罗敬安',body:'总机簿记录00:27外线转入编辑室3号分机，接听栏写“罗敬安”。'},
  E08:{title:'舞厅后台合照',scene:'darkroom',type:'photo',sound:'camera',summary:'一张带底片编号的舞厅后台合照。',facsimile:'底片 12-A\n背景：第二场演出牌 / 挂钟约22:24',body:'底片编号12-A。背景同时拍到第二场演出牌与挂钟，钟面约22:24；苏婉站在后台更衣镜旁。'},
  E09:{title:'顾宅门厅底片',scene:'darkroom',type:'photo',sound:'camera',summary:'雨夜街拍卷里的一张顾宅门厅底片。',facsimile:'底片 19-C\n门厅时钟：23:41\n深色马甲 / 细领带 / 右手公文夹',body:'底片编号19-C。门厅时钟指向23:41，画面中的男子穿深色马甲、细领带，右手夹公文夹；面部不够清楚。'},
  E10:{title:'暗房冲印登记',scene:'darkroom',type:'ledger',sound:'paper',summary:'唐慎照相馆的当夜收片与冲洗登记。',facsimile:'唐慎照相馆冲洗簿\n23:58　收 19-C 卷　即洗',body:'冲洗簿登记23:58收19-C卷并立即冲洗，卷号与顾宅门厅底片边缘编号一致。'},
  E11:{title:'遗书草稿碎片',scene:'study',type:'note',sound:'paper',summary:'废纸篓里几张没有署名的短句碎片。',facsimile:'……照旧。可付。\n末段不必改……',body:'纸片保留“照旧”“可付”“末段不必改”等短句，没有完整署名，也没有足够连续的笔迹可供单独鉴定。'},
  E12:{title:'顾曼青补录',scene:'interviews',type:'statement',sound:'paper',summary:'顾曼青重新签过字的一页补充口供。',facsimile:'补充口供 · 顾曼青\n“我推了他。他撞到桌角。医生来时，他还会应我。”',body:'顾曼青承认争执中推搡哥哥，顾文洲后脑撞到桌角；她也确认医生到来时顾文洲仍能回应。'},
  E13:{title:'黎月白补录',scene:'interviews',type:'statement',sound:'phone',summary:'黎月白把“亲耳听见”与“无法确认”分开的补录。',facsimile:'补录 · 黎月白\n“来电人说：老罗，照昨晚说的排。声音像方编辑。\n我只能说像，不能凭这一耳朵写死姓名。”',body:'黎月白写明外线来电者说过“老罗，照昨晚说的排”，声音与方正礼相似；她拒绝仅凭声音作确定身份判断。'},
  E14:{title:'苏婉补录',scene:'interviews',type:'statement',sound:'paper',summary:'苏婉补写了离开顾文洲之后的一段经过。',facsimile:'补录 · 苏婉\n“顾先生让我把信给方编辑。若第二天他不露面，就请报馆公开。”',body:'苏婉写明21:40前已与顾文洲分开，并代他把一封准备交给报馆公开的材料转交方正礼。'},
  E15:{title:'方正礼第二份口供',scene:'interviews',type:'statement',sound:'paper',summary:'方正礼在多份材料面前重新签下的一页口供。',facsimile:'第二份口供 · 方正礼\n23:41后入顾宅；未呼救；整理桌面与遗书。\n00:27公用电话亭致电报馆；00:31返编辑部；00:32签付印。',body:'方正礼承认23:41后进入顾宅，见顾文洲仍有气息却未呼救，并整理过桌面与遗书；之后00:27从公用电话亭致电报馆，00:31返编辑部，00:32签付印。'},
  E16:{title:'“新闻协调费”收条',scene:'study',type:'receipt',sound:'paper',summary:'保险柜夹层里的一张旧收条。',facsimile:'华康洋行\n新闻协调费　伍佰圆\n收讫：方正礼',body:'收条抬头为华康洋行，项目写“新闻协调费 伍佰圆”，收讫处署名方正礼。'},
  E17:{title:'夜班离岗簿',scene:'newsroom',type:'ledger',sound:'paper',summary:'报馆夜班人员当晚签出、签入的一页记录。',facsimile:'夜班出入簿\n方正礼　23:26 出\n方正礼　00:31 入\n旁注：雨大，方袖口尽湿。罗敬安',body:'离岗簿记录方正礼23:26签出、00:31重新签入；旁注写“雨大，方袖口尽湿。罗敬安”。'},
  E18:{title:'法医复核意见',scene:'study',type:'medical',sound:'paper',summary:'对当夜伤情与死亡过程的书面复核。',facsimile:'复核意见\n后脑撞击导致进行性颅内出血。\n23:05仍有反应；若及时送院，存在显著救治机会。',body:'复核意见写明后脑撞击导致进行性颅内出血，23:05仍有反应；若及时送院，存在显著救治机会。'}
};

const HINT_LIBRARY={
  '1:newsroom':{
    title:'报馆 · 终校材料',
    levels:['先翻终校样和付印签条，分别记下“纸上写了什么”和“谁签了字”。','第一幕要成立的异常不能只靠报馆内部材料；这页看完后，还需要去顾宅找一份独立机构留下的时间记录。','把终校样上的时刻与顾宅巡捕到场簿的时刻比较。作答时要写清两个记录方以及谁先谁后。']
  },
  '1:study':{
    title:'顾宅 · 初始记录',
    levels:['先看巡捕到场簿本身，不要把书桌上看起来可疑的物件当作结论。','到场簿记录的是“巡捕什么时候到”，不是“顾文洲什么时候死”。再回报馆找同一夜的另一份时间记录。','将E03与报馆的终校样并列。第一处异常要求的是两个机构记录之间的先后关系。']
  },
  '2:newsroom':{
    title:'报馆 · 第二幕回看',
    levels:['当前页没有第二幕必须新解的操作题；旧材料可以用于核对你已经形成的时间判断。','如果电话线路还没处理，先去电话局；如果线路已完成但时间线未完成，暗房会更有用。','第二幕的两个操作题都不在报馆：电话局负责线路，暗房负责时间线。']
  },
  '2:study':{
    title:'顾宅 · 医疗与纸片',
    levels:['第二幕新增了医生出诊笺和废纸碎片。先把原文抄进自己的时间笔记，不急着定人。','时间线至少需要一份能证明“某个时刻顾文洲仍有反应”的记录。医生出诊笺能提供这一点。','若暗房的时间线操作尚未出现，请确认E05已经取得，并继续收集暗房的三份材料。']
  },
  '2:switchboard':{
    title:'电话局 · 00:27外线',
    levels:['接线题只问线路经过哪些节点，不问拨号者是谁。每个节点都应当能在E06或E07原文里直接找到。','先找来源，再找报馆内的中继，最后找真正的分机终点；人物姓名不等于线路节点。','正确线路依次是：霞飞路公用电话亭 → 《申江晚报》总机 → 编辑室3号分机。']
  },
  '2:darkroom':{
    title:'暗房 · 时间线',
    levels:['先完成“暗房验片”：每张材料只能夹一张不越过证据边界的标签。不要让“像某人”变成“就是某人”。','E08主要固定苏婉在22:24的位置；E09固定23:41门厅出现一名衣着体态相近的男子；E10负责确认19-C卷在23:58已经进入冲洗。三者职责不同。','验片通过后才会出现时间线。时间线五个锚点依次来自舞厅、医生、顾宅门厅、外线和巡捕；具体分钟数仍要回原件核对。']
  },
  '3:newsroom':{
    title:'报馆 · 离岗记录',
    levels:['第三幕报馆新增了一份此前没有开放的材料。注意证据卡是否出现新的夜班记录。','夜班离岗簿能补上方正礼离开和回到编辑部的两个时刻。','取得E17后，再把它与顾宅门厅底片、00:27外线放在同一条时间轴上。']
  },
  '3:study':{
    title:'顾宅 · 新开放材料',
    levels:['第三幕顾宅会多出保险柜收条与法医复核。它们处理的是不同问题：一个有关关系，一个有关伤情。','若人物补录显示“材料不足”，先确认E16和E18是否已经翻过；E18也是进入终稿前必须取得的复核材料。','方正礼补录需要E16；终稿入口还要求E18。两份都在顾宅。']
  },
  '3:switchboard':{
    title:'电话局 · 证词边界',
    levels:['线路题完成以后，这一页暂时没有新的原始材料。可以回看E06与E07，区分“线路记录”和“说话者身份”。','黎月白的补录需要你先把E06、E07都取得，再去补充采访席选择不越过证据边界的问题。','对黎月白最有效的问题不是逼她百分百认人，而是让她分别说清“亲耳听见”和“不能确定”的部分。']
  },
  '3:darkroom':{
    title:'暗房 · 照片复核',
    levels:['第三幕暗房没有新增底片；这里主要供你回看人物在什么时刻、什么地点被镜头记录。','苏婉补录至少需要舞厅照片与冲洗登记；方正礼的追问也离不开顾宅门厅底片。','若补录按钮仍灰色，确认E08、E09、E10都已经取得。']
  },
  '3:interviews':{
    title:'补充采访 · 证据式追问',
    levels:['补录按钮显示“材料不足”时，不要反复点击人物；返回对应场景补齐原始材料。问错不会扣分。','顾曼青看现场与医生记录；黎月白看两份线路记录；苏婉看舞厅照片与冲洗登记。方正礼需要更多交叉材料，应最后处理。','方正礼需要E09、E11、E13、E14、E16、E17；正确追问要让他解释23:41到00:31之间的完整行踪。']
  },
  '4:finale':{
    title:'终稿 · 责任链',
    levels:['终稿桌上的四张行为签分别判断四段责任，不要求四张都压同一个姓名。','先确定最初伤害，再单独判断后来“没有求救”“整理现场”“送出短讯”的行为主体。','最初伤害对应顾曼青的补录；其余三段在方正礼第二份口供中均有直接承认，并由法医复核解释“不求救”的独立意义。']
  },
  '4:newsroom':{title:'报馆 · 终局回看',levels:['终局操作在“终稿”页；报馆页可用于重新翻阅终校样、签条与离岗簿。','如果责任链卡住，重点回看E02与E17之间的时刻关系，但不要忽略人物补录。','完成责任链请切换到“终稿”页。']},
  '4:study':{title:'顾宅 · 终局回看',levels:['终局前可在这里复核最初伤情、现场笔记、收条与法医意见。','区分“造成伤害”与“后来是否仍有救治机会”，不要把两个问题合成一个。','E12负责说明最初伤害，E18负责说明救治窗口；最终责任仍需结合E15。']},
  '4:switchboard':{title:'电话局 · 终局回看',levels:['终局前，这里只负责复核00:27线路本身。','E06与E07都不能单独确认拨号者姓名。身份需要人物补录闭合。','若要确认00:27是谁报讯，回看E15，而不是把线路登记当成身份鉴定。']},
  '4:darkroom':{title:'暗房 · 终局回看',levels:['底片负责固定人和时间，不直接负责最终归责。','顾宅门厅底片与离岗簿、方正礼补录可以互相校验。','终局操作请回“终稿”页；暗房材料主要用于检查E15是否与客观时间冲突。']},
  '4:interviews':{title:'补充采访 · 终局回看',levels:['四份第二口供都已经归档，可以逐人回看原文和记者旁记。','终局最关键的两份人物材料是E12与E15；它们描述不同阶段的行为。','再结合E18，就能判断“最初伤害”和“延误救助”为什么要分开。']}
};

const FILMS={
  intro:[
    {img:'assets/images/scene_newsroom.png',k:'1936年10月17日 · 雨夜',t:'夜班编辑室还亮着灯。终校样、签条和一叠临时送来的短讯混在同一张桌上。',s:'typewriter'},
    {img:'assets/images/study_gun_glass.jpg',k:'霞飞路 · 顾宅',t:'顾宅已经有人来过，也有人离开。桌面与纸张都保持着各自的沉默。',s:'paper'}
  ],
  stage2:[{img:'assets/images/scene_switchboard.png',k:'第二幕 · 电话与时间',t:'电话总机的插线板还留着昨夜的转接记录；暗房里也有一卷刚洗出的底片。',s:'phone'}],
  stage3:[{img:'assets/images/scene_darkroom.png',k:'第三幕 · 补充采访',t:'原始材料逐渐齐全。凌晨以后，几名关系人被重新请回报馆侧室。',s:'camera'}],
  stage4:[{img:'assets/images/interview_fang.jpg',k:'补录归档',t:'最后一份补充口供落下签名。窗外雨声已经比夜里轻了。',s:'paper'}],
  interviewGu:[{img:'assets/images/interview_gu.jpg',k:'顾曼青 · 补录结束',t:'她把笔放回桌边，没有立刻起身。',s:'paper'}],
  interviewLi:[{img:'assets/images/interview_li.jpg',k:'黎月白 · 补录结束',t:'接线员把耳机线理好，只确认自己愿意负责的那几句话。',s:'phone'}],
  interviewSu:[{img:'assets/images/interview_su.jpg',k:'苏婉 · 补录结束',t:'她看了一眼窗外的天色，请你别把舞厅里无关的人写进稿子。',s:'paper'}],
  ending:[{img:'assets/images/scene_newsroom.png',k:'天亮前 · 终稿付印',t:'排字机再次响起。你只把已经核实的内容留在版面上。',s:'typewriter'}]
};

const AUDIO={rain:'assets/audio/rain_room.wav',typewriter:'assets/audio/typewriter.wav',phone:'assets/audio/phone_ring.wav',camera:'assets/audio/camera_shutter.wav',paper:'assets/audio/paper.wav',stamp:'assets/audio/stamp.wav'};
const TIMELINE_ORDER=['su','doctor','fang','phone','police'];
const ROUTE_ORDER=['booth','switch','desk3'];
const PHOTO_AUDIT_ORDER={E08:'alibi',E09:'presence',E10:'authenticity'};
const INTERVIEW_REQ={
  gu:['E04','E05'],
  li:['E06','E07'],
  su:['E08','E10'],
  fang:['E09','E11','E13','E14','E16','E17']
};
const INTERVIEW_CORRECT={gu:'doctor',li:'boundary',su:'photo',fang:'path'};
const REVIEW_VARIANTS={
  phone:{title:'复核任务 · 电话机会窗口',question:'不依赖方正礼第二份口供，哪组材料最能说明他在00:27仍处于离岗窗口，并能在00:31回到报馆？',options:[['E06 + E17','电话亭时刻与离岗/返岗窗口互相覆盖。','correct'],['E01 + E03','只能证明报馆与巡捕记录的先后。',''],['E08 + E10','只能固定苏婉与底片冲洗。','']]},
  alibi:{title:'复核任务 · 流言排除',question:'哪组材料最能把“苏婉整夜跟着顾文洲”的流言压回事实边界？',options:[['E08 + E14','照片固定22:24位置，补录说明21:40前已分开及代转材料。','correct'],['E02 + E11','与苏婉的不在场无关。',''],['E06 + E07','只说明电话线路。','']]},
  window:{title:'复核任务 · 救治窗口',question:'哪组材料共同支持“最初撞击并非即刻致命，后续不求救具有独立意义”？',options:[['E05 + E18','医生当夜观察与法医复核相互支撑。','correct'],['E01 + E02','只涉及报馆付印。',''],['E09 + E10','只证明底片时刻与真实性。','']]},
  motive:{title:'复核任务 · 利益关系边界',question:'哪组材料能证明方正礼与顾文洲准备公开的材料存在直接利益牵连，却仍不足以单独证明他进入顾宅？',options:[['E14 + E16','代转材料与“新闻协调费”收条形成利益关系，但还需要行踪证据。','correct'],['E09 + E17','主要证明行踪窗口。',''],['E05 + E18','只处理伤情和救治机会。','']]},
  newsroom:{title:'复核任务 · 报馆核验失守',question:'哪组原始材料共同说明“00:32这则死讯已经经过人工付印，但当时并没有巡捕到场记录可供报馆核验”？',options:[['E01 + E02 + E03','终校、人工签付与巡捕到场时刻共同构成核验缺口。','correct'],['E06 + E07','只说明00:27电话线路。',''],['E11 + E16','只能提供语言习惯与利益关系。','']]}
};

function freshState(expert=false){
  const variants=Object.keys(REVIEW_VARIANTS);const seed=Math.floor(Math.random()*999999);
  const reviewQueue=expert?seededShuffle(variants,seed+73).slice(0,3):[];
  return {stage:1,scene:'newsroom',expert,sound:true,evidence:[],facts:[],interviews:{gu:false,li:false,su:false,fang:false},solved:{anomaly:false,route:false,photoAudit:false,timeline:false,final:false,review:false},hintUse:{1:0,2:0,3:0,4:0},hintHistory:{},timelinePick:[],routePick:[],photoAuditPick:{},finalPick:{injury:'',rescue:'',staging:'',tip:''},ending:null,completedOnce:false,shuffleSeed:seed,reviewVariant:'phone',reviewQueue,reviewIndex:0};
}
let state=freshState(false);

function getMeta(){try{return Object.assign({expertUnlocked:false,endings:[],supportAutoShown:false},JSON.parse(localStorage.getItem(META_KEY)||'{}'))}catch{return {expertUnlocked:false,endings:[],supportAutoShown:false}}}
function setMeta(meta){localStorage.setItem(META_KEY,JSON.stringify(meta))}
function expertAvailable(){return getMeta().expertUnlocked===true}
function save(){localStorage.setItem(SAVE_KEY,JSON.stringify(state));refreshBoot()}
function migrateState(v){
  const n=Object.assign(freshState(!!v?.expert),v||{});
  n.stage=[1,2,3,4].includes(Number(v?.stage))?Number(v.stage):1;
  n.scene=(SCENES[v?.scene]&&SCENES[v.scene].minStage<=n.stage)?v.scene:'newsroom';
  n.evidence=[...new Set((Array.isArray(v?.evidence)?v.evidence:[]).filter(id=>!!EVIDENCE[id]))];
  n.interviews=Object.fromEntries(Object.entries(Object.assign({gu:false,li:false,su:false,fang:false},v?.interviews||{})).filter(([k])=>['gu','li','su','fang'].includes(k)).map(([k,val])=>[k,!!val]));
  n.solved=Object.fromEntries(Object.entries(Object.assign({anomaly:false,route:false,photoAudit:false,timeline:false,final:false,review:false},v?.solved||{})).filter(([k])=>['anomaly','route','photoAudit','timeline','final','review'].includes(k)).map(([k,val])=>[k,!!val]));
  n.hintUse=Object.assign({1:0,2:0,3:0,4:0},v?.hintUse||{});
  n.hintHistory=(v?.hintHistory&&typeof v.hintHistory==='object')?Object.fromEntries(Object.entries(v.hintHistory).filter(([k,val])=>HINT_LIBRARY[k]&&Number(val)>0).map(([k,val])=>[k,Math.min(3,Math.max(1,Number(val)||1))])):{};
  n.timelinePick=Array.isArray(v?.timelinePick)?v.timelinePick.filter(x=>TIMELINE_ORDER.includes(x)):[];
  n.routePick=Array.isArray(v?.routePick)?v.routePick.filter(x=>ROUTE_ORDER.includes(x)):[];
  n.photoAuditPick=(v?.photoAuditPick&&typeof v.photoAuditPick==='object')?Object.fromEntries(Object.entries(v.photoAuditPick).filter(([id,val])=>PHOTO_AUDIT_ORDER[id]&&['alibi','presence','authenticity'].includes(val))):{};
  n.finalPick=Object.assign({injury:'',rescue:'',staging:'',tip:''},(v?.finalPick&&typeof v.finalPick==='object')?v.finalPick:{});
  for(const k of Object.keys(n.finalPick))if(!['顾曼青','方正礼','苏婉','黎月白','罗敬安',''].includes(n.finalPick[k]))n.finalPick[k]='';
  n.facts=(Array.isArray(v?.facts)?v.facts:[]).map(f=>String(f).replace('00:18才重新签入','00:31重新签入').replace('00:18重新签入','00:31重新签入'));
  n.ending=['sensational','best','suppress'].includes(v?.ending)?v.ending:null;
  if(!Object.keys(REVIEW_VARIANTS).includes(n.reviewVariant))n.reviewVariant='phone';
  const rq=Array.isArray(v?.reviewQueue)?v.reviewQueue.filter(x=>REVIEW_VARIANTS[x]):[];
  n.reviewQueue=n.expert?(rq.length?rq:seededShuffle(Object.keys(REVIEW_VARIANTS),n.shuffleSeed+73).slice(0,2)):[];
  n.reviewIndex=Math.min(n.reviewQueue.length,Math.max(0,Number(v?.reviewIndex)||0));
  if(n.expert&&n.solved.review)n.reviewIndex=n.reviewQueue.length;
  return n;
}
function load(){try{const raw=localStorage.getItem(SAVE_KEY);if(!raw)return false;state=migrateState(JSON.parse(raw));return true}catch{return false}}
function has(id){return state.evidence.includes(id)}
function addFact(text){if(!state.facts.includes(text))state.facts.push(text)}
function addEvidence(id,show=true){if(!EVIDENCE[id])return;if(!has(id)){state.evidence.push(id);addFactIfReady(id);save()}if(show)openEvidence(id);render()}

function refreshBoot(){
  const c=$('#continueGame');if(c)c.disabled=!localStorage.getItem(SAVE_KEY);
  const e=$('#expertGame');if(e)e.classList.toggle('hidden',!expertAvailable());
  const m=getMeta();const a=$('#archiveMeta');if(a)a.textContent=`报道档案 ${new Set(m.endings||[]).size}/3`;
}
function refreshSupportButton(){
  const b=$('#supportBtn');if(!b)return;
  const paid=typeof Paywall!=='undefined'&&Paywall.hasPaid();
  b.textContent=paid?'支持：已记录':'支持作者 1元';
  b.classList.toggle('is-supported',paid);
  b.setAttribute('aria-label',paid?'支持记录已保存':'自愿支持作者1元');
}
function showSupport(silentIfPaid=false){
  if(typeof Paywall==='undefined')return;
  if(Paywall.hasPaid()){
    refreshSupportButton();
    if(!silentIfPaid)openModal('<div class="doc-head"><h3>支持记录已保存</h3><div class="doc-meta">谢谢你为这份夜班稿留下一盏灯</div></div><div class="doc-body"><p>本机浏览器已经记录过你的支持，不需要重复操作。</p><p class="footer-note">游戏进度、提示和全部结局都与支持状态无关。</p></div>');
    return;
  }
  Paywall.show({qrCode:'paycode.png',price:'1元',title:'支持《申江夜案》',studio:'abc工作室'});
}
let supportAutoTimer=0;
function scheduleAutoSupport(delay=900){
  clearTimeout(supportAutoTimer);
  supportAutoTimer=setTimeout(()=>{
    const meta=getMeta();
    if(meta.supportAutoShown)return;
    if(typeof Paywall==='undefined'){scheduleAutoSupport(500);return}
    if(Paywall.hasPaid()){meta.supportAutoShown=true;setMeta(meta);refreshSupportButton();return}
    const filmOpen=!$('#cinematic').classList.contains('hidden');
    const modalOpen=!$('#modal').classList.contains('hidden');
    if(filmOpen||modalOpen){scheduleAutoSupport(650);return}
    meta.supportAutoShown=true;setMeta(meta);showSupport(true);
  },delay);
}
function start(expert=false){state=freshState(expert);save();$('#boot').classList.add('hidden');$('#game').classList.remove('hidden');render();playFilm(FILMS.intro);scheduleAutoSupport(900)}
function continueGame(){if(load()){$('#boot').classList.add('hidden');$('#game').classList.remove('hidden');render();switchAmbience();scheduleAutoSupport(900)}}
function resetGame(){if(confirm('确定清空《申江夜案》的本地调查进度吗？已解锁的复核模式与结局档案会保留。')){localStorage.removeItem(SAVE_KEY);state=freshState(false);refreshBoot()}}
function unlocked(scene){return state.stage>=SCENES[scene].minStage}
function stageName(){return ['','第一幕 · 夜班终校','第二幕 · 电话与时间','第三幕 · 补充采访','终幕 · 终稿'][state.stage]}
function objective(){
  if(state.expert){const names=(state.reviewQueue||[]).map(k=>REVIEW_VARIANTS[k]?.title.replace('复核任务 · ','')).filter(Boolean);return state.stage<4?`独立复核：不显示程序提示；材料与采访选项会打乱。终局随机抽取 ${names.length||3} 项交叉验证。`:'独立复核：完成责任链后，再通过三项随机证据边界复核。'}
  if(state.stage===1)return '从目前开放的场景翻阅原始材料，写下一处能够被纸面记录直接支持的异常。';
  if(state.stage===2){if(!state.solved.route)return '调查范围扩展到电话局与暗房；先把00:27外线按纸面记录接通。';if(!state.solved.photoAudit)return '线路已归档。到暗房把三份影像材料分别限制在它们真正能证明的范围内。';return '电话线路与暗房验片均已归档。继续整理当夜事件顺序。';}
  if(state.stage===3)return '新材料已经开放。补齐原件后，回到补充采访席重新询问关系人。';
  return '核对四段行为的责任主体，再决定这份报道如何付印。';
}
function sceneDesc(id){return {
  newsroom:'油墨、铅字和潮湿大衣的味道混在一起。终版还没完全锁死，编辑桌上堆着校样、签条与夜班记录。',
  study:'书桌上的物件大多保持着巡查后复原的位置。抽屉没有关严，纸张边缘被雨夜的潮气卷起。',
  switchboard:'接线员仍用插线和纸簿记录每一通市话。不同线路在木质面板上短暂相遇，又迅速断开。',
  darkroom:'红色安全灯照着水槽和夹子。底片、相纸与冲洗登记都按卷号留在当夜的工作台上。',
  interviews:'报馆侧室只开了一盏台灯。关系人依次坐下，桌上只允许放已经取得的原始材料。',
  finale:'天色将亮，终版空出最后一块位置。你的便笺、原件和补录都已经摆到记者桌上。'}[id]}

function render(){
  $('#bagCount').textContent=state.evidence.length;
  $('#soundBtn').textContent=`声音：${state.sound?'开':'关'}`;
  refreshSupportButton();
  $('#hintBtn').classList.toggle('hidden',state.expert);
  if(!state.expert)$('#hintBtn').textContent='当前页提示';
  $('#objective').textContent=objective();
  $('#stageProgress').innerHTML=`${stageName()}${state.expert?'<span class="expert-badge">复核</span>':''}<br>原始材料 ${state.evidence.length}/18 · 补录 ${Object.values(state.interviews).filter(Boolean).length}/4${state.expert?`<br>随机复核：${Math.min(state.reviewIndex||0,(state.reviewQueue||[]).length)}/${(state.reviewQueue||[]).length||3}`:''}`;
  renderNav();renderPeople();renderFacts();renderScene();switchAmbience();
}
function renderNav(){
  const order=['newsroom','study','switchboard','darkroom','interviews','finale'];
  $('#sceneNav').innerHTML=order.map(id=>`<button class="nav-btn ${state.scene===id?'active':''} ${unlocked(id)?'':'locked'}" data-scene="${id}" ${unlocked(id)?'':'disabled'}>${SCENES[id].short}</button>`).join('');
  $$('[data-scene]').forEach(b=>b.onclick=()=>{state.scene=b.dataset.scene;save();render()});
}
function renderPeople(){
  const order=['gu','fang','su','li','luo'];
  $('#peoplePanel').innerHTML=order.map(id=>{const p=PEOPLE[id];const done=id==='luo'?has('E07'):!!state.interviews[id];return `<div class="person-card">${p.img?`<img src="${p.img}" alt="${p.name}">`:`<div class="person-placeholder">罗</div>`}<div><div class="name">${p.name}</div><div class="role">${p.role}</div></div>${done?`<button data-moment="${id}">查看记者旁记</button>`:''}</div>`}).join('');
  $$('[data-moment]').forEach(b=>b.onclick=()=>openMoment(b.dataset.moment));
}
function renderFacts(){$('#factPanel').innerHTML=state.facts.length?state.facts.slice(-9).map(f=>`<div class="fact">${f}</div>`).join(''):'还没有足够确定、可以写进报道的事实。'}
function renderScene(){
  const s=SCENES[state.scene];
  let body=`<div class="scene-header"><div class="scene-photo"><img src="${s.image}" alt="${s.title}"><div class="photo-note">${s.note}</div></div><div class="scene-copy"><div class="chapter">${s.chapter}</div><div class="eyebrow">${stageName()}</div><h3>${s.title}</h3><p>${sceneDesc(state.scene)}</p>${sceneNotice()}</div></div>`;
  if(state.scene==='interviews')body+=renderInterviews();
  else if(state.scene==='finale')body+=renderFinale();
  else body+=renderEvidenceFiles(state.scene)+renderPuzzle(state.scene);
  $('#sceneContent').innerHTML=body;bindScene();
}
function sceneNotice(){
  if(state.expert)return '<div class="notice">独立复核模式：场景顺序与材料编号不会替你指出下一步。</div>';
  const ids=sceneCards(state.scene);const unopened=ids.filter(id=>!has(id)).length;
  if(state.scene==='interviews')return `<div class="notice">采访席状态：已完成 ${Object.values(state.interviews).filter(Boolean).length}/4 份补录。需要帮助时使用右上角“当前页提示”。</div>`;
  if(state.scene==='finale')return '<div class="notice">终稿桌只汇总已归档内容。需要帮助时使用右上角“当前页提示”。</div>';
  return `<div class="notice">本页可翻阅材料 ${ids.length} 份，其中 ${unopened} 份尚未展开。提示不会自动显示，需从右上角主动查看。</div>`;
}
function sceneCards(scene){
  let ids=Object.entries(EVIDENCE).filter(([,e])=>e.scene===scene).map(([id])=>id).filter(visibleEvidence);
  if(state.expert)ids=seededShuffle(ids,state.shuffleSeed+scene.length);
  return ids;
}
function seededShuffle(arr,seed){const a=[...arr];let x=seed||1;for(let i=a.length-1;i>0;i--){x=(x*9301+49297)%233280;const j=Math.floor((x/233280)*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function visibleEvidence(id){
  if(['E01','E02','E03','E04'].includes(id))return true;
  if(['E05','E06','E07','E08','E09','E10','E11'].includes(id))return state.stage>=2;
  if(['E16','E17','E18'].includes(id))return state.stage>=3;
  return false;
}
function renderEvidenceFiles(scene){
  const ids=sceneCards(scene);if(!ids.length)return '';
  return `<div class="case-files evidence-desk">${ids.map((id,i)=>{const e=EVIDENCE[id];const label=state.expert&&!has(id)?'未编号材料':id;return `<article class="evidence-file" data-type="${e.type}" data-file-index="${i}"><div class="material-mark">${materialLabel(e.type)}</div><div class="eid">${label} · ${SCENES[e.scene].short}</div><h4>${e.title}</h4><p>${e.summary}</p><button class="evidence-btn ${has(id)?'obtained':''}" data-evidence="${id}">${has(id)?'重新翻阅':'展开原件'}</button></article>`}).join('')}</div>`;
}
function materialLabel(type){return {news:'终校样',slip:'签条',ledger:'簿册',sketch:'现场笔记',medical:'医师笺',photo:'底片',note:'碎纸',receipt:'收条',statement:'口供'}[type]||'案卷';}

function renderPuzzle(scene){
  if(state.stage===1&&!state.solved.anomaly&&(scene==='newsroom'||scene==='study')&&has('E01')&&has('E03')){
    return `<section class="puzzle"><h4>夹报核验 · 第一处异常</h4><p>翻回已经取得的原件，自行比较它们的记录内容。用一句话写出一处能够直接成立、且不依赖人物猜测的异常。</p><div class="answer-row"><input id="anomalyInput" class="answer-input" placeholder="写下你的核验结论……"><button class="action-btn" data-action="check-anomaly">写入便笺</button></div></section>`;
  }
  if(state.stage===2&&scene==='switchboard'&&!state.solved.route&&has('E06')&&has('E07'))return renderRoutePuzzle();
  if(state.stage===2&&scene==='darkroom'&&state.solved.route&&!state.solved.photoAudit&&['E08','E09','E10'].every(has))return renderPhotoAuditPuzzle();
  if(state.stage===2&&state.solved.route&&state.solved.photoAudit&&!state.solved.timeline&&['switchboard','darkroom'].includes(scene)&&['E05','E08','E09','E10'].every(has))return renderTimelinePuzzle();
  return '';
}
function renderRoutePuzzle(){
  const chosen=state.routePick.map(id=>routeLabel(id)).join(' → ')||'尚未接线';
  return `<section class="puzzle"><h4>手工接线 · 00:27外线</h4><p>依据已经取得的两份原始记录，按“来源—中继—终点”选择三个节点。只采用纸面记录能够直接支持的选项。</p><div class="wire-board"><div class="wire-column"><h5>来源</h5>${wire('booth','霞飞路公用电话亭')}${wire('mansion','顾宅电话')}</div><div class="wire-column"><h5>中继</h5>${wire('switch','《申江晚报》总机')}${wire('police','巡捕房值班台')}</div><div class="wire-column"><h5>终点</h5>${wire('desk3','编辑室3号分机')}${wire('fang','方正礼本人')}</div></div><div class="wire-path">当前线路：${chosen}</div><div class="answer-row"><button class="action-btn" data-action="check-route">核对线路</button><button class="action-btn" data-action="reset-route">拔线重接</button></div></section>`;
}
function wire(id,label){return `<button class="wire-node ${state.routePick.includes(id)?'selected':''}" data-wire="${id}">${label}</button>`}
function routeLabel(id){return {booth:'霞飞路公用电话亭',mansion:'顾宅电话',switch:'报馆总机',police:'巡捕房值班台',desk3:'编辑室3号分机',fang:'方正礼本人'}[id]||id}
function renderPhotoAuditPuzzle(){
  const rows=[
    ['E08','舞厅后台合照',[['alibi','固定苏婉在22:24仍位于舞厅后台'],['presence','确认23:41顾宅门厅男子就是方正礼'],['authenticity','证明19-C底片不是第二天补拍']]],
    ['E09','顾宅门厅底片',[['presence','固定23:41有一名衣着体态与方正礼相近的男子进入门厅，但面部不足以单独定人'],['alibi','证明苏婉21:40前已与顾文洲分开'],['authenticity','证明整卷底片23:58已经冲洗']]],
    ['E10','暗房冲印登记',[['authenticity','用卷号与23:58冲洗记录确认19-C属于当夜成片，排除事后补拍'],['presence','直接证明方正礼本人进入顾宅'],['alibi','直接证明苏婉不在顾宅']]]
  ];
  return `<section class="puzzle darkroom-audit"><h4>暗房验片 · 证据边界</h4><p>底片最容易被“看图定案”。给三份材料分别夹上一张只写它真正能证明内容的记者标签；不要让照片替你证明它没有拍清的东西。</p><div class="audit-board">${rows.map(([id,title,choices])=>`<div class="audit-row"><div class="audit-negative"><span>${id}</span><strong>${title}</strong></div><div class="audit-tags">${choices.map(([value,label])=>`<button class="audit-tag ${state.photoAuditPick[id]===value?'selected':''}" data-photo-audit="${id}|${value}">${label}</button>`).join('')}</div></div>`).join('')}</div><div class="answer-row"><button class="action-btn" data-action="check-photo-audit">核对验片标签</button><button class="action-btn" data-action="reset-photo-audit">重新夹签</button></div></section>`;
}
function validatePhotoAudit(pick){return Object.entries(PHOTO_AUDIT_ORDER).every(([id,val])=>pick?.[id]===val)}
function renderTimelinePuzzle(){
  const items={su:'舞厅后台合照中的苏婉',doctor:'许医生离开顾宅',fang:'顾宅门厅底片中的男子',phone:'公用电话亭外线拨向报馆',police:'巡捕抵达顾宅'};
  return `<section class="puzzle"><h4>排片时间线 · 当夜记录</h4><p>五个事件的具体时刻都藏在你已经取得的原件里。先翻材料，再按先后依次点击；选错可以撤回。</p><div class="timeline-board"><div class="timeline-pool">${Object.entries(items).map(([id,t])=>`<button class="timeline-choice ${state.timelinePick.includes(id)?'used':''}" data-time="${id}" ${state.timelinePick.includes(id)?'disabled':''}>${t}</button>`).join('')}</div><div class="timeline-result"><strong>记者手写顺序</strong><ol>${state.timelinePick.map(id=>`<li>${items[id]}</li>`).join('')}</ol></div></div><div class="answer-row"><button class="action-btn" data-action="check-timeline">核对时间线</button><button class="action-btn" data-action="undo-time">撤回一步</button><button class="action-btn" data-action="reset-time">全部重排</button></div></section>`;
}

function renderInterviews(){
  const order=['gu','li','su','fang'];
  const copy={gu:'她的第一份说法仍有一段时间经过没有解释清楚。',li:'她愿意重新说明当夜转接，但拒绝替自己没听清的部分作保证。',su:'舞厅流言很多，她要求记者只拿能核实的材料提问。',fang:'他仍以“赶终版”为由回避离开报馆后的具体经过。'};
  return `<div class="interview-grid">${order.map(id=>{const p=PEOPLE[id],ok=canInterview(id),done=state.interviews[id];return `<article class="interview-card"><div class="interview-photo"><img src="${p.img}" alt="${p.name}"><span>补充采访 · ${p.name}</span></div><h4>${p.name}${done?' · 已补录':''}</h4><p class="interview-opening">${p.voice}</p><p>${copy[id]}</p><div class="footer-note">${done?'补录已归档。':ok?'现有材料足以开始交叉询问。':'现有材料还不足以进行有效补录；可查看当前页提示。'}</div>${done?'<div class="interview-status">第二份口供已归档，可在关系人栏查看记者旁记。</div>':`<button class="interview-btn" data-interview="${id}" ${ok?'':'disabled'}>${ok?'开始追问':'材料不足'}</button>`}</article>`}).join('')}</div>${renderInterviewAdvance()}`;
}
function canInterview(id){return INTERVIEW_REQ[id].every(has)&&!state.interviews[id]}
function renderInterviewAdvance(){const all=Object.values(state.interviews).every(Boolean);return all&&has('E18')?'<section class="puzzle"><h4>补录归档</h4><p>四份补录与当前开放的复核材料均已归档。你可以把案件袋带到终稿桌。</p><button class="action-btn" data-action="to-finale">进入终稿</button></section>':''}
function startInterview(id){
  if(!canInterview(id))return;
  let q={
    gu:[['family','“你和哥哥是不是一直关系很差？”'],['doctor','“许医生23:05离开时写他仍能回应。你离开书房前到底发生了什么？”'],['money','“你欠了哥哥多少钱？”']],
    li:[['voice','“你是不是百分之百确定来电就是方正礼？”'],['boundary','“E06与E07只证明线路。请把你亲耳听到的部分和你不能确定的部分分开说。”'],['fear','“方正礼是不是威胁过你？”']],
    su:[['rumor','“大家都说你是最后见到顾文洲的人，对吗？”'],['photo','“E08把你固定在22:24后台。你21:40前与顾文洲分开后，还替他做过什么？”'],['romance','“你和顾文洲究竟是什么关系？”']],
    fang:[['motive','“500元收条是不是说明你一定杀了他？”'],['path','“23:41你在顾宅，00:27外线来自公用电话亭，00:31你才返岗。请把这50分钟完整说一遍。”'],['note','“遗书里有编辑口吻，所以是你写的？”']]
  }[id];
  if(state.expert)q=seededShuffle(q,state.shuffleSeed+id.charCodeAt(0));
  openModal(`<div class="doc-head"><h3>${PEOPLE[id].name} · 补充采访</h3><div class="doc-meta">不要诱导人物承认记者已经假定的结论。</div></div><div class="doc-body"><p class="interview-voice">${PEOPLE[id].voice}</p><p>选择一条真正由现有材料支撑、同时尊重证据边界的问题。</p><div class="question-list">${q.map(([v,t])=>`<button class="question-btn" data-interview-choice="${id}|${v}">${t}</button>`).join('')}</div></div>`);
  bindModalActions();
}
function answerInterview(id,choice){
  if(choice!==INTERVIEW_CORRECT[id]){
    const text={gu:'顾曼青只重复家产争执，关键时间仍未被问到。',li:'黎月白拒绝把“像”说成“确定”，这个回答反而提醒你问题越过了证据边界。',su:'苏婉说：“如果你只想写舞厅传闻，那这不是补录。”',fang:'方正礼抓住你推论过度的地方，只说“那不是证明”。'}[id];
    openModal(`<div class="doc-head"><h3>追问没有击中矛盾</h3></div><div class="doc-body"><p>${text}</p><button class="action-btn" data-retry-interview="${id}">换一个问题</button></div>`);bindModalActions();return;
  }
  const map={gu:'E12',li:'E13',su:'E14',fang:'E15'};
  state.interviews[id]=true;if(!has(map[id]))state.evidence.push(map[id]);addFact(`${PEOPLE[id].name}的第二份口供已归档。`);save();closeModal();render();
  const films={gu:FILMS.interviewGu,li:FILMS.interviewLi,su:FILMS.interviewSu,fang:FILMS.stage4}[id];
  playFilm(films);
}
function openMoment(id){const p=PEOPLE[id];openModal(`<div class="doc-head"><h3>${p.name} · 记者旁记</h3><div class="doc-meta">不直接作为责任判定证据</div></div><div class="doc-body"><p>${p.moment}</p><p class="footer-note">人物片段用于补足性格和处境，不自动改变证据链。</p></div>`)}

function renderFinale(){
  if(!state.solved.final)return `<section class="puzzle responsibility-board"><h4>责任链 · 四段行为</h4><p>把人物姓名签分别压在四段行为下。这里判断的是“谁对这一段行为负主要责任”，不是选一个总凶手。</p><div class="final-grid">${finalItem('injury','最初伤害')}${finalItem('rescue','延误救助')}${finalItem('staging','伪造“自尽”现场')}${finalItem('tip','00:27提前送讯')}</div><button class="action-btn" data-action="check-final">提交责任链</button></section>`;
  if(state.expert&&!state.solved.review)return renderExpertReview();
  const meta=getMeta();const endings=new Set(meta.endings||[]);
  return `<div class="notice"><strong>责任链已成立。</strong>报道选择不会改变事实，但会改变你怎样处理公众知情权、隐私与程序。</div><div class="report-options"><div class="report"><h4>《号外》</h4><p>把家产争执、舞厅传闻和全部姓名一起推上头版，以最大轰动逼迫重查。</p><button class="action-btn" data-ending="sensational">付印${endings.has('sensational')?' · 已见':''}</button></div><div class="report best"><h4>《第二版》</h4><p>写清四段责任链与报馆失守，同时删除与责任无关的私生活，对边缘人物作必要匿名。</p><button class="action-btn" data-ending="best">付印${endings.has('best')?' · 已见':''}</button></div><div class="report"><h4>《压稿》</h4><p>把完整材料交巡捕房，报纸仅刊“案件重新调查中”，把程序放在公开之前。</p><button class="action-btn" data-ending="suppress">付印${endings.has('suppress')?' · 已见':''}</button></div></div><div class="archive-progress">报道档案：${endings.size}/3。不同终稿均保留同一案件事实，但会补全不同的记者伦理后果。</div>`;
}
function finalItem(id,label){const people=['顾曼青','方正礼','苏婉','黎月白','罗敬安'];return `<div class="final-item"><strong>${label}</strong><div class="responsibility-picks">${people.map(name=>`<button class="responsibility-name ${state.finalPick[id]===name?'selected':''}" data-final-pick="${id}|${name}">${name}</button>`).join('')}</div><div class="responsibility-current">${state.finalPick[id]?`已压签：${state.finalPick[id]}`:'尚未压签'}</div></div>`}
function renderExpertReview(){
  const key=(state.reviewQueue||[])[state.reviewIndex]||state.reviewVariant;const r=REVIEW_VARIANTS[key];const opts=seededShuffle(r.options,state.shuffleSeed+211+(state.reviewIndex||0)*31);return `<section class="puzzle expert-review"><div class="review-counter">随机复核 ${(state.reviewIndex||0)+1}/${(state.reviewQueue||[]).length||1}</div><h4>${r.title}</h4><p>${r.question}</p><div class="question-list">${opts.map(([label,,flag])=>`<button class="question-btn" data-review-answer="${flag==='correct'?'1':'0'}"><strong>${label}</strong></button>`).join('')}</div><p class="footer-note">独立复核只看材料能直接覆盖的事实边界；选项顺序会随本轮案卷变化。</p></section>`;
}

function bindScene(){
  $$('[data-evidence]').forEach(b=>b.onclick=()=>addEvidence(b.dataset.evidence,true));
  $$('[data-action]').forEach(b=>b.onclick=()=>handleAction(b.dataset.action));
  $$('[data-interview]').forEach(b=>b.onclick=()=>startInterview(b.dataset.interview));
  $$('[data-ending]').forEach(b=>b.onclick=()=>ending(b.dataset.ending));
  $$('[data-wire]').forEach(b=>b.onclick=()=>chooseWire(b.dataset.wire));
  $$('[data-time]').forEach(b=>b.onclick=()=>chooseTime(b.dataset.time));
  $$('[data-photo-audit]').forEach(b=>b.onclick=()=>choosePhotoAudit(b.dataset.photoAudit));
  $$('[data-final-pick]').forEach(b=>b.onclick=()=>chooseFinalPick(b.dataset.finalPick));
  $$('[data-review-answer]').forEach(b=>b.onclick=()=>checkReview(b.dataset.reviewAnswer==='1'));
}
function bindModalActions(){
  $$('[data-interview-choice]').forEach(b=>b.onclick=()=>{const [id,c]=b.dataset.interviewChoice.split('|');answerInterview(id,c)});
  $$('[data-retry-interview]').forEach(b=>b.onclick=()=>startInterview(b.dataset.retryInterview));
  $$('[data-hint-more]').forEach(b=>b.onclick=unlockNextHint);
}
function chooseWire(id){if(state.routePick.length>=3||state.routePick.includes(id))return;state.routePick.push(id);save();render()}
function chooseTime(id){if(state.timelinePick.includes(id)||state.timelinePick.length>=5)return;state.timelinePick.push(id);save();render()}
function choosePhotoAudit(raw){const [id,val]=String(raw||'').split('|');if(!PHOTO_AUDIT_ORDER[id]||!['alibi','presence','authenticity'].includes(val))return;state.photoAuditPick[id]=val;save();render()}
function chooseFinalPick(raw){const [slot,name]=String(raw||'').split('|');if(!['injury','rescue','staging','tip'].includes(slot)||!['顾曼青','方正礼','苏婉','黎月白','罗敬安'].includes(name))return;state.finalPick[slot]=name;save();render()}
function validateRoute(arr){return arr.join('|')===ROUTE_ORDER.join('|')}
function validateTimeline(arr){return arr.join('|')===TIMELINE_ORDER.join('|')}
function isAnomalyAnswer(v){const s=String(v||'').replace(/\s/g,'');return (/报馆|报纸/.test(s))&&(/巡捕|警方/.test(s))&&(/早|先|提前|之前/.test(s))}
function validateFinal(v){return v.join('|')==='顾曼青|方正礼|方正礼|方正礼'}
function handleAction(a){
  if(a==='check-anomaly')return checkAnomaly();
  if(a==='check-route')return checkRoute();
  if(a==='reset-route'){state.routePick=[];save();return render()}
  if(a==='check-photo-audit')return checkPhotoAudit();
  if(a==='reset-photo-audit'){state.photoAuditPick={};save();return render()}
  if(a==='check-timeline')return checkTimeline();
  if(a==='undo-time'){state.timelinePick.pop();save();return render()}
  if(a==='reset-time'){state.timelinePick=[];save();return render()}
  if(a==='to-finale'){state.stage=4;state.scene='finale';save();render();playFilm(FILMS.stage4);return}
  if(a==='check-final')return checkFinal();
}
function checkAnomaly(){const v=$('#anomalyInput')?.value||'';if(!isAnomalyAnswer(v))return openModal('<div class="doc-head"><h3>便笺还不能成立</h3></div><div class="doc-body"><p>答案需要同时写出两个记录方与明确先后关系。只写“时间不对”仍然过宽。</p></div>');state.solved.anomaly=true;state.stage=2;addFact('00:32报馆已排出“自尽”，早于巡捕00:57第一次到场。');save();render();playFilm(FILMS.stage2)}
function checkRoute(){if(!validateRoute(state.routePick))return openModal('<div class="doc-head"><h3>线路没有接通</h3></div><div class="doc-body"><p>至少有一个节点或顺序没有被原始登记直接支持。重新翻E06与E07；需要更具体帮助时使用“当前页提示”。</p></div>');state.solved.route=true;addFact('00:27外线：公用电话亭 → 报馆总机 → 编辑室3号；接听人为罗敬安，线路本身不证明拨号人。');save();render();playSfx('phone')}
function checkPhotoAudit(){if(!validatePhotoAudit(state.photoAuditPick))return openModal('<div class="doc-head"><h3>验片标签有一处越界</h3></div><div class="doc-body"><p>至少有一张标签写进了照片或登记簿并不能直接证明的结论。重新区分“看到谁在哪里”“像谁”“底片何时冲洗”三个层级；需要更具体帮助时使用当前页提示。</p></div>');state.solved.photoAudit=true;addFact('暗房三份材料的证明边界已核清：位置、人物相似性与底片真实性不能互相替代。');save();render();playSfx('camera')}
function checkTimeline(){if(!validateTimeline(state.timelinePick))return openModal('<div class="doc-head"><h3>时间线仍有冲突</h3></div><div class="doc-body"><p>至少一个事件的位置不正确。重新翻原件中的分钟数；需要更具体帮助时使用“当前页提示”。</p></div>');state.solved.timeline=true;state.stage=3;state.scene='interviews';addFact('22:24—00:57关键事件已连续重建。');save();render();playFilm(FILMS.stage3)}
function checkFinal(){const v=[state.finalPick.injury,state.finalPick.rescue,state.finalPick.staging,state.finalPick.tip];if(!validateFinal(v))return openModal('<div class="doc-head"><h3>责任链尚未闭合</h3></div><div class="doc-body"><p>至少一段行为与已经归档的口供或复核材料不一致。逐项检查行为主体；需要更具体帮助时使用“当前页提示”。</p></div>');state.solved.final=true;addFact('责任链：顾曼青造成最初伤害；方正礼延误救助、伪造现场，并在00:27从公用电话亭提前送讯。');save();render();playSfx('stamp')}
function checkReview(ok){if(!ok)return openModal('<div class="doc-head"><h3>复核未通过</h3></div><div class="doc-body"><p>这组材料没有直接覆盖题目要求的事实边界。独立复核不看“最可疑”，只看“最能互相验证”。</p></div>');const key=(state.reviewQueue||[])[state.reviewIndex]||state.reviewVariant;addFact(`独立复核通过：${REVIEW_VARIANTS[key].title.replace('复核任务 · ','')}。`);state.reviewIndex=(state.reviewIndex||0)+1;if(state.reviewIndex>=(state.reviewQueue||[]).length){state.solved.review=true;playSfx('stamp')}save();render()}
function addFactIfReady(id){const map={E01:'00:32时，报馆终校样已经出现顾文洲死讯。',E03:'巡捕房00:57才第一次抵达顾宅。',E05:'23:05时顾文洲仍能回应。',E08:'22:24时苏婉仍在舞厅后台。',E09:'23:41顾宅门厅出现与方正礼衣着体态一致的男子。',E17:'夜班离岗簿记录方正礼23:26签出、00:31重新签入。',E18:'最初撞击并非即刻致命，存在独立救治窗口。'};if(map[id])addFact(map[id])}

function openEvidence(id){const e=EVIDENCE[id];playSfx(e.sound);openModal(`<div class="doc-head"><h3>${id} · ${e.title}</h3><div class="doc-meta">原始材料 / ${SCENES[e.scene].title}</div></div><div class="doc-body"><div class="doc-facsimile">${e.facsimile.replace(/\n/g,'<br>')}<br><br><span class="doc-stamp">复核原件</span></div><p>${e.body}</p><p class="footer-note">记者注：先抄下原文、时刻、署名与来源，再决定它能否和别的材料互相印证。</p></div>`)}
function openModal(html){$('#modalBody').innerHTML=html;$('#modal').classList.remove('hidden')}
function closeModal(){$('#modal').classList.add('hidden')}
function bag(){const list=state.evidence.length?state.evidence.map(id=>`<div class="evidence-row"><strong>${id} · ${EVIDENCE[id].title}</strong><div>${EVIDENCE[id].summary}</div></div>`).join(''):'<p>案件袋为空。</p>';openModal(`<div class="doc-head"><h3>记者案件袋</h3><div class="doc-meta">${state.evidence.length}/18 · 已取得材料</div></div><div class="evidence-list">${list}</div>`)}
function hintKey(){
  const direct=`${state.stage}:${state.scene}`;
  if(HINT_LIBRARY[direct])return direct;
  const fallback=`${state.stage}:finale`;
  return HINT_LIBRARY[fallback]?fallback:Object.keys(HINT_LIBRARY)[0];
}
function hintEntry(){return HINT_LIBRARY[hintKey()]}
function hint(){
  if(state.expert)return;
  const key=hintKey(),entry=hintEntry();
  if(!entry)return;
  if(!state.hintHistory||typeof state.hintHistory!=='object')state.hintHistory={};
  if(!state.hintHistory[key]){state.hintHistory[key]=1;save()}
  openHintModal();
}
function openHintModal(){
  const key=hintKey(),entry=hintEntry();if(!entry)return;
  const unlocked=Math.max(1,Math.min(3,Number(state.hintHistory?.[key]||1)));
  const rows=entry.levels.slice(0,unlocked).map((text,i)=>`<div class="hint-entry"><div class="hint-level">第 ${i+1} 级</div><p>${text}</p></div>`).join('');
  const more=unlocked<3?`<button class="action-btn" data-hint-more="1">解锁第 ${unlocked+1} 级提示</button>`:'<span class="hint-complete">本页三级提示均已解锁，可随时回看。</span>';
  const past=Object.entries(state.hintHistory||{}).filter(([k,v])=>k!==key&&v>0&&HINT_LIBRARY[k]).map(([k,v])=>{const h=HINT_LIBRARY[k],count=Math.max(1,Math.min(3,Number(v)));return `<div class="hint-archive-group"><div class="hint-archive-title">${h.title} · ${count}/3</div>${h.levels.slice(0,count).map((text,i)=>`<div class="hint-archive-row"><strong>${i+1}</strong><span>${text}</span></div>`).join('')}</div>`}).join('');
  const archive=past?`<details class="hint-archive"><summary>回看其他页面已解锁提示</summary>${past}</details>`:'';
  openModal(`<div class="doc-head"><h3>当前页提示 · ${entry.title}</h3><div class="doc-meta">${stageName()} / 已解锁 ${unlocked}/3</div></div><div class="doc-body"><div class="hint-history">${rows}</div><div class="hint-actions">${more}</div>${archive}<p class="footer-note">提示按“阶段 + 当前场景”分别保存。切换页面后内容会跟着变化；已经解锁的旧提示会保留在回看记录里。</p></div>`);
  bindModalActions();
}
function unlockNextHint(){
  const key=hintKey();if(!HINT_LIBRARY[key])return;
  if(!state.hintHistory||typeof state.hintHistory!=='object')state.hintHistory={};
  state.hintHistory[key]=Math.min(3,Math.max(1,Number(state.hintHistory[key]||1))+1);save();openHintModal();
}

function ending(type){
  const data={
    sensational:{title:'结局 · 号外',text:'你把所有姓名与私人关系一起推上头版。巡捕房迅速重查，报纸销量暴涨；但苏婉和顾曼青的生活也被永久钉在最耸动的叙事里。你公开了事实，也把事实之外的东西一起卖掉了。'},
    best:{title:'最佳结局 · 第二版',text:'你写清顾曼青造成最初伤害、方正礼延误救助并伪造现场，以及他00:27从公用电话亭提前送讯、00:31返岗、00:32签付印的完整链条。同时删去与责任无关的私生活，并在文末写明报馆自身的核验失守。'},
    suppress:{title:'结局 · 压稿',text:'你先把材料交给巡捕房，报纸只留“案件重新调查中”。程序得到最大尊重，但公众暂时看不到一条提前写好的死讯怎样差点替代事实。几周后，内部整改开始，却没有头版记住它。'}
  }[type];
  state.ending=type;state.completedOnce=true;save();const meta=getMeta();meta.expertUnlocked=true;meta.endings=[...new Set([...(meta.endings||[]),type])];setMeta(meta);refreshBoot();
  playFilm([...FILMS.ending],()=>openModal(`<div class="ending"><div class="edition">申江晚报 · ${type==='best'?'第二版':type==='sensational'?'号外':'暂缓稿'}</div><h3>${data.title}</h3><p>${data.text}</p><p><strong>独立复核已解锁。</strong>复核模式会隐藏程序提示、打乱同场景材料和采访选项，并在终局从多类证据边界题中随机抽取三项交叉验证。</p><p>报道档案：${new Set(meta.endings).size}/3。</p></div>`));
}

function switchAmbience(){if(!state.sound)return;const a=$('#ambience');const src=AUDIO[SCENES[state.scene].ambience]||AUDIO.rain;if(!a.src.endsWith(src)){a.src=src;a.volume=.16;a.play().catch(()=>{})}else if(a.paused)a.play().catch(()=>{})}
function playSfx(kind){if(!state.sound)return;const src=AUDIO[kind];if(!src)return;const s=$('#sfx');s.src=src;s.volume=.32;s.play().catch(()=>{})}
function toggleSound(){state.sound=!state.sound;save();if(!state.sound){$('#ambience').pause();$('#sfx').pause()}render()}
function playFilm(frames,cb){if(!frames||!frames.length){cb?.();return}let i=0;const overlay=$('#cinematic');const show=()=>{const f=frames[i],im=$('#filmImage');im.style.animation='none';void im.offsetWidth;im.style.animation='';im.src=f.img;$('#filmKicker').textContent=f.k;$('#filmText').textContent=f.t;$('#filmNext').textContent=i===frames.length-1?'进入':'继续';if(f.s)playSfx(f.s)};$('#filmNext').onclick=()=>{i++;if(i>=frames.length){overlay.classList.add('hidden');cb?.();switchAmbience();return}show()};show();overlay.classList.remove('hidden')}

function attach(){
  $('#newGame').onclick=()=>start(false);$('#continueGame').onclick=continueGame;$('#expertGame').onclick=()=>start(true);$('#resetGame').onclick=resetGame;
  $('#modalClose').onclick=closeModal;$('#modal').onclick=e=>{if(e.target.id==='modal')closeModal()};
  $('#bagBtn').onclick=bag;$('#hintBtn').onclick=hint;$('#supportBtn').onclick=()=>showSupport(false);$('#soundBtn').onclick=toggleSound;$('#saveBtn').onclick=()=>{save();openModal('<div class="doc-head"><h3>已落笔存档</h3></div><div class="doc-body"><p>当前调查进度已经写入本机浏览器。</p></div>')};
  window.addEventListener('shenjiang-support-updated',refreshSupportButton);
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(typeof Paywall!=='undefined'&&Paywall.isOpen()){Paywall.hide();return}closeModal();$('#cinematic').classList.add('hidden')}if(e.key.toLowerCase()==='h'&&!state.expert)hint();if(e.key.toLowerCase()==='m')toggleSound()});
}

async function checkImages(){const imgs=[...new Set([...Object.values(SCENES).map(x=>x.image),...Object.values(PEOPLE).map(x=>x.img).filter(Boolean),...Object.values(FILMS).flat().map(x=>x.img)])];return Promise.all(imgs.map(src=>new Promise(res=>{const im=new Image();im.onload=()=>res({src,ok:true});im.onerror=()=>res({src,ok:false});im.src=src})))}
async function runQA(){
  const errors=[];const original=state;
  try{
    if(Object.keys(EVIDENCE).length!==18)errors.push('evidence-count');
    if(!isAnomalyAnswer('报馆比巡捕更早形成了自尽记录'))errors.push('anomaly-validator');
    if(isAnomalyAnswer('时间不对'))errors.push('anomaly-too-loose');
    if(!validateRoute(['booth','switch','desk3']))errors.push('route-validator');
    if(validateRoute(['booth','switch','fang']))errors.push('route-identity-boundary');
    if(!validatePhotoAudit({E08:'alibi',E09:'presence',E10:'authenticity'}))errors.push('photo-audit-validator');
    if(validatePhotoAudit({E08:'presence',E09:'presence',E10:'authenticity'}))errors.push('photo-audit-boundary');
    if(!validateTimeline(['su','doctor','fang','phone','police']))errors.push('timeline-validator');
    if(!validateFinal(['顾曼青','方正礼','方正礼','方正礼']))errors.push('final-validator');
    if(!HINT_LIBRARY['1:newsroom']||!HINT_LIBRARY['2:switchboard']||!HINT_LIBRARY['2:darkroom']||!HINT_LIBRARY['3:interviews']||!HINT_LIBRARY['4:finale'])errors.push('hint-contexts');
    if(!EVIDENCE.E17.body.includes('00:31')||EVIDENCE.E17.body.includes('00:18'))errors.push('return-time-regression');
    if(SCENES.study.image.includes('scene_study'))errors.push('modern-study-image-regression');
    if(!EVIDENCE.E07.body.includes('罗敬安')||!EVIDENCE.E15.body.includes('00:27')||!EVIDENCE.E15.body.includes('00:31'))errors.push('phone-chain-regression');
    if(APP_REVISION!=='2026-08-14-final-hardening')errors.push('revision-marker');
    if(!document.querySelector('link[href="paywall.css"]')||!document.querySelector('script[src="paywall.js"]'))errors.push('payment-assets-not-wired');
    if(!$('#supportBtn')||$('#hintBtn')?.nextElementSibling!==$('#supportBtn'))errors.push('support-button-position');
    if(!HINT_LIBRARY['1:study']||!HINT_LIBRARY['3:newsroom']||!HINT_LIBRARY['4:interviews'])errors.push('hint-page-coverage');
    if(Object.keys(REVIEW_VARIANTS).length<5)errors.push('review-variant-count');
    const expertProbe=freshState(true);if((expertProbe.reviewQueue||[]).length!==3||new Set(expertProbe.reviewQueue).size!==3)errors.push('review-queue-three');
    state=freshState(false);state.sound=false;state.evidence=['E01','E03'];state.scene='newsroom';render();if(!document.querySelector('[data-action="check-anomaly"]'))errors.push('stage1-render');hint();if((state.hintHistory['1:newsroom']||0)!==1)errors.push('hint-first-unlock');unlockNextHint();if((state.hintHistory['1:newsroom']||0)!==2)errors.push('hint-second-unlock');closeModal();state.scene='study';render();hint();if((state.hintHistory['1:study']||0)!==1||(state.hintHistory['1:newsroom']||0)!==2)errors.push('hint-page-history');closeModal();
    state.solved.anomaly=true;state.stage=2;state.scene='switchboard';state.evidence=['E01','E03','E05','E06','E07','E08','E09','E10','E11'];render();if(!document.querySelector('[data-action="check-route"]'))errors.push('route-render');
    state.solved.route=true;state.routePick=[...ROUTE_ORDER];state.scene='darkroom';render();if(!document.querySelector('[data-action="check-photo-audit"]'))errors.push('photo-audit-render');
    state.photoAuditPick={E08:'alibi',E09:'presence',E10:'authenticity'};state.solved.photoAudit=true;render();if(!document.querySelector('[data-action="check-timeline"]'))errors.push('timeline-render');
    state.solved.timeline=true;state.stage=3;state.scene='interviews';state.evidence=[...Object.keys(EVIDENCE).filter(id=>!['E12','E13','E14','E15'].includes(id))];render();if(!canInterview('gu')||!canInterview('li')||!canInterview('su'))errors.push('interview-prereq-basic');
    state.interviews={gu:true,li:true,su:true,fang:false};state.evidence.push('E12','E13','E14');if(!canInterview('fang'))errors.push('interview-prereq-fang');
    state.interviews.fang=true;state.evidence.push('E15');state.stage=4;state.scene='finale';state.solved.final=true;state.expert=true;state.solved.review=false;state.reviewQueue=['phone','window','newsroom'];state.reviewIndex=0;render();if(!document.querySelector('[data-review-answer]'))errors.push('expert-review-render');if((state.reviewQueue||[]).length!==3)errors.push('expert-review-count');
    const imageResults=await checkImages();for(const r of imageResults)if(!r.ok)errors.push('image:'+r.src);
    const html=document.body.innerHTML;if(/undefined|null\.title/.test(html))errors.push('undefined-render');
  }catch(e){errors.push('exception:'+e.message)}finally{state=original}
  const d=document.createElement('div');d.className='qa-result';d.id='qaResult';d.textContent=errors.length?'QA_FAIL '+errors.join(' | '):'QA_PASS';document.body.appendChild(d);document.body.dataset.qa=errors.length?'FAIL':'PASS';return errors;
}

(function init(){attach();refreshBoot();refreshSupportButton();if(new URLSearchParams(location.search).get('qa')==='1'){$('#boot').classList.add('hidden');$('#game').classList.remove('hidden');runQA()}})();
