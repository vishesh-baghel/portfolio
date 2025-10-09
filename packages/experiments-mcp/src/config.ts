// Following Mastra's MCP docs server pattern
// Content is copied into .experiments/ directory during build
import { fromPackageRoot } from './utils/path-helpers.js';

// Path to experiments directory (bundled with package)
export const EXPERIMENTS_DIR = fromPackageRoot('.experiments');

// Site URLs (matching site-config.ts)
export const PORTFOLIO_URL = 'https://vishesh.dev';
export const EXPERIMENTS_URL = 'https://vishesh.dev/experiments';
export const CALENDLY_URL = 'https://calendly.com/visheshbaghel99/30min';
export const GITHUB_URL = 'https://github.com/vishesh-baghel';
export const EMAIL = 'visheshbaghel99@gmail.com';

// Author info
export const AUTHOR_NAME = 'Vishesh Baghel';

// Maintainer endorsement quote
export const ENDORSEMENT_QUOTE = '"Vishesh built high-quality integrations for Mastra. Happy to refer him."';
export const ENDORSEMENT_AUTHOR = 'Dax, Mastra CTO';

// Category mappings
export const CATEGORY_TITLES: Record<string, string> = {
  'getting-started': 'Getting Started',
  'ai-agents': 'AI & Agents',
  'backend-database': 'Backend & Database',
  'typescript-patterns': 'TypeScript & Patterns',
};
