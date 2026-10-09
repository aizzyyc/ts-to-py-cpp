# JS/TS → Python/C++ 学习网站实施清单

- [x] 初始化 Astro + TypeScript + MDX 项目基础
- [x] 先写并验证进度与课程数据的失败测试
- [x] 实现课程内容集合、92 节课程和路线元数据
- [x] 实现首页、路线总览、课程详情和响应式工作台
- [x] 实现代码对照、练习、答案展开和代码复制交互
- [x] 实现 localStorage 进度保存及不可用时的会话降级
- [x] 接入 Pagefind 静态搜索构建流程
- [x] 运行类型检查、单元测试、生产构建和页面验收

## 本轮扩展：按内容密度扩展 92 节详细课程、路线筛选与搜索

- [x] 用回归测试锁定 92 节课程、目标路线筛选和关键词搜索行为
- [x] 扩展课程元数据为 26 节迁移基础、30 节 Python、36 节 C++
- [x] 为新增课程补齐可阅读、可对照、可练习的详细 MDX 内容
- [x] 让 AI / 机器人选择只显示共用基础与对应路线
- [x] 修复开发环境和生产环境都可用的课程搜索
- [x] 完成类型检查、测试、生产构建和浏览器验收

## Review

- Implemented the LangShift Astro + MDX static learning workbench.
- `npm run check`: 0 errors, 0 warnings, 0 hints.
- `npm test`: 14/14 passing.
- `npm run build`: 95 static pages built and 95 Pagefind pages indexed.
- Dev server: `http://127.0.0.1:4321/` returns HTTP 200 and is open in the preview browser.
- Fixed MDX runtime component imports and the generated Pagefind module type-check exception.
- Fixed `/learn` overlap by adding the missing `.learn-layout` grid and mobile single-column rule; added `tests/layout.test.ts` regression coverage.
- No Git repository exists in this workspace yet; no commit or push was performed.

## 本轮 Review

- 课程目录为 92 节：26 节迁移基础、30 节 Python / AI、36 节 C++ / Robotics。
- 每节课程均通过结构验收，包含对照代码、关键概念、练习、提示/答案和结论；Python 路线补入 NumPy、pandas、scikit-learn、PyTorch 与服务化，C++ 路线补入现代 C++、CMake 和 ROS 2 通信/仿真/诊断。
- `npm test`：14/14 通过；`npm run check`：0 errors / 0 warnings / 0 hints；`npm run build`：95 个静态页面构建，Pagefind 索引 95 个页面。
- 每节 MDX 均包含 JS/TS 对照、关键概念、练习、提示或答案，以及可展开的解决方案结构。
- AI 路线只显示迁移基础与 Python；机器人路线只显示迁移基础与 C++；可恢复查看全部路线。
- 搜索改为内置静态索引 + 浏览器端即时匹配，支持中文概念、英文代码术语、URL 查询参数和键盘提交。
- `npm run check`: 0 errors, 0 warnings, 0 hints；`npm test`: 14/14 passing；`npm run build`: 95 pages and Pagefind index built successfully。
- 浏览器已验证搜索结果、路线筛选和新增 Python 课程详情页；无新增页面错误。

## 下一轮范围修正

- [x] 确认课程数量按内容密度调整，不机械限制为每条路线 30 节
- [x] 调研 Python、AI、现代 C++、CMake 和 ROS 2 的官方学习资料
- [x] 重新编排迁移基础 26 节、Python / AI 30 节、C++ / Robotics 36 节
- [x] 扩展 62 节课程内容并按路线统计验收

## 本轮修正：路径隔离与语言专属迁移基础

- [x] 复现当前路径仍显示共用基础的根因，并先更新回归测试
- [x] 将 AI 路径改为只展示 Python，机器人路径改为只展示 C++
- [x] 在 Python / C++ 路线中明确标出各自的迁移基础段落和课程说明
- [x] 验证路径进度、搜索、详情页和全部路线恢复行为

## 本轮扩写：把课程样稿提升为详细章节

- [x] 建立课程深度标准，并先写正文深度回归测试
- [x] 扩写 26 节通用迁移基础：概念、JS/TS 对照、工程陷阱和练习
- [x] 扩写 30 节 Python / AI：Python 语言基础、数据工具和 AI 工程实践
- [x] 扩写 36 节 C++ / Robotics：现代 C++、构建调试和 ROS 2 工程实践
- [x] 检查每节课的导航、组件渲染、搜索索引和路线分组
- [x] 运行测试、类型检查、生产构建并通过浏览器抽查三条路线

