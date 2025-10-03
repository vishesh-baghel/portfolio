import { ContentLayout } from '@/components/layouts/content-layout';
import { getContentItems } from '@/lib/content-utils';

export default function LessonsPage() {
  const lessons = getContentItems('lessons');

  return (
    <ContentLayout
      title="lessons"
      description="engineering practices learned throughout my career"
      items={lessons}
      basePath="/lessons"
    >
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">lessons</h1>
        <p className="text-muted-foreground">
          Select a lesson from the sidebar to explore engineering practices and insights I've gained throughout my career.
        </p>
        {lessons.length === 0 && (
          <div className="border border-border rounded-lg p-8 text-center">
            <p className="text-muted-foreground">
              No lessons published yet. Check back soon!
            </p>
          </div>
        )}
      </div>
    </ContentLayout>
  );
}
