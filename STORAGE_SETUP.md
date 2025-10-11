# Mastra Storage Setup - LibSQL

## Overview

This portfolio uses **LibSQL** (SQLite-based) for Mastra agent storage. This is a simple, file-based solution that works perfectly for a personal portfolio agent without the overhead of a full Postgres database.

## Storage Configuration

### Database Files

The storage automatically uses different database files based on the environment:

- **Local Development**: `file:.mastra/db.sqlite`
- **Vercel Build**: `file::memory:?cache=shared` (in-memory, read-only filesystem)
- **Vercel Runtime**: `file:/tmp/mastra-prod.sqlite` (writable `/tmp` directory)

The `.mastra` directory is gitignored and will be created automatically in local development. On Vercel, the `/tmp` directory is used because it's the only writable location in serverless functions.

### Environment Variables

#### Optional Configuration

You can override the default database file path:

```bash
# .env.local
MASTRA_DB_FILE=file:.mastra/custom.sqlite
```

#### Required Variables

```bash
# .env.local
OPENAI_API_KEY=sk-your-openai-api-key
```

## How It Works

### Storage Implementation

**File**: `src/mastra/storage.ts`

```typescript
import { LibSQLStore } from "@mastra/libsql";

// Automatically selects db file based on environment
const getDbPath = () => {
  if (process.env.MASTRA_DB_FILE) return process.env.MASTRA_DB_FILE;
  
  // Vercel: in-memory during build, /tmp at runtime
  if (process.env.VERCEL === '1') {
    const isBuild = process.env.NEXT_PHASE === 'phase-production-build';
    return isBuild ? 'file::memory:?cache=shared' : 'file:/tmp/mastra-prod.sqlite';
  }
  
  // Local dev: .mastra directory
  return 'file:.mastra/db.sqlite';
};

export const storage = new LibSQLStore({ url: getDbPath() });
```

### Lazy Initialization

Storage is initialized lazily on first use to follow Next.js serverless best practices:

```typescript
export async function getStorage() {
  if (!isInitialized) {
    await storage.init();
    isInitialized = true;
  }
  return storage;
}
```

### Memory Configuration

The portfolio agent uses **FastEmbed** for local embeddings (no API calls) and keeps the last 10 messages in context:

```typescript
export const portfolioMemory = new Memory({
  embedder: fastembed,
  options: {
    lastMessages: 10,
  },
  processors: [new TokenLimiter(120000)],
});
```

**Note**: LibSQL doesn't support vector search like Postgres pgvector, so semantic recall is disabled. The agent relies on the last N messages for context, which is sufficient for a simple portfolio agent.

## Local Development

### Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Create `.env.local`:
   ```bash
   OPENAI_API_KEY=sk-your-openai-api-key
   ```

4. Run the dev server:
   ```bash
   pnpm dev
   ```

The database file will be created automatically at `.mastra/db.sqlite` on first run.

### Viewing the Database

You can inspect the SQLite database using any SQLite client:

```bash
# Using sqlite3 CLI
sqlite3 .mastra/db.sqlite

# View tables
.tables

# View threads
SELECT * FROM mastra_threads;
```

## Production Deployment (Vercel)

### Environment Variables

Set in Vercel Dashboard → Project Settings → Environment Variables:

```bash
OPENAI_API_KEY=sk-your-openai-api-key
```

### Database Persistence on Vercel

**Important**: On Vercel, the `/tmp` filesystem is ephemeral and has specific characteristics:

1. **Per-function instance**: Each serverless function instance has its own `/tmp` directory
2. **Survives across requests**: Within the same function instance (warm start), the database persists
3. **Lost on cold start**: When a function instance is recycled, the database is recreated
4. **Not shared**: Different function instances don't share the same database file

This is acceptable for a portfolio agent because:
- Conversation history within a session is preserved (warm starts)
- The agent is stateless and doesn't rely on long-term memory
- Simplicity > complexity for a personal portfolio

If you need persistent storage across all instances, consider:
- Using Turso (LibSQL cloud service) - see below
- Using a managed database (but this defeats the simplicity goal)

### Using Turso (Optional)

For persistent storage in production, you can use Turso:

1. Create a Turso database:
   ```bash
   turso db create portfolio-mastra
   turso db show portfolio-mastra
   ```

2. Get the connection URL and auth token:
   ```bash
   turso db show portfolio-mastra --url
   turso db tokens create portfolio-mastra
   ```

3. Set environment variables in Vercel:
   ```bash
   MASTRA_DB_FILE=libsql://your-db.turso.io
   TURSO_AUTH_TOKEN=your-auth-token
   ```

4. Update `src/mastra/storage.ts`:
   ```typescript
   export const storage = new LibSQLStore({
     url: process.env.MASTRA_DB_FILE!,
     authToken: process.env.TURSO_AUTH_TOKEN,
   });
   ```

## Troubleshooting

### Database locked error

If you see "database is locked" errors in development:

```bash
# Stop all dev servers
# Delete the database file
rm -rf .mastra/db.sqlite*

# Restart dev server
pnpm dev
```

### Tables not created

The storage automatically creates tables on first initialization. If tables are missing:

```typescript
// Force re-initialization
await storage.init();
```

### Migration from Postgres

If you previously used Postgres, the migration is automatic:

1. Remove old environment variables from `.env.local`:
   - `PORTFOLIO_POSTGRES_URL_SIMPLE`
   - `PORTFOLIO_PG_SCHEMA`

2. The new LibSQL storage will create fresh tables automatically

3. Old conversation history is not migrated (by design - fresh start)

## Why LibSQL Instead of Postgres?

For a simple portfolio agent:

✅ **Pros of LibSQL**:
- Zero configuration - just works
- No external database service needed
- Perfect for development
- Fast local queries
- No connection pooling issues
- No network latency

❌ **Cons of LibSQL**:
- No vector search (semantic recall disabled)
- Ephemeral on Vercel (unless using Turso)
- Not suitable for multi-user apps

For a personal portfolio agent, the simplicity of LibSQL far outweighs the benefits of Postgres.

## Related Documentation

- [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) - Vercel-specific deployment guide
- [Mastra Memory Docs](https://mastra.ai/en/docs/memory/overview)
- [Mastra LibSQL Storage](https://mastra.ai/en/docs/reference/storage/libsql)
- [LibSQL Documentation](https://github.com/tursodatabase/libsql)
- [Memory Processors](https://mastra.ai/en/docs/memory/memory-processors)
