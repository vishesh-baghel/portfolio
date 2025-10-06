import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    globalSetup: './globalSetup.ts',
    setupFiles: ['./testSetup.ts'],
    testTimeout: 90000, // 90 seconds for LLM calls
    hookTimeout: 30000,
    include: ['**/*.eval.test.ts', '**/*.test.ts'],
    exclude: ['node_modules', '.next', 'dist'],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});
