# LangShift Course Flow Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把现有 92 节 LangShift 课程升级为带有继续学习、阶段里程碑、阶段检查和结课项目提示的完整学习闭环。

**Architecture:** 保留 Astro 静态页面、MDX 内容、Pagefind 搜索和 localStorage 进度存储。新增纯函数课程流程层负责阶段分组和下一节计算；Astro 页面负责输出可筛选的阶段结构；浏览器端进度脚本负责记录最近查看课程、渲染阶段/继续学习状态，并继续复用现有进度存储。

**Tech Stack:** Astro 5, TypeScript, MDX, Node.js test runner, Pagefind, browser localStorage

**Spec:** `docs/superpowers/specs/2026-09-16-course-flow-design.md`

## Global Constraints

- 保留现有 Astro + MDX + 静态 Pagefind 架构。
- 不重写现有 92 节课程，不修改 lesson slug、order 或 frontmatter。
- 不引入在线编译、账号系统、新后端依赖或虚假的自动判题结果。
- 保留 `langshift-progress:v1` 和已有完成记录；旧 JSON 缺少新增字段时按 `null` 兼容。
- AI 路线只展示 Python，机器人路线只展示 C++，全部路线继续展示全部 track。
- 新增页面结构必须支持移动端单列、键盘操作和可读焦点状态。

---

### Task 1: 建立课程阶段与下一节计算层

**Files:**
- Create: `src/lib/course-flow.ts`
- Test: `tests/course-flow.test.ts`
- Modify: `tasks/todo.md`

**Interfaces:**
- Consumes: `LessonMeta`, `Track`, `Goal`, `LESSONS` from `src/lib/lessons.ts` and `src/lib/progress.ts`.
- Produces: `CoursePhase`, `COURSE_PHASES`, `getCoursePhases(track)`, `getPhaseLessons(lessons, phase)`, `getNextLesson(lessons, goal, progress)`.

- [x] **Step 1: Write failing phase coverage tests**

Add tests that assert every track has ordered phases, every lesson belongs to exactly one phase, and the expected final lessons are project phases:

```ts
test("all lessons belong to exactly one ordered phase", () => {
  for (const track of ["common", "python", "cpp"] as const) {
    const trackLessons = LESSONS.filter((lesson) => lesson.track === track);
    const phases = getCoursePhases(track);
    assert.ok(phases.length >= 3);
    assert.deepEqual(phases.map((phase) => phase.startOrder), [...phases].sort((a, b) => a - b).map((phase) => phase.startOrder));
    for (const lesson of trackLessons) {
      assert.equal(phases.filter((phase) => lesson.order >= phase.startOrder && lesson.order <= phase.endOrder).length, 1);
    }
  }
  assert.equal(getCoursePhases("python").at(-1)?.project, true);
  assert.equal(getCoursePhases("cpp").at(-1)?.project, true);
});
```

- [x] **Step 2: Run the focused test and verify it fails**

Run `npm test -- tests/course-flow.test.ts`.

Expected: FAIL because `src/lib/course-flow.ts` and the exported phase helpers do not exist.

- [x] **Step 3: Implement deterministic phase definitions and helpers**

Create the phase table with these order ranges:

```ts
export interface CoursePhase {
  id: string;
  track: Track;
  title: string;
  description: string;
  startOrder: number;
  endOrder: number;
  checkpointLessonId?: string;
  project?: boolean;
}

export const COURSE_PHASES: CoursePhase[] = [
  // common: 1-7, 8-15, 16-23, 24-26
  // python: 1-8, 9-16, 17-24, 25-30
  // cpp: 1-16, 17-23, 24-32, 33-36
];
```

Implement `getCoursePhases(track)` as a filtered copy, `getPhaseLessons` as order-filtered and sorted, and `getNextLesson` as the first uncompleted lesson in the selected goal track (`python` for `ai`, `cpp` for `robotics`, `common` when no goal and no previous route can be inferred). Return `null` when the selected track is complete.

- [x] **Step 4: Run focused tests and existing route tests**

Run `npm test -- tests/course-flow.test.ts tests/routes.test.ts`.

Expected: all focused tests pass and route filtering remains unchanged.

- [x] **Step 5: Mark the task complete in the task tracker**

Append the new course-flow task to the active checklist in `tasks/todo.md`; leave the review section for the final validation task.

### Task 2: Preserve recent viewing and render route progress

**Files:**
- Modify: `src/lib/progress.ts`
- Modify: `src/scripts/progress-client.ts`
- Modify: `src/components/RouteSidebar.astro`
- Test: `tests/progress.test.ts`

**Interfaces:**
- Consumes: `CoursePhase`, `getNextLesson`, existing `ProgressState` and DOM data attributes.
- Produces: backward-compatible `lastViewedLessonId`, `markLessonViewed(state, lessonId)`, `[data-resume-*]`, `[data-phase-*]` rendering hooks.

