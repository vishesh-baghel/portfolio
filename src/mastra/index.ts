import { Mastra } from "@mastra/core/mastra";
import { createClient } from "@libsql/client";
import { LibSQLStore } from "@mastra/libsql";
import { portfolioAgent } from "./agents/portfolio-agent";
import { experimentsAgent } from "./agents/experiments-agent";

// Initialize libsql storage
const libsqlClient = createClient({
  url: process.env.TURSO_DATABASE_URL || "file:local.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const storage = new LibSQLStore({
  client: libsqlClient,
});

export const mastra = new Mastra({
  agents: {
    portfolioAgent,
    experimentsAgent,
  },
  storage,
});
