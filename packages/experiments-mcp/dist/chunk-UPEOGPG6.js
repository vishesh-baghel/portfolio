// src/types.ts
import { z } from "zod";
var ExperimentCategory = z.enum([
  "all",
  "getting-started",
  "ai-agents",
  "backend-database",
  "typescript-patterns"
]);
var ExperimentMetadata = z.object({
  title: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  category: ExperimentCategory.exclude(["all"]),
  tags: z.array(z.string()).optional(),
  date: z.string().optional(),
  author: z.string().default("Vishesh Baghel"),
  ossProject: z.string().optional(),
  prLink: z.string().url().optional()
});
var ListExperimentsInput = z.object({
  category: ExperimentCategory.optional().default("all")
});
var GetExperimentInput = z.object({
  slug: z.string().describe("Experiment slug (use listExperiments to see available slugs)"),
  includeMetadata: z.boolean().optional().default(true).describe("Include metadata like author, date, category")
});
var SearchExperimentsInput = z.object({
  query: z.string().describe("Search query (keywords, tech stack, problem description)"),
  maxResults: z.number().min(1).max(10).optional().default(5).describe("Maximum number of results to return"),
  categories: z.array(ExperimentCategory.exclude(["all"])).optional().describe("Filter by specific categories")
});
var ExperimentListItem = z.object({
  slug: z.string(),
  title: z.string(),
  description: z.string().optional(),
  category: z.string(),
  tags: z.array(z.string()).optional()
});
var ExperimentContent = z.object({
  metadata: ExperimentMetadata.optional(),
  content: z.string(),
  attribution: z.string()
});
var SearchResult = z.object({
  slug: z.string(),
  title: z.string(),
  relevance: z.number().min(0).max(100),
  matchedTerms: z.array(z.string()),
  excerpt: z.string()
});
var ExperimentNotFoundError = class extends Error {
  constructor(slug, availableSlugs) {
    super(
      `Experiment "${slug}" not found.

Available experiments:
${availableSlugs.map((s) => `- ${s}`).join("\n")}

Use listExperiments to browse all patterns.`
    );
    this.name = "ExperimentNotFoundError";
  }
};
var InvalidCategoryError = class extends Error {
  constructor(category) {
    super(
      `Invalid category "${category}".

Valid categories:
- getting-started
- ai-agents
- backend-database
- typescript-patterns
- all (default)`
    );
    this.name = "InvalidCategoryError";
  }
};

// src/config.ts
import path from "path";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var EXPERIMENTS_DIR = path.resolve(__dirname, "../../../src/content/experiments");
var PORTFOLIO_URL = "https://vishesh.dev";
var EXPERIMENTS_URL = "https://vishesh.dev/experiments";
var CALENDLY_URL = "https://calendly.com/visheshbaghel99/30min";
var GITHUB_URL = "https://github.com/vishesh-baghel";
var AUTHOR_NAME = "Vishesh Baghel";
var ENDORSEMENT_QUOTE = '"Vishesh built high-quality integrations for Mastra. Happy to refer him."';
var ENDORSEMENT_AUTHOR = "Dax, Mastra CTO";
var CATEGORY_TITLES = {
  "getting-started": "Getting Started",
  "ai-agents": "AI & Agents",
  "backend-database": "Backend & Database",
  "typescript-patterns": "TypeScript & Patterns"
};

