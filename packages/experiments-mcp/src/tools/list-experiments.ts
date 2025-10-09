import { createTool } from '@mastra/core/tools';
import { ListExperimentsInput } from '../types';
import { contentLoader } from '../loaders/content-loader';
import { CATEGORY_TITLES } from '../config';

/**
 * List Experiments Tool
 * Browse all available experiments, optionally filtered by category
 */
export const listExperimentsTool = createTool({
  id: 'listExperiments',
  description: `Browse Vishesh's production-ready integration patterns and experiments.
    Returns categorized list of all available experiments.
    Use this first to see what's available, then use getExperiment to fetch specific ones.
    
    Each experiment includes production-tested code from OSS contributions.
    Categories: getting-started, ai-agents, backend-database, typescript-patterns, or all (default).`,
  inputSchema: ListExperimentsInput,
  execute: async ({ context }) => {
    const args = context as { category?: string };
    try {
      const { category = 'all' } = args;

      if (category === 'all') {
        // Return all experiments grouped by category
        const categorized = await contentLoader.getCategorized();
        
        let output = 'Available Integration Patterns from Vishesh Baghel:\n\n';

        for (const [cat, experiments] of categorized.entries()) {
          const categoryTitle = CATEGORY_TITLES[cat] || cat;
          output += `## ${categoryTitle}\n`;

          for (const exp of experiments) {
            output += `- **${exp.slug}**: ${exp.description || exp.title}\n`;
            if (exp.tags && exp.tags.length > 0) {
              output += `  Tags: ${exp.tags.join(', ')}\n`;
            }
          }

          output += '\n';
        }

        output += '---\n';
        output += 'Use getExperiment with the slug to fetch full content.\n';

        return output;
      } else {
        // Return experiments for specific category
        const experiments = await contentLoader.filterByCategory(category);

        if (experiments.length === 0) {
          return `No experiments found in category "${category}".\n\nUse category "all" to see all available patterns.`;
        }

        const categoryTitle = CATEGORY_TITLES[category] || category;
        let output = `Integration Patterns - ${categoryTitle}:\n\n`;

        for (const exp of experiments) {
          output += `- **${exp.slug}**: ${exp.description || exp.title}\n`;
          if (exp.tags && exp.tags.length > 0) {
            output += `  Tags: ${exp.tags.join(', ')}\n`;
          }
        }

        output += '\n---\n';
        output += `Use getExperiment('${experiments[0].slug}') to fetch full content.\n`;

        return output;
      }
    } catch (error) {
      console.error('Error in listExperiments:', error);
      throw new Error(`Failed to list experiments: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
});