- [x] **Step 1: Add failing progress compatibility tests**

Extend `tests/progress.test.ts` with these behaviors:

```ts
it("preserves old progress and records the last viewed lesson", () => {
  const oldState = parseProgress(JSON.stringify({ version: 1, completedLessonIds: ["python-syntax"], lastLessonId: "python-syntax" }));
  assert.equal(oldState.lastViewedLessonId, null);
  const viewed = markLessonViewed(oldState, "python-control-flow");
  assert.equal(viewed.lastViewedLessonId, "python-control-flow");
  assert.deepEqual(parseProgress(serializeProgress(viewed)).completedLessonIds, ["python-syntax"]);
});
```

- [x] **Step 2: Run the focused progress test and verify it fails**

Run `npm test -- tests/progress.test.ts`.

Expected: FAIL because the state shape and `markLessonViewed` do not exist.

- [x] **Step 3: Implement backward-compatible progress state changes**

Add `lastViewedLessonId: string | null` to `ProgressState` and `DEFAULT_PROGRESS`, normalize it as a nullable string, and implement:

```ts
export function markLessonViewed(state: ProgressState, lessonId: string, updatedAt = new Date().toISOString()): ProgressState {
  if (!lessonId.trim()) return state;
  return { ...normalizeProgress(state), lastViewedLessonId: lessonId, updatedAt };
}
```

Keep `PROGRESS_STORAGE_KEY` and version `1`; do not remove or rename `lastLessonId`.

- [x] **Step 4: Add DOM hooks for current phase and resume rendering**

Update `RouteSidebar.astro` to include `data-phase-id` on phase containers after the page begins using phase groups. Keep existing `data-track`, `data-route-track`, `data-lesson-id`, progress count and reset hooks unchanged.

- [x] **Step 5: Track lesson-link clicks and render phase completion**

In `progress-client.ts`, import `LESSONS`, `getNextLesson`, `getCoursePhases` and `markLessonViewed`. On every `[data-lesson-id]` anchor click, write the clicked lesson as `lastViewedLessonId`. Extend `render` so `[data-phase-progress]` receives `completed/total`, `[data-phase-bar]` receives a percentage width, and completed phase lessons keep their existing checkmark behavior.

- [x] **Step 6: Run progress, layout and content tests**

Run `npm test -- tests/progress.test.ts tests/layout.test.ts tests/content.test.ts`.

Expected: all tests pass; old progress parsing and route/sidebar hooks remain valid.

### Task 3: Add the continue-learning card and phase-based catalog

**Files:**
- Create: `src/components/ContinueLearning.astro`
- Modify: `src/pages/learn/index.astro`
- Modify: `src/components/ProgressIndicator.astro`
- Modify: `src/styles/global.css`
- Test: `tests/layout.test.ts`
- Test: `tests/course-flow.test.ts`

**Interfaces:**
- Consumes: `LESSONS`, `CoursePhase`, `getCoursePhases`, and progress-client data attributes.
- Produces: one resume card on `/learn`, phase sections with completion counters, checkpoint copy and project styling.

- [x] **Step 1: Write failing layout assertions**

Add assertions for the new public contract:

```ts
test("learn page exposes resume and phase progress hooks", () => {
  const learnPage = readFileSync(new URL("../src/pages/learn/index.astro", import.meta.url), "utf8");
  assert.match(learnPage, /ContinueLearning/);
  assert.match(learnPage, /data-phase-progress/);
  assert.match(learnPage, /data-phase-bar/);
});
```

- [x] **Step 2: Run the focused layout test and verify it fails**

Run `npm test -- tests/layout.test.ts`.

Expected: FAIL because the new component and phase markup are not present.

- [x] **Step 3: Implement the continue-learning component**

Create `ContinueLearning.astro` with a hidden-by-default card containing `data-resume-card`, `data-resume-phase`, `data-resume-title`, `data-resume-copy`, `data-resume-link` and `data-resume-status`. Render a safe default link to `/learn`; the browser script will replace it with the next lesson after reading local progress.

- [x] **Step 4: Replace foundation/specialization grouping with phase grouping**

In `learn/index.astro`, import `ContinueLearning`, `COURSE_PHASES`, `getCoursePhases` and `getPhaseLessons`. Render one `ContinueLearning` after the route mode banner. For each track, iterate its phases and render:

```astro
<div class:list={["track-subsection", { "phase-project": phase.project }]} data-phase-id={phase.id} data-phase-track={track}>
  <div class="track-section-header">...</div>
  <div class="phase-progress" aria-label={`${phase.title} 阶段进度`}>
    <span data-phase-progress>0/{phaseLessons.length}</span>
    <span class="phase-progress-bar"><span data-phase-bar></span></span>
  </div>
  <div class="course-list">...</div>
</div>
```

