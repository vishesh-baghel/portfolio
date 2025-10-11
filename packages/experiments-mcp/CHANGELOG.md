# Changelog
All notable changes to @vishesh/experiments will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.1] - 2025-01-11

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

### Testing

- Comprehensive test suite with dynamic experiment discovery
- Tests are resilient to content changes (no hardcoded experiment slugs)
- MCP client-based testing following Mastra patterns
- GitHub Actions workflow for automated testing and publishing
- Performance benchmarks and caching validation

### Fixed

- `__dirname` conflict in bundled output (removed duplicate declaration)
- Path resolution in `fromRepoRoot` (3 levels) and `fromPackageRoot` (1 level)
- Build process now successfully copies all experiments to `.experiments/`
- Tests now dynamically discover experiments instead of hardcoding slugs

### Changed

- Updated `copy-experiments.ts` to use path helpers instead of declaring `__dirname`
- Improved error messages with helpful suggestions
- Enhanced attribution blocks with all required links
- GitHub Actions publish workflow now reads version from package.json automatically
- Updated domain references from vishesh.dev to visheshbaghel.com

---

For more information, visit [visheshbaghel.com/experiments](https://visheshbaghel.com/experiments)
