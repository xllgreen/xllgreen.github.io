window.GALAXY_SITE_DATA = window.GALAXY_SITE_DATA || {};
window.GALAXY_SITE_DATA.park = {
  name: "星河乐园旧官方网站",
  nav: [
    { page: "index", href: "/ARGgame/galaxy-park-arg/galaxy-park-arg.html", label: "网站首页" },
    { page: "about", href: "/ARGgame/galaxy-park-arg/park/about.html", label: "乐园概况" },
    { page: "attractions", href: "/ARGgame/galaxy-park-arg/park/attractions.html", label: "游乐项目" },
    { page: "map", href: "/ARGgame/galaxy-park-arg/park/map.html", label: "园区导览" },
    { page: "news", href: "/ARGgame/galaxy-park-arg/park/news.html", label: "新闻公告" },
    { page: "summer-camp", href: "/ARGgame/galaxy-park-arg/park/summer-camp.html", label: "夏令营" },
    { page: "tickets", href: "/ARGgame/galaxy-park-arg/park/tickets.html", label: "票务服务" },
    { page: "photos", href: "/ARGgame/galaxy-park-arg/park/photos.html", label: "精彩图片" },
    { page: "contact", href: "/ARGgame/galaxy-park-arg/park/contact.html", label: "联系我们" }
  ],
  sidebar: [
    { href: "/ARGgame/galaxy-park-arg/park/member-center.html", label: "旧会员中心" },
    { href: "/ARGgame/galaxy-park-arg/park/history.html", label: "乐园大事记" },
    { href: "/ARGgame/galaxy-park-arg/park/staff.html", label: "员工风采" },
    { href: "/ARGgame/galaxy-park-arg/park/messages.html", label: "游客留言" },
    { href: "/ARGgame/galaxy-park-arg/park/ticket-query.html", label: "旧票查询" },
    { href: "/ARGgame/galaxy-park-arg/park/search.html", label: "站内搜索" },
    { href: "/ARGgame/galaxy-park-arg/park/site-update.html", label: "网站维护记录" }
  ],
  sidebarNote: "本网站已于 2019 年 3 月 22 日停止更新。电话、票价及活动安排均为闭园前记录。",
  pages: {
    index: {
      title: "星河乐园旧官方网站",
      breadcrumb: "当前位置：首页",
      html: `
        <section class="park-hero" aria-labelledby="park-hero-title">
          <div class="park-hero-copy">
            <p class="park-hero-kicker">GALAXY PARK · 临江市</p>
            <h1 id="park-hero-title">把快乐留在星河</h1>
            <p>摩天轮、月湾小火车、儿童城……十九年间，我们陪伴许多家庭度过周末。</p>
            <div class="park-hero-actions">
              <a class="park-primary-action" href="/ARGgame/galaxy-park-arg/park/map.html">园区导览</a>
              <a class="park-secondary-action" href="/ARGgame/galaxy-park-arg/park/photos.html">精彩图片</a>
            </div>
          </div>
          <p class="park-hero-caption">银河广场与摩天轮 · 摄于 2017 年</p>
        </section>

        <section class="park-closure-band" aria-label="闭园说明">
          <div><span>历史公告</span><strong>星河乐园已于 2018 年 10 月 28 日结束营业</strong></div>
          <p>本网站保留闭园前的栏目与游园资料，仅供老游客查阅。票价、电话和活动安排均已失效。</p>
          <a href="/ARGgame/galaxy-park-arg/park/news.html#closure">查看闭园公告</a>
        </section>

        <section class="park-showcase" aria-labelledby="showcase-title">
          <div class="park-section-heading">
            <p>DISCOVER THE PARK</p>
            <h2 id="showcase-title">记忆里的星河</h2>
          </div>
          <div class="park-showcase-grid">
            <a class="park-showcase-card park-showcase-card-tall" href="/ARGgame/galaxy-park-arg/park/attractions.html">
              <img src="../assets/images/photos/galaxy-wheel-2016.jpg" alt="白色摩天轮和园区广场">
              <span><small>园区地标</small><strong>银河摩天轮</strong></span>
            </a>
            <a class="park-showcase-card" href="/ARGgame/galaxy-park-arg/park/attractions.html">
              <img src="../assets/images/photos/moon-bay-train-2017.jpg" alt="蓝白色园区观光小火车">
              <span><small>沿月湾慢行</small><strong>月湾小火车</strong></span>
            </a>
            <a class="park-showcase-card" href="/ARGgame/galaxy-park-arg/park/summer-camp.html">
              <img src="../assets/images/photos/family-carousel-2017.jpg" alt="游客在旋转木马旁合影">
              <span><small>周末影像</small><strong>家庭欢乐时光</strong></span>
            </a>
          </div>
        </section>

        <section class="park-home-information">
          <div class="park-news-panel">
            <div class="park-panel-heading"><div><small>PARK NEWS</small><h2>乐园动态</h2></div><a href="/ARGgame/galaxy-park-arg/park/news.html">更多公告</a></div>
            <ul class="park-news-list">
              <li><time datetime="2018-09-21"><strong>21</strong><span>2018-09</span></time><a href="/ARGgame/galaxy-park-arg/park/news.html#closure">星河乐园永久闭园公告<small>关于停止营业、会员退费与纪念票保留的说明</small></a></li>
              <li><time datetime="2018-09-19"><strong>19</strong><span>2018-09</span></time><a href="/ARGgame/galaxy-park-arg/park/news.html#lost-found">闭园期间失物领取办法<small>游客服务中心集中受理至 11 月 15 日</small></a></li>
              <li><time datetime="2018-08-30"><strong>30</strong><span>2018-08</span></time><a href="/ARGgame/galaxy-park-arg/park/news.html#annual-check">银河摩天轮年度安全检验完成<small>设备于 8 月 31 日恢复正常开放</small></a></li>
            </ul>
          </div>
          <aside class="park-visit-panel">
            <p class="park-visit-kicker">VISITOR GUIDE</p>
            <h2>游园资料</h2>
            <dl>
              <div><dt>开放时间</dt><dd>9:30—17:30</dd></div>
              <div><dt>历史地址</dt><dd>滨江大道 118 号</dd></div>
              <div><dt>服务电话</dt><dd>0100-231188</dd></div>
            </dl>
            <nav aria-label="常用入口">
              <a href="/ARGgame/galaxy-park-arg/park/tickets.html">历史票价</a>
              <a href="/ARGgame/galaxy-park-arg/park/ticket-query.html">旧票查询</a>
              <a href="/ARGgame/galaxy-park-arg/park/contact.html">交通方式</a>
            </nav>
            <p class="small-note">以上为闭园前资料，现已失效。</p>
          </aside>
        </section>

        <section class="park-memory-strip">
          <img src="../assets/images/photos/carousel-morning-2015.jpg" alt="清晨尚未开放的旋转木马">
          <div>
            <p>OUR STORY · 1999—2018</p>
            <h2>十九年的城市记忆</h2>
            <p>从第一辆小火车驶出月湾站，到最后一个营业日的闭园广播，星河乐园曾是许多临江家庭共同的周末去处。</p>
            <a href="/ARGgame/galaxy-park-arg/park/history.html">阅读乐园大事记</a>
          </div>
        </section>
        <p class="park-snapshot-note">页面快照日期：2018 年 10 月 29 日。部分旧版栏目由 2019 年网站整理人员补录。</p>
      `
    },
    "account-recovery": {
      title: "旧会员账户查询",
      breadcrumb: '当前位置：<a href="/ARGgame/galaxy-park-arg/galaxy-park-arg.html">旧会员登录</a> &gt; 账户查询',
      layout: "member-recovery",
      html: `
        <div class="member-recovery-notice">
          <h2>星河乐园旧会员资料一致性核验</h2>
          <p>原会员数据库已经停止。部分没有完成注销的家庭账户，可凭登记卡、入园回执和照片交付单之间的一致记录恢复。</p>
          <p>核验仅接受一组同时满足下列条件的旧记录：</p>
          <ol>
            <li>登记卡尾号与入园回执中的会员尾号相同；</li>
            <li>登记柜台编号、入园柜台编号与照片单末两位相同；</li>
            <li>三份记录的日期和同行人数没有矛盾。</li>
          </ol>
        </div>

        <form class="member-record-match" data-member-recovery>
          <fieldset>
            <legend>一、家庭会员登记卡</legend>
            <div class="recovery-choice-grid">
              <label><input type="radio" name="memberCard" value="card-a" required><span><strong>GP-08-2614</strong><small>登记柜台 03　登记人数 3　持卡人：顾＊离</small></span></label>
              <label><input type="radio" name="memberCard" value="card-b"><span><strong>GP-09-4412</strong><small>登记柜台 05　登记人数 4　持卡人：韩＊平</small></span></label>
              <label><input type="radio" name="memberCard" value="card-c"><span><strong>GP-10-1732</strong><small>登记柜台 02　登记人数 2　持卡人：林＊川</small></span></label>
              <label><input type="radio" name="memberCard" value="card-d"><span><strong>GP-11-3504</strong><small>登记柜台 01　登记人数 3　持卡人：方＊安</small></span></label>
            </div>
          </fieldset>

          <fieldset>
            <legend>二、最后一次入园回执</legend>
            <div class="recovery-choice-grid">
              <label><input type="radio" name="visitSlip" value="visit-c" required><span><strong>V-140719-32</strong><small>会员尾号 1732　柜台 02　2014-07-19　同行 2 人　照片单 P-0719-04</small></span></label>
              <label><input type="radio" name="visitSlip" value="visit-a"><span><strong>V-140719-14</strong><small>会员尾号 2614　柜台 03　2014-07-19　同行 3 人　照片单 P-0719-03</small></span></label>
              <label><input type="radio" name="visitSlip" value="visit-d"><span><strong>V-140719-04</strong><small>会员尾号 3504　柜台 01　2014-07-19　同行 2 人　照片单 P-0719-01</small></span></label>
              <label><input type="radio" name="visitSlip" value="visit-b"><span><strong>V-140720-12</strong><small>会员尾号 4412　柜台 05　2014-07-20　同行 4 人　照片单 P-0719-05</small></span></label>
            </div>
          </fieldset>

          <fieldset>
            <legend>三、家庭照片交付单</legend>
            <div class="recovery-choice-grid">
              <label><input type="radio" name="photoSlip" value="photo-b" required><span><strong>P-0719-05</strong><small>柜台 05　2014-07-19　4 人　姓氏首字母 H</small></span></label>
              <label><input type="radio" name="photoSlip" value="photo-d"><span><strong>P-0719-01</strong><small>柜台 01　2014-07-19　2 人　姓氏首字母 F</small></span></label>
              <label><input type="radio" name="photoSlip" value="photo-a"><span><strong>P-0719-03</strong><small>柜台 03　2014-07-19　3 人　姓氏首字母 G</small></span></label>
              <label><input type="radio" name="photoSlip" value="photo-c"><span><strong>P-0719-04</strong><small>柜台 04　2014-07-19　2 人　姓氏首字母 L</small></span></label>
            </div>
          </fieldset>

          <button type="submit">核验所选记录</button>
          <p id="member-recovery-status" class="status-line" aria-live="polite"></p>
        </form>

        <form class="member-password-setup" data-member-password-setup hidden>
          <h2 class="section-title">设置本机临时密码</h2>
          <p>核验通过的账户仍没有可用密码。请为本浏览器中的旧会员快照设置一组临时密码。</p>
          <div class="form-row"><label for="new-member-password">临时密码</label><input id="new-member-password" name="newPassword" type="password" minlength="6" autocomplete="new-password" required></div>
          <div class="form-row"><label for="confirm-member-password">再次输入</label><input id="confirm-member-password" name="confirmPassword" type="password" minlength="6" autocomplete="new-password" required></div>
          <button type="submit">保存临时密码</button>
          <p id="member-password-status" class="status-line" aria-live="polite"></p>
        </form>

        <section class="member-account-result" data-member-account-result hidden>
          <h2>账户已恢复</h2>
          <dl>
            <div><dt>会员账户</dt><dd><code>gxl2614</code></dd></div>
            <div><dt>账户状态</dt><dd>家庭会员 / 只读快照</dd></div>
            <div><dt>最后一次入园</dt><dd>2014-07-19</dd></div>
          </dl>
          <a class="old-button-link" href="/ARGgame/galaxy-park-arg/galaxy-park-arg.html">返回登录</a>
        </section>
      `
    },
    "member-center": {
      title: "旧会员中心",
      breadcrumb: '当前位置：<a href="/ARGgame/galaxy-park-arg/galaxy-park-arg.html">首页</a> &gt; 旧会员中心',
      layout: "member-center",
      html: `
        <div class="member-center-bar"><strong>会员账户：gxl2614</strong><button type="button" data-member-logout>退出登录</button></div>
        <section class="member-profile-summary">
          <div>
            <span>家庭会员</span>
            <h2>顾小离家庭账户</h2>
            <p>开通时间：2008-06-14　登记人数：3　状态：闭园资料留存</p>
          </div>
          <p class="member-number">GP-08-2614</p>
        </section>
        <div class="notice-box">会员中心为 2018 年只读快照。个人信息已经作遮盖处理，续费、相册补寄与申诉功能均已停止。</div>
        <h2 class="section-title">历史到访记录</h2>
        <table class="data-table member-history-table">
          <thead><tr><th>日期</th><th>入园柜台</th><th>同行人数</th><th>关联服务</th></tr></thead>
          <tbody>
            <tr><td>2014-07-19</td><td>03</td><td>3</td><td>家庭照片 P-0719-03</td></tr>
            <tr><td>2013-08-11</td><td>03</td><td>3</td><td>月湾小火车家庭套票</td></tr>
            <tr><td>2011-05-02</td><td>04</td><td>2</td><td>儿童城临时寄存</td></tr>
          </tbody>
        </table>
        <h2 class="section-title">站内信</h2>
        <article class="member-mail-record">
          <header><strong>家庭照片补寄完成通知</strong><time>2016-11-03</time></header>
          <p>您在 2014 年 7 月 19 日留下的照片记录已重新整理。补寄批次由“当日相册”调整至“家庭回访输出”，照片单号仍为 P-0719-03。</p>
          <p>系统中同时保留了 16:17、16:26 两次输出记录。两次输出的人数相同，文件内容不完全相同。</p>
        </article>
        <article class="member-mail-record">
          <header><strong>旧会员资料下载</strong><time>2018-10-20</time></header>
          <p>闭园前生成的会员到访摘要仍可下载。照片文件因包含其他家庭影像，不在本页面提供。</p>
          <p><a class="file-link" href="../assets/files/park/GP-MEMBER-2614-visit-summary.pdf" download>下载：GP-MEMBER-2614 家庭会员到访摘要（PDF）</a></p>
        </article>
        <article class="member-mail-record member-package-record">
          <header><strong>夏令营材料转存包</strong><time>2018-10-21</time></header>
          <p>SC-140719-B 纸质材料及家庭照片输出记录已按原活动组名称封装。归档口令沿用四格页的记录结果：先写成小写拼音全拼，再接活动日期的月日，不使用空格。</p>
          <p><a class="file-link" href="../assets/files/park/SC-140719-B-package-note.txt" target="_blank" rel="noopener">查看：材料转存说明（TXT）</a></p>
          <p><a class="file-link" href="../assets/files/park/SC-140719-B-family-output.zip" download>下载：SC-140719-B 家庭输出记录（加密 ZIP）</a></p>
        </article>
        <div class="member-center-footer-link">
          <span>原员工与合作单位登录不属于会员服务。</span>
          <a href="/ARGgame/galaxy-park-arg/park/staff-login.html">员工信息服务</a>
        </div>
      `
    },
    about: {
      title: "乐园概况",
      breadcrumb: '当前位置：<a href="/ARGgame/galaxy-park-arg/galaxy-park-arg.html">首页</a> &gt; 乐园概况',
      html: `
        <p class="lead">星河乐园位于临江市滨江片区，1997 年动工建设，1999 年 5 月正式营业。园区曾占地约 310 亩，是临江市较早建成的综合性家庭游乐园。</p>
        <h2 class="section-title">基本情况</h2>
        <table class="data-table">
          <tbody>
            <tr><th style="width:24%">名称</th><td>临江星河乐园有限公司（对外简称“星河乐园”）</td></tr>
            <tr><th>历史地址</th><td>临江市滨江大道 118 号</td></tr>
            <tr><th>营业时间</th><td>1999 年 5 月 1 日至 2018 年 10 月 28 日</td></tr>
            <tr><th>主要客群</th><td>亲子家庭、学校团体、社区活动与外地旅游团队</td></tr>
            <tr><th>园区分区</th><td>入口广场、银河广场、月湾区、儿童活动区、巡游大道、家庭服务区</td></tr>
          </tbody>
        </table>
        <h2 class="section-title">服务理念</h2>
        <p>乐园长期以“安全、整洁、亲切、有序”为服务目标。早期项目以机械游乐设备为主，2006 年以后逐步增加儿童阅读、家庭摄影、广播体验和暑期活动。园区在高峰期采用颜色腕带区分团体、年龄段与集合时段，以便工作人员进行引导。</p>
        <p>2013 年至 2017 年，乐园先后更新摩天轮电控系统、月湾小火车轨道、广播主机和游客服务中心。2018 年闭园公告称，停止营业系设施老化及滨江片区规划调整所致。</p>
        <h2 class="section-title">历史荣誉</h2>
        <ul class="plain-list">
          <li>2004 年临江市旅游接待先进单位</li>
          <li>2009 年亲子公共服务示范点</li>
          <li>2012 年全市文明游园宣传月优秀组织单位</li>
          <li>2015 年大型公共场所儿童安全协作单位</li>
        </ul>
      `
    },
    history: {
      title: "乐园大事记",
      breadcrumb: '当前位置：<a href="/ARGgame/galaxy-park-arg/galaxy-park-arg.html">首页</a> &gt; 乐园概况 &gt; 大事记',
      html: `
        <p>以下记录根据历年新闻稿、员工年册和闭园前网站页面整理。个别月份因原服务器资料缺失，只保留年份。</p>
        <div class="history-photo-strip" aria-label="历年园区照片">
          <figure><img src="../assets/images/photos/classic-carousel-2014.jpg" alt="园区旋转木马正面"><figcaption>2014 年儿童转马区</figcaption></figure>
          <figure><img src="../assets/images/photos/moon-bay-train-2017.jpg" alt="月湾小火车停靠在园区道路旁"><figcaption>2017 年小火车信号改造后</figcaption></figure>
          <figure><img src="../assets/images/photos/park-gate-2017.jpg" alt="乐园入口和远处摩天轮"><figcaption>闭园前一年的正门</figcaption></figure>
        </div>
        <table class="data-table">
          <thead><tr><th style="width:18%">时间</th><th>事项</th></tr></thead>
          <tbody>
            <tr><td>1997-08</td><td>星河乐园一期工程在临江东岸开工。</td></tr>
            <tr><td>1999-05</td><td>正式开园，银河摩天轮、月湾小火车和儿童城首批开放。</td></tr>
            <tr><td>2002-07</td><td>开设暑期儿童广播体验活动，星星广播站投入使用。</td></tr>
            <tr><td>2005-04</td><td>巡游大道改造完成，固定周末星光巡游节目。</td></tr>
            <tr><td>2007-06</td><td>家庭摄影馆和第二游客服务中心启用。</td></tr>
            <tr><td>2009-09</td><td>与临江市有关部门开展儿童公共环境安全宣传合作。</td></tr>
            <tr><td>2011-05</td><td>第六休息区完成遮阳及母婴室改造。</td></tr>
            <tr><td>2013-03</td><td>园区导视与广播设备升级，试行颜色腕带分组服务。</td></tr>
            <tr><td>2014-07</td><td>暑期家庭回访服务扩大至周末场次；当年活动汇总存在两个版本。</td></tr>
            <tr><td>2016-11</td><td>新一批纪念品入库，银色星形纽扣首次列入公开盘点表。</td></tr>
            <tr><td>2017-12</td><td>完成摩天轮控制柜、月湾小火车信号系统及主广播室更新。</td></tr>
            <tr><td>2018-02</td><td>园区发布季节工和儿童活动辅导员招聘信息。</td></tr>
            <tr><td>2018-09</td><td>发布永久闭园公告。</td></tr>
            <tr><td>2018-10-28</td><td>最后一个营业日结束，大部分设施按正常闭园流程断电封存。</td></tr>
            <tr><td>2019-03</td><td>旧网站资料目录完成一次离线整理，补录部分失效链接说明。</td></tr>
          </tbody>
        </table>
        <div class="info-box"><strong>资料说明：</strong>2008 年以前的新闻图片多来自冲印照片扫描件；2014 年部分活动名称在纸质年册与服务器目录中并不一致。</div>
      `
    },
    attractions: {
      title: "游乐项目",
      breadcrumb: '当前位置：<a href="/ARGgame/galaxy-park-arg/galaxy-park-arg.html">首页</a> &gt; 游乐项目',
      html: `
        <p class="lead">本页保留闭园前的设备介绍。所有设施均已停止运营，以下身高限制及开放时间仅为历史资料。</p>
        <section class="record-card"><img class="attraction-photo" src="../assets/images/photos/galaxy-wheel-2016.jpg" alt="银河摩天轮和游乐园广场"><h2 class="sub-title">银河摩天轮</h2><p>园区地标，高约 68 米，共 36 个座舱。1.2 米以下儿童须由成人陪同。晴天运行一周约 18 分钟，遇大风自动停止售票。</p><p class="photo-caption">位置：银河广场北侧　照片摄于 2016 年</p><div style="clear:both"></div></section>
        <section class="record-card"><img class="attraction-photo" src="../assets/images/photos/moon-bay-train-2017.jpg" alt="月湾小火车停靠在园区道路旁"><h2 class="sub-title">月湾小火车</h2><p>环绕月湾区运行，全程约 16 分钟，设中心站、花圃站和儿童城站。暑期客流较大时增开短线班次。</p><p class="photo-caption">位置：月湾区　照片摄于 2017 年</p><div style="clear:both"></div></section>
        <section class="record-card"><img class="attraction-photo" src="../assets/images/photos/children-rides-2015.jpg" alt="儿童游乐区内停放的碰碰车"><h2 class="sub-title">银河儿童城</h2><p>设软体攀爬、迷你街道、儿童碰碰车和室内手工作坊，主要面向 4 至 12 岁儿童。</p><p class="photo-caption">位置：儿童活动区　照片摄于 2015 年</p><div style="clear:both"></div></section>
        <section class="record-card"><img class="attraction-photo" src="../assets/images/photos/weekend-rides-2015.jpg" alt="周末开放的旋转飞椅设备"><h2 class="sub-title">周末游乐项目</h2><p>常规星光巡游于周末 15:30 由儿童城门口出发，经银河广场到喷泉舞台。巡游前后，广场区域的旋转项目分批开放。</p><p class="photo-caption">雨天及设备检修时取消</p><div style="clear:both"></div></section>
        <section class="record-card"><img class="attraction-photo" src="../assets/images/photos/sky-rider-2016.jpg" alt="游客乘坐红黄色高空旋转项目"><h2 class="sub-title">云端飞旋</h2><p>暑期开放的高空旋转项目，运行前由工作人员逐座检查压肩和安全带。身高不足 1.4 米及不适宜高空旋转的游客不得乘坐。</p><p class="photo-caption">位置：银河广场西侧　照片摄于 2016 年</p><div style="clear:both"></div></section>
        <section class="record-card"><img class="attraction-photo" src="../assets/images/photos/carousel-morning-2015.jpg" alt="晨光中的传统旋转木马"><h2 class="sub-title">星梦转马</h2><p>适合亲子乘坐的传统转马，平日每整点开放。早场启动前，工作人员会检查踏板、围栏和照明。</p><p class="photo-caption">位置：儿童活动区入口　照片摄于 2015 年</p><div style="clear:both"></div></section>
        <section class="record-card"><h2 class="sub-title">星星广播站与家庭摄影馆</h2><p>儿童可在工作人员陪同下录制天气提示、文明游园短句和生日祝福。家庭摄影馆提供园区背景合影、纪念证件照和会员照片补印。</p></section>
        <h2 class="section-title">常规开放安排</h2>
        <table class="data-table">
          <thead><tr><th>项目</th><th style="width:24%">平日</th><th style="width:24%">周末及节假日</th></tr></thead>
          <tbody>
            <tr><td>室外大型设备</td><td>09:30—17:00</td><td>09:00—17:30</td></tr>
            <tr><td>儿童城</td><td>09:30—17:20</td><td>09:00—17:50</td></tr>
            <tr><td>广播体验</td><td>10:30、14:00</td><td>10:00、13:30、16:00</td></tr>
            <tr><td>常规星光巡游</td><td>无</td><td>15:30</td></tr>
          </tbody>
        </table>
      `
    },
    map: {
      title: "园区导览（2017 年版）",
      breadcrumb: '当前位置：<a href="/ARGgame/galaxy-park-arg/galaxy-park-arg.html">首页</a> &gt; 园区导览',
      html: `
        <p>本版导览于 2017 年 4 月启用，适用于闭园前最后两个游园季。东侧停车场扩建后，原家庭服务区的部分房间改作仓储与员工培训使用。</p>
        <figure class="park-map-sheet">
          <a href="../assets/images/maps/park-map-2017.svg" target="_blank" rel="noopener">
            <img src="../assets/images/maps/park-map-2017.svg" alt="2017 年星河乐园园区导览图，含摩天轮、月湾小火车、儿童游艺区、家庭摄影馆、停车场 B 区和家庭服务后区">
          </a>
          <figcaption>星河乐园园区导览（2017 年 4 月印制）　<a href="../assets/images/maps/park-map-2017.svg" target="_blank" rel="noopener">查看完整尺寸</a></figcaption>
        </figure>
        <h2 class="section-title">服务设施</h2>
        <table class="data-table">
          <thead><tr><th>设施</th><th>位置</th><th>说明</th></tr></thead>
          <tbody>
            <tr><td>游客服务中心</td><td>银河广场南侧</td><td>咨询、失物招领、婴儿车租借</td></tr>
            <tr><td>医务点</td><td>第六休息区西侧</td><td>基础外伤处理及临时休息</td></tr>
            <tr><td>母婴室</td><td>儿童城、湖畔餐厅</td><td>设热水和换洗台</td></tr>
            <tr><td>团队集合点</td><td>东侧入口</td><td>颜色标牌与腕带分组集合</td></tr>
          </tbody>
        </table>
        <p class="small-note">本页只提供闭园前最后一版公开导览；更早的印刷版本没有列入普通导航。</p>
      `
    },
    "map-old": {
      title: "园区导览（2009 年旧版）",
      breadcrumb: '当前位置：<a href="/ARGgame/galaxy-park-arg/galaxy-park-arg.html">首页</a> &gt; <a href="/ARGgame/galaxy-park-arg/park/map.html">园区导览</a> &gt; 旧版地图',
      html: `
        <div class="notice-box">此页面由旧站备份恢复。原图印刷日期为 2009 年 6 月，部分设施名称与后期地图不同。</div>
        <figure class="park-map-sheet park-map-sheet-old">
          <a href="../assets/images/maps/park-map-2009.svg" target="_blank" rel="noopener">
            <img src="../assets/images/maps/park-map-2009.svg" alt="2009 年星河乐园游客导览图，图例包含独立的 01 至 07 七个区域">
          </a>
          <figcaption>星河乐园游客导览图（2009 年 6 月印制）　<a href="../assets/images/maps/park-map-2009.svg" target="_blank" rel="noopener">查看完整尺寸</a></figcaption>
        </figure>
        <h2 class="section-title">历史图例检索</h2>
        <p>本页保留旧版区域名称检索功能，可用于调取相关历史说明。现行导览图见<a href="/ARGgame/galaxy-park-arg/park/map.html">2017 年版园区地图</a>。</p>
        <form class="map-compare-form" data-map-difference>
          <div class="form-row"><label for="missing-area">区域名称</label><input id="missing-area" name="areaName" autocomplete="off" required></div>
          <button type="submit">检索图例</button>
          <p id="map-difference-status" class="status-line" aria-live="polite"></p>
        </form>
        <section class="map-recovery-note" data-map-reveal hidden>
          <h2 class="section-title">图例记录：07</h2>
          <p>2009 年地图将该处列为独立区域；2017 年地图把同一方位标入停车场 B 区和家庭服务后区。网站目录没有找到面向游客发布的撤区或更名公告。</p>
          <table class="data-table">
            <thead><tr><th>记录来源</th><th>使用名称</th><th>状态</th></tr></thead>
            <tbody>
              <tr><td>2009 游客地图</td><td>星河家庭休息中心 / 第七区</td><td>公开图例 07</td></tr>
              <tr><td>2012 员工通讯</td><td>七区值班</td><td>仍在使用</td></tr>
              <tr><td>2017 游客地图</td><td>停车场 B 区 / 家庭服务后区</td><td>独立图例消失</td></tr>
            </tbody>
          </table>
        <div class="info-box"><strong>历史编号：</strong>管理员备份使用 <code>GP-B07</code>。外部合作项目登记见<a href="/ARGgame/galaxy-park-arg/government/projects.html">临江市重点项目目录</a>。</div>
        </section>
      `
    },
    news: {
      title: "新闻公告",
      breadcrumb: '当前位置：<a href="/ARGgame/galaxy-park-arg/galaxy-park-arg.html">首页</a> &gt; 新闻公告',
      html: `
        <article id="closure"><h2 class="section-title">星河乐园永久闭园公告</h2><p class="meta-line">发布时间：2018-09-21　来源：园长办公室</p><p>因设施老化及临江市滨江片区规划调整，星河乐园将于 2018 年 10 月 28 日营业结束后永久关闭。已售年卡可按剩余有效期办理退费，闭园前各项游乐服务照常进行。感谢广大游客十九年来的陪伴与支持。</p></article>
        <article id="lost-found"><h2 class="section-title">闭园期间失物领取办法</h2><p class="meta-line">发布时间：2018-09-19　来源：游客服务部</p><p>2018 年 10 月 28 日前登记的失物，统一保管至 2018 年 12 月 31 日。领取时需说明物品特征和遗失日期。普通衣帽、塑料水杯等逾期物品将按原规定处理。</p></article>
        <article id="annual-check"><h2 class="section-title">银河摩天轮年度安全检验完成</h2><p class="meta-line">发布时间：2018-08-30　来源：设备部</p><p>银河摩天轮已完成制动系统、备用电源、座舱门锁和风速监测装置年度检验，自 8 月 31 日起恢复开放。检验期间给游客带来的不便，敬请谅解。</p></article>
        <article id="parking"><h2 class="section-title">东侧停车场排水维修通知</h2><p class="meta-line">发布时间：2018-08-17　来源：后勤保障部</p><p>受连续降雨影响，东侧停车场 B 区将于 8 月 20 日至 23 日进行排水沟维修。旅游团队请从滨江大道西入口下客，家庭游客建议优先使用公共交通。</p></article>
        <article id="hours"><h2 class="section-title">暑期延长开放时间结束</h2><p class="meta-line">发布时间：2018-08-13　来源：运营部</p><p>自 8 月 20 日起，园区恢复 9:30—17:30 常规营业时间，售票窗口于 16:30 停止售票。周末常规巡游时间仍为 15:30。</p></article>
        <h2 class="section-title">往年简讯</h2>
        <ul class="date-list">
          <li><span>湖畔餐厅夏季菜单调整，新增儿童清淡套餐</span><time>2017-06-09</time></li>
          <li><span>关于雷雨天气暂停室外设备的说明</span><time>2017-05-22</time></li>
          <li><span>园区文明游览志愿宣传周开始</span><time>2016-09-14</time></li>
          <li><span>月湾小火车信号设备检修完成</span><time>2016-04-28</time></li>
          <li><span>儿童城储物柜遗留物品集中认领</span><time>2015-11-03</time></li>
          <li><a href="/ARGgame/galaxy-park-arg/park/program-2014-07-19.html">周六常规巡游因大风取消</a><time>2014-07-19</time></li>
          <li><span>夏令营第二期报名名额已满</span><time>2014-07-11</time></li>
        </ul>
      `
    },
    staff: {
      title: "员工风采",
      breadcrumb: '当前位置：<a href="/ARGgame/galaxy-park-arg/galaxy-park-arg.html">首页</a> &gt; 员工风采',
      html: `
        <p>星河乐园闭园前共有设备、运营、游客服务、园林、保洁和行政等岗位。本栏目保留部分员工通讯文字与公开活动记录。</p>
        <figure class="staff-team-photo">
          <a href="../assets/images/photos/equipment-team-2017.webp" target="_blank" rel="noopener"><img src="../assets/images/photos/equipment-team-2017.webp" alt="设备部员工在维修车间外合影，背景可见摩天轮"></a>
          <figcaption>设备与广播系统班组年度合影（2017 年 11 月）　<a href="../assets/images/photos/equipment-team-2017.webp" target="_blank" rel="noopener">查看原图</a></figcaption>
        </figure>
        <div class="two-column-list">
          <article class="record-card"><h3>林思遥｜游客服务部</h3><p>2008 年入园，负责团体接待、儿童活动登记和家庭服务区协调。她在 2012 年内部评选中获得“耐心服务岗”称号。</p><p class="staff-id">员工通讯编号：E-0214</p></article>
          <article class="record-card"><h3>陈泊｜设备与广播系统</h3><p>负责主广播室、巡游音响、儿童广播体验设备及网站文件服务器。员工通讯曾记录他用一周时间排查雨季线路噪声。</p><p class="staff-id">员工通讯编号：E-0317</p></article>
          <article class="record-card"><h3>王师傅｜月湾小火车班组</h3><p>参与小火车从开园调试到 2017 年信号改造。每天首班车前均完成空载试运行。</p></article>
          <article class="record-card"><h3>蒋芸｜园林维护班组</h3><p>负责月湾花圃与北门绿化。她提出的低矮花坛方案改善了儿童游览视线。</p></article>
        </div>
        <article id="sports"><h2 class="section-title">第十五届职工趣味运动会</h2><p class="meta-line">2018-05-11</p><p>5 月 10 日下午，园区在后勤广场举行职工趣味运动会，设置接力运球、定点套圈、设备知识问答等项目。游客服务部获得团体第二名。活动结束后，各岗位按晚场值班表恢复工作。</p></article>
        <h2 class="section-title">服务岗位守则摘录</h2>
        <ul class="plain-list">
          <li>遇到走失儿童，先安抚情绪，再按广播流程核对监护人信息。</li>
          <li>团队集合时使用清楚、简短、重复一致的指引，不催促儿童单独行动。</li>
          <li>颜色腕带只用于识别团队与活动时段，不作为票种凭证。</li>
          <li>游客对活动记忆或照片内容提出疑问时，应转交游客服务主管登记。</li>
        </ul>
      `
    },
    "staff-account-recovery": {
      title: "员工账户历史查询",
      breadcrumb: '当前位置：<a href="/ARGgame/galaxy-park-arg/galaxy-park-arg.html">首页</a> &gt; <a href="/ARGgame/galaxy-park-arg/park/staff-login.html">员工信息服务</a> &gt; 账户查询',
      layout: "staff-recovery",
      html: `
        <div class="staff-recovery-intro">
          <h2>闭园维护账户核验</h2>
          <p>该查询页由 2018 年闭园交接备份恢复，仅用于核对保留下来的网站维护账户。人事档案、工资和普通员工账户不在查询范围内。</p>
          <p>旧系统以员工公开通讯资料、本人留存的四项答题卡和闭园交接记录交叉核验。答题错误不会锁定账户。</p>
        </div>

        <form class="staff-recovery-form" data-staff-account-recovery>
          <fieldset data-recovery-section="identity">
            <legend>一、查询对象</legend>
            <div class="staff-recovery-fields">
              <div class="form-row"><label for="staff-recovery-name">员工姓名</label><input id="staff-recovery-name" name="employeeName" autocomplete="off" required></div>
              <div class="form-row"><label for="staff-recovery-id">员工通讯编号</label><input id="staff-recovery-id" name="employeeCode" autocomplete="off" placeholder="可省略 E-" required></div>
            </div>
            <p class="field-check" data-recovery-check="identity"></p>
          </fieldset>

          <fieldset data-recovery-section="poem">
            <legend>二、答题卡 01 / 七格诗句</legend>
            <div class="poem-security-card" aria-label="七格诗句题卡">
              <div class="poem-slot-row" aria-hidden="true">
                <span class="poem-slot poem-slot--masked"><i></i><b>①</b></span>
                <span class="poem-slot poem-slot--green">②</span>
                <span class="poem-slot">③</span>
                <span class="poem-slot">④</span>
                <span class="poem-slot">⑤</span>
                <span class="poem-slot poem-slot--yellow">⑥</span>
                <span class="poem-slot">⑦</span>
              </div>
              <div class="poem-relation-line" aria-hidden="true"><i></i><strong>② 与 ⑥ 互为反义词</strong><i></i></div>
            </div>
            <div class="form-row"><label for="staff-poem-answer">填写完整七字诗句</label><input id="staff-poem-answer" name="poemAnswer" maxlength="16" autocomplete="off" required></div>
            <p class="field-check" data-recovery-check="poem"></p>
          </fieldset>

          <fieldset data-recovery-section="bridges">
            <legend>三、答题卡 02 / 三列填字</legend>
            <p>观察三列，分别填写问号处的字。</p>
            <div class="word-pattern-row">
              <label><span>一</span><input name="bridgeOne" maxlength="1" aria-label="一和夫之间问号处的字" placeholder="?" required><span>夫</span></label>
              <label><span>星</span><input name="bridgeTwo" maxlength="1" aria-label="星和胜之间问号处的字" placeholder="?" required><span>胜</span></label>
              <label><span>池</span><input name="bridgeThree" maxlength="1" aria-label="池和蛙之间问号处的字" placeholder="?" required><span>蛙</span></label>
            </div>
            <p class="field-check" data-recovery-check="bridges"></p>
          </fieldset>

          <fieldset data-recovery-section="dimensional">
            <legend>四、答题卡 03 / 三人中谁最“立体”</legend>
            <div class="recovery-radio-row">
              <label><input type="radio" name="dimensionalAnswer" value="刘备" required>刘备</label>
              <label><input type="radio" name="dimensionalAnswer" value="关羽">关羽</label>
              <label><input type="radio" name="dimensionalAnswer" value="张飞">张飞</label>
            </div>
            <p class="field-check" data-recovery-check="dimensional"></p>
          </fieldset>

          <fieldset data-recovery-section="weekday">
            <legend>五、答题卡 04 / 值班日期</legend>
            <div class="weekday-logic-card">
              <p>甲：明天是星期五。</p>
              <p>乙：昨天是星期四。</p>
              <p>丙：你们俩说的都不对。</p>
              <p>丁：今天不是星期六。</p>
              <strong>四人中只有一人说对。今天是星期几？</strong>
            </div>
            <div class="weekday-choice-row">
              <label><input type="radio" name="weekdayAnswer" value="星期一" required>一</label>
              <label><input type="radio" name="weekdayAnswer" value="星期二">二</label>
              <label><input type="radio" name="weekdayAnswer" value="星期三">三</label>
              <label><input type="radio" name="weekdayAnswer" value="星期四">四</label>
              <label><input type="radio" name="weekdayAnswer" value="星期五">五</label>
              <label><input type="radio" name="weekdayAnswer" value="星期六">六</label>
              <label><input type="radio" name="weekdayAnswer" value="星期日">日</label>
            </div>
            <p class="field-check" data-recovery-check="weekday"></p>
          </fieldset>

          <fieldset data-recovery-section="handover">
            <legend>六、闭园交接记录</legend>
            <p>维护账户只在闭园交接期内有效。原纸质核验栏采用闭园通知中“历史资料与联系方式”一节的日期。</p>
            <p><a class="file-link" href="../assets/files/park/GP-CLOSE-2018-closure-notice.pdf" target="_blank" rel="noopener">查看闭园通知及退费说明（PDF）</a></p>
            <div class="form-row"><label for="staff-service-stop">原游客服务热线停止使用日期</label><input id="staff-service-stop" name="serviceStopDate" placeholder="YYYY-MM-DD" autocomplete="off" required></div>
            <p class="field-check" data-recovery-check="handover"></p>
          </fieldset>

          <button type="submit">核验留存答题卡</button>
          <p id="staff-recovery-status" class="status-line" aria-live="polite"></p>
        </form>

        <section class="staff-account-result" data-staff-account-result hidden>
          <h2>维护账户记录</h2>
          <dl>
            <div><dt>保留账户</dt><dd><code>cb0317</code></dd></div>
            <div><dt>权限</dt><dd>网站文件维护 / 管理员</dd></div>
            <div><dt>交接状态</dt><dd>2018-10-29 已统一重置临时密码</dd></div>
          </dl>
          <p>临时密码采用最后营业日的八位日期，格式为 YYYYMMDD。</p>
          <a class="old-button-link" href="/ARGgame/galaxy-park-arg/park/staff-login.html">返回员工系统登录</a>
        </section>
      `
    },
    "staff-login": {
      title: "员工信息服务",
      breadcrumb: '当前位置：<a href="/ARGgame/galaxy-park-arg/galaxy-park-arg.html">首页</a> &gt; 员工信息服务',
      layout: "staff-portal",
      html: `
        <section class="portal-login-view" data-portal-view="login">
          <div class="portal-heading">
            <h2>星河乐园员工信息服务系统</h2>
            <p>旧系统备份，只能查看，不能修改</p>
          </div>
          <div class="portal-columns">
            <form class="portal-login-form" data-staff-portal>
              <h3>用户登录</h3>
              <div class="form-row"><label for="portal-user">用户名</label><input id="portal-user" name="account" type="text" autocomplete="username" required></div>
              <div class="form-row"><label for="portal-pass">密码</label><input id="portal-pass" name="passcode" type="password" autocomplete="current-password" required></div>
              <button type="submit">登录系统</button>
              <p id="portal-status" class="status-line" aria-live="polite"></p>
            </form>
            <aside class="portal-help">
              <h3>历史账户说明</h3>
              <p>本系统没有访客账户，也不接受会员账户登录。普通员工账户已经随人事系统注销。</p>
              <p>闭园交接时，仅网站备份责任人的维护权限被保留。</p>
              <p><a href="/ARGgame/galaxy-park-arg/park/staff-account-recovery.html">查询闭园维护账户</a></p>
            </aside>
          </div>
          <div class="portal-notice">
            <strong>闭园后的账户说明（2018-10-29）</strong>
            <p>普通人事账户已注销；留存维护账户需通过原答题卡核验后查询。</p>
          </div>
        </section>

        <section class="portal-session portal-admin" data-portal-view="administrator" hidden>
          <div class="portal-session-bar portal-admin-bar"><strong>登录身份：设备与广播系统 / 网站文件维护（管理员）</strong><button type="button" data-portal-exit>退出登录</button></div>
          <div class="admin-alert"><strong>系统提示：</strong>找到 4 份没有显示在普通网站里的备份，其中 2 份在乐园闭园后仍被修改过。</div>
          <h2 class="section-title">网站备份文件</h2>
          <table class="data-table admin-file-table">
            <thead><tr><th style="width:26%">文件编号</th><th>内容</th><th style="width:21%">状态</th></tr></thead>
            <tbody>
              <tr><td>GP-WEB-181028</td><td>闭园当天的网站备份</td><td>普通网站已显示</td></tr>
              <tr><td>GP-MAP-0906</td><td><a href="/ARGgame/galaxy-park-arg/park/map-old.html">2009 年游客地图原图</a></td><td>普通菜单已撤下</td></tr>
              <tr><td>GP-ALB-ECHO</td><td>家庭回访纪念照（2014—2016）</td><td>2016-11 搬走</td></tr>
              <tr><td>LJ-GP-07</td><td><a href="/ARGgame/galaxy-park-arg/government/projects.html">外部合作项目记录</a></td><td>2019-03-22 修改</td></tr>
            </tbody>
          </table>
          <h2 class="section-title">普通仓库收货记录</h2>
          <table class="data-table admin-file-table">
            <thead><tr><th style="width:19%">采购编号</th><th>收到的东西</th><th style="width:13%">数量</th><th style="width:15%">送货单编号</th><th style="width:24%">送到哪里</th></tr></thead>
            <tbody>
              <tr><td>CG-2016-022</td><td>蓝色活动腕带</td><td>1,200</td><td>022-1</td><td>西侧普通仓库</td></tr>
              <tr><td>CG-2016-022</td><td>红色活动腕带</td><td>1,200</td><td>022-2</td><td>西侧普通仓库</td></tr>
              <tr class="stock-ledger-gap"><td>CG-2016-022</td><td>品名栏未抄入</td><td>600</td><td>022-3</td><td>东侧家庭服务门；项目组签收</td></tr>
            </tbody>
          </table>
          <div class="maintenance-paper">
            <p><strong>仓库便笺 / 2016-06-18</strong></p>
            <p>这一批一共买了 3,000 件，普通仓库只收到 2,400 件。送货单 022-3 没有普通仓库的收货章，只写着“东侧家庭服务门，由项目组代收”。当天公开活动的领用单里，也只有蓝色和红色腕带。</p>
            <p>少掉的 600 件没有进入游客用品发放记录。要知道是什么，只能拿送货单编号去采购单位查询。</p>
          </div>
          <h2 class="section-title">没有完成的网站整理</h2>
          <div class="maintenance-paper">
            <p><strong>2019-03-22　操作标识：XS-DIGI</strong></p>
            <p>普通网站只保留 2017 年地图。2009 年地图里的独立第七区，不再放回网站菜单。LJ-GP-07 的公开页面仍在合作单位的网站上。</p>
            <p>“星光回响”相册与当天节目单对不上，所以没有放回“精彩图片”。原始照片文件仍被标成“家庭回访合成输出”。</p>
          </div>
          <h2 class="section-title">广播服务器记录</h2>
          <pre class="portal-log">2014-07-19 16:17:00  PLAYLIST/SATURDAY/PARADE_STD   NOT FOUND
2014-07-19 16:17:04  CACHE/GP_B07/ECHO_SESSION_03  PLAY
2014-07-19 16:21:12  CACHE/GP_B07/ECHO_SESSION_03  PLAY
2014-07-19 16:25:20  CACHE/GP_B07/ECHO_SESSION_03  PLAY
2018-10-29 08:04:51  WEB/MAP_2009                  REMOVE_INDEX
2019-03-22 11:26:07  LJ-GP-07/PUBLIC               SYNC_METADATA</pre>
          <p class="admin-note">服务器里出现过的音频，不一定在公开节目中播放。设备部没有找到名为“星河永不熄灭”的正式巡游音乐。</p>
          <h2 class="section-title">林思遥留下的一条破损备注</h2>
          <div class="legacy-memo-record">
            <p><strong>编号：</strong>LSY-MEMO-17　<strong>记录人：</strong>林思遥　<strong>状态：</strong>正文没有保存完整</p>
            <p>正文预览已经损坏。服务器维护导出仍保留附件编号和恢复位置。</p>
            <p><a class="file-link" href="../assets/files/park/GP-WEB-181028-server-maintenance.txt" target="_blank" rel="noopener">打开：网站文件服务器维护摘录（TXT）</a></p>
            <div class="legacy-file-shelf" aria-label="服务器恢复附件">
              <span>ARC-DOC-004　结果报告修订稿（不属于本备注）</span>
              <a href="../assets/files/archive/ARC-DOC-009-lin-siyao-memo.docx" download>正文恢复附件（DOCX）</a>
              <span>ARC-DOC-011　校验失败</span>
            </div>
            <form class="memo-index-form" data-memo-decode>
              <div class="form-row"><label for="memo-attachment-code">附件索引号</label><input id="memo-attachment-code" name="attachmentCode" type="text" autocomplete="off" required></div>
              <div class="form-row"><label for="memo-summary">备注检索词</label><input id="memo-summary" name="memoPhrase" type="text" autocomplete="off" required></div>
              <button type="submit">检索旧备注</button>
              <p id="memo-decode-status" class="status-line" aria-live="polite"></p>
            </form>
            <div class="memo-index-result" data-memo-reveal hidden>
              <p class="meta-line">LSY-MEMO-17 / 找到了原备注</p>
              <blockquote>先核对节目单，再相信照片</blockquote>
              <p>卷尾只保留关联卷宗 <strong>LJ-GP-07</strong>。档案题名与主卷登记号已并入临江市 2018 年历史项目转交清单。</p>
              <p><a href="/ARGgame/galaxy-park-arg/government/downloads.html">前往政务公开附件目录</a></p>
            </div>
          </div>
        </section>
      `
    },
    messages: {
      title: "游客留言",
      breadcrumb: '当前位置：<a href="/ARGgame/galaxy-park-arg/galaxy-park-arg.html">首页</a> &gt; 游客留言',
      html: `
        <div class="notice-box">留言功能已经关闭。下面是旧网站保留下来的公开留言。电话号码、订单号和孩子姓名已经隐去。</div>
        <div class="record-card"><h3>游客 734 <span class="meta-line">2018-10-14</span></h3><p>整理孩子小时候的外套，在内衬里找到一枚银色星星纽扣。我确定这不是我们买的，照片里外套上也没有。孩子看了一眼，说“那天每个人都有，回家前要藏好”。他已经十二岁了，说完又说自己不记得去过。</p><p><strong>园方回复：</strong>园区纪念品种类较多，早期活动赠品没有完整清单。请勿让儿童继续使用松动的小配件。</p></div>
        <div class="record-card"><h3>禾禾 <span class="meta-line">2017-11-16</span></h3><p>小时候参加过夏令营，一直记得四点多看过一次特别巡游，天上落了很多蓝色纸星。最近翻节目单没找到。奇怪的是，和我同组的两个人都记得主持人说过一句完全一样的话：“先想清楚，再告诉家长你看见了什么。”</p><p><strong>园方回复：</strong>早期临时活动可能没有完整录入。儿童在集体活动后出现相似描述，通常与带队讲解有关。</p></div>
        <div class="record-card"><h3>小满爸爸 <span class="meta-line">2017-08-27</span></h3><p>孩子从家庭服务区回来后，连续画了三天同一幅图：先是一个黑房间，然后是喇叭，最后是很多家长在笑。他说老师让大家“按顺序画，不记得的地方可以照着照片想”。我们当天只参加了公开亲子手工，活动单上没有看影片。</p><p><strong>园方回复：</strong>儿童城内有日常绘画和安全广播体验，活动内容会由现场老师调整。</p></div>
        <div class="record-card"><h3>临江北站附近 <span class="meta-line">2017-03-09</span></h3><p>上周在车站听到寻人广播，孩子突然站到蓝线后面，把手背到身后。问他为什么，他说“听到这个女声就要这样站”，还说在乐园里练过很多次。我们只去过摩天轮和小火车，从没报过安全体验课。</p><p><strong>园方回复：</strong>公共场所广播用语较接近，儿童可能把车站提示与园内安全广播混在一起。</p></div>
        <div class="record-card"><h3>匿名家长 <span class="meta-line">2016-07-22</span></h3><p>相册发来两张几乎一样的合影。一张孩子们都在看镜头，另一张所有孩子都在看画面右边，只有家长还在笑。客服说第二张是误传的测试照片。可我女儿坚持第一张才是后来补拍的，还问我为什么“大家都忘了第一遍”。</p><p><strong>园方回复：</strong>批量照片输出时可能混入连拍测试图，已通知摄影服务单位重新核对。</p></div>
        <div class="record-card"><h3>游客 1182 <span class="meta-line">2015-09-05</span></h3><p>东门停车场后面那排窗户到底是什么地方？门一直锁着，里面却有儿童广播。儿子说他上次进去过，还准确说出了三间房的位置。我们问服务台，工作人员说那里从未对游客开放。</p><p><strong>园方回复：</strong>东侧为员工和家庭服务后区，不属于游客参观范围。儿童可能记混了儿童城室内房间。</p></div>
        <div class="record-card"><h3>三年二班家长 <span class="meta-line">2014-10-11</span></h3><p>班里六个孩子在不同时间写“难忘的一天”，都写到蓝色星星、四点十七分和同一句广播。老师确认他们没有坐在一起讨论。学校想找当时活动方案，园方只发来一份没有这段内容的普通节目单。</p><p><strong>园方回复：</strong>团体游客容易在集体回忆中互相补充细节，建议以正式节目单为准。</p></div>
        <div class="record-card"><h3>月湾小乘客 <span class="meta-line">2014-05-02</span></h3><p>小火车很好玩，就是到花圃站前广播突然变成一个女人数数。其他大人好像没注意，车上几个孩子却一起闭上眼睛。到站后问工作人员，她说广播一直正常。</p><p><strong>园方回复：</strong>当日设备记录未发现异常，可能是相邻活动区扩音器串音。</p></div>
        <h2 class="section-title">搜索旧留言</h2>
        <form class="form-panel" data-local-message="message-search-status" data-message="只保存了公开昵称和日期，没有找到更多完全相同的留言。">
          <div class="form-row"><label for="message-keyword">昵称或关键词</label><input id="message-keyword" name="keyword" type="search"></div>
          <button type="submit">查询旧留言</button>
          <p id="message-search-status" class="status-line" aria-live="polite"></p>
        </form>
      `
    },
    "summer-camp": {
      title: "银河成长夏令营",
      breadcrumb: '当前位置：<a href="/ARGgame/galaxy-park-arg/galaxy-park-arg.html">首页</a> &gt; 夏令营',
      html: `
        <p class="lead">银河成长夏令营于 2006 年至 2017 年暑期开设，面向 7 至 12 岁儿童。活动以公共场所安全、团队协作、园区广播体验和简单设备常识为主要内容。</p>
        <div class="camp-photo-row">
          <figure><img src="../assets/images/photos/children-city-2017.jpg" alt="参加活动的儿童与家长沿园区步道前行"><figcaption>上午分组活动前往儿童城</figcaption></figure>
          <figure><a href="../assets/images/photos/summer-camp-parade-2014.webp" target="_blank" rel="noopener"><img src="../assets/images/photos/summer-camp-parade-2014.webp" alt="儿童佩戴蓝色纸星参加园区下午活动"></a><figcaption>2014 年第二期下午活动留影　<a href="../assets/images/photos/summer-camp-parade-2014.webp" target="_blank" rel="noopener">查看大图</a></figcaption></figure>
        </div>
        <h2 class="section-title">2017 年活动安排</h2>
        <table class="data-table">
          <thead><tr><th style="width:22%">时间</th><th>活动</th><th style="width:28%">地点</th></tr></thead>
          <tbody>
            <tr><td>09:00</td><td>签到、颜色腕带分组</td><td>东侧团体入口</td></tr>
            <tr><td>09:30</td><td>寻找公共标识小游戏</td><td>银河广场</td></tr>
            <tr><td>10:40</td><td>儿童广播体验</td><td>星星广播站</td></tr>
            <tr><td>13:30</td><td>家庭照片与绘画活动</td><td>家庭服务区</td></tr>
            <tr><td>15:00</td><td>走失情景演练</td><td>第六休息区</td></tr>
            <tr><td>16:10</td><td>纪念品领取、家长问卷</td><td>游客服务中心</td></tr>
          </tbody>
        </table>
        <h2 class="section-title">家长须知</h2>
        <ul class="plain-list">
          <li>活动不安排儿童离开园区，午餐由家长自行选择或统一预订。</li>
          <li>报名时需提供紧急联系人；闭园后的历史页面不再接收任何信息。</li>
          <li>活动照片可能用于园内展示和纪念照制作，旧版授权书标题为《儿童活动及安全服务授权书》。</li>
          <li>2014 年后增加游园后回访，主要询问公共标识理解、广播内容记忆和团队集合体验。</li>
        </ul>
        <section class="camp-exercise-archive">
          <div>
            <p class="meta-line">历史活动材料 / SC-140719-B</p>
            <h2>窗格观察练习（第二组）</h2>
            <p>该页曾用于 2014 年第二期下午分组活动。扫描件背面缺失，带队员未填写回收结果。</p>
          </div>
          <figure>
            <a href="../assets/images/puzzles/camp-window-puzzle-crop.webp" target="_blank" rel="noopener">
              <img src="../assets/images/puzzles/camp-window-puzzle-crop.webp" alt="四幅方形窗花图案按二乘二排列，其中各藏一个汉字">
            </a>
            <figcaption><a href="../assets/images/puzzles/camp-window-puzzle-crop.webp" target="_blank" rel="noopener">查看窗花局部</a></figcaption>
          </figure>
        </section>
        <div class="info-box"><strong>历史资料注：</strong>部分家庭把“银河成长夏令营”简称为“星河成长计划”。两个称呼在早期报名回执中曾混用。</div>
      `
    },
    tickets: {
      title: "票务服务（历史票价）",
      breadcrumb: '当前位置：<a href="/ARGgame/galaxy-park-arg/galaxy-park-arg.html">首页</a> &gt; 票务服务',
      html: `
        <div class="notice-box">以下为 2018 年闭园前票价，仅供历史查阅。本站不售票，也不收集身份证件、手机号或付款信息。</div>
        <table class="data-table">
          <thead><tr><th>票种</th><th style="width:20%">挂牌价</th><th>适用范围</th></tr></thead>
          <tbody>
            <tr><td>成人通票</td><td>120 元</td><td>身高 1.5 米及以上游客</td></tr>
            <tr><td>儿童通票</td><td>80 元</td><td>身高 1.2 米至 1.5 米儿童</td></tr>
            <tr><td>幼儿入园票</td><td>20 元</td><td>身高不足 1.2 米，设备乘坐另按规定</td></tr>
            <tr><td>老年优惠票</td><td>60 元</td><td>65 周岁及以上，须有成年家属陪同</td></tr>
            <tr><td>家庭套票</td><td>268 元</td><td>两名成人及一名 1.5 米以下儿童</td></tr>
          </tbody>
        </table>
        <h2 class="section-title">设备身高要求摘录</h2>
        <table class="data-table">
          <thead><tr><th>设备</th><th>最低身高</th><th>陪同要求</th></tr></thead>
          <tbody>
            <tr><td>银河摩天轮</td><td>无单独最低限制</td><td>1.2 米以下须成人陪同</td></tr>
            <tr><td>月湾小火车</td><td>无单独最低限制</td><td>学龄前儿童须成人陪同</td></tr>
            <tr><td>儿童城攀爬区</td><td>0.9 米</td><td>1.1 米以下由家长在外围看护</td></tr>
          </tbody>
        </table>
        <p>持旧年卡、团体票或闭园退费凭证的游客，可前往<a href="/ARGgame/galaxy-park-arg/park/ticket-query.html">旧票查询说明</a>了解历史处理办法。</p>
      `
    },
    "ticket-query": {
      title: "旧票与年卡查询",
      breadcrumb: '当前位置：<a href="/ARGgame/galaxy-park-arg/galaxy-park-arg.html">首页</a> &gt; <a href="/ARGgame/galaxy-park-arg/park/tickets.html">票务服务</a> &gt; 旧票查询',
      html: `
        <p>2018 年闭园退费已经结束。原售票系统也已关闭，本页只能检查票号写法是否正确，不需要姓名或证件信息。</p>
        <form class="form-panel" data-local-message="ticket-status" data-message="号码格式有效。历史退费窗口已关闭，当前页面不含交易记录。">
          <div class="form-row"><label for="ticket-type">凭证类型</label><select id="ticket-type"><option>旧年卡编号</option><option>团体票批次</option><option>退费回执号</option></select></div>
          <div class="form-row"><label for="ticket-number">示例编号</label><input id="ticket-number" type="text" pattern="[A-Za-z0-9-]{6,20}" placeholder="例如 GP-2018-001"></div>
          <button type="submit">检查号码格式</button>
          <p id="ticket-status" class="status-line" aria-live="polite"></p>
        </form>
        <h2 class="section-title">历史处理办法</h2>
        <ul class="plain-list">
          <li>有效年卡按 2018 年 10 月 29 日以后剩余天数折算。</li>
          <li>未使用团体票由原购票单位统一办理。</li>
          <li>赠票、活动体验券和纪念券不折算现金。</li>
          <li>所有历史号码均已脱离原售票系统，本页面不会显示姓名或联系方式。</li>
        </ul>
      `
    },
    photos: {
      title: "精彩图片",
      breadcrumb: '当前位置：<a href="/ARGgame/galaxy-park-arg/galaxy-park-arg.html">首页</a> &gt; 精彩图片',
      html: `
        <p>这里保留了一部分园区公开照片。旧站上传尺寸较小，画面有压缩和偏色属于正常现象。</p>
        <div class="park-photo-grid">
          <figure><img src="../assets/images/photos/park-entrance-generated-2017.webp" alt="星河乐园正门、摩天轮和蓝白色观光小火车"><figcaption>2017 年“五一”正门迎宾</figcaption></figure>
          <figure><img src="../assets/images/photos/galaxy-wheel-2016.jpg" alt="银河摩天轮和广场"><figcaption>秋季晴天的银河摩天轮</figcaption></figure>
          <figure><img src="../assets/images/photos/moon-bay-train-2017.jpg" alt="蓝白色观光小火车"><figcaption>月湾小火车暑期班次</figcaption></figure>
          <figure><img src="../assets/images/photos/children-city-2017.jpg" alt="游客走向儿童活动区"><figcaption>花圃步道与儿童活动区</figcaption></figure>
          <figure><img src="../assets/images/photos/family-outing-2016.jpg" alt="家庭游客在游乐设施前停留"><figcaption>家庭游客周末游园</figcaption></figure>
          <figure><img src="../assets/images/photos/carousel-plaza-2014.jpg" alt="旋转木马旁的儿童小车"><figcaption>儿童转马区早场开放前</figcaption></figure>
          <figure><img src="../assets/images/photos/weekend-rides-2015.jpg" alt="旋转飞椅设备"><figcaption>周末旋转项目开放</figcaption></figure>
          <figure><img src="../assets/images/photos/children-rides-2015.jpg" alt="儿童碰碰车"><figcaption>儿童城碰碰车整理完毕</figcaption></figure>
          <figure><img src="../assets/images/photos/summer-ride-2016.jpg" alt="夏季开放的过山车"><figcaption>暑期设备开放日</figcaption></figure>
          <figure><img src="../assets/images/photos/family-carousel-2017.jpg" alt="游客在旋转木马旁合影"><figcaption>周末游客随手拍</figcaption></figure>
          <figure><img src="../assets/images/photos/sky-rider-2016.jpg" alt="游客乘坐高空旋转项目"><figcaption>云端飞旋暑期开放</figcaption></figure>
          <figure><img src="../assets/images/photos/classic-carousel-2014.jpg" alt="彩色传统旋转木马"><figcaption>星梦转马设备照片</figcaption></figure>
          <figure><img src="../assets/images/photos/carousel-morning-2015.jpg" alt="晨光中的传统旋转木马"><figcaption>开园前的儿童活动区</figcaption></figure>
        </div>
        <h2 class="section-title">按年份看照片</h2>
        <p><a href="/ARGgame/galaxy-park-arg/park/news.html">2018 年</a>　2017 年　2016 年　2015 年　2014 年　2013 年以前</p>
        <p class="small-note">家庭摄影馆的纪念照、游客上传的原图和没有公开的活动相册，不会显示在这里。</p>
        <section class="album-index-panel">
          <h2>旧相册时间检索</h2>
          <p>2016 年补寄资料合并后，同一照片单号下保留了 A、B 两次输出。检索需填写 B 批次的输出时间、批次编号和补录背景模板。</p>
          <p class="small-note">B 批次输出时间见家庭会员到访摘要；批次编号随 SC-140719-B 家庭输出记录一并封存。</p>
          <form data-event-timestamp>
            <div class="form-row"><label for="event-output-time">B 批次输出时间</label><input id="event-output-time" name="outputTime" type="text" placeholder="YYYY-MM-DD HH:MM" autocomplete="off" required></div>
            <div class="form-row"><label for="event-output-batch">补寄输出批次</label><input id="event-output-batch" name="outputBatch" type="text" placeholder="按转存记录填写" autocomplete="off" required></div>
            <div class="form-row"><label for="event-photo-template">补录背景模板编号</label><input id="event-photo-template" name="templateCode" type="text" placeholder="按活动总结填写" autocomplete="off" required></div>
            <button type="submit">搜索旧相册</button>
            <p id="event-timestamp-status" class="status-line" aria-live="polite"></p>
          </form>
          <div class="album-index-result" data-event-reveal hidden>
            <table class="data-table">
              <tbody>
                <tr><th style="width:27%">相册编号</th><td>ALB-ECHO-0719</td></tr>
                <tr><th>相册名称</th><td>星光回响</td></tr>
                <tr><th>原始记录时间</th><td>2014-07-19 16:17</td></tr>
                <tr><th>B 批次输出时间</th><td>2014-07-19 16:26</td></tr>
                <tr><th>补寄输出批次</th><td>P-0719-03-B</td></tr>
                <tr><th>补录背景模板</th><td>GP-FOTO-16</td></tr>
                <tr><th>现在在哪里</th><td>普通图片栏目里没有；2016-11 搬进家庭摄影馆备份</td></tr>
              </tbody>
            </table>
            <p><a href="/ARGgame/galaxy-park-arg/park/program-2014-07-19.html">当日节目单</a>记载：15:30 常规巡游因大风取消，不安排替代巡游。</p>
          </div>
        </section>
      `
    },
    "program-2014-07-19": {
      title: "2014 年 7 月 19 日园内节目单",
      breadcrumb: '当前位置：<a href="/ARGgame/galaxy-park-arg/galaxy-park-arg.html">首页</a> &gt; <a href="/ARGgame/galaxy-park-arg/park/news.html">新闻公告</a> &gt; 当日节目单',
      html: `
        <article class="program-day-card">
          <header>
            <p class="program-day-date">2014.07.19　星期六</p>
            <h2>星河乐园暑期园内节目单</h2>
            <p>营业时间：09:30—17:30　售票截止：16:30</p>
          </header>
          <table class="program-table">
            <thead><tr><th style="width:18%">时间</th><th>节目及活动</th><th style="width:30%">地点</th></tr></thead>
            <tbody>
              <tr><td>09:30</td><td>开园迎宾广播</td><td>银河广场</td></tr>
              <tr><td>10:00</td><td>星仔、月芽卡通见面会</td><td>儿童城入口</td></tr>
              <tr><td>10:40</td><td>儿童安全广播小课堂</td><td>家庭服务中心前厅</td></tr>
              <tr><td>11:20</td><td>月湾小火车沿线讲解</td><td>小火车月台</td></tr>
              <tr><td>13:30</td><td>暑期营家庭合影与绘画活动</td><td>家庭摄影馆</td></tr>
              <tr><td>14:30</td><td>走失儿童协寻演练</td><td>银河广场服务台</td></tr>
              <tr class="program-cancelled"><td>15:30</td><td>周六常规巡游（取消）</td><td>星河大道</td></tr>
              <tr><td>16:10</td><td>暑期营纪念品领取及活动问卷</td><td>家庭服务中心</td></tr>
              <tr><td>17:00</td><td>闭园前广播与游客疏导</td><td>全园</td></tr>
            </tbody>
          </table>
          <section class="program-adjustment">
            <h2>当日调整</h2>
            <p>受持续大风影响，15:30 周六常规巡游取消，巡游车辆及演员暂停出场，当日不另设替代巡游。其余室内活动照常进行。</p>
            <p class="meta-line">星河乐园运营部　2014 年 7 月 19 日 13:05 更新</p>
          </section>
        </article>
      `
    },
    downloads: {
      title: "游客服务资料",
      breadcrumb: '当前位置：<a href="/ARGgame/galaxy-park-arg/galaxy-park-arg.html">首页</a> &gt; 游客服务 &gt; 相关资料',
      html: `
        <p>这里保存以前跟票务、夏令营和闭园通知一起发布的打印材料。</p>
        <table class="data-table">
          <thead><tr><th style="width:19%">目录编号</th><th>资料名称</th><th style="width:20%">公开年份</th><th style="width:18%">状态</th></tr></thead>
          <tbody>
            <tr><td>GP-PUB-001</td><td>星河乐园游客导览</td><td>2017</td><td>目录完整</td></tr>
            <tr><td>GP-PUB-006</td><td>文明游园与儿童安全提示</td><td>2016</td><td>目录完整</td></tr>
            <tr><td>GP-EVT-014</td><td><a href="../assets/files/park/GP-EVT-014-echo-parade-summary.pdf" target="_blank" rel="noopener">“星光回响”特别巡游活动总结（PDF）</a><br><a href="/ARGgame/galaxy-park-arg/park/program-2014-07-19.html">同日公开节目单</a></td><td>2014 / 2016 补录</td><td>存在重复版本</td></tr>
            <tr><td>GP-SVC-022</td><td><a href="../assets/files/park/GP-SVC-022-child-safety-authorization.pdf" target="_blank" rel="noopener">儿童活动及安全服务授权书（PDF）</a></td><td>2013</td><td>公开版登记</td></tr>
            <tr><td>GP-CLOSE-2018</td><td><a href="../assets/files/park/GP-CLOSE-2018-closure-notice.pdf" target="_blank" rel="noopener">闭园通知及退费说明（PDF）</a></td><td>2018</td><td>目录完整</td></tr>
          </tbody>
        </table>
        <h2 class="section-title">目录说明</h2>
        <ul class="plain-list">
          <li>同名文件后带 <code>_2</code> 的，通常为重复上传，不一定是新版。</li>
          <li>2012 年前的公开资料位于 <code>/public/</code> 目录；2016 年维护后，历史资料转入按年份划分的只读目录。</li>
          <li>表里有名字、但从未公开的文件，不会显示链接。</li>
          <li>这里只显示能够正常打开的公开文件；已经损坏的文件不能下载。</li>
        </ul>
      `
    },
    search: {
      title: "站内搜索",
      breadcrumb: '当前位置：<a href="/ARGgame/galaxy-park-arg/galaxy-park-arg.html">首页</a> &gt; 站内搜索',
      html: `
        <p>可以搜索页面标题和公开介绍。旧留言全文和下载文件里的文字不会出现在搜索结果中。</p>
        <form class="form-panel" data-site-search="park">
          <div class="form-row"><label for="site-keyword">关键词</label><input id="site-keyword" name="keyword" type="search" required></div>
          <button type="submit">搜索</button>
        </form>
        <div id="site-search-results" aria-live="polite">
          <h2 class="section-title">常用关键词</h2>
          <p><a href="/ARGgame/galaxy-park-arg/park/history.html">闭园</a>　<a href="/ARGgame/galaxy-park-arg/park/map-old.html">旧地图</a>　<a href="/ARGgame/galaxy-park-arg/park/summer-camp.html">夏令营</a>　<a href="/ARGgame/galaxy-park-arg/park/messages.html">巡游</a>　<a href="/ARGgame/galaxy-park-arg/park/staff.html">广播</a></p>
        </div>
      `
    },
    contact: {
      title: "联系我们（历史信息）",
      breadcrumb: '当前位置：<a href="/ARGgame/galaxy-park-arg/galaxy-park-arg.html">首页</a> &gt; 联系我们',
      html: `
        <div class="notice-box">星河乐园已经闭园，以下地址与电话均为历史资料，不再提供咨询、票务或失物受理服务。</div>
        <table class="data-table">
          <tbody>
            <tr><th style="width:24%">历史地址</th><td>临江市滨江大道 118 号</td></tr>
            <tr><th>游客咨询</th><td>0100-681118（已停用）</td></tr>
            <tr><th>团体服务</th><td>0100-681126（已停用）</td></tr>
            <tr><th>失物招领</th><td>服务已于 2018 年 12 月 31 日结束</td></tr>
            <tr><th>网站邮箱</th><td>原邮箱已注销，本页面不接收邮件</td></tr>
          </tbody>
        </table>
        <h2 class="section-title">交通方式（历史）</h2>
        <p>公交 18 路、42 路至“星河乐园站”；节假日旅游专线由临江火车站东广场发车。闭园后站名及线路可能已经调整。</p>
        <h2 class="section-title">网站意见</h2>
        <form class="form-panel">
          <div class="form-row"><label for="contact-topic">意见类别</label><select id="contact-topic" disabled><option>页面错字</option><option>失效链接</option><option>历史资料说明</option></select></div>
          <div class="form-row"><label for="contact-text">内容</label><textarea id="contact-text" disabled></textarea></div>
          <button type="button" disabled>意见信箱已停止受理</button>
          <p class="status-line">停用时间：2019 年 3 月 22 日</p>
        </form>
      `
    },
    "site-update": {
      title: "网站维护记录",
      breadcrumb: '当前位置：<a href="/ARGgame/galaxy-park-arg/galaxy-park-arg.html">首页</a> &gt; 网站维护记录',
      html: `
        <p>以下为闭园后网站维护日志摘录，记录页面停用、目录迁移和历史资料整理情况。</p>
        <table class="data-table">
          <thead><tr><th style="width:18%">日期</th><th>维护内容</th></tr></thead>
          <tbody>
            <tr><td>2019-03-22</td><td>关闭动态留言与售票接口，保留静态页面；历史公开附件转为只读。</td></tr>
            <tr><td>2019-03-18</td><td>修复图片目录，但没有恢复包含个人信息的游客登记表。</td></tr>
            <tr><td>2018-10-29</td><td>员工信息服务切换为只读镜像。网站备份由设备与广播系统陈泊（员工通讯编号 E-0317）签收。</td></tr>
            <tr><td>2018-11-02</td><td>首页改为闭园说明，保留新闻、地图和年卡退费入口。</td></tr>
            <tr><td>2017-09-06</td><td>历史公开预览文件迁移：目录名由 <code>public</code> 调整为 <code>archive</code>，文件标记由 <code>preview</code> 调整为 <code>full</code>，原项目编号不变。</td></tr>
            <tr><td>2017-09-07</td><td>修复破损备注索引。正文缺失时，系统依附件标题顺序提取首字生成检索词。</td></tr>
            <tr><td>2016-04-13</td><td>全站由 GB2312 转为 UTF-8，少量 TXT 附件仍保留原编码。</td></tr>
            <tr><td>2014-08-02</td><td>巡游相册目录重新编号；旧缓存可能显示重复相册名称。</td></tr>
          </tbody>
        </table>
        <h2 class="section-title">员工后台账户规则</h2>
        <p>闭园交接期间，普通人事账户已经注销，网站备份责任人的维护账户单独保留。忘记账户时，可从<a href="/ARGgame/galaxy-park-arg/park/staff-account-recovery.html">员工账户历史查询</a>核对原答题卡记录。</p>
      `
    }
  },
  searchIndex: [
    { title: "乐园概况", href: "/ARGgame/galaxy-park-arg/park/about.html", text: "1997 建成 1999 营业 2018 闭园 滨江片区" },
    { title: "乐园大事记", href: "/ARGgame/galaxy-park-arg/park/history.html", text: "设备更新 招聘 闭园 网站整理 2014 活动" },
    { title: "游乐项目", href: "/ARGgame/galaxy-park-arg/park/attractions.html", text: "摩天轮 月湾小火车 儿童城 星光巡游 广播站 家庭摄影" },
    { title: "2017 年版园区导览", href: "/ARGgame/galaxy-park-arg/park/map.html", text: "停车场 第六休息区 团体入口" },
    { title: "新闻公告", href: "/ARGgame/galaxy-park-arg/park/news.html", text: "闭园 失物 年检 停车场 雷雨 票价" },
    { title: "员工风采", href: "/ARGgame/galaxy-park-arg/park/staff.html", text: "林思遥 陈泊 游客服务 广播系统" },
    { title: "员工账户历史查询", href: "/ARGgame/galaxy-park-arg/park/staff-account-recovery.html", text: "闭园维护账户 留存答题卡" },
    { title: "游客留言", href: "/ARGgame/galaxy-park-arg/park/messages.html", text: "禾禾 特别巡游 蓝色星星 四点" },
    { title: "银河成长夏令营", href: "/ARGgame/galaxy-park-arg/park/summer-camp.html", text: "腕带 问卷 广播体验 家庭照片" },
    { title: "网站维护记录", href: "/ARGgame/galaxy-park-arg/park/site-update.html", text: "public archive preview full 旧链接 文件名" }
  ]
};
