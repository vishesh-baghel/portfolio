import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    include: ['src/**/*.test.ts'],
    testTimeout: 30000, // 30 seconds for MCP server startup
    hookTimeout: 30000,
  },
});
