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
