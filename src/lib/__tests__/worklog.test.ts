import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { WorklogEntry, DailyGroup, WeeklyHighlight } from '../worklog';

// Mock Next.js cache (must be before imports)
vi.mock('next/cache', () => ({
  unstable_cache: (fn: Function) => fn, // Pass through the function without caching
}));

// Mock fetch globally
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

// Mock environment variables
vi.stubEnv('MEMORY_API_URL', 'https://memory.test.com');
vi.stubEnv('MEMORY_API_KEY', 'mem_test_key');

// Sample entries for testing
const createEntry = (overrides: Partial<WorklogEntry> = {}): WorklogEntry => ({
  summary: 'Test entry summary',
  tags: ['feature', 'frontend'],
  project: 'portfolio',
  date: '2025-01-22',
  ...overrides,
});

const createIndexDoc = (entry: WorklogEntry) => ({
  path: `/worklog/${entry.date}/session-${entry.summary.replace(/\s+/g, '-').slice(0, 10)}`,
  title: entry.summary,
  tags: ['worklog', ...entry.tags],
  source: 'worklog-cli',
  type: null,
  updatedAt: new Date().toISOString(),
});

const createFullDoc = (entry: WorklogEntry, path: string) => ({
  path,
  title: entry.summary,
  content: `# ${entry.summary}`,
  tags: ['worklog', ...entry.tags],
  metadata: {
    public: true,
    summary: entry.summary,
    decision: entry.decision,
    problem: entry.problem,
    entryTags: entry.tags.join(','),
    project: entry.project,
    date: entry.date,
    links: entry.links || '',
  },
  source: 'worklog-cli',
  type: null,
  version: 1,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

describe('worklog data utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchWorklogEntries', () => {
    it('returns empty array when MEMORY_API_URL is not set', async () => {
      vi.stubEnv('MEMORY_API_URL', '');

      const { fetchWorklogEntries } = await import('../worklog');
      const result = await fetchWorklogEntries('2025-01-15', '2025-01-22');

      expect(result).toEqual([]);
    });

    it('fetches entries from Memory API with correct params', async () => {
      vi.stubEnv('MEMORY_API_URL', 'https://memory.test.com');
      vi.stubEnv('MEMORY_API_KEY', 'mem_test_key');

      const entries = [
        createEntry({ summary: 'Entry 1', date: '2025-01-22' }),
        createEntry({ summary: 'Entry 2', date: '2025-01-21' }),
      ];

      const indexDocs = entries.map(createIndexDoc);

      // Mock index fetch
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ documents: indexDocs }),
      });

      // Mock individual document fetches
      for (let i = 0; i < entries.length; i++) {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => createFullDoc(entries[i], indexDocs[i].path),
        });
      }

      const { fetchWorklogEntries } = await import('../worklog');
      const result = await fetchWorklogEntries('2025-01-15', '2025-01-22');

      // First call should be to index endpoint
      const [indexUrl] = mockFetch.mock.calls[0];
      expect(indexUrl).toContain('memory.test.com');
      expect(indexUrl).toContain('/api/index');
      expect(indexUrl).toContain('folder=%2Fworklog');
      expect(indexUrl).toContain('tags=worklog');

      expect(result).toHaveLength(2);
    });

    it('returns empty array on API error', async () => {
      vi.stubEnv('MEMORY_API_URL', 'https://memory.test.com');
      vi.stubEnv('MEMORY_API_KEY', 'mem_test_key');

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      const { fetchWorklogEntries } = await import('../worklog');
      const result = await fetchWorklogEntries('2025-01-15', '2025-01-22');

      expect(result).toEqual([]);
    });

    it('transforms Memory documents to WorklogEntry format', async () => {
      vi.stubEnv('MEMORY_API_URL', 'https://memory.test.com');
      vi.stubEnv('MEMORY_API_KEY', 'mem_test_key');

      const entry = createEntry({
        summary: 'Implemented caching',
        decision: 'Used ISR with 5min TTL',
        problem: 'Too many API calls',
        tags: ['performance'],
        project: 'portfolio',
        date: '2025-01-22',
        links: { pr: 'https://github.com/example/pr/1' },
      });

      const indexDoc = createIndexDoc(entry);

      // Mock index fetch
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ documents: [indexDoc] }),
      });

      // Mock document fetch
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => createFullDoc(entry, indexDoc.path),
      });

      const { fetchWorklogEntries } = await import('../worklog');
      const result = await fetchWorklogEntries('2025-01-15', '2025-01-22');

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        summary: 'Implemented caching',
        decision: 'Used ISR with 5min TTL',
        problem: 'Too many API calls',
        tags: ['performance'],
        project: 'portfolio',
        date: '2025-01-22',
        links: { pr: 'https://github.com/example/pr/1' },
      });
    });
  });

  describe('groupByDate', () => {
    it('groups entries by date', async () => {
      const { groupByDate } = await import('../worklog');

      const entries: WorklogEntry[] = [
        createEntry({ date: '2025-01-22', summary: 'Entry 1' }),
        createEntry({ date: '2025-01-22', summary: 'Entry 2' }),
        createEntry({ date: '2025-01-21', summary: 'Entry 3' }),
      ];

      const groups = groupByDate(entries);

      expect(groups).toHaveLength(2);
      expect(groups[0].date).toBe('2025-01-22');
      expect(groups[0].entries).toHaveLength(2);
      expect(groups[1].date).toBe('2025-01-21');
      expect(groups[1].entries).toHaveLength(1);
    });

    it('sorts dates newest first', async () => {
      const { groupByDate } = await import('../worklog');

      const entries: WorklogEntry[] = [
        createEntry({ date: '2025-01-20' }),
        createEntry({ date: '2025-01-22' }),
        createEntry({ date: '2025-01-21' }),
      ];

      const groups = groupByDate(entries);

      expect(groups[0].date).toBe('2025-01-22');
      expect(groups[1].date).toBe('2025-01-21');
      expect(groups[2].date).toBe('2025-01-20');
    });

    it('caps entries per day at 5', async () => {
      const { groupByDate } = await import('../worklog');

      const entries: WorklogEntry[] = Array.from({ length: 10 }, (_, i) =>
        createEntry({ date: '2025-01-22', summary: `Entry ${i}` })
      );

      const groups = groupByDate(entries);

      expect(groups[0].entries).toHaveLength(5);
    });

    it('sorts entries by tag priority (architecture first, docs last)', async () => {
      const { groupByDate } = await import('../worklog');

      const entries: WorklogEntry[] = [
        createEntry({ date: '2025-01-22', tags: ['docs'], summary: 'Docs' }),
        createEntry({ date: '2025-01-22', tags: ['architecture'], summary: 'Architecture' }),
        createEntry({ date: '2025-01-22', tags: ['feature'], summary: 'Feature' }),
        createEntry({ date: '2025-01-22', tags: ['performance'], summary: 'Performance' }),
      ];

      const groups = groupByDate(entries);
      const summaries = groups[0].entries.map(e => e.summary);

      expect(summaries[0]).toBe('Architecture');
      expect(summaries[1]).toBe('Performance');
      expect(summaries[2]).toBe('Feature');
      expect(summaries[3]).toBe('Docs');
    });

    it('extracts unique projects for each day', async () => {
      const { groupByDate } = await import('../worklog');

      const entries: WorklogEntry[] = [
        createEntry({ date: '2025-01-22', project: 'portfolio' }),
        createEntry({ date: '2025-01-22', project: 'experiments' }),
        createEntry({ date: '2025-01-22', project: 'portfolio' }),
      ];

      const groups = groupByDate(entries);

      expect(groups[0].projects).toHaveLength(2);
      expect(groups[0].projects).toContain('portfolio');
      expect(groups[0].projects).toContain('experiments');
    });

    it('handles empty entries array', async () => {
      const { groupByDate } = await import('../worklog');

      const groups = groupByDate([]);

      expect(groups).toEqual([]);
    });
  });

  describe('formatDisplayDate', () => {
    it('formats date string for display', async () => {
      const { formatDisplayDate } = await import('../worklog');

      const result = formatDisplayDate('2025-01-22');

      // Should include weekday, month, day, year
      expect(result).toContain('Jan');
      expect(result).toContain('22');
      expect(result).toContain('2025');
    });
  });

  describe('getDateRange', () => {
    it('calculates date range from offset and range days', async () => {
      const { getDateRange } = await import('../worklog');

      // Test with 0 offset, 7 day range (last 7 days)
      const { startDate, endDate } = getDateRange(0, 7);

      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffDays = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

      expect(diffDays).toBe(7);
    });

    it('applies offset correctly', async () => {
      const { getDateRange } = await import('../worklog');

      // endDate has +1 day buffer to cover timezone differences
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const expectedEnd = tomorrow.toISOString().split('T')[0];
      const { endDate: noOffset } = getDateRange(0, 7);

      expect(noOffset).toBe(expectedEnd);

      const offsetDate = new Date();
      offsetDate.setDate(offsetDate.getDate() - 7 + 1); // -7 offset + 1 buffer
      const { endDate: withOffset } = getDateRange(7, 7);
      expect(withOffset).toBe(offsetDate.toISOString().split('T')[0]);
    });
  });

  describe('getWeeklyHighlights', () => {
    it('returns empty array for empty entries', async () => {
      const { getWeeklyHighlights } = await import('../worklog');

      const highlights = await getWeeklyHighlights([]);

      expect(highlights).toEqual([]);
    });

    it('uses fallback when AI_GATEWAY_API_KEY is not set', async () => {
      vi.stubEnv('AI_GATEWAY_API_KEY', '');

      const { getWeeklyHighlights } = await import('../worklog');

      const entries: WorklogEntry[] = [
        createEntry({
          summary: 'Entry 1',
          decision: 'Long decision text that should be prioritized',
        }),
        createEntry({
          summary: 'Entry 2',
          decision: 'Short',
        }),
        createEntry({
          summary: 'Entry 3',
          // No decision
        }),
      ];

      const highlights = await getWeeklyHighlights(entries);

      // Fallback uses entries with decisions, sorted by decision length
      expect(highlights.length).toBeGreaterThan(0);
      expect(highlights[0].text).toContain('Entry 1');
    });
  });
});

