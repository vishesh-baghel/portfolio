# Portfolio Architecture Specification

> **Version**: 1.0  
> **Last Updated**: 2024-12-24

---

## Overview

This portfolio is a Next.js 15 application using the App Router, React 19, and TailwindCSS 4. It follows a minimalist, monospace-driven design system with sharp edges (0px border-radius) and a cream/black color palette with red accents.

---

## Tech Stack

| Category | Technology | Version |
|----------|-----------|---------|
| Framework | Next.js | 15.3.x |
| React | React | 19.x |
| Styling | TailwindCSS | 4.x |
| UI Components | Radix UI | Various |
| Icons | Lucide React, Tabler Icons | Latest |
| Font | IBM Plex Mono | Google Fonts |
| Analytics | Vercel Analytics + Speed Insights | Latest |
| AI/Agents | Mastra | 0.20.x |
| Database | LibSQL/Turso | 0.15.x |
| Auth | Better Auth | 1.3.x |
| Theming | next-themes | 0.4.x |
| MDX | @mdx-js/loader, @next/mdx | 3.x / 15.x |

---

## Directory Structure

```
portfolio/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   │   ├── portfolio-agent/
│   │   │   └── prs/
│   │   ├── experiments/       # MDX-based experiments
│   │   │   └── [slug]/
│   │   ├── llms.txt/          # LLM context page
│   │   ├── mcp/               # MCP integration page
│   │   ├── work/              # Client work showcase
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Homepage
│   │   └── globals.css        # Global styles + design tokens
│   │
│   ├── components/
│   │   ├── commits/           # Git commits modal
│   │   ├── layouts/           # Page layouts
│   │   ├── mdx/               # MDX components
│   │   ├── providers/         # React context providers
│   │   ├── sections/          # Page sections (hero, about, etc.)
│   │   └── ui/                # Reusable UI components (shadcn-style)
│   │
│   ├── content/
│   │   └── experiments/       # MDX content files
│   │
│   ├── hooks/                 # Custom React hooks
│   │
│   ├── lib/                   # Utility functions
│   │   ├── content-utils.ts   # MDX content loading
│   │   ├── site-config.ts     # Site configuration
│   │   ├── utils.ts           # General utilities
│   │   └── work-data.ts       # Work entries data
│   │
│   └── mastra/                # AI agent configuration
│       ├── agents/
│       ├── index.ts
│       └── storage.ts
│
├── packages/                   # Monorepo packages
│   └── vishesh-experiments/   # MCP server package
│
├── public/                     # Static assets
│   └── clients/               # Client logos
│
├── docs/                       # Internal documentation
└── specs/                      # Functional specifications
```

---

## Core Concepts

### 1. Page Structure Pattern

All pages follow a consistent structure:

```tsx
<div className="min-h-screen bg-background-primary font-mono">
  <div className="max-w-[800px] mx-auto px-4 sm:px-6">
    <Header />
    <main className="space-y-6">
      {/* Page-specific content */}
    </main>
    <Footer />
  </div>
</div>
```

**Key constraints:**
- Max width: 800px (centered)
- Horizontal padding: 16px mobile, 24px desktop
- Font: IBM Plex Mono throughout
- Background: `bg-background-primary` (cream light, dark black)

### 2. Section Component Pattern

Each major content block is a standalone section component:

```tsx
const SectionName = () => {
  return (
    <section className="py-6 font-mono">
      <h2 className="text-base sm:text-lg font-bold cursor-default text-text-primary mt-0 mb-2">
        section title
      </h2>
      {/* Content */}
    </section>
  );
};
```

**Section spacing:** `py-6` (24px vertical padding)

### 3. Card Pattern

Content cards use consistent styling:

```tsx
<article className="border border-border bg-card/60 hover:bg-card transition-colors p-3 sm:p-4">
  <header className="mb-1 flex items-center gap-2">
    <a className="underline text-accent-red text-sm sm:text-base">
      {title}
    </a>
  </header>
  <p className="text-xs sm:text-sm">{description}</p>
</article>
```

---

## Design Tokens

