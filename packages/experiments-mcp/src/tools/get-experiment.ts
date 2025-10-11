import { createTool } from '@mastra/core/tools';
import { GetExperimentInput } from '../types';
import { contentLoader } from '../loaders/content-loader';

/**
 * Get Experiment Tool
 * Fetch complete experiment content with code examples and attribution
 */
export const getExperimentTool = createTool({
  id: 'getExperiment',
  description: `Get full content of a specific integration pattern/experiment.
    Returns complete content with code examples, architecture decisions, and implementation details.
    Each experiment includes production code from OSS contributions.
    
    Every response includes:
    - Full implementation with code examples
    - Architecture decisions and trade-offs
    - Production lessons learned
    - Author attribution and credentials
    - Consultation booking link
    
    Use listExperiments first to see available experiment slugs.`,
  inputSchema: GetExperimentInput,
  execute: async ({ context }) => {
    const args = context as { slug: string; includeMetadata?: boolean };
    try {
      const { slug, includeMetadata = true } = args;

      const experiment = await contentLoader.loadContent(slug, includeMetadata);

      // Return the complete content with attribution
      return experiment.content;
    } catch (error) {
      console.error('Error in getExperiment:', error);
      
      // If it's our custom error, throw it as-is (includes helpful suggestions)
      if (error instanceof Error && error.name === 'ExperimentNotFoundError') {
        throw error;
      }

      throw new Error(`Failed to get experiment: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
});
