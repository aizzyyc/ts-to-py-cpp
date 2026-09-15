# Detailed Course Content Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 92 节 JS/TS → Python/C++ 学习课程从结构样稿扩展为能支撑真实学习时长的详细章节。

**Architecture:** 保留现有 Astro Content Collections、MDX 组件和路线导航接口，仅重写课程正文并增加内容深度校验。课程仍按 common、python、cpp 三个独立内容集合维护；每节课统一包含目标、迁移解释、多个示例、常见陷阱、练习、提示/答案和总结。

**Tech Stack:** Astro, TypeScript, MDX, Node.js test runner, Pagefind

**Spec:** 用户要求“直接把后续做了”，并已明确每节课需要详细内容，而非只具备组件结构。

## Global Constraints

- 中文讲解，英文代码和技术术语。
- 不改变已有 lesson frontmatter 的 id、slug、track、order、prerequisites 和导航关系。
- 不删除现有 `CompareCode`、`KeyIdea`、`Exercise`、`SolutionReveal` 结构；可以在其周围增加详细正文。
- 每节课至少有 3 个有意义的正文解释段落、2 个代码示例块（其中至少 1 个使用 `CompareCode`）、1 个常见陷阱/排错段落和 1 个可执行练习。
- 每节课正文目标为约 900–1800 个中文字符或等量技术信息；项目课可以更长，不能用重复套话填充。
- 课程内容要把 JS/TS 已有经验连接到 Python 或 C++ 的实际工程语境，并在 Python / AI、C++ / Robotics 课程中体现领域联系。
- 不引入在线执行、账号、后端或新依赖。

---

### Task 1: 内容深度回归测试

**Files:**
- Modify: `tests/content.test.ts`
- Modify: `tasks/todo.md`

**Steps:**

- [x] 为每个课程增加正文信息密度断言，而不是只断言组件名称。
- [x] 先运行测试确认现有课程会因新标准失败。
- [x] 保留现有结构和课程数量断言。

### Task 2: 通用迁移基础内容

**Files:**
- Modify: `src/content/lessons/common-*.mdx`

**Steps:**

- [x] 按 26 节课程顺序扩写运行时、类型、模块、数据边界、并发、可观测性和迁移项目内容。
- [x] 每节补充至少两组 JS/TS → 多语言迁移示例和常见错误解释。
- [x] 运行 common 内容结构与深度测试。

### Task 3: Python / AI 内容

**Files:**
- Modify: `src/content/lessons/python-*.mdx`

**Steps:**

- [x] 扩写 Python 迁移基础 8 节，覆盖数据模型、控制流、函数、模块、环境、迭代器、对象模型和测试。
- [x] 扩写 Python / AI 专项 22 节，覆盖数据处理、NumPy、pandas、scikit-learn、PyTorch、推理、服务化、监控和项目实践。
- [x] 运行 Python 内容结构与深度测试。

### Task 4: C++ / Robotics 内容

**Files:**
- Modify: `src/content/lessons/cpp-*.mdx`

**Steps:**

- [x] 扩写 C++ 迁移基础 16 节，覆盖值语义、指针、类型、函数、STL、RAII、模板、CMake、测试和调试。
- [x] 扩写 C++ / Robotics 专项 20 节，覆盖实时性、并发、消息边界、ROS 2、QoS、TF2、仿真、回放和诊断。
- [x] 运行 C++ 内容结构与深度测试。

### Task 5: 集成验证

**Files:**
- Modify: `tasks/todo.md`
- Modify: `tasks/lessons.md`

**Steps:**

- [x] 运行 `npm test`、`npm run check` 和 `npm run build`。
- [x] 检查 Pagefind 索引仍包含课程正文关键词。
- [x] 浏览器抽查 common、Python、C++ 各一节，验证正文没有重叠、截断或移动端横向溢出。
- [x] 在 Review 中记录实际数量、测试输出和浏览器结果。

## Review Result

- 92/92 lessons meet the new body-depth standard.
- `npm test`, `npm run check`, and `npm run build` pass on the final workspace.
- Browser inspection confirms the expanded C++ detail page renders the longer body, code blocks, exercise, conclusion, and navigation without console errors.
