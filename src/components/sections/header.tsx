"use client";

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { CommitsModal } from '@/components/commits/commits-modal';
import ThemeToggle from '@/components/ui/theme-toggle';
import { useRouter } from 'next/navigation';
import { Linkedin, Github, Code2, Menu } from 'lucide-react';
import { FaXTwitter } from 'react-icons/fa6';
import { twitterUsername, linkedinUrl, githubUsername } from '@/lib/site-config';

/**
 * A minimalist header component for the website.
 * It displays the site title link to the homepage.
 * The styling is consistent with the site's minimalist, monospace-driven design system.
 */
const Header = () => {
  const [openCommits, setOpenCommits] = useState(false);
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Handle body scroll lock for mobile menu
  useEffect(() => {
    if (drawerOpen) {
      document.body.classList.add('mobile-menu-open');
    } else {
      document.body.classList.remove('mobile-menu-open');
    }
    return () => {
      document.body.classList.remove('mobile-menu-open');
    };
  }, [drawerOpen]);

  return (
    <header className="sticky top-0 z-40 mb-10 bg-background supports-[backdrop-filter]:bg-background/80 backdrop-blur">
      <div className="flex h-12 items-center justify-between">
        {/* Left: mobile menu + desktop quick links */}
        <div className="flex items-center gap-3">
          {/* Mobile: menu trigger */}
          <button
            type="button"
            onClick={() => setDrawerOpen(!drawerOpen)}
            className="sm:hidden inline-flex items-center justify-center rounded-lg border h-8 px-3 hover:bg-[var(--color-secondary)]"
            title="Menu"
          >
            <Menu className="size-4" />
          </button>

          {/* Mobile slide-out menu (portal to escape sticky header stacking context) */}
          {drawerOpen && mounted && createPortal(
            <>
              {/* Overlay */}
              <div
                className="fixed inset-0 z-[100] bg-black/50 sm:hidden"
                onClick={() => setDrawerOpen(false)}
              />
              {/* Panel */}
              <div className="fixed left-0 top-0 z-[110] h-full w-64 bg-background sm:hidden border-r border-border shadow-lg animate-in slide-in-from-left duration-200">
                <div className="p-4 space-y-3">
                  <Link
                    href="/"
                    onClick={() => setDrawerOpen(false)}
                    className="flex w-full items-center font-mono text-sm text-foreground rounded-lg border px-3 py-2 hover:bg-[var(--color-secondary)] no-underline"
                  >
                    about
                  </Link>
                  <Link
                    href="/work"
                    onClick={() => setDrawerOpen(false)}
                    className="flex w-full items-center font-mono text-sm text-foreground rounded-lg border px-3 py-2 hover:bg-[var(--color-secondary)] no-underline"
                  >
                    work
                  </Link>
                  <button
                    type="button"
                    onClick={() => { setOpenCommits(true); setDrawerOpen(false); }}
                    className="flex w-full items-center font-mono text-sm text-foreground rounded-lg border px-3 py-2 hover:bg-[var(--color-secondary)] text-left"
                  >
                    commits
                  </button>
                  <Link
                    href="/experiments"
                    onClick={() => setDrawerOpen(false)}
                    className="flex w-full items-center font-mono text-sm text-foreground rounded-lg border px-3 py-2 hover:bg-[var(--color-secondary)] no-underline"
                  >
                    experiments
                  </Link>
                  <button
                    onClick={() => setDrawerOpen(false)}
                    className="block w-full rounded-lg border px-3 py-2 hover:bg-[var(--color-secondary)] text-left"
                  >
                    close
                  </button>
                </div>
              </div>
            </>,
            document.body
          )}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/"
              aria-label="About"
              className="inline-flex items-center justify-center rounded-lg border h-8 px-3 hover:bg-[var(--color-secondary)] no-underline hover:no-underline"
              title="About"
            >
              about
            </Link>
            <Link
              href="/work"
              className="inline-flex items-center justify-center font-mono text-xs text-foreground rounded-lg border h-8 px-3 hover:bg-[var(--color-secondary)] no-underline hover:no-underline"
            >
              work
            </Link>
            <button
              type="button"
              onClick={() => setOpenCommits(true)}
              className="inline-flex items-center justify-center font-mono text-xs text-foreground rounded-lg border h-8 px-3 hover:bg-[var(--color-secondary)]"
              aria-label="Open commits modal"
            >
              commits
            </button>
            <Link
              href="/experiments"
              className="inline-flex items-center justify-center font-mono text-xs text-foreground rounded-lg border h-8 px-3 hover:bg-[var(--color-secondary)] no-underline hover:no-underline"
            >
              experiments
            </Link>
          </div>
        </div>

        {/* Right: socials + theme toggle */}
        <div className="flex h-full items-center gap-2 sm:gap-3">
          <a
            href={`https://github.com/${githubUsername}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-lg border h-8 px-3 hover:bg-[var(--color-secondary)]"
            aria-label="GitHub"
            title="GitHub"
          >
            <Github className="size-4" />
          </a>
          {twitterUsername && (
            <a
              href={`https://x.com/${twitterUsername}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-lg border h-8 px-3 hover:bg-[var(--color-secondary)]"
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
              className="inline-flex items-center justify-center rounded-lg border h-8 px-3 hover:bg-[var(--color-secondary)]"
              aria-label="LinkedIn"
              title="LinkedIn"
            >
              <Linkedin className="size-4" />
            </a>
          )}
          <ThemeToggle />
        </div>
      </div>

      {/* Modal (portal to body to avoid stacking/containing-block issues) */}
      {mounted && createPortal(
        <CommitsModal open={openCommits} onClose={() => setOpenCommits(false)} />,
        document.body
      )}
    </header>
  );
};

export default Header;