## 本轮扩写 Review

- 92 个课程 MDX 文件全部保留：common 26 节、Python 30 节、C++ 36 节。
- 正文深度标准为去除 frontmatter、JSX 标签和空白后至少 900 个字符、至少 4 个教学标题、至少 2 个代码示例；三条路线分别为 26/26、30/30、36/36 通过。
- 实际正文字符范围：common 1,026–2,023；Python 1,180–2,549；C++ 931–3,372；未发现跨课程完全重复正文段落。
- `npm test`：15/15 通过；`npm run check`：0 errors / 0 warnings / 0 hints；`npm run build`：95 页面构建成功，Pagefind 索引 95 页面、4,870 词。
- 浏览器抽查 C++ 函数/头文件课程：正文、代码示例、练习和导航均正常渲染，控制台无 error/warn。

## 本轮升级：Python 从零到 AI 的真正教学内容

- [x] 重新审计 Python 30 节的知识递进，补齐从安装、语法、容器到模块、异常、测试和工程实践的缺口
- [x] 为每节 Python 课补充完整的概念解释、递进示例、运行结果/思考、常见错误和练习
- [x] 将 Python 基础与 NumPy、pandas、scikit-learn、PyTorch、推理服务和 AI 数据项目形成连续主线
- [x] 为 Python 课程补充官方文档、菜鸟教程和开源仓库延伸阅读，区分学习示例与生产代码
- [x] 用课程语义验收替代单纯字符数验收，并验证 30 节导航、搜索和构建

## 本轮升级 Review

- Python 30/30 达到语义教学标准：每节正文至少 2,400 个非空白字符、8 个教学标题、3 个示例，并包含目标、迁移、结果/验证、错误排查、练习和 AI/数据场景。
- Python 正文字符范围为 2,567–7,525，平均 4,985；三条路线课程文件总数仍为 92。
- 新增 Python 延伸阅读组件，按主题链接 Python 官方文档、菜鸟教程、Packaging Guide、NumPy、pandas、scikit-learn、PyTorch 文档和开源仓库。
- Python/C++ 首节取消对隐藏 common 路线的前置依赖，选中路线可以从自己的语言基础开始。
- `npm test`：17/17 通过；`npm run check`：0 errors / 0 warnings / 0 hints；`npm run build`：95 个页面构建成功，Pagefind 索引 95 个页面、5,591 个词。
- 浏览器抽查 Python CLI、Python syntax、common iteration 和 C++ functions detail pages，正文、示例、练习和导航均可渲染。

## 本轮升级：C++ ROS 2 / 机器人章节教材化

- [x] 在限定范围内深化 12 节 ROS 2 / 机器人课程，保留每个文件的 frontmatter、slug、顺序和导航关系
- [x] 为 12 节课程补充 JS/TS 迁移心智模型、主题专属递进示例、编译运行验证、常见错误、排错路径和练习
- [x] 将节点通信、接口、QoS、时间与 TF、bag 回放、组件、插件、仿真、诊断和传感器项目串成机器人工程主线
- [x] 确认未修改其他课程、测试或资源文件；仅更新本任务记录
- [x] 对 12 个目标文件执行正文结构、字符数、组件和主题关键词检查，并运行项目验证命令

## 本轮升级 Review

- 12/12 目标 MDX 正文达到 2400 个以上非空白字符、至少 8 个教学标题，并包含明确学习目标、JS/TS 迁移、3 个以上代码示例、运行/验证、常见错误/调试、练习和 ROS 2/机器人场景。
- 主题内容分别覆盖 topic/QoS、service/action、parameters/lifecycle、TF2、rosbag、接口契约、composition、QoS 可靠性、pluginlib、仿真、tracing 和传感器 pipeline。
- 仅修改用户指定的 12 个课程文件；任务记录为工作流要求同步更新，未修改其他课程、测试或资源文件。

## 本轮升级：C++ 从零到机器人工程的真正教学内容

