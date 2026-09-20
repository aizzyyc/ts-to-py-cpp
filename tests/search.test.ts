import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { searchLessons, type SearchEntry } from "../src/lib/search.ts";

const entries: SearchEntry[] = [
  {
    id: "python-data",
    slug: "ai-data-inputs",
    title: "AI 数据输入：从 JSON 到特征表",
    summary: "清洗数据并构造 AI 输入。",
    track: "python",
    concepts: ["data", "validation"],
    content: "feature table and JSON validation",
  },
  {
    id: "cpp-raii",
    slug: "raii-and-smart-pointers",
    title: "RAII 与智能指针",
    summary: "理解资源生命周期。",
    track: "cpp",
    concepts: ["ownership"],
    content: "unique_ptr owns a resource",
  },
];

test("search matches Chinese content and technical code terms", () => {
  assert.equal(searchLessons(entries, "特征表")[0]?.id, "python-data");
  assert.equal(searchLessons(entries, "unique_ptr")[0]?.id, "cpp-raii");
  assert.deepEqual(searchLessons(entries, "   "), []);
});

test("search page ships a local searchable index instead of a dev-only Pagefind import", async () => {
  const source = await readFile(new URL("../src/pages/search.astro", import.meta.url), "utf8");
  assert.match(source, /id="search-index"/);
  assert.match(source, /search-client\.ts/);
  assert.doesNotMatch(source, /PagefindUI/);
  assert.match(source, /data-search-suggestion/);
});

test("search suggestions populate the query without leaving the search page", async () => {
  const client = await readFile(new URL("../src/scripts/search-client.ts", import.meta.url), "utf8");
  assert.match(client, /data-search-suggestion/);
  assert.match(client, /history\.replaceState/);
  assert.match(client, /suggestion\.addEventListener\("click"/);
});
