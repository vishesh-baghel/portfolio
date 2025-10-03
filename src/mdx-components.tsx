import type { MDXComponents } from 'mdx/types';
import { CodeBlock } from '@/components/mdx/code-block';
import { Callout } from '@/components/mdx/callout';
import { MDXImage } from '@/components/mdx/mdx-image';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    pre: CodeBlock,
    img: MDXImage,
    Callout,
  };
}
