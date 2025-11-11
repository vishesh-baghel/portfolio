import type { MDXComponents } from 'mdx/types';
import { CodeBlock } from '@/components/mdx/code-block';
import { Callout } from '@/components/mdx/callout';
import { MDXImage } from '@/components/mdx/mdx-image';
import { GitHubButton } from '@/components/mdx/github-button';
import { LiveDemoButton } from '@/components/mdx/live-demo-button';
import { InlineCode } from '@/components/mdx/inline-code';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    pre: CodeBlock,
    code: InlineCode,
    img: MDXImage,
    Callout,
    GitHubButton,
    LiveDemoButton,
    // Ensure consistent paragraph rendering
    p: (props: any) => <p className="text-base" {...props} />,
    // Ensure consistent list rendering
    ul: (props: any) => <ul className="text-base" {...props} />,
    ol: (props: any) => <ol className="text-base" {...props} />,
    li: (props: any) => <li className="text-base" {...props} />,
  };
}
