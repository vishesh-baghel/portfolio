# Fixing Postgres ETIMEDOUT Errors with Mastra

## The Error

```
Error: MASTRA_STORAGE_POSTGRES_STORE_INIT_FAILED
  cause: MASTRA_STORAGE_PG_STORE_CREATE_TABLE_FAILED
    tableName: 'mastra_workflow_snapshot'
    cause: AggregateError { code: 'ETIMEDOUT' }
```

## Root Causes

### 1. **Wrong Supabase Connection String** (Most Common)
Supabase provides two types of connection poolers:
- ❌ **Session pooler** (port 6543) - NOT compatible with Mastra
- ✅ **Transaction pooler** (port 5432) - Required for Mastra

**Why?** Mastra's PostgresStore uses `pg-promise` which requires transaction-mode connections for table creation and migrations.

### 2. **Storage Initialized on Every Request**
The storage was being initialized on every API call, causing:
- Multiple concurrent table creation attempts
- Connection pool exhaustion
- Timeout errors

### 3. **Missing Connection Pool Configuration**
Without proper pooling settings, connections can:
- Time out waiting for available connections
- Fail to handle concurrent requests
- Exhaust database connection limits

## What Was Fixed

### 1. Added Connection Pool Configuration
**File**: `src/mastra/storage.ts`

```typescript
export const storage = new PostgresStore({
  connectionString: process.env.PORTFOLIO_POSTGRES_URL_SIMPLE,
  schemaName: process.env.PORTFOLIO_PG_SCHEMA,
  // Connection pool configuration
  max: 20, // Maximum connections in pool
  connectionTimeoutMillis: 10000, // 10 second timeout
  idleTimeoutMillis: 30000, // Close idle connections after 30s
});
```

### 2. Single Storage Initialization
**File**: `src/mastra/storage.ts`

```typescript
// Initialize storage once at module load
let storageInitialized = false;
const initializeStorage = async () => {
  if (!storageInitialized) {
    try {
      await storage.init();
      storageInitialized = true;
      console.log('✅ Mastra storage initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Mastra storage:', error);
    }
  }
};

// Initialize asynchronously (non-blocking)
initializeStorage().catch(console.error);
```

### 3. Updated Environment Variable Documentation
**File**: `.env.example`

Added clear instructions for Supabase users to use the Transaction pooler connection string.

## How to Fix Your Setup

### Step 1: Get the Correct Supabase Connection String

1. Go to your Supabase Dashboard
2. Navigate to: **Project Settings → Database**
3. Scroll to **Connection string** section
4. Select **Transaction** mode (NOT Session mode)
5. Copy the connection string

**Format**:
```
postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres
```

**Example**:
```
postgresql://postgres.abcdefghijklmnop:your-password@aws-0-us-west-1.pooler.supabase.com:5432/postgres
```

### Step 2: Update Your `.env` File

```bash
# Use the Transaction pooler connection string (port 5432)
PORTFOLIO_POSTGRES_URL_SIMPLE=postgresql://postgres.your-project:your-password@aws-0-region.pooler.supabase.com:5432/postgres

# Optional: specify custom schema
PORTFOLIO_PG_SCHEMA=public
```

### Step 3: Verify Connection

Test your connection string:

```bash
# Using psql
psql "postgresql://postgres.your-project:your-password@aws-0-region.pooler.supabase.com:5432/postgres"

# Or using Node.js
node -e "const { Client } = require('pg'); const client = new Client({ connectionString: process.env.PORTFOLIO_POSTGRES_URL_SIMPLE }); client.connect().then(() => { console.log('✅ Connected'); client.end(); }).catch(console.error);"
```

### Step 4: Restart Your Dev Server

```bash
# Kill existing process
# Then restart
pnpm dev
```

You should see:
```
✅ Mastra storage initialized successfully
```

## Troubleshooting

### Error: Still Getting ETIMEDOUT

**Check 1: Verify Connection String Format**
```bash
echo $PORTFOLIO_POSTGRES_URL_SIMPLE
# Should show: postgresql://postgres.xxx:password@xxx.pooler.supabase.com:5432/postgres
# Port MUST be 5432 (Transaction mode)
```

**Check 2: Test Direct Connection**
```bash
psql "$PORTFOLIO_POSTGRES_URL_SIMPLE" -c "SELECT version();"
```

