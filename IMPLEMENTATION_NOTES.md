# Portfolio Update - Work, Experiments & Lessons Pages

## Summary

Successfully implemented the requested navigation and content structure changes to the portfolio website.

## Changes Made

### 1. Header Navigation
- ✅ Kept "about" button (previously "home") - navigates to root path `/`
- ✅ Added "work" button - navigates to `/work`
- ✅ Added "lessons" button - navigates to `/lessons`
- ✅ Kept "commits" and "experiments" buttons
- ✅ Mobile: All navigation items accessible via hamburger menu
- ✅ Desktop: All items shown inline

### 2. Work Page (`/work`)
**File:** `src/app/work/page.tsx`
**Data File:** `src/lib/work-data.ts`

Features:
- Data-driven design using `workEntries` array
- Easy to add new work entries by editing `work-data.ts`
- Each entry displays:
  - Client name
  - Project title
  - Description
  - Tech stack (as tags)
  - Key outcomes (as bullet list)
  - Optional external link
- Placeholder entry included
- Consistent border/hover styling with portfolio theme

### 3. Experiments Page (`/experiments`)
**Files:**
- `src/app/experiments/page.tsx` - Landing page
- `src/app/experiments/[slug]/page.tsx` - Individual experiment pages
- `src/content/experiments/*.mdx` - MDX content files

Features:
- Left sidebar navigation listing all experiments
- Sidebar collapses to hamburger on mobile
- MDX content rendering with custom components
- Placeholder experiment: "getting-started-with-mastra.mdx"

### 4. Lessons Page (`/lessons`)
**Files:**
- `src/app/lessons/page.tsx` - Landing page
- `src/app/lessons/[slug]/page.tsx` - Individual lesson pages
- `src/content/lessons/*.mdx` - MDX content files

Features:
- Same layout as experiments page (left nav + content)
- MDX content rendering
- Placeholder lesson: "code-review-best-practices.mdx"

### 5. MDX Infrastructure
**Configuration:** `next.config.ts` - Added MDX support
**Components Created:**
- `src/mdx-components.tsx` - MDX components provider
- `src/components/mdx/code-block.tsx` - Syntax-highlighted code blocks
- `src/components/mdx/callout.tsx` - Styled callouts (info, warning, success, error)
- `src/components/mdx/mdx-image.tsx` - Responsive images
- `src/components/layouts/content-layout.tsx` - Reusable sidebar layout

**Utilities:**
- `src/lib/content-utils.ts` - Helper to read MDX files

**Styling:**
- Added comprehensive prose styles to `globals.css` for MDX content

### 6. Blog Redirect
- `/blog` now redirects to `/experiments`

## Required Dependencies

To complete the setup, install these dependencies:

```bash
pnpm add @next/mdx @mdx-js/loader @mdx-js/react @types/mdx
```

## How to Add New Content

### Adding Work Entries
Edit `src/lib/work-data.ts` and add to the `workEntries` array:

```typescript
{
  id: 'unique-id',
  client: 'Client Name',
  projectTitle: 'Project Title',
  description: 'Detailed description...',
  techStack: ['Next.js', 'TypeScript', ...],
  outcomes: ['Outcome 1', 'Outcome 2', ...],
  link: 'https://example.com', // optional
}
```

### Adding Experiments
Create a new `.mdx` file in `src/content/experiments/`:

```bash
# File: src/content/experiments/my-experiment.mdx
```

The file will automatically appear in the sidebar navigation.

### Adding Lessons
Create a new `.mdx` file in `src/content/lessons/`:

```bash
# File: src/content/lessons/my-lesson.mdx
```

The file will automatically appear in the sidebar navigation.

## MDX Component Usage

### Code Blocks
````mdx
```typescript
const example = "Syntax highlighted code";
```
````

### Callouts
```mdx
<Callout type="info" title="Optional Title">
Your message here
</Callout>
```

Types: `info`, `warning`, `success`, `error`

### Images
```mdx
![Alt text](/path/to/image.png)
```

## Design Consistency

All new pages follow the existing portfolio design:
- Monospace font (IBM Plex Mono)
- Minimalist aesthetic
- Border/hover interactions
- Sharp corners (no border radius)
- Consistent spacing
- Dark mode support

## File Structure

```
src/
├── app/
│   ├── work/
│   │   └── page.tsx
│   ├── experiments/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── lessons/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   └── blog/page.tsx (redirects)
├── components/
│   ├── layouts/
│   │   └── content-layout.tsx
│   ├── mdx/
│   │   ├── code-block.tsx
│   │   ├── callout.tsx
│   │   └── mdx-image.tsx
│   └── sections/
│       └── header.tsx (updated)
├── content/
│   ├── experiments/
│   │   └── getting-started-with-mastra.mdx
│   └── lessons/
│       └── code-review-best-practices.mdx
├── lib/
│   ├── work-data.ts
│   └── content-utils.ts
└── mdx-components.tsx
```

## Known Issues & Fixes

### MDX with Turbopack
**Issue:** Turbopack doesn't fully support MDX loaders yet, causing "Unknown module type" errors.

**Fix:** Removed `--turbopack` flag from dev script in `package.json`. The app now runs with standard webpack.

```json
"dev": "next dev"  // Instead of "next dev --turbopack"
```

## Testing Checklist

- [ ] Install MDX dependencies: `pnpm add @next/mdx @mdx-js/loader @mdx-js/react @types/mdx`
- [ ] **Restart dev server:** Stop and run `pnpm dev` again
- [ ] Navigate to `/work` - verify placeholder work entry displays
- [ ] Navigate to `/experiments` - verify sidebar with 5 placeholder experiments
- [ ] Click on any experiment - verify MDX content renders with syntax highlighting
- [ ] Navigate to `/lessons` - verify sidebar and placeholder content
- [ ] Test mobile menu (hamburger) on all pages
- [ ] Test dark mode on all new pages
- [ ] Verify all header navigation links work correctly

## Placeholder Content Created

### Experiments (5 entries)
1. Getting Started with Mastra
2. Building with Next.js 15
3. AI Agents with OpenAI
4. TypeScript Advanced Patterns
5. PostgreSQL Query Optimization

### Lessons (1 entry)
1. Code Review Best Practices
