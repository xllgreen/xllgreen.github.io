(function () {
  'use strict';

  const GAME = window.Game;
  if (!GAME) {
    console.warn('[guidance-fix] Game 未加载，解题引导未启用。');
    return;
  }

  const GUIDE_DATA = {
    p01: {
      mode: '依次点击三个景深按钮。',
      observe: '校准卡同时给出了远处路灯、柜台相机和近处花瓶，先判断它们的远近。',
      finish: '三个进度点全部亮起后，再点“确认答案”。',
      fail: ['相机对焦通常先从远处建立基准，再逐步拉回。', '你不需要拖拽，只要按空间距离依次点击三个按钮。']
    },
    p02: {
      mode: '先点一段负片，再点灯箱槽位；负片右下角的 ↻ 可旋转。',
      observe: '先比较 A—D 的编号与四个槽位顺序，再留意哪一段人物方向与其他底片相反。',
      finish: '四个槽位均有负片，并且倒置的那一段方向修正后再确认。',
      fail: ['位置和朝向需要同时正确；只放对顺序还不够。', '放入后发现方向不对，可点该槽位把负片取回，再旋转。']
    },
    p03: {
      mode: '按照片修复的观察顺序点击三种工具，当前操作会显示在下方。',
      observe: '先让边缘纤维显形，再放大细节，最后补回缺口读取文字。',
      finish: '照片边缘出现完整地点与日期后确认。',
      fail: ['每种工具的作用有先后依赖：看不见纤维时，补边不会直接显字。', '下方“已操作”就是你的当前顺序，可据此调整。']
    },
    p04: {
      mode: '观察上方四段拖影长度，再用“短快门 / 长快门”录入四次节奏。',
      observe: '拖影较短对应短快门，明显更长的那一段对应长快门。',
      finish: '读数区出现四段节奏后确认；录错时继续点击会自动开始新一轮。',
      fail: ['不是听背景音猜答案，而是逐格对应上方拖影的长短。', '从左到右逐一记录，不要跳格。']
    },
    p05: {
      mode: '拖动曝光、对比度、阴影细节三条滑杆。',
      observe: '先恢复整体亮度，再增强灯点边界，最后找回暗部水面；画面和说明文字会实时变化。',
      finish: '下方文字变为“渡口灯点和水面反光已经恢复”后确认。',
      fail: ['不要一次同时乱调三条：建议按曝光 → 对比度 → 阴影细节逐项校准。', '目标不是单纯把数值拉满，而是让亮部与暗部同时可辨。']
    },
    p06: {
      mode: '用每条记录右侧的 ↑ ↓ 调整顺序。',
      observe: '三条记录自带时间戳，按事件实际发生时间从早到晚排列。',
      finish: '最早的事件在顶部、最晚的事件在底部后确认。',
      fail: ['这题不需要推测因果，先直接读取 20:11、20:14、20:18。', '按钮只移动一格，检查是否仍有时间倒序。']
    },
    p07: {
      mode: '点击滤镜卡片进行选择，再次点击可取消。',
      observe: '每张卡写有亮度、穿透、柔化贡献；上方三条目标值分别是 6、4、4。',
      finish: '三项数值都刚好达到目标，并只保留需要的滤镜后确认。',
      fail: ['把这题当作三列加法：先补最缺的属性，再检查是否超出。', '高反差片和雾化片很强，但可能让单项过量。']
    },
    p08: {
      mode: '点击每个节点可在“未分配 → 上层 → 下层”之间循环。',
      observe: '上层是室内投影设备到窗框的路径，下层是街道反射到渡口的路径。',
      finish: '六个节点全部分配，且两条路线各自连续后确认。',
      fail: ['先按空间位置分组：室内设备是一组，室外反射面是一组。', '如果点过头，再点一次即可继续循环，不需要重置整题。']
    },
    p09: {
      mode: '阅读每个影像层的两条物证，再从下拉框选择来源。',
      observe: '卷号、连续齿孔通常指向原始底片；遮罩编号、定位点指向拼接层；儿童相机齿孔指向童年胶片。',
      finish: 'A—F 六个影像层全部完成分类后确认。',
      fail: ['先处理证据最明确的层，再用剩余特征交叉验证。', '“原始曝光/原始卷号”和“遮罩/双层乳剂”代表两类不同制作过程。']
    },
    p10: {
      mode: '用两条滑杆调整上层底片的位置与透明度。',
      observe: '先让窗框竖线重合，再调透明度观察灯影和确认手印。',
      finish: '说明文字变为“窗框、灯影和手印已经重合”后确认。',
      fail: ['建议先只调水平位置，构图对齐后再改变透明度。', '文字反馈比凭肉眼猜数值更可靠；达到范围时会明确提示。']
    },
    p11: {
      mode: '依次点击四个节点，读数区会记录当前光路。',
      observe: '从投影机离开室内后，光要经过可反射的街道节点，再抵达靠岸点。',
      finish: '四个节点形成一条不中断的空间路径后确认。',
      fail: ['先找起点和终点，再判断中间两个反射面谁更靠前。', '输入满四步后继续点击会清空并开始新一轮。']
    },
    p12: {
      mode: '按暗房处理流程依次点击三种液体。',
      observe: '影像需要先出现、再稳定，最后才能清洗残留药液。',
      finish: '相纸出现童年身影并显示完整三步后确认。',
      fail: ['顺序依据每一步的功能，而不是托盘在画面中的位置。', '下方“步骤”会保留最近三次操作，可直接检查。']
    }
  };

  const failureCount = Object.create(null);
  let lastPid = null;

  function getGuideElement() {
    let guide = document.getElementById('task-guide');
    const desc = document.getElementById('objective-desc');
    if (!guide && desc) {
      guide = document.createElement('section');
      guide.id = 'task-guide';
      guide.className = 'task-guide';
      guide.setAttribute('aria-live', 'polite');
      desc.insertAdjacentElement('afterend', guide);
    }
    return guide;
  }

  function renderGuide(pid, feedback) {
    const guide = getGuideElement();
    if (!guide) return;
    const data = GUIDE_DATA[pid];
    if (!data) {
      guide.hidden = true;
      guide.innerHTML = '';
      return;
    }
    const tries = failureCount[pid] || 0;
    const failText = feedback || (tries > 0 ? data.fail[Math.min(tries - 1, data.fail.length - 1)] : '先按下面三步试一次；无需先打开完整提示。');
    guide.hidden = false;
    guide.dataset.pid = pid;
    guide.innerHTML = `
      <div class="task-guide__head">
        <span class="task-guide__eyebrow">本题怎么开始</span>
        <span class="task-guide__code">${pid.toUpperCase()}</span>
      </div>
      <ol class="task-guide__steps">
        <li><b>怎么操作</b><span>${data.mode}</span></li>
        <li><b>观察什么</b><span>${data.observe}</span></li>
        <li><b>何时确认</b><span>${data.finish}</span></li>
      </ol>
      <div class="task-guide__feedback ${tries ? 'is-active' : ''}">
        <b>${tries ? `第 ${tries} 次校验后的方向` : '起步建议'}</b>
        <span>${failText}</span>
      </div>`;
    const root = document.getElementById('puzzle-root');
    if (root) root.setAttribute('aria-describedby', 'task-guide');
  }

  function annotatePuzzle(pid) {
    const root = document.getElementById('puzzle-root');
    if (!root || !GUIDE_DATA[pid]) return;
    const controls = root.querySelectorAll('button, select, input[type="range"], [draggable="true"], [data-slot]');
    controls.forEach((el, index) => {
      el.classList.add('guided-control');
      if (!el.getAttribute('aria-label') && !el.textContent.trim()) {
        el.setAttribute('aria-label', `本题可操作控件 ${index + 1}`);
      }
    });
    const card = root.querySelector('.puzzle-card');
    if (card) card.classList.add('guided-puzzle-card');
  }

  const originalRenderStage = GAME.renderStage;
  GAME.renderStage = function () {
    const result = originalRenderStage.apply(this, arguments);
    const pid = this.currentPuzzle;
    if (pid !== lastPid) lastPid = pid;
    renderGuide(pid);
    annotatePuzzle(pid);
    if (pid && this.dialogue_text) {
      this.dialogue_text.textContent = '先看右侧“本题怎么开始”：观察线索、操作高亮控件，完成后再确认答案。';
    }
    return result;
  };

  const originalRenderPuzzle = GAME.renderPuzzle;
  GAME.renderPuzzle = function (pid) {
    const result = originalRenderPuzzle.apply(this, arguments);
    renderGuide(pid);
    annotatePuzzle(pid);
    return result;
  };

  const originalCheckPuzzle = GAME.checkPuzzle;
  GAME.checkPuzzle = function (pid) {
    const before = !!this.state.completedPuzzles[pid];
    const result = originalCheckPuzzle.apply(this, arguments);
    const solved = !!this.state.completedPuzzles[pid];
    if (!before && !solved) {
      failureCount[pid] = (failureCount[pid] || 0) + 1;
      const data = GUIDE_DATA[pid];
      renderGuide(pid, data && data.fail[Math.min(failureCount[pid] - 1, data.fail.length - 1)]);
      const guide = getGuideElement();
      if (guide) {
        guide.classList.remove('guide-nudge');
        void guide.offsetWidth;
        guide.classList.add('guide-nudge');
      }
    }
    return result;
  };

  const originalReset = GAME.resetCurrentPuzzle;
  GAME.resetCurrentPuzzle = function () {
    const pid = this.currentPuzzle;
    if (pid) failureCount[pid] = 0;
    const result = originalReset.apply(this, arguments);
    renderGuide(pid, '本题已重置。先重新观察线索，再按操作说明逐步完成。');
    annotatePuzzle(pid);
    return result;
  };

  const originalHintProgress = GAME.hintProgress;
  GAME.hintProgress = function (pid) {
    const p = this.state.puzzleState[pid] || {};
    if (pid === 'p03' || pid === 'p12') return `已执行 ${(p.steps || []).length}/3 个处理步骤。`;
    if (pid === 'p09') return `已判断 ${Object.values(p.ans || {}).filter(Boolean).length}/6 个影像层。`;
    return originalHintProgress.apply(this, arguments);
  };

  document.addEventListener('DOMContentLoaded', function () {
    const guide = getGuideElement();
    if (guide && !GAME.currentPuzzle) guide.hidden = true;
  });
})();
