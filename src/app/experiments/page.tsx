import { ContentLayout } from '@/components/layouts/content-layout';
import { getContentItems } from '@/lib/content-utils';

export default function ExperimentsPage() {
  const experiments = getContentItems('experiments');

  return (
    <ContentLayout
      title="experiments"
      description="technical deep-dives into tools & frameworks"
      items={experiments}
      basePath="/experiments"
    >
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">experiments</h1>
        <p className="text-muted-foreground">
          Select an experiment from the sidebar to view detailed technical explanations about the tools and frameworks I've explored.
        </p>
        {experiments.length === 0 && (
          <div className="border border-border rounded-lg p-8 text-center">
            <p className="text-muted-foreground">
              No experiments published yet. Check back soon!
            </p>
          </div>
        )}
      </div>
    </ContentLayout>
  );
}
