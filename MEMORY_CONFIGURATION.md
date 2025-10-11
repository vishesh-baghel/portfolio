# Portfolio Agent Memory Configuration

## Overview

The portfolio agent uses LibSQL (SQLite-based) for simple, file-based storage. Memory is configured to keep recent conversation context without the complexity of vector search.

## Configuration Details

### Memory Features Enabled

1. **Conversation History** (Last Messages)
   - Keeps the last 10 messages from the current thread
   - Provides short-term conversational context
   - Configured via `lastMessages: 10`

2. **Memory Processors**
   - `TokenLimiter(120000)` - Ensures memory doesn't exceed ~120k tokens
   - Prevents context window overflow for gpt-4o-mini

### Storage Configuration

**Storage**: LibSQL (via `@mastra/libsql`)
- File-based SQLite storage
- Local dev: `file:.mastra/db.sqlite`
- Production: `file:.mastra/prod.sqlite`
- Stores conversation threads and messages

**Embedder**: FastEmbed (local embeddings)
- Uses local FastEmbed models (no API calls)
- Fast and cost-effective
- No network latency

**Note**: Semantic recall (vector search) is disabled because LibSQL doesn't support vector operations. For a simple portfolio agent, the last 10 messages provide sufficient context.

## File Changes

### 1. `src/mastra/storage.ts`
```typescript
import { LibSQLStore } from "@mastra/libsql";
import { fastembed } from "@mastra/fastembed";

// Automatically selects db file based on environment
const dbPath = process.env.MASTRA_DB_FILE || 
  (isProduction ? 'file:.mastra/prod.sqlite' : 'file:.mastra/db.sqlite');

export const storage = new LibSQLStore({ url: dbPath });

export const portfolioMemory = new Memory({
  embedder: fastembed,
  options: {
    lastMessages: 10,
  },
  processors: [new TokenLimiter(120000)],
});
```

### 2. `src/mastra/index.ts`
```typescript
import { storage } from "./storage";

export const mastra = new Mastra({
  agents: { portfolioAgent, experimentsAgent },
  storage,
  // No vectors configuration needed for LibSQL
});
```

## Environment Variables Required

```bash
# Required
OPENAI_API_KEY=your_openai_api_key_here

# Optional - override default database file
MASTRA_DB_FILE=file:.mastra/custom.sqlite
```

## How It Works

1. **User sends a message** → Agent receives it with thread/resource context
2. **Conversation History** → Last 10 messages from current thread are loaded from LibSQL
3. **Token Limiting** → TokenLimiter ensures total memory doesn't exceed 120k tokens
4. **LLM Processing** → Recent messages are sent to gpt-4o-mini for response generation
5. **Memory Storage** → New messages are stored in LibSQL database file

## Benefits

- **Simple Setup**: No external database service needed
- **Fast Local Queries**: SQLite is extremely fast for local operations
- **Zero Configuration**: Works out of the box
- **Cost Effective**: No embedding API calls (uses local FastEmbed)
- **Portable**: Database is just a file

## Performance Considerations

- **No Embedding Cost**: FastEmbed runs locally (no API calls)
- **Fast Queries**: SQLite is optimized for local file access
- **Token Usage**: 120k token limit balances context richness with cost
- **Low Latency**: No network calls for embeddings or vector search

## Limitations

- **No Semantic Recall**: LibSQL doesn't support vector search
- **Limited Context**: Only last 10 messages (vs. searching all past conversations)
- **Ephemeral on Vercel**: Database resets on deployment (unless using Turso)

For a simple portfolio agent, these limitations are acceptable. The agent doesn't need to remember conversations across deployments.

## Future Optimizations

1. **Turso Integration**: Use Turso for persistent cloud storage (optional)
2. **Increase lastMessages**: Adjust based on typical conversation length
3. **Working Memory**: Add persistent user preferences if needed

## References

- [Mastra Memory Docs](https://mastra.ai/en/docs/memory/overview)
- [Mastra LibSQL Storage](https://mastra.ai/en/docs/reference/storage/libsql)
- [LibSQL Documentation](https://github.com/tursodatabase/libsql)
- [Memory Processors](https://mastra.ai/en/docs/memory/memory-processors)
