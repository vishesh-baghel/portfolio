'use client';

import { useState, createContext, useContext } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { ContentCategory } from '@/lib/content-utils';

// Context for sidebar state
const SidebarContext = createContext<{
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
} | null>(null);

const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within SidebarProvider');
  }
  return context;
};

// Provider component
export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  return (
    <SidebarContext.Provider value={{ sidebarOpen, setSidebarOpen }}>
      {children}
    </SidebarContext.Provider>
  );
};

// Toggle button component
export const SidebarToggle = () => {
  const { setSidebarOpen } = useSidebar();
  
  return (
    <button
      type="button"
      onClick={() => setSidebarOpen(true)}
      className="lg:hidden inline-flex items-center justify-center rounded-lg border h-8 px-3 hover:bg-[var(--color-secondary)]"
      title="Menu"
      aria-label="Toggle menu"
    >
      <svg
        className="size-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </button>
  );
};

interface SidebarClientProps {
  categories: ContentCategory[];
  currentSlug?: string;
  basePath: string;
  title: string;
  description: string;
}

// Main sidebar component
export const SidebarClient = ({
  categories,
  currentSlug,
  basePath,
  title,
  description,
}: SidebarClientProps) => {
  const { sidebarOpen, setSidebarOpen } = useSidebar();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(categories.map(cat => cat.title)) // All expanded by default
  );

  const toggleCategory = (categoryTitle: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(categoryTitle)) {
        next.delete(categoryTitle);
      } else {
        next.add(categoryTitle);
      }
      return next;
    });
  };

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
          fixed lg:sticky lg:top-20 lg:self-start
          left-0 top-0 h-full lg:h-auto
          w-72 lg:w-64 flex-shrink-0
          bg-background lg:bg-transparent
          border-r lg:border-r-0 border-border
          z-40 lg:z-auto
          transition-transform duration-300 ease-in-out
          overflow-y-auto
          pt-20 lg:pt-0
          px-4 lg:px-0
        `}
      >
        <div className="space-y-4 pb-8">
          {/* Mobile only: About link */}
          <div className="lg:hidden space-y-3 pb-4 border-b border-border">
            <Link
              href="/"
              onClick={() => setSidebarOpen(false)}
              className="flex w-full items-center font-mono text-sm text-foreground rounded-lg border px-3 py-2 hover:bg-[var(--color-secondary)] no-underline"
            >
              about
            </Link>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>

          <nav className="space-y-2">
            {categories.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">No content yet</p>
            ) : (
              categories.map((category) => (
                <div key={category.title} className="space-y-1">
                  <button
                    onClick={() => toggleCategory(category.title)}
                    className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm font-medium text-foreground hover:text-accent transition-colors"
                  >
                    {expandedCategories.has(category.title) ? (
                      <ChevronDown className="size-4" />
                    ) : (
                      <ChevronRight className="size-4" />
                    )}
                    <span>{category.title}</span>
                  </button>

                  {expandedCategories.has(category.title) && (
                    <div className="ml-6 space-y-1">
                      {category.items.map((item) => (
                        <Link
                          key={item.slug}
                          href={`${basePath}/${item.slug}`}
                          onClick={() => setSidebarOpen(false)}
                          className={`
                            block px-3 py-2 text-sm transition-colors
                            ${currentSlug === item.slug 
                              ? 'font-medium text-accent' 
                              : 'text-muted-foreground hover:text-foreground'
                            }
                          `}
                        >
                          {item.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </nav>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
        />
      )}
    </>
  );
};
