import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const styles = await readFile(new URL("../src/styles/global.css", import.meta.url), "utf8");

test("learn route and course catalog use separate responsive layout columns", () => {
  assert.match(
    styles,
    /\.learn-layout\s*\{[^}]*display:\s*grid;[^}]*grid-template-columns:\s*238px\s+minmax\(0,\s*1fr\)/s,
  );
  assert.match(
    styles,
    /@media\s*\(max-width:\s*760px\)\s*\{[\s\S]*?\.learn-layout\s*\{\s*display:\s*block;/,
  );
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

test("active primary navigation uses a quiet underline instead of a filled pill", () => {
  const activeRule = styles.match(/\.desktop-nav a\.is-active\s*\{([^}]*)\}/)?.[1] ?? "";
  const indicatorRule = styles.match(/\.desktop-nav a\.is-active::after\s*\{([^}]*)\}/)?.[1] ?? "";

  assert.match(activeRule, /color:\s*var\(--blue-dark\)/);
  assert.doesNotMatch(activeRule, /(?:background|box-shadow|border)\s*:/);
  assert.match(indicatorRule, /position:\s*absolute/);
  assert.match(indicatorRule, /height:\s*2px/);
  assert.match(indicatorRule, /background:\s*var\(--blue\)/);
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
  assert.match(client, /data-toc-link/);
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
