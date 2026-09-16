# GitHub Pages Publishing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish the LangShift Astro site automatically to GitHub Pages and make the GitHub repository easier to understand, run, and contribute to.

**Architecture:** Astro will generate a static site with `site` set to the user Pages host and `base` set to the repository path. A small `sitePath` helper will apply that base to every internal template and browser-side link, including generated search results and history URLs. A single GitHub Actions workflow will run the same test, check, and build commands used locally, upload `dist` as a Pages artifact, and deploy it through the `github-pages` environment. README documentation and repository metadata will point users to the published site and contribution path.

**Tech Stack:** Astro 5, MDX, Pagefind, npm lockfile, GitHub Actions, GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-09-16-github-pages-publishing-design.md`

## Global Constraints

- Publish the static site at `https://aizzyyc.github.io/ts-to-py-cpp/`.
- Keep the repository public and the default branch as `main`.
- The workflow must run `npm test`, `npm run check`, and `npm run build` before deployment.
- Do not add a backend, online code execution, runtime secret, or new application dependency.
- Do not use a force push or overwrite unrelated remote changes.
- Keep the existing local progress model and course behavior unchanged.
- Every internal URL must work both at the domain root and under `/ts-to-py-cpp/`.

---

### Task 1: Add a failing GitHub publishing contract test

**Files:**
- Create: `tests/github-pages.test.ts`
- Create: `tests/site-path.test.ts`
- Modify: `package.json` (include the new test in `test` and `test:watch`)

**Interfaces:**
- Consumes: repository files at the workspace root.
- Produces: executable assertions for the Astro Pages settings, workflow gates, artifact path, and README publishing entry point.

- [x] **Step 1: Write the failing test**

Create a Node test that checks the required published URL and repository path in `astro.config.mjs`, the required workflow triggers, permissions, quality commands, artifact path, and deployment dependency in `.github/workflows/deploy.yml`, and the published URL plus GitHub Actions section in `README.md`.

```ts
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
  assert.match(workflow, /pages:\s*write/);
  assert.match(workflow, /id-token:\s*write/);
  assert.match(workflow, /npm ci/);
  assert.match(workflow, /npm test/);
  assert.match(workflow, /npm run check/);
  assert.match(workflow, /npm run build/);
  assert.match(workflow, /actions\/upload-pages-artifact@v4/);
  assert.match(workflow, /path:\s*\.\/dist/);
  assert.match(workflow, /needs:\s*build/);
  assert.match(workflow, /actions\/deploy-pages@v4/);
});

test("README exposes the GitHub Pages entry point", async () => {
  const readme = await read("README.md");

  assert.match(readme, /https:\/\/aizzyyc\.github\.io\/ts-to-py-cpp\//);
  assert.match(readme, /GitHub Actions/);
});
```

- [x] **Step 2: Run the test to verify it fails**

Run: `node --experimental-strip-types --test tests/github-pages.test.ts`

Expected: FAIL because the `site` and `base` settings, Pages workflow, and README publishing section do not yet exist.

- [x] **Step 3: Register the test in the project scripts**

Add `tests/github-pages.test.ts` to the existing `npm test` and `npm run test:watch` test-file lists without changing any existing test command.

- [x] **Step 4: Run the focused test again**

Run: `npm test -- tests/github-pages.test.ts`

Expected: the test remains red until Tasks 2 and 3 add the required implementation and documentation.

- [x] **Step 5: Write the failing base-path helper test**

Create `tests/site-path.test.ts` before adding the helper implementation:

```ts
import assert from "node:assert/strict";
import { test } from "node:test";
import { sitePath } from "../src/lib/site-path.ts";

test("sitePath prefixes root, query, and hash links with the configured base", () => {
  assert.equal(sitePath("/", "/ts-to-py-cpp/"), "/ts-to-py-cpp/");
  assert.equal(sitePath("/learn?goal=ai", "/ts-to-py-cpp/"), "/ts-to-py-cpp/learn?goal=ai");
  assert.equal(sitePath("/#method", "/ts-to-py-cpp/"), "/ts-to-py-cpp/#method");
});
```

- [x] **Step 6: Run the helper test to verify it fails**

Run: `node --experimental-strip-types --test tests/site-path.test.ts`

Expected: FAIL because `src/lib/site-path.ts` does not yet exist.

### Task 2: Configure Astro and GitHub Actions deployment

**Files:**
- Modify: `astro.config.mjs`
- Create: `.github/workflows/deploy.yml`
- Create: `src/lib/site-path.ts`
- Modify: `src/components/SiteHeader.astro`, `src/components/LessonNav.astro`, `src/components/RouteSidebar.astro`, `src/components/ContinueLearning.astro`
- Modify: `src/pages/index.astro`, `src/pages/learn/index.astro`, `src/pages/learn/[track]/[slug].astro`, `src/pages/search.astro`
- Modify: `src/scripts/search-client.ts`, `src/scripts/progress-client.ts`

**Interfaces:**
- Consumes: the static Astro build and the committed `package-lock.json`.
- Produces: a Pages-ready `dist` artifact and a deployment job triggered by `main` pushes or manual dispatch.

- [x] **Step 1: Configure the Pages URL and repository base**

Update the Astro config to include:

```js
site: "https://aizzyyc.github.io",
base: "/ts-to-py-cpp",
```

