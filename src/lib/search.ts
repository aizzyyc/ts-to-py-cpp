import type { Track } from "./lessons";

export interface SearchEntry {
  id: string;
  slug: string;
  title: string;
  summary: string;
  track: Track;
  concepts: string[];
  content?: string;
}

interface SearchDocument {
  entry: SearchEntry;
  title: string;
  summary: string;
  concepts: string;
  content: string;
}

export interface SearchIndex {
  documents: SearchDocument[];
}

function normalize(value: string): string {
  return value.toLocaleLowerCase("zh-CN").replace(/\s+/g, " ").trim();
}

export function prepareSearchIndex(entries: SearchEntry[]): SearchIndex {
  return {
    documents: entries.map((entry) => ({
      entry,
      title: normalize(entry.title),
      summary: normalize(entry.summary),
      concepts: normalize(entry.concepts.join(" ")),
      content: normalize(entry.content ?? ""),
    })),
  };
}

export function searchPreparedLessons(index: SearchIndex, query: string): SearchEntry[] {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return [];

  const terms = normalizedQuery.split(" ").filter(Boolean);
  return index.documents
    .map((document) => {
      const { entry, title, summary, concepts, content } = document;
      const fields = [title, summary, concepts, content];
      if (!terms.every((term) => fields.some((field) => field.includes(term)))) return null;

      let score = 0;
      for (const term of terms) {
        if (title.includes(term)) score += 100;
        if (concepts.includes(term)) score += 60;
        if (summary.includes(term)) score += 35;
        if (content.includes(term)) score += 15;
      }
      return { entry, score };
    })
    .filter((result): result is { entry: SearchEntry; score: number } => result !== null)
    .sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title, "zh-CN"))
    .map(({ entry }) => entry);
}

export function searchLessons(entries: SearchEntry[], query: string): SearchEntry[] {
  return searchPreparedLessons(prepareSearchIndex(entries), query);
}