### Colors (Light Mode)
| Token | Value | Usage |
|-------|-------|-------|
| `--color-background` | #FAF8F6 | Page background |
| `--color-foreground` | #000000 | Primary text |
| `--color-accent-red` | #FF0000 | Links, CTAs |
| `--color-border` | #E0E0E0 | Borders, dividers |
| `--color-muted-foreground` | #666666 | Secondary text |
| `--color-secondary` | #E0E0E0 | Hover states, backgrounds |

### Colors (Dark Mode)
| Token | Value | Usage |
|-------|-------|-------|
| `--color-background` | #0f0f0f | Page background |
| `--color-foreground` | #faf8f6 | Primary text |
| `--color-accent-red` | #ff4d4d | Links, CTAs |
| `--color-border` | #2a2a2a | Borders, dividers |
| `--color-muted-foreground` | #a3a3a3 | Secondary text |

### Typography
| Element | Font | Size | Weight |
|---------|------|------|--------|
| h1 | IBM Plex Mono | 32px / 2xl-3xl | bold |
| h2 | IBM Plex Mono | 24px / base-lg | bold |
| h3 | IBM Plex Mono | 18px | bold |
| body | IBM Plex Mono | 16px / sm-base | normal |
| small | IBM Plex Mono | 14px / xs-sm | normal |

### Spacing
| Context | Value |
|---------|-------|
| Page padding (desktop) | 60px 40px |
| Page padding (mobile) | 40px 24px |
| Section spacing | 24px (py-6) |
| Card padding | 12px mobile, 16px desktop |
| List item spacing | 12px |

### Border Radius
All elements use `--radius: 0px` for sharp, square edges.

---

## Routing

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `page.tsx` | Homepage with all sections |
| `/work` | `work/page.tsx` | Client work showcase |
| `/experiments` | `experiments/page.tsx` | Experiments listing |
| `/experiments/[slug]` | `experiments/[slug]/page.tsx` | Individual experiment (MDX) |
| `/mcp` | `mcp/page.tsx` | MCP integration info |
| `/llms.txt` | `llms.txt/page.tsx` | LLM context document |
| `/api/prs` | API route | Fetches GitHub PRs |
| `/api/portfolio-agent` | API route | AI agent endpoint |

---

## State Management

### Client-Side State
- **Theme**: Managed by `next-themes` ThemeProvider
- **Search**: Custom SearchProvider context
- **Modals**: Local component state (useState)

### Server-Side Data
- **MDX Content**: Filesystem-based with React cache
- **GitHub PRs**: API route with client-side fetch
- **Work Entries**: Static data in `work-data.ts`

---

## Key Dependencies

### UI Components (shadcn-style)
Located in `src/components/ui/`, built on Radix UI primitives:
- Accordion, Alert, Avatar, Badge
- Button, Card, Checkbox
- Dialog, Dropdown, Popover
- Tabs, Tooltip, and 40+ more

### Providers
- `ThemeProvider` - Dark/light mode
- `SearchProvider` - Global search state

---

## Build & Deploy

### Scripts
```bash
pnpm dev          # Development server
pnpm build        # Production build (includes MCP)
pnpm build:mcp    # Build MCP package only
pnpm start        # Production server
pnpm test         # Run tests
pnpm mastra:dev   # Mastra development
```

### Environment Variables
See `.env.example` for required variables:
- `OPENAI_API_KEY` - AI agent
- `GITHUB_TOKEN` - PR fetching
- Database connection strings

---

## Extensibility Points

### Adding a New Page
1. Create `src/app/[route]/page.tsx`
2. Follow the page structure pattern
3. Add navigation link to `Header.tsx`

### Adding a New Section
1. Create `src/components/sections/[name].tsx`
2. Export default component
3. Import and add to `page.tsx`

### Adding a New UI Component
1. Create in `src/components/ui/[name].tsx`
2. Follow existing patterns (use cn utility, Radix primitives)
3. Export from component file

### Adding Work Entries
Edit `src/lib/work-data.ts` and add to `workEntries` array.

### Adding Experiments
Create MDX file in `src/content/experiments/[slug].mdx` with frontmatter:
```yaml
---
title: "Experiment Title"
description: "Short description"
category: "category-slug"
date: "2024-12-24"
---
```