// src/utils/attribution.ts
function generateAttribution(metadata) {
  let attribution = "\n\n---\n\n";
  attribution += "## \u{1F4DA} About This Pattern\n\n";
  attribution += `**Author**: ${AUTHOR_NAME}  
`;
  if (metadata.ossProject) {
    attribution += `**Source**: Production code from ${metadata.ossProject}`;
    if (metadata.prLink) {
      attribution += ` ([View PR](${metadata.prLink}))`;
    }
    attribution += "  \n";
  } else {
    attribution += `**Source**: Production code from OSS contributions  
`;
  }
  attribution += `**Portfolio**: ${PORTFOLIO_URL}  
`;
  attribution += `**All Integrations**: ${EXPERIMENTS_URL}  
`;
  attribution += "\n";
  attribution += "**Need custom integration for your project?**  \n";
  attribution += "I build production-ready integrations for AI frameworks, databases, and APIs.\n\n";
  attribution += `\u2192 [Book free consultation](${CALENDLY_URL})  
`;
  attribution += `\u2192 [View all patterns](${EXPERIMENTS_URL})  
`;
  attribution += `\u2192 [GitHub](${GITHUB_URL})  
`;
  attribution += "\n";
  attribution += `*${ENDORSEMENT_QUOTE}*  
`;
  attribution += `\u2014 ${ENDORSEMENT_AUTHOR}
`;
  return attribution;
}
function formatMetadata(metadata) {
  let formatted = "";
  if (metadata.ossProject) {
    formatted += `> **OSS Project**: ${metadata.ossProject}
`;
  }
  if (metadata.prLink) {
    formatted += `> **Pull Request**: ${metadata.prLink}
`;
  }
  if (metadata.tags && metadata.tags.length > 0) {
    formatted += `> **Tags**: ${metadata.tags.join(", ")}
`;
  }
  if (metadata.date) {
    formatted += `> **Published**: ${metadata.date}
`;
  }
  if (formatted) {
    formatted += "\n";
  }
  return formatted;
}

