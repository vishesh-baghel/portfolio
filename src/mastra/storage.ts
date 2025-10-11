import { LibSQLStore } from "@mastra/libsql";
import { Memory } from "@mastra/memory";
import { TokenLimiter } from "@mastra/memory/processors";
import { fastembed } from "@mastra/fastembed";

/**
 * LibSQL Storage Configuration
 * 
 * Environment Variables:
 * - MASTRA_DB_FILE: Path to database file (default: .mastra/db.sqlite for local, .mastra/prod.sqlite for prod)
 * - NODE_ENV: Determines which database file to use
 * 
 * Local Development: Uses file:.mastra/db.sqlite
 * Production (Vercel): Uses file:.mastra/prod.sqlite
 */

// Determine database file based on environment
const getDbPath = () => {
  // Allow override via environment variable
  if (process.env.MASTRA_DB_FILE) {
    return process.env.MASTRA_DB_FILE;
  }
  
  // Default: use different files for dev vs prod
  const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
  return isProduction ? 'file:.mastra/prod.sqlite' : 'file:.mastra/db.sqlite';
};

const dbPath = getDbPath();

console.log(`📁 Using Mastra database: ${dbPath}`);

// Create storage instance
export const storage = new LibSQLStore({
  url: dbPath,
});

// Lazy initialization state
let isInitialized = false;
let initializationPromise: Promise<LibSQLStore> | null = null;

/**
 * Get or create the storage instance with lazy initialization.
 * This follows Next.js best practices for serverless/edge compatibility.
 * 
 * Why lazy initialization?
 * - Module-level init runs during build time (no DB access)
 * - Prevents cold start timeouts in serverless
 * - Ensures single initialization across concurrent requests
 */
export async function getStorage(): Promise<LibSQLStore> {
  // Return existing instance if already initialized
  if (isInitialized) {
    return storage;
  }

  // If initialization is in progress, wait for it
  if (initializationPromise) {
    return initializationPromise;
  }

  // Start initialization (only once, even with concurrent calls)
  initializationPromise = (async () => {
    try {
      console.log('🔄 Initializing Mastra LibSQL storage...');
      
      // Initialize tables
      await storage.init();
      
      isInitialized = true;
      console.log('✅ Mastra LibSQL storage initialized successfully');
      
      return storage;
    } catch (error) {
      // Reset promise so next call can retry
      initializationPromise = null;
      console.error('❌ Failed to initialize Mastra storage:', error);
      throw new Error(
        `Failed to initialize LibSQL storage at ${dbPath}. ` +
        `Original error: ${error}`
      );
    }
  })();

  return initializationPromise;
}

// Preconfigured Memory instance for the portfolio agent
// - Uses FastEmbed for local embeddings (no API calls)
// - Keeps last 10 messages and recalls semantically relevant history
// - Note: LibSQL doesn't support vector search, so semantic recall is disabled
export const portfolioMemory = new Memory({
  // Use local FastEmbed to avoid network latency on embeddings
  embedder: fastembed,
  options: {
    lastMessages: 10,
    // Semantic recall disabled for LibSQL (no vector support)
    // Only uses lastMessages for context
  },
  processors: [new TokenLimiter(120000)],
});


