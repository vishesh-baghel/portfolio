#!/usr/bin/env node

/**
 * stdio transport entry point for MCP server
 * This is what gets executed when running: npx @vishesh/experiments
 */

import { createServer } from './server';

async function main() {
  const server = createServer();

  try {
    await server.startStdio();
    // Use stderr for logging - stdout is reserved for MCP protocol
    console.error('Vishesh Experiments MCP Server started on stdio');
  } catch (error) {
    console.error('Failed to start MCP server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.error('Shutting down MCP server...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.error('Shutting down MCP server...');
  process.exit(0);
});

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
