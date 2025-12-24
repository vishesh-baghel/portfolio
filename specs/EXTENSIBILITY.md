# Extensibility Guide

> **Version**: 1.0  
> **Last Updated**: 2024-12-24

---

## Overview

This document provides patterns and guidelines for extending the portfolio with new features, pages, and components.

---

## Adding New Pages

### Step-by-Step

1. **Create Route Directory**
   ```bash
   mkdir -p src/app/new-page
   ```

2. **Create Page Component**
   ```tsx
   // src/app/new-page/page.tsx
   import Header from '@/components/sections/header';
   import Footer from '@/components/sections/footer';

   export const metadata = {
     title: 'New Page | Vishesh Baghel',
     description: 'Description of the new page',
   };

   export default function NewPage() {
     return (
       <div className="min-h-screen bg-background-primary font-mono">
         <div className="max-w-[800px] mx-auto px-4 sm:px-6">
           <Header />
           <main className="space-y-6 sm:space-y-8 mb-20">
             {/* Page content */}
           </main>
           <Footer />
         </div>
       </div>
     );
   }
   ```

3. **Add Navigation** (if needed)
   Edit `src/components/sections/header.tsx`:
   - Add desktop link in the `sm:flex` div
   - Add mobile link in the drawer

---

## Adding New Sections

### Section Template

```tsx
// src/components/sections/new-section.tsx
import React from 'react';

interface NewSectionProps {
  // Define props if needed
}

const NewSection = ({}: NewSectionProps) => {
  return (
    <section className="py-6 font-mono">
      <h2 className="text-base sm:text-lg font-bold cursor-default text-text-primary mt-0 mb-2">
        section title
      </h2>
      
      {/* Section content */}
      <div className="grid gap-3">
        {/* Items */}
      </div>
    </section>
  );
};

export default NewSection;
```

### Adding to Page

```tsx
import NewSection from '@/components/sections/new-section';

// In page component:
<main className="space-y-6">
  <HeroSection />
  <NewSection />  {/* Add here */}
  <AboutSection />
</main>
```

---

## Adding New UI Components

### Component Template

```tsx
// src/components/ui/new-component.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

interface NewComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary";
  size?: "sm" | "md" | "lg";
}

const NewComponent = React.forwardRef<HTMLDivElement, NewComponentProps>(
  ({ className, variant = "default", size = "md", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base styles
          "border border-border font-mono",
          // Variant styles
          variant === "default" && "bg-card",
          variant === "secondary" && "bg-secondary",
          // Size styles
          size === "sm" && "p-2 text-xs",
          size === "md" && "p-3 sm:p-4 text-sm",
          size === "lg" && "p-4 sm:p-6 text-base",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
NewComponent.displayName = "NewComponent";

export { NewComponent };
```

---

## Adding Work Entries

### Data Structure

```ts
// src/lib/work-data.ts
export interface WorkEntry {
  id: string;           // Unique identifier
  client: string;       // Client/company name
  projectTitle: string; // Project name
  description: string;  // What you did
  techStack: string[];  // Technologies used
  outcomes: string[];   // Key results
  link?: string;        // Client website
  logo?: string;        // Path to logo in public/
}
```

### Adding Entry

```ts
export const workEntries: WorkEntry[] = [
  // Existing entries...
  {
    id: 'new-client',
    client: 'New Client Name',
    projectTitle: 'Project Title',
    description: 'Detailed description of the work...',
    techStack: ['Next.js', 'TypeScript', 'PostgreSQL'],
    outcomes: [
      'First outcome',
      'Second outcome',
    ],
    link: 'https://client.com',
    logo: '/clients/new-client.png', // Add image to public/clients/
  },
];
```

---

## Adding Experiments (MDX)

### Create MDX File

```bash
touch src/content/experiments/new-experiment.mdx
```

### Frontmatter Structure

