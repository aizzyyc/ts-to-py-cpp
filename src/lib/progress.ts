export type Goal = "ai" | "robotics";

export interface ProgressState {
  version: 1;
  selectedGoal: Goal | null;
  completedLessonIds: string[];
  lastLessonId: string | null;
  updatedAt: string | null;
}

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export const PROGRESS_STORAGE_KEY = "langshift-progress:v1";

export const DEFAULT_PROGRESS: ProgressState = {
  version: 1,
  selectedGoal: null,
  completedLessonIds: [],
  lastLessonId: null,
  updatedAt: null,
};

function cloneDefault(): ProgressState {
  return {
    ...DEFAULT_PROGRESS,
    completedLessonIds: [],
  };
}

function isGoal(value: unknown): value is Goal {
  return value === "ai" || value === "robotics";
}

function normalizeProgress(value: unknown): ProgressState {
  if (!value || typeof value !== "object") {
    return cloneDefault();
  }

  const candidate = value as Partial<ProgressState>;
  if (candidate.version !== 1) {
    return cloneDefault();
  }

  const completedLessonIds = Array.isArray(candidate.completedLessonIds)
    ? [...new Set(candidate.completedLessonIds.filter((id): id is string => typeof id === "string"))]
    : [];

  return {
    version: 1,
    selectedGoal: isGoal(candidate.selectedGoal) ? candidate.selectedGoal : null,
    completedLessonIds,
    lastLessonId: typeof candidate.lastLessonId === "string" ? candidate.lastLessonId : null,
    updatedAt: typeof candidate.updatedAt === "string" ? candidate.updatedAt : null,
  };
}

export function parseProgress(raw: string | null): ProgressState {
  if (!raw) {
    return cloneDefault();
  }

  try {
    return normalizeProgress(JSON.parse(raw));
  } catch {
    return cloneDefault();
  }
}

export function serializeProgress(state: ProgressState): string {
  return JSON.stringify(normalizeProgress(state));
}

export function markLessonComplete(
  state: ProgressState,
  lessonId: string,
  updatedAt = new Date().toISOString(),
): ProgressState {
  if (!lessonId.trim()) {
    return state;
  }

  const normalized = normalizeProgress(state);
  return {
    ...normalized,
    completedLessonIds: [...new Set([...normalized.completedLessonIds, lessonId])],
    lastLessonId: lessonId,
    updatedAt,
  };
}

export function setSelectedGoal(state: ProgressState, selectedGoal: Goal): ProgressState {
  return {
    ...normalizeProgress(state),
    selectedGoal,
    updatedAt: new Date().toISOString(),
  };
}

export function createProgressStore(storage: StorageLike | null | undefined) {
  let memoryState = cloneDefault();
  let persisted = Boolean(storage);

  if (storage) {
    try {
      memoryState = parseProgress(storage.getItem(PROGRESS_STORAGE_KEY));
    } catch {
      persisted = false;
    }
  }

  return {
    get persisted() {
      return persisted;
    },
    read(): ProgressState {
      return memoryState;
    },
    write(nextState: ProgressState): void {
      memoryState = normalizeProgress(nextState);
      if (!storage) {
        persisted = false;
        return;
      }

      try {
        storage.setItem(PROGRESS_STORAGE_KEY, serializeProgress(memoryState));
        persisted = true;
      } catch {
        persisted = false;
      }
    },
    reset(): void {
      memoryState = cloneDefault();
      if (!storage) {
        persisted = false;
        return;
      }

      try {
        storage.setItem(PROGRESS_STORAGE_KEY, serializeProgress(memoryState));
        persisted = true;
      } catch {
        persisted = false;
      }
    },
  };
}
