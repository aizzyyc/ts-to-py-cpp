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
- [ ] 运行测试、类型检查、生产构建并验证 Pages 在线页面

## 本轮 GitHub Pages Review

- 待实现与验收后填写。
