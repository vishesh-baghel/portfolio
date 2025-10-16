import Link from 'next/link';
import dynamic from 'next/dynamic';
import { SidebarToggle } from '@/components/layouts/sidebar-client';
import type { ContentCategory } from '@/lib/content-utils';

// Lazy load client components
const ContentSearch = dynamic(
  () => import('@/components/ui/content-search').then(mod => ({ default: mod.ContentSearch }))
);

const ThemeToggle = dynamic(
  () => import('@/components/ui/theme-toggle')
);

interface ContentHeaderServerProps {
  categories: ContentCategory[];
  basePath: string;
}

/**
 * Server-side header for content pages with lazy-loaded client components
 */
export const ContentHeaderServer = ({ 
  categories, 
  basePath,
}: ContentHeaderServerProps) => {
  return (
    <header className="sticky top-0 z-40 mb-10 bg-background supports-[backdrop-filter]:bg-background/80 backdrop-blur">
      <div className="flex h-12 items-center justify-between">
        {/* Left: mobile hamburger + desktop about link */}
        <div className="flex items-center gap-3">
          {/* Mobile: hamburger for sidebar */}
          <SidebarToggle />

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
        <div className="flex h-full items-center gap-3 xl:w-[19rem]">
          <div className="hidden lg:block">
            <ContentSearch categories={categories} basePath={basePath} />
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};
