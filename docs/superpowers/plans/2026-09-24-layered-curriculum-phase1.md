# 分层课程与 AI 辅助学习 Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在保留 92 节基础与进阶课程的前提下，为课程增加清晰分层、掌握标准、AI 辅助学习卡和路线统计，让开发人员知道先学什么、如何检查是否掌握，以及如何借助 AI 复习和排错。

**Architecture:** 使用一个纯函数分层模块根据现有 `track`、`order` 和少量案例 ID 推导课程分类，避免一次性改写 92 个 MDX frontmatter。新增小型展示组件分别负责课程标签、掌握标准和 AI 提示词；路线页与详情页只消费这些组件和统计函数，不改变现有进度模型、搜索和课程导航。

**Tech Stack:** Astro 5、MDX、TypeScript、Node `node:test`、现有 CSS 和浏览器端 `progress-client.ts`。

**Spec:** `docs/superpowers/specs/2026-09-24-layered-curriculum-and-ai-support-design.md`

## Global Constraints

- 保留现有 92 节课程和三条 track，不删除课程或改成项目制课程。
- 不引入在线编译、在线判题、账号同步、后端 AI 服务或新运行时依赖。
- 案例用于知识验证；本阶段只实现分类、提示和页面结构，不新增独立案例代码。
- AI 提示必须要求开发人员先运行代码、提供真实输出并自行验证结果。
- 活动状态继续使用克制的品牌色文字和细下划线，不使用大面积填充胶囊。
- 现有 `langshift-progress:v1` 数据格式、课程筛选、搜索和 GitHub Pages 子路径必须保持兼容。

## Review Focus

- 未知或新增课程 ID：应安全地落入基础/进阶默认规则，而不是让路线统计崩溃。由 Task 1 的分类默认值测试覆盖。
- 课程 order 非连续或跨 track：应按 track 独立统计，不假设 order 从 1 连续。由 Task 1 的多 track 统计测试覆盖。
- AI 提示词包含引号、换行和课程标题：复制属性不能截断或产生未转义 HTML。由 Task 3 的生成文本测试覆盖。
- 没有浏览器剪贴板权限：AI 卡复制失败时应显示手动复制提示，不影响页面阅读。由 Task 3 的脚本回归断言覆盖。
- 路线筛选和无目标全量路线：统计和标签应只针对可见路线，不改变现有 `data-clear-goal` 行为。由 Task 2 的布局与筛选回归覆盖。

## File Map

- Create: `src/lib/lesson-levels.ts` — 课程级别、学习类型、统计和时长格式化的纯函数。
- Create: `src/components/LessonLevelBadge.astro` — 基础/进阶与案例标签。
- Create: `src/components/LessonMastery.astro` — 四级掌握标准静态清单。
- Create: `src/components/AiStudyCard.astro` — 四类可复制 AI 学习提示。
- Modify: `src/pages/learn/index.astro` — 路线统计、预计时间和分类摘要。
- Modify: `src/pages/learn/[track]/[slug].astro` — 课程标签、掌握标准和 AI 卡。
- Modify: `src/scripts/progress-client.ts` — 复用剪贴板逻辑支持 `data-copy-text`。
- Modify: `src/styles/global.css` — 新组件的桌面和窄屏样式。
- Modify: `src/content.config.ts` — 为后续显式标注保留可选 `level` / `learningMode` 字段，不强制修改已有正文。
- Modify: `README.md` — 说明基础/进阶主线、案例定位和 AI 学习边界。
- Create: `tests/lesson-levels.test.ts` — 分类、统计、时长的纯函数测试。
- Modify: `tests/layout.test.ts` — 生成 HTML、组件挂载和复制入口回归测试。
- Modify: `tests/github-pages.test.ts` — README 学习定位和 AI 边界文案回归测试（若现有测试文件已有对应断言则合并，不重复造测试）。

### Task 1: 建立课程分层和路线统计模型

**Files:**
- Create: `src/lib/lesson-levels.ts`
- Modify: `src/content.config.ts: schema`
- Create: `tests/lesson-levels.test.ts`
- Modify: `tests/content.test.ts: collection schema assertions`

**Interfaces:**
- Consumes: `LessonMeta` from `src/lib/lessons.ts`.
- Produces: `LessonLevel = "foundation" | "advanced"`, `LearningMode = "concept" | "case"`, `getLessonClassification(lesson)`, `getLessonClassificationStats(lessons, track?)`, `formatLearningMinutes(minutes)`.