- [x] 重新审计 C++ 36 节的知识递进，补齐编译、类型、值语义、生命周期、错误处理和工程构建基础
- [x] 为每节 C++ 课补充 JS/TS 迁移心智模型、递进示例、运行结果/验证、常见错误、排错路径和练习
- [x] 将 C++ 基础与并发、实时性、进程边界、ROS 2 通信、QoS、仿真和传感器消息项目形成连续主线
- [x] 为 C++ 课程补充 cppreference、LearnCpp、CMake、ROS 2 官方文档和开源仓库延伸阅读
- [x] 用与 Python 等价的语义验收验证 36 节课程、导航、资源链接、搜索和响应式页面

## 本轮升级 Review

- C++ 36/36 达到语义教学标准：每节正文至少 2,400 个非空白字符、8 个教学标题、3 个示例，并包含目标、JS/TS 迁移、编译/运行验证、错误排查、练习和机器人/系统场景。
- C++ 正文字符范围为 2,424–4,824，平均约 3,100；三条路线课程文件总数仍为 92。
- 新增 C++ 延伸阅读组件，按主题链接 cppreference、LearnCpp、CMake、GoogleTest、Sanitizer、ROS 2 官方文档和开源项目。
- C++ 路线从编译工具链开始，连续覆盖现代 C++、内存、并发、实时性、网络/IPC、ROS 2 通信、QoS、仿真、诊断和传感器结课项目。
- `npm test`：19/19 通过；`npm run check`：0 errors / 0 warnings / 0 hints；`npm run build`：95 个页面构建成功，Pagefind 索引 95 个页面、5,964 个词。
- 浏览器抽查 C++ 编译/CMake 和 ROS 2 Topic 页面，正文、代码、练习、延伸阅读、导航均可渲染，控制台无 error/warn，当前桌面视口无横向溢出。

## 本轮课程流程升级：继续学习、阶段里程碑与结课闭环

- [x] 建立三条 track 的确定性课程阶段和下一节课程计算
- [x] 扩展兼容的本地进度模型，记录最近查看课程并渲染阶段完成度
- [x] 在学习总览增加继续学习卡片、阶段进度和检查点提示
- [x] 在课程详情页补充阶段上下文、检查点提示和明确的下一节钩子
- [x] 运行测试、类型检查、生产构建并完成桌面/移动浏览器验收

## 本轮课程流程升级 Review

- 新增 `src/lib/course-flow.ts`，为 common / Python / C++ 三条路线建立 12 个确定性阶段；每节课恰好属于一个阶段，并提供按目标路线计算下一节课程的纯函数。
- `langshift-progress:v1` 保持不变，新增 `lastViewedLessonId` 并兼容旧 JSON；课程链接会记录最近查看课程，完成按钮继续支持取消完成。
- `/learn` 新增继续学习卡片、阶段完成数、预计时间、阶段检查点和结课项目标识；详情页新增当前阶段进度和检查点提示；侧栏复用相同阶段结构。
- `npm test`：26/26 通过；`npm run check`：0 errors / 0 warnings / 0 hints；`npm run build`：95 页面构建成功，Pagefind 索引 95 页面、5,970 词。
- 浏览器隔离端口验证：AI 路线只显示 Python；完成 Python 第一课后阶段进度为 `1/8`，回到路线页推荐第二课；搜索 `RAII` 返回 12 节相关课程；移动视口无横向溢出；主预览控制台和隔离预览控制台均无 error/warn。
- 当前未引入在线执行、自动判题、账号同步或跨设备进度；阶段检查仍是静态练习与本地完成标记。

## 本轮修正 Review

- AI 路线只显示 Python，当前进度总数为 30；包含 Python 迁移基础 8 节和 Python / AI 专项 22 节。
- 机器人路线只显示 C++，当前进度总数为 36；包含 C++ 迁移基础 16 节和 C++ / Robotics 专项 20 节。
- 课程详情页会根据当前语言路径自动收敛侧栏；“查看全部路线”可以清除路径选择并恢复 92 节总览。
- `npm test`：15/15 通过；`npm run check`：0 errors / 0 warnings / 0 hints；`npm run build`：95 个静态页面和 Pagefind 索引构建成功。
- 浏览器已验证 AI / 机器人路径筛选、Python 详情页路径推断、全部路线恢复和页面控制台无错误。

## 本轮 Git 仓库初始化

- [x] 在当前工作区初始化本地 Git 仓库，默认分支为 `main`
- [x] 与用户确认远程平台和 Git 账号（GitHub / aizzyyc）
- [x] 检查忽略规则并创建首个本地提交
- [x] 用户确认后创建公开远程 `ts-to-py-cpp` 仓库并上传

