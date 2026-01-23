'use client';

import { useState } from 'react';
import type { DailyGroup } from '@/lib/worklog';
import { TimelineDay } from './timeline-day';

interface TimelineProps {
  initialGroups: DailyGroup[];
}

export const Timeline = ({ initialGroups }: TimelineProps) => {
  const [groups, setGroups] = useState<DailyGroup[]>(initialGroups);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(14);

  const loadMore = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/worklog?offset=${offset}&limit=14`);
      if (!res.ok) return;

      const data = await res.json();
      setGroups(prev => [...prev, ...data.groups]);
      setHasMore(data.hasMore && data.groups.length > 0);
      setOffset(prev => prev + 14);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-6">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        timeline
      </h2>

      <div className="space-y-6">
        {groups.map(group => (
          <TimelineDay key={group.date} group={group} />
        ))}
      </div>

      {hasMore && (
        <button
          type="button"
          onClick={loadMore}
          disabled={loading}
          className="w-full border border-border py-2 text-sm text-muted-foreground hover:bg-[var(--color-secondary)] hover:text-foreground transition-colors disabled:opacity-50"
        >
          {loading ? 'loading...' : 'load more'}
        </button>
      )}
    </section>
  );
};