Keep the existing MDX integration and static output setting unchanged.

- [x] **Step 2: Add the gated deployment workflow**

Create `.github/workflows/deploy.yml` with this behavior:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Check out repository
        uses: actions/checkout@v4
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: npm
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test
      - name: Run Astro checks
        run: npm run check
      - name: Build static site
        run: npm run build
      - name: Configure GitHub Pages
        uses: actions/configure-pages@v5
      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v4
        with:
          path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [x] **Step 3: Run the focused contract test**

Run: `node --experimental-strip-types --test tests/github-pages.test.ts`

Expected: PASS for Astro configuration, workflow gates, artifact path, and README entry point after Task 3 is complete.

- [x] **Step 4: Implement and use the base-path helper**

Create `src/lib/site-path.ts` with this pure, browser-safe contract:

```ts
export function sitePath(path: string, base = import.meta.env.BASE_URL): string {
  const normalizedBase = base === "/" ? "" : base.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}` || "/";
}
```

Import `sitePath` anywhere the app creates an internal URL. Replace hard-coded `/`, `/learn`, `/search`, lesson URLs, search result URLs, progress resume URLs, history replacement URLs, and keyboard shortcut navigation. Keep hash-only links such as `#method` unchanged because they stay on the current page.

- [x] **Step 5: Run the helper and full tests**

Run: `node --experimental-strip-types --test tests/site-path.test.ts` and then `npm test`.

Expected: the helper test passes and the complete suite reports 0 failures.

### Task 3: Document GitHub usage and record the release configuration

**Files:**
- Modify: `README.md`
- Modify: `tasks/todo.md`

**Interfaces:**
- Consumes: the public Pages URL and workflow name from Task 2.
- Produces: a clear repository landing-page section and a durable review record.

- [x] **Step 1: Add the online learning entry point**

Add a top-level status/link block near the README introduction:

```md
[![Deploy to GitHub Pages](https://github.com/aizzyyc/ts-to-py-cpp/actions/workflows/deploy.yml/badge.svg)](https://github.com/aizzyyc/ts-to-py-cpp/actions/workflows/deploy.yml)
[![在线学习](https://img.shields.io/badge/在线学习-GitHub%20Pages-1f6feb)](https://aizzyyc.github.io/ts-to-py-cpp/)
```

Add a `## GitHub 发布与贡献` section explaining that pushes to `main` run the checks and publish the static site, and that contributors should fork or branch, run `npm test`, `npm run check`, and `npm run build`, then open a pull request. Keep the existing MVP boundaries visible.

- [x] **Step 2: Record the configuration in the task log**

Add a checked section to `tasks/todo.md` recording the Pages URL, the workflow gates, the local verification commands, and the fact that repository About metadata is updated after the first successful Pages deployment.

- [x] **Step 3: Re-run the focused test**

Run: `node --experimental-strip-types --test tests/github-pages.test.ts`

Expected: PASS with three passing tests.

### Task 4: Verify locally, publish, and update GitHub metadata

**Files:**
- No additional source files; update GitHub repository metadata through the repository settings UI after the workflow is available.

**Interfaces:**
- Consumes: the committed workflow and README.
- Produces: a successful remote Actions run, a reachable Pages URL, and completed About metadata.

- [x] **Step 1: Run the full local verification**

Run:

```text
npm test
npm run check
npm run build
```

Expected: all tests pass, Astro reports 0 errors/warnings/hints, and the static build plus Pagefind indexing succeeds.

- [x] **Step 2: Inspect the generated base-path output**

Verify the built HTML references `/ts-to-py-cpp/` for internal links and assets, does not contain root-relative internal links such as `href="/learn"` or `href="/search"`, and that `dist/pagefind/` exists after the build.

- [ ] **Step 3: Commit the implementation**

```text
git add .github/workflows/deploy.yml astro.config.mjs README.md package.json tasks/todo.md tests/github-pages.test.ts
git commit -m "ci: deploy site to GitHub Pages"
```

- [ ] **Step 4: Push to `origin/main`**

```text
git push origin main
```

Do not force-push. If remote history changes before the push, fetch and inspect it before integrating.

- [ ] **Step 5: Configure GitHub Pages and repository About metadata**

In `aizzyyc/ts-to-py-cpp`:

- Set Pages source to `GitHub Actions` if GitHub has not already selected it.
- Set description to `从 JavaScript/TypeScript 学习 Python 与 C++，面向 AI 和机器人开发的系统化课程工作台。`
- Set website to `https://aizzyyc.github.io/ts-to-py-cpp/`.
- Set topics to `javascript`, `typescript`, `python`, `cpp`, `ai`, `robotics`, `ros2`, `astro`, `mdx`, and `programming-learning`.

Do not create a release or package for this static course site yet.

- [ ] **Step 6: Verify the remote result**

Check the Actions run, open the Pages URL, and verify the home page, `/learn`, a lesson page, and search. Confirm local `main` and `origin/main` resolve to the same commit and the worktree is clean.

### Review checklist

- [ ] Spec requirements all map to Tasks 1–4.
- [ ] No placeholders remain in this plan.
- [ ] The workflow's build job gates the deploy job with `needs: build`.
- [ ] The Pages URL and Astro base path are consistent in config, README, and GitHub metadata.
- [ ] Local tests, checks, and build are freshly verified before claiming completion.
