"use client";

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { CommitsModal } from '@/components/commits/commits-modal';
import ThemeToggle from '@/components/ui/theme-toggle';
import { useRouter } from 'next/navigation';
import { Linkedin, Github, Code2, Menu } from 'lucide-react';
import { FaXTwitter } from 'react-icons/fa6';
import { twitterUsername, linkedinUrl, githubUsername } from '@/lib/site-config';

/**
 * A minimalist header component for the website.
 * It displays the site title "basecase" as a link to the homepage.
 * The styling is consistent with the site's minimalist, monospace-driven design system.
 */
const Header = () => {
  const [openCommits, setOpenCommits] = useState(false);
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);

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
            aria-label="Toggle menu"
            title="Menu"
          >
            <Menu className="size-4" />
          </button>

          {/* Mobile slide-out menu */}
          {drawerOpen && (
            <>
              {/* Overlay */}
              <div
                className="fixed inset-0 bg-black/50 z-40 sm:hidden"
                onClick={() => setDrawerOpen(false)}
              />
              {/* Menu panel */}
              <div className="fixed left-0 top-0 h-full w-64 bg-background border-r border-border z-50 sm:hidden animate-in slide-in-from-left duration-200">
                <div className="p-4 space-y-3">
                  <Link
                    href="/"
                    onClick={() => setDrawerOpen(false)}
                    className="flex w-full items-center rounded-lg border px-3 py-2 hover:bg-[var(--color-secondary)] no-underline"
                  >
                    <Code2 className="size-4 mr-2" /> home
                  </Link>
                  <button
                    type="button"
                    onClick={() => { setOpenCommits(true); setDrawerOpen(false); }}
                    className="flex w-full items-center font-mono text-sm text-foreground rounded-lg border px-3 py-2 hover:bg-[var(--color-secondary)] text-left"
                  >
                    [c] commits
                  </button>
                  <Link
                    href="/blog"
                    onClick={() => setDrawerOpen(false)}
                    className="flex w-full items-center font-mono text-sm text-foreground rounded-lg border px-3 py-2 hover:bg-[var(--color-secondary)] no-underline"
                  >
                    [b] blog
                  </Link>
                  <button 
                    onClick={() => setDrawerOpen(false)}
                    className="block w-full rounded-lg border px-3 py-2 hover:bg-[var(--color-secondary)] text-left"
                  >
                    close
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Desktop: inline quick links */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/"
              aria-label="Home"
              className="inline-flex items-center justify-center rounded-lg border h-8 px-3 hover:bg-[var(--color-secondary)] no-underline hover:no-underline"
              title="Home"
            >
              <Code2 className="size-4" />
            </Link>
            <button
              type="button"
              onClick={() => setOpenCommits(true)}
              className="inline-flex items-center justify-center font-mono text-xs text-foreground rounded-lg border h-8 px-3 hover:bg-[var(--color-secondary)]"
              aria-label="Open commits modal"
            >
              [c] commits
            </button>

            <Link
              href="/blog"
              className="inline-flex items-center justify-center font-mono text-xs text-foreground rounded-lg border h-8 px-3 hover:bg-[var(--color-secondary)] no-underline hover:no-underline"
            >
              [b] blog
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

      {/* Modal */}
      <CommitsModal open={openCommits} onClose={() => setOpenCommits(false)} />
    </header>
  );
};

export default Header;