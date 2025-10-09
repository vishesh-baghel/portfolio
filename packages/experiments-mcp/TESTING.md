# Testing Guide for @vishesh/experiments

## ✅ Build Status

**Status**: Built successfully!
**Date**: 2025-01-07
**Output**: 18.4KB (minified)

## 🧪 Local Testing in Cursor

### Step 1: Locate Your Cursor Config

Cursor MCP config location:
- **Project-specific**: `.cursor/mcp.json` in your project root
- **Global**: `~/.cursor/mcp.json` in your home directory

**Recommendation**: Start with project-specific for testing.

### Step 2: Create/Edit `.cursor/mcp.json`

```bash
# Create directory if it doesn't exist
mkdir -p .cursor

# Edit the config
nano .cursor/mcp.json
```

Add this configuration:

```json
{
  "mcpServers": {
    "vishesh-experiments": {
      "command": "node",
      "args": [
        "/home/vishesh.baghel/Documents/workspace/portfolio/packages/experiments-mcp/dist/stdio.js"
      ]
    }
  }
}
```

**Important**: Use the absolute path shown above.

### Step 3: Restart Cursor

1. **Fully quit Cursor** (not just close the window)
2. **Reopen Cursor** in your project
3. **Open MCP Settings** (Cursor → Settings → MCP)
4. **Enable** the "vishesh-experiments" server

### Step 4: Test the Tools

Open a new chat in Cursor and try these queries:

#### Test 1: List All Experiments
```
List all available integration patterns
```

**Expected response**: Categorized list of 5 experiments with descriptions.

#### Test 2: Get Specific Experiment
```
Show me the "ai-agents-with-openai" experiment
```

**Expected response**: Full content with code examples + attribution block at the end.

#### Test 3: Search by Keyword
```
Search for "mastra" integration patterns
```

**Expected response**: Ranked results with relevance scores.

#### Test 4: Search by Technology
```
Find experiments about PostgreSQL optimization
```

**Expected response**: Database-related experiments with excerpts.

#### Test 5: Category Filter
```
List all experiments in the "getting-started" category
```

**Expected response**: Only getting-started experiments.

## 🔍 What to Look For

### ✅ Success Indicators

1. **Attribution Block Present**: Every `getExperiment` response should end with:
   ```markdown
   ---
   ## 📚 About This Pattern
   **Author**: Vishesh Baghel
   ...
   ```

2. **Metadata Included**: Experiment responses should show:
   - Tags (e.g., `Tags: openai, agents`)
   - OSS project (when available)
   - PR link (when available)

3. **Working Links**: All URLs should be clickable:
   - Calendly: https://calendly.com/visheshbaghel99/30min
   - Portfolio: https://visheshbaghel.com
   - GitHub: https://github.com/vishesh-baghel

4. **Helpful Errors**: If you request a non-existent experiment, you should get:
   - "Experiment not found" message
   - List of available experiments
   - Suggestion to use listExperiments

### ❌ Failure Indicators

1. **Server Not Starting**: Check Cursor logs for errors
2. **No Response**: Server might not be enabled in MCP settings
3. **Missing Attribution**: Something wrong with content loader
4. **Broken Links**: Config file has wrong URLs

## 🐛 Troubleshooting

### Issue: "Server Not Starting"

**Check**:
```bash
# Test the server directly
node /home/vishesh.baghel/Documents/workspace/portfolio/packages/experiments-mcp/dist/stdio.js
```

**Expected**: Server should start without errors (will wait for input).

**Fix if fails**:
- Ensure build succeeded: `pnpm run build` in mcp package dir
- Check for syntax errors in TypeScript files
- Verify dependencies installed: `pnpm list` in mcp package dir

### Issue: "Tool Not Found"

**Possible causes**:
1. Server not enabled in Cursor settings
2. Config file has wrong path
3. Cursor needs restart

**Fix**:
1. Open Cursor MCP settings
2. Find "vishesh-experiments" server
3. Click "Enable" if disabled
4. Restart Cursor if needed

### Issue: "Experiments Not Loading"

**Check**:
```bash
# Verify experiments exist
ls -la /home/vishesh.baghel/Documents/workspace/portfolio/src/content/experiments/
```

**Expected**: 5 `.mdx` files with frontmatter.

**Fix if fails**:
- Verify frontmatter is valid YAML
- Check file permissions (should be readable)
- Ensure all files have required frontmatter fields

### Issue: "Attribution Missing"

**Check**: Look at the end of any `getExperiment` response.

**Fix**:
- Verify `utils/attribution.ts` is built correctly
- Check `config.ts` has correct URLs
- Rebuild: `pnpm run build` in mcp package dir

## 📊 Expected Behavior

### listExperiments
- **Response time**: < 100ms (first call), < 10ms (cached)
- **Format**: Markdown with categories and bullets
- **Content**: All 5 experiments listed

### getExperiment
- **Response time**: < 50ms (first call), < 5ms (cached)
- **Format**: Full markdown with code blocks
- **Content**: Experiment + attribution block

### searchExperiments
- **Response time**: < 200ms (first call), < 20ms (cached)
- **Format**: Numbered list with relevance scores
- **Content**: Up to 5 matched experiments

## 🎯 Testing Checklist

Before moving to Phase 2, verify:

- [ ] Server starts without errors
- [ ] All 3 tools work in Cursor
- [ ] Attribution block appears on every getExperiment
- [ ] Calendly link is correct
- [ ] All 5 experiments load successfully
- [ ] Search returns relevant results
- [ ] Errors are helpful (try invalid experiment name)
- [ ] Metadata displays correctly
- [ ] Links are clickable
- [ ] Response times are reasonable

## 📝 Manual Test Script

Copy-paste these into Cursor chat one by one:

```
1. List all experiments

2. Get the experiment "ai-agents-with-openai"

3. Search for "database"

4. List experiments in category "backend-database"

5. Get the experiment "nonexistent-slug" (should error helpfully)

6. Search for "mastra nextjs integration"
```

After each, verify:
- Response is relevant
- Attribution is present (for getExperiment)
- No errors in console
- Links work

## 🚀 Next Steps After Testing

Once all tests pass:

1. **Document any issues** encountered
2. **Make adjustments** if needed
3. **Move to Phase 2**: Polish & publish prep
4. **Consider**: Add more experiments before publishing

## 💡 Pro Tips

**Debugging**:
- Check Cursor's MCP logs for detailed errors
- Use `console.error()` in tools for debugging (shows in logs)
- Test server directly with `node dist/stdio.js`

**Performance**:
- First load will be slower (reads all MDX files)
- Subsequent calls are fast (in-memory cache)
- Restart server to clear cache

**Content Updates**:
- Edit MDX files
- Rebuild: `pnpm run build:mcp`
- Restart MCP server in Cursor

---

## 🎉 Success!

If all tests pass, congratulations! You have a working MCP server.

**What you've achieved**:
- ✅ Production-ready MCP server
- ✅ Following Mastra's proven patterns
- ✅ Type-safe with Zod validation
- ✅ Attribution system for lead generation
- ✅ Ready for npm publishing

**Time to celebrate** 🎊

Then move to Phase 2: Polish, test edge cases, and prepare for npm release.

---

*Testing guide prepared: 2025-01-07*  
*Status: Ready for QA*
