#!/usr/bin/env node
import {
  createServer
} from "./chunk-TEJB3YRY.js";
import "./chunk-XQADMHCP.js";

// src/stdio.ts
async function main() {
  const server = createServer();
  try {
    await server.startStdio();
    console.info("Vishesh Experiments MCP Server started on stdio");
  } catch (error) {
    console.error("Failed to start MCP server:", error);
    process.exit(1);
  }
}
process.on("SIGINT", () => {
  console.error("Shutting down MCP server...");
  process.exit(0);
});
process.on("SIGTERM", () => {
  console.error("Shutting down MCP server...");
  process.exit(0);
});
main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
