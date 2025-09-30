"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowUp } from 'lucide-react';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="mx-auto px-0 py-0 font-mono">
      {/* Quick links removed as requested */}

      {/* Divider */}
      <div className="my-6 h-px bg-border" />

      {/* Bottom row */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>© {year} vishesh baghel • built with next.js and deployed on vercel</span>
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="inline-flex items-center justify-center gap-1 rounded-lg border h-8 px-3 hover:bg-[var(--color-secondary)]"
          aria-label="Back to top"
        >
          <ArrowUp className="size-3.5" /> top
        </button>
      </div>
    </footer>
  );
};

export default Footer;