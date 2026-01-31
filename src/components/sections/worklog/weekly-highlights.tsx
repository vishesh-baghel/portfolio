import type { WeeklyHighlight } from '@/lib/worklog';

interface WeeklyHighlightsProps {
  highlights: WeeklyHighlight[];
}

export const WeeklyHighlights = ({ highlights }: WeeklyHighlightsProps) => {
  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        this week
      </h2>
      <div className="border border-border px-4 pt-4 pb-3 space-y-2">
        {highlights.map((highlight, i) => (
          <p key={i} className="text-sm leading-relaxed pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-muted-foreground">
            {highlight.text}
          </p>
        ))}
      </div>
    </section>
  );
};
