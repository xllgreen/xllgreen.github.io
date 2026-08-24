# Medicalstu's Blog

个人主页与资源导航站点，主要提供个人信息展示、应用下载、医学技能资源、软件目录、在线工具和 ARG 游戏等内容。

## 在线访问

- 主页：<https://blog.medicalstu.cn/>
- GitHub：<https://github.com/xllgreen>

## 项目内容

- 个人主页与站点导航
- 应用下载与官方下载器
- 医学 Skills 资源下载
- 软件资源目录
- 在线工具集合
- AI PriceHub
- ARG 游戏项目
- 关于、反馈、隐私政策和使用条款等页面

## 目录结构

```text
.
├── index.html                 # 站点首页
├── Application.html           # 应用下载页
├── Skill.html                # 医学 Skills 下载页
├── Softwarebase.html         # 软件资源首页
├── tools.html                # 在线工具首页
├── ARG.html                  # ARG 项目入口
├── ARGgame/                  # ARG 游戏及其资源
├── Softwarebase/             # 软件详情页
├── tools/                    # 工具详情页
├── SkillPage/                # Skills 详情页
├── static/                   # 样式、脚本、字体和图片资源
├── assets/                   # 通用静态资源
├── worker/                   # Worker 页面及相关资源
├── _cache/                   # 项目生成或缓存数据
├── CNAME                     # 自定义域名配置
└── robots.txt                # 搜索引擎抓取规则
```

## 本地预览

项目不依赖构建工具，使用任意静态文件服务器即可预览。进入仓库根目录后执行：

```bash
python -m http.server 8000
```

然后访问 <http://localhost:8000/>。

也可以直接在浏览器中打开 `index.html`，但使用静态服务器更接近线上环境，并能正确处理绝对路径资源。

## 发布方式

项目适合部署到 GitHub Pages 或其他静态网站托管服务。发布时请确保：

1. 保留根目录结构以及 `static/`、`assets/` 等资源目录。
2. 将站点入口设置为根目录下的 `index.html`。
3. 如需使用自定义域名，保留并修改 `CNAME` 文件。
4. 检查页面中引用的外部链接、下载地址和资源路径是否仍然有效。

当前 `CNAME` 配置的域名为 `blog.medicalstu.cn`。

## 更新说明

### 2026-08-24

- 新增项目根目录 `README.md`。
- 补充项目简介、主要功能和目录结构说明。
- 补充本地预览、静态网站发布及自定义域名配置说明。
- 补充项目维护、安全和许可相关说明。

后续更新建议按照以下格式追加，便于记录每次版本变化：

```markdown
### YYYY-MM-DD

- 新增：
- 优化：
- 修复：
- 移除：
```

## 维护说明

- 页面主要使用 HTML、CSS 和 JavaScript 编写。
- 新增页面后，应同步更新首页导航或对应的资源目录入口。
- 修改公共样式或脚本前，请检查首页以及主要子页面的显示效果。
- 不要将账号密码、私钥或其他敏感信息提交到仓库。
- 安全问题请参考 [SECURITY.md](SECURITY.md) 中的说明。

## 许可

本仓库未声明统一的开源许可证。除非文件或资源另有说明，站点内容、图片和代码的使用请先取得作者许可。