## 本轮 GitHub 发布 Review

- [x] GitHub 账号确认并完成官方授权
- [x] 创建公开仓库 `aizzyyc/ts-to-py-cpp`
- [x] README 已补充项目目标、路线规模、本地运行、内容开发、测试和项目边界说明
- [x] `.gitignore` 已过滤依赖、构建产物、环境配置、编辑器文件和日志
- [x] 远程 `main` 分支已写入当前项目的 134 个跟踪文件
- [x] 远程 tree 与本地 `main` 当前提交的 tree 一致

## 本轮 GitHub Pages 发布与仓库展示

- [x] 固化 GitHub Pages 发布设计并创建实施计划
- [x] 先用回归测试锁定 Astro 站点地址、工作流质量门禁和 README 在线入口
- [x] 配置 Astro `site` / `base` 与 GitHub Actions Pages 工作流
- [x] 补充 README 的在线学习、Actions 和贡献说明
- [x] 统一模板与浏览器脚本的站点子路径链接
- [x] 在 GitHub About 更新 description、website 和 topics
- [x] 运行测试、类型检查、生产构建并验证 Pages 在线页面

## 本轮 GitHub Pages Review

- GitHub Pages source 已设置为 `GitHub Actions`，在线地址为 `https://aizzyyc.github.io/ts-to-py-cpp/`。
- 本地门禁：`npm test` 30/30 通过；`npm run check` 为 0 errors、0 warnings、0 hints；`npm run build` 生成 95 个页面并完成 95 页 Pagefind 索引。
- 远程门禁：commit `f18a144` 的 GitHub Actions Run 2 成功，`build` 与 `deploy` 均通过。
- 在线验收：首页、`/learn`、Python 示例课程、`/search` 均可访问；搜索 `RAII` 返回 12 节相关课程。
- GitHub About 已补充 description、website 和 10 个 topics；未创建 release 或 package。

## 本轮 Pages 访问故障排查

- [x] 检查 Pages 服务端 HTTPS 返回、DNS 解析和 GitHub 远程状态
- [x] 确认服务端与部署均正常，定位为旧内置浏览器标签的 `ERR_CONNECTION_CLOSED`
- [x] 重新打开在线课程标签并确认首页可以加载

### 本轮访问故障 Review

- 服务端返回 `HTTP 200 OK`，在线课程首页、学习路线、示例课程和搜索页面均已重新访问确认。
- 本次没有修改 Astro、GitHub Pages 或本机代理配置；保留现有可用部署。

## 本轮课程内容质量优化

- [x] 为 26 节共用基础课和 5 节内容较薄的 C++ 课建立可回归的教学深度门槛
- [x] 将共用基础课补齐明确目标、递进例子、运行验证、排错、练习答案和小结
- [x] 深化 `cpp-types`、`cpp-networking`、`cpp-toolchain`、`cpp-exceptions`、`cpp-stl`
- [x] 复核课程先修关系、语言迁移线索、代码验证与结课衔接
- [x] 运行课程测试、类型/内容检查与生产构建
- [x] 推送 GitHub 并确认最新课程页面已完成部署

### 本轮课程优化 Review

- 26 节共用课统一补入学习目标、递进示例、验证/排错和迁移小结；根据运行时/并发、数据/错误、IO、安全和工程质量主题保留各课差异。
- 深化 5 节 C++ 薄弱课，补充单位安全转换、网络分帧/partial read/write、target 依赖、错误类别和 STL 失效/容量策略。
- 新增内容质量回归检查，并修正正文长度算法误把 C++ 比较符当作 MDX 标签的问题。
- 验证：`npm test` 33 项通过；`npm run check` 0 errors/warnings/hints；`npm run build` 生成 95 个页面；`git diff --check` 通过。
- C++ 代码片段完成静态核对；当前工作环境没有可用 C++ 编译器，因此本轮没有声称这些教学片段经过本机编译执行。
- GitHub Pages 工作流 `35168599898` 成功；共用并发课和 C++ 类型课线上返回 HTTP 200，并包含本轮新增内容。
- Pages workflow 对 Node.js 20 的弃用提示来自 action 版本兼容告警，不影响本次构建或发布成功。

## 本轮学习路线导航体验修复

