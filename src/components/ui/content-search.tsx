'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { Search, X } from 'lucide-react';
import type { ContentCategory } from '@/lib/content-utils';

interface ContentSearchProps {
  categories: ContentCategory[];
  basePath: string;
}

export function ContentSearch({ categories, basePath }: ContentSearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Memoize filtered items to avoid recalculation on every render
  const filteredItems = useMemo(() => {
    const lowerQuery = query.toLowerCase();
    return categories.flatMap(category =>
      category.items
        .filter(item =>
          item.title.toLowerCase().includes(lowerQuery) ||
          item.slug.toLowerCase().includes(lowerQuery)
        )
        .map(item => ({ ...item, category: category.title }))
    );
  }, [query, categories]);

  return (
    <div ref={searchRef} className="relative">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="w-full sm:w-64 h-8 pl-9 pr-8 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 hover:text-foreground text-muted-foreground"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && query && (
        <div className="absolute top-full mt-2 w-full sm:w-80 bg-background border border-border rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
          {filteredItems.length > 0 ? (
            <div className="p-2 space-y-1">
              {filteredItems.map((item) => (
                <Link
                  key={item.slug}
                  href={`${basePath}/${item.slug}`}
                  onClick={() => {
                    setQuery('');
                    setIsOpen(false);
                  }}
                  className="block px-3 py-2 rounded-lg hover:bg-[var(--color-secondary)] transition-colors"
                >
                  <div className="text-sm font-medium">{item.title}</div>
                  <div className="text-xs text-muted-foreground">{item.category}</div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-4 text-sm text-center text-muted-foreground">
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
