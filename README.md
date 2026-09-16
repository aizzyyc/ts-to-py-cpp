# LangShift

从 JavaScript / TypeScript 迁移到 Python 与 C++，面向 AI 和机器人开发的学习工作台。

LangShift 不是把语法表换一种语言展示，而是从 JS/TS 开发者已经熟悉的思维出发，解释新的语言在数据模型、类型系统、内存、并发、工具链和工程实践上的差异。每节课都配有可对照的代码示例、迁移提醒、练习、提示和参考答案。

项目地址：[github.com/aizzyyc/ts-to-py-cpp](https://github.com/aizzyyc/ts-to-py-cpp)

## 适合谁

- 有 JavaScript 或 TypeScript 项目经验，希望系统学习 Python 的开发者
- 希望进入机器学习、数据处理、模型推理或 AI 工程方向的前端 / 全栈开发者
- 希望从 JS/TS 迁移到 C++，进一步学习机器人、实时系统和 ROS 2 的开发者
- 想先理解语言和工程边界，再逐步进入真实项目的学习者

## 学习路线

| 路线 | 内容 | 重点方向 |
| --- | ---: | --- |
| 共用迁移基础 | 26 节 | 运行时、值与类型、函数、错误、文件、并发、测试和工程边界 |
| Python / AI | 30 节 | Python 语言、数据处理、NumPy、Pandas、机器学习、PyTorch、推理和 MLOps |
| C++ / Robotics | 36 节 | C++ 语言、STL、内存、RAII、并发、CMake、性能、ROS 2 和传感器处理 |

课程总量目前为 92 节。选择 AI 或机器人目标后，学习页只展示对应语言路线；每条路线都包含与该语言相关的迁移基础，不把 Python 和 C++ 内容混在一起。

## 主要功能

- 响应式布局，支持桌面、平板和手机
- 课程路线、概念标签、预计时长和完成状态
- 继续学习入口、阶段里程碑、阶段检查点和结课项目提示
- JS/TS 与 Python / C++ 的并排代码对照
- 迁移重点、关键提醒、动手练习、提示和参考答案
- Pagefind 静态搜索，可搜索课程标题、概念、术语和代码关键词
- 使用 `localStorage` 保存本设备的学习进度
- 课程内容使用 MDX 编写，并通过 Astro Content Collections 做元数据校验
- 代码示例支持复制和切换语言，但不会执行用户代码
- 语义化结构、键盘焦点、跳过导航和代码横向滚动

## 本地运行

需要 Node.js 运行环境。

```bash
npm install
npm run dev
```

启动后访问 `http://localhost:4321`。

构建并预览生产版本：

```bash
npm run build
npm run preview
```

生产构建会先生成 Astro 静态页面，再使用 Pagefind 建立搜索索引。

## 常用脚本

| 命令 | 作用 |
| --- | --- |
| `npm run dev` | 启动开发服务器 |
| `npm run check` | 执行 Astro、TypeScript 和内容集合检查 |
| `npm test` | 运行进度、课程、路由、布局和搜索测试 |
| `npm run build` | 构建静态网站并生成 Pagefind 索引 |
| `npm run preview` | 预览生产构建结果 |

提交代码前建议运行：

```bash
npm test
npm run check
npm run build
```

## 内容开发

课程文件位于 `src/content/lessons/`，按语言前缀组织：

- `common-*.mdx`：跨路线的迁移与工程基础
- `python-*.mdx`：Python / AI 路线
- `cpp-*.mdx`：C++ / Robotics 路线

一节完整课程通常包含以下内容：

1. 学习目标和 JS/TS 开发者已有的知识起点
2. 语言概念的清晰解释，以及与 JS/TS 的差异
3. 从简单到真实场景的多个代码示例
4. 常见错误、调试方法和可运行验证方式
5. 一个小练习、提示和参考答案
6. 与 AI、机器人或工程实践相关的迁移结论
7. 下一节课程和延伸阅读

课程正文使用少量专用 MDX 组件：`CompareCode`、`KeyIdea`、`Exercise`、`SolutionReveal`、`LessonNav`、`ProgressIndicator` 和 `LessonResources`。

## 项目结构

```text
src/
├── components/          # 课程对照、练习、导航和进度组件
├── content/lessons/     # MDX 课程内容
├── layouts/             # 页面布局
├── lib/                 # 课程、路线、搜索和进度逻辑
├── pages/               # 首页、学习页和搜索页
├── scripts/             # 浏览器端搜索与进度交互
└── styles/              # 全局响应式样式
tests/                   # 自动化测试
docs/                    # 课程设计与实现计划
```

## 当前边界

这是一个静态网站 MVP，目前不包含：

- 账号系统和跨设备进度同步
- 在线 Python 执行或 C++ 编译沙箱
- AI 导师
- 真实 ROS 2 设备控制

后续计划按以下顺序扩展：在线 Python 执行、账号同步、C++ 编译沙箱、AI 导师和 ROS 2 项目实践。

## 技术栈

- [Astro](https://astro.build/)
- TypeScript
- MDX / Astro Content Collections
- [Pagefind](https://pagefind.app/)

## License

License 待补充。
