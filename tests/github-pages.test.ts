import { readFile } from "node:fs/promises";
import { test } from "node:test";
import assert from "node:assert/strict";

const read = (path: string) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("Astro is configured for the repository GitHub Pages URL", async () => {
  const config = await read("astro.config.mjs");

  assert.match(config, /site:\s*["']https:\/\/aizzyyc\.github\.io["']/);
  assert.match(config, /base:\s*["']\/ts-to-py-cpp["']/);
});

test("GitHub Pages workflow gates deployment behind the project checks", async () => {
  const workflow = await read(".github/workflows/deploy.yml");

  assert.match(workflow, /push:\s*\n\s*branches:\s*\[?\s*main/);
  assert.match(workflow, /workflow_dispatch:/);
  assert.match(workflow, /contents:\s*read/);
  assert.match(workflow, /actions:\s*read/);
  assert.match(workflow, /pages:\s*write/);
  assert.match(workflow, /id-token:\s*write/);
  assert.match(workflow, /actions\/checkout@v6/);
  assert.match(workflow, /actions\/setup-node@v7/);
  assert.match(workflow, /npm ci/);
  assert.match(workflow, /npm test/);
  assert.match(workflow, /npm run check/);
  assert.match(workflow, /npm run build/);
  assert.match(workflow, /actions\/upload-pages-artifact@v4/);
  assert.match(workflow, /path:\s*\.\/dist/);
  assert.match(workflow, /needs:\s*build/);
  assert.match(workflow, /actions\/deploy-pages@v5/);
});

test("README exposes the GitHub Pages entry point", async () => {
  const readme = await read("README.md");

  assert.match(readme, /https:\/\/aizzyyc\.github\.io\/ts-to-py-cpp\//);
  assert.match(readme, /GitHub Actions/);
});

test("README explains the foundation-first learning boundary", async () => {
  const readme = await read("README.md");

  assert.match(readme, /如何学习/);
  assert.match(readme, /基础.*进阶/s);
  assert.match(readme, /案例.*验证/s);
  assert.match(readme, /AI.*运行.*测试/s);
});
