// Following Mastra's MCP docs server pattern
// Content is copied into .experiments/ directory during build
import { fromPackageRoot } from './utils/path-helpers';

// Path to experiments directory (bundled with package)
export const EXPERIMENTS_DIR = fromPackageRoot('.experiments');

// Site URLs (matching site-config.ts)
export const PORTFOLIO_URL = 'https://visheshbaghel.com';
export const EXPERIMENTS_URL = 'https://visheshbaghel.com/experiments';
export const CALENDER_URL = 'https://calendar.app.google/cHQgyAoBcQxDCFQn9'
export const GITHUB_URL = 'https://github.com/vishesh-baghel';
export const EMAIL = 'visheshbaghel99@gmail.com';

// Category mappings
export const CATEGORY_TITLES: Record<string, string> = {
  'getting-started': 'Getting Started',
  'ai-agents': 'AI & Agents',
  'backend-database': 'Backend & Database',
  'typescript-patterns': 'TypeScript & Patterns',
};
