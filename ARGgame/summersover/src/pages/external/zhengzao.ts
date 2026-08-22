/**
 * 正造地产集团官网 — 页面㉕
 * 外部线索页 · 仿企业官网
 *
 * 搜索"正造集团"或"正造地产集团"触发。
 * 底部导航含招聘公告链接 → ㉖
 */

import { addPathLog } from '../../shared/state'

function init(): void {
  addPathLog('进入外部页面: 正造集团官网')

  // 招聘公告链接 → ㉖
  const recruitLinks = [
    document.getElementById('nav-recruit'),
    document.getElementById('recruit-btn'),
    document.getElementById('footer-recruit-link'),
  ]

  recruitLinks.forEach(link => {
    if (link) {
      link.addEventListener('click', (e) => {
        e.preventDefault()
        addPathLog('正造集团官网 → 招聘公告')
        window.open('/external/zhengzao/recruitment.html', '_blank')
      })
    }
  })
}

document.addEventListener('DOMContentLoaded', init)
