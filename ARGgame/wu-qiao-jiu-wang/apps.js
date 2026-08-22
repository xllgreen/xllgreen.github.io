window.WUQIAO_APPS = (() => {
  "use strict";

  const nav = (label, view) => ({ label, view });

  const tianya = {
    defaultView: "home",
    menu: [nav("社区首页", "home"), nav("雾桥杂谈", "topics"), nav("情感天地", "feelings"), nav("版务处理", "moderation")],
    tabs: [nav("本版主题", "topics"), nav("按时间", "timeline"), nav("按作者", "authors"), nav("精品区", "elite")],
    sideTitle: "版面导航",
    side: [nav("雾桥杂谈 (86)", "topics"), nav("接龙创作 (41)", "writing"), nav("城市生活 (53)", "city"), nav("站务申诉 (12)", "moderation")],
    asideTitle: "本机缓存热帖",
    aside: [nav("旧客运站还在吗", "topic:TY-LOCAL"), nav("14路末班车", "topic:TY-BUS"), nav("本地网吧回忆", "topic:TY-NET"), nav("请勿公开电话", "topic:F-231-B")],
    records: {
      "T-00": { board: "接龙创作", replies: 4, views: 67, body: "【规则】每个人只补一段，不能替前一位解释。\n\n她每周四在旧客运站等人，带一把红伞。坏掉的收音机只能听见一边。下一位请接14路末班车。", floors: [
        [2, "玻璃海", "2008-08-12 19:51", "那天14路没有进站，她把车票折成了风筝。"],
        [3, "南岸旧邮差", "2008-08-12 20:04", "接龙就是虚构故事，请后来看到的人不要当作寻人信息。"],
        [4, "纸舟", "2008-08-12 20:13", "下一段可以换一个视角，别补真实姓名和电话。"]
      ] },
      "T-01": { board: "雾桥杂谈", replies: 232, views: 884, body: "【转载整理】雾桥旧站一名常带红伞、听旧收音机的女生失去联系。若有线索请回帖。\n\n原帖标题中的“接龙创作”字样在移动版面后没有保留。", floors: [
        [1, "北纬30度", "2008-08-14 22:17", "帖子由接龙区移动至本版，标题已重新整理。"],
        [37, "旧城夜话", "2008-08-15 10:03", "百渡已经有人整理热线，大家不要重复贴号码。"],
        [231, "该用户", "2008-08-16 18:54", "本楼已删除。引用缓存仍可能保留原文。"],
        [232, "系统", "2008-08-16 19:03", "版务操作：删除第231楼及三条直接引用。"]
      ] },
      "F-231-A": { board: "雾桥杂谈", replies: 1, views: 31, body: "引用缓存：这段话来自我的博客。我不是你们说的人……", floors: [[232, "南岸旧邮差", "2008-08-16 18:56", "我只来得及引用前半句，原楼两分钟后仍可见。"]] },
      "F-231-B": { board: "站务申诉", replies: 6, views: 58, body: "搜索摘要：……也不需要被寻找。请删掉照片和号码。", floors: [[1, "玻璃海", "2008-08-17 00:11", "请不要在回复里补全电话号码。"], [2, "值班版主", "2008-08-17 00:16", "删除请求已按值班流程处理，原号码不再展示。"]] },
      "A-22": { board: "版务处理", replies: 0, views: 14, body: "08-14 22:17　移除标题标签并移动版块。\n08-16 19:03　删除231楼与三条引用。\n操作会话：北纬30度。", floors: [] },
      "C-404": { board: "恢复页", replies: 0, views: 1, body: "其实，她从来不存在。去找第37个号码。\n\n恢复器注：页面显示时间为2026-08-07，表单缓存写入时间为2009-01-03 23:48。", floors: [] },
      "TY-LOCAL": { title: "旧客运站还在吗？", author: "槐树下", date: "2008-08-11 16:20", board: "城市生活", replies: 7, views: 94, body: "客运站主体还在，但长途线路早已搬走。右侧旧广告牌前两年拆了。", floors: [[2, "像素雨", "2008-08-11 17:02", "我2005年拍过一组，别把旧照片当成今年现场。"], [6, "河堤散步", "2008-08-12 08:11", "现在只有14路会在外侧临时停靠。"]] },
      "TY-BUS": { title: "14路末班车最近几点？", author: "河西小熊", date: "2008-08-05 18:12", board: "城市生活", replies: 5, views: 76, body: "公交站牌写的是21:40，雨天可能提前收车。", floors: [[3, "半盏汽水", "2008-08-05 20:15", "今天是我最后一次坐这班车。"]] },
      "TY-NET": { title: "蓝鲸网吧是不是关门了", author: "键盘进水", date: "2009-01-05 12:31", board: "雾桥杂谈", replies: 9, views: 112, body: "卷帘门已经拉了三天，听说硬盘和旧账册正在清点。", floors: [[5, "前台小陈", "2009-01-05 18:03", "会员数据会统一销毁，请勿索要他人上机记录。"]] }
    }
  };

  const baidu = {
    defaultView: "portal",
    menu: [nav("网页", "portal"), nav("帖吧", "topics"), nav("知道", "qa"), nav("图片", "photos")],
    tabs: [nav("本吧主题", "topics"), nav("按时间", "timeline"), nav("按作者", "authors"), nav("精品区", "elite")],
    sideTitle: "帖吧目录",
    side: [nav("雾桥吧 (134)", "topics"), nav("城市怪谈吧 (89)", "strange"), nav("寻人互助吧 (57)", "help"), nav("旧照片吧 (42)", "photos")],
    asideTitle: "相关检索",
    aside: [nav("白纸风筝 原帖", "search:白纸风筝 原帖"), nav("旧客运站 红伞", "search:旧客运站 红伞"), nav("第37个号码", "search:第37个号码"), nav("删帖 快照", "search:删帖 快照")],
    records: {
      "B-01": { board: "寻人互助吧", replies: 48, views: 392, body: "据天崖社区消息整理：有人在旧客运站见过一名带红伞、听收音机的女生。网友汇总了12次目击。\n\n声讯热线按37转接，1元/分钟。原始页面没有保留“接龙创作”标签。", floors: [[2, "旧城夜话", "2008-08-15 09:35", "我把时间线补在二楼，但找不到警方通报。"], [8, "像素雨", "2008-08-15 10:10", "配图背景来自旧照片，至少不是本周拍的。"], [33, "不具名网友", "2008-08-16 20:04", "当事人已经要求删除照片与号码。"]] },
      "B-02": { board: "城市怪谈吧", replies: 31, views: 271, body: "本文把红伞、14路和收音机列作“已证实细节”，但所列链接全部回到百渡转载，没有警方或学校来源。", floors: [[4, "南岸旧邮差", "2008-09-01 21:19", "互相引用不能变成三条独立证据。"]] },
      "B-37": { board: "寻人互助吧", replies: 12, views: 206, body: "雾桥寻人热线脚本V3，按37转接，资费1元/分钟。上线时间：2008-08-15 08:52。结算索引：VS-200808。", floors: [[7, "广告管理员", "2008-08-15 09:00", "本服务由合作方提供，吧务不处理资费争议。"]] },
      "B-CACHE": { board: "雾桥吧", replies: 3, views: 45, body: "有人说被删的231楼只是要求停止传播自己的博客、照片和号码，并没有承认自己是白纸风筝。值班短信尾号可能是0417。", floors: [[2, "玻璃海", "2008-08-17 10:09", "请不要继续猜完整号码。"]] }
    }
  };

  const blog = {
    defaultView: "home",
    menu: [nav("博园首页", "home"), nav("我的博客", "posts"), nav("相册", "photos"), nav("圈子", "circles")],
    tabs: [nav("博文", "posts"), nav("相册", "photos"), nav("RSS", "rss"), nav("作者索引", "authors")],
    sideTitle: "文章分类",
    side: [nav("生活随笔 (8)", "life"), nav("旧城照片 (6)", "photos"), nav("未分类 (3)", "misc"), nav("好友留言 (5)", "guestbook")],
    asideTitle: "博客归档",
    aside: [nav("2008年8月 (5)", "archive:2008-08"), nav("2008年7月 (2)", "archive:2008-07"), nav("2006年11月 (1)", "archive:2006-11"), nav("2005年10月 (3)", "archive:2005-10")],
    records: {
      "P-05": { authorName: "像素雨", body: "学校摄影课的练习片。旧客运站快要停用，画面右侧还能看到海X电器广告牌。\n\n原文件：WQ-OLD-05.jpg；拍摄时间：2005-10-02。站台无人，也没有红色人影。", image: "assets/bus-station-original.webp", comments: [["暗房学徒", "2005-10-02 18:20", "雨夜曝光很稳，原片能否保留？"], ["像素雨", "2005-10-02 18:31", "底片和数码备份都在。"]] },
      "P-08": { authorName: "像素雨", body: "冲印店退回的订单信息：rw_0813 的源文件指向 WQ-OLD-05，软件字段是 Adobe Photoshop CS2。红色人物区域的压缩噪声和背景不同。", image: "assets/photo-lab.webp", comments: [["暗房学徒", "2008-08-13 23:18", "这不是原片，是从旧站照片改出来的。"]] },
      "L-RED": { authorName: "半盏汽水", body: "姨妈把那把红伞塞给我，说沿江风大。伞骨有一根歪了，走起来总往右偏。\n\n最近不太想回旧城，留言先关掉。", image: "assets/blog-stilllife.webp", comments: [] },
      "L-BUS": { authorName: "半盏汽水", body: "以后也许不会再坐14路了。离开不是失踪，只是不想再被找到。\n\n车票夹在旧收音机下面，哪天回去再收。", comments: [["纸舟", "2008-08-05 20:14", "一路平安。"]] },
      "L-RADIO": { authorName: "半盏汽水", body: "坏掉的旧收音机只剩一边有声。拧到最左边会收到隔壁省的夜间节目。", image: "assets/blog-stilllife.webp", comments: [["像素雨", "2008-08-06 23:01", "别扔，老机器修好以后声音更暖。"]] },
      "L-BOUNDARY": { authorName: "半盏汽水", body: "我不是想从世界上消失，只是不想让陌生人把我的每件旧东西拼成地址。\n\n谢谢替我挡开人群的人，但请别再替我写新的目击。有人说这是保护，可每多一段，那个故事就更像真的。", comments: [] },
      "N-01": { authorName: "雾桥旧闻簿", body: "网上流传的版本互相引用，却都没有找到最早的接龙草稿。本文保留当年的常见说法，不代表已经核实。", comments: [["南岸旧邮差", "2009-02-14 13:12", "请把“下落不明”改成“无法从公开资料确认”。"]] }
    }
  };

  const alumni = {
    defaultView: "home",
    menu: [nav("校友录", "home"), nav("班级", "classes"), nav("同学", "people"), nav("留言", "messages")],
    tabs: [nav("组合检索", "searchHelp"), nav("同音姓名", "names"), nav("届别", "grades"), nav("学校", "schools")],
    sideTitle: "我的学校",
    side: [nav("雾桥一中 (38)", "school:wq1"), nav("市实验中学 (27)", "school:lab"), nav("河西职校 (31)", "school:hx"), nav("转学记录 (4)", "transfers")],
    asideTitle: "最近上线",
    aside: [nav("南岸旧邮差", "person:postman"), nav("玻璃海", "person:glass"), nav("像素雨", "person:pixel"), nav("3人隐身", "people")],
    profiles: {
      postman: { name: "南岸旧邮差", school: "雾桥一中", grade: "2005级", note: "班级管理员；最后上线 2008-08-20 12:44。" },
      glass: { name: "玻璃海", school: "市实验中学", grade: "2006级", note: "留言权限：仅同学；最后上线 2008-08-19 21:08。" },
      pixel: { name: "像素雨", school: "河西职校", grade: "2005级", note: "摄影社；相册公开，个人联系方式隐藏。" },
      luke: { name: "陆珂", school: "市实验中学", grade: "2006级", note: "2008-07-28办理转学；接收学校按本人要求隐藏。" }
    },
    records: {
      "L-00": { body: "按三个传播版本提到的学校、入学年和班级组合检索，均无“白纸风筝”或稳定对应姓名。缺失记录不能单独证明某个人不存在。" },
      "L-03": { body: "语言比对分为三组：全角标点且常写“其实”；半角冒号与商业措辞；短句且从不用火星文。三组上线时段也互相冲突。" },
      "LK-06": { profile: "luke", body: "2006级名册含“陆珂”。2008-07-28办理转学，接收学校字段隐藏；名册没有“白纸风筝”。" }
    }
  };

  const qq = {
    defaultView: "recent",
    menu: [nav("企鹅", "account"), nav("联系人", "contacts"), nav("会话", "recent"), nav("工具", "tools")],
    tabs: [nav("聊天记录", "recent"), nav("离线消息", "offline"), nav("群消息", "group"), nav("本机日志", "logs")],
    sideTitle: "好友分组",
    side: [nav("我的好友 (5/14)", "group:friends"), nav("同学 (2/7)", "group:classmates"), nav("网友 (3/18)", "group:online"), nav("陌生人 (0/3)", "group:strangers")],
    asideTitle: "最近会话",
    aside: [nav("半盏汽水", "chat:soda"), nav("像素雨", "chat:pixel"), nav("北纬30度", "chat:north"), nav("蓝鲸前台", "chat:front")],
    friends: {
      soda: { name: "半盏汽水", account: "41***17", status: "离线", group: "网友", signature: "离开不是失踪。", chats: [
        ["2008-08-16 18:50", "半盏汽水", "论坛那张照片和号码不是我发的。"],
        ["2008-08-16 18:51", "半盏汽水", "我不是想消失。我只是不想被陌生人用旧东西拼出现在在哪里。"],
        ["2008-08-16 18:52", "纸舟", "你先给值班号发短信，我去找版主。"],
        ["2008-08-18 21:40", "纸舟", "我知道那些话是从你博客拿的。其实我会让他们往西找。"],
        ["2008-08-18 21:42", "半盏汽水", "别写我的名字，也别再发0417。"],
        ["2008-08-20 00:02", "纸舟", "你已经向东离城，我会把错误目击放到相反方向。之后不再回复。"],
        ["2008-08-20 00:03", "半盏汽水", "你是在帮我，但新的假目击也会伤到下一个被认错的人。到这里停吧。"]
      ] },
      pixel: { name: "像素雨", account: "27***05", status: "在线", group: "同学", signature: "底片会记得时间。", chats: [["2008-08-13 23:15", "像素雨", "rw_0813不是新拍的，源图是WQ-OLD-05。"], ["2008-08-13 23:18", "纸舟", "我会把文件信息另存下来。"]] },
      north: { name: "北纬30度", account: "30***30", status: "忙碌", group: "网友", signature: "热点就是事实。", chats: [["2008-08-14 22:20", "北纬30度", "标签去掉以后，帖子才会有人看。"], ["2008-08-14 22:23", "纸舟", "那是接龙，不是寻人。"], ["2008-08-14 22:25", "北纬30度", "明天接一条语音热线，别挡流量。"], ["2008-08-14 22:27", "纸舟", "你明知道没有失踪的人。"], ["2008-08-14 22:28", "北纬30度", "我知道读者会打电话，这就够了。真假等热度过去再说。"], ["2008-08-16 19:06", "纸舟", "231楼是本人来澄清，你为什么连引用也删？"], ["2008-08-16 19:09", "北纬30度", "留下那层，明天就没人打37。"]] },
      front: { name: "蓝鲸前台", account: "17***00", status: "离线", group: "我的好友", signature: "夜班到零点。", chats: [["2009-01-03 22:42", "系统", "会员QH0812在17号机自动登录。"], ["2009-01-04 00:10", "系统", "会员QH0812离线。"]] },
      postman: { name: "南岸旧邮差", account: "58***21", status: "离线", group: "网友", signature: "引用要保留出处。", chats: [["2008-08-16 18:57", "南岸旧邮差", "我引用到了231楼前半，哈希末位7c。"], ["2008-08-16 19:04", "纸舟", "原楼刚被删了，先别再贴号码。"]] }
    }
  };

  const sms = {
    defaultView: "inbox",
    menu: [nav("飞讯", "home"), nav("短信", "inbox"), nav("通讯录", "contacts"), nav("工具", "tools")],
    tabs: [nav("已发送", "sent"), nav("收件箱", "inbox"), nav("送达报告", "reports"), nav("联系人", "contacts")],
    sideTitle: "短信文件夹",
    side: [nav("收件箱 (9)", "inbox"), nav("已发送 (6)", "sent"), nav("草稿箱 (2)", "drafts"), nav("送达报告 (4)", "reports")],
    asideTitle: "通讯录",
    aside: [nav("第37项联系人", "contact:37"), nav("论坛值班号", "contact:duty"), nav("网吧前台", "contact:front"), nav("号码尾号检索", "contacts")],
    messages: [
      { id: "S-37", folder: "sent", date: "2008-08-16 18:58", peer: "论坛值班号", number: "138-****-0417", status: "已送达", text: "第231楼是我发的，请删掉照片和号码，我现在安全。" },
      { id: "S-DUTY", folder: "reports", date: "2008-08-16 18:59", peer: "短信中心", number: "1065", status: "送达回执", text: "18:58:36已送达；论坛值班台19:00读取。" },
      { id: "SM-02", folder: "inbox", date: "2008-08-16 19:05", peer: "论坛值班号", number: "010-8XX0-1120", status: "已读", text: "231楼与三条引用已处理。公开缓存需要等待索引刷新。" },
      { id: "SM-03", folder: "inbox", date: "2008-08-18 08:11", peer: "姨妈", number: "135-****-6621", status: "已读", text: "到了以后只报平安，不要告诉网上的人新学校。" },
      { id: "SM-04", folder: "sent", date: "2008-08-18 08:14", peer: "姨妈", number: "135-****-6621", status: "已送达", text: "已经到了，号码会换，博客也先停更。" },
      { id: "SM-05", folder: "drafts", date: "2008-08-20 00:03", peer: "纸舟", number: "27***18", status: "未发送", text: "谢谢你把他们引开，但不要再编新的目击了。" },
      { id: "SM-06", folder: "inbox", date: "2009-01-03 22:39", peer: "蓝鲸前台", number: "010-8XX0-0017", status: "已读", text: "会员QH0812，17号机还有两小时余额。" },
      { id: "SM-07", folder: "drafts", date: "2009-01-03 23:50", peer: "南岸旧邮差", number: "138-****-5821", status: "未发送", text: "第404楼先别发，我想把原帖来源补全。" }
    ],
    contacts: [
      { key: "37", index: 37, name: "半盏汽水", number: "138-****-0417", note: "仅用于删除请求；请勿公开。" },
      { key: "duty", index: 12, name: "论坛值班号", number: "010-8XX0-1120", note: "19:00前短信值班。" },
      { key: "front", index: 5, name: "蓝鲸前台", number: "010-8XX0-0017", note: "17号机所在网吧。" },
      { key: "aunt", index: 2, name: "姨妈", number: "135-****-6621", note: "私人联系人。" }
    ]
  };

  const mail = {
    defaultView: "inbox",
    menu: [nav("邮件", "inbox"), nav("通讯录", "contacts"), nav("设置", "settings"), nav("帮助", "help")],
    tabs: [nav("收信", "inbox"), nav("写信", "compose"), nav("回复", "reply"), nav("转发", "forward")],
    sideTitle: "邮箱文件夹",
    side: [nav("收件箱 (8)", "inbox"), nav("星标邮件 (2)", "starred"), nav("已发送 (4)", "sent"), nav("已删除 (3)", "deleted")],
    asideTitle: "快捷入口",
    aside: [nav("附件管理", "attachments"), nav("全文搜索", "searchHelp"), nav("邮件头", "headers"), nav("反垃圾设置", "settings")],
    messages: [
      { id: "E-FWD", folder: "sent", starred: true, date: "2008-08-14 23:02", from: "hn-media@letter.invalid", to: "service@voice.invalid", subject: "Fw: 帖子链接与脚本V3", body: "公开帖链接已附。请按脚本V3在明早08:52上线，按钮写“按37转接”。转发主题里还留着原来的“接龙”字样，外页不要显示。", headers: "Received: from hn-office (10.0.0.23)\nDate: Thu, 14 Aug 2008 23:02:11 +0800\nMessage-ID: <200808142302.hn-media>", attachment: "script_v3.doc" },
      { id: "E-VS", folder: "deleted", starred: true, date: "2008-08-31 18:20", from: "service@voice.invalid", to: "hn-media@letter.invalid", subject: "8月结算 / VS-200808", body: "8月15日至31日的声讯分成已经核对。收款主体 HN-MEDIA，金额区间 2000-2999元。请确认附件后归档。", headers: "Received: from voice-settle (172.16.8.15)\nDate: Sun, 31 Aug 2008 18:20:04 +0800\nX-Settlement: VS-200808", attachment: "settle_0815.xls" },
      { id: "EM-03", folder: "inbox", date: "2008-08-15 08:47", from: "service@voice.invalid", to: "hn-media@letter.invalid", subject: "脚本V3预览已完成", body: "预览号码已开通。08:52自动切换正式线路，计费1元/分钟。", headers: "Date: Fri, 15 Aug 2008 08:47:26 +0800", attachment: "" },
      { id: "EM-04", folder: "sent", date: "2008-08-16 19:08", from: "hn-media@letter.invalid", to: "moderator@tianya.invalid", subject: "Re: 231楼删除", body: "删掉就好。搜索摘要过一晚会刷新，不需要发公开说明。", headers: "Date: Sat, 16 Aug 2008 19:08:42 +0800", attachment: "" },
      { id: "EM-05", folder: "inbox", date: "2008-08-20 10:12", from: "moderator@tianya.invalid", to: "hn-media@letter.invalid", subject: "用户申诉：照片与号码仍在转载", body: "站内原楼已删，但百渡转载仍有号码。建议发布澄清并联系转载站。", headers: "Date: Wed, 20 Aug 2008 10:12:09 +0800", attachment: "appeal_231.txt" },
      { id: "EM-06", folder: "deleted", date: "2008-09-02 09:14", from: "hn-media@letter.invalid", to: "service@voice.invalid", subject: "结算已收", body: "款项已核对。下月沿用同一转接号码，不必再展示原帖标签。", headers: "Date: Tue, 2 Sep 2008 09:14:31 +0800", attachment: "" }
    ]
  };

  const backend = {
    defaultView: "volumes",
    menu: [nav("文件(F)", "file"), nav("编辑(E)", "edit"), nav("查看(V)", "view"), nav("工具(T)", "tools")],
    tabs: [nav("卷标扫描", "volumes"), nav("机位记录", "seats"), nav("会员票据", "tickets"), nav("缓存恢复", "cache")],
    sideTitle: "恢复项目",
    side: [nav("IDE-03", "volume:IDE-03"), nav("17号机", "seat:17"), nav("表单缓存", "cache"), nav("版务日志", "moderation")],
    asideTitle: "设备状态",
    aside: [nav("硬盘：只读", "status:disk"), nav("索引：已建立", "status:index"), nav("系统钟：异常", "status:clock"), nav("写保护：开启", "status:protect")],
    tables: {
      volumes: { title: "卷标扫描", guide: "把每一行当成一块硬盘。先找状态为“只读挂载”的行，再记住这一行的硬盘名字。", columns: ["设备", "卷标", "容量", "状态"], columnHelp: [["设备", "硬盘编号"], ["卷标", "硬盘名字"], ["状态", "能否安全读取"]], focusRows: [2], takeaway: "IDE-03这块硬盘的名字是LJ-17，且已经用只读方式打开。", rows: [["IDE-01", "SYSTEM", "20 GB", "可读"], ["IDE-02", "DATA-02", "40 GB", "索引损坏"], ["IDE-03", "LJ-17", "80 GB", "只读挂载"]] },
      seats: { title: "机位记录", guide: "把“机位”理解为网吧电脑编号。只需找到17号机，再横向看同一行的资产号和最近会员。", columns: ["机位", "资产号", "最近会员", "最后开机"], columnHelp: [["机位", "网吧电脑编号"], ["资产号", "与硬盘卷标对应的标签"], ["最近会员", "最后登录这台电脑的会员号"]], focusRows: [2], takeaway: "17号机对应LJ-17，最近会员是QH0812。", rows: [["03", "LJ-03", "QH0728", "2008-12-29"], ["12", "LJ-12", "游客", "2009-01-02"], ["17", "LJ-17", "QH0812", "2009-01-04 00:10"], ["21", "LJ-21", "QH0901", "2009-01-03 23:22"]] },
      tickets: { title: "会员票据", guide: "这张表记录谁在什么时间使用哪台电脑。判断作者时，只看写入时刻是否落在登录时间段内。", columns: ["票据", "会员", "机位", "时间"], columnHelp: [["会员", "上机账号"], ["机位", "使用的电脑"], ["时间", "账号保持登录的时间段"]], focusRows: [0], takeaway: "会员QH0812在17号机从22:42登录到00:10，覆盖23:48。", rows: [["QH-0812-17", "QH0812", "17", "22:42-00:10"], ["QH-0901-21", "QH0901", "21", "21:15-23:22"], ["GUEST-12", "游客", "12", "19:06-20:01"]] },
      cache: { title: "缓存恢复", guide: "“写入时间”是内容原本保存的时间；“显示时间”只是恢复工具把它重新显示出来的时间。两列不能混为一谈。", columns: ["项目", "写入时间", "显示时间", "路径"], columnHelp: [["项目", "这条材料的编号"], ["写入时间", "内容真正保存的时间"], ["显示时间", "恢复工具重新展示的时间"], ["路径", "文件存放位置，可忽略技术格式"]], focusRows: [0], takeaway: "C-404内容在2009年23:48写入，2026年只是被恢复工具重新显示。", rows: [["C-404", "2009-01-03 23:48", "2026-08-07 00:17", "form_404.dat"], ["T-00", "2008-08-12 19:42", "2008-08-12 19:42", "thread_draft.htm"], ["F-231", "2008-08-16 18:54", "已删除", "cache_231.tmp"]] },
      moderation: { title: "版务日志", guide: "每一行就是“谁、在什么时间、做了什么”。只需比较动作和时间，不需要理解数据库。", columns: ["时间", "会话", "动作", "对象"], columnHelp: [["会话", "当时登录的操作人"], ["动作", "这个人做的事"], ["对象", "被操作的帖子或电脑"]], focusRows: [0, 1], takeaway: "北纬30度先去掉接龙标签，后来又删除第231楼和引用。", rows: [["08-14 22:17", "北纬30度", "移除标签并移动", "T-01"], ["08-16 19:03", "北纬30度", "删除楼层及引用", "231楼"], ["01-03 20:03", "管理员", "开始维护", "17号机"], ["01-03 20:16", "管理员", "结束维护", "17号机"]] }
    }
  };

  return { tianya, baidu, blog, alumni, qq, sms, mail, backend };
})();
