import type { Metadata } from 'next';
import Header from '@/components/sections/header';
import Footer from '@/components/sections/footer';
import { WeeklyHighlights } from '@/components/sections/worklog/weekly-highlights';
import { Timeline } from '@/components/sections/worklog/timeline';
import {
  fetchWorklogEntries,
  groupByDate,
  getDateRange,
  getWeeklyHighlights,
} from '@/lib/worklog';

export const metadata: Metadata = {
  title: 'Worklog - Vishesh Baghel',
  description:
    'Daily engineering work log. Architecture decisions, trade-offs, and technical problem-solving.',
};

export default async function WorklogPage() {
  // Fetch last 14 days for timeline
  const { startDate, endDate } = getDateRange(0, 14);
  const entries = await fetchWorklogEntries(startDate, endDate);
  const groups = groupByDate(entries);

  // Fetch last 7 days for weekly highlights
  const { startDate: weekStart, endDate: weekEnd } = getDateRange(0, 7);
  const weekEntries = await fetchWorklogEntries(weekStart, weekEnd);
  const highlights = await getWeeklyHighlights(weekEntries);

  return (
    <div className="min-h-screen bg-background-primary font-mono">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6">
        <Header />

        <main className="space-y-10 mb-20">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">worklog</h1>
            <p className="text-sm text-muted-foreground">
              daily engineering decisions and trade-offs, captured automatically
            </p>
          </div>

          {highlights.length > 0 && <WeeklyHighlights highlights={highlights} />}

          {groups.length > 0 ? (
            <Timeline initialGroups={groups} />
          ) : (
            <div className="border border-border p-8 text-center text-muted-foreground">
              <p className="text-sm">no entries yet. check back soon.</p>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
}
