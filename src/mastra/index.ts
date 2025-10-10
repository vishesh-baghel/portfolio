import { Mastra } from "@mastra/core/mastra";
import { portfolioAgent } from "./agents/portfolio-agent";
import { experimentsAgent } from "./agents/experiments-agent";
import { storage, vector } from "./storage";

export const mastra = new Mastra({
  agents: {
    portfolioAgent,
    experimentsAgent,
  },
  storage,
  vectors: {
    pgVector: vector,
  },
  telemetry: {
    serviceName: "portfolio-mastra",
    enabled: true,
    sampling: {
      type: "always_on",
    },
    export: {
      type: "console", // Use console for local dev, will be overridden by Vercel OTEL in production
    },
  },
});
