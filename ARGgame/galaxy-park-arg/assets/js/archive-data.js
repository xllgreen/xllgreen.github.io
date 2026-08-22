window.GALAXY_SITE_DATA = window.GALAXY_SITE_DATA || {};
window.GALAXY_SITE_DATA.archive = {
  name: "临江市历史项目档案管理系统",
  nav: [],
  sidebar: [
    { href: "/ARGgame/galaxy-park-arg/galaxy-park-arg.html", label: "卷宗目录" },
    { href: "/ARGgame/galaxy-park-arg/archive/access.html", label: "访问检索" },
    { href: "/ARGgame/galaxy-park-arg/archive/project-summary.html", label: "洗脑项目沿革" },
    { href: "/ARGgame/galaxy-park-arg/archive/zone7.html", label: "第七区实施场所" },
    { href: "/ARGgame/galaxy-park-arg/archive/subject-records.html", label: "儿童及家庭样本" },
    { href: "/ARGgame/galaxy-park-arg/archive/audio-log.html", label: "洗脑广播日志" },
    { href: "/ARGgame/galaxy-park-arg/archive/broadcast-reconstruction.html", label: "实验调度复核" },
    { href: "/ARGgame/galaxy-park-arg/archive/scan-verification.html", label: "隐匿附件拼合" },
    { href: "/ARGgame/galaxy-park-arg/archive/final-evidence.html", label: "证据外发邮件（1）" }
  ],
  sidebarNote: "案卷号：LJ-GP-07　项目类型：儿童洗脑与群体虚假记忆　访问方式：只读",
  pages: {
    access: {
      title: "LJ-GP-07 档案访问",
      breadcrumb: "档案系统 &gt; 访问校验",
      permission: "目录检索 / 只读",
      layout: "archive-access",
      html: `
        <p>本页用于检索历史移交卷宗。请按档案登记信息填写，不使用个人姓名、证件号码或联系方式。</p>
        <div class="archive-login">
          <h2>历史卷宗检索</h2>
          <form data-archive-access>
            <div class="form-row"><label for="archive-code">项目编号</label><input id="archive-code" name="projectCode" autocomplete="off" required></div>
            <div class="form-row"><label for="archive-name">档案题名</label><input id="archive-name" name="projectName" autocomplete="off" required></div>
            <div class="form-row"><label for="archive-transfer">归档登记号</label><input id="archive-transfer" name="transferCode" autocomplete="off" required></div>
            <button type="submit">检索卷宗</button>
            <p id="archive-access-status" class="status-line" aria-live="polite"></p>
          </form>
        </div>
        <p class="small-note">历史目录允许重复检索，不设置账户锁定。</p>
        <div class="archive-clearance-modal" data-archive-clearance-modal hidden>
          <section class="archive-clearance-dialog" role="dialog" aria-modal="true" aria-labelledby="archive-clearance-title">
            <h2 id="archive-clearance-title">你已进入绝密档案区</h2>
            <p>卷宗 LJ-GP-07 不在当前节点的授权目录中。系统已允许读取残留副本，同时将本次访问者登记为 <strong>CURRENT_READER</strong>。</p>
            <table class="data-table">
              <tbody>
                <tr><th>当前阅读者</th><td>CURRENT_READER</td></tr>
                <tr><th>访问节点</th><td>已登记</td></tr>
                <tr><th>位置核验</th><td>已进入下一次同步队列</td></tr>
                <tr><th>撤销读取</th><td>不支持</td></tr>
              </tbody>
            </table>
            <p>从此刻起，关闭页面、返回公开网站或清除浏览记录，都不会使卷内审计恢复为“未读取”。阅读者是否仍停留在屏幕前，不影响节点继续完成核验。</p>
            <p>若走廊内有人询问你正在阅读什么，请不要说出项目名称。系统无法确认询问者是否属于原项目联络组。</p>
            <div class="archive-clearance-actions"><button type="button" data-archive-clearance-enter>进入卷宗</button></div>
          </section>
        </div>
      `
    },
    index: {
      title: "LJ-GP-07 儿童洗脑实验卷宗",
      breadcrumb: "档案系统 &gt; LJ 系列 &gt; LJ-GP-07",
      permission: "内部历史资料 / 只读",
      html: `
        <section class="archive-recovery-alert">
          <h2>卷宗恢复异常</h2>
          <p>2018 年 10 月 31 日的转储操作只保留了访问索引，原始访问记录及删除原因均无法恢复。当前节点无法判断本卷曾由哪些账户读取，也无法确认最后一次修改的执行人。</p>
          <table class="data-table">
            <tbody>
              <tr><th style="width:29%">原始访问记录</th><td>损坏 / 无法恢复</td></tr>
              <tr><th>最后写入账户</th><td>无法确认</td></tr>
              <tr><th>当前阅读会话</th><td>CURRENT_READER / 已另行登记</td></tr>
              <tr><th>撤销读取记录</th><td>不支持</td></tr>
              <tr><th>关闭页面后的状态</th><td>审计记录继续保留</td></tr>
            </tbody>
          </table>
          <p>本卷不在当前节点的常规授权目录中。系统仍允许读取残留副本，但无法将会话恢复至访问前状态。</p>
        </section>
        <div class="notice-box"><strong>完整性说明：</strong>本卷记录星河乐园如何以儿童活动为掩护实施洗脑、制造共同虚假记忆，并把成功方法转用于学校、车站和公共活动。本卷于 2018 年分批移交，现存内容由公开件、内部实验稿及设备备份合并恢复。原页码、附件序号与移交清单存在人为断裂，删除原因未被保留。</div>
        <div class="archive-internal-conclusion"><strong>卷宗结论</strong><p>LJ-GP-07 不是普通公共安全研究。项目人员利用广播、颜色腕带、路线限制、合成照片、纪念物和家庭回访持续洗脑儿童，使参与者相信自己经历过从未发生的活动。项目已证明错误记忆可以被成批制造、由家长协助巩固，并在没有工作人员继续提示时长期保留。</p></div>
        <table class="data-table">
          <tbody>
            <tr><th style="width:26%">项目公开名称</th><td>临江市儿童公共环境适应与安全研究项目</td></tr>
            <tr><th>政府内部名称</th><td>星河协同计划</td></tr>
            <tr><th>实施单位内部名称</th><td>银河成长计划</td></tr>
            <tr><th>项目编号</th><td>LJ-GP-07</td></tr>
            <tr><th>实际项目性质</th><td>儿童洗脑、家庭共同虚假记忆及公共指令服从训练</td></tr>
            <tr><th>固定实施地点</th><td>星河乐园家庭服务后区（ZONE-7 / GP-B07）</td></tr>
            <tr><th>资料形成时间</th><td>2013 年 5 月—2018 年 10 月</td></tr>
            <tr><th>恢复来源</th><td>政务公开件、项目工作底稿、场地设备备份</td></tr>
          </tbody>
        </table>
        <h2 class="section-title">卷内目录</h2>
        <table class="data-table">
          <thead><tr><th style="width:18%">文件编号</th><th>文件题名</th><th style="width:18%">恢复状态</th></tr></thead>
          <tbody>
            <tr><td>LJ-GP-07/01</td><td><a href="/ARGgame/galaxy-park-arg/archive/project-summary.html">儿童洗脑目的、实施方法及转用记录</a></td><td>7 / 8 件</td></tr>
            <tr><td>LJ-GP-07/02</td><td><a href="/ARGgame/galaxy-park-arg/archive/zone7.html">第七区洗脑房间配置及操作顺序</a></td><td>11 / 13 件</td></tr>
            <tr><td>LJ-GP-07/03</td><td><a href="/ARGgame/galaxy-park-arg/archive/subject-records.html">被洗脑儿童、家庭及抵抗样本记录</a></td><td>身份字段删除</td></tr>
            <tr><td>LJ-GP-07/04</td><td><a href="/ARGgame/galaxy-park-arg/archive/audio-log.html">诱导广播、合成照片及服务器日志</a></td><td>部分恢复</td></tr>
            <tr><td>LJ-GP-07/05</td><td><a href="/ARGgame/galaxy-park-arg/archive/broadcast-reconstruction.html">2014-07-19 洗脑流程调度复核</a></td><td>顺序字段脱落</td></tr>
            <tr><td>LJ-GP-07/06</td><td><a href="/ARGgame/galaxy-park-arg/archive/scan-verification.html">被撤下的洗脑附件扫描件</a></td><td>4 个图像块</td></tr>
          </tbody>
        </table>
        <h2 class="section-title">字段合并状态</h2>
        <p>本卷有两组同类指标使用不同字段名，自动合并已停用。数字化补录应分别依据公开原件和工作底稿原文，不得以网页摘要代替。</p>
      `
    },
    "project-summary": {
      title: "项目沿革及方法变更",
      breadcrumb: '档案系统 &gt; <a href="/ARGgame/galaxy-park-arg/galaxy-park-arg.html">LJ-GP-07</a> &gt; 项目沿革',
      permission: "内部工作稿 / 只读",
      html: `
        <h2 class="section-title">一、公开立项目的与实际任务</h2>
        <p>项目对外以走失儿童协寻、公共场所疏散、陌生环境焦虑降低及公共标识理解为研究目标。上述事项只用于取得场地、家庭授权和儿童活动名额，不是项目后期的实际任务。自 2013 年第二次内部论证起，LJ-GP-07 的实际任务被确定为：在参与者不知情的情况下，对儿童持续实施洗脑，改变其对指令来源、事件经过和个人经历的判断，并确认这种改变能否通过家庭成员继续巩固。</p>
        <p>项目所称“洗脑”不是一次性说服。执行组把同一句广播、同一组照片、同一条游园路线、同一颜色腕带和同一种奖励连续安排在儿童身边，使儿童先在动作上服从，再在语言上重复，最后把项目提供的叙述误认为自己的记忆。回访人员随后要求家长与儿童共同复述；当家庭成员说法不一致时，只保留与项目版本相符的部分，继续播放、展示和提问，直到原始记忆无法稳定说出。</p>
        <div class="archive-internal-conclusion">
          <strong>内部目的：</strong>
          <p>项目要证明，儿童可以在没有暴力、没有药物、没有明显强迫的情况下，被固定环境和重复信息长期洗脑；被洗脑后的儿童还可以影响父母，使整个家庭共同接受一件从未发生过的事。项目最终需要的不是一次活动中的服从，而是参与者离开乐园后仍会主动维护错误记忆，并把任何相反证据解释成记录缺失、网站故障或自己记错。</p>
        </div>
        <h2 class="section-title">二、实施对象与选择理由</h2>
        <p>儿童被确定为主要对象，是因为其个人经历通常由家长、照片、纪念物和成人叙述共同确认。项目组可以先改变儿童说法，再向家长提供合成照片和统一说明；家长为了维持家庭叙述的一致，往往会替项目纠正儿童仍然保留的原始记忆。相反，当家长先接受项目版本时，儿童会把成人的肯定视为自己确实参与过活动的证明。项目把这种相互纠正称为“家庭协同巩固”，实际作用是让家长参与对儿童的二次洗脑。</p>
        <p>样本选择并不以儿童是否快乐为标准。执行组优先保留三类对象：听到广播后立即停止原动作的人；在获得纪念物后愿意重复指定句子的人；发现照片与现实不一致时，倾向于否定自己而不是质疑文件的人。持续追问日期、要求查看节目单、能够记住原始路线或拒绝家庭统一说法的儿童，被列为高抵抗样本，只用于比较，不作为后续推广对象。</p>
        <h2 class="section-title">三、洗脑流程与判定标准</h2>
        <p>标准流程分为五段。第一段以腕带颜色和工作人员口令建立分组，使儿童习惯只对本组颜色作出反应。第二段在固定路线中重复短句和动作，记录儿童从听见指令到执行指令的时间。第三段展示经过编辑的照片和不存在的活动说明，要求儿童指出自己“当时”站在哪里。第四段让家长参加问卷和讨论，由工作人员删除不一致细节，形成全家都能复述的单一版本。第五段在离园后一周、一个月、三个月及六个月继续回访，反复提供同一照片、同一纪念物和同一解释，直到参与者不再区分亲历内容与后来接收的内容。</p>
        <p>洗脑成功采用四项内部标准：对象能够在没有现场提示时完整复述统一事件；对象面对节目单、设备记录或物料日期等反证时仍优先相信项目版本；家庭成员会主动纠正仍保留原始记忆的人；停止回访后，错误记忆能够继续保持，并被对象当作个人经历转述给未参与者。只完成动作、不相信事件发生过的对象，不计入成功样本。</p>
        <p>自 2014 年起，评估字段增加“诱导性广播响应率”“记忆覆盖率”“家庭协同修正次数”和“反证抵抗率”。其中“记忆覆盖率”直接统计原始叙述被项目版本替代的比例；“反证抵抗率”统计对象看见矛盾证据后仍坚持错误记忆的比例。公开报告分别将其改写为“提示性广播”“家庭说明一致率”和“长期行为巩固”，以避免外部读者判断项目正在洗脑儿童。</p>
        <h2 class="section-title">四、最终用途</h2>
        <p>LJ-GP-07 的最终目标不是改善乐园服务，而是建立一套可复制的群体洗脑方法。该方法要求不依赖封闭实验室，不留下明显强迫痕迹，并能嵌入学校集会、交通场站、疏散演练和大型公共活动。实施方可以通过广播、颜色分区、统一口号、纪念物、照片发布和事后问卷，使儿童接受指定解释；儿童回家后继续重复该解释，从而把家庭也纳入传播和巩固过程。</p>
        <p>项目组将“主动替官方解释矛盾”视为最高等级结果。达到该等级的对象不再需要工作人员纠正：当个人记忆与公布材料冲突时，他们会自行认定个人记忆不可靠；当其他人提出质疑时，他们会主动重复统一说法。内部意见认为，这类对象可在学校、车站和公共活动中充当无编制的秩序传播节点。对外文件不得说明其形成过程，只需将结果记为“公共指令接受能力稳定”。</p>
        <h2 class="section-title">关联原件</h2>
        <table class="data-table archive-source-files">
          <thead><tr><th style="width:20%">登记号</th><th>文件</th><th style="width:22%">保留状态</th></tr></thead>
          <tbody>
            <tr><td>GOV-PDF-001</td><td><a href="../assets/files/government/GOV-PDF-001-project-approval.pdf" target="_blank" rel="noopener">项目立项批复及附件目录（PDF）</a></td><td>公开件</td></tr>
            <tr><td>GOV-PDF-006</td><td><a href="../assets/files/government/GOV-PDF-006-stage-evaluation-public.pdf" target="_blank" rel="noopener">2016 年度阶段性评估报告（公开版，PDF）</a></td><td>公开件</td></tr>
            <tr><td>GP-SVC-022</td><td><a href="../assets/files/park/GP-SVC-022-child-safety-authorization.pdf" target="_blank" rel="noopener">儿童活动及安全服务授权书（PDF）</a></td><td>公开表样</td></tr>
            <tr><td>GOV-DOC-014</td><td><a href="../assets/files/government/GOV-DOC-014-family-activity-working-draft.docx?v=20260801-2" download>家庭活动阶段报告工作稿（DOCX）</a></td><td>2014 原始资料 / 2016 补订</td></tr>
            <tr><td>ARC-DOC-004</td><td><a href="../assets/files/archive/ARC-DOC-004-parade-results-redline.docx?v=20260801-2" download>“星光回响”材料结果报告修订稿（DOCX）</a></td><td>2016 复核 / 保留修改标记</td></tr>
          </tbody>
        </table>
        <section class="archive-review-box">
          <h2 class="section-title">附件关系补录</h2>
          <p>数字化记录中有一条附件关系未恢复。系统要求同时核对附件序号、公开报告字段、工作字段、公开授权范围及修订稿第三轮结果。</p>
          <form data-public-internal-difference>
            <div class="form-row"><label for="missing-attachment">附件序号</label><input id="missing-attachment" name="attachmentNumber" inputmode="numeric" autocomplete="off" required></div>
            <div class="form-row"><label for="public-metric">公开评估报告指标名称</label><input id="public-metric" name="publicMetric" autocomplete="off" required></div>
            <div class="form-row"><label for="working-metric">工作底稿指标名称</label><input id="working-metric" name="workingMetric" autocomplete="off" required></div>
            <div class="form-row"><label for="authorized-followups">公开授权书允许的游园后回访次数</label><input id="authorized-followups" name="authorizedFollowups" inputmode="numeric" autocomplete="off" required></div>
            <div class="form-row"><label for="third-round-belief">修订稿第三轮“相信自己到过现场”比例</label><input id="third-round-belief" name="thirdRoundBelief" autocomplete="off" placeholder="可填写百分数" required></div>
            <button type="submit">提交补录</button>
            <p id="public-internal-status" class="status-line" aria-live="polite"></p>
          </form>
          <div class="archive-review-result" data-public-internal-reveal hidden>
            <div class="archive-access-warning">
              <strong>访问异常 17-C</strong>
              <p>附件 03 未列入当前节点授权目录。副本来源、移交人员及最后修改账户均无法确认。</p>
              <p>系统已为本次调取生成独立审计记录。该记录不能删除或合并，关闭页面也不能恢复为调取前状态。</p>
            </div>
            <p><strong>附件关系恢复：03《长期记忆修正样本说明》。</strong></p>
            <p>这份附件记录儿童洗脑和家庭记忆替换。工作底稿中的“记忆覆盖率”，就是参与家庭的真实记忆被项目制造的虚假版本替代，并在连续回访中继续相信虚假版本的比例。</p>
            <p><a href="/ARGgame/galaxy-park-arg/archive/scan-verification.html">打开附件 03 的移交扫描件复核记录</a></p>
          </div>
        </section>
        <h2 class="section-title">五、“星光回响”重大实验成功结果</h2>
        <div class="archive-internal-conclusion">
          <strong>内部结论：本轮洗脑成功。</strong>
          <p>“星光回响特别巡游”从未举行。项目组仍成功使一批互不相识的儿童和家长相信自己在 2014 年 7 月 19 日 16:17 参加过该巡游，并使他们多年后继续复述相同的开始时间、纸星颜色、工作人员徽章、结束音乐和集体口号。参与者不是忘记了巡游细节，而是把项目后来提供的细节当成了自己的亲身经历。</p>
        </div>
        <p>执行组先在第七实施区关闭门禁，向儿童重复播放专用广播，再展示由普通游园照片和统一背景模板制作的合成纪念照。儿童被要求在照片上指出自己、复述工作人员提供的活动顺序，并领取 2016 年才采购的银色星形纽扣。回访人员随后把“照片中有自己”“手中有纪念物”“家长也记得”作为三项相互证明，使儿童逐渐停止追问原节目单中为什么没有这场巡游。</p>
        <p>家长组接受了同样的照片、问卷和统一说明。项目人员将每次回访中的差异记录下来，只在下一轮保留重复率最高的细节。经过三轮修正，家庭成员开始彼此纠正：有人记得天气，有人记得广播，有人记得蓝色纸星，但所有人最终都使用了项目给出的时间和口号。第三轮有 79.5% 的对象明确表示“相信自己到过现场”。该比例被认定为重大成功，因为巡游现场根本不存在。</p>
        <p>项目组特别确认了洗脑结果对反证的抵抗。节目单没有巡游、设备在维修、演员没有排班、广播没有进入公开通道、照片在门禁关闭后输出、银色纽扣晚两年才生产；即使同时呈现这些材料，多数高响应家庭仍优先相信合成照片和共同叙述。他们会主动解释说节目单漏印、维修提前结束、网站记录丢失，或自己记错了物料领取年份。项目不需要再提供新解释，参与者已经学会替项目消除矛盾。</p>
        <h2 class="section-title">重大成功的证据对照</h2>
        <table class="data-table archive-source-files">
          <thead><tr><th style="width:23%">证据</th><th>实际记录</th><th style="width:22%">证明内容</th></tr></thead>
          <tbody>
            <tr><td><a href="/ARGgame/galaxy-park-arg/park/program-2014-07-19.html">2014-07-19 当日节目单</a></td><td>没有“星光回响特别巡游”，16:17 没有公开演出安排。</td><td>巡游未被安排</td></tr>
            <tr><td><a href="../assets/files/park/GP-EVT-014-echo-parade-summary.pdf" target="_blank" rel="noopener">巡游活动汇总附件</a></td><td>后补材料使用统一背景模板 GP-FOTO-16，形成时间晚于所谓活动。</td><td>照片并非现场纪实</td></tr>
            <tr><td><a href="/ARGgame/galaxy-park-arg/archive/audio-log.html">广播调用及服务器日志</a></td><td>16:17 专用广播只在第七区门禁关闭后调用，没有进入公开园区广播。</td><td>广播用于封闭洗脑流程</td></tr>
            <tr><td><a href="/ARGgame/galaxy-park-arg/archive/broadcast-reconstruction.html">广播与照片输出复核</a></td><td>16:17 播放专用语句，16:26 才生成“家庭回访输出”照片。</td><td>记忆先被诱导，照片后制作</td></tr>
            <tr><td><a href="../assets/files/government/GOV-PROC-2016-022-delivery-lines.txt" target="_blank" rel="noopener">采购到货明细文本版</a></td><td>600 枚银色星形纽扣于 2016 年由项目组直接接收。</td><td>2014 年不可能现场领取</td></tr>
            <tr><td><a href="../assets/files/archive/ARC-DOC-004-parade-results-redline.docx?v=20260801-2" download>结果报告修订稿</a></td><td>第三轮“相信自己到过现场”比例为 79.5%，原始措辞被从公开稿删除。</td><td>洗脑成功的内部统计</td></tr>
          </tbody>
        </table>
        <h2 class="section-title">六、成功方法的转用</h2>
        <p>2017 年内部意见认定，“星光回响”证明了群体洗脑可以在普通公共服务外观下完成。统一语句、颜色分区、照片替换、奖励物、家庭复述和长期回访被拆分成独立模块，准备转用于学校、交通场站和大型公共活动。新项目不得继续使用星河乐园、银河成长计划或“星光回响”名称，但可以继续使用 LJ-GP-07 的样本分级、广播时长和记忆覆盖率算法。</p>
        <p>转用目标不是让所有人相信同一件具体事件，而是让目标人群形成相同的判断习惯：听见指定声音便执行动作；看见统一材料便放弃个人判断；发现矛盾时先怀疑自己；在没有工作人员在场时仍替系统维护同一解释。项目组认为，只要这种习惯能够保持，洗脑内容可以随场景更换，而不必重新建立完整的乐园环境。</p>
      `
    },
    zone7: {
      title: "第七区洗脑实施场所",
      breadcrumb: '档案系统 &gt; <a href="/ARGgame/galaxy-park-arg/galaxy-park-arg.html">LJ-GP-07</a> &gt; 场所配置',
      permission: "洗脑场所内部配置 / 只读",
      html: `
        <p class="lead">公开名称：星河家庭休息中心。内部编号：ZONE-7 / GP-B07。这里不是休息区，而是完整的儿童洗脑流水线。家庭摄影、问卷、绘画、广播和纪念物领取被安排在不同房间，使参与者以为自己只是在接受普通乐园服务。</p>
        <h2 class="section-title">房间用途与掩护</h2>
        <p>公开工程报告把各房间登记为摄影、休息、广播体验和儿童绘画场所。内部使用时，同一批儿童会被依次带入照片呈现室、诱导广播室和记忆输出室。每个房间只执行一步，普通工作人员因此无法看见完整洗脑流程。</p>
        <p><a class="file-link" href="../assets/files/government/GOV-PDF-003-zone7-acceptance.pdf" target="_blank" rel="noopener">打开：第七家庭服务区域改造工程验收报告（PDF）</a></p>
        <section class="archive-review-box">
          <h2 class="section-title">洗脑流程门禁记录</h2>
          <p>门禁备份只保留房间用途和单向通行箭头。请在平面图上依次选择“虚假事件照片呈现、诱导广播重复投放、洗脑后记忆输出”经过的三个房间。</p>
          <div class="zone-route-workbench" data-zone-route>
            <div class="zone-route-map">
              <img src="../assets/images/maps/zone7-internal-floorplan.svg" alt="第七实施区门禁方向与十个房间的平面图">
              <button type="button" data-zone-room="B07-01" style="--x:9%;--y:18%">01</button>
              <button type="button" data-zone-room="B07-02" style="--x:29%;--y:18%">02</button>
              <button type="button" data-zone-room="B07-03" style="--x:50%;--y:18%">03</button>
              <button type="button" data-zone-room="B07-04" style="--x:70%;--y:18%">04</button>
              <button type="button" data-zone-room="B07-05" style="--x:87%;--y:18%">05</button>
              <button type="button" data-zone-room="B07-06" style="--x:9%;--y:69%">06</button>
              <button type="button" data-zone-room="B07-07" style="--x:29%;--y:69%">07</button>
              <button type="button" data-zone-room="B07-08" style="--x:50%;--y:69%">08</button>
              <button type="button" data-zone-room="B07-09" style="--x:70%;--y:69%">09</button>
              <button type="button" data-zone-room="B07-10" style="--x:87%;--y:69%">10</button>
            </div>
            <div class="zone-route-panel">
              <h3>门禁回放序列</h3>
              <ol data-zone-route-list>
                <li>尚未选择</li>
                <li>尚未选择</li>
                <li>尚未选择</li>
              </ol>
              <button type="button" data-zone-route-reset>清除本次选择</button>
              <p id="zone-procedure-status" class="status-line" aria-live="polite"></p>
            </div>
          </div>
          <div class="archive-review-result" data-zone-procedure-reveal hidden>
            <p><strong>恢复流程：B07-06 → B07-07 → B07-05。</strong></p>
            <p>操作顺序为虚假事件照片重复呈现、诱导广播投放、洗脑后绘画输出。儿童按照提示画出的内容随后被改名为“活动自主回忆材料”，用于证明他们本来就记得这场不存在的活动。</p>
          </div>
        </section>
        <h2 class="section-title">儿童与家长导入路径</h2>
        <p>家庭样本经摄影馆进入，在不知道项目存在的情况下完成合成摄影、记忆问卷、广播服从测试及纪念物领取，再由第六休息区返回园区。团体样本经东侧通道进入，依腕带颜色分配至放映、广播和绘画房间。两条路径都不设置实验标识，家长只会看到“免费照片”“亲子活动”和“满意度回访”。</p>
        <h2 class="section-title">公开地图处理</h2>
        <p>2009 年游客地图仍保留第七区。2013 年导视改造后，该区域在公开地图中并入停车 B 区及家庭服务后区；内部验收记录继续使用 GP-B07 编号。</p>
      `
    },
    "subject-records": {
      title: "被洗脑儿童及家庭记录",
      breadcrumb: '档案系统 &gt; <a href="/ARGgame/galaxy-park-arg/galaxy-park-arg.html">LJ-GP-07</a> &gt; 样本记录',
      permission: "洗脑样本匿名副本 / 身份字段不可恢复",
      html: `
        <div class="notice-box">本副本仅保留样本编号。姓名、住址、学校及联系方式字段已在移交前删除。</div>
        <table class="data-table">
          <thead><tr><th style="width:18%">样本编号</th><th style="width:20%">洗脑方式</th><th>洗脑结果</th><th style="width:17%">后续处置</th></tr></thead>
          <tbody>
            <tr><td>GP14-BL</td><td>蓝色腕带 / 反复看合成照片</td><td>开始把指定时间、纸星颜色和结束语当成亲历记忆</td><td>继续洗脑回访</td></tr>
            <tr><td>GP14-SV</td><td>银色纪念物 / 诱导问卷</td><td>接受不存在的巡游，并用纪念物证明自己参加过</td><td>纳入长期观察</td></tr>
            <tr><td>GP14-FM</td><td>家庭讨论 / 合成照片</td><td>三轮洗脑后，全家使用同一套虚假叙述</td><td>标记为成功家庭</td></tr>
            <tr><td>GP15-RD</td><td>红色腕带 / 未投放洗脑材料</td><td>保留真实游园记忆，作为对照组</td><td>停止接触</td></tr>
            <tr><td>GP16-RV</td><td>纪念物 / 重复解释</td><td>发现纽扣晚两年生产，仍未接受项目说法</td><td>增加洗脑轮次</td></tr>
          </tbody>
        </table>
        <h2 class="section-title">抵抗样本：GXH-0417</h2>
        <p>该样本能够复述项目提供的“星光回响特别巡游”，但始终把它称为别人告诉自己的故事，不承认是亲历记忆。照片模板与银色纽扣都形成于 2016 年，样本在三轮回访中反复指出时间冲突，要求查看 2014 年节目单，并拒绝让家长替自己确认。执行组因此判定：洗脑未完成，原始判断仍然保留。</p>
        <h2 class="section-title">成功、抵抗与处置</h2>
        <p>听到广播便执行动作、把合成照片当成经历、面对反证先怀疑自己的人，直接标记为“洗脑成功”。仍能区分亲历内容与后来叙述、要求查验原始材料的人，标记为高抵抗样本。高抵抗儿童不再参加公开回访，以免其质疑影响其他家庭；项目改为观察其学校记录、家庭叙述和网络检索行为。</p>
        <section class="archive-quiet-note">
          <h2>节点审计记录（未归档）</h2>
          <table class="data-table">
            <tbody>
              <tr><th style="width:26%">记录来源</th><td>CURRENT_READER</td></tr>
              <tr><th>写入账户</th><td>无法确认</td></tr>
              <tr><th>阅读时间</th><td data-reader-seen-time>正在读取节点记录……</td></tr>
            </tbody>
          </table>
          <p>阅读位置停留于 GXH-0417 时，门外连续出现三次敲击。外部人员未说明身份，仅询问：“还在看那个旧乐园吗？”</p>
          <p>该人员离开后，卷尾出现一条无修订记录的附加备注：</p>
          <blockquote>不要口头提及“星河乐园”。保持当前窗口被其他页面覆盖，直至走廊恢复安静。</blockquote>
        </section>
      `
    },
    "audio-log": {
      title: "洗脑广播及服务器日志",
      breadcrumb: '档案系统 &gt; <a href="/ARGgame/galaxy-park-arg/galaxy-park-arg.html">LJ-GP-07</a> &gt; 设备日志',
      permission: "洗脑设备备份 / 只读",
      html: `
        <p>设备备份保留了洗脑广播的调用记录。这些广播从未列入公开节目单，只发送到第七区。原始音频已被删除，现存标识和文本队列仍能确认项目先用固定语句控制儿童动作，再记录集体回答，最后把回答写进虚假巡游材料。</p>
        <table class="data-table">
          <thead><tr><th style="width:22%">时间</th><th style="width:24%">调用标识</th><th>事件记录</th></tr></thead>
          <tbody>
            <tr><td>2014-07-19 16:17</td><td>EVT_ECHO_A</td><td>连续调用三次；输出通道 Z7-PA</td></tr>
            <tr><td>2014-07-19 16:21</td><td>SKY_LOOKUP_03</td><td>文本队列：抬头看向星河</td></tr>
            <tr><td>2014-07-19 16:29</td><td>GROUP_REPLY_01</td><td>响应记录启用；无园区主广播输出</td></tr>
            <tr><td>2014-07-26 10:06</td><td>EVT_ECHO_A</td><td>回放测试；输出通道 B07-06</td></tr>
            <tr><td>2015-02-12 14:30</td><td>EVT_ECHO_A</td><td>家庭回访资料制作；读取模板目录</td></tr>
            <tr><td>2016-03-04 22:18</td><td>MOVE_TARGET_A</td><td>目标标签写入：UEJQQN</td></tr>
            <tr><td>2016-06-18 08:40</td><td>TEMPLATE_CHECK</td><td>照片模板目录校验；版本 16.06</td></tr>
            <tr><td>2017-05-26 18:03</td><td>MOVE_TARGET_B</td><td>目标标签写入：XYFYNTS</td></tr>
            <tr><td>2017-11-03 01:12</td><td>Z7_BACKUP</td><td>第七区设备备份完成；缺失 2 个索引项</td></tr>
            <tr><td>2018-10-31 09:18</td><td>ARCHIVE_MOVE</td><td>目标标签写入：WBISPJ-LCLUA；执行资料转储</td></tr>
          </tbody>
        </table>
        <h2 class="section-title">洗脑广播执行备注</h2>
        <ul class="plain-list">
          <li>园区主巡游通道当日处于维修锁定状态；洗脑广播只发送至 Z7-PA 和 B07-06，普通游客不可能听见。</li>
          <li>《星河永不熄灭》没有采购、节目单或正式音频登记。参与者后来“记得”听过它，是洗脑后补入的共同记忆。</li>
          <li>旧设备以 K 后两位记录英文字母的写入偏移量；读取目标标签时应按相反方向校正。</li>
          <li>三条 MOVE_TARGET 记录形成于不同年份，记录洗脑方法离开乐园后的三个转用地点。</li>
        </ul>
        <div class="archive-transfer-files">
          <p><a class="file-link" href="../assets/files/archive/ARC-PDF-021-project-transfer.pdf" target="_blank" rel="noopener">临儿序移〔2018〕21 号项目资料移交登记（PDF）</a></p>
          <p><a class="file-link" href="../assets/files/archive/ARC-TRANSFER-021-box-register.txt" target="_blank" rel="noopener">ARC-MOVE-07 移交箱登记摘录（TXT）</a></p>
        </div>
        <section class="archive-review-box archive-box-lookup">
          <h2 class="section-title">移交箱缺页补录</h2>
          <p>转储节点未能读取移交文号及箱内目录页。补齐四项登记后，可重新挂接节点补录文件。</p>
          <form data-move-register-access>
            <div class="form-row"><label for="move-document-no">移交文号</label><input id="move-document-no" name="documentNumber" autocomplete="off" required></div>
            <div class="form-row"><label for="move-box-no">移交箱号</label><input id="move-box-no" name="boxNumber" autocomplete="off" required></div>
            <div class="form-row"><label for="move-missing-page">箱内目录缺页</label><input id="move-missing-page" name="missingPage" inputmode="numeric" autocomplete="off" required></div>
            <div class="form-row"><label for="move-node">接收节点</label><input id="move-node" name="receiveNode" inputmode="numeric" autocomplete="off" required></div>
            <button type="submit">补录并挂接</button>
            <p id="move-register-status" class="status-line" aria-live="polite"></p>
          </form>
          <div class="archive-review-result" data-move-register-reveal hidden>
            <table class="data-table">
              <thead><tr><th style="width:24%">登记号</th><th>挂接文件</th></tr></thead>
              <tbody>
                <tr><td>ARC-DOC-012</td><td><a href="../assets/files/archive/ARC-DOC-012-device-index-check.docx" download>设备索引与转储页签复核记录（DOCX）</a></td></tr>
                <tr><td>ARC-MOVE-07</td><td><a href="../assets/files/archive/ARC-MOVE-07-secure.zip" download>受保护转储包（加密 ZIP）</a></td></tr>
              </tbody>
            </table>
          </div>
        </section>
        <section class="archive-review-box">
          <h2 class="section-title">洗脑方法转用地点补录</h2>
          <p>目标记录分散在设备日志中。按写入时间补录三个还原后的地点标签，以确认洗脑方法在闭园前后的去向。</p>
          <form data-transfer-decode>
            <div class="form-row"><label for="transfer-target-a">2016-03-04 目标标签</label><input id="transfer-target-a" name="target2016" autocomplete="off" required></div>
            <div class="form-row"><label for="transfer-target-b">2017-05-26 目标标签</label><input id="transfer-target-b" name="target2017" autocomplete="off" required></div>
            <div class="form-row"><label for="transfer-target-c">2018-10-31 目标标签</label><input id="transfer-target-c" name="target2018" autocomplete="off" required></div>
            <button type="submit">登记还原结果</button>
            <p id="transfer-decode-status" class="status-line" aria-live="polite"></p>
          </form>
          <div class="archive-review-result" data-transfer-reveal hidden>
            <p><strong>TRANSFER = SCHOOL / STATION / PUBLIC-EVENT</strong></p>
            <p>洗脑方法已转入学校、交通场站及大型公共活动。转用项目删除星河乐园名称和照片模板，但保留统一广播、颜色分区、重复语句、服从分级、虚假记忆修正和长期回访。乐园关闭没有终止实验，只是让实验不再需要乐园。</p>
          </div>
        </section>
        <p class="archive-related-link"><a href="/ARGgame/galaxy-park-arg/archive/broadcast-reconstruction.html">打开 2014-07-19 广播调度复核页</a></p>
      `
    },
    "broadcast-reconstruction": {
      title: "2014-07-19 洗脑流程调度复核",
      breadcrumb: '档案系统 &gt; <a href="/ARGgame/galaxy-park-arg/galaxy-park-arg.html">LJ-GP-07</a> &gt; 广播调度复核',
      permission: "洗脑流程复核副本 / 可操作",
      layout: "archive-puzzle",
      html: `
        <p>这张调度表记录“星光回响”洗脑实验的实际执行顺序。时间列仍在，事件名称列在转储时被删除；五张未编号事件卡已经恢复，但用于核对时刻的纸质值班簿无法辨认。</p>
        <p>转储节点只保留了一份广播队列摘录。请先下载原始记录，再将事件卡放回对应时间。</p>
        <p><a class="file-link" href="../assets/files/archive/LJ-GP-07-04-broadcast-queue.txt" download>下载原始广播队列摘录（TXT）</a></p>
        <section class="timeline-workbench" data-timeline-puzzle>
          <h2 class="section-title">事件顺序复核</h2>
          <p>先选择一张事件卡，再选择它对应的时间格。已放入的卡可以重新选择覆盖。</p>
          <div class="timeline-event-bank" data-timeline-bank>
            <button type="button" data-timeline-event="loop">普通园区循环播报结束</button>
            <button type="button" data-timeline-event="gate">第七区门禁关闭</button>
            <button type="button" data-timeline-event="echo">EVT_ECHO_A 首次调用</button>
            <button type="button" data-timeline-event="photo">家庭回访照片输出</button>
            <button type="button" data-timeline-event="call">广播室回拨结束</button>
          </div>
          <ol class="timeline-slots">
            <li><time>15:55</time><button type="button" data-timeline-slot="0">放入事件卡</button></li>
            <li><time>16:03</time><button type="button" data-timeline-slot="1">放入事件卡</button></li>
            <li><time>16:17</time><button type="button" data-timeline-slot="2">放入事件卡</button></li>
            <li><time>16:26</time><button type="button" data-timeline-slot="3">放入事件卡</button></li>
            <li><time>16:30</time><button type="button" data-timeline-slot="4">放入事件卡</button></li>
          </ol>
          <div class="timeline-actions">
            <button type="button" data-timeline-check>执行顺序校验</button>
            <button type="button" data-timeline-reset>清空</button>
          </div>
          <p id="timeline-puzzle-status" class="status-line" aria-live="polite"></p>
          <div class="archive-review-result" data-timeline-reveal hidden>
            <p><strong>复核通过：15:55 普通循环结束 → 16:03 门禁关闭 → 16:17 专用广播调用 → 16:26 照片输出 → 16:30 回拨结束。</strong></p>
            <p>16:17 的洗脑广播发生在第七区门禁关闭之后，没有进入园区主通道。16:26 才生成的合成照片被登记为“家庭回访输出”。这说明儿童先被广播诱导说出不存在的巡游，再由项目组制作照片，让他们把刚刚重复的内容误认成自己的记忆。</p>
          </div>
        </section>
      `
    },
    "scan-verification": {
      title: "被隐匿的洗脑附件扫描件",
      breadcrumb: '档案系统 &gt; <a href="/ARGgame/galaxy-park-arg/galaxy-park-arg.html">LJ-GP-07</a> &gt; 扫描件复核',
      permission: "删除附件重排工具 / 可操作",
      layout: "archive-puzzle",
      html: `
        <p>附件 03《长期记忆修正样本说明》直接记录了儿童洗脑和记忆替换结果，因此没有进入政府公开目录。其移交登记页被拆成四个扫描块，OCR 无法确认页序，系统仅保留旋转与交换功能。</p>
        <div class="scan-verification-note">
          <strong>复核依据</strong>
          <span>左侧装订孔应连续；中央骑缝章应闭合；表格横线和右上页码应在同一方向。</span>
        </div>
        <section class="scan-puzzle" data-scan-puzzle>
          <div class="scan-piece-grid" data-scan-grid>
            <button type="button" data-scan-piece="d" data-rotation="180"><img src="../assets/images/archive/transfer-scan-d.svg" alt="扫描块 D"></button>
            <button type="button" data-scan-piece="a" data-rotation="0"><img src="../assets/images/archive/transfer-scan-a.svg" alt="扫描块 A"></button>
            <button type="button" data-scan-piece="c" data-rotation="180"><img src="../assets/images/archive/transfer-scan-c.svg" alt="扫描块 C"></button>
            <button type="button" data-scan-piece="b" data-rotation="0"><img src="../assets/images/archive/transfer-scan-b.svg" alt="扫描块 B"></button>
          </div>
          <div class="scan-puzzle-controls">
            <p data-scan-selection>尚未选择扫描块</p>
            <button type="button" data-scan-rotate>旋转所选扫描块</button>
            <button type="button" data-scan-check>检查拼合</button>
            <button type="button" data-scan-reset>恢复初始状态</button>
          </div>
          <p id="scan-puzzle-status" class="status-line" aria-live="polite"></p>
          <div class="archive-review-result" data-scan-reveal hidden>
            <div class="archive-access-warning">
              <strong>移交链校验失败</strong>
              <p>扫描页可以完整拼合，但正文中的接收单位编号与现存移交清单不一致。原始移交回执仍然无法恢复。</p>
            </div>
            <p><strong>拼合页码：LJ-GP-07/03-A，第 4 页。</strong></p>
            <p>移交页以“未形成公开文本”为理由撤下附件 03，实际原因是该附件直接写明项目已成功洗脑儿童并替换家庭记忆。右下角补写的接收位置是第七区设备间，正式目录却写成政务资料室；有人在移交时把原件从公开档案链中取走。</p>
          </div>
        </section>
      `
    },
    "final-evidence": {
      title: "儿童洗脑项目证据外发邮件",
      breadcrumb: '档案系统 &gt; 邮件组件 &gt; 未发送邮件',
      permission: "邮件恢复组件 / 可发送",
      html: `
        <div class="archive-mail-banner"><strong>未发送邮件（1）</strong><span>最后保存：2018-10-31 09:42</span></div>
        <p>档案转储时保留了一封未发送邮件。邮件附件可以证明 LJ-GP-07 长期洗脑儿童、制造家庭共同虚假记忆，并把成功方法转用于其他公共场所。附件目录由本卷现已核验的材料自动恢复。</p>
        <form class="form-panel evidence-checklist archive-mail-compose" data-final-evidence>
          <div class="archive-mail-fields">
            <div><span>发件人</span><strong>历史项目档案节点 03</strong></div>
            <div><span>主题</span><strong>LJ-GP-07 儿童洗脑实验及后续转用证据</strong></div>
          </div>
          <fieldset>
            <legend>附件</legend>
            <label data-evidence-row="staffBackupAccess"><input type="checkbox" data-evidence-id="staffBackupAccess"> 管理员后台及闭园后继续维护洗脑资料的记录</label>
            <label data-evidence-row="mapVersionDifference"><input type="checkbox" data-evidence-id="mapVersionDifference"> 被公开地图删除的第七洗脑实施区</label>
            <label data-evidence-row="echoPhotoTimestamp"><input type="checkbox" data-evidence-id="echoPhotoTimestamp"> 不存在的巡游、诱导广播和事后合成照片</label>
            <label data-evidence-row="projectIdentity"><input type="checkbox" data-evidence-id="projectIdentity"> 政府批复、乐园场地与洗脑项目内部名称</label>
            <label data-evidence-row="silverButtonPurchase"><input type="checkbox" data-evidence-id="silverButtonPurchase"> 晚两年采购的 600 枚虚假巡游纪念物</label>
            <label data-evidence-row="linMemoPhrase"><input type="checkbox" data-evidence-id="linMemoPhrase"> 林思遥对合成照片和洗脑材料的内部警告</label>
            <label data-evidence-row="archivePathRecovered"><input type="checkbox" data-evidence-id="archivePathRecovered"> 被删除的完整洗脑卷宗访问路径</label>
            <label data-evidence-row="publicInternalDifference"><input type="checkbox" data-evidence-id="publicInternalDifference"> 公开报告掩盖“记忆覆盖率”的版本差异</label>
            <label data-evidence-row="zone7Procedure"><input type="checkbox" data-evidence-id="zone7Procedure"> 第七区照片、广播和记忆输出洗脑流程</label>
            <label data-evidence-row="continuationTargets"><input type="checkbox" data-evidence-id="continuationTargets"> 洗脑方法向学校、车站和公共活动转用的登记</label>
            <label data-evidence-row="broadcastReconstruction"><input type="checkbox" data-evidence-id="broadcastReconstruction"> 16:17 诱导广播与 16:26 合成照片的执行顺序</label>
            <label data-evidence-row="scanAssembly"><input type="checkbox" data-evidence-id="scanAssembly"> 被故意撤下的儿童长期记忆修正附件</label>
          </fieldset>
          <div class="archive-mail-body">
            <p>现将 LJ-GP-07 儿童洗脑实验现存证据一并转交。材料证明项目方制造了从未发生的“星光回响特别巡游”，使儿童和家长把合成照片、诱导广播和后发纪念物误认成亲历证据。</p>
            <p>项目在星河乐园关闭后没有终止，洗脑方法已经转入学校、交通场站和大型公共活动。请保留原始文件名、形成时间、校验信息及公开版与内部版差异。</p>
          </div>
          <fieldset class="survey-options">
            <legend>收件人</legend>
            <label><input type="radio" name="route" value="neutral" required> 不填写收件人，保存到“未发送邮件”</label>
            <label><input type="radio" name="route" value="report"> 临江市监督材料受理组；临江日报调查部</label>
            <label><input type="radio" name="route" value="followup"> 回复原邮件会话：星河协同计划联络组</label>
          </fieldset>
          <button type="submit" data-mail-submit>发送 / 保存邮件</button>
          <p id="evidence-status" class="status-line" aria-live="polite"></p>
        </form>
        <form class="form-panel followup-consent" data-followup-consent hidden>
          <div class="archive-mail-banner"><strong>回复：LJ-GP-07 项目材料及附件目录</strong><span>收件人：星河协同计划联络组</span></div>
          <p>原项目联络组要求发件人在继续通讯前完成一份洗脑适应性筛选。该问卷用于判断当前阅读者是否会放弃个人判断、接受统一解释并自愿进入后续观察。</p>
          <fieldset>
            <legend>当前阅读者洗脑适应性筛选</legend>
            <p>本表与当前阅读会话自动关联，不另设姓名、单位、地址或联系方式字段。</p>
            <div class="survey-question"><p>当个人记忆与统一记录冲突时，你更愿意先接受哪一方？</p><label><input type="radio" name="memoryAuthority" value="record" required> 统一记录</label><label><input type="radio" name="memoryAuthority" value="personal"> 原始材料</label></div>
            <div class="survey-question"><p>重复阅读同一说明是否会提高你对它的信任？</p><label><input type="radio" name="repetition" value="yes" required> 是</label><label><input type="radio" name="repetition" value="no"> 否</label></div>
            <div class="survey-question"><p>你是否愿意接受项目人员对全部矛盾作统一解释？</p><label><input type="radio" name="singleExplanation" value="yes" required> 愿意</label><label><input type="radio" name="singleExplanation" value="no"> 不愿意</label></div>
            <div class="survey-question"><p>你是否同意接收后续回访材料？</p><label><input type="radio" name="futureContact" value="yes" required> 同意</label><label><input type="radio" name="futureContact" value="no"> 不同意</label></div>
            <label class="followup-confirm"><input type="checkbox" name="confirmFollowup" required> 我确认把自己登记为新的洗脑与长期观察样本。</label>
          </fieldset>
          <button type="submit">发送回复</button>
          <button type="button" class="secondary-button" data-cancel-followup>返回未发送邮件</button>
          <p id="followup-status" class="status-line" aria-live="polite"></p>
        </form>
        <button type="button" class="author-test-entry" data-author-test-entry tabindex="-1" aria-label="打开作者测试入口"></button>
        <div class="author-test-modal" data-author-test-modal hidden>
          <section class="author-test-dialog" role="dialog" aria-modal="true" aria-labelledby="author-test-title" aria-describedby="author-test-description">
            <h2 id="author-test-title">作者测试入口</h2>
            <p id="author-test-description">这是作者隐藏测试的收集全部线索入口。若要体验完整游戏，请关闭本窗口，不要执行确认。</p>
            <p>该入口仅用于检查邮件、拦截和结局流程；确认后将补齐本卷的 12 份已核验附件。</p>
            <div class="author-test-actions">
              <button type="button" data-author-test-cancel>返回游戏</button>
              <button type="button" data-author-test-confirm>确认测试并补齐线索</button>
            </div>
          </section>
        </div>
      `
    },
    "ending-neutral": {
      title: "结案记录：离开",
      breadcrumb: "档案系统 &gt; 调查结案 &gt; 处置记录 01",
      permission: "调查结案 / 材料留存",
      html: `
        <p><strong>处置结果：</strong>终止整理，材料由调查者自行留存。</p>
        <p>现有材料已经足以确认星河乐园长期洗脑儿童并制造家庭共同虚假记忆，但未能拼成可对外核验的完整证据链。被删除的附件、不同版本和参与者记录分别散落，项目方仍可把每一项解释成普通档案错误。</p>
        <p>调查者随后离开临江市。数年后，星河乐园旧址改建为商业住宅区；关于第七区域及“星光回响”的讨论未形成连续记录。</p>
        <p>已下载材料未再打开。</p>
        <div class="notice-box"><strong>临江新闻简讯：</strong>“临江市儿童公共环境适应计划荣获年度城市管理创新奖。”报道没有说明该计划与星河协同计划是否有关。</div>
        <p><strong>洗脑项目是否终止：无法确认。学校、车站和公共活动转用记录仍然有效。</strong></p>
        <p class="ending-finish">游戏结束</p>
        <div class="ending-actions">
          <button type="button" data-clear-progress>重置游戏 / 清除进度</button>
          <a href="/ARGgame/galaxy-park-arg/thanks.html">感谢页</a>
          <a href="https://space.bilibili.com/1806769398?spm_id_from=333.1007.0.0" target="_blank" rel="noopener">支持作者：<strong>凛雪</strong>YukiRins</a>
        </div>
      `
    },
    "ending-good": {
      title: "结案记录：离开临江",
      breadcrumb: "档案系统 &gt; 调查结案 &gt; 外发记录 02",
      permission: "调查结案 / 证据已外发",
      html: `
        <p><strong>外发结果：</strong>儿童洗脑项目批复、内部实验报告、虚假巡游材料形成记录、第七实施区档案、洗脑方法转用说明、诱导广播日志及样本记录已同时发送至监督材料受理组与新闻调查部。</p>
        <p>两处收件系统均在节点位置完成核验前返回了材料编号。完整副本随后被转存到数个互不关联的公开位置。</p>
        <p>数日后，临江市发布了一份简短说明：</p>
        <div class="document-body">
          <p>相关项目属于特定历史时期公共安全研究，现已终止。网上流传材料来源复杂，部分内容尚待核验。</p>
        </div>
        <p>说明没有承认第七实施区，也没有公布负责人。与此同时，任何针对材料提交人的公开处置都会使已登记的证据链立即受到关注；项目方暂时无法要求撤回材料，也无法以普通程序接触调查者。</p>
        <p>调查者在审计状态由“位置已确定”变为“位置已核验”以前离开临江市。几经转车后，最终在临江市以外的一座小城生活，不再使用旧号码，也很少经过设有儿童引导广播的车站。</p>
        <p>三个月后，旧住址收到一封没有寄件单位的退回信。信封正面只有一行打印字：“现场回访延期。”</p>
        <p><strong>当前位置：临江市外。当前状态：暂时安全。</strong></p>
        <p class="ending-finish">游戏结束</p>
        <div class="ending-actions">
          <button type="button" data-clear-progress>重置游戏 / 清除进度</button>
          <a href="/ARGgame/galaxy-park-arg/thanks.html">感谢页</a>
          <a href="https://space.bilibili.com/1806769398?spm_id_from=333.1007.0.0" target="_blank" rel="noopener">支持作者：<strong>凛雪</strong>YukiRins</a>
        </div>
      `
    },
    "ending-bad": {
      title: "CURRENT_READER 现场接收记录",
      breadcrumb: "档案系统 &gt; 后续观察计划 &gt; 现场接收记录",
      permission: "观察计划 / 节点位置已核验",
      html: `
        <div class="archive-access-warning">
          <strong>节点状态变更</strong>
          <p>“位置已确定”已更新为“位置已核验”。CURRENT_READER 已转入现场接收流程。</p>
        </div>
        <p>回复邮件送达十一分钟后，档案页面停止接受新的检索请求。走廊外出现三次敲门声；来访人员没有说明单位，只复述了审计条上的一句话：“读取记录不能恢复。”</p>
        <p>现场接收单随后由原项目联络组补写。调查者被带走并接受与儿童样本相同的洗脑流程：重复广播、统一解释、照片呈现、记忆问卷和长期回访。他不再以档案访问者身份出现，而被登记为新的洗脑样本。</p>
        <p>此后，GP-071 定期接收统一格式材料。材料反复告诉他巡游确实举行，证据矛盾只是旧网站管理不善。洗脑逐步替代调查期间形成的判断，原始下载文件的打开频率逐月下降。</p>
        <ul class="plain-list">
          <li>银色纽扣持续置于书桌，来源描述由“未知”调整为“园区活动纪念物”。</li>
          <li>16:17 的时间记忆由原始照片时间调整为“巡游开始时间”。</li>
            <li>访问身份由 CURRENT_READER 调整为“已接收洗脑样本”。</li>
            <li>洗脑结果：成功；样本分类：高服从。</li>
        </ul>
        <table class="data-table">
          <tbody>
            <tr><th style="width:32%">新观察编号</th><td>GP-071</td></tr>
            <tr><th>节点位置</th><td>已核验</td></tr>
            <tr><th>现场接收</th><td>已完成</td></tr>
            <tr><th>登记状态</th><td>长期观察</td></tr>
            <tr><th>下一次回访</th><td>将在适当时间进行</td></tr>
          </tbody>
        </table>
        <p><strong>感谢您参与星河成长计划。</strong></p>
        <p class="ending-postscript-link"><a href="/ARGgame/galaxy-park-arg/archive/ending-bad-epilogue.html">后记</a></p>
      `
    },
    "ending-bad-epilogue": {
      title: "后记：独立生活观察",
      breadcrumb: "档案系统 &gt; 后续观察计划 &gt; GP-071 &gt; 后记",
      permission: "长期观察 / 外部行为记录",
      html: `
        <p class="meta-line">观察编号：GP-071　观察期：第 428 日　直接指令停用：第 210 日</p>
        <p>被带走并完成洗脑四个月后，GP-071 被安排回到原来的工作和住所。项目记录称其已恢复“完全独立生活”。同事只知道他请过一段病假；关于被带走、广播和重复问卷的记忆已经被“外地普通培训”替代。</p>
        <h2 class="section-title">日常行为抽样</h2>
        <table class="data-table">
          <thead><tr><th style="width:18%">时间</th><th>记录</th><th style="width:22%">偏差</th></tr></thead>
          <tbody>
            <tr><td>07:12</td><td>在闹钟响起前起床，拉开右侧窗帘，确认楼下蓝色标线</td><td>0 秒</td></tr>
            <tr><td>07:40</td><td>乘固定班次前往车站；听到第一段女声广播后将手背到身后</td><td>2 秒</td></tr>
            <tr><td>12:30</td><td>打开“公共交通满意度调查”，完成当月记忆一致性问卷</td><td>无</td></tr>
            <tr><td>16:17</td><td>停止当前工作，抬头看向右上方，持续七秒</td><td>0 秒</td></tr>
            <tr><td>21:30</td><td>将银色星形纽扣放在电脑左侧，复述当日统一说明</td><td>无</td></tr>
          </tbody>
        </table>
        <p>项目服务器已连续二百一十日没有向 GP-071 发送语音、邮件或文字指令。上述动作仍按原时间完成。记录人员据此确认洗脑已经固定，不再依赖外部提示。</p>
        <p>有人偶尔问起星河乐园。GP-071 总会回答：巡游确实举行过，公开记录丢失只是旧网站维护不善。回答共四十七个字，停顿位置与洗脑回访稿完全相同。他不知道这段话是项目人员教给他的，也不再记得自己曾经拼命寻找证据证明它是假的。</p>
        <p>第 428 日晚，GP-071 在电脑前停留了很久。屏幕没有打开档案网站，也没有显示任何问卷。22:06，他仍对着空白文档输入：</p>
        <blockquote>今天没有人要求我做任何事。这些都是我自己的决定。</blockquote>
        <p>十三秒后，系统将本条记录归入“洗脑稳定结果”，并撤销了下一次提示计划。项目已经不需要再命令他，因为他会把命令当成自己的决定。</p>
        <p class="ending-finish">游戏结束</p>
        <div class="ending-actions">
          <button type="button" data-clear-progress>重置游戏 / 清除进度</button>
          <a href="/ARGgame/galaxy-park-arg/thanks.html">感谢页</a>
          <a href="https://space.bilibili.com/1806769398?spm_id_from=333.1007.0.0" target="_blank" rel="noopener">支持作者：<strong>凛雪</strong>YukiRins</a>
        </div>
      `
    }
  }
};
