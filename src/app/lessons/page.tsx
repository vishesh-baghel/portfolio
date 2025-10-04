import { getCategorizedContent } from '@/lib/content-utils';
import { redirect } from 'next/navigation';

export default function LessonsPage() {
  const categories = getCategorizedContent('lessons');
  
  // Redirect to first lesson if available
  if (categories.length > 0 && categories[0].items.length > 0) {
    const firstLesson = categories[0].items[0];
    redirect(`/lessons/${firstLesson.slug}`);
  }
  
  // Fallback if no lessons exist
  redirect('/');
}
