import {
  createProgressStore,
  markLessonComplete,
  markLessonViewed,
  setSelectedGoal,
  type Goal,
  type ProgressState,
  type StorageLike,
} from "../lib/progress";
import { getVisibleTracks, isTrackVisible } from "../lib/routes";
import { getNextLesson, getPhaseForLesson, getPhaseLessons } from "../lib/course-flow";
import { getActivePhaseId } from "../lib/phase-navigation";
import { LESSONS, type Track } from "../lib/lessons";
import { sitePath } from "../lib/site-path";

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

function getResumeLesson(state: ProgressState, goal: Goal | null) {
  const viewed = state.lastViewedLessonId
    ? LESSONS.find((lesson) => lesson.id === state.lastViewedLessonId)
    : undefined;
  if (viewed && !state.completedLessonIds.includes(viewed.id) && isTrackVisible(viewed.track, goal)) {
    return viewed;
  }
  return getNextLesson(LESSONS, goal, state);
}

function renderResume(state: ProgressState, goal: Goal | null): void {
  const card = document.querySelector<HTMLElement>("[data-resume-card]");
  if (!card) return;

  const lesson = getResumeLesson(state, goal);
  const title = card.querySelector<HTMLElement>("[data-resume-title]");
  const phase = card.querySelector<HTMLElement>("[data-resume-phase]");
  const copy = card.querySelector<HTMLElement>("[data-resume-copy]");
  const status = card.querySelector<HTMLElement>("[data-resume-status]");
  const link = card.querySelector<HTMLAnchorElement>("[data-resume-link]");
  const visibleCompletedCount = state.completedLessonIds.filter((id) => {
    const completedLesson = LESSONS.find((candidate) => candidate.id === id);
    return completedLesson ? isTrackVisible(completedLesson.track, goal) : false;
  }).length;
  if (!lesson) {
    card.hidden = false;
    if (title) title.textContent = "路线已完成";
    if (phase) phase.textContent = goal === "ai" ? "Python / AI" : goal === "robotics" ? "C++ / Robotics" : "迁移基础";
    if (copy) copy.textContent = "你已经完成当前路线，可以回顾课程或重新挑战结课项目。";
    if (status) status.textContent = "全部完成";
    if (link) {
      link.href = sitePath("/learn");
      link.innerHTML = '回顾课程路线 <span aria-hidden="true">↗</span>';
    }
    return;
  }

  const lessonPhase = getPhaseForLesson(lesson);
  card.hidden = false;
  if (title) title.textContent = lesson.title;
  if (phase) phase.textContent = lessonPhase?.title ?? "下一节课程";
  if (copy) copy.textContent = `${lesson.summary} 预计 ${lesson.durationMinutes} 分钟。`;
  if (status) {
    if (!state.lastViewedLessonId && visibleCompletedCount === 0) {
      status.textContent = "推荐开始";
    } else if (state.lastViewedLessonId === lesson.id && visibleCompletedCount === 0) {
      status.textContent = "已浏览 · 继续学习";
    } else {
      status.textContent = state.lastViewedLessonId === lesson.id ? "接着上次学习" : "下一节推荐";
    }
  }
  if (link) {
    link.href = sitePath(`/learn/${lesson.track}/${lesson.slug}`);
    link.innerHTML = '继续学习 <span aria-hidden="true">↗</span>';
  }
}

function renderLessonPhase(state: ProgressState): void {
  const card = document.querySelector<HTMLElement>("[data-lesson-phase]");
  if (!card) return;
  const currentLessonId = document.querySelector<HTMLElement>("[data-complete-lesson]")?.dataset.completeLesson;
  const currentLesson = currentLessonId ? LESSONS.find((lesson) => lesson.id === currentLessonId) : undefined;
  const phase = currentLesson ? getPhaseForLesson(currentLesson) : undefined;
  const phaseLessons = phase ? getPhaseLessons(LESSONS, phase) : [];
  const completed = phaseLessons.filter((lesson) => state.completedLessonIds.includes(lesson.id)).length;
  const progress = card.querySelector<HTMLElement>("[data-lesson-phase-progress]");
  const bar = card.querySelector<HTMLElement>("[data-lesson-phase-bar]");
  if (progress) progress.textContent = `${completed}/${phaseLessons.length}`;
  if (bar) bar.style.width = `${phaseLessons.length ? Math.min(100, (completed / phaseLessons.length) * 100) : 0}%`;
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
  document.querySelectorAll<HTMLElement>("[data-phase-id]:not([data-lesson-phase])").forEach((phaseElement) => {
    const phaseTrack = phaseElement.dataset.phaseTrack as Track | undefined;
    const phaseLessonIds = new Set(
      [...phaseElement.querySelectorAll<HTMLElement>("[data-lesson-id]")]
        .map((element) => element.dataset.lessonId)
        .filter((id): id is string => Boolean(id)),
    );
    const visiblePhaseIds = phaseTrack && !isTrackVisible(phaseTrack, goal) ? new Set<string>() : phaseLessonIds;
    const phaseCompleted = state.completedLessonIds.filter((id) => visiblePhaseIds.has(id)).length;
    const phaseTotal = phaseLessonIds.size;
    const progress = phaseElement.querySelector<HTMLElement>("[data-phase-progress]");
    const bar = phaseElement.querySelector<HTMLElement>("[data-phase-bar]");
    if (progress) progress.textContent = `${phaseCompleted}/${phaseTotal}`;
    if (bar) bar.style.width = `${phaseTotal ? Math.min(100, (phaseCompleted / phaseTotal) * 100) : 0}%`;
  });
  renderLessonPhase(state);
  renderResume(state, goal);
}

