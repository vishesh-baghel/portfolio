import { Mastra } from "@mastra/core/mastra";
import { PostgresStore, PgVector } from "@mastra/pg";
import { openai } from "@ai-sdk/openai";
import { portfolioAgent } from "./agents/portfolio-agent";
import { experimentsAgent } from "./agents/experiments-agent";

// Postgres is the only supported storage for Mastra in this project
if (!process.env.PORTFOLIO_POSTGRES_URL) {
  throw new Error(
    "PORTFOLIO_POSTGRES_URL is required. Configure a Postgres connection string to run Mastra."
  );
}

const storage = new PostgresStore({
  connectionString: process.env.PORTFOLIO_POSTGRES_URL,
});

// Vector store for semantic recall in memory
// Configured at Mastra level so all agents can use it
const vector = new PgVector({
  connectionString: process.env.PORTFOLIO_POSTGRES_URL,
  schemaName: process.env.PORTFOLIO_PG_SCHEMA,
});

export const mastra = new Mastra({
  agents: {
    portfolioAgent,
    experimentsAgent,
  },
  storage,
  vectors: {
    pgVector: vector,
  },
});
