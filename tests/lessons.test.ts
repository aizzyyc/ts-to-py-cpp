import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  LESSONS,
  TRACK_LABELS,
  getLessonById,
  getLessonSection,
  getLessonsByTrack,
  getNextLesson,
  getPreviousLesson,
} from "../src/lib/lessons.ts";

describe("lesson catalog", () => {
  it("contains content-sized lessons in every track", () => {
    assert.equal(LESSONS.length, 92);
    assert.equal(getLessonsByTrack("common").length, 26);
    assert.equal(getLessonsByTrack("python").length, 30);
    assert.equal(getLessonsByTrack("cpp").length, 36);
  });

  it("sorts lessons and exposes stable navigation", () => {
    const firstPython = getLessonsByTrack("python")[0];
    const lastPython = getLessonsByTrack("python").at(-1);

    assert.equal(firstPython.order, 1);
    assert.equal(getPreviousLesson(firstPython.id), undefined);
    assert.equal(getNextLesson(firstPython.id)?.track, "python");
    assert.equal(getNextLesson(lastPython!.id), undefined);
    assert.equal(getPreviousLesson(lastPython!.id)?.track, "python");
  });

  it("keeps every track ordered and every prerequisite resolvable", () => {
    for (const track of ["common", "python", "cpp"] as const) {
      const lessons = getLessonsByTrack(track);
      assert.deepEqual(
        lessons.map((lesson) => lesson.order),
        lessons.map((_, index) => index + 1),
        `${track} lesson orders should be contiguous`,
      );

      for (const lesson of lessons) {
        for (const prerequisiteId of lesson.prerequisites ?? []) {
          const prerequisite = getLessonById(prerequisiteId);
          assert.ok(prerequisite, `${lesson.id} references a missing prerequisite`);
          if (prerequisite?.track === track) {
            assert.ok(prerequisite.order < lesson.order, `${lesson.id} must follow its prerequisite`);
          }
        }
      }
    }
  });

  it("gives each language route its own migration foundation", () => {
    assert.equal(getLessonsByTrack("python").filter((lesson) => getLessonSection(lesson) === "foundation").length, 8);
    assert.equal(getLessonsByTrack("cpp").filter((lesson) => getLessonSection(lesson) === "foundation").length, 16);
    assert.equal(getLessonSection(getLessonById("python-syntax")!), "foundation");
    assert.equal(getLessonSection(getLessonById("python-http")!), "specialization");
    assert.equal(getLessonSection(getLessonById("cpp-toolchain")!), "foundation");
    assert.equal(getLessonSection(getLessonById("cpp-ros-workspace")!), "specialization");
    assert.deepEqual(getLessonById("python-syntax")?.prerequisites ?? [], []);
    assert.deepEqual(getLessonById("cpp-toolchain")?.prerequisites ?? [], []);
  });

  it("finds a lesson by id and keeps user-facing track labels", () => {
    assert.match(getLessonById("cpp-sensor-pipeline")?.title ?? "", /传感器/);
    assert.deepEqual(TRACK_LABELS, {
      common: "迁移基础",
      python: "Python / AI",
      cpp: "C++ / Robotics",
    });
  });
});
