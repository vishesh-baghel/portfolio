# Worklog Page - Portfolio Architecture

## Purpose

A page on the portfolio that displays a timeline of daily engineering work. Each entry showcases the engineering decisions and trade-offs behind the work. The page has two sections: weekly highlights (LLM-generated) and a chronological timeline with progressive disclosure.

Route: `/worklog`
Navigation: Main nav link (alongside Work, Experiments, etc.)

---

## Data Source

The portfolio reads worklog data from Memory's REST API. Each worklog document in Memory has:
- **metadata fields**: `public`, `summary`, `decision`, `problem`, `entryTags`, `project`, `date`, `links`
- **content**: Full context (not rendered on the portfolio, used only for weekly highlights generation)

The portfolio only renders documents where `metadata.public === true`.

---

## Data Flow

```
Memory REST API
        │
        ▼
Portfolio Server Component
        │
        ├──▶ GET /api/search?tags=worklog&metadata.public=true
        │    (fetch public entries for date range)
        │
        ├──▶ Parse metadata into WorklogEntry[]
        │
        ├──▶ Group by date, render timeline
        │
        └──▶ Generate weekly highlights (OpenAI, cached 24hr)
```

---

## Fetching from Memory

Uses Memory's metadata filtering API to query worklog entries server-side. No client-side filtering needed.

```typescript
const MEMORY_URL = process.env.MEMORY_API_URL;
const MEMORY_KEY = process.env.MEMORY_API_KEY;

// Fetch public worklog entries for a date range
async function fetchWorklogEntries(
  startDate: string,
  endDate: string
): Promise<WorklogEntry[]> {
  const metadataFilter = JSON.stringify({
    public: true,
    date: { $gte: startDate, $lte: endDate },
  });

  const params = new URLSearchParams({
    folder: '/worklog',
    recursive: 'true',
    tags: 'worklog',
    metadata: metadataFilter,
    fields: 'path,metadata',          // Skip content — only need metadata for rendering
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
  return documents.map(docToEntry);
}

function docToEntry(doc: MemoryDocument): WorklogEntry {
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
}
```

---

## Page Layout

```
┌──────────────────────────────────────────────────┐
│  Header (with Worklog in main nav)               │
├──────────────────────────────────────────────────┤
│                                                  │
│  ## This Week                                    │
│                                                  │
│  ┌────────────────────────────────────────────┐  │
│  │ • Designed dual-output pipeline for the    │  │
│  │   worklog system — public entries showcase │  │
│  │   engineering skill, rich context feeds    │  │
│  │   the content pipeline                     │  │
│  │                                            │  │
│  │ • Implemented two-pass sanitization to     │  │
│  │   safely publish work context publicly     │  │
│  │                                            │  │
│  │ • Built timeline with progressive          │  │
│  │   disclosure — scannable, detailed on      │  │
│  │   demand                                   │  │
│  └────────────────────────────────────────────┘  │
│                                                  │
├──────────────────────────────────────────────────┤
│                                                  │
│  ## Timeline                                     │
│                                                  │
│  ── Jan 22, 2025 ──────────────────────────────  │
│                                                  │
│  ┌ portfolio ─────────────────────────────────┐  │
│  │                                            │  │
│  │  Implemented two-tier caching for          │  │
│  │  worklog page                              │  │
│  │  [performance]                             │  │
│  │                                            │  │
│  │  ▸ Built ISR with time-based              │  │
│  │    revalidation...                         │  │
│  │                                            │  │
│  └────────────────────────────────────────────┘  │
│                                                  │
│  ┌ experiments ───────────────────────────────┐  │
│  │                                            │  │
│  │  Architected dual-output pipeline          │  │
│  │  [architecture]                            │  │
│  │                                            │  │
│  └────────────────────────────────────────────┘  │
│                                                  │
│  ── Jan 21, 2025 ──────────────────────────────  │
│  ...                                             │
│                                                  │
│  [Load more]                                     │
│                                                  │
├──────────────────────────────────────────────────┤
│  Footer                                          │
└──────────────────────────────────────────────────┘
```

---

## Entry Rendering (Progressive Disclosure)

### Collapsed (default)

Shows summary + tags. Scannable at a glance.

```
Implemented two-tier caching for worklog page
[performance]
```

### Expanded (on click/tap)

Reveals the decision, trade-offs, and links.

```
Implemented two-tier caching for worklog page
[performance]

Built ISR with time-based revalidation for daily logs (1hr TTL)
and unstable_cache for weekly highlights (24hr TTL). Today's log
uses shorter 5min TTL since it may update during the day.

trade-off: Shorter TTL means more origin hits, but on-demand
revalidation requires a webhook which adds coupling.

PR #24
```

---

## Sections

### 1. This Week

**Source**: All public entries from the last 7 days (summaries + decisions).

**Generation**: Server-side OpenAI call (same provider as portfolio agent) that produces 3-5 bullet points highlighting the most significant engineering work.

LLM instructions:
- Prioritize architectural decisions and novel solutions over routine fixes
- Frame each highlight as an outcome, not a task
- Connect related entries across days when they form a larger narrative

