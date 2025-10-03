import { ContentLayout } from '@/components/layouts/content-layout';
import { getContentItems } from '@/lib/content-utils';
import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';

interface LessonPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const lessons = getContentItems('lessons');
  return lessons.map((lesson) => ({
    slug: lesson.slug,
  }));
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { slug } = await params;
  const lessons = getContentItems('lessons');
  const currentLesson = lessons.find((lesson) => lesson.slug === slug);

  if (!currentLesson) {
    notFound();
  }

  // Dynamically import the MDX content
  let Content;
  try {
    Content = dynamic(() => import(`@/content/lessons/${slug}.mdx`));
  } catch (error) {
    notFound();
  }

  return (
    <ContentLayout
      title="lessons"
      description="engineering practices learned throughout my career"
      items={lessons}
      currentSlug={slug}
      basePath="/lessons"
    >
      <Content />
    </ContentLayout>
  );
}