- [ ] **Step 1: Write the failing tests**

  Add tests that pin the default rules:

  ```ts
  test("classifies common foundation, advanced, and capstone lessons", () => {
    expect(getLessonClassification(LESSONS.find((x) => x.id === "common-runtime")!)).toEqual({
      level: "foundation",
      learningMode: "concept",
    });
    expect(getLessonClassification(LESSONS.find((x) => x.id === "common-concurrency")!)).toEqual({
      level: "advanced",
      learningMode: "concept",
    });
    expect(getLessonClassification(LESSONS.find((x) => x.id === "common-capstone")!)).toEqual({
      level: "advanced",
      learningMode: "case",
    });
  });

  test("classifies Python and C++ language foundations independently", () => {
    expect(getLessonClassification(LESSONS.find((x) => x.id === "python-syntax")!).level).toBe("foundation");
    expect(getLessonClassification(LESSONS.find((x) => x.id === "python-data")!).level).toBe("advanced");
    expect(getLessonClassification(LESSONS.find((x) => x.id === "cpp-toolchain")!).level).toBe("foundation");
    expect(getLessonClassification(LESSONS.find((x) => x.id === "cpp-networking")!).level).toBe("advanced");
  });

  test("stats do not assume contiguous order values", () => {
    const stats = getLessonClassificationStats([
      { ...LESSONS[0], order: 10 },
      { ...LESSONS[1], order: 40 },
    ]);
    expect(stats.total).toBe(2);
    expect(stats.totalMinutes).toBe(18);
  });

  test("formats route duration for hours and minutes", () => {
    expect(formatLearningMinutes(830)).toBe("约 13 小时 50 分钟");
    expect(formatLearningMinutes(30)).toBe("约 30 分钟");
  });
  ```

- [ ] **Step 2: Run the focused test to verify it fails**

  Run: `node --experimental-strip-types --test tests/lesson-levels.test.ts`

  Expected: FAIL because `src/lib/lesson-levels.ts` and its exported functions do not exist.

- [ ] **Step 3: Implement the minimal classification module**

  Implement explicit rules without importing `course-flow.ts` to avoid a module cycle:

  - `common` order 1–15 is `foundation`; order 16–26 is `advanced`;
  - `python` order 1–8 is `foundation`; order 9–30 is `advanced`;
  - `cpp` order 1–16 is `foundation`; order 17–36 is `advanced`;
  - `common-capstone`, `python-project`, and `cpp-sensor-pipeline` use `learningMode: "case"`;
  - unknown tracks/orders fall back to `advanced` and `concept` while preserving total counts;
  - `getLessonClassificationStats` returns total, totalMinutes, foundationCount, advancedCount, caseCount, and caseMinutes.

  Add optional `level` and `learningMode` schema fields with the same enums. They are optional so existing MDX continues to validate and future explicit overrides can be added without a mass rewrite.

- [ ] **Step 4: Run the focused test to verify it passes**

  Run: `node --experimental-strip-types --test tests/lesson-levels.test.ts`

  Expected: all classification, fallback, non-contiguous-order, and duration tests pass.

- [ ] **Step 5: Run content validation**

  Run: `node --experimental-strip-types --test tests/content.test.ts tests/lesson-levels.test.ts`

  Expected: existing content schema checks and new classification tests pass.

### Task 2: Add level badges and route statistics

**Files:**
- Create: `src/components/LessonLevelBadge.astro`
- Modify: `src/pages/learn/index.astro`
- Modify: `src/pages/learn/[track]/[slug].astro`
- Modify: `src/styles/global.css`
- Modify: `tests/layout.test.ts`

**Interfaces:**
- Consumes: `getLessonClassification`, `getLessonClassificationStats`, `formatLearningMinutes` from Task 1.
- Produces: semantic `.lesson-level-badge`, `.lesson-learning-mode`, `[data-route-learning-stats]`, and visible foundation/advanced/case statistics.

- [ ] **Step 1: Write layout assertions before changing markup**

  Add assertions that the generated source will contain:

  - `LessonLevelBadge` on the route and lesson detail surfaces;
  - `data-route-learning-stats` and foundation/advanced/case labels;
  - `formatLearningMinutes` for route totals;
  - the current focused-route `data-clear-goal` link remains present.

- [ ] **Step 2: Run the focused layout test to verify it fails**

  Run: `node --experimental-strip-types --test tests/layout.test.ts`

  Expected: the new markup assertions fail while existing layout assertions continue to report their current status.

- [ ] **Step 3: Implement the badge and route summary**

  `LessonLevelBadge.astro` accepts `{ level, learningMode }` and renders concise Chinese text:

  - `基础` for foundation;
  - `进阶` for advanced;
  - `案例` only when learningMode is case.

  On `/learn`, calculate stats separately for common, Python, and C++ and show them in the route header. Include route totals for Python and C++ plus common foundation using `formatLearningMinutes`, without replacing the existing progress indicator.

  On each course row, show the badge after the existing concepts. On the lesson detail header, show the same badge beside the lesson metadata. Keep the default route and goal filtering behavior unchanged.

- [ ] **Step 4: Add restrained responsive styles**

  Use existing variables and typography. Badges should be text-plus-border or text-only, with no filled active pill. At widths below 760px, allow the statistics row to wrap and keep course titles readable.

- [ ] **Step 5: Run focused tests and production checks**

  Run:

  ```text
  node --experimental-strip-types --test tests/layout.test.ts tests/lesson-levels.test.ts
  npm run check
  ```

  Expected: new and existing assertions pass; Astro reports 0 errors, 0 warnings, and 0 hints.