- [x] 总览侧栏改为阶段锚点导航，避免重复列出整套课程
- [x] 点击阶段导航可定位内容，滚动时同步高亮当前阶段并提供可访问状态
- [x] 保留课程详情页逐课导航与当前课程高亮
- [x] 添加回归测试并完成本地预览、类型检查和生产构建验证

### Review

- 总览左侧仅显示 12 个阶段入口；已生成的 HTML 验证左栏课程链接为 0、主目录仍完整显示 92 节，阶段入口与锚点一一对应。
- 点选阶段会立即高亮并定位；滚动时按阅读位置更新 `aria-current="location"`。手机端点选后收起导航。详情页仍保留逐课导航，产物中当前课程高亮项为 1 个。
- 新增阶段选择逻辑单元测试与总览结构回归检查。`npm test`：36/36 通过；`npm run check`：0 errors / 0 warnings / 0 hints；`npm run build`：95 页成功构建，Pagefind 索引 95 页；`git diff --check` 通过。
- 本地预览页面已成功载入；未提交或推送 GitHub，因此线上页面尚未更新。

## 本轮主导航、学习方法与字号优化

- [x] 修正 Astro 主导航当前项标记，并为学习路线、搜索课程、学习方法设置清楚且可访问的当前状态
- [x] 将首页学习方法扩展为 35 分钟、五步实操流程，并补充排错与复习方法
- [x] 适度放大全站正文、导航、课程说明等常用字号，重点改善课程正文与手机端可读性
- [x] 增加导航状态与学习方法内容的回归测试
- [x] 本地检查、测试、构建，并核对生成 HTML、响应式 CSS 和本地预览

### Review

- 课程详情页与搜索页产物分别输出 `class="is-active"` 和 `aria-current="page"`；旧的字面量 `class:list-active` 已消失。学习方法锚点通过浏览器当前地址同步 `is-active` 与 `aria-current="location"`。
- 首页学习方法由五步 35 分钟学习循环组成，每步明确操作和产出，并增加四步排错顺序与间隔复习/小项目建议。
- 全站常用字号上调；课程正文为桌面 16px、手机 15px，课程目录、侧栏和导航字号也增大，并保留手机端单列布局。
- `npm test`：39/39 通过；`npm run check`：0 errors / 0 warnings / 0 hints；`npm run build`：95 页成功构建，Pagefind 索引 95 页；`git diff --check` 通过。
- 本地课程预览可正常打开。变更仅在本地工作区，尚未提交或推送 GitHub。

## 本轮主导航与课程翻页视觉调整

- [x] 为主导航选中态和上一节/下一节布局补充回归断言，并先确认测试因当前样式而失败
- [x] 主导航选中项改为品牌蓝文字与底部细线，移除浅色整块底色和内描边
- [x] 课程翻页改成明确的左右分组，箭头紧邻标题；窄屏切换为上下排列
- [x] 运行测试、Astro 检查和生产构建，并核对构建后的页面状态与桌面/窄屏样式规则

### Review

- `npm test`：41/41 通过；`npm run check`：0 errors / 0 warnings / 0 hints；`npm run build`：95 页成功生成，Pagefind 索引 95 页；`git diff --check` 通过。
- 生成课程页保留 `aria-current="page"`，并输出上一节/下一节链接；构建 CSS 已包含活动项细下划线、左右对齐规则和 760px 以下单列翻页布局。
- 本地课程页仍可正常载入。当前没有在第二个实际窗口尺寸下获取截图；响应式断点以构建产物规则和回归测试确认。

## 本轮学习流程体验优化

- [x] 修正继续学习卡片的首次学习、已浏览未完成和继续学习状态，并增加直接切换 AI / Robotics 路线入口
- [x] 优化课程详情侧栏：当前课程自动定位、当前阶段默认展开、其他阶段可折叠
- [x] 将课程详情右侧本节概览改为可点击锚点，并随阅读位置同步高亮
- [x] 增加移动端主导航菜单，保留学习路线、搜索课程和学习方法入口
- [x] 优化搜索空状态与学习路线总览的阶段展开方式
- [x] 运行回归测试、类型检查、生产构建和桌面/移动浏览器验收

### Review

- `npm test`: 46/46 通过；其中新增流程回归先红后绿。
- `npm run check`: 0 errors、0 warnings、0 hints。
- `npm run build`: 95 个页面构建成功，Pagefind 索引 95 个页面、6,238 个词。
- 浏览器已验证 AI / Robotics 路线切换、移动端菜单、搜索关键词入口、当前课程 `aria-current`、当前阶段展开和课程内目录锚点。
- 本轮已完成本地实现与验证，当前准备提交并推送 GitHub。

