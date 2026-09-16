# GitHub Pages 发布与仓库展示设计

## 目标

让 LangShift 学习工作台可以从 GitHub 仓库自动构建并发布到 GitHub Pages，同时补齐仓库首页的项目说明、在线入口、协作说明和基础 CI，让 GitHub 仓库对访问者一眼可理解、可运行、可参与。

## 背景与现状

- 代码仓库为公开 GitHub 仓库 `aizzyyc/ts-to-py-cpp`，默认分支为 `main`。
- 项目是 Astro 静态站点，使用 MDX 课程内容、Pagefind 搜索和浏览器端本地进度保存。
- 当前仓库已经可以本地构建，但尚未配置 GitHub Pages 自动发布。
- GitHub About 区域目前没有 description、website 和 topics。
- 项目不需要后端、账号系统、在线代码执行或运行时密钥。

## 方案

### 站点发布

使用官方 GitHub Pages Actions 流程：`main` 分支推送或手动触发时，在 Ubuntu runner 上安装 Node.js 依赖，执行测试、Astro 检查和生产构建，然后将 `dist` 上传为 Pages artifact，由 Pages 环境发布。

站点使用固定地址 `https://aizzyyc.github.io/ts-to-py-cpp/`。Astro 配置同时设置 `site` 和 `base`，让静态资源、内部链接和 Pagefind 在仓库子路径下生成正确地址。

### 质量门禁

部署 job 依赖 build job；只有 `npm test`、`npm run check` 和 `npm run build` 全部成功时才会发布。工作流启用并发取消，避免旧构建覆盖最新提交。权限只授予读取代码、写入 Pages 和 OIDC 部署所需权限。

### 仓库展示

README 增加 GitHub Pages 在线入口、自动部署说明、常用检查和贡献入口，并明确这是静态课程项目及其边界。仓库 About 使用一条中文简介、Pages 地址和能准确描述项目的主题标签；不创建没有版本内容的 Release 或 Package。

## 文件边界

- `astro.config.mjs`：增加站点正式地址与仓库子路径。
- `.github/workflows/deploy.yml`：执行测试、检查、构建和 GitHub Pages 发布。
- `README.md`：补充在线访问、GitHub Actions、贡献和仓库状态说明。
- `tasks/todo.md`：记录本轮发布配置与验证结果。

不新增应用后端，不引入新的运行时依赖，不把用户代码发送到外部服务，也不提交 token、密钥或本地环境文件。

## 验收标准

1. `npm test`、`npm run check` 和 `npm run build` 本地通过。
2. GitHub Actions 工作流语法和构建步骤与本地脚本一致。
3. Pages 发布后首页、`/learn`、课程详情和搜索页面可以通过正式 URL 访问，资源路径不返回 404。
4. GitHub About 显示 description、website 和 topics，website 指向正式 Pages 地址。
5. 本地工作区干净，远端 `main` 与本次发布提交一致。
