import fs from 'fs';
import path from 'path';

export interface ContentMetadata {
  title: string;
  slug: string;
  date?: string;
  description?: string;
  category?: string;
}

export interface ContentCategory {
  title: string;
  items: ContentMetadata[];
}

export function getContentItems(contentType: 'experiments'): ContentMetadata[] {
  const contentDir = path.join(process.cwd(), 'src', 'content', contentType);
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(contentDir)) {
    fs.mkdirSync(contentDir, { recursive: true });
    return [];
  }

  const files = fs.readdirSync(contentDir);
  const mdxFiles = files.filter((file) => file.endsWith('.mdx'));

  return mdxFiles.map((filename) => {
    const slug = filename.replace(/\.mdx$/, '');
    // For now, use slug as title - can be enhanced to read frontmatter later
    const title = slug
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    return {
      title,
      slug,
    };
  });
}

export function getCategorizedContent(contentType: 'experiments'): ContentCategory[] {
  const items = getContentItems(contentType);
  
  // Single-pass categorization for better performance
  const categoryMap: Record<string, ContentMetadata[]> = {
    'Getting Started': [],
    'AI & Agents': [],
    'Backend & Database': [],
    'TypeScript & Patterns': [],
  };
  
  // Categorize items in a single pass
  for (const item of items) {
    const slug = item.slug.toLowerCase();
    
    if (slug.includes('mastra') || slug.includes('nextjs')) {
      categoryMap['Getting Started'].push(item);
    } else if (slug.includes('ai') || slug.includes('openai') || slug.includes('agents')) {
      categoryMap['AI & Agents'].push(item);
    } else if (slug.includes('postgresql') || slug.includes('database')) {
      categoryMap['Backend & Database'].push(item);
    } else if (slug.includes('typescript') || slug.includes('patterns')) {
      categoryMap['TypeScript & Patterns'].push(item);
    }
  }
  
  // Return only non-empty categories
  return Object.entries(categoryMap)
    .filter(([_, items]) => items.length > 0)
    .map(([title, items]) => ({ title, items }));
}
