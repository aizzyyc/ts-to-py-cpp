# LangShift

从 JavaScript / TypeScript 迁移到 Python 与 C++ 的开发者学习工作台。

## 本地开发

```bash
npm install
npm run dev
```

生产构建会先生成 Astro 静态站，再由 Pagefind 为课程页面建立搜索索引；课程搜索页面同时内置轻量索引，所以开发服务器也可以直接搜索：

```bash
npm run build
npm run preview
```

## 内容结构

课程在 `src/content/lessons/` 中以 MDX 维护。每节课都应该包含：

1. JS/TS 出发点
2. Python 或 C++ 对照
3. 一个迁移提示
4. 一个小练习和参考答案
5. 一段可以带走的结论

第一版不执行用户代码、不保存账号数据，也不连接真实 AI 或机器人设备。

当前课程规模为 92 节：26 节共用迁移基础、30 节 Python / AI、36 节 C++ / Robotics。每节课都包含 JS/TS 对照、关键解释、小练习、提示和参考答案，课程数量按知识密度安排，不机械凑成相同节数。
