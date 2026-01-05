# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio and AI agent platform for Vishesh Baghel. Next.js 15 App Router with React 19, TailwindCSS 4, and Mastra AI agents. Includes an MCP server package for integration patterns.

**Live site**: https://visheshbaghel.com

## Commands

```bash
# Development
pnpm dev                    # Start dev server (localhost:3000)
pnpm build                  # Production build (builds MCP first)
pnpm lint                   # Run ESLint

# Testing
pnpm test                   # Run all tests
pnpm test:evals            # Run agent evaluation tests only
pnpm test:mcp              # Run MCP package tests
pnpm test:watch            # Watch mode
pnpm test:ui               # Vitest UI dashboard

# MCP Package
pnpm build:mcp             # Build MCP package
pnpm dev:mcp               # Watch mode for MCP
```

## Architecture

### Monorepo Structure
- **Root**: Next.js portfolio app
- **packages/experiments-mcp**: MCP server package (`vishesh-experiments` on npm)

### Key Directories
- `src/app/` - Next.js App Router pages and API routes
- `src/components/sections/` - Page section components (hero, about, skills, etc.)
- `src/components/ui/` - shadcn-style UI components (40+)
- `src/mastra/` - AI agent configuration and evaluations
- `src/content/experiments/` - MDX experiment content
- `src/lib/` - Utilities (`work-data.ts` for work entries, `content-utils.ts` for MDX)

### AI Agent System
The portfolio agent (`src/mastra/agents/portfolio-agent.ts`) uses Mastra with OpenAI. Storage is in-memory LibSQL (`src/mastra/storage.ts`). Agent evals are in `src/mastra/agents/tests/`.

### Page Structure Pattern
All pages follow:
```tsx
<div className="min-h-screen bg-background-primary font-mono">
  <div className="max-w-[800px] mx-auto px-4 sm:px-6">
    <Header />
    <main className="space-y-6">{/* content */}</main>
    <Footer />
  </div>
</div>
```

### Design System
- Font: IBM Plex Mono
- Max width: 800px centered
- Border radius: 0px (sharp edges)
- Colors: cream/black palette with red accents (`--color-accent-red`)
- Mobile-first responsive: `sm:` breakpoint at 640px

## Testing

Vitest with three test projects:
1. **portfolio-evals** - Agent evaluation tests (`*.eval.test.ts`)
2. **portfolio-unit** - Unit tests (`*.test.ts`, `*.test.tsx`)
3. **experiments-mcp** - MCP package tests

## Code Conventions

- Use `const` for functions: `const myFunc = () => {}`
- Event handlers prefixed with `handle`: `handleClick`, `handleKeyDown`
- Use early returns for readability
- TailwindCSS only (no CSS files except globals.css)
- Include accessibility attributes (tabindex, aria-label)
- Import alias: `@/` maps to `./src/`

## Environment Variables

Required:
- `OPENAI_API_KEY` - For AI agent

Optional:
- `NEXT_PUBLIC_POSTHOG_KEY` - Analytics
- `GITHUB_TOKEN` - PR fetching
