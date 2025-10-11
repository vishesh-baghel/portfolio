# MCP Tool Format Fix (v0.0.4)

## The Problem

Even after fixing the JSON schemas in v0.0.3, Windsurf still showed validation errors:

```
Error: failed to validate tool input schema for tool: listExperiments: 
invalid JSON schema: jsonschema validation failed with 
'https://json-schema.org/draft/2020-12/schema#' - at '': allOf failed
```

Testing the published package showed **empty schemas**:

```bash
echo '{"jsonrpc":"2.0","id":2,"method":"tools/list"}' | \
  npx -y vishesh-experiments@0.0.3 2>/dev/null | \
  jq '.result.tools[0].inputSchema'

# Output:
{
  "$schema": "http://json-schema.org/draft-07/schema#"
}
# Schema is empty! No properties, no types, nothing.
```

## Root Cause

The issue was using `createTool()` from `@mastra/core`:

```typescript
// WRONG - Doesn't work with @mastra/mcp
import { createTool } from '@mastra/core/tools';

export const listExperimentsTool = createTool({
  id: 'listExperiments',
  inputSchema: ListExperimentsInput,  // This field is ignored by MCP!
  execute: async ({ context }) => {
    const args = context as { category?: string };
    // ...
  }
});
```

**Why this doesn't work:**
- `@mastra/mcp` expects tools to be plain objects
- The `createTool()` wrapper doesn't expose schemas in the format MCP needs
- The `inputSchema` field is not recognized by the MCP server
- Result: Empty schemas sent to clients

## The Solution

Use plain object format with `parameters` field (like `@mastra/mcp-docs-server`):

```typescript
// CORRECT - Works with @mastra/mcp
export const listExperimentsTool = {
  name: 'listExperiments',
  description: '...',
  parameters: ListExperimentsInput,  // Zod schema directly
  execute: async (args: { category?: string }) => {
    // Direct access to args, no context wrapper
    const { category = 'all' } = args;
    // ...
  }
};
```

**Key differences:**
1. Plain object, not `createTool()` wrapper
2. `parameters` field instead of `inputSchema`
3. `name` field instead of `id`
4. `execute` receives args directly, not wrapped in `{ context }`

## Verification

After the fix, schemas are properly generated:

```bash
echo '{"jsonrpc":"2.0","id":2,"method":"tools/list"}' | \
  node dist/stdio.js 2>/dev/null | \
  jq '.result.tools[0].inputSchema'

# Output:
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "category": {
      "description": "Category to filter by...",
      "type": "string"
    }
  },
  "additionalProperties": false
}
```

Perfect! Complete schema with properties and types.

## Why This Happened

**Architectural mismatch:**
- `@mastra/core` is designed for Mastra agents and workflows
- `@mastra/mcp` is designed for MCP protocol servers
- They have different tool formats!

**The confusion:**
- Both packages are from Mastra
- Both use Zod for validation
- But they expect different tool structures

**The lesson:**
- Always check reference implementations (`@mastra/mcp-docs-server`)
- Don't assume tools are interchangeable between packages
- Test the actual MCP protocol output, not just TypeScript types

## Pattern to Follow

When creating MCP tools with `@mastra/mcp`:

```typescript
import { z } from 'zod';

// 1. Define Zod schema
const InputSchema = z.object({
  param1: z.string().describe('Description'),
  param2: z.number().optional(),
});

// 2. Export as plain object
export const myTool = {
  name: 'myTool',
  description: 'What the tool does',
  parameters: InputSchema,  // Zod schema
  execute: async (args: z.infer<typeof InputSchema>) => {
    // Implementation
    return 'result';
  },
};

// 3. Register with MCPServer
const server = new MCPServer({
  name: 'My Server',
  version: '1.0.0',
  tools: {
    myTool,  // Plain object, not createTool()
  },
});
```

## Files Changed

All three tool files converted:
- `src/tools/list-experiments.ts`
- `src/tools/get-experiment.ts`
- `src/tools/search-experiments.ts`

Changes:
- Removed `import { createTool } from '@mastra/core/tools'`
- Changed from `createTool({ ... })` to plain object `{ ... }`
- Changed `inputSchema` → `parameters`
- Changed `id` → `name`
- Changed `execute: async ({ context })` → `execute: async (args)`
- Removed `context` unwrapping

## Testing

All tests pass:
```
✓ src/tools/__tests__/list-experiments.test.ts (13 tests)
✓ src/tools/__tests__/get-experiment.test.ts (16 tests)
✓ src/tools/__tests__/search-experiments.test.ts (30 tests)
```

MCP protocol works:
```bash
# Initialize
echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{...}}' | \
  node dist/stdio.js

# List tools
echo '{"jsonrpc":"2.0","id":2,"method":"tools/list"}' | \
  node dist/stdio.js

# All schemas are complete and valid
```

## Version History

- **v0.0.1**: Initial release (multiple bugs)
- **v0.0.2**: Fixed stdio logging (stdout → stderr)
- **v0.0.3**: Fixed enum schemas (removed `.exclude()`)
- **v0.0.4**: **Fixed tool format (createTool → plain object)** ✅

## Related Issues

This is a common pitfall when working with Mastra:
- `@mastra/core` tools ≠ `@mastra/mcp` tools
- Always check the package-specific documentation
- Use reference implementations as templates

## See Also

- [MCP_STDIO_FIX.md](./MCP_STDIO_FIX.md) - The stdio logging fix
- [WINDSURF_TROUBLESHOOTING.md](./WINDSURF_TROUBLESHOOTING.md) - User troubleshooting
- [GITHUB_ACTIONS_FIXES.md](./GITHUB_ACTIONS_FIXES.md) - CI/CD improvements
- [@mastra/mcp-docs-server](https://github.com/mastra-ai/mastra/tree/main/packages/mcp-docs-server) - Reference implementation
