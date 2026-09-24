import type { LessonMeta, Track } from "./lessons";

export type LessonLevel = "foundation" | "advanced";
export type LearningMode = "concept" | "case";

export interface LessonClassification {
  level: LessonLevel;
  learningMode: LearningMode;
}

export interface LessonClassificationStats {
  total: number;
  totalMinutes: number;
  foundationCount: number;
  advancedCount: number;
  caseCount: number;
  caseMinutes: number;
}

const CASE_LESSON_IDS = new Set(["common-capstone", "python-project", "cpp-sensor-pipeline"]);

function isFoundation(lesson: LessonMeta): boolean {
  if (lesson.track === "common") return lesson.order <= 15;
  if (lesson.track === "python") return lesson.order <= 8;
  if (lesson.track === "cpp") return lesson.order <= 16;
  return false;
}

export function getLessonClassification(lesson: LessonMeta): LessonClassification {
  return {
    level: isFoundation(lesson) ? "foundation" : "advanced",
    learningMode: CASE_LESSON_IDS.has(lesson.id) ? "case" : "concept",
  };
}

export function getLessonClassificationStats(
  lessons: readonly LessonMeta[],
  track?: Track,
): LessonClassificationStats {
  const stats: LessonClassificationStats = {
    total: 0,
    totalMinutes: 0,
    foundationCount: 0,
    advancedCount: 0,
    caseCount: 0,
    caseMinutes: 0,
  };

  for (const lesson of lessons) {
    if (track && lesson.track !== track) continue;
    const classification = getLessonClassification(lesson);
    stats.total += 1;
    stats.totalMinutes += lesson.durationMinutes;
    if (classification.level === "foundation") stats.foundationCount += 1;
    else stats.advancedCount += 1;
    if (classification.learningMode === "case") {
      stats.caseCount += 1;
      stats.caseMinutes += lesson.durationMinutes;
    }
  }

  return stats;
}

export function formatLearningMinutes(minutes: number): string {
  if (minutes < 60) return `约 ${minutes} 分钟`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes ? `约 ${hours} 小时 ${remainingMinutes} 分钟` : `约 ${hours} 小时`;
}
