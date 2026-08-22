/**
 * 徐山失踪档案 — 页面㉔
 * 外部线索页 · 仿警方档案页面
 *
 * 搜索"徐山"触发，仿公安系统失踪人员档案页面。
 */

import { addPathLog } from '../../shared/state'

function init(): void {
  addPathLog('进入外部页面: 徐山失踪档案')

  // 点击导航链接不产生实际跳转（模拟静态页面）
  document.querySelectorAll('#nav-bar a, #breadcrumb-bar a').forEach(el => {
    el.addEventListener('click', (e) => e.preventDefault())
  })
}

document.addEventListener('DOMContentLoaded', init)
