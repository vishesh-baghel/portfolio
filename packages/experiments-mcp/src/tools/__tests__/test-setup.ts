import path from 'path';
import { MCPClient } from '@mastra/mcp';

/**
 * Test setup for experiments-mcp
 * Following Mastra's mcp-docs-server test patterns
 */

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
