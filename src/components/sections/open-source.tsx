'use client';
import React, { useEffect, useMemo, useState } from 'react';

type PrItem = {
  title: string;
  html_url: string;
  number: number;
  repo?: string;
  state: 'open' | 'merged' | 'closed';
  merged: boolean;
  updated_at: string;
};

type ApiResponse = {
  total_count: number;
  per_page: number;
  page: number;
  items: PrItem[];
};

const OpenSourceSection = () => {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshTick, setRefreshTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/prs?user=vishesh-baghel&page=${page}&_=${Date.now()}` as string, {
          cache: 'no-store'
        });
        if (!res.ok) throw new Error(`API error ${res.status}`);
        const json: ApiResponse = await res.json();
        if (!cancelled) setData(json);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Failed to load PRs');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [page, refreshTick]);

  const hasNext = useMemo(() => {
    if (!data) return false;
    return data.page * data.per_page < data.total_count;
  }, [data]);
  const hasPrev = page > 1;

  return (
    <section className="py-6 font-mono">
      <div className="flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-bold cursor-default text-text-primary mt-0 mb-2">recent contributions</h2>
        <button
          className="text-xs sm:text-sm underline disabled:opacity-50"
          onClick={() => { setPage(1); setRefreshTick((t) => t + 1); }}
          disabled={loading}
          aria-label="Refresh PRs"
        >
          refresh
        </button>
      </div>
      <div className="grid gap-3">
        {loading && (
          <article className="border border-border bg-card/60 p-3 sm:p-4">
            <p className="text-xs sm:text-sm">loading pull requests…</p>
          </article>
        )}
        {error && (
          <article className="border border-border bg-card/60 p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-red-500">{error}</p>
          </article>
        )}
        {!loading && !error && data?.items?.length === 0 && (
          <article className="border border-border bg-card/60 p-3 sm:p-4">
            <p className="text-xs sm:text-sm">no pull requests found.</p>
          </article>
        )}
        {!loading && !error && data?.items?.map((it) => (
          <article key={`${it.repo}#${it.number}`} className="border border-border bg-card/60 hover:bg-card transition-colors p-3 sm:p-4">
            <header className="mb-1 flex items-center gap-2">
              <a className="underline text-accent-red text-sm sm:text-base" href={it.html_url} target="_blank" rel="noreferrer">
                {it.repo ? `${it.repo}#${it.number}` : `PR #${it.number}`}
              </a>
              <span className="text-xs sm:text-sm opacity-70">• {it.state}</span>
            </header>
            <p className="text-xs sm:text-sm">{it.title}</p>
          </article>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-3">
        <button
          className="text-xs sm:text-sm underline disabled:opacity-50"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={!hasPrev || loading}
        >
          previous
        </button>
        <button
          className="text-xs sm:text-sm underline disabled:opacity-50"
          onClick={() => setPage((p) => p + 1)}
          disabled={!hasNext || loading}
        >
          next
        </button>
      </div>
    </section>
  );
};

export default OpenSourceSection;
