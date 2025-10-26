import { LibSQLStore } from "@mastra/libsql";
import { Memory } from "@mastra/memory";

/**
 * Minimal In-Memory Storage for Portfolio Agent
 * 
 * Uses LibSQL in pure memory mode (":memory:") for conversation context.
 * No file I/O, no persistence - just RAM-based conversation history.
 * 
 * Benefits:
 * - Zero file I/O overhead
 * - No disk writes
 * - Instant initialization
 * - Conversation context during session only
 * - Resets on server restart (perfect for dev)
 */

// Create in-memory storage (no file I/O)
export const storage = new LibSQLStore({
  url: ":memory:", // Pure in-memory, no file system
});

// Lightweight Memory instance for the portfolio agent
// - No embeddings (not needed for simple Q&A)
// - In-memory storage only (no persistence)
// - Keeps last 10 messages for conversation context
// - No processors for maximum speed
export const portfolioMemory = new Memory({
  storage,
  options: {
    lastMessages: 10,
  },
});


