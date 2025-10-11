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
    // Global settings that apply to all projects
    fileParallelism: true,
    pool: 'threads',
    maxWorkers: 3,
    minWorkers: 1,
    maxConcurrency: 5,
    
    projects: [
      {
        test: {
          name: 'portfolio',
          include: ['src/**/*.test.ts', 'src/**/*.eval.test.ts'],
          environment: 'node',
          globalSetup: './globalSetup.ts',
          setupFiles: ['./testSetup.ts'],
          testTimeout: 90000,
          hookTimeout: 30000,

          // Enable test concurrency within each file
          sequence: {
            concurrent: true,
            shuffle: false,
          },
        },
      },
      {
        test: {
          name: 'experiments-mcp',
          include: ['packages/experiments-mcp/src/**/*.test.ts'],
          environment: 'node',
          testTimeout: 30000,
        },
      },
    ],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});