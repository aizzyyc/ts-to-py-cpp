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
  assert.match(learnPage, /ContinueLearning/);
  assert.match(learnPage, /data-phase-progress/);
  assert.match(learnPage, /data-phase-bar/);
});

test("lesson route sidebar exposes the same phase structure", async () => {
  const sidebar = await readFile(new URL("../src/components/RouteSidebar.astro", import.meta.url), "utf8");
  assert.match(sidebar, /getCoursePhases/);
  assert.match(sidebar, /data-phase-id/);
});

test("lesson detail includes phase context and completion flow", async () => {
  const page = await readFile(new URL("../src/pages/learn/[track]/[slug].astro", import.meta.url), "utf8");
  const nav = await readFile(new URL("../src/components/LessonNav.astro", import.meta.url), "utf8");
  assert.match(page, /getCoursePhases/);
  assert.match(page, /data-lesson-phase/);
  assert.match(nav, /data-complete-lesson/);
  assert.match(nav, /data-next-lesson/);
});
