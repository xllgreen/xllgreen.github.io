/* ===== 站点增强脚本（搜索 / 回到顶部 / 打字机） ===== */

/* ---- 站内搜索 ----
 * 首页 / 项目页：过滤 .projectItem 卡片
 * 软件详情页（存在 .soft-panel）：过滤下载项 .dl-row 与安装教程 .tut-block，
 *   使在软件页搜索也能命中版本号 / 教程标题，而不只是底部通用项目卡片 */
function initSearch() {
    var box = document.getElementById('siteSearch');
    if (!box) return;
    var emptyTip = document.getElementById('searchEmpty');
    var isSoft = !!document.querySelector('.soft-panel');
    box.addEventListener('input', function () {
        var kw = box.value.trim().toLowerCase();
        var targets;
        if (isSoft) {
            targets = Array.prototype.slice.call(
                document.querySelectorAll('.dl-row, .tut-block')
            );
        } else {
            targets = Array.prototype.slice.call(
                document.querySelectorAll('.projectItem')
            );
        }
        var shown = 0;
        targets.forEach(function (it) {
            var text = (it.innerText || it.textContent || '').toLowerCase();
            if (!kw || text.indexOf(kw) !== -1) {
                it.style.display = '';
                shown++;
            } else {
                it.style.display = 'none';
            }
        });
        if (emptyTip) emptyTip.style.display = (kw && shown === 0) ? 'block' : 'none';
    });
}

/* ---- 回到顶部 ---- */
function initBackToTop() {
    var btn = document.getElementById('backToTop');
    if (!btn) return;
    window.addEventListener('scroll', function () {
        if (window.scrollY > window.innerHeight) btn.classList.add('show');
        else btn.classList.remove('show');
    });
    btn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* ---- 关于页打字机 ---- */
function initTypewriter() {
    var el = document.getElementById('typewriter');
    if (!el) return;
    var text = el.getAttribute('data-text') || el.textContent;
    el.textContent = '';
    var i = 0;
    function type() {
        if (i <= text.length) {
            el.textContent = text.slice(0, i);
            i++;
            setTimeout(type, 38);
        } else {
            el.classList.remove('type-line');
        }
    }
    setTimeout(type, 400);
}

/* ---- 启动 ---- */
document.addEventListener('DOMContentLoaded', function () {
    initSearch();
    initBackToTop();
    initTypewriter();
});
