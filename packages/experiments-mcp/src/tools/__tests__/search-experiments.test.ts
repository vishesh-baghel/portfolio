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
        query: 'integration',
        maxResults: 2,
      });

      // Count numbered results
      const matches = result.match(/^\d+\./gm) || [];
      expect(matches.length).toBeLessThanOrEqual(2);
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
        query: 'openai',
        maxResults: 5,
      });

      // The experiment with "openai" in title should appear first
      const lines = result.split('\n');
      const firstResult = lines.find(line => line.match(/^1\./));
      expect(firstResult).toContain('openai');
    });

    it('should find experiments by technology stack', async () => {
      const result = await callTool(tools.experiments_searchExperiments, {
        query: 'postgresql',
      });

      expect(result).toContain('postgresql');
    });

    it('should find experiments by framework', async () => {
      const result = await callTool(tools.experiments_searchExperiments, {
        query: 'nextjs',
      });

      expect(result).toContain('nextjs');
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
        query: 'MASTRA',
      });
      const result2 = await callTool(tools.experiments_searchExperiments, {
        query: 'mastra',
      });

      // Should return similar results
      expect(result1).toContain('mastra');
      expect(result2).toContain('mastra');
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

      expect(result).toContain('https://calendly.com/visheshbaghel99/30min');
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

      expect(result).toContain('getting-started-with-mastra');
    });

    it('should find AI/OpenAI experiments', async () => {
      const result = await callTool(tools.experiments_searchExperiments, {
        query: 'openai ai agents',
      });

      expect(result).toContain('ai-agents');
    });

    it('should find database experiments', async () => {
      const result = await callTool(tools.experiments_searchExperiments, {
        query: 'database optimization',
      });

      expect(result).toContain('postgresql');
    });

    it('should find TypeScript experiments', async () => {
      const result = await callTool(tools.experiments_searchExperiments, {
        query: 'typescript patterns',
      });

      expect(result).toContain('typescript');
    });

    it('should find Next.js experiments', async () => {
      const result = await callTool(tools.experiments_searchExperiments, {
        query: 'nextjs react',
      });

      expect(result).toContain('nextjs');
    });
  });

  describe('performance', () => {
    it('should respond within reasonable time', async () => {
      const start = Date.now();
      await callTool(tools.experiments_searchExperiments, {
        query: 'integration patterns',
        maxResults: 5,
      });
      const duration = Date.now() - start;

      // First search might take longer (loads all experiments)
      expect(duration).toBeLessThan(500);
    });

    it('should be faster on subsequent searches', async () => {
      const start1 = Date.now();
      await callTool(tools.experiments_searchExperiments, {
        query: 'mastra',
      });
      const duration1 = Date.now() - start1;

      const start2 = Date.now();
      await callTool(tools.experiments_searchExperiments, {
        query: 'openai',
      });
      const duration2 = Date.now() - start2;

      // Second search should be faster (content already loaded)
      expect(duration2).toBeLessThan(duration1);
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
