import assert from "node:assert/strict";
import test from "node:test";
import { getVisibleTracks, isTrackVisible } from "../src/lib/routes.ts";

test("goal filters show only the selected language path", () => {
  assert.deepEqual(getVisibleTracks(null), ["common", "python", "cpp"]);
  assert.deepEqual(getVisibleTracks("ai"), ["python"]);
  assert.deepEqual(getVisibleTracks("robotics"), ["cpp"]);
  assert.equal(isTrackVisible("cpp", "ai"), false);
  assert.equal(isTrackVisible("python", "robotics"), false);
  assert.equal(isTrackVisible("common", "ai"), false);
  assert.equal(isTrackVisible("common", "robotics"), false);
});