function setActivePhase(phaseId: string): void {
  document.querySelectorAll<HTMLAnchorElement>("[data-phase-nav]").forEach((link) => {
    const active = link.dataset.phaseNav === phaseId;
    link.classList.toggle("is-current", active);
    if (active) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });
}

function updatePhaseNavigation(): void {
  const phases = [...document.querySelectorAll<HTMLElement>("[data-overview-phase]")].filter(
    (phase) => !phase.closest("[hidden]") && phase.getClientRects().length > 0,
  );
  if (phases.length === 0) return;

  const activationLine = Math.min(240, Math.max(120, window.innerHeight * 0.28));
  const activePhaseId = getActivePhaseId(
    phases.map((phase) => ({ id: phase.id, top: phase.getBoundingClientRect().top })),
    activationLine,
  );
  if (activePhaseId) setActivePhase(activePhaseId);
}

function initPhaseNavigation(): void {
  const links = [...document.querySelectorAll<HTMLAnchorElement>("[data-phase-nav]")];
  if (links.length === 0) return;

  let scheduledFrame = 0;
  const scheduleUpdate = () => {
    if (scheduledFrame) return;
    scheduledFrame = window.requestAnimationFrame(() => {
      scheduledFrame = 0;
      updatePhaseNavigation();
    });
  };

  window.addEventListener("scroll", scheduleUpdate, { passive: true });
  window.addEventListener("resize", scheduleUpdate);
  window.addEventListener("hashchange", scheduleUpdate);
  links.forEach((link) => {
    link.addEventListener("click", () => {
      const phaseId = link.dataset.phaseNav;
      if (phaseId) setActivePhase(phaseId);

      const sidebar = link.closest<HTMLElement>(".route-sidebar");
      const toggle = sidebar?.querySelector<HTMLButtonElement>("[data-route-toggle]");
      if (sidebar?.classList.contains("is-open")) {
        sidebar.classList.remove("is-open");
        toggle?.setAttribute("aria-expanded", "false");
        if (toggle?.firstChild) toggle.firstChild.textContent = "打开课程路线 ";
      }
    });
  });

  updatePhaseNavigation();
}

function initCurrentLessonNavigation(): void {
  const currentLesson = document.querySelector<HTMLAnchorElement>(".lesson-link.current");
  if (!currentLesson) return;

  window.requestAnimationFrame(() => currentLesson.scrollIntoView({ block: "nearest" }));
}

function initLessonToc(): void {
  const toc = document.querySelector<HTMLElement>("[data-lesson-toc]");
  const content = document.querySelector<HTMLElement>("[data-lesson-content]");
  if (!toc || !content) return;

  const firstHeading = content.querySelector<HTMLElement>("h2");
  if (firstHeading) {
    firstHeading.id = "lesson-concepts";
    firstHeading.dataset.lessonSection = "concepts";
  }

  const sections = new Map<string, HTMLElement>();
  content.querySelectorAll<HTMLElement>("[data-lesson-section]").forEach((section) => {
    const key = section.dataset.lessonSection;
    if (!key) return;
    if (sections.has(key)) return;
    section.id = `lesson-${key}`;
    sections.set(key, section);
  });
  if (firstHeading) sections.set("concepts", firstHeading);

  const links = [...toc.querySelectorAll<HTMLAnchorElement>("[data-toc-link]")];
  const visibleLinks = links.filter((link) => {
    const key = link.dataset.tocLink;
    const target = key ? sections.get(key) : undefined;
    if (!target) link.closest("li")?.remove();
    return Boolean(target);
  });
  if (visibleLinks.length === 0) return;

  const setActive = (key: string) => {
    visibleLinks.forEach((link) => {
      const active = link.dataset.tocLink === key;
      link.classList.toggle("is-active", active);
      if (active) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  };

  visibleLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const key = link.dataset.tocLink;
      if (key) setActive(key);
    });
  });
  setActive(visibleLinks[0].dataset.tocLink ?? "concepts");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        const key = visible[0]?.target instanceof HTMLElement ? visible[0].target.dataset.lessonSection : undefined;
        if (key) setActive(key);
      },
      { rootMargin: "-120px 0px -65% 0px", threshold: [0, 1] },
    );
    sections.forEach((section) => observer.observe(section));
  }
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
  document.querySelectorAll<HTMLAnchorElement>("[data-goal-switch]").forEach((link) => {
    const active = link.dataset.goalSwitch === goal;
    link.classList.toggle("is-active", active);
    if (active) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
  updatePhaseNavigation();
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
initPhaseNavigation();
initCurrentLessonNavigation();
initLessonToc();
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

document.querySelectorAll<HTMLAnchorElement>("a[data-lesson-id]").forEach((link) => {
  link.addEventListener("click", () => {
    const lessonId = link.dataset.lessonId;
    if (!lessonId) return;
    store.write(markLessonViewed(store.read(), lessonId));
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

document.querySelectorAll<HTMLButtonElement>("[data-copy-text]").forEach((button) => {
  const originalLabel = button.innerHTML;
  button.addEventListener("click", async () => {
    const prompt = button.dataset.copyText ?? "";
    try {
      await navigator.clipboard.writeText(prompt);
      button.innerHTML = "<span>已复制</span><span aria-hidden=\"true\">✓</span>";
      window.setTimeout(() => (button.innerHTML = originalLabel), 1400);
    } catch {
      button.innerHTML = "<span>请手动复制</span><span aria-hidden=\"true\">↗</span>";
      window.setTimeout(() => (button.innerHTML = originalLabel), 1600);
    }
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "/" || ["INPUT", "TEXTAREA"].includes((event.target as HTMLElement)?.tagName)) return;
  event.preventDefault();
    window.location.href = sitePath("/search");
});
