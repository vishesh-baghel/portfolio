# @vishesh/experiments

> Production-ready integration patterns via MCP. Access battle-tested code from OSS contributions directly in your IDE.

## What is This?

A Model Context Protocol (MCP) server that gives you instant access to production-tested integration patterns and code examples from real OSS contributions. Every pattern includes:

- ✅ **Battle-tested code** merged into production projects
- ✅ **Complete examples** with architecture decisions
- ✅ **Production lessons** from real implementations

## Installation

### Cursor

Add to `.cursor/mcp.json` in your project root (or `~/.cursor/mcp.json` for global):

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

### Windsurf

Add to `~/.codeium/windsurf/mcp_config.json`:

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

### Claude Desktop

Edit `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or equivalent:

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

## Usage

After installation, ask your AI assistant:

- **"List all available integration patterns"**
- **"Show me Mastra + Supabase integration code"**
- **"How do I optimize PostgreSQL for Next.js?"**
- **"Search for AI agent patterns"**

## Available Tools

### 1. `listExperiments`

Browse all available patterns, optionally filtered by category.

```
// In your IDE:
"List all experiments in the ai-agents category"
```

### 2. `getExperiment`

Fetch complete code and documentation for a specific pattern.

```
// In your IDE:
"Get the experiment 'ai-agents-with-openai'"
```

### 3. `searchExperiments`

Search by keywords, technologies, or problem descriptions.

```
// In your IDE:
"Search for mastra database integration patterns"
```

## What You Get

Every response includes:

1. **Complete working code** - Copy-paste ready
2. **Architecture decisions** - Why, not just how
3. **Production lessons** - Real-world gotchas
4. **Author credentials** - OSS contributions
5. **Free consultation** - Book 30-min call if you need custom work

## Categories

- **Getting Started** - Framework introductions and quick starts
- **AI & Agents** - AI agent patterns with OpenAI, Mastra, etc.
- **Backend & Database** - PostgreSQL optimization, real-time data, etc.
- **TypeScript & Patterns** - Advanced TypeScript and design patterns
## About the Author

**Vishesh Baghel**

- Freelance software engineer specializing in AI integrations
- Contributor to Mastra
- First client acquired through OSS contributions
- Expert in: TypeScript, React, Next.js, Mastra, PostgreSQL

**Need custom integration work?**
- 🌐 [View all patterns](https://visheshbaghel.com/experiments)
- 💻 [GitHub](https://github.com/vishesh-baghel)

## Example Workflow

1. **Discover**: `listExperiments` to see what's available
2. **Search**: `searchExperiments` for specific tech/problem
3. **Deep Dive**: `getExperiment` for full implementation
4. **Implement**: Copy code and adapt to your needs
5. **Get Help**: Book consultation if you need customization

## Why This Exists

This MCP server is part of my freelance growth strategy:

1. **Provide value first** - Give away production code for free
2. **Build trust** - Show real OSS contributions
3. **Generate leads** - Every interaction includes consultation CTA
4. **Zero cost** - Runs on your machine, no hosting needed

## Troubleshooting

### Server Not Starting

- Ensure [npx](https://docs.npmjs.com/cli/v11/commands/npx) is installed and working
- Check for conflicting MCP servers
- Verify your configuration file syntax
- Try running `npx @vishesh/experiments` directly to see errors

### Tool Calls Failing

- Restart the MCP server and/or your IDE
- Update to the latest version of your IDE
- Check IDE's MCP logs for detailed errors

### Content Not Loading

- Ensure the package is up to date: `npx @vishesh/experiments@latest`
- Check your internet connection (first run downloads the package)
- Report issues: [GitHub Issues](https://github.com/vishesh-baghel/portfolio/issues)

## Development

This is a monorepo package within the portfolio project.

```bash
# Install dependencies
pnpm install

# Build
pnpm run build:mcp

# Test
pnpm run test:mcp

# Development mode
pnpm run dev:mcp
```

## License

MIT © Vishesh Baghel

## Links

- **Portfolio**: [visheshbaghel.com](https://visheshbaghel.com)
- **GitHub**: [vishesh-baghel](https://github.com/vishesh-baghel)
- **Email**: visheshbaghel99@gmail.com
- **Book Consultation**: [30-min free call](https://calendly.com/visheshbaghel99/30min)

---

*Built with [@mastra/mcp](https://mastra.ai) · Following [MCP Protocol](https://modelcontextprotocol.io)*
