# Routing Specification

> **Version**: 1.0  
> **Last Updated**: 2024-12-24

---

## Overview

The portfolio uses Next.js 15 App Router with file-system based routing. All routes are server-rendered by default with selective client components.

---

## Route Structure

```
src/app/
├── page.tsx                    # / (Homepage)
├── layout.tsx                  # Root layout
├── globals.css                 # Global styles
├── global-error.tsx            # Error boundary
│
├── work/
│   └── page.tsx                # /work
│
├── experiments/
│   ├── page.tsx                # /experiments
│   └── [slug]/
│       └── page.tsx            # /experiments/:slug
│
├── mcp/
│   └── page.tsx                # /mcp
│
├── llms.txt/
│   └── page.tsx                # /llms.txt
│
└── api/
    ├── prs/
    │   └── route.ts            # /api/prs
    └── portfolio-agent/
        └── route.ts            # /api/portfolio-agent
```

---

## Page Routes

### Homepage (`/`)
**File**: `src/app/page.tsx`  
**Type**: Server Component  
**Purpose**: Main landing page with all sections

**Sections Rendered**:
1. Header (navigation)
2. HeroSection (name + tagline)
3. AboutSection (brief intro)
4. OpenSourceSection (GitHub PRs)
5. CurrentProjectsSection (notable projects)
6. SkillsSection (tech skills)
7. ContactSection (CTA)
8. Footer
9. PortfolioSearch (floating)

### Work (`/work`)
**File**: `src/app/work/page.tsx`  
**Type**: Server Component  
**Purpose**: Showcase client work and projects

**Data Source**: `src/lib/work-data.ts`

**Features**:
- Client logos
- Project descriptions
- Tech stack badges
- Key outcomes list

### Experiments (`/experiments`)
**File**: `src/app/experiments/page.tsx`  
**Type**: Server Component  
**Purpose**: List all experiments by category

**Data Source**: MDX files in `src/content/experiments/`

**Features**:
- Category grouping
- Feature highlights grid
- Links to individual experiments

### Experiment Detail (`/experiments/[slug]`)
**File**: `src/app/experiments/[slug]/page.tsx`  
**Type**: Server Component with MDX  
**Purpose**: Individual experiment content

**Rendering**: MDX with custom components

### MCP (`/mcp`)
**File**: `src/app/mcp/page.tsx`  
**Type**: Server Component  
**Purpose**: MCP server integration information

### LLMs.txt (`/llms.txt`)
**File**: `src/app/llms.txt/page.tsx`  
**Type**: Server Component  
**Purpose**: Machine-readable context for LLMs

---

## API Routes

### GitHub PRs (`/api/prs`)
**File**: `src/app/api/prs/route.ts`  
**Method**: GET

**Query Parameters**:
- `user`: GitHub username
- `page`: Pagination page number

**Response**:
```ts
interface ApiResponse {
  total_count: number;
  per_page: number;
  page: number;
  items: PrItem[];
}

interface PrItem {
  title: string;
  html_url: string;
  number: number;
  repo?: string;
  state: 'open' | 'merged' | 'closed';
  merged: boolean;
  updated_at: string;
}
```

### Portfolio Agent (`/api/portfolio-agent`)
**File**: `src/app/api/portfolio-agent/route.ts`  
**Methods**: POST

**Purpose**: AI agent for portfolio interactions

**Integration**: Mastra framework

---

## Navigation

### Header Navigation Links

**Desktop** (visible at sm: breakpoint):
- about → `/`
- work → `/work`
- commits → Modal trigger
- experiments → `/experiments`
- mcp → `/mcp`

**Mobile** (drawer menu):
Same links in slide-out drawer

### External Links
- GitHub → `https://github.com/{username}`
- X/Twitter → `https://x.com/{username}`
- LinkedIn → Configured URL

---

## Dynamic Routes

### Experiments Slug
**Pattern**: `/experiments/[slug]`

**Static Generation**:
```ts
export async function generateStaticParams() {
  const items = getContentItems('experiments');
  return items.map((item) => ({ slug: item.slug }));
}
```

**Slug Resolution**:
- Maps to MDX file: `src/content/experiments/{slug}.mdx`
- Parses frontmatter for metadata
- Renders MDX content

---

## Metadata

### Static Metadata
```ts
export const metadata = {
  title: 'Page Title',
  description: 'Page description',
};
```

### Dynamic Metadata
```ts
export async function generateMetadata({ params }) {
  // Fetch data and return metadata
  return {
    title: `${data.title} | Portfolio`,
    description: data.description,
  };
}
```

---

## Layout Hierarchy

```
RootLayout (layout.tsx)
├── HTML shell
├── ThemeProvider
├── SearchProvider
├── ErrorReporter
├── Analytics
└── SpeedInsights
    │
    └── Page Content
        ├── Header (per-page)
        ├── Main content
        └── Footer (per-page)
```

**Note**: Header/Footer are imported per-page, not in root layout. This allows pages to customize or exclude them.

---

## Adding New Routes

### Static Page
1. Create directory: `src/app/{route}/`
2. Create page file: `page.tsx`
3. Follow page structure pattern:
```tsx
import Header from '@/components/sections/header';
import Footer from '@/components/sections/footer';

export const metadata = {
  title: 'Page Title',
  description: 'Description',
};

export default function NewPage() {
  return (
    <div className="min-h-screen bg-background-primary font-mono">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6">
        <Header />
        <main className="space-y-6">
          {/* Content */}
        </main>
        <Footer />
      </div>
    </div>
  );
}
```
4. Add navigation link to `Header.tsx` (both desktop and mobile)

### Dynamic Page
1. Create directory with parameter: `src/app/{route}/[param]/`
2. Create page file with params handling:
```tsx
interface PageProps {
  params: Promise<{ param: string }>;
}

export default async function DynamicPage({ params }: PageProps) {
  const { param } = await params;
  // Fetch data based on param
}
```
3. Optionally add `generateStaticParams()` for SSG

### API Route
1. Create directory: `src/app/api/{route}/`
2. Create route file: `route.ts`
3. Export HTTP method handlers:
```ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  // Handle request
  return NextResponse.json({ data });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  // Handle request
  return NextResponse.json({ result });
}
```

---

## Route Groups

### Docs Route Group
**Directory**: `src/app/(docs)/`  
**Purpose**: Reserved for future documentation routes

Route groups (parentheses) don't affect URL structure but allow shared layouts.

---

## Caching & Revalidation

### Static Routes
Most pages are statically generated at build time.

### Dynamic Data
- GitHub PRs: Fetched client-side with `cache: 'no-store'`
- Experiments: Read from filesystem, cached with React cache

### Revalidation
For ISR (if needed):
```ts
export const revalidate = 3600; // Revalidate every hour
```
