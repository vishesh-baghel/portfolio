# Next.js + Postgres Best Practices

## The Problem We Solved

### ❌ What Was Wrong (Anti-Pattern)

```typescript
// BAD: Module-level initialization
export const storage = new PostgresStore({ ... });

// BAD: Fire-and-forget async at module level
const init = async () => { await storage.init(); };
init().catch(console.error);
```

**Why this fails in Next.js:**

1. **Runs during build time** - Module code executes during `next build` when there's no database access
2. **Multiple execution contexts** - Code runs in build, dev server, serverless functions, edge runtime
3. **Race conditions** - Multiple concurrent requests trigger simultaneous initialization
4. **No error handling** - Fire-and-forget async means errors are silently swallowed
5. **Cold start timeouts** - Serverless functions timeout waiting for module-level DB connections

### ✅ What's Correct (Best Practice)

```typescript
// GOOD: Lazy initialization singleton
let storageInstance: PostgresStore | null = null;
let initPromise: Promise<PostgresStore> | null = null;

export async function getStorage(): Promise<PostgresStore> {
  if (storageInstance) return storageInstance;
  if (initPromise) return initPromise;
  
  initPromise = (async () => {
    const store = new PostgresStore({ ... });
    await store.init();
    storageInstance = store;
    return store;
  })();
  
  return initPromise;
}
```

**Why this works:**

1. **Lazy initialization** - Only connects when first API request arrives
2. **Singleton pattern** - Ensures single instance across all requests
3. **Promise caching** - Concurrent requests wait for same initialization
4. **Proper error handling** - Errors propagate to caller with context
5. **Serverless compatible** - No build-time or cold-start issues

## Next.js Execution Contexts

Understanding when your code runs is critical:

### 1. Build Time (`next build`)
```bash
pnpm build
```
- Runs all module-level code
- No network access to external services
- **Database connections will fail**
- Used for static page generation

### 2. Dev Server Startup (`next dev`)
```bash
pnpm dev
```
- Runs module-level code once
- Has network access
- Can connect to database
- But still shouldn't for performance

### 3. API Route Execution (Runtime)
```typescript
export async function POST(req) {
  // This is when you SHOULD initialize DB
  await getStorage();
  // ... use storage
}
```
- Runs on each request
- Has network access
- Proper place for DB initialization

### 4. Serverless Cold Start (Production)
- Function wakes up from sleep
- Module-level code runs
- **Timeout if DB init takes too long**
- Should use lazy initialization

## Connection Pooling Best Practices

### Development Configuration
```typescript
const storage = new PostgresStore({
  connectionString: process.env.DATABASE_URL,
  max: 5, // Small pool for dev
  connectionTimeoutMillis: 5000, // 5s timeout
  idleTimeoutMillis: 10000, // Close idle after 10s
});
```

### Production Configuration
```typescript
const storage = new PostgresStore({
  connectionString: process.env.DATABASE_URL,
  max: 20, // Larger pool for production
  connectionTimeoutMillis: 10000, // 10s timeout
  idleTimeoutMillis: 30000, // Close idle after 30s
  statement_timeout: 30000, // 30s query timeout
});
```

### Serverless Configuration (Vercel/AWS Lambda)
```typescript
const storage = new PostgresStore({
  connectionString: process.env.DATABASE_URL,
  max: 1, // Single connection per function instance
  connectionTimeoutMillis: 3000, // Fast fail
  idleTimeoutMillis: 0, // Never close (reuse across invocations)
});
```

## Supabase-Specific Configuration

### Connection String Types

Supabase provides 3 connection modes:

#### 1. Direct Connection (Port 5432)
```
postgresql://postgres:password@db.xxx.supabase.co:5432/postgres
```
- **Use for**: Local development, migrations, admin tasks
- **Don't use for**: Production API routes (no pooling)
- **Max connections**: 60 (free tier), 200+ (pro tier)

#### 2. Transaction Pooler (Port 5432)
```
postgresql://postgres.xxx:password@aws-0-region.pooler.supabase.com:5432/postgres
```
- **Use for**: Production API routes, Mastra, any app with connection pooling
- **Benefits**: Connection pooling, transaction mode, DDL support
- **Required for**: Table creation, migrations, Mastra storage

#### 3. Session Pooler (Port 6543)
```
postgresql://postgres.xxx:password@aws-0-region.pooler.supabase.com:6543/postgres
```
- **Use for**: Simple SELECT queries, read-only operations
- **Don't use for**: Mastra (can't create tables), transactions, prepared statements
- **Limitation**: No DDL (CREATE TABLE, ALTER, etc.)

### Which One for Mastra?

**✅ Transaction Pooler (Port 5432)** - Always use this for Mastra

```typescript
// Correct
PORTFOLIO_POSTGRES_URL_SIMPLE=postgresql://postgres.xxx:password@aws-0-region.pooler.supabase.com:5432/postgres

// Wrong - will cause ETIMEDOUT
PORTFOLIO_POSTGRES_URL_SIMPLE=postgresql://postgres.xxx:password@aws-0-region.pooler.supabase.com:6543/postgres
```

## Environment Variable Management

### Development (.env.local)
```bash
# Local development - use direct connection or transaction pooler
PORTFOLIO_POSTGRES_URL_SIMPLE=postgresql://postgres:password@localhost:5432/postgres
# Or Supabase transaction pooler
PORTFOLIO_POSTGRES_URL_SIMPLE=postgresql://postgres.xxx:password@aws-0-region.pooler.supabase.com:5432/postgres

PORTFOLIO_PG_SCHEMA=public
OPENAI_API_KEY=sk-...
```

