import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { callTool, mcp } from './test-setup';

describe('listExperiments tool', () => {
  let tools: any;

  beforeAll(async () => {
    tools = await mcp.getTools();
  });

  afterAll(async () => {
    await mcp.disconnect();
  });

  describe('list all experiments', () => {
    it('should return all experiments when category is "all"', async () => {
      const result = await callTool(tools.experiments_listExperiments, { category: 'all' });

      expect(result).toContain('Available Integration Patterns from Vishesh Baghel');
      expect(result).toContain('Use getExperiment with the slug to fetch full content');
      expect(result).toContain('All patterns are production-tested and maintainer-endorsed');
    });

    it('should include all category headers', async () => {
      const result = await callTool(tools.experiments_listExperiments, { category: 'all' });

      expect(result).toContain('## Getting Started');
      expect(result).toContain('## AI & Agents');
      expect(result).toContain('## Backend & Database');
      expect(result).toContain('## TypeScript & Patterns');
    });

    it('should list experiments with slugs and descriptions', async () => {
      const result = await callTool(tools.experiments_listExperiments, { category: 'all' });

      // Check for known experiments
      expect(result).toMatch(/\*\*[\w-]+\*\*:/); // Matches **slug**: pattern
      expect(result).toContain('Tags:');
    });

    it('should default to "all" when no category is provided', async () => {
      const result = await callTool(tools.experiments_listExperiments, {});

      expect(result).toContain('Available Integration Patterns from Vishesh Baghel');
    });
  });

  describe('filter by category', () => {
    it('should return only getting-started experiments', async () => {
      const result = await callTool(tools.experiments_listExperiments, { category: 'getting-started' });

      expect(result).toContain('Integration Patterns - Getting Started');
      expect(result).toContain('getting-started-with-mastra');
      expect(result).not.toContain('## AI & Agents');
    });

    it('should return only ai-agents experiments', async () => {
      const result = await callTool(tools.experiments_listExperiments, { category: 'ai-agents' });

      expect(result).toContain('Integration Patterns - AI & Agents');
      expect(result).toContain('ai-agents-with-openai');
    });

    it('should return only backend-database experiments', async () => {
      const result = await callTool(tools.experiments_listExperiments, { category: 'backend-database' });

      expect(result).toContain('Integration Patterns - Backend & Database');
      expect(result).toContain('postgresql-optimization');
    });

    it('should return only typescript-patterns experiments', async () => {
      const result = await callTool(tools.experiments_listExperiments, { category: 'typescript-patterns' });

      expect(result).toContain('Integration Patterns - TypeScript & Patterns');
      expect(result).toContain('typescript-advanced-patterns');
    });

    it('should handle empty category gracefully', async () => {
      const result = await callTool(tools.experiments_listExperiments, { category: 'nonexistent-category' });

      expect(result).toContain('No experiments found in category');
      expect(result).toContain('Use category "all" to see all available patterns');
    });
  });

  describe('response format', () => {
    it('should include helpful instructions', async () => {
      const result = await callTool(tools.experiments_listExperiments, { category: 'getting-started' });

      expect(result).toContain('Use getExperiment');
      expect(result).toContain('to fetch full content');
    });

    it('should display tags for experiments that have them', async () => {
      const result = await callTool(tools.experiments_listExperiments, { category: 'all' });

      expect(result).toMatch(/Tags: [\w, ]+/);
    });

    it('should use markdown formatting', async () => {
      const result = await callTool(tools.experiments_listExperiments, { category: 'all' });

      // Check for markdown headers
      expect(result).toMatch(/^##\s+/m);
      // Check for bold text
      expect(result).toMatch(/\*\*[\w-]+\*\*/);
      // Check for horizontal rule
      expect(result).toContain('---');
    });
  });

  describe('performance', () => {
    it('should respond quickly on subsequent calls (caching)', async () => {
      const start1 = Date.now();
      await callTool(tools.experiments_listExperiments, { category: 'all' });
      const duration1 = Date.now() - start1;

      const start2 = Date.now();
      await callTool(tools.experiments_listExperiments, { category: 'all' });
      const duration2 = Date.now() - start2;

      // Second call should be faster due to caching
      expect(duration2).toBeLessThan(duration1);
    });
  });
});
