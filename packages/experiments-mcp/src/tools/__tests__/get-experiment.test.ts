import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { callTool, mcp } from './test-setup';

describe('getExperiment tool', () => {
  let tools: any;

  beforeAll(async () => {
    tools = await mcp.getTools();
  });

  afterAll(async () => {
    await mcp.disconnect();
  });

  describe('fetch experiment content', () => {
    it('should return full content for valid experiment slug', async () => {
      const result = await callTool(tools.experiments_getExperiment, {
        slug: 'ai-agents-with-openai',
        includeMetadata: true,
      });

      expect(result).toBeTruthy();
      expect(result.length).toBeGreaterThan(100);
    });

    it('should include metadata when requested', async () => {
      const result = await callTool(tools.experiments_getExperiment, {
        slug: 'getting-started-with-mastra',
        includeMetadata: true,
      });

      // Should contain metadata fields
      expect(result).toMatch(/\*\*Title\*\*:|Title:/i);
      expect(result).toMatch(/\*\*Category\*\*:|Category:/i);
    });

    it('should exclude metadata when not requested', async () => {
      const result = await callTool(tools.experiments_getExperiment, {
        slug: 'getting-started-with-mastra',
        includeMetadata: false,
      });

      // Should still have content but less metadata
      expect(result).toBeTruthy();
    });

    it('should default to including metadata', async () => {
      const result = await callTool(tools.experiments_getExperiment, {
        slug: 'getting-started-with-mastra',
      });

      expect(result).toMatch(/\*\*Title\*\*:|Title:/i);
    });
  });

  describe('attribution block', () => {
    it('should always include attribution at the end', async () => {
      const result = await callTool(tools.experiments_getExperiment, {
        slug: 'ai-agents-with-openai',
      });

      expect(result).toContain('---');
      expect(result).toContain('About This Pattern');
      expect(result).toContain('Production code from OSS');
    });

    it('should include calendar booking link', async () => {
      const result = await callTool(tools.experiments_getExperiment, {
        slug: 'postgresql-optimization',
      });

      expect(result).toContain('calendar.app.google');
      expect(result).toContain('15‑min consult');
    });

    it('should include portfolio and GitHub links', async () => {
      const result = await callTool(tools.experiments_getExperiment, {
        slug: 'typescript-advanced-patterns',
      });

      expect(result).toContain('https://visheshbaghel.com');
      expect(result).toContain('https://github.com/vishesh-baghel');
    });

    it('should include OSS project link when available', async () => {
      const result = await callTool(tools.experiments_getExperiment, {
        slug: 'getting-started-with-mastra',
      });

      // This experiment should have OSS project info
      if (result.includes('OSS Project') || result.includes('PR Link')) {
        expect(result).toMatch(/https?:\/\//);
      }
    });
  });

  describe('error handling', () => {
    it('should throw helpful error for non-existent experiment', async () => {
      await expect(
        callTool(tools.experiments_getExperiment, {
          slug: 'nonexistent-experiment',
        })
      ).rejects.toThrow(/not found/i);
    });

    it('should suggest available experiments on error', async () => {
      try {
        await callTool(tools.experiments_getExperiment, {
          slug: 'invalid-slug-xyz',
        });
      } catch (error: any) {
        expect(error.message).toContain('Available experiments:');
        expect(error.message).toContain('ai-agents-with-openai');
        expect(error.message).toContain('Use listExperiments');
      }
    });

    it('should handle empty slug gracefully', async () => {
      await expect(
        callTool(tools.experiments_getExperiment, {
          slug: '',
        })
      ).rejects.toThrow();
    });
  });

  describe('content quality', () => {
    it('should include code examples', async () => {
      const result = await callTool(tools.experiments_getExperiment, {
        slug: 'ai-agents-with-openai',
      });

      // Should have code blocks
      expect(result).toMatch(/```[\w]*\n/);
    });

    it('should preserve markdown formatting', async () => {
      const result = await callTool(tools.experiments_getExperiment, {
        slug: 'building-with-nextjs-15',
      });

      // Check for markdown elements
      expect(result).toMatch(/^#+ /m); // Headers
      expect(result).toMatch(/\*\*[\w\s]+\*\*/); // Bold text
      expect(result).toMatch(/```/); // Code blocks
    });

    it('should include frontmatter data in formatted way', async () => {
      const result = await callTool(tools.experiments_getExperiment, {
        slug: 'postgresql-optimization',
        includeMetadata: true,
      });

      // Should have formatted metadata, not raw frontmatter
      expect(result).not.toContain('---\ntitle:');
      expect(result).toMatch(/\*\*Title\*\*:|Title:/i);
    });
  });

  describe('all known experiments', () => {
    const knownSlugs = [
      'ai-agents-with-openai',
      'building-with-nextjs-15',
      'getting-started-with-mastra',
      'postgresql-optimization',
      'typescript-advanced-patterns',
    ];

    knownSlugs.forEach(slug => {
      it(`should successfully load ${slug}`, async () => {
        const result = await callTool(tools.experiments_getExperiment, { slug });
        expect(result).toBeTruthy();
        expect(result.length).toBeGreaterThan(100);
        expect(result).toContain('Vishesh Baghel');
      });
    });
  });

  describe('performance', () => {
    it('should cache experiment content', async () => {
      const start1 = Date.now();
      await callTool(tools.experiments_getExperiment, {
        slug: 'ai-agents-with-openai',
      });
      const duration1 = Date.now() - start1;

      const start2 = Date.now();
      await callTool(tools.experiments_getExperiment, {
        slug: 'ai-agents-with-openai',
      });
      const duration2 = Date.now() - start2;

      // Second call should be significantly faster
      expect(duration2).toBeLessThan(duration1);
    });

    it('should respond within reasonable time', async () => {
      const start = Date.now();
      await callTool(tools.experiments_getExperiment, {
        slug: 'getting-started-with-mastra',
      });
      const duration = Date.now() - start;

      // Should respond within 200ms (first call, including file I/O)
      expect(duration).toBeLessThan(200);
    });
  });
});
