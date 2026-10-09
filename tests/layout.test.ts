import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const styles = await readFile(new URL("../src/styles/global.css", import.meta.url), "utf8");

test("learn route and course catalog use separate responsive layout columns", () => {
  assert.match(
    styles,
    /\.learn-layout\s*\{[^}]*display:\s*grid;[^}]*grid-template-columns:\s*250px\s+minmax\(0,\s*1fr\)/s,
  );
  assert.match(
    styles,
    /@media\s*\(max-width:\s*760px\)\s*\{[\s\S]*?\.learn-layout\s*\{\s*display:\s*block;/,
  );
});

test("route sidebar text and links use readable sizes and touch targets", () => {
  const rootVariables = styles.match(/:root\s*\{([^}]*)\}/)?.[1] ?? "";
  const rule = (selector: string) =>
    styles.match(new RegExp(`${selector.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}\\s*\\{([^}]*)\\}`))?.[1] ?? "";
  const lessonLink = rule(".lesson-link");
  const phaseTitle = rule(".route-subgroup-title");
  const routeDescription = rule(".route-description");
  const lessonDuration = rule(".lesson-link-copy small");

  assert.match(rootVariables, /--type-ui:\s*15px/);
  assert.match(rootVariables, /--type-label:\s*14px/);
  assert.match(rootVariables, /--type-caption:\s*13px/);
  assert.match(lessonLink, /font-size:\s*var\(--type-ui\)/);
  assert.match(lessonLink, /min-height:\s*40px/);
  assert.match(phaseTitle, /font-size:\s*var\(--type-ui\)/);
  assert.match(routeDescription, /font-size:\s*var\(--type-caption\)/);
  assert.match(lessonDuration, /font-size:\s*var\(--type-caption\)/);
});

