'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronRight, Menu } from 'lucide-react';
import type { ContentCategory } from '@/lib/content-utils';

interface MobileSidebarProps {
  categories: ContentCategory[];
  currentSlug?: string;
  basePath: string;
  title: string;
  description: string;
}

export const MobileSidebar = ({
  categories,
  currentSlug,
  basePath,
  title,
  description,
}: MobileSidebarProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(categories.map(cat => cat.title))
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
      {/* Toggle Button */}
      <button
        type="button"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden inline-flex items-center justify-center rounded-lg border h-8 px-3 hover:bg-[var(--color-secondary)]"
        title="Menu"
        aria-label="Toggle menu"
      >
        <Menu className="size-4" />
      </button>

      {/* Mobile Sidebar */}
      <aside
        className={`
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:hidden
          fixed left-0 top-0 h-full
          w-72 flex-shrink-0
          bg-background
          border-r border-border
          z-40
          transition-transform duration-300 ease-in-out
          overflow-y-auto
          pt-20
          px-4
        `}
      >
        <div className="space-y-4 pb-8">
          <div className="space-y-3 pb-4 border-b border-border">
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
            {categories.map((category) => (
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
            ))}
          </nav>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
        />
      )}
    </>
  );
};