### Task 3: Add mastery standards and AI study cards

**Files:**
- Create: `src/components/LessonMastery.astro`
- Create: `src/components/AiStudyCard.astro`
- Modify: `src/pages/learn/[track]/[slug].astro`
- Modify: `src/scripts/progress-client.ts`
- Modify: `src/styles/global.css`
- Modify: `tests/layout.test.ts`

**Interfaces:**
- Consumes: lesson title, summary, track label, and current lesson route from the detail page.
- Produces: `[data-lesson-mastery]`, `[data-ai-study-card]`, and buttons with `data-copy-text`.

- [ ] **Step 1: Write tests for the four mastery statements and four safe prompts**

  Assert that the detail page includes the four mastery labels `能解释`, `能阅读`, `能修改`, `能排错`, and that the AI card includes prompt intents for `概念迁移`, `变式练习`, `排错辅助`, and `复习检查`.

  Assert that `progress-client.ts` selects `[data-copy-text]`, handles clipboard rejection, and uses a temporary `请手动复制` label without changing the existing code-copy handler.

- [ ] **Step 2: Run the focused tests to verify the new assertions fail**

  Run: `node --experimental-strip-types --test tests/layout.test.ts`

  Expected: new mastery and AI-card assertions fail before the components and handler exist.

- [ ] **Step 3: Implement `LessonMastery.astro`**

  Render a compact list of four static checks. Use the current lesson title in each sentence, but do not persist a second progress model in this phase. The existing complete button remains the only persisted lesson completion action.

- [ ] **Step 4: Implement `AiStudyCard.astro`**

  Render four collapsible prompt rows or compact buttons. Each prompt must tell the AI to use the current lesson as context, ask questions before giving a full answer where appropriate, require real code/output for debugging, and remind the learner to run and verify the result. Store the complete prompt in `data-copy-text` and render an accessible visible label.

- [ ] **Step 5: Add copy support without changing existing code copy**

  Add a second event binding in `progress-client.ts` for `[data-copy-text]`. On success, change the button label to `已复制`; on failure, change it to `请手动复制`; restore the original label after a short timeout. Do not print prompts or user code to logs.

- [ ] **Step 6: Mount the components and style them**

  Place mastery standards immediately before lesson content and the AI study card after the lesson content/reading resources so the learner sees concepts first and assistance after attempting the material. Use the existing surface, line, blue, and type tokens; keep the card visually secondary to the lesson.

- [ ] **Step 7: Run focused tests and browser-facing checks**

  Run:

  ```text
  node --experimental-strip-types --test tests/layout.test.ts tests/lesson-levels.test.ts
  npm run check
  npm run build
  ```

  Expected: all tests pass, Astro checks cleanly, and the production build generates the same 95-page site with the new detail-page sections.

### Task 4: Document the learning boundary and complete Phase 1 verification

**Files:**
- Modify: `README.md`
- Modify: `tests/github-pages.test.ts` or the existing README/content test location
- Modify: `tasks/todo.md`

**Interfaces:**
- Consumes: the final UI and learning model from Tasks 1–3.
- Produces: user-facing explanation of required foundations, optional advanced lookup, case verification, and AI limitations.

- [ ] **Step 1: Add README assertions before changing copy**

  Add tests for the phrases or equivalent meaning that the site is primarily for systematic Python/C++ foundation and advanced learning, examples verify knowledge, and AI output must be run and tested.

- [ ] **Step 2: Update README**

  Add a short “如何学习” section describing the recommended order: foundation, advanced topics, small cases, AI-assisted review. Explicitly state that the site does not replace local execution, testing, or official documentation.

- [ ] **Step 3: Run the full validation suite**

  Run:

  ```text
  npm test
  npm run check
  npm run build
  git diff --check
  ```

  Expected: all tests pass, Astro reports 0 errors/warnings/hints, the static build succeeds, and Git reports no whitespace errors.

- [ ] **Step 4: Browser-verify the complete Phase 1 flow**

  Open the homepage, full route, AI route, Python detail page, and C++ detail page. Confirm visible level labels, route totals, four mastery statements, four AI prompt actions, current navigation highlighting, route filtering, and narrow-screen wrapping. Record any visual issue before claiming completion.

- [ ] **Step 5: Update the task review**

  Mark the Phase 1 checklist in `tasks/todo.md`, record test/check/build results, and state clearly that independent example repositories remain a later Phase 2 task.

## Execution result

- Task 1 completed in `b34f381`: classification rules, statistics, duration formatting, and schema extensions.
- Task 2 completed in `5283089`: route statistics, level badges, responsive presentation, and regression coverage.
- Task 3 completed in `d5e50c7`: mastery standards, safe AI study prompts, clipboard fallback, and responsive cards.
- Task 4 completed in the working tree: README boundary documentation, GitHub Pages regression coverage, full test/check/build verification, and browser acceptance.
- Phase 2 independent Python/C++ examples remain intentionally deferred; cases continue to be represented as a knowledge-verification layer rather than replacing the foundation and advanced curriculum.