**Check 3: Check Supabase Connection Limits**
- Go to Supabase Dashboard → Database → Connection pooling
- Ensure you haven't exceeded connection limits
- Free tier: 60 connections
- Pro tier: 200+ connections

**Check 4: Network/Firewall Issues**
```bash
# Test if you can reach Supabase
ping aws-0-us-west-1.pooler.supabase.com

# Test port connectivity
nc -zv aws-0-us-west-1.pooler.supabase.com 5432
```

### Error: "relation does not exist"

This means tables weren't created. Check:

1. **Schema permissions**: Ensure your database user has CREATE TABLE permissions
2. **Schema name**: If using custom schema, ensure it exists:
   ```sql
   CREATE SCHEMA IF NOT EXISTS your_schema;
   ```

### Error: "duplicate key value violates unique constraint"

This happens if storage.init() runs multiple times concurrently. The fix in `src/mastra/storage.ts` prevents this with the `storageInitialized` flag.

### Error: "too many connections"

You've exceeded Supabase connection limits:

**Solution 1**: Reduce pool size
```typescript
export const storage = new PostgresStore({
  connectionString: process.env.PORTFOLIO_POSTGRES_URL_SIMPLE,
  max: 10, // Reduce from 20 to 10
});
```

**Solution 2**: Use Supabase connection pooler (you should already be using this)

**Solution 3**: Upgrade your Supabase plan

## Connection String Comparison

### ❌ Wrong (Session Pooler - Port 6543)
```
postgresql://postgres.xxx:password@xxx.pooler.supabase.com:6543/postgres
```
**Issues**:
- Doesn't support transaction-mode operations
- Can't create tables
- Causes ETIMEDOUT errors

### ✅ Correct (Transaction Pooler - Port 5432)
```
postgresql://postgres.xxx:password@xxx.pooler.supabase.com:5432/postgres
```
**Benefits**:
- Supports all Postgres operations
- Can create/modify tables
- Works with Mastra's pg-promise

### 🔧 Direct Connection (No Pooler - Port 5432)
```
postgresql://postgres:password@db.xxx.supabase.co:5432/postgres
```
**When to use**:
- Local development
- Database migrations
- Direct admin access

**Not recommended for**:
- Production API routes (no pooling)
- High-traffic applications

## Verifying the Fix

### 1. Check Server Logs
```bash
pnpm dev
```

Look for:
```
✅ Mastra storage initialized successfully
```

### 2. Check Supabase Dashboard
1. Go to **Table Editor**
2. You should see these tables:
   - `mastra_threads`
   - `mastra_messages`
   - `mastra_workflow_snapshot`
   - `mastra_resources`
   - `mastra_traces`
   - `mastra_evals`
   - `mastra_scorers`
   - Plus pgvector tables

### 3. Test API Endpoint
```bash
curl -X POST http://localhost:3000/api/portfolio-agent \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello", "userId": "test-user-1"}'
```

Should return streaming response without errors.

### 4. Verify Message Persistence
```sql
-- Check threads
SELECT * FROM mastra_threads ORDER BY "createdAt" DESC LIMIT 5;

-- Check messages
SELECT * FROM mastra_messages ORDER BY "createdAt" DESC LIMIT 10;
```

## Performance Optimization

### For Development
```typescript
export const storage = new PostgresStore({
  connectionString: process.env.PORTFOLIO_POSTGRES_URL_SIMPLE,
  max: 5, // Smaller pool for dev
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 10000,
});
```

### For Production
```typescript
export const storage = new PostgresStore({
  connectionString: process.env.PORTFOLIO_POSTGRES_URL_SIMPLE,
  max: 20, // Larger pool for production
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
  // Optional: add statement timeout
  statement_timeout: 30000, // 30 second query timeout
});
```

## Summary

✅ **Fixed**: Added connection pool configuration  
✅ **Fixed**: Single storage initialization at module load  
✅ **Fixed**: Proper error handling and logging  
✅ **Documented**: Correct Supabase connection string format  
✅ **Documented**: Transaction vs Session pooler differences  

**Key Takeaway**: Always use Supabase's **Transaction pooler** (port 5432) with Mastra, not the Session pooler (port 6543).
