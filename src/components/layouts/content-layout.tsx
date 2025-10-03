'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import Header from '@/components/sections/header';
import Footer from '@/components/sections/footer';

export interface ContentItem {
  title: string;
  slug: string;
}

interface ContentLayoutProps {
  title: string;
  description: string;
  items: ContentItem[];
  currentSlug?: string;
  basePath: string;
  children: React.ReactNode;
}

export function ContentLayout({
  title,
  description,
  items,
  currentSlug,
  basePath,
  children,
}: ContentLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background-primary font-mono">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <Header />

        {/* Mobile sidebar toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden mb-4 inline-flex items-center justify-center rounded-lg border h-10 px-4 hover:bg-[var(--color-secondary)]"
        >
          {sidebarOpen ? <X className="size-4 mr-2" /> : <Menu className="size-4 mr-2" />}
          {sidebarOpen ? 'Close' : 'Menu'}
        </button>

        <div className="flex gap-8 mb-20">
          {/* Sidebar */}
          <aside
            className={`
              ${sidebarOpen ? 'block' : 'hidden'} lg:block
              w-full lg:w-64 flex-shrink-0
              lg:sticky lg:top-20 lg:self-start
            `}
          >
            <div className="space-y-4 pb-8 lg:pb-0">
              <div className="space-y-2">
                <h2 className="text-lg font-semibold">{title}</h2>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>

              <nav className="space-y-1">
                {items.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">No content yet</p>
                ) : (
                  items.map((item) => (
                    <Link
                      key={item.slug}
                      href={`${basePath}/${item.slug}`}
                      onClick={() => setSidebarOpen(false)}
                      className={`
                        block rounded-lg border px-3 py-2 text-sm hover:bg-[var(--color-secondary)] transition-colors
                        ${currentSlug === item.slug ? 'bg-[var(--color-secondary)] font-medium' : ''}
                      `}
                    >
                      {item.title}
                    </Link>
                  ))
                )}
              </nav>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            <article className="prose prose-sm sm:prose lg:prose-lg max-w-none dark:prose-invert">
              {children}
            </article>
          </main>
        </div>

        <Footer />
      </div>
    </div>
  );
}
