# Portfolio Agent Memory Configuration

## Overview

The portfolio agent now has full memory capabilities with semantic recall enabled, using PostgreSQL with the pgvector extension for vector storage.

## Configuration Details

### Memory Features Enabled

1. **Conversation History** (Last Messages)
   - Keeps the last 20 messages from the current thread
   - Provides short-term conversational context
   - Configured via `lastMessages: 20`

2. **Semantic Recall** (Vector Search)
   - Retrieves semantically relevant messages from past conversations
   - Uses vector embeddings for similarity search
   - Searches across ALL threads for the same user (resource-scoped)
   - Configuration:
     - `topK: 3` - Retrieves 3 most similar messages
     - `messageRange: 1` - Includes 1 message before and after each match for context
     - `scope: "resource"` - Searches across all threads for the same user/resource

3. **Memory Processors**
   - `TokenLimiter(120000)` - Ensures memory doesn't exceed ~120k tokens
   - Prevents context window overflow for gpt-4o-mini

### Storage & Vector Configuration

**Storage**: PostgreSQL (via `@mastra/pg`)
- Connection: `process.env.POSTGRES_URL`
- Schema: `process.env.MASTRA_PG_SCHEMA` (optional, defaults to public)
- Stores conversation threads and messages

**Vector Store**: PgVector (PostgreSQL with pgvector extension)
- Connection: Same as storage (`process.env.POSTGRES_URL`)
- Schema: Same as storage
- Stores message embeddings for semantic search
- Uses pgvector extension for efficient vector similarity search

**Embedder**: OpenAI text-embedding-3-small
- Converts messages to 1536-dimensional vectors
- Fast and cost-effective for semantic search
- Configured per-agent in the Memory instance

## File Changes

### 1. `src/mastra/index.ts`
```typescript
import { PgVector } from "@mastra/pg";

// Vector store configured at Mastra level
const vector = new PgVector({
  connectionString: process.env.POSTGRES_URL,
  schemaName: process.env.MASTRA_PG_SCHEMA,
});

export const mastra = new Mastra({
  agents: { portfolioAgent, experimentsAgent },
  storage,
  vectors: { pgVector: vector },
});
```

### 2. `src/mastra/agents/portfolio-agent.ts`
```typescript
import { PgVector } from "@mastra/pg";

memory: new Memory({
  vector: new PgVector({
    connectionString: process.env.POSTGRES_URL!,
    schemaName: process.env.MASTRA_PG_SCHEMA,
  }),
  embedder: openai.embedding("text-embedding-3-small"),
  options: {
    lastMessages: 20,
    semanticRecall: {
      topK: 3,
      messageRange: 1,
      scope: "resource",
    },
  },
  processors: [new TokenLimiter(120000)],
})
```

## Environment Variables Required

```bash
# Required
POSTGRES_URL=postgresql://user:password@localhost:5432/mydb
OPENAI_API_KEY=your_openai_api_key_here

# Optional
MASTRA_PG_SCHEMA=public  # Defaults to public if not set
```

## How It Works

1. **User sends a message** → Agent receives it with thread/resource context
2. **Conversation History** → Last 20 messages from current thread are loaded
3. **Semantic Recall** → User's message is embedded and used to search for similar past messages across ALL their threads
4. **Context Assembly** → Recent messages + semantically relevant past messages are combined
5. **Token Limiting** → TokenLimiter ensures total memory doesn't exceed 120k tokens
6. **LLM Processing** → Combined context is sent to gpt-4o-mini for response generation
7. **Memory Storage** → New messages are stored in Postgres and embedded for future recall

## Benefits

- **Persistent Memory**: Conversations survive server restarts
- **Cross-Thread Recall**: Agent remembers context from previous conversations with the same user
- **Semantic Search**: Finds relevant past messages even if exact keywords don't match
- **Token Management**: Automatic limiting prevents context overflow
- **Production Ready**: Uses PostgreSQL for reliability and scalability

## Performance Considerations

- **Embedding Cost**: Each message generates an OpenAI embedding (~$0.0001 per 1k tokens)
- **Vector Search**: PgVector provides efficient similarity search with pgvector extension
- **Token Usage**: 120k token limit balances context richness with cost
- **Latency**: Semantic recall adds ~100-300ms per request (embedding + vector search)

## Future Optimizations

1. **HNSW Index**: Configure HNSW index for faster vector search (see Mastra docs)
2. **Batch Embeddings**: Embed multiple messages in one API call
3. **Caching**: Cache embeddings for frequently accessed messages
4. **Adjust topK**: Tune based on actual usage patterns (3 is a good starting point)
5. **Working Memory**: Consider adding working memory for persistent user preferences

## References

- [Mastra Memory Docs](https://mastra.ai/en/docs/memory/overview)
- [Semantic Recall](https://mastra.ai/en/docs/memory/semantic-recall)
- [PgVector Configuration](https://mastra.ai/en/docs/reference/vectors/pg)
- [Memory Processors](https://mastra.ai/en/docs/memory/memory-processors)
