const search = document.querySelector('.search');
search?.addEventListener('submit', (event) => {
  const input = search.querySelector('input');
  const value = input.value.trim();
  if (!value) { event.preventDefault(); input.focus(); }
});

// 本地模板只处理页面跳转，不发送网络请求。
if (location.protocol === 'file:') {
  document.documentElement.dataset.local = 'true';
}

// 大屏自适应：窗口宽度超过设计宽度(1160px)时，整页等比放大铺满屏幕
// （保持原布局比例，两侧不留白；小屏仍走响应式断点，不缩放）
const shell = document.querySelector('.page-shell');
const BASE_W = 1160;
const MAX_ZOOM = 1.8;
const SIDE_GAP = 40; // 大屏放大时两侧各留 40px 空隙
function fitScreen() {
  if (!shell) return;
  const w = document.documentElement.clientWidth;
  if (w <= BASE_W) { shell.style.zoom = '1'; return; }
  const zoom = Math.min(MAX_ZOOM, (w - SIDE_GAP * 2) / BASE_W);
  shell.style.zoom = String(zoom);
}
fitScreen();
window.addEventListener('resize', fitScreen);

// 手机端导航默认居中：窄屏横向滚动时内容居中显示，末尾"三下乡专题"入口完整可见
const mainNav = document.querySelector('.main-nav');
if (mainNav && mainNav.scrollWidth > mainNav.clientWidth) {
  mainNav.scrollLeft = (mainNav.scrollWidth - mainNav.clientWidth) / 2;
}

// 回到顶部按钮（所有页面自动注入）
const backTop = document.createElement('button');
backTop.type = 'button';
backTop.className = 'back-top';
backTop.setAttribute('aria-label', '回到顶部');
backTop.textContent = '↑';
backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
document.body.appendChild(backTop);
window.addEventListener('scroll', () => {
  backTop.classList.toggle('show', window.scrollY > 600);
}, { passive: true });

// 图片灯箱：点击页面里的图片放大查看，Esc 或点击关闭
const lbox = document.createElement('div');
lbox.className = 'lbox';
lbox.setAttribute('role', 'dialog');
lbox.setAttribute('aria-label', '图片放大查看');
document.body.appendChild(lbox);
document.addEventListener('click', (e) => {
  const img = e.target.closest('.photo img');
  if (img) {
    lbox.innerHTML = '<img src="' + img.src + '" alt="">';
    lbox.classList.add('open');
  } else if (e.target === lbox || lbox.contains(e.target)) {
    lbox.classList.remove('open');
  }
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') lbox.classList.remove('open');
});
