# Vercel Deployment Guide

## Overview

This portfolio uses LibSQL for storage, which requires special handling on Vercel due to filesystem constraints.

## Vercel Filesystem Constraints

### Build Time
- **Read-only filesystem**: Cannot write files during `next build`
- **Solution**: Use in-memory database (`file::memory:?cache=shared`)

### Runtime
- **Writable `/tmp` only**: Only `/tmp` directory is writable in serverless functions
- **Ephemeral per-instance**: Each function instance has its own `/tmp`
- **Persists during warm starts**: Database survives across requests in the same instance
- **Lost on cold starts**: Database is recreated when function instance is recycled

## Storage Configuration

The storage automatically detects the environment and uses the appropriate database:

```typescript
const getDbPath = () => {
  // Allow override via environment variable
  if (process.env.MASTRA_DB_FILE) {
    return process.env.MASTRA_DB_FILE;
  }
  
  // Vercel: Use /tmp for writable filesystem, or in-memory during build
  if (process.env.VERCEL === '1') {
    const isBuild = process.env.NEXT_PHASE === 'phase-production-build';
    return isBuild ? 'file::memory:?cache=shared' : 'file:/tmp/mastra-prod.sqlite';
  }
  
  // Local development: use .mastra directory
  return 'file:.mastra/db.sqlite';
};
```

## Environment Variables

Set these in Vercel Dashboard → Project Settings → Environment Variables:

### Required
```bash
OPENAI_API_KEY=sk-your-openai-api-key
```

### Optional (for Turso persistent storage)
```bash
MASTRA_DB_FILE=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your-auth-token
```

## Database Persistence Behavior

### With Default Configuration (File-based)

**Scenario 1: Warm Start**
```
Request 1 → Function Instance A → Creates /tmp/mastra-prod.sqlite
Request 2 → Function Instance A → Uses existing database ✅
Request 3 → Function Instance A → Uses existing database ✅
```

**Scenario 2: Cold Start**
```
Request 1 → Function Instance A → Creates /tmp/mastra-prod.sqlite
[Instance A recycled]
Request 2 → Function Instance B → Creates NEW /tmp/mastra-prod.sqlite ❌
```

**Scenario 3: Multiple Instances**
```
Request 1 → Function Instance A → Creates /tmp/mastra-prod.sqlite
Request 2 → Function Instance B → Creates SEPARATE /tmp/mastra-prod.sqlite ❌
```

### With Turso (Persistent Cloud Storage)

All function instances share the same database:
```
Request 1 → Function Instance A → Connects to Turso
Request 2 → Function Instance B → Connects to same Turso database ✅
Request 3 → Function Instance A → Connects to same Turso database ✅
```

## When to Use Turso

Use Turso if you need:
- ✅ Persistent conversation history across deployments
- ✅ Shared database across all function instances
- ✅ Long-term memory for the agent

Stick with file-based if:
- ✅ Conversation history within a session is sufficient
- ✅ You want zero external dependencies
- ✅ Simplicity is more important than persistence

## Setting Up Turso (Optional)

### 1. Install Turso CLI
```bash
curl -sSfL https://get.tur.so/install.sh | bash
```

### 2. Create Database
```bash
turso db create portfolio-mastra
```

### 3. Get Connection Details
```bash
# Get database URL
turso db show portfolio-mastra --url

# Create auth token
turso db tokens create portfolio-mastra
```

### 4. Configure Vercel Environment Variables
```bash
MASTRA_DB_FILE=libsql://your-db-name.turso.io
TURSO_AUTH_TOKEN=your-auth-token
```

### 5. Update Storage Configuration
```typescript
export const storage = new LibSQLStore({
  url: process.env.MASTRA_DB_FILE!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});
```

## Build Logs Explained

### Successful Build
```bash
✓ Compiled successfully
Linting and checking validity of types ...
Collecting page data ...
📁 Using Mastra database: file::memory:?cache=shared  # ← In-memory during build
✓ Compiled successfully
```

### Runtime Logs
```bash
📁 Using Mastra database: file:/tmp/mastra-prod.sqlite  # ← File-based at runtime
🔄 Initializing Mastra LibSQL storage...
✅ Mastra LibSQL storage initialized successfully
```

## Troubleshooting

### Error: "Unable to open connection to local database .mastra/prod.sqlite"
**Cause**: Trying to write to read-only filesystem during build
**Solution**: Already fixed - uses in-memory database during build

### Database resets between requests
**Cause**: Cold starts or multiple function instances
**Solution**: Either accept this behavior or use Turso for persistence

### "ENOENT: no such file or directory, open '/tmp/mastra-prod.sqlite'"
**Cause**: Database file doesn't exist yet
**Solution**: Already handled - `storage.init()` creates the file automatically

## Performance Considerations

### File-based (Default)
- ✅ Fast: No network latency
- ✅ Free: No external service costs
- ❌ Ephemeral: Lost on cold starts
- ❌ Per-instance: Not shared across functions

### Turso
- ✅ Persistent: Survives deployments
- ✅ Shared: All instances use same database
- ❌ Network latency: ~50-100ms per query
- ❌ Cost: Free tier available, paid plans for scale

## Deployment Checklist

- [ ] Set `OPENAI_API_KEY` in Vercel environment variables
- [ ] (Optional) Set up Turso if you need persistent storage
- [ ] Deploy to Vercel
- [ ] Test the portfolio agent
- [ ] Verify database initialization in logs

## Related Documentation

- [STORAGE_SETUP.md](./STORAGE_SETUP.md) - Complete LibSQL storage guide
- [Vercel Filesystem Docs](https://vercel.com/docs/functions/runtimes#filesystem)
- [Turso Documentation](https://docs.turso.tech/)
