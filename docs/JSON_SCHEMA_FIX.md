# JSON Schema Validation Fix

## Problem

After fixing the stdio issue (v0.0.2), Windsurf showed the server as registered but all tools failed with JSON schema validation errors:

```
Error: failed to validate tool input schema for tool: listExperiments: 
invalid JSON schema: jsonschema validation failed with 
'https://json-schema.org/draft/2020-12/schema#' - at '': allOf failed - 
at '/type': anyOf failed - at '/type': value must be one of 'array', 
'boolean', 'integer', 'null', 'number', 'object', 'string' - at '/type': 
got string, want array.
```

This error appeared for all 3 tools (listExperiments, getExperiment, searchExperiments).

## Root Cause

The issue was using Zod's `.exclude()` method to create derived enums:

```typescript
// PROBLEMATIC CODE
export const ExperimentCategory = z.enum([
  'all',
  'getting-started',
  'ai-agents',
  'backend-database',
  'typescript-patterns',
]);

// This creates a complex schema that fails validation
categories: z.array(ExperimentCategory.exclude(['all']))
```

When `zod-to-json-schema` converts `.exclude()`, it generates complex schemas with `allOf` and `anyOf` combinators that don't pass Windsurf's strict JSON Schema Draft 2020-12 validation.

## Solution

Replace `.exclude()` with an explicit enum definition:

```typescript
// CORRECT CODE
export const ExperimentCategory = z.enum([
  'all',
  'getting-started',
  'ai-agents',
  'backend-database',
  'typescript-patterns',
]);

// Explicit enum without 'all'
export const ExperimentCategoryWithoutAll = z.enum([
  'getting-started',
  'ai-agents',
  'backend-database',
  'typescript-patterns',
]);

// Use the explicit enum
categories: z.array(ExperimentCategoryWithoutAll)
```

This generates clean, simple JSON schemas:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "categories": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "getting-started",
          "ai-agents",
          "backend-database",
          "typescript-patterns"
        ]
      }
    }
  }
}
```

## Verification

Test the generated schemas:

```bash
echo '{"jsonrpc":"2.0","id":2,"method":"tools/list"}' | \
  node dist/stdio.js 2>/dev/null | \
  jq '.result.tools[] | {name: .name, schema: .inputSchema}'
```

All schemas should be simple objects with `type`, `properties`, and optional `required` fields. No `allOf`, `anyOf`, or complex combinators.

## Best Practices for MCP Tool Schemas

1. **Avoid Zod transformations** that create complex schemas:
   - `.exclude()` - creates `allOf` combinators
   - `.pick()` / `.omit()` - can create complex schemas
   - `.transform()` - not supported in JSON Schema

2. **Use explicit definitions**:
   - Define separate enums instead of deriving them
   - Use simple `z.object()`, `z.string()`, `z.number()`, `z.array()`, `z.enum()`

3. **Test schema generation**:
   ```bash
   # Check that schemas are valid
   echo '{"jsonrpc":"2.0","id":2,"method":"tools/list"}' | \
     npx your-mcp-server 2>/dev/null | jq '.result.tools[].inputSchema'
   ```

4. **Keep schemas simple**:
   - MCP clients have strict validation
   - Complex schemas may work in some clients but fail in others
   - Windsurf is particularly strict about JSON Schema Draft 2020-12

## Related Issues

This is a common issue when using `zod-to-json-schema` with MCP servers. The library tries to represent Zod's rich type system in JSON Schema, but MCP clients expect simpler, more standard schemas.

## Version

Fixed in version **0.0.3** (2025-01-11)

## See Also

- [MCP_STDIO_FIX.md](./MCP_STDIO_FIX.md) - The stdio logging fix (v0.0.2)
- [WINDSURF_TROUBLESHOOTING.md](./WINDSURF_TROUBLESHOOTING.md) - General troubleshooting guide