describe('worklog integration: data flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it('complete flow: fetch → group → display data', async () => {
    vi.stubEnv('MEMORY_API_URL', 'https://memory.test.com');
    vi.stubEnv('MEMORY_API_KEY', 'mem_test_key');

    const entries = [
      createEntry({
        summary: 'Implemented caching',
        decision: 'Used ISR',
        tags: ['performance'],
        project: 'portfolio',
        date: '2025-01-22',
      }),
      createEntry({
        summary: 'Added auth',
        tags: ['architecture'],
        project: 'portfolio',
        date: '2025-01-22',
      }),
      createEntry({
        summary: 'Fixed bug',
        tags: ['fix'],
        project: 'experiments',
        date: '2025-01-21',
      }),
    ];

    const indexDocs = entries.map(createIndexDoc);

    // Mock index fetch
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ documents: indexDocs }),
    });

    // Mock individual document fetches
    for (let i = 0; i < entries.length; i++) {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => createFullDoc(entries[i], indexDocs[i].path),
      });
    }

    const { fetchWorklogEntries, groupByDate, formatDisplayDate } = await import('../worklog');

    const fetched = await fetchWorklogEntries('2025-01-15', '2025-01-22');
    const groups = groupByDate(fetched);

    // Verify grouping
    expect(groups).toHaveLength(2);

    // Jan 22 group
    expect(groups[0].date).toBe('2025-01-22');
    expect(groups[0].entries[0].tags).toContain('architecture'); // Sorted first
    expect(groups[0].entries[1].tags).toContain('performance');
    expect(groups[0].projects).toContain('portfolio');

    // Jan 21 group
    expect(groups[1].date).toBe('2025-01-21');
    expect(groups[1].projects).toContain('experiments');

    // Verify date formatting
    const displayDate = formatDisplayDate(groups[0].date);
    expect(displayDate).toContain('Jan');
    expect(displayDate).toContain('22');
  });
});
