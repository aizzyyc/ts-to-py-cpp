# LangShift

从 JavaScript / TypeScript 迁移到 Python 与 C++，面向 AI 和机器人开发的学习工作台。

[![Deploy to GitHub Pages](https://github.com/aizzyyc/ts-to-py-cpp/actions/workflows/deploy.yml/badge.svg)](https://github.com/aizzyyc/ts-to-py-cpp/actions/workflows/deploy.yml)
[![在线学习](https://img.shields.io/badge/在线学习-GitHub%20Pages-1f6feb)](https://aizzyyc.github.io/ts-to-py-cpp/)

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

## 如何学习

LangShift 的主线是系统掌握 Python 和 C++ 的基础与进阶知识，不是让开发者长期停留在网站里做项目。推荐按“基础 → 进阶 → 小案例验证 → 复习排错”的顺序学习：

1. 先完成对应语言的基础课程，建立语法、类型、运行时、错误处理和工具链模型。
2. 再学习进阶主题，重点理解内存、并发、工程边界、测试和性能等实际差异。
3. 用小案例验证知识迁移，而不是用案例替代概念学习；每个案例都应有输入、预期结果和验收标准。
4. 可以复制课程中的 AI 学习提示，用于概念迁移、变式练习、排错辅助和复习检查。

AI 只负责帮助解释、提问和缩小排错范围。任何生成的代码、结论或修复建议，都必须在本地运行并通过测试、编译器或实际输出验证；不能把未验证的 AI 结果当成事实。官方文档和真实工程环境仍是最终依据。

## 主要功能

- 响应式布局，支持桌面、平板和手机
- 课程路线、概念标签、预计时长和完成状态
- 继续学习入口、阶段里程碑、阶段检查点和结课项目提示
- 基础 / 进阶 / 案例标签、路线学习时间和每节课掌握标准
- JS/TS 与 Python / C++ 的并排代码对照
- 迁移重点、关键提醒、动手练习、提示和参考答案
- 可复制的 AI 学习卡，辅助概念迁移、变式练习、排错和复习
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

启动后访问 `http://localhost:4321/ts-to-py-cpp/`。

构建并预览生产版本：

```bash
npm run build
npm run preview
```

生产构建会先生成 Astro 静态页面，再使用 Pagefind 建立搜索索引。

## GitHub 发布与贡献

在线学习入口：[aizzyyc.github.io/ts-to-py-cpp](https://aizzyyc.github.io/ts-to-py-cpp/)。

推送到 `main` 后，GitHub Actions 会依次执行测试、Astro 检查和生产构建；全部通过后自动发布 GitHub Pages。也可以在仓库的 **Actions** 页面手动运行部署工作流。

欢迎通过 Issue 反馈课程问题或提出改进建议。提交代码时，请先创建分支或 Fork 仓库，在本地运行以下检查，再发起 Pull Request：

```bash
npm test
npm run check
npm run build
```

本项目当前是静态学习工作台，课程进度只保存在浏览器本地；不会在线执行用户代码，也不包含账号同步、AI 导师或真实 ROS 2 设备控制。

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

课程正文使用少量专用 MDX 组件：`CompareCode`、`KeyIdea`、`Exercise`、`SolutionReveal`、`LessonNav`、`ProgressIndicator` 和 `LessonResources`。课程详情页还提供 `LessonMastery` 掌握标准与 `AiStudyCard` 学习提示；它们不会在线执行代码，也不会替代本地验证。

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
