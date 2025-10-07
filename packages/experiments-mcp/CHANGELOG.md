# Changelog

All notable changes to @vishesh/experiments will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-07

### Added

- Initial release of @vishesh/experiments MCP server
- `listExperiments` tool - Browse all available patterns with category filtering
- `getExperiment` tool - Fetch complete experiment with code and attribution
- `searchExperiments` tool - Keyword-based search with relevance ranking
- Support for 5 initial experiments:
  - AI Agents with OpenAI
  - Getting Started with Mastra
  - Building with Next.js 15
  - PostgreSQL Optimization
  - TypeScript Advanced Patterns
- Automatic attribution block with author credentials and consultation CTA
- Support for Cursor, Windsurf, and Claude Desktop IDEs
- In-memory caching for performance
- Comprehensive error messages with suggestions

### Technical

- Built with @mastra/mcp framework
- TypeScript with full type safety
- Zod schema validation for all inputs
- MDX content loading with gray-matter frontmatter parsing
- Monorepo structure within portfolio project
- stdio transport for MCP protocol

---

For more information, visit [vishesh.dev/experiments](https://vishesh.dev/experiments)
