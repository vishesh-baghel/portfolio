'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { ContentHeader } from '@/components/sections/content-header';
import { ContentSearch } from '@/components/ui/content-search';
import { McpBanner } from '@/components/ui/mcp-banner';
import { OnThisPage } from '@/components/ui/on-this-page';
import Footer from '@/components/sections/footer';
import type { ContentCategory } from '@/lib/content-utils';

interface ContentLayoutProps {
  title: string;
  description: string;
  categories: ContentCategory[];
  currentSlug?: string;
  basePath: string;
  children: React.ReactNode;
}

export function ContentLayout({
  title,
  description,
  categories,
  currentSlug,
  basePath,
  children,
}: ContentLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
    <div className="min-h-screen bg-background-primary font-mono">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8">
        <ContentHeader 
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          categories={categories}
          basePath={basePath}
        />

        <div className="mb-20 flex flex-col lg:grid lg:grid-cols-[16rem_minmax(0,1fr)_19rem] lg:gap-6">
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
              {/* Mobile only: About link and Search */}
              <div className="lg:hidden space-y-3 pb-4 border-b border-border">
                <Link
                  href="/"
                  onClick={() => setSidebarOpen(false)}
                  className="flex w-full items-center font-mono text-sm text-foreground rounded-lg border px-3 py-2 hover:bg-[var(--color-secondary)] no-underline"
                >
                  about
                </Link>
                
                <ContentSearch categories={categories} basePath={basePath} />
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

          {/* Main content + right sidebar (grid columns on lg+) */}
          <main className="min-w-0 lg:col-start-2 lg:col-end-3">
            {/* Article content */}
            <article className="min-w-0 prose !max-w-full dark:prose-invert">
              {children}
            </article>
          </main>

          {/* Right sidebar with MCP Banner and On This Page - desktop only */}
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
}
