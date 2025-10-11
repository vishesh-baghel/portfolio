# Message Persistence Guide for Mastra Agents

## The Problem

You noticed that Mastra created 8 tables in your Supabase database, but messages and threads weren't being stored. This is because **Mastra requires explicit `thread` and `resource` identifiers** to persist conversations.

## How Mastra Memory Works

### Key Concepts

1. **Thread**: A unique conversation identifier (e.g., `thread-user123-1234567890`)
   - Must be globally unique across all resources
   - Represents a single conversation session
   - Used to group related messages together

2. **Resource**: The user/entity that owns the thread (e.g., `user-123`, `org-456`)
   - Typically maps to your authenticated user ID
   - Enables resource-scoped memory (recall across all user's threads)
   - Required for semantic recall and working memory

### Critical Rule

> **Messages are NOT automatically persisted unless you provide both `thread` and `resource` in the `generate()` or `stream()` call.**

Even with memory configured on the agent, without these identifiers, Mastra will:
- ✅ Still use conversation history (in-memory for that request)
- ❌ NOT save messages to the database
- ❌ NOT enable semantic recall
- ❌ NOT persist working memory

## What Was Fixed

### Before (No Persistence)
```typescript
// ❌ Messages not saved - missing thread and resource
const agentStream = await agent.stream([
  { role: 'user', content: message }
]);
```

### After (With Persistence)
```typescript
// ✅ Messages saved to database
const agentStream = await agent.stream([
  { role: 'user', content: message }
], {
  memory: {
    thread: conversationThreadId,  // Required
    resource: resourceId,           // Required
  },
});
```

## Implementation Details

### API Route Changes (`src/app/api/portfolio-agent/route.ts`)

**1. Accept thread and user IDs from client:**
```typescript
const { message, threadId, userId } = await request.json();
```

**2. Generate IDs if not provided:**
```typescript
// In production, get userId from auth session
const resourceId = userId || `user-${Date.now()}`;
const conversationThreadId = threadId || `thread-${resourceId}-${Date.now()}`;
```

**3. Pass to agent.stream():**
```typescript
const agentStream = await agent.stream([
  { role: 'user', content: message }
], {
  memory: {
    thread: conversationThreadId,
    resource: resourceId,
  },
});
```

**4. Return IDs to client for conversation continuity:**
```typescript
const completion = `data: ${JSON.stringify({ 
  type: 'done',
  threadId: conversationThreadId,
  resourceId: resourceId,
  timestamp: new Date().toISOString()
})}\n\n`;
```

## Client-Side Integration

### First Message (New Conversation)
```typescript
// Client sends initial message without threadId
const response = await fetch('/api/portfolio-agent', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'Hello!',
    userId: currentUser.id, // From your auth system
  }),
});

// Parse SSE stream and extract threadId from completion event
// Store threadId in state for subsequent messages
```

### Follow-up Messages (Same Conversation)
```typescript
// Client sends threadId to continue conversation
const response = await fetch('/api/portfolio-agent', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'Tell me more',
    threadId: storedThreadId,  // Reuse from previous response
    userId: currentUser.id,
  }),
});
```

## Database Tables Created by Mastra

When you configure Mastra with Postgres storage, it creates these tables:

1. **`threads`** - Conversation threads
   - `id`: Thread identifier
   - `resource_id`: User/resource identifier
   - `title`: Auto-generated or custom title
   - `metadata`: Custom thread metadata
   - `created_at`, `updated_at`

2. **`messages`** - Individual messages
   - `id`: Message identifier
   - `thread_id`: Foreign key to threads
   - `role`: 'user', 'assistant', 'system', 'tool'
   - `content`: Message content
   - `metadata`: Custom message metadata
   - `created_at`

3. **`working_memory`** - Persistent user preferences/data
   - `id`: Memory identifier
   - `thread_id` or `resource_id`: Scope identifier
   - `content`: Markdown or structured data
   - `created_at`, `updated_at`

4. **Vector tables** (for semantic recall with pgvector)
   - Stores message embeddings for similarity search

5. **Other tables** - Workflows, tasks, etc.

## Verifying Persistence

### Check Messages in Database
```sql
-- View all threads
SELECT * FROM threads ORDER BY created_at DESC;

-- View messages for a specific thread
SELECT * FROM messages 
WHERE thread_id = 'thread-user123-1234567890'
ORDER BY created_at ASC;

-- Count messages per thread
SELECT thread_id, COUNT(*) as message_count
FROM messages
GROUP BY thread_id;
```

### Check in Application
After making a request, check your Supabase dashboard:
1. Go to Table Editor
2. Select `threads` table - should see new rows
3. Select `messages` table - should see user and assistant messages

## Production Best Practices

### 1. Use Real User IDs
```typescript
// Get from your auth system (e.g., Supabase Auth, NextAuth, Clerk)
import { auth } from '@/lib/auth';

const session = await auth();
const resourceId = session.user.id; // Real user ID
```

### 2. Thread Management Strategies

**Option A: One thread per page load (simple)**
```typescript
// Generate new thread for each conversation
const threadId = `thread-${userId}-${Date.now()}`;
```

**Option B: Persistent threads (better UX)**
```typescript
// Store threadId in localStorage or database
// Reuse for conversation continuity
const threadId = localStorage.getItem('currentThreadId') || 
                 `thread-${userId}-${Date.now()}`;
```

**Option C: Multiple threads per user (best)**
```typescript
// Let users create/switch between conversations
// Store threads in database with titles
const threads = await db.threads.findMany({ 
  where: { resource_id: userId } 
});
```

### 3. Thread Metadata
```typescript
const agentStream = await agent.stream(messages, {
  memory: {
    thread: {
      id: conversationThreadId,
      metadata: {
        source: 'portfolio-website',
        userAgent: request.headers.get('user-agent'),
        ip: request.ip,
      },
      title: 'Portfolio Inquiry', // Optional custom title
    },
    resource: resourceId,
  },
});
```

### 4. Error Handling
```typescript
try {
  const agentStream = await agent.stream(messages, {
    memory: {
      thread: conversationThreadId,
      resource: resourceId,
    },
  });
} catch (error) {
  if (error.message.includes('thread')) {
    // Handle thread-related errors
    console.error('Thread persistence failed:', error);
  }
}
```

## Semantic Recall Benefits

Now that messages are persisted, your agent can:

1. **Recall past conversations**: With `scope: 'resource'`, the agent can find relevant messages from ANY of the user's previous threads
2. **Provide context-aware responses**: "As we discussed last week..."
3. **Build user profiles**: Working memory stores persistent user preferences
4. **Improve over time**: More conversations = better semantic search results

## Testing Persistence

### Manual Test
```bash
# 1. Send first message
curl -X POST http://localhost:3000/api/portfolio-agent \
  -H "Content-Type: application/json" \
  -d '{"message": "What technologies do you work with?", "userId": "test-user-1"}'

# 2. Check database for thread and messages
# 3. Send follow-up with same userId (new thread)
curl -X POST http://localhost:3000/api/portfolio-agent \
  -H "Content-Type: application/json" \
  -d '{"message": "Tell me about your projects", "userId": "test-user-1"}'

# 4. Verify semantic recall finds relevant past messages
```

### Automated Test
```typescript
import { mastra } from '@/mastra';

describe('Message Persistence', () => {
  it('should persist messages to database', async () => {
    const agent = mastra.getAgent('portfolioAgent');
    const threadId = `test-thread-${Date.now()}`;
    const resourceId = 'test-user-123';

    await agent.generate('Hello', {
      memory: {
        thread: threadId,
        resource: resourceId,
      },
    });

    // Check database
    const messages = await db.messages.findMany({
      where: { thread_id: threadId },
    });

    expect(messages.length).toBeGreaterThan(0);
    expect(messages[0].content).toContain('Hello');
  });
});
```

## Common Issues

### Issue: "Duplicate database object" warning
**Cause**: Multiple Postgres clients with same connection string
**Solution**: Use `PORTFOLIO_POSTGRES_URL_SIMPLE` without query parameters (already fixed in `src/mastra/storage.ts`)

### Issue: Messages not appearing in database
**Cause**: Missing `thread` or `resource` in agent call
**Solution**: Always provide both identifiers (now fixed in API route)

### Issue: Semantic recall not working
**Cause**: 
1. Missing vector store configuration
2. Missing embedder configuration
3. Not enough messages in database
**Solution**: Already configured in `src/mastra/storage.ts` with FastEmbed

### Issue: Slow first request
**Cause**: FastEmbed downloads model on first use
**Solution**: Pre-warm the embedder on server startup (optional optimization)

## Summary

✅ **Fixed**: API route now provides `thread` and `resource` identifiers  
✅ **Result**: Messages are persisted to Supabase database  
✅ **Benefit**: Semantic recall, working memory, and conversation history now work  
✅ **Client**: Receives threadId/resourceId for conversation continuity  

Your Mastra agent now has full memory persistence with:
- Conversation history (last 10 messages)
- Semantic recall (1 most relevant past message)
- Thread-scoped memory
- Database persistence across sessions
