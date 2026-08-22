# 《松峰岭小屋》网页解谜游戏

静态网页作品，入口文件为 `index.html`。本作采用扁平化文件结构，所有 HTML / CSS / JS / 图片文件均位于同一目录，不依赖 `assets` 文件夹。

## 玩法与付款说明

- 主题：建军纪念题材第一人称遗物整理解谜。
- 流程：小屋门前 → 主屋旧桌 → 炕边木箱 → 里间壁柜 → 窗前供桌 → 结局与黑白滚动献词。
- 付款系统：沿用《潮汐福利院》的前端打赏浮层与本地三重记录逻辑，文案与存储 key 已适配《松峰岭小屋》。
- 本地运行：直接双击 `index.html`，或用任意静态服务器打开。

## 历史图片来源与许可

以下图片用于游戏结尾黑白滚动字幕。为避免版权争议，历史素材仅采用 Commons 文件页明确标注为 Public domain 或 CC0 的公开发布素材；图片在画面中以灰度滤镜呈现，出处与许可如下。`history-nanchang.png` 与 `history-longmarch.png` 是从对应 Commons 文件页加载的原图预览截取而成，用于规避下载限流，不是 AI 生成图。

| 本地文件 | 内容 | 来源页面 | 作者/上传者 | 许可 |
| --- | --- | --- | --- | --- |
| `history-nanchang.png` | 1927 年南昌起义时期朱德历史照片 | https://commons.wikimedia.org/wiki/File:Zhu_De_1927.jpg | Unknown author | Public domain |
| `history-longmarch.png` | 红二、六军团长征历史照片 | https://commons.wikimedia.org/wiki/File:Hongerliujuntuan.jpg | Unknown author；来源说明为《中国人民解放军历史资料丛书编审委员会编. 红军长征 图片. 北京：解放军出版社, 1993》 | Public domain |
| `history-anti-japanese.jpg` | 八路军在浮图峪长城作战，1938 | https://commons.wikimedia.org/wiki/File:Eighth_Route_Army_fighting_on_Futuyu_Great_Wall,_1938.jpg | Sha Fei | Public domain |
| `history-liberation.jpg` | 人民解放军占领南京总统府，1949 | https://commons.wikimedia.org/wiki/File:People%27s_Liberation_Army_occupied_the_presidential_palace_1949.jpg | 邹健东 / Zou Jiandong | Public domain |
| `history-korea.jpg` | 中国人民志愿军抗美援朝相关历史照片，约 1951 | https://commons.wikimedia.org/wiki/File:People%27s_Volunteer_Army_landing_unit_uses_firepower_to_block_the_reinforcement_of_enemy_ships_and_cover_the_landing_of_arriving_troops_after_capturing_the_commanding_heights_of_a_western_Korean_island,_c._1951.jpg | Unknown author | Public domain |
| `history-rescue.jpg` | 四川地震后人民军队救援场景 | https://commons.wikimedia.org/wiki/File:PLA_Relief_Work_After_Sichuan_Earthquake_(9885612553).jpg | Gary Todd from Xinzheng, China | CC0 |

## QA 重点

- 使用浏览器自动化走通普通结局、真相结局和完美结局。
- 检查付款浮层显示、确认支持按钮、本地存档、重置存档。
- 检查历史图片加载、黑白滚动字幕启动、README 来源标注。
