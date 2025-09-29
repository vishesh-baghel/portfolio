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
      // Fetch up to 100 recent public events (10 pages of 10 events each)
      const commits: CommitItem[] = [];
      const pages = 10; // Fetch 10 pages to get more historical data
      
      for (let page = 1; page <= pages; page++) {
        const res = await fetch(
          `https://api.github.com/users/${effectiveUsername}/events/public?per_page=10&page=${page}`,
          {
            headers: {
              Accept: "application/vnd.github+json",
            },
            cache: "no-store",
          }
        );

        if (!res.ok) {
          const rateReset = res.headers.get("x-ratelimit-reset");
          const resetAt = rateReset ? new Date(Number(rateReset) * 1000) : null;
          throw new Error(
            `Failed to fetch events (${res.status}). ${resetAt ? `Rate limit resets at ${resetAt.toLocaleTimeString()}.` : ""}`
          );
        }

        const events = (await res.json()) as any[];
        
        // If we get an empty page, stop fetching
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
          // Also include merge PR titles from PullRequestEvent if present
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

      // Sort by time desc and take latest 50 items (more than 20 to ensure we have enough after filtering)
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

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />

      {/* Modal window */}
      <div className="relative z-10 w-[90vw] max-w-[800px] bg-[var(--color-card)] text-[var(--color-foreground)] border border-[var(--color-border)] shadow-none">
        {/* Title bar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-2">
            <span>↻</span>
            <span className="font-mono">git commit history</span>
            <span className="text-[var(--color-muted-foreground)] text-sm">{lastUpdated ? `(last updated: ${lastUpdated})` : null}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="font-mono text-sm underline text-[var(--color-accent-red)]"
              onClick={fetchCommits}
              title="Refresh (Cmd/Ctrl+R)"
            >
              refresh
            </button>
            <button className="px-2" onClick={onClose} aria-label="Close commits modal">
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-h-[70vh] overflow-y-auto p-4">
          {loading && <p className="font-mono">loading recent commits…</p>}
          {error && (
            <p className="font-mono text-[var(--color-text-secondary)]">
              {error}
            </p>
          )}
          {!loading && !error && items.length === 0 && (
            <p className="font-mono text-[var(--color-text-secondary)]">no recent commits found.</p>
          )}

          <ul className="space-y-4">
            {items.map((c) => (
              <li key={c.id} className="font-mono leading-relaxed">
                <div className="mb-1">
                  <span className="text-[var(--color-accent-red)]">{c.repo}</span>
                  <span className="text-[var(--color-text-secondary)] ml-2 text-sm">
                    {new Date(c.created_at).toLocaleDateString('en-US', { 
                      month: '2-digit', 
                      day: '2-digit', 
                      year: 'numeric' 
                    })}, {new Date(c.created_at).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      hour12: false
                    })}
                  </span>
                </div>
                <div className="text-[var(--color-text-primary)] pl-4">
                  {c.message}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};