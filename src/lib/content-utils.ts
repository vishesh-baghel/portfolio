import fs from 'fs';
import path from 'path';
import { cache } from 'react';
import matter from 'gray-matter';

export interface ContentMetadata {
  title: string;
  slug: string;
  date?: string;
  description?: string;
  category?: string;
}

export interface ContentCategory {
  title: string;
  slug: string;
  items: ContentMetadata[];
}

// Cache wrapper to prevent redundant filesystem reads within a single request
export const getCategorizedContent = cache((contentType: 'experiments'): ContentCategory[] => {
  const contentDir = path.join(process.cwd(), 'src', 'content', contentType);
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(contentDir)) {
    return [];
  }

  const files = fs.readdirSync(contentDir);
  const mdxFiles = files.filter((file) => file.endsWith('.mdx'));
  
  // Read all MDX files and categorize based on frontmatter
  const categoryMap: Record<string, ContentMetadata[]> = {};
  
  for (const filename of mdxFiles) {
    const slug = filename.replace(/\.mdx$/, '');
    const filePath = path.join(contentDir, filename);
    
    try {
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(fileContents);
      
      const item: ContentMetadata = {
        title: data.title || slug.split('-').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
        slug,
        description: data.description,
        date: data.date,
        category: data.category,
      };
      
      // Categorize based on frontmatter category field
      const categoryKey = data.category || 'other';
      if (!categoryMap[categoryKey]) {
        categoryMap[categoryKey] = [];
      }
      categoryMap[categoryKey].push(item);
    } catch {
      // Skip files that can't be parsed
      continue;
    }
  }
  
  // Convert to array and sort
  const categories: ContentCategory[] = Object.entries(categoryMap).map(([categorySlug, items]) => {
    // Sort items by date (newest first)
    items.sort((a, b) => {
      if (!a.date || !b.date) return 0;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    
    // Convert category slug to title
    const categoryTitle = categorySlug
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    return {
      title: categoryTitle,
      slug: categorySlug,
      items,
    };
  });
  
  return categories;
});

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
