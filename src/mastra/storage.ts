import { PostgresStore, PgVector } from "@mastra/pg";
import { Memory } from "@mastra/memory";
import { TokenLimiter } from "@mastra/memory/processors";
import { openai } from "@ai-sdk/openai";
import { fastembed } from "@mastra/fastembed";

// Validate required environment variables
if (!process.env.PORTFOLIO_POSTGRES_URL_SIMPLE) {
  throw new Error(
    "PORTFOLIO_POSTGRES_URL_NO_PARAMS is required. Configure a Postgres connection string to run Mastra."
  );
}

// Shared storage for Mastra (conversation threads, messages)
export const storage = new PostgresStore({
  connectionString: process.env.PORTFOLIO_POSTGRES_URL_SIMPLE,
});

// Shared vector store for semantic recall (pgvector)
export const vector = new PgVector({
  connectionString: process.env.PORTFOLIO_POSTGRES_URL_SIMPLE,
  schemaName: process.env.PORTFOLIO_PG_SCHEMA,
});

// Preconfigured Memory instance for the portfolio agent
// - Uses OpenAI embeddings and pgvector for semantic recall
// - Keeps last 20 messages and recalls semantically relevant history (resource-scoped)
export const portfolioMemory = new Memory({
  vector,
  // Use local FastEmbed to avoid network latency on embeddings
  embedder: fastembed,
  options: {
    lastMessages: 10,
    semanticRecall: {
      topK: 1,
      messageRange: 0,
      scope: "thread",
    },
  },
  processors: [new TokenLimiter(120000)],
});


