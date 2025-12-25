"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { trackCTAClick } from '@/lib/analytics';

const HeroSection = () => {
  return (
    <div className="py-5 space-y-4">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 cursor-default">
        <span className="inline-block">
          <span className="whitespace-pre-wrap">
            Hi, i'm vishesh
          </span>
        </span>
      </h1>
      <p className="text-sm sm:text-base">
        i build agents, infra, and tools for developers. i contribute to frameworks i rely on and ship pragmatic ai products.
      </p>
      <p className="text-sm sm:text-base">
        <span className="text-accent-red font-semibold">taking on clients.</span> $500 for your mvp. 20 hours. if it's subpar, walk away.
      </p>
      <Link
        href="/pitch"
        onClick={() => trackCTAClick('see_how_it_works', 'hero')}
        className="inline-flex items-center justify-center gap-2 border border-accent-red bg-accent-red text-white px-4 py-2 text-sm font-medium no-underline hover:opacity-90 transition-opacity"
      >
        see how it works <ArrowRight className="size-4" />
      </Link>
    </div>
  );
};

export default HeroSection;