**Caching**:

```typescript
import { unstable_cache } from "next/cache";

const getWeeklyHighlights = unstable_cache(
  async (weekId: string, entries: WorklogEntry[]) => {
    const prompt = buildHighlightsPrompt(entries);
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });
    return parseHighlights(response);
  },
  ["weekly-highlights"],
  { revalidate: 86400 } // 24 hours
);
```

**Fallback**: If LLM call fails or no entries exist this week, show the 3 entries with the longest decision text as-is.

### 2. Timeline

**Initial load**: Most recent 14 days (server component, SSR).

**Pagination**: "Load more" button fetches the next 14 days via API route.

**Grouping**: Entries grouped by date (reverse chronological), then by project within each day.

**Daily cap**: If a day has more than 5 public entries, show the top 5 sorted by tag priority (architecture > performance > feature > fix > refactor > docs).

---

## Data Types

```typescript
interface WorklogEntry {
  summary: string;
  decision?: string;
  problem?: string;
  tags: string[];
  project: string;
  date: string;           // YYYY-MM-DD
  links?: {
    commit?: string;
    pr?: string;
    related?: string[];
  };
}

interface DailyGroup {
  date: string;
  entries: WorklogEntry[];
  projects: string[];     // Unique projects for this day
}

interface WeeklyHighlight {
  text: string;           // 1-2 sentence highlight
}
```

---

## Component Structure

```
src/app/worklog/
  page.tsx                        # Server component, fetches initial data

src/app/api/worklog/
  route.ts                        # GET handler for pagination

src/components/sections/worklog/
  weekly-highlights.tsx            # "This Week" section
  timeline.tsx                    # Full timeline + load more button
  timeline-day.tsx                # Date separator + day's entries
  timeline-project-group.tsx      # Project heading + entries within a day
  timeline-entry.tsx              # Single entry (collapsed/expanded state)

src/lib/
  worklog.ts                      # Memory fetching, entry parsing, caching
```

---

## API Route (Pagination)

```typescript
// src/app/api/worklog/route.ts
// GET /api/worklog?offset=14&limit=14

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const offset = parseInt(searchParams.get("offset") || "0");
  const limit = parseInt(searchParams.get("limit") || "14");

  // Calculate date range from offset
  const endDate = subDays(new Date(), offset);
  const startDate = subDays(endDate, limit);

  const entries = await fetchWorklogEntries(
    formatDate(startDate),
    formatDate(endDate)
  );

  const groups = groupByDate(entries);

  return Response.json({
    groups,
    hasMore: true, // Could check if older entries exist
  });
}
```

---

## Caching & Resilience

| Data | Method | TTL | Notes |
|------|--------|-----|-------|
| Worklog entries (past days) | Next.js fetch cache | 1 hour | Immutable once day is over |
| Worklog entries (today) | Next.js fetch cache | 5 min | May update during the day |
| Weekly highlights | unstable_cache | 24 hours | LLM-generated |

**When Memory is unreachable**: Next.js serves stale cached data. Visitors see a slightly outdated timeline, which is acceptable for a portfolio feature. No error state shown unless cache is completely empty (cold start).

---

## Design

Follows existing portfolio design system:
- IBM Plex Mono font
- 800px max-width centered
- Cream/black palette with red accents
- Sharp edges (0px border radius)

### Timeline-specific:

**Date separators**: Horizontal rule with date text in muted weight.

**Project groups**: Subtle border-left or background shift per project within a day.

**Entry (collapsed)**:
- Summary text, regular weight
- Tags in brackets, muted color, smaller size
- ▸ indicator showing expandability

**Entry (expanded)**:
- Decision/trade-off text below summary
- Slightly indented or lighter background
- Links as inline text
- Smooth height animation on toggle

**Tags color**:
- `[architecture]` — red accent (significant)
- All others — muted text (default)

**Weekly highlights**: Subtle bordered container, bullet points, regular weight.

---

## Interaction

- Click/tap entry → toggle expanded state
- "Load more" → fetch next 14 days
- Purely chronological scroll, no filtering
- Keyboard: focusable entries, Enter/Space toggles
- `aria-expanded` for accessibility

---

## SEO

- Title: "Worklog - Vishesh Baghel"
- Meta description: "Daily engineering work log. Architecture decisions, trade-offs, and technical problem-solving."
- No individual day URLs (single scrollable page)

---

## Environment Variables

```
MEMORY_API_URL=https://memory.yourdomain.com
MEMORY_API_KEY=mem_xxxxxxxxxxxx
```

Uses the same OpenAI key already configured for the portfolio agent (`OPENAI_API_KEY`).

---

## Open Questions

1. **Initial load performance**: Single bulk query with 14-day date range. Monitor latency once real data exists.
2. **Entry density on mobile**: With rich decision text expanded, verify readability on small screens.
3. **Weekly highlights empty state**: First week with no entries — hide the section entirely or show a placeholder?
4. **Load more termination**: Use `total` field from Memory's response. If `offset + limit >= total`, hide the button.
