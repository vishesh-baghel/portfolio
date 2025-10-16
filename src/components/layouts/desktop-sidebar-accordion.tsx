'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { ContentCategory } from '@/lib/content-utils';

interface DesktopSidebarAccordionProps {
  categories: ContentCategory[];
  currentSlug?: string;
  basePath: string;
}

export const DesktopSidebarAccordion = ({
  categories,
  currentSlug,
  basePath,
}: DesktopSidebarAccordionProps) => {
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
  );
};
