import { z } from 'zod';

// Category enum matching portfolio structure
export const ExperimentCategory = z.enum([
  'all',
  'getting-started',
  'ai-agents',
  'backend-database',
  'typescript-patterns',
]);

// Experiment metadata schema
export const ExperimentMetadata = z.object({
  title: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  category: ExperimentCategory.exclude(['all']),
  tags: z.array(z.string()).optional(),
  date: z.string().optional(),
  author: z.string().default('Vishesh Baghel'),
  ossProject: z.string().optional(),
  prLink: z.string().url().optional(),
});

// List experiments input
export const ListExperimentsInput = z.object({
  category: ExperimentCategory.optional().default('all'),
});

// Get experiment input
export const GetExperimentInput = z.object({
  slug: z.string().describe('Experiment slug (use listExperiments to see available slugs)'),
  includeMetadata: z.boolean().optional().default(true).describe('Include metadata like author, date, category'),
});

// Search experiments input
export const SearchExperimentsInput = z.object({
  query: z.string().describe('Search query (keywords, tech stack, problem description)'),
  maxResults: z.number().min(1).max(10).optional().describe('Maximum number of results to return (default: 5)'),
  categories: z.array(ExperimentCategory.exclude(['all'])).optional().describe('Filter by specific categories'),
});

// Output types
export const ExperimentListItem = z.object({
  slug: z.string(),
  title: z.string(),
  description: z.string().optional(),
  category: z.string(),
  tags: z.array(z.string()).optional(),
});

export const ExperimentContent = z.object({
  metadata: ExperimentMetadata.optional(),
  content: z.string(),
  attribution: z.string(),
});

export const SearchResult = z.object({
  slug: z.string(),
  title: z.string(),
  relevance: z.number().min(0).max(100),
  matchedTerms: z.array(z.string()),
  excerpt: z.string(),
});

// Type exports
export type ExperimentCategory = z.infer<typeof ExperimentCategory>;
export type ExperimentMetadata = z.infer<typeof ExperimentMetadata>;
export type ListExperimentsInput = z.infer<typeof ListExperimentsInput>;
export type GetExperimentInput = z.infer<typeof GetExperimentInput>;
export type SearchExperimentsInput = z.infer<typeof SearchExperimentsInput>;
export type ExperimentListItem = z.infer<typeof ExperimentListItem>;
export type ExperimentContent = z.infer<typeof ExperimentContent>;
export type SearchResult = z.infer<typeof SearchResult>;

// Error classes
export class ExperimentNotFoundError extends Error {
  constructor(slug: string, availableSlugs: string[]) {
    super(
      `Experiment "${slug}" not found.\n\nAvailable experiments:\n${availableSlugs.map(s => `- ${s}`).join('\n')}\n\nUse listExperiments to browse all patterns.`
    );
    this.name = 'ExperimentNotFoundError';
  }
}

export class InvalidCategoryError extends Error {
  constructor(category: string) {
    super(
      `Invalid category "${category}".\n\nValid categories:\n- getting-started\n- ai-agents\n- backend-database\n- typescript-patterns\n- all (default)`
    );
    this.name = 'InvalidCategoryError';
  }
}
