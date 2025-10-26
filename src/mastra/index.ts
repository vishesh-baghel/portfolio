import { Mastra } from "@mastra/core/mastra";
import { portfolioAgent } from "./agents/portfolio-agent";
import { experimentsAgent } from "./agents/experiments-agent";
import { storage } from "./storage";

export const mastra = new Mastra({
  agents: {
    portfolioAgent,
    experimentsAgent,
  },
  storage, // In-memory storage for conversation context
  telemetry: {
    serviceName: "portfolio-mastra",
    // Disable telemetry in dev for faster responses
    // In production, Vercel OTEL will handle tracing
    enabled: process.env.NODE_ENV === "production",
    sampling: {
      type: "always_on",
    },
    export: {
      type: "console",
    },
  },
});
