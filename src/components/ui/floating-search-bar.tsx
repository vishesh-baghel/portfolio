"use client";

import { useEffect, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { QUIRKY_PLACEHOLDERS } from '@/lib/searchPlaceholders';

interface FloatingSearchBarProps {
  onClick?: () => void;
  className?: string;
}

export function FloatingSearchBar({ onClick, className }: FloatingSearchBarProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    const tick = () => setCurrentIndex((i) => (i + 1) % QUIRKY_PLACEHOLDERS.length);
    intervalRef.current = window.setInterval(tick, 10000);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    // Lightweight platform detection for displaying keyboard hint
    const ua = navigator.userAgent || "";
    const platform = (navigator as any).platform || "";
    const mac = /Mac|Macintosh|MacIntel|MacPPC|Mac68K/i.test(platform) || /Mac OS X/i.test(ua);
    setIsMac(mac);
  }, []);

  return (
    <>
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
        // Fixed widths for stable UX
        "h-12 px-4 w-[320px] sm:w-[420px]",
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
      {/* Simple, no-transition placeholder line with truncation */}
      <div className="flex-1 h-[1.4rem] overflow-hidden">
        <div className="whitespace-nowrap truncate font-mono text-sm text-muted-foreground text-left relative top-[2px]">
          {QUIRKY_PLACEHOLDERS[currentIndex]}
        </div>
      </div>
      <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground font-mono">
        <span>{isMac ? 'Cmd K' : 'Ctrl K'}</span>
      </div>
    </button>
    {/* No transitions; simple 10s text swap */}
    </>
  );
}
