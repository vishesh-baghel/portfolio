import { SearchExperimentsInput } from '../types.js';
import { contentLoader } from '../loaders/content-loader.js';
import { searchExperiments } from '../utils/search.js';

/**
 * Search Experiments Tool
 * Keyword-based search across all experiments with relevance ranking
 */
export const searchExperimentsTool = {
  name: 'searchExperiments',
  description: `Search experiments by keywords, technologies, or patterns.
    Returns relevant experiments matching the query with relevance scores.
    Useful when you know what you're looking for but not the exact experiment name.
    
    Search looks for matches in:
    - Experiment titles (highest priority)
    - Tags and categories
    - Descriptions
    - Content (lowest priority)
    
    Results are ranked by relevance with excerpts showing matched content.`,
  parameters: SearchExperimentsInput,
  execute: async (args: SearchExperimentsInput): Promise<string> => {
    try {
      const { query, maxResults = 5, categories } = args;

      // Load all experiments
      let allExperiments = await contentLoader.loadAll();

      // Filter by categories if specified
      if (categories && categories.length > 0) {
        allExperiments = allExperiments.filter(exp => categories.includes(exp.category as any));
      }

      if (allExperiments.length === 0) {
        return 'No experiments available to search.';
      }

      // Load content for search (needed for full-text search)
      const contentsMap = new Map();
      for (const exp of allExperiments) {
        try {
          const content = await contentLoader.loadContent(exp.slug, false);
          contentsMap.set(exp.slug, content);
        } catch {
          // Skip experiments that fail to load
          continue;
        }
      }

      // Perform search
      const results = searchExperiments(allExperiments, contentsMap, query, maxResults);

      if (results.length === 0) {
        let output = `No experiments found matching "${query}".\n\n`;
        output += 'Try:\n';
        output += '- Using different keywords\n';
        output += '- Using listExperiments to browse all patterns\n';
        output += '- Searching for specific technologies (e.g., "mastra", "postgresql", "typescript")\n';
        return output;
      }

      // Format results
      let output = `Search results for "${query}":\n\n`;

      results.forEach((result, index) => {
        output += `${index + 1}. **${result.title}** (Relevance: ${result.relevance}%)\n`;
        output += `   Slug: ${result.slug}\n`;
        
        if (result.matchedTerms.length > 0) {
          output += `   Matched: ${result.matchedTerms.join(', ')}\n`;
        }
        
        output += `   Excerpt: ${result.excerpt}\n`;
        output += `   → Use getExperiment('${result.slug}') for full content\n\n`;
      });

      output += '---\n';
      output += 'Need help implementing? Book a consultation: https://calendly.com/visheshbaghel99/30min\n';

      return output;
    } catch (error) {
      console.error('Error in searchExperiments:', error);
      throw new Error(`Failed to search experiments: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
};
