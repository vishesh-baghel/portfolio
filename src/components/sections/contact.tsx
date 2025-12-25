"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { calendlyUrl, email } from '@/lib/site-config';
import { trackBookCallClick, trackEmailClick, trackSeeDetailsClick } from '@/lib/analytics';

const ContactSection = () => {
  return (
    <section className="py-6 font-mono">
      <h2 className="text-base sm:text-lg font-bold cursor-default text-text-primary mt-0 mb-3">ready to ship?</h2>
      <p className="text-sm sm:text-base mb-4">
        20 hours. $500. you'll know if i'm worth keeping around. 
        no sales pitch — just a conversation about what you're building.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <a
          href={calendlyUrl}
          target="_blank"
          rel="noreferrer"
          onClick={() => trackBookCallClick('contact')}
          className="inline-flex items-center justify-center gap-2 border border-accent-red bg-accent-red text-white px-4 py-2 text-sm font-medium no-underline hover:opacity-90 transition-opacity"
        >
          book a 15-min call <ArrowRight className="size-4" />
        </a>
        <Link
          href="/pitch"
          onClick={() => trackSeeDetailsClick('contact')}
          className="inline-flex items-center justify-center gap-2 border border-border px-4 py-2 text-sm font-medium no-underline hover:bg-secondary transition-colors"
        >
          see full details
        </Link>
      </div>

      <p className="text-xs sm:text-sm text-muted-foreground">
        or{' '}
        <a
          href={`mailto:${email}?subject=${encodeURIComponent('project inquiry')}`}
          onClick={() => trackEmailClick('contact')}
          className="underline"
        >
          email me
        </a>
        {' '}if you prefer async.
      </p>
    </section>
  );
};

export default ContactSection;
