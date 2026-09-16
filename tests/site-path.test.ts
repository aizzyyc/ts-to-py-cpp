import assert from "node:assert/strict";
import { test } from "node:test";
import { sitePath } from "../src/lib/site-path.ts";

test("sitePath prefixes root, query, and hash links with the configured base", () => {
  assert.equal(sitePath("/", "/ts-to-py-cpp/"), "/ts-to-py-cpp/");
  assert.equal(sitePath("/learn?goal=ai", "/ts-to-py-cpp/"), "/ts-to-py-cpp/learn?goal=ai");
  assert.equal(sitePath("/#method", "/ts-to-py-cpp/"), "/ts-to-py-cpp/#method");
});
