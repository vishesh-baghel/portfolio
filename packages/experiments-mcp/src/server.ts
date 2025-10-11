import { MCPServer } from '@mastra/mcp';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { listExperimentsTool } from './tools/list-experiments';
import { getExperimentTool } from './tools/get-experiment';
import { searchExperimentsTool } from './tools/search-experiments';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read version from package.json
function getVersion(): string {
  try {
    const packageJsonPath = join(__dirname, '../package.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    return packageJson.version;
  } catch {
    return '0.0.1'; // Fallback version
  }
}

/**
 * Create and configure the Experiments MCP Server
 * Exposes Vishesh's integration patterns via Model Context Protocol
 */
export function createServer(): MCPServer {
  const server = new MCPServer({
    name: 'Vishesh Experiments Server',
    version: getVersion(),
    tools: {
      listExperiments: listExperimentsTool,
      getExperiment: getExperimentTool,
      searchExperiments: searchExperimentsTool,
    },
  });

  return server;
}