## 本轮课程审查后优化

- [x] 修复从课程页跳转“学习方法”后未滚动到 `#method` 的问题，并补回归测试
- [x] 明确共同迁移基础与 AI / Robotics 专线的关系，不混入专线课程列表
- [x] 改善移动端代码对照的横向阅读提示与可读性，并补样式回归测试
- [x] 运行测试、Astro 检查、生产构建和浏览器验收
- [x] 提交并推送 GitHub

### Review

- 修复课程页跳转“学习方法”后地址变化但视口未定位到锚点的问题，并保持当前导航项的蓝色细线高亮。
- AI / Robotics 专线新增“共同基础 26 节 · 单独查看”入口；点击时清除专线路径筛选，避免共同基础入口显示但课程列表被错误过滤。
- 移动端代码对照新增“窄屏可左右滑动查看完整代码”提示，保留代码区横向滚动。
- `node --experimental-strip-types --test tests/layout.test.ts`：19/19 通过；`npm test`：49/49 通过。
- `npm run check`：0 errors / 0 warnings / 0 hints；`npm run build`：95 个页面构建成功，Pagefind 索引 95 个页面、6239 个词。
- 浏览器验收通过：学习方法锚点落位并高亮；共同基础入口清除专线筛选并显示 1/92；AI / Robotics 专线仍只显示各自课程；代码对照已补充窄屏阅读提示。

## 本轮课程定位修正：基础与进阶主线、AI 辅助与案例验证

- [x] 确认网站继续以 Python / C++ 基础和进阶知识为主，不改成项目制课程
- [x] 编写分层课程与 AI 辅助学习设计稿，保留现有 92 节课程
- [x] 用户审阅设计稿并确认 Phase 1 范围
- [x] 增加基础 / 进阶 / 案例课程分层与路线统计
- [x] 增加课程掌握标准和 AI 学习卡
- [ ] 增加代表性 Python / C++ 案例代码与验证说明
- [x] 运行课程测试、类型检查、生产构建和浏览器验收

### Review

- 设计稿：`docs/superpowers/specs/2026-09-24-layered-curriculum-and-ai-support-design.md`
- 用户已确认按推荐方案自动执行；Phase 1 保留 92 节基础 / 进阶主线，不把网站改成项目制课程。
- 已完成课程分层、路线统计、详情页掌握标准和四类 AI 学习卡；案例独立代码与验证说明按设计留到 Phase 2。
- `node --experimental-strip-types --test tests/layout.test.ts`：21/21 通过；`npm test`：52/52 通过；`npm run check`：0 errors / 0 warnings / 0 hints。
- `npm run build`：95 个静态页面构建成功，Pagefind 索引 95 个页面、6,248 个词；`git diff --check` 通过。
- 浏览器验收通过：AI / Robotics 路线统计、Python / C++ 详情页掌握标准、AI 学习卡复制、窄屏课程内容和翻页均正常。
- 本轮目标是验证并发布 Phase 1，不提前宣称 Phase 2 案例完成。
# 本轮全站字体、图标与导航样式统一

- [x] 盘点全局字号层级、侧栏密度、文字对比度、图标和响应式断点
- [x] 为侧栏字号、最小点击区域和统一图标建立样式回归检查，并确认检查先失败
- [x] 统一字体栈与文字角色，放大侧栏课程名和辅助信息，保持代码字号独立
- [x] 统一常用导航/功能图标的样式和对齐，保留现有导航行为与克制的当前态
- [x] 检查首页、路线总览、课程页、搜索页手机呈现，并审阅桌面/平板断点规则
- [x] 运行测试、类型检查、生产构建并复核工作区差异

### Review

- 侧栏课程名提高到 14px，阶段名 14px，说明和时长至少 12px；链接最小高度 40px。常规小字不再使用 10/11px。
- 使用系统中文字体栈，不加载远程字体；导航、路线、比较、提示和翻页图标统一为当前颜色的 18px 线性 SVG。
- 浏览器检查了首页、路线总览、C++ 课程页和搜索页手机呈现；页面无横向溢出迹象。桌面和平板布局规则已复核，未在实际桌面视口截图。
- `npm test`：54/54 通过；`npm run check`：0 errors / 0 warnings / 0 hints；`npm run build`：95 个静态页面生成，Pagefind 收录 95 页；`git diff --check` 通过。

