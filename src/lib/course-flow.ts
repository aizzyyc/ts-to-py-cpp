import { LESSONS, type LessonMeta, type Track } from "./lessons.ts";
import type { Goal, ProgressState } from "./progress.ts";

export interface CoursePhase {
  id: string;
  track: Track;
  title: string;
  description: string;
  startOrder: number;
  endOrder: number;
  checkpointLessonId?: string;
  project?: boolean;
}

export const COURSE_PHASES: CoursePhase[] = [
  {
    id: "common-orientation",
    track: "common",
    title: "运行与表达",
    description: "先把 JS/TS 的运行时、语法和项目入口迁移成跨语言基础。",
    startOrder: 1,
    endOrder: 7,
    checkpointLessonId: "common-cli",
  },
  {
    id: "common-boundaries",
    track: "common",
    title: "工程边界",
    description: "用数据契约、文件、HTTP 和进程边界组织可维护的代码。",
    startOrder: 8,
    endOrder: 15,
    checkpointLessonId: "common-processes",
  },
  {
    id: "common-reliability",
    track: "common",
    title: "并发与可靠性",
    description: "理解任务、线程、内存、测试、调试和安全边界。",
    startOrder: 16,
    endOrder: 23,
    checkpointLessonId: "common-security",
  },
  {
    id: "common-capstone",
    track: "common",
    title: "跨语言综合项目",
    description: "把 JS/TS、Python 和 C++ 连接到同一个可演进的数据契约。",
    startOrder: 24,
    endOrder: 26,
    checkpointLessonId: "common-capstone",
    project: true,
  },
  {
    id: "python-foundation",
    track: "python",
    title: "Python 基础",
    description: "从语法、容器和函数开始，建立 Python 的数据模型直觉。",
    startOrder: 1,
    endOrder: 8,
    checkpointLessonId: "python-testing",
  },
  {
    id: "python-engineering",
    track: "python",
    title: "工程与数据输入",
    description: "把脚本、服务、配置和输入校验组织成可靠的数据入口。",
    startOrder: 9,
    endOrder: 16,
    checkpointLessonId: "python-data",
  },
  {
    id: "python-data-models",
    track: "python",
    title: "数据与模型",
    description: "从表格清洗到向量化、基线模型和训练评估，形成 AI 数据主线。",
    startOrder: 17,
    endOrder: 24,
    checkpointLessonId: "python-visualization",
  },
  {
    id: "python-capstone",
    track: "python",
    title: "服务化与结课项目",
    description: "把模型推理、部署、监控和数据准备组合成可运行的 AI 工程。",
    startOrder: 25,
    endOrder: 30,
    checkpointLessonId: "python-project",
    project: true,
  },
  {
    id: "cpp-foundation",
    track: "cpp",
    title: "C++ 基础",
    description: "从编译、类型、值语义和 STL 进入现代 C++。",
    startOrder: 1,
    endOrder: 16,
    checkpointLessonId: "cpp-testing",
  },
  {
    id: "cpp-systems",
    track: "cpp",
    title: "系统工程",
    description: "用内存、并发、实时性和进程边界理解机器人程序的约束。",
    startOrder: 17,
    endOrder: 23,
    checkpointLessonId: "cpp-networking",
  },
  {
    id: "cpp-ros2",
    track: "cpp",
    title: "ROS 2 工程",
    description: "从工作区和节点通信走到接口、QoS、组件和仿真。",
    startOrder: 24,
    endOrder: 32,
    checkpointLessonId: "cpp-ros-custom",
  },
  {
    id: "cpp-capstone",
    track: "cpp",
    title: "诊断与结课项目",
    description: "把插件、仿真、Tracing 和传感器消息处理组合成可测试系统。",
    startOrder: 33,
    endOrder: 36,
    checkpointLessonId: "cpp-sensor-pipeline",
    project: true,
  },
];

export function getCoursePhases(track: Track): CoursePhase[] {
  return COURSE_PHASES.filter((phase) => phase.track === track);
}

export function getPhaseLessons(lessons: LessonMeta[], phase: CoursePhase): LessonMeta[] {
  return lessons
    .filter((lesson) => lesson.track === phase.track && lesson.order >= phase.startOrder && lesson.order <= phase.endOrder)
    .sort((a, b) => a.order - b.order);
}

function getGoalTrack(goal: Goal | null, progress: ProgressState, lessons: LessonMeta[]): Track {
  if (goal === "ai") return "python";
  if (goal === "robotics") return "cpp";

  const recentId = progress.lastViewedLessonId ?? progress.lastLessonId;
  const recentLesson = recentId ? lessons.find((lesson) => lesson.id === recentId) : undefined;
  return recentLesson?.track ?? "common";
}

export function getNextLesson(
  lessons: LessonMeta[] = LESSONS,
  goal: Goal | null,
  progress: ProgressState,
): LessonMeta | null {
  const track = getGoalTrack(goal, progress, lessons);
  const completed = new Set(progress.completedLessonIds);
  return lessons
    .filter((lesson) => lesson.track === track)
    .sort((a, b) => a.order - b.order)
    .find((lesson) => !completed.has(lesson.id)) ?? null;
}

export function getPhaseForLesson(lesson: LessonMeta): CoursePhase | undefined {
  return getCoursePhases(lesson.track).find(
    (phase) => lesson.order >= phase.startOrder && lesson.order <= phase.endOrder,
  );
}
