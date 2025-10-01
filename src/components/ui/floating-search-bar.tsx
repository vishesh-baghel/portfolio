"use client";

import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FloatingSearchBarProps {
  onClick?: () => void;
  className?: string;
}

export function FloatingSearchBar({ onClick, className }: FloatingSearchBarProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        // Positioning
        "fixed bottom-6 left-1/2 -translate-x-1/2 z-30",
        // Glassmorphic styling matching header
        "bg-background supports-[backdrop-filter]:bg-background/80 backdrop-blur",
        // Border and sizing
        "border border-border rounded-lg",
        "h-12 px-4 min-w-[280px] sm:min-w-[320px]",
        // Flex layout
        "flex items-center gap-3",
        // Hover effects
        "hover:bg-[var(--color-secondary)] transition-colors duration-200",
        // Focus styles
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        // Shadow for elevation
        "shadow-lg shadow-black/10",
        className
      )}
      aria-label="Open search"
    >
      <Search className="size-4 text-muted-foreground flex-shrink-0" />
      <span className="font-mono text-sm text-muted-foreground flex-1 text-left">
        Search or ask AI...
      </span>
      <div className="flex items-center gap-1 text-xs text-muted-foreground font-mono">
        <span className="hidden sm:inline">⌘K</span>
        <span className="sm:hidden">Ctrl K</span>
      </div>
    </button>
  );
}