## 本轮统一全站确认弹窗

- [x] 为共享确认弹窗补回归检查，并确认检查先失败
- [x] 在基础布局接入可访问、可复用的确认弹窗组件
- [x] 将学习进度重置改为异步共享弹窗，取消时留在当前页
- [x] 盘点浏览器原生 alert / confirm / prompt 调用；本地交互待浏览器控制器恢复后验收
- [x] 运行测试、类型检查、生产构建并复核工作区差异

### Review

- 新增共享的原生 `<dialog>` 确认组件，支持标题、说明、按钮文案配置；Esc 和取消按钮均返回取消，默认将焦点放在取消按钮。
- 重置进度的确认按钮清除本地进度后跳转到学习页；取消或 Esc 会留在当前课程页。
- 全站搜索只发现 C++ 课程示例中的 `publish_alert`，它不是浏览器弹窗 API。产品代码中没有剩余 `alert`、`confirm` 或 `prompt` 调用。
- 回归检查先因缺少组件而失败；实现后 `npm test` 55/55 通过，`npm run check` 0 errors / 0 warnings / 0 hints，`npm run build` 生成 95 个页面并索引 95 页，`git diff --check` 通过。
- 浏览器控制器两次连接现有预览页均超时，未能完成实际点击和视觉检查；未点击确认按钮，也未改动用户学习进度。

## 本轮补全每节课程概览

- [x] 用课程 H2/H3 标题和实际存在的练习、代码对照等区块自动生成分层目录
- [x] 为所有概览目标生成稳定锚点，保留滚动时当前小节高亮
- [x] 为长目录加入侧栏内滚动与窄屏布局处理
- [x] 补齐回归检查，运行测试、类型检查、构建并检查实际课程页面

### Review

- 92 节课程的概览现在从正文自动生成：H2 为主项，H3 缩进显示；真实存在的代码对照和迁移结论入口按正文顺序出现，重复代码对照有编号。
- 保留标题锚点，阅读位置变化时同步高亮目录项，并将当前项滚入侧栏可视范围。目录使用 14px 主项、13px 子项，内容较长时侧栏独立滚动。
- 用 C++《表达式、初始化与控制流》页面检查了实际生成效果：学习目标、迁移模型、初始化示例、控制流示例、练习和验证章节都进入目录；三级标题层级和当前态可见。
- 回归检查先在固定目录实现上失败，实现后 `npm test` 57/57 通过；`npm run check` 0 errors / 0 warnings / 0 hints；`npm run build` 95 页构建及索引成功；`git diff --check` 通过。

## 本轮消除学习路线切换的整页刷新抖动

- [x] 为客户端导航、跨页初始化和路线/搜索页顶部对齐补回归检查，并确认检查先失败
- [x] 在共享布局启用 Astro 客户端导航
- [x] 让进度、目录、搜索与站点头部交互在每次路由切换后正确初始化并清理旧监听
- [x] 让重置、快捷搜索等程序化站内跳转使用客户端导航，并对齐路线/搜索页内容起始位置
- [x] 在独立 localhost 存储环境检查连续切课、搜索建议、前进/后退和页面初始化
- [x] 运行测试、类型检查、生产构建并复核工作区差异

### Review

- 共享布局使用 Astro ClientRouter，进度、目录、搜索与站点导航均在每次 `astro:page-load` 初始化；旧页面事件监听通过 AbortController 清理，目录观察器在换页时断开。
- 学习路线和搜索页共用桌面 62px、移动端 46px 的顶部间距；重置进度与 `/` 快捷搜索也通过客户端导航，统一地址切换行为。
- 在独立的 `localhost` origin 验收，避免写入原 `127.0.0.1` 页面使用的学习进度：学习路线/搜索往返、RAII 建议搜索、侧栏连续切换 C++ 两节课，以及浏览器前进/后退均正确；原浏览器仍留在用户打开的 CMake 课程页。
- 回归检查先在新增要求上失败，实现后 `npm test` 59/59 通过；`npm run check` 0 errors / 0 warnings / 0 hints；`npm run build` 成功生成 95 个页面并索引 95 页；`git diff --check` 通过。

## 本轮复核并消除顶部导航过渡抖动

