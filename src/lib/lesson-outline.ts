export interface LessonOutlineTarget {
  id: string;
  label: string;
  level: 2 | 3;
}

export interface LessonOutlineEntry extends Omit<LessonOutlineTarget, "level"> {
  children: LessonOutlineEntry[];
}

export function buildLessonOutline(targets: LessonOutlineTarget[]): LessonOutlineEntry[] {
  const entries: LessonOutlineEntry[] = [];
  let currentSection: LessonOutlineEntry | undefined;

  targets.forEach((target) => {
    const { level, ...details } = target;
    const entry: LessonOutlineEntry = { ...details, children: [] };
    if (level === 3 && currentSection) {
      currentSection.children.push(entry);
      return;
    }

    entries.push(entry);
    currentSection = level === 2 ? entry : undefined;
  });

  return entries;
}
