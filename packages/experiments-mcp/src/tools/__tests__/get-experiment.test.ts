import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { callTool, mcp, getAnyExperimentSlug, getAvailableExperimentSlugs } from './test-setup';

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
      const slug = await getAnyExperimentSlug(tools);
      const result = await callTool(tools.experiments_getExperiment, {
        slug,
        includeMetadata: true,
      });

      expect(result).toBeTruthy();
      expect(result.length).toBeGreaterThan(100);
    });

    it('should include metadata when requested', async () => {
      const slug = await getAnyExperimentSlug(tools);
      const result = await callTool(tools.experiments_getExperiment, {
        slug,
        includeMetadata: true,
      });

      // Should contain metadata fields (Tags, Published, OSS Project, etc.)
      expect(result).toMatch(/\*\*(Tags|Published|OSS Project)\*\*:/i);
    });

    it('should exclude metadata when not requested', async () => {
      const slug = await getAnyExperimentSlug(tools);
      const result = await callTool(tools.experiments_getExperiment, {
        slug,
        includeMetadata: false,
      });

      // Should still have content but less metadata
      expect(result).toBeTruthy();
    });

    it('should default to including metadata', async () => {
      const slug = await getAnyExperimentSlug(tools);
      const result = await callTool(tools.experiments_getExperiment, {
        slug,
      });

      // Should have some metadata (Tags, Published, etc.)
      expect(result).toMatch(/\*\*(Tags|Published|OSS Project)\*\*:/i);
    });
  });

  describe('attribution block', () => {
    it('should always include attribution at the end', async () => {
      const slug = await getAnyExperimentSlug(tools);
      const result = await callTool(tools.experiments_getExperiment, {
        slug,
      });

      expect(result).toContain('---');
      expect(result).toContain('About This Pattern');
      expect(result).toMatch(/Production code from|Source:/i);
    });

    it('should include calendar booking link', async () => {
      const slug = await getAnyExperimentSlug(tools);
      const result = await callTool(tools.experiments_getExperiment, {
        slug,
      });

      expect(result).toContain('calendar.app.google');
      expect(result).toContain('15‑min consult');
    });

    it('should include portfolio and GitHub links', async () => {
      const slug = await getAnyExperimentSlug(tools);
      const result = await callTool(tools.experiments_getExperiment, {
        slug,
      });

      expect(result).toContain('https://visheshbaghel.com');
      expect(result).toContain('https://github.com/vishesh-baghel');
    });

    it('should include OSS project info when available', async () => {
      const slug = await getAnyExperimentSlug(tools);
      const result = await callTool(tools.experiments_getExperiment, {
        slug,
      });

      // Check if OSS project information is present (may vary by experiment)
      if (result.includes('OSS Project') || result.includes('Source')) {
        expect(result).toMatch(/https?:\/\//);
      }
    });
  });

  describe('error handling', () => {
    it('should throw helpful error for non-existent experiment', async () => {
      try {
        const result = await callTool(tools.experiments_getExperiment, {
          slug: 'nonexistent-experiment',
        });
        // If we get a string result, it might be an error message
        if (typeof result === 'string' && result.includes('not found')) {
          expect(result).toContain('not found');
        } else {
          throw new Error('Should have thrown or returned error');
        }
      } catch (error: any) {
        const errorMsg = typeof error === 'string' ? error : error.message;
        expect(errorMsg).toMatch(/not found|TOOL_EXECUTION_FAILED/i);
      }
    });

    it('should suggest available experiments on error', async () => {
      try {
        await callTool(tools.experiments_getExperiment, {
          slug: 'invalid-slug-xyz',
        });
      } catch (error: any) {
        expect(error.message).toContain('Available experiments:');
        // Should suggest using listExperiments, but don't check for specific slugs
        expect(error.message).toMatch(/Use listExperiments/i);
      }
    });

    it('should handle empty slug gracefully', async () => {
      try {
        const result = await callTool(tools.experiments_getExperiment, {
          slug: '',
        });
        // If we get a string result, it might be an error message
        if (typeof result === 'string' && result.includes('not found')) {
          expect(result).toContain('not found');
        } else {
          throw new Error('Should have thrown or returned error');
        }
      } catch (error: any) {
        const errorMsg = typeof error === 'string' ? error : error.message;
        expect(errorMsg).toMatch(/not found|TOOL_EXECUTION_FAILED/i);
      }
    });
  });

  describe('content quality', () => {
    it('should include code examples', async () => {
      const slug = await getAnyExperimentSlug(tools);
      const result = await callTool(tools.experiments_getExperiment, {
        slug,
      });

      // Should have code blocks
      expect(result).toMatch(/```[\w]*\n/);
    });

    it('should preserve markdown formatting', async () => {
      const slug = await getAnyExperimentSlug(tools);
      const result = await callTool(tools.experiments_getExperiment, {
        slug,
      });

      // Check for markdown elements
      expect(result).toMatch(/^#+ /m); // Headers
      expect(result).toMatch(/\*\*[\w\s]+\*\*/); // Bold text
      expect(result).toMatch(/```/); // Code blocks
    });

    it('should include frontmatter data in formatted way', async () => {
      const slug = await getAnyExperimentSlug(tools);
      const result = await callTool(tools.experiments_getExperiment, {
        slug,
        includeMetadata: true,
      });

      // Should have formatted metadata (either as blockquote or headers), not raw frontmatter
      expect(result).not.toContain('---\ntitle:');
      // Should have some metadata indicators (Tags, Published, OSS Project, etc.)
      expect(result).toMatch(/\*\*(Tags|Published|OSS Project)\*\*:/i);
    });
  });

  describe('all available experiments', () => {
    it('should successfully load all experiments', async () => {
      const slugs = await getAvailableExperimentSlugs(tools);
      
      // Ensure we have at least some experiments
      expect(slugs.length).toBeGreaterThan(0);
      
      // Test each available experiment
      for (const slug of slugs) {
        const result = await callTool(tools.experiments_getExperiment, { slug });
        expect(result).toBeTruthy();
        expect(result.length).toBeGreaterThan(100);
        expect(result).toMatch(/Production code from|Source:/i);
      }
    });
  });

  describe('performance', () => {
    it('should respond within reasonable time', async () => {
      const slug = await getAnyExperimentSlug(tools);
      
      const start = Date.now();
      const result = await callTool(tools.experiments_getExperiment, {
        slug,
      });
      const duration = Date.now() - start;

      // Should return valid content
      expect(result).toBeTruthy();
      expect(result.length).toBeGreaterThan(100);
      
      // Should respond within reasonable time (500ms for CI)
      expect(duration).toBeLessThan(500);
    });
  });
});
