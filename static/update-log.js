(function loadUpdateLog() {
    var list = document.getElementById('updateLogList');
    var status = document.getElementById('updateLogStatus');
    if (!list || !status) return;

    fetch('/static/update-log.json', { cache: 'no-store' })
        .then(function (response) {
            if (!response.ok) throw new Error('update log unavailable');
            return response.json();
        })
        .then(function (data) {
            var entries = Array.isArray(data.entries) ? data.entries : [];
            if (!entries.length) {
                status.textContent = '暂无更新记录';
                return;
            }
            status.textContent = '自动记录最近的站点提交';
            list.innerHTML = entries.map(function (entry) {
                var item = document.createElement('a');
                item.className = 'projectItem updateLogItem';
                item.target = '_blank';
                item.rel = 'noopener';
                item.href = entry.url;
                item.innerHTML = '<div class="projectItemLeft"><h1></h1><p></p></div>';
                item.querySelector('h1').textContent = entry.message;
                item.querySelector('p').textContent = entry.date + ' · ' + entry.author + ' · ' + entry.commit;
                return item.outerHTML;
            }).join('');
        })
        .catch(function () {
            status.textContent = '更新日志暂时无法加载';
        });
})();
