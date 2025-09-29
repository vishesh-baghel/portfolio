"use client";

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { CommitsModal } from '@/components/commits/commits-modal';
import ThemeToggle from '@/components/ui/theme-toggle';
import { useRouter } from 'next/navigation';
import { Linkedin } from 'lucide-react';
import { FaXTwitter } from 'react-icons/fa6';
import { twitterUsername, linkedinUrl } from '@/lib/site-config';

/**
 * A minimalist header component for the website.
 * It displays the site title "basecase" as a link to the homepage.
 * The styling is consistent with the site's minimalist, monospace-driven design system.
 */
const Header = () => {
  const [openCommits, setOpenCommits] = useState(false);
  const router = useRouter();

  // keyboard shortcut: press "c" to open commits
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'c') {
        setOpenCommits(true);
      }
      if (e.key.toLowerCase() === 'b') {
        router.push('/blog');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <header className="mb-20">
      <div className="flex items-center justify-between">
        {/* Left: logo and quick links */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="font-mono text-2xl font-bold text-foreground no-underline hover:no-underline"
          >
            basecase
          </Link>

          <button
            type="button"
            onClick={() => setOpenCommits(true)}
            className="font-mono text-xs text-foreground no-underline rounded-md border px-3 py-1 hover:bg-[var(--color-secondary)]"
            aria-label="Open commits modal"
          >
            [c] commits
          </button>

          <Link
            href="/blog"
            className="font-mono text-xs text-foreground no-underline rounded-md border px-3 py-1 hover:bg-[var(--color-secondary)]"
          >
            [b] blog
          </Link>
        </div>

        {/* Right: socials + theme toggle */}
        <div className="flex items-center gap-2">
          {twitterUsername && (
            <a
              href={`https://x.com/${twitterUsername}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center size-8 rounded-md border hover:bg-[var(--color-secondary)]"
              aria-label="X (Twitter)"
              title="X"
            >
              <FaXTwitter className="size-4" />
            </a>
          )}
          {linkedinUrl && (
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center size-8 rounded-md border hover:bg-[var(--color-secondary)]"
              aria-label="LinkedIn"
              title="LinkedIn"
            >
              <Linkedin className="size-4" />
            </a>
          )}
          <ThemeToggle />
        </div>
      </div>

      {/* Modal */}
      <CommitsModal open={openCommits} onClose={() => setOpenCommits(false)} />
    </header>
  );
};

export default Header;