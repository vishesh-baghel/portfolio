import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import type { ExperimentContent, ExperimentListItem, ExperimentMetadata } from '../types.js';
import { ExperimentMetadata as ExperimentMetadataSchema, ExperimentNotFoundError } from '../types.js';
import { CATEGORY_TITLES, EXPERIMENTS_DIR } from '../config.js';
import { generateAttribution, formatMetadata } from '../utils/attribution.js';

/**
 * Content loader for experiments
 * Reads MDX files, parses frontmatter, and caches results
 */
export class ContentLoader {
  private cache: Map<string, ExperimentContent> = new Map();
  private metadataCache: Map<string, ExperimentMetadata> = new Map();
  private experimentsDir: string;

  constructor(experimentsDir: string = EXPERIMENTS_DIR) {
    this.experimentsDir = experimentsDir;
  }

  /**
   * Load all experiment metadata (for listing)
   */
  async loadAll(): Promise<ExperimentListItem[]> {
    try {
      const files = await fs.readdir(this.experimentsDir);
      const mdxFiles = files.filter(f => f.endsWith('.mdx'));

      const experiments: ExperimentListItem[] = [];

      for (const file of mdxFiles) {
        try {
          const metadata = await this.loadMetadata(file);
          experiments.push({
            slug: metadata.slug,
            title: metadata.title,
            description: metadata.description,
            category: metadata.category,
            tags: metadata.tags,
          });
        } catch (error) {
          console.warn(`Failed to load metadata for ${file}:`, error);
          // Continue with other files
        }
      }

      return experiments;
    } catch (error) {
      console.error('Failed to load experiments:', error);
      return [];
    }
  }

  /**
   * Load metadata for a single experiment file
   */
  async loadMetadata(filename: string): Promise<ExperimentMetadata> {
    const slug = filename.replace('.mdx', '');

    // Check cache
    if (this.metadataCache.has(slug)) {
      return this.metadataCache.get(slug)!;
    }

    const filePath = path.join(this.experimentsDir, filename);
    const content = await fs.readFile(filePath, 'utf-8');
    const { data } = matter(content);

    // Parse and validate with Zod
    const metadata = ExperimentMetadataSchema.parse({
      ...data,
      slug,
    });

    // Cache it
    this.metadataCache.set(slug, metadata);

    return metadata;
  }

  /**
   * Load full content for a specific experiment
   */
  async loadContent(slug: string, includeMetadata: boolean = true): Promise<ExperimentContent> {
    // Check cache
    const cacheKey = `${slug}-${includeMetadata}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const filename = `${slug}.mdx`;
    const filePath = path.join(this.experimentsDir, filename);

    // Check if file exists
    try {
      await fs.access(filePath);
    } catch {
      // File not found, provide helpful error
      const allExperiments = await this.loadAll();
      throw new ExperimentNotFoundError(
        slug,
        allExperiments.map(e => e.slug)
      );
    }

    const fileContent = await fs.readFile(filePath, 'utf-8');
    const { data, content: mdxContent } = matter(fileContent);

    // Parse metadata
    const metadata = ExperimentMetadataSchema.parse({ ...data, slug });

    // Build final content
    let finalContent = '';

    // Add formatted metadata at the top if requested
    if (includeMetadata) {
      const formattedMeta = formatMetadata(metadata);
      if (formattedMeta) {
        finalContent += formattedMeta;
      }
    }

    // Add main content
    finalContent += mdxContent;

    // Generate and append attribution
    const attribution = generateAttribution(metadata);
    finalContent += attribution;

    const result: ExperimentContent = {
      metadata: includeMetadata ? metadata : undefined,
      content: finalContent,
      attribution,
    };

    // Cache it
    this.cache.set(cacheKey, result);

    return result;
  }

  /**
   * Filter experiments by category
   */
  async filterByCategory(category: string): Promise<ExperimentListItem[]> {
    const all = await this.loadAll();

    if (category === 'all') {
      return all;
    }

    return all.filter(exp => exp.category === category);
  }

  /**
   * Get categorized experiments (grouped by category)
   */
  async getCategorized(): Promise<Map<string, ExperimentListItem[]>> {
    const all = await this.loadAll();
    const categorized = new Map<string, ExperimentListItem[]>();

    for (const experiment of all) {
      const category = experiment.category;
      if (!categorized.has(category)) {
        categorized.set(category, []);
      }
      categorized.get(category)!.push(experiment);
    }

    return categorized;
  }

  /**
   * Clear cache (useful for testing or development)
   */
  clearCache(): void {
    this.cache.clear();
    this.metadataCache.clear();
  }
}

// Export singleton instance
export const contentLoader = new ContentLoader();
