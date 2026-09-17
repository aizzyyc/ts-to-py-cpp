export type PrimaryNavSection = "learn" | "search";

function normalizePath(pathname: string): string {
  const normalized = pathname.replace(/\/+$/, "");
  return normalized || "/";
}

function removeBasePath(pathname: string, baseUrl: string): string {
  const path = normalizePath(pathname);
  const base = normalizePath(baseUrl);

  if (base === "/") return path;
  if (path === base) return "/";
  return path.startsWith(`${base}/`) ? path.slice(base.length) : path;
}

export function getPrimaryNavSection(pathname: string, baseUrl = "/"): PrimaryNavSection | null {
  const path = removeBasePath(pathname, baseUrl);

  if (path === "/learn" || path.startsWith("/learn/")) return "learn";
  if (path === "/search" || path.startsWith("/search/")) return "search";
  return null;
}

export function isCurrentHashTarget(
  pathname: string,
  hash: string,
  targetPathname: string,
  targetHash: string,
): boolean {
  return normalizePath(pathname) === normalizePath(targetPathname) && hash === targetHash;
}