test("primary interface icons use the shared inline icon treatment", async () => {
  const header = await readFile(new URL("../src/components/SiteHeader.astro", import.meta.url), "utf8");
  const sidebar = await readFile(new URL("../src/components/RouteSidebar.astro", import.meta.url), "utf8");
  const homepage = await readFile(new URL("../src/pages/index.astro", import.meta.url), "utf8");
  const icon = await readFile(new URL("../src/components/Icon.astro", import.meta.url), "utf8").catch(() => "");

  assert.match(header, /<Icon name=/);
  assert.match(sidebar, /<Icon name=/);
  assert.match(homepage, /<Icon name=/);
  assert.match(icon, /<svg class:list=\{\["icon"/);
  assert.match(icon, /viewBox="0 0 24 24"/);
  assert.match(icon, /stroke="currentColor"/);
  assert.doesNotMatch(sidebar, /aria-hidden="true">(?:→|○|↘|\+)/);
});

test("learn page exposes resume and phase progress hooks", async () => {
  const learnPage = await readFile(new URL("../src/pages/learn/index.astro", import.meta.url), "utf8");
  const client = await readFile(new URL("../src/scripts/progress-client.ts", import.meta.url), "utf8");
  assert.match(learnPage, /ContinueLearning/);
  assert.match(learnPage, /data-phase-progress/);
  assert.match(learnPage, /data-phase-bar/);
  assert.match(learnPage, /data-goal-switch/);
  assert.match(client, /const visibleCompletedCount/);
  assert.match(client, /visibleCompletedCount === 0/);
  assert.match(client, /推荐开始/);
  assert.match(client, /已浏览 · 继续学习/);
});

test("learning overview lets learners switch between focused goals", async () => {
  const learnPage = await readFile(new URL("../src/pages/learn/index.astro", import.meta.url), "utf8");
  assert.match(learnPage, /data-goal-switch="ai"/);
  assert.match(learnPage, /data-goal-switch="robotics"/);
  assert.match(learnPage, /goal=ai/);
  assert.match(learnPage, /goal=robotics/);
});

test("lesson route sidebar exposes the same phase structure", async () => {
  const sidebar = await readFile(new URL("../src/components/RouteSidebar.astro", import.meta.url), "utf8");
  const client = await readFile(new URL("../src/scripts/progress-client.ts", import.meta.url), "utf8");
  assert.match(sidebar, /getCoursePhases/);
  assert.match(sidebar, /data-phase-id/);
  assert.match(sidebar, /<details/);
  assert.match(sidebar, /open=\{phase\.id === currentPhaseId\}/);
  assert.match(sidebar, /aria-current=\{lesson\.id === currentLessonId \? "page"/);
  assert.match(client, /scrollIntoView\(\{ block: "nearest" \}\)/);
});

test("lesson detail includes phase context and completion flow", async () => {
  const page = await readFile(new URL("../src/pages/learn/[track]/[slug].astro", import.meta.url), "utf8");
  const nav = await readFile(new URL("../src/components/LessonNav.astro", import.meta.url), "utf8");
  assert.match(page, /getCoursePhases/);
  assert.match(page, /data-lesson-phase/);
  assert.match(nav, /data-complete-lesson/);
  assert.match(nav, /data-next-lesson/);
});

test("learning overview uses phase links instead of repeating every lesson in the sidebar", async () => {
  const learnPage = await readFile(new URL("../src/pages/learn/index.astro", import.meta.url), "utf8");
  const sidebar = await readFile(new URL("../src/components/RouteSidebar.astro", import.meta.url), "utf8");
  const overviewBranch = sidebar.match(/overview \? \(([\s\S]*?)\) : \(/)?.[1];

  assert.match(learnPage, /<RouteSidebar lessons=\{LESSONS\} overview/);
  assert.match(learnPage, /id=\{phase\.id\}[^>]*data-overview-phase/);
  assert.match(sidebar, /overview\?: boolean/);
  assert.ok(overviewBranch);
  assert.match(overviewBranch, /data-phase-nav/);
  assert.doesNotMatch(overviewBranch, /lesson-list|data-lesson-id/);
  assert.match(sidebar, /<ol class="lesson-list">/);
  assert.match(sidebar, /overview \? "阶段导航" : "学习路线"/);
});

test("phase navigation highlights the section at the reading position", async () => {
  const client = await readFile(new URL("../src/scripts/progress-client.ts", import.meta.url), "utf8");

  assert.match(client, /function initPhaseNavigation\(/);
  assert.match(client, /addEventListener\("scroll"/);
  assert.match(client, /getActivePhaseId\(/);
  assert.match(client, /setAttribute\("aria-current", "location"\)/);
  assert.match(styles, /\.phase-nav-link\.is-current/);
});

const phaseNavigation = await import("../src/lib/phase-navigation.ts").catch(() => null);

test("active phase follows the last section above the reading line", () => {
  assert.ok(phaseNavigation, "phase navigation selection logic should be available for unit testing");
  if (!phaseNavigation) return;

  assert.equal(
    phaseNavigation.getActivePhaseId(
      [
        { id: "foundation", top: -480 },
        { id: "systems", top: -40 },
        { id: "project", top: 510 },
      ],
      120,
    ),
    "systems",
  );
  assert.equal(phaseNavigation.getActivePhaseId([{ id: "first", top: 440 }], 120), "first");
  assert.equal(phaseNavigation.getActivePhaseId([], 120), null);
});

const primaryNavigation = await import("../src/lib/primary-navigation.ts").catch(() => null);

test("primary navigation identifies learning and search routes, including the GitHub Pages base", () => {
  assert.ok(primaryNavigation, "primary navigation route matching should be available");
  if (!primaryNavigation) return;

  assert.equal(primaryNavigation.getPrimaryNavSection("/learn/"), "learn");
  assert.equal(
    primaryNavigation.getPrimaryNavSection("/ts-to-py-cpp/learn/cpp/compile-link-and-cmake/", "/ts-to-py-cpp/"),
    "learn",
  );
  assert.equal(primaryNavigation.getPrimaryNavSection("/ts-to-py-cpp/search/", "/ts-to-py-cpp/"), "search");
  assert.equal(primaryNavigation.getPrimaryNavSection("/ts-to-py-cpp/", "/ts-to-py-cpp/"), null);
});

test("learning-method navigation is current only at its exact anchor", () => {
  assert.ok(primaryNavigation, "primary navigation location matching should be available");
  if (!primaryNavigation) return;

  assert.equal(
    primaryNavigation.isCurrentHashTarget("/ts-to-py-cpp", "#method", "/ts-to-py-cpp/", "#method"),
    true,
  );
  assert.equal(
    primaryNavigation.isCurrentHashTarget("/ts-to-py-cpp/learn/", "#method", "/ts-to-py-cpp/", "#method"),
    false,
  );
  assert.equal(
    primaryNavigation.isCurrentHashTarget("/ts-to-py-cpp/", "#paths", "/ts-to-py-cpp/", "#method"),
    false,
  );
});

test("learning-method navigation scrolls to the anchor after a route transition", async () => {
  const header = await readFile(new URL("../src/components/SiteHeader.astro", import.meta.url), "utf8");
  assert.match(header, /scrollIntoView\(\{ block: "start" \}\)/);
  assert.match(header, /requestAnimationFrame/);
  assert.match(header, /addEventListener\("pageshow"/);
});

test("focused routes keep shared foundations reachable without mixing course lists", async () => {
  const learnPage = await readFile(new URL("../src/pages/learn/index.astro", import.meta.url), "utf8");
  assert.match(learnPage, /data-shared-foundation-link/);
  assert.match(learnPage, /data-shared-foundation-link[^>]*data-clear-goal/);
  assert.match(learnPage, /共同基础/);
  assert.match(learnPage, /common-orientation/);
});

test("active primary navigation uses a quiet underline instead of a filled pill", () => {
  const activeRule = styles.match(/\.desktop-nav a\.is-active\s*\{([^}]*)\}/)?.[1] ?? "";
  const indicatorRule = styles.match(/\.desktop-nav a\.is-active::after\s*\{([^}]*)\}/)?.[1] ?? "";

  assert.match(activeRule, /color:\s*var\(--blue-dark\)/);
  assert.doesNotMatch(activeRule, /(?:background|box-shadow|border)\s*:/);
  assert.match(indicatorRule, /position:\s*absolute/);
  assert.match(indicatorRule, /height:\s*2px/);
  assert.match(indicatorRule, /background:\s*var\(--blue\)/);
});

test("active desktop navigation does not change label typography or width", () => {
  const activeRule = styles.match(/\.desktop-nav a\.is-active\s*\{([^}]*)\}/)?.[1] ?? "";

  assert.doesNotMatch(activeRule, /(?:font-weight|font-size|letter-spacing)\s*:/);
});

test("page navigation reserves a stable scrollbar gutter across routes", () => {
  const rootRule = styles.match(/html\s*\{([^}]*)\}/)?.[1] ?? "";

  assert.match(rootRule, /scrollbar-gutter:\s*stable/);
});

test("lesson previous and next links keep arrows beside their titles and stack on narrow screens", () => {
  const linkRule = styles.match(/\.nav-link\s*\{([^}]*)\}/)?.[1] ?? "";
  const nextRule = styles.match(/\.nav-link\.next\s*\{([^}]*)\}/)?.[1] ?? "";
  const narrowScreenRules = styles.match(/@media\s*\(max-width:\s*760px\)\s*\{([\s\S]*?)\n\}/)?.[1] ?? "";

  assert.match(linkRule, /justify-content:\s*flex-start/);
  assert.doesNotMatch(linkRule, /justify-content:\s*space-between/);
  assert.match(nextRule, /justify-content:\s*flex-end/);
  assert.match(narrowScreenRules, /\.lesson-nav-links\s*\{[^}]*grid-template-columns:\s*1fr/s);
});

test("lesson overview exposes real anchors and scroll-synced active sections", async () => {
  const page = await readFile(new URL("../src/pages/learn/[track]/[slug].astro", import.meta.url), "utf8");
  const compare = await readFile(new URL("../src/components/CompareCode.astro", import.meta.url), "utf8");
  const exercise = await readFile(new URL("../src/components/Exercise.astro", import.meta.url), "utf8");
  const solution = await readFile(new URL("../src/components/SolutionReveal.astro", import.meta.url), "utf8");
  const client = await readFile(new URL("../src/scripts/progress-client.ts", import.meta.url), "utf8");

  assert.match(page, /data-lesson-toc/);
  assert.match(page, /data-lesson-content/);
  assert.match(compare, /data-lesson-section="code"/);
  assert.match(exercise, /data-lesson-section="exercise"/);
  assert.match(solution, /data-lesson-section="conclusion"/);
  assert.match(client, /IntersectionObserver/);
  assert.match(client, /dataset\.tocLink = entry\.id/);
});

const lessonOutline = await import("../src/lib/lesson-outline.ts").catch(() => null);

test("lesson overview nests every subsection under its nearest section heading", () => {
  assert.ok(lessonOutline, "lesson outline should be generated from the section headings");
  if (!lessonOutline) return;

  const outline = lessonOutline.buildLessonOutline([
    { id: "goals", label: "学习目标", level: 2 },
    { id: "migration", label: "迁移心智模型", level: 2 },
    { id: "initialization", label: "初始化规则", level: 3 },
    { id: "comparison", label: "代码对照", level: 3 },
    { id: "practice", label: "动手练习", level: 2 },
    { id: "exercise", label: "边界采样器", level: 3 },
  ]);

  assert.deepEqual(outline, [
    { id: "goals", label: "学习目标", children: [] },
    {
      id: "migration",
      label: "迁移心智模型",
      children: [
        { id: "initialization", label: "初始化规则", children: [] },
        { id: "comparison", label: "代码对照", children: [] },
      ],
    },
    {
      id: "practice",
      label: "动手练习",
      children: [{ id: "exercise", label: "边界采样器", children: [] }],
    },
  ]);
});

test("lesson page lets its content generate the overview instead of hiding sections", async () => {
  const page = await readFile(new URL("../src/pages/learn/[track]/[slug].astro", import.meta.url), "utf8");
  const client = await readFile(new URL("../src/scripts/progress-client.ts", import.meta.url), "utf8");
  const styles = await readFile(new URL("../src/styles/global.css", import.meta.url), "utf8");

  assert.match(page, /<ol class="aside-list" data-toc-list[^>]*><\/ol>/);
  assert.match(client, /querySelectorAll<HTMLElement>\("h2, h3, \[data-lesson-section\]"\)/);
  assert.match(client, /buildLessonOutline\(/);
  assert.match(styles, /\.aside-list\s*\{[^}]*max-height:[^}]*overflow-y:\s*auto/s);
  assert.match(styles, /\.aside-sublist\s*\{/);
  assert.match(styles, /\.aside-list a\s*\{[^}]*font-size:\s*var\(--type-ui\)/s);
});

test("internal navigation reinitializes page interactions after each client-side route change", async () => {
  const layout = await readFile(new URL("../src/layouts/BaseLayout.astro", import.meta.url), "utf8");
  const client = await readFile(new URL("../src/scripts/progress-client.ts", import.meta.url), "utf8");
  const search = await readFile(new URL("../src/scripts/search-client.ts", import.meta.url), "utf8");
  const header = await readFile(new URL("../src/components/SiteHeader.astro", import.meta.url), "utf8");

  assert.match(layout, /import \{ ClientRouter \} from "astro:transitions"/);
  assert.match(layout, /<ClientRouter\s+fallback="swap"\s*\/>/);
  assert.match(layout, /<html[^>]*transition:animate="none"/);
  assert.match(client, /document\.addEventListener\("astro:page-load", initializeProgressPage\)/);
  assert.match(search, /document\.addEventListener\("astro:page-load", initializeSearchPage\)/);
  assert.match(header, /document\.addEventListener\("astro:page-load", syncMethodNavigation\)/);
  assert.match(client, /pageController\?\.abort\(\)/);
  assert.match(client, /import \{ navigate \} from "astro:transitions\/client"/);
  assert.match(client, /void navigate\(sitePath\("\/search"\)\)/);
  assert.doesNotMatch(client, /window\.location\.href\s*=/);
});

test("learning and search pages share a top inset to keep header navigation visually aligned", () => {
  assert.match(styles, /--page-top-inset:\s*62px/);
  assert.match(styles, /\.learn-hero\s*\{[^}]*padding:\s*var\(--page-top-inset\)\s+0/s);
  assert.match(styles, /\.search-page\s*\{[^}]*padding:\s*var\(--page-top-inset\)\s+0/s);
  assert.match(styles, /@media\s*\(max-width:\s*760px\)[\s\S]*?--page-top-inset:\s*46px/s);
});

test("mobile code comparison explains how to read long lines", async () => {
  const compare = await readFile(new URL("../src/components/CompareCode.astro", import.meta.url), "utf8");
  assert.match(compare, /data-code-scroll-hint/);
  assert.match(styles, /\.code-scroll-hint/);
  assert.match(styles, /@media\s*\(max-width:\s*760px\)[\s\S]*?\.code-scroll-hint\s*\{[^}]*display:\s*inline/s);
});

test("mobile navigation keeps the primary learning links available", async () => {
  const header = await readFile(new URL("../src/components/SiteHeader.astro", import.meta.url), "utf8");
  assert.match(header, /data-mobile-menu-toggle/);
  assert.match(header, /data-mobile-nav/);
  assert.match(header, /aria-controls="mobile-nav"/);
  assert.match(styles, /\.mobile-menu-toggle/);
  assert.match(styles, /\.mobile-nav:not\(\[hidden\]\)/);
});

test("learning overview phases can collapse to reduce scanning density", async () => {
  const learnPage = await readFile(new URL("../src/pages/learn/index.astro", import.meta.url), "utf8");
  assert.match(learnPage, /<details class:list=\{\["track-subsection"/);
  assert.match(learnPage, /open=\{phase\.startOrder === 1\}/);
  assert.match(styles, /\.track-subsection > summary/);
});

test("learning routes expose level summaries and course badges", async () => {
  const learnPage = await readFile(new URL("../src/pages/learn/index.astro", import.meta.url), "utf8");
  const detailPage = await readFile(new URL("../src/pages/learn/[track]/[slug].astro", import.meta.url), "utf8");
  const badge = await readFile(new URL("../src/components/LessonLevelBadge.astro", import.meta.url), "utf8").catch(() => "");

  assert.match(learnPage, /getLessonClassificationStats/);
  assert.match(learnPage, /data-route-learning-stats/);
  assert.match(learnPage, /LessonLevelBadge/);
  assert.match(detailPage, /LessonLevelBadge/);
  assert.match(badge, /基础/);
  assert.match(badge, /进阶/);
  assert.match(badge, /案例/);
  assert.match(styles, /\.lesson-level-badge/);
  assert.match(styles, /\.route-learning-stats/);
});

test("lesson detail exposes mastery standards and safe AI study prompts", async () => {
  const page = await readFile(new URL("../src/pages/learn/[track]/[slug].astro", import.meta.url), "utf8");
  const mastery = await readFile(new URL("../src/components/LessonMastery.astro", import.meta.url), "utf8").catch(() => "");
  const aiCard = await readFile(new URL("../src/components/AiStudyCard.astro", import.meta.url), "utf8").catch(() => "");
  const client = await readFile(new URL("../src/scripts/progress-client.ts", import.meta.url), "utf8");

  assert.match(page, /LessonMastery/);
  assert.match(page, /AiStudyCard/);
  assert.match(mastery, /能解释/);
  assert.match(mastery, /能阅读/);
  assert.match(mastery, /能修改/);
  assert.match(mastery, /能排错/);
  assert.match(aiCard, /概念迁移/);
  assert.match(aiCard, /变式练习/);
  assert.match(aiCard, /排错辅助/);
  assert.match(aiCard, /复习检查/);
  assert.match(aiCard, /data-copy-text/);
  assert.match(client, /querySelectorAll<HTMLButtonElement>\("\[data-copy-text\]"\)/);
  assert.match(client, /请手动复制/);
});

const studyMethod = await import("../src/lib/study-method.ts").catch(() => null);

test("study method provides a timed routine, concrete outputs, and a recovery path", () => {
  assert.ok(studyMethod, "the practical study routine should be available");
  if (!studyMethod) return;

  assert.equal(studyMethod.STUDY_STEPS.length, 5);
  assert.equal(studyMethod.STUDY_STEPS.reduce((total, step) => total + step.minutes, 0), 35);
  assert.ok(studyMethod.STUDY_STEPS.every((step) => step.title && step.action && step.output));
  assert.equal(studyMethod.DEBUGGING_STEPS.length, 4);
  assert.ok(studyMethod.REVIEW_GUIDANCE.length > 40);
});

test("progress reset uses the shared accessible confirmation dialog", async () => {
  const layout = await readFile(new URL("../src/layouts/BaseLayout.astro", import.meta.url), "utf8");
  const dialog = await readFile(new URL("../src/components/ConfirmDialog.astro", import.meta.url), "utf8");
  const confirmation = await readFile(new URL("../src/lib/confirm-dialog.ts", import.meta.url), "utf8");
  const client = await readFile(new URL("../src/scripts/progress-client.ts", import.meta.url), "utf8");

  assert.match(layout, /<ConfirmDialog\s*\/>/);
  assert.match(dialog, /<dialog[^>]*data-confirm-dialog[^>]*aria-labelledby=/);
  assert.match(dialog, /data-confirm-cancel/);
  assert.match(dialog, /data-confirm-accept/);
  assert.match(confirmation, /export function requestConfirm/);
  assert.match(client, /await requestConfirm\(/);
  assert.match(client, /event\.preventDefault\(\)/);
  assert.match(client, /if \(!confirmed\) return/);
  assert.match(client, /await navigate\(element\.href\)/);
  assert.doesNotMatch(client, /window\.location\.assign\(/);
  assert.doesNotMatch(client, /window\.confirm\(/);
});
