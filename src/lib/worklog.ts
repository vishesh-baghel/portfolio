import { unstable_cache } from 'next/cache';

// --- Types ---

export interface WorklogEntry {
  summary: string;
  decision?: string;
  problem?: string;
  tags: string[];
  project: string;
  date: string; // YYYY-MM-DD
  links?: {
    commit?: string;
    pr?: string;
    related?: string[];
  };
}

export interface DailyGroup {
  date: string;
  entries: WorklogEntry[];
  projects: string[];
}

export interface WeeklyHighlight {
  text: string;
}

interface MemoryDocument {
  path: string;
  metadata: {
    public: boolean;
    summary: string;
    decision?: string;
    problem?: string;
    entryTags?: string[];
    project: string;
    date: string;
    links?: {
      commit?: string;
      pr?: string;
      related?: string[];
    };
  };
}

// --- Config ---

const MEMORY_URL = process.env.MEMORY_API_URL || '';
const MEMORY_KEY = process.env.MEMORY_API_KEY || '';

// --- Fetching ---

const isToday = (dateStr: string): boolean => {
  const today = new Date().toISOString().split('T')[0];
  return dateStr === today;
};

export const fetchWorklogEntries = async (
  startDate: string,
  endDate: string
): Promise<WorklogEntry[]> => {
  if (!MEMORY_URL || !MEMORY_KEY) return [];

  const metadataFilter = JSON.stringify({
    public: true,
    date: { $gte: startDate, $lte: endDate },
  });

  const params = new URLSearchParams({
    folder: '/worklog',
    recursive: 'true',
    tags: 'worklog',
    metadata: metadataFilter,
    fields: 'path,metadata',
    sort: 'metadata.date',
    order: 'desc',
    limit: '50',
  });

  const res = await fetch(`${MEMORY_URL}/api/documents?${params}`, {
    headers: { Authorization: `Bearer ${MEMORY_KEY}` },
    next: { revalidate: isToday(endDate) ? 300 : 3600 },
  });

  if (!res.ok) return [];

  const { documents } = await res.json();
  if (!Array.isArray(documents)) return [];

  return documents.map(docToEntry);
};

const docToEntry = (doc: MemoryDocument): WorklogEntry => {
  const { metadata } = doc;
  return {
    summary: metadata.summary,
    decision: metadata.decision,
    problem: metadata.problem,
    tags: metadata.entryTags || [],
    project: metadata.project,
    date: metadata.date,
    links: metadata.links,
  };
};

// --- Grouping ---

const TAG_PRIORITY: Record<string, number> = {
  architecture: 0,
  performance: 1,
  feature: 2,
  fix: 3,
  refactor: 4,
  docs: 5,
};

const getEntryPriority = (entry: WorklogEntry): number => {
  const best = entry.tags.reduce((min, tag) => {
    const p = TAG_PRIORITY[tag] ?? 99;
    return p < min ? p : min;
  }, 99);
  return best;
};

export const groupByDate = (entries: WorklogEntry[]): DailyGroup[] => {
  const map = new Map<string, WorklogEntry[]>();

  for (const entry of entries) {
    const existing = map.get(entry.date) || [];
    existing.push(entry);
    map.set(entry.date, existing);
  }

  return Array.from(map.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([date, dayEntries]) => {
      // Sort by tag priority, cap at 5
      const sorted = dayEntries
        .sort((a, b) => getEntryPriority(a) - getEntryPriority(b))
        .slice(0, 5);

      const projects = [...new Set(sorted.map(e => e.project))];

      return { date, entries: sorted, projects };
    });
};

// --- Date Utilities ---

export const formatDisplayDate = (dateStr: string): string => {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const getDateRange = (offsetDays: number, rangeDays: number) => {
  const end = new Date();
  end.setDate(end.getDate() - offsetDays);
  const start = new Date(end);
  start.setDate(start.getDate() - rangeDays);

  return {
    startDate: start.toISOString().split('T')[0],
    endDate: end.toISOString().split('T')[0],
  };
};

// --- Weekly Highlights ---

export const getWeeklyHighlights = unstable_cache(
  async (entries: WorklogEntry[]): Promise<WeeklyHighlight[]> => {
    if (entries.length === 0) return [];

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      // Fallback: use top entries by decision length
      return entries
        .filter(e => e.decision)
        .sort((a, b) => (b.decision?.length || 0) - (a.decision?.length || 0))
        .slice(0, 3)
        .map(e => ({ text: `${e.summary}${e.decision ? ` — ${e.decision}` : ''}` }));
    }

    const prompt = buildHighlightsPrompt(entries);

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        response_format: { type: 'json_object' },
      }),
    });

    if (!res.ok) {
      // Fallback on error
      return entries
        .filter(e => e.decision)
        .slice(0, 3)
        .map(e => ({ text: e.summary }));
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) return [];

    const parsed = JSON.parse(content);
    return (parsed.highlights || []).map((h: { text: string }) => ({ text: h.text }));
  },
  ['weekly-highlights'],
  { revalidate: 86400 }
);

const buildHighlightsPrompt = (entries: WorklogEntry[]): string => {
  const entrySummaries = entries
    .map(e => `- [${e.project}] ${e.summary}${e.decision ? ` (Decision: ${e.decision})` : ''}`)
    .join('\n');

  return `You are summarizing a software engineer's weekly work for their portfolio page.

Given these worklog entries from the past week:

${entrySummaries}

Generate 3-5 highlights that showcase the most significant engineering work. Rules:
- Prioritize architectural decisions and novel solutions over routine fixes
- Frame each highlight as an outcome, not a task
- Connect related entries across days when they form a larger narrative
- Each highlight should be 1-2 sentences

Respond in JSON format:
{
  "highlights": [
    { "text": "highlight text here" }
  ]
}`;
};
