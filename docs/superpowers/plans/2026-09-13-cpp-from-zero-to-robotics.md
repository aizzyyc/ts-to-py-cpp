# C++ From Zero to Robotics Curriculum Upgrade Plan

> **For agentic workers:** execute this plan task-by-task and keep the checklist updated.

**Goal:** 让有 JS/TS 编程经验的学习者从 C++ 基础开始，经过内存、构建、并发和 ROS 2 训练，能够阅读、调试并实现可靠的机器人消息处理程序。

**Architecture:** 保留现有 Astro + MDX 课程页面和 C++ 路线筛选，在 36 节 C++ 课程中建立“语言基础 → 工程边界 → 并发/实时性 → ROS 2 → 传感器项目”的连续主线。每节采用“目标 → JS/TS 迁移心智模型 → 概念拆解 → 递进示例 → 编译/运行验证 → 常见错误 → 练习 → 机器人场景 → 小结”的教学协议。

**Spec:** 用户要求 C++ 路线不能只停留在知识点罗列，需要与 Python 路线达到同等详细程度，服务希望进入机器人行业的 JS/TS 开发者。

## Global Constraints

- 中文解释，英文代码和技术术语；示例必须说明编译、运行或验证方式。
- 保留现有 C++ lesson 的 id、slug、frontmatter、顺序、前置依赖和导航关系。
- 每节课程至少 2,400 个非空白正文字符、8 个教学标题、3 个不同阶段的代码示例，并包含学习目标、JS/TS 迁移、结果/验证、常见错误/调试、练习和机器人/系统场景。
- 不用重复泛化段落填充；示例应围绕该节主题，能被学习者修改。
- C++ 基础段覆盖编译器和 CMake、初始化/控制流、类型/const、值/引用/指针、函数/头文件、STL、算法、移动/RAII、异常/接口和测试；工程段覆盖并发、队列、性能、实时性、网络边界；机器人段覆盖 ROS 2 workspace、Topic/QoS、Service/Action、参数、TF2、rosbag、自定义接口、组件、仿真、诊断和传感器项目。
- 资源只作为延伸阅读，不复制第三方正文；首版仍不引入在线编译、真实硬件控制或后端。

## Task 1: 语义课程协议和回归测试

- [x] 为 C++ 课程增加学习目标、示例/编译验证、常见错误、练习和机器人场景的语义断言。
- [x] 提升 C++ 最低内容标准到 2,400 个非空白正文字符、8 个教学标题和 3 个代码示例。
- [x] 增加 C++ 每课至少两条安全外链资源断言，并保留 92 节总课程结构断言。

## Task 2: C++ 迁移基础与工程课程 1–23

- [x] 从编译器和第一个 CMake target 开始，补齐语言基础、内存所有权、STL、错误处理、多文件工程、测试、Sanitizer、并发、队列、性能、实时性和网络边界。
- [x] 每节加入 JS/TS 反例、可编译或可观察输出，以及面向机器人数据/任务的练习。

## Task 3: ROS 2 与机器人课程 24–36

- [x] 让 workspace、Node/Topic/QoS、Service/Action、参数、TF2、rosbag、接口、组件、QoS 诊断、仿真和 tracing 形成连续项目主线。
- [x] 每节解释消息生命周期、线程/回调、队列深度、时间戳、坐标系、可靠性和可复现验证，避免只列 ROS 2 API 名称。

## Task 4: 资源展示与集成验收

- [x] 按主题映射 cppreference、LearnCpp、CMake、ROS 2 官方文档和开源仓库，并在 C++ 正文后展示延伸阅读。
- [x] 运行 `npm test`、`npm run check` 和 `npm run build`，验证 36 节页面、搜索索引和资源链接。
- [x] 浏览器抽查 C++ 基础、并发、ROS 2 Topic 和传感器结课项目，检查示例、答案展开、导航和页面无横向溢出。

## Review Result

- C++ 36/36 已完成深度重写，课程正文包含目标、JS/TS 迁移心智模型、概念拆解、递进示例、编译/运行验证、常见错误、练习、机器人场景和小结。
- 已加入按主题匹配的 C++ 延伸阅读资源层，并通过每课至少两条 HTTPS 资源链接测试。
- `npm test` 19/19、`npm run check` 0 errors / 0 warnings / 0 hints、`npm run build` 95 pages 均通过；Pagefind 索引 95 pages / 5,964 words。
- 浏览器已抽查 C++ 基础和 ROS 2 Topic 页面；剩余限制是课程示例仍为静态阅读和本地练习，尚未接入真实 ROS 2 编译环境或机器人硬件。
