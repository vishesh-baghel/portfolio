import { ContentLayout } from '@/components/layouts/content-layout';
import { getContentItems, getCategorizedContent } from '@/lib/content-utils';
import { notFound } from 'next/navigation';

interface ExperimentPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const experiments = getContentItems('experiments');
  return experiments.map((exp) => ({
    slug: exp.slug,
  }));
}

export default async function ExperimentPage({ params }: ExperimentPageProps) {
  const { slug } = await params;
  const categories = getCategorizedContent('experiments');
  
  // Verify experiment exists
  const experimentExists = categories.some(cat => 
    cat.items.some(item => item.slug === slug)
  );

  if (!experimentExists) {
    notFound();
  }

  // Import MDX content - this must be done with a direct import, not dynamic()
  // Dynamic imports should be at module level, not inside components
  let Content;
  try {
    // Use require to dynamically load the MDX at build/runtime
    Content = (await import(`@/content/experiments/${slug}.mdx`)).default;
  } catch (error) {
    notFound();
  }

  return (
    <ContentLayout
      title="experiments"
      description="technical deep-dives into tools & frameworks"
      categories={categories}
      currentSlug={slug}
      basePath="/experiments"
    >
      <Content />
    </ContentLayout>
  );
}
