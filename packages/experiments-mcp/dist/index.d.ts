import { MCPServer } from '@mastra/mcp';
import { z } from 'zod';

declare const server: MCPServer;
declare function runServer(): Promise<void>;

declare const ExperimentCategory: z.ZodEnum<["all", "getting-started", "ai-agents", "backend-database", "typescript-patterns", "optimizations"]>;
type ExperimentCategory = z.infer<typeof ExperimentCategory>;
declare const ExperimentMetadata: z.ZodObject<{
    title: z.ZodString;
    slug: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    category: z.ZodEnum<["getting-started", "ai-agents", "backend-database", "typescript-patterns", "optimizations"]>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    date: z.ZodOptional<z.ZodString>;
    author: z.ZodDefault<z.ZodString>;
    ossProject: z.ZodOptional<z.ZodString>;
    prLink: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    title: string;
    slug: string;
    category: "getting-started" | "ai-agents" | "backend-database" | "typescript-patterns" | "optimizations";
    author: string;
    description?: string | undefined;
    tags?: string[] | undefined;
    date?: string | undefined;
    ossProject?: string | undefined;
    prLink?: string | undefined;
}, {
    title: string;
    slug: string;
    category: "getting-started" | "ai-agents" | "backend-database" | "typescript-patterns" | "optimizations";
    description?: string | undefined;
    tags?: string[] | undefined;
    date?: string | undefined;
    author?: string | undefined;
    ossProject?: string | undefined;
    prLink?: string | undefined;
}>;
type ExperimentMetadata = z.infer<typeof ExperimentMetadata>;
declare const ListExperimentsInput: z.ZodObject<{
    category: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    category?: string | undefined;
}, {
    category?: string | undefined;
}>;
type ListExperimentsInput = z.infer<typeof ListExperimentsInput>;
declare const GetExperimentInput: z.ZodObject<{
    slug: z.ZodString;
    includeMetadata: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    slug: string;
    includeMetadata?: boolean | undefined;
}, {
    slug: string;
    includeMetadata?: boolean | undefined;
}>;
type GetExperimentInput = z.infer<typeof GetExperimentInput>;
declare const SearchExperimentsInput: z.ZodObject<{
    query: z.ZodString;
    maxResults: z.ZodOptional<z.ZodNumber>;
    categories: z.ZodOptional<z.ZodArray<z.ZodEnum<["getting-started", "ai-agents", "backend-database", "typescript-patterns", "optimizations"]>, "many">>;
}, "strip", z.ZodTypeAny, {
    query: string;
    maxResults?: number | undefined;
    categories?: ("getting-started" | "ai-agents" | "backend-database" | "typescript-patterns" | "optimizations")[] | undefined;
}, {
    query: string;
    maxResults?: number | undefined;
    categories?: ("getting-started" | "ai-agents" | "backend-database" | "typescript-patterns" | "optimizations")[] | undefined;
}>;
type SearchExperimentsInput = z.infer<typeof SearchExperimentsInput>;
declare const ExperimentListItem: z.ZodObject<{
    slug: z.ZodString;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    category: z.ZodString;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    title: string;
    slug: string;
    category: string;
    description?: string | undefined;
    tags?: string[] | undefined;
}, {
    title: string;
    slug: string;
    category: string;
    description?: string | undefined;
    tags?: string[] | undefined;
}>;
type ExperimentListItem = z.infer<typeof ExperimentListItem>;
declare const ExperimentContent: z.ZodObject<{
    metadata: z.ZodOptional<z.ZodObject<{
        title: z.ZodString;
        slug: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        category: z.ZodEnum<["getting-started", "ai-agents", "backend-database", "typescript-patterns", "optimizations"]>;
        tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        date: z.ZodOptional<z.ZodString>;
        author: z.ZodDefault<z.ZodString>;
        ossProject: z.ZodOptional<z.ZodString>;
        prLink: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        title: string;
        slug: string;
        category: "getting-started" | "ai-agents" | "backend-database" | "typescript-patterns" | "optimizations";
        author: string;
        description?: string | undefined;
        tags?: string[] | undefined;
        date?: string | undefined;
        ossProject?: string | undefined;
        prLink?: string | undefined;
    }, {
        title: string;
        slug: string;
        category: "getting-started" | "ai-agents" | "backend-database" | "typescript-patterns" | "optimizations";
        description?: string | undefined;
        tags?: string[] | undefined;
        date?: string | undefined;
        author?: string | undefined;
        ossProject?: string | undefined;
        prLink?: string | undefined;
    }>>;
    content: z.ZodString;
    attribution: z.ZodString;
}, "strip", z.ZodTypeAny, {
    content: string;
    attribution: string;
    metadata?: {
        title: string;
        slug: string;
        category: "getting-started" | "ai-agents" | "backend-database" | "typescript-patterns" | "optimizations";
        author: string;
        description?: string | undefined;
        tags?: string[] | undefined;
        date?: string | undefined;
        ossProject?: string | undefined;
        prLink?: string | undefined;
    } | undefined;
}, {
    content: string;
    attribution: string;
    metadata?: {
        title: string;
        slug: string;
        category: "getting-started" | "ai-agents" | "backend-database" | "typescript-patterns" | "optimizations";
        description?: string | undefined;
        tags?: string[] | undefined;
        date?: string | undefined;
        author?: string | undefined;
        ossProject?: string | undefined;
        prLink?: string | undefined;
    } | undefined;
}>;
type ExperimentContent = z.infer<typeof ExperimentContent>;
declare const SearchResult: z.ZodObject<{
    slug: z.ZodString;
    title: z.ZodString;
    relevance: z.ZodNumber;
    matchedTerms: z.ZodArray<z.ZodString, "many">;
    excerpt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    title: string;
    slug: string;
    relevance: number;
    matchedTerms: string[];
    excerpt: string;
}, {
    title: string;
    slug: string;
    relevance: number;
    matchedTerms: string[];
    excerpt: string;
}>;
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
 * This includes OSS credentials and CTA for consultations with UTM tracking
 */
declare function generateAttribution(metadata: ExperimentMetadata): string;

/**
 * Search experiments by keywords and rank by relevance
 * Following Mastra's pattern of semantic search with relevance scoring
 */
declare function searchExperiments(experiments: ExperimentListItem[], contentsMap: Map<string, ExperimentContent>, query: string, maxResults?: number): SearchResult[];

export { ContentLoader, ExperimentCategory, ExperimentContent, ExperimentListItem, ExperimentMetadata, ExperimentNotFoundError, GetExperimentInput, InvalidCategoryError, ListExperimentsInput, SearchExperimentsInput, SearchResult, contentLoader, generateAttribution, runServer, searchExperiments, server };
