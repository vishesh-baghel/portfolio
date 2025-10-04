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

## Recent Updates

### MDX Component Styling Fixes (Latest)
**Feature:** Improved visual styling of MDX components for better readability and consistency.

**Changes:**
- **Code Blocks**: 
  - Background: Charcoal (#1e1e1e) in both light and dark modes
  - Border: Subtle dark gray (#2d2d2d)
  - Inline styles for guaranteed consistency across themes
- **Inline Code**:
  - Added charcoal background (#1e1e1e) for inline code snippets
  - Light gray text (#d4d4d4) for readability
  - Consistent with code block styling
- **Callout Components**:
  - Reduced padding: `px-3 py-2.5` (was `p-4`) for more compact appearance
  - Fixed icon alignment: Added `mt-[3px]` for precise vertical alignment with text
  - Reduced margins: `my-4` instead of `my-6`
  - Tighter spacing: `gap-2.5` between icon and text
  - Smaller text: `text-[15px]` with `leading-normal`
  - Border width: 2px for better visibility
- **Mobile Sidebar**:
  - Removed redundant "SEARCH" label above search input
  - Cleaner, more minimal appearance

**Files Updated:**
- `src/components/mdx/code-block.tsx` - Charcoal background with inline styles
- `src/components/mdx/callout.tsx` - Compact sizing and precise alignment
- `src/mdx-components.tsx` - Added inline code styling
- `src/components/layouts/content-layout.tsx` - Removed search label

### Unified Sidebar Navigation
**Feature:** Consolidated all navigation into a single sidebar, removing duplicate mobile menu.

**Changes:**
- **Single Sidebar**: Merged all navigation into the content sidebar
  - Mobile: About link and search now at top of sidebar
  - Desktop: About and search remain in header
  - Removed separate mobile menu panel
  - Removed "close" and "toggle sidebar" buttons
- **Clean Mobile UX**: 
  - Single hamburger button opens main sidebar
  - Click overlay to close (no close button needed)
  - All options (about, search, categories) in one place
  - No more confusion with multiple sidebars

### Search & Navigation Improvements
**Feature:** Added search functionality and improved navigation UX.

**Changes:**
- **Search Bar**: Added content search in header (desktop) and sidebar (mobile)
  - Simple keyword search across all experiments/lessons
  - Results grouped by category
  - Click-outside to close dropdown
  - Instant filtering as you type
- **Sidebar Hover**: Removed background color change, only text color changes
  - Categories: hover changes to accent color
  - Items: hover changes from muted to foreground color
  - Active item: shown in accent color
- **Auto-redirect**: Landing on `/experiments` or `/lessons` redirects to first item
  - No more empty landing page
  - Shows first experiment/lesson immediately

**Files Created/Updated:**
- `src/components/ui/content-search.tsx` - New search component
- `src/components/sections/content-header.tsx` - Simplified to toggle single sidebar
- `src/components/layouts/content-layout.tsx` - Added about/search to sidebar top
- `src/app/experiments/page.tsx` - Auto-redirect to first experiment
- `src/app/lessons/page.tsx` - Auto-redirect to first lesson

### Simplified Content Header
**Feature:** Created a dedicated simplified header for experiments/lessons pages to avoid navigation clutter.

**Changes:**
- New `ContentHeader` component with minimal navigation
- Desktop: Shows about link, search, and theme toggle
- Mobile: Hamburger menu with about, search, and sidebar toggle
- Clean separation from main site navigation

### Categorized Sidebar Navigation
**Feature:** Implemented accordion-style sidebar with collapsible categories, similar to documentation sites.

**Changes:**
- Added `getCategorizedContent()` function to automatically organize content by categories
- Sidebar now has collapsible sections with chevron indicators
- Experiments are categorized into:
  - Getting Started (Mastra, Next.js)
  - AI & Agents (OpenAI, AI agents)
  - Backend & Database (PostgreSQL)
  - TypeScript & Patterns
- All categories expanded by default for easy navigation

**Files Updated:**
- `src/lib/content-utils.ts` - Added category support
- `src/components/layouts/content-layout.tsx` - New accordion navigation
- All experiment and lesson pages updated to use categories

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
