# Publishing @vishesh/experiments to npm

## Understanding the Package

This is an **MCP Server package** that:
- Exposes tools via MCP protocol for external clients (Cursor, Windsurf, Claude Desktop)
- Uses stdio transport (runs as subprocess)
- Does NOT use Mastra's dev server
- Does NOT need `mastra.config.ts`

## Pre-Publishing Checklist

### 1. Verify Package Structure

```bash
cd packages/experiments-mcp
ls -la dist/
```

Should contain:
- `stdio.js` (entry point for MCP clients)
- `index.js` (programmatic API)
- `*.d.ts` (TypeScript definitions)

### 2. Test Locally

**Test the MCP server directly:**
```bash
# From the MCP package directory
node dist/stdio.js
```

Server should start and wait for MCP protocol messages.

**Test in Cursor:**
Add to `.cursor/mcp.json`:
```json
{
  "mcpServers": {
    "vishesh-experiments-local": {
      "command": "node",
      "args": [
        "/absolute/path/to/packages/experiments-mcp/dist/stdio.js"
      ]
    }
  }
}
```

Restart Cursor and test:
- "List all experiments"
- "Get the ai-agents-with-openai experiment"
- "Search for mastra patterns"

### 3. Verify package.json

Check these fields:
```json
{
  "name": "@vishesh/experiments",
  "version": "1.0.0",
  "bin": "dist/stdio.js",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": ["dist", "README.md", "CHANGELOG.md"]
}
```

### 4. Build for Production

```bash
cd packages/experiments-mcp
pnpm run build
```

Verify no errors and check output size.

## Publishing Steps

### First Time Setup

1. **Create npm account** (if you don't have one):
   ```bash
   npm adduser
   ```

2. **Login to npm**:
   ```bash
   npm login
   ```

3. **Verify you're logged in**:
   ```bash
   npm whoami
   ```

### Publish to npm

```bash
cd packages/experiments-mcp

# Dry run first (see what would be published)
npm publish --dry-run

# Actually publish
npm publish --access public
```

**Note**: The `--access public` flag is required for scoped packages (@vishesh/experiments).

### Verify Publication

1. **Check on npm**:
   ```
   https://www.npmjs.com/package/@vishesh/experiments
   ```

2. **Test installation**:
   ```bash
   npx @vishesh/experiments@latest
   ```

## Post-Publishing

### 1. Create GitHub Release

```bash
cd /path/to/portfolio
git tag -a v1.0.0 -m "Release v1.0.0: Initial MCP server"
git push origin v1.0.0
```

Then create release on GitHub with:
- Tag: v1.0.0
- Title: "v1.0.0 - Initial Release"
- Description: Copy from CHANGELOG.md

### 2. Update Documentation

- Update main README with installation instructions
- Update portfolio website experiments page
- Add npm badge to README

### 3. Announce

- Twitter/X post
- LinkedIn post
- Tag @mastra_ai
- Post in Cursor/Windsurf Discord

## Version Updates

### Patch (1.0.0 → 1.0.1)

Bug fixes, no breaking changes:
```bash
cd packages/experiments-mcp
npm version patch
npm publish
git push && git push --tags
```

### Minor (1.0.0 → 1.1.0)

New features, no breaking changes:
```bash
npm version minor
npm publish
git push && git push --tags
```

### Major (1.0.0 → 2.0.0)

Breaking changes:
```bash
npm version major
npm publish
git push && git push --tags
```

## Testing the Published Package

### In Cursor

Update `.cursor/mcp.json`:
```json
{
  "mcpServers": {
    "vishesh-experiments": {
      "command": "npx",
      "args": ["-y", "@vishesh/experiments"]
    }
  }
}
```

### In Windsurf

Update `~/.codeium/windsurf/mcp_config.json`:
```json
{
  "mcpServers": {
    "vishesh-experiments": {
      "command": "npx",
      "args": ["-y", "@vishesh/experiments"]
    }
  }
}
```

## Troubleshooting

### "Package not found"
- Wait a few minutes after publishing (npm CDN propagation)
- Verify package name: `npm view @vishesh/experiments`

### "Permission denied"
- Ensure you're logged in: `npm whoami`
- Check package scope ownership: `npm owner ls @vishesh/experiments`

### "Version already exists"
- Bump version: `npm version patch`
- Or use a different version number

## Package Maintenance

### Update Dependencies

```bash
cd packages/experiments-mcp
pnpm update
pnpm run build
pnpm run test
npm version patch
npm publish
```

### Deprecate Old Version

```bash
npm deprecate @vishesh/experiments@1.0.0 "Please upgrade to 1.0.1"
```

### Unpublish (within 72 hours only)

```bash
npm unpublish @vishesh/experiments@1.0.0
```

**Warning**: Only use in emergencies. Prefer deprecation.

## CI/CD (Future)

Consider setting up GitHub Actions for:
- Automatic testing on PR
- Automatic publishing on tag push
- Automatic changelog generation

Example workflow:
```yaml
name: Publish
on:
  push:
    tags:
      - 'v*'
jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm --filter @vishesh/experiments build
      - run: pnpm --filter @vishesh/experiments test
      - run: npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

---

## Summary

**To publish:**
1. Build: `pnpm run build`
2. Test locally in Cursor
3. Publish: `npm publish --access public`
4. Create GitHub release
5. Announce on social media

**To update:**
1. Make changes
2. Update version: `npm version patch/minor/major`
3. Publish: `npm publish`
4. Push tags: `git push --tags`

---

*Last updated: 2025-01-07*
