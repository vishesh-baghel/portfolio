import { MCPServer } from '@mastra/mcp';
import { z } from 'zod';

/**
 * Create and configure the Experiments MCP Server
 * Exposes Vishesh's integration patterns via Model Context Protocol
 */
declare function createServer(): MCPServer;

declare const ExperimentCategory: z.ZodEnum<{
    all: "all";
    "getting-started": "getting-started";
    "ai-agents": "ai-agents";
    "backend-database": "backend-database";
    "typescript-patterns": "typescript-patterns";
}>;
type ExperimentCategory = z.infer<typeof ExperimentCategory>;
declare const ExperimentMetadata: z.ZodObject<{
    title: z.ZodString;
    slug: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    category: z.ZodEnum<{
        "getting-started": "getting-started";
        "ai-agents": "ai-agents";
        "backend-database": "backend-database";
        "typescript-patterns": "typescript-patterns";
    }>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
    date: z.ZodOptional<z.ZodString>;
    author: z.ZodDefault<z.ZodString>;
    ossProject: z.ZodOptional<z.ZodString>;
    prLink: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
type ExperimentMetadata = z.infer<typeof ExperimentMetadata>;
declare const ListExperimentsInput: z.ZodObject<{
    category: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        all: "all";
        "getting-started": "getting-started";
        "ai-agents": "ai-agents";
        "backend-database": "backend-database";
        "typescript-patterns": "typescript-patterns";
    }>>>;
}, z.core.$strip>;
type ListExperimentsInput = z.infer<typeof ListExperimentsInput>;
declare const GetExperimentInput: z.ZodObject<{
    slug: z.ZodString;
    includeMetadata: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, z.core.$strip>;
type GetExperimentInput = z.infer<typeof GetExperimentInput>;
declare const SearchExperimentsInput: z.ZodObject<{
    query: z.ZodString;
    maxResults: z.ZodOptional<z.ZodNumber>;
    categories: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        "getting-started": "getting-started";
        "ai-agents": "ai-agents";
        "backend-database": "backend-database";
        "typescript-patterns": "typescript-patterns";
    }>>>;
}, z.core.$strip>;
type SearchExperimentsInput = z.infer<typeof SearchExperimentsInput>;
declare const ExperimentListItem: z.ZodObject<{
    slug: z.ZodString;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    category: z.ZodString;
    tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
type ExperimentListItem = z.infer<typeof ExperimentListItem>;
declare const ExperimentContent: z.ZodObject<{
    metadata: z.ZodOptional<z.ZodObject<{
        title: z.ZodString;
        slug: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        category: z.ZodEnum<{
            "getting-started": "getting-started";
            "ai-agents": "ai-agents";
            "backend-database": "backend-database";
            "typescript-patterns": "typescript-patterns";
        }>;
        tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
        date: z.ZodOptional<z.ZodString>;
        author: z.ZodDefault<z.ZodString>;
        ossProject: z.ZodOptional<z.ZodString>;
        prLink: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    content: z.ZodString;
    attribution: z.ZodString;
}, z.core.$strip>;
type ExperimentContent = z.infer<typeof ExperimentContent>;
declare const SearchResult: z.ZodObject<{
    slug: z.ZodString;
    title: z.ZodString;
    relevance: z.ZodNumber;
    matchedTerms: z.ZodArray<z.ZodString>;
    excerpt: z.ZodString;
}, z.core.$strip>;
type SearchResult = z.infer<typeof SearchResult>;
declare class ExperimentNotFoundError extends Error {
    constructor(slug: string, availableSlugs: string[]);
}
declare class InvalidCategoryError extends Error {
    constructor(category: string);
}

/**
 * Content loader for experiments
 * Reads MDX files, parses frontmatter, and caches results
 */
declare class ContentLoader {
    private cache;
    private metadataCache;
    private experimentsDir;
    constructor(experimentsDir?: string);
    /**
     * Load all experiment metadata (for listing)
     */
    loadAll(): Promise<ExperimentListItem[]>;
    /**
     * Load metadata for a single experiment file
     */
    loadMetadata(filename: string): Promise<ExperimentMetadata>;
    /**
     * Load full content for a specific experiment
     */
    loadContent(slug: string, includeMetadata?: boolean): Promise<ExperimentContent>;
    /**
     * Filter experiments by category
     */
    filterByCategory(category: string): Promise<ExperimentListItem[]>;
    /**
     * Get categorized experiments (grouped by category)
     */
    getCategorized(): Promise<Map<string, ExperimentListItem[]>>;
    /**
     * Clear cache (useful for testing or development)
     */
    clearCache(): void;
}
declare const contentLoader: ContentLoader;

/**
 * Generate attribution block to append to experiment content
 * This includes author info, OSS credentials, and CTA for consultations
 */
declare function generateAttribution(metadata: ExperimentMetadata): string;

/**
 * Search experiments by keywords and rank by relevance
 * Following Mastra's pattern of semantic search with relevance scoring
 */
declare function searchExperiments(experiments: ExperimentListItem[], contentsMap: Map<string, ExperimentContent>, query: string, maxResults?: number): SearchResult[];

export { ContentLoader, ExperimentCategory, ExperimentContent, ExperimentListItem, ExperimentMetadata, ExperimentNotFoundError, GetExperimentInput, InvalidCategoryError, ListExperimentsInput, SearchExperimentsInput, SearchResult, contentLoader, createServer, generateAttribution, searchExperiments };
