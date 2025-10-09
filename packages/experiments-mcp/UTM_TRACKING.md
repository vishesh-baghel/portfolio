# UTM Tracking Implementation

## Overview

The experiments MCP server now includes comprehensive UTM parameter tracking to measure CTA performance and traffic sources.

## UTM Parameters Structure

All experiments links include the following UTM parameters:

```
utm_source=mcp
utm_medium=experiments
utm_campaign={experiment_category}
utm_content={cta_id}
```

### Parameter Breakdown

- **utm_source**: `mcp` - Identifies traffic from the MCP server
- **utm_medium**: `experiments` - Specifies the experiments tool
- **utm_campaign**: Dynamic, based on experiment category:
  - `getting-started`
  - `ai-agents`
  - `backend-database`
  - `typescript-patterns`
- **utm_content**: Rotating CTA ID (see below)

## Rotating CTA IDs

Each experiment shows one of 5 rotating help reasons, selected deterministically based on the experiment slug:

| CTA ID | Help Reason Text |
|--------|------------------|
| `adapt` | Need a hand adapting this pattern? |
| `custom` | Want help customizing this for your stack? |
| `stuck` | Hit a snag implementing this? |
| `integrate` | Need help integrating this into your project? |
| `review` | Want a second pair of eyes on your implementation? |

The CTA is selected using a hash of the experiment slug, ensuring:
- Same experiment always shows the same CTA (consistency)
- Different experiments show different CTAs (variety)
- Roughly equal distribution across all CTAs

## Calendar Link Tracking

Calendar links include the CTA ID as a query parameter:

```
https://calendar.app.google/cHQgyAoBcQxDCFQn9&cta={cta_id}
```

This allows tracking which help reason drove the booking.

## Example URLs

### Experiments Link
```
https://visheshbaghel.com/experiments?utm_source=mcp&utm_medium=experiments&utm_campaign=ai-agents&utm_content=adapt
```

### Calendar Link
```
https://calendar.app.google/cHQgyAoBcQxDCFQn9&cta=adapt
```

## Vercel Analytics Integration

**Does Vercel automatically track UTM parameters?**

**Yes**, Vercel Analytics automatically captures and tracks UTM parameters when they're present in the URL. You can view this data in:

1. **Vercel Dashboard** → Your Project → Analytics
2. **Traffic Sources** section will show:
   - Source (`mcp`)
   - Medium (`experiments`)
   - Campaign (experiment categories)
   - Content (CTA IDs)

### Viewing UTM Data in Vercel

Navigate to: `https://vercel.com/[your-team]/[project-name]/analytics`

Look for:
- **Top Sources**: Will show `mcp` as a traffic source
- **Top Campaigns**: Will show experiment categories
- **Custom Events**: Can be set up to track specific conversions

### Additional Tracking (Optional)

For more detailed tracking, you can:

1. **Add Vercel Web Analytics events**:
```typescript
// In your Next.js app
import { track } from '@vercel/analytics';

track('experiment_view', {
  source: 'mcp',
  campaign: category,
  content: ctaId
});
```

2. **Use Google Analytics** (if integrated):
   - UTM parameters are automatically captured
   - View in GA4 under Acquisition → Traffic acquisition

3. **Custom tracking endpoint**:
   - Create an API route to log UTM parameters
   - Store in database for custom analysis

## Measuring CTA Performance

To determine which CTAs are most effective:

1. **In Vercel Analytics**:
   - Filter by `utm_content` to see which CTA IDs drive the most traffic
   - Compare conversion rates across different `utm_content` values

2. **In Google Calendar**:
   - Check the `cta` parameter in booking URLs
   - Manually track which CTAs lead to actual bookings

3. **Recommended metrics**:
   - Click-through rate per CTA
   - Booking rate per CTA
   - Time from click to booking per CTA

## Testing

To test UTM tracking:

1. Use the MCP server to fetch an experiment
2. Click the "Browse similar patterns" link
3. Check the URL in your browser - should include all UTM parameters
4. Visit Vercel Analytics after a few minutes to see the tracked visit

## Future Enhancements

Consider adding:
- A/B testing different CTA wordings
- Time-based CTA rotation (e.g., different CTAs for weekday vs weekend)
- User segment-based CTAs (e.g., different for first-time vs returning users)
- Conversion tracking when users book consultations
- Dashboard to visualize CTA performance

---

**Last Updated**: 2025-10-09  
**Status**: ✅ Active
