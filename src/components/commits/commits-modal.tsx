"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { githubUsername } from "@/lib/site-config";

type CommitItem = {
  id: string;
  repo: string;
  message: string;
  url: string;
  created_at: string; // ISO
};

interface CommitsModalProps {
  open: boolean;
  onClose: () => void;
  username?: string;
}

export const CommitsModal: React.FC<CommitsModalProps> = ({ open, onClose, username }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<CommitItem[]>([]);
  const [updatedAt, setUpdatedAt] = useState<number | null>(null);

  const effectiveUsername = username || githubUsername;

  const fetchCommits = useCallback(async () => {
    if (!effectiveUsername || effectiveUsername === "your-github-username") {
      setError("Please set your actual GitHub username in src/lib/site-config.ts");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // 1) Primary: use Search Commits API to fetch latest 30 commits by author
      // Docs: https://docs.github.com/en/rest/search/search?apiVersion=2022-11-28#search-commits
      const searchParams = new URLSearchParams({
        q: `author:${effectiveUsername}`,
        sort: "author-date",
        order: "desc",
        per_page: "30",
        page: "1",
      });

      const searchRes = await fetch(`https://api.github.com/search/commits?${searchParams.toString()}`, {
        headers: {
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
          "User-Agent": "portfolio-app",
        },
        cache: "no-store",
      });

      const commits: CommitItem[] = [];

      if (searchRes.ok) {
        const data = (await searchRes.json()) as any;
        const items = Array.isArray(data?.items) ? data.items : [];
        for (const it of items) {
          const repo = it?.repository?.full_name ?? "";
          const message = it?.commit?.message ?? "";
          const url = it?.html_url ?? (repo && it?.sha ? `https://github.com/${repo}/commit/${it.sha}` : "");
          const createdAt = it?.commit?.author?.date ?? it?.commit?.committer?.date ?? new Date().toISOString();
          const id = `${it?.sha}-${repo}`;
          commits.push({ id, repo, message, url, created_at: createdAt });
        }
      } else {
        // 2) Fallback: User Events API (iterate pages)
        const pages = 3; // fewer pages to be gentle on rate limits
        for (let page = 1; page <= pages; page++) {
          const res = await fetch(
            `https://api.github.com/users/${effectiveUsername}/events/public?per_page=100&page=${page}`,
            {
              headers: {
                Accept: "application/vnd.github+json",
                "X-GitHub-Api-Version": "2022-11-28",
                "User-Agent": "portfolio-app",
              },
              cache: "no-store",
            }
          );
          if (!res.ok) break;
          const events = (await res.json()) as any[];
          if (events.length === 0) break;
          for (const ev of events) {
            if (ev?.type === "PushEvent" && Array.isArray(ev?.payload?.commits)) {
              for (const c of ev.payload.commits) {
                commits.push({
                  id: `${ev.id}-${c.sha}`,
                  repo: ev?.repo?.name ?? "",
                  message: c?.message ?? "",
                  url: `https://github.com/${ev?.repo?.name}/commit/${c?.sha}`,
                  created_at: ev?.created_at ?? new Date().toISOString(),
                });
              }
            }
            if (ev?.type === "PullRequestEvent" && ev?.payload?.pull_request) {
              const pr = ev.payload.pull_request;
              commits.push({
                id: `${ev.id}-pr`,
                repo: ev?.repo?.name ?? "",
                message: `${ev.payload.action} pull request #${pr.number} from ${pr.head.ref} ${pr.title}`,
                url: pr.html_url,
                created_at: ev?.created_at ?? new Date().toISOString(),
              });
            }
          }
        }
      }

      // Sort newest first and keep a healthy window (at least 30)
      commits.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setItems(commits.slice(0, 50));
      setUpdatedAt(Date.now());
    } catch (e: any) {
      setError(e?.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [effectiveUsername]);

  // Fetch when opened
  useEffect(() => {
    if (open) fetchCommits();
  }, [open, fetchCommits]);

  // ESC to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key.toLowerCase() === "r" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        fetchCommits();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, fetchCommits]);

  const lastUpdated = useMemo(() => (updatedAt ? new Date(updatedAt).toLocaleTimeString() : null), [updatedAt]);

  // Group commits by date (YYYY-MM-DD)
  const grouped = useMemo(() => {
    const groups: Record<string, CommitItem[]> = {};
    for (const it of items) {
      const d = new Date(it.created_at);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(it);
    }
    const ordered = Object.keys(groups)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
      .map((k) => ({ dateKey: k, items: groups[k] }));
    return ordered;
  }, [items]);

  const relativeTime = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const s = Math.floor(diff / 1000);
    if (s < 60) return `${s}s ago`;
    const m = Math.floor(s / 60);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    const d = Math.floor(h / 24);
    return `${d}d ago`;
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      {/* Modal window */}
      <div className="relative z-10 w-[calc(100vw-2rem)] sm:w-[32rem] max-w-2xl h-[70vh] flex flex-col rounded-lg overflow-hidden bg-[var(--color-card)] supports-[backdrop-filter]:bg-[var(--color-card)]/80 backdrop-blur text-[var(--color-foreground)] border border-[var(--color-border)] shadow-lg">
        {/* Title bar */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-4 sm:px-5 py-2 sm:py-3 border-b border-[var(--color-border)] bg-[var(--color-card)]/95">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="font-mono text-sm">Commits</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              className="font-mono text-xs sm:text-sm underline text-[var(--color-accent-red)] hover:opacity-80"
              onClick={fetchCommits}
              title="Refresh (Cmd/Ctrl+R)"
            >
              refresh
            </button>
            <button className="px-2 text-lg" onClick={onClose} aria-label="Close commits modal">
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto pt-0 pb-4 sm:pb-5 px-2 sm:px-5 nice-scroll">
          {loading && <p className="font-mono text-sm sm:text-base">loading recent commits…</p>}
          {error && (
            <p className="font-mono text-sm sm:text-base text-[var(--color-text-secondary)]">
              {error}
            </p>
          )}
          {!loading && !error && items.length === 0 && (
            <p className="font-mono text-[var(--color-text-secondary)]">no recent commits found.</p>
          )}

          <div className="space-y-6 sm:space-y-8">
            {grouped.map(({ dateKey, items: groupItems }) => {
              const dateLabel = new Date(dateKey).toLocaleDateString('en-US', {
                month: 'short', day: '2-digit', year: 'numeric'
              });
              return (
                <section key={dateKey}>
                  {/* Sticky date header */}
                  <div className="sticky top-0 z-10 -mx-4 sm:-mx-5 px-4 sm:px-5 py-1.5 sm:py-2 bg-[var(--color-card)]/95 border-b border-[var(--color-border)]">
                    <span className="font-mono text-xs sm:text-sm text-[var(--color-text-secondary)]">{dateLabel}</span>
                  </div>

                  <div className="mt-3 sm:mt-4 grid gap-2.5 sm:gap-3">
                    {groupItems.map((c) => (
                      <article
                        key={c.id}
                        className={`border border-[var(--color-border)] bg-[var(--color-card)]/60 transition-colors p-2 sm:p-3 rounded-md ${c.url ? 'hover:bg-[var(--color-card)] cursor-pointer' : ''}`}
                        onClick={() => { if (c.url) window.open(c.url, '_blank', 'noopener,noreferrer'); }}
                        onKeyDown={(e) => { if (c.url && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); window.open(c.url, '_blank', 'noopener,noreferrer'); } }}
                        role={c.url ? 'link' : undefined}
                        tabIndex={c.url ? 0 : -1}
                        aria-label={c.url ? `Open commit ${c.repo}` : undefined}
                      >
                        <header className="mb-1 flex items-center gap-2 flex-wrap">
                          <span className="px-1.5 py-[1px] text-[10px] sm:text-xs border border-[var(--color-border)] rounded-sm text-[var(--color-accent-red)]">
                            {c.repo}
                          </span>
                          <time
                            className="text-[var(--color-text-secondary)] text-[10px] sm:text-xs"
                            title={new Date(c.created_at).toLocaleString()}
                          >
                            {new Date(c.created_at).toLocaleString('en-US', {
                              month: 'short', day: '2-digit', year: 'numeric',
                              hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
                            })}
                          </time>
                          {/* Removed inline link; container is now clickable */}
                        </header>
                        <p className="font-mono text-[var(--color-text-primary)] leading-relaxed whitespace-pre-line text-sm">
                          {c.message}
                        </p>
                      </article>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};