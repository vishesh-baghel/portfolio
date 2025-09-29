"use client";

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { CommitsModal } from '@/components/commits/commits-modal';

/**
 * A minimalist header component for the website.
 * It displays the site title "basecase" as a link to the homepage.
 * The styling is consistent with the site's minimalist, monospace-driven design system.
 */
const Header = () => {
  const [openCommits, setOpenCommits] = useState(false);

  // keyboard shortcut: press "c" to open commits
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'c') {
        setOpenCommits(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <header className="mb-20">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="font-mono text-2xl font-bold text-black no-underline hover:no-underline"
        >
          basecase
        </Link>

        {/* Controls */}
        <button
          type="button"
          onClick={() => setOpenCommits(true)}
          className="font-mono text-sm underline text-[var(--color-accent-red)]"
          aria-label="Open commits modal"
        >
          [c] commits
        </button>
      </div>

      {/* Modal */}
      <CommitsModal open={openCommits} onClose={() => setOpenCommits(false)} />
    </header>
  );
};

export default Header;