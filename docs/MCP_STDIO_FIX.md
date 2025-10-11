# MCP stdio Protocol Fix

## Problem

The MCP server was not showing a green status in Windsurf UI despite the server starting successfully when tested locally with `npx vishesh-experiments`.

## Root Cause

**stdout is reserved for MCP protocol communication**. The MCP protocol uses JSON-RPC messages over stdio, where:
- **stdout**: Reserved exclusively for MCP protocol messages (JSON-RPC requests/responses)
- **stderr**: Used for logging and diagnostic messages

The original `stdio.ts` was using `console.info()` which writes to stdout:

```typescript
console.info('Vishesh Experiments MCP Server started on stdio');
```

This interfered with the MCP protocol communication, preventing proper handshake with MCP clients (Windsurf, Cursor, Claude Desktop).

## Solution

Changed all logging in `stdio.ts` to use `console.error()` which writes to stderr:

```typescript
// Use stderr for logging - stdout is reserved for MCP protocol
console.error('Vishesh Experiments MCP Server started on stdio');
```

## Verification

The fix was verified by testing the MCP protocol handshake:

```bash
echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0.0"}}}' | node dist/stdio.js
```

**Before fix**: No JSON response (stdout was polluted with log messages)

**After fix**: Proper JSON-RPC response:
```json
{"result":{"protocolVersion":"2024-11-05","capabilities":{"tools":{},"logging":{"enabled":true},"elicitation":{}},"serverInfo":{"name":"Vishesh Experiments Server","version":"0.0.2"}},"jsonrpc":"2.0","id":1}
```

## Best Practices for MCP Servers

1. **Never write to stdout** in MCP stdio transport mode
2. **Use stderr** for all logging (`console.error()`, `console.warn()`)
3. **Use MCP logging protocol** for structured logs that clients can display
4. **Test protocol handshake** before publishing

## References

- [Model Context Protocol Specification](https://spec.modelcontextprotocol.io/)
- [@mastra/mcp-docs-server](https://github.com/mastra-ai/mastra/tree/main/packages/mcp-docs-server) - Reference implementation
- [MCP SDK Documentation](https://github.com/modelcontextprotocol/typescript-sdk)

## Version

Fixed in version **0.0.2** (2025-01-11)
