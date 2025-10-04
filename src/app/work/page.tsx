import React from 'react';
import Header from '@/components/sections/header';
import Footer from '@/components/sections/footer';
import { workEntries } from '@/lib/work-data';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';
// Using native <img> for local static logos to avoid loader issues

export default function WorkPage() {
  return (
    <div className="min-h-screen bg-background-primary font-mono">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6">
        <Header />
        
        <main className="space-y-6 sm:space-y-8 mb-20">
          <div className="space-y-3">
            <h1 className="text-2xl font-bold">client work</h1>
            <p className="text-muted-foreground">
              past projects and collaborations with clients
            </p>
          </div>

          <div className="space-y-6 sm:space-y-8">
            {workEntries.map((work) => (
              <article
                key={work.id}
                className="border border-border rounded-lg p-4 sm:p-6 space-y-2.5 sm:space-y-4 transition-colors"
              >
                {/* Header */}
                <div className="space-y-1">
                  <div className="flex items-center justify-start gap-2.5 sm:gap-4 mb-1.5 sm:mb-2">
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                      {work.logo && (
                        <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center rounded-sm overflow-hidden">
                          <img
                            src={work.logo}
                            loading="lazy"
                            decoding="async"
                            className="object-contain w-full h-full"
                            alt={`${work.client} logo`}
                          />
                        </div>
                      )}
                      <div className="min-w-0 self-center space-y-0.5">
                        <h2 className="text-base sm:text-lg font-semibold leading-tight mt-0 mb-0 truncate">{work.projectTitle}</h2>
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs sm:text-sm text-muted-foreground leading-snug mb-0">{work.client}</p>
                          {work.link && (
                            <Link
                              href={work.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-accent hover:underline"
                              aria-label={`Visit ${work.client}`}
                            >
                              <ExternalLink className="size-3.5 sm:size-4" />
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-[13px] leading-6 sm:text-sm sm:leading-relaxed">{work.description}</p>

                {/* Tech Stack */}
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Tech Stack
                  </h3>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {work.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center rounded-md border border-border px-1.5 py-0.5 text-[11px] sm:px-2 sm:py-1 sm:text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Outcomes */}
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Key Outcomes
                  </h3>
                  <ul className="space-y-1 text-sm">
                    {work.outcomes.map((outcome, idx) => (
                      <li
                        key={idx}
                        className="relative pl-4 before:content-['•'] before:absolute before:left-0 before:text-muted-foreground"
                      >
                        {outcome}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>

          {/* Empty State */}
          {workEntries.length === 0 && (
            <div className="border border-border rounded-lg p-12 text-center text-muted-foreground">
              <p>No work entries yet. Check back soon!</p>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
}
