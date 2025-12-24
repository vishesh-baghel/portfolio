import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { calendlyUrl, email } from '@/lib/site-config';

const ContactSection = () => {
  return (
    <section className="py-6 font-mono">
      <h2 className="text-base sm:text-lg font-bold cursor-default text-text-primary mt-0 mb-3">work together</h2>
      <p className="text-sm sm:text-base mb-4">
        i help founders ship mvps, harden infra, and integrate ai into real products. 
        $500 for 20 hours — enough time to prove i can deliver.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <Link
          href="/pitch"
          className="inline-flex items-center justify-center gap-2 border border-accent-red bg-accent-red text-white px-4 py-2 text-sm font-medium no-underline hover:opacity-90 transition-opacity"
        >
          see full details <ArrowRight className="size-4" />
        </Link>
        <a
          href={calendlyUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 border border-border px-4 py-2 text-sm font-medium no-underline hover:bg-secondary transition-colors"
        >
          book a 15-min intro
        </a>
      </div>

      <p className="text-xs sm:text-sm text-muted-foreground">
        or just{' '}
        <a
          href={`mailto:${email}?subject=${encodeURIComponent('project inquiry')}`}
          className="underline"
        >
          email me
        </a>
        {' '}if you prefer.
      </p>
    </section>
  );
};

export default ContactSection;
