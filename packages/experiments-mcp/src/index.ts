/**
 * @vishesh/experiments
 * Production-ready integration patterns via MCP
 * 
 * Access battle-tested code from OSS contributions directly in your IDE.
 */

export { createServer } from './server';
export { contentLoader, ContentLoader } from './loaders/content-loader';
export { generateAttribution } from './utils/attribution';
export { searchExperiments } from './utils/search';

// Export types
export type {
  ExperimentCategory,
  ExperimentMetadata,
  ExperimentContent,
  ExperimentListItem,
  SearchResult,
  ListExperimentsInput,
  GetExperimentInput,
  SearchExperimentsInput,
} from './types';

// Export error classes
export { ExperimentNotFoundError, InvalidCategoryError } from './types';
