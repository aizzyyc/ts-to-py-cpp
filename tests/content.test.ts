import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";
import { getCppResources } from "../src/lib/cpp-resources.ts";
import { getPythonResources } from "../src/lib/python-resources.ts";

const lessonDirectory = new URL("../src/content/lessons/", import.meta.url);

function countExamples(source: string): number {
  const compareBlocks = (source.match(/<CompareCode/g) ?? []).length;
  const fencedBlocks = (source.match(/^(?:```|~~~)/gm) ?? []).length / 2;
  return compareBlocks + fencedBlocks;
}

function lessonBodyText(source: string): string {
  return source
    .replace(/^---[\s\S]*?---\s*/, "")
    .replace(/^import .*;\s*$/gm, "")
    .replace(/<\/?(?:CompareCode|KeyIdea|Exercise|SolutionReveal|p|strong|code)\b/g, "");
}

test("lesson body measurement preserves comparison operators", () => {
  const sample = "if (value < limit && limit > 0) return value;";
  assert.equal(lessonBodyText(sample), sample);
});

test("every lesson has a detailed migration lesson structure", async () => {
  const files = (await readdir(lessonDirectory)).filter((file) => file.endsWith(".mdx"));
  assert.equal(files.length, 92);

  const counts = { common: 0, python: 0, cpp: 0 };

  for (const file of files) {
    const source = await readFile(new URL(file, lessonDirectory), "utf8");
    assert.match(source, /^---[\s\S]*?title:/);
    assert.match(source, /<CompareCode/);
    assert.match(source, /<KeyIdea/);
    assert.match(source, /<Exercise/);
    assert.match(source, /<SolutionReveal/);
    assert.ok(source.trim().split("\n").length >= 35, `${file} should contain a detailed lesson body`);
    const body = lessonBodyText(source).replace(/\s/g, "");
    assert.ok(body.length >= 900, `${file} should contain at least 900 non-whitespace body characters`);
    assert.ok((source.match(/^#{2,3}\s/gm) ?? []).length >= 4, `${file} should contain at least four teaching sections`);
    const examples = countExamples(source);
    assert.ok(examples >= 2, `${file} should contain at least two code examples`);
    const track = source.match(/^track:\s*(common|python|cpp)\s*$/m)?.[1] as keyof typeof counts | undefined;
    assert.ok(track, `${file} should declare a supported track`);
    counts[track] += 1;
  }

  assert.deepEqual(counts, { common: 26, python: 30, cpp: 36 });
});

test("shared foundation lessons teach actionable goals, examples, verification, and synthesis", async () => {
  const files = (await readdir(lessonDirectory)).filter((file) => file.startsWith("common-") && file.endsWith(".mdx"));
  assert.equal(files.length, 26);

  for (const file of files) {
    const source = await readFile(new URL(file, lessonDirectory), "utf8");
    const body = lessonBodyText(source);
    const bodyLength = body.replace(/\s/g, "").length;
    const examples = countExamples(source);

    assert.ok(bodyLength >= 2400, `${file} should reach the same teaching depth as language-track lessons`);
    assert.ok((source.match(/^#{2,3}\s/gm) ?? []).length >= 8, `${file} should build concepts in enough steps`);
    assert.ok(examples >= 3, `${file} should include at least three progressively developed examples`);
    assert.match(source, /^##\s+学习目标/m, `${file} should state what learners can do after the lesson`);
    assert.match(source, /^#{2,3}\s+.*(运行|验证)/m, `${file} should show an observable verification`);
    assert.match(source, /^#{2,3}\s+.*(错误|排错|调试)/m, `${file} should teach a concrete failure and diagnosis`);
    assert.match(source, /^#{2,3}\s+.*(练习|任务)/m, `${file} should have a hands-on transfer exercise`);
    assert.match(source, /<SolutionReveal/, `${file} should provide an answer for self-checking`);
    assert.match(source, /^#{2,3}\s+.*(小结|总结)/m, `${file} should end with a concise synthesis`);
  }
});

test("Python lessons teach a complete beginner-to-AI progression", async () => {
  const files = (await readdir(lessonDirectory)).filter((file) => file.startsWith("python-") && file.endsWith(".mdx"));
  assert.equal(files.length, 30);

  for (const file of files) {
    const source = await readFile(new URL(file, lessonDirectory), "utf8");
    const body = lessonBodyText(source).replace(/\s/g, "");
    const examples = countExamples(source);
    const headings = (source.match(/^#{2,3}\s/gm) ?? []).length;

    assert.ok(body.length >= 2400, `${file} should teach at least 2400 non-whitespace body characters`);
    assert.ok(headings >= 8, `${file} should contain at least eight teaching sections`);
    assert.ok(examples >= 3, `${file} should contain at least three code examples`);
    assert.match(source, /学习目标|本节要学会|你将学会/, `${file} should state learning goals`);
    assert.match(source, /JS\s*\/\s*TS|JavaScript|TypeScript|Node\.js/, `${file} should explain the migration from JS/TS`);
    assert.match(source, /运行|输出|结果|验证/, `${file} should show an observable result or verification step`);
    assert.match(source, /常见错误|排错|调试/, `${file} should explain a failure mode and debugging path`);
    assert.match(source, /练习|任务/, `${file} should include hands-on practice`);
    assert.match(source, /AI|数据|模型|推理|服务/, `${file} should connect to an AI or data scenario`);
  }
});

test("Python lessons expose curated further reading", async () => {
  const files = (await readdir(lessonDirectory)).filter((file) => file.startsWith("python-") && file.endsWith(".mdx"));

  for (const file of files) {
    const source = await readFile(new URL(file, lessonDirectory), "utf8");
    const lessonId = source.match(/^id:\s*(.+)$/m)?.[1];
    assert.ok(lessonId, `${file} should declare an id`);
    const resources = getPythonResources(lessonId!);
    assert.ok(resources.length >= 2, `${file} should have at least two further-reading links`);
    assert.ok(resources.every((resource) => resource.href.startsWith("https://")), `${file} should use secure resource links`);
  }
});

test("C++ lessons teach a complete beginner-to-robotics progression", async () => {
  const files = (await readdir(lessonDirectory)).filter((file) => file.startsWith("cpp-") && file.endsWith(".mdx"));
  assert.equal(files.length, 36);

  for (const file of files) {
    const source = await readFile(new URL(file, lessonDirectory), "utf8");
    const body = lessonBodyText(source).replace(/\s/g, "");
    const examples = countExamples(source);
    const headings = (source.match(/^#{2,3}\s/gm) ?? []).length;

    assert.ok(body.length >= 2400, `${file} should teach at least 2400 non-whitespace body characters`);
    assert.ok(headings >= 8, `${file} should contain at least eight teaching sections`);
    assert.ok(examples >= 3, `${file} should contain at least three code examples`);
    assert.match(source, /学习目标|本节要学会|你将学会/, `${file} should state learning goals`);
    assert.match(source, /JS\s*\/\s*TS|JavaScript|TypeScript|Node\.js/, `${file} should explain the migration from JS/TS`);
    assert.match(source, /编译|运行|输出|结果|验证/, `${file} should show an observable build or run verification`);
    assert.match(source, /常见错误|排错|调试/, `${file} should explain a failure mode and debugging path`);
    assert.match(source, /练习|任务/, `${file} should include hands-on practice`);
    assert.match(source, /机器人|ROS\s*2|传感器|实时|消息|系统/, `${file} should connect to a robotics or systems scenario`);
  }
});

test("the five thinnest C++ lessons meet the expanded teaching-depth bar", async () => {
  const files = [
    "cpp-types.mdx",
    "cpp-networking.mdx",
    "cpp-toolchain.mdx",
    "cpp-exceptions.mdx",
    "cpp-stl.mdx",
  ];

  for (const file of files) {
    const source = await readFile(new URL(file, lessonDirectory), "utf8");
    const body = lessonBodyText(source);
    const bodyLength = body.replace(/\s/g, "").length;
    const examples = countExamples(source);

    assert.ok(bodyLength >= 3600, `${file} should explain the concept beyond the current minimum threshold`);
    assert.ok((source.match(/^#{2,3}\s/gm) ?? []).length >= 12, `${file} should scaffold concepts in steps`);
    assert.ok(examples >= 4, `${file} should include multiple progressive examples`);
    assert.match(source, /^##\s+学习目标/m, `${file} should declare observable outcomes`);
    assert.match(source, /^#{2,3}\s+.*(编译|运行|验证)/m, `${file} should show build/run verification`);
    assert.match(source, /^#{2,3}\s+.*(错误|排错|调试)/m, `${file} should explain a failure and diagnosis`);
    assert.match(source, /<Exercise[\s\S]*?<SolutionReveal/, `${file} should include a task and answer`);
    assert.match(source, /^#{2,3}\s+.*(小结|总结)/m, `${file} should synthesize the concepts`);
  }
});

test("C++ lessons expose curated further reading", async () => {
  const files = (await readdir(lessonDirectory)).filter((file) => file.startsWith("cpp-") && file.endsWith(".mdx"));

  for (const file of files) {
    const source = await readFile(new URL(file, lessonDirectory), "utf8");
    const lessonId = source.match(/^id:\s*(.+)$/m)?.[1];
    assert.ok(lessonId, `${file} should declare an id`);
    const resources = getCppResources(lessonId!);
    assert.ok(resources.length >= 2, `${file} should have at least two further-reading links`);
    assert.ok(resources.every((resource) => resource.href.startsWith("https://")), `${file} should use secure resource links`);
  }
});
