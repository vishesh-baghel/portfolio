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
  
  return [
    {
      title: 'Getting Started',
      items: items.filter(item => 
        item.slug.includes('mastra') || item.slug.includes('nextjs')
      ),
    },
    {
      title: 'AI & Agents',
      items: items.filter(item => 
        item.slug.includes('ai') || item.slug.includes('openai') || item.slug.includes('agents')
      ),
    },
    {
      title: 'Backend & Database',
      items: items.filter(item => 
        item.slug.includes('postgresql') || item.slug.includes('database')
      ),
    },
    {
      title: 'TypeScript & Patterns',
      items: items.filter(item => 
        item.slug.includes('typescript') || item.slug.includes('patterns')
      ),
    },
  ].filter(category => category.items.length > 0);
}
