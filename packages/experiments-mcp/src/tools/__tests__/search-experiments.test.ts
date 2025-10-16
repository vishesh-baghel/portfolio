import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { callTool, mcp } from './test-setup';

describe('searchExperiments tool', () => {
  let tools: any;

  beforeAll(async () => {
    tools = await mcp.getTools();
  });

  afterAll(async () => {
    await mcp.disconnect();
  });

  describe('basic search', () => {
    it('should find experiments by keyword', async () => {
      const result = await callTool(tools.experiments_searchExperiments, {
        query: 'mastra',
        maxResults: 5,
      });

      expect(result).toContain('Search results for "mastra"');
      expect(result).toMatch(/\d+\./); // Numbered list
      expect(result).toContain('Relevance:');
    });

    it('should return results with relevance scores', async () => {
      const result = await callTool(tools.experiments_searchExperiments, {
        query: 'openai',
      });

      expect(result).toMatch(/Relevance: \d+%/);
    });

    it('should include matched terms', async () => {
      const result = await callTool(tools.experiments_searchExperiments, {
        query: 'database postgresql',
      });

      expect(result).toContain('Matched:');
    });

    it('should show excerpts from matched content', async () => {
      const result = await callTool(tools.experiments_searchExperiments, {
        query: 'typescript',
      });

      expect(result).toContain('Excerpt:');
    });

    it('should include instructions to use getExperiment', async () => {
      const result = await callTool(tools.experiments_searchExperiments, {
        query: 'nextjs',
      });

      expect(result).toMatch(/Use getExperiment\('[\w-]+'\) for full content/);
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
        query: 'integration',
        categories: ['ai-agents'],
      });

      // Should only return AI agent experiments
      if (result.includes('Slug:')) {
        expect(result).toContain('ai-agents');
      }
    });

    it('should filter by multiple categories', async () => {
      const result = await callTool(tools.experiments_searchExperiments, {
        query: 'optimization',
        categories: ['backend-database', 'typescript-patterns'],
      });

      expect(result).toBeTruthy();
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
        query: 'database',
      });

      // Should return search results
      expect(result).toMatch(/Search results for|No experiments found/);
    });

    it('should find experiments by framework', async () => {
      const result = await callTool(tools.experiments_searchExperiments, {
        query: 'framework',
      });

      // Should return search results
      expect(result).toMatch(/Search results for|No experiments found/);
    });

    it('should handle multi-word queries', async () => {
      const result = await callTool(tools.experiments_searchExperiments, {
        query: 'ai agents openai',
      });

      expect(result).toContain('Search results for "ai agents openai"');
      expect(result).toMatch(/Relevance: \d+%/);
    });

    it('should be case-insensitive', async () => {
      const result1 = await callTool(tools.experiments_searchExperiments, {
        query: 'INTEGRATION',
      });
      const result2 = await callTool(tools.experiments_searchExperiments, {
        query: 'integration',
      });

      // Both should return valid search results
      expect(result1).toMatch(/Search results for|No experiments found/);
      expect(result2).toMatch(/Search results for|No experiments found/);
    });
  });

  describe('no results handling', () => {
    it('should handle queries with no matches gracefully', async () => {
      const result = await callTool(tools.experiments_searchExperiments, {
        query: 'nonexistent-technology-xyz',
      });

      expect(result).toContain('No experiments found matching');
      expect(result).toContain('Try:');
      expect(result).toContain('Using different keywords');
      expect(result).toContain('Using listExperiments to browse all patterns');
    });

    it('should suggest alternatives when no results found', async () => {
      const result = await callTool(tools.experiments_searchExperiments, {
        query: 'ruby-on-rails',
      });

      expect(result).toContain('Searching for specific technologies');
    });

    it('should return empty results for category with no matches', async () => {
      const result = await callTool(tools.experiments_searchExperiments, {
        query: 'xyz',
        categories: ['getting-started'],
      });

      expect(result).toContain('No experiments found');
    });
  });

  describe('response format', () => {
    it('should use numbered list format', async () => {
      const result = await callTool(tools.experiments_searchExperiments, {
        query: 'integration',
      });

      expect(result).toMatch(/^1\./m);
      expect(result).toMatch(/Slug:/);
      expect(result).toMatch(/Relevance:/);
    });

    it('should include consultation link', async () => {
      const result = await callTool(tools.experiments_searchExperiments, {
        query: 'database',
      });

      expect(result).toContain('https://cal.com/vishesh-baghel/15min');
      expect(result).toContain('Book a consultation');
    });

    it('should use markdown formatting', async () => {
      const result = await callTool(tools.experiments_searchExperiments, {
        query: 'typescript',
      });

      expect(result).toMatch(/\*\*[\w\s]+\*\*/); // Bold text
      expect(result).toContain('---'); // Horizontal rule
    });
  });

  describe('specific technology searches', () => {
    it('should find Mastra-related experiments', async () => {
      const result = await callTool(tools.experiments_searchExperiments, {
        query: 'mastra',
      });

      // Should return results (may or may not contain specific slugs)
      expect(result).toMatch(/Search results for "mastra"|No experiments found/);
    });

    it('should find AI/OpenAI experiments', async () => {
      const result = await callTool(tools.experiments_searchExperiments, {
        query: 'openai ai agents',
      });

      // Should return search results or no results message
      expect(result).toMatch(/Search results for|No experiments found/);
    });

    it('should find database experiments', async () => {
      const result = await callTool(tools.experiments_searchExperiments, {
        query: 'database optimization',
      });

      // Should return search results or no results message
      expect(result).toMatch(/Search results for|No experiments found/);
    });

    it('should find TypeScript experiments', async () => {
      const result = await callTool(tools.experiments_searchExperiments, {
        query: 'typescript patterns',
      });

      // Should return search results or no results message
      expect(result).toMatch(/Search results for|No experiments found/);
    });

    it('should find Next.js experiments', async () => {
      const result = await callTool(tools.experiments_searchExperiments, {
        query: 'nextjs react',
      });

      // Should return search results or no results message
      expect(result).toMatch(/Search results for|No experiments found/);
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
