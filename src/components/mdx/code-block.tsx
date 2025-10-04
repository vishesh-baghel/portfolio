'use client';

import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBlockProps {
  children?: React.ReactNode;
  className?: string;
}

export function CodeBlock({ children, className, ...props }: CodeBlockProps) {
  // Extract the code string and language from children
  const childArray = React.Children.toArray(children);
  const codeElement = childArray[0];
  
  if (!codeElement || typeof codeElement !== 'object' || !('props' in codeElement)) {
    return <pre className={className} {...props}>{children}</pre>;
  }
  
  const codeProps = codeElement.props as { children?: string; className?: string };
  const codeString = codeProps.children?.trim() || '';
  const match = /language-(\w+)/.exec(codeProps.className || '');
  const language = match ? match[1] : 'text';

  return (
    <div className="my-6 rounded-lg overflow-hidden" style={{ backgroundColor: '#1e1e1e', border: '1px solid #2d2d2d' }}>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          padding: '1rem',
          fontSize: '0.875rem',
          fontFamily: 'var(--font-mono)',
          backgroundColor: '#1e1e1e',
        }}
        showLineNumbers
      >
        {codeString}
      </SyntaxHighlighter>
    </div>
  );
}
