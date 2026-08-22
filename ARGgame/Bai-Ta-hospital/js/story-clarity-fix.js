(() => {
  'use strict';
  const D = window.GAME_DATA;
  if (!D) return;

  const e = D.evidence || {};
  if (e.e12) e.e12.desc = '00:17的呼叫仍从B7-0发出。结合后续身份核验，可确认顾青禾当时还在房内且仍活着；她并没有随林祈一起离院。';
  if (e.e18) e.e18.desc = '版本链显示两段不同目的的修改：杜蓉先处理身份与转运准备；赵秉文随后跨系统改动死亡、门禁与公开通报。两人的行为不能合并成同一个计划。';
  if (e.e19) e.e19.desc = '赵秉文管理员账号在00:23后的关键十分钟内跨系统介入病历、门禁与通报字段。日志能证明操作范围；其目的仍需结合项目审批与公开叙事判断。';
  if (e.e21) {
    e.e21.name = '顾青禾未寄便笺与证词';
    e.e21.desc = '顾青禾写明，她答应做的是一次短暂身份掩护：让林祈先离开，之后再由同伴回来开门。她没有把自己的死亡当作交换条件。';
  }

  if (D.hints?.p9?.length >= 3) {
    D.hints.p9[1] = '先用值班表把账号映射到人物，再比较字段变化。杜蓉只改身份与离院准备；赵秉文在00:23后继续修改死亡、门禁与官网。两段操作的时间、权限与目的不同。';
  }
  if (D.hints?.p11?.length >= 3) {
    D.hints.p11[0] = '最终答案不是找一个“坏人”，也不是“一命换一命”。先区分临时身份掩护的原计划、顾青禾后来求救的事实，以及00:23后跨系统掩盖是谁完成的。';
    D.hints.p11[1] = 'B7-0原患者是林祈，00:27离院者也是林祈；死在B7-0的是顾青禾。00:17的SOS说明顾青禾原本仍在等待被放出，而不是计划中的牺牲者。';
    D.hints.p11[2] = '六个姓名依次填写：林祈、林祈、顾青禾、杜蓉、赵秉文、赵秉文。目的写“救出林祈”。公开方式建议保护林祈现身份；赵秉文为何阻止，可结合三次终止申请、项目负责人身份和00:23后的跨系统操作推断。';
  }

  const q = (s, r = document) => r.querySelector(s);
  const page = q('#pageView');
  const pageTitle = q('#pageTitle');
  const endingContent = q('#endingContent');
  if (!page || !pageTitle) return;

  function section(id, eyebrow, title, html, tone = '') {
    const n = document.createElement('section');
    n.id = id;
    n.className = `story-bridge ${tone}`.trim();
    n.innerHTML = `<div class="story-bridge-head"><span>${eyebrow}</span><h3>${title}</h3></div><div class="story-bridge-body">${html}</div>`;
    return n;
  }

  function addMotive() {
    if (!/电子病历/.test(pageTitle.textContent) || q('#storyMotiveBridge', page)) return;
    page.appendChild(section('storyMotiveBridge','恢复附件 · 护理申请','三次终止申请',`
      <div class="story-request-list">
        <p><b>第一次</b><span>申请暂停夜间刺激，改为常规观察。</span><em>驳回：数据完整性</em></p>
        <p><b>第二次</b><span>再次申请，备注“对象拒绝继续配合”。</span><em>驳回：数据完整性</em></p>
        <p><b>第三次</b><span>申请终止项目内夜间刺激。</span><em>驳回：数据完整性</em></p>
      </div>
      <p class="story-boundary">记录只能证明：杜蓉先连续尝试过正规停止流程，而且三次都没有获准。它还不能证明她之后具体做了什么。</p>`));
  }

  function addQingheNote() {
    if (!/交班版本库/.test(pageTitle.textContent) || q('#storyQingheBridge', page)) return;
    if (!q('.success-box', page)) return;
    page.appendChild(section('storyQingheBridge','未归档附件 · 草稿未发送','顾青禾留下的一段话',`
      <blockquote class="story-note">“我只替她在里面待十分钟。你先把她送出去，确认她离开以后再回来开门。呼叫线我会留着。别把我算进病人名单。”</blockquote>
      <p class="story-note-sign">—— 青禾</p>
      <p class="story-boundary">这张便笺把“计划”和“结果”分开：顾青禾同意的是短暂掩护，不是用自己的死亡换林祈离开。</p>`,'story-paper'));
  }

  function addEndingRecap() {
    if (!endingContent || !endingContent.textContent.trim() || q('#storyEndingRecap', endingContent)) return;
    endingContent.appendChild(section('storyEndingRecap','结案复核 · 00:17—00:27','这十分钟里真正发生了什么',`
      <div class="story-cause-grid">
        <article><h4>为什么要救林祈？</h4><p>林祈17岁，被放在公开床位之外的B7-0接受“夜间刺激观察”。杜蓉连续照护37天，并三次申请停止夜间刺激；审批方每次都以“数据完整性”为由拒绝。能确认的是：她先尝试了正规停止流程，失败后才走向违规转运。</p></article>
        <article><h4>为什么顾青禾会留下？</h4><p>她答应的是临时身份掩护：林祈穿备用护士服离开，她短暂留在B7-0维持“房里仍有人”的假象，等林祈安全出去后再开门。00:17仍有SOS与O₂呼叫，说明她当时正在等救援，而不是准备牺牲。</p></article>
        <article><h4>赵秉文为什么阻止？</h4><p><b>可确认：</b>00:23后，他的管理员账号开始跨病历、门禁和通报系统改写记录，并与后续供氧中断处于同一关键时间窗。</p><p><b>合理推断：</b>结合他是项目负责人、停止申请此前持续被项目审批链拒绝，林祈活着离开会让“B7-0”和未公开项目本身暴露，因此他选择把离院与死亡重新包装成另一套公开叙事。</p></article>
      </div>
      <div class="story-timeline">
        <div><b>00:17</b><span>顾青禾仍在B7-0呼叫：SOS / B70 / O₂</span></div>
        <div><b>00:21</b><span>洗衣梯活动进入真实时间窗</span></div>
        <div><b>00:23</b><span>管理员账号开始跨系统介入</span></div>
        <div><b>00:25</b><span>供氧异常发生</span></div>
        <div><b>00:27</b><span>大厅监控拍到真正离院的林祈</span></div>
      </div>
      <p class="story-final-line"><strong>所以这不是“让青禾死掉，才能救林祈”。</strong>原计划是两个人都活下来；顾青禾的死亡，是十分钟掩护计划被发现并被人为掩盖后产生的悲剧。</p>`,'story-ending'));
  }

  let raf = 0;
  function schedule() {
    if (raf) return;
    raf = requestAnimationFrame(() => { raf = 0; addMotive(); addQingheNote(); addEndingRecap(); });
  }

  new MutationObserver(schedule).observe(page, { childList: true, subtree: false });
  new MutationObserver(schedule).observe(pageTitle, { childList: true, characterData: true, subtree: true });
  if (endingContent) new MutationObserver(schedule).observe(endingContent, { childList: true, subtree: false });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) schedule(); }, { passive: true });
  schedule();
})();
