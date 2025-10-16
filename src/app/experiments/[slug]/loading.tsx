export default function Loading() {
  return (
    <div className="min-h-screen bg-background-primary font-mono">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Skeleton */}
        <header className="sticky top-0 z-40 mb-10 bg-background">
          <div className="flex h-12 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-16 bg-border rounded-lg animate-pulse" />
              <div className="hidden lg:block h-8 w-20 bg-border rounded-lg animate-pulse" />
            </div>
            <div className="flex gap-3">
              <div className="hidden lg:block h-8 w-64 bg-border rounded-lg animate-pulse" />
              <div className="h-8 w-8 bg-border rounded-lg animate-pulse" />
            </div>
          </div>
        </header>

        <div className="mb-20 flex flex-col lg:grid lg:grid-cols-[16rem_minmax(0,1fr)_19rem] lg:gap-6">
          {/* Sidebar Skeleton */}
          <aside className="hidden lg:block lg:sticky lg:top-20 lg:self-start w-64 flex-shrink-0">
            <div className="space-y-4">
              <div>
                <div className="h-6 w-32 bg-border rounded animate-pulse mb-2" />
                <div className="h-4 w-full bg-border rounded animate-pulse" />
              </div>
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i}>
                    <div className="h-8 w-full bg-border rounded animate-pulse mb-1" />
                    <div className="ml-6 space-y-1">
                      <div className="h-6 w-3/4 bg-border rounded animate-pulse" />
                      <div className="h-6 w-2/3 bg-border rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content Skeleton */}
          <main className="min-w-0 lg:col-start-2 lg:col-end-3">
            <article className="space-y-4">
              <div className="h-10 w-3/4 bg-border rounded animate-pulse" />
              <div className="h-4 w-full bg-border rounded animate-pulse" />
              <div className="h-4 w-full bg-border rounded animate-pulse" />
              <div className="h-4 w-5/6 bg-border rounded animate-pulse" />
              <div className="h-32 w-full bg-border rounded animate-pulse mt-8" />
              <div className="h-4 w-full bg-border rounded animate-pulse" />
              <div className="h-4 w-4/5 bg-border rounded animate-pulse" />
            </article>
          </main>

          {/* Right Sidebar Skeleton */}
          <aside className="hidden xl:block lg:col-start-3 lg:col-end-4">
            <div className="h-32 w-full bg-border rounded animate-pulse" />
            <div className="mt-6 space-y-2">
              <div className="h-4 w-3/4 bg-border rounded animate-pulse" />
              <div className="h-4 w-2/3 bg-border rounded animate-pulse" />
              <div className="h-4 w-1/2 bg-border rounded animate-pulse" />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
