import React from 'react';
import Header from '@/components/sections/header';
import Footer from '@/components/sections/footer';
import { workEntries } from '@/lib/work-data';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function WorkPage() {
  return (
    <div className="min-h-screen bg-background-primary font-mono">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6">
        <Header />
        
        <main className="space-y-8 mb-20">
          <div className="space-y-3">
            <h1 className="text-2xl font-bold">client work</h1>
            <p className="text-muted-foreground">
              past projects and collaborations with clients
            </p>
          </div>

          <div className="space-y-8">
            {workEntries.map((work) => (
              <article
                key={work.id}
                className="border border-border rounded-lg p-6 space-y-4 hover:bg-[var(--color-secondary)] transition-colors"
              >
                {/* Header */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-semibold">{work.projectTitle}</h2>
                      <p className="text-sm text-muted-foreground">{work.client}</p>
                    </div>
                    {work.link && (
                      <Link
                        href={work.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm hover:underline"
                        aria-label="View project"
                      >
                        <ExternalLink className="size-4" />
                      </Link>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm leading-relaxed">{work.description}</p>

                {/* Tech Stack */}
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Tech Stack
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {work.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center rounded-md border border-border px-2 py-1 text-xs"
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
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-muted-foreground">•</span>
                        <span>{outcome}</span>
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
