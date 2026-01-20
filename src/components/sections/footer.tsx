"use client";

import React from 'react';
import Link from 'next/link';
import { Github, Linkedin } from 'lucide-react';
import { FaXTwitter } from 'react-icons/fa6';
import { twitterUsername, linkedinUrl, githubUsername } from '@/lib/site-config';
import { trackSocialClick } from '@/lib/analytics';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="mx-auto px-0 py-0 font-mono">
      {/* Divider */}
      <div className="my-6 h-px bg-border" />

      {/* Footer content - stacked on mobile, row on larger screens */}
      <div className="flex flex-col-reverse items-center gap-4 sm:flex-row sm:justify-between text-sm text-muted-foreground">
        <span>© {year} vishesh baghel</span>

        {/* Social links - minimal style */}
        <div className="flex items-center gap-4">
          <a
            href={`https://github.com/${githubUsername}`}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackSocialClick('github')}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="GitHub"
          >
            <Github className="size-4" />
          </a>
          {twitterUsername && (
            <a
              href={`https://x.com/${twitterUsername}`}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackSocialClick('twitter')}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="X (Twitter)"
            >
              <FaXTwitter className="size-4" />
            </a>
          )}
          {linkedinUrl && (
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackSocialClick('linkedin')}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="size-4" />
            </a>
          )}
          <span className="text-border">|</span>
          <Link href="/llms.txt" className="text-muted-foreground hover:text-foreground no-underline transition-colors">
            llms.txt
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;