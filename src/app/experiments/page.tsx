import { getCategorizedContent } from '@/lib/content-utils';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Header from '@/components/sections/header';
import Footer from '@/components/sections/footer';

export const metadata = {
  title: 'Experiments',
  description: 'Technical deep-dives into tools & frameworks',
};

export default function ExperimentsPage() {
  const categories = getCategorizedContent('experiments');

  return (
    <div className="min-h-screen bg-background-primary font-mono">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6">
        <Header />
        
        <main className="space-y-16">
          <section className="space-y-4">
            <h1 className="text-3xl font-bold">
              Experiments
            </h1>
            <p className="text-base text-muted-foreground">
              Technical deep-dives into modern tools, frameworks, and patterns. 
              Each experiment is a production-ready integration pattern tested in real-world scenarios.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold">What You'll Find Here</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="border border-border p-6">
                <h3 className="text-lg font-semibold mb-0">Real-World Patterns</h3>
                <p className="text-muted-foreground m-0">
                  Production-tested integration patterns with actual code from OSS contributions
                </p>
              </div>
              <div className="border border-border p-6">
                <h3 className="text-lg font-semibold mb-0">Architecture Decisions</h3>
                <p className="text-muted-foreground m-0">
                  Deep-dives into trade-offs, performance metrics, and design choices
                </p>
              </div>
              <div className="border border-border p-6">
                <h3 className="text-lg font-semibold mb-0">Production Lessons</h3>
                <p className="text-muted-foreground m-0">
                  Real lessons from deploying and maintaining these solutions at scale
                </p>
              </div>
              <div className="border border-border p-6">
                <h3 className="text-lg font-semibold mb-0">Complete Examples</h3>
                <p className="text-muted-foreground m-0">
                  Full implementation details with code snippets and best practices
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold">Explore by Category</h2>
            <div className="space-y-4">
              {categories.map((category) => {
                const firstItem = category.items[0];
                if (!firstItem) return null;
                
                return (
                  <div key={category.slug} className="space-y-2">
                    <h3 className="text-lg font-semibold">{category.title}</h3>
                    <Link
                      href={`/experiments/${firstItem.slug}`}
                      className="block border border-border p-4 transition-colors hover:border-accent group no-underline"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="font-medium group-hover:text-accent transition-colors no-underline mb-0">
                            {firstItem.title}
                          </h4>
                          {firstItem.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2 no-underline m-0">
                              {firstItem.description}
                            </p>
                          )}
                        </div>
                        <ArrowRight className="size-5 text-muted-foreground group-hover:text-accent transition-colors shrink-0" />
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </section>
        </main>
        
        <Footer />
      </div>
    </div>
  );
}