```mdx
---
title: "Experiment Title"
description: "One-line description"
category: "ai-agents"  # or: getting-started, backend-database, typescript-patterns
date: "2024-12-24"
---

# Experiment Title

Content goes here...

## Overview

What this experiment covers...

## Implementation

Code examples and explanations...

## Key Learnings

1. **Learning 1**: Explanation
2. **Learning 2**: Explanation
```

### Categories
- `getting-started`
- `ai-agents`
- `backend-database`
- `typescript-patterns`
- `other`

---

## Adding API Routes

### REST API Template

```ts
// src/app/api/new-route/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const param = searchParams.get('param');
    
    // Business logic
    const data = await fetchData(param);
    
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validation
    if (!body.required) {
      return NextResponse.json(
        { error: 'Missing required field' },
        { status: 400 }
      );
    }
    
    // Business logic
    const result = await processData(body);
    
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
```

---

## Adding Configuration

### Site Config

```ts
// src/lib/site-config.ts
export const newConfigValue = "value";
```

### Environment Variables

1. Add to `.env.example`:
   ```
   NEW_VARIABLE=
   ```

2. Add to `.env`:
   ```
   NEW_VARIABLE=actual_value
   ```

3. Access in code:
   ```ts
   const value = process.env.NEW_VARIABLE;
   ```

---

## Adding Providers

### Context Provider Template

```tsx
// src/components/providers/new-provider.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

interface NewContextType {
  value: string;
  setValue: (value: string) => void;
}

const NewContext = createContext<NewContextType | undefined>(undefined);

export function NewProvider({ children }: { children: ReactNode }) {
  const [value, setValue] = useState('');
  
  return (
    <NewContext.Provider value={{ value, setValue }}>
      {children}
    </NewContext.Provider>
  );
}

export function useNewContext() {
  const context = useContext(NewContext);
  if (context === undefined) {
    throw new Error('useNewContext must be used within a NewProvider');
  }
  return context;
}
```

### Adding to Layout

```tsx
// src/app/layout.tsx
import { NewProvider } from "@/components/providers/new-provider";

// Wrap children:
<ThemeProvider>
  <SearchProvider>
    <NewProvider>
      {children}
    </NewProvider>
  </SearchProvider>
</ThemeProvider>
```

---

## Adding Hooks

### Custom Hook Template

```ts
// src/hooks/use-new-hook.ts
import { useState, useEffect } from 'react';

interface UseNewHookOptions {
  initialValue?: string;
}

interface UseNewHookReturn {
  data: string;
  loading: boolean;
  error: Error | null;
  refresh: () => void;
}

export function useNewHook(options: UseNewHookOptions = {}): UseNewHookReturn {
  const [data, setData] = useState(options.initialValue || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch logic
      const result = await fetch('/api/data');
      const json = await result.json();
      setData(json);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error, refresh: fetchData };
}
```

---

## Testing New Features

### Component Tests

```ts
// __tests__/components/new-component.test.tsx
import { render, screen } from '@testing-library/react';
import { NewComponent } from '@/components/ui/new-component';

describe('NewComponent', () => {
  it('renders correctly', () => {
    render(<NewComponent>Content</NewComponent>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});
```

### Run Tests

```bash
pnpm test
pnpm test:watch  # Watch mode
pnpm test:ui     # UI mode
```

---

## Checklist for New Features

### Before Implementation
- [ ] Review existing patterns in codebase
- [ ] Check if similar component exists
- [ ] Plan data structure if needed
- [ ] Consider mobile responsiveness

### During Implementation
- [ ] Follow naming conventions
- [ ] Use design tokens (not hardcoded colors)
- [ ] Add TypeScript types
- [ ] Include accessibility attributes
- [ ] Make responsive (mobile-first)

### After Implementation
- [ ] Test on mobile and desktop
- [ ] Test dark mode
- [ ] Add to navigation if needed
- [ ] Update this spec if pattern is new
