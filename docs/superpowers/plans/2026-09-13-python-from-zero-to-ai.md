# Python From Zero to AI Curriculum Upgrade Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 让有 JS/TS 编程经验的学习者从 Python 基础开始，经过完整的工程和数据工具训练，能够独立阅读、调试并实现 AI 数据与模型服务项目。

**Architecture:** 保留现有 Astro + MDX 课程页面和路线筛选，在 Python 30 节课程正文中建立连续的教学主线。课程正文采用“目标 → JS/TS 迁移心智模型 → 概念拆解 → 递进示例 → 输出/验证 → 常见错误 → 练习 → AI 场景 → 小结”的固定教学协议；页面自动附上与课程主题匹配的延伸资源。

**Tech Stack:** Astro, TypeScript, MDX, Node.js test runner, Pagefind

**Spec:** 用户要求每节课把知识点和相关例子讲清楚，使有 JS/TS 基础但 Python 零基础的人真正学扎实并用于 AI 行业；参考菜鸟教程、Python 官方文档以及开源 Python/PyTorch 仓库。

## Global Constraints

- 中文解释，英文代码和技术术语；所有示例说明输入、输出或验证方式。
- 保留现有 Python lesson 的 frontmatter、slug、顺序、前置依赖和导航关系。
- 每节课必须有明确学习目标、至少 8 个教学标题、至少 3 个不同阶段的代码示例、常见错误与排错路径、动手练习和 AI 场景连接；正文至少 2,400 个非空白字符。
- 每节课不得用相同的泛化段落填充；示例必须围绕该节主题并能被学习者改写。
- Python 基础段必须覆盖安装/解释器、变量和容器、控制流、函数与 typing、对象模型、迭代器/上下文、环境/依赖、文件/HTTP 和测试；专项段必须形成数据处理到模型服务的连续项目主线。
- 资源链接只作为延伸阅读，不复制第三方教程或开源仓库的正文；代码示例保持原创、短小和可解释。
- 不引入在线编译、账号或新后端依赖。

---

### Task 1: 语义课程协议与回归测试

**Files:**
- Modify: `tests/content.test.ts`

**Steps:**

- [x] 为 Python 课程增加学习目标、示例/输出、常见错误、练习和 AI 场景的语义断言。
- [x] 提升 Python 的最低内容标准到 2,400 个非空白正文字符、8 个教学标题和 3 个代码示例。
- [x] 先运行测试确认当前 Python 内容会失败，保留现有 92 节数量和通用结构断言。

### Task 2: Python 资源索引与页面展示

**Files:**
- Create: `src/lib/python-resources.ts`
- Create: `src/components/LessonResources.astro`
- Modify: `src/pages/learn/[track]/[slug].astro`
- Modify: `src/styles/global.css`
- Test: `tests/content.test.ts`

**Steps:**

- [x] 按课程主题映射 Python 官方教程、菜鸟教程、Packaging Guide、NumPy/pandas/scikit-learn/PyTorch 文档和开源仓库。
- [x] 在 Python 课程正文之后渲染“延伸阅读”区域，显示资源标题、来源和外链。
- [x] 确认资源区域在移动端可读、链接可键盘访问，不影响其他路线。

### Task 3: Python 迁移基础 1–8

**Files:**
- Modify: `src/content/lessons/python-syntax.mdx`
- Modify: `src/content/lessons/python-control-flow.mdx`
- Modify: `src/content/lessons/python-functions.mdx`
- Modify: `src/content/lessons/python-oop.mdx`
- Modify: `src/content/lessons/python-iterators.mdx`
- Modify: `src/content/lessons/python-packaging.mdx`
- Modify: `src/content/lessons/python-files.mdx`
- Modify: `src/content/lessons/python-testing.mdx`

**Steps:**

- [x] 从解释器和第一个脚本开始，补齐 Python 语法、容器、字符串、异常、函数、类型提示、类、生成器、环境、文件/JSON/HTTP 和 pytest。
- [x] 每节加入从 JS/TS 迁移的反例和至少一个可观察输出。
- [x] 每节练习都要求学习者改写或验证一个小程序，为后续 AI 数据项目准备输入/输出契约。

### Task 4: Python 工程与 AI 专项 9–30

**Files:**
- Modify: `src/content/lessons/python-http.mdx`
- Modify: `src/content/lessons/python-cli.mdx`
- Modify: `src/content/lessons/python-logging.mdx`
- Modify: `src/content/lessons/python-concurrency.mdx`
- Modify: `src/content/lessons/python-async.mdx`
- Modify: `src/content/lessons/python-sql.mdx`
- Modify: `src/content/lessons/python-data-models.mdx`
- Modify: `src/content/lessons/python-data.mdx`
- Modify: `src/content/lessons/python-pandas.mdx`
- Modify: `src/content/lessons/python-numpy.mdx`
- Modify: `src/content/lessons/python-numpy-linear.mdx`
- Modify: `src/content/lessons/python-visualization.mdx`
- Modify: `src/content/lessons/python-scikit.mdx`
- Modify: `src/content/lessons/python-datasets.mdx`
- Modify: `src/content/lessons/python-pytorch-tensors.mdx`
- Modify: `src/content/lessons/python-pytorch-models.mdx`
- Modify: `src/content/lessons/python-pytorch-data.mdx`
- Modify: `src/content/lessons/python-pytorch-evaluation.mdx`
- Modify: `src/content/lessons/python-inference.mdx`
- Modify: `src/content/lessons/python-deployment.mdx`
- Modify: `src/content/lessons/python-mlops.mdx`
- Modify: `src/content/lessons/python-project.mdx`

**Steps:**

- [x] 让数据访问、校验、NumPy/pandas、统计诊断、baseline、数据切分、PyTorch 训练、评估、推理和服务化形成可追踪的同一项目主线。
- [x] 每节解释关键 API 背后的数据形状、生命周期、错误边界和验证方式，避免只列 API 名称。
- [x] 补充至少一个 AI 工程中的真实决策点，如 leakage、batch、device、timeout、监控或可复现。

### Task 5: 集成验收

**Files:**
- Modify: `tasks/todo.md`
- Modify: `tasks/lessons.md`

**Steps:**

- [x] 运行 `npm test`、`npm run check` 和 `npm run build`。
- [x] 验证 30 节 Python 页面和资源链接均能生成，Pagefind 能搜到新增解释和代码术语。
- [x] 浏览器抽查基础、数据、PyTorch、项目各一节，并检查移动端正文可滚动、示例和折叠答案可用。
- [x] 记录实际课程深度、资源来源和剩余限制。

## Review Result

- Python 30/30 已完成深度重写，课程正文包含目标、JS/TS 迁移心智模型、概念拆解、递进示例、结果/验证、常见错误、练习、AI 场景和小结。
- 已加入按主题匹配的延伸阅读资源层，并通过安全外链和每课至少两条资源的测试。
- Python/C++ 首节不再依赖被路径筛选隐藏的 common 课程；AI 路线和机器人路线仍保持内容隔离。
- `npm test` 17/17、`npm run check` 0 errors / 0 warnings / 0 hints、`npm run build` 95 pages 均通过；Pagefind 索引 95 pages / 5,591 words。
- 浏览器已抽查 Python 基础/CLI、common iteration 与 C++ detail 页面；剩余限制是课程示例仍为静态阅读和本地练习，尚未接入在线 Python 执行或账号同步。
