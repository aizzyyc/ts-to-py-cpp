import { TRACK_LABELS, type Track } from "../lib/lessons";
import { searchLessons, type SearchEntry } from "../lib/search";
import { sitePath } from "../lib/site-path";

const indexElement = document.querySelector<HTMLScriptElement>("#search-index");
const form = document.querySelector<HTMLFormElement>("[data-search-form]");
const input = document.querySelector<HTMLInputElement>("#course-search");
const status = document.querySelector<HTMLElement>("[data-search-status]");
const resultsContainer = document.querySelector<HTMLElement>("[data-search-results]");
const suggestionsContainer = document.querySelector<HTMLElement>("[data-search-suggestions]");
const suggestions = [...document.querySelectorAll<HTMLButtonElement>("[data-search-suggestion]")];

if (indexElement && form && input && status && resultsContainer) {
  const searchStatus = status;
  const searchResults = resultsContainer;
  let entries: SearchEntry[] = [];
  try {
    entries = JSON.parse(indexElement.textContent ?? "[]") as SearchEntry[];
  } catch {
    searchStatus.textContent = "课程索引加载失败，请刷新页面重试。";
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

  function render(query: string): void {
    const trimmedQuery = query.trim();
    if (suggestionsContainer) suggestionsContainer.hidden = Boolean(trimmedQuery);
    if (!trimmedQuery) {
      searchStatus.textContent = "输入关键词开始搜索。支持中文概念和英文代码术语。";
      searchResults.innerHTML = "";
      return;
    }

    const results = searchLessons(entries, trimmedQuery);
    searchStatus.textContent = results.length ? `找到 ${results.length} 节相关课程` : "没有找到匹配课程，试试更短的关键词。";
    searchResults.innerHTML = results.length
      ? results.map((entry) => {
          const track = entry.track as Track;
          return `<a class="search-result" href="${sitePath(`/learn/${encodeURIComponent(track)}/${encodeURIComponent(entry.slug)}`)}">
            <div class="search-result-meta"><span class="search-result-track">${escapeHtml(TRACK_LABELS[track])}</span><span>${escapeHtml(entry.concepts.slice(0, 3).join(" · "))}</span></div>
            <h2>${escapeHtml(entry.title)}</h2>
            <p>${escapeHtml(entry.summary)}</p>
          </a>`;
        }).join("")
      : '<p class="search-empty">还没有匹配结果。可以搜索 `Promise`、`unique_ptr`、`NumPy` 或“数据处理”。</p>';
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
  });

  input.addEventListener("input", () => render(input.value));

  suggestions.forEach((suggestion) => {
    suggestion.addEventListener("click", () => {
      const query = suggestion.dataset.searchSuggestion ?? "";
      input.value = query;
      window.history.replaceState({}, "", sitePath(`/search?q=${encodeURIComponent(query)}`));
      render(query);
      input.focus();
    });
  });
}
