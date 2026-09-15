import {
  createProgressStore,
  markLessonComplete,
  setSelectedGoal,
  type Goal,
  type ProgressState,
  type StorageLike,
} from "../lib/progress";
import { getVisibleTracks, isTrackVisible } from "../lib/routes";
import type { Track } from "../lib/lessons";

const getStorage = (): StorageLike | null => {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
};

const store = createProgressStore(getStorage());
const pageTotalLessons = Number(document.querySelector<HTMLElement>("[data-progress-total]")?.dataset.progressTotal ?? 0);

function isComplete(state: ProgressState, lessonId: string): boolean {
  return state.completedLessonIds.includes(lessonId);
}

function getGoalFromLocation(): Goal | null {
  const queryGoal = new URLSearchParams(window.location.search).get("goal");
  if (queryGoal === "ai" || queryGoal === "robotics") {
    store.write(setSelectedGoal(store.read(), queryGoal));
    return queryGoal;
  }
  const currentTrack = document.querySelector<HTMLElement>("[data-current-track]")?.dataset.currentTrack;
  if (currentTrack === "python" || currentTrack === "cpp") {
    const inferredGoal = currentTrack === "python" ? "ai" : "robotics";
    store.write(setSelectedGoal(store.read(), inferredGoal));
    return inferredGoal;
  }
  return store.read().selectedGoal;
}

function getVisibleLessonIds(goal: Goal | null): Set<string> {
  const lessonIds = new Set<string>();
  document.querySelectorAll<HTMLElement>("[data-lesson-id]").forEach((element) => {
    const lessonId = element.dataset.lessonId;
    const track = element.closest<HTMLElement>("[data-track]")?.dataset.track as Track | undefined;
    if (lessonId && (!track || isTrackVisible(track, goal))) lessonIds.add(lessonId);
  });
  return lessonIds;
}

function render(state: ProgressState, goal: Goal | null): void {
  const visibleLessonIds = getVisibleLessonIds(goal);
  const totalLessons = visibleLessonIds.size || pageTotalLessons;
  const completed = state.completedLessonIds.filter((id) => visibleLessonIds.size === 0 || visibleLessonIds.has(id)).length;
  document.querySelectorAll<HTMLElement>("[data-progress-count]").forEach((element) => {
    element.textContent = `${completed}/${totalLessons}`;
  });
  document.querySelectorAll<HTMLElement>("[data-progress-bar]").forEach((element) => {
    element.style.width = `${Math.min(100, (completed / totalLessons) * 100)}%`;
  });
  document.querySelectorAll<HTMLElement>("[data-lesson-id]").forEach((element) => {
    const lessonId = element.dataset.lessonId;
    if (!lessonId) return;
    const completedState = isComplete(state, lessonId);
    element.classList.toggle("completed", completedState);
    const status = element.querySelector<HTMLElement>(".lesson-status");
    if (status && !element.classList.contains("current")) status.textContent = completedState ? "✓" : "○";
  });
  document.querySelectorAll<HTMLButtonElement>("[data-complete-lesson]").forEach((button) => {
    const lessonId = button.dataset.completeLesson;
    if (!lessonId) return;
    const completedState = isComplete(state, lessonId);
    button.classList.toggle("is-complete", completedState);
    const label = button.querySelector<HTMLElement>("[data-complete-label]");
    if (label) label.textContent = completedState ? "已完成 · 再次点击取消" : "标记为已完成";
  });
}

function applyRouteFilter(goal: Goal | null): void {
  const visibleTracks = getVisibleTracks(goal);
  document.querySelectorAll<HTMLElement>(".route-group[data-track], .track-section[data-track]").forEach((element) => {
    const track = element.dataset.track as Track | undefined;
    element.hidden = Boolean(track && !visibleTracks.includes(track));
  });

  document.querySelectorAll<HTMLElement>("[data-route-mode]").forEach((element) => {
    element.hidden = !goal;
  });
  document.querySelectorAll<HTMLElement>("[data-route-mode-label]").forEach((element) => {
    element.textContent = goal === "ai" ? "AI 工程路径" : goal === "robotics" ? "机器人路径" : "";
  });
  document.querySelectorAll<HTMLElement>("[data-route-mode-copy]").forEach((element) => {
    element.textContent = goal === "ai" ? "Python 迁移基础 + AI 专项" : goal === "robotics" ? "C++ 迁移基础 + Robotics 专项" : "";
  });
}

function showPersistenceNotice(): void {
  if (store.persisted) return;
  const notice = document.createElement("div");
  notice.className = "storage-notice";
  notice.textContent = "当前浏览器未允许本地保存，进度只在本次打开期间保留。";
  document.body.append(notice);
  window.setTimeout(() => notice.remove(), 5000);
}

const initialGoal = getGoalFromLocation();
applyRouteFilter(initialGoal);
render(store.read(), initialGoal);
showPersistenceNotice();

document.querySelectorAll<HTMLElement>("[data-goal]").forEach((element) => {
  element.addEventListener("click", () => {
    const goal = element.dataset.goal as Goal | undefined;
    if (!goal) return;
    store.write(setSelectedGoal(store.read(), goal));
    applyRouteFilter(goal);
    render(store.read(), goal);
  });
});

document.querySelectorAll<HTMLElement>("[data-clear-goal]").forEach((element) => {
  element.addEventListener("click", () => {
    store.write({ ...store.read(), selectedGoal: null, updatedAt: new Date().toISOString() });
  });
});

document.querySelectorAll<HTMLButtonElement>("[data-complete-lesson]").forEach((button) => {
  button.addEventListener("click", () => {
    const lessonId = button.dataset.completeLesson;
    if (!lessonId) return;
    const state = store.read();
    const nextState = isComplete(state, lessonId)
      ? {
          ...state,
          completedLessonIds: state.completedLessonIds.filter((id) => id !== lessonId),
          lastLessonId: state.lastLessonId === lessonId ? null : state.lastLessonId,
          updatedAt: new Date().toISOString(),
        }
      : markLessonComplete(state, lessonId);
    store.write(nextState);
    render(store.read(), getGoalFromLocation());
  });
});

document.querySelectorAll<HTMLElement>("[data-reset-progress]").forEach((element) => {
  element.addEventListener("click", () => {
    if (!window.confirm("确定要清除这台设备上的 LangShift 学习进度吗？")) return;
    store.reset();
    render(store.read(), getGoalFromLocation());
  });
});

document.querySelectorAll<HTMLButtonElement>("[data-route-toggle]").forEach((button) => {
  button.addEventListener("click", () => {
    const sidebar = button.closest<HTMLElement>(".route-sidebar");
    if (!sidebar) return;
    const expanded = sidebar.classList.toggle("is-open");
    button.setAttribute("aria-expanded", String(expanded));
    button.firstChild!.textContent = expanded ? "收起课程路线 " : "打开课程路线 ";
  });
});

document.querySelectorAll<HTMLButtonElement>("[data-copy-code]").forEach((button) => {
  button.addEventListener("click", async () => {
    const code = button.dataset.code ?? "";
    try {
      await navigator.clipboard.writeText(code);
      button.textContent = "已复制";
      window.setTimeout(() => (button.textContent = "复制"), 1400);
    } catch {
      button.textContent = "请手动复制";
      window.setTimeout(() => (button.textContent = "复制"), 1600);
    }
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "/" || ["INPUT", "TEXTAREA"].includes((event.target as HTMLElement)?.tagName)) return;
  event.preventDefault();
  window.location.href = "/search";
});
