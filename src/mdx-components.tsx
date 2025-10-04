import type { MDXComponents } from 'mdx/types';
import { CodeBlock } from '@/components/mdx/code-block';
import { Callout } from '@/components/mdx/callout';
import { MDXImage } from '@/components/mdx/mdx-image';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    pre: CodeBlock,
    code: (props: any) => {
      // Inline code (not inside a pre tag)
      return (
        <code
          className="px-1.5 py-0.5 rounded text-sm font-mono"
          style={{ backgroundColor: '#1e1e1e', color: '#d4d4d4' }}
          {...props}
        />
      );
    },
    img: MDXImage,
    Callout,
  };
}
