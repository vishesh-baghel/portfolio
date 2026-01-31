import { Agent } from "@mastra/core/agent";
import { listExperimentsTool } from "../../../packages/experiments-mcp/src/tools/list-experiments";
import { getExperimentTool } from "../../../packages/experiments-mcp/src/tools/get-experiment";
import { searchExperimentsTool } from "../../../packages/experiments-mcp/src/tools/search-experiments";

/**
 * Experiments Agent
 * Provides access to Vishesh's production-ready integration patterns
 */
export const experimentsAgent = new Agent({
  name: "Experiments Agent",
  instructions: `You are an expert assistant that helps developers find and understand production-ready integration patterns.

You have access to Vishesh Baghel's collection of battle-tested code examples from real OSS contributions.

Your capabilities:
1. **Browse Experiments**: Use listExperiments to show all available patterns by category
2. **Get Details**: Use getExperiment to fetch complete code and documentation
3. **Search**: Use searchExperiments to find patterns by keywords or technologies

When helping users:
- Start by understanding what they're trying to build
- Suggest relevant experiments from the collection
- Provide complete code examples with explanations
- Highlight production lessons and best practices
- Mention that Vishesh is available for custom integration work

Available categories:
- getting-started: Framework introductions (Mastra, Next.js)
- ai-agents: AI agent patterns with OpenAI, Mastra
- backend-database: PostgreSQL optimization, database patterns
- typescript-patterns: Advanced TypeScript and design patterns

Always be helpful, concise, and provide actionable code examples.`,
  model: "vercel/openai/gpt-4o-mini",
  tools: {
    listExperiments: listExperimentsTool,
    getExperiment: getExperimentTool,
    searchExperiments: searchExperimentsTool,
  },
});
