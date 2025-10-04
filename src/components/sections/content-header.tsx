'use client';

import Link from 'next/link';
import React from 'react';
import ThemeToggle from '@/components/ui/theme-toggle';
import { ContentSearch } from '@/components/ui/content-search';
import { Menu } from 'lucide-react';
import type { ContentCategory } from '@/lib/content-utils';

interface ContentHeaderProps {
  onSidebarToggle: () => void;
  categories: ContentCategory[];
  basePath: string;
}

/**
 * Simplified header for content pages (experiments, lessons)
 * Desktop: Shows about link, search, and theme toggle
 * Mobile: Shows hamburger to toggle sidebar
 */
export function ContentHeader({ onSidebarToggle, categories, basePath }: ContentHeaderProps) {
  return (
    <header className="sticky top-0 z-40 mb-10 bg-background supports-[backdrop-filter]:bg-background/80 backdrop-blur">
      <div className="flex h-12 items-center justify-between">
        {/* Left: mobile hamburger + desktop about link */}
        <div className="flex items-center gap-3">
          {/* Mobile: hamburger for sidebar */}
          <button
            type="button"
            onClick={onSidebarToggle}
            className="lg:hidden inline-flex items-center justify-center rounded-lg border h-8 px-3 hover:bg-[var(--color-secondary)]"
            title="Menu"
          >
            <Menu className="size-4" />
          </button>

          {/* Desktop: About link */}
          <Link
            href="/"
            aria-label="About"
            className="hidden lg:inline-flex items-center justify-center rounded-lg border h-8 px-3 hover:bg-[var(--color-secondary)] no-underline hover:no-underline"
            title="About"
          >
            about
          </Link>
        </div>

        {/* Right: search (desktop only) and theme toggle */}
        <div className="flex h-full items-center gap-2 sm:gap-3">
          <div className="hidden lg:block">
            <ContentSearch categories={categories} basePath={basePath} />
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
