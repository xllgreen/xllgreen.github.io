/* ===== 站点增强脚本（搜索 / 回到顶部 / 打字机 / 工具箱） ===== */

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

/* ---- 工具箱 ---- */
function initTools() {
    if (typeof window.__toolsInited !== 'undefined') return;
    window.__toolsInited = true;

    // JSON 格式化 / 压缩
    var jin = document.getElementById('jsonInput');
    var jout = document.getElementById('jsonOutput');
    if (jin && jout) {
        document.getElementById('jsonFormat').onclick = function () {
            try { jout.textContent = JSON.stringify(JSON.parse(jin.value), null, 4); }
            catch (e) { jout.textContent = '解析错误：' + e.message; }
        };
        document.getElementById('jsonMinify').onclick = function () {
            try { jout.textContent = JSON.stringify(JSON.parse(jin.value)); }
            catch (e) { jout.textContent = '解析错误：' + e.message; }
        };
    }

    // Base64
    var bIn = document.getElementById('b64Input');
    var bOut = document.getElementById('b64Output');
    if (bIn && bOut) {
        var enc = function () {
            try {
                var u = bIn.value;
                bOut.textContent = (typeof TextEncoder !== 'undefined')
                    ? btoa(String.fromCharCode.apply(null, new TextEncoder().encode(u)))
                    : btoa(unescape(encodeURIComponent(u)));
            } catch (e) { bOut.textContent = '编码错误'; }
        };
        var dec = function () {
            try {
                var s = atob(bIn.value.trim());
                try { bOut.textContent = decodeURIComponent(escape(s)); }
                catch (e) { bOut.textContent = s; }
            } catch (e) { bOut.textContent = '解码错误：不是合法的 Base64'; }
        };
        document.getElementById('b64Encode').onclick = enc;
        document.getElementById('b64Decode').onclick = dec;
    }

    // 时间戳
    var tsIn = document.getElementById('tsInput');
    var tsOut = document.getElementById('tsOutput');
    if (tsIn && tsOut) {
        document.getElementById('tsToDate').onclick = function () {
            var v = tsIn.value.trim();
            if (!v) { tsOut.textContent = '请输入时间戳'; return; }
            var ms = v.length > 10 ? parseInt(v, 10) : parseInt(v, 10) * 1000;
            var d = new Date(ms);
            if (isNaN(d)) { tsOut.textContent = '无效时间戳'; return; }
            tsOut.textContent = d.toLocaleString() + '\n(UTC: ' + d.toUTCString() + ')';
        };
        document.getElementById('tsNow').onclick = function () {
            tsOut.textContent = '当前秒级：' + Math.floor(Date.now() / 1000) +
                '\n当前毫秒级：' + Date.now();
        };
        document.getElementById('dateToTs').onclick = function () {
            var v = tsIn.value.trim();
            if (!v) { tsOut.textContent = '请输入日期，如 2026-08-06 12:00:00'; return; }
            var d = new Date(v.replace(' ', 'T'));
            if (isNaN(d)) { tsOut.textContent = '无效日期'; return; }
            tsOut.textContent = '秒级：' + Math.floor(d.getTime() / 1000) +
                '\n毫秒级：' + d.getTime();
        };
    }

    // 二维码
    var qrIn = document.getElementById('qrInput');
    var qrBox = document.getElementById('qrcodeBox');
    if (qrIn && qrBox && typeof QRCode !== 'undefined') {
        document.getElementById('qrGen').onclick = function () {
            qrBox.innerHTML = '';
            new QRCode(qrBox, {
                text: qrIn.value || 'https://blog.medicalstu.cn',
                width: 200, height: 200, correctLevel: QRCode.CorrectLevel.M
            });
        };
    }

    // Markdown 预览
    var mdIn = document.getElementById('mdInput');
    var mdOut = document.getElementById('mdPreview');
    if (mdIn && mdOut && typeof marked !== 'undefined') {
        var render = function () { mdOut.innerHTML = marked.parse(mdIn.value); };
        mdIn.addEventListener('input', render);
        render();
    }
}

/* ---- 启动 ---- */
document.addEventListener('DOMContentLoaded', function () {
    initSearch();
    initBackToTop();
    initTypewriter();
    initTools();
});
