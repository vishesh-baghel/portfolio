# Architecture Notes - Following Mastra's MCP Docs Server Pattern

## The `__dirname` Problem & Solution

### The Problem
When building ESM modules that get bundled together, declaring `const __dirname` in multiple files causes:
```
SyntaxError: Identifier '__dirname' has already been declared
```

This happens because:
1. Multiple files declare `const __dirname = dirname(fileURLToPath(import.meta.url))`
2. Bundler (tsup) combines them into one file
3. JavaScript doesn't allow the same `const` to be declared twice

### Mastra's Solution ✅

**Single Declaration Pattern:**
1. Declare `__dirname` in ONE file only (`utils/path-helpers.ts`)
2. Export helper functions from that file
3. All other files IMPORT these helpers

**File Structure:**

```
src/
├── utils/
│   └── path-helpers.ts      # ONLY file with __dirname
├── config.ts                 # Imports fromRepoRoot
├── loaders/
│   └── content-loader.ts     # Uses EXPERIMENTS_DIR from config
└── tools/
    └── *.ts                  # Use config constants
```

### Our Implementation

**`src/utils/path-helpers.ts`** - Single source of truth:
```typescript
const __dirname = dirname(fileURLToPath(import.meta.url));

export function fromRepoRoot(relative: string) {
  return path.resolve(__dirname, `../../../../`, relative);
}

export function fromPackageRoot(relative: string) {
  return path.resolve(__dirname, `../../`, relative);
}
```

**`src/config.ts`** - Imports, doesn't declare:
```typescript
import { fromRepoRoot } from './utils/path-helpers.js';

export const EXPERIMENTS_DIR = fromRepoRoot('src/content/experiments');
```

### Path Resolution

When code runs from `dist/chunk-xxx.js`:

```
__dirname location: dist/chunk-xxx.js
  ↓
fromRepoRoot('src/content/experiments')
  ↓
path.resolve(__dirname, '../../../../', 'src/content/experiments')
  ↓
dist/ → packages/experiments-mcp/ → portfolio/ → src/content/experiments/
```

## Comparison with Mastra

### Mastra's Structure
```
packages/mcp-docs-server/
├── src/
│   ├── utils.ts              # __dirname declared here
│   └── tools/
│       ├── docs.ts           # imports fromPackageRoot
│       └── examples.ts       # imports fromPackageRoot
```

### Our Structure (Matching)
```
packages/experiments-mcp/
├── src/
│   ├── utils/
│   │   └── path-helpers.ts   # __dirname declared here
│   ├── config.ts             # imports fromRepoRoot
│   └── tools/
│       └── *.ts              # use config constants
```

## Key Takeaways

1. ✅ **Never declare `__dirname` in multiple files**
2. ✅ **Create helper functions in a single utils file**
3. ✅ **Import helpers, don't recreate them**
4. ✅ **Use consistent path resolution strategy**

## Testing Path Resolution

To verify paths work correctly:

```typescript
// In content-loader.ts
console.log('[ContentLoader] Attempting to read from:', this.experimentsDir);
```

Should output:
```
/home/vishesh.baghel/Documents/workspace/portfolio/src/content/experiments
```

---

*Last updated: 2025-01-07*  
*Pattern source: @mastra/mcp-docs-server*
