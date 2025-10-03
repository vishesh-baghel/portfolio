import fs from 'fs';
import path from 'path';

export interface ContentMetadata {
  title: string;
  slug: string;
  date?: string;
  description?: string;
}

export function getContentItems(contentType: 'experiments' | 'lessons'): ContentMetadata[] {
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