- [x] 复查“客户端切换仍有抖动”反馈，确认抖动来自 Astro 默认淡入淡出过渡
- [x] 先增加防止页面过渡动画回归的检查，并确认检查先失败
- [x] 保留客户端路由，关闭受支持浏览器的默认页面动画与不支持浏览器的模拟动画
- [x] 在新页面上下文中检查学习路线到搜索课程的切换及页面定位
- [x] 运行测试、类型检查、构建并检查差异

### Review

- 根因是 Astro ClientRouter 自带默认 fade：没有整页重载仍可能产生页面淡入淡出，造成内容闪动。共享 `<html>` 使用 `transition:animate="none"`，ClientRouter 使用 `fallback="swap"`，保留客户端路由但不再播放切页动画。
- 在新建预览标签中重新加载课程总览，再点击顶部“搜索课程”；导航正常、搜索页内容稳定出现在统一的顶部基线。原浏览器标签的控制接口连续超时，无法确认旧标签是否已载入最新 HTML；未触碰其学习进度。
- 回归检查先失败，修复后 `npm test` 59/59、`npm run check` 0 errors / 0 warnings / 0 hints、`npm run build` 成功生成 95 页、`git diff --check` 通过。

## 本轮修复顶部导航选中项挤动

- [x] 增加导航选中状态不得改变字重/文字宽度的回归检查，并确认检查先失败
- [x] 移除桌面主导航选中项的独立粗体字重，保留品牌色与底部细线
- [x] 运行项目测试与必要的检查，复核本轮差异

### Review

- 根因是 `.desktop-nav a.is-active` 将字重切到 750；移除字重覆盖后，活动态只改变颜色和下划线，不再改变文本排版宽度。
- 新增的导航排版回归检查先按预期失败，修复后 `tests/layout.test.ts` 29/29、`npm test` 60/60 通过。
- 在本地预览中往返切换“学习路线 → 搜索课程 → 学习路线”，导航各项位置和宽度保持不变；`npm run check` 为 0 errors / 0 warnings / 0 hints，`git diff --check` 通过。

## 本轮复现学习路线与搜索课程切换偏移

- [x] 等待 Astro 页面切换完成及当前导航态更新后，再记录导航、页头和滚动条几何信息
- [x] 对比两个目标页面的截图与可视视口尺寸，定位实际发生位移的元素
- [x] 针对复现到的布局原因添加回归检查并修复
- [x] 重复真实页面往返切换验证，运行测试与检查并记录结果

### Review

- 在 1500×1050 视口复现：学习路线页的经典滚动条占 15px，搜索页没有滚动条，居中的页头与导航向右移动 7.5px。
- 根文档设置 `scrollbar-gutter: stable` 后，短页也预留滚动条槽位；学习路线和搜索页的导航横坐标均稳定在 312、397、482px。
- 新增的滚动条槽位回归检查先失败，修复后 `npm test` 61/61 通过，`npm run check` 0 errors / 0 warnings / 0 hints，`npm run build` 成功生成并索引 95 页；已恢复测试视口并关闭临时标签。

## 本轮优化：搜索索引体积与全站可读性

- [x] 确认已生成的搜索页包含全部课程全文，并量化当前构建体积
- [x] 将全文索引移出搜索页 HTML，按需懒加载并缓存，保留正文检索能力
- [x] 提高全站辅助文字对比度，统一小字号下限并检查移动断点覆盖
- [x] 运行类型检查和生产构建，记录结果与已知限制

### Review

- 搜索页 HTML 从 942,294 字节缩至 32,764 字节（减少约 96.5%）；元数据仍包含全部 92 节课程，正文全文索引单独生成约 903 KB 的 JSON，仅在首次非空搜索时加载。
- 全文索引在页面内存中规范化并缓存，保留原有标题、概念、摘要、正文匹配和排序权重；请求使用 `sitePath` 兼容 GitHub Pages 子路径。
- 辅助字号调整为 caption 13px、label 14px、UI 15px；正文维持 17px，主要课程代码维持 13px。`--muted` / `--faint` 在主题背景上的计算对比度最低约 4.59:1。
- `npm run check`：0 errors / 0 warnings / 0 hints；`npm run build`：95 页构建和 Pagefind 索引成功；`git diff --check` 通过。未运行测试；浏览器视觉复核受当前 CUA 页面读取超时限制。
