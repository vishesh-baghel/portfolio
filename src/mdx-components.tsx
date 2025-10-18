import { useMDXComponents as getThemeComponents } from 'nextra-theme-docs';
import { Callout } from '@/components/mdx/callout';
import { GitHubButton } from '@/components/mdx/github-button';

// Get Nextra theme components (includes wrapper, toc, code blocks, etc.)
const themeComponents = getThemeComponents();

export function useMDXComponents(components?: any) {
  return {
    ...themeComponents,
    ...components,
    // Custom components
    Callout,
    GitHubButton,
  };
}
