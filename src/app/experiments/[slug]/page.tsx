import { ContentLayout } from '@/components/layouts/content-layout';
import { getContentItems } from '@/lib/content-utils';
import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';

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
  const experiments = getContentItems('experiments');
  const currentExperiment = experiments.find((exp) => exp.slug === slug);

  if (!currentExperiment) {
    notFound();
  }

  // Dynamically import the MDX content
  let Content;
  try {
    Content = dynamic(() => import(`@/content/experiments/${slug}.mdx`));
  } catch (error) {
    notFound();
  }

  return (
    <ContentLayout
      title="experiments"
      description="technical deep-dives into tools & frameworks"
      items={experiments}
      currentSlug={slug}
      basePath="/experiments"
    >
      <Content />
    </ContentLayout>
  );
}
