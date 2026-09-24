import assert from "node:assert/strict";
import test from "node:test";
import { LESSONS } from "../src/lib/lessons.ts";
import {
  formatLearningMinutes,
  getLessonClassification,
  getLessonClassificationStats,
} from "../src/lib/lesson-levels.ts";

test("classifies common foundation, advanced, and capstone lessons", () => {
  assert.deepEqual(getLessonClassification(LESSONS.find((lesson) => lesson.id === "common-runtime")!), {
    level: "foundation",
    learningMode: "concept",
  });
  assert.deepEqual(getLessonClassification(LESSONS.find((lesson) => lesson.id === "common-tasks")!), {
    level: "advanced",
    learningMode: "concept",
  });
  assert.deepEqual(getLessonClassification(LESSONS.find((lesson) => lesson.id === "common-capstone")!), {
    level: "advanced",
    learningMode: "case",
  });
});

test("classifies Python and C++ language foundations independently", () => {
  assert.equal(getLessonClassification(LESSONS.find((lesson) => lesson.id === "python-syntax")!).level, "foundation");
  assert.equal(getLessonClassification(LESSONS.find((lesson) => lesson.id === "python-data")!).level, "advanced");
  assert.equal(getLessonClassification(LESSONS.find((lesson) => lesson.id === "cpp-toolchain")!).level, "foundation");
  assert.equal(getLessonClassification(LESSONS.find((lesson) => lesson.id === "cpp-networking")!).level, "advanced");
});

test("stats do not assume contiguous order values", () => {
  const stats = getLessonClassificationStats([
    { ...LESSONS[0], order: 10 },
    { ...LESSONS[1], order: 40 },
  ]);

  assert.equal(stats.total, 2);
  assert.equal(stats.totalMinutes, 18);
});

test("formats route duration for hours and minutes", () => {
  assert.equal(formatLearningMinutes(830), "约 13 小时 50 分钟");
  assert.equal(formatLearningMinutes(30), "约 30 分钟");
});
