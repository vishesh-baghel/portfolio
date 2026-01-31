'use client';

import { useState } from 'react';
import type { WorklogEntry } from '@/lib/worklog';

interface TimelineEntryProps {
  entry: WorklogEntry;
}

export const TimelineEntry = ({ entry }: TimelineEntryProps) => {
  const [expanded, setExpanded] = useState(false);
  const hasDetails = entry.decision || entry.problem || entry.links;

  return (
    <div
      role={hasDetails ? 'button' : undefined}
      tabIndex={hasDetails ? 0 : undefined}
      aria-expanded={hasDetails ? expanded : undefined}
      onClick={() => hasDetails && setExpanded(!expanded)}
      onKeyDown={(e) => {
        if (hasDetails && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          setExpanded(!expanded);
        }
      }}
      className={`py-2 ${hasDetails ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-start gap-2">
        {hasDetails && (
          <span className="text-xs text-muted-foreground mt-0.5 select-none shrink-0">
            {expanded ? '\u25be' : '\u25b8'}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-sm leading-relaxed">{entry.summary}</span>
            {entry.tags.map(tag => (
              <span
                key={tag}
                className={`text-xs ${tag === 'architecture' ? 'text-accent-red' : 'text-muted-foreground'}`}
              >
                [{tag}]
              </span>
            ))}
          </div>

          {expanded && (
            <div className="mt-2 pl-0 space-y-1.5 text-sm text-muted-foreground">
              {entry.decision && (
                <p className="leading-relaxed">{entry.decision}</p>
              )}
              {entry.problem && (
                <p className="leading-relaxed italic">
                  problem: {entry.problem}
                </p>
              )}
              {entry.links?.pr && (
                <a
                  href={entry.links.pr}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs underline hover:text-foreground"
                  onClick={(e) => e.stopPropagation()}
                >
                  PR
                </a>
              )}
              {entry.links?.commit && (
                <a
                  href={entry.links.commit}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs underline hover:text-foreground ml-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  commit
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
