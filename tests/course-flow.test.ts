import assert from "node:assert/strict";
import test from "node:test";
import { LESSONS } from "../src/lib/lessons.ts";
import { DEFAULT_PROGRESS } from "../src/lib/progress.ts";
import { getCoursePhases, getNextLesson, getPhaseLessons } from "../src/lib/course-flow.ts";

test("all lessons belong to exactly one ordered phase", () => {
  for (const track of ["common", "python", "cpp"] as const) {
    const trackLessons = LESSONS.filter((lesson) => lesson.track === track);
    const phases = getCoursePhases(track);
    assert.ok(phases.length >= 3);
    assert.deepEqual(
      phases.map((phase) => phase.startOrder),
      [...phases].sort((a, b) => a.startOrder - b.startOrder).map((phase) => phase.startOrder),
    );
    for (const lesson of trackLessons) {
      assert.equal(
        phases.filter((phase) => lesson.order >= phase.startOrder && lesson.order <= phase.endOrder).length,
        1,
      );
    }
  }
  assert.equal(getCoursePhases("python").at(-1)?.project, true);
  assert.equal(getCoursePhases("cpp").at(-1)?.project, true);
});

test("phase lessons are sorted and preserve the source lesson objects", () => {
  const phase = getCoursePhases("python")[1];
  const phaseLessons = getPhaseLessons(LESSONS, phase);

  assert.ok(phaseLessons.length > 0);
  assert.deepEqual(
    phaseLessons.map((lesson) => lesson.order),
    [...phaseLessons].sort((a, b) => a.order - b.order).map((lesson) => lesson.order),
  );
  assert.equal(phaseLessons[0], LESSONS.find((lesson) => lesson.id === phaseLessons[0].id));
});

test("next lesson follows the selected goal and skips completed lessons", () => {
  const firstRobotLesson = getNextLesson(LESSONS, "robotics", DEFAULT_PROGRESS);
  assert.equal(firstRobotLesson?.id, "cpp-toolchain");

  const nextPythonLesson = getNextLesson(LESSONS, "ai", {
    ...DEFAULT_PROGRESS,
    selectedGoal: "ai",
    completedLessonIds: ["python-syntax"],
  });
  assert.equal(nextPythonLesson?.id, "python-control-flow");

  const allPythonIds = LESSONS.filter((lesson) => lesson.track === "python").map((lesson) => lesson.id);
  assert.equal(
    getNextLesson(LESSONS, "ai", { ...DEFAULT_PROGRESS, completedLessonIds: allPythonIds }),
    null,
  );
});
