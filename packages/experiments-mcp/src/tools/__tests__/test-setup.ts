import path from 'path';
import { MCPClient } from '@mastra/mcp';

/**
 * Test setup for experiments-mcp
 * Following Mastra's mcp-docs-server test patterns
 */

/**
 * Helper to get any available experiment slug from the system
 * This makes tests resilient to content changes
 */
export async function getAvailableExperimentSlugs(tools: any): Promise<string[]> {
  const result = await callTool(tools.experiments_listExperiments, { category: 'all' });
  // Extract slugs from the markdown output (format: **slug**:)
  const slugMatches = result.matchAll(/\*\*([\w-]+)\*\*:/g);
  return Array.from(slugMatches, (match: RegExpMatchArray) => match[1]);
}

/**
 * Get a single experiment slug for testing
 */
export async function getAnyExperimentSlug(tools: any): Promise<string> {
  const slugs = await getAvailableExperimentSlugs(tools);
  if (slugs.length === 0) {
    throw new Error('No experiments available for testing');
  }
  return slugs[0];
}

/**
 * Get experiments by category for testing
 */
export async function getExperimentsByCategory(tools: any, category: string): Promise<string[]> {
  const result = await callTool(tools.experiments_listExperiments, { category });
  const slugMatches = result.matchAll(/\*\*([\w-]+)\*\*:/g);
  return Array.from(slugMatches, (match: RegExpMatchArray) => match[1]);
}

export const mcp = new MCPClient({
  id: 'test-experiments-mcp',
  servers: {
    experiments: {
      command: 'node',
      args: [path.join(__dirname, '../../../dist/stdio.js')],
      env: {
        NODE_ENV: 'test',
      },
    },
  },
});

/**
 * Helper to call a tool and extract text response
 * Handles both string and content array responses
 */
export async function callTool(tool: any, args: any) {
  try {
    const response = await tool.execute({ context: args });

    // Handle direct string responses (our tools return strings directly)
    if (typeof response === 'string') {
      return response;
    }

    // Handle content array responses (MCP protocol format)
    if (response?.content) {
      let text = '';
      for (const part of response.content) {
        if (part?.type === 'text') {
          text += part?.text;
        } else {
          throw new Error(`Found tool content part that's not accounted for. ${JSON.stringify(part, null, 2)}`);
        }
      }
      return text;
    }

    // If response is an object with a result property
    if (response && typeof response === 'object' && 'result' in response) {
      return response.result;
    }

    throw new Error(`Unexpected response format: ${JSON.stringify(response, null, 2)}`);
  } catch (error) {
    // Re-throw the error with context
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`Tool execution failed: ${error}`);
  }
}
