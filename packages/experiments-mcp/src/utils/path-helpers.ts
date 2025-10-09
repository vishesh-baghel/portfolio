import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

// Following Mastra's MCP docs server pattern
// __dirname is declared ONLY here to avoid conflicts when bundling
const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Resolve path relative to repository root
 * @param relative - Path relative to repo root
 */
export function fromRepoRoot(relative: string) {
  return path.resolve(__dirname, `../../../`, relative);
}

/**
 * Resolve path relative to package root
 * @param relative - Path relative to package root
 */
export function fromPackageRoot(relative: string) {
  return path.resolve(__dirname, `../`, relative);
}
