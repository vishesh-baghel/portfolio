import type { DailyGroup, WorklogEntry } from '@/lib/worklog';
import { formatDisplayDate } from '@/lib/worklog';
import { TimelineEntry } from './timeline-entry';

interface TimelineDayProps {
  group: DailyGroup;
}

const groupByProject = (entries: WorklogEntry[]): Map<string, WorklogEntry[]> => {
  const map = new Map<string, WorklogEntry[]>();
  for (const entry of entries) {
    const existing = map.get(entry.project) || [];
    existing.push(entry);
    map.set(entry.project, existing);
  }
  return map;
};

export const TimelineDay = ({ group }: TimelineDayProps) => {
  const projectGroups = groupByProject(group.entries);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {formatDisplayDate(group.date)}
        </span>
        <div className="flex-1 border-t border-border" />
      </div>

      <div className="space-y-3 pl-2">
        {Array.from(projectGroups.entries()).map(([project, entries]) => (
          <div key={project} className="border-l-2 border-border pl-3 space-y-0">
            <span className="text-xs text-muted-foreground">{project}</span>
            {entries.map((entry, i) => (
              <TimelineEntry key={`${entry.date}-${project}-${i}`} entry={entry} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
