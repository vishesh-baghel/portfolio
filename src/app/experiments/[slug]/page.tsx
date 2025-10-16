import { ContentLayoutServer } from '@/components/layouts/content-layout-server';
import { getContentItems, getCategorizedContent } from '@/lib/content-utils';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

interface ExperimentPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const experiments = getContentItems('experiments');
  return experiments.map((exp) => ({
    slug: exp.slug,
  }));
}

export async function generateMetadata({ params }: ExperimentPageProps): Promise<Metadata> {
  const { slug } = await params;
  const experiments = getContentItems('experiments');
  const experiment = experiments.find(exp => exp.slug === slug);
  
  if (!experiment) {
    return {
      title: 'Experiment Not Found',
    };
  }
  
  return {
    title: `${experiment.title} | Vishesh Baghel`,
    description: experiment.description || `Technical deep-dive: ${experiment.title}`,
  };
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
    <ContentLayoutServer
      title="experiments"
      description="technical deep-dives into tools & frameworks"
      categories={categories}
      currentSlug={slug}
      basePath="/experiments"
    >
      <Content />
    </ContentLayoutServer>
  );
}
