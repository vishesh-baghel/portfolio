# Styling Specification

> **Version**: 1.0  
> **Last Updated**: 2024-12-24

---

## Overview

The portfolio uses TailwindCSS 4 with a custom design system. All styling follows a minimalist, monospace-driven aesthetic with sharp edges and high contrast.

---

## Design Principles

1. **Minimalist**: Remove unnecessary decoration
2. **Monospace**: IBM Plex Mono everywhere
3. **Sharp**: 0px border-radius on all elements
4. **High Contrast**: Black text on cream, red accents
5. **Responsive**: Mobile-first with sm: breakpoint

---

## CSS Architecture

### File Location
`src/app/globals.css`

### Structure
```css
@import "tailwindcss";
@import "tw-animate-css";
@custom-variant dark (&:is(.dark *));

@theme {
  /* Design tokens */
}

@layer base {
  /* Element defaults */
}

@layer utilities {
  /* Custom utilities */
}
```

---

## Design Tokens

### Theme Configuration
Tokens are defined in `@theme` block and mapped to CSS variables in `:root`.

### Color Palette

#### Light Mode
```css
--color-background: #FAF8F6;      /* Cream white */
--color-foreground: #000000;       /* Pure black */
--color-accent-red: #FF0000;       /* Red accent */
--color-border: #E0E0E0;           /* Light gray */
--color-muted-foreground: #666666; /* Medium gray */
--color-secondary: #E0E0E0;        /* Hover backgrounds */
```

#### Dark Mode
```css
--color-background: #0f0f0f;       /* Near black */
--color-foreground: #faf8f6;       /* Cream white */
--color-accent-red: #ff4d4d;       /* Lighter red */
--color-border: #2a2a2a;           /* Dark gray */
--color-muted-foreground: #a3a3a3; /* Light gray */
--color-secondary: #1f1f1f;        /* Hover backgrounds */
```

### Typography Scale
```css
--font-primary: var(--font-ibm-plex-mono), monospace;

/* Sizes */
h1: 32px (2.25em)
h2: 24px (1.5em)
h3: 18px (1.25em)
body: 16px
small: 14px
```

### Spacing Scale
```css
/* Padding */
Body desktop: 60px 40px
Body mobile: 40px 24px
Section: py-6 (24px)
Card: p-3 sm:p-4 (12px/16px)

/* Margins */
Paragraph: mb-24px
List item: mb-12px
Heading: mb-16-24px
```

### Border Radius
```css
--radius-lg: 0px;
--radius-md: 0px;
--radius-sm: 0px;
```

---

## Tailwind Classes

### Layout
```css
.container: max-w-800px mx-auto
.two-column-layout: grid grid-cols-2 gap-60px
```

### Text Colors
```css
text-text-primary      /* Main text */
text-text-secondary    /* Muted text */
text-muted-foreground  /* Shadcn compat */
text-accent-red        /* Links, accents */
```

### Background Colors
```css
bg-background-primary  /* Page background */
bg-card               /* Card background */
bg-card/60            /* Semi-transparent card */
bg-secondary          /* Hover states */
```

### Borders
```css
border-border          /* Standard border */
border-border-divider  /* Divider lines */
```

### Interactive States
```css
hover:bg-[var(--color-secondary)]
hover:bg-card
transition-colors
disabled:opacity-50
```

---

## Responsive Breakpoints

| Breakpoint | Width | Usage |
|------------|-------|-------|
| Default | 0px+ | Mobile styles |
| sm: | 640px+ | Tablet/desktop adjustments |
| md: | 768px+ | Larger layouts (grid columns) |

### Common Patterns
```css
/* Text sizing */
text-xs sm:text-sm
text-sm sm:text-base
text-base sm:text-lg
text-2xl sm:text-3xl

/* Padding */
p-3 sm:p-4
px-4 sm:px-6

/* Spacing */
gap-2 sm:gap-3
space-y-6 sm:space-y-8
```

---

## Component Styling Patterns

### Section Block
```css
section.py-6.font-mono
  h2.text-base.sm:text-lg.font-bold.cursor-default.text-text-primary.mt-0.mb-2
  /* content */
```

### Card
```css
article.border.border-border.bg-card/60.hover:bg-card.transition-colors.p-3.sm:p-4
  header.mb-1.flex.items-center.gap-2
    a.underline.text-accent-red.text-sm.sm:text-base
  p.text-xs.sm:text-sm
```

### Button
```css
button.inline-flex.items-center.justify-center.rounded-lg.border.h-8.px-3.hover:bg-[var(--color-secondary)]
```

### Navigation Link
```css
Link.inline-flex.items-center.justify-center.font-mono.text-xs.text-foreground.rounded-lg.border.h-8.px-3.hover:bg-[var(--color-secondary)].no-underline.hover:no-underline
```

---

## Dark Mode

### Implementation
Uses `next-themes` with class strategy:

```tsx
<ThemeProvider attribute="class" defaultTheme="system" enableSystem={true}>
```

### CSS Override Pattern
```css
.dark {
  --color-background: #0f0f0f;
  /* ... other overrides */
}
```

### Component Dark Styles
Use `dark:` prefix or rely on CSS variable inheritance:
```css
/* Automatic via variables */
bg-background  /* Uses --color-background */

/* Explicit override */
dark:bg-gray-900
```

---

## Prose Styling (MDX)

### Class Application
```tsx
<div className="prose">
  {/* MDX content */}
</div>
```

### Prose Customizations
- Max width: 65ch
- Color: text-primary
- Links: accent-red with underline
- Code: secondary background
- Blockquotes: left border, italic

### Prose Variants
```css
.prose-sm  /* 0.875rem base */
.prose-lg  /* 1.125rem base */
```

---

## Animation

### Built-in Animations
```css
--animate-accordion-down
--animate-accordion-up
```

### Transitions
```css
transition-colors      /* Color changes */
animate-in            /* Enter animations */
slide-in-from-left    /* Slide animations */
duration-200          /* Animation duration */
```

---

## Scrollbar Styling

### Webkit
```css
*::-webkit-scrollbar { width: 10px; }
*::-webkit-scrollbar-thumb { 
  background-color: var(--color-border);
  border-radius: 8px;
}
```

### Firefox
```css
* {
  scrollbar-width: thin;
  scrollbar-color: var(--color-border) transparent;
}
```

---

## Best Practices

### DO
- Use design tokens via CSS variables
- Follow responsive patterns (mobile-first)
- Use `cn()` utility for class merging
- Keep components consistent with established patterns
- Use semantic color names (accent-red, not red-500)

### DON'T
- Use arbitrary color values
- Add border-radius (design is sharp)
- Use different fonts
- Create inline styles
- Override global styles in components
