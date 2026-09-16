import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  DEFAULT_PROGRESS,
  PROGRESS_STORAGE_KEY,
  createProgressStore,
  markLessonViewed,
  markLessonComplete,
  parseProgress,
  serializeProgress,
} from "../src/lib/progress.ts";

describe("progress state", () => {
  it("uses a versioned default state", () => {
    assert.deepEqual(DEFAULT_PROGRESS, {
      version: 1,
      selectedGoal: null,
      completedLessonIds: [],
      lastLessonId: null,
      lastViewedLessonId: null,
      updatedAt: null,
    });
    assert.equal(PROGRESS_STORAGE_KEY, "langshift-progress:v1");
  });

  it("marks a lesson once and remembers the latest lesson", () => {
    const first = markLessonComplete(DEFAULT_PROGRESS, "common-runtime");
    const second = markLessonComplete(first, "common-runtime");

    assert.deepEqual(first.completedLessonIds, ["common-runtime"]);
    assert.deepEqual(second.completedLessonIds, ["common-runtime"]);
    assert.equal(second.lastLessonId, "common-runtime");
    assert.equal(typeof second.updatedAt, "string");
  });

  it("normalizes a partially recovered state before marking a lesson", () => {
    const recovered = markLessonComplete(
      {
        version: 1,
        selectedGoal: null,
        completedLessonIds: undefined as unknown as string[],
        lastLessonId: null,
        lastViewedLessonId: null,
        updatedAt: null,
      },
      "common-values",
    );

    assert.deepEqual(recovered.completedLessonIds, ["common-values"]);
  });

  it("rejects malformed or future progress and round-trips valid state", () => {
    assert.deepEqual(parseProgress("not-json"), DEFAULT_PROGRESS);
    assert.deepEqual(parseProgress(JSON.stringify({ version: 2 })), DEFAULT_PROGRESS);

    const state = markLessonComplete(DEFAULT_PROGRESS, "python-data");
    assert.deepEqual(parseProgress(serializeProgress(state)), state);
  });

  it("preserves old progress and records the last viewed lesson", () => {
    const oldState = parseProgress(
      JSON.stringify({ version: 1, completedLessonIds: ["python-syntax"], lastLessonId: "python-syntax" }),
    );
    assert.equal(oldState.lastViewedLessonId, null);
    const viewed = markLessonViewed(oldState, "python-control-flow");
    assert.equal(viewed.lastViewedLessonId, "python-control-flow");
    assert.deepEqual(parseProgress(serializeProgress(viewed)).completedLessonIds, ["python-syntax"]);
  });

  it("falls back to memory when localStorage is unavailable", () => {
    const storage = {
      getItem: () => {
        throw new Error("blocked");
      },
      setItem: () => {
        throw new Error("blocked");
      },
    };

    const store = createProgressStore(storage);
    assert.equal(store.persisted, false);
    assert.deepEqual(store.read(), DEFAULT_PROGRESS);

    const state = markLessonComplete(DEFAULT_PROGRESS, "cpp-sensors");
    store.write(state);
    assert.deepEqual(store.read(), state);
  });

});
