import { MCPServer } from '@mastra/mcp';
import { listExperimentsTool } from './tools/list-experiments.js';
import { getExperimentTool } from './tools/get-experiment.js';
import { searchExperimentsTool } from './tools/search-experiments.js';

/**
 * Create and configure the Experiments MCP Server
 * Exposes Vishesh's integration patterns via Model Context Protocol
 */
export function createServer(): MCPServer {
  const server = new MCPServer({
    name: 'Vishesh Experiments Server',
    version: '1.0.0',
    tools: {
      listExperiments: listExperimentsTool,
      getExperiment: getExperimentTool,
      searchExperiments: searchExperimentsTool,
    },
  });

  return server;
}
