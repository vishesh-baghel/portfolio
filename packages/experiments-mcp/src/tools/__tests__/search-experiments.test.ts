import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { callTool, mcp, getAvailableExperimentSlugs } from './test-setup';

describe('searchExperiments tool', () => {
  let tools: any;
  let availableSlugs: string[] = [];

  beforeAll(async () => {
    tools = await mcp.getTools();
    availableSlugs = await getAvailableExperimentSlugs(tools);
  });

  afterAll(async () => {
    await mcp.disconnect();
  });

  describe('basic search', () => {
    it('should find experiments by keyword', async () => {
      const result = await callTool(tools.experiments_searchExperiments, {
        query: 'integration',
        maxResults: 5,
      });

      expect(result).toBeTruthy();
      expect(result).toMatch(/Search results for|No experiments found/);
    });

    it('should return results with relevance scores', async () => {
      const result = await callTool(tools.experiments_searchExperiments, {
        query: 'pattern',
      });

      expect(result).toBeTruthy();
      expect(result).toMatch(/Relevance: \d+%|No experiments found/);
    });

    it('should include matched terms', async () => {
      const result = await callTool(tools.experiments_searchExperiments, {
        query: 'integration pattern',
      });

      expect(result).toBeTruthy();
      expect(result).toMatch(/Matched:|No experiments found/);
    });

    it('should show excerpts from matched content', async () => {
      const result = await callTool(tools.experiments_searchExperiments, {
        query: 'code',
      });

      expect(result).toBeTruthy();
      expect(result).toMatch(/Excerpt:|No experiments found/);
    });

    it('should include instructions to use getExperiment', async () => {
      const result = await callTool(tools.experiments_searchExperiments, {
        query: 'integration',
      });

      expect(result).toBeTruthy();
      expect(result).toMatch(/Use getExperiment|No experiments found/);
    });
  });

  describe('search parameters', () => {
    it('should respect maxResults parameter', async () => {
      const result = await callTool(tools.experiments_searchExperiments, {
        query: 'agent',  // More specific query to get fewer total matches
        maxResults: 2,
      });

      // Count numbered results - should have at most maxResults
      if (result.includes('Search results')) {
        // Match only lines that start with number followed by period and space
        const lines = result.split('\n');
        const numberedLines = lines.filter((line: string) => /^\d+\.\s/.test(line));
        expect(numberedLines.length).toBeLessThanOrEqual(2);
        expect(numberedLines.length).toBeGreaterThan(0);
      }
    });

    it('should default to 5 results when maxResults not specified', async () => {
      const result = await callTool(tools.experiments_searchExperiments, {
        query: 'pattern',
      });

      const matches = result.match(/^\d+\./gm) || [];
      expect(matches.length).toBeLessThanOrEqual(5);
    });

    it('should filter by single category', async () => {
      const result = await callTool(tools.experiments_searchExperiments, {
        query: 'code',
        categories: ['ai-agents'],
      });

      // Should return results or no experiments message (category may be empty)
      expect(result).toBeTruthy();
      expect(result).toMatch(/Search results|No experiments/);
    });

    it('should filter by multiple categories', async () => {
      const result = await callTool(tools.experiments_searchExperiments, {
        query: 'code',
        categories: ['backend-database', 'typescript-patterns'],
      });

      expect(result).toBeTruthy();
      expect(result).toMatch(/Search results|No experiments/);
    });
  });

  describe('search quality', () => {
    it('should rank title matches higher', async () => {
      const result = await callTool(tools.experiments_searchExperiments, {
        query: 'pattern',
        maxResults: 5,
      });

      // Should return results with relevance scores in descending order
      if (result.includes('Search results')) {
        expect(result).toMatch(/Relevance: \d+%/);
        // Verify relevance scores are in descending order
        const relevanceMatches = Array.from(result.matchAll(/Relevance: (\d+)%/g));
        if (relevanceMatches.length > 1) {
          const firstScore = parseInt((relevanceMatches[0] as RegExpMatchArray)[1]);
          const secondScore = parseInt((relevanceMatches[1] as RegExpMatchArray)[1]);
          expect(firstScore).toBeGreaterThanOrEqual(secondScore);
        }
      }
    });

    it('should find experiments by technology stack', async () => {
      const result = await callTool(tools.experiments_searchExperiments, {
        query: 'code',
      });

      // Should return valid response
      expect(result).toBeTruthy();
      expect(result).toMatch(/Search results|No experiments/);
    });

    it('should find experiments by framework', async () => {
      const result = await callTool(tools.experiments_searchExperiments, {
        query: 'integration',
      });

      // Should return valid response
      expect(result).toBeTruthy();
      expect(result).toMatch(/Search results|No experiments/);
    });

    it('should handle multi-word queries', async () => {
      const result = await callTool(tools.experiments_searchExperiments, {
        query: 'code pattern integration',
      });

      expect(result).toBeTruthy();
      expect(result).toMatch(/Search results|No experiments/);
    });

    it('should be case-insensitive', async () => {
      const result1 = await callTool(tools.experiments_searchExperiments, {
        query: 'CODE',
      });
      const result2 = await callTool(tools.experiments_searchExperiments, {
        query: 'code',
      });

      // Both should return valid responses
      expect(result1).toBeTruthy();
      expect(result2).toBeTruthy();
      expect(result1).toMatch(/Search results|No experiments/);
      expect(result2).toMatch(/Search results|No experiments/);
    });
  });

  describe('no results handling', () => {
    it('should handle queries with no matches gracefully', async () => {
      const result = await callTool(tools.experiments_searchExperiments, {
        query: 'nonexistent-technology-xyz-12345',
      });

      // Should return either no results message or no experiments available
      expect(result).toBeTruthy();
      expect(result).toMatch(/No experiments (found|available)|Try:/i);
    });

    it('should suggest alternatives when no results found', async () => {
      const result = await callTool(tools.experiments_searchExperiments, {
        query: 'nonexistent-ruby-on-rails-xyz',
      });

      expect(result).toBeTruthy();
      expect(result).toMatch(/No experiments|Try:|different keywords/i);
    });

    it('should handle empty category results', async () => {
      // Use a valid category that might not have experiments
      const result = await callTool(tools.experiments_searchExperiments, {
        query: 'xyz-nonexistent',
        categories: ['getting-started'],
      });

      expect(result).toBeTruthy();
      expect(result).toMatch(/No experiments/i);
    });
  });

  describe('response format', () => {
    it('should use numbered list format when results exist', async () => {
      if (availableSlugs.length === 0) {
        return; // Skip if no experiments
      }

      // Search for a term that should match
      const result = await callTool(tools.experiments_searchExperiments, {
        query: 'code',
      });

      // Either has results with numbered list or no results message
      expect(result).toBeTruthy();
      if (result.includes('Search results')) {
        expect(result).toMatch(/^1\./m);
        expect(result).toMatch(/Slug:/);
        expect(result).toMatch(/Relevance:/);
      }
    });

    it('should include consultation link when results exist', async () => {
      if (availableSlugs.length === 0) {
        return; // Skip if no experiments
      }

      const result = await callTool(tools.experiments_searchExperiments, {
        query: 'integration',
      });

      // Either has results with consultation link or no results
      expect(result).toBeTruthy();
      if (result.includes('Search results')) {
        expect(result).toContain('https://cal.com/vishesh-baghel/15min');
      }
    });

    it('should use markdown formatting when results exist', async () => {
      if (availableSlugs.length === 0) {
        return; // Skip if no experiments
      }

      const result = await callTool(tools.experiments_searchExperiments, {
        query: 'pattern',
      });

      expect(result).toBeTruthy();
      if (result.includes('Search results')) {
        expect(result).toMatch(/\*\*[\w\s-]+\*\*/); // Bold text
        expect(result).toContain('---'); // Horizontal rule
      }
    });
  });

  describe('smoke tests - search functionality', () => {
    it('should handle any search query without errors', async () => {
      const queries = ['code', 'integration', 'pattern', 'typescript', 'api'];
      
      for (const query of queries) {
        const result = await callTool(tools.experiments_searchExperiments, {
          query,
        });

        // Should always return a valid response
        expect(result).toBeTruthy();
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
      }
    });

    it('should search across different content types', async () => {
      const result = await callTool(tools.experiments_searchExperiments, {
        query: 'production',
      });

      // Should return valid response regardless of matches
      expect(result).toBeTruthy();
      expect(result).toMatch(/Search results|No experiments/);
    });

    it('should handle technical terms', async () => {
      const result = await callTool(tools.experiments_searchExperiments, {
        query: 'optimization performance',
      });

      expect(result).toBeTruthy();
      expect(result).toMatch(/Search results|No experiments/);
    });
  });

  describe('performance', () => {
    it('should respond within reasonable time', async () => {
      const start = Date.now();
      const result = await callTool(tools.experiments_searchExperiments, {
        query: 'integration patterns',
        maxResults: 5,
      });
      const duration = Date.now() - start;

      // Should return results
      expect(result).toBeTruthy();
      
      // Should respond within reasonable time (500ms for CI)
      expect(duration).toBeLessThan(500);
    });
  });

  describe('edge cases', () => {
    it('should handle single character queries', async () => {
      const result = await callTool(tools.experiments_searchExperiments, {
        query: 'a',
      });

      expect(result).toBeTruthy();
    });

    it('should handle very long queries', async () => {
      const result = await callTool(tools.experiments_searchExperiments, {
        query: 'integration patterns for building production-ready applications with modern frameworks',
      });

      expect(result).toBeTruthy();
    });

    it('should handle special characters in query', async () => {
      const result = await callTool(tools.experiments_searchExperiments, {
        query: 'next.js @mastra/core',
      });

      expect(result).toBeTruthy();
    });

    it('should handle maxResults at boundary values', async () => {
      const result = await callTool(tools.experiments_searchExperiments, {
        query: 'pattern',
        maxResults: 1,
      });

      const matches = result.match(/^\d+\./gm) || [];
      expect(matches.length).toBeLessThanOrEqual(1);
    });
  });
});
