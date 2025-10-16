import dynamic from 'next/dynamic';
import Link from 'next/link';
import { DesktopSidebar } from '@/components/layouts/desktop-sidebar';
import { MobileSidebar } from '@/components/layouts/mobile-sidebar';
import type { ContentCategory } from '@/lib/content-utils';

// Lazy load non-critical components
const ContentSearch = dynamic(
  () => import('@/components/ui/content-search').then(mod => ({ default: mod.ContentSearch }))
);

const ThemeToggle = dynamic(
  () => import('@/components/ui/theme-toggle')
);

const McpBanner = dynamic(
  () => import('@/components/ui/mcp-banner').then(mod => ({ default: mod.McpBanner }))
);

const OnThisPage = dynamic(
  () => import('@/components/ui/on-this-page').then(mod => ({ default: mod.OnThisPage }))
);

const Footer = dynamic(
  () => import('@/components/sections/footer')
);

interface ContentLayoutServerProps {
  title: string;
  description: string;
  categories: ContentCategory[];
  currentSlug?: string;
  basePath: string;
  children: React.ReactNode;
}

/**
 * Optimized server-side content layout with minimal client JavaScript
 * Mobile sidebar and desktop accordion are the only client components needed for interactivity
 */
export const ContentLayoutServer = ({
  title,
  description,
  categories,
  currentSlug,
  basePath,
  children,
}: ContentLayoutServerProps) => {
  return (
    <div className="min-h-screen bg-background-primary font-mono">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="sticky top-0 z-40 mb-10 bg-background supports-[backdrop-filter]:bg-background/80 backdrop-blur">
          <div className="flex h-12 items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Mobile sidebar toggle */}
              <MobileSidebar
                categories={categories}
                currentSlug={currentSlug}
                basePath={basePath}
                title={title}
                description={description}
              />

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

            {/* Right: search and theme toggle */}
            <div className="flex h-full items-center gap-3 xl:w-[19rem]">
              <div className="hidden lg:block">
                <ContentSearch categories={categories} basePath={basePath} />
              </div>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <div className="mb-20 flex flex-col lg:grid lg:grid-cols-[16rem_minmax(0,1fr)_19rem] lg:gap-6">
          {/* Desktop Sidebar */}
          <DesktopSidebar
            categories={categories}
            currentSlug={currentSlug}
            basePath={basePath}
            title={title}
            description={description}
          />
          
          {/* Main content */}
          <main className="min-w-0 lg:col-start-2 lg:col-end-3">
            <article className="min-w-0 prose !max-w-full dark:prose-invert">
              {children}
            </article>
          </main>

          {/* Right sidebar - desktop only */}
          <aside className="hidden xl:block lg:col-start-3 lg:col-end-4">
            <McpBanner />
            <div className="sticky top-24 mt-6">
              <OnThisPage />
            </div>
          </aside>
        </div>

        <Footer />
      </div>
    </div>
  );
};
