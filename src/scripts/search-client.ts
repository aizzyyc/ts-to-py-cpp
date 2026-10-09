import { TRACK_LABELS, type Track } from "../lib/lessons";
import { prepareSearchIndex, searchPreparedLessons, type SearchEntry, type SearchIndex } from "../lib/search";
import { sitePath } from "../lib/site-path";

let searchController: AbortController | undefined;
let fullTextIndexPromise: Promise<SearchIndex> | undefined;
let fullTextIndexCache: SearchIndex | undefined;

interface FullTextSearchEntry {
  id: string;
  content: string;
}

function loadFullTextIndex(entries: SearchEntry[]): Promise<SearchIndex> {
  if (!fullTextIndexPromise) {
    fullTextIndexPromise = fetch(sitePath("/search-index.json"))
      .then((response) => {
        if (!response.ok) throw new Error("课程正文索引加载失败");
        return response.json() as Promise<FullTextSearchEntry[]>;
      })
      .then((fullTextEntries) => {
        const contentById = new Map(fullTextEntries.map(({ id, content }) => [id, content] as const));
        const index = prepareSearchIndex(entries.map((entry) => ({ ...entry, content: contentById.get(entry.id) ?? "" })));
        fullTextIndexCache = index;
        return index;
      })
      .catch((error: unknown) => {
        fullTextIndexPromise = undefined;
        throw error;
      });
  }

  return fullTextIndexPromise;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;",
    };
    return entities[character];
  });
}

function initializeSearchPage(): void {
  searchController?.abort();

  const indexElement = document.querySelector<HTMLScriptElement>("#search-index");
  const form = document.querySelector<HTMLFormElement>("[data-search-form]");
  const input = document.querySelector<HTMLInputElement>("#course-search");
  const status = document.querySelector<HTMLElement>("[data-search-status]");
  const resultsContainer = document.querySelector<HTMLElement>("[data-search-results]");
  const suggestionsContainer = document.querySelector<HTMLElement>("[data-search-suggestions]");
  const suggestions = [...document.querySelectorAll<HTMLButtonElement>("[data-search-suggestion]")];

  if (!indexElement || !form || !input || !status || !resultsContainer) return;

  const searchForm = form;
  const searchStatus = status;
  const searchResults = resultsContainer;
  const controller = new AbortController();
  searchController = controller;
  const { signal } = controller;
  let entries: SearchEntry[] = [];
  let searchVersion = 0;
  try {
    entries = JSON.parse(indexElement.textContent ?? "[]") as SearchEntry[];
  } catch {
    searchStatus.textContent = "课程索引加载失败，请刷新页面重试。";
  }
  const metadataIndex = prepareSearchIndex(entries);

  function render(query: string): void {
    const currentSearchVersion = ++searchVersion;
    const trimmedQuery = query.trim();
    if (suggestionsContainer) suggestionsContainer.hidden = Boolean(trimmedQuery);
    if (!trimmedQuery) {
      searchStatus.textContent = "输入关键词开始搜索。支持中文概念和英文代码术语。";
      searchResults.innerHTML = "";
      return;
    }

    if (fullTextIndexCache) {
      renderResults(searchPreparedLessons(fullTextIndexCache, trimmedQuery));
      return;
    }

    const metadataResults = searchPreparedLessons(metadataIndex, trimmedQuery);
    renderResults(metadataResults, "正在搜索课程正文…", false);

    void loadFullTextIndex(entries)
      .then((fullTextIndex) => {
        if (signal.aborted || currentSearchVersion !== searchVersion || !searchForm.isConnected) return;
        renderResults(searchPreparedLessons(fullTextIndex, trimmedQuery));
      })
      .catch(() => {
        if (signal.aborted || currentSearchVersion !== searchVersion || !searchForm.isConnected) return;
        searchStatus.textContent = metadataResults.length
          ? `找到 ${metadataResults.length} 节标题、摘要或概念匹配课程；正文索引暂不可用。`
          : "正文索引加载失败，请稍后重试，或尝试搜索标题、摘要和概念。";
      });
  }

  function renderResults(results: SearchEntry[], statusMessage?: string, showEmptyState = true): void {
    searchStatus.textContent = statusMessage
      ?? (results.length ? `找到 ${results.length} 节相关课程` : "没有找到匹配课程，试试更短的关键词。");
    searchResults.innerHTML = results.length
      ? results.map((entry) => {
          const track = entry.track as Track;
          return `<a class="search-result" href="${sitePath(`/learn/${encodeURIComponent(track)}/${encodeURIComponent(entry.slug)}`)}">
            <div class="search-result-meta"><span class="search-result-track">${escapeHtml(TRACK_LABELS[track])}</span><span>${escapeHtml(entry.concepts.slice(0, 3).join(" · "))}</span></div>
            <h2>${escapeHtml(entry.title)}</h2>
            <p>${escapeHtml(entry.summary)}</p>
          </a>`;
        }).join("")
      : showEmptyState ? '<p class="search-empty">还没有匹配结果。可以搜索 `Promise`、`unique_ptr`、`NumPy` 或“数据处理”。</p>' : "";
  }

  const initialQuery = new URLSearchParams(window.location.search).get("q") ?? "";
  input.value = initialQuery;
  render(initialQuery);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const query = input.value.trim();
    const nextUrl = query ? sitePath(`/search?q=${encodeURIComponent(query)}`) : sitePath("/search");
    window.history.replaceState({}, "", nextUrl);
    render(query);
  }, { signal });

  input.addEventListener("input", () => render(input.value), { signal });

  suggestions.forEach((suggestion) => {
    suggestion.addEventListener("click", () => {
      const query = suggestion.dataset.searchSuggestion ?? "";
      input.value = query;
      window.history.replaceState({}, "", sitePath(`/search?q=${encodeURIComponent(query)}`));
      render(query);
      input.focus();
    }, { signal });
  });
}

document.addEventListener("astro:page-load", initializeSearchPage);
