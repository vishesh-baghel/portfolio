import { fetchWorklogEntries, groupByDate, getDateRange } from '@/lib/worklog';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const offset = parseInt(searchParams.get('offset') || '0');
  const limit = parseInt(searchParams.get('limit') || '14');

  const { startDate, endDate } = getDateRange(offset, limit);
  const entries = await fetchWorklogEntries(startDate, endDate);
  const groups = groupByDate(entries);

  return Response.json({
    groups,
    hasMore: groups.length > 0,
  });
}
