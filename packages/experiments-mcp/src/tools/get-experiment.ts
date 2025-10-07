import { GetExperimentInput } from '../types.js';
import { contentLoader } from '../loaders/content-loader.js';

/**
 * Get Experiment Tool
 * Fetch complete experiment content with code examples and attribution
 */
export const getExperimentTool = {
  name: 'getExperiment',
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
  parameters: GetExperimentInput,
  execute: async (args: GetExperimentInput): Promise<string> => {
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
};