### Production (Vercel Environment Variables)
```bash
# Production - always use transaction pooler
PORTFOLIO_POSTGRES_URL_SIMPLE=postgresql://postgres.xxx:password@aws-0-region.pooler.supabase.com:5432/postgres

PORTFOLIO_PG_SCHEMA=public
OPENAI_API_KEY=sk-...
```

### Testing Connection String

Before using in your app, test the connection:

```bash
# Test with psql
psql "$PORTFOLIO_POSTGRES_URL_SIMPLE" -c "SELECT version();"

# Test with Node.js
node -e "
const { Client } = require('pg');
const client = new Client({ connectionString: process.env.PORTFOLIO_POSTGRES_URL_SIMPLE });
client.connect()
  .then(() => { console.log('✅ Connected'); return client.query('SELECT NOW()'); })
  .then(res => { console.log('Time:', res.rows[0].now); client.end(); })
  .catch(err => { console.error('❌ Error:', err.message); process.exit(1); });
"
```

## Common Mistakes and Solutions

### Mistake 1: Module-Level Async Operations
```typescript
// ❌ BAD
const storage = new PostgresStore({ ... });
storage.init(); // Fire-and-forget

// ✅ GOOD
export async function getStorage() {
  // Initialize on first call
}
```

### Mistake 2: No Singleton Pattern
```typescript
// ❌ BAD - Creates new instance every time
export function getStorage() {
  return new PostgresStore({ ... });
}

// ✅ GOOD - Reuses same instance
let instance = null;
export async function getStorage() {
  if (!instance) {
    instance = new PostgresStore({ ... });
    await instance.init();
  }
  return instance;
}
```

### Mistake 3: No Promise Caching
```typescript
// ❌ BAD - Concurrent calls create multiple instances
let instance = null;
export async function getStorage() {
  if (!instance) {
    instance = new PostgresStore({ ... });
    await instance.init(); // Multiple calls = multiple inits
  }
  return instance;
}

// ✅ GOOD - Concurrent calls wait for same promise
let instance = null;
let initPromise = null;
export async function getStorage() {
  if (instance) return instance;
  if (initPromise) return initPromise; // Wait for ongoing init
  
  initPromise = (async () => {
    const store = new PostgresStore({ ... });
    await store.init();
    instance = store;
    return store;
  })();
  
  return initPromise;
}
```

### Mistake 4: Wrong Supabase Connection String
```typescript
// ❌ BAD - Session pooler (port 6543)
postgresql://postgres.xxx:password@aws-0-region.pooler.supabase.com:6543/postgres

// ✅ GOOD - Transaction pooler (port 5432)
postgresql://postgres.xxx:password@aws-0-region.pooler.supabase.com:5432/postgres
```

### Mistake 5: No Error Context
```typescript
// ❌ BAD - Generic error
throw error;

// ✅ GOOD - Helpful error message
throw new Error(
  `Failed to connect to Postgres. Check PORTFOLIO_POSTGRES_URL_SIMPLE. ` +
  `For Supabase, use Transaction pooler (port 5432). ` +
  `Original error: ${error.message}`
);
```

## Debugging Connection Issues

### Step 1: Verify Environment Variable
```bash
# Check if variable is set
echo $PORTFOLIO_POSTGRES_URL_SIMPLE

# Should output something like:
# postgresql://postgres.xxx:password@aws-0-region.pooler.supabase.com:5432/postgres
```

### Step 2: Test Direct Connection
```bash
psql "$PORTFOLIO_POSTGRES_URL_SIMPLE" -c "SELECT 1;"
```

### Step 3: Check Supabase Dashboard
1. Go to Supabase Dashboard
2. Project Settings → Database
3. Check "Connection string" section
4. Verify you're using **Transaction** mode (port 5432)

### Step 4: Check Connection Limits
```sql
-- Check current connections
SELECT count(*) FROM pg_stat_activity;

-- Check max connections
SHOW max_connections;

-- Check connections by database
SELECT datname, count(*) 
FROM pg_stat_activity 
GROUP BY datname;
```

### Step 5: Enable Debug Logging
```typescript
const storage = new PostgresStore({
  connectionString: process.env.PORTFOLIO_POSTGRES_URL_SIMPLE,
  // Add debug logging
  onConnect: () => console.log('🔗 Connected to Postgres'),
  onDisconnect: () => console.log('🔌 Disconnected from Postgres'),
});
```

## Performance Optimization

### 1. Connection Reuse
```typescript
// Reuse connections across requests (already implemented)
let storageInstance: PostgresStore | null = null;
```

### 2. Query Optimization
```typescript
// Use indexes for common queries
await storage.createIndex({
  name: 'idx_messages_thread_created',
  table: 'mastra_messages',
  columns: ['thread_id', 'createdAt DESC']
});
```

### 3. Connection Pool Sizing
```typescript
// Formula: (number of serverless instances) * (connections per instance)
// Example: 10 instances * 2 connections = 20 max pool size
max: Math.min(20, parseInt(process.env.MAX_POOL_SIZE || '20'))
```

### 4. Timeout Configuration
```typescript
// Fast fail for better UX
connectionTimeoutMillis: 5000, // Fail fast if can't connect
statement_timeout: 30000, // Kill slow queries
```

## Summary

### ✅ Do This
1. Use lazy initialization (initialize on first request)
2. Implement singleton pattern with promise caching
3. Use Supabase Transaction pooler (port 5432)
4. Configure appropriate connection pool sizes
5. Add helpful error messages
6. Test connection string before deploying

### ❌ Don't Do This
1. Initialize database at module level
2. Use fire-and-forget async operations
3. Use Supabase Session pooler (port 6543) with Mastra
4. Create new instances on every request
5. Ignore connection pool configuration
6. Deploy without testing connection string

### Key Takeaway
**In Next.js serverless environments, always use lazy initialization for database connections, never module-level initialization.**
