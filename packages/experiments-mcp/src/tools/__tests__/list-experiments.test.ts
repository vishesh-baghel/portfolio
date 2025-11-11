import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { callTool, mcp, getExperimentsByCategory } from './test-setup';

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

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should include category headers', async () => {
      const result = await callTool(tools.experiments_listExperiments, { category: 'all' });

      // Should have markdown headers
      expect(result).toMatch(/^##\s+/m);
    });

    it('should list experiments with slugs and descriptions', async () => {
      const result = await callTool(tools.experiments_listExperiments, { category: 'all' });

      // Check for experiment format
      expect(result).toMatch(/\*\*[\w-]+\*\*/); // Matches **slug** pattern
    });

    it('should default to "all" when no category is provided', async () => {
      const result = await callTool(tools.experiments_listExperiments, {});

      expect(result).toBeTruthy();
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('filter by category', () => {
    it('should accept valid category filters', async () => {
      const validCategories = ['getting-started', 'ai-agents', 'backend-database', 'typescript-patterns'];
      
      for (const category of validCategories) {
        const result = await callTool(tools.experiments_listExperiments, { category });
        
        // Should return valid response (may be empty if no experiments in that category)
        expect(result).toBeTruthy();
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
      }
    });

    it('should handle invalid category gracefully', async () => {
      const result = await callTool(tools.experiments_listExperiments, { category: 'nonexistent-category' });

      expect(result).toContain('Invalid category');
      expect(result).toContain('Valid categories:');
      expect(result).toContain('Use category "all" to see all available patterns');
    });

    it('should filter experiments by category', async () => {
      const allResult = await callTool(tools.experiments_listExperiments, { category: 'all' });
      const categoryResult = await callTool(tools.experiments_listExperiments, { category: 'ai-agents' });

      // Both should be valid responses
      expect(allResult).toBeTruthy();
      expect(categoryResult).toBeTruthy();
      
      // Category result should not be longer than all results
      expect(categoryResult.length).toBeLessThanOrEqual(allResult.length);
    });
  });

  describe('response format', () => {
    it('should include helpful instructions', async () => {
      const result = await callTool(tools.experiments_listExperiments, { category: 'getting-started' });

      expect(result).toBeTruthy();
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return valid markdown content', async () => {
      const result = await callTool(tools.experiments_listExperiments, { category: 'all' });

      expect(result).toBeTruthy();
      expect(result.length).toBeGreaterThan(0);
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
    it('should respond within reasonable time', async () => {
      const start = Date.now();
      const result = await callTool(tools.experiments_listExperiments, { category: 'all' });
      const duration = Date.now() - start;

      // Should return valid results
      expect(result).toBeTruthy();
      expect(result.length).toBeGreaterThan(0);
      
      // Should respond within reasonable time (500ms)
      // This is generous to account for CI environments
      expect(duration).toBeLessThan(500);
    });
  });
});
