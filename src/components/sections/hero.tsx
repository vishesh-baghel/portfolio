import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

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
        <span className="text-accent-red font-semibold">open for consulting</span> — i help founders ship their first mvp or upgrade vibe-coded prototypes into production-ready products.
      </p>
      <Link
        href="/pitch"
        className="inline-flex items-center gap-2 text-sm text-accent-red no-underline hover:underline"
      >
        learn more about working together <ArrowRight className="size-4" />
      </Link>
    </div>
  );
};

export default HeroSection;