The phase header must include the checkpoint title when `checkpointLessonId` resolves to a lesson, and must identify a project phase as “结课项目”. Preserve the existing track IDs and goal filtering hooks.

- [x] **Step 5: Update progress-client to hydrate the resume card**

Add `renderResume(state, goal)` that selects the current goal track, prefers `lastViewedLessonId` if it is visible and incomplete, otherwise calls `getNextLesson`, and writes the title, phase label, summary and href. When no lesson remains, write “路线已完成” and link to `/learn`.

- [x] **Step 6: Style the new flow without changing the existing visual language**

Add CSS for `.resume-card`, `.phase-progress`, `.phase-progress-bar`, `[data-phase-bar]`, `.phase-checkpoint` and `.phase-project`. Add mobile rules at the existing `760px` breakpoint so the resume card and phase metadata stack without horizontal overflow. Maintain visible focus outlines for links and buttons.

- [x] **Step 7: Run the focused tests and build**

Run `npm test -- tests/layout.test.ts tests/course-flow.test.ts`; then run `npm run check`.

Expected: all tests pass and Astro reports 0 errors, warnings and hints.

### Task 4: Close the lesson-level loop and document validation

**Files:**
- Modify: `src/pages/learn/[track]/[slug].astro`
- Modify: `src/components/LessonNav.astro`
- Modify: `src/scripts/progress-client.ts`
- Modify: `src/styles/global.css`
- Modify: `tests/content.test.ts`
- Modify: `tests/layout.test.ts`
- Modify: `tasks/todo.md`
- Modify: `tasks/lessons.md`

**Interfaces:**
- Consumes: `getCoursePhases`, `getPhaseLessons`, `ProgressState`, existing lesson navigation and MDX component output.
- Produces: lesson phase context, checkpoint prompt, verified route-flow regression coverage and final review record.

- [x] **Step 1: Add failing lesson-flow assertions**

Assert that the lesson page passes phase data and that the navigation exposes completion and next-step hooks:

```ts
test("lesson detail includes phase context and completion flow", () => {
  const page = readFileSync(new URL("../src/pages/learn/[track]/[slug].astro", import.meta.url), "utf8");
  const nav = readFileSync(new URL("../src/components/LessonNav.astro", import.meta.url), "utf8");
  assert.match(page, /getCoursePhases/);
  assert.match(page, /data-lesson-phase/);
  assert.match(nav, /data-complete-lesson/);
  assert.match(nav, /data-next-lesson/);
});
```

- [x] **Step 2: Run the focused tests and verify the new assertions fail**

Run `npm test -- tests/content.test.ts tests/layout.test.ts`.

Expected: FAIL only on the new phase-context and next-lesson hooks.

- [x] **Step 3: Add phase context to lesson details**

Find the current lesson phase in `[track]/[slug].astro`, add `data-lesson-phase={phase.id}` to the lesson section, add the phase title to the eyebrow/meta, and render a compact phase progress block before `LessonNav` with checkpoint copy when the current lesson is the checkpoint.

- [x] **Step 4: Add an explicit next-lesson hook and preserve completion behavior**

In `LessonNav.astro`, add `data-next-lesson` to the next link when present and expose the current lesson ID unchanged. The script must continue to toggle completion without deleting other completed lessons, then rerender the resume and phase counters.

- [x] **Step 5: Add regression checks for route completion and page structure**

Extend tests to verify that AI and robotics visible lesson sets still exclude the other target language, every phase has a non-empty title/description, and the lesson page retains `LessonResources` for Python/C++.

- [x] **Step 6: Run the full verification suite**

Run `npm test`; then `npm run check`; then `npm run build`.

Expected: all tests pass, Astro reports 0 errors / 0 warnings / 0 hints, and the build generates the existing static lesson pages plus the new phase markup.

- [x] **Step 7: Browser-verify the running site**

With `npm run dev -- --host 127.0.0.1` running, verify `/learn`, `/learn?goal=ai`, `/learn?goal=robotics`, one Python detail page, one C++ detail page and `/search`. Check the resume card, phase counters, completion toggle, next lesson link, mobile layout and browser console logs.

- [x] **Step 8: Record the review and lessons**

Append actual test counts, build page/index counts, browser routes checked, and any intentionally deferred behavior to `tasks/todo.md`. Add one lesson entry to `tasks/lessons.md` stating that learning-flow acceptance must test next-action clarity and phase completion, not only course count or content length.

## Review Result

- Plan self-review: all four requirements in the approved design are covered by Tasks 1–4.
- No existing lesson slug, order, frontmatter, progress storage key, route filter contract or resource rendering contract is changed.
- The new browser state is derived from deterministic lesson order and local progress, so it remains testable without a backend.
