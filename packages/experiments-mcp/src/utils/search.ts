import type { ExperimentContent, ExperimentListItem, SearchResult } from '../types.js';

/**
 * Search experiments by keywords and rank by relevance
 * Following Mastra's pattern of semantic search with relevance scoring
 */
export function searchExperiments(
  experiments: ExperimentListItem[],
  contentsMap: Map<string, ExperimentContent>,
  query: string,
  maxResults: number = 5
): SearchResult[] {
  const terms = query.toLowerCase().split(/\s+/).filter(t => t.length > 0);
  
  if (terms.length === 0) {
    return [];
  }

  const scored = experiments.map(exp => {
    const content = contentsMap.get(exp.slug);
    const text = content ? content.content.toLowerCase() : '';
    const tags = exp.tags?.join(' ').toLowerCase() || '';
    const title = exp.title.toLowerCase();
    const description = exp.description?.toLowerCase() || '';
    
    let score = 0;
    const matched: string[] = [];
    
    for (const term of terms) {
      // Title match: highest score (10 points)
      if (title.includes(term)) {
        score += 10;
        if (!matched.includes(term)) matched.push(term);
      }
      
      // Tag match: high score (5 points)
      if (tags.includes(term)) {
        score += 5;
        if (!matched.includes(term)) matched.push(term);
      }
      
      // Description match: medium score (3 points)
      if (description.includes(term)) {
        score += 3;
        if (!matched.includes(term)) matched.push(term);
      }
      
      // Category match: medium score (3 points)
      if (exp.category.toLowerCase().includes(term)) {
        score += 3;
        if (!matched.includes(term)) matched.push(term);
      }
      
      // Content match: low score (1 point)
      if (text.includes(term)) {
        score += 1;
        if (!matched.includes(term)) matched.push(term);
      }
    }
    
    // Boost score if multiple terms match
    if (matched.length > 1) {
      score += matched.length * 2;
    }
    
    // Calculate relevance percentage (normalized to 0-100)
    const maxPossibleScore = terms.length * 10; // All terms in title
    const relevance = Math.min(100, Math.round((score / maxPossibleScore) * 100));
    
    // Find excerpt with matched terms
    const excerpt = findExcerpt(text || description || title, matched[0] || terms[0]);
    
    return {
      slug: exp.slug,
      title: exp.title,
      relevance,
      matchedTerms: matched,
      excerpt,
    };
  });
  
  // Filter out zero-relevance results and sort by relevance
  return scored
    .filter(s => s.relevance > 0)
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, maxResults);
}

/**
 * Find an excerpt from content that shows the matched term in context
 */
function findExcerpt(content: string, term: string, contextLength: number = 150): string {
  const index = content.toLowerCase().indexOf(term.toLowerCase());
  
  if (index === -1) {
    // Term not found, return start of content
    return content.slice(0, contextLength).trim() + '...';
  }
  
  // Get context around the term
  const start = Math.max(0, index - contextLength / 2);
  const end = Math.min(content.length, index + contextLength / 2);
  
  let excerpt = content.slice(start, end).trim();
  
  // Add ellipsis if we're not at the start/end
  if (start > 0) excerpt = '...' + excerpt;
  if (end < content.length) excerpt = excerpt + '...';
  
  return excerpt;
}

/**
 * Highlight matched terms in text (for better readability)
 */
export function highlightTerms(text: string, terms: string[]): string {
  let highlighted = text;
  
  for (const term of terms) {
    const regex = new RegExp(`(${escapeRegex(term)})`, 'gi');
    highlighted = highlighted.replace(regex, '**$1**');
  }
  
  return highlighted;
}

/**
 * Escape special regex characters
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
