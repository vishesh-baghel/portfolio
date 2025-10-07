# Testing Tools in Mastra Playground

## Setup

The tools are now using `createTool` from `@mastra/core/tools`, making them compatible with both:
1. **MCP Server** (for IDE integration)
2. **Mastra Playground** (for direct testing)

## Start Mastra Playground

From the MCP package directory:

```bash
cd /home/vishesh.baghel/Documents/workspace/portfolio/packages/experiments-mcp
pnpm mastra dev
```

Or from the root:

```bash
cd /home/vishesh.baghel/Documents/workspace/portfolio
pnpm --filter @vishesh/experiments mastra dev
```

This will start the Mastra playground at `http://localhost:3456`

## Available Tools

### 1. listExperiments

**Description**: Browse all available integration patterns

**Test Cases**:

```json
// List all experiments
{
  "category": "all"
}

// List only AI agent experiments
{
  "category": "ai-agents"
}

// List getting started experiments
{
  "category": "getting-started"
}

// List backend/database experiments
{
  "category": "backend-database"
}

// List TypeScript patterns
{
  "category": "typescript-patterns"
}
```

**Expected Output**: Categorized list with titles, descriptions, and tags

---

### 2. getExperiment

**Description**: Fetch complete experiment with code and attribution

**Test Cases**:

```json
// Get AI agents experiment
{
  "slug": "ai-agents-with-openai",
  "includeMetadata": true
}

// Get Mastra experiment
{
  "slug": "getting-started-with-mastra",
  "includeMetadata": true
}

// Get Next.js experiment
{
  "slug": "building-with-nextjs-15",
  "includeMetadata": false
}

// Get PostgreSQL experiment
{
  "slug": "postgresql-optimization"
}

// Get TypeScript experiment
{
  "slug": "typescript-advanced-patterns"
}

// Test error handling (invalid slug)
{
  "slug": "nonexistent-experiment"
}
```

**Expected Output**: 
- Full markdown content with code examples
- Attribution block at the end with:
  - Author info
  - OSS project (if available)
  - PR link (if available)
  - Calendly booking link
  - Endorsement quote

---

### 3. searchExperiments

**Description**: Search experiments by keywords

**Test Cases**:

```json
// Search for Mastra
{
  "query": "mastra",
  "maxResults": 5
}

// Search for database patterns
{
  "query": "database postgresql",
  "maxResults": 3
}

// Search for AI agents
{
  "query": "ai agents openai",
  "maxResults": 5
}

// Search for TypeScript
{
  "query": "typescript patterns",
  "maxResults": 5
}

// Search for Next.js
{
  "query": "nextjs react",
  "maxResults": 5
}

// Search with category filter
{
  "query": "integration",
  "maxResults": 5,
  "categories": ["ai-agents", "backend-database"]
}

// Search with no results
{
  "query": "nonexistent technology xyz"
}
```

**Expected Output**:
- Ranked list of experiments
- Relevance scores (0-100%)
- Matched terms highlighted
- Excerpts showing context
- Instructions to use getExperiment for full content

---

## Verification Checklist

### ✅ listExperiments
- [ ] Returns all 5 experiments when category is "all"
- [ ] Filters correctly by category
- [ ] Shows titles and descriptions
- [ ] Includes tags for each experiment
- [ ] Provides helpful instructions at the end

### ✅ getExperiment
- [ ] Returns full content with code examples
- [ ] Attribution block appears at the end
- [ ] Calendly link is correct
- [ ] OSS project shown (for Mastra experiment)
- [ ] Helpful error for invalid slug
- [ ] Metadata included when requested

### ✅ searchExperiments
- [ ] Returns relevant results
- [ ] Relevance scores make sense
- [ ] Matched terms are accurate
- [ ] Excerpts show context
- [ ] Handles no results gracefully
- [ ] Category filtering works

---

## Expected Performance

- **listExperiments**: < 100ms (first call), < 10ms (cached)
- **getExperiment**: < 50ms (first call), < 5ms (cached)
- **searchExperiments**: < 200ms (first call), < 20ms (cached)

---

## Debugging

If tools don't work in playground:

1. **Check build**: `pnpm run build` in mcp package dir
2. **Check mastra.config.ts**: Verify tools are exported
3. **Check imports**: Ensure `.js` extensions in imports
4. **Check logs**: Playground shows errors in console

---

## Tool Signatures

All tools follow Mastra's `createTool` pattern:

```typescript
createTool({
  id: 'toolName',
  description: 'What it does',
  inputSchema: ZodSchema,
  execute: async ({ context }) => {
    // Tool logic
    return result;
  },
})
```

This makes them:
- ✅ Type-safe with Zod validation
- ✅ Compatible with MCP protocol
- ✅ Testable in Mastra playground
- ✅ Usable in Mastra agents

---

## Next Steps After Testing

Once all tools work in playground:

1. **Test in MCP** (Cursor/Windsurf)
2. **Add unit tests** with vitest
3. **Optimize performance** if needed
4. **Publish to npm** when ready

---

*Guide created: 2025-01-07*  
*Status: Ready for playground testing*
