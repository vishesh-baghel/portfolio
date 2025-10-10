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
});
