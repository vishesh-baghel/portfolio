import fs from 'node:fs/promises';
import { MCPServer } from '@mastra/mcp';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { listExperimentsTool } from './tools/list-experiments';
import { getExperimentTool } from './tools/get-experiment';
import { searchExperimentsTool } from './tools/search-experiments';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Helper to get package root path
function fromPackageRoot(relativePath: string): string {
  return join(__dirname, '..', relativePath);
}

const server = new MCPServer({
  name: 'Vishesh Experiments Server',
  version: JSON.parse(await fs.readFile(fromPackageRoot('package.json'), 'utf8')).version,
  tools: {
    listExperiments: listExperimentsTool,
    getExperiment: getExperimentTool,
    searchExperiments: searchExperimentsTool,
  },
});

async function runServer() {
  try {
    await server.startStdio();
    console.error('Vishesh Experiments MCP Server started on stdio');
  } catch (error) {
    console.error('Failed to start server', error);
    process.exit(1);
  }
}

export { runServer, server };