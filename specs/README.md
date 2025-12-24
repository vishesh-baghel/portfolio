# Portfolio Specifications

> Technical documentation for the portfolio project

---

## Documents

| Document | Description |
|----------|-------------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Project structure, tech stack, core concepts |
| [COMPONENTS.md](./COMPONENTS.md) | Component library, patterns, templates |
| [STYLING.md](./STYLING.md) | Design tokens, CSS architecture, theming |
| [ROUTING.md](./ROUTING.md) | Routes, navigation, API endpoints |
| [EXTENSIBILITY.md](./EXTENSIBILITY.md) | Guides for adding new features |

---

## Quick Reference

### Tech Stack
- **Framework**: Next.js 15 (App Router)
- **UI**: React 19 + TailwindCSS 4 + Radix UI
- **Font**: IBM Plex Mono
- **Theming**: next-themes (dark/light)
- **AI**: Mastra agents

### Key Directories
```
src/
├── app/           # Pages and API routes
├── components/    # UI components
├── content/       # MDX content
├── lib/           # Utilities and config
└── mastra/        # AI agent setup
```

### Design Principles
1. Minimalist - no unnecessary decoration
2. Monospace - IBM Plex Mono everywhere
3. Sharp - 0px border-radius
4. Responsive - mobile-first with sm: breakpoint
5. High contrast - cream/black with red accents

### Common Patterns

**Page Structure**:
```tsx
<div className="min-h-screen bg-background-primary font-mono">
  <div className="max-w-[800px] mx-auto px-4 sm:px-6">
    <Header />
    <main>{/* content */}</main>
    <Footer />
  </div>
</div>
```

**Section Block**:
```tsx
<section className="py-6 font-mono">
  <h2 className="text-base sm:text-lg font-bold">title</h2>
</section>
```

**Card**:
```tsx
<article className="border border-border bg-card/60 hover:bg-card transition-colors p-3 sm:p-4">
```

---

## Getting Started

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test
```

---

## Content Guidelines

For tone and style guidelines, see:
`/home/vishesh.baghel/Documents/workspace/strategy-docs/CONTENT_TONE_GUIDELINES.md`

Key points:
- Authentic over hype
- Direct communication
- Lowercase for casual content
- Specific metrics over vague claims