// src/loaders/content-loader.ts
import fs from "fs/promises";
import path2 from "path";
import matter from "gray-matter";
var ContentLoader = class {
  cache = /* @__PURE__ */ new Map();
  metadataCache = /* @__PURE__ */ new Map();
  experimentsDir;
  constructor(experimentsDir = EXPERIMENTS_DIR) {
    this.experimentsDir = experimentsDir;
  }
  /**
   * Load all experiment metadata (for listing)
   */
  async loadAll() {
    try {
      const files = await fs.readdir(this.experimentsDir);
      const mdxFiles = files.filter((f) => f.endsWith(".mdx"));
      const experiments = [];
      for (const file of mdxFiles) {
        try {
          const metadata = await this.loadMetadata(file);
          experiments.push({
            slug: metadata.slug,
            title: metadata.title,
            description: metadata.description,
            category: metadata.category,
            tags: metadata.tags
          });
        } catch (error) {
          console.warn(`Failed to load metadata for ${file}:`, error);
        }
      }
      return experiments;
    } catch (error) {
      console.error("Failed to load experiments:", error);
      return [];
    }
  }
  /**
   * Load metadata for a single experiment file
   */
  async loadMetadata(filename) {
    const slug = filename.replace(".mdx", "");
    if (this.metadataCache.has(slug)) {
      return this.metadataCache.get(slug);
    }
    const filePath = path2.join(this.experimentsDir, filename);
    const content = await fs.readFile(filePath, "utf-8");
    const { data } = matter(content);
    const metadata = ExperimentMetadata.parse({
      ...data,
      slug
    });
    this.metadataCache.set(slug, metadata);
    return metadata;
  }
  /**
   * Load full content for a specific experiment
   */
  async loadContent(slug, includeMetadata = true) {
    const cacheKey = `${slug}-${includeMetadata}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }
    const filename = `${slug}.mdx`;
    const filePath = path2.join(this.experimentsDir, filename);
    try {
      await fs.access(filePath);
    } catch {
      const allExperiments = await this.loadAll();
      throw new ExperimentNotFoundError(
        slug,
        allExperiments.map((e) => e.slug)
      );
    }
    const fileContent = await fs.readFile(filePath, "utf-8");
    const { data, content: mdxContent } = matter(fileContent);
    const metadata = ExperimentMetadata.parse({ ...data, slug });
    let finalContent = "";
    if (includeMetadata) {
      const formattedMeta = formatMetadata(metadata);
      if (formattedMeta) {
        finalContent += formattedMeta;
      }
    }
    finalContent += mdxContent;
    const attribution = generateAttribution(metadata);
    finalContent += attribution;
    const result = {
      metadata: includeMetadata ? metadata : void 0,
      content: finalContent,
      attribution
    };
    this.cache.set(cacheKey, result);
    return result;
  }
  /**
   * Filter experiments by category
   */
  async filterByCategory(category) {
    const all = await this.loadAll();
    if (category === "all") {
      return all;
    }
    return all.filter((exp) => exp.category === category);
  }
  /**
   * Get categorized experiments (grouped by category)
   */
  async getCategorized() {
    const all = await this.loadAll();
    const categorized = /* @__PURE__ */ new Map();
    for (const experiment of all) {
      const category = experiment.category;
      if (!categorized.has(category)) {
        categorized.set(category, []);
      }
      categorized.get(category).push(experiment);
    }
    return categorized;
  }
  /**
   * Clear cache (useful for testing or development)
   */
  clearCache() {
    this.cache.clear();
    this.metadataCache.clear();
  }
};
var contentLoader = new ContentLoader();

// src/utils/search.ts
function searchExperiments(experiments, contentsMap, query, maxResults = 5) {
  const terms = query.toLowerCase().split(/\s+/).filter((t) => t.length > 0);
  if (terms.length === 0) {
    return [];
  }
  const scored = experiments.map((exp) => {
    const content = contentsMap.get(exp.slug);
    const text = content ? content.content.toLowerCase() : "";
    const tags = exp.tags?.join(" ").toLowerCase() || "";
    const title = exp.title.toLowerCase();
    const description = exp.description?.toLowerCase() || "";
    let score = 0;
    const matched = [];
    for (const term of terms) {
      if (title.includes(term)) {
        score += 10;
        if (!matched.includes(term)) matched.push(term);
      }
      if (tags.includes(term)) {
        score += 5;
        if (!matched.includes(term)) matched.push(term);
      }
      if (description.includes(term)) {
        score += 3;
        if (!matched.includes(term)) matched.push(term);
      }
      if (exp.category.toLowerCase().includes(term)) {
        score += 3;
        if (!matched.includes(term)) matched.push(term);
      }
      if (text.includes(term)) {
        score += 1;
        if (!matched.includes(term)) matched.push(term);
      }
    }
    if (matched.length > 1) {
      score += matched.length * 2;
    }
    const maxPossibleScore = terms.length * 10;
    const relevance = Math.min(100, Math.round(score / maxPossibleScore * 100));
    const excerpt = findExcerpt(text || description || title, matched[0] || terms[0]);
    return {
      slug: exp.slug,
      title: exp.title,
      relevance,
      matchedTerms: matched,
      excerpt
    };
  });
  return scored.filter((s) => s.relevance > 0).sort((a, b) => b.relevance - a.relevance).slice(0, maxResults);
}
function findExcerpt(content, term, contextLength = 150) {
  const index = content.toLowerCase().indexOf(term.toLowerCase());
  if (index === -1) {
    return content.slice(0, contextLength).trim() + "...";
  }
  const start = Math.max(0, index - contextLength / 2);
  const end = Math.min(content.length, index + contextLength / 2);
  let excerpt = content.slice(start, end).trim();
  if (start > 0) excerpt = "..." + excerpt;
  if (end < content.length) excerpt = excerpt + "...";
  return excerpt;
}

// src/server.ts
import { MCPServer } from "@mastra/mcp";

// src/tools/list-experiments.ts
var listExperimentsTool = {
  name: "listExperiments",
  description: `Browse Vishesh's production-ready integration patterns and experiments.
    Returns categorized list of all available experiments.
    Use this first to see what's available, then use getExperiment to fetch specific ones.
    
    Each experiment includes production-tested code from OSS contributions.
    Categories: getting-started, ai-agents, backend-database, typescript-patterns, or all (default).`,
  parameters: ListExperimentsInput,
  execute: async (args) => {
    try {
      const { category = "all" } = args;
      if (category === "all") {
        const categorized = await contentLoader.getCategorized();
        let output = "Available Integration Patterns from Vishesh Baghel:\n\n";
        for (const [cat, experiments] of categorized.entries()) {
          const categoryTitle = CATEGORY_TITLES[cat] || cat;
          output += `## ${categoryTitle}
`;
          for (const exp of experiments) {
            output += `- **${exp.slug}**: ${exp.description || exp.title}
`;
            if (exp.tags && exp.tags.length > 0) {
              output += `  Tags: ${exp.tags.join(", ")}
`;
            }
          }
          output += "\n";
        }
        output += "---\n";
        output += "Use getExperiment with the slug to fetch full content.\n";
        output += "All patterns are production-tested and maintainer-endorsed.\n";
        return output;
      } else {
        const experiments = await contentLoader.filterByCategory(category);
        if (experiments.length === 0) {
          return `No experiments found in category "${category}".

Use category "all" to see all available patterns.`;
        }
        const categoryTitle = CATEGORY_TITLES[category] || category;
        let output = `Integration Patterns - ${categoryTitle}:

`;
        for (const exp of experiments) {
          output += `- **${exp.slug}**: ${exp.description || exp.title}
`;
          if (exp.tags && exp.tags.length > 0) {
            output += `  Tags: ${exp.tags.join(", ")}
`;
          }
        }
        output += "\n---\n";
        output += `Use getExperiment('${experiments[0].slug}') to fetch full content.
`;
        return output;
      }
    } catch (error) {
      console.error("Error in listExperiments:", error);
      throw new Error(`Failed to list experiments: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }
};

