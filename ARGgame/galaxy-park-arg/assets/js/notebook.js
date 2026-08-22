(function () {
  "use strict";

  var saveKey = "galaxyParkArgProgressV1";
  var totalRecords = 16;

  function readProgress() {
    try {
      return JSON.parse(localStorage.getItem(saveKey) || "{}");
    } catch (error) {
      return {};
    }
  }

  function writeProgress(progress) {
    localStorage.setItem(saveKey, JSON.stringify(progress));
  }

  var progress = readProgress();
  if (!progress.disclaimerAccepted) {
    window.location.replace("galaxy-park-arg.html");
    return;
  }

  var solved = progress.solvedPuzzles || [];
  var visited = progress.visitedPages || [];
  var savedEvidence = progress.evidence || [];
  var revealedHints = progress.revealedHints || {};

  function hasSolved(id) {
    return solved.indexOf(id) !== -1;
  }

  function hasVisited(keys) {
    return keys.some(function (key) {
      return visited.indexOf(key) !== -1;
    });
  }

  function hasVisitedAll(keys) {
    return keys.every(function (key) {
      return visited.indexOf(key) !== -1;
    });
  }

  var caseNotes = [
    {
      id: "memberAccountRecovery",
      title: "首页的旧会员账户",
      source: "你用到的页面：首页、旧会员账户查询、旧会员中心",
      direction: "首页没有可注册的账户，但“找回旧账户”仍能核验三类留存记录。先找出三张彼此没有矛盾的表单。",
      discovered: hasSolved("memberAccountRecovery") || hasVisited(["park/account-recovery", "park/member-center"]),
      hints: [
        "每张登记卡先用尾号找到对应的入园回执，再用回执上的照片单号找到照片交付单。",
        "三张记录还要同时满足柜台编号、日期和同行人数一致；能连起来不代表一定能通过。",
        "四组记录中，只有一组的会员尾号、柜台末两位、日期和人数全部没有矛盾。"
      ]
    },
    {
      id: "staffAccountRecovery",
      title: "闭园维护账户的答题卡",
      source: "你用到的资料：员工风采、员工账户历史查询、闭园通知",
      direction: "员工查询只保留了网站维护账户。先从员工风采确认查询对象，再逐项完成答题卡和闭园交接核验。",
      discovered: hasSolved("staffAccountRecovery") ||
        hasVisited(["park/staff-account-recovery"]),
      hints: [
        "查询对象既负责广播设备，也负责网站文件服务器；员工风采里写有他的姓名和通讯编号。",
        "第一张题卡要保留颜色、笔画残片和反义位置一起看；第二张题卡的三列分别遵循同一种字形规律。",
        "“立体”题与三人的排行称呼有关；星期题可把七天逐个代入。最后一项日期在闭园通知的联系方式一节。"
      ]
    },
    {
      id: "staffPortal",
      title: "怎么登录管理员账户",
      source: "你用到的页面：员工账户历史查询、闭园公告、员工入口",
      direction: "账户查询结果给出了维护账户和临时密码的组成规则。再回乐园首页确认最后营业日。",
      discovered: hasSolved("staffPortal") ||
        hasSolved("staffAccountRecovery") &&
        hasVisited(["park/staff-login"]),
      hints: [
        "员工账户历史查询通过后，会直接显示唯一保留下来的维护账户。",
        "临时密码不是查询当天的日期，而是乐园最后营业日。",
        "把最后营业日写成 YYYYMMDD，年月日之间不加符号。"
      ]
    },
    {
      id: "mapDifference",
      title: "旧地图中消失的区域",
      source: "你用到的页面：2009 年游客导览、2017 年园区导览",
      direction: "去对比 2009 年和 2017 年两张园区地图，重点看东侧同一个位置。",
      discovered: hasSolved("staffPortal") || hasSolved("mapDifference"),
      hints: [
        "先比较两张地图中同一片东侧区域，而不是只数游乐设施。",
        "留意旧图中有编号、而新图中被停车和服务标注覆盖的区域。",
        "提交时填写旧地图上的区域名称，不要填后来出现的后台编号。"
      ]
    },
    {
      id: "eventTimestamp",
      title: "同一张照片为什么有两次输出",
      source: "你用到的资料：夏令营四格练习、会员到访摘要、活动总结、家庭输出转存包、精彩图片",
      direction: "四格练习决定转存包口令。会员摘要把 A、B 两次输出并排列出，解压后的输出索引可以复核 B 批次。",
      discovered: hasSolved("mapDifference") || hasSolved("eventTimestamp"),
      hints: [
        "先看夏令营页面中 SC-140719-B 的四格扫描页，再看会员中心同编号材料的口令规则。",
        "四格里各藏一个汉字；四字后接活动日期的月日，即可打开家庭输出记录。",
        "在会员摘要和照片输出索引中找到 B 批次的输出时间与批次编号；活动总结末页给出补录背景模板。"
      ]
    },
    {
      id: "projectIdentity",
      title: "GP-B07 到底是什么项目",
      source: "你用到的页面：旧地图结果、临江市重点项目目录",
      direction: "把旧地图里找到的内部编号，拿到政务网站的“重点项目目录”里找对应项。",
      discovered: hasSolved("eventTimestamp") || hasSolved("projectIdentity"),
      hints: [
        "记下旧地图答案旁边出现的后台编号，再去政务网站的重点项目目录。",
        "重点看编号末尾、实施场所和项目年份能同时对应的条目。",
        "公开长名称与工作简称不同；编号核对成功后才会显示简称。"
      ]
    },
    {
      id: "procurementMismatch",
      title: "少了 600 件什么东西",
      source: "你用到的页面：管理员仓库记录、临江市采购与验收信息",
      direction: "去对比两张表：员工后台里的“普通仓库收货记录”，以及政务网站里的“采购与验收信息”。找同一个采购编号，看看哪件东西没有进入乐园仓库。",
      discovered: hasSolved("projectIdentity") || hasSolved("procurementMismatch"),
      hints: [
        "在两张表里找到相同的采购编号，再分别把物品数量加起来。",
        "员工后台只登记了两种腕带；政务验收表里还有第三种物品。",
        "没进乐园仓库的那件东西，有一张单独送到东侧服务门的到货单；用那张单的联号检索。"
      ]
    },
    {
      id: "memoDecode",
      title: "林思遥留下的那句话",
      source: "你用到的资料：管理员备份、网站文件服务器维护摘录、正文恢复附件",
      direction: "去管理员后台找林思遥留下的备注记录；服务器导出保留了附件引用，正文附件里还留下 11 个标题。",
      discovered: hasSolved("procurementMismatch") || hasSolved("memoDecode"),
      hints: [
        "先看 LSY-MEMO-17 对应的网站文件服务器维护摘录，再打开正文恢复附件。",
        "导出记录中的短目录引用以等号结尾，旁边说明了它使用的字符表；还原后会得到附件索引号。",
        "把短目录引用按 Base64 还原；再依序读取恢复附件中 11 个标题的首字，拼成备注检索词。"
      ]
    },
    {
      id: "archivePath",
      title: "坏掉的链接搬去了哪里",
      source: "你用到的页面：政务通知、乐园网站维护记录、文件目录",
      direction: "去“网站维护记录”看旧链接搬家时改了哪两个词，再回政务网站找那条失效地址。",
      discovered: hasSolved("memoDecode") || hasSolved("archivePath"),
      hints: [
        "项目编号没有变化，只改了地址里的两个英文词。",
        "把旧地址拆成三部分看：前面的文件夹、项目编号、最后的文件状态。",
        "维护记录会告诉你两个旧词分别改成什么；其他符号和 .html 都不要改。"
      ]
    },
    {
      id: "archiveAccess",
      title: "检索 LJ-GP-07 卷宗",
      source: "你用到的页面：项目目录、林思遥备注、档案检索页",
      direction: "档案页要求填写标准登记信息。项目编号在政务目录里，档案题名和归档登记号在找回的旧备注中。",
      discovered: hasSolved("archivePath") || hasSolved("archiveAccess"),
      hints: [
        "先回员工后台确认 LSY-MEMO-17 的完整检索结果。",
        "备注正文下面还有一张三行的归档登记表。",
        "把登记表中的关联卷宗、档案题名和归档登记号按原样填写。"
      ]
    },
    {
      id: "publicInternalDifference",
      title: "政府文件少了哪个附件",
      source: "你用到的文件：项目立项批复、公开评估报告、公开授权书、阶段报告工作稿、结果报告修订稿",
      direction: "档案项目摘要列出的五份原件分别回答一个核验字段。不要只看网页摘要，要打开文件核对原文和表格。",
      discovered: progress.archiveAccessGranted || hasSolved("publicInternalDifference"),
      hints: [
        "立项批复的附件目录给出缺项序号；公开评估报告和阶段报告工作稿各有一个名称不同的家庭指标。",
        "公开授权书写明允许回访几次；工作稿的指标表保留了内部字段名称。",
        "结果报告修订稿最后一张统计表中，第三轮最右侧的百分数是最后一个核验值。"
      ]
    },
    {
      id: "zone7Procedure",
      title: "第七区三个房间的先后顺序",
      source: "你用到的页面：第七区房间表",
      direction: "去第七区房间表，按“看照片、听广播、画画”的先后顺序找三个房号。",
      discovered: hasSolved("publicInternalDifference") || hasSolved("zone7Procedure"),
      hints: [
        "把观看、听取和提示后表达三种行为分别对应到房间用途。",
        "流程不是按房号大小排列，而是按参与者实际经历的先后排列。",
        "提交三个完整房号；房间表中用途说明比房间名称更重要。"
      ]
    },
    {
      id: "broadcastReconstruction",
      title: "16:17 前后发生了什么",
      source: "你用到的资料：广播调度复核页、原始广播队列摘录",
      direction: "页面只保留事件卡和候选时刻。下载 TXT，按其中的“早于 / 晚于”关系从门禁关闭时间开始计算。",
      discovered: hasSolved("zone7Procedure") || hasSolved("broadcastReconstruction"),
      hints: [
        "原始队列摘录先给出门禁关闭的绝对时间，其余四项都写成与另一项相差多少分钟。",
        "普通循环结束比门禁关闭早 8 分钟；专用播放比门禁关闭晚 14 分钟。",
        "照片输出在专用播放后 9 分钟，回拨又在照片输出后 4 分钟。"
      ]
    },
    {
      id: "scanAssembly",
      title: "附件 03 的移交页",
      source: "你用到的页面：对外移交扫描件复核",
      direction: "四个扫描块可以交换和旋转。先把装订孔放回同一侧，再让中央骑缝章闭合。",
      discovered: hasSolved("publicInternalDifference") || hasSolved("scanAssembly"),
      hints: [
        "左边两块应该都有装订孔，右上角的页码必须正向。",
        "只看骑缝章会有两个相似排列；表格横线和手写补记能排除其中一个。",
        "正确拼合为两行两列，所有文字正向，中央红章闭合且横线跨过中缝。"
      ]
    },
    {
      id: "transferDecode",
      title: "闭园后，这套方法去了哪里",
      source: "你用到的资料：项目资料移交登记、移交箱登记摘录、设备索引复核记录、广播调度复核、受保护转储包、设备日志",
      direction: "设备日志只剩密文。先还原移交箱的缺页关系，再从受保护转储包取得每一年的 K 值。",
      discovered: hasSolved("zone7Procedure") || hasSolved("transferDecode"),
      hints: [
        "PDF 的移交文号与 TXT 的箱号、缺页、接收节点可以恢复两份挂接文件。",
        "设备索引复核记录里有一个单字页签题，也写明压缩包口令的组成；时刻来自广播调度复核结果。",
        "解压后按登记表把 K02、K05、K07分别配给三条密文；K 后两位是向后写入的字母数，还原时向前移。"
      ]
    },
    {
      id: "finalAssembly",
      title: "整理附件并处理外发邮件",
      source: "你用到的页面：档案系统左侧“外发邮件（1）”",
      direction: "证据齐全后，档案系统会把未发送邮件标成红色。打开邮件，核对自动附加的材料并选择收件人。",
      discovered: hasSolved("transferDecode") || hasSolved("finalAssembly"),
      hints: [
        "邮件附件会标出“已核验”或“未取得”；尚未取得的材料不能勾选。",
        "外发要求覆盖项目身份、巡游材料、第七区流程及闭园后的转用记录。",
        "保存草稿、发送给监督与媒体、回复原项目联系人会进入不同结局。"
      ]
    }
  ];

  var evidenceList = [
    {
      id: "staffBackupAccess",
      inferredBy: "staffPortal",
      title: "管理员后台里的旧文件",
      text: "被网站撤下的旧地图、广播记录和项目编号，仍留在管理员后台。"
    },
    {
      id: "mapVersionDifference",
      inferredBy: "mapDifference",
      title: "两版地图不一样",
      text: "2009 年地图上的 07 区，后来被停车场 B 区和家庭服务后区盖住；内部编号仍是 GP-B07。"
    },
    {
      id: "echoPhotoTimestamp",
      inferredBy: "eventTimestamp",
      title: "晚了九分钟的 B 批次",
      text: "照片单的原始记录时间是 2014-07-19 16:17，家庭回访 B 批次到 16:26 才输出，并使用了后来补录的背景模板。"
    },
    {
      id: "projectIdentity",
      inferredBy: "projectIdentity",
      title: "GP-B07 对应的项目",
      text: "LJ-GP-07、GP-B07 和“星河协同计划”其实指向同一个项目。"
    },
    {
      id: "silverButtonPurchase",
      inferredBy: "procurementMismatch",
      title: "没有进仓库的 600 枚纽扣",
      text: "CG-2016-022 中有 600 枚银色星形纽扣，没有进入乐园仓库，而是直接送到了第七区。"
    },
    {
      id: "linMemoPhrase",
      inferredBy: "memoDecode",
      title: "林思遥留下的话",
      text: "LSY-MEMO-17 指向一句话：“先核对节目单，再相信照片”。"
    },
    {
      id: "archivePathRecovered",
      inferredBy: "archivePath",
      title: "坏链接的新地址",
      text: "旧地址里的 public 和 preview 被换成 archive 和 full，项目编号没有改变。"
    },
    {
      id: "publicInternalDifference",
      inferredBy: "publicInternalDifference",
      title: "政府公开文件少了一页",
      text: "政府文件还写着“长期记忆修正样本说明”，但附件 3 没有公开；内部把相关结果叫作“记忆覆盖率”。"
    },
    {
      id: "zone7Procedure",
      inferredBy: "zone7Procedure",
      title: "第七区的三步流程",
      text: "先在 B07-06 看影像，再去 B07-07 听广播，最后在 B07-05 画画。画出来的内容又被当成事情真的发生过的证明。"
    },
    {
      id: "continuationTargets",
      inferredBy: "transferDecode",
      title: "闭园后的去向",
      text: "服务器记录指向学校、车站和公共活动。这套做法在乐园关闭后仍被继续使用。"
    },
    {
      id: "broadcastReconstruction",
      inferredBy: "broadcastReconstruction",
      title: "门禁关闭后的 16:17",
      text: "16:17 的专用广播发生在第七区门禁关闭之后，没有进入园区主广播；9 分钟后生成了家庭回访照片。"
    },
    {
      id: "scanAssembly",
      inferredBy: "scanAssembly",
      title: "附件 03 的接收位置",
      text: "拼合后的移交页把公开目录中的“政务资料室”改写为“第七区设备间”，但原始回执已经无法恢复。"
    }
  ];

  function renderSummary() {
    var count = solved.length;
    document.querySelector("[data-solved-count]").textContent = String(count);
    document.querySelector("[data-progress-bar]").style.width = Math.min(100, count / totalRecords * 100) + "%";
    var message = document.querySelector("[data-progress-message]");
    if (!count) {
      message.textContent = "先逛一逛旧官网。看到对不上的日期、编号或照片，就记下来。";
    } else if (count < 4) {
      message.textContent = "你已经找到一些奇怪的地方。继续追同一个编号和时间。";
    } else if (!progress.archiveAccessGranted) {
      message.textContent = "这些线索正在指向同一个隐藏项目。现在还差打开档案的关键信息。";
    } else {
      message.textContent = "你已经打开隐藏档案。继续对比政府公开的说法和内部记录。";
    }
  }

  function renderCases() {
    var list = document.querySelector("[data-case-list]");
    var available = caseNotes.filter(function (item) {
      return item.discovered;
    });

    available.forEach(function (item) {
      var card = document.createElement("article");
      var isSolved = hasSolved(item.id);
      var level = Math.max(0, Math.min(3, Number(revealedHints[item.id] || 0)));
      card.className = "case-card" + (isSolved ? " is-solved" : "");
      card.innerHTML =
        '<div class="case-card-header"><h3>' + item.title + '</h3><span class="case-status">' +
        (isSolved ? "已解决" : "正在调查") + '</span></div>' +
        (isSolved ? '<p class="case-source">' + item.source + '</p>' : "") +
        '<div class="case-hints" data-hints-for="' + item.id + '"></div>';
      list.appendChild(card);

      var hintBox = card.querySelector("[data-hints-for]");
      var hintIndex;
      for (hintIndex = 0; hintIndex < level; hintIndex += 1) {
        var hint = document.createElement("p");
        hint.textContent = "提示 " + (hintIndex + 1) + "：" + item.hints[hintIndex];
        hintBox.appendChild(hint);
      }
      if (!isSolved && level < 3) {
        var button = document.createElement("button");
        button.type = "button";
        button.textContent = level ? "再提示一点" : "给我一点提示";
        button.addEventListener("click", function () {
          progress = readProgress();
          progress.revealedHints = progress.revealedHints || {};
          progress.revealedHints[item.id] = Math.min(3, Number(progress.revealedHints[item.id] || 0) + 1);
          writeProgress(progress);
          window.location.reload();
        });
        hintBox.appendChild(button);
      }
    });

    if (available.length < caseNotes.length) {
      var unknown = document.createElement("article");
      unknown.className = "case-card is-unknown";
      unknown.setAttribute("aria-label", "还没有发现的调查问题");
      unknown.innerHTML =
        '<div class="case-card-header"><h3>????</h3><span class="case-status">未记录</span></div>' +
        '<p>继续逛网站。等你真的碰到可疑之处，这里才会写出新的问题。</p>';
      list.appendChild(unknown);
    }
  }

  function renderEvidence() {
    var list = document.querySelector("[data-evidence-list]");
    var visible = evidenceList.filter(function (item) {
      return savedEvidence.indexOf(item.id) !== -1 || hasSolved(item.inferredBy);
    });
    if (!visible.length) {
      var empty = document.createElement("li");
      empty.className = "empty-record";
      empty.textContent = "还没有找到可以保存的证据。";
      list.appendChild(empty);
      return;
    }
    visible.forEach(function (item) {
      var row = document.createElement("li");
      row.innerHTML = "<strong>" + item.title + "</strong><span>" + item.text + "</span>";
      list.appendChild(row);
    });
  }

  function bindDirectionHint() {
    var button = document.querySelector("[data-direction-hint]");
    var result = document.querySelector("[data-direction-result]");
    var target = caseNotes.find(function (item) {
      return !hasSolved(item.id);
    });
    if (!target) {
      button.hidden = true;
      return;
    }
    button.addEventListener("click", function () {
      result.textContent = target.direction;
      result.hidden = false;
      button.textContent = "提示已显示";
      button.disabled = true;
    });
  }

  document.querySelector("[data-reset-records]").addEventListener("click", function () {
    if (window.confirm("要清空这台电脑上的全部调查进度，并返回入口吗？")) {
      localStorage.removeItem(saveKey);
      window.location.href = "galaxy-park-arg.html";
    }
  });

  renderSummary();
  renderCases();
  renderEvidence();
  bindDirectionHint();
}());
