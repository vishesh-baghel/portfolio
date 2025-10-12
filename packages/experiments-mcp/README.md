# Vishesh Experiments MCP

An MCP server providing access to production-ready integration patterns and code examples directly in your IDE.

## What It Does

Skip the research phase and go straight to implementation. This server exposes battle-tested code from real OSS contributions, helping you:

- **Integrate AI agents** with OpenAI, Anthropic, or Mastra
- **Build with modern frameworks** like Next.js 15, React Server Components
- **Optimize databases** with PostgreSQL performance patterns
- **Apply TypeScript best practices** for large-scale applications

Each pattern includes:
- Complete working code (copy-paste ready)
- Architecture decisions and trade-offs
- Production deployment considerations
- Real-world implementation notes

## Installation

### Claude Code

```bash
claude mcp add vishesh-experiments -- npx -y vishesh-experiments
```

### Windsurf

Add to `~/.codeium/windsurf/mcp_config.json`:

```json
{
  "mcpServers": {
    "vishesh-experiments": {
      "command": "npx",
      "args": ["-y", "vishesh-experiments"]
    }
  }
}
```

### Cursor

Add to `.cursor/mcp.json` in your project root (or `~/.cursor/mcp.json` for global):

```json
{
  "mcpServers": {
    "vishesh-experiments": {
      "command": "npx",
      "args": ["-y", "vishesh-experiments"]
    }
  }
}
```

## Usage

Once configured in your IDE, you can ask Claude Code naturally:

### List Available Patterns
```
"Show me all available integration patterns"
"List the experiments you have"
```

### Search by Technology
```
"Find patterns for OpenAI agent integration"
"Search for PostgreSQL optimization examples"
"Show me Next.js 15 server component patterns"
```

### Get Full Implementation
```
"Show me how to build AI agents with OpenAI"
"Get the complete implementation for TypeScript advanced patterns"
"Give me the PostgreSQL optimization code"
```

## Available Patterns

### AI
- **AI Agents with OpenAI** - Complete agent implementation with conversation memory
- **Mastra Framework Integration** - Modern AI framework patterns

### Frameworks & Libraries
- **Next.js 15 Features** - App Router, Server Components, streaming
- **TypeScript Advanced Patterns** - Generic utilities, type safety, performance

### Database & Backend
- **PostgreSQL Optimization** - Connection pooling, query optimization, migrations
- **Real-time Data Patterns** - WebSocket implementations, state management

### Full Catalog

Run `listExperiments()` or visit [visheshbaghel.com/experiments](https://visheshbaghel.com/experiments) to browse all patterns.

## Pattern Structure

Each experiment includes:

```
📁 Experiment Name
├── Complete source code
├── Architecture decisions
├── Production considerations
├── Implementation notes
├── Related technologies
```

## Development Benefits

### Time Savings

Instead of:
1. Researching "how to integrate X with Y" (2-4 hours)
2. Finding outdated tutorials (1-2 hours)
3. Debugging integration issues (4-8 hours)
4. Optimizing for production (2-4 hours)

You get:
1. Working implementation in minutes
2. Production-ready patterns
3. Real-world optimizations included
4. Common pitfalls already solved


All patterns are:
- **Tested in production** environments
- **Contributed to OSS** projects
- **Peer reviewed** by maintainers
- **Updated regularly**

## IDE Integration

Once configured, ask your IDE naturally:

### Claude Code
```bash
# Ask your IDE directly
"Show me integration patterns for AI agents"
"What experiments do you have for database optimization?"
"Get me the complete code for Next.js 15 features"
```

### Windsurf/Cursor
```bash
# Ask your IDE directly
"Show me how to integrate OpenAI agents with Mastra"
"Find PostgreSQL optimization patterns"
"Get Next.js 15 server component examples"
```

The server provides context-aware code suggestions directly in your development environment.

## Contributing

Patterns are sourced from real development work:
- Open-source contributions
- Freelance client projects
- Internal tooling development
- Framework ecosystem participation

## Author

**Vishesh Baghel** - Software engineer specializing in AI integrations and modern web development.

- [GitHub](https://github.com/vishesh-baghel)
- [Portfolio](https://visheshbaghel.com)
- [Experiments](https://visheshbaghel.com/experiments)

## License

MIT
