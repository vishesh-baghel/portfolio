import { getCategorizedContent } from '@/lib/content-utils';
import { redirect } from 'next/navigation';

export default function ExperimentsPage() {
  const categories = getCategorizedContent('experiments');
  
  // Redirect to first experiment if available
  if (categories.length > 0 && categories[0].items.length > 0) {
    const firstExperiment = categories[0].items[0];
    redirect(`/experiments/${firstExperiment.slug}`);
  }
  
  // Fallback if no experiments exist
  redirect('/');
}
