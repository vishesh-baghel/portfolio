# Components Specification

> **Version**: 1.0  
> **Last Updated**: 2024-12-24

---

## Overview

Components are organized into logical directories based on their purpose and reusability level.

---

## Directory Structure

```
src/components/
├── commits/           # Git commits modal
├── layouts/           # Page layout wrappers
├── mdx/              # MDX rendering components
├── providers/        # React context providers
├── sections/         # Homepage & page sections
└── ui/               # Reusable UI primitives
```

---

## Section Components

Located in `src/components/sections/`. These are page-level building blocks.

### Header (`header.tsx`)
**Purpose**: Main navigation header with mobile drawer

**Features**:
- Sticky positioning with backdrop blur
- Mobile hamburger menu with slide-out drawer
- Desktop navigation links
- Social icons (GitHub, X, LinkedIn)
- Theme toggle
- Commits modal trigger

**Props**: None (uses site-config)

**Usage**:
```tsx
import Header from '@/components/sections/header';
<Header />
```

### Hero (`hero.tsx`)
**Purpose**: Main heading and tagline

**Content**:
- Name heading: "Hi, i'm vishesh"
- Tagline about building agents and tools

**Styling**: `py-5`, text sizes 2xl-3xl for heading

### About (`about.tsx`)
**Purpose**: Brief personal introduction

**Content**: TypeScript developer, agent/vector systems focus, freelance mention

### Skills (`skills.tsx`)
**Purpose**: Technical skills listing

**Format**: Grid with category labels (core, frontend, backend, etc.)

**Styling**: `grid gap-2 text-xs sm:text-sm`

### Current Work (`current-work.tsx`)
**Purpose**: Showcase noteworthy projects

**Data Structure**:
```ts
const items = [
  { title: string, href: string, desc: string }
];
```

**Card Pattern**: Border, hover effect, external link

### Open Source (`open-source.tsx`)
**Purpose**: Live GitHub PR feed

**Features**:
- Fetches from `/api/prs` endpoint
- Pagination (prev/next)
- Refresh button
- Loading/error states
- PR state badges (open/merged/closed)

**Client Component**: Uses `useEffect`, `useState`

### Contact (`contact.tsx`)
**Purpose**: Call-to-action for collaboration

**Links**:
- Email with prefilled subject
- Cal.com booking link

### Footer (`footer.tsx`)
**Purpose**: Page footer with copyright and utilities

**Features**:
- Copyright with dynamic year
- llms.txt link
- "Back to top" button

**Client Component**: Uses `onClick` for scroll

### Testimonial (`testimonial.tsx`)
**Purpose**: Display client testimonials (reserved for future use)

---

## UI Components

Located in `src/components/ui/`. Built on Radix UI primitives with shadcn patterns.

### Core Utilities

#### `utils.ts` Pattern
```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### Button (`button.tsx`)
**Variants**: default, destructive, outline, secondary, ghost, link
**Sizes**: default, sm, lg, icon

```tsx
import { Button } from '@/components/ui/button';
<Button variant="outline" size="sm">Click</Button>
```

### Card (`card.tsx`)
**Parts**: Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter

```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

### Dialog (`dialog.tsx`)
**Parts**: Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription

### Badge (`badge.tsx`)
**Variants**: default, secondary, destructive, outline

### Input (`input.tsx`)
Standard text input with consistent styling.

### Separator (`separator.tsx`)
Horizontal or vertical divider line.

### Tabs (`tabs.tsx`)
**Parts**: Tabs, TabsList, TabsTrigger, TabsContent

### Accordion (`accordion.tsx`)
Expandable content sections.

### Tooltip (`tooltip.tsx`)
Hover-triggered information popover.

---

## Search Components

### Portfolio Search (`portfolio-search.tsx`)
Wrapper that renders search on homepage only.

### Search Modal (`search-modal.tsx`)
Full search experience with keyboard navigation.

**Features**:
- Cmd+K trigger
- Fuzzy search across content
- Category filtering
- Keyboard navigation

### Floating Search Bar (`floating-search-bar.tsx`)
Fixed-position search trigger button.

---

## Provider Components

### Search Provider (`providers/search-provider.tsx`)
Context for global search state management.

### Theme Provider
Uses `next-themes` ThemeProvider in root layout.

---

## MDX Components

### Custom Components (`mdx/`)
Custom rendering for MDX content:
- Code blocks with syntax highlighting
- Custom callouts
- Styled headings
- Image handling

---

## Component Patterns

### Responsive Text Sizes
```tsx
className="text-xs sm:text-sm"      // Small text
className="text-sm sm:text-base"    // Body text
className="text-base sm:text-lg"    // Headings
className="text-2xl sm:text-3xl"    // Hero
```

### Interactive States
```tsx
className="hover:bg-[var(--color-secondary)]"
className="hover:bg-card transition-colors"
className="disabled:opacity-50"
```

### Link Styling
```tsx
className="underline text-accent-red"
className="no-underline hover:no-underline"  // Remove default
```

### Card Pattern
```tsx
className="border border-border bg-card/60 hover:bg-card transition-colors p-3 sm:p-4"
```

### Button Pattern
```tsx
className="inline-flex items-center justify-center rounded-lg border h-8 px-3 hover:bg-[var(--color-secondary)]"
```

---

## Creating New Components

### Section Component Template
```tsx
import React from 'react';

const NewSection = () => {
  return (
    <section className="py-6 font-mono">
      <h2 className="text-base sm:text-lg font-bold cursor-default text-text-primary mt-0 mb-2">
        section title
      </h2>
      {/* Content */}
    </section>
  );
};

export default NewSection;
```

### UI Component Template
```tsx
import * as React from "react";
import { cn } from "@/lib/utils";

interface ComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary";
}

const Component = React.forwardRef<HTMLDivElement, ComponentProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "base-classes",
          variant === "secondary" && "secondary-classes",
          className
        )}
        {...props}
      />
    );
  }
);
Component.displayName = "Component";

export { Component };
```

---

## Accessibility Guidelines

### Required Attributes
- `aria-label` on icon-only buttons
- `tabIndex={0}` on interactive non-button elements
- `role` attributes where semantic HTML isn't sufficient

### Focus Management
- Visible focus rings using `ring` utilities
- Focus trap in modals
- Skip-to-content link (if needed)

### Motion
- Respect `prefers-reduced-motion`
- Use `transition-colors` for subtle effects
