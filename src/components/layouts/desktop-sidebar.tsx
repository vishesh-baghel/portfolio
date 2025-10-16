import { DesktopSidebarAccordion } from '@/components/layouts/desktop-sidebar-accordion';
import type { ContentCategory } from '@/lib/content-utils';

interface DesktopSidebarProps {
  categories: ContentCategory[];
  currentSlug?: string;
  basePath: string;
  title: string;
  description: string;
}

export const DesktopSidebar = ({
  categories,
  currentSlug,
  basePath,
  title,
  description,
}: DesktopSidebarProps) => {
  return (
    <aside className="hidden lg:block lg:sticky lg:top-20 lg:self-start w-64 flex-shrink-0">
      <div className="space-y-4 pb-8">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>

        <DesktopSidebarAccordion
          categories={categories}
          currentSlug={currentSlug}
          basePath={basePath}
        />
      </div>
    </aside>
  );
};
