/**
 * @vishesh/experiments
 * Production-ready integration patterns via MCP
 * 
 * Access battle-tested code from OSS contributions directly in your IDE.
 */

export { runServer, server } from './server.js';
export { contentLoader, ContentLoader } from './loaders/content-loader.js';
export { generateAttribution } from './utils/attribution.js';
export { searchExperiments } from './utils/search.js';

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
} from './types.js';

// Export error classes
export { ExperimentNotFoundError, InvalidCategoryError } from './types.js';
