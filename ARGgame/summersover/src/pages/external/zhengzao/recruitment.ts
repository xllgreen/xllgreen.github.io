/**
 * 正造地产集团招聘公告列表 — 页面㉖
 * 外部线索页 · 仿企业官网子页面
 *
 * 列表中的"2013年度行政助理招聘"可点击 → ㉗
 * 该详情页包含周经理邮箱后半段 @zhengzao.com.cn
 */

import { addPathLog } from '../../../shared/state'

function init(): void {
  addPathLog('进入外部页面: 正造集团招聘公告列表')

  // 2013年度行政助理招聘 → ㉗
  const link2013 = document.getElementById('recruit-2013-link')
  if (link2013) {
    link2013.addEventListener('click', (e) => {
      e.preventDefault()
      addPathLog('正造招聘 → 2013年行政助理详情')
      window.open('/external/zhengzao/recruitment-2013.html', '_blank')
    })
  }
}

document.addEventListener('DOMContentLoaded', init)