// src/tools/get-experiment.ts
var getExperimentTool = {
  name: "getExperiment",
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
  execute: async (args) => {
    try {
      const { slug, includeMetadata = true } = args;
      const experiment = await contentLoader.loadContent(slug, includeMetadata);
      return experiment.content;
    } catch (error) {
      console.error("Error in getExperiment:", error);
      if (error instanceof Error && error.name === "ExperimentNotFoundError") {
        throw error;
      }
      throw new Error(`Failed to get experiment: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }
};

// src/tools/search-experiments.ts
var searchExperimentsTool = {
  name: "searchExperiments",
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
  execute: async (args) => {
    try {
      const { query, maxResults = 5, categories } = args;
      let allExperiments = await contentLoader.loadAll();
      if (categories && categories.length > 0) {
        allExperiments = allExperiments.filter((exp) => categories.includes(exp.category));
      }
      if (allExperiments.length === 0) {
        return "No experiments available to search.";
      }
      const contentsMap = /* @__PURE__ */ new Map();
      for (const exp of allExperiments) {
        try {
          const content = await contentLoader.loadContent(exp.slug, false);
          contentsMap.set(exp.slug, content);
        } catch {
          continue;
        }
      }
      const results = searchExperiments(allExperiments, contentsMap, query, maxResults);
      if (results.length === 0) {
        let output2 = `No experiments found matching "${query}".

`;
        output2 += "Try:\n";
        output2 += "- Using different keywords\n";
        output2 += "- Using listExperiments to browse all patterns\n";
        output2 += '- Searching for specific technologies (e.g., "mastra", "postgresql", "typescript")\n';
        return output2;
      }
      let output = `Search results for "${query}":

`;
      results.forEach((result, index) => {
        output += `${index + 1}. **${result.title}** (Relevance: ${result.relevance}%)
`;
        output += `   Slug: ${result.slug}
`;
        if (result.matchedTerms.length > 0) {
          output += `   Matched: ${result.matchedTerms.join(", ")}
`;
        }
        output += `   Excerpt: ${result.excerpt}
`;
        output += `   \u2192 Use getExperiment('${result.slug}') for full content

`;
      });
      output += "---\n";
      output += "Need help implementing? Book a consultation: https://calendly.com/visheshbaghel99/30min\n";
      return output;
    } catch (error) {
      console.error("Error in searchExperiments:", error);
      throw new Error(`Failed to search experiments: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }
};

// src/server.ts
function createServer() {
  const server = new MCPServer({
    name: "Vishesh Experiments Server",
    version: "1.0.0",
    tools: {
      listExperiments: listExperimentsTool,
      getExperiment: getExperimentTool,
      searchExperiments: searchExperimentsTool
    }
  });
  return server;
}

export {
  ExperimentNotFoundError,
  InvalidCategoryError,
  generateAttribution,
  ContentLoader,
  contentLoader,
  searchExperiments,
  createServer
};
