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
  if (!MEMORY_URL || !MEMORY_KEY) {
    if (process.env.NODE_ENV === 'development') {
      return getSampleEntries(startDate, endDate);
    }
    return [];
  }

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

// --- Sample Data (dev only) ---

const getSampleEntries = (startDate: string, endDate: string): WorklogEntry[] => {
  const today = new Date();
  const daysAgo = (n: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() - n);
    return d.toISOString().split('T')[0];
  };

  const all: WorklogEntry[] = [
    {
      summary: 'Implemented two-tier ISR caching for worklog page',
      decision: 'Used 5min TTL for today\'s entries and 1hr for past days. On-demand revalidation was overkill since the worklog CLI runs at most once per day.',
      problem: 'Worklog page was hitting the Memory API on every request, adding ~400ms latency.',
      tags: ['performance', 'frontend'],
      project: 'portfolio',
      date: daysAgo(0),
      links: { pr: 'https://github.com/vishesh-baghel/portfolio/pull/21' },
    },
    {
      summary: 'Added expandable entry cards with decision/problem details',
      tags: ['feature', 'frontend'],
      project: 'portfolio',
      date: daysAgo(0),
    },
    {
      summary: 'Migrated worklog enrichment from OpenAI to Vercel AI Gateway',
      decision: 'Using createGateway with anthropic/claude-3-5-haiku-latest. Single gateway key eliminates per-provider key management.',
      tags: ['refactor', 'ai'],
      project: 'experiments',
      date: daysAgo(1),
      links: { commit: 'https://github.com/vishesh-baghel/experiments/commit/051481a' },
    },
    {
      summary: 'Built session normalization pipeline for Claude Code JSONL transcripts',
      decision: 'Extract only text content from assistant messages, skip thinking/tool_use blocks. Truncate at 500 chars per turn to keep enrichment prompts focused.',
      problem: 'Raw JSONL entries have nested content blocks and sidechain conversations that pollute the context.',
      tags: ['architecture', 'tooling'],
      project: 'experiments',
      date: daysAgo(1),
    },
    {
      summary: 'Designed sanitization layer to redact secrets and filter blocked projects',
      decision: 'Applied regex-based redaction for API keys, IPs, and internal URLs before LLM enrichment. Allowlist approach for projects — only portfolio and experiments pass through.',
      tags: ['architecture', 'tooling'],
      project: 'experiments',
      date: daysAgo(2),
    },
    {
      summary: 'Fixed race condition in pitch page analytics tracking',
      problem: 'PostHog events were firing before the page view was registered, causing attribution to be lost.',
      tags: ['fix', 'frontend'],
      project: 'portfolio',
      date: daysAgo(2),
    },
    {
      summary: 'Added comprehensive test suite for worklog pipeline (181 tests)',
      decision: 'Mocked all external boundaries (fs, fetch, AI SDK) to keep tests fast and deterministic. Each module has its own test file with edge cases.',
      tags: ['testing', 'tooling'],
      project: 'experiments',
      date: daysAgo(3),
    },
    {
      summary: 'Refactored Mastra agent to use structured tool outputs',
      decision: 'Switched from freeform text responses to zod-validated tool results. Reduces hallucination in agent responses and makes downstream parsing reliable.',
      tags: ['refactor', 'ai'],
      project: 'portfolio',
      date: daysAgo(4),
    },
    {
      summary: 'Implemented tag-priority sorting for worklog timeline',
      decision: 'Architecture entries surface first, docs last. Caps at 5 entries per day to keep the timeline scannable.',
      tags: ['feature', 'frontend'],
      project: 'portfolio',
      date: daysAgo(5),
    },
    {
      summary: 'Set up MCP server package with npm publishing pipeline',
      decision: 'Used tsup for building with ESM output. Package exposes experiment content via MCP tools for Claude Code integration.',
      tags: ['architecture', 'tooling'],
      project: 'experiments',
      date: daysAgo(5),
      links: { pr: 'https://github.com/vishesh-baghel/portfolio/pull/18' },
    },
    {
      summary: 'Optimized bundle size by lazy-loading framer-motion',
      problem: 'Initial JS bundle was 180KB gzipped, causing poor LCP on mobile.',
      decision: 'Dynamic imports for animation-heavy components reduced initial bundle by 40KB.',
      tags: ['performance', 'frontend'],
      project: 'portfolio',
      date: daysAgo(7),
    },
    {
      summary: 'Added weekly highlights generation with GPT-4o-mini',
      decision: 'Generate 3-5 narrative highlights from the week\'s entries. Cache for 24hrs since highlights don\'t change intra-day.',
      tags: ['feature', 'ai'],
      project: 'portfolio',
      date: daysAgo(8),
    },
    {
      summary: 'Configured CI workflow with build and test gates for all PRs',
      tags: ['DX', 'tooling'],
      project: 'portfolio',
      date: daysAgo(10),
      links: { commit: 'https://github.com/vishesh-baghel/portfolio/commit/d1440a0' },
    },
    {
      summary: 'Evaluated vector store options for Memory API semantic search',
      decision: 'Chose pgvector over Pinecone — simpler ops since we already run Postgres, and latency is acceptable for the worklog query volume (~50 docs/week).',
      tags: ['architecture', 'backend'],
      project: 'experiments',
      date: daysAgo(11),
    },
    {
      summary: 'Fixed hydration mismatch in dark mode toggle',
      problem: 'Server render used system preference but client read localStorage, causing a flash.',
      tags: ['fix', 'frontend'],
      project: 'portfolio',
      date: daysAgo(12),
    },
  ];

  return all.filter(e => e.date >= startDate && e.date <= endDate);
};

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
