import { NextRequest } from 'next/server';

// Runtime: Node.js (default). We keep it simple and rely on fetch.
// API: GitHub Search Issues/PRs endpoint
// Docs: https://docs.github.com/en/rest/search/search?apiVersion=2022-11-28#search-issues-and-pull-requests

interface GithubSearchItem {
  title: string;
  html_url: string;
  number: number;
  state: 'open' | 'closed';
  pull_request?: { url: string; html_url: string; merged_at?: string | null };
  repository_url: string; // e.g. https://api.github.com/repos/owner/name
  updated_at: string;
}

interface GithubSearchResponse {
  total_count: number;
  items: GithubSearchItem[];
}

// Simple in-memory cache for final responses
type CacheEntry = { expires: number; payload: any };
const RESPONSE_CACHE = new Map<string, CacheEntry>();

function repoFromApiUrl(apiUrl: string): { owner: string; name: string } | null {
  try {
    const parts = new URL(apiUrl);
    // pathname like /repos/{owner}/{repo}
    const segs = parts.pathname.split('/').filter(Boolean);
    const owner = segs[1];
    const name = segs[2];
    if (owner && name) return { owner, name };
  } catch {}
  return null;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const user = searchParams.get('user') || 'vishesh-baghel';
  const pageParam = searchParams.get('page');
  const scope = (searchParams.get('scope') || 'author').toLowerCase(); // 'author' | 'involves'

  const page = Math.max(1, Number.isFinite(Number(pageParam)) ? Number(pageParam) : 1);
  const perPage = 3;

  // Check cache first (scoped to user/scope/page)
  const cacheKey = `${user}:${scope}:${page}`;
  const now = Date.now();
  const cached = RESPONSE_CACHE.get(cacheKey);
  if (cached && cached.expires > now) {
    return new Response(JSON.stringify(cached.payload), { headers: { 'Content-Type': 'application/json' } });
  }

  // Build query: PRs limited to public repositories
  const qualifier = scope === 'involves' ? `involves:${user}` : `author:${user}`;
  const qFast = `is:pr ${qualifier} is:public`;
  const fastUrl = new URL('https://api.github.com/search/issues');
  fastUrl.searchParams.set('q', qFast);
  fastUrl.searchParams.set('sort', 'updated');
  fastUrl.searchParams.set('order', 'desc');
  fastUrl.searchParams.set('per_page', String(perPage));
  fastUrl.searchParams.set('page', String(page));

  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'portfolio-prs-widget'
  };

  // Note: Don't use GITHUB_TOKEN for search - scoped tokens limit results to repos they have access to.
  // Public repo searches work better unauthenticated (60 req/hour vs token-scoped results).

  // Simple retry with timeout to mitigate transient network issues.
  async function fetchWithTimeout(input: string, init: RequestInit & { timeoutMs?: number } = {}) {
    const { timeoutMs = 12000, ...rest } = init;
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(input, { ...rest, signal: controller.signal });
      return response as Response;
    } finally {
      clearTimeout(id);
    }
  }

  async function fetchWithRetry(input: string, init: RequestInit, retries = 3) {
    let lastErr: any;
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const res = await fetchWithTimeout(input, { ...init, timeoutMs: 15000 });
        return res;
      } catch (e: any) {
        lastErr = e;
        const name = e?.name || '';
        // Backoff: 500ms, 1000ms, 2000ms, etc.
        const delayMs = Math.min(2000, 500 * Math.pow(2, attempt));
        if (attempt < retries && (name === 'AbortError' || name === 'TimeoutError' || name === 'TypeError')) {
          await new Promise((r) => setTimeout(r, delayMs));
          continue;
        }
        break;
      }
    }
    throw lastErr;
  }

  try {
    // Fast path: single call with is:public to avoid repo privacy checks and reduce latency
    const fastRes = await fetchWithRetry(fastUrl.toString(), { headers, next: { revalidate: 60 } });
    if (fastRes.ok) {
      const fastData = (await fastRes.json()) as GithubSearchResponse;
      if (fastData.items.length > 0) {
        const mappedFast = fastData.items.map((it) => {
          const repo = repoFromApiUrl(it.repository_url);
          const isMerged = it.state === 'open' ? false : true; // state closed means either merged or closed; we won't show timestamp; merged state refined below if needed
          const state: 'open' | 'merged' | 'closed' = it.state === 'open' ? 'open' : 'closed';
          return {
            title: it.title,
            html_url: it.html_url,
            number: it.number,
            repo: repo ? `${repo.owner}/${repo.name}` : undefined,
            state,
            merged: isMerged,
            updated_at: it.updated_at
          };
        });
        const payload = {
          total_count: fastData.total_count,
          per_page: perPage,
          page,
          items: mappedFast
        };
        RESPONSE_CACHE.set(cacheKey, { expires: now + 1000 * 60 * 5, payload });
        return new Response(JSON.stringify(payload), { headers: { 'Content-Type': 'application/json' } });
      }
    }

    // Fallback: Build open+merged queries to form a larger pool and enable accurate public-only filtering.
    const openUrl = new URL('https://api.github.com/search/issues');
    openUrl.searchParams.set('q', `is:pr ${qualifier} is:open`);
    openUrl.searchParams.set('sort', 'updated');
    openUrl.searchParams.set('order', 'desc');
    openUrl.searchParams.set('per_page', '30');
    openUrl.searchParams.set('page', '1');

    const mergedUrl = new URL('https://api.github.com/search/issues');
    mergedUrl.searchParams.set('q', `is:pr ${qualifier} is:merged`);
    mergedUrl.searchParams.set('sort', 'updated');
    mergedUrl.searchParams.set('order', 'desc');
    mergedUrl.searchParams.set('per_page', '30');
    mergedUrl.searchParams.set('page', '1');

    const [openRes, mergedRes] = await Promise.all([
      fetchWithRetry(openUrl.toString(), { headers, next: { revalidate: 60 } }),
      fetchWithRetry(mergedUrl.toString(), { headers, next: { revalidate: 60 } })
    ]);

    if (!openRes.ok || !mergedRes.ok) {
      const textOpen = openRes.ok ? null : await openRes.text();
      const textMerged = mergedRes.ok ? null : await mergedRes.text();
      return new Response(JSON.stringify({ error: 'GitHub API error', openStatus: openRes.status, mergedStatus: mergedRes.status, openBody: textOpen, mergedBody: textMerged }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const openData = (await openRes.json()) as GithubSearchResponse;
    const mergedData = (await mergedRes.json()) as GithubSearchResponse;
    const combined = [...openData.items, ...mergedData.items]
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

    // Filter out private repos using the repository_url. Cache per repo URL to reduce calls.
    const privacyCache = new Map<string, boolean>();
    async function isRepoPrivate(repoApiUrl: string): Promise<boolean> {
      if (privacyCache.has(repoApiUrl)) return privacyCache.get(repoApiUrl)!;
      try {
        const r = await fetchWithRetry(repoApiUrl, { headers, next: { revalidate: 300 } });
        if (!r.ok) {
          // On failure assume private to be safe
          privacyCache.set(repoApiUrl, true);
          return true;
        }
        const j: any = await r.json();
        const priv = Boolean(j.private);
        privacyCache.set(repoApiUrl, priv);
        return priv;
      } catch {
        privacyCache.set(repoApiUrl, true);
        return true;
      }
    }

    const publicItems: GithubSearchItem[] = [];
    for (const it of combined) {
      const isPrivate = await isRepoPrivate(it.repository_url);
      if (!isPrivate) publicItems.push(it);
    }

    // Local pagination on public items only
    const start = (page - 1) * perPage;
    const end = start + perPage;
    const pagedItems = publicItems.slice(start, end);

    // Map results and determine merged state by membership in mergedData
    const mapped = pagedItems.map((it) => {
      const repo = repoFromApiUrl(it.repository_url);
      const isMerged = mergedData.items.some((m) => m.html_url === it.html_url);
      const state: 'open' | 'merged' | 'closed' = it.state === 'open' ? 'open' : isMerged ? 'merged' : 'closed';
      return {
        title: it.title,
        html_url: it.html_url,
        number: it.number,
        repo: repo ? `${repo.owner}/${repo.name}` : undefined,
        state,
        merged: isMerged,
        updated_at: it.updated_at
      };
    });

    const payload = {
      total_count: publicItems.length,
      per_page: perPage,
      page,
      items: mapped
    };
    RESPONSE_CACHE.set(cacheKey, { expires: now + 1000 * 60 * 5, payload }); // 5 min TTL
    return new Response(JSON.stringify(payload), { headers: { 'Content-Type': 'application/json' } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: 'Network error', message: err?.message || String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
