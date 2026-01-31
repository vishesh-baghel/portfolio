import { unstable_cache } from 'next/cache';
import { generateText } from 'ai';

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
  title?: string;
  content?: string;
  tags?: string[];
  metadata?: {
    public?: boolean;
    summary?: string;
    decision?: string;
    problem?: string;
    entryTags?: string | string[];
    project?: string;
    date?: string;
    links?: string | {
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
  if (!MEMORY_URL || !MEMORY_KEY) {
    return [];
  }

  // First, get the document index
  const indexParams = new URLSearchParams({
    folder: '/worklog',
    tags: 'worklog',
    limit: '100',
  });

  const indexRes = await fetch(`${MEMORY_URL}/api/index?${indexParams}`, {
    headers: { Authorization: `Bearer ${MEMORY_KEY}` },
    next: { revalidate: isToday(endDate) ? 300 : 3600 },
  });

  if (!indexRes.ok) return [];

  const { documents: indexDocs } = await indexRes.json();
  if (!Array.isArray(indexDocs) || indexDocs.length === 0) return [];

  // Fetch full documents to get metadata
  const docPromises = indexDocs.map(async (doc: { path: string }) => {
    const docRes = await fetch(`${MEMORY_URL}/api/documents${doc.path}`, {
      headers: { Authorization: `Bearer ${MEMORY_KEY}` },
      next: { revalidate: isToday(endDate) ? 300 : 3600 },
    });
    if (!docRes.ok) return null;
    return docRes.json();
  });

  const fullDocs = await Promise.all(docPromises);
  const validDocs = fullDocs.filter(
    (doc): doc is MemoryDocument => doc !== null
  );

  // Filter by date range and public flag
  const filtered = validDocs.filter((doc) => {
    const docDate = doc.metadata?.date;
    const isPublic = doc.metadata?.public;
    if (!docDate || !isPublic) return false;
    return docDate >= startDate && docDate <= endDate;
  });

  // Sort by date descending
  filtered.sort((a, b) => {
    const dateA = a.metadata?.date || '';
    const dateB = b.metadata?.date || '';
    return dateB.localeCompare(dateA);
  });

  return filtered.slice(0, 50).map(docToEntry);
};

const docToEntry = (doc: MemoryDocument): WorklogEntry => {
  const metadata = doc.metadata || {};

  // Handle entryTags which might be a comma-separated string or array
  let tags: string[] = [];
  if (typeof metadata.entryTags === 'string') {
    tags = metadata.entryTags.split(',').map((t) => t.trim());
  } else if (Array.isArray(metadata.entryTags)) {
    tags = metadata.entryTags;
  }

  // Handle links which might be a string (empty) or object
  let links: WorklogEntry['links'] | undefined;
  if (typeof metadata.links === 'object' && metadata.links !== null) {
    links = metadata.links;
  }

  return {
    summary: metadata.summary || doc.title || 'Untitled',
    decision: metadata.decision,
    problem: metadata.problem,
    tags,
    project: metadata.project || 'unknown',
    date: metadata.date || '',
    links,
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
  end.setDate(end.getDate() - offsetDays + 1); // +1 day buffer to cover timezone differences
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

    // Check if AI generation is enabled (requires ANTHROPIC_API_KEY for the AI Gateway)
    const hasAnthropicKey = !!process.env.ANTHROPIC_API_KEY;
    if (!hasAnthropicKey) {
      return getFallbackHighlights(entries);
    }

    const prompt = buildHighlightsPrompt(entries);

    try {
      // Uses Vercel AI Gateway - automatically routes to Anthropic
      const { text } = await generateText({
        model: 'anthropic/claude-3-5-haiku-latest',
        prompt,
        temperature: 0.3,
      });

      if (!text) {
        return getFallbackHighlights(entries);
      }

      // Strip markdown code blocks if present
      let jsonText = text.trim();
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.slice(7);
      } else if (jsonText.startsWith('```')) {
        jsonText = jsonText.slice(3);
      }
      if (jsonText.endsWith('```')) {
        jsonText = jsonText.slice(0, -3);
      }
      jsonText = jsonText.trim();

      const parsed = JSON.parse(jsonText);
      return (parsed.highlights || []).map((h: { text: string }) => ({ text: h.text }));
    } catch {
      return getFallbackHighlights(entries);
    }
  },
  ['weekly-highlights'],
  { revalidate: 86400 }
);

const getFallbackHighlights = (entries: WorklogEntry[]): WeeklyHighlight[] => {
  return entries
    .filter(e => e.decision)
    .slice(0, 3)
    .map(e => ({ text: e.summary }));
};

const buildHighlightsPrompt = (entries: WorklogEntry[]): string => {
  const entrySummaries = entries
    .map(e => `- [${e.project}] ${e.summary}${e.decision ? ` (Decision: ${e.decision})` : ''}`)
    .join('\n');

  return `Summarize a developer's weekly work into 2-4 highlights. Each highlight should be 1-2 short sentences covering what was done and the key decision or trade-off.

Entries:
${entrySummaries}

Rules:
- Be factual and concise - state what was done, not what it "enabled" or "achieved"
- No marketing language, no superlatives, no exaggeration
- Skip minor fixes and routine tasks - only include meaningful work
- Each highlight: max 3 sentences
- If fewer than 2 entries are significant, return fewer highlights

Bad: "Implemented granular permission model with explicit allow/deny rules instead of blanket access. Moved worklog capture from Stop hook to SessionEnd to avoid redundant execution after every response. Used space-based patterns for bash commands per Claude Code documentation standards."
Good: "Configured project permissions with allow/deny rules. Moved worklog capture to SessionEnd hook to avoid redundant execution."

Bad: "Revolutionized the CI pipeline with a robust workflow solution"
Good: "Fixed CI pipeline by adding MCP build step before tests."

JSON format:
{ "highlights": [{ "text": "..." }] }`;
};
