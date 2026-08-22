(function () {
  "use strict";

  var saveKey = "galaxyParkArgProgressV1";
  var evidenceChecklist = [
    "staffBackupAccess",
    "mapVersionDifference",
    "echoPhotoTimestamp",
    "projectIdentity",
    "silverButtonPurchase",
    "linMemoPhrase",
    "archivePathRecovered",
    "publicInternalDifference",
    "zone7Procedure",
    "continuationTargets",
    "broadcastReconstruction",
    "scanAssembly"
  ];
  var body = document.body;
  var site = body.dataset.site;
  var page = body.dataset.page;
  var siteCatalog = window.GALAXY_SITE_DATA || {};
  var currentSite = siteCatalog[site];
  var currentPage = currentSite && currentSite.pages ? currentSite.pages[page] : null;

  if (page) {
    body.classList.add("page-" + page);
  }
  if (currentPage && currentPage.layout) {
    body.classList.add("layout-" + currentPage.layout);
  }

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

  function hasCompleteSecurityEvidence(progress) {
    var evidence = progress.evidence || [];
    return evidenceChecklist.every(function (id) {
      return evidence.indexOf(id) !== -1;
    });
  }

  function synchronizeSecurityStage() {
    var progress = readProgress();
    var changed = false;
    if (hasCompleteSecurityEvidence(progress) && !progress.securityReady) {
      progress.securityReady = true;
      changed = true;
    }
    if (progress.securityFlagged &&
        !progress.mailOpenedAfterEvidence &&
        !progress.finalChoice) {
      progress.securityFlagged = false;
      delete progress.securityFlaggedAt;
      changed = true;
    }
    if (changed) {
      writeProgress(progress);
    }
  }

  function activateSecurityFlagOnMailOpen() {
    if (site !== "archive" || page !== "final-evidence") {
      return;
    }
    var progress = readProgress();
    if (!hasCompleteSecurityEvidence(progress) || progress.finalChoice) {
      return;
    }
    progress.securityReady = true;
    progress.mailOpenedAfterEvidence = true;
    if (!progress.securityFlagged) {
      progress.securityFlagged = true;
      progress.securityFlaggedAt = Date.now();
    }
    writeProgress(progress);
  }

  function padTimePart(value) {
    return String(value).padStart(2, "0");
  }

  function formatLocalAuditTime(value) {
    var date = new Date(value);
    return date.getFullYear() + "-" +
      padTimePart(date.getMonth() + 1) + "-" +
      padTimePart(date.getDate()) + " " +
      padTimePart(date.getHours()) + ":" +
      padTimePart(date.getMinutes()) + ":" +
      padTimePart(date.getSeconds());
  }

  function bindReaderAuditTime() {
    var cell = document.querySelector("[data-reader-seen-time]");
    if (!cell) {
      return;
    }
    var progress = readProgress();
    var savedTime = Number(progress.readerAuditTime);
    if (!Number.isFinite(savedTime)) {
      savedTime = Date.now() - 12 * 60 * 1000;
      progress.readerAuditTime = savedTime;
      writeProgress(progress);
    }
    cell.textContent = formatLocalAuditTime(savedTime);
  }

  function enforceDisclaimer() {
    var progress = readProgress();
    if (!progress.disclaimerAccepted) {
      window.location.replace("/ARGgame/galaxy-park-arg/galaxy-park-arg.html");
      return false;
    }
    return true;
  }

  function enforceSecurityLock() {
    var progress = readProgress();
    if (progress.securityFlagged && (site === "park" || site === "government")) {
      window.location.replace("/ARGgame/galaxy-park-arg/archive/security-lock.html");
      return false;
    }
    return true;
  }

  function enforceMemberAccess() {
    if (site !== "park") {
      return true;
    }
    if (page === "index" || page === "account-recovery") {
      return true;
    }
    if (!readProgress().memberSession) {
      window.location.replace("/ARGgame/galaxy-park-arg/galaxy-park-arg.html?login=required");
      return false;
    }
    return true;
  }

  function enforceArchiveAccess() {
    if (site !== "archive" || page === "access") {
      return true;
    }
    if (!readProgress().archiveAccessGranted) {
      window.location.replace("/ARGgame/galaxy-park-arg/archive/access.html?locked=1");
      return false;
    }
    return true;
  }

  function enforceEndingAccess() {
    if (site !== "archive" || page.indexOf("ending-") !== 0) {
      return true;
    }
    var expected = {
      "ending-neutral": "neutral",
      "ending-good": "good",
      "ending-bad": "bad",
      "ending-bad-epilogue": "bad"
    };
    if (readProgress().finalChoice !== expected[page]) {
      window.location.replace("/ARGgame/galaxy-park-arg/archive/final-evidence.html");
      return false;
    }
    return true;
  }

  function enforceCompletedEnding() {
    var progress = readProgress();
    if (site !== "archive" || page !== "final-evidence" || !progress.finalChoice) {
      return true;
    }
    var destination = {
      neutral: "ending-neutral.html",
      good: "ending-good.html",
      bad: "ending-bad.html"
    }[progress.finalChoice];
    if (destination) {
      window.location.replace(destination);
      return false;
    }
    return true;
  }

  function markVisit() {
    var progress = readProgress();
    var visits = progress.visitedPages || [];
    var visitKey = site + "/" + page;
    if (visits.indexOf(visitKey) === -1) {
      visits.push(visitKey);
    }
    progress.visitedPages = visits;
    writeProgress(progress);
  }

  function navMarkup(items, navClass) {
    return '<nav class="' + navClass + '" aria-label="主导航"><ul>' +
      items.map(function (item) {
        var current = item.page === page ? ' aria-current="page"' : "";
        return '<li><a href="' + item.href + '"' + current + '>' + item.label + '</a></li>';
      }).join("") +
      "</ul></nav>";
  }

  function parkHeader() {
    return '<header class="park-header">' +
      '<div class="park-topbar">' +
      '<a class="park-brand" href="galaxy-park-arg.html" aria-label="星河乐园首页"><span class="park-brand-mark">星</span><span><strong>星河乐园</strong><small>GALAXY PARK</small></span></a>' +
      navMarkup(currentSite.nav, "park-nav") +
      '<a class="park-staff-link" href="/ARGgame/galaxy-park-arg/park/staff-login.html">员工入口</a>' +
      '</div></header>';
  }

  function governmentHeader() {
    return '<header class="government-header" aria-label="机构与主导航">' +
      '<div class="gov-banner"><div class="gov-seal">临江</div><h1>临江市儿童发展与公共秩序管理办公室</h1><p>政务公开<br>公共服务<br>项目监督</p></div>' +
      navMarkup(currentSite.nav, "gov-nav") +
      '<div class="gov-masthead-note">临江市政务资料留存版<br>资料最后整理：2019-03-22</div>' +
      "</header>";
  }

  function archiveHeader() {
    return '<header class="archive-header">' +
      '<div class="archive-titlebar"><h1>临江市历史项目档案管理系统</h1><span>只读镜像 / 文件校验节点 03</span></div>' +
      '<div class="archive-menubar"><span>档案(F)</span><span>编辑(E)</span><span>查看(V)</span><span>工具(T)</span><span>帮助(H)</span></div>' +
      '<div class="archive-toolbar"><button type="button" onclick="history.back()">后退</button><button type="button" onclick="history.forward()">前进</button><span class="archive-path-label">位置</span><div class="archive-address">' + currentPage.breadcrumb + '</div></div>' +
      "</header>";
  }

  function sidebarMarkup() {
    var links = currentSite.sidebar.map(function (item) {
      var progress = readProgress();
      var alertClass = site === "archive" &&
        item.href === "/ARGgame/galaxy-park-arg/archive/final-evidence.html" &&
        (progress.securityReady || hasCompleteSecurityEvidence(progress)) ?
        ' class="archive-mail-alert-link"' : "";
      return '<li><a href="' + item.href + '"' + alertClass + ">" + item.label + "</a></li>";
    }).join("");
    var className = site === "park" ? "park-sidebar" : site === "government" ? "gov-sidebar" : "archive-sidebar";
    var title = site === "park" ? "网站栏目" : site === "government" ? "政务公开" : "档案目录";
    return '<aside class="' + className + '" aria-label="栏目导航"><h2>' + title + '</h2><ul>' + links +
      '</ul><div class="sidebar-block">' + currentSite.sidebarNote + "</div></aside>";
  }

  function footerMarkup() {
    if (site === "park") {
      return '<footer class="site-footer">星河乐园官方网站　页面内容截至 2018 年 10 月<br>' +
        '临江 ICP 备 070118 号　累计访问：<span class="visitor-counter">0718426</span><br>' +
        '友情链接：<a href="/ARGgame/galaxy-park-arg/government/index.html">临江市儿童发展与公共秩序管理办公室</a>　｜　<a href="/ARGgame/galaxy-park-arg/park/staff-login.html">员工入口</a></footer>';
    }
    if (site === "government") {
      return '<footer class="site-footer">临江市儿童发展与公共秩序管理办公室<br>' +
        '地址：临江市新河路 16 号　历史联系电话：0100-421607（已停用）<br>' +
        '相关历史站点：<a href="/ARGgame/galaxy-park-arg/park/index.html">星河乐园（已闭园）</a></footer>';
    }
    return '<footer class="site-footer">档案系统版本 4.2.7　只读恢复模式　文件校验节点 03</footer>';
  }

  function render() {
    var app = document.getElementById("site-app");
    document.title = currentPage.title + "｜" + currentSite.name;
    if (site === "park" && page === "index" && !readProgress().memberSession) {
      renderParkLogin(app);
      return;
    }
    if (site === "park" && page === "account-recovery") {
      renderParkRecovery(app);
      return;
    }
    if (site === "park") {
      renderPark(app);
    } else if (site === "government") {
      renderGovernment(app);
    } else {
      renderArchive(app);
    }
    appendNotebookLink();
  }

  function optimizeRenderedImages() {
    var eagerImages = ".park-login-poster img, .gov-photo-news img";
    document.querySelectorAll("img").forEach(function (image) {
      image.setAttribute("decoding", "async");
      if (image.matches(eagerImages)) {
        image.setAttribute("loading", "eager");
        image.setAttribute("fetchpriority", "high");
      } else {
        image.setAttribute("loading", "lazy");
      }
    });
  }

  function parkGuestHeader() {
    return '<header class="park-login-header">' +
      '<a class="park-login-brand" href="galaxy-park-arg.html"><span class="park-brand-mark">星</span>' +
      '<span><strong>星河乐园</strong><small>GALAXY PARK · 旧网站会员入口</small></span></a>' +
      '<span class="park-login-header-state">资料留存站</span>' +
      '</header>';
  }

  function renderParkLogin(app) {
    body.classList.add("park-login-screen");
    var requested = new URLSearchParams(window.location.search).get("login") === "required";
    var gateNotice = requested ?
      '<p class="park-login-required">该页面仅向已登录的旧会员账户开放，请先验证账户。</p>' : "";
    app.innerHTML = '<a class="skip-link" href="#member-login-panel">跳到登录表单</a>' +
      '<div class="park-login-shell">' + parkGuestHeader() +
      '<main class="park-login-stage">' +
      '<section class="park-login-poster" aria-label="星河乐园历史照片">' +
      '<img src="../assets/images/photos/galaxy-wheel-2016.jpg" alt="傍晚的星河乐园摩天轮与入口广场">' +
      '<div><p>1999—2018</p><h1>把快乐留在星河</h1><span>闭园资料留存站</span></div>' +
      '</section>' +
      '<section class="park-login-panel" id="member-login-panel" aria-labelledby="member-login-title">' +
      '<div class="park-login-panel-heading"><span>MEMBER ACCESS</span><h2 id="member-login-title">旧会员登录</h2>' +
      '<p>本站保存闭园前的乐园资讯及部分会员资料，登录后可继续查阅。</p></div>' +
      gateNotice +
      '<form class="park-member-login-form" data-member-login>' +
      '<div class="form-row"><label for="member-account">会员账户</label><input id="member-account" name="memberAccount" type="text" autocomplete="username" required></div>' +
      '<div class="form-row"><label for="member-password">登录密码</label><input id="member-password" name="memberPassword" type="password" autocomplete="current-password" required></div>' +
      '<button type="submit">登录网站</button>' +
      '<p id="member-login-status" class="status-line" aria-live="polite"></p>' +
      '</form>' +
      '<div class="park-login-services"><a href="/ARGgame/galaxy-park-arg/park/account-recovery.html">找回旧会员账户</a>' +
      '<span aria-disabled="true">新用户注册（已停止）</span></div>' +
      '<p class="park-login-footnote">本系统已停止续费、注册及人工申诉服务。</p>' +
      '</section></main>' +
      '<footer class="park-login-footer">星河乐园旧官方网站　页面资料截至 2018 年 10 月</footer></div>';
  }

  function renderParkRecovery(app) {
    body.classList.add("park-login-screen", "park-recovery-screen");
    app.innerHTML = '<a class="skip-link" href="#main-content">跳到主要内容</a>' +
      '<div class="park-login-shell">' + parkGuestHeader() +
      '<div class="park-recovery-location"><a href="galaxy-park-arg.html">旧会员登录</a><span>›</span>账户查询</div>' +
      '<main id="main-content" class="park-recovery-main" tabindex="-1">' +
      '<h1>' + currentPage.title + '</h1>' + currentPage.html +
      '</main><footer class="park-login-footer">星河乐园旧会员资料留存系统</footer></div>';
  }

  function appendNotebookLink() {
    var link = document.createElement("a");
    link.className = "case-notebook-link";
    link.href = "/ARGgame/galaxy-park-arg/notebook.html";
    link.textContent = "调查记录";
    link.setAttribute("aria-label", "打开调查记录");
    document.body.appendChild(link);
  }

  function renderPark(app) {
    var widePages = ["index", "attractions", "photos", "staff-login"];
    var isWide = widePages.indexOf(page) !== -1;
    var isHome = page === "index";
    var sidebar = isWide ? "" : sidebarMarkup();
    var bodyClass = isWide ? "park-body park-body-wide" : "park-body";
    var heading = isHome ? "" :
      '<p class="breadcrumb park-breadcrumb">' + currentPage.breadcrumb + "</p>" +
      '<h1 class="page-title">' + currentPage.title + "</h1>";
    app.innerHTML = '<a class="skip-link" href="#main-content">跳到主要内容</a>' +
      '<div class="park-frame">' + parkHeader() +
      '<div class="' + bodyClass + '">' + sidebar +
      '<main id="main-content" class="main-content park-main-content" tabindex="-1">' +
      heading + currentPage.html +
      "</main></div>" + footerMarkup() + "</div>";
  }

  function governmentServicePanel() {
    var links = currentSite.sidebar.map(function (item) {
      return '<li><a href="' + item.href + '">' + item.label + '</a></li>';
    }).join("");
    return '<aside class="gov-service-panel" aria-label="政务公开快捷入口">' +
      '<h2>政务公开</h2><ul>' + links + '</ul>' +
      '<div class="gov-service-note">' + currentSite.sidebarNote + '</div></aside>';
  }

  function renderGovernment(app) {
    var isHome = page === "index";
    var pageClass = isHome ? "gov-home-layout" : "gov-inner-layout";
    var servicePanel = isHome ? governmentServicePanel() : "";
    app.innerHTML = '<a class="skip-link" href="#main-content">跳到主要内容</a>' +
      '<div class="government-wrap"><div class="gov-portal-grid">' + governmentHeader() +
      '<div class="gov-right-panel">' +
      '<div class="gov-public-strip"><a href="/ARGgame/galaxy-park-arg/government/documents.html">政府信息公开目录</a><a href="/ARGgame/galaxy-park-arg/government/organization.html">机构职能</a><a href="/ARGgame/galaxy-park-arg/government/search.html">文件检索</a><a href="/ARGgame/galaxy-park-arg/government/feedback.html">公众意见</a><span>历史资料只读</span></div>' +
      '<div class="gov-location"><span>' + currentPage.breadcrumb + '</span><span><a href="/ARGgame/galaxy-park-arg/government/search.html">站内检索</a>　|　<a href="/ARGgame/galaxy-park-arg/park/index.html">历史相关站点</a></span></div>' +
      '<div class="' + pageClass + '">' +
      '<main id="main-content" class="gov-main-content" tabindex="-1">' +
      '<h1 class="page-title">' + currentPage.title + "</h1>" +
      currentPage.html +
      "</main>" + servicePanel + "</div>" + footerMarkup() + "</div></div></div>";
  }

  function renderArchive(app) {
    var isAccess = page === "access";
    var tree = isAccess ? "" : sidebarMarkup();
    var workspaceClass = isAccess ? "archive-workspace archive-access-workspace" : "archive-workspace";
    var securityProgress = readProgress();
    if (securityProgress.securityReady || hasCompleteSecurityEvidence(securityProgress)) {
      body.classList.add("security-ready");
    }
    var securityFlagged = securityProgress.securityFlagged;
    if (securityFlagged) {
      body.classList.add("security-flagged");
    }
    var sessionWarning = '<div class="archive-session-warning">' +
      '<strong>访问已记录</strong>' +
      '<span>原始访问记录无法恢复。当前阅读会话已写入独立审计区，访问节点位置已确定；关闭页面不能删除、撤回或恢复为“未读取”。</span>' +
      '</div>';
    app.innerHTML = '<a class="skip-link" href="#main-content">跳到主要内容</a>' +
      '<div class="archive-window">' + archiveHeader() +
      '<div class="' + workspaceClass + '">' + tree +
      '<main id="main-content" class="archive-document-pane" tabindex="-1">' +
      '<div class="archive-tabbar"><strong>' + currentPage.title + '</strong><span>只读</span></div>' +
      '<p class="permission-strip">权限级别：' + (currentPage.permission || "内部资料 / 只读") + "</p>" +
      sessionWarning +
      currentPage.html +
      "</main></div>" + footerMarkup() + "</div>";
  }

  function bindCommonActions() {
    document.querySelectorAll("[data-clear-progress]").forEach(function (button) {
      button.addEventListener("click", function () {
        localStorage.removeItem(saveKey);
        window.location.href = "/ARGgame/galaxy-park-arg/galaxy-park-arg.html";
      });
    });

    document.querySelectorAll("[data-local-message]").forEach(function (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        var target = document.getElementById(form.dataset.localMessage);
        if (target) {
          target.textContent = form.dataset.message || "本页已经检查完成。";
        }
      });
    });

    document.querySelectorAll("[data-site-search]").forEach(function (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        var field = form.querySelector('input[name="keyword"]');
        var results = document.getElementById("site-search-results");
        var keyword = field ? field.value.trim().toLowerCase() : "";
        var matches = (currentSite.searchIndex || []).filter(function (item) {
          return (item.title + " " + item.text).toLowerCase().indexOf(keyword) !== -1;
        });
        results.replaceChildren();
        var heading = document.createElement("h2");
        heading.className = "section-title";
        heading.textContent = keyword ? "搜索结果：" + keyword : "搜索结果";
        results.appendChild(heading);
        if (!keyword) {
          var emptyPrompt = document.createElement("p");
          emptyPrompt.textContent = "请输入关键词。";
          results.appendChild(emptyPrompt);
          return;
        }
        if (!matches.length) {
          var noResult = document.createElement("p");
          noResult.textContent = "没有找到相关页面。可以换一个更短的词、年份或设施名称再试。";
          results.appendChild(noResult);
          return;
        }
        var list = document.createElement("ul");
        list.className = "link-list";
        matches.forEach(function (item) {
          var row = document.createElement("li");
          var link = document.createElement("a");
          link.href = item.href;
          link.textContent = item.title;
          row.appendChild(link);
          list.appendChild(row);
        });
        results.appendChild(list);
      });
    });

    document.querySelectorAll("[data-font-size]").forEach(function (button) {
      button.addEventListener("click", function () {
        var main = document.getElementById("main-content");
        main.style.fontSize = button.dataset.fontSize;
      });
    });

    document.querySelectorAll("[data-print]").forEach(function (button) {
      button.addEventListener("click", function () {
        window.print();
      });
    });

    bindMemberLogin();
    bindMemberRecovery();
    bindMemberSession();
    bindStaffAccountRecovery();
    bindStaffPortal();
    bindArchiveAccess();
    bindMapDifference();
    bindEventTimestamp();
    bindProjectIdentity();
    bindProcurementMismatch();
    bindMemoDecode();
    bindPublicInternalDifference();
    bindZoneProcedure();
    bindMoveRegisterAccess();
    bindTransferDecode();
    bindTimelinePuzzle();
    bindScanPuzzle();
    bindFinalEvidence();
  }

  function textMark(value) {
    var valueMark = 7;
    var index;
    for (index = 0; index < value.length; index += 1) {
      valueMark = (Math.imul(valueMark, 131) + value.charCodeAt(index)) >>> 0;
    }
    return valueMark.toString(16);
  }

  function bindMemberLogin() {
    var form = document.querySelector("[data-member-login]");
    if (!form) {
      return;
    }
    var status = document.getElementById("member-login-status");
    var progress = readProgress();
    if (progress.memberSession) {
      status.innerHTML = '旧会员账户已经登录。<a href="/ARGgame/galaxy-park-arg/park/member-center.html">进入会员中心</a>';
    }
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      progress = readProgress();
      var account = accessText(form.elements.memberAccount.value);
      var password = form.elements.memberPassword.value;
      var passwordMark = textMark("gp-member|" + password);
      if (!progress.memberAccountRecovered) {
        status.innerHTML = '没有找到可登录的旧账户。可以先使用<a href="/ARGgame/galaxy-park-arg/park/account-recovery.html">旧账户查询</a>核验留存记录。';
        return;
      }
      if (account !== "gxl2614" || passwordMark !== progress.memberPasswordMark) {
        status.textContent = "会员账户或临时密码不一致。账户不会被锁定。";
        return;
      }
      progress.memberSession = true;
      writeProgress(progress);
      window.location.href = "galaxy-park-arg.html";
    });
  }

  function bindMemberRecovery() {
    var matchForm = document.querySelector("[data-member-recovery]");
    var passwordForm = document.querySelector("[data-member-password-setup]");
    var result = document.querySelector("[data-member-account-result]");
    if (!matchForm || !passwordForm || !result) {
      return;
    }
    var matchStatus = document.getElementById("member-recovery-status");
    var passwordStatus = document.getElementById("member-password-status");
    var progress = readProgress();

    function showRecovered() {
      matchForm.hidden = true;
      passwordForm.hidden = true;
      result.hidden = false;
    }

    if (progress.memberAccountRecovered && progress.memberPasswordMark) {
      showRecovered();
      return;
    }

    matchForm.addEventListener("submit", function (event) {
      event.preventDefault();
      var joined = [
        matchForm.elements.memberCard.value,
        matchForm.elements.visitSlip.value,
        matchForm.elements.photoSlip.value
      ].join("|");
      if (textMark(joined) !== "e0f5eac8") {
        matchStatus.textContent = "一致性核验未通过。所选记录在尾号、柜台、日期或同行人数中至少有一项矛盾。";
        return;
      }
      matchStatus.textContent = "";
      matchForm.hidden = true;
      passwordForm.hidden = false;
      passwordForm.elements.newPassword.focus();
    });

    passwordForm.addEventListener("submit", function (event) {
      event.preventDefault();
      var first = passwordForm.elements.newPassword.value;
      var second = passwordForm.elements.confirmPassword.value;
      if (first.length < 6) {
        passwordStatus.textContent = "临时密码至少需要 6 个字符。";
        return;
      }
      if (first !== second) {
        passwordStatus.textContent = "两次输入的临时密码不一致。";
        return;
      }
      progress = readProgress();
      progress.memberAccountRecovered = true;
      progress.memberPasswordMark = textMark("gp-member|" + first);
      var solved = progress.solvedPuzzles || [];
      if (solved.indexOf("memberAccountRecovery") === -1) {
        solved.push("memberAccountRecovery");
      }
      progress.solvedPuzzles = solved;
      writeProgress(progress);
      passwordForm.reset();
      showRecovered();
    });
  }

  function bindMemberSession() {
    var button = document.querySelector("[data-member-logout]");
    if (!button) {
      return;
    }
    button.addEventListener("click", function () {
      var progress = readProgress();
      delete progress.memberSession;
      writeProgress(progress);
      window.location.href = "galaxy-park-arg.html";
    });
  }

  function bindStaffAccountRecovery() {
    var form = document.querySelector("[data-staff-account-recovery]");
    var result = document.querySelector("[data-staff-account-result]");
    if (!form || !result) {
      return;
    }
    var status = document.getElementById("staff-recovery-status");
    var expectedMarks = {
      identity: "db84e656",
      poem: "f4e0c9ac",
      bridges: "187d1e1c",
      dimensional: "331b7d",
      weekday: "1be2e99e",
      handover: "e4c601af"
    };

    function showResult() {
      form.hidden = true;
      result.hidden = false;
    }

    function markSection(name, passed) {
      var fieldset = form.querySelector('[data-recovery-section="' + name + '"]');
      var check = form.querySelector('[data-recovery-check="' + name + '"]');
      if (fieldset) {
        fieldset.classList.toggle("recovery-section-valid", passed);
        fieldset.classList.toggle("recovery-section-invalid", !passed);
      }
      if (check) {
        check.textContent = passed ? "与留存答题卡一致" : "与留存答题卡不一致";
      }
    }

    if (readProgress().staffAccountRecovered) {
      showResult();
      return;
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var employeeCode = accessText(form.elements.employeeCode.value).replace(/^e/, "");
      var values = {
        identity: accessText(form.elements.employeeName.value) + employeeCode,
        poem: accessText(form.elements.poemAnswer.value),
        bridges: accessText(form.elements.bridgeOne.value) +
          accessText(form.elements.bridgeTwo.value) +
          accessText(form.elements.bridgeThree.value),
        dimensional: accessText(form.elements.dimensionalAnswer.value),
        weekday: accessText(form.elements.weekdayAnswer.value),
        handover: accessText(form.elements.serviceStopDate.value)
      };
      var passed = {};
      var failedCount = 0;

      Object.keys(expectedMarks).forEach(function (name) {
        passed[name] = textMark(values[name]) === expectedMarks[name];
        if (!passed[name]) {
          failedCount += 1;
        }
        markSection(name, passed[name]);
      });

      if (failedCount) {
        status.textContent = "核验未通过：" + failedCount + " 个部分与留存答题卡不一致。已通过的部分会保留标记，账户不会被锁定。";
        var firstFailed = form.querySelector(".recovery-section-invalid input");
        if (firstFailed) {
          firstFailed.focus();
        }
        return;
      }

      var progress = readProgress();
      progress.staffAccountRecovered = true;
      var solved = progress.solvedPuzzles || [];
      if (solved.indexOf("staffAccountRecovery") === -1) {
        solved.push("staffAccountRecovery");
      }
      progress.solvedPuzzles = solved;
      writeProgress(progress);
      showResult();
    });
  }

  function bindStaffPortal() {
    var form = document.querySelector("[data-staff-portal]");
    if (!form) {
      return;
    }

    var progress = readProgress();
    var views = document.querySelectorAll("[data-portal-view]");
    var status = document.getElementById("portal-status");

    function showView(role) {
      var visibleRole = role || "login";
      views.forEach(function (view) {
        view.hidden = view.dataset.portalView !== visibleRole;
      });
    }

    if (progress.staffPortalRole && progress.staffPortalRole !== "administrator") {
      delete progress.staffPortalRole;
      writeProgress(progress);
    }
    showView(progress.staffPortalRole);

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var account = form.elements.account.value.trim().toLowerCase();
      var passcode = form.elements.passcode.value.trim();
      var mark = textMark(account + "|" + passcode);
      var role = "";

      if (mark === "6956a803") {
        role = "administrator";
      }

      if (!role) {
        status.textContent = "用户名或密码不对。可以重新输入，账户不会被锁定。";
        return;
      }

      progress = readProgress();
      progress.staffPortalRole = role;
      if (role === "administrator") {
        var solved = progress.solvedPuzzles || [];
        if (solved.indexOf("staffPortal") === -1) {
          solved.push("staffPortal");
        }
        progress.solvedPuzzles = solved;
        var evidence = progress.evidence || [];
        if (evidence.indexOf("staffBackupAccess") === -1) {
          evidence.push("staffBackupAccess");
        }
        progress.evidence = evidence;
        if (hasCompleteSecurityEvidence(progress)) {
          progress.securityReady = true;
        }
      }
      writeProgress(progress);
      form.reset();
      status.textContent = "";
      showView(role);
    });

    document.querySelectorAll("[data-portal-exit]").forEach(function (button) {
      button.addEventListener("click", function () {
        progress = readProgress();
        delete progress.staffPortalRole;
        writeProgress(progress);
        showView("login");
        form.elements.account.focus();
      });
    });
  }

  function accessText(value) {
    return value.trim().toLowerCase().replace(/[^\u4e00-\u9fffa-z0-9]/g, "");
  }

  function bindArchiveAccess() {
    var form = document.querySelector("[data-archive-access]");
    if (!form) {
      return;
    }

    var status = document.getElementById("archive-access-status");
    var clearanceModal = document.querySelector("[data-archive-clearance-modal]");
    var clearanceEnter = document.querySelector("[data-archive-clearance-enter]");
    var progress = readProgress();
    if (progress.archiveAccessGranted) {
      status.innerHTML = '这台电脑已经打开过档案。<a href="galaxy-park-arg.html">进入 LJ-GP-07</a>';
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var joined = accessText(form.elements.projectCode.value) +
        accessText(form.elements.projectName.value) +
        accessText(form.elements.transferCode.value);

      if (textMark(joined) !== "f17f4de1") {
        status.textContent = "未检索到对应的历史卷宗登记。";
        return;
      }

      progress = readProgress();
      progress.archiveAccessGranted = true;
      progress.coreArchiveEntered = true;
      var solved = progress.solvedPuzzles || [];
      if (solved.indexOf("archiveAccess") === -1) {
        solved.push("archiveAccess");
      }
      progress.solvedPuzzles = solved;
      writeProgress(progress);
      status.textContent = "检索成功。该卷未列入当前节点授权目录。";
      clearanceModal.hidden = false;
      clearanceEnter.focus();
    });

    clearanceEnter.addEventListener("click", function () {
      window.location.href = "galaxy-park-arg.html";
    });
  }

  function bindMapDifference() {
    var form = document.querySelector("[data-map-difference]");
    if (!form) {
      return;
    }

    var status = document.getElementById("map-difference-status");
    var reveal = document.querySelector("[data-map-reveal]");
    var progress = readProgress();

    function showSolved() {
      reveal.hidden = false;
      form.hidden = true;
    }

    if ((progress.solvedPuzzles || []).indexOf("mapDifference") !== -1) {
      showSolved();
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var mark = textMark(accessText(form.elements.areaName.value));
      if (["d02a54f2", "2159368c", "2a1402"].indexOf(mark) === -1) {
        status.textContent = "未检索到对应的历史图例记录。";
        return;
      }

      progress = readProgress();
      var solved = progress.solvedPuzzles || [];
      if (solved.indexOf("mapDifference") === -1) {
        solved.push("mapDifference");
      }
      progress.solvedPuzzles = solved;
      var evidence = progress.evidence || [];
      if (evidence.indexOf("mapVersionDifference") === -1) {
        evidence.push("mapVersionDifference");
      }
      progress.evidence = evidence;
      writeProgress(progress);
      status.textContent = "";
      showSolved();
    });
  }

  function bindEventTimestamp() {
    var form = document.querySelector("[data-event-timestamp]");
    if (!form) {
      return;
    }

    var status = document.getElementById("event-timestamp-status");
    var reveal = document.querySelector("[data-event-reveal]");
    var progress = readProgress();

    function showSolved() {
      reveal.hidden = false;
      form.hidden = true;
    }

    if ((progress.solvedPuzzles || []).indexOf("eventTimestamp") !== -1) {
      showSolved();
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var normalized = accessText(form.elements.outputTime.value) +
        accessText(form.elements.outputBatch.value) +
        accessText(form.elements.templateCode.value);
      if (textMark(normalized) !== "a1e535aa") {
        status.textContent = "B 批次输出时间、输出批次和背景模板未能对应同一照片单号。";
        return;
      }

      progress = readProgress();
      var solved = progress.solvedPuzzles || [];
      if (solved.indexOf("eventTimestamp") === -1) {
        solved.push("eventTimestamp");
      }
      progress.solvedPuzzles = solved;
      var evidence = progress.evidence || [];
      if (evidence.indexOf("echoPhotoTimestamp") === -1) {
        evidence.push("echoPhotoTimestamp");
      }
      progress.evidence = evidence;
      writeProgress(progress);
      status.textContent = "";
      showSolved();
    });
  }

  function bindProjectIdentity() {
    var form = document.querySelector("[data-project-identity]");
    if (!form) {
      return;
    }

    var status = document.getElementById("project-identity-status");
    var reveal = document.querySelector("[data-project-reveal]");
    var progress = readProgress();

    function showSolved() {
      reveal.hidden = false;
      form.hidden = true;
    }

    if ((progress.solvedPuzzles || []).indexOf("projectIdentity") !== -1) {
      showSolved();
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var joined = accessText(form.elements.parkCode.value) +
        accessText(form.elements.cityCode.value);

      if (textMark(joined) !== "a163061f") {
        status.textContent = "未检索到两个编号之间的关联记录。";
        return;
      }

      progress = readProgress();
      var solved = progress.solvedPuzzles || [];
      if (solved.indexOf("projectIdentity") === -1) {
        solved.push("projectIdentity");
      }
      progress.solvedPuzzles = solved;
      var evidence = progress.evidence || [];
      if (evidence.indexOf("projectIdentity") === -1) {
        evidence.push("projectIdentity");
      }
      progress.evidence = evidence;
      writeProgress(progress);
      status.textContent = "";
      showSolved();
    });
  }

  function recordFinding(puzzleId, evidenceId) {
    var progress = readProgress();
    var solved = progress.solvedPuzzles || [];
    if (solved.indexOf(puzzleId) === -1) {
      solved.push(puzzleId);
    }
    progress.solvedPuzzles = solved;
    if (evidenceId) {
      var evidence = progress.evidence || [];
      if (evidence.indexOf(evidenceId) === -1) {
        evidence.push(evidenceId);
      }
      progress.evidence = evidence;
    }
    if (hasCompleteSecurityEvidence(progress)) {
      progress.securityReady = true;
    }
    writeProgress(progress);
    applySecurityReadyUi(progress);
  }

  function applySecurityReadyUi(progress) {
    if (!progress.securityReady || site !== "archive") {
      return;
    }
    body.classList.add("security-ready");
    if (progress.securityFlagged) {
      body.classList.add("security-flagged");
    }
    var mailLink = document.querySelector('a[href="/ARGgame/galaxy-park-arg/archive/final-evidence.html"]');
    if (mailLink) {
      mailLink.classList.add("archive-mail-alert-link");
    }
  }

  function bindProcurementMismatch() {
    var form = document.querySelector("[data-procurement-mismatch]");
    if (!form) {
      return;
    }
    var status = document.getElementById("procurement-mismatch-status");
    var reveal = document.querySelector("[data-procurement-reveal]");
    var solved = (readProgress().solvedPuzzles || []).indexOf("procurementMismatch") !== -1;
    if (solved) {
      reveal.hidden = false;
      form.hidden = true;
    }
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var joined = accessText(form.elements.batchCode.value) +
        accessText(form.elements.deliverySlip.value);
      if (textMark(joined) !== "ae8d9c3d") {
        status.textContent = "未检索到对应的送货登记。";
        return;
      }
      status.textContent = "";
      recordFinding("procurementMismatch", "silverButtonPurchase");
      reveal.hidden = false;
      form.hidden = true;
    });
  }

  function bindMemoDecode() {
    var form = document.querySelector("[data-memo-decode]");
    if (!form) {
      return;
    }
    var status = document.getElementById("memo-decode-status");
    var reveal = document.querySelector("[data-memo-reveal]");
    var solved = (readProgress().solvedPuzzles || []).indexOf("memoDecode") !== -1;
    if (solved) {
      reveal.hidden = false;
      form.hidden = true;
    }
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var summary = accessText(form.elements.attachmentCode.value) +
        accessText(form.elements.memoPhrase.value);
      if (textMark(summary) !== "1237b0a") {
        status.textContent = "未检索到对应的旧备注。";
        return;
      }
      status.textContent = "";
      recordFinding("memoDecode", "linMemoPhrase");
      reveal.hidden = false;
      form.hidden = true;
    });
  }

  function bindPublicInternalDifference() {
    var form = document.querySelector("[data-public-internal-difference]");
    if (!form) {
      return;
    }
    var status = document.getElementById("public-internal-status");
    var reveal = document.querySelector("[data-public-internal-reveal]");
    var solved = (readProgress().solvedPuzzles || []).indexOf("publicInternalDifference") !== -1;
    if (solved) {
      reveal.hidden = false;
      form.hidden = true;
    }
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var attachmentNumber = accessText(form.elements.attachmentNumber.value).replace(/^0+(?=\d)/, "");
      var joined = attachmentNumber +
        accessText(form.elements.publicMetric.value) +
        accessText(form.elements.workingMetric.value) +
        accessText(form.elements.authorizedFollowups.value).replace(/^0+(?=\d)/, "") +
        accessText(form.elements.thirdRoundBelief.value);
      if (textMark(joined) !== "422fdfcd") {
        status.textContent = "补录信息与五份原件不能同时对应。序号可填 3 或 03，百分数可保留小数点和百分号。";
        return;
      }
      status.textContent = "";
      recordFinding("publicInternalDifference", "publicInternalDifference");
      reveal.hidden = false;
      form.hidden = true;
    });
  }

  function bindZoneProcedure() {
    var workbench = document.querySelector("[data-zone-route]");
    if (!workbench) {
      return;
    }
    var status = document.getElementById("zone-procedure-status");
    var reveal = document.querySelector("[data-zone-procedure-reveal]");
    var list = workbench.querySelector("[data-zone-route-list]");
    var roomButtons = Array.prototype.slice.call(workbench.querySelectorAll("[data-zone-room]"));
    var resetButton = workbench.querySelector("[data-zone-route-reset]");
    var sequence = [];
    var solved = (readProgress().solvedPuzzles || []).indexOf("zone7Procedure") !== -1;

    function renderSequence() {
      list.querySelectorAll("li").forEach(function (item, index) {
        item.textContent = sequence[index] || "尚未选择";
      });
      roomButtons.forEach(function (button) {
        var selectedIndex = sequence.indexOf(button.dataset.zoneRoom);
        button.classList.toggle("is-selected", selectedIndex !== -1);
        button.setAttribute("aria-pressed", selectedIndex !== -1 ? "true" : "false");
      });
    }

    function lockSolved() {
      sequence = ["B07-06", "B07-07", "B07-05"];
      renderSequence();
      roomButtons.forEach(function (button) {
        button.disabled = true;
      });
      resetButton.hidden = true;
      reveal.hidden = false;
    }

    if (solved) {
      lockSolved();
      return;
    }

    roomButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        if (sequence.length >= 3 || sequence.indexOf(button.dataset.zoneRoom) !== -1) {
          return;
        }
        sequence.push(button.dataset.zoneRoom);
        renderSequence();
        if (sequence.length < 3) {
          status.textContent = "";
          return;
        }
        if (textMark(sequence.map(function (room) {
          return room.toLowerCase();
        }).join("|")) !== "3c22c9a7") {
          status.textContent = "门禁回放未能闭合。所选房间与单向通道、房间用途至少有一处矛盾，可以清除后重新选择。";
          return;
        }
        status.textContent = "";
        recordFinding("zone7Procedure", "zone7Procedure");
        lockSolved();
      });
    });

    resetButton.addEventListener("click", function () {
      sequence = [];
      status.textContent = "";
      renderSequence();
    });
    renderSequence();
  }

  function bindMoveRegisterAccess() {
    var form = document.querySelector("[data-move-register-access]");
    if (!form) {
      return;
    }
    var status = document.getElementById("move-register-status");
    var reveal = document.querySelector("[data-move-register-reveal]");
    var solved = (readProgress().solvedPuzzles || []).indexOf("moveRegisterAccess") !== -1;

    function showFiles() {
      reveal.hidden = false;
      form.hidden = true;
    }

    if (solved) {
      showFiles();
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var joined = accessText(form.elements.documentNumber.value) +
        accessText(form.elements.boxNumber.value) +
        accessText(form.elements.missingPage.value).replace(/^0+(?=\d)/, "") +
        accessText(form.elements.receiveNode.value).replace(/^0+(?=\d)/, "");
      if (textMark(joined) !== "436f27f9") {
        status.textContent = "补录项与移交登记不能对应同一批资料。";
        return;
      }
      status.textContent = "";
      recordFinding("moveRegisterAccess");
      showFiles();
    });
  }

  function bindTransferDecode() {
    var form = document.querySelector("[data-transfer-decode]");
    if (!form) {
      return;
    }
    var status = document.getElementById("transfer-decode-status");
    var reveal = document.querySelector("[data-transfer-reveal]");
    var solved = (readProgress().solvedPuzzles || []).indexOf("transferDecode") !== -1;
    if (solved) {
      reveal.hidden = false;
      form.hidden = true;
    }
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var joined = accessText(form.elements.target2016.value) +
        accessText(form.elements.target2017.value) +
        accessText(form.elements.target2018.value);
      var mark = textMark(joined);
      if (["464a484c", "cd0d7573"].indexOf(mark) === -1) {
        status.textContent = "还原结果与转用登记不一致。";
        return;
      }
      status.textContent = "";
      recordFinding("transferDecode", "continuationTargets");
      reveal.hidden = false;
      form.hidden = true;
    });
  }

  function bindTimelinePuzzle() {
    var workbench = document.querySelector("[data-timeline-puzzle]");
    if (!workbench) {
      return;
    }
    var eventButtons = Array.prototype.slice.call(workbench.querySelectorAll("[data-timeline-event]"));
    var slotButtons = Array.prototype.slice.call(workbench.querySelectorAll("[data-timeline-slot]"));
    var checkButton = workbench.querySelector("[data-timeline-check]");
    var resetButton = workbench.querySelector("[data-timeline-reset]");
    var status = document.getElementById("timeline-puzzle-status");
    var reveal = workbench.querySelector("[data-timeline-reveal]");
    var selectedEvent = "";
    var assignments = ["", "", "", "", ""];
    var labels = {
      loop: "普通园区循环播报结束",
      gate: "第七区门禁关闭",
      echo: "EVT_ECHO_A 首次调用",
      photo: "家庭回访照片输出",
      call: "广播室回拨结束"
    };

    function renderTimeline() {
      eventButtons.forEach(function (button) {
        button.classList.toggle("is-active", button.dataset.timelineEvent === selectedEvent);
        button.classList.toggle("is-assigned", assignments.indexOf(button.dataset.timelineEvent) !== -1);
        button.setAttribute("aria-pressed", button.dataset.timelineEvent === selectedEvent ? "true" : "false");
      });
      slotButtons.forEach(function (button, index) {
        button.textContent = assignments[index] ? labels[assignments[index]] : "放入事件卡";
        button.classList.toggle("has-event", Boolean(assignments[index]));
      });
    }

    function lockTimeline() {
      assignments = ["loop", "gate", "echo", "photo", "call"];
      selectedEvent = "";
      renderTimeline();
      eventButtons.concat(slotButtons).forEach(function (button) {
        button.disabled = true;
      });
      checkButton.hidden = true;
      resetButton.hidden = true;
      reveal.hidden = false;
    }

    if ((readProgress().solvedPuzzles || []).indexOf("broadcastReconstruction") !== -1) {
      lockTimeline();
      return;
    }

    eventButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        selectedEvent = button.dataset.timelineEvent;
        status.textContent = "";
        renderTimeline();
      });
    });
    slotButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        if (!selectedEvent) {
          status.textContent = "先在上方选择一张事件卡。";
          return;
        }
        var previousIndex = assignments.indexOf(selectedEvent);
        if (previousIndex !== -1) {
          assignments[previousIndex] = "";
        }
        assignments[Number(button.dataset.timelineSlot)] = selectedEvent;
        selectedEvent = "";
        status.textContent = "";
        renderTimeline();
      });
    });
    checkButton.addEventListener("click", function () {
      if (assignments.some(function (value) { return !value; })) {
        status.textContent = "五个时间格尚未全部复原。";
        return;
      }
      if (textMark(assignments.join("|")) !== "3787ad47") {
        status.textContent = "顺序校验未通过。至少一项与门禁时间、设备延迟或照片输出间隔矛盾。";
        return;
      }
      status.textContent = "";
      recordFinding("broadcastReconstruction", "broadcastReconstruction");
      lockTimeline();
    });
    resetButton.addEventListener("click", function () {
      assignments = ["", "", "", "", ""];
      selectedEvent = "";
      status.textContent = "";
      renderTimeline();
    });
    renderTimeline();
  }

  function bindScanPuzzle() {
    var workbench = document.querySelector("[data-scan-puzzle]");
    if (!workbench) {
      return;
    }
    var pieces = Array.prototype.slice.call(workbench.querySelectorAll("[data-scan-piece]"));
    var rotateButton = workbench.querySelector("[data-scan-rotate]");
    var checkButton = workbench.querySelector("[data-scan-check]");
    var resetButton = workbench.querySelector("[data-scan-reset]");
    var selectionLabel = workbench.querySelector("[data-scan-selection]");
    var status = document.getElementById("scan-puzzle-status");
    var reveal = workbench.querySelector("[data-scan-reveal]");
    var selectedPiece = null;
    var initialState = pieces.map(function (piece, index) {
      piece.style.order = String(index);
      return {
        id: piece.dataset.scanPiece,
        order: index,
        rotation: Number(piece.dataset.rotation)
      };
    });

    function visualPieces() {
      return pieces.slice().sort(function (a, b) {
        return Number(a.style.order) - Number(b.style.order);
      });
    }

    function renderPieces() {
      pieces.forEach(function (piece) {
        piece.classList.toggle("is-selected", piece === selectedPiece);
        piece.setAttribute("aria-pressed", piece === selectedPiece ? "true" : "false");
        piece.querySelector("img").style.transform = "rotate(" + piece.dataset.rotation + "deg)";
      });
      selectionLabel.textContent = selectedPiece ?
        "已选择扫描块 " + selectedPiece.dataset.scanPiece.toUpperCase() + "；再选一块可交换位置。" :
        "尚未选择扫描块";
    }

    function setSolvedArrangement() {
      ["a", "b", "c", "d"].forEach(function (id, index) {
        var piece = pieces.find(function (item) {
          return item.dataset.scanPiece === id;
        });
        piece.style.order = String(index);
        piece.dataset.rotation = "0";
      });
      selectedPiece = null;
      renderPieces();
      pieces.forEach(function (piece) {
        piece.disabled = true;
      });
      rotateButton.hidden = true;
      checkButton.hidden = true;
      resetButton.hidden = true;
      reveal.hidden = false;
    }

    if ((readProgress().solvedPuzzles || []).indexOf("scanAssembly") !== -1) {
      setSolvedArrangement();
      return;
    }

    pieces.forEach(function (piece) {
      piece.addEventListener("click", function () {
        if (!selectedPiece) {
          selectedPiece = piece;
          renderPieces();
          return;
        }
        if (selectedPiece === piece) {
          selectedPiece = null;
          renderPieces();
          return;
        }
        var firstOrder = selectedPiece.style.order;
        selectedPiece.style.order = piece.style.order;
        piece.style.order = firstOrder;
        selectedPiece = null;
        status.textContent = "";
        renderPieces();
      });
    });
    rotateButton.addEventListener("click", function () {
      if (!selectedPiece) {
        status.textContent = "先选择一张扫描块。";
        return;
      }
      selectedPiece.dataset.rotation = selectedPiece.dataset.rotation === "0" ? "180" : "0";
      status.textContent = "";
      renderPieces();
    });
    checkButton.addEventListener("click", function () {
      var signature = visualPieces().map(function (piece) {
        return piece.dataset.scanPiece + ":" + piece.dataset.rotation;
      }).join("|");
      if (textMark(signature) !== "75802a1b") {
        status.textContent = "拼合边缘仍不连续。请同时核对装订孔、中央骑缝章、表格横线和页码方向。";
        return;
      }
      status.textContent = "";
      recordFinding("scanAssembly", "scanAssembly");
      setSolvedArrangement();
    });
    resetButton.addEventListener("click", function () {
      initialState.forEach(function (state) {
        var piece = pieces.find(function (item) {
          return item.dataset.scanPiece === state.id;
        });
        piece.style.order = String(state.order);
        piece.dataset.rotation = String(state.rotation);
      });
      selectedPiece = null;
      status.textContent = "";
      renderPieces();
    });
    renderPieces();
  }

  function finishInvestigation(choice, destination) {
    var progress = readProgress();
    var solved = progress.solvedPuzzles || [];
    if (solved.indexOf("finalAssembly") === -1) {
      solved.push("finalAssembly");
    }
    progress.solvedPuzzles = solved;
    progress.finalChoice = choice;
    writeProgress(progress);
    window.location.replace(destination);
  }

  function bindFinalEvidence() {
    var form = document.querySelector("[data-final-evidence]");
    if (!form) {
      return;
    }
    var status = document.getElementById("evidence-status");
    var progress = readProgress();
    var collectedEvidence = progress.evidence || [];
    var followup = document.querySelector("[data-followup-consent]");
    var sendButton = form.querySelector("[data-mail-submit]");
    var authorButton = document.querySelector("[data-author-test-entry]");
    var testDialog = document.querySelector("[data-author-test-modal]");
    var cancelTest = document.querySelector("[data-author-test-cancel]");
    var confirmTest = document.querySelector("[data-author-test-confirm]");

    function closeTestDialog() {
      testDialog.hidden = true;
    }

    if (authorButton && testDialog && cancelTest && confirmTest) {
      authorButton.addEventListener("click", function () {
        testDialog.hidden = false;
        cancelTest.focus();
      });
      cancelTest.addEventListener("click", closeTestDialog);
      testDialog.addEventListener("click", function (event) {
        if (event.target === testDialog) {
          closeTestDialog();
        }
      });
      testDialog.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
          closeTestDialog();
          authorButton.focus();
        }
      });
      confirmTest.addEventListener("click", function () {
        var save = readProgress();
        var evidence = save.evidence || [];
        evidenceChecklist.forEach(function (id) {
          if (evidence.indexOf(id) === -1) {
            evidence.push(id);
          }
        });
        save.evidence = evidence;
        save.securityReady = true;
        save.authorTestEvidence = true;
        writeProgress(save);
        window.location.reload();
      });
    }

    function updateSendButton() {
      var chosen = form.querySelector('input[name="route"]:checked');
      if (!chosen || chosen.value === "neutral") {
        sendButton.textContent = "保存邮件并关闭";
      } else if (chosen.value === "followup") {
        sendButton.textContent = "回复此邮件";
      } else {
        sendButton.textContent = "发送邮件";
      }
    }

    form.querySelectorAll("[data-evidence-id]").forEach(function (input) {
      var found = collectedEvidence.indexOf(input.dataset.evidenceId) !== -1;
      input.checked = found;
      input.disabled = !found;
      input.closest("label").classList.add(found ? "is-verified" : "is-missing");
    });
    form.querySelectorAll('input[name="route"]').forEach(function (input) {
      input.addEventListener("change", updateSendButton);
    });
    updateSendButton();

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var route = form.elements.route.value;
      var attachedEvidence = Array.prototype.filter.call(
        form.querySelectorAll("[data-evidence-id]"),
        function (input) { return input.checked; }
      ).map(function (input) { return input.dataset.evidenceId; });

      if (route === "neutral") {
        finishInvestigation("neutral", "ending-neutral.html");
        return;
      }

      if (route === "followup") {
        form.hidden = true;
        followup.hidden = false;
        followup.querySelector("input").focus();
        return;
      }

      var mustInclude = [
        "projectIdentity",
        "echoPhotoTimestamp",
        "zone7Procedure",
        "continuationTargets",
        "broadcastReconstruction",
        "scanAssembly"
      ];
      var hasRequiredFiles = mustInclude.every(function (id) {
        return attachedEvidence.indexOf(id) !== -1;
      });
      if (attachedEvidence.length < evidenceChecklist.length) {
        status.textContent = "邮件未发送：附件数量未达到归档外发要求（当前 " + attachedEvidence.length + " 份）。";
        return;
      }
      if (!hasRequiredFiles) {
        status.textContent = "邮件未发送：附件目录未通过完整性校验。";
        return;
      }
      finishInvestigation("good", "ending-good.html");
    });

    followup.addEventListener("submit", function (event) {
      event.preventDefault();
      finishInvestigation("bad", "ending-bad.html");
    });

    document.querySelector("[data-cancel-followup]").addEventListener("click", function () {
      followup.hidden = true;
      form.hidden = false;
      form.querySelector('input[name="route"][value="followup"]').focus();
    });
  }

  if (!enforceDisclaimer()) {
    return;
  }

  synchronizeSecurityStage();

  if (!enforceSecurityLock()) {
    return;
  }

  if (!enforceMemberAccess()) {
    return;
  }

  if (body.dataset.restoredPathEntry === "true") {
    recordFinding("archivePath", "archivePathRecovered");
  }

  if (!enforceArchiveAccess()) {
    return;
  }

  if (!enforceEndingAccess()) {
    return;
  }

  if (!enforceCompletedEnding()) {
    return;
  }

  activateSecurityFlagOnMailOpen();

  if (!currentSite || !currentPage) {
    document.getElementById("site-app").innerHTML = '<main class="notice-sheet"><h1>页面资料无法读取</h1><p>请返回网站首页重新进入。</p></main>';
    return;
  }

  markVisit();
  render();
  optimizeRenderedImages();
  bindReaderAuditTime();
  bindCommonActions();
}());
