export const STUDY_STEPS = [
  {
    number: "01",
    label: "SET A GOAL",
    minutes: 2,
    title: "先定本节目标",
    action: "先看目标和完成标准，把“学会列表”改成具体问题，例如：如何安全地取出可能不存在的元素？",
    output: "一句本节要解决的问题",
  },
  {
    number: "02",
    label: "COMPARE",
    minutes: 8,
    title: "对照熟悉写法",
    action: "先看 JS/TS，再对照 Python 或 C++。标出语法、运行结果和边界行为的差异，别只背关键字。",
    output: "一条可以复用的迁移规则",
  },
  {
    number: "03",
    label: "RUN IT",
    minutes: 10,
    title: "手敲代码并运行",
    action: "手动输入例子，不整段复制；先运行原例，再改变输入，预测结果后实际验证。",
    output: "一段自己运行验证过的代码",
  },
  {
    number: "04",
    label: "PRACTICE",
    minutes: 10,
    title: "独立练习与排错",
    action: "合上讲解先完成小练习，卡住再逐步看提示。每次修改后重新运行，确认不是碰巧通过。",
    output: "通过且能解释原因的练习",
  },
  {
    number: "05",
    label: "RECALL",
    minutes: 5,
    title: "总结并主动回忆",
    action: "用自己的话写下“旧写法 → 新规则 → 易错点”。隔天不看笔记先回忆，再做一个小变式。",
    output: "一条自己的迁移笔记",
  },
] as const;

export const DEBUGGING_STEPS = [
  "先读最靠近自己代码的报错行，找出具体失败的操作。",
  "把输入和代码缩到能稳定复现问题的最小版本。",
  "围绕本课检查类型、边界、所有权或运行时差异。",
  "修复后重新运行例子和练习，并记下触发问题的条件。",
] as const;

export const REVIEW_GUIDANCE =
  "每完成 3–5 节，用一个小功能把知识连起来。隔天先主动回忆，再回到课程查漏；目标是能从空白重写关键步骤，而不是记住答案在哪。";
